#!/usr/bin/env python3
"""
build-diagrams.py — regenerate the hand-drawn blog diagrams, wide and tall.

Two problems this fixes, both reported by a reader looking at the site on a
phone.

**They were not hand-drawn.** The homepage diagram came out of Excalidraw, so
its edges wobble. Diagrams authored since used plain <rect>, which next to the
real ones reads as a different kind of object — same lettering, wrong geometry.
scripts/lib/handdrawn.py supplies the sketchy strokes; this file supplies the
content.

**They were not responsive.** The blog already had the mechanism: .jv-dgm-wide
is a scrollable desktop version and .jv-dgm-tall a narrow one that takes over
below 680px, and two older posts use the pair. The newer diagrams shipped as a
bare <img>, so on a phone a 980-wide drawing was squeezed into 360 and its 11px
labels became unreadable. Every diagram here is emitted twice: a wide landscape
version and a tall one laid out in a single column for a phone.

Run:  python3 scripts/build-diagrams.py
Writes: blog/diagrams/<name>.svg and <name>-tall.svg
"""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'scripts' / 'lib'))

import handdrawn as hd  # noqa: E402

OUT = ROOT / 'blog' / 'diagrams'

INK = '#1e2a22'
GREEN = '#146c33'
AMBER = '#8a5300'
RED = '#b91c1c'
BLUE = '#075985'
MUTE = '#5b6b60'
PAPER = '#fbfaf7'
GREEN_BG = '#dcfce7'
AMBER_BG = '#fdf0d5'
BLUE_BG = '#e0f2fe'
RED_BG = '#fee2e2'


TITLE_GAP = 26      # baseline of the title below the box top
BODY_GAP = 22       # first body baseline below the title
LINE = 16.5
PAD_BOTTOM = 12


def panel_height(lines, ts=14.5):
    """How tall a panel has to be for its text to fit inside it.

    Hardcoded heights are how the first version of these diagrams shipped with
    "PM2.5 reaches here. Nothing sweeps it back out." hanging below its own box.
    Height is derived from the content instead, so editing a line cannot break
    the drawing.
    """
    return TITLE_GAP + BODY_GAP + LINE * max(0, len(lines) - 1) + PAD_BOTTOM


def panel(x, y, w, h, title, lines, fill=PAPER, stroke=INK, tcol=None, seed=0, ts=14.5):
    """A titled box with body lines. Pass h=None to size it to its content."""
    need = panel_height(lines, ts)
    h = need if h is None else max(h, need)
    o = [hd.box(x, y, w, h, fill=fill, stroke=stroke, seed=seed)]
    o.append(hd.text(x + 15, y + TITLE_GAP, title, size=ts, fill=tcol or stroke, weight=700))
    yy = y + TITLE_GAP + BODY_GAP
    for ln in lines:
        o.append(hd.text(x + 15, yy, ln, size=11.6, fill=MUTE))
        yy += LINE
    return ''.join(o)


# ── 1. Why PM2.5 ────────────────────────────────────────────────────────────

PM_LABEL = ("Why PM2.5 is the number that matters: PM10 is about 10 micrometres and PM2.5 is "
            "2.5 micrometres or less, drawn to scale with each other, while a human hair at 70 "
            "micrometres would be 28 times wider than the PM2.5 dot. The nose and throat catch "
            "most PM10 and cilia sweep more of it back out, but PM2.5 reaches the alveoli and "
            "crosses into the bloodstream. PM2.5 is measured in micrograms per cubic metre, with "
            "India's annual limit at 40 and the WHO guideline at 5. AQI is a unitless index that "
            "reports only whichever of six pollutants scores worst, so two cities at the same AQI "
            "can be breathing very different PM2.5.")


