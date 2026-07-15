// Netlify Function: Farm-fire / stubble-burning tracker (NASA FIRMS)
//
// GET /.netlify/functions/fire-tracker?area=nwindia|india&days=1..10
//
// Proxies NASA FIRMS active-fire detections (VIIRS / NOAA-20, near-real-time)
// for the North-India stubble belt — the seasonal driver of Delhi's winter
// smog (peak Oct-Nov). Reads FIRMS_MAP_KEY from env; returns an empty set (not
// an error) when the key is absent, so the endpoint is safe to deploy dormant.
//
// Source note: VIIRS_SNPP_NRT was returning no data at build time, so we use
// VIIRS_NOAA20_NRT which has full current coverage.

import { getBlobStore } from "./lib/blob.mjs";


const MAP_KEY = process.env.FIRMS_MAP_KEY || "";
const SOURCE = "VIIRS_NOAA20_NRT";

// Bounding boxes as "west,south,east,north".
const AREAS = {
  nwindia: "73,27,78,32", // Punjab + Haryana + Delhi-NCR (the stubble belt)
  india: "68,6,98,38",
};

function parseCSV(text) {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const header = lines[0].split(",").map((h) => h.trim());
  const idx = {};
  header.forEach((h, i) => (idx[h] = i));
  const out = [];
  for (let i = 1; i < lines.length; i++) {
    const c = lines[i].split(",");
    const lat = parseFloat(c[idx.latitude]);
    const lon = parseFloat(c[idx.longitude]);
    if (isNaN(lat) || isNaN(lon)) continue;
    out.push({
      lat: +lat.toFixed(4),
      lon: +lon.toFixed(4),
      date: c[idx.acq_date],
      time: c[idx.acq_time],
      conf: c[idx.confidence], // VIIRS: l (low) / n (nominal) / h (high)
      frp: parseFloat(c[idx.frp]) || null, // fire radiative power, MW
      sat: c[idx.satellite],
    });
  }
  return out;
}

export default async (req) => {
  const url = new URL(req.url);
  const areaKey = (url.searchParams.get("area") || "nwindia").toLowerCase();
  const area = AREAS[areaKey] || AREAS.nwindia;
  const days = Math.min(10, Math.max(1, parseInt(url.searchParams.get("days") || "3", 10)));
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "public, max-age=1800",
  };

  if (!MAP_KEY) {
    return new Response(
      JSON.stringify({ fires: [], count: 0, area: areaKey, days, note: "FIRMS_MAP_KEY not configured on the server." }),
      { headers }
    );
  }

  const cacheKey = `firms-${areaKey}-${days}`;
  try {
    const store = getBlobStore("janvayu-feeds");
    const cached = await store.get(cacheKey, { type: "json" });
    if (cached && cached.fetched_at && Date.now() - cached.fetched_at < 30 * 60 * 1000) {
      return new Response(JSON.stringify({ ...cached.payload, cached: true }), { headers });
    }
  } catch (e) { /* cache miss */ }

  try {
    const api = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${MAP_KEY}/${SOURCE}/${area}/${days}`;
    const res = await fetch(api, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error("FIRMS upstream " + res.status);
    const text = await res.text();
    // FIRMS returns a plain-text error (not CSV) on a bad key/params.
    if (!text.trim().startsWith("latitude")) throw new Error("Unexpected FIRMS response: " + text.slice(0, 80));

    let fires = parseCSV(text);
    const count = fires.length;
    if (fires.length > 3000) fires = fires.slice(0, 3000); // bound payload
    const payload = {
      fires,
      count,
      area: areaKey,
      bbox: area,
      days,
      source: "NASA FIRMS (VIIRS / NOAA-20, near-real-time)",
      generated: new Date().toISOString(),
    };
    try {
      const store = getBlobStore("janvayu-feeds");
      await store.setJSON(cacheKey, { payload, fetched_at: Date.now() });
    } catch (e) { /* cache write best-effort */ }

    return new Response(JSON.stringify(payload), { headers });
  } catch (e) {
    return new Response(JSON.stringify({ fires: [], count: 0, area: areaKey, days, error: e.message }), { status: 200, headers });
  }
};
