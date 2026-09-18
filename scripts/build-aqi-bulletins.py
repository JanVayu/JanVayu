#!/usr/bin/env python3
"""Official CPCB daily AQI bulletins, turned into a per-city accountability record.

CPCB publishes a daily AQI bulletin as a PDF at 4pm, covering 200+ cities, and
has done since May 2015. UrbanEmissions.Info parsed eleven years of those PDFs
into a single table. This turns that table into the thing a citizen can actually
use: **how many days of each official category your city had, each year, by
CPCB's own reckoning.**

It fills the gap the station archive leaves. The XKDR archive is station-level
and hourly and its CPCB feed stops on 1 September 2025; the bulletin is
city-level and daily and ran to the end of 2025. Different pipeline, so the one
kept coming when the other stopped.

## What this deliberately does NOT compute

**No annual mean AQI.** The site's own rule is that AQI is a unitless index
which reports only whichever of six pollutants scores worst, and that it cannot
be averaged over a year: two cities at the same AQI can be breathing very
different air, and the arithmetic mean of an index is not a quantity. Counting
DAYS IN EACH CATEGORY is the legitimate use of a daily index, and it is also
the number that carries a policy consequence, because GRAP and school closures
are triggered by category.

## Three traps in the source

**A station count of one is not a city.** The bulletin reports how many stations
fed each day's figure and it ranges from 1 to dozens. An AQI computed from one
station is a reading from one place with a city's name on it. Every city-year
here carries its median station count, and `--check` refuses to write a city-year
whose median is below MIN_STATIONS without marking it `thin`.

**Coverage grew enormously, and the instrument changed underneath.** 2,910
city-days in 2015 against 87,746 in 2024. The first version of this script tried
to handle that with a "like-for-like" panel of the ten cities present in every
year, and that panel showed Poor-or-worse days falling from 26.3% of city-days
in 2015 to 8.3% in 2025. It is a compelling number and it is not usable.

Those same ten cities went from a median of **one** reporting station to six:
Agra 1 to 6, Kanpur 1 to 3, Varanasi 1 to 4, Faridabad 1 to 3, Navi Mumbai 1 to
6, Delhi 5 to 43. Holding the city list constant does not hold the measurement
constant. A city AQI aggregated over one station and the same city aggregated
over six are different instruments, so the series is a mix of changing air and
a changing sensor, and nothing here can separate them. Nor is there one city in
the panel that held still and can stand in for the rest: the steadiest of the
ten, Lucknow, still doubled from 3 stations to 6.

So **this file states no trend over time and the check refuses to let one in.**
What it can honestly answer is a question about a single year: how many days of
each official category a named city had, with the number of stations behind that
figure printed next to it.

**City names needed manual cleaning.** The source's own README calls it the
"Chihuahua problem": the same city spelled several ways across years. The
`_openrefined` file is the cleaned one and is the only one used here.

**Rebuilding this from a clone.** The 2026 half needs nothing: `--daily`
defaults to `data/raw/cpcb-bulletins-2026.csv.gz`, which is committed for
exactly that reason. The 2015-2025 half needs the UrbanEmissions CSV, which is
**not** committed, because it is that project's GPL-3.0 work and this repository
publishes only the derived summary. Fetch it:

    git clone --depth 1 https://github.com/urbanemissionsinfo/AQI_bulletins /tmp/aqib
    # then point --source at AllIndiaBulletinsMaster2025_openrefined.csv inside it

    python3 scripts/build-aqi-bulletins.py --source <path to that CSV>
    python3 scripts/build-aqi-bulletins.py --check
"""
import argparse
import csv
import gzip
import json
import re
import statistics
import sys
from collections import Counter, defaultdict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'data' / 'aqi-bulletins.json'

# India's AQI categories, worst last.
CATS = ['Good', 'Satisfactory', 'Moderate', 'Poor', 'Very Poor', 'Severe']
# Below this median, a city-year's figure is one or two monitors wearing a
# city's name; it is kept and flagged rather than dropped, because "nobody is
# measuring here" is itself the finding.
MIN_STATIONS = 3
# A city-year with fewer days than this cannot describe a year.
MIN_DAYS = 180
# Fraction of the calendar year the bulletin series must span before a year is
# treated as whole. 0.95 lets through a year missing a few days at an end (2025
# has no 1 January bulletin) and catches the two that are genuinely truncated,
# 2015 from May and the current year.
COVERAGE_FULL = 0.95

