#!/usr/bin/env python3
"""Every tool must stay reachable from the site's own chrome.

Written when the nine nav groups were about to become six. The risk in that
change is not that it looks wrong, it is that a tool quietly stops having any
route to it: a panel still exists, still works, and no longer appears in the
nav, the mobile nav or the footer, so nobody finds it again. Nothing errors and
no screenshot shows it.

So the reachable set is recorded in `data/nav-baseline.json` and this refuses
any change that shrinks it. Adding routes is always fine. Removing one is a
decision that has to be made on purpose: update the baseline in the same commit
and the diff will show exactly which tool lost its route.

"Reachable" means addressable from chrome the visitor can see on any page:
  - a desktop nav link or dropdown link   (data-panel on .nav-link/.nav-dropdown-link)
  - a mobile nav item                     (data-panel on .mobile-nav-item)
  - an overflow / more menu               (data-panel anywhere in the header)
  - a footer link                         (showPanel('x') in the footer)

    python3 scripts/check-nav-coverage.py           # fail if anything lost
    python3 scripts/check-nav-coverage.py --update  # re-record, on purpose
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASELINE = ROOT / 'data/nav-baseline.json'


def reachable():
    s = (ROOT / 'index.html').read_text(encoding='utf-8')
    dests = set()
    # anything in the header/nav carrying a data-panel, whatever its class:
    # that covers nav links, dropdown links, an overflow menu and the mobile nav.
    for m in re.finditer(r'class="(nav-link|nav-dropdown-link|mobile-nav-item|nav-more-link)[^"]*"'
                         r'[^>]*data-panel="([^"]+)"', s):
        dests.add(m.group(2))
    for m in re.finditer(r'data-panel="([^"]+)"[^>]*class="(nav-link|nav-dropdown-link|'
                         r'mobile-nav-item|nav-more-link)[^"]*"', s):
        dests.add(m.group(1))
    # footer and in-page links that open a panel
    for m in re.finditer(r"showPanel\('([^']+)'\)", s):
        dests.add(m.group(1))
    # a few showPanel calls sit inside template literals and name the panel at
    # runtime (showPanel('${a.panel}')). Recording the placeholder would inflate
    # the count and guard nothing, since it is present whatever the data holds.
    return {d for d in dests if '${' not in d}


def main():
    now = reachable()
    if '--update' in sys.argv:
        BASELINE.parent.mkdir(parents=True, exist_ok=True)
        BASELINE.write_text(json.dumps(
            {'_what': 'Panels reachable from site chrome. check-nav-coverage.py '
                      'refuses any change that removes one. Shrink this only on purpose.',
             'destinations': sorted(now)}, indent=2) + '\n', encoding='utf-8')
        print(f'recorded {len(now)} reachable destinations')
        return 0

    if not BASELINE.exists():
        print('FAIL — no baseline. Run with --update once to record the current set.')
        return 1

    was = set(json.loads(BASELINE.read_text())['destinations'])
    lost = sorted(was - now)
    gained = sorted(now - was)

    if lost:
        print(f'FAIL — {len(lost)} tool(s) lost every route from the site chrome:')
        for d in lost:
            print(f'  {d}')
        print('\nA panel with no nav, no mobile nav and no footer link still works and')
        print('cannot be found. If the removal is deliberate, re-record the baseline')
        print('in the same commit: python3 scripts/check-nav-coverage.py --update')
        return 1

    msg = f'PASS — {len(now)} destinations reachable from chrome; none lost'
    if gained:
        msg += f'; {len(gained)} added ({", ".join(gained[:6])}{"…" if len(gained) > 6 else ""})'
    print(msg)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
