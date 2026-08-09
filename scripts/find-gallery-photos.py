#!/usr/bin/env python3
"""
find-gallery-photos.py — search Wikimedia Commons for openly-licensed photographs
for the "The air, in pictures" gallery, and print candidates with their licence.

Why a script rather than a browse
---------------------------------
The gallery's whole claim is that every photograph is openly licensed and
credited to the person who took it. That is only true if each licence is read
from the file's own metadata rather than assumed from where it was found. This
queries the Commons API for extmetadata, keeps only licences we can actually
use, and prints the credit line exactly as Commons records it.

It does not download anything and it does not edit the gallery. It prints
candidates for a human to choose from, because "is this photograph what it says
it is" is a judgement the API cannot make — Commons contains mislabelled images,
staged images, and images of the right subject in the wrong country.

Run:  python3 scripts/find-gallery-photos.py
      python3 scripts/find-gallery-photos.py --query "brick kiln India" --limit 12
"""

import argparse, json, sys, urllib.parse, urllib.request

API = 'https://commons.wikimedia.org/w/api.php'
UA = 'JanVayu-gallery/1.0 (https://janvayu.in; contact via github.com/JanVayu/JanVayu)'

# Licences the gallery can use. Anything else is skipped rather than guessed at:
# NC and ND terms are not compatible with how the site reuses these.
OK_LICENCES = ('cc0', 'cc by', 'cc by-sa', 'public domain', 'pd-', 'attribution')
BAD_TERMS = ('nc', 'nd', 'fair use', 'non-free')

# What the existing 24 already cover — smog skylines, coal, brick kilns, stubble
# burning, waste burning, NASA imagery. These queries aim at what they do not:
# the people in it, the health end of it, and what a solution looks like.
DEFAULT_QUERIES = [
    'air pollution mask Delhi',
    'smog children India',
    'traffic police mask India',
    'construction dust India',
    'chulha cookstove smoke India',
    'air quality monitoring station India',
    'clean air protest India',
    'CNG bus Delhi',
    'Delhi metro train',
    'urban trees park Delhi',
    'crop residue management happy seeder',
    'respiratory hospital India',
    'street vendor smog India',
    'landfill Ghazipur',
    'electric rickshaw India',
]


def api(params):
    q = urllib.parse.urlencode(params)
    req = urllib.request.Request(f'{API}?{q}', headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


def strip_html(s):
    out, depth = [], 0
    for ch in s or '':
        if ch == '<':
            depth += 1
        elif ch == '>':
            depth = max(0, depth - 1)
        elif depth == 0:
            out.append(ch)
    return ' '.join(''.join(out).split())


def usable(lic):
    low = (lic or '').lower()
    if not low:
        return False
    if any(b in low.split() for b in ('nc', 'nd')):
        return False
    if any(b in low for b in BAD_TERMS):
        return False
    return any(low.startswith(k) or k in low for k in OK_LICENCES)


# Curated categories beat full-text search by a wide margin. A search for
# "clean air protest India" returned photographs of Amsterdam canals, because
# the words appear in unrelated descriptions; a category is maintained by
# people who looked at the picture.
DEFAULT_CATEGORIES = [
    'Air pollution in India',
    'Air pollution in Delhi',
    'Brick kilns in India',
    'Delhi Metro',
    'Buses of Delhi',
    'Air quality measurement',
    'Wood-burning stoves',
    'Waste in India',
    'Traffic in Delhi',
    'Parks in Delhi',
]


def from_category(cat, limit):
    """Files in a Commons category. Curated, so far less noise than search."""
    try:
        d = api({
            'action': 'query', 'format': 'json', 'generator': 'categorymembers',
            'gcmtitle': f'Category:{cat}', 'gcmtype': 'file', 'gcmlimit': limit,
            'prop': 'imageinfo', 'iiprop': 'url|extmetadata|size|mime',
            'iiurlwidth': 1400,
        })
    except Exception as e:
        print(f'  ! {cat}: {e}', file=sys.stderr)
        return []
    return _rows(d)


def _rows(d):
    out = []
    for p in (d.get('query', {}).get('pages') or {}).values():
        ii = (p.get('imageinfo') or [{}])[0]
        if not ii or 'image' not in (ii.get('mime') or ''):
            continue
        em = ii.get('extmetadata', {}) or {}
        lic = strip_html(em.get('LicenseShortName', {}).get('value'))
        if not usable(lic):
            continue
        if ii.get('width', 0) < 900:
            continue
        out.append({
            'title': p['title'],
            'licence': lic,
            'licenceurl': strip_html(em.get('LicenseUrl', {}).get('value')),
            'credit': strip_html(em.get('Artist', {}).get('value'))[:90],
            'desc': strip_html(em.get('ImageDescription', {}).get('value'))[:150],
            'thumb': ii.get('thumburl'),
            'page': ii.get('descriptionurl'),
            'size': f"{ii.get('width')}x{ii.get('height')}",
        })
    return out


def search(query, limit):
    try:
        d = api({
            'action': 'query', 'format': 'json', 'generator': 'search',
            'gsrnamespace': 6, 'gsrlimit': limit,
            # filetype:bitmap keeps PDFs and scanned books out of the results
            'gsrsearch': f'{query} filetype:bitmap',
            'prop': 'imageinfo',
            'iiprop': 'url|extmetadata|size|mime',
            'iiurlwidth': 1400,
        })
    except Exception as e:
        print(f'  ! {query}: {e}', file=sys.stderr)
        return []
    return _rows(d)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--query', action='append')
    ap.add_argument('--category', action='append')
    ap.add_argument('--limit', type=int, default=6)
    args = ap.parse_args()

    jobs = []
    if args.query:
        jobs += [('search', q) for q in args.query]
    if args.category:
        jobs += [('cat', c) for c in args.category]
    if not jobs:
        jobs = [('cat', c) for c in DEFAULT_CATEGORIES]

    seen = set()
    for kind, q in jobs:
        rows = from_category(q, args.limit) if kind == 'cat' else search(q, args.limit)
        if not rows:
            continue
        print(f'\n### {q}  [{kind}]')
        for r in rows:
            if r['title'] in seen:
                continue
            seen.add(r['title'])
            print(f"  {r['title'][:78]}")
            print(f"    {r['licence']}  |  {r['credit'] or '(no artist recorded)'}  |  {r['size']}")
            if r['desc']:
                print(f"    {r['desc']}")
            print(f"    {r['thumb']}")


if __name__ == '__main__':
    main()
