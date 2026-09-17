#!/usr/bin/env python3
"""Parse CPCB's own daily AQI bulletin PDF, from the primary source.

CPCB publishes the bulletin at
`https://cpcb.nic.in/upload/Downloads/AQI_Bulletin_YYYYMMDD.pdf` every day at
4pm. Reading it ourselves rather than a third party's extraction does three
things: it is the primary source, so there is no question about whose licence
covers the figures; it is current, where a published archive stops where its
author stopped; and it carries a field the archives drop, **stations
participated out of stations total**, which is an accountability fact in itself.

## The layouts

There are at least two, and a parser written against one silently produces
nothing on the other. On 2026-09-16 a row arrives as a single line:

    2 Agra Satisfactory 63 PM2.5, SO2, PM10 6/6

On 2026-01-01 the same row arrives one cell per line. A multi-line city name
breaks both, and does so in the middle of a row:

    19 Aurangabad
    (Maharashtra)
    Satisfactory
    57
    CO, PM10
    3/3

So this does not parse lines. It tokenises the whole document and walks a row
grammar: a serial number, then city words until a category appears, then the
index value, then pollutants until the stations fraction. That is layout-blind
by construction, which is the point.

## What it refuses to do

**It does not guess a missing field.** A row that does not complete the grammar
is collected in `skipped` and reported, never half-written. The count of skipped
rows is the check: CPCB's own serial numbers run 1..N without gaps, so a parse
that drops rows shows up as a gap in the sequence rather than as silence.

    python3 scripts/fetch-cpcb-bulletin.py --date 2026-09-16
    python3 scripts/fetch-cpcb-bulletin.py --date 2026-09-16 --out /tmp/x.json
"""
import argparse
import json
import re
import sys
import time
import urllib.error
import urllib.request
from datetime import date, datetime
from pathlib import Path

URL = 'https://cpcb.nic.in/upload/Downloads/AQI_Bulletin_{ymd}.pdf'

CATEGORIES = ['Good', 'Satisfactory', 'Moderate', 'Poor', 'Very Poor', 'Severe']
# "Very Poor" is two tokens and must be tried before "Poor".
CAT_TOKENS = sorted(CATEGORIES, key=lambda c: -len(c.split()))
POLLUTANTS = {'PM2.5', 'PM10', 'NO2', 'SO2', 'CO', 'O3', 'OZONE', 'NH3', 'PB'}
STATIONS = re.compile(r'^(\d+)\s*/\s*(\d+)$')


def fetch(ymd, tries=4):
    """Fetch one bulletin, with retries.

    cpcb.nic.in redirects to cpcb.gov.in and the handshake on that hop is reset
    often enough that a single attempt is not a fair test of whether a date
    exists. A reset is not a 404 and must not be reported as one.
    """
    url = URL.format(ymd=ymd)
    last = None
    for attempt in range(tries):
        try:
            req = urllib.request.Request(url, headers={
                # A descriptive agent, for the same reason the XKDR loader has one.
                'User-Agent': 'JanVayu/1.0 (+https://janvayu.in; air-quality research)',
            })
            with urllib.request.urlopen(req, timeout=90) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code == 404:
                raise                      # genuinely not published
            last = e
        except Exception as e:             # reset, timeout, DNS
            last = e
        if attempt < tries - 1:
            time.sleep(2 ** attempt)
    raise RuntimeError(f'{url}: {type(last).__name__}: {last}')


def text_of(pdf_bytes):
    import pypdf
    import io
    reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
    return '\n'.join(p.extract_text() or '' for p in reader.pages)


def parse(text):
    """Walk the row grammar over tokens; layout-blind by construction."""
    # Normalise the stations fraction so it is always one token, and split the
    # pollutant list so a comma never fuses onto a word.
    text = re.sub(r'(\d+)\s*/\s*(\d+)', r' \1/\2 ', text)
    toks = [t for t in re.split(r'[\s]+', text.replace(',', ' , ')) if t]

    rows, skipped = [], []
    i, expect = 0, 1
    while i < len(toks):
        if toks[i] != str(expect):
            i += 1
            continue
        j = i + 1
        city = []
        cat = None
        # City words until a category token appears.
        while j < len(toks) and cat is None and len(city) < 8:
            for c in CAT_TOKENS:
                parts = c.split()
                if toks[j:j + len(parts)] == parts:
                    cat, j = c, j + len(parts)
                    break
            if cat is None:
                city.append(toks[j])
                j += 1
        if cat is None or j >= len(toks):
            skipped.append({'serial': expect, 'why': 'no category found'})
            expect += 1
            i += 1
            continue
        if not re.fullmatch(r'\d{1,4}', toks[j]):
            skipped.append({'serial': expect, 'city': ' '.join(city), 'why': f'index value not a number: {toks[j]!r}'})
            expect += 1
            i += 1
            continue
        value = int(toks[j]); j += 1
        polls, st = [], None
        while j < len(toks) and len(polls) < 12:
            m = STATIONS.match(toks[j])
            if m:
                st = (int(m.group(1)), int(m.group(2)))
                j += 1
                break
            if toks[j] != ',' and toks[j].upper().rstrip('.') in POLLUTANTS:
                polls.append(toks[j].rstrip('.'))
            elif toks[j] != ',':
                break
            j += 1
        if st is None:
            skipped.append({'serial': expect, 'city': ' '.join(city), 'why': 'no stations fraction'})
            expect += 1
            i += 1
            continue
        name = ' '.join(city).replace(' (', ' (').strip(' ,')
        rows.append({
            'serial': expect, 'city': name, 'aqi_category': cat, 'aqi': value,
            'prominent_pollutant': polls,
            'stations_participated': st[0], 'stations_total': st[1],
        })
        expect += 1
        i = j
    return rows, skipped


