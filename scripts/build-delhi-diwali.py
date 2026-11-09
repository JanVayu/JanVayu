#!/usr/bin/env python3
"""Delhi after Diwali 2026, as a page: delhi/diwali-2026/index.html.

Four charts and the sources behind them, drawn from data/delhi-diwali-2026.json
(figures typed from named articles, nothing estimated) and, for the comparison
with earlier years, from data/delhi-season.json and the CPCB bulletin file.

    python3 scripts/build-delhi-diwali.py            # write the page
    python3 scripts/build-delhi-diwali.py --check    # offline: data, arithmetic, page current

What the checks hold, because each failure here is quiet:
  * the station counts add up (54 stations, 4 + 35 + 15 by CPCB band)
  * every colour clears 3:1 on the card, as the Delhi season charts do
  * every chart has a table of its numbers beside it
  * no line joins two readings the source did not connect, and a station that
    stopped reporting is drawn as a gap, not as zero
  * the page on disk is the page the data produces
"""
import argparse, csv, gzip, html, json, sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'data' / 'delhi-diwali-2026.json'
SEASON = ROOT / 'data' / 'delhi-season.json'
CSV26 = ROOT / 'data' / 'raw' / 'cpcb-bulletins-2026.csv.gz'
PAGE = ROOT / 'delhi' / 'diwali-2026' / 'index.html'
STAMP = '202606254'

COLOUR = {'Poor': '#c2410c', 'Very Poor': '#b91c1c', 'Severe': '#7f1d1d'}
RKP, JNU, AKS = '#b91c1c', '#1e5a8a', '#6d28d9'
INK, MUTED, PAPER, GRID = '#1f2a24', '#4b5a50', '#fbfaf7', '#d8d6cc'
FONT = 'font-family="Inter, system-ui, sans-serif"'


def cat(aqi):
    return ('Good' if aqi <= 50 else 'Satisfactory' if aqi <= 100 else 'Moderate' if aqi <= 200
            else 'Poor' if aqi <= 300 else 'Very Poor' if aqi <= 400 else 'Severe')


