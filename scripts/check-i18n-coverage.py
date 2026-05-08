#!/usr/bin/env python3
"""
Check i18n coverage of index.html (and optionally other HTML files).

Walks the DOM, finds elements that hold visible English text, and reports
how many are wrapped (directly or via an ancestor) in a `data-i18n=...`
attribute. Strings inside <script>, <style>, and HTML comments are skipped.
Strings inside <template> *are* counted because templates are the panel
content the user sees.

Usage:
    python3 scripts/check-i18n-coverage.py                 # checks index.html
    python3 scripts/check-i18n-coverage.py path/to/file.html

Exit code is always 0 — this is an advisory script. To enforce a coverage
floor in CI, pass --min-coverage <pct> and the script will exit 1 if below.

Example:
    python3 scripts/check-i18n-coverage.py --min-coverage 30
"""

import argparse
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

# Tags whose text content is never user-visible
INVISIBLE_TAGS = {"script", "style", "noscript", "code", "pre", "textarea"}

# Tags that are structural-only, never carry user-facing text
STRUCTURAL_ONLY = {"html", "head", "body", "meta", "link", "title", "br", "hr", "img", "input", "select", "option", "datalist", "source", "iframe", "svg", "path", "g", "defs", "use", "clipPath", "linearGradient", "stop", "circle", "rect", "polygon", "polyline", "line", "ellipse", "filter", "feFlood", "feOffset", "feGaussianBlur", "feComposite", "feColorMatrix", "feMerge", "feMergeNode", "fePointLight", "feMorphology", "feBlend", "feSpecularLighting", "feTurbulence", "feImage", "feDisplacementMap", "marker", "mask", "pattern", "symbol", "view", "text", "textPath", "tspan"}

# Minimum length of text to count (skip whitespace, single chars, pure punctuation)
MIN_TEXT_LEN = 3
# Pattern for purely-mechanical text (numbers, units, code-fragment-looking)
MECHANICAL_RE = re.compile(r"^[\s\d\.\,\-\:\;\(\)\[\]\{\}\+\*/=<>%&|@#~`]*$")


class I18NCoverageParser(HTMLParser):
    """
    Coverage is judged at the immediate-parent level: a visible text node is
    "covered" iff its direct parent element carries `data-i18n=...`.

    Rationale: the JanVayu i18n loader replaces the *innerText* of each
    element with `data-i18n`. An ancestor having `data-i18n` does NOT propagate
    translation to nested children — so giving credit for distant ancestors
    would hugely inflate the metric.
    """

    def __init__(self):
        super().__init__(convert_charrefs=True)
        # Stack of (tag, has_data_i18n_directly) tuples.
        self._stack = []
        self._invisible_depth = 0  # >0 when inside a script/style/etc.
        self.covered = []
        self.uncovered = []

    def handle_starttag(self, tag, attrs):
        tag = tag.lower()
        if tag in INVISIBLE_TAGS:
            self._invisible_depth += 1
        attr_dict = dict((k.lower(), v) for k, v in attrs)
        has_i18n = "data-i18n" in attr_dict
        self._stack.append((tag, has_i18n))

    def handle_endtag(self, tag):
        tag = tag.lower()
        if tag in INVISIBLE_TAGS:
            self._invisible_depth = max(0, self._invisible_depth - 1)
        if self._stack and self._stack[-1][0] == tag:
            self._stack.pop()

    def handle_data(self, data):
        if self._invisible_depth > 0:
            return
        text = data.strip()
        if len(text) < MIN_TEXT_LEN:
            return
        if MECHANICAL_RE.match(text):
            return
        if self._stack and self._stack[-1][0] in STRUCTURAL_ONLY:
            return
        # Coverage is the *immediate* parent only.
        covered = bool(self._stack and self._stack[-1][1])
        snippet = text[:120].replace("\n", " ")
        record = {
            "tag": self._stack[-1][0] if self._stack else "",
            "snippet": snippet,
        }
        if covered:
            self.covered.append(record)
        else:
            self.uncovered.append(record)


def analyse(path: Path) -> dict:
    parser = I18NCoverageParser()
    parser.feed(path.read_text(encoding="utf-8"))
    total = len(parser.covered) + len(parser.uncovered)
    pct = round(100 * len(parser.covered) / total, 1) if total else 0.0
    return {
        "file": str(path),
        "total_strings": total,
        "covered": len(parser.covered),
        "uncovered": len(parser.uncovered),
        "coverage_pct": pct,
        "uncovered_samples": parser.uncovered[:30],
    }


def render_report(result: dict, *, github_summary: bool) -> str:
    lines = [
        f"# i18n coverage report — `{result['file']}`",
        "",
        f"- **Total visible strings:** {result['total_strings']:,}",
        f"- **Covered (`data-i18n` somewhere on ancestor chain):** {result['covered']:,}",
        f"- **Uncovered:** {result['uncovered']:,}",
        f"- **Coverage:** **{result['coverage_pct']}%**",
        "",
    ]
    if result["uncovered_samples"]:
        lines.append("## Sample uncovered strings (first 30)")
        lines.append("")
        lines.append("| Tag | Snippet |")
        lines.append("|-----|---------|")
        for r in result["uncovered_samples"]:
            snippet = r["snippet"].replace("|", "\\|")
            lines.append(f"| `<{r['tag']}>` | {snippet} |")
    return "\n".join(lines)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.strip().splitlines()[0])
    ap.add_argument("paths", nargs="*", default=["index.html"], help="HTML files to check")
    ap.add_argument("--min-coverage", type=float, default=None, help="Fail if coverage < this percentage")
    ap.add_argument("--json", action="store_true", help="Emit JSON instead of Markdown")
    ap.add_argument("--github-summary", action="store_true", help="Append to $GITHUB_STEP_SUMMARY")
    args = ap.parse_args()

    results = []
    overall_total = overall_covered = 0
    for p in args.paths:
        path = Path(p)
        if not path.exists():
            print(f"warning: {path} not found", file=sys.stderr)
            continue
        r = analyse(path)
        results.append(r)
        overall_total += r["total_strings"]
        overall_covered += r["covered"]

    overall_pct = round(100 * overall_covered / overall_total, 1) if overall_total else 0.0

    if args.json:
        print(json.dumps({"files": results, "overall_pct": overall_pct, "overall_total": overall_total, "overall_covered": overall_covered}, indent=2))
    else:
        for r in results:
            print(render_report(r, github_summary=args.github_summary))
            print()
        print(f"## Overall coverage across all files: **{overall_pct}%** ({overall_covered:,} / {overall_total:,})")

    if args.github_summary:
        import os
        summary_path = os.environ.get("GITHUB_STEP_SUMMARY")
        if summary_path:
            with open(summary_path, "a", encoding="utf-8") as f:
                for r in results:
                    f.write(render_report(r, github_summary=True))
                    f.write("\n\n")
                f.write(f"\n## Overall coverage: **{overall_pct}%**\n")

    if args.min_coverage is not None and overall_pct < args.min_coverage:
        print(f"\n::error::i18n coverage {overall_pct}% is below required {args.min_coverage}%", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
