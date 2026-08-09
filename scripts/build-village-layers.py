#!/usr/bin/env python3
"""
build-village-layers.py — attach heat, land cover and the four seasons to every
village polygon, so the village layer answers the same questions as every other
level of the atlas.

Why this exists
---------------
Villages were the one gap. Every other level — state, district, block, panchayat,
ULB, ward — ships as a PMTiles archive with nine numbers baked into each polygon,
and the map's Colour menu switches between them. Villages could not join that:
584,615 polygons make a 267 MB archive, which is not a thing to put in a git
repo or ask a phone to range-request. So the layer kept its own loader — one
quantized TopoJSON per district, fetched for whatever is on screen — and carried
only annual PM2.5, written by build-village-pm25.py.

The values, though, exist. build-boundary-landcover.py and build-boundary-heat.py
score every level from a national raster, villages included; the results were
simply going nowhere. This script puts them where the map can read them.

The join, and why it is not a dictionary lookup
-----------------------------------------------
The obvious join is the LGD village code. It is wrong on 8% of the country:
4,857 codes are carried by more than one polygon (48,435 features), and those
polygons are not copies of each other — code 645088 covers two shapes, one 12%
treed and one 67%. Keying on code alone would hand both the same number and be
confidently wrong about one of them.

So: unique codes join directly, and the ~48k features whose code is shared are
disambiguated by centroid — decode the TopoJSON polygon, and among the boundary
records sharing that code take the nearest. The topology is quantized and the
boundary geometry is not, so the centroids differ by metres; the competing
candidates for a shared code are usually districts apart. A match further than
MAX_CENTROID_KM is refused rather than guessed, and counted in the summary.

Codes are compared with leading zeros stripped: the boundary files keep them as
strings ("036275"), the TopoJSON stores them as integers, and 36275 is the same
village as 036275.

The 37,563 villages with no code at all
---------------------------------------
LGD ships 37,563 village polygons with an empty vil_lgd and a blank name — 6.4%
of the country, and on the map a scatter of grey holes rather than one missing
region. Code matching cannot reach them by construction: the field is empty on
both sides, and a name match has nothing to compare either.

They are, however, the same polygons in both files, so geometry answers it. A
second pass grids the codeless boundary records into 0.02-degree cells (~2 km),
and for each still-unmatched village searches its own cell and the eight around
it for the nearest centroid within MAX_CODELESS_KM. Each boundary record is
claimed once, so two neighbouring villages cannot both take the same one. The
threshold is deliberately tight: quantization moves a centroid by metres, and
anything a kilometre away is a different village, not a rounded one.

Two key collisions, renamed rather than papered over
----------------------------------------------------
The metric keys are the atlas's, and two of them were already taken here:

  * a village feature's "s" is its STATE NAME, and "s" is summer air. Every
    feature's state moves to "st" in this pass — build-villages.mjs emits "st"
    from now on, and app.js reads it there.
  * a district's "b" in _index.json is its BOUNDING BOX, which the map uses to
    decide which district files to fetch, and "b" is built-up. Writing a mean
    over it would have broken the village layer outright, so the per-district
    means go in a nested "m" object instead of alongside.

Neither is a fallback: this script rewrites every village file, so after it runs
there is no old shape left to be compatible with.

Run:  python3 scripts/build-village-layers.py
      python3 scripts/build-village-layers.py --src /tmp/jv-boundaries/village.slim.seasonal.geojsonl
Deps: shapely.
Writes: adds h, t, g, b, w, s, r, o to each village in
        data/villages/<dist_lgd>.json, and per-district means to _index.json.
"""

import argparse, json, os, sys
from collections import defaultdict
from pathlib import Path

from shapely.geometry import shape as shp_shape

ROOT = Path(__file__).resolve().parent.parent
VILLAGES = ROOT / 'data' / 'villages'
CACHE = Path(os.environ.get('JV_CACHE', '/tmp/jv-boundaries'))

# The metrics to carry over. 'p' is deliberately absent: build-village-pm25.py
# already wrote it, sampling the same grid against these same polygons, and
# overwriting it here would only introduce a second answer to one question.
METRICS = ('h', 't', 'g', 'b', 'w', 's', 'r', 'o')
# Beyond this, a shared code is treated as unmatched. Quantization moves a
# centroid by metres; the real collisions are in different districts.
MAX_CENTROID_KM = 25.0
# The codeless pass has no code to corroborate the geometry, so it gets a much
# tighter radius: a match is either the same polygon or it is nothing.
MAX_CODELESS_KM = 3.0
CELL = 0.02          # ~2 km grid for the codeless index


def norm(code):
    if code is None:
        return None
    s = str(code).lstrip('0')
    return s or '0'


