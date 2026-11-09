#!/usr/bin/env python3
"""The homepage's "morning after Diwali" block, from CPCB's daily bulletin.

Writes data/diwali-morning.json and the block in index.html between the
`diwali:start` and `diwali:end` markers.

What it shows
-------------
Delhi's official 24-hour AQI for the three days up to and including Diwali
(2026: Friday 6, Saturday 7 and Sunday 8 November) and for the day after,
which is the bulletin that covers the night of the fireworks. CPCB issues each
day's bulletin at 4 pm, so the figure for the day after Diwali does not exist
until 4 pm that day. Until it does, the block says exactly that and shows no
number. It is never estimated.

Beside it: the same two figures, Diwali day and the day after, for each year
from 2019 to 2025. The past figures come from data/delhi-season.json (which
holds them aligned on Diwali; its own source is the UrbanEmissions.Info
extraction of CPCB's bulletins), 2026 from data/raw/cpcb-bulletins-2026.csv.gz.

What it will not say
--------------------
No average, no cause. A bulletin figure is one number for the whole city over
24 hours and cannot tell firework smoke from stubble smoke or weather. The block
says so and points to the Delhi page, which draws the whole season.

    python3 scripts/build-diwali-morning.py            # write
    python3 scripts/build-diwali-morning.py --check    # fail if either file is stale
"""
import csv
import gzip
import json
import sys
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SEASON = ROOT / 'data' / 'delhi-season.json'
CSV26 = ROOT / 'data' / 'raw' / 'cpcb-bulletins-2026.csv.gz'
OUT = ROOT / 'data' / 'diwali-morning.json'
PAGE = ROOT / 'index.html'
START, END = '<!--diwali:start-->', '<!--diwali:end-->'
YEAR = 2026
PAST = [str(y) for y in range(2019, 2026)]
DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
          'August', 'September', 'October', 'November', 'December']


def category(aqi):
    for top, name in ((50, 'Good'), (100, 'Satisfactory'), (200, 'Moderate'),
                      (300, 'Poor'), (400, 'Very Poor')):
        if aqi <= top:
            return name
    return 'Severe'


def delhi_2026():
    rows = {}
    with gzip.open(CSV26, 'rt', encoding='utf-8') as f:
        for r in csv.DictReader(f):
            if r['city'].strip().lower() != 'delhi':
                continue
            rows[r['date']] = {
                'aqi': int(float(r['aqi'])),
                'category': r['aqi_category'].strip(),
                'stations': int(r['stations_participated']),
                'stations_total': int(r['stations_total']),
            }
    return rows


def build():
    season = json.loads(SEASON.read_text(encoding='utf-8'))
    diwali = date.fromisoformat(season['diwali'][str(YEAR)])
    bulletins = delhi_2026()
    days = []
    for offset in (-2, -1, 0, 1):
        d = diwali + timedelta(days=offset)
        rec = bulletins.get(d.isoformat())
        item = {'date': d.isoformat(), 'offset': offset}
        if rec:
            item.update(rec)
        days.append(item)
    past = {}
    for y in PAST:
        a = season['aligned'][y]
        past[y] = {'diwali': season['diwali'][y], 'day_of': a['0'], 'day_after': a['1']}
    d0 = days[2].get('aqi')
    return {
        '_meta': {
            'what': "Delhi's official 24-hour AQI on and after Diwali, from CPCB's daily bulletin.",
            'source': 'CPCB daily AQI bulletins (cpcb.gov.in), issued at 4 pm. 2019-2025 via data/delhi-season.json (UrbanEmissions.Info extraction); 2026 from data/raw/cpcb-bulletins-2026.csv.gz.',
            'built_by': 'scripts/build-diwali-morning.py',
            'no_estimate': 'A day CPCB has not yet published has no figure here.',
        },
        'year': YEAR,
        'diwali': diwali.isoformat(),
        'days': days,
        'past': past,
        'day_of_2026': d0,
    }


def nice(iso):
    d = date.fromisoformat(iso)
    return f'{DAYS[d.weekday()]} {d.day} {MONTHS[d.month - 1]}'


