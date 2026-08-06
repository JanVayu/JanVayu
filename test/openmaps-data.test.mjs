// Validation for the vendored indianopenmaps-derived geodata that backs the
// Ward Atlas (67 cities), the MP/district choropleths and the pollution-source
// overlay. These files are build artifacts of scripts/fetch-openmaps.mjs — if
// one is malformed the map panels fail silently in the browser, so we gate the
// schema here.
//
// Run: npm test   (node --test)

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// India bounding box, generous margins (Lakshadweep → Arunachal)
const IN = { minLon: 66, maxLon: 98.5, minLat: 6, maxLat: 37.5 };
const inIndia = (lon, lat) =>
  lon >= IN.minLon && lon <= IN.maxLon && lat >= IN.minLat && lat <= IN.maxLat;

function eachPosition(geom, fn) {
  const walk = (c) => (typeof c[0] === 'number' ? fn(c) : c.forEach(walk));
  walk(geom.coordinates);
}

test('ward files: valid FeatureCollections with no/name/cx/cy inside India', () => {
  const dir = join(ROOT, 'data', 'wards');
  const files = readdirSync(dir).filter(f => f.endsWith('.json'));
  assert.ok(files.length >= 67, `expected ≥67 ward files, found ${files.length}`);
  for (const file of files) {
    const fc = JSON.parse(readFileSync(join(dir, file), 'utf8'));
    assert.equal(fc.type, 'FeatureCollection', `${file}: type`);
    assert.ok(fc.city, `${file}: city label`);
    assert.ok(Array.isArray(fc.features) && fc.features.length >= 15,
      `${file}: has ${fc.features?.length} wards`);
    const names = new Set();
    for (const f of fc.features) {
      const p = f.properties;
      assert.ok(p.name, `${file}: ward name`);
      assert.ok(p.no !== undefined && p.no !== '', `${file}: ward no`);
      assert.ok(inIndia(p.cx, p.cy), `${file}: centroid ${p.cx},${p.cy} of "${p.name}" outside India`);
      assert.ok(['Polygon', 'MultiPolygon'].includes(f.geometry.type), `${file}: geometry type`);
      names.add(p.name);
    }
    // Tooltips and ward search key off the name — fetch-openmaps.mjs
    // guarantees uniqueness for the files it generates (legacy hand-collected
    // files predate that guarantee, so only its output is gated).
    if (String(fc.source || '').includes('indianopenmaps')) {
      assert.equal(names.size, fc.features.length, `${file}: duplicate ward names`);
    }
  }
});

test('constituencies.json: all 543 Lok Sabha seats, labelled, inside India', () => {
  const fc = JSON.parse(readFileSync(join(ROOT, 'data', 'openmaps', 'constituencies.json'), 'utf8'));
  assert.equal(fc.type, 'FeatureCollection');
  assert.equal(fc.features.length, 543, `expected 543 PCs, got ${fc.features.length}`);
  for (const f of fc.features) {
    assert.ok(f.properties.pc, 'pc name');
    assert.ok(f.properties.st, 'state name');
    assert.ok(inIndia(f.properties.cx, f.properties.cy), `${f.properties.pc}: centroid outside India`);
  }
});

test('districts.json: plausible count, labelled, inside India', () => {
  const fc = JSON.parse(readFileSync(join(ROOT, 'data', 'openmaps', 'districts.json'), 'utf8'));
  assert.equal(fc.type, 'FeatureCollection');
  assert.ok(fc.features.length >= 700 && fc.features.length <= 900,
    `district count ${fc.features.length} outside 700-900`);
  for (const f of fc.features) {
    assert.ok(f.properties.dt, 'district name');
    assert.ok(inIndia(f.properties.cx, f.properties.cy), `${f.properties.dt}: centroid outside India`);
  }
});

test('boundary geometry coordinates are rounded and in range', () => {
  for (const file of ['constituencies.json', 'districts.json']) {
    const fc = JSON.parse(readFileSync(join(ROOT, 'data', 'openmaps', file), 'utf8'));
    // spot-check a sample so the test stays fast
    for (const f of fc.features.filter((_, i) => i % 25 === 0)) {
      eachPosition(f.geometry, ([lon, lat]) => {
        assert.ok(inIndia(lon, lat), `${file}: coordinate ${lon},${lat} outside India`);
        assert.ok(Number.isInteger(Math.round(lon * 1e5)) && `${lon}`.replace(/.*\./, '').length <= 5,
          `${file}: coordinate ${lon} not rounded to 5 decimals`);
      });
    }
  }
});

test('pollution-sources.json: all five layers present and populated', () => {
  const data = JSON.parse(readFileSync(join(ROOT, 'data', 'openmaps', 'pollution-sources.json'), 'utf8'));
  const expected = { landfills: 500, dumpsites: 1000, coalmines: 300, industrial: 500, sez: 200 };
  for (const [layer, minCount] of Object.entries(expected)) {
    const rows = data.layers[layer];
    assert.ok(Array.isArray(rows) && rows.length >= minCount,
      `${layer}: ${rows?.length} rows (expected ≥${minCount})`);
    for (const pt of rows) {
      assert.ok(inIndia(pt.lon, pt.lat), `${layer}: "${pt.n}" at ${pt.lon},${pt.lat} outside India`);
      assert.ok(pt.n, `${layer}: unnamed point`);
    }
  }
  // Industrial layer is filtered to CPCB red/orange categories only
  for (const pt of data.layers.industrial) {
    assert.ok(pt.c === 'red' || pt.c === 'orange', `industrial: unexpected category "${pt.c}"`);
  }
});
