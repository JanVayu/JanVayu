#!/usr/bin/env node
/**
 * import-livingatlas-wards.mjs — municipal wards from the ESRI India Living
 * Atlas layer, mirrored on indianopenmaps.com.
 *
 * This is the third and largest consequence of a lesson learned the hard way:
 * we had been downloading exactly one asset (SBM_Wards) out of a GitHub
 * release that holds several ward datasets, and concluding that whatever SBM
 * lacked did not exist. It did. `LivingAtlas_Wards` carries 9,100 wards across
 * 157 towns and — unlike SBM — reaches every state, including the five SBM
 * omits entirely.
 *
 * That closes every state capital we had written off: Srinagar, Agartala,
 * Imphal, Shillong, Itanagar, Aizawl, Kohima. Plus Madurai, and large cities
 * SBM simply never had (Kalyan-Dombivli, Vasai-Virar, Pimpri Chinchwad,
 * Gurugram, Bhilai, Warangal…).
 *
 * Deduplication is GEOGRAPHIC, not by name. The town field spells the same
 * place several ways — "Aurangabad" for what we hold as Chhatrapati
 * Sambhajinagar, "Allahabad" for Prayagraj, "Ahmadabad", "Vishakhapatanam",
 * "Raurkela" — so a string match would have re-imported cities we already
 * have under a different name. Any town whose centroid falls within
 * NEAR_KM of a city already in data/wards/ is skipped.
 *
 * Usage:  node scripts/import-livingatlas-wards.mjs [--min N] [--dry]
 */

import { writeFile, readFile, readdir } from 'node:fs/promises';
import { existsSync, mkdirSync, createReadStream, statSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline';
import { execFileSync } from 'node:child_process';
import { simplifyGeom, geomCentroid } from './lib/geo.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WARDS = join(ROOT, 'data', 'wards');
const URL_7Z = 'https://github.com/ramSeraph/indian_admin_boundaries/releases/download/urban/LivingAtlas_Wards.geojsonl.7z';
const SOURCE = 'ESRI India Living Atlas municipal wards via indianopenmaps.com (ramSeraph), simplified';

const TOL = 0.00025;    // ~28 m, same as every other ward importer
const MIN_RING = 2e-8;
const NEAR_KM = 25;     // a town this close to a city we hold IS that city
const argv = process.argv.slice(2);
const MIN_WARDS = Number(argv.includes('--min') ? argv[argv.indexOf('--min') + 1] : 15);
const DRY = argv.includes('--dry');

// Town names that are a distinct city despite sitting near one we already
// have. Satellite towns of a metro are real, separately-governed ULBs.
const KEEP_NEAR = new Set(['Pimpri Chinchwad', 'Vasai-Virar', 'Kalyan-Dombivli', 'Panchkula',
    'Gurugram', 'Naya Raipur']);

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 24);

// ── what we already hold, with centroids ───────────────────────────────────
const existing = [];
for (const file of (await readdir(WARDS)).filter(f => f.endsWith('.json'))) {
    const d = JSON.parse(await readFile(join(WARDS, file), 'utf8'));
    const fs_ = d.features || [];
    if (!fs_.length) continue;
    existing.push({
        key: basename(file, '.json'),
        city: d.city,
        cx: fs_.reduce((s, f) => s + f.properties.cx, 0) / fs_.length,
        cy: fs_.reduce((s, f) => s + f.properties.cy, 0) / fs_.length,
    });
}
console.log(`already have ${existing.length} cities`);

// ── fetch + decompress once ────────────────────────────────────────────────
const cache = join(tmpdir(), 'janvayu-livingatlas-wards.geojsonl');
if (!existsSync(cache)) {
    const arc = cache + '.7z';
    if (!existsSync(arc)) {
        console.log('Downloading LivingAtlas_Wards…');
        const res = await fetch(URL_7Z);
        if (!res.ok) { console.error(`  HTTP ${res.status}`); process.exit(1); }
        await writeFile(arc, Buffer.from(await res.arrayBuffer()));
    }
    const un = ['7zz', '7za', '7z'].find(b => { try { execFileSync(b, ['-h'], { stdio: 'ignore' }); return true; } catch { return false; } });
    if (!un) { console.error('Need 7zz/7za/7z on PATH.'); process.exit(1); }
    execFileSync(un, ['x', '-y', `-o${dirname(cache)}`, arc], { stdio: 'ignore' });
}

// ── group rows by (town, state) ────────────────────────────────────────────
const towns = new Map();
let nullGeom = 0;
for await (const line of createInterface({ input: createReadStream(cache), crlfDelay: Infinity })) {
    if (!line.trim()) continue;
    let f; try { f = JSON.parse(line); } catch { continue; }
    const p = f.properties || {};
    const town = String(p.townname ?? '').trim();
    if (!town) continue;
    const g = f.geometry;
    if (!g || !g.coordinates || (g.type !== 'Polygon' && g.type !== 'MultiPolygon')) { nullGeom++; continue; }
    const id = `${town}|${String(p.state ?? '').trim().toLowerCase().replace(/[^a-z]/g, '')}`;
    const t = towns.get(id) ?? { town, rows: [] };
    t.rows.push(p.__g = { p, g });
    towns.set(id, t);
}
console.log(`read ${towns.size} town/state groups (${nullGeom} rows had no geometry)`);

