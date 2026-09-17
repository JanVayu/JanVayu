#!/usr/bin/env python3
"""What the monitors actually recorded, against what the satellite says.

Every PM2.5 figure on JanVayu's map is modelled. The 2024 annual layer is
SatPM2.5 V6GL03, a satellite retrieval; the current-year layer is CAMS, a ~40 km
model bias-corrected onto that retrieval; the 1980-2022 history is LongPMInd, a
reconstruction. All three are defensible and all three are documented as
estimates. What the site has never carried is the other kind of number: a
reading, from an instrument, at a place.

This adds it, and uses it to check the layer the site leads with.

SOURCE. The India Air Quality Database (XKDR Forum, CC BY 4.0), which compiles
CPCB's CAAQM network and the five US Embassy monitors into one table: 196.5
million hourly readings, 558 stations, 15 pollutants, January 2009 to March 2026.
https://airquality.xkdr.org . Credit CPCB and the US Department of State via
AirNow alongside XKDR; the licence asks for all three.

METHOD
  1. Pull monthly means per station for one year, with the hour count behind
     each mean, plus the station table for coordinates.
  2. Keep a station only if ALL TWELVE months clear 75% of that month's possible
     hours. Strict on purpose: see the trap below.
  3. Annual mean is the mean of the twelve monthly means, NOT the hour-weighted
     mean of all hours. A station that reports heavily in summer and sparsely in
     winter would otherwise be pulled down by its own coverage pattern, and
     India's seasonal swing is large enough that the artefact would exceed the
     signal it is being used to measure.
  4. Match each station to the nearest district centroid in district-points.json,
     capped at 50 km, and record that district's satellite annual mean beside the
     observed one.

TRAPS, each of which cost something before it was handled

**The completeness rule removes nearly half the network.** 534 stations report
PM2.5 in 2024; 284 clear twelve complete months. That is not a bug in the filter
and it should not be loosened to make the map fuller: a station reporting eight
months of the year has an "annual mean" that means something different from a
station reporting twelve, and averaging them together silently mixes the two.
The count that fails is itself a finding about the monitoring record.

**A station is a point; the satellite value is a district.** The observed mean
runs about 2 ug/m3 above the satellite value, and that is the expected direction,
not satellite error: a district-wide mean averages an urban monitor together with
the fields around it. Read the comparison as agreement in pattern (r = 0.83),
never as one correcting the other.

**Nearest centroid is a crude join.** Indian districts vary enormously in area,
so a 50 km cap admits a good match in Kerala and a poor one in Kachchh. The
distance is written to every record so a reader can discard the far ones.

**62 of the 558 stations carry no coordinates.** They are decommissioned sites
missing from CPCB's current list. They cannot be joined and are counted, not dropped
silently.

**Timestamps are naive IST.** XKDR's `collected_at` is Indian Standard Time with
no offset attached. Nothing here resamples sub-daily, so it does not bite yet; it
will the moment anyone does, exactly as UTC-stamped ODK timestamps bite a field
survey.

**The gaseous pollutants stop earlier than PM2.5.** The API's own /v1/parameters
reports PM2.5 running to 2026-03 and PM10 to 2025-09, while NO2, SO2, CO, NOx,
NO, Ozone, NH3 and Benzene all end 2024-12-31. Check before assuming a
multi-pollutant year exists.

KEY. Set XKDR_API_KEY for the real thing. Without it this falls back to XKDR's
published demo key, which is capped at 10,000 rows and reads 2024 only; that is
enough for this script at its default year and for nothing later.

    python3 scripts/build-station-observed.py            # rebuild (network)
    python3 scripts/build-station-observed.py --check    # verify the committed file (no network)
"""

import json, math, csv, io, os, sys, urllib.request, urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'data' / 'station-observed.json'
DISTRICTS = ROOT / 'data' / 'district-points.json'

API = 'https://airquality.xkdr.org/v1'
DEMO_KEY = 'aqi_demo_wbf92Qx21zX-Wa_Tg8Dx1nXe'
YEAR = 2024
HOURS_FRACTION = 0.75
MAX_JOIN_KM = 50.0
DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]   # 2024 is a leap year


