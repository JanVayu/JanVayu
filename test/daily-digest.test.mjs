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
