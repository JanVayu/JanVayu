#!/usr/bin/env node
/**
 * import-bharatlas-wards.mjs — add ward boundaries for cities the Swachh
 * Bharat release doesn't cover.
 *
 * Why a second importer rather than another entry in fetch-openmaps.mjs:
 * different source, different upstream, different licence. SBM data reaches us
 * via indianopenmaps.com and is flagged "not-so-open"; these come from
 * BharatLas, which republishes OpenCity / Oorvani Foundation layers under
 * ODbL-1.0. Keeping them apart keeps the attribution honest — each ward file
 * records the source it actually came from.
 *
 * This exists because whole states are missing from SBM. West Bengal, Manipur,
 * Mizoram and Tripura publish no ULB wards there, and Assam's are absent too,
 * so Guwahati — a city with real winter pollution — had no ward map. Checked
 * before writing this: OpenStreetMap has only 38 admin_level 9/10 relations in
 * all of West Bengal and they are villages, not municipal wards; DataMeet's
 * Municipal_Spatial_Data covers 31 cities with Kolkata the only Bengal one.
 *
 * Output matches the SBM importer exactly, so the atlas, the annual-PM2.5 pass
 * and the chatbot's ward-stats all treat these files identically:
 *   { type, city, airOnly, source, features:[{ properties:{ no, name, cx, cy } }] }
 *
 * Usage:  node scripts/import-bharatlas-wards.mjs [cityKey …]
 */

import { writeFile, readFile } from 'node:fs/promises';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { simplifyGeom, geomCentroid } from './lib/geo.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const R2 = 'https://pub-0429b8e3b5a946e69ea007df844a6f1c.r2.dev/admin';

const CITIES = {
    guwahati: {
        city: 'Guwahati',
        url: `${R2}/wards-guwahati/wards_guwahati.geojson`,
        source: 'Guwahati Municipal Corporation wards (2022 delimitation) — OpenCity / Oorvani Foundation via bharatlas.com, ODbL-1.0, simplified',
        // ward number lives in sourcewardcode; ward_lgd_name is the verbose
        // "Guwahati (M Corp.) - Ward No.1" form, so we build a short label.
        no: p => String(p.sourcewardcode ?? p.ward_lgd_code ?? '').trim(),
        name: p => {
            const n = String(p.sourcewardname ?? '').trim();
            if (n && n !== '<Null>') return n;
            const m = String(p.ward_lgd_name ?? '').match(/Ward\s*No\.?\s*(\d+)/i);
            return m ? `Ward ${m[1]}` : `Ward ${p.sourcewardcode ?? ''}`.trim();
        },
    },
};

// Same tolerance the SBM importer uses (~28 m), so ward outlines carry the
// same level of detail whichever source they came from.
const TOL = 0.00025;
const MIN_RING = 2e-8;

const keys = process.argv.slice(2).filter(a => !a.startsWith('--'));
const todo = keys.length ? keys : Object.keys(CITIES);

for (const key of todo) {
    const cfg = CITIES[key];
    if (!cfg) { console.error(`Unknown city "${key}". Known: ${Object.keys(CITIES).join(', ')}`); process.exitCode = 1; continue; }

    const cache = join(tmpdir(), `janvayu-bharatlas-${key}.geojson`);
    if (!existsSync(cache)) {
        console.log(`Downloading ${cfg.city}…`);
        const res = await fetch(cfg.url);
        if (!res.ok) { console.error(`  HTTP ${res.status} for ${cfg.url}`); process.exitCode = 1; continue; }
        await writeFile(cache, Buffer.from(await res.arrayBuffer()));
    }
    const src = JSON.parse(await readFile(cache, 'utf8'));

    const features = [];
    for (const f of src.features || []) {
        const geom = simplifyGeom(f.geometry, TOL, MIN_RING);
        if (!geom) continue;
        const [cx, cy] = geomCentroid(geom);
        if (cx == null) continue;
        features.push({
            type: 'Feature',
            properties: { no: cfg.no(f.properties), name: cfg.name(f.properties), cx, cy },
            geometry: geom,
        });
    }
    features.sort((a, b) => (parseInt(a.properties.no) || 0) - (parseInt(b.properties.no) || 0) ||
        a.properties.name.localeCompare(b.properties.name));

    const out = join(ROOT, 'data', 'wards', `${key}.json`);
    const fc = { type: 'FeatureCollection', city: cfg.city, airOnly: true, source: cfg.source, features };

    // Carry forward anything a later pipeline stage computed, exactly as the
    // SBM importer does — re-running must not wipe satellite or annual PM2.5.
    if (existsSync(out)) {
        try {
            const prev = JSON.parse(await readFile(out, 'utf8'));
            const byWard = new Map((prev.features || []).map(x =>
                [`${x.properties?.no} ${x.properties?.name}`, x.properties || {}]));
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
    console.log(`  wards/${key}.json — ${features.length} wards, ${(statSync(out).size / 1024).toFixed(0)} KB`);
}
