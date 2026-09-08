#!/usr/bin/env python3
"""Separate what Delhi's air did from what the weather did, 2018-2022.

JanVayu leads with annual means partly to sidestep weather. That is honest and
it is also a limit we have stated in public: we could not say whether a city
improved because of policy or because of the wind. This closes it, for one
airshed and one window.

METHOD — meteorological normalisation, after Grange et al. (2018), Atmos. Chem.
Phys. 18, 6223-6239, which is also what Hawa Ka Hisab uses:

  1. Fit a random forest predicting daily mean PM2.5 from meteorology (wind
     speed, the two wind vector components, temperature, relative humidity)
     plus time terms (trend, day of year, day of week) and the station.
  2. To normalise a given day, hold the time terms and the station fixed and
     RESAMPLE the meteorology from the whole observed record, predict, and
     average over many draws. What survives is the concentration that day would
     have had under an average-weather draw.
  3. The trend through the normalised series is the part weather cannot explain.

Two exclusions matter as much as the inclusions. **Lagged pollutant values are
not features**: feeding yesterday's PM2.5 into a model meant to isolate
emissions launders the answer through the target and will manufacture a
convincing trend out of autocorrelation alone. And **the station term is held
fixed** during normalisation, so the result is not contaminated by which
stations happened to be reporting on a given day — coverage is uneven and
changes over the window.

    python3 scripts/build-deweathered.py            # rebuild from the cache
    python3 scripts/build-deweathered.py --check    # verify the committed file

Inputs are cached under $JV_CACHE/dw (pm25_daily.json from OpenAQ, met_daily.json
from NOAA ISD). Build-time only: scikit-learn ships nothing to the browser.
"""
import argparse
import datetime as dt
import json
import math
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'data' / 'deweathered.json'
CACHE = Path(os.environ.get('JV_CACHE', '/tmp/jv-boundaries')) / 'dw'

N_RESAMPLE = 60          # meteorological draws per observation
N_BOOTSTRAP = 200        # station-level bootstrap replicates for the interval
SEED = 20260908


def load():
    pm = json.load(open(CACHE / 'pm25_daily.json'))
    met = json.load(open(CACHE / 'met_daily.json'))
    return pm, met


def build_frame(pm, met):
    """Rows of (features, target, station, date)."""
    rows = []
    stations = sorted(pm)
    sidx = {s: i for i, s in enumerate(stations)}
    for s, rec in pm.items():
        for day, val in rec['daily'].items():
            m = met.get(day)
            if not m or 'u' not in m or 'rh' not in m:
                continue
            d = dt.date.fromisoformat(day)
            doy = d.timetuple().tm_yday
            rows.append({
                'date': day,
                'station': s,
                'y': val,
                'x': [
                    m['wind'], m['u'], m['v'], m['temp'], m['rh'],
                    (d - dt.date(2018, 1, 1)).days,          # trend
                    math.sin(2 * math.pi * doy / 365.25),    # season, as a circle
                    math.cos(2 * math.pi * doy / 365.25),
                    d.weekday(),
                    sidx[s],
                ],
            })
    rows.sort(key=lambda r: (r['date'], r['station']))
    return rows, stations


# Column layout of the feature vector above.
MET_COLS = [0, 1, 2, 3, 4]        # resampled during normalisation
FEATURES = ['wind speed', 'wind u', 'wind v', 'temperature', 'relative humidity',
            'trend', 'season sin', 'season cos', 'day of week', 'station']


