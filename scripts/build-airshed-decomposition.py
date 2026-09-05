#!/usr/bin/env python3
"""How much of a district's annual PM2.5 is its airshed, and how much is its town?

NCAP sets targets city by city. The data says that is not where most of the
variation lives. Regressing district annual PM2.5 on state alone, across all
785 districts, state identity accounts for the large majority of the variance:
the Indo-Gangetic Plain traps air over hundreds of kilometres, so a district in
Bihar and a district in Karnataka are not two towns that made different choices,
they are two airsheds.

This is the same decomposition that made us reject two global land-pressure
rasters (see analyse-land-pressure-vs-air.py): once state fixed effects are in,
almost nothing else moves. Rather than leave that as a negative result buried in
a script, this turns it into something a reader can look themselves up in.

For each district it records its own annual mean, its state's median, and the
gap between them, so the panel can say plainly: this much of your air is the
region you live in, this much is local.

Deliberately NOT a source attribution. A district sitting below its state median
is not "cleaner because of local policy"; it is lower than its neighbours for
reasons this figure cannot name. The panel says so.

Run:    python3 scripts/build-airshed-decomposition.py
Writes: data/airshed.json
"""

import json, statistics
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

pts = json.load(open(ROOT / 'data/district-points.json'))
feats = json.load(open(ROOT / 'data/openmaps/districts.json'))['features']

# districts.json carries the state; district-points.json carries the air value.
# Both are 785 records from the same LGD source, matched by name and centroid.
by_name = defaultdict(list)
for p in pts:
    by_name[p['n']].append(p)

rows = []
for g in feats:
    pr = g['properties']
    near = min(by_name[pr['dt']], key=lambda p: (p['lon'] - pr['cx']) ** 2 + (p['lat'] - pr['cy']) ** 2)
    rows.append({'dt': pr['dt'], 'st': pr['st'], 'pm': near['sat2024']})

state_vals = defaultdict(list)
for r in rows:
    state_vals[r['st']].append(r['pm'])
state_med = {s: round(statistics.median(v), 1) for s, v in state_vals.items()}
national = round(statistics.median([r['pm'] for r in rows]), 1)

# Variance decomposition: how much of the spread is between states rather than
# within them. This is the headline the panel leads with, so it is computed
# here from the same rows the panel reads, not quoted from a note.
grand = statistics.fmean([r['pm'] for r in rows])
ss_total = sum((r['pm'] - grand) ** 2 for r in rows)
ss_between = sum(len(v) * (statistics.fmean(v) - grand) ** 2 for v in state_vals.values())
between_share = ss_between / ss_total

for r in rows:
    r['sm'] = state_med[r['st']]
    r['gap'] = round(r['pm'] - state_med[r['st']], 1)

rows.sort(key=lambda r: (r['st'], r['dt']))
out = {
    '_meta': {
        'air': 'SatPM2.5 V6GL03 (ACAG / Washington University), 2024 annual mean, per district',
        'districts': len(rows),
        'states': len(state_med),
        'national_median': national,
        'between_state_variance_share': round(between_share, 3),
        'note': ('Share of the variance in district annual PM2.5 that lies between states '
                 'rather than within them. A district below its state median is not thereby '
                 'well governed: this figure names no cause.'),
    },
    'state_medians': dict(sorted(state_med.items(), key=lambda kv: -kv[1])),
    'districts': rows,
}
(ROOT / 'data/airshed.json').write_text(json.dumps(out, ensure_ascii=False, indent=1))

print(f'{len(rows)} districts across {len(state_med)} states/UTs')
print(f'national median {national} ug/m3')
print(f'between-state share of variance: {between_share:.1%}')
print('dirtiest states (median):', list(out['state_medians'].items())[:5])
print('cleanest states (median):', list(out['state_medians'].items())[-5:])
print('wrote data/airshed.json')
