#!/usr/bin/env python3
"""Every asset URL the CSS names must actually resolve to a file we ship.

This exists because of a specific, entirely self-inflicted outage. The sandbox
that renders screenshots cannot reach a CDN, so the working method had been to
rewrite the 67 Sargam icon URLs in `styles.css` from

    url(https://cdn.jsdelivr.net/npm/sargam-icons@1.6.7/Icons/Line/si_Home.svg)

to a local `url(/sargam/si_Home.svg)`, take the screenshots, and put the file
back. On v26.6.210 the restore was crossed with a second backup of the same
file and the rewritten version was committed. **Every icon on the site went
blank**, because a CSS mask fed something that is not an image renders nothing.

What made it survive review is the part worth writing down. `curl -o /dev/null
-w %{http_code}` on `/sargam/si_Home.svg` returned **200**, because Netlify's
SPA fallback serves `index.html` for any unmatched path. A status check cannot
see this. The content type can: it came back `text/html` for a `.svg` request.

So this checks two things a status code will not:

1. No stylesheet may reference a root-relative asset path that does not exist
   in the repository. That catches the rewrite at the commit, offline, before
   anything is deployed.
2. Every external asset host named in the CSS is on a short allowlist, so a
   copy-paste from somewhere else does not quietly introduce a new dependency.

    python3 scripts/check-asset-urls.py
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Hosts the site is allowed to load assets from, each with a reason.
ALLOWED_HOSTS = {
    'cdn.jsdelivr.net': 'Sargam icon set, pinned to sargam-icons@1.6.7',
    'fonts.googleapis.com': 'web fonts',
    'fonts.gstatic.com': 'web font files',
}

SHEETS = ['styles.css'] + [str(p.relative_to(ROOT)) for p in sorted((ROOT / 'css').glob('*.css'))] \
    if (ROOT / 'css').is_dir() else ['styles.css']

URL = re.compile(r'url\(\s*[\'"]?([^\'")]+)[\'"]?\s*\)')


def main():
    errs = []
    checked = 0
    for rel in SHEETS:
        p = ROOT / rel
        if not p.exists():
            continue
        text = p.read_text(encoding='utf-8')
        for line_no, line in enumerate(text.splitlines(), 1):
            for raw in URL.findall(line):
                u = raw.strip()
                if u.startswith('data:') or u.startswith('#'):
                    continue
                checked += 1
                if u.startswith('http://') or u.startswith('https://'):
                    host = u.split('/')[2]
                    if host not in ALLOWED_HOSTS:
                        errs.append(f'{rel}:{line_no}: asset host not on the allowlist: {host}')
                    continue
                if u.startswith('//'):
                    errs.append(f'{rel}:{line_no}: protocol-relative asset URL: {u}')
                    continue
                # A root-relative or relative path must exist in the repo. This is
                # the check that catches a local rewrite of a CDN URL: the path
                # looks fine, the server answers 200 with the SPA fallback, and
                # the browser is handed HTML where it wanted an image.
                path = u.split('?')[0].split('#')[0]
                target = (ROOT / path.lstrip('/')) if path.startswith('/') else (p.parent / path)
                if not target.exists():
                    errs.append(f'{rel}:{line_no}: references a file that is not in the repo: {u}')

    if errs:
        print(f'FAIL — {len(errs)} asset URL problem(s):')
        seen = set()
        for e in errs:
            key = e.split(': ', 1)[1][:70]
            if key in seen:
                continue
            seen.add(key)
            print('  ' + e)
        if len(errs) > len(seen):
            print(f'  ... and {len(errs) - len(seen)} more of the same kinds')
        print('\nA root-relative path that is not in the repo will still answer 200 in')
        print('production: the SPA fallback serves index.html for it. The browser then')
        print('receives text/html where it expected an image, and renders nothing.')
        return 1

    print(f'PASS — {checked} asset URLs across {len(SHEETS)} stylesheet(s); '
          f'every local path exists, every host is on the allowlist')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
