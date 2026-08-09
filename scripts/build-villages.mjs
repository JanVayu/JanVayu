#!/usr/bin/env node
/**
 * build-villages.mjs — vendor India's village administrative boundaries as one
 * quantized TopoJSON per district, for the map's "Villages" layer.
 *
 * Source: ramSeraph's indian_admin_boundaries mirror (the same
 * indianopenmaps.com family scripts/fetch-openmaps.mjs already pulls from) —
 * LGD_Villages, 584,615 village polygons with LGD codes, WGS84 lon/lat.
 *
 * Why per-district TopoJSON rather than one file or vector tiles:
 *   - One file is impossible: the raw GeoJSONL is 1.9 GB.
 *   - Villages tile the plane, so TopoJSON's shared arcs cut ~40% versus
 *     GeoJSON *and* remove the sliver gaps you get simplifying polygons
 *     independently.
 *   - Districts (~780 of them, ~745 villages each) are a natural unit: the map
 *     already thinks in districts, and the client loads only those whose bbox
 *     intersects the viewport (see toggleVillagesOverlay in app.js).
 *
 * Usage:
 *   node scripts/build-villages.mjs [--keep] [--pct 10]
 *
 * Requires: 7z (p7zip-full) and mapshaper on PATH or in node_modules/.bin.
 * Writes: data/villages/<dist_lgd>.json (TopoJSON) + data/villages/_index.json
 */

import { createReadStream, existsSync, mkdirSync, readFileSync, writeFileSync,
         appendFileSync, rmSync, readdirSync, statSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'data', 'villages');
const args = process.argv.slice(2);
const PCT = args.includes('--pct') ? Number(args[args.indexOf('--pct') + 1]) : 10;
const KEEP = args.includes('--keep');

const SRC_URL = 'https://github.com/ramSeraph/indian_admin_boundaries/releases/download/villages/LGD_Villages.geojsonl.7z';
const WORK = join(tmpdir(), 'janvayu-villages');
const ARCHIVE = join(WORK, 'LGD_Villages.geojsonl.7z');
const JSONL = join(WORK, 'LGD_Villages.geojsonl');
const PARTS = join(WORK, 'bydist');

// Districts average ~745 villages, so "flush when a district is full" never
// fires and the whole 1.9 GB ends up resident. Flush every N buffered features
// instead, which bounds memory whatever order the input arrives in.
const FLUSH_EVERY = 20000;

const mapshaper = (() => {
    const local = join(ROOT, 'node_modules', '.bin', 'mapshaper');
    return existsSync(local) ? local : 'mapshaper';
})();

function sh(cmd, argv, opts = {}) {
    return execFileSync(cmd, argv, { stdio: 'inherit', ...opts });
}

mkdirSync(WORK, { recursive: true });
mkdirSync(PARTS, { recursive: true });

// ── 1. Fetch + extract ──────────────────────────────────────────────────────
if (!existsSync(JSONL)) {
    if (!existsSync(ARCHIVE)) {
        console.log('Downloading LGD_Villages (~350 MB)…');
        sh('curl', ['-sL', '--fail', '-o', ARCHIVE, SRC_URL]);
    }
    console.log('Extracting…');
    sh('7z', ['x', '-y', `-o${WORK}`, ARCHIVE], { stdio: 'ignore' });
}
console.log(`Source: ${(statSync(JSONL).size / 1e9).toFixed(2)} GB`);

// ── 2. Stream-split by district, slimming properties + rounding to 5 dp ─────
const round = (c, nd = 5) => Array.isArray(c[0])
    ? c.map(x => round(x, nd))
    : [Number(c[0].toFixed(nd)), Number(c[1].toFixed(nd))];

const buckets = new Map();
const counts = new Map();
let buffered = 0, n = 0;

function flushAll() {
    for (const [dist, feats] of buckets) {
        if (feats.length) {
            appendFileSync(join(PARTS, `${dist}.geojsonl`),
                feats.map(f => JSON.stringify(f)).join('\n') + '\n');
        }
    }
    buckets.clear();
    buffered = 0;
}

