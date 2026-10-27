// Netlify Function: WAQI proxy. The only way a browser reaches api.waqi.info.
//
// The token lives in the WAQI_TOKEN environment variable (lib/waqi-token.mjs)
// and never leaves the server. The site's own pages, and the /embed/ widgets that
// any third-party site can iframe, call this instead of WAQI directly:
//   GET /.netlify/functions/waqi-proxy?city=<slug>                   -> /feed/<city>/
//   GET /.netlify/functions/waqi-proxy?geo=<lat>,<lon>               -> /feed/geo:<lat>;<lon>/
//   GET /.netlify/functions/waqi-proxy?bounds=<lat1>,<lon1>,<lat2>,<lon2>
//                                                                    -> /map/bounds/?latlng=...
//
// Because it now stands between the open internet and a rate-limited key, it
// accepts only what the site needs: slugs of letters, digits and hyphens;
// coordinates in range; and a bounding box no wider than MAX_BOX_DEG degrees.
// Responses are cached for 5 minutes at the CDN, which also keeps the same city
// from costing one WAQI call per visitor.

import { WAQI_TOKEN } from './lib/waqi-token.mjs';

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

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    'Cache-Control': `public, max-age=${CACHE_SECONDS}, s-maxage=${CACHE_SECONDS}`,
  };
  const fail = (status, message) => new Response(JSON.stringify({ status: 'error', message }), {
    status,
    // An error must not be cached for five minutes.
    headers: { ...headers, 'Cache-Control': 'no-store' },
  });

  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers });
  }

  // Validate input strictly: only what we will forward to WAQI.
  let waqiPath;
  if (city && /^[a-z0-9\-]+$/i.test(city) && city.length <= 60) {
    waqiPath = `feed/${encodeURIComponent(city)}/`;
  } else if (geo && GEO_RE.test(geo)) {
    const [, lat, lon] = geo.match(GEO_RE);
    if (!inRange(+lat, +lon)) return fail(400, 'Coordinates out of range');
    waqiPath = `feed/geo:${lat};${lon}/`;
  } else if (bounds && BOUNDS_RE.test(bounds)) {
    const [, lat1, lon1, lat2, lon2] = bounds.match(BOUNDS_RE);
    if (!inRange(+lat1, +lon1) || !inRange(+lat2, +lon2)) return fail(400, 'Coordinates out of range');
    if (Math.abs(lat1 - lat2) > MAX_BOX_DEG || Math.abs(lon1 - lon2) > MAX_BOX_DEG) {
      return fail(400, `Bounding box wider than ${MAX_BOX_DEG} degrees`);
    }
    waqiPath = `map/bounds/?latlng=${lat1},${lon1},${lat2},${lon2}`;
  } else {
    return fail(400, 'Provide ?city=<slug>, ?geo=<lat>,<lon> or ?bounds=<lat1>,<lon1>,<lat2>,<lon2>');
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
