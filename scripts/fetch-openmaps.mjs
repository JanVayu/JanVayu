#!/usr/bin/env node
/**
 * fetch-openmaps.mjs — refresh the vendored geodata that comes from
 * indianopenmaps.com (ramSeraph's mirror of Indian government geodata).
 *
 * Produces:
 *   data/wards/<city>.json              — municipal ward boundaries (SBM ULB Wards)
 *   data/openmaps/constituencies.json   — Lok Sabha (parliament) constituencies (LGD)
 *   data/openmaps/districts.json        — district boundaries (LGD)
 *   data/openmaps/pollution-sources.json— landfills, dumpsites, coal mines,
 *                                         red/orange industrial parks, SEZs
 *
 * Usage:
 *   node scripts/fetch-openmaps.mjs all            # download + extract + build
 *   node scripts/fetch-openmaps.mjs wards --src /path/to/extracted
 *   node scripts/fetch-openmaps.mjs pc|districts|sources [--src DIR]
 *
 * Downloads need a 7z extractor on PATH (7z, 7za or bsdtar). If you already
 * extracted the .geojsonl files elsewhere, point --src at that directory and
 * no downloads happen. Outputs are committed to the repo — this script only
 * needs to run when refreshing from upstream (data updates a few times a year).
 *
 * Sources are flagged "not-so-open" upstream: scraped from government portals
 * (SBM, LGD/Bharatmaps, GatiShakti) without an explicit open licence. We ship
 * simplified derivatives with attribution — see the Data Sources panel.
 */

import { createReadStream, existsSync, mkdirSync, statSync } from 'node:fs';
import { writeFile, readFile } from 'node:fs/promises';
import { createInterface } from 'node:readline';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const DATASETS = {
    wards:      'https://github.com/ramSeraph/indian_admin_boundaries/releases/download/urban/SBM_Wards.geojsonl.7z',
    pc:         'https://github.com/ramSeraph/indian_admin_boundaries/releases/download/constituencies/LGD_Parliament_Constituencies.geojsonl.7z',
    districts:  'https://github.com/ramSeraph/indian_admin_boundaries/releases/download/districts/LGD_Districts.geojsonl.7z',
    landfills:  'https://github.com/ramSeraph/indian_facilities/releases/download/urban-sanitation/SBM_Landfills.geojsonl.7z',
    dumpsites:  'https://github.com/ramSeraph/indian_facilities/releases/download/urban-sanitation/SBM_Dumpsites.geojsonl.7z',
    coalmines:  'https://github.com/ramSeraph/indian_land_features/releases/download/mining/Indian_Coal_Mines_dataset.geojsonl.7z',
    industrial: 'https://github.com/ramSeraph/indian_industries/releases/download/general/GatiShakti_Industrial_Parks.geojsonl.7z',
    sez:        'https://github.com/ramSeraph/indian_industries/releases/download/general/GatiShakti_SEZ_Parks.geojsonl.7z',
};

