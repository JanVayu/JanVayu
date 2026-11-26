// Netlify Function: WAQI proxy. The only way a browser reaches api.waqi.info.
//
// The token lives in the WAQI_TOKEN environment variable (lib/waqi-token.mjs)
// and never leaves the server. The site's own pages, and the /embed/ widgets that
// any third-party site can iframe, call this instead of WAQI directly:
//   GET /.netlify/functions/waqi-proxy?city=<slug>                   -> /feed/<city>/
//   GET /.netlify/functions/waqi-proxy?geo=<lat>,<lon>               -> same as near= (guarded)
//   GET /.netlify/functions/waqi-proxy?bounds=<lat1>,<lon1>,<lat2>,<lon2>
//                                                                    -> /map/bounds/?latlng=...
//   GET /.netlify/functions/waqi-proxy?near=<lat>,<lon>[&slug=<city>][&max=<km>]
//                                                                    -> the nearest station within max km
//
// `near` is what a reading for a place should use: the station must be within max
// km (30 by default) and have reported in the last six hours. See
// lib/waqi-station.mjs for the Bengaluru reader who was shown Delhi's air, and for
// why a station that has stopped reporting is refused too.
//
// Because it now stands between the open internet and a rate-limited key, it
// accepts only what the site needs: slugs of letters, digits and hyphens;
// coordinates in range; and a bounding box no wider than MAX_BOX_DEG degrees.
// Responses are cached for 5 minutes at the CDN, which also keeps the same city
// from costing one WAQI call per visitor.

import { WAQI_TOKEN } from './lib/waqi-token.mjs';
import { fetchStationNear, isFresh, ageHours, MAX_STATION_KM, MAX_ALLOWED_KM, MAX_AGE_HOURS } from './lib/waqi-station.mjs';

const CACHE_SECONDS = 300; // 5 min
// The widest box the site asks for is about 0.5 degrees. Three leaves room and
// still stops a request for the whole subcontinent.
const MAX_BOX_DEG = 3;

const NUM = '-?\\d{1,3}(?:\\.\\d{1,6})?';
const GEO_RE = new RegExp(`^(${NUM}),(${NUM})$`);
const BOUNDS_RE = new RegExp(`^(${NUM}),(${NUM}),(${NUM}),(${NUM})$`);

function inRange(lat, lon) {
  return Math.abs(lat) <= 90 && Math.abs(lon) <= 180;
}

