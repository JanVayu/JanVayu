#!/usr/bin/env python3
"""
build-boundary-landcover.py — green cover and built-up share for boundary
polygons at any level, from ESA WorldCover 2021.

Why this exists next to build-ward-landcover-national.py. That script walks
features and reads a window per feature. For 70,417 wards averaging ~2 km2
that is fine. For 6,471 blocks averaging ~500 km2 it is 32 Gpx of tiny
overlapping reads, and for 319,287 panchayats it is 319,287 network round
trips. Both are the wrong way round: WorldCover is a fixed global raster, so
the cheap direction is tile-major — open each 3-degree tile once, walk it in
strips, and score every polygon that falls inside as you go.

Resolution, and why the obvious shortcut is rejected. WorldCover COGs carry
overviews, and reading the /4 overview is ~10x faster. But land cover is
categorical, so its overviews are mode-resampled, and mode resampling does not
preserve class shares in fragmented terrain — it hands each cell to whichever
class wins locally. Measured over central Delhi at 10 m against each overview
level:

    /2   green -0.18  built +0.32   (percentage points)
    /4   green -0.64  built +1.02
    /8   green -1.72  built +2.34
    /16  green -3.63  built +4.52

The bias runs one way: built-up is systematically overstated as resolution
drops, because a built pixel in a mixed neighbourhood wins the vote more often
than its area share. These values ship as integer percentages next to ward
figures computed at 10 m, so a 1-4 point drift that always leans the same
direction is not acceptable. Everything here reads at full 10 m.

That is affordable precisely because the pass is tile-major: 106 tiles cover
India at 7.5 GB compressed, strips containing no polygon are never requested,
and each strip is clipped to the columns its polygons actually span.

Multi-tile polygons. The per-feature script picks a tile from the polygon's
centroid and reads boundless past the tile edge, where WorldCover returns
nodata that then gets filtered out — so a polygon straddling a 3-degree
boundary is scored on the part inside its centroid's tile only. At ward size
that is a rounding error; a block is ~22 km across and a panchayat sits on a
tile edge often enough to matter. Here a polygon is scored against every tile
it touches and the counts are summed, so the denominator is the whole polygon.

Usage:
  python3 scripts/build-boundary-landcover.py subdistrict panchayat [--workers N]
  python3 scripts/build-boundary-landcover.py ward --in a.geojsonl --out b.geojsonl
"""

import json, math, os, sys
from pathlib import Path

import numpy as np
import rasterio
import rasterio.features
from rasterio.windows import Window
from affine import Affine

ROOT = Path(__file__).resolve().parent.parent
CACHE = Path(os.environ.get('JV_CACHE', '/tmp/jv-boundaries'))

WC_URL = ('/vsicurl/https://esa-worldcover.s3.eu-central-1.amazonaws.com'
          '/v200/2021/map/ESA_WorldCover_10m_2021_v200_{t}_Map.tif')
GREEN_CLASSES = (10, 20, 30, 40, 90, 95)   # tree, shrub, grass, crop, wetland, mangrove
BUILT_CLASS = 50
MIN_PIXELS = 20            # below this a share is noise, not a measurement

# WorldCover ships 3-degree tiles on a 1024-pixel block grid; a strip that is a
# multiple of the block height reads whole blocks rather than straddling them.
# One block-row is also as much as a worker should hold: a full-width strip is
# 36,000 wide, so 2048 rows meant a 296 MB int32 label raster per worker on top
# of the class masks, and five workers on dense tiles got one OOM-killed.
STRIP = 1024
W, S, E, N = 66.0, 3.0, 99.0, 39.0     # India, rounded out to the tile grid

os.environ.setdefault('GDAL_DISABLE_READDIR_ON_OPEN', 'EMPTY_DIR')
os.environ.setdefault('GDAL_HTTP_MAX_RETRY', '4')
os.environ.setdefault('GDAL_HTTP_RETRY_DELAY', '2')
os.environ.setdefault('CPL_VSIL_CURL_CACHE_SIZE', '268435456')
if os.path.exists('/root/.ccr/ca-bundle.crt'):
    os.environ.setdefault('GDAL_CAINFO', '/root/.ccr/ca-bundle.crt')

