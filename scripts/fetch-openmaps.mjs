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

import { createReadStream, createWriteStream, existsSync, mkdirSync, statSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
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
};

const WARDS_SOURCE = 'Swachh Bharat Mission ULB wards via indianopenmaps.com (ramSeraph), simplified';

// ── geometry helpers ────────────────────────────────────────────────

const round5 = (n) => Math.round(n * 1e5) / 1e5;

// Douglas-Peucker on a ring/line of [lon, lat] pairs; tol in degrees.
function simplifyRing(pts, tol) {
    if (pts.length <= 4) return pts;
    const keep = new Uint8Array(pts.length);
    keep[0] = keep[pts.length - 1] = 1;
    const stack = [[0, pts.length - 1]];
    while (stack.length) {
        const [a, b] = stack.pop();
        if (b - a < 2) continue;
        const [ax, ay] = pts[a], [bx, by] = pts[b];
        const dx = bx - ax, dy = by - ay;
        const len2 = dx * dx + dy * dy;
        let maxD = -1, maxI = -1;
        for (let i = a + 1; i < b; i++) {
            const [px, py] = pts[i];
            let d;
            if (len2 === 0) { const ex = px - ax, ey = py - ay; d = ex * ex + ey * ey; }
            else {
                const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
                const ex = px - (ax + t * dx), ey = py - (ay + t * dy);
                d = ex * ex + ey * ey;
            }
            if (d > maxD) { maxD = d; maxI = i; }
        }
        if (maxD > tol * tol) { keep[maxI] = 1; stack.push([a, maxI], [maxI, b]); }
    }
    const out = [];
    for (let i = 0; i < pts.length; i++) if (keep[i]) out.push(pts[i]);
    return out;
}

function ringArea(ring) { // shoelace, signed, sq. degrees
    let s = 0;
    for (let i = 0, n = ring.length - 1; i < n; i++)
        s += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
    return s / 2;
}

function ringCentroid(ring) {
    let a = 0, cx = 0, cy = 0;
    for (let i = 0, n = ring.length - 1; i < n; i++) {
        const f = ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
        a += f; cx += (ring[i][0] + ring[i + 1][0]) * f; cy += (ring[i][1] + ring[i + 1][1]) * f;
    }
    if (Math.abs(a) < 1e-12) return ring[0];
    return [cx / (3 * a), cy / (3 * a)];
}

function closeRing(ring) {
    const [fx, fy] = ring[0], [lx, ly] = ring[ring.length - 1];
    if (fx !== lx || fy !== ly) ring.push([fx, fy]);
    return ring;
}

// Simplify a Polygon/MultiPolygon geometry in place; drops rings that
// collapse or fall under minRingArea (sq. degrees). Returns null if nothing left.
function simplifyGeom(geom, tol, minRingArea = 0) {
    const polys = geom.type === 'Polygon' ? [geom.coordinates] :
                  geom.type === 'MultiPolygon' ? geom.coordinates : null;
    if (!polys) return geom; // points pass through
    const outPolys = [];
    for (const poly of polys) {
        const outRings = [];
        for (const ring of poly) {
            let r = simplifyRing(ring.map(([x, y]) => [round5(x), round5(y)]), tol);
            if (r.length < 4) continue;
            r = closeRing(r.map(([x, y]) => [round5(x), round5(y)]));
            if (r.length < 4) continue;
            if (minRingArea && Math.abs(ringArea(r)) < minRingArea) {
                if (outRings.length === 0) continue;   // outer ring too small → skip poly
                else continue;                          // hole too small → drop hole
            }
            outRings.push(r);
        }
        if (outRings.length) outPolys.push(outRings);
    }
    if (!outPolys.length) return null;
    return outPolys.length === 1
        ? { type: 'Polygon', coordinates: outPolys[0] }
        : { type: 'MultiPolygon', coordinates: outPolys };
}

// Area-weighted centroid of the largest outer ring of a (Multi)Polygon.
function geomCentroid(geom) {
    const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;
    let best = null, bestA = -1;
    for (const poly of polys) {
        const a = Math.abs(ringArea(poly[0]));
        if (a > bestA) { bestA = a; best = poly[0]; }
    }
    const [cx, cy] = ringCentroid(best);
    return [round5(cx), round5(cy)];
}

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
    const matchers = Object.entries(WARD_CITIES).map(([key, c]) => ({
        key, st: c.st.toLowerCase(), ulbs: new Set(c.ulbs.map(u => u.toLowerCase())),
    }));
    for await (const f of readFeatures(src)) {
        const p = f.properties || {};
        const ulb = String(p.ulbname || '').toLowerCase();
        const st = String(p.statename || '').toLowerCase();
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
        await writeFile(out, JSON.stringify(fc));
        console.log(`  wards/${key}.json — ${features.length} wards, ${(statSync(out).size / 1024).toFixed(0)} KB`);
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
