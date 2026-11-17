#!/usr/bin/env python3
"""Every city's CPCB bulletin, day by day: bulletins/ and data/bulletin-explorer/.

CPCB's 4 pm bulletin rates about 290 cities a day. JanVayu parses each one
(scripts/refresh-cpcb-bulletins.py) into data/raw/cpcb-bulletins-2026.csv.gz,
and until now only Delhi had a page that showed those days. This writes:

  data/bulletin-explorer/index.json     one row per city: its latest bulletin
  data/bulletin-explorer/<slug>.json    one city: every 2026 day, and the
                                        same calendar window in 2019 to 2025
  bulletins/index.html                  the page that draws them

    python3 scripts/build-bulletin-explorer.py --source <AllIndiaBulletinsMaster2025_openrefined.csv>
    python3 scripts/build-bulletin-explorer.py --check     # offline

## What a city file carries, and what it refuses to

Every 2026 day as CPCB printed it: AQI, category, prominent pollutant, and the
number of stations that reported out of the number the city has. A figure from
2 of 9 stations sits beside one from 9 of 9 and must be read that way, so the
count is never dropped.

For context it counts days in each category over the same calendar window in
earlier years: from 1 October, and from 1 January, to the day of the latest
bulletin. Those are counts drawn from UrbanEmissions.Info's extraction of the
2019 to 2025 PDFs, the derived form this repository already publishes in
data/aqi-bulletins.json. The daily rows of that extraction are not copied here.

Years before 2019 are left out, as on the Delhi page: the number of stations
behind most cities' figure changed too much to set those years beside this one.

No average AQI, here or on the page. AQI reports whichever pollutant scores
worst on the day, so its mean is not a quantity. Days in each category is the
use the index supports.

## What --check holds

  * every 2026 day in every city file equals the CSV row it came from, and
    every city in the CSV has a file (none dropped but the UNRESOLVED row)
  * the 2026 window counts recompute from the CSV
  * each past window's categories add up to its reported days
  * the window ends on the CSV's latest date, so a refresh that forgot this
    script fails rather than showing last week's comparison under today's date
  * index.json and the files on disk agree, slugs are unique and URL-safe
  * the page on disk is the page this script writes
"""
import argparse
import csv
import gzip
import html
import importlib.util
import json
import re
import statistics
import sys
from collections import defaultdict
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DAILY = ROOT / 'data' / 'raw' / 'cpcb-bulletins-2026.csv.gz'
OUT = ROOT / 'data' / 'bulletin-explorer'
PAGE = ROOT / 'bulletins' / 'index.html'
CATS = ['Good', 'Satisfactory', 'Moderate', 'Poor', 'Very Poor', 'Severe']
PAST = list(range(2019, 2026))
YEAR = 2026
MIN_STATIONS = 3          # as in build-aqi-bulletins.py: below this a city-window is thin


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


AQB = load('aqb', ROOT / 'scripts' / 'build-aqi-bulletins.py')


def slug(name):
    s = re.sub(r'[^a-z0-9]+', '-', name.casefold()).strip('-')
    return s or 'city'


def shift(d, y):
    """The same calendar day in year y. 29 February becomes the 28th."""
    try:
        return d.replace(year=y)
    except ValueError:
        return d.replace(year=y, day=28)


def windows(through):
    """(key, label, start) for the two windows that end on `through`."""
    season_year = through.year if through.month >= 10 else through.year - 1
    return [('season', '1 October', date(season_year, 10, 1)),
            ('year', '1 January', date(through.year, 1, 1))]


def count(days):
    """days: list of (category, stations). Counts in CATS order, and median stations."""
    by = [0] * len(CATS)
    for c, _ in days:
        by[CATS.index(c)] += 1
    st = [s for _, s in days if s > 0]
    med = int(statistics.median(st)) if st else 0
    return {'days': len(days), 'by_category': by, 'median_stations': med, 'thin': med < MIN_STATIONS}