def pm25_wide():
    o = [hd.text(480, 34, 'Why PM2.5 is the number that matters', size=25, fill=RED, weight=700, anchor='middle'),
         hd.text(480, 57, 'size decides how deep it goes · and how deep it goes decides what it does',
                 size=14, fill=MUTE, anchor='middle')]
    o.append(hd.text(30, 96, 'HOW BIG, ACTUALLY', size=13.5, fill=MUTE, weight=700))
    # a hair, not to scale, drawn as a strand
    o.append('<path d="M62 120 C 96 154, 62 208, 96 244" stroke="#9ca3af" stroke-width="13" fill="none" stroke-linecap="round"/>')
    o.append(hd.text(84, 272, 'hair', size=13.5, fill='#374151', weight=700, anchor='middle'))
    o.append(hd.text(84, 291, '~70 µm', size=12, fill=MUTE, anchor='middle'))
    o.append(hd.circle(212, 176, 20, fill=AMBER_BG, stroke=AMBER, seed=7))
    o.append(hd.text(212, 216, 'PM10', size=13.5, fill=AMBER, weight=700, anchor='middle'))
    o.append(hd.text(212, 236, '~10 µm', size=12, fill=MUTE, anchor='middle'))
    o.append(hd.text(212, 252, 'dust, grit, pollen', size=11.4, fill=MUTE, anchor='middle'))
    o.append(hd.circle(340, 176, 5, fill=RED, stroke='#7f1d1d', sw=1.5, roughness=0.5, seed=9))
    o.append(hd.text(340, 216, 'PM2.5', size=13.5, fill=RED, weight=700, anchor='middle'))
    o.append(hd.text(340, 236, '2.5 µm or less', size=12, fill=MUTE, anchor='middle'))
    o.append(hd.text(340, 252, 'smoke, soot, exhaust', size=11.4, fill=MUTE, anchor='middle'))
    o.append(f'<path d="{hd.hand_line(56, 312, 410, 312, seed=21)}" fill="none" stroke="{MUTE}" stroke-width="1.6"/>')
    o.append(hd.text(30, 332, 'The two circles are exactly to scale with each other. The hair is not —', size=11.4, fill=MUTE))
    o.append(hd.text(30, 348, 'at that scale it would be 28× wider than the red dot and would not fit.', size=11.4, fill=MUTE))

    o.append(hd.text(470, 96, 'WHERE EACH ONE STOPS', size=13.5, fill=MUTE, weight=700))
    o.append(panel(466, 110, 238, None, 'Nose & throat', ['catch most of PM10 here'], AMBER_BG, AMBER, seed=31))
    o.append(panel(466, 188, 238, None, 'Windpipe & bronchi', ['cilia sweep much of it back out'], AMBER_BG, AMBER, seed=32))
    o.append(panel(466, 270, 238, None, 'Alveoli — the air sacs', ['PM2.5 reaches here. Nothing', 'sweeps it back out.'], RED_BG, RED, seed=33))
    o.append(panel(466, 368, 238, None, 'Bloodstream', ['heart, brain, placenta —', 'it does not stay in the lungs'], RED_BG, RED, seed=34))
    for y1, y2 in [(170, 186), (248, 268), (347, 366)]:
        o.append(hd.arrow(585, y1, 585, y2, stroke=RED, seed=int(y1)))
    o.append(hd.arrow(356, 176, 462, 296, stroke=RED, seed=41))
    o.append(hd.text(372, 150, 'PM2.5 goes', size=11.4, fill=RED))
    o.append(hd.text(372, 166, 'straight past', size=11.4, fill=RED))

    o.append(hd.text(748, 96, 'TWO WAYS TO SAY IT', size=13.5, fill=MUTE, weight=700))
    o.append(panel(744, 110, 196, 152, 'PM2.5',
                   ['micrograms per cubic', 'metre — a real amount', 'of a real substance'],
                   GREEN_BG, GREEN, seed=51))
    o.append(hd.text(759, 222, "India's limit: 40", size=12.6, fill=GREEN, weight=700))
    o.append(hd.text(759, 243, 'WHO guideline: 5', size=12.6, fill=GREEN, weight=700))
    o.append(panel(744, 278, 196, 200, 'AQI',
                   ['an index, no unit. Takes', 'whichever of six pollutants', 'scores worst and reports',
                    'only that one.'], PAPER, INK, seed=52))
    o.append(hd.text(759, 404, 'Two cities at AQI 180', size=11.4, fill=AMBER))
    o.append(hd.text(759, 420, 'can breathe very', size=11.4, fill=AMBER))
    o.append(hd.text(759, 436, 'different PM2.5 — and', size=11.4, fill=AMBER))
    o.append(hd.text(759, 452, 'India and the US scale', size=11.4, fill=AMBER))
    o.append(hd.text(759, 468, 'it differently.', size=11.4, fill=AMBER))

    o.append(hd.text(30, 508, 'So: JanVayu leads with PM2.5', size=15, fill=RED, weight=700))
    o.append(hd.text(30, 531, 'AQI is useful for one thing — a quick "is today bad?" — and useless for comparing places, comparing', size=12.4, fill=MUTE))
    o.append(hd.text(30, 550, 'years, or checking a target. Every limit, every health study and every promise India has made is', size=12.4, fill=MUTE))
    o.append(hd.text(30, 569, 'written in µg/m³ of PM2.5. We show AQI beside it, never instead of it.', size=12.4, fill=MUTE))
    o.append(hd.text(30, 596, 'Sizes: US EPA. Deposition: WHO Global Air Quality Guidelines 2021. Limits: CPCB NAAQS (40 µg/m³ annual), WHO 2021 (5 µg/m³ annual).', size=11, fill=AMBER))
    return hd.svg(980, 620, ''.join(o), PM_LABEL)


