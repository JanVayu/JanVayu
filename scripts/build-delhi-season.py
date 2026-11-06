#!/usr/bin/env python3
"""Delhi's autumn season against past autumns, from CPCB's daily AQI bulletin.

Two charts for the Delhi page, written between the `season:start` and
`season:end` markers in delhi/index.html, with their data in
data/delhi-season.json:

  1. A strip of this season's days, one cell each, coloured by CPCB category,
     with the count of days in each category.
  2. This season's daily AQI against the middle half of the autumns from 2019
     to 2025, by calendar date, 1 October to 30 November.

Why 2019 to 2025 and not the whole archive
------------------------------------------
Delhi's bulletin rested on a median of 5 stations in 2016 and 28 in 2018, and
on 33 to 37 from 2019 to 2025 (data/aqi-bulletins.json, station_stability).
The site declines to draw a trend through a network that changed that much, so
the comparison band uses only the years after it settled, says so on the page,
and shows 2026's own 44 stations beside it. Seven past years is a small
sample, and the page gives the count.

No average AQI is computed. The band is the median and the 25th to 75th
percentile of the daily official figure, taken date by date.

    python3 scripts/build-delhi-season.py --source /tmp/aqib/data/Processed/AllIndiaBulletinsMaster2025_openrefined.csv
    python3 scripts/build-delhi-season.py --check        # offline: data, and the page block against the data
"""
import argparse, csv, gzip, json, statistics, sys
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'data' / 'delhi-season.json'
PAGE = ROOT / 'delhi' / 'index.html'
CSV26 = ROOT / 'data' / 'raw' / 'cpcb-bulletins-2026.csv.gz'
START = date(2026, 10, 1)
END = date(2026, 11, 30)
PAST_YEARS = list(range(2019, 2026))
CATS = ['Good', 'Satisfactory', 'Moderate', 'Poor', 'Very Poor', 'Severe']
# Fixed colours on the light card (.jv-dgm is #fbfaf7 in both themes). Each is at
# least 3:1 against it, which scripts/build-delhi-season.py --check measures.
COLOUR = {'Good': '#15803d', 'Satisfactory': '#4d7c0f', 'Moderate': '#a16207',
          'Poor': '#c2410c', 'Very Poor': '#b91c1c', 'Severe': '#7f1d1d'}
INK, MUTED, PAPER = '#1f2a24', '#4b5a50', '#fbfaf7'
FONT = 'font-family="Inter, system-ui, sans-serif"'
DIWALI_2026 = date(2026, 11, 8)
M, E = '<!-- season:start -->', '<!-- season:end -->'


def cat_of(aqi):
    return ('Good' if aqi <= 50 else 'Satisfactory' if aqi <= 100 else 'Moderate' if aqi <= 200
            else 'Poor' if aqi <= 300 else 'Very Poor' if aqi <= 400 else 'Severe')