def read_2026():
    """{canonical city: [row dict, ...]} from our own parse, filed as the summary files it."""
    rows = list(csv.DictReader(gzip.open(DAILY, 'rt', encoding='utf-8', newline='')))
    names = defaultdict(lambda: defaultdict(int))
    for r in rows:
        c = ' '.join(r['city'].split())
        names[c.casefold()][c] += 1
    known = KNOWN
    per, dropped = defaultdict(list), 0
    for r in rows:
        c = ' '.join(r['city'].split())
        name = AQB.canonical(c.casefold(), names, known)
        if name is None:
            dropped += 1
            continue
        per[name].append(r)
    return per, dropped, max(r['date'] for r in rows)


def known_names():
    """The spellings the 2015-2025 extraction uses, as the summary keeps them."""
    d = json.loads((ROOT / 'data' / 'aqi-bulletins.json').read_text(encoding='utf-8'))
    return {c.casefold(): c for c in d['cities']}, d


KNOWN, SUMMARY = known_names()


def daily_record(r):
    st_p = int(r['stations_participated'] or 0)
    st_t = int(r['stations_total'] or 0)
    aqi = int(r['aqi']) if r['aqi'].strip().isdigit() else None
    return [r['date'], aqi, CATS.index(r['aqi_category']), r['prominent_pollutant'], st_p, st_t]


def city_file(name, rows, through, past):
    rows = sorted(rows, key=lambda r: r['date'])
    out = {'name': name, 'through': through,
           'daily': [daily_record(r) for r in rows if r['aqi_category'] in CATS],
           'windows': {}}
    td = date.fromisoformat(through)
    for key, label, start in windows(td):
        w = {'label': f'{label} to {td.day} {td.strftime("%B")}', 'from': start.isoformat(),
             'to': through, 'years': {}}
        cur = [(r['aqi_category'], int(r['stations_participated'] or 0)) for r in rows
               if start.isoformat() <= r['date'] <= through and r['aqi_category'] in CATS]
        if cur:
            w['years'][str(YEAR)] = count(cur)
        for y in PAST:
            ys, ye = shift(start, start.year - (YEAR - y)), shift(td, y)
            got = [(c, s) for d, c, s in past.get(name, []) if ys.isoformat() <= d <= ye.isoformat()]
            if got:
                w['years'][str(y)] = count(got) | {'from': ys.isoformat(), 'to': ye.isoformat()}
        out['windows'][key] = w
    return out


def read_past(src, through):
    """{city: [(date, category, stations)]} for 2019-2025, inside the windows only."""
    td = date.fromisoformat(through)
    earliest = min(start for _, _, start in windows(td))
    lo = shift(earliest, earliest.year - (YEAR - PAST[0])).isoformat()
    out = defaultdict(list)
    for r in csv.DictReader(open(src, encoding='utf-8', errors='replace')):
        d = (r.get('date') or '')[:10]
        cat = (r.get('aqi_category') or '').strip()
        city = (r.get('city') or '').strip()
        if not (lo <= d < f'{YEAR}-01-01') or cat not in CATS or not city:
            continue
        try:
            st = int(float(r.get('no_stations') or 0))
        except ValueError:
            st = 0
        out[city].append((d, cat, st))
    return out


