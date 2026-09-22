#!/usr/bin/env python3
"""A stamped asset may not change without the version changing.

`check-asset-stamps.py` asserts every `?v=` URL carries the CURRENT stamp.
That is necessary and it is not sufficient, and the gap shipped on
2026-09-22: PR #393 changed `app.js` and left `package.json` at 26.6.231, so
every URL still agreed with every other URL, the check passed, and
`/app.js?v=202606231` went on pointing at different bytes than it had the
day before.

Why that matters here and not on an ordinary site: `sw.js` serves
same-origin assets through `cacheFirst`, which returns the cached response
and never revalidates. The cache is keyed on `CACHE_VERSION`, which
`bump-version.mjs` also derives from the version, so an unchanged version
leaves the old cache in place with the old file inside it. Netlify's build
command is `node scripts/bump-version.mjs` with no argument, which SYNCS
from package.json rather than incrementing, so a deploy does not rescue it.

The result is invisible from outside: the origin serves the new bytes at
the old URL, so a first-time visitor and every curl get the fix. Only a
returning visitor keeps the stale file, indefinitely, and they are the
people who use the site most. In #393's case they would have kept an
`app.js` whose theme toggle threw, whose intro tour showed nothing, and
which had no `#index` route -- while the eighteen new pages linked to it.

So this records the hash of each stamped asset against the version it
shipped with. If a hash moved and the version did not, it fails.

    python3 scripts/check-asset-freshness.py            # verify
    python3 scripts/check-asset-freshness.py --update   # after a bump

`--update` is deliberately a separate step rather than something the check
does for you: rewriting the record silently is the same failure wearing an
apology.
"""

import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RECORD = ROOT / 'data' / 'asset-freshness.json'

# The files served behind a ?v= stamp, and therefore cache-first.
ASSETS = ['app.js', 'styles.css', 'js/chrome.js']


def version():
    return json.loads((ROOT / 'package.json').read_text(encoding='utf-8'))['version']


def hashes():
    out = {}
    for rel in ASSETS:
        f = ROOT / rel
        if f.exists():
            out[rel] = hashlib.sha256(f.read_bytes()).hexdigest()[:16]
    return out


def main():
    now, ver = hashes(), version()

    if '--update' in sys.argv:
        RECORD.parent.mkdir(parents=True, exist_ok=True)
        RECORD.write_text(json.dumps({'version': ver, 'assets': now}, indent=2) + '\n',
                          encoding='utf-8')
        print(f'Recorded {len(now)} asset hash(es) against v{ver}.')
        return 0

    if not RECORD.exists():
        print('FAIL - no record yet. Run: python3 scripts/check-asset-freshness.py --update')
        return 1

    rec = json.loads(RECORD.read_text(encoding='utf-8'))
    moved = [r for r in now if rec['assets'].get(r) != now[r]]
    gone = [r for r in rec['assets'] if r not in now]

    if gone:
        print(f'FAIL - recorded asset(s) no longer present: {", ".join(gone)}')
        print('If that is deliberate, edit ASSETS and re-run with --update.')
        return 1

    if moved and rec['version'] == ver:
        print(f'FAIL - {len(moved)} stamped asset(s) changed while the version stayed at {ver}:\n')
        for r in moved:
            print(f'  {r}')
        print('\nThe service worker serves these cache-first and never revalidates, and')
        print('the cache key is derived from this same version, so a returning visitor')
        print('would keep the previous file indefinitely. The origin would serve the new')
        print('one to everybody else, which is why this cannot be seen from outside.')
        print('\n  node scripts/bump-version.mjs <next version>')
        print('  python3 scripts/check-asset-freshness.py --update')
        return 1

    if moved:
        print(f'FAIL - {len(moved)} stamped asset(s) changed and the version moved to {ver}, '
              f'but the record still says {rec["version"]}.')
        print('Run: python3 scripts/check-asset-freshness.py --update')
        return 1

    print(f'PASS - all {len(now)} stamped assets match the record for v{ver}.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
