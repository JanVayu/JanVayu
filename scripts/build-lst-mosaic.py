#!/usr/bin/env python3
"""
build-lst-mosaic.py — one national land-surface-temperature raster for India,
built once, so heat stops being the odd layer out.

The problem this replaces. Every other layer here works the same way: one
national raster, one zonal pass. PM2.5 loads a single grid and bincounts every
polygon against it; WorldCover reads windows from a fixed global raster. Heat
alone did a per-city STAC search, scene pick and cloud mask — 3,675 times over.
Every heat bug we have traces to that shape: the coverage seam that leaves six
Thiruvananthapuram wards blank, Bhopal sitting on a stale 2023 scene, cloud
holes, and a per-city job that has to be re-run forever.

Compositing fixes the class, not the instances:
  * cloud holes fill in, because several scenes per path/row rarely cloud the
    same pixel twice;
  * scene-edge seams vanish, because adjacent path/rows overlap in a mosaic;
  * "a single hot-season afternoon" becomes a seasonal average, which is the
    time-aware heat item that has been on the roadmap for months;
  * and every boundary level — ward, panchayat, village, block — gets heat
    from the same zonal pass, instead of only the levels someone listed.

What the value is. Each output pixel is the *mean of its clear observations*,
not a median. A true median needs every scene's value for every pixel held at
once — 960 Mpx x 4 scenes x 4 bytes is 15 GB of accumulator on top of the
5 GB already used, which does not fit here. A mean is only safe if the cloud
mask is, because cloud tops are cold and a single leaked cloud pixel drags a
mean down and understates heat. So the masking below is deliberately
conservative rather than cheap.

Reading at the resolution we actually need. A scene's thermal band is
7741 x 7591 at 30 m, and reading it whole takes ~12 s over the network — about
11 hours for the 1,516 scenes here, which is what made the first version look
like it had hung. The output grid is ~111 m, so 30 m detail is thrown away
immediately. Reading the /4 overview instead gives 120 m directly in 1.2 s.

That trade has one catch worth spelling out, because getting it wrong would
quietly leak clouds. The thermal overviews are *average*-resampled (measured:
only 31% of overview pixels equal the matching source pixel), so a 120 m cell
mixes 16 source pixels — but the QA overviews are *nearest*-resampled (99.9%
identical to plain decimation), so masking from a QA overview would inspect
1 of those 16 pixels and pass the other 15 blind. QA is a bitmask and
compresses hard, though, so the full-resolution QA costs only ~1.1 s. It is
read whole and block-reduced with any-bad-wins, which drops a 120 m cell if
*any* of its 16 source pixels was cloud, shadow, snow or dilated cloud. That
is a stricter mask than the full-resolution version applied, at a tenth of the
time.

Resolution. A 30 m national grid would need 13.2 Gpx and ~66 GB just to
accumulate, which is not available here. ~111 m needs 4.8 GB and still gives
roughly 160 pixels for a typical 2 km2 ward — plenty of within-ward detail,
and far finer than the 1 km MODIS alternative where most wards would be one or
two pixels. Accumulators are memory-mapped so RAM stays flat regardless.

Resumability. Scene search results and the set of composited scene ids are
cached, and the accumulators are reopened rather than re-created, so an
interrupted run continues instead of starting over — and cannot double-count a
scene it already added.

Output: data/rasters/lst_india_110m.tif — int16 decidegrees Celsius,
-32768 = no data. Read it exactly like the PM2.5 grid.

Usage:  python3 scripts/build-lst-mosaic.py [--limit N] [--bbox W S E N]
                                            [--restart] [--workers N]
"""

import json, os, sys, threading, time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import numpy as np
import requests
import rasterio
from rasterio.transform import from_origin
from rasterio.warp import reproject, Resampling, transform_bounds
from rasterio.windows import Window

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / 'data' / 'rasters'
WORK = Path(os.environ.get('JV_CACHE', '/tmp/jv-boundaries')) / 'lst'
WORK.mkdir(parents=True, exist_ok=True)

os.environ.setdefault('GDAL_HTTP_PROXY', os.environ.get('HTTPS_PROXY', ''))
if os.path.exists('/root/.ccr/ca-bundle.crt'):
    os.environ.setdefault('GDAL_CAINFO', '/root/.ccr/ca-bundle.crt')
    os.environ.setdefault('REQUESTS_CA_BUNDLE', '/root/.ccr/ca-bundle.crt')

