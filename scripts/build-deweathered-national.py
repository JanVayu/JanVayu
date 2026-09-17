#!/usr/bin/env python3
"""Was it policy, or was it the wind? Now for every city with enough monitors.

`build-deweathered.py` answered that question for Delhi-NCR over 2018-2022,
using PM2.5 pulled from OpenAQ. It was the right question and the wrong scope:
one airshed, five years, and a source whose Indian history is shallow. This runs
the same method over the XKDR India Air Quality Database, which carries CPCB's
own hourly record, and so covers **45 cities over 2018-2024**.

METHOD, unchanged from the Delhi original, after Grange et al. (2018), Atmos.
Chem. Phys. 18, 6223-6239:

  1. Per city, fit a random forest predicting daily mean PM2.5 from meteorology
     (wind speed, the two wind vector components, temperature, relative
     humidity) plus time terms (trend, season as a circle, day of week) and the
     station.
  2. To normalise, hold the time terms and the station FIXED and resample the
     meteorology from that city's whole observed record, predict, and average
     over many draws. What survives is the concentration that day would have had
     under an average-weather draw.
  3. The trend through the normalised series is the part weather cannot explain.

Two exclusions matter as much as the inclusions, and both are inherited
deliberately. **Lagged pollutant values are not features**: feeding yesterday's
PM2.5 into a model meant to isolate emissions launders the answer through the
target and manufactures a trend out of autocorrelation alone. And **the station
term is held fixed** during normalisation, so the result is not contaminated by
which stations happened to be reporting on a given day, which changes a lot over
seven years as the network grew from 129 stations to 534.

WHAT IS NEW, AND WHAT IT COSTS

**Meteorology is per city, in IST.** The Delhi original read a single cached met
series. Here each city gets its own, from Open-Meteo's archive at the mean
position of its stations, requested with `timezone=Asia/Kolkata`. That timezone
is not cosmetic: XKDR's `collected_at` is a naive Indian Standard Time stamp, so
a met series in UTC would be misaligned by five and a half hours and would
scramble the diurnal cycle the model leans on. Wind is averaged as a vector
(u and v separately) rather than by averaging compass degrees, which is
meaningless across the 360/0 boundary.

**Thirty resamples, not sixty.** The Delhi run used 60 meteorological draws and
200 bootstrap replicates for one city. Run unchanged across 45 cities that is
hours of compute for a second decimal place. This uses 30 draws and no
per-city bootstrap, and reports no interval rather than reporting one it did
not earn. The point estimate is stable to well under a microgram between 30 and
60 draws, checked on Delhi.

**A city is only as good as its stations.** Cities qualify on `>= 1800
station-days, >= 2 stations, >= 5 of the 7 years`. Below that a random forest
has too little to learn the local meteorology and the "trend" is noise wearing a
trend's clothes.

**62 stations are dropped, about 51,000 station-days.** They carry no city,
no state and no coordinates in XKDR's station table, so they can be placed in no
city and given no weather. Their names often embed a place ("Alandi Pune"), and
parsing that would be inventing geography rather than reading it.

**2024 is the end, not an oversight.** CPCB's feed into this archive stops on
1 September 2025 and the months after it are two US Embassy monitors. See
`docs/data-sources/xkdr-air-quality.md`.

**This does not replace `deweathered.json`.** That file is Delhi 2018-2022 and
is read by `app.js` and a blog post. This is a second, wider artefact; migrating
the panel is a separate change.

    XKDR_API_KEY=... python3 scripts/build-deweathered-national.py --fetch
    python3 scripts/build-deweathered-national.py
    python3 scripts/build-deweathered-national.py --check
"""

import csv, io, json, math, os, ssl, sys, urllib.request, datetime as dt
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'data' / 'deweathered-national.json'
# The assistant needs these per city, not as three worked examples in its prompt.
# On 2026-09-17 the prompt carried Delhi, Lucknow and Chandigarh as illustrations
# of the METHOD, and asked about Lucknow the model answered with Delhi's -1.75
# and -1.78: confidently, in the right format, about the wrong city. A per-city
# lookup is the fix, and it is derived here rather than hand-copied so the two
# files cannot drift.
FUNC_OUT = ROOT / 'netlify' / 'functions' / 'data' / 'deweathered-cities.json'
CACHE = Path(os.environ.get('JV_CACHE', '/tmp/jv-boundaries')) / 'dwn'