# uint8 class code -> boolean, so masking a 74 Mpx strip is a lookup rather
# than six comparisons.
LUT_GREEN = np.zeros(256, dtype=bool)
for c in GREEN_CLASSES:
    LUT_GREEN[c] = True
LUT_BUILT = np.zeros(256, dtype=bool)
LUT_BUILT[BUILT_CLASS] = True


def tile_name(lon0, lat0):
    return (('S' if lat0 < 0 else 'N') + f'{abs(lat0):02d}' +
            ('W' if lon0 < 0 else 'E') + f'{abs(lon0):03d}')


class Level:
    """One admin level: where its features are, and their running counts."""

    def __init__(self, name, src, dst):
        self.name, self.src, self.dst = name, src, dst
        self.offsets = []      # byte offset of each feature's line
        self.bounds = []       # (minx, miny, maxx, maxy)
        self.total = None
        self.green = None
        self.built = None

    def index(self):
        """Pass 1 — record each feature's bbox and where its line starts.

        Only the bbox and a file offset are kept, so indexing 319,287
        panchayats costs about 13 MB rather than parsing 1.2 GB of geometry
        into memory.
        """
        from shapely.geometry import shape
        with open(self.src, 'rb') as fh:
            off = 0
            for line in fh:
                n = len(line)
                s = line.strip()
                if s:
                    try:
                        g = json.loads(s).get('geometry')
                        b = shape(g).bounds if g else None
                    except Exception:
                        b = None
                    self.offsets.append(off)
                    self.bounds.append(b)
                off += n
        n = len(self.offsets)
        self.total = np.zeros(n, dtype=np.int64)
        self.green = np.zeros(n, dtype=np.int64)
        self.built = np.zeros(n, dtype=np.int64)
        self.bounds_arr = np.array(
            [b if b else (999., 999., -999., -999.) for b in self.bounds], dtype='float64')
        print(f'  {self.name}: {n} features indexed', flush=True)

    def geometry(self, i, fh):
        fh.seek(self.offsets[i])
        return json.loads(fh.readline()).get('geometry')

    def write(self):
        kept = 0
        with open(self.src, encoding='utf8') as fin, open(self.dst, 'w', encoding='utf8') as fout:
            i = 0
            for line in fin:
                line = line.strip()
                if not line:
                    continue
                feat = json.loads(line)
                t = self.total[i]
                if t >= MIN_PIXELS:
                    feat['properties']['g'] = int(round(100 * self.green[i] / t))
                    feat['properties']['b'] = int(round(100 * self.built[i] / t))
                    kept += 1
                fout.write(json.dumps(feat, separators=(',', ':')) + '\n')
                i += 1
        n = len(self.offsets)
        print(f'{self.name}: {kept}/{n} with land cover ({kept / max(n,1) * 100:.2f}%)')
        m = self.total >= MIN_PIXELS
        if m.any():
            g = 100 * self.green[m] / self.total[m]
            b = 100 * self.built[m] / self.total[m]
            print(f'  green  mean {g.mean():.1f}  median {np.median(g):.1f}  range {g.min():.0f}-{g.max():.0f}')
            print(f'  built  mean {b.mean():.1f}  median {np.median(b):.1f}  range {b.min():.0f}-{b.max():.0f}')
        print(f'wrote {self.dst}\n')


def score_strip(masks, transform, shape_, level, idxs, fh):
    """Add one strip's class counts to every feature that overlaps it.

    `masks` is (valid, valid_green, valid_built) for the strip, computed once
    and reused for every level — the class masks do not depend on which
    polygons are being scored.

    The counting looks fussy but is the whole performance story. The obvious
    spelling, np.bincount(np.where(valid, ids, 0).ravel()), builds a full
    74-megapixel int32 temporary per call and measured 4.84 s; indexing with
    the boolean mask instead allocates only the selected pixels and measured
    0.67 s for the same answer. Times three counters and two levels per strip,
    that difference alone was the gap between a 9-hour run and a 2-hour one.
    """
    valid, vgreen, vbuilt = masks
    shapes, local = [], []
    for i in idxs:
        g = level.geometry(i, fh)
        if not g:
            continue
        local.append(i)
        shapes.append((g, len(local)))
    if not shapes:
        return None
    ids = rasterio.features.rasterize(
        shapes, out_shape=shape_, transform=transform,
        fill=0, dtype='int32', all_touched=False)
    n = len(local) + 1
    tot = np.bincount(ids[valid], minlength=n)
    gre = np.bincount(ids[vgreen], minlength=n)
    bui = np.bincount(ids[vbuilt], minlength=n)
    hit = np.nonzero(tot[1:])[0]
    if not hit.size:
        return None
    idx = np.array([local[k] for k in hit], dtype=np.int64)
    return idx, tot[1:][hit], gre[1:][hit], bui[1:][hit]


