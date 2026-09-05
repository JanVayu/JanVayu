#!/usr/bin/env python3
"""Does a global land-pressure raster tell us anything about India's air?

Someone sent us the Vizzuality / Impact Observatory **Biodiversity Intactness**
100 m product (source.coop, CC-BY-4.0, annual 2017-2025) and asked whether it
belongs on the map. This script is the answer, and it is a no. It also tests
the **Human Footprint** HFP-100 v1.2 raster from the same publisher, which
looked like the better candidate on paper and turns out to behave identically.

The short version, at district level across India:

  · Both correlate with annual PM2.5 far more strongly than anything the site
    already ships. BII r = -0.61, HFP r = +0.62, against built-up +0.41 and
    tree cover -0.32. On that number alone either looks like the best air
    predictor we have ever measured.

  · They are near-substitutes for each other (r = -0.88), so at most one could
    ever ship. Adding BII on top of HFP is worth +0.001 R2.

  · And the correlation is geography. Add state fixed effects and the
    incremental R2 over built-up + tree cover collapses to +0.007 (BII) and
    +0.008 (HFP). Almost all cross-district variation in Indian annual PM2.5
    is between states, because the Indo-Gangetic Plain traps air. A raster of
    human pressure is, at this resolution, a map of where the plain is.

So the raw coefficient is real and it is not evidence. Neither raster earns a
layer; both would have looked convincing on the front page.

**The trap that nearly ate this analysis.** district-points.json and
village-stats.json both key districts by a numeric code, and the codes are
different systems. Joining on them matched 518 of 520 districts to the wrong
place (Ahmadabad to Dhule, Anand to Mumbai) and still produced a full, plausible
regression table. The join here is by name and state, and it is checked: the
two independently derived district air figures must agree at r > 0.99 or the
script refuses to report. That assertion is the only reason the first set of
numbers was thrown away instead of published.

Run:  python3 scripts/analyse-land-pressure-vs-air.py [--dec 8]
Writes: data/land-pressure-vs-air.json
Needs: rasterio, numpy  (pip install rasterio numpy)
"""

import argparse, collections, json, math, os, re, sys
from pathlib import Path

import numpy as np
import rasterio
from affine import Affine
from rasterio import features, windows
from rasterio.warp import transform_geom

ROOT = Path(__file__).resolve().parent.parent
BII = '/vsicurl/https://data.source.coop/vizzuality/biodiversity-intactness-100m-v1-1/bii_2025.tif'
HFP = '/vsicurl/https://data.source.coop/vizzuality/hfp-100/hfp_2021_100m_v1-2_cog.tif'
# HFP stores its 0-50 score multiplied by 1000 in uint16, with 65535 for nodata.
HFP_SCALE, HFP_NODATA = 1000.0, 65535.0
# Both indices are continuous, so average-resampled overviews are the right
# thing to read. That is the opposite of the land-cover pass, where mode
# resampling on a categorical raster biases built-up upward by up to 4.5 points.
DEFAULT_DEC = 8

STATE_ALIAS = {'odisha': 'orissa', 'uttarakhand': 'uttaranchal', 'puducherry': 'pondicherry'}
norm = lambda s: re.sub(r'[^a-z]', '', s.lower())
def norm_state(s):
    x = norm(s)
    return STATE_ALIAS.get(x, x)


