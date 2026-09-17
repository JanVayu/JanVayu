#!/usr/bin/env python3
"""Stop the three ways a colour choice survives light mode and fails dark mode.

A dark-mode sweep on 2026-09-17 measured every text element on all 56 panels in
both themes. It found 1,844 failing elements in dark and 1,233 in light, and
almost all of them came from three habits rather than from 3,000 separate
mistakes:

  1. **A themed background with hardcoded white text.** Twelve CSS rules said
     `background: var(--accent); color: #fff`. In light that is 6.52:1; in dark
     --accent becomes #4ADE80 and white drops to 1.74:1. The site already had
     the right token, `--on-accent`, and these rules simply did not use it.

  2. **A hardcoded light background with no text colour.** The GRAP stage cards
     set `background:#D1FAE5` and let the text inherit, so in dark mode they
     painted near-white ink on a pastel: 1.01 to 1.10:1. This is the same shape
     as the law-guide failure recorded in the repository notes.

  3. **A band colour written as a literal in JavaScript.** `getPM25TextColor()`
     returned dark shades and its own comment said they were "for use as TEXT on
     light backgrounds" — true, and the bug. #7e0023 measured 1.55:1 on 240
     elements across every panel. A colour picked in JS cannot know which theme
     it landed in, so the bands are tokens now.

**Why this is static and not the browser sweep.** The sweep is the better
instrument and lives at `tests/contrast-sweep.mjs`, but its counts move between
runs because the page shows live AQI and the bands change with it. A CI ratchet
on a number that drifts on its own would be a flaky check, and a flaky check
gets switched off. This one reads files and is deterministic.

    python3 scripts/check-theme-contrast.py
    node tests/contrast-sweep.mjs     # the full measurement, run by hand
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKIP_DIRS = {'node_modules', 'Backups', '.git', 'tests'}
# Standalone pages that load neither styles.css nor the theme tokens. They are
# light-only, so white on a tone is correct there and `var(--on-accent, #fff)`
# is how they say so.
NO_TOKENS = re.compile(r'^(pm25|pm10|co|no2|so2|o3|ask|TerraStudioCollab)/')

TONE_BG = r'background(?:-color)?\s*:\s*var\(--(?:accent|red|amber|green-700)'
WHITE = r'(?<!-)color\s*:\s*(?:#fff\b|#ffffff\b|white)\b'


def lum(hex_):
    h = hex_.lstrip('#')
    if len(h) == 3:
        h = ''.join(c * 2 for c in h)
    if len(h) != 6:
        return None
    def lin(c):
        c /= 255.0
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)


def html_files():
    for f in sorted(ROOT.rglob('*.html')):
        if any(p in SKIP_DIRS for p in f.parts):
            continue
        yield f


def main():
    problems = []

    # 1. CSS rules: themed background + hardcoded white text.
    css = (ROOT / 'styles.css').read_text(encoding='utf-8')
    for m in re.finditer(r'([^{}]+)\{([^{}]*)\}', css):
        body = m.group(2)
        if re.search(TONE_BG, body) and re.search(WHITE, body, re.I):
            line = css.count('\n', 0, m.start()) + 1
            problems.append((f'styles.css:{line}', m.group(1).strip()[:60],
                             'themed background with hardcoded white text; use var(--on-accent)'))

    # 2 and 3. Inline styles across HTML and the JS that writes them.
    for f in list(html_files()) + [ROOT / 'app.js']:
        rel = str(f.relative_to(ROOT))
        text = f.read_text(encoding='utf-8', errors='replace')
        exempt = bool(NO_TOKENS.match(rel))
        for m in re.finditer(r'style=["\']([^"\']*)["\']', text):
            st = m.group(1)
            line = text.count('\n', 0, m.start()) + 1
            if re.search(TONE_BG, st) and re.search(WHITE, st, re.I) and not exempt:
                problems.append((f'{rel}:{line}', st[:56],
                                 'themed background with hardcoded white text; use var(--on-accent)'))
            bg = re.search(r'background(?:-color)?\s*:\s*(#[0-9a-fA-F]{3,6})\b', st)
            if bg:
                probe = re.sub(r'(background|border)-color\s*:[^;]*;?', '', st)
                if not re.search(r'(?<!-)color\s*:', probe):
                    L = lum(bg.group(1))
                    if L is not None and L >= 0.45:
                        problems.append((f'{rel}:{line}', st[:56],
                                         f'light background {bg.group(1)} with no text colour; '
                                         f'dark mode will paint near-white ink on it'))

    # 3. Any function that hands back a colour for TEXT must hand back a token.
    #
    # This used to check two functions BY NAME, which is how pm25Band() survived
    # the first pass: it is a third band function, its .color is painted as text
    # in the forecast strip, and five of its seven literals failed in light
    # (#84CC16 at 1.96:1) while two failed in dark (#7F1D1D at 1.70:1). A guard
    # with a hardcoded list has the same blind spot as the audits it replaced.
    #
    # So the rule is structural: a function whose body is a ladder of colour
    # literals, and whose result is assigned to a `color:` somewhere, must
    # return var(). Swatch functions are exempt by name and by reason, because
    # a map polygon, a chart bar and a <canvas> cannot resolve a var().
    app = (ROOT / 'app.js').read_text(encoding='utf-8')
    SWATCH_OK = {
        # name: why it is allowed to return a literal
        'getAQIColor': 'swatch: chart bars, map polygons and the canvas share card',
        'getPM25Color': 'swatch: map polygons and legend chips',
        'onSwatchInk': 'returns the ink to paint ON a swatch; picks by contrast',
        'pm25Color': 'swatch: fillColor on a Leaflet circle marker',
        # This one is subtle and the reason has to be checked, not assumed. Its
        # result is painted as TEXT, but inside a Leaflet popup, and this site
        # adds no .leaflet-popup-content-wrapper rule at all, so the wrapper
        # keeps Leaflet's default white in BOTH themes. Light-only shades are
        # therefore correct there. If anyone ever themes that popup, these six
        # become invisible in dark mode and this entry must go.
        'pm25TextColor': 'text on a Leaflet popup, which this site leaves white in both themes',
    }
    for m in re.finditer(r'function (\w+)\s*\([^)]*\)\s*\{', app):
        name = m.group(1)
        body = app[m.end():m.end() + 2600]
        end = body.find('\n    }')
        if end != -1:
            body = body[:end]
        lits = re.findall(r"return\s+(?:\{[^}]*?color:\s*)?'(#[0-9a-fA-F]{3,6})'", body)
        if len(lits) < 3:
            continue                      # not a colour ladder
        if name in SWATCH_OK:
            continue
        # Whether the result is used as text cannot be decided by regex: pm25Band()
        # is assigned to a variable and interpolated as `color:${b.color}`, so
        # nothing textually ties the function to a colour property. A first
        # version of this check tried and silently passed, which is how the same
        # function escaped twice.
        #
        # So the burden is inverted. EVERY colour ladder must be classified: it
        # either returns tokens, or it is listed below with a reason. Adding a
        # legitimate swatch function costs one line; forgetting one fails.
        problems.append(('app.js', f'{name}() returns {len(lits)} colour literals',
                         'classify it: return var() tokens if the colour is painted as '
                         'text, or add it to SWATCH_OK with the reason it may stay a '
                         'literal (a canvas, a map polygon or a chart bar cannot resolve '
                         'a var())'))


    if problems:
        print(f'FAIL - {len(problems)} colour choice(s) that cannot work in both themes:\n')
        for where, what, why in problems:
            print(f'  {where}')
            print(f'    {what}')
            print(f'    -> {why}')
        return 1

    print('PASS - no themed background paired with hardcoded white text, no inline '
          'light background without an ink, and no colour-ladder function used as text returns literals.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
