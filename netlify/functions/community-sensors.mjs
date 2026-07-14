// Netlify Function: Community Sensors
//
// GET /.netlify/functions/community-sensors?lat=28.6&lon=77.2&radius=25
//
// Pulls open community-sensor PM2.5 data from Sensor.Community (formerly
// Luftdaten) — a free, no-auth, CC0-licensed global network of citizen-run
// low-cost monitors. Filters to a bounding circle around (lat, lon).
//
// Why: aqi.in / oaq.notf.in show hyperlocal community sensors that JanVayu
// previously did not. Sensor.Community gives us those without us building a
// hardware program.
//
// v26.6.44 — PRIMARY source is now OpenAQ v3 when an OPENAQ_API_KEY is set.
// Sensor.Community has essentially no live Indian coverage (the long-standing
// "no Indian stations" gap), whereas OpenAQ v3 aggregates CPCB's own CAAQMS
// feeds plus community/low-cost networks and has dense India coverage. We fall
// back to Sensor.Community automatically when the key is absent or OpenAQ
// returns nothing, so the endpoint keeps working with zero configuration.

import { getStore } from "@netlify/blobs";

const OPENAQ_KEY = process.env.OPENAQ_API_KEY || "";

function getBlobStore(name) {
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
  const token = process.env.BLOB_TOKEN;
  if (siteID && token) return getStore({ name, siteID, token, consistency: "strong" });
  return getStore({ name, consistency: "strong" });
}

const SC_URL = "https://data.sensor.community/static/v2/data.json"; // ~5 MB, refreshed every 5 min

function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = d => d * Math.PI / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function pm25ToAQI(c) {
  if (c == null || isNaN(c)) return null;
  const bp = [
    [0, 12, 0, 50], [12.1, 35.4, 51, 100], [35.5, 55.4, 101, 150],
    [55.5, 150.4, 151, 200], [150.5, 250.4, 201, 300],
    [250.5, 350.4, 301, 400], [350.5, 500.4, 401, 500]
  ];
  for (const [cl, ch, il, ih] of bp) {
    if (c >= cl && c <= ch) return Math.round(((ih - il) / (ch - cl)) * (c - cl) + il);
  }
  return c > 500 ? 500 : null;
}

async function getSnapshot() {
  // Cache the full Sensor.Community dump in Netlify Blobs for 10 minutes to
  // avoid hammering their API on every user request.
  try {
    const store = getBlobStore("janvayu-feeds");
    const cached = await store.get("sensor-community", { type: "json" });
    if (cached && cached.fetched_at && (Date.now() - cached.fetched_at) < 10 * 60 * 1000) {
      return cached.data;
    }
  } catch (e) { /* ignore */ }

  const res = await fetch(SC_URL, { headers: { "User-Agent": "JanVayu/v26.6 (+https://janvayu.in)" } });
  if (!res.ok) throw new Error("Sensor.Community fetch failed: " + res.status);
  const data = await res.json();

  try {
    const store = getBlobStore("janvayu-feeds");
    await store.setJSON("sensor-community", { data, fetched_at: Date.now() });
  } catch (e) { /* ignore */ }

  return data;
}

