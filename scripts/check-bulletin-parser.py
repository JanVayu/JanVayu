#!/usr/bin/env python3
"""Offline regression test for the CPCB bulletin row grammar.

The parser in `fetch-cpcb-bulletin.py` reads a live PDF, so it cannot be
tested in CI. Its one shipped defect was therefore invisible: every page of a
bulletin carries the header

    Air Quality Index on Jan 21 , 2026 @ 4 PM (Average of past 24 hours)

in which the day of the month is a bare token. Page two begins near serial 21,
so on the 21st of a month that header's `21` sat between row 20 and row 21. The
scanner matched the header, failed the grammar, advanced past serial 21, and
never read the real row. It cost one city on all eight 21sts of 2026 and on
2025-11-15, the date the parser was checked against when it shipped.

These fixtures carry the two published layouts and the collision, as text, so
the bug cannot come back without a red build. No network, no PDF.
"""
import importlib.util
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HEADER = ('Air Quality Index on {mon} {day} , {year} @ 4 PM (Average of past 24 hours) '
          'S.No City Air Quality Index Prominent Pollutant No. of Stations Participated/ '
          'Total Stations ')


def load():
    spec = importlib.util.spec_from_file_location(
        'fetch_cpcb', ROOT / 'scripts' / 'fetch-cpcb-bulletin.py')
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


CITIES = [
    'Agartala', 'Agra', 'Ahmedabad', 'Aizawl', 'Ajmer', 'Akola', 'Alwar',
    'Amaravati', 'Ambala', 'Amritsar', 'Anantapur', 'Angul', 'Ankleshwar',
    'Ariyalur', 'Arrah', 'Asansol', 'Aurangabad (Bihar)',
    'Aurangabad (Maharashtra)', 'Baddi', 'Badlapur', 'Bagalkot', 'Baghpat',
    'Bahadurgarh', 'Balasore', 'Ballabgarh',
]


def bulletin(day, rows_per_page, one_cell_per_line=False):
    """Build a bulletin whose page breaks fall every `rows_per_page` rows."""
    out = []
    for n, city in enumerate(CITIES, start=1):
        if (n - 1) % rows_per_page == 0:
            out.append(HEADER.format(mon='Jan', day=day, year='2026'))
        cells = [str(n), city, 'Moderate', str(100 + n), 'PM10', f'{1 + n % 3}/{1 + n % 3}']
        out.append('\n'.join(cells) if one_cell_per_line else ' '.join(cells))
    return '\n'.join(out)


def run(mod, name, text, expect_n):
    rows, skipped = mod.parse(text)
    serials = [r['serial'] for r in rows]
    gaps = [n for n in range(1, expect_n + 1) if n not in set(serials)]
    errs = []
    if gaps:
        errs.append(f'{name}: lost serial(s) {gaps}')
    if skipped:
        errs.append(f'{name}: {len(skipped)} skipped row(s): {skipped[:2]}')
    if len(rows) != expect_n:
        errs.append(f'{name}: {len(rows)} rows, expected {expect_n}')
    for r, want in zip(rows, CITIES):
        if r['city'] != want:
            errs.append(f'{name}: serial {r["serial"]} read {r["city"]!r}, expected {want!r}')
            break
    return errs


def main():
    mod = load()
    n = len(CITIES)
    errs = []

    # The collision itself: the day of the month equals the serial that follows
    # a page break. Swept across every row so a future layout change, which
    # moves where the page breaks fall, cannot quietly reopen it.
    for per_page in (10, 12, 20):
        for day in range(1, n + 1):
            errs += run(mod, f'day {day}, page break every {per_page}',
                        bulletin(day, per_page), n)

    # Both published layouts, one cell per line and one row per line.
    errs += run(mod, 'one cell per line', bulletin(21, 20, True), n)

    # A genuinely absent serial must not stop the parse: CPCB drops a city some
    # days, and the rows after it are still real.
    holed = bulletin(5, 20).replace('\n7 Ballabgarh', '\n7 Ballabgarh')
    lines = [l for l in bulletin(5, 20).split('\n') if not l.startswith('7 ')]
    rows, skipped = mod.parse('\n'.join(lines))
    got = [r['serial'] for r in rows]
    if 7 in got:
        errs.append('absent serial 7 was invented')
    if len(rows) != n - 1:
        errs.append(f'absent serial: {len(rows)} rows, expected {n - 1}')
    if not any(s.get('serial') == 7 for s in skipped):
        errs.append('absent serial 7 was not reported in skipped')

    if errs:
        print('FAIL -')
        for e in errs[:12]:
            print('  ' + e)
        return 1
    print(f'PASS - row grammar holds across {3 * n + 1} header/page-break '
          f'combinations and reports an absent serial without inventing it')
    return 0


if __name__ == '__main__':
    sys.exit(main())