SOURCE = ('Central Pollution Control Board daily AQI bulletins. 2015-2025 is '
          'parsed from the published PDFs by UrbanEmissions.Info '
          '(github.com/urbanemissionsinfo/AQI_bulletins), whose archive ends '
          'there; 2026 is parsed from the same PDFs by JanVayu, with '
          'scripts/fetch-cpcb-bulletin.py. The bulletins are Government of '
          'India publications; the 2015-2025 parsing and city-name cleaning are '
          'that project\'s work and are credited here. On three 2025 days '
          'checked city by city the two extractions agree on the AQI and the '
          'station count for every city they share, 671 of 671. JanVayu '
          'publishes only this derived summary, not the source table.')

# ── Joining our own 2026 parse onto somebody else's 2015-2025 extraction ──
#
# The two disagree about spelling, not about facts. Case and whitespace folding
# takes 588 raw 2026 strings to 304, of which 270 match a 2015-2025 city
# exactly. Everything below is what was left, decided one at a time. The silent
# failure this guards against is a city split across two spellings: each half
# then shows a plausible count and nothing errors.
#
# Checked against near-spellings before being called new: Khairthal is not
# Kaithal, Khora is not Korba, Nellore is not Vellore.
ALIAS = {
    # One word in the 2015-2025 extraction, two in CPCB's 2026 tables. Same
    # city in Haryana, 238 days of 2026. The only alias in the whole join.
    'yamuna nagar': 'Yamunanagar',
}

# Rows that cannot be attributed, and so are dropped rather than guessed. The
# count of dropped rows is reported in _meta and asserted by --check, because a
# silent drop is the thing this file exists to avoid.
UNRESOLVED = {
    # On 2026-07-10 alone CPCB wrote "Aurangabad" with no state qualifier,
    # against "Aurangabad (Bihar)" and "Aurangabad (Maharashtra)" in every
    # other table. That day's serials run 1..238 with no gap, so nothing was
    # lost in parsing: the source itself is inconsistent. The row's 3/3 station
    # count matches Maharashtra, which is evidence and not proof, and it is one
    # row in 62,851.
    'aurangabad': 'no state qualifier, against two disambiguated entries every other day',
}


def daily_rows(daily_dir):
    """Our own parse of CPCB's PDFs: one JSON per day, newest years.

    `no_stations` in the 2015-2025 CSV is the count of stations that REPORTED,
    not the count a city has. Measured, not assumed: on 2025-06-10, 2025-07-15
    and 2025-08-20 the CSV's `no_stations` equals our `stations_participated`
    for all 671 shared city-days and never equals `stations_total` (185, 185,
    200 of them). Taking the wrong field would change what "median stations"
    means at the 2025/2026 boundary, invisibly, and make the join a lie.
    """
    out, names = [], defaultdict(Counter)
    src = Path(daily_dir)

    def keep(day, city, cat, st):
        city = ' '.join((city or '').split())
        if not city or cat not in CATS:
            return
        names[city.casefold()][city] += 1
        out.append((day, city, cat, int(st or 0)))

    if src.is_dir():
        # A fetch still on disk, one JSON per day.
        for f in sorted(src.glob('*.json')):
            day = json.loads(f.read_text(encoding='utf-8'))
            for r in day.get('rows', []):
                keep(day['date'], r.get('city'), r.get('aqi_category'),
                     r.get('stations_participated'))
    else:
        # The archive committed to the repo. This is the path that matters:
        # the day files live in a scratch directory that does not survive the
        # session, so without it nobody could rebuild this file from a clone.
        with gzip.open(src, 'rt', encoding='utf-8') as fh:
            for r in csv.DictReader(fh):
                keep(r['date'], r.get('city'), r.get('aqi_category'),
                     r.get('stations_participated'))
    return out, names


