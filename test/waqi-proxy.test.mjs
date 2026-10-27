// netlify/functions/waqi-proxy.mjs: the only door between a browser and WAQI.
//
// It holds a rate-limited key on behalf of anyone on the internet, so the things
// worth pinning are what it will forward, what it refuses, and that the key
// never comes back out in a response.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const TOKEN = 'testtoken0123456789abcdef0123456789abcd';
process.env.WAQI_TOKEN = TOKEN;
const { default: handler } = await import('../netlify/functions/waqi-proxy.mjs');

let calls = [];
const realFetch = globalThis.fetch;
before(() => {
  globalThis.fetch = async (url) => {
    calls.push(String(url));
    return new Response(JSON.stringify({ status: 'ok', data: { aqi: 120 } }), { status: 200 });
  };
});
after(() => { globalThis.fetch = realFetch; });

const get = (qs) => handler(new Request(`https://www.janvayu.in/.netlify/functions/waqi-proxy?${qs}`));

test('geo is forwarded as a feed/geo request with the server-side token', async () => {
  calls = [];
  const r = await get('geo=28.6139,77.209');
  assert.equal(r.status, 200);
  assert.equal(calls[0], `https://api.waqi.info/feed/geo:28.6139;77.209/?token=${TOKEN}`);
});

test('bounds is forwarded as map/bounds with the token appended to the query', async () => {
  calls = [];
  const r = await get('bounds=28.3639,76.959,28.8639,77.459');
  assert.equal(r.status, 200);
  assert.equal(calls[0], `https://api.waqi.info/map/bounds/?latlng=28.3639,76.959,28.8639,77.459&token=${TOKEN}`);
});

test('a city slug is forwarded', async () => {
  calls = [];
  await get('city=delhi');
  assert.equal(calls[0], `https://api.waqi.info/feed/delhi/?token=${TOKEN}`);
});

test('negative coordinates are accepted', async () => {
  calls = [];
  const r = await get('geo=-33.87,151.21');
  assert.equal(r.status, 200);
});

test('malformed or out-of-range input is refused and never reaches WAQI', async () => {
  const bad = [
    '', 'geo=abc', 'geo=28.6;77.2', 'geo=28.6,77.2,1', 'geo=91,10', 'geo=10,181',
    'city=../../x', 'city=a b', 'city=' + 'a'.repeat(61),
    'bounds=1,2,3', 'bounds=1,2,3,x', 'bounds=95,0,96,1',
    'bounds=0,0,10,10',       // ten degrees wide: the whole subcontinent
    'bounds=0,0,0.5,3.5',     // too wide in longitude only
  ];
  for (const qs of bad) {
    calls = [];
    const r = await get(qs);
    assert.equal(r.status, 400, `expected 400 for "${qs}", got ${r.status}`);
    assert.equal(calls.length, 0, `"${qs}" reached WAQI`);
  }
});

test('the token is never in a response, including an error', async () => {
  const ok = await (await get('geo=28.6,77.2')).text();
  const bad = await (await get('geo=zzz')).text();
  assert.ok(!ok.includes(TOKEN) && !bad.includes(TOKEN));
  globalThis.fetch = async (url) => { throw new Error(`connect failed: ${url}`); };
  const down = await get('geo=28.6,77.2');
  const body = await down.text();
  assert.equal(down.status, 502);
  assert.ok(!body.includes(TOKEN), 'the upstream URL, which carries the token, leaked into the error');
});

test('errors are not cached, successes are', async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({ status: 'ok' }), { status: 200 });
  const ok = await get('geo=28.6,77.2');
  assert.match(ok.headers.get('Cache-Control'), /s-maxage=300/);
  const bad = await get('geo=zzz');
  assert.equal(bad.headers.get('Cache-Control'), 'no-store');
});

test('with no token set it says so and makes no WAQI call', () => {
  const env = { ...process.env };
  delete env.WAQI_TOKEN; delete env.WAQI_API_TOKEN;
  const out = execFileSync(process.execPath, ['--input-type=module', '-e', `
    let called = false;
    globalThis.fetch = async () => { called = true; return new Response('{}'); };
    const { default: h } = await import('./netlify/functions/waqi-proxy.mjs');
    const r = await h(new Request('https://x/?geo=28.6,77.2'));
    console.log(JSON.stringify({ status: r.status, called }));
  `], { env, cwd: new URL('..', import.meta.url).pathname, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  assert.deepEqual(JSON.parse(out.trim().split('\n').pop()), { status: 503, called: false });
});

test('WAQI_API_TOKEN still works as a name for the same setting', () => {
  const env = { ...process.env, WAQI_API_TOKEN: 'viaoldname' };
  delete env.WAQI_TOKEN;
  const out = execFileSync(process.execPath, ['--input-type=module', '-e', `
    const { WAQI_TOKEN } = await import('./netlify/functions/lib/waqi-token.mjs');
    console.log(WAQI_TOKEN);
  `], { env, cwd: new URL('..', import.meta.url).pathname, encoding: 'utf8' });
  assert.equal(out.trim(), 'viaoldname');
});