def fetch(path, params):
    q = '&'.join(f'{k}={v}' for k, v in params.items())
    key = os.environ.get('XKDR_API_KEY', DEMO_KEY)
    # A descriptive User-Agent is required, not cosmetic: the API sits behind
    # Cloudflare, which rejects Python's default urllib agent with a 403.
    req = urllib.request.Request(f'{API}/{path}?{q}', headers={
        'Authorization': f'Bearer {key}',
        'User-Agent': 'JanVayu/1.0 (+https://janvayu.in; air-quality research)',
    })
    with urllib.request.urlopen(req, timeout=120) as r:
        return list(csv.DictReader(io.StringIO(r.read().decode('utf-8'))))


def haversine(a_lat, a_lon, b_lat, b_lon):
    R, p = 6371.0, math.pi / 180
    return 2 * R * math.asin(math.sqrt(
        math.sin((b_lat - a_lat) * p / 2) ** 2 +
        math.cos(a_lat * p) * math.cos(b_lat * p) *
        math.sin((b_lon - a_lon) * p / 2) ** 2))


def pearson(xs, ys):
    n = len(xs)
    mx, my = sum(xs) / n, sum(ys) / n
    cov = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    vx = math.sqrt(sum((x - mx) ** 2 for x in xs))
    vy = math.sqrt(sum((y - my) ** 2 for y in ys))
    return cov / (vx * vy)


