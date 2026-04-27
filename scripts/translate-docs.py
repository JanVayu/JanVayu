#!/usr/bin/env python3
"""Translate JanVayu docs from English to Hindi/Bengali/Marathi/Tamil using Sarvam.

Sarvam's chat-completions API is used (OpenAI-compatible) because:
- Sarvam's models are trained for Indian languages and outperform generic LLMs
  on Hindi/Bengali/Marathi/Tamil.
- Chat completions handles full Markdown documents in one shot, unlike the
  /translate endpoint which has a small per-request character limit.

Modes (via $MODE):
  sync     — only translate English files that changed in the most recent push.
  backfill — translate every English file whose translation is missing or older
             than the English source (by git author date).

Triggered by .github/workflows/translations.yml. Commits the result with the
translation bot identity.
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
EN_DIR = REPO_ROOT / "docs"
LANGS = {
    "hi": "Hindi (हिन्दी)",
    "bn": "Bengali (বাংলা)",
    "mr": "Marathi (मराठी)",
    "ta": "Tamil (தமிழ்)",
}
TRANSLATE_EXTENSIONS = {".md"}

API_URL = "https://api.sarvam.ai/v1/chat/completions"
MODEL = "sarvam-m"
MAX_TOKENS = 8192
TEMPERATURE = 0.2

PROMPT_TEMPLATE = """You are translating JanVayu's air quality accountability documentation from English into {lang_name}. JanVayu is India's independent, citizen-led air quality platform.

TRANSLATION RULES:
1. Translate naturally for fluent native readers — not word-for-word.
2. Keep ALL Markdown structure intact: headings, lists, tables, code blocks, links, image references, HTML tags, frontmatter.
3. Preserve link targets exactly (e.g. `[text](path/to/file.md)` — translate `text` only).
4. Keep these in English: product names (JanVayu, Supabase, Netlify, Sarvam, GitHub, NCAP, WAQI, CPCB, Docsify), technical identifiers (variable names, API endpoints, file paths, env vars), units (µg/m³, ppm), and all numbers/dates/code.
5. Pollutant names (PM2.5, PM10, NO2, SO2, O3, CO) stay as-is.
6. Use respectful, neutral, journalistic tone. JanVayu is non-partisan in mission.
7. If the source file has YAML frontmatter, translate values but keep keys in English.
8. Output ONLY the translated Markdown. No preamble, no explanation, no code fences wrapping the whole document.

ENGLISH SOURCE FILE: {rel_path}

---
{content}
"""


def run(cmd: list[str]) -> str:
    return subprocess.check_output(cmd, cwd=REPO_ROOT, text=True).strip()


def english_files() -> list[Path]:
    return [p for p in EN_DIR.rglob("*") if p.is_file() and p.suffix in TRANSLATE_EXTENSIONS]


def git_unix_time(path: Path) -> int:
    try:
        ts = run(["git", "log", "-1", "--format=%at", "--", str(path.relative_to(REPO_ROOT))])
        return int(ts) if ts else 0
    except (subprocess.CalledProcessError, ValueError):
        return 0


def changed_english_files_since_previous_commit() -> list[Path]:
    try:
        diff = run(["git", "diff", "--name-only", "HEAD~1", "HEAD", "--", "docs/"])
    except subprocess.CalledProcessError:
        return []
    files = []
    for line in diff.splitlines():
        if not line:
            continue
        p = REPO_ROOT / line
        if p.exists() and p.suffix in TRANSLATE_EXTENSIONS and p.is_relative_to(EN_DIR):
            files.append(p)
    return files


def target_path(en_path: Path, lang: str) -> Path:
    rel = en_path.relative_to(EN_DIR)
    return REPO_ROOT / f"docs-{lang}" / rel


def is_stale(en_path: Path, lang: str) -> bool:
    tgt = target_path(en_path, lang)
    if not tgt.exists():
        return True
    return git_unix_time(en_path) > git_unix_time(tgt)


def translate(api_key: str, content: str, lang: str, rel_path: str) -> str:
    payload = {
        "model": MODEL,
        "max_tokens": MAX_TOKENS,
        "temperature": TEMPERATURE,
        "messages": [
            {
                "role": "user",
                "content": PROMPT_TEMPLATE.format(
                    lang_name=LANGS[lang],
                    rel_path=rel_path,
                    content=content,
                ),
            }
        ],
    }
    req = urllib.request.Request(
        API_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=180) as resp:
        body = json.loads(resp.read().decode("utf-8"))
    return body["choices"][0]["message"]["content"].strip() + "\n"


def main() -> int:
    api_key = os.environ.get("SARVAM_API_KEY")
    if not api_key:
        print("SARVAM_API_KEY missing.", file=sys.stderr)
        return 1

    mode = os.environ.get("MODE", "sync").strip()
    if mode not in {"sync", "backfill"}:
        print(f"Unknown MODE={mode!r}, expected 'sync' or 'backfill'.", file=sys.stderr)
        return 2

    if mode == "sync":
        candidates = changed_english_files_since_previous_commit()
        if not candidates:
            print("No English docs changed in the latest push — nothing to do.")
            return 0
    else:
        candidates = english_files()

    summary = []
    for en_path in candidates:
        rel_str = str(en_path.relative_to(EN_DIR))
        for lang in LANGS:
            if not is_stale(en_path, lang):
                continue
            try:
                content = en_path.read_text(encoding="utf-8")
            except OSError as e:
                print(f"skip {en_path}: {e}", file=sys.stderr)
                continue
            print(f"translate {rel_str} → {lang}")
            try:
                translated = translate(api_key, content, lang, rel_str)
            except urllib.error.HTTPError as e:
                detail = e.read().decode("utf-8", errors="replace")[:500]
                print(f"  HTTP {e.code}: {detail}", file=sys.stderr)
                summary.append(f"FAILED {rel_str} ({lang}): HTTP {e.code}")
                continue
            except Exception as e:
                print(f"  failed: {e}", file=sys.stderr)
                summary.append(f"FAILED {rel_str} ({lang}): {e}")
                continue
            tgt = target_path(en_path, lang)
            tgt.parent.mkdir(parents=True, exist_ok=True)
            tgt.write_text(translated, encoding="utf-8")
            summary.append(f"OK     {rel_str} ({lang})")

    print("\n".join(summary) or "No changes written.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
