#!/usr/bin/env python3
"""Keep the fact-check promise and the fact-check practice in the same place.

JanVayu told visitors, on two conference decks and the wiki home, that every
number was "fact-checked — weekly". The deeper audit that phrase referred to ran
five times and stopped on **27 July 2026**. Six weeks later the promise was still
on the decks, and the only reason anyone noticed is that someone went looking.

The audit is not a CI job and cannot be: it web-verifies statistics against
primary sources, which needs a model and a human reviewer, not a runner. What CI
can do is refuse to let the claim outrun the practice, from both ends:

  1. **Freshness.** The newest `docs/fact-check-<date>.md` may not be older than
     MAX_AGE_DAYS. A "periodic" audit that has not run in four months is not
     periodic, it has stopped.

  2. **The promise.** No page may advertise a cadence the practice does not keep.
     "Weekly" is the specific over-promise that failed here, so the pages that
     describe the audit are checked for it by name.

    python3 scripts/check-factcheck-freshness.py          # report, exit 1 if stale
    python3 scripts/check-factcheck-freshness.py --show    # dates and claims found

If the weekly routine is restarted, tighten MAX_AGE_DAYS and put "weekly" back on
the pages in the same commit — this script is what makes that a single decision
rather than two that drift apart.
"""
import argparse
import datetime as dt
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# A deep audit older than this is not "periodic" any more.
MAX_AGE_DAYS = 120

# Findings files are the audit's own receipts: docs/fact-check-YYYY-MM-DD*.md
FINDINGS = re.compile(r'^fact-check-(\d{4})-(\d{2})(?:-(\d{2}))?')

# Pages that describe the audit to a reader. A cadence word here is a promise.
CLAIM_PAGES = [
    'walkthrough/deck.html',
    'walkthrough/full.html',
    'walkthrough/index.html',
    'docs/wiki/Home.md',
    'panels/about.html',
    'panels/faq.html',
    'index.html',
]
# panels/faq.html was added on 2026-09-17. It was not on this list, and it was
# carrying the exact over-promise this guard exists to stop -- "fact-checked
# weekly", twice, plus a link to a July findings file two audits out of date --
# for the whole time the guard was reporting PASS. The list, not the check, was
# the gap. Any new page that describes the audit belongs here on the same day
# it is written.
# Cadences the practice does not currently keep. Matched only near a fact-check
# phrase, so an unrelated "weekly newsletter" is not a finding.
OVERPROMISE = re.compile(
    r'fact[- ]check(?:ed|ing)?[^.<|\n]{0,60}?\b(weekly|every week|daily|nightly)\b'
    r'|\b(weekly|daily|nightly)\b[^.<|\n]{0,40}?fact[- ]check',
    re.I,
)


def newest_findings():
    """(date, filename) of the most recent audit, or (None, None)."""
    best = (None, None)
    for f in (ROOT / 'docs').glob('fact-check-*.md'):
        m = FINDINGS.match(f.name)
        if not m:
            continue
        y, mo, d = int(m.group(1)), int(m.group(2)), int(m.group(3) or 1)
        try:
            when = dt.date(y, mo, d)
        except ValueError:
            continue
        if best[0] is None or when > best[0]:
            best = (when, f.name)
    return best


def promises():
    """Every page that advertises a cadence the practice does not keep."""
    out = []
    for rel in CLAIM_PAGES:
        p = ROOT / rel
        if not p.exists():
            continue
        for n, line in enumerate(p.read_text(encoding='utf-8').splitlines(), 1):
            if OVERPROMISE.search(line):
                out.append((rel, n, re.sub(r'<[^>]*>', '', line).strip()[:110]))
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--show', action='store_true', help='print what was found and exit 0')
    args = ap.parse_args()

    when, name = newest_findings()
    claims = promises()
    today = dt.date.today()

    if args.show:
        print(f'newest audit : {name or "none found"}' + (f'  ({(today - when).days} days ago)' if when else ''))
        print(f'ceiling      : {MAX_AGE_DAYS} days')
        print(f'over-promises: {len(claims)}')
        for rel, n, line in claims:
            print(f'  {rel}:{n}  {line}')
        return 0

    problems = []

    if when is None:
        problems.append('FAIL: no docs/fact-check-<date>.md found at all. The deep audit '
                        'leaves dated findings files; without one there is nothing to date.')
    else:
        age = (today - when).days
        if age > MAX_AGE_DAYS:
            problems.append(
                f'FAIL: the newest fact-check is {name} — {age} days old, over the '
                f'{MAX_AGE_DAYS}-day ceiling.\n'
                '  The site tells visitors its figures are re-verified against primary\n'
                '  sources. Run the audit and commit its findings, or change what the\n'
                '  site claims. Do not raise MAX_AGE_DAYS to make this pass.')

    if claims:
        lines = ['FAIL: a page promises a fact-check cadence the practice does not keep.']
        for rel, n, line in claims:
            lines.append(f'      {rel}:{n}  {line}')
        lines.append('  Either restart the routine at that cadence and tighten MAX_AGE_DAYS,\n'
                     '  or describe the audit as periodic. The two have to move together.')
        problems.append('\n'.join(lines))

    if problems:
        print('\n\n'.join(problems))
        return 1

    age = (today - when).days
    print(f'PASS — newest fact-check {name} is {age} days old (ceiling {MAX_AGE_DAYS}), '
          f'and no page promises a cadence the practice does not keep.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