def index_of(files, through, dropped):
    cities = []
    for s, f in sorted(files.items(), key=lambda kv: kv[1]['name'].casefold()):
        last = f['daily'][-1]
        n = sum(1 for d in f['daily'] if d[0] >= f'{YEAR}-01-01')
        cities.append({'slug': s, 'name': f['name'], 'date': last[0], 'aqi': last[1],
                       'category': CATS[last[2]], 'pollutant': last[3],
                       'stations': f'{last[4]}/{last[5]}', 'days': n})
    return {
        '_meta': {
            'what': ("CPCB's daily AQI bulletin for every city it rates, as printed, with the "
                     'same calendar window in 2019 to 2025 for comparison.'),
            'through': through,
            'categories': CATS,
            'daily_columns': ['date', 'aqi', 'category_index', 'prominent_pollutant',
                              'stations_reported', 'stations_in_city'],
            'source': ("Central Pollution Control Board daily AQI bulletin, 4 pm, average of the past 24 hours. "
                       '2026 is parsed from the published PDFs by JanVayu (scripts/refresh-cpcb-bulletins.py). '
                       'The 2019 to 2025 window counts are counted from UrbanEmissions.Info\'s extraction of the same '
                       'PDFs (github.com/urbanemissionsinfo/AQI_bulletins); only the counts are published here.'),
            'no_average': ('No average AQI is given. The index reports whichever pollutant scores worst on the day, '
                           'so its mean is not a quantity. Days in each category is the use it supports.'),
            'thin_rule': f'a window whose median reporting station count is below {MIN_STATIONS} is marked thin',
            'unresolved_rows_dropped': dropped,
        },
        'cities': cities,
    }


def build(src):
    per, dropped, through = read_2026()
    past = read_past(src, through)
    past = {KNOWN.get(c.casefold(), c): v for c, v in past.items()}
    files = {}
    for name, rows in per.items():
        s = slug(name)
        if s in files:
            sys.exit(f'FAIL - two cities share the slug {s}: {files[s]["name"]} and {name}')
        files[s] = city_file(name, rows, through, past)
    return files, index_of(files, through, dropped)


def dump(obj):
    return json.dumps(obj, ensure_ascii=False, separators=(',', ':')) + '\n'


def write(files, idx):
    OUT.mkdir(parents=True, exist_ok=True)
    keep = {f'{s}.json' for s in files} | {'index.json'}
    for p in OUT.glob('*.json'):
        if p.name not in keep:
            p.unlink()
    for s, f in files.items():
        (OUT / f'{s}.json').write_text(dump(f), encoding='utf-8')
    (OUT / 'index.json').write_text(dump(idx), encoding='utf-8')
    PAGE.parent.mkdir(parents=True, exist_ok=True)
    new = page(idx)
    # scripts/build-share.py owns the block between the share-meta markers; keep it.
    if PAGE.exists():
        old = PAGE.read_text(encoding='utf-8')
        m = re.search(SHARE, old, flags=re.S)
        if m:
            new = re.sub(SHARE, lambda _: m.group(0), new, count=1, flags=re.S)
    PAGE.write_text(new, encoding='utf-8')


SHARE = r'<!-- share-meta:start -->.*?<!-- share-meta:end -->'


def unshared(t):
    return re.sub(SHARE, '', t, flags=re.S)


# ── the page ───────────────────────────────────────────────────────────────

def _stamp():
    m = re.search(r'/styles\.css\?v=(\d+)', (ROOT / 'delhi' / 'index.html').read_text(encoding='utf-8'))
    return m.group(1) if m else '0'


