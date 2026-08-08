#!/usr/bin/env python3
"""
build-boundary-heat.py — attach land-surface temperature to boundary polygons,
at whatever level you point it at.

This is the payoff of build-lst-mosaic.py. Heat used to be a per-city Landsat
search: 3,675 scene picks, 3,675 cloud masks, and a layer that only existed for
the 142 cities someone had listed. With one national raster it becomes the same
shape as every other layer here — rasterise the polygons, bincount against the
grid, done — and it works identically for a ward, a village, a gram panchayat
or a district, because none of that is special-cased anywhere.

Windowing. The mosaic is 960 Mpx; loading it whole would cost ~4 GB and most of
it would be irrelevant to any given batch. Each batch reads only the window its
members' bounding boxes actually span, and a batch whose window would still be
too large — a state, say — is split until it fits, so the peak raster footprint
is bounded by MAX_PIXELS rather than by how big the biggest polygon happens to
be.

Streaming, for the same reason the tile builder streams. panchayat.slim is
1.2 GB of GeoJSON and 319,287 polygons; parsing it into a list of shapely
geometries before doing any work would cost several GB and repeat a memory
blow-up this repo has already been bitten by twice. Features are read, resolved
and written in chunks instead, so the footprint does not depend on the level.
The LGD files are ordered by state, so a chunk is naturally local and its
window is small — and when it isn't, the split above catches it.

Small polygons. A ward smaller than a ~111 m pixel can win no pixel centre. It
falls back to a point sample at its representative point, the same fallback the
PM2.5 pass makes, rather than being silently dropped.

Usage:
  python3 scripts/build-boundary-heat.py ward
  python3 scripts/build-boundary-heat.py ward --in /tmp/jv-boundaries/ward.slim.lc.geojsonl
  python3 scripts/build-boundary-heat.py ward district panchayat
"""

import json, math, os, sys
from pathlib import Path

import numpy as np
import rasterio
import rasterio.features
from affine import Affine

ROOT = Path(__file__).resolve().parent.parent
CACHE = Path(os.environ.get('JV_CACHE', '/tmp/jv-boundaries'))
RASTER = ROOT / 'data' / 'rasters' / 'lst_india_110m.tif'

MAX_PIXELS = 40_000_000      # ~160 MB as float32 — the cap a batch is split to meet
CHUNK = 5000                 # features held in memory at once


def bounds_of(feats):
    xs0 = min(f['_b'][0] for f in feats); ys0 = min(f['_b'][1] for f in feats)
    xs1 = max(f['_b'][2] for f in feats); ys1 = max(f['_b'][3] for f in feats)
    return xs0, ys0, xs1, ys1


def window_for(src, feats):
    """Pixel window covering every feature in the batch, clipped to the raster."""
    minx, miny, maxx, maxy = bounds_of(feats)
    inv = ~src.transform
    c0, r1 = inv * (minx, miny)
    c1, r0 = inv * (maxx, maxy)
    c0 = max(0, int(math.floor(c0)) - 1); c1 = min(src.width, int(math.ceil(c1)) + 2)
    r0 = max(0, int(math.floor(r0)) - 1); r1 = min(src.height, int(math.ceil(r1)) + 2)
    return c0, r0, c1, r1