def canonical(fold, names, known):
    """The spelling this city is filed under, or None to drop the row."""
    if fold in UNRESOLVED:
        return None
    if fold in ALIAS:
        return ALIAS[fold]
    if fold in known:
        return known[fold]
    # A city new to the file. CPCB lowercases whole tables on some days, so
    # prefer the variant carrying the most capitals, then the commonest.
    seen = names[fold]
    return max(seen, key=lambda v: (sum(ch.isupper() for ch in v), seen[v]))


def build(src, daily=None):
    rows = list(csv.DictReader(open(src, encoding='utf-8', errors='replace')))
    per = defaultdict(lambda: defaultdict(list))
    span = defaultdict(lambda: [None, None])

    def note(day, city, cat, st):
        y = day[:4]
        per[city][y].append((cat, st))
        lo, hi = span[y]
        span[y] = [day if lo is None or day < lo else lo,
                   day if hi is None or day > hi else hi]

    for r in rows:
        d, city, cat = r.get('date', ''), (r.get('city') or '').strip(), (r.get('aqi_category') or '').strip()
        if len(d) < 10 or not city or cat not in CATS:
            continue
        try:
            st = int(float(r.get('no_stations') or 0))
        except ValueError:
            st = 0
        note(d[:10], city, cat, st)

    dropped = Counter()
    if daily:
        known = {c.casefold(): c for c in per}
        drows, names = daily_rows(daily)
        for day, city, cat, st in drows:
            name = canonical(city.casefold(), names, known)
            if name is None:
                dropped[city.casefold()] += 1
                continue
            note(day, name, cat, st)

    cities = {}
    for city, years in sorted(per.items()):
        out_years = {}
        for y, days in sorted(years.items()):
            if len(days) < MIN_DAYS:
                continue
            counts = {c: 0 for c in CATS}
            for cat, _ in days:
                counts[cat] += 1
            stations = [s for _, s in days if s > 0]
            med = int(statistics.median(stations)) if stations else 0
            out_years[y] = {
                'days': len(days),
                'by_category': counts,
                'poor_or_worse': counts['Poor'] + counts['Very Poor'] + counts['Severe'],
                'severe': counts['Severe'],
                'median_stations': med,
                'thin': med < MIN_STATIONS,
            }
        if out_years:
            cities[city] = out_years

    years_all = sorted({y for c in cities.values() for y in c})
    national = {}
    for y in years_all:
        present = [c for c in cities if y in cities[c]]
        lo, hi = span[y]
        # A year the bulletin did not cover end to end. Both ends of this file
        # are short: CPCB's first bulletin is 2015-05-01 and the current year
        # runs to whenever it was last fetched. Counting days in each category
        # across an unequal number of reported days is exactly the comparison
        # that put "136 Poor-or-worse days in 2015, 157 in 2024" into a
        # changelog as if it showed no change; as rates those are 58% and 43%.
        #
        # Measured, not asserted, and NOT "the span reaches both ends": by that
        # rule 2025 came out partial because CPCB published nothing on 1 January,
        # which would have put a warning on a year holding 79,356 city-days from
        # 246 cities. `coverage` is published beside the flag so a reader can
        # apply their own threshold instead of trusting COVERAGE_FULL.
        first = date(int(y), 1, 1)
        last = date(int(y), 12, 31)
        held = (date.fromisoformat(hi) - date.fromisoformat(lo)).days + 1 if lo and hi else 0
        coverage = round(held / ((last - first).days + 1), 3)
        national[y] = {
            'cities': len(present),
            'city_days': sum(cities[c][y]['days'] for c in present),
            'severe_days': sum(cities[c][y]['severe'] for c in present),
            'poor_or_worse_days': sum(cities[c][y]['poor_or_worse'] for c in present),
            'thin_cities': sum(1 for c in present if cities[c][y]['thin']),
            'first_day': lo,
            'last_day': hi,
            'coverage': coverage,
            'partial': coverage < COVERAGE_FULL,
        }

    # How much the instrument moved under each city present throughout. This
    # replaced a like-for-like TREND, which the station growth made unusable.
    panel = sorted(c for c in cities if all(y in cities[c] for y in years_all))
    stability = {}
    for c in panel:
        meds = [cities[c][y]['median_stations'] for y in years_all]
        stability[c] = {
            'first': meds[0], 'last': meds[-1],
            'grew_by': round(meds[-1] / meds[0], 1) if meds[0] else None,
            'thin_years': sum(1 for y in years_all if cities[c][y]['thin']),
        }

    # The no_trend note quotes figures about this panel. Derive them, because an
    # earlier hardcoded version of this sentence read "Delhi, the only city never
    # thin, shows no trend across the window" and both halves were false: three
    # panel cities are never thin, and Delhi's own station count grew 7.4x, the
    # second-largest growth in the panel. The claim survived only because nothing
    # recomputed it and nothing displayed it.
    med_first = int(statistics.median([v['first'] for v in stability.values()])) if stability else 0
    med_last = int(statistics.median([v['last'] for v in stability.values()])) if stability else 0
    steady = min(stability.items(), key=lambda kv: kv[1]['grew_by'] or 1e9) if stability else None

    return {
        '_meta': {
            'what': ('Days in each official AQI category, by city and year, from CPCB\'s '
                     'own daily bulletins.'),
            'window': f'{years_all[0]}-{years_all[-1]}',
            'source': SOURCE,
            'categories': CATS,
            'inclusion': f'a city-year needs at least {MIN_DAYS} reported days',
            'thin_rule': (f'a city-year whose median reporting station count is below '
                          f'{MIN_STATIONS} is marked thin: an AQI from one or two monitors '
                          f'is a reading from one place with a city\'s name on it'),
            'no_annual_mean': ('Deliberately absent. AQI is a unitless index reporting only '
                               'whichever of six pollutants scores worst, and averaging an '
                               'index over a year is not a quantity. Counting days in each '
                               'category is the legitimate use of a daily index, and it is '
                               'what GRAP and school closures are triggered by.'),
            'no_trend': ('Deliberately absent, and the check refuses to let one in. '
                         f'Reporting coverage grew from {national[years_all[0]]["cities"]} '
                         f'cities to {national[years_all[-1]]["cities"]}, and the stations '
                         f'behind each city grew with it: the {len(panel)} cities present '
                         f'throughout went from a median of {med_first} station'
                         f'{"" if med_first == 1 else "s"} to {med_last}. '
                         'Holding the city list constant does not hold the measurement '
                         'constant, so a fall in Poor-or-worse days across this window '
                         'cannot be separated from a change in what was doing the measuring. '
                         'Nor is there a single city here whose instrument stayed still: the '
                         f'steadiest of the {len(panel)}, {steady[0]}, still went from '
                         f'{steady[1]["first"]} stations to {steady[1]["last"]}. '
                         'Read a single year, not a series.'),
            'coverage_warning': ('Every figure here is per city and per year. See '
                                 'station_stability for how much the instrument moved under '
                                 'the cities that reported throughout.'),
            'cities': len(cities),
            'reported_throughout': len(panel),
            'partial_years': [y for y in years_all if national[y]['partial']],
            'partial_note': ('A partial year reported fewer days than the calendar '
                             'holds, so its category counts are not comparable with a '
                             'full year\'s as counts. CPCB\'s first bulletin is '
                             '1 May 2015 and the current year runs to the last fetch.'),
            'unresolved_rows_dropped': {k: dropped[k] for k in sorted(dropped)},
            'unresolved_note': ('Rows whose city could not be attributed, dropped '
                                'rather than guessed. The reason for each is in '
                                'UNRESOLVED in scripts/build-aqi-bulletins.py.'),
        },
        'national': national,
        'station_stability': stability,
        'cities': cities,
    }


