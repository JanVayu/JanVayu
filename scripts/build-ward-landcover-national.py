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

Resilience, learned the hard way. The first full run reached 14,000 of 70,417
wards and then stalled, and its success rate fell from 99.9% to 71% on the way.
The cause was transient "Read failed" errors from the remote WorldCover COGs —
and two design faults of mine made a blip expensive: a failed read lost the
whole 2,000-ward chunk rather than the wards actually affected, and there was
no retry and no resume, so a stall meant starting over. Now: each chunk is
retried with backoff, a chunk that still fails is split so only the genuinely
unreadable wards are lost, and completed wards are appended so a re-run picks
up where it stopped.

A finished run still leaves gaps — 4,046 of 70,417 wards after the first
complete pass — because bisection deliberately gives up on the wards it cannot
read rather than losing their neighbours too. Those are transient failures, not
permanent ones, so --fill re-attempts only the wards still missing `g` and
patches them into place. It is a second sweep over 6% of the country, not a
re-run of the whole thing.

Usage:  python3 scripts/build-ward-landcover-national.py [--limit N] [--restart]
        python3 scripts/build-ward-landcover-national.py --fill
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
RESTART = '--restart' in sys.argv
CHUNK = 500          # smaller: a failed read now costs 500 wards, not 2,000
RETRIES = 3


def zonal_with_retry(feats, depth=0):
    """Land cover for a batch, retrying transient remote-read failures.

    /vsicurl reads against the WorldCover bucket fail intermittently. A single
    blip used to cost the entire batch, so failures are retried with backoff
    and then bisected — an unreadable ward loses only itself, not its
    neighbours.
    """
    import time
    for attempt in range(RETRIES):
        try:
            return bws.per_ward_worldcover(feats)
        except Exception as e:
            if attempt == RETRIES - 1:
                if len(feats) == 1 or depth > 6:
                    print(f'    giving up on {len(feats)} ward(s): {e}', flush=True)
                    return [(None, None)] * len(feats)
                mid = len(feats) // 2
                print(f'    splitting {len(feats)} wards after repeated failure', flush=True)
                return zonal_with_retry(feats[:mid], depth + 1) + zonal_with_retry(feats[mid:], depth + 1)
            time.sleep(2 ** attempt)
    return [(None, None)] * len(feats)


def centroid(geom):
    """Area-weighted centroid; WorldCover tiles are picked from it."""
    from shapely.geometry import shape
    try:
        g = shape(geom)
        c = g.representative_point()
        return round(c.x, 5), round(c.y, 5)
    except Exception:
        return None, None


def fill():
    """Retry only the wards a completed run left without land cover.

    Two passes over the file so memory stays proportional to the gaps rather
    than to the country: collect the missing wards, resolve them, then stream
    the file through again patching those line numbers. The rewrite goes to a
    temporary file and is renamed at the end — a half-patched ward file that
    looked complete would be exactly the quiet-wrong outcome this project keeps
    getting caught by.
    """
    gaps = []                     # (line number, feature)
    total = 0
    with open(OUT, encoding='utf8') as f:
        for i, line in enumerate(f):
            line = line.strip()
            if not line:
                continue
            total += 1
            feat = json.loads(line)
            if 'g' in feat['properties']:
                continue
            cx, cy = centroid(feat['geometry'])
            if cx is None:
                continue          # no usable geometry — nothing to retry
            feat['properties']['cx'], feat['properties']['cy'] = cx, cy
            gaps.append((i, feat))
    print(f'{total} wards, {len(gaps)} still without land cover', flush=True)
    if not gaps:
        return

    fixed = {}
    gaps.sort(key=lambda g: bws.wc_tile_name(g[1]['properties']['cx'], g[1]['properties']['cy']))
    for start in range(0, len(gaps), CHUNK):
        batch = gaps[start:start + CHUNK]
        vals = zonal_with_retry([f for _, f in batch])
        for (idx, _), (g, b) in zip(batch, vals):
            if g is not None:
                fixed[idx] = (g, b)
        print(f'  {min(start + CHUNK, len(gaps))}/{len(gaps)} retried, {len(fixed)} recovered', flush=True)

    tmp = OUT.with_suffix('.patched')
    with open(OUT, encoding='utf8') as fin, open(tmp, 'w', encoding='utf8') as fout:
        for i, line in enumerate(fin):
            line = line.strip()
            if not line:
                continue
            if i in fixed:
                feat = json.loads(line)
                feat['properties']['g'], feat['properties']['b'] = fixed[i]
                line = json.dumps(feat, separators=(',', ':'))
            fout.write(line + '\n')
    tmp.replace(OUT)
    print(f'\nrecovered {len(fixed)} of {len(gaps)}; '
          f'{total - len(gaps) + len(fixed)}/{total} wards now have land cover')


def main():
    if '--fill' in sys.argv:
        if not OUT.exists():
            raise SystemExit(f'{OUT} missing — run without --fill first')
        return fill()
    if not SLIM.exists():
        raise SystemExit(f'{SLIM} missing — run build-boundary-tiles.py ward first')

    # Resume: count what a previous run already wrote and skip that many.
    already = 0
    if OUT.exists() and not RESTART:
        with open(OUT, encoding='utf8') as f:
            already = sum(1 for _ in f)
        if already:
            print(f'resuming — {already} wards already written', flush=True)

    done = ok = 0
    buf = []
    mode = 'a' if (already and not RESTART) else 'w'
    with open(SLIM, encoding='utf8') as fin, open(OUT, mode, encoding='utf8') as fout:

        def flush():
            nonlocal ok, done
            if not buf:
                return
            # per_ward_worldcover groups tile opens by centroid, so a chunk
            # that spans one WorldCover tile costs one open rather than N.
            vals = zonal_with_retry(buf)
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

        seen = 0
        for line in fin:
            line = line.strip()
            if not line:
                continue
            seen += 1
            if seen <= already:      # already written by an earlier run
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
