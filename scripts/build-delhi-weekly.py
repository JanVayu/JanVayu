#!/usr/bin/env python3
"""Delhi's PM2.5 by week of the year, one line per winter, from CPCB monitors.

Why this exists. On 26 October 2026 CEEW published a chart of Delhi's weekly
PM2.5 averaged over 2023-26 and captioned it "Delhi's air pollution peaks twice
each winter": a first peak at the start of stubble burning (260 ug/m3) and a
second from winter biomass burning (247 ug/m3). An average over a few winters
can show two humps that no single winter has, so this draws every winter
separately and tests the claim winter by winter before anyone repeats it.

Source. The India Air Quality Database, XKDR Forum (https://airquality.xkdr.org,
CC BY 4.0), which carries CPCB's continuous monitoring record. Daily means per
station, Delhi, parameter PM2.5. JanVayu publishes only this derived weekly
summary, not the station table.

Method, and what each choice costs.

* A year here runs May to April, so a winter is not cut in two by 1 January.
  Weeks are 7-day blocks counted from 1 May (week 0 is 1 to 7 May). In a leap
  cycle the blocks after 29 February start a day later by the calendar; no
  claim here depends on them.
* A station-day counts only with at least 18 hourly values. A city-day is the
  mean of the station-day means and needs at least 10 stations. A week needs at
  least 5 such days. The network grew over the window (see `stations` in the
  output), so the level of an early week and a late week is not strictly like
  for like; the shape within a winter is.
* The weekly figure is a mean of daily means. CPCB's category breakpoints
  (60 for the 24-hour standard, 250 for Severe) are 24-hour values, so a weekly
  mean is read against them as a guide and is not an AQI day.
* A winter is "complete" only if every week from 16 October to 28 January
  (weeks 24 to 38) is present. Winter 2024-25 is not: XKDR has no CPCB data for
  January to March 2025, and its CPCB feed stops on 1 September 2025, so
  nothing after that exists to draw. It is shown to December and never counted.
* Early window, weeks 24 to 29 (16 Oct to 26 Nov). Late window, weeks 31 to 38
  (4 Dec to 28 Jan). Both fixed before the numbers were looked at in detail.
  For each complete winter the script records the highest week in each window
  and the lowest week between them.
* That trough proves less than it looks. A dip between two highs is what a
  noisy series does anyway, so `tests.shuffle` reshuffles each winter's own 15
  weekly values at random and counts how often a dip this deep appears. It
  does, most of the time. What the data can support is timing: the weeks in
  which the early and late peaks fall, winter after winter (`tests.timing`),
  and how far the average of the winters flattens the peak of a single winter.
* The bold line on the chart is the mean of the complete winters only. Winter
  2024-25 is drawn separately and does not enter any average.

    python3 scripts/build-delhi-weekly.py --fetch     # monthly pulls, cached
    python3 scripts/build-delhi-weekly.py             # data + both charts
    python3 scripts/build-delhi-weekly.py --check     # offline: data, charts
"""
import argparse
import csv
import datetime as dt
import json
import os
import random
import ssl
import sys
import urllib.request
from collections import defaultdict
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'data' / 'delhi-weekly.json'
CHARTS = ROOT / 'blog' / 'diagrams'
CACHE = Path(os.environ.get('JV_CACHE', '/tmp/jv-boundaries')) / 'delhi-weekly'

XKDR = 'https://airquality.xkdr.org/v1'
# XKDR's published demo key: public by design, rate-unlimited, 10,000 rows per
# request, which is why the pull is monthly. It is the same key
# build-station-observed.py carries. Set XKDR_API_KEY to use your own.
DEMO_KEY = 'aqi_demo_wbf92Qx21zX-Wa_Tg8Dx1nXe'
UA = 'Mozilla/5.0 (compatible; JanVayu/1.0; +https://janvayu.in)'