// ── OpenAQ v3 (primary when OPENAQ_API_KEY is set) ──────────────────────────
// Fetches monitoring locations within the radius, then the latest value per
// location, and returns them in the same shape as the Sensor.Community path.
async function getOpenAQStations(lat, lon, radiusKm) {
  const radiusM = Math.min(25000, Math.round(radiusKm * 1000)); // OpenAQ caps radius at 25 km
  const cacheKey = `openaq-${lat.toFixed(2)}-${lon.toFixed(2)}-${radiusM}`;

  try {
    const store = getBlobStore("janvayu-feeds");
    const cached = await store.get(cacheKey, { type: "json" });
    if (cached && cached.fetched_at && (Date.now() - cached.fetched_at) < 10 * 60 * 1000) {
      return cached.stations;
    }
  } catch (e) { /* ignore cache miss */ }

  const headers = { "X-API-Key": OPENAQ_KEY, "User-Agent": "JanVayu/v26.6 (+https://janvayu.in)" };
  const locRes = await fetch(
    `https://api.openaq.org/v3/locations?coordinates=${lat},${lon}&radius=${radiusM}&limit=100`,
    { headers, signal: AbortSignal.timeout(6000) }
  );
  if (!locRes.ok) throw new Error("OpenAQ locations fetch failed: " + locRes.status);
  const locJson = await locRes.json();
  const locations = Array.isArray(locJson.results) ? locJson.results : [];
  if (!locations.length) return [];

  // Sort by distance and cap the fan-out so we stay within OpenAQ's rate limits.
  const withDist = locations
    .map(l => {
      const sLat = l.coordinates?.latitude, sLon = l.coordinates?.longitude;
      if (sLat == null || sLon == null) return null;
      return { loc: l, dist: haversineKm(lat, lon, sLat, sLon) };
    })
    .filter(Boolean)
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 30);

  const settled = await Promise.allSettled(withDist.map(async ({ loc, dist }) => {
    // sensorsId → parameter name (pm25 / pm10) from the location metadata
    const sensorMap = {};
    for (const s of (loc.sensors || [])) {
      if (s?.id != null && s.parameter?.name) sensorMap[s.id] = s.parameter.name;
    }
    const res = await fetch(`https://api.openaq.org/v3/locations/${loc.id}/latest`, { headers, signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const j = await res.json();
    let pm25 = null, pm10 = null;
    // Freshness guard: OpenAQ returns a station's LAST value even if it is years
    // old (dead/zombie stations report e.g. a 2018 reading). Surfacing that as
    // "live hyperlocal" air would violate JanVayu's data-honesty principle, so
    // we drop any reading older than MAX_AGE_MS.
    const MAX_AGE_MS = 6 * 60 * 60 * 1000; // 6 hours
    for (const r of (Array.isArray(j.results) ? j.results : [])) {
      const param = sensorMap[r.sensorsId];
      const val = parseFloat(r.value);
      if (isNaN(val)) continue;
      const ts = r.datetime?.utc || r.datetime;
      if (ts) {
        const age = Date.now() - new Date(ts).getTime();
        if (!isNaN(age) && age > MAX_AGE_MS) continue; // skip stale readings
      }
      if (param === "pm25") pm25 = val;
      else if (param === "pm10") pm10 = val;
    }
    if (pm25 == null && pm10 == null) return null;
    return {
      id: loc.id,
      lat: loc.coordinates.latitude,
      lon: loc.coordinates.longitude,
      pm25, pm10,
      name: loc.name || ("OpenAQ #" + loc.id),
      distance_km: Math.round(dist * 10) / 10,
      aqi: pm25ToAQI(pm25),
    };
  }));

  const stations = settled
    .filter(s => s.status === "fulfilled" && s.value && s.value.pm25 != null)
    .map(s => s.value)
    .sort((a, b) => (b.pm25 || 0) - (a.pm25 || 0))
    .slice(0, 60);

  try {
    const store = getBlobStore("janvayu-feeds");
    await store.setJSON(cacheKey, { stations, fetched_at: Date.now() });
  } catch (e) { /* ignore cache write failure */ }

  return stations;
}

export default async (req) => {
  const url = new URL(req.url);
  const lat = parseFloat(url.searchParams.get("lat") || "0");
  const lon = parseFloat(url.searchParams.get("lon") || "0");
  const radiusKm = Math.min(50, parseFloat(url.searchParams.get("radius") || "25"));
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "public, max-age=300",
  };

  if (!lat || !lon) {
    return new Response(JSON.stringify({ stations: [], error: "lat and lon are required" }), { status: 400, headers });
  }

  // PRIMARY: OpenAQ v3 (CPCB CAAQMS + community networks) when a key is set.
  if (OPENAQ_KEY) {
    try {
      const stations = await getOpenAQStations(lat, lon, radiusKm);
      if (stations.length > 0) {
        return new Response(JSON.stringify({
          stations,
          source: "OpenAQ v3 (CPCB CAAQMS + community/low-cost networks)",
          generated: new Date().toISOString()
        }), { headers });
      }
      // else fall through to Sensor.Community
    } catch (e) {
      console.log("OpenAQ path failed, falling back to Sensor.Community:", e.message);
    }
  }

  // FALLBACK: Sensor.Community (open CC0 network; sparse in India).
  try {
    const data = await getSnapshot();
    if (!Array.isArray(data)) {
      return new Response(JSON.stringify({ stations: [], note: "Upstream returned no data." }), { headers });
    }

    // Each entry: { id, sensor: { id, sensor_type: { name } }, location: { latitude, longitude }, sensordatavalues: [{ value_type, value }] }
    const grouped = {};
    for (const rec of data) {
      const sLat = parseFloat(rec.location?.latitude);
      const sLon = parseFloat(rec.location?.longitude);
      if (!sLat || !sLon) continue;
      if (haversineKm(lat, lon, sLat, sLon) > radiusKm) continue;

      const id = rec.location?.id || rec.sensor?.id;
      if (!id) continue;
      if (!grouped[id]) grouped[id] = { id, lat: sLat, lon: sLon, pm25: null, pm10: null, name: null };

      for (const v of (rec.sensordatavalues || [])) {
        const val = parseFloat(v.value);
        if (isNaN(val)) continue;
        if (v.value_type === "P2") grouped[id].pm25 = val; // PM2.5 in µg/m³
        if (v.value_type === "P1") grouped[id].pm10 = val; // PM10  in µg/m³
      }
      grouped[id].name = "Sensor.Community #" + id;
    }

    const stations = Object.values(grouped)
      .filter(s => s.pm25 != null)
      .map(s => ({ ...s, aqi: pm25ToAQI(s.pm25) }))
      .sort((a, b) => (b.pm25 || 0) - (a.pm25 || 0))
      .slice(0, 60);

    return new Response(JSON.stringify({
      stations,
      source: "Sensor.Community (open community network, CC0)",
      generated: new Date().toISOString()
    }), { headers });
  } catch (e) {
    return new Response(JSON.stringify({ stations: [], error: e.message }), { status: 200, headers });
  }
};