def lum(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    c = [x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def ratio(a, b):
    la, lb = sorted([lum(a), lum(b)], reverse=True)
    return (la + 0.05) / (lb + 0.05)


def e(s):
    return html.escape(str(s), quote=True)


def txt(x, y, s, size=12, fill=MUTED, anchor='start', weight=None):
    w = f' font-weight="{weight}"' if weight else ''
    return f'<text x="{x:.1f}" y="{y:.1f}" text-anchor="{anchor}" {FONT} font-size="{size}"{w} fill="{fill}">{s}</text>'


def wrap(inner, vb, label):
    return (f'<div class="jv-dgm"><svg viewBox="0 0 {vb[0]} {vb[1]}" xmlns="http://www.w3.org/2000/svg" '
            f'role="img" aria-label="{e(label)}">{inner}</svg></div>')


# ----------------------------------------------------------------- the data

def load():
    d = json.loads(DATA.read_text(encoding='utf-8'))
    season = json.loads(SEASON.read_text(encoding='utf-8'))
    past = []
    for y in range(2019, 2026):
        a = season['aligned'][str(y)]
        past.append((y, season['diwali'][str(y)], a['0'], a['1']))
    delhi26 = {}
    with gzip.open(CSV26, 'rt', newline='') as f:
        for r in csv.DictReader(f):
            if r['city'].strip().lower() == 'delhi' and r['date'] >= '2026-11-01':
                delhi26.setdefault(r['date'], int(r['aqi']))
    d['_past'] = past
    d['_delhi26'] = delhi26
    return d


def bands(s):
    poor = s['above_200'] - s['above_300']
    vpoor = s['above_300'] - s['above_400']
    return {'Poor': poor, 'Very Poor': vpoor, 'Severe': s['above_400']}


# ----------------------------------------------------------------- charts

def chart_stations(d):
    s = d['snapshot_7am']
    b = bands(s)
    n = s['stations_valid']
    x0, w = 14, 392
    out = txt(14, 20, 'Delhi’s stations at 7 a.m., 9 November', 15, INK, weight=700)
    x = x0
    for c in ('Poor', 'Very Poor', 'Severe'):
        wc = w * b[c] / n
        out += f'<rect x="{x:.1f}" y="36" width="{max(wc - 1, 1):.1f}" height="30" fill="{COLOUR[c]}"/>'
        out += txt(x + wc / 2 - 0.5, 56, b[c], 14, '#ffffff', 'middle', 700) if b[c] >= 4 else ''
        x += wc
    # key under the bar, two rows so nothing clips on a phone
    for (c, lab, kx, ky) in (('Poor', '201 to 300', 14, 88), ('Very Poor', '301 to 400', 150, 88), ('Severe', 'above 400', 14, 106)):
        out += f'<rect x="{kx}" y="{ky - 10}" width="11" height="11" fill="{COLOUR[c]}"/>'
        out += txt(kx + 16, ky, f'{c} ({lab})', 12, INK)
    out += txt(14, 138, f'Highest eight of the {n} stations', 13, INK, weight=700)
    L, R = 190, 396
    X = lambda v: L + (R - L) * (v - 300) / 160
    top = s['top']
    y0 = 152
    for g in (300, 350, 400, 450):
        out += f'<line x1="{X(g):.1f}" y1="{y0 - 6}" x2="{X(g):.1f}" y2="{y0 + len(top) * 20}" stroke="{GRID}" stroke-width="1"/>'
        out += txt(X(g), y0 + len(top) * 20 + 14, g, 11.5, MUTED, 'middle')
    out += f'<line x1="{X(400):.1f}" y1="{y0 - 6}" x2="{X(400):.1f}" y2="{y0 + len(top) * 20}" stroke="{INK}" stroke-width="1.2" stroke-dasharray="3 3"/>'
    for i, (name, v) in enumerate(top):
        y = y0 + i * 20
        c = COLOUR[cat(v)]
        out += txt(L - 8, y + 11, e(name), 12, INK, 'end')
        out += f'<line x1="{L}" y1="{y + 7}" x2="{X(v):.1f}" y2="{y + 7}" stroke="{c}" stroke-width="1.6" opacity="0.55"/>'
        out += f'<circle cx="{X(v):.1f}" cy="{y + 7}" r="5.5" fill="{c}"/>'
        out += txt(X(v) + 10, y + 11.5, v, 12, INK, weight=700)
    out += txt(14, y0 + len(top) * 20 + 36, 'The scale starts at 300. Dashed line: 400, where Severe begins.', 11.5, MUTED)
    return out, (420, y0 + len(top) * 20 + 46)


def chart_night(d):
    n = d['night_pm25']
    L, R, T, B = 52, 404, 40, 236
    hours = [20, 21, 22, 23]
    X = lambda h: L + 22 + (R - L - 52) * (h - 20) / 3
    YMAX = 1000
    Y = lambda v: B - (B - T) * v / YMAX
    out = txt(14, 20, 'PM2.5 on Diwali night, three Delhi stations', 15, INK, weight=700)
    for g in (0, 250, 500, 750, 1000):
        out += f'<line x1="{L}" y1="{Y(g):.1f}" x2="{R}" y2="{Y(g):.1f}" stroke="{GRID}" stroke-width="1"/>'
        out += txt(L - 6, Y(g) + 4, g, 11.5, MUTED, 'end')
    for h in hours:
        out += txt(X(h), B + 18, f'{h - 12} pm', 12, MUTED, 'middle')
    for ref in (n['india_24h'], n['who_24h']):
        out += f'<line x1="{L}" y1="{Y(ref):.1f}" x2="{R}" y2="{Y(ref):.1f}" stroke="{MUTED}" stroke-width="1" stroke-dasharray="2 3"/>'
    hr = lambda t: int(t.split(':')[0])
    ser = {s['station']: s for s in n['series']}
    # RK Puram: two readings, then nothing
    p = ser['RK Puram']['points']
    pts = [(X(hr(t)), Y(v)) for t, v in p]
    out += f'<polyline fill="none" stroke="{RKP}" stroke-width="2.6" points="{" ".join(f"{a:.1f},{b:.1f}" for a, b in pts)}"/>'
    for (a, b), (t, v) in zip(pts, p):
        out += f'<circle cx="{a:.1f}" cy="{b:.1f}" r="4" fill="{RKP}"/>'
    out += txt(pts[0][0] - 6, pts[0][1] - 9, f'RK Puram {p[0][1]}', 12, RKP, 'start', 700)
    out += txt(pts[1][0] - 8, pts[1][1] - 9, f'RK Puram {p[1][1]}', 12, RKP, 'end', 700)
    for h in (22, 23):
        out += f'<path d="M{X(h) - 4:.1f} {B - 8:.1f} l8 8 m-8 0 l8 -8" stroke="{RKP}" stroke-width="1.8" fill="none"/>'
    out += txt(X(22) + 18, B - 16, 'no reading shown', 11.5, RKP, 'middle', 700)
    # Akshardham: one reading
    p = ser['Akshardham']['points'][0]
    ax, ay = X(hr(p[0])), Y(p[1])
    out += f'<path d="M{ax:.1f} {ay - 8:.1f} l8 8 l-8 8 l-8 -8 z" fill="{AKS}"/>'
    out += txt(ax - 12, ay + 20, 'Akshardham 761', 12, AKS, 'end', 700)
    # JNU: two readings, hours between not given
    p = ser['JNU']['points']
    pts = [(X(hr(t)), Y(v)) for t, v in p]
    out += f'<polyline fill="none" stroke="{JNU}" stroke-width="2" stroke-dasharray="5 4" points="{" ".join(f"{a:.1f},{b:.1f}" for a, b in pts)}"/>'
    for (a, b) in pts:
        out += f'<circle cx="{a:.1f}" cy="{b:.1f}" r="4" fill="{JNU}"/>'
    out += txt(pts[0][0] + 8, pts[0][1] + 17, f'JNU {p[0][1]}', 12, JNU, 'start', 700)
    out += txt(pts[1][0] - 12, pts[1][1] - 6, f'JNU {p[1][1]}', 12, JNU, 'end', 700)
    for i, line in enumerate(('Solid line: two consecutive hours. Dashed: hours between not given.',
                              'Diamond: one reading. Dotted lines at 60 and 15: 24-hour limits.',
                              'India’s standard is 60 and the WHO’s guideline is 15.',
                              'Micrograms per cubic metre. Hourly readings, so not a like-for-like test.')):
        out += txt(14, B + 38 + i * 14, line, 11, MUTED)
    return out, (420, B + 86)


def chart_ncr(d):
    n = d['ncr_7am']['cities']
    L, R = 112, 400
    X = lambda v: L + (R - L) * v / 450
    out = txt(14, 20, 'Delhi and its neighbours at 7 a.m., 9 November', 15, INK, weight=700)
    y0 = 40
    for g, lab in ((100, '100'), (200, '200'), (300, '300'), (400, '400')):
        out += f'<line x1="{X(g):.1f}" y1="{y0 - 6}" x2="{X(g):.1f}" y2="{y0 + len(n) * 24}" stroke="{GRID}" stroke-width="1"/>'
        out += txt(X(g), y0 + len(n) * 24 + 14, lab, 11.5, MUTED, 'middle')
    for i, (name, v) in enumerate(n):
        y = y0 + i * 24
        c = COLOUR.get(cat(v), COLOUR['Poor'])
        delhi = name.startswith('Delhi')
        out += txt(L - 8, y + 13, e(name), 12, INK, 'end', 700 if delhi else None)
        out += f'<rect x="{L}" y="{y}" width="{X(v) - L:.1f}" height="17" fill="{c}"/>'
        out += txt(X(v) + 5, y + 13.5, v, 12, INK, weight=700)
    out += txt(14, y0 + len(n) * 24 + 34, 'Colour is the CPCB band: Poor 201 to 300, Very Poor 301 to 400.', 11.5, MUTED)
    return out, (420, y0 + len(n) * 24 + 44)


def chart_next_day(d):
    rows = [(str(y), dd, a, b) for y, dd, a, b in d['_past']]
    d26 = d['_delhi26']
    diw = d['diwali_day_2026']
    nxt = '2026-11-09'
    rows.append(('2026', diw, d26.get(diw), d26.get(nxt)))
    L, R = 62, 400
    X = lambda v: L + (R - L) * (v - 200) / 300
    out = txt(14, 20, 'Diwali day and the day after, Delhi’s CPCB bulletin', 15, INK, weight=700)
    y0 = 40
    for g in (200, 300, 400, 500):
        out += f'<line x1="{X(g):.1f}" y1="{y0 - 6}" x2="{X(g):.1f}" y2="{y0 + len(rows) * 26}" stroke="{GRID}" stroke-width="1"/>'
        out += txt(X(g), y0 + len(rows) * 26 + 14, g, 11.5, MUTED, 'middle')
    for i, (y, dd, a, b) in enumerate(rows):
        yy = y0 + i * 26 + 10
        out += txt(L - 8, yy + 4, y, 12.5, INK, 'end', 700 if y == '2026' else None)
        if a is not None and b is not None:
            out += f'<line x1="{X(a):.1f}" y1="{yy}" x2="{X(b):.1f}" y2="{yy}" stroke="{MUTED}" stroke-width="1.6"/>'
        if a is not None:
            out += f'<circle cx="{X(a):.1f}" cy="{yy}" r="4.4" fill="{MUTED}"/>'
            if y == '2026':
                out += txt(X(a), yy - 9, a, 12, INK, 'middle', 700)
        if b is not None:
            col = '#b91c1c' if (a is not None and b > a) else '#1e5a8a'
            out += f'<circle cx="{X(b):.1f}" cy="{yy}" r="4.4" fill="{col}"/>'
        elif y == '2026':
            out += f'<circle cx="{X(a) + 34:.1f}" cy="{yy}" r="4.4" fill="none" stroke="{INK}" stroke-width="1.4" stroke-dasharray="2 2"/>'
            out += txt(X(a) + 44, yy + 4, 'due after 4 pm', 11.5, INK)
    ly = y0 + len(rows) * 26 + 34
    out += f'<circle cx="20" cy="{ly - 4}" r="4.4" fill="{MUTED}"/>' + txt(30, ly, 'Diwali day', 12, INK)
    out += f'<circle cx="108" cy="{ly - 4}" r="4.4" fill="#b91c1c"/>' + txt(118, ly, 'day after, higher', 12, INK)
    out += f'<circle cx="236" cy="{ly - 4}" r="4.4" fill="#1e5a8a"/>' + txt(246, ly, 'day after, lower', 12, INK)
    return out, (420, ly + 12)


# ----------------------------------------------------------------- page

CSS = """  .delhi-page { max-width: 920px; }
  .delhi-page h1 { font-family: var(--serif); font-size: clamp(1.8rem, 4vw, 2.8rem); line-height: 1.15; margin: 24px 0 12px; }
  .delhi-page h2 { font-family: var(--serif); font-size: 1.5rem; margin: 40px 0 12px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }
  .delhi-page .lede { font-size: 1.15rem; color: var(--text-2); margin-bottom: 12px; }
  .delhi-page .asof { font-size: 0.9rem; color: var(--text-3); margin-bottom: 24px; }
  .delhi-page p, .delhi-page li { line-height: 1.7; }
  .delhi-page p { margin: 0 0 1em; }
  .delhi-page .wrap { overflow-x: auto; margin: 12px 0; }
  .delhi-page table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
  .delhi-page th, .delhi-page td { padding: 8px 10px; text-align: left; vertical-align: top; border-bottom: 1px solid var(--border); }
  .delhi-page th { font-size: 0.8rem; color: var(--text-3); font-weight: 600; }
  .delhi-page td.num { font-family: var(--mono); text-align: right; white-space: nowrap; }
  .delhi-page .when { white-space: nowrap; font-family: var(--mono); font-size: 0.85rem; }
  .delhi-page .box { padding: 16px 20px; background: var(--bg-section); border-left: 3px solid var(--ink-orange); margin: 20px 0; }
  .delhi-page .box p { margin: 0 0 8px; }
  .delhi-page .box p:last-child { margin-bottom: 0; }
  .delhi-page .note { font-size: 0.85rem; color: var(--text-3); margin-top: 8px; }
  .delhi-page .sources li { font-size: 0.88rem; margin-bottom: 6px; }
  .delhi-page .facts { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin: 18px 0; }
  .delhi-page .fact { padding: 12px 14px; background: var(--bg-section); border: 1px solid var(--border); }
  .delhi-page .fact b { display: block; font-family: var(--serif); font-size: 1.9rem; line-height: 1.1; }
  .delhi-page .fact span { font-size: 0.82rem; color: var(--text-3); }
  .delhi-page a { color: var(--accent); }
  @media (max-width: 640px) {
    .delhi-page h2 { font-size: 1.3rem; margin-top: 32px; }
    .delhi-page .wrap { overflow-x: visible; }
    .delhi-page table th, .delhi-page table td { padding: 6px 4px; font-size: 0.8rem; line-height: 1.4; }
    .delhi-page td.num { white-space: normal; }
  }
  .delhi-foot { padding: 32px 0; color: var(--text-3); font-size: 0.85rem; border-top: 1px solid var(--border); margin-top: 48px; }
  .delhi-foot a { color: var(--accent); text-decoration: underline; text-underline-offset: 2px; }"""


def src_link(d, sid, text=None):
    s = d['sources'][sid]
    return f'<a href="{e(s["url"])}">{e(text or s["name"])}</a>'


def table(head, rows, num_from=1):
    th = ''.join(f'<th>{h}</th>' for h in head)
    body = ''
    for r in rows:
        body += '<tr>' + ''.join(
            f'<td class="{"num" if i >= num_from and isinstance(c, (int, float)) else "when" if i == 0 else ""}">{c}</td>'
            for i, c in enumerate(r)) + '</tr>'
    return f'<details><summary>Show the numbers</summary><div class="wrap"><table><thead><tr>{th}</tr></thead><tbody>{body}</tbody></table></div></details>'


def page(d):
    s = d['snapshot_7am']
    b = bands(s)
    night = d['night_pm25']
    ser = {x['station']: x for x in night['series']}
    rk = ser['RK Puram']['points']
    jn = ser['JNU']['points']
    ak = ser['Akshardham']['points'][0]
    past = d['_past']
    higher = [y for y, dd, a, c in past if c > a]
    lower = [y for y, dd, a, c in past if c < a]
    rises = {y: c - a for y, dd, a, c in past}
    biggest = max(rises, key=rises.get)
    d26 = d['_delhi26']
    top = s['top']
    ch1, vb1 = chart_stations(d)
    ch2, vb2 = chart_night(d)
    ch3, vb3 = chart_ncr(d)
    ch4, vb4 = chart_next_day(d)

    t1 = table(['Band', 'Stations'], [[f'{c} ({r})', b[c]] for c, r in (('Poor', '201 to 300'), ('Very Poor', '301 to 400'), ('Severe', 'above 400'))] + [['Valid readings', s['stations_valid']]]) + \
        table(['Station', 'AQI'], [[e(n), v] for n, v in top])
    t2 = table(['Station', 'Time', 'PM2.5'], [[e(x['station']), t.replace(':00', ':00'), v] for x in night['series'] for t, v in x['points']])
    t3 = table(['Place', 'AQI, 7 a.m.', 'Band'], [[e(n), v, cat(v)] for n, v in d['ncr_7am']['cities']], 1)
    nxt_rows = [[str(y), date.fromisoformat(dd).strftime('%-d %B %Y'), a, c, f'{c - a:+d}'] for y, dd, a, c in past]
    nxt_rows.append(['2026', '8 November 2026', d26.get(d['diwali_day_2026'], ''), d26.get('2026-11-09', ''), ''])
    t4 = table(['Year', 'Diwali', 'Diwali day', 'Day after', 'Change'], nxt_rows)
    morning = ''.join(
        f'<tr><td class="when">{e(r["time"])}</td><td>{e(r["place"])}</td><td class="num">{r["aqi"]}</td><td>{r["category"]}</td>'
        f'<td>{src_link(d, r["source_id"])}' + (f' · <a href="{e(r["x"])}">post on X</a>' if r.get('x') else '') + '</td></tr>'
        for r in d['morning_readings'])
    sources = ''.join(
        f'<li>{src_link(d, k, v["title"])} ({e(v["name"])}, {e(v["date"])})</li>' for k, v in d['sources'].items() if k not in ('ani', 'hindu_pm')) + \
        f'<li>{src_link(d, "hindu_pm", d["sources"]["hindu_pm"]["title"])} ({e(d["sources"]["hindu_pm"]["name"])}, 9 November 2026)</li>' + \
        '<li>CPCB daily AQI bulletins, Delhi, for the Diwali day and the day after in 2019 to 2026: <a href="/data/delhi-season.json">data/delhi-season.json</a> and <a href="/data/raw/cpcb-bulletins-2026.csv.gz">the 2026 bulletin file</a>.</li>'
    title = 'Delhi after Diwali 2026: what the monitors recorded | JanVayu'
    desc = ('Delhi’s air on Diwali night and the morning after, 8 and 9 November 2026: which stations passed 400, which went blank, '
            'how the NCR compared, and how the day after Diwali has gone in past years.')
    label2 = (f'Chart of PM2.5 from 8 to 11 pm on Diwali night. RK Puram rose from {rk[0][1]} to {rk[1][1]} and then showed no reading. '
              f'JNU rose from {jn[0][1]} at 8 pm to {jn[1][1]} at 11 pm. Akshardham read {ak[1]:.0f} at 11 pm.')
    nbs = past
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<meta name="keywords" content="Delhi AQI after Diwali 2026, Delhi pollution Diwali night, Delhi air quality stations stopped reporting, firecracker ban Delhi 2026, GRAP Stage III">
<!-- share-meta:start -->
<!-- share-meta:end -->
<link rel="icon" href="/favicon.svg">
<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Delhi after Diwali 2026: what the monitors recorded",
  "datePublished": "2026-11-09",
  "dateModified": "2026-11-09",
  "author": {{ "@type": "Organization", "name": "JanVayu" }},
  "publisher": {{ "@type": "Organization", "name": "JanVayu", "logo": {{ "@type": "ImageObject", "url": "https://www.janvayu.in/og-image.png" }} }},
  "mainEntityOfPage": "https://www.janvayu.in/delhi/diwali-2026/",
  "description": {json.dumps(desc)}
}}
</script>
<link rel="stylesheet" href="/styles.css?v={STAMP}">
<script>try{{if(localStorage.getItem('janvayu-theme')==='dark')document.documentElement.setAttribute('data-theme','dark');}}catch(e){{}}</script>
<script src="/js/chrome.js?v={STAMP}" defer></script>
<style>
{CSS}
</style>
</head>
<body data-jv-chrome>
<main class="container delhi-page" id="main-content">
  <p class="note"><a href="/delhi/">Delhi this winter</a> › Diwali 2026</p>
  <h1>Delhi after Diwali 2026: what the monitors recorded</h1>
  <p class="lede">By 7 a.m. on Monday 9 November, all {s["stations_valid"]} Delhi stations reporting valid data read above 200 on CPCB’s index, {s["above_300"]} read above 300 and {s["above_400"]} read above 400. The city figure was {s["city_aqi"]}, Very Poor.</p>
  <p class="asof">Written on 9 November 2026 from press reports of CPCB and DPCC data. CPCB issues each day’s bulletin at 4 pm, so the bulletin for 9 November did not exist when this was written.</p>

  <div class="facts">
    <div class="fact"><b>{s["above_400"]} of {s["stations_valid"]}</b><span>stations above 400 at 7 a.m.</span></div>
    <div class="fact"><b>{rk[1][1]}</b><span>PM2.5 at RK Puram at 9 pm, then no reading</span></div>
    <div class="fact"><b>{jn[1][1]}</b><span>PM2.5 at JNU by 11 pm, up from {jn[0][1]} at 8 pm</span></div>
    <div class="fact"><b>{len(higher)} of {len(past)}</b><span>past years the day after Diwali was higher than Diwali day</span></div>
  </div>

  <h2>The night</h2>
  <p>The Supreme Court allowed approved green crackers in two windows on 7 and 8 November, 6 to 7 a.m. and 8 to 10 p.m., according to {src_link(d, "bs")}. The same report and {src_link(d, "hindu")} say crackers were burst well past 10 p.m. The Commission for Air Quality Management had already put Stage III of the Graded Response Action Plan in force across Delhi-NCR on 6 November.</p>
  <p>At RK Puram, PM2.5 was {rk[0][1]} micrograms per cubic metre at about 8 p.m. and {rk[1][1]} by 9 p.m. After that the station showed nothing. At JNU, which kept reporting, it went from {jn[0][1]} at 8 p.m. to {jn[1][1]} by 11 p.m. DPCC recorded {ak[1]} at Akshardham at 11 p.m. ({src_link(d, "outlook")}; {src_link(d, "hindu")}).</p>
  {wrap(ch2, vb2, label2)}
  {t2}
  <p class="note">India’s 24-hour PM2.5 standard is 60 and the WHO’s 24-hour guideline is 15, both in micrograms per cubic metre. These are hourly readings, so the chart shows how sharp the rise was and does not compare an hour with a day. {src_link(d, "outlook")} names RK Puram, Nehru Nagar, Mundka, Sonia Vihar and Dwarka as stations that stopped displaying readings for several hours after 9 p.m., and says no cause has been established for this year’s gaps. Delhi’s portal leaves a station that is not reporting out of the hourly city figure.</p>

  <h2>The morning</h2>
  <p>At 7 a.m. the {s["stations_valid"]} stations with valid data split into {b["Poor"]} in the Poor band, {b["Very Poor"]} Very Poor and {b["Severe"]} Severe. The first two numbers come from the reported counts: all {s["above_200"]} read above 200 and {s["above_300"]} above 300, which leaves {b["Poor"]} between 201 and 300, and {s["above_400"]} read above 400, which leaves {b["Very Poor"]} between 301 and 400 ({src_link(d, "bs")}).</p>
  {wrap(ch1, vb1, f"Delhi's {s['stations_valid']} stations at 7 a.m. on 9 November: {b['Poor']} Poor, {b['Very Poor']} Very Poor, {b['Severe']} Severe. The highest were Burari Crossing and Sonia Vihar at 441.")}
  {t1}
  <p>The city figure of {s["city_aqi"]} sits below the worst stations because it is an average of them, and which stations are in it depends on which were reporting. Earlier in the night, readings quoted by the press ran from 337 to 418:</p>
  <div class="wrap"><table><thead><tr><th>Time</th><th>Place</th><th>AQI</th><th>CPCB band</th><th>Reported by</th></tr></thead><tbody>{morning}</tbody></table></div>

  <h2>The neighbours</h2>
  <p>Bahadurgarh in Haryana read {d["ncr_7am"]["cities"][0][1]} at 7 a.m., higher than Delhi’s {s["city_aqi"]}. Ghaziabad was at 366, Noida 340, Manesar 338, Faridabad 334 and Gurugram 316. Bhiwadi (300) and Greater Noida (293) were in the Poor band. Across the 288 cities with valid readings in CPCB’s 7 a.m. data, Khora in Uttar Pradesh was the highest at 400 and Aizawl the lowest at 19 ({src_link(d, "bs")}).</p>
  {wrap(ch3, vb3, "Bar chart of the 7 a.m. AQI on 9 November: Bahadurgarh 389, Delhi 368, Ghaziabad 366, Noida 340, Manesar 338, Faridabad 334, Gurugram 316, Bhiwadi 300, Greater Noida 293.")}
  {t3}

  <h2>The day after, in past years</h2>
  <p>CPCB’s bulletin figure for Delhi was higher on the day after Diwali than on Diwali day in {len(higher)} of the {len(past)} years from 2019 to 2025. The rise was {min(r for r in rises.values() if r > 0)} points at the least ({", ".join(str(y) for y in rises if rises[y] == min(r for r in rises.values() if r > 0))}) and {max(rises.values())} at the most ({biggest}). In {", ".join(str(y) for y in lower)} it was {abs(rises[lower[0]])} lower. The bulletin is a 24-hour figure to 4 pm, so Diwali night falls inside the day-after figure.</p>
  <p>This year’s Diwali-day bulletin figure was {d26.get(d["diwali_day_2026"], "not available")}. The figure for 9 November <span id="next-day">is due after 4 pm today and is not estimated here</span>.</p>
  {wrap(ch4, vb4, f"Dumbbell chart of Delhi's CPCB bulletin AQI on Diwali day and the day after, 2019 to 2025, with 2026's Diwali-day figure of {d26.get(d['diwali_day_2026'], '')} and the day-after figure still to come.")}
  {t4}
  <p class="note">Seven years is a small sample, and Diwali falls on a different date each year, with different weather. This shows what the bulletin recorded and does not say how much of any rise the fireworks caused. Diwali dates are the gazetted public holiday each year, and the table is in <a href="/data/delhi-season.json">data/delhi-season.json</a>.</p>

  <div class="box">
    <p><strong>What this page cannot tell you.</strong> The station figures were read from press reports of CPCB and DPCC dashboards, at the times each article gives, and they are not a download of the dashboards. The readings are at different hours, so the stations in the morning table are not a time series. A station that stopped reporting is drawn as a gap and is not counted as zero. Nothing here assigns a cause to the pollution.</p>
  </div>

  <h2>Sources</h2>
  <ul class="sources">{sources}</ul>
  <p class="note">The three ANI posts in the table were checked against the platform’s embed service on 9 November 2026: each exists and carries the figure shown.</p>

