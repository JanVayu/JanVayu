#!/usr/bin/env python3
"""data/cpcb-latest.json: the last three days of CPCB's daily bulletin, per city.

This is the second link in the live-reading chain (js/air-sources.js). When WAQI
has no recent station near a place, the site can still say what CPCB's own daily
bulletin recorded for the nearest tracked city, with the date, the scale and how
many of its stations reported. It is a daily figure and is labelled as one; it is
never shown as live.

Why it exists: on 8 November 2026 WAQI's feeds for most Indian cities outside
Delhi-NCR turned out to be frozen (Bengaluru's last reading was 23 June), so the
site showed no reading for them while CPCB's bulletin had a figure for every one of
those days (Bengaluru 5 November: AQI 62, Satisfactory, 8 of 14 stations).

    python3 scripts/build-cpcb-latest.py            # write
    python3 scripts/build-cpcb-latest.py --check    # fail if the file is stale

Source: data/raw/cpcb-bulletins-2026.csv.gz (CPCB daily AQI bulletins; the
cpcb-bulletins workflow keeps it current). Bulletin city names are not consistent
about case ("Gurugram" and "gurugram" both occur), so cities are keyed by their
name with everything but letters and digits removed, lower-cased.
"""
import csv
import gzip
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'data' / 'raw' / 'cpcb-bulletins-2026.csv.gz'
OUT = ROOT / 'data' / 'cpcb-latest.json'
DAYS = 3


def key(name):
    return re.sub(r'[^a-z0-9]', '', name.lower())


def build():
    cities = {}
    with gzip.open(SRC, 'rt', encoding='utf-8') as f:
        rd = csv.DictReader(f)
        for r in rd:
            try:
                aqi = int(float(r['aqi']))
            except (ValueError, TypeError):
                continue
            k = key(r['city'])
            if not k:
                continue
            c = cities.setdefault(k, {'name': r['city'], 'days': {}})
            # Prefer the capitalised spelling for display.
            if r['city'][:1].isupper() and not c['name'][:1].isupper():
                c['name'] = r['city']
            c['days'][r['date']] = {
                'date': r['date'],
                'aqi': aqi,
                'category': r['aqi_category'],
                'stations': int(r['stations_participated'] or 0),
                'stations_total': int(r['stations_total'] or 0),
            }
    out_cities = {}
    latest = ''
    for k, c in sorted(cities.items()):
        days = sorted(c['days'].values(), key=lambda d: d['date'], reverse=True)[:DAYS]
        out_cities[k] = {'name': c['name'], 'days': days}
        latest = max(latest, days[0]['date'])
    return {
        '_meta': {
            'what': "The last three days of each city's AQI in CPCB's daily bulletin.",
            'source': "Central Pollution Control Board daily AQI bulletins (cpcb.gov.in), parsed into data/raw/cpcb-bulletins-2026.csv.gz.",
            'scale': 'CPCB AQI: Good 0-50, Satisfactory 51-100, Moderate 101-200, Poor 201-300, Very Poor 301-400, Severe 401+. Not the US AQI that WAQI reports.',
            'as_of': latest,
            'note': "A city-wide daily figure, published about a day late. Never present it as a live reading.",
        },
        'cities': out_cities,
    }


def main():
    text = json.dumps(build(), ensure_ascii=False, separators=(',', ':')) + '\n'
    if '--check' in sys.argv:
        if not OUT.exists() or OUT.read_text(encoding='utf-8') != text:
            print('FAIL: data/cpcb-latest.json is stale. Run python3 scripts/build-cpcb-latest.py')
            sys.exit(1)
        print('PASS: data/cpcb-latest.json matches the bulletin file')
        return
    OUT.write_text(text, encoding='utf-8')
    d = json.loads(text)
    print('wrote', OUT.relative_to(ROOT), '|', len(d['cities']), 'cities | as of', d['_meta']['as_of'], '|', len(text) // 1024, 'KB')


if __name__ == '__main__':
    main()