def pm25_tall():
    o = [hd.text(200, 32, 'Why PM2.5 matters', size=21, fill=RED, weight=700, anchor='middle'),
         hd.text(200, 54, 'size decides how deep it goes', size=12.5, fill=MUTE, anchor='middle')]
    o.append(hd.circle(70, 110, 22, fill=AMBER_BG, stroke=AMBER, seed=7))
    o.append(hd.text(70, 148, 'PM10', size=13, fill=AMBER, weight=700, anchor='middle'))
    o.append(hd.text(70, 165, '~10 µm', size=11.5, fill=MUTE, anchor='middle'))
    o.append(hd.circle(190, 110, 5.5, fill=RED, stroke='#7f1d1d', sw=1.5, roughness=0.5, seed=9))
    o.append(hd.text(190, 148, 'PM2.5', size=13, fill=RED, weight=700, anchor='middle'))
    o.append(hd.text(190, 165, '2.5 µm or less', size=11.5, fill=MUTE, anchor='middle'))
    o.append(hd.text(310, 110, '~30× thinner', size=12, fill=AMBER, anchor='middle'))
    o.append(hd.text(310, 128, 'than a hair', size=12, fill=AMBER, anchor='middle'))
    o.append(hd.text(20, 192, 'To scale with each other.', size=11.5, fill=MUTE))

    y = 214
    for title, lines, bg, st in [
        ('Nose & throat', ['catch most of PM10'], AMBER_BG, AMBER),
        ('Windpipe & bronchi', ['cilia sweep much of it out'], AMBER_BG, AMBER),
        ('Alveoli — the air sacs', ['PM2.5 reaches here.', 'Nothing sweeps it out.'], RED_BG, RED),
        ('Bloodstream', ['heart, brain, placenta'], RED_BG, RED),
    ]:
        h = 54 + 16 * (len(lines) - 1)
        o.append(panel(18, y, 364, h, title, lines, bg, st, seed=int(y), ts=13.5))
        if title != 'Bloodstream':
            o.append(hd.arrow(200, y + h, 200, y + h + 16, stroke=RED, seed=int(y) + 3))
        y += h + 24

    o.append(panel(18, y, 364, 96, 'PM2.5 — µg/m³',
                   ["a real amount of a real substance", "India's limit 40 · WHO guideline 5"], GREEN_BG, GREEN, seed=71, ts=13.5))
    y += 116
    o.append(panel(18, y, 364, 118, 'AQI — an index, no unit',
                   ['reports only whichever of six', 'pollutants scores worst. Two cities',
                    'at AQI 180 can breathe very', 'different PM2.5.'], PAPER, INK, seed=72, ts=13.5))
    y += 138
    o.append(hd.text(20, y, 'JanVayu leads with PM2.5.', size=13.5, fill=RED, weight=700))
    o.append(hd.text(20, y + 20, 'Every Indian limit and every health', size=11.5, fill=MUTE))
    o.append(hd.text(20, y + 36, 'study is written in µg/m³ of PM2.5.', size=11.5, fill=MUTE))
    return hd.svg(400, y + 56, ''.join(o), PM_LABEL)


# ── 2. How to read the map ──────────────────────────────────────────────────

