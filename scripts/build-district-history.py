#!/usr/bin/env python3
"""Forty-three years of PM2.5 for every Indian district, 1980 to 2022.

JanVayu's annual air layer is **2024 alone**. The site can say what the air is
and cannot say what it was, so it cannot answer the question people actually
ask: is this getting better or worse? This closes that.

The source is **LongPMInd** (Wei et al., *Earth System Science Data* 16, 3565-3577,
2024; Zenodo 10.5281/zenodo.14557027, CC BY 4.0): daily and monthly ground PM2.5
reconstructed for the whole of India on a ~10 km grid from 1980 to 2022, using a
LightGBM model over CPCB ground measurements, satellite AOD, MERRA-2 composition
and ERA5 weather. Cross-validation R2 is 0.77 out-of-sample, 0.70 out-of-site and
**0.66 out-of-year**, and the last of those is the number that matters here,
because predicting an unseen year is exactly what the pre-monitoring decades ask
of it.

**This is a reconstruction, not a measurement, and the distinction is not
pedantic.** India had almost no continuous monitoring before the 2010s. Every
figure here for the 1980s, 1990s and 2000s is a validated estimate of what the
air was, produced by a model that never saw those years' ground data because
almost none exists. It is the best available answer and it is not a reading. The
output carries that in its own metadata so nothing downstream can quietly drop it.

**Not comparable, digit for digit, with the site's 2024 layer.** That one is
SatPM2.5 V6GL03 at ~1 km; this is LongPMInd at ~10 km, a different model on a
coarser grid. A 10 km cell averages a busy junction together with the fields
beside it, so levels sit lower than a roadside monitor. Use this for **trend and
shape**, use the 2024 layer for level, and never subtract one from the other.

Run:    python3 scripts/build-district-history.py --src /tmp/lpi/pm25_monthly
        python3 scripts/build-district-history.py --check
Writes: data/district-history.json
Needs:  netCDF4, numpy, rasterio  (pip install netCDF4 numpy rasterio)
"""

import argparse, calendar, json, sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent

# Matches scripts/build-boundary-seasonal.py exactly. Winter takes December from
# the same calendar year rather than the previous one, which is what the existing
# seasonal layer does; keeping the two consistent matters more than which
# convention is tidier, because a reader will compare them.
SEASONS = {
    'w': ('Winter', (12, 1, 2)),
    's': ('Summer', (3, 4, 5)),
    'r': ('Monsoon', (6, 7, 8, 9)),
    'o': ('Post-monsoon', (10, 11)),
}

CITE = ('Wei et al. (2024), Reconstructing long-term (1980-2022) daily ground particulate '
        'matter concentrations in India (LongPMInd), Earth System Science Data 16, 3565-3577, '
        'doi:10.5194/essd-16-3565-2024. Data: Zenodo doi:10.5281/zenodo.14557027, CC BY 4.0.')


def month_weights(year):
    """Days per month, so an annual mean is a mean over days rather than over months."""
    d = np.array([calendar.monthrange(year, m)[1] for m in range(1, 13)], dtype='float64')
    return d / d.sum()


def build_labels(nc_path, feats):
    """Rasterise the district polygons onto the LongPMInd grid, once."""
    import netCDF4
    from rasterio import features
    from rasterio.transform import from_origin

    with netCDF4.Dataset(nc_path) as ds:
        lat = np.asarray(ds.variables['lat'][:], dtype='float64')
        lon = np.asarray(ds.variables['lon'][:], dtype='float64')
    dy = abs(lat[1] - lat[0])
    dx = abs(lon[1] - lon[0])
    # lat/lon are cell centres and lat ascends, so the north-up origin is half a
    # cell beyond the last centre. Arrays are flipped to north-up on read.
    tr = from_origin(lon.min() - dx / 2, lat.max() + dy / 2, dx, dy)
    lab = features.rasterize(
        ((g['geometry'], i + 1) for i, g in enumerate(feats)),
        out_shape=(len(lat), len(lon)), transform=tr, fill=0, dtype='int32')
    return lab, tr, len(lat), len(lon), lat, lon


