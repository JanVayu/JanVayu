#!/usr/bin/env python3
"""Fail the build if a claim JanVayu has publicly retracted comes back.

JanVayu published a post in July 2026, "We Fact-Checked Ourselves", retracting
its own claim that India carries "~70% of the global PM2.5 mortality burden".
The homepage was fixed. `scripts/stats.json` was fixed after it was found to be
injecting the old figure back over the corrected HTML at runtime. `test/ask-eval`
gained a hard gate so the assistant can never say it.

On 8 September 2026 the claim was still live in **eleven** files: the English
docs front page, the wiki home, the canonical `docs/data-sources/health-data.md`
that the rest of the site cites, and the Hindi, Bengali, Marathi and Tamil
translations of all of them. A correction had landed on every surface anyone
looks at and none of the surfaces they do not.

That is the failure this script exists for. A retraction is not a one-time edit;
it is a claim the repository must keep out. Same for a figure a fact-check has
superseded, which behaves identically: Delhi's annual PM2.5 moved to 82.2 µg/m³
on 20 July 2026 and 91.6 was still sitting in nine files seven weeks later.

    python3 scripts/check-retracted-claims.py           # report, exit 1 on a hit
    python3 scripts/check-retracted-claims.py --list    # what is being policed

Adding one: put it in CLAIMS with the date it was retracted, the correct wording,
and the paths that may legitimately still contain it. Those are always the dated
records — the changelog, the fact-check notes, the post that did the retracting,
and the test that asserts the assistant never says it. Everything else is a leak.
"""
import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Directories never worth scanning.
SKIP_DIRS = {'.git', 'node_modules', 'Backups', 'fonts', 'photos', 'tiles', '.github'}
# Only text a reader could end up reading.
EXTS = {'.html', '.md', '.mjs', '.js', '.json', '.py', '.yml', '.yaml', '.txt'}

# "global" in each language the docs are translated into, so a translated copy
# of a retracted claim is caught by its numeral plus its own word for global.
GLOBAL_WORD = r'global|वैश्विक|जागतिक|বৈশ্বিক|জাগতিক|உலக'

CLAIMS = [
    {
        'id': '70pct-global',
        'pattern': re.compile(r'(?:~|about |roughly |approximately )?70\s*%'),
        # The bare numeral is not the claim: "~70% of rural Indian women still
        # cook with solid fuels" is true and unrelated. The claim is the numeral
        # standing for India's share of the GLOBAL burden, so require both.
        'also_on_line': re.compile(GLOBAL_WORD, re.I),
        'retracted': '2026-07-17',
        'why': 'India\'s PM2.5 toll is the largest of any single country but is NOT a '
               'majority of the global burden. Retracted in blog/posts/2026-07-17-'
               'we-factchecked-ourselves.md.',
        'instead': 'roughly a quarter to a third of the global ambient PM2.5 burden',
        'allow': [
            'CHANGELOG.md',
            'docs/fact-check-',
            'docs/wiki/Roadmap.md',       # records what shipped, retraction included
            'docs/wiki/Home.md',          # ditto — its "What's New" names the claim it retired
            'blog/posts/2026-07-17-we-factchecked-ourselves.md',
            'blog/posts/2026-05-26-v26.6.20-platform-overhaul.md',  # a dated screenshot of the old page
            'test/ask-eval/',
            # Holds the CORRECTED value; its note names the retracted one so a
            # future reader knows why the field reads as it does.
            'scripts/stats.json',
            'scripts/check-retracted-claims.py',
        ],
    },
    {
        'id': 'delhi-91-6',
        # Only when presented as a measurement, so SVG path coordinates and the
        # unrelated LongPMInd Delhi-wide mean in the changelog do not trip it.
        'pattern': re.compile(r'91\.6\s*(?:&micro;|µ|ug/|<[^>]*>\s*(?:&micro;|µ))'),
        'also_on_line': None,
        'retracted': '2026-07-20',
        'why': 'Delhi\'s annual PM2.5 was corrected to 82.2 µg/m³ (IQAir 2025) by the '
               '20 July 2026 fact-check. 91.6 is the superseded 2024-edition figure.',
        'instead': '82.2 µg/m³ (IQAir 2025), ~16× the WHO guideline',
        'allow': [
            'CHANGELOG.md',
            'docs/fact-check-',
            'docs/wiki/Home.md',          # its version-history entries quote the old value
            'docs/wiki/Roadmap.md',       # ditto, in the phase that records the correction
            'panels/about.html',          # ditto, in the on-site version history
            'scripts/check-retracted-claims.py',
        ],
    },
    {
        'id': 'india-5th',
        'pattern': re.compile(r'5th most polluted', re.I),
        'also_on_line': None,
        'retracted': '2026-07-17',
        'why': 'India ranks 6th most polluted country at 48.9 µg/m³ (IQAir 2025). '
               '5th was the previous edition.',
        'instead': '6th most polluted country, average PM2.5 48.9 µg/m³',
        'allow': [
            'CHANGELOG.md',
            'docs/fact-check-',
            'docs/wiki/Home.md',          # names the retired rank in its release notes
            'docs/wiki/Roadmap.md',       # ditto
            'blog/posts/2026-07-17-we-factchecked-ourselves.md',
            'scripts/check-retracted-claims.py',
        ],
    },
]


def files():
    for p in sorted(ROOT.rglob('*')):
        if not p.is_file() or p.suffix.lower() not in EXTS:
            continue
        if any(part in SKIP_DIRS for part in p.relative_to(ROOT).parts):
            continue
        yield p


def allowed(rel, claim):
    return any(rel.startswith(a) or a in rel for a in claim['allow'])


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--list', action='store_true', help='print what is policed and exit')
    args = ap.parse_args()

    if args.list:
        for c in CLAIMS:
            print(f"{c['id']}  (retracted {c['retracted']})")
            print(f"  why    : {c['why']}")
            print(f"  instead: {c['instead']}")
        return 0

    hits = []
    for p in files():
        rel = str(p.relative_to(ROOT))
        try:
            lines = p.read_text(encoding='utf-8').splitlines()
        except (UnicodeDecodeError, OSError):
            continue
        for claim in CLAIMS:
            if allowed(rel, claim):
                continue
            for n, line in enumerate(lines, 1):
                if not claim['pattern'].search(line):
                    continue
                if claim['also_on_line'] and not claim['also_on_line'].search(line):
                    continue
                hits.append((claim, rel, n, line.strip()[:120]))

    if not hits:
        print(f'PASS — none of the {len(CLAIMS)} retracted claims appear outside '
              'the records that document them.')
        return 0

    by_claim = {}
    for claim, rel, n, line in hits:
        by_claim.setdefault(claim['id'], []).append((claim, rel, n, line))

    print(f'FAIL: {len(hits)} occurrence(s) of a retracted claim.\n')
    for cid, group in by_claim.items():
        claim = group[0][0]
        print(f"  {cid} — retracted {claim['retracted']}")
        print(f"    {claim['why']}")
        print(f"    Say instead: {claim['instead']}")
        for _, rel, n, line in group:
            print(f'      {rel}:{n}  {line}')
        print()
    print('  If an occurrence is a legitimate dated record of the retraction '
          'itself,\n  add its path to that claim\'s "allow" list with a reason.')
    return 1


if __name__ == '__main__':
    sys.exit(main())
