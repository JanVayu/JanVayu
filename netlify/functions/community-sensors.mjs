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

import { getStore } from "@netlify/blobs";

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

  const res = await fetch(SC_URL, { headers: { "User-Agent": "JanVayu/1.0 (https://janvayu.in)" } });
  if (!res.ok) throw new Error("Sensor.Community fetch failed: " + res.status);
  const data = await res.json();

  try {
    const store = getBlobStore("janvayu-feeds");
    await store.setJSON("sensor-community", { data, fetched_at: Date.now() });
  } catch (e) { /* ignore */ }

  return data;
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