def check():
    if not OUT.exists():
        print(f'FAIL - {OUT.relative_to(ROOT)} is missing'); return 1
    d = json.loads(OUT.read_text(encoding='utf-8'))
    m, cities, errs = d.get('_meta', {}), d.get('cities', {}), []
    for k in ('what', 'window', 'source', 'categories', 'inclusion', 'thin_rule',
              'no_annual_mean', 'no_trend', 'coverage_warning'):
        if k not in m:
            errs.append(f'_meta.{k} missing')
    if 'UrbanEmissions' not in m.get('source', '') or 'Central Pollution Control Board' not in m.get('source', ''):
        errs.append('_meta.source must credit both CPCB and the parsing project')
    if m.get('cities') != len(cities):
        errs.append(f"_meta.cities says {m.get('cities')}, file carries {len(cities)}")
    for city, years in cities.items():
        for y, v in years.items():
            if sum(v['by_category'].values()) != v['days']:
                errs.append(f'{city} {y}: category counts do not sum to days')
            if v['poor_or_worse'] != v['by_category']['Poor'] + v['by_category']['Very Poor'] + v['by_category']['Severe']:
                errs.append(f'{city} {y}: poor_or_worse does not match its parts')
            if v['days'] < MIN_DAYS:
                errs.append(f'{city} {y}: {v["days"]} days is below the stated floor')
            if v['thin'] != (v['median_stations'] < MIN_STATIONS):
                errs.append(f'{city} {y}: thin flag disagrees with median_stations')
    for y, n in d.get('national', {}).items():
        got = sum(1 for c in cities if y in cities[c])
        if n['cities'] != got:
            errs.append(f'national {y}: says {n["cities"]} cities, records give {got}')
        tot = sum(cities[c][y]['severe'] for c in cities if y in cities[c])
        if n['severe_days'] != tot:
            errs.append(f'national {y}: severe_days {n["severe_days"]} against {tot} recounted')
    # Every number _meta.no_trend quotes must still be true of the file that
    # carries it. The sentence it replaced claimed Delhi was "the only city never
    # thin" and showed no trend; three panel cities are never thin and Delhi's
    # own station count grew 7.4x. Nothing recomputed it and nothing displayed
    # it, so it sat in the file for two releases. Prose that quotes a figure is
    # a claim, and a claim gets a check.
    ss, nat = d.get('station_stability', {}), d.get('national', {})
    note = m.get('no_trend', '')
    if ss and nat:
        # Phrase level, not substring. A first attempt asked only whether each
        # number appeared somewhere in the paragraph, and a panel size drifted
        # from 10 to 12 still passed, because "10" was present in a different
        # clause. The figure has to be checked where it is actually claimed.
        ys = sorted(nat)
        mf = int(statistics.median([v['first'] for v in ss.values()]))
        ml = int(statistics.median([v['last'] for v in ss.values()]))
        steady = min(ss.items(), key=lambda kv: kv[1]['grew_by'] or 1e9)
        for phrase, what in [
            (f"grew from {nat[ys[0]]['cities']} cities to {nat[ys[-1]]['cities']}", 'coverage growth'),
            (f'the {len(ss)} cities present throughout', 'panel size'),
            (f"a median of {mf} station{'' if mf == 1 else 's'} to {ml}", 'median station growth'),
            (f'the steadiest of the {len(ss)}, {steady[0]}, still went from '
             f"{steady[1]['first']} stations to {steady[1]['last']}", 'steadiest city'),
        ]:
            if phrase not in note:
                errs.append(f'_meta.no_trend does not state the {what}: expected "{phrase}"')
        if m.get('reported_throughout') != len(ss):
            errs.append(f"_meta.reported_throughout says {m.get('reported_throughout')}, "
                        f'station_stability carries {len(ss)}')

    # The docstring at the top of this file quotes the same panel figures, and
    # it drifted too: it said "Navi Mumbai 1 to 6" when first-to-last is 1 to 5
    # (the city peaked at 6 in 2024 and reports 5 now). A figure in a comment is
    # still a figure, so it is checked against the data it describes.
    doc = __doc__ or ''
    for city, v in ss.items():
        # not `m`: that name holds _meta here, and shadowing it made the PASS
        # line raise IndexError instead of printing.
        hit = re.search(re.escape(city) + r'\s+(\d+)\s+to\s*\n?\s*(\d+)', doc)
        if hit and (int(hit.group(1)), int(hit.group(2))) != (v['first'], v['last']):
            errs.append(f"docstring says {city} {hit.group(1)} to {hit.group(2)}, "
                        f"data gives {v['first']} to {v['last']}")

    # The 2026 join: every claim it rests on, recomputed.
    nat_all = d.get('national', {})
    for y, n in nat_all.items():
        lo, hi = n.get('first_day'), n.get('last_day')
        if not (lo and hi) or lo[:4] != y or hi[:4] != y:
            errs.append(f'national {y}: span {lo}..{hi} does not sit inside the year')
            continue
        held = (date.fromisoformat(hi) - date.fromisoformat(lo)).days + 1
        want = round(held / ((date(int(y), 12, 31) - date(int(y), 1, 1)).days + 1), 3)
        if abs(n.get('coverage', -1) - want) > 0.0015:
            errs.append(f'national {y}: coverage {n.get("coverage")} against {want} recomputed')
        if n.get('partial') != (want < COVERAGE_FULL):
            errs.append(f'national {y}: partial={n.get("partial")} disagrees with coverage {want}')
    listed = sorted(m.get('partial_years', []))
    real = sorted(y for y, n in nat_all.items() if n.get('partial'))
    if listed != real:
        errs.append(f'_meta.partial_years {listed} against {real} recomputed')
    # A city filed under two spellings is the failure this join can produce
    # without erroring, so it is checked rather than trusted: no two city keys
    # may differ only by case, whitespace or punctuation.
    squashed = defaultdict(list)
    for c in cities:
        squashed[re.sub(r'[^a-z0-9]', '', c.casefold())].append(c)
    for k, v in squashed.items():
        if len(v) > 1:
            errs.append(f'the same city is filed under {v}; one spelling, or an ALIAS entry')
    # An alias must not also exist as its own city, or the split it prevents is
    # back with an extra step.
    for fold, target in ALIAS.items():
        if target not in cities:
            errs.append(f'ALIAS points {fold!r} at {target!r}, which is not a city in the file')
        for c in cities:
            if c.casefold() == fold:
                errs.append(f'{fold!r} is aliased to {target!r} and still present as {c!r}')

    # Two things must never creep back in. An annual mean AQI contradicts the
    # site's own rule about averaging an index; a cross-year aggregate invites
    # the trend reading that the station growth makes unusable.
    # Structural, not a string scan of the prose: an earlier version of this
    # check searched the serialised file for the word "trend" and fired on
    # _meta.no_trend, which is the note explaining why there isn't one.
    def numeric_keys(o):
        out = set()
        if isinstance(o, dict):
            for k, v in o.items():
                if isinstance(v, (int, float)) and not isinstance(v, bool):
                    out.add(k)
                out |= numeric_keys(v)
        elif isinstance(o, list):
            for v in o:
                out |= numeric_keys(v)
        return out

    banned = {'mean_aqi', 'avg_aqi', 'average_aqi', 'annual_aqi'}
    found = numeric_keys(d) & banned
    if found:
        errs.append(f'annual mean AQI present as {sorted(found)}; see _meta.no_annual_mean')
    if 'like_for_like' in d:
        errs.append('a like_for_like cross-year block is present; see _meta.no_trend')
    if not d.get('station_stability'):
        errs.append('station_stability is missing; it is what shows the instrument moved')
    if errs:
        print('FAIL -'); [print('  ' + e) for e in errs[:20]]; return 1
    print(f'PASS - {len(cities)} cities, {m["window"]}, category counts recomputed from '
          f'the records; no annual mean AQI and no cross-year trend present.')
    return 0


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--source')
    ap.add_argument('--daily', default=str(ROOT / 'data' / 'raw' / 'cpcb-bulletins-2026.csv.gz'),
                    help='the committed archive, or a directory of per-day JSON '
                         'from fetch-cpcb-bulletin.py (default: the archive)')
    ap.add_argument('--check', action='store_true')
    a = ap.parse_args()
    if a.check:
        sys.exit(check())
    if not a.source:
        print('need --source <AllIndiaBulletinsMaster2025_openrefined.csv>'); sys.exit(2)
    data = build(a.source, a.daily)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f'wrote {OUT.relative_to(ROOT)}: {data["_meta"]["cities"]} cities, '
          f'{data["_meta"]["window"]}, {data["_meta"]["reported_throughout"]} reported throughout')