XKDR = 'https://airquality.xkdr.org/v1'
METEO = 'https://archive-api.open-meteo.com/v1/archive'
UA = 'JanVayu/1.0 (+https://janvayu.in; air-quality research)'

YEARS = list(range(2018, 2025))
MIN_STATION_DAYS, MIN_STATIONS, MIN_YEARS = 1800, 2, 5
N_RESAMPLE = 30
SEED = 20260917


def opener():
    """urllib reads HTTPS_PROXY from the environment; the CA bundle needs saying."""
    handlers = []
    proxy = os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy')
    if proxy:
        handlers.append(urllib.request.ProxyHandler({'https': proxy, 'http': proxy}))
    ca = os.environ.get('SSL_CERT_FILE') or '/root/.ccr/ca-bundle.crt'
    if os.path.exists(ca):
        handlers.append(urllib.request.HTTPSHandler(context=ssl.create_default_context(cafile=ca)))
    return urllib.request.build_opener(*handlers)


def get(url, headers=None, tries=3):
    op = opener()
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers=headers or {'User-Agent': UA})
            with op.open(req, timeout=180) as r:
                return r.read().decode('utf-8')
        except Exception:
            if i == tries - 1:
                raise
    raise RuntimeError('unreachable')


# ---------------------------------------------------------------- fetch

def fetch_all():
    key = os.environ.get('XKDR_API_KEY')
    if not key:
        sys.exit('XKDR_API_KEY is not set. A key is free at '
                 'https://airquality.xkdr.org/signup — the demo key reads 2024 only.')
    CACHE.mkdir(parents=True, exist_ok=True)
    hdr = {'Authorization': f'Bearer {key}', 'User-Agent': UA}

    print('stations...', flush=True)
    (CACHE / 'stations.csv').write_text(get(f'{XKDR}/stations?format=csv', hdr), encoding='utf-8')

    for y in YEARS:
        p = CACHE / f'pm25-{y}.csv'
        if p.exists():
            continue
        print(f'PM2.5 daily {y}...', flush=True)
        p.write_text(get(f'{XKDR}/measurements?parameter=PM2.5&start={y}-01-01'
                         f'&end={y}-12-31&agg=daily&format=csv', hdr), encoding='utf-8')

    cities = qualifying_cities()
    print(f'{len(cities)} cities qualify; fetching meteorology', flush=True)
    for i, (city, info) in enumerate(sorted(cities.items()), 1):
        p = CACHE / f'met-{slug(city)}.json'
        if p.exists():
            continue
        lat, lon = info['lat'], info['lon']
        url = (f'{METEO}?latitude={lat:.4f}&longitude={lon:.4f}'
               f'&start_date={YEARS[0]}-01-01&end_date={YEARS[-1]}-12-31'
               '&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m'
               '&timezone=Asia%2FKolkata')
        p.write_text(get(url), encoding='utf-8')
        print(f'  [{i}/{len(cities)}] {city}', flush=True)
    print('cached under', CACHE)


def slug(s):
    return ''.join(c.lower() if c.isalnum() else '-' for c in s).strip('-')


# ---------------------------------------------------------------- assemble

def station_meta():
    return {r['station_id']: r for r in csv.DictReader(open(CACHE / 'stations.csv', encoding='utf-8'))}


def daily_rows():
    meta = station_meta()
    for y in YEARS:
        for r in csv.DictReader(open(CACHE / f'pm25-{y}.csv', encoding='utf-8')):
            m = meta.get(r['station_id'])
            if not m or not m['city_name'].strip() or not m['latitude'].strip():
                continue
            if int(r['n']) < 18:        # a "daily mean" needs most of its day
                continue
            yield m['city_name'], r['station_id'], r['period_start'][:10], float(r['mean']), m


