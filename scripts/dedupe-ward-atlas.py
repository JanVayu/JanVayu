#!/usr/bin/env python3
"""
dedupe-ward-atlas.py — collapse exact-duplicate ward geometries.

The ward level is stitched from three sources — SBM, the West Bengal AMRUT
layer and Living Atlas — and for a few dozen ULBs they overlap outright. The
result is 2,541 features that are byte-identical in geometry to another
feature: Patna carries 628 ward records across 115 distinct shapes, Mangalore
540 across 60, Savanur 356 across 27. "Ward 1" appears twenty-three times in
Patna.

This was invisible until a land-cover pass started rasterising wards into a
single label grid and whole cities came back empty — duplicates overwrite each
other, so all but the last-drawn lost every pixel. Fixing that pass fixed the
symptom. This fixes the cause, and with it a headline number: "70,417 wards" is
a count of records, not of places.

Only exact geometry matches are removed. Near-duplicates — the same ward
digitised twice at different tolerances — are left alone, because deciding
which of two similar shapes is correct is a data question, not a scripting one,
and silently picking one would be the kind of quiet guess this repo tries to
avoid. The count printed at the end says how many remain suspicious.

Among duplicates the richest record wins: the one with the most populated
properties, preferring a named ward over an unnamed one, so collapsing never
costs a name.

Usage:  python3 scripts/dedupe-ward-atlas.py [--in FILE] [--out FILE]
"""

import json, hashlib, os, sys
from pathlib import Path
from collections import defaultdict

CACHE = Path(os.environ.get('JV_CACHE', '/tmp/jv-boundaries'))


def richness(props):
    """How much a record would cost us to discard."""
    return (1 if props.get('n') else 0, sum(1 for v in props.values() if v not in (None, '')))


def main():
    src = Path(sys.argv[sys.argv.index('--in') + 1]) if '--in' in sys.argv \
        else CACHE / 'ward.slim.merged.geojsonl'
    dst = Path(sys.argv[sys.argv.index('--out') + 1]) if '--out' in sys.argv \
        else CACHE / 'ward.slim.dedup.geojsonl'
    if not src.exists():
        raise SystemExit(f'{src} missing')

    best = {}       # geometry hash -> (richness, line index, record)
    order = []      # geometry hashes in first-seen order, so output stays stable
    total = 0
    by_city = defaultdict(int)

    with open(src, encoding='utf8') as fh:
        for line in fh:
            line = line.strip()
            if not line:
                continue
            total += 1
            rec = json.loads(line)
            key = hashlib.md5(json.dumps(rec['geometry'], sort_keys=True).encode()).hexdigest()
            r = richness(rec.get('properties') or {})
            if key not in best:
                best[key] = (r, total, rec)
                order.append(key)
            else:
                by_city[(rec.get('properties') or {}).get('u') or '?'] += 1
                if r > best[key][0]:
                    best[key] = (r, best[key][1], rec)

    with open(dst, 'w', encoding='utf8') as out:
        for key in order:
            out.write(json.dumps(best[key][2], separators=(',', ':')) + '\n')

    removed = total - len(order)
    print(f'{total} ward records -> {len(order)} distinct ({removed} duplicates collapsed)')
    if by_city:
        print('\nmost affected ULBs:')
        for u, c in sorted(by_city.items(), key=lambda x: -x[1])[:10]:
            print(f'  {u[:46]:46s} {c} duplicate records')
    print(f'\nwrote {dst}')


if __name__ == '__main__':
    main()