def short(iso):
    d = date.fromisoformat(iso)
    return f'{DAYS[d.weekday()][:3]} {d.day} {MONTHS[d.month - 1][:3]}'


def block(data):
    days = data['days']
    after = days[3]
    published = 'aqi' in after
    d0 = days[2]
    past = data['past']
    rose = [v['day_after'] - v['day_of'] for v in past.values() if v['day_after'] > v['day_of']]
    fell = [v for v in past.values() if v['day_after'] < v['day_of']]
    n = len(past)
    ranked = sorted([v['day_of'] for v in past.values()] + [d0['aqi']], reverse=True)
    rank = ranked.index(d0['aqi']) + 1
    ordinal = {1: 'highest', 2: 'second highest', 3: 'third highest', 4: 'fourth highest'}.get(rank)

    cells = []
    for item in days:
        label = short(item['date'])
        tag = ''
        if item['offset'] == 0:
            tag = '<span class="dm-tag">Diwali</span>'
        elif item['offset'] == 1:
            tag = '<span class="dm-tag">Morning after</span>'
        if 'aqi' in item:
            body = (f'<span class="dm-aqi">{item["aqi"]}</span>'
                    f'<span class="dm-cat">{item["category"]}</span>'
                    f'<span class="dm-st">{item["stations"]} of {item["stations_total"]} stations</span>')
        else:
            body = ('<span class="dm-aqi dm-wait">Due 4 pm</span>'
                    '<span class="dm-cat">CPCB issues the bulletin at 4 pm</span>'
                    '<span class="dm-st">No figure until then</span>')
        cells.append(f'<li class="dm-cell"><span class="dm-date">{label}</span>{tag}{body}</li>')

    rows = []
    for y, v in sorted(past.items()):
        change = v['day_after'] - v['day_of']
        sign = '+' if change > 0 else ('-' if change < 0 else '')
        rows.append(f'<tr><th scope="row">{y}</th><td>{short(v["diwali"])}</td>'
                    f'<td>{v["day_of"]}</td><td>{v["day_after"]}</td><td>{sign}{abs(change)}</td></tr>')
    if published:
        a = after['aqi']
        change = a - d0['aqi']
        sign = '+' if change > 0 else ('-' if change < 0 else '')
        rows.append(f'<tr class="dm-now"><th scope="row">{data["year"]}</th><td>{short(data["diwali"])}</td>'
                    f'<td>{d0["aqi"]}</td><td>{a}</td><td>{sign}{abs(change)}</td></tr>')
    else:
        rows.append(f'<tr class="dm-now"><th scope="row">{data["year"]}</th><td>{short(data["diwali"])}</td>'
                    f'<td>{d0["aqi"]}</td><td>Due 4 pm</td><td></td></tr>')

    lead = (f'Diwali fell on {nice(data["diwali"])}. ')
    if published:
        lead += (f'CPCB’s bulletin for {nice(after["date"])}, which covers the night of the fireworks, '
                 f'put Delhi at AQI {after["aqi"]} ({after["category"]}), '
                 f'from {after["stations"]} of {after["stations_total"]} stations.')
    else:
        lead += (f'CPCB’s bulletin for {nice(after["date"])} covers the night of the fireworks. '
                 'It is issued at 4 pm, so this page shows no number for it until then.')

    findings = (f'In {len(rose)} of the {n} years from 2019 to 2025, the bulletin for the day after Diwali was higher '
                f'than the one for Diwali day, by {min(rose)} to {max(rose)} points')
    if fell:
        findings += (f'; in {", ".join(str(y) for y, v in sorted(past.items()) if v["day_after"] < v["day_of"])} '
                     f'it was {abs(fell[0]["day_after"] - fell[0]["day_of"])} points lower')
    findings += '. '
    if ordinal:
        findings += f'This year’s Diwali-day figure, {d0["aqi"]}, is the {ordinal} of the {n + 1} Diwali-day figures from 2019 to {data["year"]}.'

    return (
        f'{START}\n'
        '<section class="dm" id="section-diwali-morning" aria-labelledby="dm-title">\n'
        '  <span class="dm-eyebrow">Diwali 2026</span>\n'
        '  <h2 class="dm-title" id="dm-title">Delhi’s air the morning after Diwali</h2>\n'
        f'  <p class="dm-lead">{lead}</p>\n'
        '  <ol class="dm-days">\n    ' + '\n    '.join(cells) + '\n  </ol>\n'
        f'  <p class="dm-find">{findings}</p>\n'
        '  <p class="dm-find">Some stations were not reporting. ThePrint reported on 9 November that data from 10 of '
        'Delhi’s 59 monitoring stations was missing on Monday morning, among them RK Puram, PUSA, NSIT Dwarka and '
        'Nehru Nagar, which had each recorded an AQI above 400 on Sunday. Because the city figure is an average of the '
        'stations, ThePrint noted that the gaps could skew it. ThePrint also reported that as many as 28 of 39 stations went blank '
        'the morning after Diwali in 2025 '
        '(<a href="https://theprint.in/feature/theres-a-data-gap-in-delhis-post-diwali-pollution-picture/3093881/" '
        'rel="noopener">ThePrint, 9 November 2026</a>). The Hindustan Times found the same pattern that year: its analysis of CPCB '
        'and DPCC data showed only 9 stations, about 23% of the network, recorded continuous data on Diwali night '
        '(<a href="https://www.hindustantimes.com/cities/delhi-news/delhis-air-monitors-fail-at-key-moments-101761071267584.html" '
        'rel="noopener">Hindustan Times, 22 October 2025</a>).</p>\n'
        '  <div class="dm-table-wrap" tabindex="0" role="region" aria-label="Delhi AQI on Diwali day and the day after, 2019 to 2026">\n'
        '  <table class="dm-table">\n'
        '    <caption>Delhi, CPCB 24-hour AQI</caption>\n'
        '    <thead><tr><th scope="col">Year</th><th scope="col">Diwali</th><th scope="col">Diwali day</th>'
        '<th scope="col">Day after</th><th scope="col">Change</th></tr></thead>\n'
        '    <tbody>\n      ' + '\n      '.join(rows) + '\n    </tbody>\n  </table>\n  </div>\n'
        '  <p class="dm-src">Source: CPCB daily AQI bulletins, one figure for the whole city over 24 hours, '
        'issued at 4 pm. 2019 to 2025 from the UrbanEmissions.Info extraction of the same bulletins. '
        'Diwali dates are the gazetted holiday each year. The station count is CPCB\u2019s own and does not say that every hour was complete. '
        'A city figure cannot separate firework smoke from stubble smoke or weather. <a href="/delhi/diwali-2026/">Delhi after Diwali 2026</a> has the station-by-station '
        'figures for the night and the morning after, and <a href="/delhi/">the Delhi page</a> draws the whole '
        'season against 2019 to 2025.</p>\n'
        '</section>\n'
        f'{END}'
    )


