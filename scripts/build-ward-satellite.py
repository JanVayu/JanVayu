#!/usr/bin/env python3
"""
build-ward-satellite.py — add the satellite layers (green cover, built-up,
land-surface temperature) to ward files that only have the air layer.

For every data/wards/<city>.json with "airOnly": true:
  - green/built per ward from ESA WorldCover 2021 v200 (10 m, AWS Open Data):
    green = classes 10 tree, 20 shrub, 30 grass, 40 crop, 90/95 wetland;
    built = class 50. Same formula as the original 14 cities — verified by
    recomputing Delhi's stored values exactly.
  - lst per ward from Landsat 8/9 Collection-2 L2 surface temperature
    (ST_B10 via Microsoft Planetary Computer, free anonymous SAS signing):
    the least-cloudy pre-monsoon scene in the configured window, mean °C
    per ward (DN * 0.00341802 + 149 - 273.15).

Run:  python3 scripts/build-ward-satellite.py [citykey ...]
Deps: rasterio, shapely, numpy, requests. Behind a TLS-inspecting proxy set
GDAL_HTTP_PROXY/GDAL_CAINFO and REQUESTS_CA_BUNDLE.

Output is committed; re-run only to refresh a season or add cities.
"""

import json, math, os, sys
from pathlib import Path

import numpy as np
import requests
import rasterio
from rasterio.features import geometry_mask
from rasterio.warp import transform_bounds, transform_geom
from rasterio.windows import from_bounds, transform as win_transform

ROOT = Path(__file__).resolve().parent.parent
WARDS = ROOT / 'data' / 'wards'

os.environ.setdefault('GDAL_HTTP_PROXY', os.environ.get('HTTPS_PROXY', ''))
if os.path.exists('/root/.ccr/ca-bundle.crt'):
    os.environ.setdefault('GDAL_CAINFO', '/root/.ccr/ca-bundle.crt')
    os.environ.setdefault('REQUESTS_CA_BUNDLE', '/root/.ccr/ca-bundle.crt')

WC_URL = ('/vsicurl/https://esa-worldcover.s3.eu-central-1.amazonaws.com'
          '/v200/2021/map/ESA_WorldCover_10m_2021_v200_{lat}{lon}_Map.tif')
GREEN_CLASSES = np.array([10, 20, 30, 40, 90, 95])
STAC = 'https://planetarycomputer.microsoft.com/api/stac/v1/search'
SIGN = 'https://planetarycomputer.microsoft.com/api/sas/v1/sign'
# Pre-monsoon window — heat-island contrast is strongest and skies clearest.
LST_WINDOWS = ['2026-03-01/2026-06-15', '2025-10-01/2026-06-15']
LST_CLOUD = [15, 30]


def wc_tile_name(lon, lat):
    lat0, lon0 = int(math.floor(lat / 3) * 3), int(math.floor(lon / 3) * 3)
    return ('S' if lat0 < 0 else 'N') + f'{abs(lat0):02d}' + \
           ('W' if lon0 < 0 else 'E') + f'{abs(lon0):03d}'


def per_ward_worldcover(features):
    """Yield (green, built) per feature, grouping tile opens by centroid."""
    by_tile = {}
    for i, f in enumerate(features):
        p = f['properties']
        by_tile.setdefault(wc_tile_name(p['cx'], p['cy']), []).append(i)
    out = [None] * len(features)
    for tile, idxs in by_tile.items():
        url = WC_URL.format(lat=tile[:3], lon=tile[3:])
        with rasterio.open(url) as src:
            for i in idxs:
                f = features[i]
                from shapely.geometry import shape
                b = shape(f['geometry']).bounds
                w = from_bounds(b[0] - 1e-3, b[1] - 1e-3, b[2] + 1e-3, b[3] + 1e-3, src.transform)
                arr = src.read(1, window=w, boundless=True, fill_value=0)
                t = win_transform(w, src.transform)
                mask = geometry_mask([f['geometry']], out_shape=arr.shape, transform=t, invert=True)
                vals = arr[mask]
                vals = vals[vals != 0]
                if vals.size < 20:
                    out[i] = (None, None)
                    continue
                out[i] = (round(100 * float(np.isin(vals, GREEN_CLASSES).mean())),
                          round(100 * float((vals == 50).mean())))
    return out


def find_lst_scenes(bbox, want=4):
    """Return up to `want` candidate scenes, best (least cloudy) first."""
    from shapely.geometry import shape, box
    city = box(*bbox)
    seen, ordered = set(), []
    for window, cloud in zip(LST_WINDOWS, LST_CLOUD):
        r = requests.post(STAC, json={
            'collections': ['landsat-c2-l2'], 'bbox': list(bbox), 'datetime': window,
            'query': {'eo:cloud_cover': {'lt': cloud}, 'platform': {'in': ['landsat-8', 'landsat-9']}},
            'sortby': [{'field': 'eo:cloud_cover', 'direction': 'asc'}], 'limit': 25}, timeout=90)
        r.raise_for_status()
        feats = r.json().get('features', [])
        # A Landsat footprint is a rotated quadrilateral — its bbox can "cover"
        # a city that the actual data clips diagonally (Lucknow sat on such an
        # edge and got LST for 5/112 wards). Test the true footprint polygon,
        # and prefer fully-covering scenes over partial ones.
        # Rank by how much of the city a scene actually covers, THEN by cloud.
        # Ranking by cloud alone breaks cities that straddle two Landsat paths:
        # Delhi sits across paths 46 and 47, so nothing contains it, and the
        # cloud-sorted fallback picked an 82.8%-coverage scene over a 99.3%
        # one that was equally clear — leaving 54 wards with no value.
        scored = []
        for it in feats:
            try:
                cov = shape(it['geometry']).intersection(city).area / city.area
            except Exception:
                cov = 0.0
            scored.append((cov, it['properties'].get('eo:cloud_cover', 100.0), it))
        full = sorted([x for x in scored if x[0] >= 0.98], key=lambda x: x[1])
        part = sorted([x for x in scored if x[0] < 0.98], key=lambda x: (-x[0], x[1]))
        for cov, cloud, it in full + part:
            key = it['id']
            if key in seen:
                continue
            seen.add(key)
            ordered.append(it)
        if len(ordered) >= want:
            break
    return ordered[:want]


