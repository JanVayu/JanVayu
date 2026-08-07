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
        rows.push({ n: (p.n || '').trim(), p: p.p, d: p.d, s: p.s });
    }
    if (!rows.length) continue;
    rows.sort((a, b) => a.p - b.p);
    const vals = rows.map(r => r.p);
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    // Named extremes only — a blank name helps nobody read the answer.
    const named = rows.filter(r => r.n);
    const meta = idx[id] || {};
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
    };
    nDist++; nVill += rows.length;
}

await writeFile(OUT, JSON.stringify(out));
const kb = (JSON.stringify(out).length / 1024).toFixed(0);
console.log(`village-stats.json — ${nDist} districts, ${nVill} villages, ${kb} KB`);