def zonal(src, feats, out):
    """Mean LST for each feature in a batch, splitting if the window is too big."""
    c0, r0, c1, r1 = window_for(src, feats)
    if c1 <= c0 or r1 <= r0:
        return
    if (c1 - c0) * (r1 - r0) > MAX_PIXELS and len(feats) > 1:
        # Split along the longer axis so each half genuinely shrinks the window;
        # halving the list would not, if the outliers stayed together.
        minx, miny, maxx, maxy = bounds_of(feats)
        axis = 0 if (maxx - minx) >= (maxy - miny) else 1
        feats = sorted(feats, key=lambda f: f['_b'][axis])
        mid = len(feats) // 2
        zonal(src, feats[:mid], out)
        zonal(src, feats[mid:], out)
        return

    win = src.read(1, window=rasterio.windows.Window(c0, r0, c1 - c0, r1 - r0))
    valid = win != -32768
    if not valid.any():
        return
    temps = win.astype('float32') / 10.0
    win_tf = src.transform * Affine.translation(c0, r0)

    shapes = [(f['_g'], i + 1) for i, f in enumerate(feats)]
    ids = rasterio.features.rasterize(
        shapes, out_shape=win.shape, transform=win_tf,
        fill=0, dtype='int32', all_touched=False)

    flat_ids = np.where(valid, ids, 0).ravel()
    flat_val = np.where(valid, temps, 0).ravel()
    n = len(feats) + 1
    sums = np.bincount(flat_ids, weights=flat_val, minlength=n)
    cnts = np.bincount(flat_ids, minlength=n)

    for i, f in enumerate(feats):
        k = i + 1
        if cnts[k] > 0:
            out[f['_i']] = round(float(sums[k] / cnts[k]), 1)
        else:
            # Sub-pixel polygon: sample its representative point instead of
            # reporting nothing.
            cx, cy = f['_p']
            col, row = ~src.transform * (cx, cy)
            col, row = int(col), int(row)
            if r0 <= row < r1 and c0 <= col < c1:
                v = win[row - r0, col - c0]
                if v != -32768:
                    out[f['_i']] = round(float(v) / 10.0, 1)


def run(level, src_path, dst_path):
    from shapely.geometry import shape

    if not RASTER.exists():
        raise SystemExit(f'{RASTER} missing — run scripts/build-lst-mosaic.py first')
    if not src_path.exists():
        raise SystemExit(f'{src_path} missing — run scripts/build-boundary-tiles.py {level} first')

    total = withheat = 0
    vals = []
    with rasterio.open(RASTER) as src, \
            open(src_path, encoding='utf8') as fin, \
            open(dst_path, 'w', encoding='utf8') as fout:

        batch, raw = [], []

        def flush():
            nonlocal withheat
            if not raw:
                return
            out = {}
            if batch:
                # Sorting by longitude keeps a chunk's window tight even where
                # the source file interleaves distant features.
                zonal(src, sorted(batch, key=lambda f: f['_b'][0]), out)
            for i, feat in enumerate(raw):
                if i in out:
                    feat['properties']['h'] = out[i]
                    withheat += 1
                    vals.append(out[i])
                fout.write(json.dumps(feat, separators=(',', ':')) + '\n')
            raw.clear(); batch.clear()

        for line in fin:
            line = line.strip()
            if not line:
                continue
            feat = json.loads(line)
            total += 1
            raw.append(feat)
            g = feat.get('geometry')
            if g:
                try:
                    geom = shape(g)
                    pt = geom.representative_point()
                    batch.append({'_i': len(raw) - 1, '_g': geom, '_b': geom.bounds,
                                  '_p': (pt.x, pt.y)})
                except Exception:
                    pass
            if len(raw) >= CHUNK:
                flush()
                print(f'  {total} features, {withheat} with heat', flush=True)
        flush()

    arr = np.array(vals, dtype='float32')
    print(f'{level}: {withheat}/{total} with heat ({withheat/max(total,1)*100:.1f}%)')
    if arr.size:
        print(f'  min {arr.min():.1f}  p5 {np.percentile(arr,5):.1f}  '
              f'median {np.median(arr):.1f}  p95 {np.percentile(arr,95):.1f}  max {arr.max():.1f} degC')
    print(f'wrote {dst_path}\n')


def main():
    # Walk the arguments rather than filtering on the '--' prefix: a flag's
    # value is a bare word too, and treating '/tmp/ward.geojsonl' as a level
    # name is exactly the kind of silent misread this repo keeps paying for.
    levels, override_in, override_out = [], None, None
    args = sys.argv[1:]
    i = 0
    while i < len(args):
        a = args[i]
        if a == '--in':
            override_in = args[i + 1]; i += 2
        elif a == '--out':
            override_out = args[i + 1]; i += 2
        elif a.startswith('--'):
            raise SystemExit(f'unknown option {a}')
        else:
            levels.append(a); i += 1
    if not levels:
        raise SystemExit(__doc__)
    if (override_in or override_out) and len(levels) > 1:
        raise SystemExit('--in/--out apply to a single level')
    for level in levels:
        src = Path(override_in) if override_in else CACHE / f'{level}.slim.geojsonl'
        dst = Path(override_out) if override_out else CACHE / f'{level}.slim.heat.geojsonl'
        run(level, src, dst)


if __name__ == '__main__':
    main()
