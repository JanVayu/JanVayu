#!/usr/bin/env python3
"""The About panel's version history and roadmap must not fall far behind.

`panels/about.html` carries two things a visitor reads as current: a "Just
shipped (vX)" line in the roadmap, and a Version History list. Both are prose,
so neither moves when a release ships, and nothing was watching them. On
2026-09-18 the roadmap advertised **v26.6.125** as just shipped while the site
was on v26.6.203, seventy-eight releases later, and the history stopped at 186.

The repo had already fixed this once: v26.6.187 fixed "the About panel's version
history, stale again nine days after it was last fixed". Fixing prose without
adding a check is how a thing gets stale a third time.

The tolerance is deliberately loose. Not every patch release earns an entry, and
a guard that fires on every version bump would be turned off within a week.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ABOUT = ROOT / 'panels' / 'about.html'
PKG = ROOT / 'package.json'

# How many patch releases the About panel may lag before it is misleading.
MAX_LAG = 12


def patch(v):
    m = re.fullmatch(r'(\d+)\.(\d+)\.(\d+)', v)
    return tuple(int(x) for x in m.groups()) if m else None


def main():
    cur = re.search(r'"version"\s*:\s*"([^"]+)"', PKG.read_text(encoding='utf-8')).group(1)
    now = patch(cur)
    html = ABOUT.read_text(encoding='utf-8')
    errs = []

    shipped = re.search(r'Just shipped \(v([0-9.]+)\)', html)
    if not shipped:
        errs.append('no "Just shipped (vX)" line in the roadmap')
    else:
        got = patch(shipped.group(1))
        if not got:
            errs.append(f'unparseable "Just shipped" version {shipped.group(1)!r}')
        elif got[:2] != now[:2] or now[2] - got[2] > MAX_LAG:
            errs.append(f'roadmap says just shipped v{shipped.group(1)}, package.json says {cur} '
                        f'(more than {MAX_LAG} patches behind)')

    # Scoped to the Version History card, NOT the whole file. Searching the whole
    # file passes on the roadmap's own "Just shipped (vX)" string, so deleting
    # the entire history block still came back green. Same blind spot as a
    # substring test that matches in the wrong clause.
    cut = html.find('Version History')
    hist = html[cut:] if cut != -1 else ''
    if not hist:
        errs.append('no Version History card found in panels/about.html')
    # Entries are written as ranges, "v26.6.187&ndash;203". Reading only the
    # left-hand version reports the range's START as the newest thing on the
    # page, which fired on a perfectly current file. Take the upper bound where
    # one is given.
    seen = []
    for maj, mnr, lo, hi in re.findall(
            r'v(\d+)\.(\d+)\.(\d+)(?:\s*(?:&ndash;|&mdash;|[\u2013\u2014-])\s*(\d+))?', hist):
        seen.append((int(maj), int(mnr), int(hi if hi else lo)))
    if not seen:
        errs.append('the Version History names no versions at all')
    else:
        newest = max(seen)
        if newest[:2] != now[:2] or now[2] - newest[2] > MAX_LAG:
            errs.append(f'newest version named in About is v{".".join(map(str, newest))}, '
                        f'package.json says {cur} (more than {MAX_LAG} patches behind)')

    if errs:
        print('FAIL -')
        for e in errs:
            print('  ' + e)
        print(f'  Update panels/about.html: the roadmap "Just shipped" line and the Version History.')
        return 1
    print(f'PASS - About panel is current with {cur} (within {MAX_LAG} patch releases)')
    return 0


if __name__ == '__main__':
    sys.exit(main())