MAP_LABEL = ("How to read the JanVayu map. The coloured dots are live readings from about 565 CPCB "
             "monitors updated hourly; the shading underneath is a satellite estimate averaged over a "
             "whole year, and the two are never one sentence. Pick one of seven levels from the "
             "Boundaries menu covering 983,149 areas, pick one of nine measures from the Colour menu, "
             "then tap any area. Green cover counts cropland, so the typical Indian district is 97% "
             "green and 14% treed — use tree cover if you want to know about trees.")


def map_wide():
    o = [hd.text(490, 34, 'How to read the map', size=25, fill=GREEN, weight=700, anchor='middle'),
         hd.text(490, 57, 'two timescales · seven levels · nine measures · one tap', size=14, fill=MUTE, anchor='middle')]
    o.append(hd.text(30, 94, 'FIRST: TWO DIFFERENT THINGS', size=13.5, fill=MUTE, weight=700))
    o.append(hd.box(26, 108, 272, 92, fill=BLUE_BG, stroke=BLUE, seed=101))
    o.append(hd.circle(56, 138, 9, fill='#dc2626', stroke='#7f1d1d', sw=1.4, roughness=0.5, seed=102))
    o.append(hd.text(76, 144, 'The dots = right now', size=14.5, fill=BLUE, weight=700))
    o.append(hd.text(42, 168, '~565 CPCB monitors, updated hourly.', size=11.6, fill=MUTE))
    o.append(hd.text(42, 186, 'Real machines, real readings.', size=11.6, fill=MUTE))
    o.append(hd.box(26, 214, 272, 106, fill=GREEN_BG, stroke=GREEN, seed=103))
    o.append(hd.box(42, 232, 20, 14, fill='#f97316', stroke='#9a3412', sw=1.4, roughness=0.6, seed=104))
    o.append(hd.text(76, 244, 'The shading = the year', size=14.5, fill=GREEN, weight=700))
    o.append(hd.text(42, 268, 'Satellite estimates, averaged over', size=11.6, fill=MUTE))
    o.append(hd.text(42, 286, 'all of 2024. Reaches everywhere,', size=11.6, fill=MUTE))
    o.append(hd.text(42, 304, 'including places with no monitor.', size=11.6, fill=MUTE))
    o.append(hd.box(26, 334, 272, 62, fill=RED_BG, stroke=RED, seed=105))
    o.append(hd.text(42, 358, 'Never one sentence', size=13.5, fill=RED, weight=700))
    o.append(hd.text(42, 379, "A yearly average is not today's air.", size=11.6, fill=MUTE))

    o.append(hd.text(344, 94, '1. PICK A LEVEL', size=13.5, fill=MUTE, weight=700))
    o.append(hd.box(340, 108, 200, 288, seed=111))
    rows = [('RURAL', MUTE), ('Village · 584,615', INK), ('Gram panchayat · 319,287', INK),
            ('Block/tehsil · 6,471', INK), ('URBAN', MUTE), ('Ward · 68,596', INK),
            ('City/ULB · 3,359', INK), ('EITHER WAY', MUTE), ('District · 785', INK), ('State/UT · 36', INK)]
    yy = 134
    for label, col in rows:
        o.append(hd.text(356, yy, label, size=12.2, fill=col))
        yy += 22 if col == INK else 24
    o.append(hd.text(356, 384, '983,149 areas in all', size=12.4, fill=GREEN, weight=700))

    o.append(hd.text(590, 94, '2. PICK A COLOUR', size=13.5, fill=MUTE, weight=700))
    o.append(hd.box(586, 108, 196, 288, seed=121))
    rows2 = [('AIR', MUTE), ('Annual PM2.5', INK), ('Winter · Summer', INK), ('Monsoon · Post-monsoon', INK),
             ('THE GROUND', MUTE), ('Surface heat', INK), ('Tree cover', INK), ('Green cover', INK), ('Built-up', INK)]
    yy = 134
    for label, col in rows2:
        o.append(hd.text(602, yy, label, size=12.2, fill=col))
        yy += 22 if col == INK else 24
    o.append(hd.text(602, 356, 'Every area carries', size=11.4, fill=AMBER))
    o.append(hd.text(602, 372, 'all nine, at every level.', size=11.4, fill=AMBER))

    o.append(hd.text(828, 94, '3. TAP IT', size=13.5, fill=MUTE, weight=700))
    o.append(panel(824, 108, 130, None, 'You get', ['its name, all nine', 'numbers, and what', 'each one means'], GREEN_BG, GREEN, seed=131, ts=13.5))
    o.append(hd.text(840, 216, '"My area" jumps', size=11.4, fill=AMBER))
    o.append(hd.text(840, 231, 'straight there.', size=11.4, fill=AMBER))
    o.append(panel(824, 254, 130, None, 'Then Compare', ['Plot any two of', 'the nine against', 'each other, for', 'whatever is on', 'your screen.'], AMBER_BG, AMBER, seed=132, ts=13.5))
    o.append(hd.arrow(540, 250, 584, 250, stroke=GREEN, seed=141))
    o.append(hd.arrow(782, 198, 822, 180, stroke=GREEN, seed=142))

    o.append(hd.box(26, 422, 928, 76, fill=RED_BG, stroke=RED, seed=151))
    o.append(hd.text(46, 448, 'The one thing that will mislead you', size=14.5, fill=RED, weight=700))
    o.append(hd.text(46, 470, '"Green cover" counts cropland, shrub and grass as well as trees — so the typical Indian district reads 97% green and 14% treed,', size=12.2, fill=MUTE))
    o.append(hd.text(46, 489, 'and in Nagaur it is 98% green and 0% treed. If you want to know about trees, use tree cover — it is the one that tracks heat.', size=12.2, fill=MUTE))
    o.append(hd.text(26, 528, 'Air: SatPM2.5 V6GL03 (ACAG/WashU), 2024. Heat: Landsat 8/9, 2026 pre-monsoon. Land cover: ESA WorldCover 2021. Boundaries: LGD & SBM via indianopenmaps.com.', size=11, fill=AMBER))
    return hd.svg(980, 556, ''.join(o), MAP_LABEL)


