// netlify/functions/air-model.mjs: the last link in the live-reading chain.
// It is a model, so what is pinned here is that it stays small and honest: India only,
// no free worldwide proxy, nothing but what the page needs, and errors are not cached.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';

const { default: handler } = await import('../netlify/functions/air-model.mjs');
const realFetch = globalThis.fetch;
let calls = [];
before(() => {
  globalThis.fetch = async (url) => {
    calls.push(String(url));
    return new Response(JSON.stringify({ current: { time: '2026-11-08T09:30', pm2_5: 12.3, pm10: 13.2, us_aqi: 55 } }), { status: 200 });
  };
});
after(() => { globalThis.fetch = realFetch; });
const get = (qs) => handler(new Request(`https://www.janvayu.in/.netlify/functions/air-model?${qs}`));

test('returns the estimate with its source, licence and an IST timestamp', async () => {
  calls = [];
  const r = await get('lat=12.9716&lon=77.5946');
  assert.equal(r.status, 200);
  const j = await r.json();
  assert.equal(j.status, 'ok');
  assert.equal(j.data.pm25, 12.3);
  assert.equal(j.data.us_aqi, 55);
  assert.equal(j.data.time_iso, '2026-11-08T09:30:00+05:30');
  assert.equal(j.jv.kind, 'model');
  assert.match(j.jv.source, /Open-Meteo/);
  assert.equal(j.jv.license, 'CC BY 4.0');
  assert.match(r.headers.get('Cache-Control'), /s-maxage=1800/);
});

test('coordinates are rounded to a kilometre before they leave the site', async () => {
  calls = [];
  await get('lat=12.971634&lon=77.594612');
  assert.ok(calls[0].includes('latitude=12.97&longitude=77.59'), calls[0]);
});

test('a point outside the subcontinent is refused and never reaches Open-Meteo', async () => {
  calls = [];
  for (const qs of ['lat=51.5&lon=-0.12', 'lat=-33.87&lon=151.21', 'lat=0&lon=0']) {
    const r = await get(qs);
    assert.equal(r.status, 400, qs);
  }
  assert.equal(calls.length, 0);
});

test('malformed input is refused', async () => {
  calls = [];
  for (const qs of ['', 'lat=abc&lon=77', 'lat=12.9', 'lat=12.9;13&lon=77', 'lat=12.9&lon=77.5.5']) {
    assert.equal((await get(qs)).status, 400, qs);
  }
  assert.equal(calls.length, 0);
});

test('an upstream failure is a 502 that is not cached and does not leak the reason', async () => {
  globalThis.fetch = async (url) => { throw new Error(`connect failed: ${url}`); };
  const r = await get('lat=12.97&lon=77.59');
  assert.equal(r.status, 502);
  assert.equal(r.headers.get('Cache-Control'), 'no-store');
  assert.ok(!(await r.text()).includes('open-meteo'));
});
