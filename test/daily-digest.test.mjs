import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getCpcbPM25Category, CPCB_CATEGORIES, thresholdPM25 } from '../netlify/functions/lib/cpcb.mjs';
import { getCpcbPM25Category as fromDigest } from '../netlify/functions/daily-digest.mjs';

test('CPCB PM2.5 categories follow the national bands', () => {
  const at = (v) => getCpcbPM25Category(v).label;
  assert.equal(at(30), 'Good');
  assert.equal(at(31), 'Satisfactory');
  assert.equal(at(57), 'Satisfactory');
  assert.equal(at(60), 'Satisfactory');
  assert.equal(at(90), 'Moderate');
  assert.equal(at(114), 'Poor');
  assert.equal(at(127), 'Very Poor');
  assert.equal(at(250), 'Very Poor');
  assert.equal(at(251), 'Severe');
});

test('CPCB category is null when there is no PM2.5 reading', () => {
  assert.equal(getCpcbPM25Category(null), null);
  assert.equal(getCpcbPM25Category(undefined), null);
});

test('the digest and the shared helper agree', () => {
  assert.equal(fromDigest(114).label, getCpcbPM25Category(114).label);
});

test('every category carries CPCB health wording', () => {
  assert.equal(CPCB_CATEGORIES.length, 6);
  for (const c of CPCB_CATEGORIES) assert.ok(c.impact.length > 10);
});

test('a new subscriber record uses its own PM2.5 level', () => {
  assert.equal(thresholdPM25({ pm25_threshold: 90 }), 90);
});

test('a legacy record keeps the air-quality level it chose, converted from US AQI', () => {
  // US AQI 200 is PM2.5 150 on the EPA table; 100 is 35; 300 is 250.
  assert.ok(Math.abs(thresholdPM25({ threshold: 200 }) - 150) < 1.5);
  assert.ok(Math.abs(thresholdPM25({ threshold: 100 }) - 35) < 1.5);
  assert.ok(Math.abs(thresholdPM25({ threshold: 300 }) - 250) < 1.5);
});

test('a record with no threshold at all falls back to 150', () => {
  assert.equal(thresholdPM25({}), 150);
});

import { assessReading, buildEmailHTML } from '../netlify/functions/daily-digest.mjs';

// WAQI's time.s is the station's clock (IST). 08:00 IST is 02:30 UTC.
const NOW = Date.UTC(2026, 9, 30, 2, 30, 0);

test('a fresh, plausible reading is accepted', () => {
  assert.equal(assessReading({ pm25: 69, pm10: 90, time: '2026-10-30 07:30:00' }, NOW).ok, true);
});

test('a reading older than six hours is held back', () => {
  const r = assessReading({ pm25: 80, pm10: 90, time: '2026-10-29 20:00:00' }, NOW);
  assert.equal(r.ok, false);
  assert.match(r.reason, /six hours/);
});

test('PM2.5 and PM10 both near zero is held back, the 30 October Delhi case', () => {
  const r = assessReading({ pm25: 1, pm10: 3, time: '2026-10-30 07:55:00' }, NOW);
  assert.equal(r.ok, false);
  assert.match(r.reason, /implausibly low/);
});

test('a genuinely clean day is not held back when PM10 is not near zero', () => {
  assert.equal(assessReading({ pm25: 2, pm10: 25, time: '2026-10-30 07:55:00' }, NOW).ok, true);
});

test('a missing PM2.5 reading is held back', () => {
  assert.equal(assessReading({ pm25: null, pm10: 40, time: '2026-10-30 07:55:00' }, NOW).ok, false);
});

const SUB = { email: 'x@example.com', cities: ['delhi', 'mumbai'], pm25_threshold: 150 };
const CITIES_DATA = [
  { city: 'Delhi', key: 'delhi', aqi: 5, pm25: 1, pm10: 3, unreliable: 'the reading is implausibly low' },
  { city: 'Mumbai', key: 'mumbai', aqi: 158, pm25: 69, pm10: null, unreliable: null },
];

test('the email never upper-cases the unit, which would turn micrograms into milligrams', () => {
  const html = buildEmailHTML(SUB, CITIES_DATA, []);
  assert.doesNotMatch(html, /text-transform:\s*uppercase/);
  assert.match(html, /&micro;g\/m&sup3;/);
});

test('the email carries no emoji and no US AQI column', () => {
  const html = buildEmailHTML(SUB, CITIES_DATA, ['mumbai']);
  assert.doesNotMatch(html, /\p{Extended_Pictographic}/u);
  assert.doesNotMatch(html, /US AQI/);
});

test('an unreliable reading is stated, not shown as Good, and is not the worst city', () => {
  const html = buildEmailHTML(SUB, CITIES_DATA, []);
  assert.match(html, /No reliable reading today/);
  assert.doesNotMatch(html, />Good</);
  assert.match(html, /Mumbai is the worst-affected city/);
});

test('with no reliable reading at all the email says so', () => {
  const html = buildEmailHTML(SUB, [CITIES_DATA[0]], []);
  assert.match(html, /No city on your list had a reliable PM2\.5 reading today/);
});
