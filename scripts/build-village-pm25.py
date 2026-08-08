#!/usr/bin/env python3
"""
build-village-pm25.py — attach an ANNUAL mean PM2.5 to every village polygon.

Why this exists
---------------
The live map can only estimate a village's air from the nearest city monitor,
and with ~565 continuous CPCB stations against 584,615 villages, most villages
have no monitor close enough. That is honest but unsatisfying. Satellite-derived
PM2.5 fills the gap on a *different timescale*: it cannot tell you today's air,
but it gives a defensible ANNUAL AVERAGE for every village in the country.

Source
------
SatPM2.5 V6GL03 (Atmospheric Composition Analysis Group, Washington University
in St. Louis) — annual mean surface PM2.5 at 0.01 deg (~1 km), estimated by a
convolutional neural network from satellite AOD (MODIS/MISR/SeaWiFS/VIIRS)
combined with the GEOS-Chem chemical transport model and calibrated against
ground monitors. CC BY 4.0, public AWS Open Data bucket, no credentials.
  https://registry.opendata.aws/surface-pm2-5-v6gl/

Known limitation, disclosed on the site
---------------------------------------
A ~1 km CNN/AOD product resolves regional exposure well but smooths hyperlocal
point sources. Byrnihat, a small industrial pocket that topped IQAir's city
ranking, reads far lower here than its ground station does. So this layer is
good for "what does this district breathe over a year" and blind to a single
smelter next door. Treat it as regional background, not a fenceline reading.

Run:  python3 scripts/build-village-pm25.py [--year 2024]
Deps: netCDF4, numpy, rasterio, shapely.
Writes: adds "p" (annual mean ug/m3, 1dp) to each village in
        data/villages/<dist_lgd>.json, and per-district stats to _index.json.
"""

import argparse, json, math, os, sys, urllib.request
from pathlib import Path

import numpy as np
import rasterio.features
from affine import Affine
from netCDF4 import Dataset
from shapely.geometry import shape as shp_shape

ROOT = Path(__file__).resolve().parent.parent
VILLAGES = ROOT / 'data' / 'villages'
CACHE = Path(os.environ.get('JANVAYU_CACHE', '/tmp/janvayu-pm25'))

S3 = ('https://satpmdata.s3.amazonaws.com/V6GL03/FineResolution/AS/Annual/'
      'V6GL03.CNNPM25.AS.{y}01-{y}12.nc')

# India bounding box, padded — the Asia grid spans 65-145E / -10-60N.
LON_MIN, LON_MAX, LAT_MIN, LAT_MAX = 67.0, 98.5, 5.5, 37.5
STEP = 0.01


# ── TopoJSON → shapely ──────────────────────────────────────────────────────
# The village files are quantized TopoJSON (shared arcs). Decoding here avoids
# a dependency and keeps the statistics aligned with the exact geometry the
# site ships, rather than a separately-simplified copy.

def _arc(topo, i):
    rev = i < 0
    if rev:
        i = ~i
    sx, sy = topo['transform']['scale']
    tx, ty = topo['transform']['translate']
    x = y = 0
    pts = []
    for dx, dy in topo['arcs'][i]:
        x += dx
        y += dy
        pts.append((x * sx + tx, y * sy + ty))
    return pts[::-1] if rev else pts


def _ring(topo, arc_ids):
    out = []
    for i in arc_ids:
        pts = _arc(topo, i)
        out.extend(pts[1:] if out else pts)
    return out


def topo_geometries(topo):
    """Yield (properties, shapely geometry) for each village."""
    for g in topo['objects']['villages']['geometries']:
        t = g['type']
        if t == 'Polygon':
            coords = [_ring(topo, r) for r in g['arcs']]
            gj = {'type': 'Polygon', 'coordinates': coords}
        elif t == 'MultiPolygon':
            coords = [[_ring(topo, r) for r in poly] for poly in g['arcs']]
            gj = {'type': 'MultiPolygon', 'coordinates': coords}
        else:
            yield g.get('properties', {}), None
            continue
        try:
            geom = shp_shape(gj)
            if not geom.is_valid:
                geom = geom.buffer(0)
        except Exception:
            geom = None
        yield g.get('properties', {}), geom