def map_tall():
    o = [hd.text(200, 32, 'How to read the map', size=21, fill=GREEN, weight=700, anchor='middle'),
         hd.text(200, 54, 'two timescales · seven levels · nine measures', size=12, fill=MUTE, anchor='middle')]
    y = 74
    o.append(hd.box(18, y, 364, 78, fill=BLUE_BG, stroke=BLUE, seed=201))
    o.append(hd.circle(44, y + 26, 8, fill='#dc2626', stroke='#7f1d1d', sw=1.4, roughness=0.5, seed=202))
    o.append(hd.text(62, y + 31, 'The dots = right now', size=13.5, fill=BLUE, weight=700))
    o.append(hd.text(32, y + 54, '~565 CPCB monitors, hourly.', size=11.4, fill=MUTE))
    y += 96
    o.append(hd.box(18, y, 364, 92, fill=GREEN_BG, stroke=GREEN, seed=203))
    o.append(hd.box(32, y + 18, 18, 13, fill='#f97316', stroke='#9a3412', sw=1.4, roughness=0.6, seed=204))
    o.append(hd.text(62, y + 30, 'The shading = the year', size=13.5, fill=GREEN, weight=700))
    o.append(hd.text(32, y + 54, 'Satellite, averaged over 2024.', size=11.4, fill=MUTE))
    o.append(hd.text(32, y + 72, 'Reaches everywhere.', size=11.4, fill=MUTE))
    y += 110
    o.append(hd.box(18, y, 364, 52, fill=RED_BG, stroke=RED, seed=205))
    o.append(hd.text(32, y + 23, 'Never one sentence', size=13, fill=RED, weight=700))
    o.append(hd.text(32, y + 41, "A yearly average is not today's air.", size=11.4, fill=MUTE))
    y += 74

    o.append(panel(18, y, 364, 132, '1. Pick a level',
                   ['Village 584,615 · Panchayat 319,287', 'Block 6,471 · Ward 68,596',
                    'City 3,359 · District 785 · State 36', '983,149 areas in all'], PAPER, INK, seed=211, ts=13.5))
    y += 152
    o.append(panel(18, y, 364, 132, '2. Pick a colour',
                   ['Annual PM2.5 · winter, summer,', 'monsoon, post-monsoon',
                    'Surface heat · tree, green, built-up', 'Every area carries all nine'], PAPER, INK, seed=212, ts=13.5))
    y += 152
    o.append(panel(18, y, 364, 96, '3. Tap it',
                   ['Its name and all nine numbers.', '"My area" jumps straight there.'], GREEN_BG, GREEN, seed=213, ts=13.5))
    y += 116
    o.append(hd.box(18, y, 364, 112, fill=RED_BG, stroke=RED, seed=214))
    o.append(hd.text(32, y + 26, 'The one thing that misleads', size=13, fill=RED, weight=700))
    o.append(hd.text(32, y + 48, '"Green cover" counts cropland, so the', size=11.3, fill=MUTE))
    o.append(hd.text(32, y + 65, 'typical district is 97% green and 14%', size=11.3, fill=MUTE))
    o.append(hd.text(32, y + 82, 'treed. For trees, use tree cover — it is', size=11.3, fill=MUTE))
    o.append(hd.text(32, y + 99, 'the one that tracks heat.', size=11.3, fill=MUTE))
    return hd.svg(400, y + 136, ''.join(o), MAP_LABEL)