# ── TopoJSON decode (same shape as build-village-pm25.py) ───────────────────

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


def topo_centroid(topo, g):
    """Centroid of one TopoJSON geometry, or None if it will not decode."""
    t = g.get('type')
    try:
        if t == 'Polygon':
            gj = {'type': 'Polygon', 'coordinates': [_ring(topo, r) for r in g['arcs']]}
        elif t == 'MultiPolygon':
            gj = {'type': 'MultiPolygon',
                  'coordinates': [[_ring(topo, r) for r in poly] for poly in g['arcs']]}
        else:
            return None
        geom = shp_shape(gj)
        if not geom.is_valid:
            geom = geom.buffer(0)
        c = geom.centroid
        return (c.x, c.y)
    except Exception:
        return None


# ── the boundary side ───────────────────────────────────────────────────────

def load_boundary(src, keep_p=False):
    """(code -> list of {vals, xy}, grid of codeless records).

    xy is filled only where a code repeats, because a shapely parse per record
    over 584,615 records is the expensive part of this script and 92% of them
    never need one.
    """
    by_code = defaultdict(list)
    codeless = []
    n = 0
    with open(src, encoding='utf8') as fh:
        for line in fh:
            line = line.strip()
            if not line:
                continue
            n += 1
            rec = json.loads(line)
            p = rec.get('properties') or {}
            k = norm(p.get('c'))
            keys = METRICS + ('p',) if keep_p else METRICS
            vals = {m: p[m] for m in keys if p.get(m) is not None}
            if not vals:
                continue
            if k is None:
                try:
                    codeless.append({'vals': vals,
                                     'xy': shp_shape(rec['geometry']).centroid.coords[0],
                                     'used': False})
                except Exception:
                    pass
                continue
            by_code[k].append({'vals': vals, 'geom': rec.get('geometry')})
    dup = {k: v for k, v in by_code.items() if len(v) > 1}
    print(f'boundary: {n} records, {len(by_code)} codes, {len(dup)} shared by '
          f'{sum(len(v) for v in dup.values())} records, '
          f'{len(codeless)} with no code', flush=True)

    # Centroids cost a shapely parse each, so only compute them where the code
    # is ambiguous — that is 8% of the file, not all of it.
    for k, recs in dup.items():
        for r in recs:
            try:
                r['xy'] = shp_shape(r['geom']).centroid.coords[0]
            except Exception:
                r['xy'] = None
    for recs in by_code.values():
        for r in recs:
            r.pop('geom', None)

    grid = defaultdict(list)
    for r in codeless:
        grid[(int(r['xy'][0] // CELL), int(r['xy'][1] // CELL))].append(r)
    return by_code, grid


def pick_codeless(grid, xy):
    """Nearest unclaimed codeless record, or None. Claims what it returns."""
    if xy is None:
        return None
    cx, cy = int(xy[0] // CELL), int(xy[1] // CELL)
    best, bestd = None, None
    for dx in (-1, 0, 1):
        for dy in (-1, 0, 1):
            for r in grid.get((cx + dx, cy + dy), ()):
                if r['used']:
                    continue
                d = (r['xy'][0] - xy[0]) ** 2 + (r['xy'][1] - xy[1]) ** 2
                if bestd is None or d < bestd:
                    best, bestd = r, d
    if best is None or bestd ** 0.5 * 111.0 > MAX_CODELESS_KM:
        return None
    best['used'] = True
    return best['vals']


def pick(recs, xy):
    """Which boundary record is this polygon? Nearest centroid, or nothing."""
    if len(recs) == 1:
        return recs[0]['vals']
    if xy is None:
        return None
    best, bestd = None, None
    for r in recs:
        p = r.get('xy')
        if p is None:
            continue
        # Degrees are fine for "which of these is closer"; the answer never
        # turns on the cos(lat) correction at the distances involved.
        d = (p[0] - xy[0]) ** 2 + (p[1] - xy[1]) ** 2
        if bestd is None or d < bestd:
            best, bestd = r, d
    if best is None or bestd ** 0.5 * 111.0 > MAX_CENTROID_KM:
        return None
    return best['vals']


def report(diffs, matched, by_geometry, unmatched):
    """How far apart are the two independent annual PM2.5 figures?"""
    def stats(rows, label):
        if not rows:
            print(f'  {label}: none')
            return
        rows = sorted(rows)
        n = len(rows)
        over = sum(1 for d in rows if d > 2.0)
        print(f'  {label}: n={n}  median {rows[n // 2]:.2f}  p95 {rows[int(n * 0.95)]:.2f}  '
              f'max {rows[-1]:.2f}  |  {over} ({over / n * 100:.3f}%) differ by more than 2 ug/m3')
    print(f'\nverify — annual PM2.5, TopoJSON polygon vs boundary polygon, same grid')
    print(f'  {matched} matched, {unmatched} unmatched, {by_geometry} of the matches by geometry')
    stats([d for d, geo in diffs if not geo], 'by code    ')
    stats([d for d, geo in diffs if geo], 'by geometry')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--src', default=str(CACHE / 'village.slim.seasonal.geojsonl'))
    # Writes nothing; checks the join instead. Both files carry an annual PM2.5
    # computed independently — build-village-pm25.py sampled the TopoJSON
    # polygon, build-boundary-tiles.py sampled the boundary polygon, from the
    # same grid. If a match is the same village the two agree to a rounding
    # error; if it is the village next door they diverge. That is the only
    # check available on a join with no key, so it is worth running.
    ap.add_argument('--verify', action='store_true')
    args = ap.parse_args()

    src = Path(args.src)
    if not src.exists():
        raise SystemExit(f'{src} missing — run the landcover, heat and seasonal '
                         f'passes for the village level first')

    by_code, codeless_grid = load_boundary(src, keep_p=args.verify)

    index_path = VILLAGES / '_index.json'
    index = json.loads(index_path.read_text())
    files = sorted(p for p in VILLAGES.glob('*.json') if p.name != '_index.json')

    total = matched = unmatched = ambiguous = renamed = by_geometry = 0
    per_metric = defaultdict(int)
    diffs = []

    for done, path in enumerate(files, 1):
        topo = json.loads(path.read_text())
        geoms = topo['objects']['villages']['geometries']
        acc = defaultdict(list)

        for g in geoms:
            total += 1
            props = g.setdefault('properties', {})
            # State name out of the way before summer air moves in. Guarded on
            # the type, not on presence: run this script twice and the second
            # pass would otherwise find summer air sitting in 's' and move that
            # into 'st', silently replacing every state name with a number.
            if isinstance(props.get('s'), str):
                props['st'] = props.pop('s')
                renamed += 1
            k = norm(props.get('c'))
            recs = by_code.get(k) if k is not None else None
            # '0' is what an empty vil_lgd normalises to, and it is 37,563
            # different villages rather than one — never a code to join on.
            if k == '0':
                recs = None
            vals = None
            if recs:
                vals = pick(recs, topo_centroid(topo, g) if len(recs) > 1 else None)
                if vals is None:
                    ambiguous += 1
            by_geo_this = False
            if vals is None:
                vals = pick_codeless(codeless_grid, topo_centroid(topo, g))
                if vals is not None:
                    by_geometry += 1
                    by_geo_this = True
            if vals is None:
                unmatched += 1
                continue
            matched += 1
            if args.verify:
                mine, theirs = props.get('p'), vals.get('p')
                if isinstance(mine, (int, float)) and isinstance(theirs, (int, float)):
                    diffs.append((abs(mine - theirs), by_geo_this))
                continue
            for m, v in vals.items():
                props[m] = v
                per_metric[m] += 1
                acc[m].append(v)

        if not args.verify:
            path.write_text(json.dumps(topo, separators=(',', ':')))

        did = path.stem
        if did in index and not args.verify:
            # Nested, so a metric named 'b' cannot land on the district bbox.
            means = index[did].setdefault('m', {})
            for m, vs in acc.items():
                if vs:
                    means[m] = round(sum(vs) / len(vs), 1)

        if done % 100 == 0:
            print(f'  {done}/{len(files)} districts', flush=True)

    if args.verify:
        report(diffs, matched, by_geometry, unmatched)
        return

    meta = index.setdefault('_meta', {})
    meta['heatSource'] = ('Landsat 8/9 Collection 2 Level-2 surface temperature, '
                          'pre-monsoon, cloud-masked — via Microsoft Planetary Computer')
    meta['landcoverSource'] = 'ESA WorldCover 2021 (10 m), CC BY 4.0'
    meta['landcoverYear'] = 2021
    meta['seasonYear'] = 2024
    index_path.write_text(json.dumps(index, separators=(',', ':')))

    print(f'\n{matched}/{total} villages matched ({matched / total * 100:.2f}%)')
    print(f'  {matched - by_geometry} by LGD code, {by_geometry} by geometry '
          f'(codeless, within {MAX_CODELESS_KM} km)')
    print(f'  {renamed} state names moved from "s" to "st"')
    print(f'  {unmatched} left without values')
    print(f'  {ambiguous} shared a code and no candidate was within {MAX_CENTROID_KM} km')
    for m in METRICS:
        print(f'  {m}: {per_metric[m]} villages ({per_metric[m] / total * 100:.2f}%)')


if __name__ == '__main__':
    main()
