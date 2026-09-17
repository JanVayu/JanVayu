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

**A second kind of figure was added on 2026-09-17, for a failure that principle
does not cover.** A *cited constant* comes from somebody else's report and can
never be recomputed here: the NCAP compliance count is CREA's, not ours. What it
can be held to is a single declared value with its source, recorded once in
`scripts/stats.json`.

The history is worth knowing, because two separate things had to go wrong. The
27 July 2026 fact-check round rewrote the denominator from 100 to 96 while
correctly removing a fabricated citation from the same line; it harmonised the
figure with the site's own earlier wrong text instead of checking CREA, whose
report says 102 NCAP cities have monitoring stations, 100 of those reported 80%
or more PM10 data coverage, and 23 met the target. The claim was then properly
retracted on 8 September and entered in `check-retracted-claims.py`. It still
survived another nine days in `netlify/functions/air-query.mjs`, because that
file wrote it with a slash rather than the word "of" and the retraction pattern
required the word. The register was right and the retraction was right; the
claim reached the page in a shape the pattern did not describe.

So two guards now cover it from different directions. `check-retracted-claims.py`
refuses the wrong value in any separator. This script holds every page to the
one declared value, which also catches a *new* wrong denominator that no
retraction has been written for yet.

The lesson generalises past this one number: **a fact-check entry that reads
"matching the fix already applied elsewhere on the site" is a consistency edit,
not a verification.** Five entries in that round are phrased that way. The NCAP
denominator is the one that was wrong. The 15th Finance Commission's "42
million-plus cities" was checked against PIB afterwards and holds. The CAAQMS
city count carries its own CREA table citation in the same round, so it is
verified rather than merely harmonised. The Delhi e-bus count and the EV scheme
outlays cite other pages of this site and nothing else, and have not been
checked against a primary source; they may well be right, which is the point.
The two kinds of edit are worth naming differently in the log, because only one
of them is evidence.
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


def clause(text, pos):
    """The clause the number sits in, not a fixed window around it.

    CITATION_MARKERS exists so that "655 districts" in a description of somebody
    else's study is not read as a claim about our coverage. It used to look
    within CONTEXT characters either way, which is wide enough to catch a marker
    belonging to a different sentence. The homepage's own meta description says
    "Live PM2.5 data for 30+ cities" and, a clause later, cites the Lancet -- so
    the word Lancet exempted the city count, and "30+" sat in the first thing a
    search engine and a shared link show, while the table held 160, unnoticed by
    a guard built to notice exactly that.
    """
    left = max((text.rfind(c, max(0, pos - CONTEXT), pos) for c in '.<|;\n'), default=-1)
    right_candidates = [text.find(c, pos, pos + CONTEXT) for c in '.<|;\n']
    right_candidates = [r for r in right_candidates if r != -1]
    right = min(right_candidates) if right_candidates else pos + CONTEXT
    return text[left + 1 if left != -1 else max(0, pos - CONTEXT):right]

