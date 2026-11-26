// scripts/audit-live-vs-cpcb.mjs: the comparison behind the daily live-versus-CPCB audit.
// The case that matters is the one from 8 November 2026: Delhi's station served as Bengaluru's.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pm25Band, bulletinBand, compare, trackedCities, BANDS, istDate, bulletinAgeDays, judgeCity, verdict } from '../scripts/audit-live-vs-cpcb.mjs';

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

test('a malformed key or a point outside the subcontinent is dropped, not sent', () => {
  const src = "        ok: { name: 'Fine', lat: 12.9, lon: 77.6 },\n        bad_key: { name: 'Bad', lat: 12.9, lon: 77.6 },\n        far: { name: 'Far', lat: 40.7, lon: -74.0 },\n";
  const keys = trackedCities(src).map((c) => c.key);
  assert.deepEqual(keys, ['ok']);
});

// 13 to 19 November 2026: the audit failed every day because the newest bulletin in the repository
// was two days old. These hold the rule that replaced that: compare only against a bulletin from
// today or yesterday in India, and treat "no fresh bulletin anywhere" as the fault.
const NOON_IST_19_NOV = new Date('2026-11-19T06:30:00Z');

test('the date in India rolls over at 18:30 UTC', () => {
  assert.equal(istDate(new Date('2026-11-19T18:29:00Z')), '2026-11-19');
  assert.equal(istDate(new Date('2026-11-19T18:30:00Z')), '2026-11-20');
  assert.equal(bulletinAgeDays('2026-11-17', NOON_IST_19_NOV), 2);
  assert.equal(bulletinAgeDays('17 Nov', NOON_IST_19_NOV), null);
});

test('a bulletin two days old is too old to compare, and the city is not at fault', () => {
  // Visakhapatnam on 19 November: live 30 µg/m³ (Good) against the 17 November bulletin (Moderate).
  const r = judgeCity(30, { date: '2026-11-17', category: 'Moderate', aqi: 154 }, NOON_IST_19_NOV);
  assert.equal(r.state, 'live, bulletin too old to compare');
  assert.equal(r.problem, null);
});

test('the same gap against yesterday\'s bulletin is still a fault', () => {
  const r = judgeCity(30, { date: '2026-11-18', category: 'Moderate', aqi: 154 }, NOON_IST_19_NOV);
  assert.equal(r.state, 'live');
  assert.match(r.problem, /2 bands apart/);
  assert.equal(judgeCity(30, { date: '2026-11-19', category: 'Satisfactory', aqi: 80 }, NOON_IST_19_NOV).problem, null);
});

test('no city with a fresh bulletin fails the run as stale data, with no city blamed', () => {
  const rows = [
    { day: { date: '2026-11-17', category: 'Moderate' }, problems: [] },
    { day: { date: '2026-11-15', category: 'Satisfactory' }, problems: [] },
    { day: undefined, problems: [] },
  ];
  const v = verdict(rows, NOON_IST_19_NOV);
  assert.equal(v.stale, true);
  assert.equal(v.faults, 0);
  assert.equal(v.newest, '2026-11-17');
  assert.equal(v.exitCode, 1);
});

test('one fresh bulletin is enough for the run to pass, and a city fault still fails it', () => {
  const rows = [
    { day: { date: '2026-11-18', category: 'Moderate' }, problems: [] },
    { day: { date: '2026-11-15', category: 'Satisfactory' }, problems: [] },
  ];
  assert.equal(verdict(rows, NOON_IST_19_NOV).exitCode, 0);
  rows[0].problems.push('station 80 km away');
  const v = verdict(rows, NOON_IST_19_NOV);
  assert.equal(v.stale, false);
  assert.equal(v.exitCode, 1);
});