def fit_and_normalise(rows, seed=SEED):
    import numpy as np
    from sklearn.ensemble import RandomForestRegressor

    rng = np.random.default_rng(seed)
    X = np.array([r['x'] for r in rows], dtype=float)
    y = np.array([r['y'] for r in rows], dtype=float)

    # Held-out score first, on a random split. This is the number that says
    # whether the model has learned anything worth normalising with.
    idx = rng.permutation(len(rows))
    cut = int(len(rows) * 0.8)
    tr, te = idx[:cut], idx[cut:]
    probe = RandomForestRegressor(n_estimators=300, min_samples_leaf=3,
                                  n_jobs=-1, random_state=seed)
    probe.fit(X[tr], y[tr])
    pred = probe.predict(X[te])
    ss_res = float(((y[te] - pred) ** 2).sum())
    ss_tot = float(((y[te] - y[te].mean()) ** 2).sum())
    r2 = 1 - ss_res / ss_tot
    rmse = math.sqrt(ss_res / len(te))

    model = RandomForestRegressor(n_estimators=300, min_samples_leaf=3,
                                  n_jobs=-1, random_state=seed)
    model.fit(X, y)

    # Normalise: hold time and station, resample the meteorology.
    met_pool = X[:, MET_COLS]
    norm = np.zeros(len(rows))
    for _ in range(N_RESAMPLE):
        Xs = X.copy()
        draw = rng.integers(0, len(rows), size=len(rows))
        Xs[:, MET_COLS] = met_pool[draw]
        norm += model.predict(Xs)
    norm /= N_RESAMPLE

    imp = sorted(zip(FEATURES, model.feature_importances_), key=lambda t: -t[1])

    # Placebo: break the link between PM2.5 and everything predicting it. A
    # pipeline that still scores well on shuffled targets is leaking, and the
    # real result would mean nothing. Kept in the output so the claim travels
    # with the data rather than living in a commit message.
    ys = y.copy()
    rng.shuffle(ys)
    pl = RandomForestRegressor(n_estimators=200, min_samples_leaf=3,
                               n_jobs=-1, random_state=seed)
    pl.fit(X[tr], ys[tr])
    pp = pl.predict(X[te])
    placebo = 1 - float(((ys[te] - pp) ** 2).sum()) / float(((ys[te] - ys[te].mean()) ** 2).sum())

    # Meteorology on its own: the premise of the whole exercise is that weather
    # explains most of the daily swing, so this should be high.
    met_only = RandomForestRegressor(n_estimators=200, min_samples_leaf=3,
                                     n_jobs=-1, random_state=seed)
    met_only.fit(X[np.ix_(tr, MET_COLS)], y[tr])
    mo = met_only.predict(X[np.ix_(te, MET_COLS)])
    r2_met = 1 - float(((y[te] - mo) ** 2).sum()) / float(((y[te] - y[te].mean()) ** 2).sum())

    return norm, {
        'r2_holdout': round(r2, 3), 'rmse_holdout': round(rmse, 2), 'n': len(rows),
        'importance': [(f, round(float(v), 3)) for f, v in imp],
        'r2_placebo_shuffled': round(placebo, 3),
        'r2_meteorology_only': round(r2_met, 3),
        'variance_removed_pct': round(100 * (1 - float(np.var(norm)) / float(np.var(y))), 1),
    }


# Months present in EVERY year of the window. Anything else cannot be compared
# across years: coverage here is severely and unevenly seasonal, and a naive
# annual mean of observed days reads the gaps as a trend. 2021 is missing April
# to August (its cleaner months, so it looks terrible) and 2022 is missing
# November and December (its worst, so it looks clean). Averaging those two
# against each other produces a confident rising trend that is entirely an
# artefact of which months happened to be reported.
def common_months(rows):
    from collections import defaultdict
    seen = defaultdict(set)
    for r in rows:
        seen[r['date'][:4]].add(int(r['date'][5:7]))
    if not seen:
        return []
    return sorted(set.intersection(*seen.values()))


def by_year(rows, values, months=None):
    """Mean by calendar year, optionally restricted to a fixed set of months."""
    acc = {}
    for r, v in zip(rows, values):
        if months and int(r['date'][5:7]) not in months:
            continue
        acc.setdefault(r['date'][:4], []).append(v)
    return {y: {'mean': round(sum(v) / len(v), 1), 'n': len(v)}
            for y, v in sorted(acc.items()) if len(v) >= 30}


def month_coverage(rows):
    """Which months each year actually has, so the gaps travel with the data."""
    from collections import defaultdict
    seen = defaultdict(set)
    for r in rows:
        seen[r['date'][:4]].add(int(r['date'][5:7]))
    return {y: {'present': sorted(ms), 'missing': [m for m in range(1, 13) if m not in ms]}
            for y, ms in sorted(seen.items())}


def trend(rows, values):
    """Least-squares slope in ug/m3 per year."""
    xs = [(dt.date.fromisoformat(r['date']) - dt.date(2018, 1, 1)).days / 365.25 for r in rows]
    n = len(xs)
    mx = sum(xs) / n
    my = sum(values) / n
    num = sum((x - mx) * (v - my) for x, v in zip(xs, values))
    den = sum((x - mx) ** 2 for x in xs)
    return num / den if den else 0.0