def page(idx):
    e = lambda s: html.escape(str(s), quote=True)
    meta = idx['_meta']
    td = date.fromisoformat(meta['through'])
    through = f'{td.day} {td.strftime("%B %Y")}'
    n = len(idx['cities'])
    stamp = _stamp()
    title = 'Every city in CPCB’s daily AQI bulletin, 2026 | JanVayu'
    desc = (f'CPCB’s 4 pm air quality bulletin for {n} Indian cities, every day of 2026 to {through}, '
            'with the stations behind each figure and the same weeks in 2019 to 2025.')
    options = ''.join(f'<option value="{e(c["slug"])}">{e(c["name"])}</option>' for c in idx['cities'])
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<meta name="keywords" content="CPCB AQI bulletin, city AQI 2026, daily AQI India, air quality by city, AQI calendar, CPCB 4 pm bulletin">
<!-- share-meta:start -->
<!-- share-meta:end -->
<link rel="icon" href="/favicon.svg">
<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "Dataset",
  "name": "CPCB daily AQI bulletin by city, 2026",
  "description": {json.dumps(desc)},
  "url": "https://www.janvayu.in/bulletins/",
  "temporalCoverage": "2026-01-01/{meta['through']}",
  "spatialCoverage": "India",
  "creator": {{ "@type": "Organization", "name": "Central Pollution Control Board" }},
  "publisher": {{ "@type": "Organization", "name": "JanVayu" }},
  "distribution": [{{ "@type": "DataDownload", "encodingFormat": "application/json", "contentUrl": "https://www.janvayu.in/data/bulletin-explorer/index.json" }},
                   {{ "@type": "DataDownload", "encodingFormat": "text/csv", "contentUrl": "https://www.janvayu.in/data/raw/cpcb-bulletins-2026.csv.gz" }}]
}}
</script>
<link rel="stylesheet" href="/styles.css?v={stamp}">
<script>try{{if(localStorage.getItem('janvayu-theme')==='dark')document.documentElement.setAttribute('data-theme','dark');}}catch(e){{}}</script>
<script src="/js/chrome.js?v={stamp}" defer></script>
<script src="/js/bulletin-explorer.js?v={stamp}" defer></script>
<style>
{CSS}
</style>
</head>
<body data-jv-chrome>
<main class="container delhi-page bx" id="main-content">
  <p class="note"><a href="/">JanVayu</a> › CPCB bulletin by city</p>
  <h1>Every city in CPCB’s daily bulletin</h1>
  <p class="lede">Each day at 4 pm the Central Pollution Control Board publishes one air quality figure for each of about 290 cities. This page shows every one of those figures for 2026, city by city, to {through}.</p>
  <p class="asof">Updated from CPCB’s bulletin each day. The figures run to <span data-bx="through">{through}</span> for {n} cities.</p>

  <div class="bx-controls">
    <label for="bx-city">City</label>
    <select id="bx-city">{options}</select>
    <label for="bx-pollutant">Prominent pollutant</label>
    <select id="bx-pollutant"><option value="">Any</option></select>
  </div>

  <div id="bx-out" aria-live="polite">
    <noscript><p>The charts need JavaScript. Every figure is in <a href="/data/bulletin-explorer/index.json">the index</a> and one file per city in <a href="/data/bulletin-explorer/">data/bulletin-explorer/</a>, and the full daily table is <a href="/data/raw/cpcb-bulletins-2026.csv.gz">the 2026 bulletin file</a>.</p></noscript>
  </div>

  <h2>How to read it</h2>
  <p>The figure for a day is CPCB’s city index for the 24 hours to 4 pm, from the stations that reported. The station count beside it says how many reported out of how many the city has. A figure from one station describes one place with a city’s name on it, and a day when half the stations were silent cannot be set beside a full day without saying so.</p>
  <p>The index reports whichever pollutant scores worst on the day, so the page counts days in each category and gives no average. The comparison counts the same calendar days in 2019 to 2025. Earlier years are left out because the number of stations behind most cities changed too much to compare. A different count of days reported in a year is shown, not filled in.</p>
  <p>Comparing one window with the same window in another year shows what the bulletin recorded. It does not say why one year differed from another: weather alone moves these counts a long way.</p>

  <h2>Sources</h2>
  <ul class="sources">
    <li>Central Pollution Control Board, National Air Quality Index daily bulletin, published as a PDF each day at 4 pm. JanVayu parses every 2026 bulletin; the table is <a href="/data/raw/cpcb-bulletins-2026.csv.gz">data/raw/cpcb-bulletins-2026.csv.gz</a>.</li>
    <li>For 2019 to 2025, UrbanEmissions.Info’s extraction of the same PDFs, <a href="https://github.com/urbanemissionsinfo/AQI_bulletins">github.com/urbanemissionsinfo/AQI_bulletins</a>, which also has its own <a href="https://urbanemissionsinfo.github.io/AQI_bulletins/">explorer and SQL playground</a>. This page publishes only the counts made from it. Comparing that extraction with JanVayu’s for the 297 days of 2026 both hold found one date where JanVayu had filed the wrong day’s bulletin, now corrected.</li>
    <li>Full-year counts for every city since 2015 are in <a href="/data/aqi-bulletins.json">data/aqi-bulletins.json</a>.</li>
  </ul>
