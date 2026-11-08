// Netlify Function: a modelled estimate of the air at a point, from Open-Meteo.
//
// This is the last link in the live-reading chain (js/air-sources.js), used only
// when no monitor near a place has reported recently and CPCB's daily bulletin has
// nothing for the nearest city. It is a computer model (CAMS, run by ECMWF, served
// by Open-Meteo), not a measurement, and the page says so wherever it shows it.
//
// How far a model can be from the monitors, measured on 8 November 2026 at 09:30
// IST: for Delhi it gave PM2.5 106 µg/m³ (US AQI 176) while Delhi's stations read
// AQI 335. It smooths over local sources, so it can be badly low in a polluted
// city. The response carries what the page needs to say that.
//
// Open-Meteo's free API is for non-commercial use and asks for attribution
// (CC BY 4.0); JanVayu is non-commercial and credits it next to every figure.
//
//   GET /.netlify/functions/air-model?lat=<lat>&lon=<lon>

const CACHE_SECONDS = 1800; // 30 min: the model updates hourly and is smooth in time
const NUM = '-?\\d{1,3}(?:\\.\\d{1,6})?';
const NUM_RE = new RegExp(`^${NUM}$`);
// The model is global, but JanVayu is about India: refuse points outside a box
// around the subcontinent rather than become a free worldwide proxy.
const BOX = { latMin: 5, latMax: 37, lonMin: 67, lonMax: 98 };

export default async (req) => {
  const url = new URL(req.url);
  const lat = url.searchParams.get('lat');
  const lon = url.searchParams.get('lon');
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Cache-Control': `public, max-age=${CACHE_SECONDS}, s-maxage=${CACHE_SECONDS}`,
    'Netlify-CDN-Cache-Control': `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${CACHE_SECONDS}, durable`,
  };
  const fail = (status, message) => new Response(JSON.stringify({ status: 'error', message }), {
    status,
    headers: { ...headers, 'Cache-Control': 'no-store', 'Netlify-CDN-Cache-Control': 'no-store' },
  });
  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers });
  if (!lat || !lon || !NUM_RE.test(lat) || !NUM_RE.test(lon)) return fail(400, 'Provide ?lat= and ?lon=');
  // Two decimals is about a kilometre, which is finer than the model's own grid.
  const la = Math.round(+lat * 100) / 100;
  const lo = Math.round(+lon * 100) / 100;
  if (la < BOX.latMin || la > BOX.latMax || lo < BOX.lonMin || lo > BOX.lonMax) {
    return fail(400, 'Point is outside the area this estimate covers');
  }
  try {
    const res = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${la}&longitude=${lo}` +
        '&current=pm2_5,pm10,us_aqi&timezone=Asia%2FKolkata',
      { signal: AbortSignal.timeout(8000), headers: { 'User-Agent': 'JanVayu/v26.6 (+https://www.janvayu.in)' } }
    );
    const j = await res.json();
    const c = j && j.current;
    if (!res.ok || !c || typeof c.pm2_5 !== 'number' || !c.time) return fail(502, 'No estimate available');
    return new Response(JSON.stringify({
      status: 'ok',
      data: {
        pm25: c.pm2_5,
        pm10: typeof c.pm10 === 'number' ? c.pm10 : null,
        us_aqi: typeof c.us_aqi === 'number' ? c.us_aqi : null,
        // Open-Meteo gives local time with no offset; the request asked for IST.
        time_iso: `${c.time}:00+05:30`,
        lat: la,
        lon: lo,
      },
      jv: { source: 'Open-Meteo (CAMS model)', license: 'CC BY 4.0', kind: 'model' },
    }), { status: 200, headers });
  } catch (err) {
    console.error('air-model: upstream request failed:', err && err.name);
    return fail(502, 'No estimate available');
  }
};

export const config = { path: '/.netlify/functions/air-model' };
