// scripts/audit-live-vs-cpcb.mjs: the comparison behind the daily live-versus-CPCB audit.
// The case that matters is the one from 8 November 2026: Delhi's station served as Bengaluru's.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pm25Band, bulletinBand, compare, trackedCities, BANDS } from '../scripts/audit-live-vs-cpcb.mjs';

test('CPCB PM2.5 bands at their edges', () => {
  assert.equal(BANDS[pm25Band(30)], 'Good');
  assert.equal(BANDS[pm25Band(31)], 'Satisfactory');
  assert.equal(BANDS[pm25Band(60)], 'Satisfactory');
  assert.equal(BANDS[pm25Band(90)], 'Moderate');
  assert.equal(BANDS[pm25Band(120)], 'Poor');
  assert.equal(BANDS[pm25Band(250)], 'Very Poor');
  assert.equal(BANDS[pm25Band(251)], 'Severe');
});

test('Delhi\'s air served as Bengaluru\'s is a fault: Very Poor live against Satisfactory in the bulletin', () => {
  // AQI 221 on WAQI's scale is about 171 µg/m³ (lib/iaqi.mjs); CPCB's Bengaluru bulletin said Satisfactory.
  const r = compare({ pm25: 171 }, { category: 'Satisfactory' });
  assert.equal(r.gap, 3);
  assert.equal(r.fault, true);
});

test('one band apart is weather, not a fault', () => {
  assert.equal(compare({ pm25: 75 }, { category: 'Satisfactory' }).fault, false);
  assert.equal(compare({ pm25: 285 }, { category: 'Very Poor' }).fault, false);
});

test('an unknown bulletin category is not a fault and is not compared', () => {
  const r = compare({ pm25: 285 }, { category: 'Unrated' });
  assert.equal(r.fault, false);
  assert.equal(r.gap, null);
  assert.equal(bulletinBand('very poor'), 4);
});

test('the tracked-city list is read from app.js and carries the cities that lost their live feed', () => {
  const cities = trackedCities(readFileSync(new URL('../app.js', import.meta.url), 'utf8'));
  const core = cities.filter((c) => !c.ext).map((c) => c.key);
  assert.ok(core.length >= 30, `only ${core.length} core cities parsed`);
  for (const k of ['delhi', 'mumbai', 'bangalore', 'pune']) assert.ok(core.includes(k), k);
});
