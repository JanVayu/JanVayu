#!/usr/bin/env node
/**
 * fetch-tiles.mjs — pull the boundary PMTiles archives into data/tiles/ at
 * build time, instead of carrying them in git.
 *
 * Why not just commit them. The seven archives are 399 MB, and they are
 * regenerable build output that will be rebuilt whenever the PM2.5 year rolls
 * over or a boundary release refreshes. Git cannot meaningfully delta-compress
 * binary archives, so every rebuild would add another full 399 MB to history
 * permanently — a few refreshes and the clone is multiple GB, for files nobody
 * needs the history of.
 *
 * Fetching them instead also fixes something that has been on the roadmap for
 * a while: with the village TopoJSON replaced by village.pmtiles, the repo
 * drops from 192 MB to roughly 31 MB. Contributors get a clone six times
 * lighter than today's, not heavier.
 *
 * Failure is loud on purpose. A deploy that publishes without tiles would
 * leave the map silently empty, which is exactly the class of quiet-wrong
 * outcome this project keeps getting bitten by — so a missing or truncated
 * archive aborts the build rather than shipping a broken map.
 *
 * Usage:  node scripts/fetch-tiles.mjs [--force]
 */

import { mkdir, writeFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEST = join(ROOT, 'data', 'tiles');
const TAG = process.env.JV_TILES_TAG || 'boundary-tiles';
const BASE = `https://github.com/JanVayu/JanVayu/releases/download/${TAG}`;
const FORCE = process.argv.includes('--force');

// Expected byte sizes, so a truncated download is caught rather than served.
// Regenerate with: node scripts/fetch-tiles.mjs --manifest
const EXPECT = {
    'state.pmtiles': 200123,
    'district.pmtiles': 2832685,
    'subdistrict.pmtiles': 24527340,
    'panchayat.pmtiles': 74471182,
    'village.pmtiles': 266596730,
    'ulb.pmtiles': 5453114,
    'ward.pmtiles': 35944652,
};
const TOLERANCE = 0.02;   // rebuilt tiles vary slightly run to run

async function main() {
    await mkdir(DEST, { recursive: true });
    let fetched = 0, skipped = 0;
    const missing = [];

    for (const [name, want] of Object.entries(EXPECT)) {
        const out = join(DEST, name);
        if (!FORCE && existsSync(out)) {
            const have = (await stat(out)).size;
            if (Math.abs(have - want) / want <= TOLERANCE) { skipped++; continue; }
            console.log(`  ${name}: on disk but ${have} bytes, expected ~${want} — refetching`);
        }
        const url = `${BASE}/${name}`;
        process.stdout.write(`  ${name} … `);
        let res;
        try {
            res = await fetch(url, { redirect: 'follow' });
        } catch (e) {
            console.log('network error');
            missing.push(`${name} (${e.message})`);
            continue;
        }
        if (!res.ok) {
            console.log(`HTTP ${res.status}`);
            missing.push(`${name} (HTTP ${res.status})`);
            continue;
        }
        const buf = Buffer.from(await res.arrayBuffer());
        if (Math.abs(buf.length - want) / want > TOLERANCE) {
            console.log(`truncated: ${buf.length} bytes, expected ~${want}`);
            missing.push(`${name} (size mismatch)`);
            continue;
        }
        await writeFile(out, buf);
        console.log(`${(buf.length / 1e6).toFixed(1)} MB`);
        fetched++;
    }

    if (missing.length) {
        console.error('\nBoundary tiles could not be fetched:');
        for (const m of missing) console.error(`  - ${m}`);
        console.error(`\nExpected them at ${BASE}/`);
        console.error('Build the archives with scripts/build-boundary-tiles.py and publish');
        console.error(`them as release "${TAG}". Aborting rather than deploying a map with`);
        console.error('no boundaries — an empty map looks working, which is worse than a');
        console.error('failed build.');
        process.exit(1);
    }
    console.log(`tiles ready — ${fetched} fetched, ${skipped} already present`);
}

if (process.argv.includes('--manifest')) {
    const out = {};
    for (const name of Object.keys(EXPECT)) {
        const p = join(DEST, name);
        if (existsSync(p)) out[name] = (await stat(p)).size;
    }
    console.log(JSON.stringify(out, null, 4));
} else {
    await main();
}
