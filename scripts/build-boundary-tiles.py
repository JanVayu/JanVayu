#!/usr/bin/env python3
"""
build-boundary-tiles.py — one PMTiles archive per Indian administrative level,
each feature carrying its own annual PM2.5.

Why this exists: JanVayu grew two separate maps. Villages live as a layer on
the live map; municipal wards live in their own panel behind a city dropdown.
A user who wants "how polluted is my place" has to already know whether their
place is a ward or a village to find the right screen — our data model leaking
into the navigation. And the dropdown capped wards at the 142 cities someone
had added, out of 3,675 the source actually holds.

The fix is one map with a level switcher, which needs a delivery format that
can serve the whole country at every level without shipping the whole country.
That is PMTiles: a single file addressed by HTTP range requests, so a browser
pulls only the tiles in view. Verified that Netlify serves 206 Partial Content
on janvayu.in before committing to this.

Levels, all LGD-coded so they join to each other and to our existing data:

    state → district → subdistrict (block/mandal/tehsil) → panchayat → village
                    └→ ulb (city) → ward

Sources are the indianopenmaps.com mirror of government releases. We rebuild
the tiles ourselves rather than serving the upstream ones, because ours carry
the annual PM2.5 per feature — colouring straight from tile attributes, no
second lookup.

Licence note: the panchayat level uses LGD_Panchayats, NOT bhuvan_panchayats.
Bhuvan's terms grant a restricted, non-transferable licence; redistributing
derivatives of it would not be safe.

Compression note, and a distinction that is easy to get wrong: the .pmtiles
FILE must not be gzip/brotli'd by the CDN, because that breaks byte-range
addressing. Netlify leaves unknown extensions alone, which is what we need —
the inverse of the .topojson bug that cost us 4x transfer when the same
behaviour was unwanted. The tiles INSIDE the archive are a separate matter:
they are gzip-compressed as normal, the header records it, and the client
decompresses. Disabling that (--no-tile-compression) is a mistake.

Usage:  python3 scripts/build-boundary-tiles.py [level …] [--skip-pm]
Deps:   tippecanoe, 7zz/7za, rasterio, shapely, numpy  (see build-village-pm25)
"""

import json, os, subprocess, sys, importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'data' / 'tiles'
CACHE = Path(os.environ.get('JV_CACHE', '/tmp/jv-boundaries'))
CACHE.mkdir(parents=True, exist_ok=True)
REL = 'https://github.com/ramSeraph/indian_admin_boundaries/releases/download'

# Reuse the PM2.5 grid loader and the rasterise+bincount zonal pass rather
# than reimplementing them — district_means() is already generic over any
# list of shapely geometries.
_spec = importlib.util.spec_from_file_location('bvp', ROOT / 'scripts' / 'build-village-pm25.py')
bvp = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(bvp)

YEAR = 2024

# Each source spells its columns differently — SBM uses `ulbnm`/`ulbcode`,
# LGD tends to `dtname`/`dtcode11`. Guessing exact names failed silently: the
# first ULB build produced 3,368 features and zero names, because the column
# is `ulbnm` and the guess was `ulbname`. So instead of naming columns we name
# the SUBJECT, and resolve against the file's actual keys — logging the choice
# so a wrong pick is visible rather than silent.
LEVELS = {
    'state':       dict(asset='states/LGD_States.geojsonl.7z',              subj=('st',),                   minzoom=0, maxzoom=7,  simplify=6),
    'district':    dict(asset='districts/LGD_Districts.geojsonl.7z',        subj=('dist', 'dt'),            minzoom=3, maxzoom=9,  simplify=5),
    'subdistrict': dict(asset='subdistricts/LGD_Subdistricts.geojsonl.7z',  subj=('subdist', 'sdt', 'sub'), minzoom=5, maxzoom=11, simplify=4),
    'panchayat':   dict(asset='panchayats/LGD_Panchayats.geojsonl.7z',      subj=('panch', 'gp'),           minzoom=6, maxzoom=11, simplify=6),
    'village':     dict(asset='villages/LGD_Villages.geojsonl.7z',          subj=('vill', 'vlg'),           minzoom=7, maxzoom=13, simplify=3),
    'ulb':         dict(asset='urban/SBM_ULBs.geojsonl.7z',                 subj=('ulb',),                  minzoom=5, maxzoom=12, simplify=4),
    'ward':        dict(asset='urban/SBM_Wards.geojsonl.7z',                subj=('ward',), parent=('ulb',), minzoom=9, maxzoom=13, simplify=3),
}

_NAME_SUFFIX = ('nm', 'name', '_n')
_SKIP = ('code', 'lgd', 'id', 'objectid')


def resolve_keys(props, subj, label):
    """Pick the name and code column for a subject from the real keys."""
    keys = list(props.keys())
    low = {k: k.lower() for k in keys}

    def pick(pred):
        for s in subj:
            for k in keys:
                if s in low[k] and pred(low[k]):
                    return k
        return None

    name = pick(lambda k: k.endswith(_NAME_SUFFIX) and not any(x in k for x in _SKIP))
    code = pick(lambda k: 'code' in k)
    if not name:   # last resort: any *name/*nm column at all
        name = next((k for k in keys if low[k].endswith(_NAME_SUFFIX)
                     and not any(x in low[k] for x in _SKIP)), None)
    print(f'  {label}: name column = {name!r}, code column = {code!r}', flush=True)
    if not name:
        print(f'    !! no name column found among {keys}', flush=True)
    return name, code