def build():
    if 'XKDR_API_KEY' not in os.environ:
        print('XKDR_API_KEY not set; using the public demo key '
              '(10,000-row cap, 2024 only).', file=sys.stderr)

    stations = {r['station_id']: r for r in fetch('stations', {'format': 'csv'})}
    monthly = fetch('measurements', {
        'parameter': 'PM2.5', 'start': f'{YEAR}-01-01', 'end': f'{YEAR}-12-31',
        'agg': 'monthly', 'format': 'csv'})

    by_station = {}
    for r in monthly:
        by_station.setdefault(r['station_id'], []).append(r)

    complete, dropped_incomplete = {}, 0
    for sid, rows in by_station.items():
        months = []
        for r in rows:
            m = int(r['period_start'][5:7])
            if int(r['n']) >= HOURS_FRACTION * DAYS[m - 1] * 24:
                months.append(float(r['mean']))
        if len(months) == 12:
            complete[sid] = sum(months) / 12
        else:
            dropped_incomplete += 1

    districts = json.load(open(DISTRICTS))

    records, no_coord = [], 0
    for sid, observed in sorted(complete.items()):
        m = stations.get(sid)
        if not m or not m.get('latitude') or not m.get('longitude'):
            no_coord += 1
            continue
        lat, lon = float(m['latitude']), float(m['longitude'])
        best = min(districts, key=lambda d: haversine(lat, lon, d['lat'], d['lon']))
        km = haversine(lat, lon, best['lat'], best['lon'])
        rec = {
            'id': sid,
            'name': m['station_name'],
            'city': m['city_name'],
            'state': m['state_name'],
            'src': m['source'],
            'lat': round(lat, 5),
            'lon': round(lon, 5),
            'obs': round(observed, 1),
        }
        if km <= MAX_JOIN_KM and best.get('sat2024') is not None:
            rec['district'] = best['n']
            rec['sat'] = best['sat2024']
            rec['join_km'] = round(km, 1)
        records.append(rec)

    paired = [r for r in records if 'sat' in r]
    obs = [r['obs'] for r in paired]
    sat = [r['sat'] for r in paired]
    diff = sorted(a - b for a, b in zip(obs, sat))
    n = len(paired)

    out = {
        '_meta': {
            'what': f'Observed annual mean PM2.5 by monitoring station, {YEAR}, '
                    'beside the satellite annual mean of the nearest district.',
            'year': YEAR,
            'source': 'India Air Quality Database, XKDR Forum '
                      '(https://airquality.xkdr.org), CC BY 4.0',
            'source_networks': "CPCB Continuous Ambient Air Quality Monitoring "
                               "network; US Department of State monitors via AirNow",
            'compared_with': 'SatPM2.5 V6GL03 (ACAG/WashU) 2024 annual mean, per district',
            'completeness_rule': f'all 12 months, each with at least '
                                 f'{int(HOURS_FRACTION * 100)}% of possible hours',
            'annual_mean': 'mean of the twelve monthly means, not hour-weighted',
            'join': f'nearest district centroid, capped at {MAX_JOIN_KM:.0f} km',
            'counts': {
                'stations_reporting': len(by_station),
                'passed_completeness': len(complete),
                'failed_completeness': dropped_incomplete,
                'no_coordinates': no_coord,
                'paired_with_district': n,
            },
            'agreement': {
                'observed_mean': round(sum(obs) / n, 1),
                'satellite_mean': round(sum(sat) / n, 1),
                'mean_difference': round(sum(diff) / n, 1),
                'median_difference': round(diff[n // 2], 1),
                'r': round(pearson(obs, sat), 3),
                'rmse': round(math.sqrt(sum(d * d for d in diff) / n), 1),
            },
            'caveat': 'A station is a point and the satellite value is a district '
                      'mean, so the observed figure sits above it by construction. '
                      'Read this as agreement in pattern, not as either number '
                      'correcting the other. Readings are published by XKDR as '
                      'received, with no gap filling or outlier removal, and the '
                      'source networks label them preliminary.',
        },
        'stations': records,
    }
    OUT.write_text(json.dumps(out, indent=1, ensure_ascii=False) + '\n', encoding='utf-8')

    c, a = out['_meta']['counts'], out['_meta']['agreement']
    print(f"{c['stations_reporting']} stations reported PM2.5 in {YEAR}; "
          f"{c['passed_completeness']} cleared twelve complete months "
          f"({c['failed_completeness']} did not).")
    print(f"{c['paired_with_district']} paired with a district within {MAX_JOIN_KM:.0f} km.")
    print(f"observed {a['observed_mean']} vs satellite {a['satellite_mean']} ug/m3 "
          f"(mean diff {a['mean_difference']:+}, r = {a['r']}, RMSE {a['rmse']}).")
    print(f'wrote {OUT.relative_to(ROOT)}')


def check():
    """Verify the committed file without touching the network."""
    if not OUT.exists():
        print(f'FAIL — {OUT.relative_to(ROOT)} is missing'); return 1
    d = json.loads(OUT.read_text(encoding='utf-8'))
    errs = []
    meta, rows = d.get('_meta', {}), d.get('stations', [])
    for k in ('what', 'year', 'source', 'completeness_rule', 'annual_mean',
              'join', 'counts', 'agreement', 'caveat'):
        if k not in meta:
            errs.append(f'_meta.{k} missing')
    if 'XKDR' not in meta.get('source', ''):
        errs.append('_meta.source does not credit XKDR')
    if not rows:
        errs.append('no station records')
    ids = set()
    for r in rows:
        if r['id'] in ids:
            errs.append(f"duplicate station {r['id']}")
        ids.add(r['id'])
        if not (0 < r['obs'] < 1000):
            errs.append(f"{r['id']}: implausible observed mean {r['obs']}")
        if not (6 < r['lat'] < 38) or not (67 < r['lon'] < 98):
            errs.append(f"{r['id']}: coordinates outside India")
        if 'sat' in r and r.get('join_km', 0) > MAX_JOIN_KM:
            errs.append(f"{r['id']}: join distance {r['join_km']} exceeds the cap")
    counts = meta.get('counts', {})
    if counts.get('passed_completeness') != len(rows) + counts.get('no_coordinates', 0):
        errs.append('counts.passed_completeness does not reconcile with the records')
    paired = [r for r in rows if 'sat' in r]
    if counts.get('paired_with_district') != len(paired):
        errs.append('counts.paired_with_district does not match the records')
    if paired:
        r = round(pearson([x['obs'] for x in paired], [x['sat'] for x in paired]), 3)
        if abs(r - meta['agreement']['r']) > 0.001:
            errs.append(f"agreement.r says {meta['agreement']['r']}, records give {r}")
    if errs:
        print('FAIL —'); [print('  ' + e) for e in errs[:20]]
        return 1
    print(f'PASS — {len(rows)} stations, {len(paired)} paired, '
          f"r = {meta['agreement']['r']} recomputed from the records.")
    return 0


if __name__ == '__main__':
    sys.exit(check() if '--check' in sys.argv else (build() or 0))