// City key (must exist in CITIES in app.js) → SBM ULB match rules.
// ulb: exact ulbname (case-insensitive); st: statename (case-insensitive).
const WARD_CITIES = {
    ghaziabad:     { city: 'Ghaziabad',     ulbs: ['Ghaziabad'],                          st: 'uttar pradesh' },
    agra:          { city: 'Agra',          ulbs: ['AGRA NAGAR NIGAM'],                   st: 'uttar pradesh' },
    meerut:        { city: 'Meerut',        ulbs: ['Meerut City'],                        st: 'uttar pradesh' },
    moradabad:     { city: 'Moradabad',     ulbs: ['Moradabad Municipal Corporation'],    st: 'uttar pradesh' },
    prayagraj:     { city: 'Prayagraj',     ulbs: ['Prayagraj (M.Corp)'],                 st: 'uttar pradesh' },
    patna:         { city: 'Patna',         ulbs: ['Patna'],                              st: 'bihar' },
    muzaffarpur:   { city: 'Muzaffarpur',   ulbs: ['Muzaffarpur'],                        st: 'bihar' },
    ludhiana:      { city: 'Ludhiana',      ulbs: ['Ludhiana'],                           st: 'punjab' },
    amritsar:      { city: 'Amritsar',      ulbs: ['Amritsar'],                           st: 'punjab' },
    jalandhar:     { city: 'Jalandhar',     ulbs: ['Jalandhar'],                          st: 'punjab' },
    indore:        { city: 'Indore',        ulbs: ['Indore (Imc)'],                       st: 'madhya pradesh' },
    gwalior:       { city: 'Gwalior',       ulbs: ['Gwalior'],                            st: 'madhya pradesh' },
    nagpur:        { city: 'Nagpur',        ulbs: ['Nagpur'],                             st: 'maharashtra' },
    nashik:        { city: 'Nashik',        ulbs: ['Nashik Municipal Corporation'],       st: 'maharashtra' },
    surat:         { city: 'Surat',         ulbs: ['Surat'],                              st: 'gujarat' },
    vadodara:      { city: 'Vadodara',      ulbs: ['Vadodara(M.Corp)'],                   st: 'gujarat' },
    rajkot:        { city: 'Rajkot',        ulbs: ['Rajkot (M.Cop)'],                     st: 'gujarat' },
    jodhpur:       { city: 'Jodhpur',       ulbs: ['Jodhpur North (Mc)', 'Jodhpur South (Mc)'], st: 'rajasthan' },
    kota:          { city: 'Kota',          ulbs: ['Kota North', 'South Kota'],           st: 'rajasthan' },
    dehradun:      { city: 'Dehradun',      ulbs: ['Dehradun'],                           st: 'uttarakhand' },
    raipur:        { city: 'Raipur',        ulbs: ['Raipur'],                             st: 'chhattisgarh' },
    ranchi:        { city: 'Ranchi',        ulbs: ['Ranchi Municipal Corporation'],       st: 'jharkhand' },
    coimbatore:    { city: 'Coimbatore',    ulbs: ['Coimbatore'],                         st: 'tamil nadu' },
    visakhapatnam: { city: 'Visakhapatnam', ulbs: ['Gvmc'],                               st: 'andhra' },

    // ── Batch 1 (v26.6.137): cities matched to SBM ULBs by name AND verified
    // geographically — a ULB only qualifies if its ward centroids sit within
    // 35 km of the city's known coordinates. Name-only matching had put
    // Chhattisgarh's "Durg" forward as West Bengal's Durgapur, 453 km away.
    mangaluru:          { city: 'Mangaluru', ulbs: ['Mangalore'], st: 'karnataka' },
    aurangabad:         { city: 'Chhatrapati Sambhajinagar', ulbs: ['Aurangabad'], st: 'maharashtra' },
    navimumbai:         { city: 'Navi Mumbai', ulbs: ['Navi Mumbai Municiple Corp.'], st: 'maharashtra' },
    thiruvananthapuram: { city: 'Thiruvananthapuram', ulbs: ['Thiruvananthapuram Corporation'], st: 'kerala' },
    bareilly:           { city: 'Bareilly', ulbs: ['Bareilly (M.Crop)', 'Bareilly Municipal Corporation'], st: 'uttar pradesh' },
    gorakhpur:          { city: 'Gorakhpur', ulbs: ['Gorakhpur (M.Corp)', 'Gorakhpur (M . Corp)', 'Gorakhpur'], st: 'uttar pradesh' },
    ajmer:              { city: 'Ajmer', ulbs: ['Ajmer (M.Corp)'], st: 'rajasthan' },
    bikaner:            { city: 'Bikaner', ulbs: ['Bikaner'], st: 'rajasthan' },
    aligarh:            { city: 'Aligarh', ulbs: ['Aligarh (M.Corp)'], st: 'uttar pradesh' },
    jabalpur:           { city: 'Jabalpur', ulbs: ['Jabalpur'], st: 'madhya pradesh' },
    jammu:              { city: 'Jammu', ulbs: ['Jammu'], st: 'jammu and kashmir' },
    kochi:              { city: 'Kochi', ulbs: ['Kochi'], st: 'kerala' },
    udaipur:            { city: 'Udaipur', ulbs: ['Udaipur (M Cl)'], st: 'rajasthan' },
    firozabad:          { city: 'Firozabad', ulbs: ['Firozabad Municipal Corporation'], st: 'uttar pradesh' },
    belagavi:           { city: 'Belagavi', ulbs: ['City Corporation Belagavi'], st: 'karnataka' },
    bhubaneswar:        { city: 'Bhubaneswar', ulbs: ['Bhubaneswar (Mc)'], st: 'odisha' },
    hubballi:           { city: 'Hubballi', ulbs: ['Hubli-Dharwad'], st: 'karnataka' },
    alwar:              { city: 'Alwar', ulbs: ['Alwar'], st: 'rajasthan' },
    mysuru:             { city: 'Mysuru', ulbs: ['Mysore (M.Corp)'], st: 'karnataka' },
    vijayawada:         { city: 'Vijayawada', ulbs: ['Vijayawada'], st: 'andhra pradesh' },
    patiala:            { city: 'Patiala', ulbs: ['Patiala', 'Patiala '], st: 'punjab' },
    bhiwadi:            { city: 'Bhiwadi', ulbs: ['Bhiwadi'], st: 'rajasthan' },
    nizamabad:          { city: 'Nizamabad', ulbs: ['Nizamabad'], st: 'telanagana' },
    salem:              { city: 'Salem', ulbs: ['Salem'], st: 'tamil nadu' },
    erode:              { city: 'Erode', ulbs: ['Erode'], st: 'tamil nadu' },
    thoothukudi:        { city: 'Thoothukudi', ulbs: ['Thoothukudi'], st: 'tamil nadu' },
    cuttack:            { city: 'Cuttack', ulbs: ['Cuttack'], st: 'odisha' },
    guntur:             { city: 'Guntur', ulbs: ['Guntur'], st: 'andhra pradhesh' },

    // ── Batch 2 (v26.6.138): same geo-verified matching as batch 1. The
    // 'Puducherry;' and 'Dhanbad Municipal Corportion' spellings are the
    // source's own, typos included — matching is exact, so they stay.
    dhanbad:    { city: 'Dhanbad', ulbs: ['Dhanbad Municipal Corportion'], st: 'jharkhand' },
    thrissur:   { city: 'Thrissur', ulbs: ['Thrissur'], st: 'kerala' },
    kollam:     { city: 'Kollam', ulbs: ['Kollam Corporation'], st: 'kerala' },
    ujjain:     { city: 'Ujjain', ulbs: ['Ujjain'], st: 'madhya pradesh' },
    nellore:    { city: 'Nellore', ulbs: ['Nellore'], st: 'andhra pradhesh' },
    gaya:       { city: 'Gaya', ulbs: ['Gaya'], st: 'bihar' },
    kurnool:    { city: 'Kurnool', ulbs: ['Kurnool'], st: 'andhra pradhesh' },
    bhagalpur:  { city: 'Bhagalpur', ulbs: ['Bhagalpur'], st: 'bihar' },
    bathinda:   { city: 'Bathinda', ulbs: ['Bathinda'], st: 'punjab' },
    kalaburagi: { city: 'Kalaburagi', ulbs: ['Kalaburagi Mcorp'], st: 'karnataka' },
    tirupati:   { city: 'Tirupati', ulbs: ['Tirupati', 'TIRUPATI'], st: 'andhra pradhesh' },
    puducherry: { city: 'Puducherry', ulbs: ['Puducherry;'], st: 'puducherry' },
    thane:      { city: 'Thane', ulbs: ['Thane'], st: 'maharashtra' },
    panaji:     { city: 'Panaji (Goa)', ulbs: ['PANAJI'], st: 'goa' },
    panipat:    { city: 'Panipat', ulbs: ['Panipat'], st: 'haryana' },
    solapur:    { city: 'Solapur', ulbs: ['Solapur'], st: 'maharashtra' },
    rohtak:     { city: 'Rohtak', ulbs: ['Rohtak'], st: 'haryana' },
    sonipat:    { city: 'Sonipat', ulbs: ['Sonipat'], st: 'haryana' },
    amravati:   { city: 'Amravati', ulbs: ['Amravati Municipal Corporation'], st: 'maharashtra' },
    hisar:      { city: 'Hisar', ulbs: ['Hisar'], st: 'haryana' },
    gangtok:    { city: 'Gangtok', ulbs: ['Gangtok Municipal Corporation'], st: 'sikkim' },
    jamnagar:   { city: 'Jamnagar', ulbs: ['Jamnagar'], st: 'gujarat' },
    // Deliberately NOT added: Noida, Jamshedpur, Vellore, Kozhikode, Akola
    // and Bhavnagar. SBM holds only 1-13 ward polygons for each (verified
    // against the raw release, not a matching failure), so the atlas would
    // show a city as a couple of blobs. A partial ward map misinforms more
    // than no ward map. Re-add if the upstream upload is ever completed.
};

