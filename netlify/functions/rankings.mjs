// Netlify Function: City Rankings
//
// GET /.netlify/functions/rankings?range=live|week|month
//
// - range=live: fetches current AQI for the curated INDIAN_CITIES list from WAQI
//   and returns a sorted list with PM2.5 and AQI.
// - range=week | range=month: returns a server-aggregated averaged ranking from
//   accumulated daily snapshots in the "janvayu-rankings" Netlify Blobs store.
//   Each call also writes today's snapshot, so the dataset grows over time.

import { getStore } from "@netlify/blobs";

function getBlobStore(name) {
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
  const token = process.env.BLOB_TOKEN;
  if (siteID && token) return getStore({ name, siteID, token, consistency: "strong" });
  return getStore({ name, consistency: "strong" });
}

const WAQI_TOKEN = process.env.WAQI_TOKEN || "1f64cc8563a165dc5a6ce48f7eeb9ba0221b63f3";

const CITIES = {
  delhi: { name: "Delhi", lat: 28.6139, lon: 77.2090 },
  mumbai: { name: "Mumbai", lat: 19.0760, lon: 72.8777 },
  kolkata: { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
  chennai: { name: "Chennai", lat: 13.0827, lon: 80.2707 },
  bangalore: { name: "Bengaluru", lat: 12.9716, lon: 77.5946 },
  hyderabad: { name: "Hyderabad", lat: 17.3850, lon: 78.4867 },
  gurgaon: { name: "Gurgaon", lat: 28.4595, lon: 77.0266 },
  noida: { name: "Noida", lat: 28.5355, lon: 77.3910 },
  faridabad: { name: "Faridabad", lat: 28.4089, lon: 77.3178 },
  ghaziabad: { name: "Ghaziabad", lat: 28.6692, lon: 77.4538 },
  lucknow: { name: "Lucknow", lat: 26.8467, lon: 80.9462 },
  kanpur: { name: "Kanpur", lat: 26.4499, lon: 80.3319 },
  patna: { name: "Patna", lat: 25.5941, lon: 85.1376 },
  jaipur: { name: "Jaipur", lat: 26.9124, lon: 75.7873 },
  varanasi: { name: "Varanasi", lat: 25.3176, lon: 82.9739 },
  agra: { name: "Agra", lat: 27.1767, lon: 78.0081 },
  bhopal: { name: "Bhopal", lat: 23.2599, lon: 77.4126 },
  indore: { name: "Indore", lat: 22.7196, lon: 75.8577 },
  nagpur: { name: "Nagpur", lat: 21.1458, lon: 79.0882 },
  ahmedabad: { name: "Ahmedabad", lat: 23.0225, lon: 72.5714 },
  pune: { name: "Pune", lat: 18.5204, lon: 73.8567 },
  kochi: { name: "Kochi", lat: 9.9312, lon: 76.2673 },
  guwahati: { name: "Guwahati", lat: 26.1445, lon: 91.7362 },
  chandigarh: { name: "Chandigarh", lat: 30.7333, lon: 76.7794 },
  visakhapatnam: { name: "Visakhapatnam", lat: 17.6868, lon: 83.2185 },
  coimbatore: { name: "Coimbatore", lat: 11.0168, lon: 76.9558 },
  raipur: { name: "Raipur", lat: 21.2514, lon: 81.6296 },
};

async function fetchOne(key) {
  const c = CITIES[key];
  try {
    const url = `https://api.waqi.info/feed/geo:${c.lat};${c.lon}/?token=${WAQI_TOKEN}`;
    const res = await fetch(url);
    const json = await res.json();
    if (json.status === "ok" && json.data && json.data.aqi !== "-") {
      const aqi = parseInt(json.data.aqi);
      const pm25 = json.data.iaqi?.pm25?.v || Math.round(aqi * 0.7);
      return { key, name: c.name, aqi, pm25 };
    }
  } catch (e) { /* ignore */ }
  return null;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function dateOffsetKey(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

async function liveRankings() {
  const keys = Object.keys(CITIES);
  const rows = (await Promise.all(keys.map(fetchOne))).filter(Boolean);
  return rows.sort((a, b) => b.pm25 - a.pm25);
}

async function aggregatedRankings(days) {
  const store = getBlobStore("janvayu-rankings");
  const snapshots = [];
  for (let i = 0; i < days; i++) {
    try {
      const snap = await store.get("snapshot-" + dateOffsetKey(i), { type: "json" });
      if (snap && Array.isArray(snap.cities)) snapshots.push(snap);
    } catch (e) { /* missing snapshot is fine */ }
  }
  if (snapshots.length === 0) return null;
  // Average PM2.5 per city across snapshots; compute delta vs the oldest
  const acc = {};
  snapshots.forEach((snap, idx) => {
    snap.cities.forEach(c => {
      if (!acc[c.key]) acc[c.key] = { key: c.key, name: c.name, sum: 0, n: 0, oldest: null, latest: null, aqis: [] };
      acc[c.key].sum += c.pm25;
      acc[c.key].n += 1;
      acc[c.key].aqis.push(c.aqi);
      if (idx === snapshots.length - 1) acc[c.key].oldest = c.pm25;
      if (idx === 0) acc[c.key].latest = c.pm25;
    });
  });
  return Object.values(acc).map(r => ({
    key: r.key, name: r.name,
    pm25: Math.round(r.sum / r.n),
    aqi: Math.round(r.aqis.reduce((a, b) => a + b, 0) / r.aqis.length),
    delta7: r.oldest ? ((r.latest - r.oldest) / r.oldest) * 100 : null
  })).sort((a, b) => b.pm25 - a.pm25);
}

async function writeTodaySnapshot(rows) {
  try {
    const store = getBlobStore("janvayu-rankings");
    await store.setJSON("snapshot-" + todayKey(), {
      date: todayKey(),
      cities: rows.map(r => ({ key: r.key, name: r.name, aqi: r.aqi, pm25: r.pm25 }))
    });
  } catch (e) { /* best-effort, ignore */ }
}

export default async (req) => {
  const url = new URL(req.url);
  const range = url.searchParams.get("range") || "live";
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "public, max-age=300",
  };

  try {
    const live = await liveRankings();

    // Opportunistically write today's snapshot once we have live data.
    writeTodaySnapshot(live).catch(() => {});

    if (range === "live") {
      return new Response(JSON.stringify({ range: "live", cities: live, generated: new Date().toISOString() }), { headers });
    }
    const days = range === "week" ? 7 : 30;
    const aggregated = await aggregatedRankings(days);
    if (aggregated && aggregated.length > 0) {
      return new Response(JSON.stringify({ range, cities: aggregated, snapshots: days, generated: new Date().toISOString() }), { headers });
    }
    // Fallback: return live with a note that historical data is still accumulating
    return new Response(JSON.stringify({ range, cities: live, accumulating: true, note: "Historical snapshots are still being collected.", generated: new Date().toISOString() }), { headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
  }
};
