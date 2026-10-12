#!/usr/bin/env python3
"""The annual PM2.5 behind the exposure report, the migration calculator, the
city scorecard and the share card must come from somewhere.

Until October 2026 `CITY_ANNUAL_PM25` in app.js carried four IQAir 2025 figures
and 29 "rounded working values" matched to nothing, and the calculators turned
those into years of life expectancy. Several were far out: Kolkata 84 against
48.2 on the satellite layer, Kanpur 95 against 54.6. All 33 now come from the
site's own 2024 satellite layer (SatPM2.5 V6GL03, district means,
data/district-points.json) through the district mapping below.

All 33, the four IQAir cities included, because the migration calculator
compares cities. IQAir's figures are means of urban stations; a satellite
district mean takes in the district's rural parts and runs lower. Delhi on
IQAir against Lucknow on satellite would overstate the gap between them.

This check recomputes each value and fails if app.js disagrees, or if a city in
the table has no source.

    python3 scripts/check-city-annual.py            # verify
    python3 scripts/check-city-annual.py --print    # print the table to paste
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# City -> the district code(s) in data/district-points.json it is read from.
# A city spanning several districts takes their plain mean.
DISTRICTS = {
    'delhi': ['090', '091', '092', '093', '094', '095', '096', '097', '098', '702', '703'],
    'gurgaon': ['086'], 'noida': ['141'], 'ghaziabad': ['140'],
    'mumbai': ['519'], 'kolkata': ['342'], 'chennai': ['603'], 'bangalore': ['572'],
    'hyderabad': ['536'], 'faridabad': ['088'], 'lucknow': ['157'], 'kanpur': ['164'],
    'patna': ['230'], 'jaipur': ['110'], 'ahmedabad': ['474'], 'pune': ['521'],
    'chandigarh': ['055'], 'varanasi': ['197'], 'agra': ['146'], 'bhopal': ['444'],
    'indore': ['439'], 'nagpur': ['505'], 'kochi': ['595'], 'visakhapatnam': ['544'],
    'thiruvananthapuram': ['601'], 'coimbatore': ['632'], 'muzaffarpur': ['216'],
    'gaya': ['236'], 'raipur': ['410'], 'jodhpur': ['113'], 'guwahati': ['322'],
    'dehradun': ['060'], 'amritsar': ['049'],
}


def expected():
    pts = {p['c']: p for p in json.loads((ROOT / 'data' / 'district-points.json').read_text(encoding='utf-8'))}
    out = {}
    for city, codes in DISTRICTS.items():
        vals = [pts[c]['sat2024'] for c in codes]
        out[city] = round(sum(vals) / len(vals), 1)
    return out


def in_app():
    src = (ROOT / 'app.js').read_text(encoding='utf-8')
    m = re.search(r'const CITY_ANNUAL_PM25 = \{(.*?)\};', src, re.S)
    return {k: float(v) for k, v in re.findall(r'(\w+):\s*([\d.]+)', m.group(1))}


def main():
    want = expected()
    if '--print' in sys.argv:
        print(', '.join(f'{k}: {v}' for k, v in want.items()))
        return 0
    have = in_app()
    errs = [f'{k}: app.js {have.get(k)}, source {v}' for k, v in want.items() if have.get(k) != v]
    errs += [f'{k}: in app.js with no source' for k in have if k not in want]
    if errs:
        print('FAIL - CITY_ANNUAL_PM25 does not match its sources:')
        for e in errs:
            print('  ' + e)
        return 1
    print(f'PASS - {len(have)} city annual PM2.5 values match the 2024 satellite layer.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
