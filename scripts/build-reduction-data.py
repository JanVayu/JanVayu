#!/usr/bin/env python3
"""Build data/reduction.json: what each city would have to remove to reach 40.

The site already shows WHERE a city's PM2.5 comes from (data/apportionment.json,
12 cities, each naming its own study). It has never shown what that implies. The
counterfactual is the question a resident or a councillor actually has: we are
at X, the national standard is 40, so what has to go?

Two inputs, joined here rather than in the browser so the join is checked once
and the panel ships a small file instead of the 892KB district history:

  * data/apportionment.json  — source shares, with study, year, basis, caveat
  * data/district-history.json — LongPMInd annual PM2.5, 1980-2022, 783 districts

The city-to-district match is spelt out in CITY_DISTRICT rather than fuzzy
matched at build time. "Bengaluru" is "Bengaluru Urban", "Ahmedabad" is
"Ahmadabad", "Kanpur" is "Kanpur Nagar", and "Delhi" is "New Delhi": a
similarity threshold that gets those right today can silently pick a different
district when either file is regenerated.

NAAQS_ANNUAL is India's own annual standard for PM2.5, 40 µg/m³ (CPCB, National
Ambient Air Quality Standards, 2009). The WHO guideline is 5; the gap to that is
also reported, because a city can meet India's standard and still be eight times
the level the WHO considers safe, and a tool that only showed the nearer target
would flatter the result.

    python3 scripts/build-reduction-data.py            # write
    python3 scripts/build-reduction-data.py --check    # fail if stale
"""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'data/reduction.json'

NAAQS_ANNUAL = 40      # CPCB NAAQS 2009, annual mean PM2.5
WHO_ANNUAL = 5         # WHO global air quality guideline 2021, annual mean

CITY_DISTRICT = {
    'Delhi': 'New Delhi|Delhi',
    'Mumbai': 'Mumbai|Maharashtra',
    'Kolkata': 'Kolkata|West Bengal',
    'Chennai': 'Chennai|Tamil Nadu',
    'Bengaluru': 'Bengaluru Urban|Karnataka',
    'Hyderabad': 'Hyderabad|Telangana',
    'Pune': 'Pune|Maharashtra',
    'Ahmedabad': 'Ahmadabad|Gujarat',
    'Kanpur': 'Kanpur Nagar|Uttar Pradesh',
    'Lucknow': 'Lucknow|Uttar Pradesh',
    'Patna': 'Patna|Bihar',
    'Jaipur': 'Jaipur|Rajasthan',
}


def build():
    ap = json.loads((ROOT / 'data/apportionment.json').read_text(encoding='utf-8'))
    hist = json.loads((ROOT / 'data/district-history.json').read_text(encoding='utf-8'))
    years = hist['years']
    latest = years[-1]

    cities = []
    for c in ap['cities']:
        key = CITY_DISTRICT.get(c['name'])
        if key is None:
            raise SystemExit(f"{c['name']}: no district named in CITY_DISTRICT. Add it by hand.")
        rec = hist['districts'].get(key)
        if rec is None:
            raise SystemExit(f"{c['name']}: district {key!r} is not in district-history.json.")
        annual = rec['a'][-1]

        shares = c['shares']
        total = sum(shares.values())
        # A source-apportionment study whose shares do not sum to 100 has either
        # been mis-transcribed or is missing a category, and every number the
        # slider produces would inherit the error.
        if abs(total - 100) > 1:
            raise SystemExit(f"{c['name']}: shares sum to {total}, not 100.")

        cities.append({
            'key': c['key'],
            'name': c['name'],
            'district': key,
            'annual': round(annual, 1),
            'annual_year': latest,
            'gap_naaqs': round(max(0.0, annual - NAAQS_ANNUAL), 1),
            'gap_who': round(max(0.0, annual - WHO_ANNUAL), 1),
            'cut_needed_pct': round(max(0.0, (annual - NAAQS_ANNUAL) / annual * 100), 1) if annual else 0.0,
            'shares': shares,
            'source': c['source'],
            'source_full': c['source_full'],
            'year': c['year'],
            'basis': c['basis'],
            'caveat': c['caveat'],
            'confidence': c['confidence'],
        })

    cities.sort(key=lambda x: -x['annual'])
    return {
        '_meta': {
            'built_by': 'scripts/build-reduction-data.py',
            'naaqs_annual': NAAQS_ANNUAL,
            'who_annual': WHO_ANNUAL,
            'naaqs_source': 'CPCB, National Ambient Air Quality Standards, 2009 — annual mean PM2.5 40 µg/m³',
            'who_source': 'WHO global air quality guidelines, 2021 — annual mean PM2.5 5 µg/m³',
            'annual_source': hist['_meta']['citation'],
            'annual_is_reconstruction': hist['_meta'].get('is_reconstruction', False),
            'apportionment_note': ap['meta']['note'],
            'linearity_caveat': (
                'Removing a share of the mass is arithmetic, not atmospheric chemistry. '
                'Secondary aerosol forms from precursors that several sources emit, so cutting one '
                'source does not always cut its full share, and transported PM2.5 is outside a '
                'city’s control entirely. Treat a result as the order of the effort required, '
                'not as a forecast.'),
        },
        'cities': cities,
    }


def main():
    data = build()
    new = json.dumps(data, indent=1, ensure_ascii=False) + '\n'
    if '--check' in sys.argv:
        if not OUT.exists():
            print('FAIL — data/reduction.json is missing. Run scripts/build-reduction-data.py')
            return 1
        if OUT.read_text(encoding='utf-8') != new:
            print('FAIL — data/reduction.json is out of date. Run scripts/build-reduction-data.py')
            return 1
        print(f'PASS — {len(data["cities"])} cities, shares sum to 100 in each, districts all resolved.')
        return 0
    OUT.write_text(new, encoding='utf-8')
    print(f'{len(data["cities"])} cities -> data/reduction.json')
    for c in data['cities'][:3]:
        print(f'   {c["name"]:<10} {c["annual"]} µg/m³  needs -{c["cut_needed_pct"]}% to reach 40')
    return 0


if __name__ == '__main__':
    sys.exit(main())