// ── build ──────────────────────────────────────────────────────────────────
const km = (ax, ay, bx, by) => Math.hypot((ax - bx) * 102, (ay - by) * 111);
let added = 0, skippedNear = 0, skippedThin = 0;
const report = [];

for (const { town, rows } of [...towns.values()].sort((a, b) => b.rows.length - a.rows.length)) {
    if (rows.length < MIN_WARDS) { skippedThin++; continue; }

    // Dissolve by ward code, then simplify.
    const byWard = new Map();
    for (const { p, g } of rows) {
        const no = String(p.sourcewardcode ?? p.ward_lgd_code ?? '').trim();
        const label = (() => {
            const n = String(p.sourcewardname ?? '').trim();
            if (n && n !== '<Null>' && !/^\d+$/.test(n)) return n;
            const m = String(p.ward_lgd_name ?? '').match(/Ward\s*No\.?\s*([\w-]+)/i);
            return `Ward ${m ? m[1] : (n || no)}`.trim();
        })();
        const k = no || label;
        const w = byWard.get(k) ?? { no: no || String(byWard.size + 1), name: label, polys: [] };
        w.polys.push(...(g.type === 'Polygon' ? [g.coordinates] : g.coordinates));
        byWard.set(k, w);
    }

    const features = [];
    for (const w of byWard.values()) {
        const geom = simplifyGeom(
            w.polys.length === 1 ? { type: 'Polygon', coordinates: w.polys[0] }
                                 : { type: 'MultiPolygon', coordinates: w.polys },
            TOL, MIN_RING);
        if (!geom) continue;
        const [cx, cy] = geomCentroid(geom);
        if (cx == null) continue;
        features.push({ type: 'Feature', properties: { no: w.no, name: w.name, cx, cy }, geometry: geom });
    }
    if (features.length < MIN_WARDS) { skippedThin++; continue; }

    const mx = features.reduce((s, f) => s + f.properties.cx, 0) / features.length;
    const my = features.reduce((s, f) => s + f.properties.cy, 0) / features.length;

    // Geographic dedup — the town field's spelling is not trustworthy.
    // Nearest, not first-found: readdir order would otherwise report
    // "Ghaziabad is 24 km from Delhi" when we hold Ghaziabad itself.
    let near = null, nearD = Infinity;
    for (const e of existing) {
        const d = km(mx, my, e.cx, e.cy);
        if (d < nearD) { nearD = d; near = e; }
    }
    if (near && nearD < NEAR_KM && !KEEP_NEAR.has(town)) {
        report.push(`  skip ${town} (${features.length}) — ${nearD.toFixed(0)} km from ${near.city}`);
        skippedNear++;
        continue;
    }

    // Unique ward names, so tooltips and ward search stay usable.
    const counts = {};
    for (const f of features) counts[f.properties.name] = (counts[f.properties.name] || 0) + 1;
    for (const f of features) if (counts[f.properties.name] > 1) f.properties.name = `Ward ${f.properties.no}`;

    features.sort((a, b) => (parseInt(a.properties.no) || 0) - (parseInt(b.properties.no) || 0) ||
        a.properties.name.localeCompare(b.properties.name));

    const key = slug(town);
    const out = join(WARDS, `${key}.json`);
    const fc = { type: 'FeatureCollection', city: town, airOnly: true, source: SOURCE, features };

    if (existsSync(out)) {
        try {
            const prev = JSON.parse(await readFile(out, 'utf8'));
            const byKey = new Map((prev.features || []).map(x => [`${x.properties?.no} ${x.properties?.name}`, x.properties || {}]));
            for (const f of features) {
                const old = byKey.get(`${f.properties.no} ${f.properties.name}`);
                if (!old) continue;
                for (const k of ['lst', 'green', 'built', 'pma']) if (old[k] != null) f.properties[k] = old[k];
            }
            if (prev.lst_date) fc.lst_date = prev.lst_date;
            if (prev.pma_year) fc.pma_year = prev.pma_year;
            if (features.some(f => f.properties.lst != null)) delete fc.airOnly;
        } catch { /* unreadable previous build */ }
    }

    if (!DRY) {
        mkdirSync(WARDS, { recursive: true });
        await writeFile(out, JSON.stringify(fc));
    }
    existing.push({ key, city: town, cx: mx, cy: my });   // so later towns dedup against it too
    added++;
    console.log(`  wards/${key}.json — ${town}, ${features.length} wards${DRY ? ' (dry run)' : `, ${(statSync(out).size / 1024).toFixed(0)} KB`}`);
}

console.log(report.join('\n'));
console.log(`\nadded ${added}, skipped ${skippedNear} as duplicates of cities we hold, ${skippedThin} under ${MIN_WARDS} wards`);