def backfill(start, end, outdir):
    """One file per day over a range, resumable and polite.

    Resumable because a run of several hundred fetches through a proxy that
    resets will not finish first time, and starting again from the beginning
    would hammer CPCB for files already on disk. A day that 404s is recorded as
    absent so it is not retried forever: CPCB does not publish every day.
    """
    if not outdir:
        print('--from/--to needs --outdir'); return 2
    out = Path(outdir)
    out.mkdir(parents=True, exist_ok=True)
    d = datetime.strptime(start, '%Y-%m-%d').date()
    last = datetime.strptime(end, '%Y-%m-%d').date()
    if last > date.today():
        last = date.today()
    got = miss = have = fail = 0
    while d <= last:
        f = out / f'{d.isoformat()}.json'
        absent = out / f'{d.isoformat()}.absent'
        if f.exists() or absent.exists():
            have += 1
            d = d.fromordinal(d.toordinal() + 1)
            continue
        try:
            rows, skipped = parse(text_of(fetch(d.strftime('%Y%m%d'))))
            if not rows:
                absent.write_text('parsed no rows\n', encoding='utf-8')
                miss += 1
            else:
                serials = [r['serial'] for r in rows]
                gaps = [n for n in range(1, max(serials) + 1) if n not in set(serials)]
                f.write_text(json.dumps({
                    'date': d.isoformat(), 'cities': len(rows),
                    'skipped': len(skipped), 'serial_gaps': gaps, 'rows': rows,
                }, ensure_ascii=False) + '\n', encoding='utf-8')
                got += 1
        except urllib.error.HTTPError as e:
            if e.code == 404:
                absent.write_text('404\n', encoding='utf-8')
                miss += 1
            else:
                fail += 1
        except Exception:
            fail += 1
        time.sleep(1.0)      # do not hammer a government server
        d = d.fromordinal(d.toordinal() + 1)
    print(f'{start}..{last}: {got} fetched, {have} already on disk, '
          f'{miss} not published, {fail} failed (re-run to retry those)')
    return 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--date', help='YYYY-MM-DD')
    ap.add_argument('--from', dest='start', help='YYYY-MM-DD, inclusive')
    ap.add_argument('--to', dest='end', help='YYYY-MM-DD, inclusive')
    ap.add_argument('--outdir', help='one JSON per day, skipping days already written')
    ap.add_argument('--out')
    a = ap.parse_args()
    if a.start and a.end:
        return backfill(a.start, a.end, a.outdir)
    if not a.date:
        print('need --date, or --from/--to with --outdir'); return 2
    d = datetime.strptime(a.date, '%Y-%m-%d').date()
    if d > date.today():
        print(f'FAIL - {a.date} is in the future'); return 2
    raw = fetch(d.strftime('%Y%m%d'))
    rows, skipped = parse(text_of(raw))
    if not rows:
        print(f'FAIL - parsed no rows from the {a.date} bulletin'); return 1
    serials = [r['serial'] for r in rows]
    gaps = [n for n in range(1, max(serials) + 1) if n not in set(serials)]
    out = {
        '_meta': {
            'date': a.date,
            'source': URL.format(ymd=d.strftime('%Y%m%d')),
            'source_note': ('Central Pollution Control Board, National Air Quality Index '
                            'daily bulletin, 4 PM, average of the past 24 hours. Parsed '
                            'from the published PDF.'),
            'cities': len(rows),
            'skipped': len(skipped),
            'serial_gaps': gaps,
        },
        'rows': rows,
        'skipped_rows': skipped,
    }
    if a.out:
        Path(a.out).write_text(json.dumps(out, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f'{a.date}: {len(rows)} cities, {len(skipped)} skipped, '
          f'{len(gaps)} gap(s) in CPCB\'s own serial numbering'
          + (f' {gaps[:8]}' if gaps else ''))
    thin = sum(1 for r in rows if r['stations_total'] <= 1)
    short = sum(1 for r in rows if r['stations_participated'] < r['stations_total'])
    print(f'  {thin} cities with a single station; {short} where fewer stations '
          f'reported than the city has')
    return 0


if __name__ == '__main__':
    sys.exit(main())