LEVELS = []          # set in run(); inherited by forked workers


def do_tile(spec):
    """Score every polygon that falls inside one WorldCover tile.

    Runs in a forked worker, so the feature index is inherited rather than
    pickled. Returns per-level count deltas for the parent to merge; a worker
    never touches the shared accumulators.
    """
    lon0, lat0 = spec
    t0, t1, b0, b1 = lon0, lon0 + 3, lat0, lat0 + 3
    hits = {}
    for lv in LEVELS:
        a = lv.bounds_arr
        m = (a[:, 0] < t1) & (a[:, 2] > t0) & (a[:, 1] < b1) & (a[:, 3] > b0)
        idx = np.nonzero(m)[0]
        if idx.size:
            hits[lv.name] = idx
    if not hits:
        return None                        # ocean, or outside the country

    name = tile_name(lon0, lat0)
    try:
        src = rasterio.open(WC_URL.format(t=name))
    except Exception as e:
        return ('error', name, str(e)[:60])

    handles = {lv.name: open(lv.src, encoding='utf8') for lv in LEVELS}
    out = {lv.name: [] for lv in LEVELS}
    read_px = 0
    with src:
        tf = src.transform
        for r0 in range(0, src.height, STRIP):
            r1 = min(src.height, r0 + STRIP)
            y_top = tf.f + r0 * tf.e            # tf.e is negative
            y_bot = tf.f + r1 * tf.e
            # Features in this strip, and the columns they span — reading a
            # full 36,000-pixel row where the polygons occupy 4,000 of them
            # would be most of this job's wasted time.
            strip_idx = {}
            cmin, cmax = src.width, 0
            for lname, idx in hits.items():
                lv = next(l for l in LEVELS if l.name == lname)
                a = lv.bounds_arr[idx]
                sel = idx[(a[:, 1] < y_top) & (a[:, 3] > y_bot)]
                if sel.size:
                    strip_idx[lname] = sel
                    sa = lv.bounds_arr[sel]
                    c0 = int(math.floor((max(sa[:, 0].min(), t0) - tf.c) / tf.a))
                    c1 = int(math.ceil((min(sa[:, 2].max(), t1) - tf.c) / tf.a))
                    cmin = min(cmin, max(0, c0 - 1))
                    cmax = max(cmax, min(src.width, c1 + 1))
            if not strip_idx or cmax <= cmin:
                continue
            try:
                arr = src.read(1, window=Window(cmin, r0, cmax - cmin, r1 - r0))
            except Exception:
                continue                    # one bad strip must not lose the tile
            read_px += arr.size
            valid = arr != 0                # 0 is WorldCover's nodata
            if not valid.any():
                continue
            masks = (valid, valid & LUT_GREEN[arr], valid & LUT_BUILT[arr])
            wtf = tf * Affine.translation(cmin, r0)
            for lname, sel in strip_idx.items():
                lv = next(l for l in LEVELS if l.name == lname)
                got = score_strip(masks, wtf, arr.shape, lv, sel, handles[lname])
                if got:
                    out[lname].append(got)
    for fh in handles.values():
        fh.close()
    merged = {}
    for lname, parts in out.items():
        if parts:
            merged[lname] = tuple(np.concatenate([p[k] for p in parts]) for k in range(4))
    return ('ok', name, merged, read_px, {k: v.size for k, v in hits.items()})


def apply(levels, name, merged):
    for lname, arrays in merged.items():
        lv = next((l for l in levels if l.name == lname), None)
        if lv is None:
            continue
        idx, tot, gre, bui = arrays
        # np.add.at, not lv.total[idx] += tot: a polygon straddling two strips
        # appears twice in idx, and fancy-index += would keep only the last
        # write — silently undercounting exactly the large polygons this
        # script was written for.
        np.add.at(lv.total, idx, tot)
        np.add.at(lv.green, idx, gre)
        np.add.at(lv.built, idx, bui)