def page_with(html, new):
    if START in html and END in html:
        a = html.index(START)
        b = html.index(END) + len(END)
        return html[:a] + new + html[b:]
    anchor = '                <section class="askhome" id="section-askhome">'
    if anchor not in html:
        sys.exit('FAIL: cannot find the askhome section to place the block before.')
    return html.replace(anchor, new + '\n\n' + anchor, 1)


def main():
    check = '--check' in sys.argv
    data = build()
    text = json.dumps(data, indent=1, ensure_ascii=False) + '\n'
    html = PAGE.read_text(encoding='utf-8')
    new_html = page_with(html, block(data))
    if check:
        bad = []
        if not OUT.exists() or OUT.read_text(encoding='utf-8') != text:
            bad.append('data/diwali-morning.json is stale')
        if new_html != html:
            bad.append('the diwali block in index.html is stale')
        if bad:
            print('FAIL: ' + '; '.join(bad) + '. Run python3 scripts/build-diwali-morning.py')
            return 1
        print('PASS - diwali block and data match the CPCB bulletin file.')
        return 0
    OUT.write_text(text, encoding='utf-8')
    PAGE.write_text(new_html, encoding='utf-8')
    print('wrote data/diwali-morning.json and the diwali block in index.html')
    return 0


if __name__ == '__main__':
    sys.exit(main())
