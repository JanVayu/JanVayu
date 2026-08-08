#!/usr/bin/env python3
"""
build-ward-landcover-national.py — green cover and built-up share for all
70,417 municipal wards in the country, not the 142 cities the ward panel knew.

Why: the unified boundary map made the ward panel redundant except for four
layers that only existed for those 142 cities — heat, green cover, built-up,
and the receptor overlays. Folding them into the map as-is would have meant a
green-cover layer that works in 142 places and silently does nothing in the
other 3,533 ULBs, which is the same "your town isn't in our list" failure the
unified map just removed. So the layers have to go national before the panel
can go away.

Green and built-up are the tractable half: ESA WorldCover is a fixed 10 m
global raster, and the zonal pass is the same rasterise-and-count already used
per city. Heat is the expensive half — it needs a per-city Landsat scene search
and cloud masking across 3,675 ULBs — and is deliberately not attempted here.

Reads the cached ward slim produced by build-boundary-tiles.py, adds `g` and
`b` per ward, and rewrites it in place so the tiles can be rebuilt from it.

Usage:  python3 scripts/build-ward-landcover-national.py [--limit N]
"""

import json, os, sys, importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CACHE = Path(os.environ.get('JV_CACHE', '/tmp/jv-boundaries'))
SLIM = CACHE / 'ward.slim.geojsonl'
OUT = CACHE / 'ward.slim.lc.geojsonl'

_spec = importlib.util.spec_from_file_location('bws', ROOT / 'scripts' / 'build-ward-satellite.py')
bws = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(bws)

LIMIT = int(sys.argv[sys.argv.index('--limit') + 1]) if '--limit' in sys.argv else 0
CHUNK = 2000


def centroid(geom):
    """Area-weighted centroid; WorldCover tiles are picked from it."""
    from shapely.geometry import shape
    try:
        g = shape(geom)
        c = g.representative_point()
        return round(c.x, 5), round(c.y, 5)
    except Exception:
        return None, None


def main():
    if not SLIM.exists():
        raise SystemExit(f'{SLIM} missing — run build-boundary-tiles.py ward first')

    done = ok = 0
    buf = []
    with open(SLIM, encoding='utf8') as fin, open(OUT, 'w', encoding='utf8') as fout:

        def flush():
            nonlocal ok, done
            if not buf:
                return
            # per_ward_worldcover groups tile opens by centroid, so a chunk
            # that spans one WorldCover tile costs one open rather than N.
            try:
                vals = bws.per_ward_worldcover(buf)
            except Exception as e:
                print(f'  chunk failed ({e}) — leaving {len(buf)} wards without land cover', flush=True)
                vals = [(None, None)] * len(buf)
            for f, (g, b) in zip(buf, vals):
                if g is not None:
                    f['properties']['g'] = g
                    f['properties']['b'] = b
                    ok += 1
                f['properties'].pop('cx', None)
                f['properties'].pop('cy', None)
                fout.write(json.dumps(f, separators=(',', ':')) + '\n')
            done += len(buf)
            print(f'  {done} wards processed, {ok} with land cover', flush=True)
            buf.clear()

        for line in fin:
            line = line.strip()
            if not line:
                continue
            f = json.loads(line)
            cx, cy = centroid(f['geometry'])
            if cx is None:
                f['properties'].pop('cx', None)
                fout.write(json.dumps(f, separators=(',', ':')) + '\n')
                done += 1
                continue
            f['properties']['cx'], f['properties']['cy'] = cx, cy
            buf.append(f)
            if len(buf) >= CHUNK:
                # Keep wards sharing a WorldCover tile together — sorting the
                # chunk by tile makes the grouping inside the zonal pass hit.
                buf.sort(key=lambda x: bws.wc_tile_name(x['properties']['cx'], x['properties']['cy']))
                flush()
            if LIMIT and done >= LIMIT:
                break
        buf.sort(key=lambda x: bws.wc_tile_name(x['properties']['cx'], x['properties']['cy']))
        flush()

    print(f'\n{done} wards, {ok} with green/built ({ok / max(done,1) * 100:.1f}%)')
    print(f'wrote {OUT}')


if __name__ == '__main__':
    main()