def lum(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    c = [x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def ratio(a, b):
    la, lb = sorted([lum(a), lum(b)], reverse=True)
    return (la + 0.05) / (lb + 0.05)


def days():
    d = START
    while d <= END:
        yield d
        d += timedelta(days=1)


def build(src):
    past = {y: {} for y in PAST_YEARS}
    for r in csv.DictReader(open(src, encoding='utf-8', errors='replace')):
        if (r.get('city') or '').strip() != 'Delhi':
            continue
        day = (r.get('date') or '')[:10]
        if len(day) < 10 or not day[:4].isdigit() or int(day[:4]) not in PAST_YEARS or day[5:7] not in ('10', '11'):
            continue
        try:
            past[int(day[:4])].setdefault(day, int(float(r['aqi'])))
        except (ValueError, KeyError):
            continue
    band = {}
    for d in days():
        md = d.strftime('%m-%d')
        vals = [past[y][f'{y}-{md}'] for y in PAST_YEARS if f'{y}-{md}' in past[y]]
        if len(vals) >= 5:
            q = statistics.quantiles(vals, n=4, method='inclusive')
            band[md] = {'n': len(vals), 'q25': round(q[0]), 'median': round(statistics.median(vals)), 'q75': round(q[2])}
    this, stations = {}, []
    with gzip.open(CSV26, 'rt', newline='') as f:
        for r in csv.DictReader(f):
            if r['city'].strip().lower() != 'delhi':
                continue
            if START.isoformat() <= r['date'] <= END.isoformat() and r['date'] not in this:
                this[r['date']] = {'aqi': int(r['aqi']), 'category': r['aqi_category'],
                                   'stations': int(r['stations_participated'])}
    counts = {c: sum(1 for v in this.values() if v['category'] == c) for c in CATS}
    return {
        '_meta': {
            'what': "Delhi's official daily AQI for this autumn, against the middle half of the autumns of 2019 to 2025, by calendar date.",
            'source': 'CPCB daily AQI bulletins. 2019-2025 from the UrbanEmissions.Info extraction '
                      '(github.com/urbanemissionsinfo/AQI_bulletins); 2026 from data/raw/cpcb-bulletins-2026.csv.gz. '
                      'Built by scripts/build-delhi-season.py.',
            'past_years': f'{PAST_YEARS[0]}-{PAST_YEARS[-1]}',
            'why_these_years': "Delhi's bulletin rested on a median of 5 stations in 2016 and 28 in 2018, and 33 to 37 from 2019 to 2025. "
                               'Earlier years are left out so the band does not compare two different networks.',
            'no_mean': 'No average AQI. The band is the median and the 25th to 75th percentile of the daily figure, date by date.',
            'min_years_per_date': 5,
        },
        'window': [START.isoformat(), END.isoformat()],
        'diwali_2026': DIWALI_2026.isoformat(),
        'stations_2026_median': int(statistics.median(v['stations'] for v in this.values())),
        'counts': counts,
        'this_season': this,
        'past': band,
    }


# ---------------------------------------------------------------- drawing

def strip_svg(d):
    x0, w, y0, h = 14, 392, 52, 30
    n = (END - START).days + 1
    cw = w / n
    s = f'<text x="14" y="20" {FONT} font-size="15" font-weight="700" fill="{INK}">Delhi, each day since 1 October</text>'
    for i, day in enumerate(days()):
        x = x0 + i * cw
        v = d['this_season'].get(day.isoformat())
        if v:
            s += f'<rect x="{x:.2f}" y="{y0}" width="{cw - 0.8:.2f}" height="{h}" fill="{COLOUR[v["category"]]}"/>'
        else:
            s += f'<rect x="{x + 0.4:.2f}" y="{y0 + 0.5}" width="{cw - 1.6:.2f}" height="{h - 1}" fill="none" stroke="#9aa59d" stroke-width="0.8"/>'
    di = (DIWALI_2026 - START).days
    dx = x0 + di * cw + cw / 2
    s += f'<line x1="{dx:.1f}" y1="{y0 - 6}" x2="{dx:.1f}" y2="{y0 + h + 4}" stroke="{INK}" stroke-width="1.2"/>'
    s += f'<text x="{dx:.1f}" y="{y0 - 10}" text-anchor="middle" {FONT} font-size="12" font-weight="700" fill="{INK}">Diwali, 8 Nov</text>'
    for label, day in (('1 Oct', date(2026, 10, 1)), ('1 Nov', date(2026, 11, 1)), ('30 Nov', date(2026, 11, 30))):
        x = x0 + (day - START).days * cw
        anchor = 'start' if label == '1 Oct' else 'end' if label == '30 Nov' else 'middle'
        s += f'<text x="{x + (cw / 2 if anchor == "middle" else 0):.1f}" y="{y0 + h + 18}" text-anchor="{anchor}" {FONT} font-size="12" fill="{MUTED}">{label}</text>'
    lx = 14
    for c in ('Satisfactory', 'Moderate', 'Poor', 'Very Poor'):
        n_c = d['counts'][c]
        s += f'<rect x="{lx}" y="{y0 + h + 34}" width="11" height="11" fill="{COLOUR[c]}"/>'
        s += f'<text x="{lx + 16}" y="{y0 + h + 44}" {FONT} font-size="12.5" fill="{INK}">{c} <tspan font-weight="700">{n_c}</tspan></text>'
        lx += 24 + len(c) * 6.4 + 22
    return s, (420, 150)


def line_svg(d):
    L, R, T, B = 40, 410, 34, 256
    n = (END - START).days
    X = lambda i: L + (R - L) * i / n
    Y = lambda v: B - (B - T) * min(v, 500) / 500
    s = f'<text x="14" y="20" {FONT} font-size="15" font-weight="700" fill="{INK}">Delhi daily AQI against past autumns</text>'
    for g in (100, 200, 300, 400, 500):
        s += f'<line x1="{L}" y1="{Y(g):.1f}" x2="{R}" y2="{Y(g):.1f}" stroke="#d8d6cc" stroke-width="1"/>'
        s += f'<text x="{L - 5}" y="{Y(g) + 4:.1f}" text-anchor="end" {FONT} font-size="11.5" fill="{MUTED}">{g}</text>'
    s += f'<line x1="{L}" y1="{B}" x2="{R}" y2="{B}" stroke="{MUTED}" stroke-width="1"/>'
    pts = [(i, d['past'][day.strftime('%m-%d')]) for i, day in enumerate(days()) if day.strftime('%m-%d') in d['past']]
    up = ' '.join(f'{X(i):.1f},{Y(p["q75"]):.1f}' for i, p in pts)
    dn = ' '.join(f'{X(i):.1f},{Y(p["q25"]):.1f}' for i, p in reversed(pts))
    s += f'<polygon points="{up} {dn}" fill="#cfd6d0" opacity="0.9"/>'
    s += '<polyline fill="none" stroke="#5b6b60" stroke-width="1.6" stroke-dasharray="4 3" points="' + \
         ' '.join(f'{X(i):.1f},{Y(p["median"]):.1f}' for i, p in pts) + '"/>'
    cur = [(i, d['this_season'][day.isoformat()]['aqi']) for i, day in enumerate(days()) if day.isoformat() in d['this_season']]
    s += f'<polyline fill="none" stroke="{COLOUR["Very Poor"]}" stroke-width="2.6" stroke-linejoin="round" points="' + \
         ' '.join(f'{X(i):.1f},{Y(v):.1f}' for i, v in cur) + '"/>'
    li, lv = cur[-1]
    s += f'<circle cx="{X(li):.1f}" cy="{Y(lv):.1f}" r="3.6" fill="{COLOUR["Very Poor"]}"/>'
    s += f'<text x="{X(li) - 6:.1f}" y="{Y(lv) - 9:.1f}" text-anchor="end" {FONT} font-size="12.5" font-weight="700" fill="{COLOUR["Very Poor"]}">2026: {lv} on 5 Nov</text>'
    dx = X((DIWALI_2026 - START).days)
    s += f'<line x1="{dx:.1f}" y1="{T}" x2="{dx:.1f}" y2="{B}" stroke="{INK}" stroke-width="1" stroke-dasharray="2 3"/>'
    s += f'<text x="{dx + 4:.1f}" y="{T + 11}" {FONT} font-size="11.5" font-weight="700" fill="{INK}">Diwali 2026</text>'
    s += f'<text x="{L}" y="{B + 36}" {FONT} font-size="11.5" fill="{MUTED}">Dashed: middle of 2019 to 2025. Grey: middle half.</text>'
    for label, day in (('1 Oct', date(2026, 10, 1)), ('15 Oct', date(2026, 10, 15)), ('1 Nov', date(2026, 11, 1)), ('15 Nov', date(2026, 11, 15)), ('30 Nov', date(2026, 11, 30))):
        x = X((day - START).days)
        anchor = 'start' if label == '1 Oct' else 'end' if label == '30 Nov' else 'middle'
        s += f'<text x="{x:.1f}" y="{B + 17}" text-anchor="{anchor}" {FONT} font-size="12" fill="{MUTED}">{label}</text>'
    return s, (420, 296)


def wrap(inner, vb, label):
    return f'<div class="jv-dgm"><svg viewBox="0 0 {vb[0]} {vb[1]}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="{label}">{inner}</svg></div>'


def fmt_day(day):
    return f'{day.day} {day.strftime("%b")}'


def fmt_long(day):
    return f'{day.day} {day.strftime("%B")}'


def ranges(ds):
    """1 to 7 October and 9 October, from a sorted list of dates."""
    if not ds:
        return 'none'
    runs, cur = [], [ds[0]]
    for x in ds[1:]:
        if (x - cur[-1]).days == 1:
            cur.append(x)
        else:
            runs.append(cur)
            cur = [x]
    runs.append(cur)
    out = []
    for r in runs:
        if len(r) == 1:
            out.append(fmt_long(r[0]))
        else:
            a, b = r[0], r[-1]
            out.append(f'{a.day} to {fmt_long(b)}' if a.month == b.month else f'{fmt_long(a)} to {fmt_long(b)}')
    return ', '.join(out[:-1]) + (' and ' if len(out) > 1 else '') + out[-1]


def block(d):
    c = d['counts']
    total = sum(c.values())
    last = max(d['this_season'])
    ld = date.fromisoformat(last)
    strip, vb1 = strip_svg(d)
    line, vb2 = line_svg(d)
    cmp_days = [dd for dd in days() if dd.isoformat() in d['this_season'] and dd.strftime('%m-%d') in d['past']]
    below = sum(1 for dd in cmp_days if d['this_season'][dd.isoformat()]['aqi'] < d['past'][dd.strftime('%m-%d')]['median'])
    compared = len(cmp_days)
    not_below = [dd for dd in cmp_days if d['this_season'][dd.isoformat()]['aqi'] >= d['past'][dd.strftime('%m-%d')]['median']]
    nb = ranges(not_below)
    rows1 = ''.join(f'<tr><td class="when">{fmt_day(date.fromisoformat(k))}</td><td class="num">{v["aqi"]}</td><td>{v["category"]}</td></tr>'
                    for k, v in sorted(d['this_season'].items()))
    rows2 = ''
    for dd in days():
        md = dd.strftime('%m-%d')
        p = d['past'].get(md)
        v = d['this_season'].get(dd.isoformat())
        rows2 += (f'<tr><td class="when">{fmt_day(dd)}</td><td class="num">{v["aqi"] if v else ""}</td>'
                  f'<td class="num">{p["median"] if p else ""}</td><td class="num">{str(p["q25"]) + " to " + str(p["q75"]) if p else ""}</td></tr>')
    cc = ', '.join(f'{c[k]} {k}' for k in ('Very Poor', 'Poor', 'Moderate', 'Satisfactory') if c[k]) + (f', {c["Good"]} Good' if c['Good'] else '')
    return f'''{M}
  <h3>This season, day by day</h3>
  <p>From 1 October to {fmt_long(ld)} CPCB's bulletin rated Delhi on {total} days: {cc}. The bulletin's own figure for the day is a 24-hour reading to 4pm. Diwali falls on 8 November this year.</p>
  {wrap(strip, vb1, f"Strip of Delhi's {total} bulletin days from 1 October to {fmt_long(ld)} 2026, coloured by CPCB category: {cc}.")}
  <details><summary>Show the numbers</summary><div class="wrap"><table><thead><tr><th>Date</th><th>AQI</th><th>CPCB category</th></tr></thead><tbody>{rows1}</tbody></table></div></details>
  <h3>This season against past autumns</h3>
  <p>On {below} of the {compared} days we can compare, this season's figure was below the middle of the same calendar date in the autumns of 2019 to 2025. The days at or above that middle were {nb}. A comparison by date can differ from one that lines the years up by Diwali. Diwali is on 8 November this year, later than in several of those years, so the days before it fall in the stretch when past autumns were already close to their worst.</p>
  {wrap(line, vb2, f"Line chart of Delhi's daily AQI from 1 October to {fmt_long(ld)} 2026 against the middle and the middle half of the same dates in 2019 to 2025. The 2026 line sits below the middle for most of October and rises to {d['this_season'][last]['aqi']} on {fmt_long(ld)}.")}
  <details><summary>Show the numbers</summary><div class="wrap"><table><thead><tr><th>Date</th><th>2026</th><th>Middle, 2019 to 2025</th><th>Middle half</th></tr></thead><tbody>{rows2}</tbody></table></div></details>
  <p class="note"><strong>About these figures.</strong> The source is CPCB's daily AQI bulletin. The bands use 2019 to 2025 only: Delhi's bulletin rested on a median of 5 stations in 2016 and 28 in 2018, against 33 to 37 from 2019 to 2025 and a median of {d['stations_2026_median']} this autumn, so earlier years are left out. Seven years is a small sample. The AQI is an index of whichever pollutant scores worst, so no average is taken. A day with no bulletin is a gap and is never filled. A cell with an outline only has no bulletin yet.</p>
  {E}'''


# ------------------------------------------------------------------ checks

def check():
    errs = []
    d = json.loads(OUT.read_text(encoding='utf-8'))
    ts = d['this_season']
    if not ts:
        errs.append('no days for this season')
    for k, v in ts.items():
        if cat_of(v['aqi']) != v['category']:
            errs.append(f"{k}: AQI {v['aqi']} is not {v['category']} on CPCB's scale")
    if sum(d['counts'].values()) != len(ts):
        errs.append('category counts do not add up to the number of days')
    for md, p in d['past'].items():
        if not (p['q25'] <= p['median'] <= p['q75']) or p['n'] < d['_meta']['min_years_per_date']:
            errs.append(f'{md}: band is out of order or rests on too few years')
    if any(k in json.dumps(d) for k in ('"mean_aqi"', '"avg_aqi"', '"average_aqi"')):
        errs.append('an average AQI is present; see _meta.no_mean')
    for c, h in COLOUR.items():
        if ratio(h, PAPER) < 3.0:
            errs.append(f'{c} colour {h} is {ratio(h, PAPER):.2f}:1 on the card, under 3:1')
    page = PAGE.read_text(encoding='utf-8')
    if page.count(M) != 1 or page.count(E) != 1:
        errs.append('delhi/index.html needs exactly one season:start and season:end marker')
    else:
        have = page[page.index(M):page.index(E) + len(E)]
        if have != block(d):
            errs.append('the page block is stale: run python3 scripts/build-delhi-season.py --source <csv>')
    if errs:
        print('FAIL -')
        [print('  ' + e) for e in errs]
        return 1
    print(f"PASS - {len(ts)} days to {max(ts)}, {len(d['past'])} dates in the 2019-2025 band, "
          f"palette at least {min(ratio(h, PAPER) for h in COLOUR.values()):.1f}:1, page block current.")
    return 0


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--source', help='AllIndiaBulletinsMaster2025_openrefined.csv from urbanemissionsinfo/AQI_bulletins')
    ap.add_argument('--check', action='store_true')
    a = ap.parse_args()
    if a.check:
        sys.exit(check())
    if not a.source:
        sys.exit('need --source <AllIndiaBulletinsMaster2025_openrefined.csv>')
    data = build(a.source)
    OUT.write_text(json.dumps(data, indent=1, ensure_ascii=False) + '\n', encoding='utf-8')
    page = PAGE.read_text(encoding='utf-8')
    new = block(data)
    if M in page and E in page:
        page = page[:page.index(M)] + new + page[page.index(E) + len(E):]
    else:
        anchor = '<p>The year so far has been better than recent ones'
        if page.count(anchor) != 1:
            sys.exit('anchor paragraph not found in delhi/index.html')
        page = page.replace(anchor, new + '\n  ' + anchor)
    PAGE.write_text(page, encoding='utf-8')
    print(f'wrote {OUT.name} and the season block in delhi/index.html')