</main>
<footer class="container delhi-foot">
  <p>Written by <a href="/">JanVayu</a>. Built by <code>scripts/build-bulletin-explorer.py</code>.</p>
</footer>
</body>
</html>
'''


CSS = """  .delhi-page { max-width: 920px; }
  .delhi-page h1 { font-family: var(--serif); font-size: clamp(1.8rem, 4vw, 2.8rem); line-height: 1.15; margin: 24px 0 12px; }
  .delhi-page h2 { font-family: var(--serif); font-size: 1.5rem; margin: 40px 0 12px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }
  .delhi-page h3 { font-size: 1.1rem; margin: 28px 0 8px; }
  .delhi-page .lede { font-size: 1.15rem; color: var(--text-2); margin-bottom: 12px; }
  .delhi-page .asof { font-size: 0.9rem; color: var(--text-3); margin-bottom: 24px; }
  .delhi-page p, .delhi-page li { line-height: 1.7; }
  .delhi-page p { margin: 0 0 1em; }
  .delhi-page .wrap { overflow-x: auto; margin: 12px 0; }
  .delhi-page table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
  .delhi-page th, .delhi-page td { padding: 8px 10px; text-align: left; vertical-align: top; border-bottom: 1px solid var(--border); }
  .delhi-page th { font-size: 0.8rem; color: var(--text-3); font-weight: 600; }
  .delhi-page td.num, .delhi-page th.num { font-family: var(--mono); text-align: right; white-space: nowrap; }
  .delhi-page .note { font-size: 0.85rem; color: var(--text-3); margin-top: 8px; }
  .delhi-page .sources li { font-size: 0.88rem; margin-bottom: 6px; }
  .delhi-page .facts { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin: 18px 0; }
  .delhi-page .fact { padding: 12px 14px; background: var(--bg-section); border: 1px solid var(--border); }
  .delhi-page .fact b { display: block; font-family: var(--serif); font-size: 1.9rem; line-height: 1.1; }
  .delhi-page .fact span { font-size: 0.82rem; color: var(--text-3); }
  .delhi-page a { color: var(--accent); }
  .bx-controls { display: grid; grid-template-columns: auto 1fr; gap: 8px 12px; align-items: center; max-width: 520px; margin: 8px 0 20px; }
  .bx-controls label { font-size: 0.9rem; font-weight: 600; }
  .bx-controls select { font: inherit; padding: 8px 10px; border: 1px solid var(--border); background: var(--bg); color: var(--text); min-height: 44px; }
  .bx .jv-dgm { background: #fbfaf7; border: 1px solid var(--border); padding: 6px; margin: 12px 0; }
  .bx .jv-dgm { overflow-x: auto; }
  .bx .jv-dgm svg { display: block; width: 100%; min-width: 620px; height: auto; }
  .bx .jv-dgm:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  .bx table th, .bx table td { white-space: nowrap; }
  .bx .key { display: flex; flex-wrap: wrap; gap: 6px 14px; font-size: 0.82rem; color: var(--text-2); margin: 6px 0 0; padding: 0; list-style: none; }
  .bx .key i { display: inline-block; width: 12px; height: 12px; margin-right: 5px; vertical-align: -1px; }
  @media (max-width: 640px) {
    .delhi-page h2 { font-size: 1.3rem; margin-top: 32px; }
    .delhi-page table th, .delhi-page table td { padding: 6px 4px; font-size: 0.8rem; line-height: 1.4; }
    .delhi-page td.num { white-space: normal; }
  }
  .delhi-foot { padding: 32px 0; color: var(--text-3); font-size: 0.85rem; border-top: 1px solid var(--border); margin-top: 48px; }
  .delhi-foot a { color: var(--accent); text-decoration: underline; text-underline-offset: 2px; }"""


# ── check ──────────────────────────────────────────────────────────────────

def check():
    fails = []
    per, dropped, through = read_2026()
    idx_path = OUT / 'index.json'
    if not idx_path.exists():
        print('FAIL - data/bulletin-explorer/index.json is missing; run with --source')
        return 1
    idx = json.loads(idx_path.read_text(encoding='utf-8'))
    if idx['_meta']['through'] != through:
        fails.append(f"index says through {idx['_meta']['through']}, the CSV runs to {through}: rebuild")
    on_disk = {p.stem for p in OUT.glob('*.json')} - {'index'}
    listed = {c['slug'] for c in idx['cities']}
    if on_disk != listed:
        fails.append(f'files and index disagree: {sorted(on_disk ^ listed)[:6]}')
    want = {slug(n) for n in per}
    if listed != want:
        fails.append(f'cities in the CSV and the index differ: {sorted(listed ^ want)[:6]}')
    if idx['_meta']['unresolved_rows_dropped'] != dropped:
        fails.append('dropped-row count does not match the CSV')
    for c in idx['cities']:
        if not re.fullmatch(r'[a-z0-9-]+', c['slug']):
            fails.append(f'slug not URL-safe: {c["slug"]}')
    for name, rows in per.items():
        s = slug(name)
        p = OUT / f'{s}.json'
        if not p.exists():
            continue
        f = json.loads(p.read_text(encoding='utf-8'))
        want_daily = [daily_record(r) for r in sorted(rows, key=lambda r: r['date']) if r['aqi_category'] in CATS]
        if f['daily'] != want_daily:
            fails.append(f'{s}: daily rows differ from the CSV')
            continue
        for key, w in f['windows'].items():
            if w['to'] != through:
                fails.append(f'{s}: {key} window ends {w["to"]}, not {through}')
            for y, v in w['years'].items():
                if sum(v['by_category']) != v['days']:
                    fails.append(f'{s} {key} {y}: categories add to {sum(v["by_category"])}, days {v["days"]}')
            cur = [(r['aqi_category'], int(r['stations_participated'] or 0)) for r in rows
                   if w['from'] <= r['date'] <= through and r['aqi_category'] in CATS]
            if cur and w['years'].get(str(YEAR)) != count(cur):
                fails.append(f'{s} {key}: 2026 window does not recompute from the CSV')
        bad = [k for k in f['windows'].get('season', {}).get('years', {}) if int(k) < PAST[0]]
        if bad:
            fails.append(f'{s}: years before {PAST[0]} present: {bad}')
    if unshared(PAGE.read_text(encoding='utf-8')) != unshared(page(idx)):
        fails.append('bulletins/index.html is not the page the data produces: rebuild')
    if 'average' in json.dumps(idx['cities']).lower():
        fails.append('an average crept into the index')
    if fails:
        print('FAIL')
        for x in fails[:20]:
            print('  ' + x)
        return 1
    print(f'PASS - {len(idx["cities"])} cities through {through}, every day equal to the CSV, '
          f'windows add up, page current.')
    return 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--source', help='AllIndiaBulletinsMaster2025_openrefined.csv from urbanemissionsinfo/AQI_bulletins')
    ap.add_argument('--check', action='store_true')
    a = ap.parse_args()
    if a.check:
        return check()
    if not a.source:
        print('need --source (or --check)')
        return 2
    files, idx = build(a.source)
    write(files, idx)
    print(f'wrote {len(files)} city files, data/bulletin-explorer/index.json and bulletins/index.html, '
          f'through {idx["_meta"]["through"]}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
