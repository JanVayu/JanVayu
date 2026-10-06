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
import re
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
# sarvam-30b was deprecated by Sarvam; the API answers HTTP 400 and names
# sarvam-105b as its replacement. Until 2026-10-06 every run failed on that and
# the job still reported success, so a changed model name now fails the job.
MODEL = "sarvam-105b"
MAX_TOKENS = 4096
TEMPERATURE = 0.2
# Indic scripts need several times the tokens of English, so a long file is
# translated in parts. A part is cut at a blank line outside code fences and
# never inside a table, which has no blank lines.
CHUNK_CHARS = 2500
# Unicode block per language, used to confirm the output really is in it.
SCRIPT_RANGES = {
    "hi": (0x0900, 0x097F),
    "mr": (0x0900, 0x097F),
    "bn": (0x0980, 0x09FF),
    "ta": (0x0B80, 0x0BFF),
}

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


def split_chunks(content: str, limit: int = CHUNK_CHARS) -> list[str]:
    """Split Markdown into parts of about `limit` characters at blank lines
    that sit outside fenced code blocks."""
    blocks: list[str] = []
    cur: list[str] = []
    in_fence = False
    for line in content.splitlines(keepends=True):
        if line.lstrip().startswith("```"):
            in_fence = not in_fence
        cur.append(line)
        if not in_fence and not line.strip():
            blocks.append("".join(cur))
            cur = []
    if cur:
        blocks.append("".join(cur))
    chunks: list[str] = []
    buf = ""
    for blk in blocks:
        if buf and len(buf) + len(blk) > limit:
            chunks.append(buf)
            buf = ""
        buf += blk
    if buf:
        chunks.append(buf)
    return chunks or [content]


def structure(md: str) -> dict:
    """Counts that a faithful translation must leave unchanged."""
    headings = fences = rows = 0
    in_fence = False
    for line in md.splitlines():
        if line.lstrip().startswith("```"):
            fences += 1
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        if re.match(r"#{1,6}\s", line):
            headings += 1
        if line.lstrip().startswith("|"):
            rows += 1
    links = sorted(re.findall(r"\]\(([^)\s]+)", md))
    return {"headings": headings, "fences": fences, "table_rows": rows, "links": links}


def validate(src: str, out: str, lang: str) -> str | None:
    """Return a reason the translation must not be written, or None."""
    a, b = structure(src), structure(out)
    for key in ("headings", "fences", "table_rows"):
        if a[key] != b[key]:
            return f"{key} differ (english {a[key]}, translated {b[key]})"
    if a["links"] != b["links"]:
        lost = sorted(set(a["links"]) - set(b["links"]))[:3]
        added = sorted(set(b["links"]) - set(a["links"]))[:3]
        return f"link targets differ (missing {lost}, added {added}, counts {len(a['links'])} and {len(b['links'])})"
    lo, hi = SCRIPT_RANGES[lang]
    letters = sum(1 for ch in out if lo <= ord(ch) <= hi)
    if letters < 50:
        return f"output holds only {letters} characters of the target script"
    return None


class CutOff(RuntimeError):
    """The model stopped at max_tokens, so the part is incomplete."""


def translate(api_key: str, content: str, lang: str, rel_path: str) -> str:
    chunks = split_chunks(content)
    parts: list[str] = []
    for i, c in enumerate(chunks):
        parts.append(translate_with_retry(api_key, c, lang, rel_path, i + 1, len(chunks)))
    return "".join(p if p.endswith("\n") else p + "\n" for p in parts)