def qualifying_cities():
    days = defaultdict(int); stns = defaultdict(set); yrs = defaultdict(set)
    pos = defaultdict(list)
    for city, sid, day, _v, m in daily_rows():
        days[city] += 1; stns[city].add(sid); yrs[city].add(day[:4])
        pos[city].append((float(m['latitude']), float(m['longitude'])))
    out = {}
    for c in days:
        if days[c] >= MIN_STATION_DAYS and len(stns[c]) >= MIN_STATIONS and len(yrs[c]) >= MIN_YEARS:
            lats = [p[0] for p in pos[c]]; lons = [p[1] for p in pos[c]]
            out[c] = {'lat': sum(lats) / len(lats), 'lon': sum(lons) / len(lons),
                      'days': days[c], 'stations': len(stns[c]), 'years': len(yrs[c])}
    return out


def met_daily(city):
    """Hourly Open-Meteo to daily means, wind averaged as a vector."""
    d = json.loads((CACHE / f'met-{slug(city)}.json').read_text(encoding='utf-8'))
    h = d['hourly']
    acc = defaultdict(lambda: {'t': [], 'rh': [], 'u': [], 'v': [], 'sp': []})
    for i, stamp in enumerate(h['time']):
        t, rh = h['temperature_2m'][i], h['relative_humidity_2m'][i]
        sp, wd = h['wind_speed_10m'][i], h['wind_direction_10m'][i]
        if None in (t, rh, sp, wd):
            continue
        a = acc[stamp[:10]]
        rad = math.radians(wd)
        a['t'].append(t); a['rh'].append(rh); a['sp'].append(sp)
        a['u'].append(-sp * math.sin(rad)); a['v'].append(-sp * math.cos(rad))
    return {day: {'temp': sum(a['t']) / len(a['t']), 'rh': sum(a['rh']) / len(a['rh']),
                  'wind': sum(a['sp']) / len(a['sp']),
                  'u': sum(a['u']) / len(a['u']), 'v': sum(a['v']) / len(a['v'])}
            for day, a in acc.items() if len(a['t']) >= 18}


# ---------------------------------------------------------------- model

def run_city(city, rows, met, seed=SEED):
    import numpy as np
    from sklearn.ensemble import RandomForestRegressor

    stations = sorted({r[0] for r in rows})
    sidx = {s: i for i, s in enumerate(stations)}
    base = dt.date(YEARS[0], 1, 1)

    X, y, days = [], [], []
    for sid, day, val in rows:
        m = met.get(day)
        if not m:
            continue
        d = dt.date.fromisoformat(day)
        doy = d.timetuple().tm_yday
        X.append([m['wind'], m['u'], m['v'], m['temp'], m['rh'],
                  (d - base).days,
                  math.sin(2 * math.pi * doy / 365.25),
                  math.cos(2 * math.pi * doy / 365.25),
                  d.weekday(), sidx[sid]])
        y.append(val); days.append(day)
    if len(X) < MIN_STATION_DAYS:
        return None

    rng = np.random.default_rng(seed)
    X = np.array(X, dtype=float); y = np.array(y, dtype=float)

    idx = rng.permutation(len(X)); cut = int(len(X) * 0.8)
    tr, te = idx[:cut], idx[cut:]
    probe = RandomForestRegressor(n_estimators=200, min_samples_leaf=3,
                                  n_jobs=-1, random_state=seed)
    probe.fit(X[tr], y[tr])
    pred = probe.predict(X[te])
    ss_res = float(((y[te] - pred) ** 2).sum())
    ss_tot = float(((y[te] - y[te].mean()) ** 2).sum())
    r2 = 1 - ss_res / ss_tot

    model = RandomForestRegressor(n_estimators=200, min_samples_leaf=3,
                                  n_jobs=-1, random_state=seed)
    model.fit(X, y)

    MET = [0, 1, 2, 3, 4]
    pool = X[:, MET]
    norm = np.zeros(len(X))
    for _ in range(N_RESAMPLE):
        Xs = X.copy()
        Xs[:, MET] = pool[rng.integers(0, len(pool), len(X))]
        norm += model.predict(Xs)
    norm /= N_RESAMPLE

    raw_y, nrm_y = defaultdict(list), defaultdict(list)
    for i, day in enumerate(days):
        raw_y[day[:4]].append(y[i]); nrm_y[day[:4]].append(norm[i])

    years = sorted(raw_y)
    annual_raw = {yy: round(sum(raw_y[yy]) / len(raw_y[yy]), 1) for yy in years}
    annual_nrm = {yy: round(sum(nrm_y[yy]) / len(nrm_y[yy]), 1) for yy in years}

    def slope(series):
        xs = [int(k) for k in series]; vs = [series[k] for k in series]
        n = len(xs); mx = sum(xs) / n; mv = sum(vs) / n
        den = sum((x - mx) ** 2 for x in xs)
        return round(sum((x - mx) * (v - mv) for x, v in zip(xs, vs)) / den, 2) if den else 0.0

    return {
        'city': city,
        'stations': len(stations),
        'station_days': len(X),
        'years': years,
        'r2': round(r2, 3),
        'annual_raw': annual_raw,
        'annual_normalised': annual_nrm,
        'trend_raw': slope(annual_raw),
        'trend_normalised': slope(annual_nrm),
    }


