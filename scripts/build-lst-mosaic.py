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
  * cloud holes fill in, because a median across scenes sees through them;
  * scene-edge seams vanish, because adjacent path/rows overlap in a mosaic;
  * "a single hot-season afternoon" becomes a seasonal median, which is the
    time-aware heat item that has been on the roadmap for months;
  * and every boundary level — ward, panchayat, village, block — gets heat
    from the same zonal pass, instead of only the levels someone listed.

Resolution. A 30 m national grid would need 13.2 Gpx and ~66 GB just to
accumulate, which is not available here. 100 m needs 5.95 GB and still gives
roughly 200 pixels for a typical 2 km² ward — plenty of within-ward detail,
and far finer than the 1 km MODIS alternative where most wards would be one or
two pixels. Accumulators are memory-mapped so RAM stays flat regardless.

Output: data/rasters/lst_india_100m.tif — int16 decidegrees Celsius,
-32768 = no data. Read it exactly like the PM2.5 grid.

Usage:  python3 scripts/build-lst-mosaic.py [--limit N] [--bbox W S E N]
"""

import json, os, sys, math
from pathlib import Path

import numpy as np
import requests
import rasterio
from rasterio.transform import from_origin
from rasterio.warp import reproject, Resampling, transform_bounds

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / 'data' / 'rasters'
WORK = Path(os.environ.get('JV_CACHE', '/tmp/jv-boundaries')) / 'lst'
WORK.mkdir(parents=True, exist_ok=True)

os.environ.setdefault('GDAL_HTTP_PROXY', os.environ.get('HTTPS_PROXY', ''))
if os.path.exists('/root/.ccr/ca-bundle.crt'):
    os.environ.setdefault('GDAL_CAINFO', '/root/.ccr/ca-bundle.crt')
    os.environ.setdefault('REQUESTS_CA_BUNDLE', '/root/.ccr/ca-bundle.crt')

STAC = 'https://planetarycomputer.microsoft.com/api/stac/v1/search'
SIGN = 'https://planetarycomputer.microsoft.com/api/sas/v1/sign'

# India, generously bounded.
W, S, E, N = 68.0, 6.0, 98.0, 38.0
RES = 0.001                     # ~111 m
WINDOW = '2026-03-01/2026-06-15'   # pre-monsoon: hottest, clearest
CLOUD_MAX = 40                  # generous — the median rejects what the mask misses
PER_PR = 4                      # scenes per path/row to composite

if '--bbox' in sys.argv:
    i = sys.argv.index('--bbox')
    W, S, E, N = (float(v) for v in sys.argv[i + 1:i + 5])
LIMIT = int(sys.argv[sys.argv.index('--limit') + 1]) if '--limit' in sys.argv else 0

WIDTH = int(round((E - W) / RES))
HEIGHT = int(round((N - S) / RES))
TRANSFORM = from_origin(W, N, RES, RES)

SUM_PATH = WORK / 'sum.f32'
CNT_PATH = WORK / 'cnt.u8'


def scenes():
    """Least-cloudy pre-monsoon scenes, a few per WRS path/row across India.

    Searching the whole country at once and taking the top N by cloud would
    cluster them in whichever region happened to be clearest, leaving holes
    elsewhere. Grouping by path/row guarantees national coverage.
    """
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
                    key = (p.get('landsat:wrs_path'), p.get('landsat:wrs_row'))
                    by_pr.setdefault(key, [])
                    if len(by_pr[key]) < PER_PR and it['id'] not in [x['id'] for x in by_pr[key]]:
                        by_pr[key].append(it)
            lon += step
        lat += step
    out = [it for v in by_pr.values() for it in v]
    print(f'{len(by_pr)} path/rows, {len(out)} scenes to composite', flush=True)
    return out


def add_scene(item, acc_sum, acc_cnt):
    """Warp one scene's masked LST into the national grid and accumulate."""
    href = item['assets']['lwir11']['href']
    qa_href = item['assets'].get('qa_pixel', {}).get('href')
    signed = requests.get(SIGN, params={'href': href}, timeout=120).json()['href']
    signed_qa = requests.get(SIGN, params={'href': qa_href}, timeout=120).json()['href'] if qa_href else None

    with rasterio.open('/vsicurl/' + signed) as src:
        arr = src.read(1)
        if arr.size == 0:
            return False
        temps = arr.astype('float32') * 0.00341802 + 149 - 273.15
        valid = (arr != 0) & (temps > 10) & (temps < 75)

        if signed_qa:
            try:
                with rasterio.open('/vsicurl/' + signed_qa) as q:
                    qa = q.read(1)
                # Collection-2 QA_PIXEL: bit 3 cloud, 4 cloud shadow, 5 snow,
                # 1 dilated cloud. Drop all of them; the median handles the rest.
                bad = ((qa >> 1) & 1) | ((qa >> 3) & 1) | ((qa >> 4) & 1) | ((qa >> 5) & 1)
                valid &= (bad == 0)
            except Exception:
                pass                      # no QA is survivable; bounds filter still applies

        if not valid.any():
            return False
        temps = np.where(valid, temps, np.nan)

        # Destination window: only the part of the national grid this scene covers.
        wb = transform_bounds(src.crs, 'EPSG:4326', *src.bounds)
        c0 = max(0, int((wb[0] - W) / RES) - 1)
        c1 = min(WIDTH, int((wb[2] - W) / RES) + 2)
        r0 = max(0, int((N - wb[3]) / RES) - 1)
        r1 = min(HEIGHT, int((N - wb[1]) / RES) + 2)
        if c1 <= c0 or r1 <= r0:
            return False

        dst = np.full((r1 - r0, c1 - c0), np.nan, dtype='float32')
        reproject(
            source=temps, destination=dst,
            src_transform=src.transform, src_crs=src.crs,
            dst_transform=from_origin(W + c0 * RES, N - r0 * RES, RES, RES),
            dst_crs='EPSG:4326', resampling=Resampling.average,
            src_nodata=np.nan, dst_nodata=np.nan)

    good = np.isfinite(dst)
    if not good.any():
        return False
    acc_sum[r0:r1, c0:c1] += np.where(good, dst, 0)
    acc_cnt[r0:r1, c0:c1] += good.astype('uint8')
    return True


def main():
    print(f'grid {WIDTH} x {HEIGHT} @ {RES}deg  ({WIDTH*HEIGHT/1e6:.0f} Mpx)', flush=True)
    acc_sum = np.memmap(SUM_PATH, dtype='float32', mode='w+', shape=(HEIGHT, WIDTH))
    acc_cnt = np.memmap(CNT_PATH, dtype='uint8', mode='w+', shape=(HEIGHT, WIDTH))

    items = scenes()
    if LIMIT:
        items = items[:LIMIT]
    used = 0
    for i, it in enumerate(items, 1):
        try:
            if add_scene(it, acc_sum, acc_cnt):
                used += 1
        except Exception as e:
            print(f'  [{i}/{len(items)}] {it["id"]}: {str(e)[:70]}', flush=True)
            continue
        if i % 10 == 0:
            print(f'  [{i}/{len(items)}] {used} scenes composited', flush=True)
    acc_sum.flush(); acc_cnt.flush()

    print('writing mosaic…', flush=True)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    dst_path = OUT_DIR / 'lst_india_100m.tif'
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
    print(f'\n{used}/{len(items)} scenes composited')
    print(f'{covered/1e6:.0f} Mpx with data ({covered/(WIDTH*HEIGHT)*100:.1f}% of the grid)')
    print(f'wrote {dst_path} — {mb:.0f} MB')


if __name__ == '__main__':
    main()
