#!/usr/bin/env node
/**
 * import-wb-amrut-wards.mjs — West Bengal municipal wards from the AMRUT
 * GIS master-plan programme.
 *
 * Why this exists: we told people, in a blog post and in the docs, that
 * Bengal's municipal wards were not openly published. That was wrong. The
 * Swachh Bharat ward release genuinely omits West Bengal, and OpenStreetMap
 * and DataMeet genuinely don't cover it — but a separate WB_AMRUT_Wards file
 * sits in the *same* indianopenmaps release we already pull SBM_Wards from.
 * We had been reading one asset out of that release and never listed the
 * others. 1,633 ward polygons across 52 urban local bodies.
 *
 * Two upstream quirks this has to work around:
 *
 *  1. The `Name` column is unreliable. Some ULBs carry the city ("Durgapur"),
 *     some are blank, and some have a ward label leaked into the city field —
 *     Asansol's 106 wards are all filed under Name "Ward No. 65". So cities
 *     are identified by `ULB_Code` and each one is verified against its
 *     expected coordinates before anything is written. A code that has moved
 *     upstream fails loudly rather than importing the wrong city.
 *
 *  2. A ward can span several rows. Haldia has 58 rows for 29 wards, Durgapur
 *     49 for 43 — multi-part wards stored one polygon per row. Rows are
 *     dissolved by (ULB_Code, Ward_No) into a MultiPolygon.
 *
 * Output matches the other two ward importers exactly, so the atlas, the
 * annual-PM2.5 pass and the chatbot's ward-stats treat these identically.
 *
 * Usage:  node scripts/import-wb-amrut-wards.mjs [cityKey …]
 */

