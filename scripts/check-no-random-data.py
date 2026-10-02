#!/usr/bin/env python3
"""Refuse Math.random() anywhere a reader could mistake it for a measurement.

Until 22 September 2026 five of the six pollutant pages (/pm10/, /co/, /no2/,
/so2/, /o3/) printed, in a column headed with a real unit,

    Math.round((c.aqi || 0) * (Math.random() * 0.2 + 0.5))

a random number between half and seven-tenths of the city's overall AQI,
redrawn on every load. The first version of the page generator in the repo
history, dated 26 April 2026, already carried it, so it was live for about five
months. Nothing errored, the page rendered, and two loads of the same page
disagreed with each other, which is the only way anyone would have seen it.

This check fails on any `Math.random` in site code that is not on the short
list below. A use that is genuinely not data (a shuffle, a dice roll) lives in
`games.js`, which is skipped by name. Anywhere else, a use needs the marker

    // allow-random: <why a reader cannot mistake this for a measurement>

on the same line or the line above, so the reason is written down next to the
code and a reviewer sees it in the diff. Lines that are only comments are
ignored, which lets the generator keep quoting the old formula in the note that
explains why it was removed.

    python3 scripts/check-no-random-data.py

Exit 1 on any unmarked use.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

SKIP_DIRS = {'node_modules', '.git', 'docs', 'docs-bn', 'docs-hi', 'docs-mr',
             'docs-ta', 'docs-impactmojo', 'docs-impactmojo-bn',
             'docs-impactmojo-hi', 'docs-impactmojo-mr', 'docs-impactmojo-ta',
             'tests', 'test'}
SKIP_FILES = {'games.js'}
SUFFIXES = {'.html', '.js', '.mjs'}
USE = re.compile(r'Math\.random\s*\(')
MARKER = 'allow-random:'


def is_comment(line):
    s = line.lstrip()
    return s.startswith(('//', '*', '/*', '<!--'))


def scan():
    bad = []
    for path in sorted(ROOT.rglob('*')):
        if path.suffix not in SUFFIXES or path.name in SKIP_FILES:
            continue
        rel = path.relative_to(ROOT)
        if rel.parts[0] in SKIP_DIRS:
            continue
        lines = path.read_text(encoding='utf-8', errors='replace').splitlines()
        for i, line in enumerate(lines):
            if not USE.search(line) or is_comment(line):
                continue
            prev = lines[i - 1] if i else ''
            if MARKER in line or MARKER in prev:
                continue
            bad.append((str(rel), i + 1, line.strip()[:110]))
    return bad


def main():
    bad = scan()
    if not bad:
        print('PASS - no unmarked Math.random() outside games.js.')
        return 0
    print(f'FAIL - {len(bad)} unmarked Math.random() use(s):')
    for rel, n, text in bad:
        print(f'  {rel}:{n}: {text}')
    print('A random value can look like a measurement. If this one cannot, add')
    print('"// allow-random: <reason>" on the line above; otherwise remove it.')
    return 1


if __name__ == '__main__':
    sys.exit(main())