def run(levels, workers, restart=False):
    global LEVELS
    LEVELS = levels
    for lv in levels:
        lv.index()

    # A tile is the natural checkpoint: it is self-contained, takes a minute or
    # two, and there are only 132 of them. The first attempt at this run lost
    # 90 tiles of finished work to one OOM-killed worker, which is the same
    # avoidable cost the ward land-cover run paid before it learned to resume.
    ckpt = CACHE / ('lc-ckpt-' + '-'.join(lv.name for lv in levels))
    ckpt.mkdir(parents=True, exist_ok=True)
    if restart:
        for f in ckpt.glob('*.npz'):
            f.unlink()

    tiles = [(lon, lat) for lat in range(int(S), int(N), 3) for lon in range(int(W), int(E), 3)]
    todo, resumed = [], 0
    for lon0, lat0 in tiles:
        f = ckpt / f'{tile_name(lon0, lat0)}.npz'
        if f.exists():
            z = np.load(f)
            merged = {}
            for lv in levels:
                if f'{lv.name}_idx' in z:
                    merged[lv.name] = (z[f'{lv.name}_idx'], z[f'{lv.name}_tot'],
                                       z[f'{lv.name}_gre'], z[f'{lv.name}_bui'])
            apply(levels, f.stem, merged)
            resumed += 1
        else:
            todo.append((lon0, lat0))
    if resumed:
        print(f'resuming — {resumed} tiles already scored, {len(todo)} to go', flush=True)

    read_px = 0
    done = resumed
    from concurrent.futures import ProcessPoolExecutor

    with ProcessPoolExecutor(max_workers=workers) as ex:
        for spec, res in zip(todo, ex.map(do_tile, todo)):
            done += 1
            if res and res[0] == 'error':
                print(f'  {res[1]}: unreadable ({res[2]})', flush=True)
                continue
            name = tile_name(*spec)
            merged = res[2] if res else {}
            read_px += res[3] if res else 0
            apply(levels, name, merged)
            flat = {}
            for lname, arrays in merged.items():
                for key, a in zip(('idx', 'tot', 'gre', 'bui'), arrays):
                    flat[f'{lname}_{key}'] = a
            np.savez_compressed(ckpt / f'{name}.npz', **flat)
            if res:
                summary = ', '.join(f'{k} {v}' for k, v in res[4].items())
                print(f'  [{done}/{len(tiles)}] {name}: {summary}  ({read_px/1e9:.1f} Gpx read)', flush=True)

    for lv in levels:
        lv.write()


def main():
    args, override_in, override_out = [], None, None
    workers, restart = 3, False
    argv = sys.argv[1:]
    i = 0
    while i < len(argv):
        a = argv[i]
        if a == '--in':
            override_in = argv[i + 1]; i += 2
        elif a == '--out':
            override_out = argv[i + 1]; i += 2
        elif a == '--workers':
            workers = int(argv[i + 1]); i += 2
        elif a == '--restart':
            restart = True; i += 1
        elif a.startswith('--'):
            raise SystemExit(f'unknown option {a}')
        else:
            args.append(a); i += 1
    if not args:
        raise SystemExit(__doc__)
    if (override_in or override_out) and len(args) > 1:
        raise SystemExit('--in/--out apply to a single level')

    levels = []
    for name in args:
        if override_in:
            src = Path(override_in)
        else:
            # Prefer a slim that already carries heat, so the rebuilt tile ends
            # up with air, heat, green and built rather than losing one.
            heat = CACHE / f'{name}.slim.heat.geojsonl'
            src = heat if heat.exists() else CACHE / f'{name}.slim.geojsonl'
        dst = Path(override_out) if override_out else CACHE / f'{name}.slim.full.geojsonl'
        if not src.exists():
            raise SystemExit(f'{src} missing — run build-boundary-tiles.py {name} first')
        print(f'{name}: {src.name} -> {dst.name}', flush=True)
        levels.append(Level(name, src, dst))
    run(levels, workers, restart)


if __name__ == '__main__':
    main()