def zonal(url, geoms, dec, nodata_extra=None, label=''):
    """Mean of `url` inside each geometry, read from an overview at 1/dec."""
    with rasterio.open(url) as src:
        xs, ys = [], []
        for g in geoms:
            rings = [g['coordinates']] if g['type'] == 'Polygon' else g['coordinates']
            for r in rings:
                for x, y in r[0]:
                    xs.append(x); ys.append(y)
        w = windows.from_bounds(min(xs), min(ys), max(xs), max(ys),
                                transform=src.transform).round_offsets().round_lengths()
        oh, ow = int(w.height) // dec, int(w.width) // dec
        print(f'  {label}: window {int(w.width)}x{int(w.height)} -> reading {ow}x{oh}', flush=True)
        arr = src.read(1, window=w, out_shape=(oh, ow), masked=True)
        tr = src.window_transform(w) * Affine.scale(int(w.width) / ow, int(w.height) / oh)

    lab = features.rasterize(((g, i + 1) for i, g in enumerate(geoms)),
                             out_shape=(oh, ow), transform=tr, fill=0, dtype='int32')
    data = np.ma.filled(arr.astype('float64'), np.nan)
    if nodata_extra is not None:
        data[data == nodata_extra] = np.nan
    ok = np.isfinite(data) & (lab > 0)
    ids, vals = lab[ok], data[ok]
    n = np.bincount(ids, minlength=len(geoms) + 1)
    tot = np.bincount(ids, weights=vals, minlength=len(geoms) + 1)
    with np.errstate(invalid='ignore', divide='ignore'):
        mean = tot / n
    mean[n == 0] = np.nan
    print(f'  {label}: {int((n[1:] > 0).sum())}/{len(geoms)} districts with data', flush=True)
    return mean[1:]


def ols_r2(y, Xs, fe=None):
    m = np.isfinite(y)
    for x in Xs:
        m &= np.isfinite(x)
    Y = y[m]
    cols = [np.ones(m.sum())] + [x[m] for x in Xs]
    if fe is not None:
        s = [fe[i] for i in range(len(fe)) if m[i]]
        for u in sorted(set(s))[1:]:                      # drop one level as base
            cols.append(np.array([1.0 if v == u else 0.0 for v in s]))
    X = np.column_stack(cols)
    beta, *_ = np.linalg.lstsq(X, Y, rcond=None)
    resid = Y - X @ beta
    return 1 - (resid ** 2).sum() / ((Y - Y.mean()) ** 2).sum(), int(m.sum())