# /vsicurl defaults assume a filesystem-like directory listing and no retries.
# Against blob storage that means a wasted round trip per open and a dead run
# on the first transient 5xx.
os.environ.setdefault('GDAL_DISABLE_READDIR_ON_OPEN', 'EMPTY_DIR')
os.environ.setdefault('CPL_VSIL_CURL_ALLOWED_EXTENSIONS', '.TIF,.tif')
os.environ.setdefault('GDAL_HTTP_MAX_RETRY', '4')
os.environ.setdefault('GDAL_HTTP_RETRY_DELAY', '2')
os.environ.setdefault('GDAL_HTTP_TIMEOUT', '120')
os.environ.setdefault('CPL_VSIL_CURL_CACHE_SIZE', '134217728')

STAC = 'https://planetarycomputer.microsoft.com/api/stac/v1/search'
SIGN = 'https://planetarycomputer.microsoft.com/api/sas/v1/sign'

# India, generously bounded.
W, S, E, N = 68.0, 6.0, 98.0, 38.0
RES = 0.001                     # ~111 m at these latitudes
WINDOW = '2026-03-01/2026-06-15'   # pre-monsoon: hottest, clearest
CLOUD_MAX = 40                  # generous — the mask rejects what the scene metadata misses
PER_PR = 4                      # scenes per path/row to composite
DECIMATE = 4                    # read the /4 overview: 30 m -> 120 m, ~= the output grid

if '--bbox' in sys.argv:
    i = sys.argv.index('--bbox')
    W, S, E, N = (float(v) for v in sys.argv[i + 1:i + 5])
LIMIT = int(sys.argv[sys.argv.index('--limit') + 1]) if '--limit' in sys.argv else 0
WORKERS = int(sys.argv[sys.argv.index('--workers') + 1]) if '--workers' in sys.argv else 8
RESTART = '--restart' in sys.argv

WIDTH = int(round((E - W) / RES))
HEIGHT = int(round((N - S) / RES))
TRANSFORM = from_origin(W, N, RES, RES)

SUM_PATH = WORK / 'sum.f32'
CNT_PATH = WORK / 'cnt.u8'
SCENES_PATH = WORK / 'scenes.json'
DONE_PATH = WORK / 'done.txt'

_lock = threading.Lock()        # guards the shared accumulators
_progress = threading.Lock()    # guards counters and the done-log


def scenes():
    """Least-cloudy pre-monsoon scenes, a few per WRS path/row across India.

    Searching the whole country at once and taking the top N by cloud would
    cluster them in whichever region happened to be clearest, leaving holes
    elsewhere. Grouping by path/row guarantees national coverage.

    Cached, because this is ~110 STAC round trips and the answer does not
    change between resumes of the same run.
    """
    if SCENES_PATH.exists() and not RESTART:
        out = json.loads(SCENES_PATH.read_text())
        print(f'{len(out)} scenes from cache', flush=True)
        return out

    by_pr = {}
    step = 3.0
    lat = S
    while lat < N:
        lon = W
        while lon < E:
            r = requests.post(STAC, json={
                'collections': ['landsat-c2-l2'],
                'bbox': [lon, lat, min(lon + step, E), min(lat + step, N)],
                'datetime': WINDOW,
                'query': {'eo:cloud_cover': {'lt': CLOUD_MAX},
                          'platform': {'in': ['landsat-8', 'landsat-9']}},
                'sortby': [{'field': 'eo:cloud_cover', 'direction': 'asc'}],
                'limit': 100}, timeout=120)
            if r.ok:
                for it in r.json().get('features', []):
                    # L2SR products carry surface reflectance only — no thermal
                    # band. Taking them costs a path/row one of its slots and
                    # then fails on read, so they are rejected here rather than
                    # discovered scene by scene.
                    if 'lwir11' not in (it.get('assets') or {}):
                        continue
                    p = it['properties']
                    key = f"{p.get('landsat:wrs_path')}/{p.get('landsat:wrs_row')}"
                    by_pr.setdefault(key, [])
                    if len(by_pr[key]) < PER_PR and it['id'] not in [x['id'] for x in by_pr[key]]:
                        # Keep only what add_scene needs — the full STAC item
                        # is ~40 KB of metadata we would cache for nothing.
                        by_pr[key].append({
                            'id': it['id'],
                            'lwir11': it['assets']['lwir11']['href'],
                            'qa_pixel': (it['assets'].get('qa_pixel') or {}).get('href'),
                        })
            lon += step
        lat += step
    out = [it for v in by_pr.values() for it in v]
    SCENES_PATH.write_text(json.dumps(out))
    print(f'{len(by_pr)} path/rows, {len(out)} scenes to composite', flush=True)
    return out