<footer class="delhi-foot">
  <div>JanVayu is a citizen-led air quality accountability platform for India. Part of <strong>AirQuality for Janhit by MMSF Fellows, AIPC</strong>.</div>
  <div style="margin-top: 8px;">© 2026 JanVayu · <a href="/">Dashboard</a> · <a href="/delhi/">Delhi</a> · <a href="/blog/">Blog</a> · <a href="/#about">About</a></div>
  <div style="margin-top: 6px;" lang="en">Website developed by Varna Sri Raman at <a href="https://www.pinpointventures.in" target="_blank" rel="noopener">Pinpoint Ventures</a>.</div>
</footer>
</main>
<script>
(async () => {{
  const el = document.getElementById('next-day');
  if (!el) return;
  try {{
    const j = await (await fetch('/data/cpcb-latest.json')).json();
    const days = j && j.cities && j.cities.delhi && j.cities.delhi.days;
    const day = (days || []).find(x => x.date === '2026-11-09');
    if (day) el.textContent = 'is ' + day.aqi + ' (' + day.category + ')';
  }} catch (e) {{}}
}})();
</script>
</body>
</html>
'''


def check():
    errs = []
    d = load()
    s = d['snapshot_7am']
    if not (s['above_400'] <= s['above_300'] <= s['above_200'] <= s['stations_valid']):
        errs.append('station counts are not nested')
    b = bands(s)
    if sum(b.values()) != s['stations_valid']:
        errs.append('bands do not add to the stations counted')
    if len(s['top']) != 8 or any(v <= 400 for _, v in s['top']) or s['top'] != sorted(s['top'], key=lambda x: -x[1]):
        errs.append('top stations must be eight, all above 400, highest first')
    if len([v for _, v in s['top']]) > s['above_400']:
        errs.append('more top stations than stations above 400')
    for name, v in d['ncr_7am']['cities']:
        if not 0 < v <= 500:
            errs.append(f'{name}: {v} out of range')
    for r in d['morning_readings']:
        if cat(r['aqi']) != r['category']:
            errs.append(f"{r['place']}: {r['aqi']} is not {r['category']}")
        if r['source_id'] not in d['sources']:
            errs.append(f"{r['place']}: unknown source")
    for x in d['night_pm25']['series']:
        if x['source_id'] not in d['sources'] or not x['points']:
            errs.append(f"{x['station']}: missing source or points")
    for c, h in list(COLOUR.items()) + [('RK Puram', RKP), ('JNU', JNU), ('Akshardham', AKS), ('muted', MUTED), ('ink', INK)]:
        if ratio(h, PAPER) < 3.0:
            errs.append(f'{c} colour {h} is {ratio(h, PAPER):.2f}:1 on the card, under 3:1')
    if len(d['_past']) != 7:
        errs.append('need seven past years')
    if d['_delhi26'].get(d['diwali_day_2026']) is None:
        errs.append('no 2026 Diwali-day bulletin in the bulletin file')
    import re
    strip = lambda t: re.sub(r'<!-- share-meta:start -->.*?<!-- share-meta:end -->', '', t, flags=re.S)
    want = page(d)
    if not PAGE.exists() or strip(PAGE.read_text(encoding='utf-8')) != strip(want):
        errs.append('the page is stale: run python3 scripts/build-delhi-diwali.py (then scripts/build-share.py)')
    if errs:
        print('FAIL -')
        [print('  ' + x) for x in errs]
        return 1
    print(f'PASS - {s["stations_valid"]} stations in {len(b)} bands, {len(d["ncr_7am"]["cities"])} NCR places, '
          f'{len(d["_past"])} past years, palette at least {min(ratio(h, PAPER) for h in list(COLOUR.values()) + [RKP, JNU, AKS]):.1f}:1, page current.')
    return 0


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--check', action='store_true')
    a = ap.parse_args()
    if a.check:
        sys.exit(check())
    d = load()
    PAGE.parent.mkdir(parents=True, exist_ok=True)
    old = PAGE.read_text(encoding='utf-8') if PAGE.exists() else ''
    new = page(d)
    # keep the share block build-share.py wrote
    if '<!-- share-meta:start -->' in old and '<!-- share-meta:end -->' in old:
        a0, a1 = old.index('<!-- share-meta:start -->'), old.index('<!-- share-meta:end -->') + len('<!-- share-meta:end -->')
        n0, n1 = new.index('<!-- share-meta:start -->'), new.index('<!-- share-meta:end -->') + len('<!-- share-meta:end -->')
        new = new[:n0] + old[a0:a1] + new[n1:]
    PAGE.write_text(new, encoding='utf-8')
    print('wrote', PAGE.relative_to(ROOT))
