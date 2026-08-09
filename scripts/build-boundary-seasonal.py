#!/usr/bin/env python3
"""
build-boundary-seasonal.py — per-season PM2.5 for every boundary polygon.

Why an annual mean is not enough. India's air is not one number spread evenly
over a year; it is a cycle. The Indo-Gangetic plain spends the monsoon close to
breathable and November in an emergency, and an annual average of the two
describes neither. A reader in Ludhiana looking at "annual 92" has no way to
tell whether that is a steady 92 or a summer of 45 and a winter of 150 — and
the difference is the whole policy argument.

Four seasons, not twelve months. The twelve monthly grids exist, and carrying
all of them would add twelve numbers to every one of 400,000 polygons, roughly
doubling every tile for detail nobody reads at map zoom. Four captures the
actual structure of the Indian year:

    w  winter        Dec, Jan, Feb    inversions trap what is already there
    s  summer        Mar, Apr, May    pre-monsoon; dust, and the cleanest air
                                      in the south
    r  rains         Jun-Sep          monsoon washout, the annual minimum
    o  post-monsoon  Oct, Nov         stubble burning and Diwali; the peak

Each season is the mean of its months, so `w` weights December, January and
February equally rather than weighting whichever month happened to be
downloaded last.

Downloads are streamed and deleted. Twelve monthly files are 1.1 GB; they are
fetched one at a time, added into the season they belong to, and removed, so
peak disk is one file and peak memory is two grids.

Usage:
  python3 scripts/build-boundary-seasonal.py ward panchayat [--year 2024]
  python3 scripts/build-boundary-seasonal.py --grids-only
"""

import json, os, sys, urllib.request
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
CACHE = Path(os.environ.get('JV_CACHE', '/tmp/jv-boundaries'))
GRIDS = CACHE / 'seasonal'
GRIDS.mkdir(parents=True, exist_ok=True)

import importlib.util
_spec = importlib.util.spec_from_file_location('bvp', ROOT / 'scripts' / 'build-village-pm25.py')
bvp = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(bvp)

MONTHLY = ('https://satpmdata.s3.amazonaws.com/V6GL03/FineResolution/AS/Monthly/'
           '{y}/V6GL03.CNNPM25.AS.{y}{m:02d}-{y}{m:02d}.nc')

SEASONS = {
    'w': ('Winter', (12, 1, 2)),
    's': ('Summer', (3, 4, 5)),
    'r': ('Monsoon', (6, 7, 8, 9)),
    'o': ('Post-monsoon', (10, 11)),
}

YEAR = int(sys.argv[sys.argv.index('--year') + 1]) if '--year' in sys.argv else 2024


def month_grid(year, month):
    """One month's PM2.5 over India, downloaded then deleted."""
    from netCDF4 import Dataset
    from affine import Affine
    path = GRIDS / f'{year}{month:02d}.nc'
    url = MONTHLY.format(y=year, m=month)
    if not path.exists():
        print(f'  downloading {year}-{month:02d} …', flush=True)
        urllib.request.urlretrieve(url, path)
    ds = Dataset(path)
    lat, lon = ds['lat'][:], ds['lon'][:]
    r0 = int(np.searchsorted(lat, bvp.LAT_MIN)); r1 = int(np.searchsorted(lat, bvp.LAT_MAX))
    c0 = int(np.searchsorted(lon, bvp.LON_MIN)); c1 = int(np.searchsorted(lon, bvp.LON_MAX))
    pm = np.array(ds['PM25'][r0:r1, c0:c1], dtype='float32')[::-1, :]
    top = float(lat[r1 - 1]) + bvp.STEP / 2
    left = float(lon[c0]) - bvp.STEP / 2
    tf = Affine(bvp.STEP, 0, left, 0, -bvp.STEP, top)
    ds.close()
    path.unlink()                       # 95 MB each; keep peak disk at one file
    pm[pm < 0] = np.nan
    return pm, tf


def seasonal_grids(year):
    """Mean grid per season, cached as .npy so a re-run skips the downloads."""
    out, transform = {}, None
    for key, (label, months) in SEASONS.items():
        cached = GRIDS / f'{year}.{key}.npy'
        tf_path = GRIDS / f'{year}.transform.json'
        if cached.exists() and tf_path.exists():
            out[key] = np.load(cached)
            from affine import Affine
            transform = Affine(*json.loads(tf_path.read_text()))
            print(f'{label}: cached', flush=True)
            continue
        acc = None
        for m in months:
            pm, tf = month_grid(year, m)
            transform = tf
            acc = pm if acc is None else acc + pm
        acc /= len(months)
        np.save(cached, acc)
        (GRIDS / f'{year}.transform.json').write_text(json.dumps(list(transform)[:6]))
        out[key] = acc
        print(f'{label}: {np.nanmin(acc):.1f}-{np.nanmax(acc):.1f} ug/m3 '
              f'(mean {np.nanmean(acc):.1f}) from {len(months)} months', flush=True)
    return out, transform


def run(levels, year):
    from shapely.geometry import shape
    grids, transform = seasonal_grids(year)
    if not levels:
        return

    for level in levels:
        src = CACHE / f'{level}.slim.full.geojsonl'
        if not src.exists():
            print(f'{level}: {src.name} missing — skipped', flush=True)
            continue
        dst = CACHE / f'{level}.slim.seasonal.geojsonl'
        # Streamed in chunks. Holding all of panchayat at once means 319,287
        # shapely geometries on top of 1.2 GB of parsed JSON, which is how the
        # first attempt at this got itself OOM-killed — the same memory blow-up
        # the tile builder and the heat pass were already written to avoid.
        CHUNK = 20000
        total = got = bad = 0
        with open(src, encoding='utf8') as fin, open(dst, 'w', encoding='utf8') as fout:
            recs, geoms = [], []

            def flush():
                nonlocal total, got, bad
                if not recs:
                    return
                for key in SEASONS:
                    vals = bvp.district_means(grids[key], transform, [(None, g) for g in geoms])
                    for r, v in zip(recs, vals):
                        if v is not None:
                            r['properties'][key] = v
                for r in recs:
                    p = r['properties']
                    ss = [p[k] for k in SEASONS if k in p]
                    if len(ss) == len(SEASONS):
                        got += 1
                    # The annual mean has to sit inside the seasonal spread. If
                    # it does not, a grid is misaligned and the numbers are not
                    # worth shipping.
                    if 'p' in p and ss and not (min(ss) - 1 <= p['p'] <= max(ss) + 1):
                        bad += 1
                    fout.write(json.dumps(r, separators=(',', ':')) + '\n')
                total += len(recs)
                recs.clear(); geoms.clear()

            for line in fin:
                line = line.strip()
                if not line:
                    continue
                r = json.loads(line)
                recs.append(r)
                try:
                    geoms.append(shape(r['geometry']))
                except Exception:
                    geoms.append(None)
                if len(recs) >= CHUNK:
                    flush()
                    print(f'  {total} done', flush=True)
            flush()
        print(f'{level}: {got}/{total} with all four seasons; '
              f'annual outside the seasonal range for {bad}', flush=True)
        print(f'wrote {dst}\n', flush=True)


def main():
    levels = [a for a in sys.argv[1:] if not a.startswith('--')
              and not a.isdigit()]
    run(levels, YEAR)


if __name__ == '__main__':
    main()
