// The fallback chain in js/air-sources.js: live, then CPCB's daily bulletin, then a model.
//
// Written after 8 November 2026, when the site's one source (WAQI) turned out to be
// frozen for Bengaluru, Mumbai, Pune and most other cities outside Delhi-NCR and the
// homepage had nothing to show. What these pin: each step is used only when the one
// above it has nothing; each answer says what it is; and a daily figure or a model
// estimate is never passed off as a live reading or given a made-up µg/m³.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const JVAir = require('../js/air-sources.js');
const realLatest = JSON.parse(readFileSync(new URL('../data/cpcb-latest.json', import.meta.url), 'utf8'));

const NOW = Date.parse('2026-11-06T12:00:00+05:30');
const CITIES = [
  { key: 'bangalore', name: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
  { key: 'gurgaon', name: 'Gurgaon', lat: 28.4595, lon: 77.0266 },
  { key: 'delhi', name: 'Delhi', lat: 28.6139, lon: 77.209 },
];
const LATEST = {
  cities: {
    bengaluru: { name: 'Bengaluru', days: [{ date: '2026-11-05', aqi: 62, category: 'Satisfactory', stations: 8, stations_total: 14 }] },
    gurugram: { name: 'Gurugram', days: [{ date: '2026-11-05', aqi: 299, category: 'Poor', stations: 4, stations_total: 4 }] },
  },
};
const WAQI_OK = { status: 'ok', data: { aqi: 335, city: { name: 'Mandir Marg, Delhi' }, time: { iso: '2026-11-06T11:00:00+05:30' }, iaqi: { pm25: { v: 335 } } }, jv: { distance_km: 2.4, age_hours: 1 } };
const WAQI_NONE = { status: 'error', message: 'No monitoring station within 30 km has reported in the last 6 hours' };
const MODEL_OK = { status: 'ok', data: { pm25: 12.3, pm10: 13.2, us_aqi: 55, time_iso: '2026-11-06T11:30:00+05:30' } };

function fake({ waqi = WAQI_NONE, latest = LATEST, model = MODEL_OK } = {}) {
  const calls = [];
  const fn = async (url) => {
    calls.push(String(url));
    const u = String(url);
    const body = u.includes('waqi-proxy') ? waqi : u.includes('cpcb-latest') ? latest : u.includes('air-model') ? model : null;
    if (body === 'throw') throw new Error('network');
    return new Response(JSON.stringify(body), { status: 200 });
  };
  fn.calls = calls;
  return fn;
}
const run = (opts, f, extra = {}) => JVAir.reading(opts, { fetch: f, now: NOW, cities: CITIES, ...extra });

test('a live reading is used when there is one, and nothing else is asked', async () => {
  const f = fake({ waqi: WAQI_OK });
  const r = await run({ lat: 28.6139, lon: 77.209, key: 'delhi', name: 'Delhi' }, f);
  assert.equal(r.kind, 'live');
  assert.equal(r.source, 'WAQI');
  assert.equal(r.distanceKm, 2.4);
  assert.equal(f.calls.length, 1);
});

test('Bengaluru with no live station gets CPCB\'s daily figure, labelled as daily', async () => {
  const f = fake();
  const r = await run({ lat: 12.9716, lon: 77.5946, key: 'bangalore', name: 'Bengaluru' }, f);
  assert.equal(r.kind, 'daily');
  assert.equal(r.source, 'CPCB daily bulletin');
  assert.equal(r.scale, 'CPCB AQI');
  assert.equal(r.aqi, 62);
  assert.equal(r.category, 'Satisfactory');
  assert.equal(r.date, '2026-11-05');
  assert.equal(r.stations, 8);
  assert.equal(r.stationsTotal, 14);
  assert.equal(r.ageDays, 1);
  assert.ok(!('pm25' in r), 'a daily CPCB AQI must not be given an invented µg/m³');
  assert.ok(!f.calls.some((u) => u.includes('air-model')), 'the model is not asked when the bulletin answers');
});

test('a point with no key uses the nearest tracked city within 50 km', async () => {
  const f = fake();
  // Whitefield is about 15 km from the Bengaluru centre.
  const r = await run({ lat: 12.9698, lon: 77.75 }, f);
  assert.equal(r.kind, 'daily');
  assert.equal(r.city, 'Bengaluru');
  assert.ok(r.distanceKm > 10 && r.distanceKm < 25, `got ${r.distanceKm}`);
  assert.ok(f.calls[0].includes('slug=bangalore'), 'the nearest city is offered to the live lookup as a slug');
});

test('a bulletin older than seven days is not used', async () => {
  const old = { cities: { bengaluru: { name: 'Bengaluru', days: [{ date: '2026-10-20', aqi: 62, category: 'Satisfactory', stations: 8, stations_total: 14 }] } } };
  const r = await run({ lat: 12.9716, lon: 77.5946, key: 'bangalore', name: 'Bengaluru' }, fake({ latest: old }));
  assert.equal(r.kind, 'model');
});

test('a place with no tracked city near it goes straight to the model', async () => {
  const f = fake();
  const r = await run({ lat: 15.33, lon: 76.46 }, f); // Hampi: 300 km from anything tracked
  assert.equal(r.kind, 'model');
  assert.equal(r.source, 'Open-Meteo (CAMS model)');
  assert.equal(r.scale, 'US AQI (model)');
  assert.equal(r.pm25, 12.3);
  assert.ok(!f.calls.some((u) => u.includes('cpcb-latest')));
});

test('the model is never returned as live, and neither is the bulletin', async () => {
  for (const [opts, f] of [
    [{ lat: 12.9716, lon: 77.5946, key: 'bangalore', name: 'Bengaluru' }, fake()],
    [{ lat: 15.33, lon: 76.46 }, fake()],
  ]) {
    const r = await run(opts, f);
    assert.notEqual(r.kind, 'live');
  }
});

test('when everything fails the answer is null, not a guess', async () => {
  const f = fake({ waqi: 'throw', latest: 'throw', model: 'throw' });
  assert.equal(await run({ lat: 12.9716, lon: 77.5946, key: 'bangalore', name: 'Bengaluru' }, f), null);
});

test('skip: ["live"] does not call the proxy again when the page already tried it', async () => {
  const f = fake();
  const r = await run({ lat: 12.9716, lon: 77.5946, key: 'bangalore', name: 'Bengaluru' }, f, { skip: ['live'] });
  assert.equal(r.kind, 'daily');
  assert.ok(!f.calls.some((u) => u.includes('waqi-proxy')));
});

test('names the site uses and CPCB spells differently still find the bulletin', async () => {
  const r = await run({ lat: 28.4595, lon: 77.0266, key: 'gurgaon', name: 'Gurgaon' }, fake());
  assert.equal(r.kind, 'daily');
  assert.equal(r.city, 'Gurugram');
  assert.equal(r.aqi, 299);
});

test('the real bulletin file covers the cities that lost their live feed', () => {
  const cities = [
    ['bangalore', 'Bengaluru'], ['mumbai', 'Mumbai'], ['chennai', 'Chennai'], ['hyderabad', 'Hyderabad'],
    ['kolkata', 'Kolkata'], ['pune', 'Pune'], ['lucknow', 'Lucknow'], ['kanpur', 'Kanpur'], ['patna', 'Patna'],
    ['jaipur', 'Jaipur'], ['ahmedabad', 'Ahmedabad'], ['bhopal', 'Bhopal'], ['guwahati', 'Guwahati'],
    ['thiruvananthapuram', 'Thiruvananthapuram'], ['coimbatore', 'Coimbatore'], ['gurgaon', 'Gurgaon'],
  ];
  const now = Date.parse(realLatest._meta.as_of + 'T18:00:00+05:30');
  const missing = cities.filter(([key, name]) => !JVAir.bulletinFor(realLatest, { key, name }, now)).map((c) => c[0]);
  assert.deepEqual(missing, [], `no recent bulletin for: ${missing.join(', ')}`);
});
