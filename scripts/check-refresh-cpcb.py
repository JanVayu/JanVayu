#!/usr/bin/env python3
"""Prove scripts/refresh-cpcb-bulletins.py does what its docstring says.

Nothing in CI can reach cpcb.nic.in, so this runs the real refresh and the real
parser over a fake fetcher that serves synthetic bulletins. It checks the five
things that go wrong quietly:

  1. good days are appended, in date order, and nothing else in the file moves;
  2. a second run adds nothing and leaves the file byte-for-byte unchanged;
  3. a 404 means "not published yet": it is not a failure and later days are not
     invented;
  4. a bulletin that loses a row (serial gap) is not written, and counts as failed;
  5. a network error on one day is a failure for that day only; later days still run.

    python3 scripts/check-refresh-cpcb.py
"""
import gzip
import importlib.util
import sys
import tempfile
import urllib.error
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location('refresh', ROOT / 'scripts' / 'refresh-cpcb-bulletins.py')
refresh = importlib.util.module_from_spec(spec)
spec.loader.exec_module(refresh)
real = refresh.load_fetcher()

FAILS = []


def check(ok, what):
    print(('ok   ' if ok else 'FAIL ') + what)
    if not ok:
        FAILS.append(what)


GOOD = ('Air Quality Index on Oct 20 , 2026 @ 4 PM\n'
        '1 Agra Satisfactory 63 PM2.5, PM10 6/6\n'
        '2 Delhi Poor 200 PM2.5 30/30\n'
        '3 Aurangabad (Maharashtra) Moderate 120 PM10 3/3\n')
GAP = ('Air Quality Index on Oct 21 , 2026 @ 4 PM\n'
       '1 Agra Satisfactory 63 PM2.5 6/6\n'
       '3 Aurangabad Moderate 120 PM10 3/3\n'
       '4 Delhi Poor 200 PM2.5 30/30\n'
       '5 Kanpur Poor 210 PM2.5 3/3\n'
       '6 Lucknow Poor 220 PM2.5 3/3\n'
       '7 Patna Poor 230 PM2.5 3/3\n'
       '8 Pune Good 20 PM2.5 3/3\n'
       '9 Thane Good 25 PM2.5 3/3\n')


class Fake:
    """Stands in for fetch-cpcb-bulletin.py: real parse, scripted fetch."""
    parse = staticmethod(real.parse)

    def __init__(self, script):
        self.script = script

    def fetch(self, ymd):
        what = self.script.get(ymd, 404)
        if what == 404:
            raise urllib.error.HTTPError('u', 404, 'nf', {}, None)
        if isinstance(what, Exception):
            raise what
        return what.encode()

    @staticmethod
    def text_of(raw):
        return raw.decode()


def seed(path):
    refresh.write_daily(path, [
        {'date': '2026-10-18', 'city': 'Agra', 'aqi_category': 'Good', 'aqi': '40',
         'prominent_pollutant': 'PM2.5', 'stations_participated': '6', 'stations_total': '6'},
        {'date': '2026-10-19', 'city': 'Agra', 'aqi_category': 'Good', 'aqi': '45',
         'prominent_pollutant': 'PM2.5', 'stations_participated': '6', 'stations_total': '6'},
    ])


with tempfile.TemporaryDirectory() as tmp:
    p = Path(tmp) / 'd.csv.gz'
    quiet = lambda *_: None

    # 1 and 2: a good day is appended; a second run changes nothing.
    seed(p)
    added, failed = refresh.refresh(p, today=date(2026, 10, 20), fetcher=Fake({'20261020': GOOD}), log=quiet)
    rows = refresh.read_daily(p)
    check(added == ['2026-10-20'] and not failed, 'a published day is added')
    check([r['date'] for r in rows] == ['2026-10-18', '2026-10-19'] + ['2026-10-20'] * 3, 'rows stay in date order')
    check(rows[0]['aqi'] == '40' and rows[1]['aqi'] == '45', 'earlier rows are untouched')
    check(any(r['city'] == 'Aurangabad (Maharashtra)' and r['prominent_pollutant'] == 'PM10' for r in rows),
          'a city with a bracketed state parses whole')
    before = p.read_bytes()
    added, failed = refresh.refresh(p, today=date(2026, 10, 20), fetcher=Fake({'20261020': GOOD}), log=quiet)
    check(not added and not failed and p.read_bytes() == before, 'a second run adds nothing and writes nothing')

    # 3: a 404 for today is "not published yet".
    seed(p)
    added, failed = refresh.refresh(p, today=date(2026, 10, 21), fetcher=Fake({'20261020': GOOD}), log=quiet)
    check(added == ['2026-10-20'] and not failed, 'a 404 on the newest day is not a failure')

    # 4: a bulletin that loses a row is not written.
    seed(p)
    before = p.read_bytes()
    added, failed = refresh.refresh(p, today=date(2026, 10, 21), fetcher=Fake({'20261020': 404, '20261021': GAP}), log=quiet)
    check(not added and failed == ['2026-10-21'], 'a bulletin with a serial gap is refused')
    check(p.read_bytes() == before, 'and the file is left as it was')

    # 5: one network failure does not stop the later days.
    seed(p)
    added, failed = refresh.refresh(
        p, today=date(2026, 10, 21),
        fetcher=Fake({'20261020': OSError('connection reset'), '20261021': GOOD}), log=quiet)
    check(failed == ['2026-10-20'] and added == ['2026-10-21'], 'a reset on one day fails that day only')

    # dry run writes nothing.
    seed(p)
    before = p.read_bytes()
    added, _ = refresh.refresh(p, today=date(2026, 10, 20), fetcher=Fake({'20261020': GOOD}), dry_run=True, log=quiet)
    check(added == ['2026-10-20'] and p.read_bytes() == before, '--dry-run reports but writes nothing')

# The committed file itself must be readable and end where the build expects.
rows = refresh.read_daily(refresh.DAILY)
check(bool(rows) and set(rows[0]) == set(refresh.FIELDS), 'the committed 2026 file has the expected columns')

print()
print('FAIL: %d check(s)' % len(FAILS) if FAILS else 'All checks passed.')
sys.exit(1 if FAILS else 0)
