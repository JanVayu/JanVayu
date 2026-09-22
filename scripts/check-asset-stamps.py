#!/usr/bin/env python3
"""Every versioned asset URL must carry the CURRENT version stamp.

index.html requests /styles.css and /app.js with a ?v=<stamp> query, and the
service worker serves same-origin assets **cache-first with no revalidation**
(see sw.js `cacheFirst`). The stamp is therefore the only thing that makes a
returning visitor fetch a new stylesheet: a URL that does not change is served
from that visitor's cache forever.

This exists because that is precisely what happened, undetected, for about a
hundred releases. `scripts/bump-version.mjs` stamped with

    content.replace(/href="\\/styles\\.css(?:\\?v=\\d+)?"/, ...)

and `String.replace` without /g rewrites only the FIRST match. The first match
is the `<link rel="preload">` in <head>; the `<link rel="stylesheet">` that
actually loads the file is ~800 lines further down. So every release re-stamped
a preload nobody used and left the real stylesheet pinned at ?v=202606118.

A first-time visitor never saw it, because a query string does not change which
file Netlify serves — the stale URL returned the current CSS. Anyone with that
URL already in their browser or service-worker cache kept the OLD stylesheet
indefinitely, which reads exactly like "the new design is not live".

    python3 scripts/check-asset-stamps.py
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# The same derivation bump-version.mjs uses:
#   version "26.6.219" -> yyyy "2026", mm "06", pp "219" -> "202606219".
# `pp` is padStart(2) rather than (3), so a three-digit patch simply runs
# long. That is the stamper's own behaviour, reproduced rather than
# corrected: the point of this check is to agree with what actually ships.
def current_stamp():
    v = json.loads((ROOT / 'package.json').read_text(encoding='utf-8'))['version']
    major, month, patch = v.split('.')
    return f'20{major}{month.zfill(2)}{patch.zfill(2)}'


# Until 2026-09-22 this list was ('index.html', 'sw.js') and that was complete,
# because index.html was the only page loading /styles.css. Eighteen more pages
# load it now. A hardcoded list would have left every one of them unguarded and,
# worse, would have gone on passing -- so the HTML side is discovered by walking
# the repo. A page joins this check by existing.
SKIP_DIRS = {'node_modules', '.git', 'Backups', 'tests', 'scripts'}
ASSET = r'(?:styles\.css|app\.js|js/chrome\.js)'
HTML_PAT = re.compile(r'(?:href|src)="/(' + ASSET + r')\?v=(\d+)"')
HTML_BARE = re.compile(r'(?:href|src)="/(' + ASSET + r')"')
SW_PAT = re.compile(r"'/(" + ASSET + r")\?v=(\d+)'")


def html_files():
    for f in sorted(ROOT.rglob('*.html')):
        if any(part in SKIP_DIRS for part in f.relative_to(ROOT).parts):
            continue
        yield f


def main():
    want = current_stamp()
    bad = []
    checked = 0

    targets = [(f, HTML_PAT, HTML_BARE) for f in html_files()]
    sw = ROOT / 'sw.js'
    if sw.exists():
        targets.append((sw, SW_PAT, None))

    for f, pat, bare in targets:
        rel = f.relative_to(ROOT)
        text = f.read_text(encoding='utf-8')
        for m in pat.finditer(text):
            checked += 1
            if m.group(2) != want:
                line = text[:m.start()].count('\n') + 1
                bad.append(f'  {rel}:{line}  {m.group(0)}  (expected ?v={want})')
        # An unstamped reference is the same hazard wearing different clothes.
        if bare is not None:
            for m in bare.finditer(text):
                line = text[:m.start()].count('\n') + 1
                bad.append(f'  {rel}:{line}  {m.group(0)}  (no ?v= stamp at all)')

    if bad:
        print(f'FAIL - {len(bad)} asset URL(s) do not carry the current stamp ?v={want}:\n')
        print('\n'.join(bad))
        print('\nThe service worker serves these cache-first and never revalidates,')
        print('so a stale stamp means returning visitors keep the old file forever.')
        print('Run `node scripts/bump-version.mjs` to re-stamp.')
        return 1

    print(f'PASS - all {checked} versioned asset URLs carry the current stamp ?v={want}.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