# ── 3. How the boundary atlas is built ──────────────────────────────────────

ATLAS_LABEL = ("How the JanVayu boundary atlas is built: four sources — SatPM2.5 annual and monthly "
               "grids, Landsat 8/9 scenes, ESA WorldCover 2021 and boundary geometry — feed a national "
               "heat mosaic and a tile-major land-cover pass, then one zonal pass bakes nine numbers "
               "into every polygon: annual PM2.5, the same by season for winter, summer, monsoon and "
               "post-monsoon, surface heat, tree cover, green cover and built-up. Six administrative "
               "levels ship as PMTiles the browser reads by range request; villages carry the same nine "
               "numbers but are too many to tile, so they load one quantized file per district.")


def atlas_wide():
    o = [hd.text(490, 34, 'How the boundary atlas is built', size=25, fill=GREEN, weight=700, anchor='middle'),
         hd.text(490, 57, 'four sources · five passes · every polygon carries its own numbers',
                 size=14, fill=MUTE, anchor='middle')]

    o.append(hd.text(30, 92, 'WHAT WE START WITH', size=13.5, fill=MUTE, weight=700))
    o.append(panel(26, 104, 228, None, 'SatPM2.5 V6GL03',
                   ['~1 km, 2024 — annual grid', 'plus 12 monthly grids'], BLUE_BG, BLUE, seed=301))
    o.append(panel(26, 178, 228, None, 'Landsat 8/9 C2 L2',
                   ['1,516 scenes, 388 path/rows', 'pre-monsoon, cloud-masked'], BLUE_BG, BLUE, seed=302))
    o.append(panel(26, 252, 228, None, 'ESA WorldCover 2021',
                   ['10 m, 106 tiles over India', 'read at full resolution'], BLUE_BG, BLUE, seed=303))
    o.append(panel(26, 326, 228, None, 'Boundaries',
                   ['LGD · Swachh Bharat Mission', 'WB AMRUT · Living Atlas',
                    'deduplicated, panel cities folded in'], AMBER_BG, AMBER, seed=304))

    o.append(hd.text(300, 92, 'WHAT WE DO TO IT', size=13.5, fill=MUTE, weight=700))
    o.append(panel(296, 178, 212, None, 'National heat mosaic',
                   ['1,512 scenes → one ~111 m', 'grid. 22 min, 0 failures.'], PAPER, INK, seed=311))
    o.append(panel(296, 252, 212, None, 'Tile-major land cover',
                   ['open each tile once, walk it', 'in strips. 45.8 Gpx read.'], PAPER, INK, seed=312))
    o.append(panel(296, 420, 212, None, 'One zonal pass',
                   ['rasterise the polygons,', 'bincount against the grid',
                    'sub-pixel → point sample'], GREEN_BG, GREEN, seed=313, ts=15))

    o.append(hd.arrow(254, 135, 292, 448, stroke=GREEN, seed=321))
    o.append(hd.arrow(254, 208, 292, 208, stroke=GREEN, seed=322))
    o.append(hd.arrow(254, 282, 292, 282, stroke=GREEN, seed=323))
    o.append(hd.arrow(254, 366, 292, 466, stroke=AMBER, seed=324))
    o.append(hd.arrow(402, 244, 402, 416, stroke=GREEN, seed=325))
    o.append(hd.arrow(430, 318, 430, 416, stroke=GREEN, seed=326))

    o.append(hd.text(556, 92, 'WHAT EACH AREA CARRIES', size=13.5, fill=MUTE, weight=700))
    o.append(hd.box(552, 104, 196, 244, fill=GREEN_BG, stroke=GREEN, seed=331))
    rows = [('p', 'annual PM2.5'), ('h', 'surface heat'), ('t', 'tree cover'),
            ('g', 'green cover'), ('b', 'built-up')]
    yy = 130
    for k, label in rows:
        o.append(hd.text(568, yy, k, size=15, fill=GREEN, weight=700))
        o.append(hd.text(592, yy, label, size=14, fill=GREEN, weight=700))
        yy += 22
    o.append(hd.text(568, 243, 'w s r o', size=13.5, fill=GREEN, weight=700))
    o.append(hd.text(626, 243, 'the same, by season', size=13, fill=GREEN, weight=700))
    o.append(hd.text(568, 262, 'winter · summer · monsoon ·', size=11, fill=MUTE))
    o.append(hd.text(568, 277, 'post-monsoon', size=11, fill=MUTE))
    o.append(hd.text(568, 300, 'plus name, code, parent city', size=11, fill=MUTE))
    o.append(hd.text(568, 324, '99.8–100% filled', size=11, fill=AMBER))
    o.append(hd.arrow(508, 460, 548, 330, stroke=GREEN, seed=341))

    o.append(hd.text(790, 92, 'AT SEVEN LEVELS', size=13.5, fill=MUTE, weight=700))
    o.append(hd.box(786, 104, 168, 244, seed=351))
    levels = ['State · 36', 'District · 785', 'Block/tehsil · 6,471', 'Panchayat · 319,287',
              'City/ULB · 3,359', 'Ward · 68,596', 'Village · 584,615']
    yy = 128
    for lv in levels:
        o.append(hd.text(800, yy, lv, size=12.2, fill=INK))
        yy += 22
    o.append(hd.text(800, 292, 'same nine numbers, but a', size=10.5, fill=AMBER))
    o.append(hd.text(800, 306, '267 MB tile cannot ship —', size=10.5, fill=AMBER))
    o.append(hd.text(800, 320, 'one file per district instead', size=10.5, fill=AMBER))
    o.append(hd.text(800, 340, 'urban and rural, one menu', size=11, fill=MUTE))
    o.append(hd.arrow(748, 200, 782, 200, stroke=GREEN, seed=361))

    o.append(hd.box(552, 420, 402, 86, fill=AMBER_BG, stroke=AMBER, seed=371))
    o.append(hd.text(568, 446, 'Shipped as PMTiles', size=15, fill=AMBER, weight=700))
    o.append(hd.text(568, 468, 'one file per level; the browser asks only for the byte ranges', size=11.4, fill=MUTE))
    o.append(hd.text(568, 484, 'on screen — Delhi NCR draws ~700 wards from about 120 KB', size=11.4, fill=MUTE))
    o.append(hd.text(568, 500, 'of a 42 MB archive', size=11.4, fill=MUTE))
    o.append(hd.arrow(870, 350, 870, 416, stroke=MUTE, seed=381))

    o.append(hd.text(26, 546, 'The point of the shape', size=15, fill=GREEN, weight=700))
    o.append(hd.text(26, 568, 'Every layer is one national raster and one zonal pass. Nothing is computed per city, so adding a level costs a pass, not a list.', size=12.4, fill=MUTE))
    o.append(hd.text(26, 588, 'Heat used to be a per-city satellite search run 3,675 times — that is why it reached 142 cities and left holes. It does not any more.', size=12.4, fill=MUTE))
    o.append(hd.text(26, 612, 'Green counts cropland, so outside cities it says little; tree cover is canopy alone and is the one that tracks heat (r = −0.43 nationally).', size=11.4, fill=AMBER))
    return hd.svg(980, 640, ''.join(o), ATLAS_LABEL)