def bootstrap_trend(rows, values, stations, seed=SEED):
    """Resample STATIONS, not days: days within a station are not independent."""
    import numpy as np
    rng = np.random.default_rng(seed)
    by_station = {}
    for r, v in zip(rows, values):
        by_station.setdefault(r['station'], []).append((r, v))
    out = []
    for _ in range(N_BOOTSTRAP):
        pick = rng.integers(0, len(stations), size=len(stations))
        rr, vv = [], []
        for i in pick:
            for r, v in by_station.get(stations[i], []):
                rr.append(r)
                vv.append(v)
        if len(rr) > 50:
            out.append(trend(rr, vv))
    out.sort()
    lo = out[int(0.025 * len(out))]
    hi = out[int(0.975 * len(out))]
    return round(lo, 2), round(hi, 2)


def build():
    pm, met = load()
    rows, stations = build_frame(pm, met)
    if len(rows) < 2000:
        sys.exit(f'ABORT: only {len(rows)} station-days joined; refusing to model on that.')

    norm, diag = fit_and_normalise(rows)
    raw_vals = [r['y'] for r in rows]
    norm_vals = list(map(float, norm))

    months = common_months(rows)
    if len(months) < 2:
        sys.exit(f'ABORT: only {len(months)} month(s) present in every year; '
                 'there is no like-for-like comparison to make.')

    # Everything reported is restricted to the months present in EVERY year.
    keep = [i for i, r in enumerate(rows) if int(r['date'][5:7]) in months]
    lrows = [rows[i] for i in keep]
    lraw = [raw_vals[i] for i in keep]
    lnrm = [norm_vals[i] for i in keep]

    raw_t = trend(lrows, lraw)
    nrm_t = trend(lrows, lnrm)
    raw_ci = bootstrap_trend(lrows, lraw, stations)
    nrm_ci = bootstrap_trend(lrows, lnrm, stations)

    days = sorted({r['date'] for r in rows})
    out = {
        '_meta': {
            'what': 'Daily mean PM2.5 for Delhi-NCR CPCB stations, raw and '
                    'meteorologically normalised (weather removed).',
            'method': 'Random forest over wind speed, wind vector components, '
                      'temperature and relative humidity, plus trend, season, day '
                      'of week and station. Normalised by resampling the '
                      'meteorology while holding time and station fixed '
                      '(Grange et al. 2018, Atmos. Chem. Phys. 18, 6223-6239).',
            'excluded': 'Lagged pollutant values are deliberately NOT features: '
                        'feeding yesterday PM2.5 into a model meant to isolate '
                        'emissions launders the answer through the target.',
            'pm25_source': 'CPCB / DPCC / IMD stations via OpenAQ',
            'met_source': 'NOAA Integrated Surface Database, Delhi Safdarjung '
                          '(42182099999) and Palam (42181099999)',
            'window': f'{days[0]} to {days[-1]}',
            'why_this_window': 'OpenAQ Delhi coverage is not continuous. A segment '
                               'runs 2018-03 to 2022-10 at most stations, then a '
                               'roughly 2.3-year ingest gap, then 2025-02 onward. '
                               'The location endpoint advertises 2016 to 2026, '
                               'which is the union of disjoint sensors and not a '
                               'coverage claim.',
            'stations': len(stations),
            'station_names': [pm[s]['name'] for s in stations],
            'station_days': len(rows),
            'day_coverage_note': 'A day is kept only where the station reported at '
                                 'least 18 hourly values, so a "daily mean" is not '
                                 'built from three hours.',
            'covid_note': 'The 2020 lockdowns sit inside this window. Normalisation '
                          'removes weather, NOT lockdowns: the 2020 fall is a real '
                          'emissions change and stays in the normalised series.',
            'not_national': 'Delhi-NCR only. Nothing here transfers to another city.',
            'comparison_months': months,
            'why_only_these_months': 'Coverage is severely and unevenly seasonal, '
                                     'so every figure compared across years is '
                                     'restricted to the months present in EVERY '
                                     'year. A naive annual mean of observed days '
                                     'reads the gaps as a trend: 2021 is missing '
                                     'April to August (its cleaner months, so it '
                                     'looks terrible at 137.6) and 2022 is missing '
                                     'November and December (its worst, so it looks '
                                     'clean at 82.2). Averaged against each other '
                                     'those produce a confident RISING trend that is '
                                     'entirely an artefact of which months reported. '
                                     'all_months_raw is kept only to show that gap.',
            'holdout_r2': diag['r2_holdout'],
            'holdout_rmse': diag['rmse_holdout'],
            'r2_placebo_shuffled': diag['r2_placebo_shuffled'],
            'r2_meteorology_only': diag['r2_meteorology_only'],
            'variance_removed_pct': diag['variance_removed_pct'],
            'placebo_note': 'r2_placebo_shuffled is the held-out score after the '
                            'PM2.5 values are shuffled against their dates. It must '
                            'sit near or below zero; anything else means the '
                            'pipeline is leaking and the trend below is worthless.',
            'feature_importance': diag['importance'],
            'resamples': N_RESAMPLE,
            'bootstrap': N_BOOTSTRAP,
        },
        'annual_raw': by_year(rows, raw_vals, months),
        'annual_normalised': by_year(rows, norm_vals, months),
        'all_months_raw': by_year(rows, raw_vals),
        'month_coverage': month_coverage(rows),
        'trend_raw': {'slope_per_year': round(raw_t, 2), 'ci95': list(raw_ci)},
        'trend_normalised': {'slope_per_year': round(nrm_t, 2), 'ci95': list(nrm_ci)},
    }

    # Refuse to call a direction when the interval spans zero.
    def call(t, ci):
        if ci[0] <= 0 <= ci[1]:
            return 'no direction called: the 95% interval contains zero'
        return 'falling' if t < 0 else 'rising'
    out['trend_raw']['verdict'] = call(raw_t, raw_ci)
    out['trend_normalised']['verdict'] = call(nrm_t, nrm_ci)

    OUT.write_text(json.dumps(out, indent=1) + '\n', encoding='utf-8')
    return out