def centroid_cells(feats, lat, lon):
    """Grid index for each district's centroid, for districts smaller than a cell.

    A 10 km grid cannot resolve Chandigarh, Daman, Lakshadweep or several of
    Delhi's own districts: rasterised, they claim no cell at all. Dropping them
    would remove East and North East Delhi from a history of Indian air, which is
    absurd for the city the site leads with. They take the value of the cell their
    centroid falls in instead, and are flagged `pt` so nothing downstream can
    present a point sample as a zonal mean.
    """
    out = {}
    for i, g in enumerate(feats):
        pr = g['properties']
        yi = int(np.abs(lat[::-1] - pr['cy']).argmin())   # lat[::-1] is north-up
        xi = int(np.abs(lon - pr['cx']).argmin())
        out[i] = (yi, xi)
    return out


def zonal(vals, lab, n):
    """Mean of `vals` inside each label. Returns NaN where a district has no cell."""
    ok = np.isfinite(vals) & (lab > 0)
    ids = lab[ok]
    cnt = np.bincount(ids, minlength=n + 1).astype('float64')
    tot = np.bincount(ids, weights=vals[ok], minlength=n + 1)
    with np.errstate(invalid='ignore', divide='ignore'):
        m = tot / cnt
    m[cnt == 0] = np.nan
    return m[1:], cnt[1:]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--src', default='/tmp/lpi/pm25_monthly',
                    help='directory of pm25_arr_10km_<year>_monthly.nc files')
    ap.add_argument('--check', action='store_true', help='verify the committed file, write nothing')
    args = ap.parse_args()

    out_path = ROOT / 'data/district-history.json'
    if args.check:
        if not out_path.exists():
            sys.exit('FAIL: data/district-history.json is missing')
        d = json.loads(out_path.read_text())
        m = d['_meta']
        n_years, n_dist = len(d['years']), len(d['districts'])
        if n_years != m['years_expected'] or n_dist != m['districts_expected']:
            sys.exit(f'FAIL: {n_dist} districts x {n_years} years, expected '
                     f"{m['districts_expected']} x {m['years_expected']}")
        for key, rec in d['districts'].items():
            for band in ('a',) + tuple(SEASONS):
                if len(rec[band]) != n_years:
                    sys.exit(f'FAIL: {key} band {band} has {len(rec[band])} values, expected {n_years}')
        print(f'PASS: {n_dist} districts x {n_years} years, all bands complete.')
        return

    import netCDF4
    src = Path(args.src)
    files = sorted(src.glob('pm25_arr_10km_*_monthly.nc'))
    if not files:
        sys.exit(f'No LongPMInd monthly files in {src}. See the docstring for the Zenodo record.')
    years = [int(f.stem.split('_')[3]) for f in files]
    print(f'{len(files)} yearly files, {years[0]}-{years[-1]}', flush=True)

    feats = json.load(open(ROOT / 'data/openmaps/districts.json'))['features']
    lab, tr, nlat, nlon, lat, lon = build_labels(files[0], feats)
    n = len(feats)
    covered = int((np.bincount(lab.ravel(), minlength=n + 1)[1:] > 0).sum())
    print(f'{n} districts rasterised onto {nlat}x{nlon} at ~{abs(lat[1]-lat[0]):.3f} deg; '
          f'{covered} have at least one cell', flush=True)

    bands = ['a'] + list(SEASONS)
    series = {b: np.full((n, len(files)), np.nan) for b in bands}
    cellcount = np.bincount(lab.ravel(), minlength=n + 1)[1:]
    tiny = [i for i in range(n) if cellcount[i] == 0]
    cent = centroid_cells(feats, lat, lon) if tiny else {}
    if tiny:
        print(f'  {len(tiny)} district(s) smaller than one cell; taking their centroid cell', flush=True)

    for yi, (f, yr) in enumerate(zip(files, years)):
        with netCDF4.Dataset(f) as ds:
            arr = np.asarray(ds.variables['pm25'][:], dtype='float64')   # (12, lat, lon)
        arr = np.where(arr < 0, np.nan, arr)
        arr = arr[:, ::-1, :]                                            # to north-up
        w = month_weights(yr)
        with np.errstate(invalid='ignore'):
            annual = np.nansum(arr * w[:, None, None], axis=0)
        annual[~np.isfinite(arr).any(axis=0)] = np.nan
        series['a'][:, yi] = zonal(annual, lab, n)[0]
        for i in tiny:
            r, c = cent[i]
            series['a'][i, yi] = annual[r, c] if np.isfinite(annual[r, c]) else np.nan
        for key, (_, months) in SEASONS.items():
            idx = [m - 1 for m in months]
            sw = w[idx] / w[idx].sum()
            with np.errstate(invalid='ignore'):
                s = np.nansum(arr[idx] * sw[:, None, None], axis=0)
            s[~np.isfinite(arr[idx]).any(axis=0)] = np.nan
            series[key][:, yi] = zonal(s, lab, n)[0]
            for i in tiny:
                r, c = cent[i]
                series[key][i, yi] = s[r, c] if np.isfinite(s[r, c]) else np.nan
        if yi % 10 == 0 or yi == len(files) - 1:
            print(f'  {yr} done', flush=True)

    # A district with no cell of its own (small UT territories on a 10 km grid)
    # is dropped rather than guessed at, and counted in the metadata.
    out, dropped = {}, []
    for i, g in enumerate(feats):
        pr = g['properties']
        key = f"{pr['dt']}|{pr['st']}"
        if not np.isfinite(series['a'][i]).any():
            dropped.append(key)
            continue
        rec = {}
        for b in bands:
            rec[b] = [None if not np.isfinite(v) else round(float(v), 1) for v in series[b][i]]
        if cellcount[i] == 0:
            rec['pt'] = True       # centroid cell, not a zonal mean over the district
        out[key] = rec

    nat = {b: [round(float(np.nanmean(series[b][:, yi])), 1) for yi in range(len(files))] for b in bands}
    doc = {
        '_meta': {
            'source': 'LongPMInd monthly PM2.5, ~10 km, 1980-2022',
            'citation': CITE,
            'licence': 'CC BY 4.0',
            'model_cv_r2': {'out_of_sample': 0.77, 'out_of_site': 0.70, 'out_of_year': 0.66},
            'is_reconstruction': True,
            'reconstruction_note': (
                'A validated estimate, not a measurement. India had almost no continuous '
                'monitoring before the 2010s, so every figure before then is what a model '
                'says the air was, not what an instrument recorded.'),
            'not_comparable_with': (
                "Do not difference these against the site's 2024 annual layer: that is "
                'SatPM2.5 V6GL03 at ~1 km, this is LongPMInd at ~10 km. Use this for trend '
                'and shape, that for level.'),
            'seasons': {k: {'name': v[0], 'months': list(v[1])} for k, v in SEASONS.items()},
            'winter_note': 'Winter takes December from the same calendar year, matching build-boundary-seasonal.py.',
            'districts_expected': len(out),
            'years_expected': len(files),
            'districts_dropped_no_cell': dropped,
            'point_sampled_note': (
                'A district marked "pt" is smaller than one ~10 km cell, so it carries the '
                'value of the cell its centroid falls in rather than a mean over its own area. '
                'Chandigarh, Daman and several Delhi districts are in this position.'),
        },
        'years': years,
        'national_mean': nat,
        'districts': out,
    }
    out_path.write_text(json.dumps(doc, ensure_ascii=False, separators=(',', ':')))
    kb = out_path.stat().st_size / 1024
    print(f'\nwrote data/district-history.json — {len(out)} districts x {len(files)} years, {kb:.0f} KB')
    if dropped:
        print(f'  {len(dropped)} district(s) had no grid cell and were dropped: {dropped[:5]}')
    print(f"  national annual mean: {years[0]} = {nat['a'][0]}, {years[-1]} = {nat['a'][-1]} ug/m3")


if __name__ == '__main__':
    main()