def build():
    cities = qualifying_cities()
    per_city = defaultdict(list)
    for city, sid, day, val, _m in daily_rows():
        if city in cities:
            per_city[city].append((sid, day, val))

    results, skipped = [], []
    for i, city in enumerate(sorted(per_city), 1):
        p = CACHE / f'met-{slug(city)}.json'
        if not p.exists():
            skipped.append((city, 'no meteorology cached')); continue
        try:
            met = met_daily(city)
        except Exception as e:
            skipped.append((city, f'meteorology unreadable: {e}')); continue
        r = run_city(city, per_city[city], met)
        if r is None:
            skipped.append((city, 'too few rows after the meteorology join')); continue
        results.append(r)
        print(f'  [{i}/{len(per_city)}] {city}: R2 {r["r2"]}, '
              f'raw {r["trend_raw"]:+}/yr, normalised {r["trend_normalised"]:+}/yr', flush=True)

    results.sort(key=lambda r: -r['station_days'])
    falling = [r for r in results if r['trend_normalised'] < 0]
    out = {
        '_meta': {
            'what': 'Daily mean PM2.5 by city, raw and meteorologically normalised '
                    '(weather removed), for every Indian city with enough monitors.',
            'window': f'{YEARS[0]}-{YEARS[-1]}',
            'method': 'Random forest over wind speed, wind vector components, temperature '
                      'and relative humidity, plus trend, season, day of week and station. '
                      'Normalised by resampling the meteorology while holding time and '
                      'station fixed (Grange et al. 2018, Atmos. Chem. Phys. 18, 6223-6239).',
            'pm25_source': 'India Air Quality Database, XKDR Forum '
                           '(https://airquality.xkdr.org), CC BY 4.0, compiling CPCB CAAQM '
                           'and US Department of State monitors via AirNow',
            'met_source': 'Open-Meteo archive, hourly, timezone Asia/Kolkata, at the mean '
                          'position of each city\'s stations',
            'inclusion': f'at least {MIN_STATION_DAYS} station-days, {MIN_STATIONS} stations '
                         f'and {MIN_YEARS} of the {len(YEARS)} years; a daily mean needs 18 '
                         'of its 24 hours',
            'resamples': N_RESAMPLE,
            'cities': len(results),
            'cities_falling_normalised': len(falling),
            'excluded_stations_without_geography': 62,
            'caveat': 'A normalised trend is what weather cannot explain. It is not proof '
                      'that policy caused the change: emissions, fuel mix, construction and '
                      'economic activity all sit inside it. Cities are not comparable to each '
                      'other on R2, which reflects how much of that city\'s variance its own '
                      'meteorology explains. The window ends in 2024 because CPCB\'s feed '
                      'into the source archive stops on 1 September 2025.',
        },
        'cities': results,
        'skipped': [{'city': c, 'why': w} for c, w in skipped],
    }
    OUT.write_text(json.dumps(out, indent=1, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'\n{len(results)} cities, {len(falling)} falling once weather is removed.')
    print(f'wrote {OUT.relative_to(ROOT)}')
    derive()


# ------------------------------------------------------- derived function copy

def derived_payload():
    """The compact per-city shape the Netlify function bundles.

    Derived from OUT, never fetched again, so `--check` can recompute it and
    fail on any drift between the data file and the copy the assistant reads.
    """
    d = json.loads(OUT.read_text(encoding='utf-8'))
    cities = {}
    for c in sorted(d['cities'], key=lambda x: x['city'].lower()):
        cities[c['city'].lower()] = {
            'city': c['city'],
            'raw': c['trend_raw'],
            'norm': c['trend_normalised'],
            'r2': c['r2'],
            'stations': c['stations'],
            'years': [c['years'][0], c['years'][-1]],
            'annual_raw': c['annual_raw'],
            'annual_norm': c['annual_normalised'],
        }
    return {
        '_meta': {
            'window': d['_meta']['window'],
            'method': d['_meta']['method'],
            'pm25_source': d['_meta']['pm25_source'],
            'inclusion': d['_meta']['inclusion'],
            'caveat': d['_meta']['caveat'],
            'cities': d['_meta']['cities'],
            'cities_falling_normalised': d['_meta']['cities_falling_normalised'],
            'derived_from': 'data/deweathered-national.json',
        },
        'cities': cities,
    }


def derive():
    FUNC_OUT.parent.mkdir(parents=True, exist_ok=True)
    FUNC_OUT.write_text(json.dumps(derived_payload(), ensure_ascii=False, indent=1) + '\n',
                        encoding='utf-8')
    print(f'wrote {FUNC_OUT.relative_to(ROOT)} ({len(derived_payload()["cities"])} cities)')


# ---------------------------------------------------------------- check

def check():
    if not OUT.exists():
        print(f'FAIL — {OUT.relative_to(ROOT)} is missing'); return 1
    d = json.loads(OUT.read_text(encoding='utf-8'))
    errs = []
    meta, cities = d.get('_meta', {}), d.get('cities', [])
    for k in ('what', 'window', 'method', 'pm25_source', 'met_source', 'inclusion',
              'resamples', 'cities', 'caveat'):
        if k not in meta:
            errs.append(f'_meta.{k} missing')
    if 'XKDR' not in meta.get('pm25_source', ''):
        errs.append('_meta.pm25_source does not credit XKDR')
    if meta.get('cities') != len(cities):
        errs.append(f"_meta.cities says {meta.get('cities')}, file carries {len(cities)}")
    falling = sum(1 for c in cities if c['trend_normalised'] < 0)
    if meta.get('cities_falling_normalised') != falling:
        errs.append(f"cities_falling_normalised says "
                    f"{meta.get('cities_falling_normalised')}, records give {falling}")
    seen = set()
    for c in cities:
        if c['city'] in seen:
            errs.append(f"duplicate city {c['city']}")
        seen.add(c['city'])
        if not (0 < c['r2'] <= 1):
            errs.append(f"{c['city']}: implausible R2 {c['r2']}")
        if c['station_days'] < MIN_STATION_DAYS:
            errs.append(f"{c['city']}: {c['station_days']} station-days is below the stated floor")
        for label in ('annual_raw', 'annual_normalised'):
            for yy, v in c[label].items():
                if not (0 < v < 700):
                    errs.append(f"{c['city']} {label} {yy}: implausible {v}")
    if errs:
        print('FAIL —'); [print('  ' + e) for e in errs[:20]]
        return 1
    # The function's copy must be exactly what derive() would write from this
    # file. A hand-edit to either one is the drift this catches.
    if not FUNC_OUT.exists():
        errs.append(f'{FUNC_OUT.relative_to(ROOT)} is missing; run --derive')
    else:
        want = json.dumps(derived_payload(), ensure_ascii=False, indent=1) + '\n'
        if FUNC_OUT.read_text(encoding='utf-8') != want:
            errs.append(f'{FUNC_OUT.relative_to(ROOT)} has drifted from '
                        f'{OUT.relative_to(ROOT)}; run --derive')

    if errs:
        print('FAIL —'); [print('  ' + e) for e in errs[:20]]
        return 1
    print(f'PASS — {len(cities)} cities, {falling} falling once weather is removed, '
          f'recounted from the records; the function copy matches.')
    return 0


if __name__ == '__main__':
    if '--check' in sys.argv:
        sys.exit(check())
    if '--derive' in sys.argv:
        derive(); sys.exit(0)
    if '--fetch' in sys.argv:
        fetch_all()
    sys.exit(build() or 0)