console.log('Splitting by district…');
const rl = createInterface({ input: createReadStream(JSONL, 'utf8'), crlfDelay: Infinity });
for await (const line of rl) {
    if (!line.trim()) continue;
    const f = JSON.parse(line);
    const p = f.properties || {};
    const dist = p.dist_lgd ?? 'unknown';
    if (!buckets.has(dist)) buckets.set(dist, []);
    buckets.get(dist).push({
        type: 'Feature',
        properties: {
            n: p.vilname11 || p.vilnam_soi || '',
            c: p.vil_lgd,
            d: p.dtname || '',
            // "st", not "s": the atlas metric keys took "s" for summer air.
            // See scripts/build-village-layers.py.
            st: p.stname || '',
        },
        geometry: { type: f.geometry.type, coordinates: round(f.geometry.coordinates) },
    });
    counts.set(dist, (counts.get(dist) || 0) + 1);
    if (++buffered >= FLUSH_EVERY) {
        flushAll();
        if ((n += FLUSH_EVERY) % 100000 === 0) console.log(`  ${n} villages…`);
    }
}
flushAll();
console.log(`Split into ${counts.size} districts.`);

// ── 3. Simplify each district to quantized TopoJSON ─────────────────────────
mkdirSync(OUT, { recursive: true });
const index = {};
const parts = readdirSync(PARTS).filter(f => f.endsWith('.geojsonl'));
let done = 0;

for (const part of parts) {
    const id = part.replace(/\.geojsonl$/, '');
    const feats = readFileSync(join(PARTS, part), 'utf8')
        .split('\n').filter(Boolean).map(l => JSON.parse(l));
    if (!feats.length) continue;

    const fc = join(PARTS, `${id}.fc.json`);
    writeFileSync(fc, JSON.stringify({ type: 'FeatureCollection', features: feats }));
    // Written as .json (not .topojson) on purpose: Netlify picks compression
    // from content-type, and an unknown extension is served uncompressed as
    // application/octet-stream. The content is still TopoJSON.
    const dest = join(OUT, `${id}.json`);
    try {
        execFileSync(mapshaper, [fc,
            '-simplify', 'visvalingam', `percentage=${PCT}%`, 'keep-shapes',
            '-rename-layers', 'villages',   // stable object name for the client
            '-o', dest, 'format=topojson', 'quantization=1e5', 'force'],
            { stdio: 'ignore' });
    } catch (e) {
        console.warn(`  ! mapshaper failed for district ${id}`);
        rmSync(fc, { force: true });
        continue;
    }
    rmSync(fc, { force: true });

    // bbox from the slimmed source (cheaper and safer than re-reading topology)
    let minX = 180, minY = 90, maxX = -180, maxY = -90;
    const walk = (c) => {
        if (typeof c[0] === 'number') {
            if (c[0] < minX) minX = c[0];
            if (c[0] > maxX) maxX = c[0];
            if (c[1] < minY) minY = c[1];
            if (c[1] > maxY) maxY = c[1];
        } else c.forEach(walk);
    };
    feats.forEach(f => walk(f.geometry.coordinates));

    index[id] = {
        b: [minX, minY, maxX, maxY].map(v => Number(v.toFixed(4))),
        d: feats[0].properties.d,
        s: feats[0].properties.st,
        v: feats.length,
    };
    if (++done % 100 === 0) console.log(`  simplified ${done}/${parts.length}`);
}

writeFileSync(join(OUT, '_index.json'), JSON.stringify(index));

const bytes = readdirSync(OUT).reduce((a, f) => a + statSync(join(OUT, f)).size, 0);
console.log(`\nWrote ${Object.keys(index).length} districts, ` +
            `${Object.values(index).reduce((a, d) => a + d.v, 0)} villages, ` +
            `${(bytes / 1e6).toFixed(1)} MB into data/villages/`);

if (!KEEP) rmSync(WORK, { recursive: true, force: true });