def check():
    if not OUT.exists():
        sys.exit(f'FAIL: {OUT.relative_to(ROOT)} is missing.')
    d = json.loads(OUT.read_text(encoding='utf-8'))
    m = d.get('_meta', {})
    need = ['window', 'stations', 'station_days', 'holdout_r2', 'covid_note',
            'not_national', 'comparison_months', 'why_only_these_months']
    for k in need:
        if not m.get(k):
            sys.exit(f'FAIL: _meta.{k} is missing — the honesty constraints travel in the file.')
    if not d.get('annual_raw') or not d.get('annual_normalised'):
        sys.exit('FAIL: both annual series must be present.')
    if set(d['annual_raw']) != set(d['annual_normalised']):
        sys.exit('FAIL: the raw and normalised series cover different years.')
    pl = m.get('r2_placebo_shuffled')
    if pl is None:
        sys.exit('FAIL: no placebo score recorded.')
    if pl > 0.05:
        sys.exit(f'FAIL: the placebo scored {pl} on shuffled targets. The pipeline '
                 'is leaking; the trend in this file cannot be trusted.')
    if len(m.get('comparison_months', [])) < 2:
        sys.exit('FAIL: fewer than two months are common to every year, so nothing '
                 'here is a like-for-like comparison.')
    cov = d.get('month_coverage', {})
    for y, c in cov.items():
        for mo in m['comparison_months']:
            if mo not in c['present']:
                sys.exit(f'FAIL: {y} lacks month {mo}, which is claimed as common '
                         'to every year.')
    for key in ('trend_raw', 'trend_normalised'):
        t = d.get(key, {})
        if 'slope_per_year' not in t or len(t.get('ci95', [])) != 2:
            sys.exit(f'FAIL: {key} needs a slope and a 95% interval.')
        if not (t['ci95'][0] <= t['slope_per_year'] <= t['ci95'][1]):
            sys.exit(f'FAIL: {key} slope sits outside its own interval.')
    print(f"PASS: {m['stations']} stations, {m['station_days']} station-days, "
          f"{m['window']}, held-out R2 {m['holdout_r2']}.")
    return 0


if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--check', action='store_true', help='verify the committed file, no rebuild')
    a = ap.parse_args()
    if a.check:
        sys.exit(check())
    r = build()
    m = r['_meta']
    print(f"stations {m['stations']}, station-days {m['station_days']}, {m['window']}")
    print(f"held-out R2 {m['holdout_r2']}, RMSE {m['holdout_rmse']}")
    print('top features:', ', '.join(f'{f} {v}' for f, v in m['feature_importance'][:5]))
    print()
    print('year   raw    normalised')
    for y in r['annual_raw']:
        print(f"  {y}  {r['annual_raw'][y]['mean']:>6}  {r['annual_normalised'][y]['mean']:>8}"
              f"   (n={r['annual_raw'][y]['n']})")
    print()
    print(f"raw trend        {r['trend_raw']['slope_per_year']:+.2f} ug/m3/yr "
          f"CI {r['trend_raw']['ci95']}  -> {r['trend_raw']['verdict']}")
    print(f"normalised trend {r['trend_normalised']['slope_per_year']:+.2f} ug/m3/yr "
          f"CI {r['trend_normalised']['ci95']}  -> {r['trend_normalised']['verdict']}")