def sign(href):
    for attempt in range(4):
        try:
            r = requests.get(SIGN, params={'href': href}, timeout=120)
            if r.ok:
                return r.json()['href']
        except Exception:
            pass
        time.sleep(2 ** attempt)
    raise RuntimeError('could not sign asset')


def block_any(mask, f):
    """Reduce a boolean mask by f in each axis, keeping True if any cell is True.

    This is what makes a decimated read safe: the thermal overview averages
    f x f source pixels into one, so a cell is only trustworthy if *every*
    source pixel behind it was clear.
    """
    h, w = mask.shape[0] // f * f, mask.shape[1] // f * f
    return mask[:h, :w].reshape(h // f, f, w // f, f).any(axis=(1, 3))


def add_scene(item, acc_sum, acc_cnt):
    """Warp one scene's masked LST into the national grid and accumulate."""
    signed = sign(item['lwir11'])
    signed_qa = sign(item['qa_pixel']) if item.get('qa_pixel') else None

    with rasterio.open('/vsicurl/' + signed) as src:
        f = DECIMATE if DECIMATE in (src.overviews(1) or []) else 1
        oh, ow = src.height // f, src.width // f
        if oh == 0 or ow == 0:
            return False
        # Read a window that is an exact multiple of f, so the decimated grid
        # lines up pixel for pixel with the block-reduced QA mask below.
        win = Window(0, 0, ow * f, oh * f)
        arr = src.read(1, window=win, out_shape=(oh, ow))
        src_transform = src.window_transform(win) * rasterio.Affine.scale(f, f)
        src_crs = src.crs
        src_bounds = src.bounds

    if arr.size == 0:
        return False
    temps = arr.astype('float32') * 0.00341802 + 149 - 273.15
    valid = (arr != 0) & (temps > 10) & (temps < 75)

    if signed_qa:
        try:
            with rasterio.open('/vsicurl/' + signed_qa) as q:
                qa = q.read(1, window=Window(0, 0, ow * f, oh * f))
            # Collection-2 QA_PIXEL: bit 1 dilated cloud, 3 cloud,
            # 4 cloud shadow, 5 snow. Read at full resolution and reduced with
            # any-bad-wins, so a 120 m cell is dropped when any of the 30 m
            # pixels averaged into it was contaminated.
            bad = (((qa >> 1) | (qa >> 3) | (qa >> 4) | (qa >> 5)) & 1).astype(bool)
            valid &= ~(block_any(bad, f) if f > 1 else bad)
        except Exception:
            pass                      # no QA is survivable; bounds filter still applies

    if not valid.any():
        return False
    temps = np.where(valid, temps, np.nan)

    # Destination window: only the part of the national grid this scene covers.
    wb = transform_bounds(src_crs, 'EPSG:4326', *src_bounds)
    c0 = max(0, int((wb[0] - W) / RES) - 1)
    c1 = min(WIDTH, int((wb[2] - W) / RES) + 2)
    r0 = max(0, int((N - wb[3]) / RES) - 1)
    r1 = min(HEIGHT, int((N - wb[1]) / RES) + 2)
    if c1 <= c0 or r1 <= r0:
        return False

    dst = np.full((r1 - r0, c1 - c0), np.nan, dtype='float32')
    reproject(
        source=temps, destination=dst,
        src_transform=src_transform, src_crs=src_crs,
        dst_transform=from_origin(W + c0 * RES, N - r0 * RES, RES, RES),
        dst_crs='EPSG:4326', resampling=Resampling.average,
        src_nodata=np.nan, dst_nodata=np.nan)

    good = np.isfinite(dst)
    if not good.any():
        return False
    with _lock:
        acc_sum[r0:r1, c0:c1] += np.where(good, dst, 0)
        # uint8 saturates at 255; overlapping path/rows reach ~8, but clip
        # rather than wrap to zero if that assumption ever breaks.
        cur = acc_cnt[r0:r1, c0:c1]
        acc_cnt[r0:r1, c0:c1] = np.minimum(cur.astype('uint16') + good, 255).astype('uint8')
    return True


def main():
    print(f'grid {WIDTH} x {HEIGHT} @ {RES}deg  ({WIDTH*HEIGHT/1e6:.0f} Mpx)', flush=True)

    items = scenes()
    done = set()
    if DONE_PATH.exists() and not RESTART:
        done = set(DONE_PATH.read_text().split())
    # 'w+' truncates; reopening a partial run must not wipe what it accumulated.
    resuming = bool(done) and not RESTART and SUM_PATH.exists() and CNT_PATH.exists()
    mode = 'r+' if resuming else 'w+'
    acc_sum = np.memmap(SUM_PATH, dtype='float32', mode=mode, shape=(HEIGHT, WIDTH))
    acc_cnt = np.memmap(CNT_PATH, dtype='uint8', mode=mode, shape=(HEIGHT, WIDTH))
    if done:
        print(f'resuming — {len(done)} scenes already composited', flush=True)

    todo = [it for it in items if it['id'] not in done]
    if LIMIT:
        todo = todo[:LIMIT]
    total = len(todo)
    state = {'used': 0, 'seen': 0, 'failed': 0}
    t0 = time.time()
    donelog = open(DONE_PATH, 'a', encoding='utf8')

    def work(it):
        try:
            okay = add_scene(it, acc_sum, acc_cnt)
        except Exception as e:
            with _progress:
                state['seen'] += 1
                state['failed'] += 1
                print(f'  [{state["seen"]}/{total}] {it["id"]}: {str(e)[:70]}', flush=True)
            return
        with _progress:
            state['seen'] += 1
            if okay:
                state['used'] += 1
            # Logged either way: a scene that yielded nothing usable will yield
            # nothing usable on a retry either, and re-reading it costs minutes.
            donelog.write(it['id'] + '\n')
            donelog.flush()
            if state['seen'] % 25 == 0 or state['seen'] == total:
                el = time.time() - t0
                rate = state['seen'] / max(el, 1)
                eta = (total - state['seen']) / max(rate, 1e-6) / 60
                print(f'  [{state["seen"]}/{total}] {state["used"]} composited, '
                      f'{state["failed"]} failed, {rate*60:.0f}/min, ETA {eta:.0f} min', flush=True)

    with ThreadPoolExecutor(max_workers=WORKERS) as ex:
        list(ex.map(work, todo))
    donelog.close()
    acc_sum.flush(); acc_cnt.flush()

    print('writing mosaic…', flush=True)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    dst_path = OUT_DIR / 'lst_india_110m.tif'
    profile = dict(driver='GTiff', height=HEIGHT, width=WIDTH, count=1,
                   dtype='int16', nodata=-32768, crs='EPSG:4326',
                   transform=TRANSFORM, compress='deflate', predictor=2,
                   tiled=True, blockxsize=512, blockysize=512)
    covered = 0
    with rasterio.open(dst_path, 'w', **profile) as dst:
        for r in range(0, HEIGHT, 2048):           # row bands, so RAM stays flat
            r1 = min(HEIGHT, r + 2048)
            s = np.asarray(acc_sum[r:r1]); c = np.asarray(acc_cnt[r:r1])
            out = np.full(s.shape, -32768, dtype='int16')
            m = c > 0
            out[m] = np.round(s[m] / c[m] * 10).astype('int16')
            covered += int(m.sum())
            dst.write(out, 1, window=rasterio.windows.Window(0, r, WIDTH, r1 - r))
    mb = dst_path.stat().st_size / 1e6
    print(f'\n{state["used"]}/{total} scenes composited this run')
    print(f'{covered/1e6:.0f} Mpx with data ({covered/(WIDTH*HEIGHT)*100:.1f}% of the grid)')
    print(f'wrote {dst_path} — {mb:.0f} MB')


if __name__ == '__main__':
    main()
