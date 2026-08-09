#!/usr/bin/env node
/**
 * build-village-stats.mjs — district-level village air summary for the chatbot.
 *
 * Ask JanVayu could quote national village aggregates but could not answer
 * "how is the air where I live" for anywhere rural, because the function
 * shipped no village data at all — only ward-stats.json.
 *
 * A full village name index is not the answer: 584,601 villages with annual
 * PM2.5 come to ~79 MB as a name lookup, and 15% of village names occur in
 * more than one district anyway ("Rampur" is not a unique address). So this
 * ships the DISTRICT as the unit — 645 records, ~100 KB — with each
 * district's village count, mean/min/max annual PM2.5, how many villages
 * exceed India's limit, and the dirtiest and cleanest village by name so
 * answers can be concrete rather than statistical.
 *
 * Since v26.6.154 it also carries what build-village-layers.py wrote in:
 * surface heat, tree/green/built-up cover, and air by season. Three different
 * timescales in one record, so each is summarised separately and labelled with
 * its own year — a district's tree cover is 2021, its heat a 2026 pre-monsoon
 * composite, its seasons 2024. The chatbot must not blend them, and it cannot
 * keep them apart if this file hands it one undifferentiated blob.
 *
 * The median is given alongside the mean throughout, because "the typical
 * village" is the question people are actually asking and a mean over a
 * district containing one town is not it.
 *
 * Run:  node scripts/build-village-stats.mjs
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'data', 'villages');
const OUT = join(ROOT, 'netlify', 'functions', 'data', 'village-stats.json');

const idx = JSON.parse(await readFile(join(SRC, '_index.json'), 'utf8'));
const out = { _meta: idx._meta || {}, districts: {} };
let nDist = 0, nVill = 0;

for (const file of (await readdir(SRC)).filter(f => f.endsWith('.json') && !f.startsWith('_'))) {
    const id = file.replace(/\.json$/, '');
    const topo = JSON.parse(await readFile(join(SRC, file), 'utf8'));
    const layer = topo.objects[Object.keys(topo.objects)[0]];
    const rows = [];
    for (const g of layer.geometries) {
        const p = g.properties || {};
        if (p.p == null) continue;
        rows.push({ n: (p.n || '').trim(), p: p.p, d: p.d, s: p.st,
                    h: p.h, t: p.t, g: p.g, b: p.b,
                    w: p.w, su: p.s, r: p.r, o: p.o });
    }
    if (!rows.length) continue;
    rows.sort((a, b) => a.p - b.p);
    const vals = rows.map(r => r.p);
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    // Named extremes only — a blank name helps nobody read the answer.
    const named = rows.filter(r => r.n);
    const meta = idx[id] || {};

    // mean + median + how many villages the figure is actually based on, so a
    // district where heat is missing for half its villages says so rather than
    // quietly averaging the half it has.
    const summarise = (key) => {
        const v = rows.map(r => r[key]).filter(x => typeof x === 'number').sort((a, b) => a - b);
        if (!v.length) return null;
        return { mean: +(v.reduce((a, b) => a + b, 0) / v.length).toFixed(1),
                 med: +v[Math.floor(v.length / 2)].toFixed(1), n: v.length };
    };
    // The greenest and barest village by name, on tree canopy rather than
    // "green cover" — green counts cropland, so in rural India it is near 100
    // everywhere and naming the "greenest village" by it would be noise.
    const treed = named.filter(r => typeof r.t === 'number').sort((a, b) => a.t - b.t);
    const seasons = { w: summarise('w'), s: summarise('su'), r: summarise('r'), o: summarise('o') };
    const haveSeasons = Object.values(seasons).every(Boolean);
    out.districts[id] = {
        d: meta.d || rows[0].d,
        s: meta.s || rows[0].s,
        v: rows.length,
        mean: +mean.toFixed(1),
        min: +vals[0].toFixed(1),
        max: +vals[vals.length - 1].toFixed(1),
        med: +vals[Math.floor(vals.length / 2)].toFixed(1),
        over40: vals.filter(v => v > 40).length,
        worst: named.length ? { n: named[named.length - 1].n, p: named[named.length - 1].p } : null,
        best: named.length ? { n: named[0].n, p: named[0].p } : null,
        // Land and heat, on their own timescales — see the header note.
        heat: summarise('h'),
        tree: summarise('t'),
        green: summarise('g'),
        built: summarise('b'),
        treeExt: treed.length >= 2
            ? { most: { n: treed[treed.length - 1].n, t: treed[treed.length - 1].t },
                least: { n: treed[0].n, t: treed[0].t } }
            : null,
        seasons: haveSeasons
            ? { w: seasons.w.mean, s: seasons.s.mean, r: seasons.r.mean, o: seasons.o.mean }
            : null,
    };
    nDist++; nVill += rows.length;
}

await writeFile(OUT, JSON.stringify(out));
const kb = (JSON.stringify(out).length / 1024).toFixed(0);
console.log(`village-stats.json — ${nDist} districts, ${nVill} villages, ${kb} KB`);