def translate_with_retry(api_key: str, chunk: str, lang: str, rel_path: str, n: int, total: int) -> str:
    """Translate one part; if the output is cut off, halve the part and retry.
    Tamil and Bengali need more tokens per word than Hindi, so one size does not
    fit all. A part that cannot be split any further raises."""
    try:
        return translate_part(api_key, chunk, lang, rel_path, n, total)
    except CutOff:
        halves = split_chunks(chunk, max(len(chunk) // 2, 1))
        if len(halves) < 2:
            raise
        return "".join(
            (h if h.endswith("\n") else h + "\n")
            for h in (translate_with_retry(api_key, x, lang, rel_path, n, total) for x in halves)
        )


def translate_part(api_key: str, content: str, lang: str, rel_path: str, n: int, total: int) -> str:
    if total > 1:
        # The note goes in the instruction line, not in the content, so the
        # model cannot translate it and echo it into the file.
        rel_path = f"{rel_path} (part {n} of {total}: translate only the part below, add nothing before or after it)"
    payload = {
        "model": MODEL,
        "max_tokens": MAX_TOKENS,
        "temperature": TEMPERATURE,
        # sarvam-105b thinks by default and the thinking tokens count against
        # max_tokens, so a long part is cut off before any translation is
        # written. null switches thinking off (Sarvam chat completion docs).
        "reasoning_effort": None,
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
    choice = body["choices"][0]
    if choice.get("finish_reason") == "length":
        raise CutOff("output cut off at the token limit; part not written")
    return choice["message"]["content"].strip() + "\n"


# A model sometimes merges two headings or drops a code fence. The checks catch
# it, and a second attempt usually does not repeat the slip. On the first Hindi
# backfill 7 of 72 files were rejected on a single attempt.
MAX_ATTEMPTS = 3


def translate_validated(api_key: str, content: str, lang: str, rel_path: str) -> tuple[str, str | None]:
    """Translate and validate, retrying a rejected result. Returns the last
    translation and the reason it was rejected, or None when it passed."""
    problem = None
    translated = ""
    for attempt in range(1, MAX_ATTEMPTS + 1):
        translated = translate(api_key, content, lang, rel_path)
        problem = validate(content, translated, lang)
        if not problem:
            return translated, None
        print(f"  attempt {attempt} of {MAX_ATTEMPTS} rejected: {problem}", file=sys.stderr)
    return translated, problem


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

    wanted = [c for c in os.environ.get("LANGS", "").replace(",", " ").split() if c]
    unknown = [c for c in wanted if c not in LANGS]
    if unknown:
        print(f"Unknown LANGS {unknown}, expected some of {sorted(LANGS)}.", file=sys.stderr)
        return 2
    langs = wanted or list(LANGS)

    summary = []
    failed = 0
    for en_path in candidates:
        rel_str = str(en_path.relative_to(EN_DIR))
        for lang in langs:
            if not is_stale(en_path, lang):
                continue
            try:
                content = en_path.read_text(encoding="utf-8")
            except OSError as e:
                print(f"skip {en_path}: {e}", file=sys.stderr)
                continue
            print(f"translate {rel_str} → {lang}")
            try:
                translated, problem = translate_validated(api_key, content, lang, rel_str)
            except urllib.error.HTTPError as e:
                detail = e.read().decode("utf-8", errors="replace")[:500]
                print(f"  HTTP {e.code}: {detail}", file=sys.stderr)
                summary.append(f"FAILED {rel_str} ({lang}): HTTP {e.code}")
                failed += 1
                continue
            except Exception as e:
                print(f"  failed: {e}", file=sys.stderr)
                summary.append(f"FAILED {rel_str} ({lang}): {e}")
                failed += 1
                continue
            if problem:
                print(f"  rejected: {problem}", file=sys.stderr)
                summary.append(f"REJECTED {rel_str} ({lang}): {problem}")
                failed += 1
                continue
            tgt = target_path(en_path, lang)
            tgt.parent.mkdir(parents=True, exist_ok=True)
            tgt.write_text(translated, encoding="utf-8")
            summary.append(f"OK     {rel_str} ({lang})")

    print("\n".join(summary) or "No changes written.")
    if failed:
        # Exit non-zero so the job goes red. Until 2026-10-06 a deprecated model
        # name failed every translation and the job still reported success.
        print(f"{failed} translation(s) failed or were rejected.", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