const WARDS_SOURCE = 'Swachh Bharat Mission ULB wards via indianopenmaps.com (ramSeraph), simplified';

// ── geometry helpers ────────────────────────────────────────────────

// Geometry helpers live in scripts/lib/geo.mjs so both boundary importers
// (this one and import-bharatlas-wards.mjs) share one implementation.
import { round5, simplifyGeom, geomCentroid } from './lib/geo.mjs';

// ── input plumbing ──────────────────────────────────────────────────

function findExtractor() {
    for (const [cmd, args] of [['7z', ['x', '-y']], ['7za', ['x', '-y']], ['bsdtar', ['-xf']]]) {
        try { execFileSync(cmd, ['--help'], { stdio: 'ignore' }); return { cmd, args }; } catch { /* next */ }
    }
    return null;
}

async function ensureSource(key, srcDir) {
    const base = DATASETS[key].split('/').pop().replace('.7z', '');
    if (srcDir) {
        const p = join(srcDir, base);
        if (!existsSync(p)) throw new Error(`${p} not found — extract ${DATASETS[key]} there first`);
        return p;
    }
    const dl = join(tmpdir(), 'janvayu-openmaps');
    mkdirSync(dl, { recursive: true });
    const archive = join(dl, base + '.7z');
    const out = join(dl, base);
    if (existsSync(out) && statSync(out).size > 0) return out;
    const ex = findExtractor();
    if (!ex) throw new Error('Need 7z, 7za or bsdtar on PATH to extract downloads (or pass --src DIR with pre-extracted .geojsonl files)');
    console.log(`  downloading ${DATASETS[key]}`);
    const res = await fetch(DATASETS[key]);
    if (!res.ok) throw new Error(`download failed: HTTP ${res.status}`);
    await writeFile(archive, Buffer.from(await res.arrayBuffer()));
    console.log(`  extracting ${base}.7z`);
    if (ex.cmd === 'bsdtar') execFileSync(ex.cmd, [...ex.args, archive, '-C', dl], { stdio: 'inherit' });
    else execFileSync(ex.cmd, [...ex.args, archive, `-o${dl}`], { stdio: 'inherit' });
    if (!existsSync(out)) throw new Error(`extraction did not produce ${out}`);
    return out;
}

