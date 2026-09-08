#!/usr/bin/env python3
"""Check that the homepage's dated bulletin is not from a month that has ended.

The hero carries a hand-written standfirst that opens with a month:

    <strong>September 2026:</strong> The monsoon withdraws from northwest India …

It is the first thing a visitor reads and the only place on the site that
claims, in so many words, to be current. Nothing generates it, and it has now
gone stale three times. On 1 August 2026 it still said "July 2026", found only
because someone happened to audit the whole site before a conference; on
8 September 2026 it still said "August 2026", found by a reader.

Everything else on that line is a dated fact that stays true as it ages (an
IQAir edition, a Lancet Countdown, an elapsed NCAP deadline). The month label
is the one part that rots on its own, silently, in the largest type on the
page.

    python3 scripts/check-hero-currency.py          # report, exit 1 if stale
    python3 scripts/check-hero-currency.py --show    # just print what it says

Deliberately not a hard "must equal this month": the standfirst is editorial,
written by hand near the start of a month, and failing every unrelated pull
request at midnight on the 1st would teach people to ignore the check. It
allows a week. On the 8th of a month, last month's label fails.
"""
import argparse
import datetime as dt
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / 'index.html'

# Days into the new month before last month's label counts as stale.
GRACE_DAYS = 7

MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December']

# The div, then the first <strong>…</strong> inside it.
ALERT = re.compile(r'id="heroLiveAlert"[^>]*>\s*<strong>([^<]*)</strong>')
LABEL = re.compile(r'^(' + '|'.join(MONTHS) + r')\s+(\d{4}):$')


def stated():
    """The month the homepage says it is speaking from."""
    html = PAGE.read_text(encoding='utf-8')
    m = ALERT.search(html)
    if not m:
        sys.exit('FAIL: no <strong> month label found at the start of #heroLiveAlert '
                 'in index.html. The bulletin has to say which month it is from.')
    raw = m.group(1).strip()
    got = LABEL.match(raw)
    if not got:
        sys.exit(f'FAIL: #heroLiveAlert opens with "{raw}", which is not a '
                 '"<Month> <Year>:" label this can check.')
    return MONTHS.index(got.group(1)) + 1, int(got.group(2)), raw


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--show', action='store_true', help='print the label and exit 0')
    args = ap.parse_args()

    month, year, raw = stated()
    if args.show:
        print(raw)
        return 0

    today = dt.date.today()
    months_behind = (today.year - year) * 12 + (today.month - month)

    if months_behind < 0:
        print(f'FAIL: the homepage bulletin is dated "{raw}", which has not '
              f'happened yet (today is {today:%d %B %Y}).')
        return 1

    if months_behind >= 1 and today.day > GRACE_DAYS:
        word = 'month' if months_behind == 1 else 'months'
        print(f'FAIL: the homepage bulletin still says "{raw}". That is '
              f'{months_behind} {word} behind: today is {today:%d %B %Y}.')
        print()
        print('  Rewrite the standfirst in index.html (#heroLiveAlert) for the')
        print('  current month, then re-run. The dated facts in it (IQAir, the')
        print('  Lancet Countdown, the NCAP deadline) age fine and can stay; it is')
        print('  the seasonal framing and the "New:" tail that need to be true.')
        return 1

    print(f'PASS — homepage bulletin reads "{raw}"; today is {today:%d %B %Y}.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