# ── PM2.5 grid ──────────────────────────────────────────────────────────────

def load_grid(year):
    CACHE.mkdir(parents=True, exist_ok=True)
    path = CACHE / f'AS.{year}.nc'
    if not path.exists():
        url = S3.format(y=year)
        print(f'Downloading {url} (~93 MB)…', flush=True)
        urllib.request.urlretrieve(url, path)
    ds = Dataset(path)
    lat = ds['lat'][:]
    lon = ds['lon'][:]
    r0 = int(np.searchsorted(lat, LAT_MIN))
    r1 = int(np.searchsorted(lat, LAT_MAX))
    c0 = int(np.searchsorted(lon, LON_MIN))
    c1 = int(np.searchsorted(lon, LON_MAX))
    pm = np.array(ds['PM25'][r0:r1, c0:c1], dtype='float32')
    # The NetCDF runs south→north; flip to north-up so a standard affine applies.
    pm = pm[::-1, :]
    top = float(lat[r1 - 1]) + STEP / 2
    left = float(lon[c0]) - STEP / 2
    transform = Affine(STEP, 0, left, 0, -STEP, top)
    ds.close()
    pm[pm < 0] = np.nan
    print(f'Grid: {pm.shape[0]}x{pm.shape[1]} @ {STEP} deg, '
          f'{np.nanmin(pm):.1f}-{np.nanmax(pm):.1f} ug/m3', flush=True)
    return pm, transform


def sample_point(pm, transform, x, y):
    inv = ~transform
    c, r = inv * (x, y)
    r, c = int(r), int(c)
    if 0 <= r < pm.shape[0] and 0 <= c < pm.shape[1]:
        v = pm[r, c]
        if np.isfinite(v):
            return float(v)
    return None


def district_means(pm, transform, entries):
    """Area-mean PM2.5 per village, by rasterising a district's villages once.

    Villages tile the plane and don't overlap, so a single id-raster plus
    bincount is far cheaper than masking 584k polygons individually. Villages
    smaller than a ~1 km pixel win no pixel centre and fall back to a centroid
    sample, which is the honest answer at that scale anyway.
    """
    geoms = [(g, i + 1) for i, (_, g) in enumerate(entries) if g is not None]
    out = [None] * len(entries)
    if not geoms:
        return out

    minx = min(g.bounds[0] for g, _ in geoms)
    miny = min(g.bounds[1] for g, _ in geoms)
    maxx = max(g.bounds[2] for g, _ in geoms)
    maxy = max(g.bounds[3] for g, _ in geoms)
    inv = ~transform
    c0, r1 = inv * (minx, miny)
    c1, r0 = inv * (maxx, maxy)
    c0, c1 = max(0, int(math.floor(c0))), min(pm.shape[1], int(math.ceil(c1)) + 1)
    r0, r1 = max(0, int(math.floor(r0))), min(pm.shape[0], int(math.ceil(r1)) + 1)
    if c1 <= c0 or r1 <= r0:
        return out

    win = pm[r0:r1, c0:c1]
    win_tf = transform * Affine.translation(c0, r0)
    ids = rasterio.features.rasterize(
        geoms, out_shape=win.shape, transform=win_tf,
        fill=0, dtype='int32', all_touched=False)

    valid = np.isfinite(win)
    flat_ids = np.where(valid, ids, 0).ravel()
    flat_val = np.where(valid, win, 0).ravel()
    n = len(entries) + 1
    sums = np.bincount(flat_ids, weights=flat_val, minlength=n)
    cnts = np.bincount(flat_ids, minlength=n)

    for i, (_, g) in enumerate(entries):
        if g is None:
            continue
        k = i + 1
        if cnts[k] > 0:
            out[i] = round(float(sums[k] / cnts[k]), 1)
        else:
            c = g.representative_point()
            v = sample_point(pm, transform, c.x, c.y)
            out[i] = round(v, 1) if v is not None else None
    return out