FIRST_YEAR, LAST_MONTH = 2018, (2025, 9)
MIN_HOURS, MIN_STATIONS, MIN_DAYS = 18, 10, 5
EARLY, LATE = range(24, 30), range(31, 39)
WINDOW_WEEKS = range(24, 39)
SHUFFLES, BOOTSTRAPS = 4000, 5000
NAAQS_24H, SEVERE = 60, 250

INK, MUTE, PAPER = '#1e2a22', '#5b6b60', '#fbfaf7'
GREEN, AMBER, RED, DARK = '#146c33', '#8a5300', '#b91c1c', '#7f1d1d'
BAND, GRID = '#d9e2dc', '#e4e1d8'
MONTHS = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr']


# ---------------------------------------------------------------- fetch

def opener():
    handlers = []
    proxy = os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy')
    if proxy:
        handlers.append(urllib.request.ProxyHandler({'https': proxy, 'http': proxy}))
    ca = os.environ.get('SSL_CERT_FILE') or '/root/.ccr/ca-bundle.crt'
    if os.path.exists(ca):
        handlers.append(urllib.request.HTTPSHandler(context=ssl.create_default_context(cafile=ca)))
    return urllib.request.build_opener(*handlers)


def months():
    y, m = FIRST_YEAR, 1
    while (y, m) <= LAST_MONTH:
        yield y, m
        y, m = (y + 1, 1) if m == 12 else (y, m + 1)


def fetch():
    key = os.environ.get('XKDR_API_KEY', DEMO_KEY)
    CACHE.mkdir(parents=True, exist_ok=True)
    op = opener()
    for y, m in months():
        f = CACHE / f'{y}-{m:02d}.csv'
        if f.exists() and f.stat().st_size > 0:
            continue
        end = (dt.date(y + (m == 12), m % 12 + 1, 1) - dt.timedelta(days=1)).isoformat()
        url = (f'{XKDR}/measurements?city=Delhi&parameter=PM2.5&start={y}-{m:02d}-01'
               f'&end={end}&agg=daily&format=csv')
        req = urllib.request.Request(url, headers={'User-Agent': UA, 'Authorization': f'Bearer {key}'})
        with op.open(req, timeout=180) as r:
            body = r.read().decode('utf-8')
        if body.count('\n') >= 10001:
            sys.exit(f'{y}-{m:02d} hit the 10,000-row cap; split the request')
        f.write_text(body, encoding='utf-8')
        print(f'  {y}-{m:02d}: {max(body.count(chr(10)) - 1, 0)} station-days')


# ---------------------------------------------------------------- build

def cycle_of(d):
    y = d.year if d.month >= 5 else d.year - 1
    return y, (d - dt.date(y, 5, 1)).days


def week_label(w):
    """Start date of week w in a non-leap cycle, for labels only."""
    return (dt.date(2023, 5, 1) + dt.timedelta(days=7 * w)).strftime('%-d %b')


def load_days():
    byday = defaultdict(list)
    for f in sorted(CACHE.glob('*.csv')):
        for r in csv.DictReader(open(f, encoding='utf-8')):
            if int(r['n']) >= MIN_HOURS:
                byday[dt.date.fromisoformat(r['period_start'][:10])].append(float(r['mean']))
    return {d: (sum(v) / len(v), len(v)) for d, v in byday.items() if len(v) >= MIN_STATIONS}


def peaks(weeks):
    """Early peak, trough between, late peak, for one complete winter."""
    mean = {w['w']: w['mean'] for w in weeks}
    if any(w not in mean for w in WINDOW_WEEKS):
        return None
    e = max(EARLY, key=lambda w: mean[w])
    l = max(LATE, key=lambda w: mean[w])
    t = min(range(e + 1, l), key=lambda w: mean[w]) if l - e > 1 else None
    out = {'early': {'week': e, 'start': week_label(e), 'mean': mean[e]},
           'late': {'week': l, 'start': week_label(l), 'mean': mean[l]},
           'weeks_over_severe': {'early': sum(mean[w] > SEVERE for w in EARLY),
                                 'late': sum(mean[w] > SEVERE for w in LATE)}}
    if t is None:
        out['trough'] = None
        out['dip'] = 0.0
    else:
        out['trough'] = {'week': t, 'start': week_label(t), 'mean': mean[t]}
        out['dip'] = round(1 - mean[t] / min(mean[e], mean[l]), 3)
    return out


