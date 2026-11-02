// The GRAP widget in app.js converts PM2.5 to the CPCB scale itself, because
// app.js is a browser file and cannot import calc.mjs. Until November 2026 it
// compared WAQI's US-EPA AQI with GRAP's CPCB bands and showed "Normal" for air
// already in the Stage II range. This holds the two conversions equal and fails
// if the widget goes back to the raw WAQI figure.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pm25ToCpcbAqi } from '../netlify/functions/lib/calc.mjs';

const src = readFileSync(new URL('../app.js', import.meta.url), 'utf8');

test('app.js converts PM2.5 to CPCB AQI exactly as the server does', () => {
  const m = src.match(/const CPCB_PM25_BANDS = (\[\[.*?\]\]);\s*function pm25ToCpcbAqi\(pm25\) \{([\s\S]*?)\n    \}\n/);
  assert.ok(m, 'widget conversion not found in app.js');
  const clientFn = new Function(`const CPCB_PM25_BANDS = ${m[1]}; return function pm25ToCpcbAqi(pm25) {${m[2]}\n}`)();
  for (const v of [0, 12, 30, 31, 45, 60, 61, 90, 91, 120, 121, 130, 150, 200, 250, 251, 300, 380, 500, null, -1, NaN]) {
    assert.equal(clientFn(v), pm25ToCpcbAqi(v), `PM2.5 ${v}`);
  }
  assert.equal(pm25ToCpcbAqi(150) >= 301, true, 'PM2.5 150 is in the Stage II band');
});

test('the widget no longer feeds WAQI US AQI into the GRAP bands', () => {
  const body = src.slice(src.indexOf('function updateSchoolPrediction()'));
  const fn = body.slice(0, body.indexOf('// ── Personal Exposure Report'));
  assert.ok(!/aqiData\[[^\]]+\]\??\.aqi/.test(fn), 'updateSchoolPrediction reads .aqi');
  assert.ok(/pm25ToCpcbAqi\(measuredPM25/.test(fn), 'updateSchoolPrediction must convert from PM2.5');
});
