#!/usr/bin/env python3
"""Delhi's air by calendar month, from CPCB's own daily bulletins.

Until October 2026 the homepage's pollution calendar and its seasonal chart
drew Delhi's year from twelve numbers typed into app.js and labelled
"illustrative working values" in a tooltip a phone never shows. They were
wrong where it mattered: they put April to June at AQI 120, 110 and 90, when
CPCB's bulletins average a little over 200 in April and May. That is the
pre-monsoon dust season, and the illustrative curve erased it.

This replaces them with a count, in keeping with the rule in
`data/aqi-bulletins.json` (`_meta.no_annual_mean`): AQI is an index of
whichever pollutant scores worst that day, so averaging it is not a quantity,
and the legitimate use of a daily index is counting days in each category.
For each calendar month this gives the share of days CPCB rated Poor or worse
(AQI above 200), and Severe, pooled over 2016 to 2025.

Pooling ten years is a seasonal profile and not a trend. Delhi's monitoring
network grew from 5 stations to 43 over the window (`station_stability` in
aqi-bulletins.json), which is why no year-by-year comparison is made here.

Source: the UrbanEmissions.Info parse of the CPCB bulletin PDFs
(github.com/urbanemissionsinfo/AQI_bulletins, GPL-3.0), the same file
build-aqi-bulletins.py reads. It is not committed here; only this summary is.

    git clone --depth 1 https://github.com/urbanemissionsinfo/AQI_bulletins /tmp/aqib
    python3 scripts/build-delhi-seasonal.py --source /tmp/aqib/data/Processed/AllIndiaBulletinsMaster2025_openrefined.csv
    python3 scripts/build-delhi-seasonal.py --check
"""
import argparse
import csv
import json
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'data' / 'delhi-seasonal.json'
CITY = 'Delhi'
YEARS = range(2016, 2026)          # 2015 starts in May, so it is left out
CATS = ['Good', 'Satisfactory', 'Moderate', 'Poor', 'Very Poor', 'Severe']
MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']


def build(src):
    seen = set()
    counts = defaultdict(lambda: {c: 0 for c in CATS})
    for r in csv.DictReader(open(src, encoding='utf-8', errors='replace')):
        if (r.get('city') or '').strip() != CITY:
            continue
        day = (r.get('date') or '')[:10]
        cat = (r.get('aqi_category') or '').strip()
        if len(day) < 10 or cat not in CATS or int(day[:4]) not in YEARS or day in seen:
            continue
        seen.add(day)
        counts[int(day[5:7])][cat] += 1
    months = []
    for m in range(1, 13):
        c = counts[m]
        days = sum(c.values())
        pow_ = c['Poor'] + c['Very Poor'] + c['Severe']
        months.append({
            'month': m, 'label': MONTHS[m - 1], 'days': days, 'by_category': c,
            'poor_or_worse': pow_, 'severe': c['Severe'],
            'share_poor_or_worse': round(pow_ / days, 3) if days else None,
        })
    return {
        '_meta': {
            'what': f'Days {CITY} spent in each CPCB AQI category, by calendar month, pooled over '
                    f'{YEARS.start} to {YEARS.stop - 1}.',
            'source': 'CPCB daily AQI bulletins, parsed from the published PDFs by UrbanEmissions.Info '
                      '(github.com/urbanemissionsinfo/AQI_bulletins). Built by scripts/build-delhi-seasonal.py.',
            'years': f'{YEARS.start}-{YEARS.stop - 1}',
            'no_mean': 'No average AQI: an index of whichever pollutant scores worst is counted by '
                       'category, not averaged. See _meta.no_annual_mean in aqi-bulletins.json.',
            'not_a_trend': 'A seasonal profile pooled over ten years. Delhi went from 5 reporting '
                           'stations to 43 over the window, so the years are not compared.',
        },
        'city': CITY,
        'months': months,
    }


def check():
    d = json.loads(OUT.read_text(encoding='utf-8'))
    errs = []
    ms = d.get('months', [])
    if [m.get('month') for m in ms] != list(range(1, 13)):
        errs.append('months must be 1 to 12, in order')
    for m in ms:
        c = m.get('by_category', {})
        if sum(c.values()) != m.get('days'):
            errs.append(f"{m.get('label')}: categories do not add up to days")
        if c.get('Poor', 0) + c.get('Very Poor', 0) + c.get('Severe', 0) != m.get('poor_or_worse'):
            errs.append(f"{m.get('label')}: poor_or_worse is not Poor + Very Poor + Severe")
        if m.get('days', 0) < 250:
            errs.append(f"{m.get('label')}: only {m.get('days')} days over ten years")
        if m.get('days') and round(m['poor_or_worse'] / m['days'], 3) != m.get('share_poor_or_worse'):
            errs.append(f"{m.get('label')}: share does not match the counts")
        if any(k in m for k in ('mean_aqi', 'avg_aqi', 'average_aqi')):
            errs.append(f"{m.get('label')}: an average AQI is present; see _meta.no_mean")
    if errs:
        print('FAIL -'); [print('  ' + e) for e in errs]; return 1
    total = sum(m['days'] for m in ms)
    print(f"PASS - {d['city']} by month, {d['_meta']['years']}, {total} days counted by category.")
    return 0


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--source')
    ap.add_argument('--check', action='store_true')
    a = ap.parse_args()
    if a.check:
        sys.exit(check())
    if not a.source:
        print('need --source <AllIndiaBulletinsMaster2025_openrefined.csv>'); sys.exit(2)
    data = build(a.source)
    OUT.write_text(json.dumps(data, indent=1) + '\n', encoding='utf-8')
    print(f'wrote {OUT.relative_to(ROOT)}')