# A dated release note is a record of what was true then, not a claim about now.
# CHANGELOG.md and the roadmap are kept out of PAGES for that reason, but
# panels/about.html carries a scrollable Version History inside a page that is
# otherwise present-tense, so the exclusion has to work at line level too:
# "Live AQI data integration via WAQI API for 16 Indian cities" is correct
# history and was reported as drift until this existed.
# Accepts a single version or a range, with or without a day: both
# "v18.0 &mdash; 22 Feb 2026" and "v10.0-14.0 &mdash; Feb 2026" appear in that
# history, and a first version of this regex required the day and missed the
# second one.
HISTORY_MARKER = re.compile(
    r'v\d+(?:\.\d+)*(?:\s*[-\u2013\u2014]\s*\d+(?:\.\d+)*)?'
    r'\s*(?:&mdash;|&ndash;|[-\u2013\u2014])\s*(?:\d{1,2}\s+)?'
    r'(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+20\d{2}',
    re.I,
)
HISTORY_LOOKBACK = 1200   # a release block is longer than CONTEXT


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

    # The live dashboard's city list, counted from the table app.js actually
    # ships. The site said "157 cities" in a dozen places and "30+ cities" in
    # its own meta description, og:description and JSON-LD -- the three things
    # a search engine and a shared link show first -- while the table held 160.
    # Nothing was watching the one number the front page leads with.
    app = (ROOT / 'app.js').read_text(encoding='utf-8')
    i = app.find('const CITIES = {')
    if i != -1:
        depth, j = 0, app.index('{', i)
        for k in range(j, len(app)):
            if app[k] == '{':
                depth += 1
            elif app[k] == '}':
                depth -= 1
                if depth == 0:
                    break
        out['live_cities'] = len(re.findall(r'(?m)^\s{4,8}[a-zA-Z0-9_-]+:\s*\{\s*name:', app[j:k + 1]))

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
    # "across N cities" alone is far too loose: it matched "Compare AQI across
    # 160 cities" and a cited study's "confirmed across 620 cities in 36
    # countries". The wall is the only thing this figure describes, so require
    # the wall to be named in the same clause.
    ('testimony_cities', [
        r'(?:testimon\w*|voices|accounts)[^.<|]{0,60}?(?:across|from)\s+{n}\s+cities',
        r'{n}\s+cities[^.<|]{0,40}?(?:testimon\w*|voices)',
    ]),
    ('boundary_areas', [r'{n}\s+areas']),
    ('wards', [r'{n}\s+municipal\s+wards', r'all\s+{n}\s+wards']),
    ('villages', [r'{n}\s+villages']),
    # "N districts" on its own describes all sorts of things — a study's
    # sample, a data file's coverage, the districts where two products
    # overlap. Only a claim about what the site COVERS is ours to police.
    ('districts', [r'all\s+{n}\s+districts', r'{n}\s+districts\s+(?:in|across)\s+India',
                   r"India'?s\s+{n}\s+districts"]),
    # Live-dashboard cities. Narrow on purpose: "N cities" alone describes the
    # ward atlas (142), testimony (107), NCAP (131) and the bulletin layer (289)
    # as well, so only phrasings that clearly mean the live dashboard count.
    ('live_cities', [
        r'(?:live|real[- ]time)\s+(?:PM2\.?5|AQI)[^.<|]{0,40}?(?:for|across)\s+{n}\+?\s+(?:Indian\s+)?cities',
        r'PM2\.?5\s+and\s+AQI\s+(?:data\s+)?(?:for|across)\s+{n}\+?\s+(?:Indian\s+)?cities',
        r'Live\s+AQI\s*(?:&#8212;|&mdash;|-|\u2014)\s*{n}\+?\s+cities',
        r'live\s+AQI\s+for\s+{n}\+?\s+cities',
        r'hour-by-hour\s+picture\s+for\s+{n}\+?\s+cities',
        r'Compare\s+AQI\s+across\s+{n}\+?\s+cities',
        r'Real-time\s+PM2\.?5\s+for\s+{n}\+?\s+cities',
    ]),
    ('panchayats', [r'{n}\s+gram\s+panchayats?']),
    ('ulbs', [r'{n}\s+(?:ULBs|urban\s+local\s+bodies)']),
]

# ── Cited constants ────────────────────────────────────────────────────────
# Externally-sourced numbers that cannot be recomputed from this repo, but can
# be held to one declared value. Each is recorded once in scripts/stats.json,
# with its source, and every page quoting it must agree.
CITED_RULES = [
    # Matches "23 of the 100 cities with sufficient data" and "23/100 cities",
    # and any other denominator written in either shape, which is the point.
    ('ncap_40pct_met', 'denominator', [
        r'23\s*(?:of|/)\s*(?:the\s+)?([\d,]{1,6})\s+cities',
        r'23\s+of\s+(?:the\s+)?([\d,]{1,6})\s+NCAP\s+cities',
    ]),
]


def cited_truth():
    """Declared values for figures that come from somebody else's report."""
    return json.loads((ROOT / 'scripts/stats.json').read_text(encoding='utf-8'))


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
                    around = clause(text, pos)
                    if CITATION_MARKERS.search(around):
                        continue   # somebody else's study, not our coverage
                    if HISTORY_MARKER.search(text[max(0, pos - HISTORY_LOOKBACK):pos]):
                        continue   # inside a dated release note
                    line = text.count('\n', 0, pos) + 1
                    ok = got == T[key]
                    if args.list:
                        print(f'  {"ok " if ok else "OFF"} {rel}:{line}  {key} = {got:,}')
                    if not ok:
                        drift.append((rel, line, key, got, T[key]))

    # Second pass: cited constants, held to the single value in stats.json.
    C = cited_truth()
    for rel in PAGES:
        p = ROOT / rel
        if not p.exists():
            continue
        text = p.read_text(encoding='utf-8', errors='replace')
        for key, field, patterns in CITED_RULES:
            want_raw = (C.get(key) or {}).get(field)
            if want_raw is None:
                continue
            want = int(str(want_raw).replace(',', ''))
            for pat in patterns:
                for m in re.finditer(pat, text, re.I):
                    try:
                        got = int(m.group(1).replace(',', ''))
                    except ValueError:
                        continue
                    line = text.count('\n', 0, m.start()) + 1
                    ok = got == want
                    if args.list:
                        print(f'  {"ok " if ok else "OFF"} {rel}:{line}  {key}.{field} = {got:,}')
                    if not ok:
                        src = (C[key].get('source') or 'no source recorded')
                        drift.append((rel, line, f'{key}.{field} (cited: {src})', got, want))

    if not drift:
        print('No drift: every checkable figure on the site matches the data, '
              'and every cited constant matches scripts/stats.json.')
        return 0

    print(f'{len(drift)} figure(s) out of step with the data:\n')
    for rel, line, key, got, want in drift:
        print(f'  {rel}:{line}')
        print(f'    {key}: page says {got:,}, the record says {want:,}')
    return 1


if __name__ == '__main__':
    sys.exit(main())