def atlas_tall():
    o = [hd.text(200, 32, 'How the atlas is built', size=21, fill=GREEN, weight=700, anchor='middle'),
         hd.text(200, 54, 'four sources · five passes · nine numbers', size=12, fill=MUTE, anchor='middle')]
    y = 74
    o.append(hd.text(20, y, 'WHAT WE START WITH', size=12, fill=MUTE, weight=700))
    y += 14
    for title, lines, bg, st, sd in [
        ('SatPM2.5 V6GL03', ['~1 km, 2024 annual +', '12 monthly grids'], BLUE_BG, BLUE, 401),
        ('Landsat 8/9', ['1,516 scenes, pre-monsoon', 'cloud-masked'], BLUE_BG, BLUE, 402),
        ('ESA WorldCover 2021', ['10 m, 106 tiles over India'], BLUE_BG, BLUE, 403),
        ('Boundaries', ['LGD · SBM · WB AMRUT ·', 'Living Atlas, deduplicated'], AMBER_BG, AMBER, 404),
    ]:
        o.append(panel(18, y, 364, None, title, lines, bg, st, seed=sd, ts=13.5))
        y += panel_height(lines) + 12
    y += 8
    o.append(hd.arrow(200, y - 16, 200, y, stroke=GREEN, seed=411))
    o.append(hd.text(20, y + 18, 'WHAT WE DO TO IT', size=12, fill=MUTE, weight=700))
    y += 30
    for title, lines, sd in [
        ('National heat mosaic', ['1,512 scenes → one ~111 m grid', '22 min, 0 failures'], 421),
        ('Tile-major land cover', ['open each tile once, walk it', 'in strips. 45.8 Gpx read.'], 422),
    ]:
        o.append(panel(18, y, 364, None, title, lines, PAPER, INK, seed=sd, ts=13.5))
        y += panel_height(lines) + 12
    o.append(panel(18, y, 364, None, 'One zonal pass',
                   ['rasterise the polygons, bincount', 'against the grid; sub-pixel areas',
                    'fall back to a point sample'], GREEN_BG, GREEN, seed=423, ts=13.5))
    y += panel_height(['a', 'b', 'c']) + 20

    o.append(panel(18, y, 364, None, 'Every polygon then carries',
                   ['p annual PM2.5 · h surface heat', 't tree · g green · b built-up',
                    'w s r o — the same air by season', '99.8–100% filled'], GREEN_BG, GREEN, seed=431, ts=13.5))
    y += panel_height(['a', 'b', 'c', 'd']) + 20

    o.append(panel(18, y, 364, None, 'At seven levels',
                   ['State 36 · District 785', 'Block 6,471 · Panchayat 319,287',
                    'City 3,359 · Ward 68,596', 'Village 584,615'], PAPER, INK, seed=441, ts=13.5))
    y += panel_height(['a', 'b', 'c', 'd']) + 20

    o.append(panel(18, y, 364, None, 'Shipped as PMTiles',
                   ['the browser asks only for the byte', 'ranges on screen — Delhi NCR draws',
                    '~700 wards from 120 KB of 42 MB.', 'Villages: one file per district.'],
                   AMBER_BG, AMBER, seed=451, ts=13.5))
    y += panel_height(['a', 'b', 'c', 'd']) + 26

    o.append(hd.text(20, y, 'The point of the shape', size=13.5, fill=GREEN, weight=700))
    o.append(hd.text(20, y + 20, 'One national raster, one zonal pass.', size=11.4, fill=MUTE))
    o.append(hd.text(20, y + 36, 'Nothing is computed per city, so adding', size=11.4, fill=MUTE))
    o.append(hd.text(20, y + 52, 'a level costs a pass, not a list.', size=11.4, fill=MUTE))
    return hd.svg(400, y + 76, ''.join(o), ATLAS_LABEL)


DIAGRAMS = {
    'why-pm25': (pm25_wide, pm25_tall),
    'reading-the-map': (map_wide, map_tall),
    'atlas-layers': (atlas_wide, atlas_tall),
}


def main():
    for name, (wide, tall) in DIAGRAMS.items():
        (OUT / f'{name}.svg').write_text(wide(), encoding='utf8')
        (OUT / f'{name}-tall.svg').write_text(tall(), encoding='utf8')
        print(f'{name}.svg + {name}-tall.svg')


if __name__ == '__main__':
    main()