export default async (req) => {
  const url = new URL(req.url);
  const city = url.searchParams.get('city');
  const geo = url.searchParams.get('geo');
  const bounds = url.searchParams.get('bounds');
  // ?geo= is the old spelling of ?near= and now takes the same guarded route: its
  // answer used to be WAQI's nearest station whatever the distance.
  const near = url.searchParams.get('near') || geo;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    'Cache-Control': `public, max-age=${CACHE_SECONDS}, s-maxage=${CACHE_SECONDS}`,
    // Every call to this function costs an invocation, and the homepage makes about
    // thirty-four of them. The plain s-maxage is held per edge node, so measured
    // from one machine only one request in six was a hit. `durable` asks Netlify to
    // keep the response in its shared cache, so a node that misses is answered from
    // there and the function does not run. stale-while-revalidate lets the answer
    // refresh in the background instead of making a visitor wait for it.
    'Netlify-CDN-Cache-Control': `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${CACHE_SECONDS}, durable`,
  };
  const fail = (status, message) => new Response(JSON.stringify({ status: 'error', message }), {
    status,
    // An error must not be cached for five minutes.
    headers: { ...headers, 'Cache-Control': 'no-store', 'Netlify-CDN-Cache-Control': 'no-store' },
  });

  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers });
  }

  // Validate input strictly: only what we will forward to WAQI.
  let waqiPath;
  if (city && /^[a-z0-9\-]+$/i.test(city) && city.length <= 60) {
    waqiPath = `feed/${encodeURIComponent(city)}/`;
  } else if (near && GEO_RE.test(near)) {
    const [, lat, lon] = near.match(GEO_RE);
    if (!inRange(+lat, +lon)) return fail(400, 'Coordinates out of range');
    const slug = url.searchParams.get('slug') || '';
    if (slug && !/^[a-z0-9\-]{1,60}$/i.test(slug)) return fail(400, 'Bad slug');
    const maxParam = url.searchParams.get('max');
    if (maxParam !== null && !/^\d{1,2}$/.test(maxParam)) return fail(400, 'Bad max');
    const maxKm = maxParam === null ? MAX_STATION_KM : Math.min(Math.max(+maxParam, 1), MAX_ALLOWED_KM);
    if (!WAQI_TOKEN) {
      console.error('waqi-proxy: WAQI_TOKEN is not set in the Netlify environment');
      return fail(503, 'WAQI is not configured');
    }
    const hit = await fetchStationNear({ lat: +lat, lon: +lon, slug, maxKm });
    // "No station here" is as stable as a reading, so it is cached like one: a city
    // that has none would otherwise cost two WAQI calls on every page load.
    if (!hit) return new Response(JSON.stringify({ status: 'error', message: `No monitoring station within ${maxKm} km has reported in the last ${MAX_AGE_HOURS} hours` }), { status: 404, headers });
    return new Response(JSON.stringify({ status: 'ok', data: hit.data, jv: { distance_km: hit.distanceKm, age_hours: hit.ageHours, via: hit.via, max_km: maxKm, max_age_hours: MAX_AGE_HOURS } }), { status: 200, headers });
  } else if (bounds && BOUNDS_RE.test(bounds)) {
    const [, lat1, lon1, lat2, lon2] = bounds.match(BOUNDS_RE);
    if (!inRange(+lat1, +lon1) || !inRange(+lat2, +lon2)) return fail(400, 'Coordinates out of range');
    if (Math.abs(lat1 - lat2) > MAX_BOX_DEG || Math.abs(lon1 - lon2) > MAX_BOX_DEG) {
      return fail(400, `Bounding box wider than ${MAX_BOX_DEG} degrees`);
    }
    waqiPath = `map/bounds/?latlng=${lat1},${lon1},${lat2},${lon2}`;
  } else {
    return fail(400, 'Provide ?city=<slug>, ?near=<lat>,<lon>, ?geo=<lat>,<lon> or ?bounds=<lat1>,<lon1>,<lat2>,<lon2>');
  }

  if (!WAQI_TOKEN) {
    console.error('waqi-proxy: WAQI_TOKEN is not set in the Netlify environment');
    return fail(503, 'WAQI is not configured');
  }
  const sep = waqiPath.includes('?') ? '&' : '?';
  const upstream = `https://api.waqi.info/${waqiPath}${sep}token=${WAQI_TOKEN}`;

  try {
    const res = await fetch(upstream, { headers: { 'User-Agent': 'JanVayu/v26.6 (+https://www.janvayu.in)' } });
    const json = await res.json();
    // A city feed from a station that stopped reporting is still status "ok".
    if (city && json && json.status === 'ok' && json.data && typeof json.data === 'object' && !isFresh(json.data)) {
      const h = ageHours(json.data);
      return new Response(JSON.stringify({ status: 'error', message: h === null ? 'Station gives no timestamp' : `Station last reported ${Math.round(h)} hours ago` }), { status: 404, headers });
    }
    return new Response(JSON.stringify(json), {
      status: res.ok ? 200 : 502,
      headers,
    });
  } catch (err) {
    // Say that it failed, not why: the reason can carry the upstream URL, and
    // the URL carries the token.
    console.error('waqi-proxy: upstream request failed:', err && err.name);
    return fail(502, 'Upstream WAQI request failed');
  }
};

export const config = {
  path: '/.netlify/functions/waqi-proxy',
};