async function* readFeatures(path) {
    const rl = createInterface({ input: createReadStream(path), crlfDelay: Infinity });
    for await (const line of rl) {
        const t = line.trim().replace(/,$/, '');
        if (!t || t === '[' || t === ']') continue;
        try { yield JSON.parse(t); } catch { /* skip malformed line */ }
    }
}

// ── builders ────────────────────────────────────────────────────────

async function buildWards(srcDir) {
    const src = await ensureSource('wards', srcDir);
    // cityKey → Map(wardKey → {no, name, polys: [poly…]})
    const cities = {};
    // SBM files the same city under several spellings of its own state —
    // Vijayawada has 63 wards under "Andhra Pradhesh" and 1 under "Andhra
    // Pradesh"; Nizamabad splits across "Telanagana" and "Telangana". Matching
    // the raw string silently dropped most of a city's wards, so normalise
    // both sides (and trim ULB names, some carry trailing spaces).
    const ST_FIX = { andhrapradhesh: 'andhrapradesh', telanagana: 'telangana',
                     orissa: 'odisha', pondicherry: 'puducherry', uttaranchal: 'uttarakhand' };
    const normSt = (s) => {
        const v = String(s || '').toLowerCase().replace(/[^a-z]/g, '');
        return ST_FIX[v] || v;
    };
    const normUlb = (s) => String(s || '').trim().toLowerCase();
    const matchers = Object.entries(WARD_CITIES).map(([key, c]) => ({
        key, st: normSt(c.st), ulbs: new Set(c.ulbs.map(normUlb)),
    }));
    for await (const f of readFeatures(src)) {
        const p = f.properties || {};
        const ulb = normUlb(p.ulbname);
        const st = normSt(p.statename);
        const m = matchers.find(x => x.ulbs.has(ulb) && st.startsWith(x.st));
        if (!m) continue;
        const g = f.geometry;
        if (!g || (g.type !== 'Polygon' && g.type !== 'MultiPolygon')) continue;
        const status = String(p.status || '').toUpperCase();
        if (status === 'REJECTED') continue;
        // Some ULBs (e.g. Patna) carry hundreds of draft "OPEN" versions
        // alongside the APPROVED wards — collect everything, then keep only
        // APPROVED features for any ULB that has them (post-pass below).
        const name = String(p.wardname || '').trim();
        const wardKey = `${p.ulbcode}:${String(p.wardcode ?? name).toLowerCase()}`;
        const bucket = (cities[m.key] ??= new Map());
        const entry = bucket.get(wardKey) ?? { ulb: String(p.ulbcode), versions: [] };
        entry.versions.push({
            no: String(p.wardcode ?? '').trim(),
            name,
            ulbn: titleCase(p.ulbname),
            approved: status === 'APPROVED',
            created: Number(p.createdate) || 0,
            polys: g.type === 'Polygon' ? [g.coordinates] : g.coordinates,
        });
        bucket.set(wardKey, entry);
    }
    for (const [key, bucket] of Object.entries(cities)) {
        const approvedUlbs = new Set(
            [...bucket.values()].filter(e => e.versions.some(v => v.approved)).map(e => e.ulb));
        const features = [];
        let i = 0;
        for (const w0 of bucket.values()) {
            // ULB has approved wards → drafts are noise, skip them entirely.
            let vs = approvedUlbs.has(w0.ulb) ? w0.versions.filter(v => v.approved) : w0.versions;
            if (!vs.length) continue;
            i++;
            // Multiple surviving versions of one ward → keep the latest edit only.
            const latest = Math.max(...vs.map(v => v.created));
            vs = vs.filter(v => v.created === latest);
            const w = {
                no: vs[0].no || String(i),
                name: vs[0].name || `Ward ${vs[0].no || i}`,
                ulbn: vs[0].ulbn,
                polys: vs.flatMap(v => v.polys),
            };
            const geom = simplifyGeom(
                w.polys.length === 1
                    ? { type: 'Polygon', coordinates: w.polys[0] }
                    : { type: 'MultiPolygon', coordinates: w.polys },
                0.00025, 2e-8);
            if (!geom) continue;
            const [cx, cy] = geomCentroid(geom);
            features.push({ type: 'Feature', properties: { no: w.no, name: w.name, cx, cy, _ulbn: w.ulbn }, geometry: geom });
        }
        // Tooltips and ward search key off the name, so it must be unique.
        // Two failure modes upstream: every ward sharing one label (Meerut:
        // "M_Ward" ×90) and two merged ULBs both having a "Ward 5" (Kota).
        const nameCounts = {};
        for (const f of features) nameCounts[f.properties.name] = (nameCounts[f.properties.name] || 0) + 1;
        for (const f of features) {
            const p = f.properties;
            if (nameCounts[p.name] > 1) {
                let candidate = /^\d+$/.test(p.no) ? `Ward ${p.no}` : `${p.name} ${p.no}`.trim();
                if (features.some(o => o !== f && (o.properties.name === candidate ||
                        (/^\d+$/.test(o.properties.no) && `Ward ${o.properties.no}` === candidate && nameCounts[o.properties.name] > 1)))) {
                    candidate = `${candidate} (${p._ulbn})`;
                }
                p.name = candidate;
            }
        }
        for (const f of features) delete f.properties._ulbn;
        // Stable order: numeric ward number where possible
        features.sort((a, b) => (parseInt(a.properties.no) || 0) - (parseInt(b.properties.no) || 0) ||
            a.properties.name.localeCompare(b.properties.name));
        const fc = { type: 'FeatureCollection', city: WARD_CITIES[key].city, airOnly: true, source: WARDS_SOURCE, features };
        const out = join(ROOT, 'data', 'wards', `${key}.json`);

        // Carry over anything computed by a LATER stage of the pipeline —
        // satellite heat/green/built (build-ward-satellite.py) and the annual
        // PM2.5 (build-village-pm25.py). Rebuilding boundaries used to wipe
        // them, so re-running this script to add one city silently stripped
        // the satellite layers from every city it regenerated.
        const DERIVED = ['lst', 'green', 'built', 'pma'];
        if (existsSync(out)) {
            try {
                const prev = JSON.parse(await readFile(out, 'utf8'));
                const byWard = new Map((prev.features || []).map(f =>
                    [`${f.properties?.no} ${f.properties?.name}`, f.properties || {}]));
                let kept = 0;
                for (const f of features) {
                    const old = byWard.get(`${f.properties.no} ${f.properties.name}`);
                    if (!old) continue;
                    for (const k of DERIVED) if (old[k] != null) { f.properties[k] = old[k]; kept++; }
                }
                if (prev.lst_date) fc.lst_date = prev.lst_date;
                if (prev.pma_year) fc.pma_year = prev.pma_year;
                if (features.some(f => f.properties.lst != null)) delete fc.airOnly;
                if (kept) console.log(`    (kept ${kept} derived values from the previous build)`);
            } catch { /* unreadable previous build — just write the fresh one */ }
        }

        await writeFile(out, JSON.stringify(fc));
        console.log(`  wards/${key}.json — ${features.length} wards, ${(statSync(out).size / 1024).toFixed(0)} KB`);
    }
    // A ULB can be present but barely populated — SBM has 1 polygon for Akola
    // and 2 for Kozhikode. Those import "successfully" and render a city as a
    // couple of blobs, so surface them rather than let them pass silently.
    const THIN = 15;
    const thin = Object.entries(cities)
        .map(([k, m]) => [k, m.size])
        .filter(([, n]) => n < THIN)
        .sort((a, b) => a[1] - b[1]);
    if (thin.length) {
        console.warn(`  WARNING: ${thin.length} city/cities have < ${THIN} wards — likely a partial `
            + `upstream upload, check before shipping: ${thin.map(([k, n]) => `${k} (${n})`).join(', ')}`);
    }
    const missing = Object.keys(WARD_CITIES).filter(k => !cities[k]);
    if (missing.length) console.warn(`  WARNING: no wards matched for: ${missing.join(', ')}`);
}

