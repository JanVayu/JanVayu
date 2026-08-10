#!/usr/bin/env python3
"""Check the numbers the site states against the numbers the site holds.

Figures get quoted in a dozen places — the homepage card, the panel, the
README, the walkthrough decks, the roadmap, the blog — and they drift. The
gallery grew from 24 photographs to 31 and the homepage card went on saying 24;
the testimony wall went 142 -> 250 and three pages kept the old figure. Nobody
notices, because nobody re-reads the whole site.

So the counts come from the data, and this walks the pages looking for a
different number in front of the same phrase.

    python3 scripts/check-site-figures.py          # report, exit 1 on drift
    python3 scripts/check-site-figures.py --list   # just show what is claimed

It is deliberately narrow: it only checks figures it can derive from a file in
the repo. A number nobody can recompute is not something a script should be
policing.
"""
import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Pages that make claims about the site to a reader, in the present tense.
# CHANGELOG.md and docs/wiki/Roadmap.md are deliberately absent: both are
# records of what was true at a past release, so a figure there that no longer
# matches today's data is correct, not drift.
PAGES = [
    'index.html', 'README.md',
    'panels/gallery.html', 'panels/voices.html', 'panels/about.html',
    'panels/resources.html', 'panels/faq.html', 'panels/source-selector.html',
    'walkthrough/full.html', 'walkthrough/deck.html', 'walkthrough/index.html',
    'docs/wiki/Home.md',
    'app.js',
    # The assistant states figures to citizens who may quote it to an official,
    # so its prompt is held to the same standard as a page. Its ward count was
    # five releases stale — 9,015 across "142 Ward Atlas cities" — before this
    # caught it.
    'netlify/functions/air-query.mjs',
]

# A number near one of these is quoting somebody else's study or scheme, not
# describing this site's coverage. Jaganathan et al. sampled 655 districts and
# PM-eBus Sewa covers 169 cities; neither should be "corrected" to ours.
CITATION_MARKERS = re.compile(
    r'et\s+al\.|difference-in-differences|Lancet|PM-eBus|Sewa|study|analysis|cohort'
    r'|calibrat|where both|sample|summarised by|summarized by',
    re.I,
)
CONTEXT = 200   # characters either side to inspect for those markers


def truth():
    """Every figure this script is willing to police, derived from the data."""
    out = {}

    t = json.loads((ROOT / 'data/testimonies.json').read_text(encoding='utf-8'))
    out['testimonies'] = len(t)
    out['testimony_cities'] = len({x['city'] for x in t})
    out['testimony_languages'] = len({x['lang'] for x in t})

    g = (ROOT / 'panels/gallery.html').read_text(encoding='utf-8')
    out['photographs'] = g.count('<figure')

    cy = ROOT / 'data/current-year-air.json'
    if cy.exists():
        out['current_year_districts'] = len(json.loads(cy.read_text())['districts'])

    lv = ROOT / 'data/tiles/_levels.json'
    if lv.exists():
        levels = json.loads(lv.read_text())
        feats = {k: v['features'] for k, v in levels.items() if isinstance(v, dict) and 'features' in v}
        out.update({
            'states': feats.get('state'), 'districts': feats.get('district'),
            'subdistricts': feats.get('subdistrict'), 'panchayats': feats.get('panchayat'),
            'villages': feats.get('village'), 'ulbs': feats.get('ulb'), 'wards': feats.get('ward'),
        })
        # Villages carry their numbers in per-district TopoJSON rather than in
        # the tile archive, so they are counted but not tiled — the total the
        # site quotes is every area at every level.
        out['boundary_areas'] = sum(v for v in feats.values())
    return {k: v for k, v in out.items() if v is not None}


# Each rule: the truth key, and patterns whose captured group must equal it.
# `{n}` stands in for the number.
RULES = [
    ('photographs', [
        # Allows adjectives in between: "31 openly-licensed documentary
        # photographs" has two words before the noun.
        r'{n}(?:\s+(?:open-licensed|openly-licensed|open\s+licensed|documentary|CC|public-domain))*\s+photograph',
    ]),
    ('testimonies', [r'{n}\s+(?:first-person\s+)?testimonies', r'{n}\s+people,\s*\d+\s+languages']),
    ('testimony_cities', [r'across\s+{n}\s+cities']),
    ('boundary_areas', [r'{n}\s+areas']),
    ('wards', [r'{n}\s+municipal\s+wards', r'all\s+{n}\s+wards']),
    ('villages', [r'{n}\s+villages']),
    # "N districts" on its own describes all sorts of things — a study's
    # sample, a data file's coverage, the districts where two products
    # overlap. Only a claim about what the site COVERS is ours to police.
    ('districts', [r'all\s+{n}\s+districts', r'{n}\s+districts\s+(?:in|across)\s+India',
                   r"India'?s\s+{n}\s+districts"]),
    ('panchayats', [r'{n}\s+gram\s+panchayats?']),
    ('ulbs', [r'{n}\s+(?:ULBs|urban\s+local\s+bodies)']),
]

NUM = r'([\d,]{1,12})'


def claims(text, pattern):
    return [(m.group(1), m.start()) for m in re.finditer(pattern.replace('{n}', NUM), text, re.I)]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--list', action='store_true', help='show every claim found, matching or not')
    args = ap.parse_args()

    T = truth()
    print('Figures derived from the data:')
    for k, v in sorted(T.items()):
        print(f'  {k:24s} {v:,}')
    print()

    drift = []
    for rel in PAGES:
        p = ROOT / rel
        if not p.exists():
            continue
        text = p.read_text(encoding='utf-8', errors='replace')
        for key, patterns in RULES:
            if key not in T:
                continue
            for pat in patterns:
                for raw, pos in claims(text, pat):
                    try:
                        got = int(raw.replace(',', ''))
                    except ValueError:
                        continue
                    around = text[max(0, pos - CONTEXT):pos + CONTEXT]
                    if CITATION_MARKERS.search(around):
                        continue   # somebody else's study, not our coverage
                    line = text.count('\n', 0, pos) + 1
                    ok = got == T[key]
                    if args.list:
                        print(f'  {"ok " if ok else "OFF"} {rel}:{line}  {key} = {got:,}')
                    if not ok:
                        drift.append((rel, line, key, got, T[key]))

    if not drift:
        print('No drift: every checkable figure on the site matches the data.')
        return 0

    print(f'{len(drift)} figure(s) out of step with the data:\n')
    for rel, line, key, got, want in drift:
        print(f'  {rel}:{line}')
        print(f'    {key}: page says {got:,}, data says {want:,}')
    return 1


if __name__ == '__main__':
    sys.exit(main())
