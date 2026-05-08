// Netlify Function: WAQI proxy for embed widgets.
//
// The /embed/aqi/ and /embed/rankings/ widgets are iframable from any third-party
// site. They previously called api.waqi.info directly with a hardcoded token
// shipped in client JS — operationally fragile (a revoked or rate-limited token
// silently breaks every embed in the wild) and a small ops-secret leak.
//
// This proxy keeps the WAQI token server-side (read from WAQI_API_TOKEN env var
// with a sensible fallback) and forwards a tightly-scoped request to WAQI:
//   - GET /.netlify/functions/waqi-proxy?city=<slug>          → /feed/<city>/
//   - GET /.netlify/functions/waqi-proxy?geo=<lat>,<lon>      → /feed/geo:<lat>;<lon>/
//
// Responses are cached for 5 minutes at the CDN to keep embeds snappy and
// stay well inside WAQI's free-tier rate limit.

const FALLBACK_TOKEN = '1f64cc8563a165dc5a6ce48f7eeb9ba0221b63f3';
const CACHE_SECONDS = 300; // 5 min

export default async (req) => {
  const url = new URL(req.url);
  const city = url.searchParams.get('city');
  const geo = url.searchParams.get('geo');

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    'Cache-Control': `public, max-age=${CACHE_SECONDS}, s-maxage=${CACHE_SECONDS}`,
  };

  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers });
  }

  // Validate input strictly — only allow what we'll forward to WAQI.
  let waqiPath;
  if (city && /^[a-z0-9\-]+$/i.test(city) && city.length <= 60) {
    waqiPath = `feed/${encodeURIComponent(city)}/`;
  } else if (geo && /^-?\d{1,3}(\.\d+)?,-?\d{1,3}(\.\d+)?$/.test(geo)) {
    const [lat, lon] = geo.split(',');
    waqiPath = `feed/geo:${lat};${lon}/`;
  } else {
    return new Response(JSON.stringify({ status: 'error', message: 'Provide ?city=<slug> or ?geo=<lat>,<lon>' }), {
      status: 400,
      headers,
    });
  }

  const token = process.env.WAQI_API_TOKEN || FALLBACK_TOKEN;
  const upstream = `https://api.waqi.info/${waqiPath}?token=${token}`;

  try {
    const res = await fetch(upstream, { headers: { 'User-Agent': 'JanVayu/26.5 (+https://www.janvayu.in)' } });
    const json = await res.json();
    return new Response(JSON.stringify(json), {
      status: res.ok ? 200 : 502,
      headers,
    });
  } catch (err) {
    return new Response(JSON.stringify({ status: 'error', message: 'Upstream WAQI request failed', detail: String(err) }), {
      status: 502,
      headers,
    });
  }
};

export const config = {
  path: '/.netlify/functions/waqi-proxy',
};
