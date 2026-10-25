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


def site_index():
    """The destinations and groups the site's own Index lists, as a visitor sees them."""
    s = (ROOT / 'index.html').read_text(encoding='utf-8')
    a, b = s.find('id="siteIndexGrid"'), s.find('id="siteIndexNone"')
    block = s[a:b]
    links = re.findall(r'<a [^>]*data-panel="([^"]+)"', block)
    groups = re.findall(r'<div class="grp">([^<]+)</div>', block)
    return len(set(links)), len(groups)


def docs_agree():
    """The user guide states how many destinations and groups there are.

    "About 58 panels in 7 groups" stood in two guides after the Index had grown
    to 60 destinations in 8 groups, and nothing compared them, so the guides
    are tied to the Index here.
    """
    n, g = site_index()
    problems = []
    overview = (ROOT / 'docs/user-guide/overview.md').read_text(encoding='utf-8')
    m = re.search(r'with (\d+) destinations, arranged in (\d+) groups', overview)
    if not m:
        problems.append('docs/user-guide/overview.md no longer states "N destinations, arranged in G groups"')
    elif (int(m.group(1)), int(m.group(2))) != (n, g):
        problems.append(f'docs/user-guide/overview.md says {m.group(1)} destinations in {m.group(2)} groups; the Index lists {n} in {g}')
    role = (ROOT / 'docs/user-guide/role-selector.md').read_text(encoding='utf-8')
    m = re.search(r'full list of (\d+) destinations', role)
    if not m:
        problems.append('docs/user-guide/role-selector.md no longer states "the full list of N destinations"')
    elif int(m.group(1)) != n:
        problems.append(f'docs/user-guide/role-selector.md says {m.group(1)} destinations; the Index lists {n}')
    return problems


def main():
    problems = docs_agree()
    if problems and '--update' not in sys.argv:
        print('FAIL — the user guide and the site Index disagree:')
        for pr in problems:
            print(f'  {pr}')
        return 1
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