def dip_of(mean):
    """Depth of the lowest week between the highest early and highest late week."""
    e = max(EARLY, key=lambda w: mean[w])
    l = max(LATE, key=lambda w: mean[w])
    if l - e < 2:
        return 0.0
    return 1 - min(mean[w] for w in range(e + 1, l)) / min(mean[e], mean[l])


def tests(done):
    """What the winters can and cannot support. Seeded, so --check can recompute it."""
    ser = [{w['w']: w['mean'] for w in c['weeks']} for c in done]
    rng = random.Random(1)
    null = []
    for m in ser:
        vals = [m[w] for w in WINDOW_WEEKS]
        for _ in range(SHUFFLES):
            rng.shuffle(vals)
            null.append(dip_of(dict(zip(WINDOW_WEEKS, vals))))
    null.sort()
    obs = [dip_of(m) for m in ser]
    rng = random.Random(7)
    boot = []
    for _ in range(BOOTSTRAPS):
        pick = [ser[rng.randrange(len(ser))] for _ in ser]
        boot.append(dip_of({w: sum(m[w] for m in pick) / len(pick) for w in WINDOW_WEEKS}))
    boot.sort()
    avg = {w: sum(m[w] for m in ser) / len(ser) for w in WINDOW_WEEKS}
    ep = [max(EARLY, key=lambda w: m[w]) for m in ser]
    lp = [max(LATE, key=lambda w: m[w]) for m in ser]
    return {
        'shuffle': {'what': "each winter's own weekly values (weeks 24 to 38) put in random order, then "
                            'the same dip measured',
                    'seed': 1, 'draws': len(null),
                    'observed_dip': [round(x, 3) for x in obs],
                    'observed_median': round(sorted(obs)[len(obs) // 2], 3),
                    'null_median': round(null[len(null) // 2], 3),
                    'null_share_at_least_30pct': round(sum(x >= 0.3 for x in null) / len(null), 3)},
        'bootstrap': {'what': 'resampling the winters with replacement, the dip in the average series',
                      'seed': 7, 'draws': len(boot),
                      'p5': round(boot[int(0.05 * len(boot))], 3),
                      'median': round(boot[len(boot) // 2], 3),
                      'p95': round(boot[int(0.95 * len(boot)) - 1], 3)},
        'timing': {'early_peak_weeks': ep, 'late_peak_weeks': lp,
                   'early_peak_starts': [week_label(w) for w in ep],
                   'late_peak_starts': [week_label(w) for w in lp]},
        'flattening': {'mean_of_winter_early_peaks': round(sum(m[w] for m, w in zip(ser, ep)) / len(ser), 1),
                       'mean_of_winter_late_peaks': round(sum(m[w] for m, w in zip(ser, lp)) / len(ser), 1),
                       'peak_of_average_early': round(max(avg[w] for w in EARLY), 1),
                       'peak_of_average_late': round(max(avg[w] for w in LATE), 1)},
    }


def build():
    days = load_days()
    wk = defaultdict(list)
    for d, (m, n) in days.items():
        y, i = cycle_of(d)
        if i // 7 < 52:
            wk[(y, i // 7)].append((m, n))
    cycles = []
    for y in range(FIRST_YEAR, 2025):
        weeks = []
        for w in range(52):
            x = wk.get((y, w), [])
            if len(x) >= MIN_DAYS:
                weeks.append({'w': w, 'mean': round(sum(a for a, _ in x) / len(x), 1), 'days': len(x),
                              'stations_min': min(n for _, n in x), 'stations_max': max(n for _, n in x)})
        if not weeks:
            continue
        have = {w['w'] for w in weeks}
        complete = all(w in have for w in WINDOW_WEEKS) and len(have) >= 40
        cycles.append({'label': f'{y}-{str(y + 1)[2:]}', 'start': f'{y}-05-01', 'complete': complete,
                       'weeks': weeks, 'peaks': peaks(weeks) if complete else None})
    avg = []
    for w in range(52):
        vals = [(c['label'], x['mean']) for c in cycles if c['complete'] for x in c['weeks'] if x['w'] == w]
        if vals:
            v = [b for _, b in vals]
            avg.append({'w': w, 'mean': round(sum(v) / len(v), 1), 'min': min(v), 'max': max(v),
                        'n_cycles': len(v)})
    done = [c for c in cycles if c['complete']]
    return {
        '_meta': {
            'what': 'Delhi weekly mean PM2.5 (ug/m3) from CPCB monitors, one series per May-to-April '
                    'year, with a per-winter test of whether the winter has two peaks.',
            'source': 'India Air Quality Database, XKDR Forum (https://airquality.xkdr.org), CC BY 4.0; '
                      'CPCB continuous monitoring network. Built by scripts/build-delhi-weekly.py.',
            'window': 'May 2018 to August 2025; the CPCB feed in the archive ends on 1 September 2025.',
            'weeks': 'seven-day blocks counted from 1 May; week 0 is 1 to 7 May',
            'rules': {'station_day_min_hours': MIN_HOURS, 'city_day_min_stations': MIN_STATIONS,
                      'week_min_days': MIN_DAYS, 'early_weeks': [EARLY[0], EARLY[-1]],
                      'late_weeks': [LATE[0], LATE[-1]]},
            'complete_means': 'every week from 16 October to 28 January present (weeks 24 to 38)',
            'not_aqi': 'A weekly mean read against CPCB 24-hour breakpoints is a guide, not an AQI day.',
            'gap': 'No CPCB data in the archive for January to March 2025, so winter 2024-25 is never '
                   'counted and is drawn to December only.',
            'network': 'Reporting stations grew over the window, so levels across years are not like '
                       'for like; the shape within a winter is.',
            'lockdown': 'April and May 2020 sit inside the 2019-20 and 2020-21 years.',
        },
        'cycles': cycles,
        'average': avg,
        'summary': {'complete_winters': len(done), 'labels': [c['label'] for c in done]},
        'tests': tests(done),
    }


# ---------------------------------------------------------------- draw

def band_colour(v):
    return GREEN if v <= NAAQS_24H else AMBER if v <= 120 else RED if v <= SEVERE else DARK


def t(x, y, s, size=12, fill=INK, anchor='start', weight=400):
    return (f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" fill="{fill}" text-anchor="{anchor}" '
            f'font-weight="{weight}">{escape(s)}</text>')


def chart(d, tall):
    W, H = (400, 600) if tall else (980, 490)
    L, R, T, B = (44, 14, 156, 50) if tall else (60, 20, 122, 56)
    top = 400
    px = lambda w: L + (W - L - R) * (w + 0.5) / 52
    py = lambda v: T + (H - T - B) * (1 - min(v, top) / top)
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" '
         f'font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif">',
         f'<rect width="{W}" height="{H}" fill="{PAPER}"/>']
    cx = 14
    o.append(t(cx, 26, 'Delhi, weekly mean PM2.5 (µg/m³), May to April', 15 if tall else 17, weight=700))
    n = d['summary']['complete_winters']
    if tall:
        sub = [f'Shaded: lowest to highest of {n} winters.', 'Line: their mean. Dashed: winter 2024-25,',
               'to December (no January to March data).', 'Dotted: 60, the 24-hour standard, and 250, Severe.',
               'Dots: green to 60, amber to 120, red to 250.']
    else:
        sub = [f'Shaded band: lowest to highest week across {n} winters, 2018-19 to 2023-24. Line: their mean. '
               'Dashed: winter 2024-25, to December (no January to March data).',
               'Dotted lines: 60, the 24-hour standard, and 250, CPCB\'s Severe threshold. '
               'Dots: green up to 60, amber to 120, red to 250, dark red above.']
    for i, line in enumerate(sub):
        o.append(t(cx, 46 + 16 * i, line, 11.5, MUTE))
    # grid and axes
    for v in (0, 60, 120, 250, 400):
        o.append(f'<line x1="{L}" x2="{W - R}" y1="{py(v):.1f}" y2="{py(v):.1f}" stroke="{GRID}"/>')
        o.append(t(L - 6, py(v) + 4, str(v), 10.5, MUTE, 'end'))
    for v in (NAAQS_24H, SEVERE):
        o.append(f'<line x1="{L}" x2="{W - R}" y1="{py(v):.1f}" y2="{py(v):.1f}" stroke="{INK}" '
                 f'stroke-width="1" stroke-dasharray="2 4"/>')
    for i, m in enumerate(MONTHS):
        x = L + (W - L - R) * (i * 52 / 12) / 52
        o.append(t(x + 2, H - B + 18, m, 10.5, MUTE))
    o.append(t(14, H - 8, 'Source: CPCB monitors via XKDR (CC BY 4.0).' if tall else
               'Source: CPCB monitors via XKDR India Air Quality Database, CC BY 4.0. Weeks are 7-day blocks from 1 May.',
               10.5, MUTE))
    o.append(f'<line x1="{px(35):.1f}" x2="{px(35):.1f}" y1="{T}" y2="{H - B}" stroke="{GRID}"/>')
    o.append(t(px(35) + 3, H - B - 4, '1 Jan', 10, MUTE))
    # band
    avg = d['average']
    top_pts = ' '.join(f'{px(a["w"]):.1f},{py(a["max"]):.1f}' for a in avg)
    bot_pts = ' '.join(f'{px(a["w"]):.1f},{py(a["min"]):.1f}' for a in reversed(avg))
    o.append(f'<polygon points="{top_pts} {bot_pts}" fill="{BAND}" opacity="0.9"/>')
    # 2024-25
    c25 = next((c for c in d['cycles'] if c['label'] == '2024-25'), None)
    if c25:
        run = []
        for x in c25['weeks'] + [None]:
            if x is not None and (not run or x['w'] == run[-1]['w'] + 1):
                run.append(x); continue
            if len(run) > 1:
                o.append('<polyline fill="none" stroke="%s" stroke-width="1.6" stroke-dasharray="5 3" '
                         'points="%s"/>' % (INK, ' '.join(f'{px(r["w"]):.1f},{py(r["mean"]):.1f}' for r in run)))
            run = [x] if x is not None else []
    # mean line
    pts = ' '.join(f'{px(a["w"]):.1f},{py(a["mean"]):.1f}' for a in avg)
    o.append(f'<polyline fill="none" stroke="{INK}" stroke-width="2.4" points="{pts}"/>')
    for a in avg:
        r = 4.2 if a['mean'] > SEVERE else 3.2
        o.append(f'<circle cx="{px(a["w"]):.1f}" cy="{py(a["mean"]):.1f}" r="{r}" fill="{band_colour(a["mean"])}" '
                 f'stroke="{PAPER}" stroke-width="1"/>')
    # annotations
    e = max((a for a in avg if a['w'] in EARLY), key=lambda a: a['mean'])
    l = max((a for a in avg if a['w'] in LATE), key=lambda a: a['mean'])
    ex, ey = px(e['w']), py(e['mean'])
    o.append(t(ex - 9, ey - 8, f'{e["mean"]:.0f} ({week_label(e["w"])})', 11.5, INK, 'end', 700))
    lx, ly = px(l['w']), py(l['mean'])
    ty = py(330)
    o.append(f'<line x1="{lx:.1f}" x2="{lx + 12:.1f}" y1="{ly - 5:.1f}" y2="{ty + 4:.1f}" stroke="{INK}" stroke-width="0.8"/>')
    o.append(t(lx + 14, ty + 4, f'{l["mean"]:.0f} ({week_label(l["w"])})', 11.5, INK, 'start', 700))
    if c25:
        hi = max(c25['weeks'], key=lambda x: x['mean'])
        o.append(t(px(hi['w']) - 8, py(hi['mean']) - 4, f'{hi["mean"]:.0f} in the week of {week_label(hi["w"])}, 2024',
                   10.5, INK, 'end'))
    o.append('</svg>')
    s = '\n'.join(o)
    return s.replace('role="img"', 'role="img" aria-label="Delhi weekly mean PM2.5 across seven winters"', 1)


def render(d):
    return {'delhi-weekly.svg': chart(d, False), 'delhi-weekly-tall.svg': chart(d, True)}


# ---------------------------------------------------------------- check

def check():
    d = json.loads(OUT.read_text(encoding='utf-8'))
    errs = []
    cs = d['cycles']
    done = [c for c in cs if c['complete']]
    if len(done) < 5:
        errs.append(f'only {len(done)} complete winters')
    for c in cs:
        ws = [w['w'] for w in c['weeks']]
        if ws != sorted(set(ws)) or not all(0 <= w < 52 for w in ws):
            errs.append(f"{c['label']}: weeks out of order or out of range")
        for w in c['weeks']:
            if not 0 < w['mean'] < 800:
                errs.append(f"{c['label']} week {w['w']}: mean {w['mean']} implausible")
            if w['days'] < MIN_DAYS or w['stations_min'] < MIN_STATIONS:
                errs.append(f"{c['label']} week {w['w']}: below the day or station minimum")
        if c['complete'] != (c['peaks'] is not None):
            errs.append(f"{c['label']}: complete and peaks disagree")
        if c['complete'] and any(w not in ws for w in WINDOW_WEEKS):
            errs.append(f"{c['label']}: marked complete with a missing winter week")
        if c['peaks']:
            p = c['peaks']
            m = {w['w']: w['mean'] for w in c['weeks']}
            if m[p['early']['week']] != p['early']['mean'] or m[p['late']['week']] != p['late']['mean']:
                errs.append(f"{c['label']}: peak means do not match the weekly series")
            if p['early']['week'] not in EARLY or p['late']['week'] not in LATE:
                errs.append(f"{c['label']}: a peak sits outside its window")
    if tests(done) != d['tests']:
        errs.append('tests do not match what the winters give when recomputed (seeded)')
    for a in d['average']:
        v = [x['mean'] for c in done for x in c['weeks'] if x['w'] == a['w']]
        if a['n_cycles'] != len(v) or round(sum(v) / len(v), 1) != a['mean']:
            errs.append(f"average week {a['w']} is not the mean of the complete winters")
    if d['summary']['complete_winters'] != len(done):
        errs.append('complete_winters does not match')
    if any(k in str(d).lower() for k in ('"aqi_mean"', 'average_aqi')):
        errs.append('an average AQI is present')
    for name, svg in render(d).items():
        f = CHARTS / name
        if not f.exists() or f.read_text(encoding='utf-8') != svg + '\n':
            errs.append(f'{name} is stale: run python3 scripts/build-delhi-weekly.py')
    if errs:
        print('FAIL -'); [print('  ' + e) for e in errs]; return 1
    tt = d['tests']
    print(f"PASS - {len(cs)} winters ({len(done)} complete); shuffle null reaches a 30% dip in "
          f"{tt['shuffle']['null_share_at_least_30pct']:.0%} of draws; both charts current.")
    return 0


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--fetch', action='store_true')
    ap.add_argument('--check', action='store_true')
    a = ap.parse_args()
    if a.check:
        sys.exit(check())
    if a.fetch:
        fetch()
    if not CACHE.exists():
        sys.exit('no cache: run with --fetch first')
    data = build()
    OUT.write_text(json.dumps(data, indent=1) + '\n', encoding='utf-8')
    for name, svg in render(data).items():
        (CHARTS / name).write_text(svg + '\n', encoding='utf-8')
    print(f'wrote {OUT.relative_to(ROOT)} and {len(render(data))} charts')
    print(json.dumps(data['tests'], indent=1))