import { writeFile, readFile } from 'node:fs/promises';
import { existsSync, mkdirSync, createReadStream, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline';
import { execFileSync } from 'node:child_process';
import { simplifyGeom, geomCentroid } from './lib/geo.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const URL_7Z = 'https://github.com/ramSeraph/indian_admin_boundaries/releases/download/urban/WB_AMRUT_Wards.geojsonl.7z';

// ULB_Code → city. `at` is the expected centroid; the import aborts for any
// city whose data lands more than TOL_KM away, so an upstream re-code can't
// quietly publish Asansol's polygons under Howrah's name.
const CITIES = {
    howrah:      { ulb: '250247', city: 'Howrah',      at: [88.323, 22.587] },
    asansol:     { ulb: '250032', city: 'Asansol',     at: [86.963, 23.686] },
    durgapur:    { ulb: '250034', city: 'Durgapur',    at: [87.301, 23.539] },
    bidhannagar: { ulb: '250145', city: 'Bidhannagar', at: [88.433, 22.603] },
    kharagpur:   { ulb: '250232', city: 'Kharagpur',   at: [87.309, 22.340] },
    bardhaman:   { ulb: '250038', city: 'Bardhaman',   at: [87.859, 23.238] },
    haldia:      { ulb: '250234', city: 'Haldia',      at: [88.096, 22.069] },
};
// Siliguri (ULB 249957) is in the file with 4 wards out of 47 — a partial
// upload, not a city. Left out rather than shipped as a near-empty map.

const SOURCE = 'West Bengal AMRUT GIS master-plan municipal wards via indianopenmaps.com (ramSeraph), simplified';
const TOL = 0.00025;    // ~28 m, same as the other two importers
const MIN_RING = 2e-8;
const TOL_KM = 12;      // generous: a city centroid, not a point feature

const keys = process.argv.slice(2).filter(a => !a.startsWith('--'));
const todo = keys.length ? keys : Object.keys(CITIES);
for (const k of todo) {
    if (!CITIES[k]) { console.error(`Unknown city "${k}". Known: ${Object.keys(CITIES).join(', ')}`); process.exit(1); }
}

// ── fetch + decompress once ────────────────────────────────────────────────
const cache = join(tmpdir(), 'janvayu-wb-amrut-wards.geojsonl');
if (!existsSync(cache)) {
    const arc = cache + '.7z';
    if (!existsSync(arc)) {
        console.log('Downloading WB_AMRUT_Wards…');
        const res = await fetch(URL_7Z);
        if (!res.ok) { console.error(`  HTTP ${res.status} for ${URL_7Z}`); process.exit(1); }
        await writeFile(arc, Buffer.from(await res.arrayBuffer()));
    }
    const un = ['7zz', '7za', '7z'].find(b => { try { execFileSync(b, ['-h'], { stdio: 'ignore' }); return true; } catch { return false; } });
    if (!un) { console.error('Need 7zz/7za/7z on PATH to unpack the release asset.'); process.exit(1); }
    execFileSync(un, ['x', '-y', `-o${dirname(cache)}`, arc], { stdio: 'ignore' });
}

// ── collect rows, dissolving multi-part wards ──────────────────────────────
const wanted = new Map(todo.map(k => [CITIES[k].ulb, k]));
const buckets = new Map();   // cityKey → Map(wardNo → {no, polys:[]})
let rows = 0;

for await (const line of createInterface({ input: createReadStream(cache), crlfDelay: Infinity })) {
    if (!line.trim()) continue;
    let f;
    try { f = JSON.parse(line); } catch { continue; }
    const p = f.properties || {};
    const key = wanted.get(String(p.ULB_Code));
    if (!key) continue;
    const g = f.geometry;
    if (!g || (g.type !== 'Polygon' && g.type !== 'MultiPolygon')) continue;
    const no = p.Ward_No;
    if (no == null) continue;
    rows++;
    const bucket = buckets.get(key) ?? new Map();
    const w = bucket.get(no) ?? { no: String(no), polys: [] };
    w.polys.push(...(g.type === 'Polygon' ? [g.coordinates] : g.coordinates));
    bucket.set(no, w);
    buckets.set(key, bucket);
}
console.log(`read ${rows} rows for ${buckets.size} cities`);

// ── build one file per city ────────────────────────────────────────────────
for (const key of todo) {
    const cfg = CITIES[key];
    const bucket = buckets.get(key);
    if (!bucket || !bucket.size) { console.error(`  ${key}: no rows for ULB ${cfg.ulb} — upstream may have re-coded it`); process.exitCode = 1; continue; }

    const features = [];
    for (const w of [...bucket.values()].sort((a, b) => (+a.no || 0) - (+b.no || 0))) {
        const geom = simplifyGeom(
            w.polys.length === 1 ? { type: 'Polygon', coordinates: w.polys[0] }
                                 : { type: 'MultiPolygon', coordinates: w.polys },
            TOL, MIN_RING);
        if (!geom) continue;
        const [cx, cy] = geomCentroid(geom);
        if (cx == null) continue;
        features.push({ type: 'Feature', properties: { no: w.no, name: `Ward ${w.no}`, cx, cy }, geometry: geom });
    }
    if (!features.length) { console.error(`  ${key}: every ward simplified away`); process.exitCode = 1; continue; }

    // Geography gate: is this actually the city we think it is?
    const mx = features.reduce((s, f) => s + f.properties.cx, 0) / features.length;
    const my = features.reduce((s, f) => s + f.properties.cy, 0) / features.length;
    const dkm = Math.hypot((mx - cfg.at[0]) * 102, (my - cfg.at[1]) * 111);
    if (dkm > TOL_KM) {
        console.error(`  ${key}: ULB ${cfg.ulb} centroid is ${dkm.toFixed(0)} km from ${cfg.city} — refusing to write`);
        process.exitCode = 1;
        continue;
    }

    const out = join(ROOT, 'data', 'wards', `${key}.json`);
    const fc = { type: 'FeatureCollection', city: cfg.city, airOnly: true, source: SOURCE, features };

    // Never wipe what a later pipeline stage computed.
    if (existsSync(out)) {
        try {
            const prev = JSON.parse(await readFile(out, 'utf8'));
            const byWard = new Map((prev.features || []).map(x => [`${x.properties?.no} ${x.properties?.name}`, x.properties || {}]));
            for (const f of features) {
                const old = byWard.get(`${f.properties.no} ${f.properties.name}`);
                if (!old) continue;
                for (const k of ['lst', 'green', 'built', 'pma']) if (old[k] != null) f.properties[k] = old[k];
            }
            if (prev.lst_date) fc.lst_date = prev.lst_date;
            if (prev.pma_year) fc.pma_year = prev.pma_year;
            if (features.some(f => f.properties.lst != null)) delete fc.airOnly;
        } catch { /* unreadable previous build — write the fresh one */ }
    }

    mkdirSync(dirname(out), { recursive: true });
    await writeFile(out, JSON.stringify(fc));
    console.log(`  wards/${key}.json — ${cfg.city}, ${features.length} wards, ${dkm.toFixed(1)} km from expected, ${(statSync(out).size / 1024).toFixed(0)} KB`);
}