def pearson(x, y):
    m = np.isfinite(x) & np.isfinite(y)
    return float(np.corrcoef(x[m], y[m])[0, 1])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dec', type=int, default=DEFAULT_DEC,
                    help='overview decimation; 8 gives ~800 m pixels, ample for a district mean')
    args = ap.parse_args()

    feats = json.load(open(ROOT / 'data/openmaps/districts.json'))['features']
    pts = json.load(open(ROOT / 'data/district-points.json'))
    vstats = json.load(open(ROOT / 'netlify/functions/data/village-stats.json'))['districts']

    # Air, and the land layers the site already ships, joined by name (+ state
    # for village-stats). NOT by the district code: see the docstring.
    by_name = collections.defaultdict(list)
    for p in pts:
        by_name[p['n']].append(p)
    by_state = collections.defaultdict(dict)
    for v in vstats.values():
        by_state[norm_state(v['s'])][norm(v['d'])] = v

    rows = []
    for g in feats:
        pr = g['properties']
        near = min(by_name[pr['dt']], key=lambda p: (p['lon'] - pr['cx']) ** 2 + (p['lat'] - pr['cy']) ** 2)
        v = by_state.get(norm_state(pr['st']), {}).get(norm(pr['dt']))
        rows.append(dict(dt=pr['dt'], st=pr['st'], lat=pr['cy'], lon=pr['cx'],
                         pm25=near['sat2024'],
                         pm25_village=v['mean'] if v else None,
                         built=v['built']['mean'] if v and v.get('built') else None,
                         tree=v['tree']['mean'] if v and v.get('tree') else None))
    print(f'{len(rows)} districts; {sum(r["built"] is not None for r in rows)} with land cover', flush=True)

    geoms = [g['geometry'] for g in feats]
    print('BII 2025 (EPSG:4326)...', flush=True)
    bii = zonal(BII, geoms, args.dec, label='BII')
    print('HFP 2021 (Mollweide, so the polygons are reprojected, not the raster)...', flush=True)
    with rasterio.open(HFP) as s:
        hcrs = s.crs
    hfp = zonal(HFP, [transform_geom('EPSG:4326', hcrs, g) for g in geoms],
                args.dec, nodata_extra=HFP_NODATA, label='HFP') / HFP_SCALE
    for r, b, h in zip(rows, bii, hfp):
        r['bii'] = None if not np.isfinite(b) else round(float(b), 4)
        r['hfp'] = None if not np.isfinite(h) else round(float(h), 3)

    col = lambda k: np.array([r[k] if r[k] is not None else np.nan for r in rows], float)
    pm, pmv = col('pm25'), col('pm25_village')
    built, tree, bii_a, hfp_a = col('built'), col('tree'), col('bii'), col('hfp')
    states = [r['st'] for r in rows]

    # The join guard. These are two independent estimates of the same quantity
    # (satellite value at the district centroid; mean over the district's
    # villages). A wrong join still regresses cleanly, so this is the check that
    # has to fail loudly rather than the regression.
    agree = pearson(pm, pmv)
    print(f'\njoin check: r(centroid PM2.5, village-mean PM2.5) = {agree:+.4f}')
    if agree < 0.99:
        sys.exit(f'ABORT: district join is wrong (r={agree:.3f}, expected >0.99). Refusing to report.')

    print('\n=== simple correlation with district annual PM2.5 ===')
    simple = {}
    for lab, v in [('built-up %', built), ('tree cover %', tree), ('BII 2025', bii_a), ('HFP 2021', hfp_a)]:
        simple[lab] = round(pearson(v, pm), 3)
        print(f'  {lab:14s} r = {simple[lab]:+.3f}')
    print(f'\n  BII vs HFP r = {pearson(bii_a, hfp_a):+.3f}  (near-substitutes; at most one could ship)')

    print('\n=== nested models ===')
    base, n = ols_r2(pm, [built, tree])
    print(f'  built + tree                        R2 = {base:.3f}  (n={n})  <- already on the site')
    inc = {}
    for lab, x in [('BII', bii_a), ('HFP', hfp_a)]:
        r2, _ = ols_r2(pm, [built, tree, x])
        inc[lab] = round(r2 - base, 3)
        print(f'  built + tree + {lab:3s}                  R2 = {r2:.3f}   incremental {r2 - base:+.3f}')
    fe_base, _ = ols_r2(pm, [built, tree], fe=states)
    print(f'\n  built + tree + STATE fixed effects   R2 = {fe_base:.3f}   <- geography absorbs almost everything')
    inc_fe = {}
    for lab, x in [('BII', bii_a), ('HFP', hfp_a)]:
        r2, _ = ols_r2(pm, [built, tree, x], fe=states)
        inc_fe[lab] = round(r2 - fe_base, 3)
        print(f'  built + tree + state FE + {lab:3s}       R2 = {r2:.3f}   incremental {r2 - fe_base:+.3f}')

    out = {
        '_meta': {
            'question': 'Do global land-pressure rasters explain Indian district PM2.5 beyond what JanVayu already ships?',
            'verdict': 'No. Strong raw correlation, near-zero once state fixed effects absorb the airshed.',
            'air': 'SatPM2.5 V6GL03 (ACAG/WashU) 2024 annual mean, per district',
            'sources': {
                'bii': 'Biodiversity Intactness 100m v1.1 (Impact Observatory / Vizzuality), 2025, CC-BY-4.0',
                'hfp': 'Human Footprint HFP-100 v1.2 (Impact Observatory / Vizzuality), 2021, CC-BY-4.0',
            },
            'districts': len(rows), 'with_land_cover': int(np.isfinite(built).sum()),
            'decimation': args.dec, 'join_check_r': round(agree, 4),
            'simple_r': simple,
            'r_bii_hfp': round(pearson(bii_a, hfp_a), 3),
            'r2_built_tree': round(base, 3), 'incremental_r2': inc,
            'r2_built_tree_state_fe': round(fe_base, 3), 'incremental_r2_state_fe': inc_fe,
        },
        'districts': rows,
    }
    dst = ROOT / 'data/land-pressure-vs-air.json'
    dst.write_text(json.dumps(out, ensure_ascii=False, indent=1))
    print(f'\nwrote {dst.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
