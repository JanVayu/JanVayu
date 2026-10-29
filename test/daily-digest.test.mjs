import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getCpcbPM25Category } from '../netlify/functions/daily-digest.mjs';

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