def build_wards(pm, transform, year):
    """Same zonal pass over the Ward Atlas (39 cities, plain GeoJSON).

    This closes the gap Ask JanVayu was instructed to admit: the ward map could
    pair LIVE air with ANNUAL structure (heat / green / built) but had no annual
    air to put beside them, so no honest year-scale comparison was possible.
    """
    from shapely.geometry import shape as _shape
    wards_dir = ROOT / 'data' / 'wards'
    files = sorted(wards_dir.glob('*.json'))
    total = filled = 0
    for path in files:
        geo = json.loads(path.read_text())
        feats = geo.get('features') or []
        entries = []
        for f in feats:
            try:
                g = _shape(f['geometry'])
                if not g.is_valid:
                    g = g.buffer(0)
            except Exception:
                g = None
            entries.append((f.get('properties', {}), g))
        means = district_means(pm, transform, entries)
        n = 0
        for f, m in zip(feats, means):
            if m is not None:
                f.setdefault('properties', {})['pma'] = m
                n += 1
        geo['pma_year'] = year
        path.write_text(json.dumps(geo, separators=(',', ':')))
        total += len(feats)
        filled += n
    print(f'Wards: annual PM2.5 {year} attached to {filled}/{total} wards '
          f'across {len(files)} cities.')

    # Mirror into the chatbot's ward-stats so Ask JanVayu can use it too.
    stats_path = ROOT / 'netlify' / 'functions' / 'data' / 'ward-stats.json'
    if stats_path.exists():
        stats = json.loads(stats_path.read_text())
        by_city = {}
        for path in files:
            geo = json.loads(path.read_text())
            by_city[path.stem] = {
                (f['properties'].get('name') or ''): f['properties'].get('pma')
                for f in (geo.get('features') or [])
            }
        touched = 0
        for key, city in stats.items():
            lookup = by_city.get(key) or {}
            for w in city.get('wards', []):
                v = lookup.get(w.get('n'))
                if v is not None:
                    w['p'] = v
                    touched += 1
            if lookup:
                city['pma_year'] = year
        stats_path.write_text(json.dumps(stats, separators=(',', ':')))
        print(f'ward-stats.json: annual PM2.5 on {touched} wards.')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--year', type=int, default=2024)
    ap.add_argument('--target', choices=['villages', 'wards', 'both'], default='villages')
    args = ap.parse_args()

    pm, transform = load_grid(args.year)
    if args.target in ('wards', 'both'):
        build_wards(pm, transform, args.year)
        if args.target == 'wards':
            return

    index_path = VILLAGES / '_index.json'
    index = json.loads(index_path.read_text())

    files = sorted(p for p in VILLAGES.glob('*.json') if p.name != '_index.json')
    total = filled = centroid_only = 0
    done = 0

    for path in files:
        topo = json.loads(path.read_text())
        entries = list(topo_geometries(topo))
        means = district_means(pm, transform, entries)

        vals = []
        for g, m in zip(topo['objects']['villages']['geometries'], means):
            if m is not None:
                g.setdefault('properties', {})['p'] = m
                vals.append(m)
        total += len(entries)
        filled += len(vals)

        path.write_text(json.dumps(topo, separators=(',', ':')))

        did = path.stem
        if did in index and vals:
            index[did]['p'] = round(float(np.mean(vals)), 1)
            index[did]['pmin'] = round(float(np.min(vals)), 1)
            index[did]['pmax'] = round(float(np.max(vals)), 1)

        done += 1
        if done % 100 == 0:
            print(f'  {done}/{len(files)} districts', flush=True)

    index['_meta'] = {
        'pm25Year': args.year,
        'pm25Source': ('SatPM2.5 V6GL03 (CNN, ~1 km) — Atmospheric Composition '
                       'Analysis Group, Washington University in St. Louis'),
        'pm25Licence': 'CC BY 4.0',
        'pm25Url': 'https://registry.opendata.aws/surface-pm2-5-v6gl/',
    }
    index_path.write_text(json.dumps(index, separators=(',', ':')))

    print(f'\nAnnual PM2.5 {args.year} attached to {filled}/{total} villages '
          f'across {len(files)} districts.')


if __name__ == '__main__':
    main()
