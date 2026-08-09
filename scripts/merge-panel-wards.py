#!/usr/bin/env python3
"""
merge-panel-wards.py — fold the ward-panel cities the boundary tiles never had
into the ward slim, so the map is a superset of the panel.

Why this has to happen before the panel is retired. The unified map's ward
level comes from SBM plus the West Bengal AMRUT layer plus Living Atlas —
70,417 wards, which felt like everything. It is not: the older per-city panel
carries 14 cities those three sources miss, 720 wards in total, and the list is
not marginal. Kolkata is on it. So is Madurai, Asansol, and every north-eastern
city we added by hand — Agartala, Imphal, Shillong, Itanagar, Aizawl, Kohima.

Deleting the panel while the map lacked them would have quietly removed
Kolkata from the site. This closes that gap first.

What it does not do is trust the panel's satellite numbers. Those were computed
per city, years apart, by the pipeline the national rasters replaced — a
single-scene `lst`, and `green`/`built` from windowed reads. The merged wards
carry geometry, name and city only; heat, tree, green and built are recomputed
by the same national passes as every other ward, so a Kolkata ward and a Delhi
ward mean the same thing.

Usage:  python3 scripts/merge-panel-wards.py [--dry-run]
"""

import json, os, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CACHE = Path(os.environ.get('JV_CACHE', '/tmp/jv-boundaries'))
PANEL = ROOT / 'data' / 'wards'
SLIM = CACHE / 'ward.slim.full.geojsonl'
OUT = CACHE / 'ward.slim.merged.geojsonl'
NEAR = 0.15          # degrees; a panel city with no tile ward this close is missing
DRY = '--dry-run' in sys.argv


def main():
    from shapely.geometry import shape
    from shapely.strtree import STRtree

    if not SLIM.exists():
        raise SystemExit(f'{SLIM} missing — run build-boundary-tiles.py ward first')

    pts, lines = [], 0
    with open(SLIM, encoding='utf8') as fh:
        for line in fh:
            if not line.strip():
                continue
            lines += 1
            try:
                pts.append(shape(json.loads(line)['geometry']).representative_point())
            except Exception:
                pass
    tree = STRtree(pts)
    print(f'{lines} wards already in the slim', flush=True)

    added, skipped = [], []
    for path in sorted(PANEL.glob('*.json')):
        city = path.stem
        try:
            doc = json.load(open(path, encoding='utf8'))
        except Exception:
            continue
        feats = doc.get('features') or []
        if not feats:
            continue
        try:
            probe = shape(feats[0]['geometry']).representative_point()
        except Exception:
            continue
        near = [i for i in tree.query(probe.buffer(NEAR)) if pts[i].distance(probe) < NEAR]
        if near:
            skipped.append(city)
            continue
        label = doc.get('city') or city.title()
        for f in feats:
            p = f.get('properties') or {}
            # Geometry, name and city only. Everything measurable gets
            # recomputed nationally — see the module docstring.
            props = {'n': str(p.get('name') or '').strip() or None,
                     'c': str(p.get('no') or '').strip() or None,
                     'u': label}
            added.append({'type': 'Feature',
                          'properties': {k: v for k, v in props.items() if v},
                          'geometry': f['geometry']})
        print(f'  + {label}: {len(feats)} wards', flush=True)

    print(f'\n{len(skipped)} panel cities already covered; {len(added)} wards to add')
    if DRY:
        return
    if not added:
        print('nothing to merge')
        return
    with open(SLIM, encoding='utf8') as fin, open(OUT, 'w', encoding='utf8') as fout:
        for line in fin:
            if line.strip():
                fout.write(line if line.endswith('\n') else line + '\n')
        for f in added:
            fout.write(json.dumps(f, separators=(',', ':')) + '\n')
    print(f'wrote {OUT} — {lines + len(added)} wards')
    print('next: build-village-pm25/boundary-heat/boundary-landcover over the merged slim')


if __name__ == '__main__':
    main()