def fetch(asset: str) -> Path:
    """Download and unpack a release asset once."""
    stem = asset.split('/')[-1].replace('.7z', '')
    out = CACHE / stem
    if out.exists():
        return out
    arc = CACHE / (stem + '.7z')
    if not arc.exists():
        url = f'{REL}/{asset}'
        print(f'  downloading {asset}…', flush=True)
        rc = subprocess.run(['curl', '-sL', '--fail', '--max-time', '1800',
                             '-o', str(arc), url]).returncode
        if rc != 0 or not arc.exists():
            raise SystemExit(f'  download failed: {url}')
    un = next((b for b in ('7zz', '7za', '7z')
               if subprocess.run(['which', b], capture_output=True).returncode == 0), None)
    if not un:
        raise SystemExit('need 7zz/7za/7z on PATH')
    subprocess.run([un, 'x', '-y', f'-o{CACHE}', str(arc)],
                   stdout=subprocess.DEVNULL, check=True)
    if not out.exists():
        raise SystemExit(f'  expected {out} after unpacking {arc}')
    return out


def build(level: str, cfg: dict, pm, transform, skip_pm: bool):
    src = fetch(cfg['asset'])
    slim = CACHE / f'{level}.slim.geojsonl'
    from shapely.geometry import shape

    with open(src, encoding='utf8') as fh:
        first = json.loads(fh.readline())
    k_name, k_code = resolve_keys(first.get('properties') or {}, cfg['subj'], level)
    k_par = None
    if cfg.get('parent'):
        k_par, _ = resolve_keys(first.get('properties') or {}, cfg['parent'], level + '/parent')

    # Streamed in chunks, never all-in-memory. An earlier script in this repo
    # buffered every feature before writing and hit 4.4 GB RSS on a national
    # dataset; villages alone are 584,615 polygons, so the same shape of bug
    # would be worse here. Each chunk is read, zonal-averaged, written, freed.
    CHUNK = 20000
    total = kept = bad = 0

    def flush(buf, geoms, fh):
        nonlocal kept
        if not buf:
            return
        if not skip_pm:
            vals = bvp.district_means(pm, transform, [(None, g) for g in geoms])
            for f, v in zip(buf, vals):
                if v is not None:
                    f['properties']['p'] = v
        for f in buf:
            fh.write(json.dumps(f, separators=(',', ':')) + '\n')
        kept += len(buf)

    with open(src, encoding='utf8') as fh_in, open(slim, 'w', encoding='utf8') as fh_out:
        buf, geoms = [], []
        for line in fh_in:
            line = line.strip()
            if not line:
                continue
            try:
                f = json.loads(line)
            except Exception:
                bad += 1
                continue
            g = f.get('geometry')
            if not g or not g.get('coordinates') or g.get('type') not in ('Polygon', 'MultiPolygon'):
                bad += 1
                continue
            p = f.get('properties') or {}
            props = {'n': (str(p.get(k_name) or '').strip() or None) if k_name else None,
                     'c': (str(p.get(k_code) or '').strip() or None) if k_code else None}
            if k_par:
                props['u'] = str(p.get(k_par) or '').strip() or None
            props = {k: v for k, v in props.items() if v is not None}
            buf.append({'type': 'Feature', 'properties': props, 'geometry': g})
            if skip_pm:
                geoms.append(None)
            else:
                try:
                    geoms.append(shape(g))
                except Exception:
                    geoms.append(None)
            total += 1
            if len(buf) >= CHUNK:
                flush(buf, geoms, fh_out)
                buf, geoms = [], []
                print(f'    {kept} written', flush=True)
        flush(buf, geoms, fh_out)

    print(f'  {level}: {kept} features ({bad} unusable)', flush=True)
    if not kept:
        raise SystemExit(f'  {level}: nothing to build')
    feats = None

    # Pass 3 — tiles. --drop-densest-as-needed keeps tiles under the size cap
    # without silently dropping whole features at low zoom.
    OUT.mkdir(parents=True, exist_ok=True)
    dst = OUT / f'{level}.pmtiles'
    cmd = ['tippecanoe', '-o', str(dst), '-f', '-l', level,
           '-Z', str(cfg['minzoom']), '-z', str(cfg['maxzoom']),
           '--simplification', str(cfg.get('simplify', 4)),
           '--drop-densest-as-needed', '--extend-zooms-if-still-dropping',
           '--quiet', str(slim)]
    subprocess.run(cmd, check=True)
    mb = dst.stat().st_size / 1e6
    print(f'  {level}.pmtiles — {mb:.1f} MB', flush=True)
    return {'level': level, 'features': kept, 'mb': round(mb, 1),
            'minzoom': cfg['minzoom'], 'maxzoom': cfg['maxzoom']}


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    skip_pm = '--skip-pm' in sys.argv
    todo = args or list(LEVELS)
    for t in todo:
        if t not in LEVELS:
            raise SystemExit(f'unknown level "{t}". Known: {", ".join(LEVELS)}')

    pm = transform = None
    if not skip_pm:
        pm, transform = bvp.load_grid(YEAR)

    manifest = []
    for level in todo:
        print(f'== {level}', flush=True)
        manifest.append(build(level, LEVELS[level], pm, transform, skip_pm))

    mf = OUT / '_levels.json'
    prev = json.loads(mf.read_text()) if mf.exists() else {}
    for m in manifest:
        prev[m['level']] = m
    prev['_year'] = YEAR
    mf.write_text(json.dumps(prev, indent=1))
    print(f'\nwrote {mf} — {len(manifest)} level(s) this run')


if __name__ == '__main__':
    main()