async function buildPolygonLayer(key, srcDir, outName, tol, minRing, mapProps) {
    const src = await ensureSource(key, srcDir);
    const features = [];
    for await (const f of readFeatures(src)) {
        const geom = simplifyGeom(f.geometry, tol, minRing);
        if (!geom) continue;
        const props = mapProps(f.properties || {});
        if (!props) continue;
        const [cx, cy] = geomCentroid(geom);
        features.push({ type: 'Feature', properties: { ...props, cx, cy }, geometry: geom });
    }
    const fc = {
        type: 'FeatureCollection',
        source: 'LGD/Bharatmaps via indianopenmaps.com (ramSeraph), simplified',
        features,
    };
    const out = join(ROOT, 'data', 'openmaps', outName);
    mkdirSync(dirname(out), { recursive: true });
    await writeFile(out, JSON.stringify(fc));
    console.log(`  openmaps/${outName} — ${features.length} features, ${(statSync(out).size / 1048576).toFixed(2)} MB`);
}

const titleCase = (s) => String(s || '').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()).trim();

async function buildSources(srcDir) {
    const layers = {};

    const pointOf = (f) => {
        const g = f.geometry;
        if (!g) return null;
        if (g.type === 'Point') return [round5(g.coordinates[0]), round5(g.coordinates[1])];
        try { return geomCentroid(g).map(round5); } catch { return null; }
    };

    // SBM landfills + dumpsites (tiny polygons → centroids)
    for (const [key, dsKey] of [['landfills', 'landfills'], ['dumpsites', 'dumpsites']]) {
        const src = await ensureSource(dsKey, srcDir);
        const rows = [];
        for await (const f of readFeatures(src)) {
            const pt = pointOf(f); if (!pt) continue;
            const p = f.properties || {};
            const name = String(p.name || '').trim();
            rows.push({
                lon: pt[0], lat: pt[1],
                n: name && name.length > 3 ? name : `${key === 'landfills' ? 'Landfill' : 'Dumpsite'}, ${p.ulbnm || p.distnm || ''}`.trim(),
                u: p.ulbnm || '', s: p.stnm || '',
            });
        }
        layers[key] = rows;
    }

    // Coal mines (points with production data)
    {
        const src = await ensureSource('coalmines', srcDir);
        const rows = [];
        for await (const f of readFeatures(src)) {
            const pt = pointOf(f); if (!pt) continue;
            const p = f.properties || {};
            rows.push({
                lon: pt[0], lat: pt[1],
                n: String(p['Mine Name'] || 'Coal mine').trim(),
                s: p['State/UT Name'] || '', d: p['District Name'] || '',
                mt: parseFloat(p['Coal/ Lignite Production (MT) (2019-2020)']) || 0,
                o: p['Coal Mine Owner Name'] || '',
            });
        }
        layers.coalmines = rows;
    }

    // GatiShakti industrial parks — keep CPCB Red/Orange pollution categories only
    {
        const src = await ensureSource('industrial', srcDir);
        const rows = [];
        for await (const f of readFeatures(src)) {
            const p = f.properties || {};
            const cat = String(p.poll_cat || '').trim().toLowerCase();
            if (cat !== 'red' && cat !== 'orange') continue;
            const pt = pointOf(f); if (!pt) continue;
            rows.push({
                lon: pt[0], lat: pt[1],
                n: titleCase(p.park_name) || 'Industrial park',
                s: titleCase(p.st_name), d: titleCase(p.dist_name),
                c: cat, t: p.park_type || '',
            });
        }
        layers.industrial = rows;
    }

    // SEZs (points)
    {
        const src = await ensureSource('sez', srcDir);
        const rows = [];
        for await (const f of readFeatures(src)) {
            const pt = pointOf(f); if (!pt) continue;
            const p = f.properties || {};
            rows.push({ lon: pt[0], lat: pt[1], n: String(p.name || 'SEZ').trim(), s: p.state || '', t: p.type_sez || '' });
        }
        layers.sez = rows;
    }

    const out = join(ROOT, 'data', 'openmaps', 'pollution-sources.json');
    mkdirSync(dirname(out), { recursive: true });
    await writeFile(out, JSON.stringify({
        source: 'SBM / Harvard Dataverse (CC0) / GatiShakti via indianopenmaps.com (ramSeraph)',
        layers,
    }));
    const counts = Object.entries(layers).map(([k, v]) => `${k}:${v.length}`).join(' ');
    console.log(`  openmaps/pollution-sources.json — ${counts}, ${(statSync(out).size / 1048576).toFixed(2)} MB`);
}

