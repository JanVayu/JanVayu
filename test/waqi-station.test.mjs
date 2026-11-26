// A reading is only as good as the station behind it.
//
// On 8 November 2026 a reader in Bengaluru pressed "Near me" and was shown Delhi's
// air (AQI 221, "Very Unhealthy") from a station 1,730 km away, while Bengaluru's own
// station read 53. WAQI's feed/geo:<lat>;<lon>/ answered status "ok" with a Delhi
// station for 28 of the 32 Indian core cities, and nothing in the site noticed:
// every consumer took whatever came back. These tests pin the guard: a station
// farther than MAX_STATION_KM from the point asked for is not a reading.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const TOKEN = 'testtoken0123456789abcdef0123456789abcd';
process.env.WAQI_TOKEN = TOKEN;
const { haversineKm, distanceToFeed, ageHours, isFresh, fetchStationNear, MAX_STATION_KM, MAX_AGE_HOURS } =
  await import('../netlify/functions/lib/waqi-station.mjs');
const { default: proxy } = await import('../netlify/functions/waqi-proxy.mjs');

const BENGALURU = [12.9716, 77.5946];
const JUST_NOW = { iso: new Date().toISOString() };
const DELHI_STATION = { aqi: 221, iaqi: { pm25: { v: 221 } }, city: { name: 'Dr. Karni Singh Shooting Range, Delhi', geo: [28.4, 77.07] }, time: JUST_NOW };
const BENGALURU_STATION = { aqi: 53, iaqi: { pm25: { v: 53 } }, city: { name: 'Hombegowda Nagar, Bengaluru', geo: [12.9385, 77.5901] }, time: JUST_NOW };
const KOCHI_JAPAN = { aqi: 25, city: { name: 'Kera, Kochi, Japan', geo: [33.5, 133.5] }, time: JUST_NOW };
// What WAQI actually returns for these on 8 November 2026: right place, frozen clock.
const BENGALURU_FROZEN = { ...BENGALURU_STATION, time: { iso: '2026-06-23T10:00:00+05:30' } };
const MUMBAI_FROZEN = { aqi: 158, city: { name: 'Mumbai US Consulate', geo: [19.0544, 72.8403] }, time: { iso: '2025-03-04T06:00:00+05:30' } };

// A WAQI that behaves as it did on 8 November: the coordinate lookup answers every
// point in India with a Delhi station; the city feed answers with the right one.
let calls = [];
const realFetch = globalThis.fetch;
before(() => {
  globalThis.fetch = async (url) => {
    const u = String(url);
    calls.push(u);
    const body = (data) => new Response(JSON.stringify({ status: 'ok', data }), { status: 200 });
    if (u.includes('/feed/geo:28.6')) return body({ ...DELHI_STATION, city: { name: 'Mandir Marg, Delhi', geo: [28.636, 77.201] } });
    if (u.includes('/feed/geo:')) return body(DELHI_STATION);
    if (u.includes('/feed/bengaluru/')) return body(BENGALURU_STATION);
    if (u.includes('/feed/kochi/')) return body(KOCHI_JAPAN);
    if (u.includes('/feed/nogeo/')) return body({ aqi: 90, time: JUST_NOW });
    if (u.includes('/feed/frozen-bengaluru/')) return body(BENGALURU_FROZEN);
    if (u.includes('/feed/mumbai/')) return body(MUMBAI_FROZEN);
    if (u.includes('/feed/notime/')) return body({ aqi: 90, city: { name: 'x', geo: [20, 78] } });
    return new Response(JSON.stringify({ status: 'error', data: 'Unknown station' }), { status: 200 });
  };
});
after(() => { globalThis.fetch = realFetch; });

test('haversine: Bengaluru to Delhi is about 1,740 km', () => {
  const km = haversineKm(12.9716, 77.5946, 28.6139, 77.209);
  assert.ok(km > 1700 && km < 1780, `got ${km}`);
});

test('distanceToFeed reads the station position, and is null when there is none', () => {
  assert.ok(distanceToFeed(BENGALURU_STATION, ...BENGALURU) < 6);
  assert.equal(distanceToFeed({ aqi: 90 }, ...BENGALURU), null);
  assert.equal(distanceToFeed({ city: { geo: ['x', 'y'] } }, ...BENGALURU), null);
});

test('Bengaluru is never given the Delhi station WAQI returns for its coordinates', async () => {
  calls = [];
  const hit = await fetchStationNear({ lat: BENGALURU[0], lon: BENGALURU[1], slug: 'bengaluru' });
  assert.ok(hit, 'the Bengaluru station should be found through the city feed');
  assert.equal(hit.via, 'slug');
  assert.match(hit.data.city.name, /Bengaluru/);
  assert.ok(hit.distanceKm < MAX_STATION_KM);
  assert.ok(calls[0].includes('/feed/geo:'), 'WAQI geo is tried first');
});

test('with no slug there is no reading rather than Delhi\'s', async () => {
  const hit = await fetchStationNear({ lat: BENGALURU[0], lon: BENGALURU[1] });
  assert.equal(hit, null);
});

test('a city whose city feed names a station in another country is refused', async () => {
  const hit = await fetchStationNear({ lat: 9.9312, lon: 76.2673, slug: 'kochi' });
  assert.equal(hit, null);
});