def _scene_means(item, features, idxs, bbox):
    """Mean LST per requested ward index in one scene; None where no data."""
    href = item['assets']['lwir11']['href']
    signed = requests.get(SIGN, params={'href': href}, timeout=90).json()['href']
    res = {}
    with rasterio.open('/vsicurl/' + signed) as src:
        wb = transform_bounds('EPSG:4326', src.crs, bbox[0] - 0.02, bbox[1] - 0.02,
                              bbox[2] + 0.02, bbox[3] + 0.02)
        w = from_bounds(*wb, src.transform)
        arr = src.read(1, window=w, boundless=True, fill_value=0)
        t = win_transform(w, src.transform)
        for i in idxs:
            g = transform_geom('EPSG:4326', src.crs, features[i]['geometry'])
            mask = geometry_mask([g], out_shape=arr.shape, transform=t, invert=True)
            vals = arr[mask]
            vals = vals[vals != 0]
            temps = vals * 0.00341802 + 149 - 273.15
            # Physical-bounds filter: residual cloud/shadow pixels read tens of
            # degrees cold (Jodhpur had "-1.7 °C in May"). Indian pre-monsoon
            # daytime LST plausibly spans ~15-70 °C; drop pixels outside it.
            temps = temps[(temps > 15) & (temps < 70)]
            res[i] = round(float(temps.mean()), 1) if temps.size >= 5 else None
    return res


def per_ward_lst(features, bbox, max_scenes=4):
    """Per-ward mean LST, gap-filled across scenes.

    The clearest single scene still leaves holes: cloud masked over part of a
    city means those wards get no value at all (Bhopal lost 34% of its wards
    this way, Kolkata 4%). So after the best scene, any ward still without a
    value is retried against the next-clearest scenes until none are left or
    the candidates run out. Wards keep the value from the best scene that
    actually saw them, and the dates that contributed are recorded, because a
    ward filled from a later pass is not from the same afternoon as its
    neighbours and the UI should be able to say so.
    """
    scenes = find_lst_scenes(bbox, max_scenes)
    if not scenes:
        return [None] * len(features), None, []
    out = [None] * len(features)
    dates = []
    for item in scenes:
        pending = [i for i, v in enumerate(out) if v is None]
        if not pending:
            break
        try:
            got = _scene_means(item, features, pending, bbox)
        except Exception as e:                      # one bad COG must not kill the city
            print(f'    scene {item["id"]} failed: {e}', flush=True)
            continue
        filled = 0
        for i, v in got.items():
            if v is not None:
                out[i] = v
                filled += 1
        if filled:
            dates.append(item['properties']['datetime'][:10])
            print(f'    {item["properties"]["datetime"][:10]}: +{filled} wards '
                  f'({sum(1 for v in out if v is None)} still missing)', flush=True)
    return out, (dates[0] if dates else None), dates


def main():
    only = set(sys.argv[1:])
    for path in sorted(WARDS.glob('*.json')):
        fc = json.loads(path.read_text())
        if not fc.get('airOnly'):
            continue
        if only and path.stem not in only:
            continue
        feats = fc['features']
        xs = [c for f in feats for c in (f['properties']['cx'],)]
        ys = [f['properties']['cy'] for f in feats]
        pad = 0.02
        bbox = (min(xs) - pad, min(ys) - pad, max(xs) + pad, max(ys) + pad)
        print(f'{path.stem}: {len(feats)} wards', flush=True)
        gb = per_ward_worldcover(feats)
        lst, date, dates = per_ward_lst(feats, bbox)
        n_ok = 0
        for f, (green, built), t in zip(feats, gb, lst):
            p = f['properties']
            if green is not None:
                p['green'], p['built'] = green, built
            if t is not None:
                p['lst'] = t
            if green is not None and t is not None:
                n_ok += 1
        if date:
            fc['lst_date'] = date
        if len(dates) > 1:
            fc['lst_dates'] = dates
        else:
            fc.pop('lst_dates', None)
        if n_ok >= len(feats) * 0.9:
            fc.pop('airOnly', None)
            fc['source'] = fc.get('source', '') + '; green/built: ESA WorldCover 2021; heat: Landsat 8/9 C2-L2 (Planetary Computer)'
        else:
            print(f'  WARNING: only {n_ok}/{len(feats)} wards complete — keeping airOnly')
        path.write_text(json.dumps(fc))
        gvals = [f['properties'].get('green') for f in feats if f['properties'].get('green') is not None]
        tvals = [f['properties'].get('lst') for f in feats if f['properties'].get('lst') is not None]
        print(f'  green {min(gvals)}-{max(gvals)}%, lst {min(tvals)}-{max(tvals)}°C ({date}), {n_ok}/{len(feats)} complete')


if __name__ == '__main__':
    main()
