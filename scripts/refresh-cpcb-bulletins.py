#!/usr/bin/env python3
"""Add the days CPCB has published since the last one in the committed 2026 file.

`data/raw/cpcb-bulletins-2026.csv.gz` holds one row per city per day, parsed from
CPCB's own daily AQI bulletin PDF by `scripts/fetch-cpcb-bulletin.py`. It stopped
at 19 October 2026 because nothing ran the fetch again: the agent environment
that did the earlier fetches cannot verify cpcb.nic.in's certificate chain, and
nobody else was running it. `.github/workflows/cpcb-bulletins.yml` runs this on
GitHub's runners every day and opens a pull request when it adds days.

What this does, and what it refuses to do:

- It starts the day after the last date in the file and goes to today (India
  time). The bulletin for a day appears at 4 pm, so a 404 for the last day or
  two means "not published yet", not an error, and ends the run quietly.
- A day is written only if the whole bulletin parsed: no serial gaps and no
  skipped rows. A day that does not parse is reported and left out, never
  half-written. The exit status is then 1, so the workflow fails visibly.
- A day already in the file is never rewritten, so running it twice adds nothing.
- Days must stay in order. If a day cannot be fetched, later days are still
  fetched, and the missing day shows up as a gap in the dates, which the build
  already counts as "days reported" rather than assuming.

    python3 scripts/refresh-cpcb-bulletins.py            # fetch and append
    python3 scripts/refresh-cpcb-bulletins.py --dry-run  # say what it would add
"""
import argparse
import csv
import gzip
import importlib.util
import io
import sys
import urllib.error
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DAILY = ROOT / 'data' / 'raw' / 'cpcb-bulletins-2026.csv.gz'
FIELDS = ['date', 'city', 'aqi_category', 'aqi', 'prominent_pollutant',
          'stations_participated', 'stations_total']
IST = timezone(timedelta(hours=5, minutes=30))


def load_fetcher():
    """The fetch script has a hyphen in its name, so it is loaded by path."""
    spec = importlib.util.spec_from_file_location(
        'fetch_cpcb_bulletin', ROOT / 'scripts' / 'fetch-cpcb-bulletin.py')
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def read_daily(path):
    with gzip.open(path, 'rt', encoding='utf-8', newline='') as fh:
        return list(csv.DictReader(fh))


def write_daily(path, rows):
    buf = io.StringIO()
    w = csv.DictWriter(buf, fieldnames=FIELDS, lineterminator='\n')
    w.writeheader()
    w.writerows(rows)
    # mtime=0 so the same rows always give the same bytes, and a no-op run
    # leaves git with nothing to commit.
    with open(path, 'wb') as raw:
        with gzip.GzipFile(fileobj=raw, mode='wb', mtime=0) as gz:
            gz.write(buf.getvalue().encode('utf-8'))


def to_row(day, r):
    return {
        'date': day,
        'city': r['city'],
        'aqi_category': r['aqi_category'],
        'aqi': r['aqi'],
        'prominent_pollutant': '|'.join(r['prominent_pollutant']),
        'stations_participated': r['stations_participated'],
        'stations_total': r['stations_total'],
    }


def days_to_try(last, today):
    d = last + timedelta(days=1)
    while d <= today:
        yield d
        d += timedelta(days=1)


def refresh(path=DAILY, today=None, fetcher=None, dry_run=False, log=print):
    """Returns (days_added, days_failed). `fetcher` is injectable for the test."""
    f = fetcher or load_fetcher()
    rows = read_daily(path)
    have = {r['date'] for r in rows}
    last = datetime.strptime(max(have), '%Y-%m-%d').date()
    today = today or datetime.now(IST).date()
    added, failed = [], []
    for d in days_to_try(last, today):
        day = d.isoformat()
        if day in have:
            continue
        try:
            raw = f.fetch(d.strftime('%Y%m%d'))
        except urllib.error.HTTPError as e:
            if e.code == 404:
                log(f'{day}: not published (404)')
                continue
            log(f'{day}: FAILED, HTTP {e.code}')
            failed.append(day)
            continue
        except Exception as e:                      # reset, timeout, certificate
            log(f'{day}: FAILED, {type(e).__name__}: {e}')
            failed.append(day)
            continue
        parsed, skipped = f.parse(f.text_of(raw))
        serials = {r['serial'] for r in parsed}
        gaps = [n for n in range(1, max(serials, default=0) + 1) if n not in serials]
        if not parsed or gaps or skipped:
            log(f'{day}: NOT WRITTEN, {len(parsed)} rows, serial gaps {gaps[:8]}, '
                f'{len(skipped)} skipped')
            failed.append(day)
            continue
        log(f'{day}: {len(parsed)} cities')
        added.append(day)
        rows.extend(to_row(day, r) for r in parsed)
    if added and not dry_run:
        rows.sort(key=lambda r: r['date'])           # stable: keeps CPCB's serial order
        write_daily(path, rows)
    return added, failed


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry-run', action='store_true')
    a = ap.parse_args()
    added, failed = refresh(dry_run=a.dry_run)
    print(f'{len(added)} day(s) added' + (f': {added[0]} to {added[-1]}' if added else '')
          + (f'; {len(failed)} failed: {failed}' if failed else ''))
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main())
