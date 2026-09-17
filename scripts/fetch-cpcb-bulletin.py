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

## The page-header collision

Every page carries the header `Air Quality Index on Jan 21 , 2026 @ 4 PM`, in
which the day of the month is a bare token. When that number equals the serial
of the row that follows a page break, the scanner matched the header instead of
the row, failed the grammar, and moved on to the next serial: the real row was
never read. Page two begins near serial 21 in the 2026 layout and near serial 15
in the 2025 one, so it bit on the 21st of all eight months of 2026 fetched
(Baddi, Badlapur and six others) and on 2025-11-15 (Arrah), which is the date
this parser was originally checked against. The check recorded 249 rows and
agreed with an independent extraction at 249; the correct figure is 250.

A serial match is therefore a candidate, not a row. One that fails the grammar
advances the scan without advancing the expected serial, and a serial is given
up only after the whole remaining document has been searched. `MAX_MISS`
consecutive misses mean the table has ended rather than that rows were lost.

## What it refuses to do

**It does not guess a missing field.** A row that does not complete the grammar
is collected in `skipped` and reported, never half-written. The count of skipped
rows is the check: CPCB's own serial numbers run 1..N without gaps, so a parse
that drops rows shows up as a gap in the sequence rather than as silence.

**Silence is the failure mode, so a lossy parse now exits non-zero** and the
backfill summary names the days. It did not before, and eight damaged files sat
inside a 259-day run whose closing line read `259 fetched, 0 failed`. Each of
those files already carried `serial_gaps: [21]`. Writing a fault down is not
the same as reporting it.

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
# Consecutive missing serials that mean the table has ended rather than that a
# row was lost. CPCB's tables are contiguous; five in a row is not a gap.
MAX_MISS = 5


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
    # `cursor` is where the last committed row ended; `i` scans ahead of it for
    # the next plausible candidate. `pending` holds why the most recent
    # candidate for a serial failed, and is only promoted to `skipped` once the
    # whole remaining document has been searched without that serial parsing.
    i = cursor = 0
    expect = 1
    pending = {}
    # Serials skipped since the last committed row. They are only real gaps if
    # a later row commits; otherwise they are the end of the table.
    trailing = []
    misses = 0
    while i < len(toks):
        if toks[i] != str(expect):
            i += 1
            # Scanned to the end without parsing this serial. Either CPCB
            # genuinely dropped it mid-table, or the table has simply ended.
            # Try the next serial from where the last real row finished; give
            # up after MAX_MISS consecutive serials fail, which is the end of
            # the table. Without that bound the loop records a skip for every
            # number up to the token count: a first version of this fix
            # reported 2,104 skipped rows on a 248-row bulletin, which would
            # have destroyed the one field that tells you a parse lost data.
            if i >= len(toks):
                misses += 1
                if misses >= MAX_MISS:
                    break
                trailing.append(pending.pop(expect, {'serial': expect, 'why': 'serial not found'}))
                expect += 1
                i = cursor
            continue
        # A bare number matching the expected serial is a CANDIDATE, not a row.
        # Every page header reads "Air Quality Index on Jan 21 , 2026 @ 4 PM",
        # and page two begins around serial 21, so on the 21st of any month that
        # header's bare "21" sits between row 20 and row 21. Committing to the
        # first match dropped exactly one city on the 21st of all eight months
        # of 2026 fetched so far, and would do so every month indefinitely. So a
        # candidate that fails the grammar advances the scan WITHOUT advancing
        # the expected serial: the real row is still ahead.
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
            i += 1
            pending[expect] = {'serial': expect, 'why': 'no category found'}
            continue
        if not re.fullmatch(r'\d{1,4}', toks[j]):
            i += 1
            pending[expect] = {'serial': expect, 'city': ' '.join(city),
                               'why': f'index value not a number: {toks[j]!r}'}
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
            i += 1
            pending[expect] = {'serial': expect, 'city': ' '.join(city),
                               'why': 'no stations fraction'}
            continue
        name = ' '.join(city).replace(' (', ' (').strip(' ,')
        rows.append({
            'serial': expect, 'city': name, 'aqi_category': cat, 'aqi': value,
            'prominent_pollutant': polls,
            'stations_participated': st[0], 'stations_total': st[1],
        })
        pending.pop(expect, None)
        skipped.extend(trailing)
        trailing = []
        misses = 0
        expect += 1
        i = cursor = j
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
    # Days whose parse lost a row. A backfill that does not surface these
    # reports a clean run over damaged data: the page-header collision fixed
    # in v26.6.201 wrote `serial_gaps: [21]` into eight files during a 259-day
    # run whose summary line said nothing but "259 fetched".
    holed = []
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
                if gaps or skipped:
                    holed.append((d.isoformat(), gaps, len(skipped)))
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
    if holed:
        print(f'WARNING - {len(holed)} day(s) lost rows; delete those files and re-run:')
        for day, gaps, nskip in holed[:20]:
            print(f'    {day}: serial gaps {gaps}, {nskip} skipped')
        return 1
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
    # A gap means a city CPCB published is missing from this parse. Reporting it
    # on stdout and exiting 0 is how eight damaged days survived a 259-day run.
    return 1 if (gaps or skipped) else 0


if __name__ == '__main__':
    sys.exit(main())