// Regenerate the compact per-city ward list that Ask JanVayu's air-query
// function uses (netlify/functions/data/ward-stats.json) from ALL ward files
// in data/wards/ — legacy hand-collected cities keep their satellite fields
// (g/b/t), SBM-derived cities carry name + centroid only.
async function buildWardStats() {
    const { readdirSync, readFileSync } = await import('node:fs');
    const dir = join(ROOT, 'data', 'wards');
    const out = {};
    for (const file of readdirSync(dir).filter(f => f.endsWith('.json')).sort()) {
        const fc = JSON.parse(readFileSync(join(dir, file), 'utf8'));
        const key = file.replace('.json', '');
        const entry = { name: fc.city || key };
        if (fc.lst_date) entry.lst_date = fc.lst_date;
        entry.wards = fc.features.map(f => {
            const p = f.properties;
            const w = { n: p.name, x: p.cx, y: p.cy };
            if (p.green != null) w.g = p.green;
            if (p.built != null) w.b = p.built;
            if (p.lst != null) w.t = p.lst;
            return w;
        });
        out[key] = entry;
    }
    const dest = join(ROOT, 'netlify', 'functions', 'data', 'ward-stats.json');
    await writeFile(dest, JSON.stringify(out));
    console.log(`  ward-stats.json — ${Object.keys(out).length} cities, ${(statSync(dest).size / 1024).toFixed(0)} KB`);
}

// ── main ────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const what = args.find(a => !a.startsWith('--')) || 'all';
const srcIdx = args.indexOf('--src');
const srcDir = srcIdx >= 0 ? args[srcIdx + 1] : null;

const jobs = {
    wards: () => buildWards(srcDir),
    pc: () => buildPolygonLayer('pc', srcDir, 'constituencies.json', 0.004, 5e-5, p => ({
        pc: titleCase(p.pc_name), st: titleCase(p.st_name), no: String(p.pc_no || '').trim(),
    })),
    districts: () => buildPolygonLayer('districts', srcDir, 'districts.json', 0.004, 5e-5, p => ({
        dt: String(p.dtname || '').trim(), st: titleCase(p.stname),
    })),
    sources: () => buildSources(srcDir),
    wardstats: () => buildWardStats(),
};

const run = what === 'all' ? Object.keys(jobs) : [what];
for (const job of run) {
    if (!jobs[job]) { console.error(`Unknown target "${job}". Use: ${Object.keys(jobs).join(' | ')} | all`); process.exit(1); }
    console.log(`Building ${job}…`);
    await jobs[job]();
}
console.log('Done.');