test('a feed that does not say where its station is is not trusted', async () => {
  const hit = await fetchStationNear({ lat: 20, lon: 78, slug: 'nogeo' });
  assert.equal(hit, null);
});

test('a station that stopped reporting is not a live reading, however near it is', async () => {
  // Bengaluru's station is 3.7 km away and its last reading is from 23 June 2026.
  const frozen = await fetchStationNear({ lat: BENGALURU[0], lon: BENGALURU[1], slug: 'frozen-bengaluru' });
  assert.equal(frozen, null);
  // Mumbai's is 1 km away and from March 2025.
  assert.equal(await fetchStationNear({ lat: 19.076, lon: 72.8777, slug: 'mumbai' }), null);
});

test('a feed with no timestamp is not trusted', async () => {
  assert.equal(await fetchStationNear({ lat: 20, lon: 78, slug: 'notime' }), null);
});

test('ageHours and isFresh: hours since the station\'s own timestamp', () => {
  const now = Date.parse('2026-11-08T12:00:00+05:30');
  assert.equal(ageHours({ time: { iso: '2026-11-08T09:00:00+05:30' } }, now), 3);
  assert.equal(isFresh({ time: { iso: '2026-11-08T09:00:00+05:30' } }, MAX_AGE_HOURS, now), true);
  assert.equal(isFresh({ time: { iso: '2026-11-08T05:00:00+05:30' } }, MAX_AGE_HOURS, now), false);
  assert.equal(isFresh({ time: { iso: '2026-06-23T10:00:00+05:30' } }, MAX_AGE_HOURS, now), false);
  assert.equal(isFresh({ time: { iso: 'not a date' } }, MAX_AGE_HOURS, now), false);
  assert.equal(isFresh({}, MAX_AGE_HOURS, now), false);
  assert.equal(isFresh({ time: { iso: '2026-11-08T14:00:00+05:30' } }, MAX_AGE_HOURS, now), false, 'two hours in the future is not clock skew');
});

test('proxy city mode refuses a frozen station that WAQI still calls ok', async () => {
  const r = await near('city=mumbai');
  assert.equal(r.status, 404);
  assert.match((await r.json()).message, /last reported \d+ hours ago/);
});

test('a station a few kilometres away is accepted by the geo lookup', async () => {
  const hit = await fetchStationNear({ lat: 28.6139, lon: 77.209, slug: 'delhi' });
  assert.ok(hit);
  assert.equal(hit.via, 'geo');
  assert.ok(hit.distanceKm < 5);
});

test('the radius can be tightened but never widened past 50 km', async () => {
  // Delhi\'s station is ~2 km from this point: refused at 1 km, accepted at 30.
  assert.equal(await fetchStationNear({ lat: 28.6139, lon: 77.209, maxKm: 1 }), null);
  // Lucknow is ~400 km from the Delhi station; asking for 500 km is clamped to 50.
  assert.equal(await fetchStationNear({ lat: 26.8467, lon: 80.9462, maxKm: 500 }), null);
});

const near = (qs) => proxy(new Request(`https://www.janvayu.in/.netlify/functions/waqi-proxy?${qs}`));

test('proxy near: Bengaluru gets Bengaluru, with the distance, and never the token', async () => {
  const r = await near('near=12.97,77.59&slug=bengaluru');
  assert.equal(r.status, 200);
  const text = await r.text();
  assert.ok(!text.includes(TOKEN));
  const j = JSON.parse(text);
  assert.equal(j.status, 'ok');
  assert.match(j.data.city.name, /Bengaluru/);
  assert.equal(j.jv.via, 'slug');
  assert.ok(j.jv.distance_km < 30);
  assert.ok(j.jv.age_hours < 1);
});

test('proxy near: no station within range is a 404 that says so', async () => {
  const r = await near('near=9.93,76.27&slug=kochi');
  assert.equal(r.status, 404);
  const j = await r.json();
  assert.equal(j.status, 'error');
  assert.match(j.message, /No monitoring station within 30 km has reported in the last 6 hours/);
});

test('proxy near: bad slug and bad max are refused before WAQI is called', async () => {
  calls = [];
  assert.equal((await near('near=12.97,77.59&slug=../etc')).status, 400);
  assert.equal((await near('near=12.97,77.59&max=abc')).status, 400);
  assert.equal((await near('near=999,77.59')).status, 400);
  assert.equal(calls.length, 0);
});

test('no browser code and no function asks WAQI for a station by coordinates unguarded', () => {
  // Browser code goes through ?near=, never ?geo=.
  for (const f of ['app.js', 'js/try-home.js']) {
    const src = readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
    assert.ok(!/waqi-proxy[^\n]*\?geo=|WAQI_PROXY[^\n]*\?geo=/.test(src), `${f} still calls ?geo=`);
  }
  // Server code reaches feed/geo only inside lib/waqi-station.mjs (guarded) and the
  // proxy\'s own passthrough, which is kept for old callers.
  const dir = new URL('../netlify/functions/', import.meta.url);
  for (const f of readdirSync(dir).filter((n) => n.endsWith('.mjs'))) {
    if (f === 'waqi-proxy.mjs') continue;
    const src = readFileSync(new URL(f, dir), 'utf8');
    assert.ok(!/api\.waqi\.info\/feed\/geo|feed\/geo:\$\{/.test(src), `${f} asks WAQI for a station by coordinates without the distance check`);
  }
});
