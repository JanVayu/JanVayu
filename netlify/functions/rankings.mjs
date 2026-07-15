// Netlify Function: City Rankings
//
// GET /.netlify/functions/rankings?range=live|week|month
//
// - range=live: fetches current AQI for the curated INDIAN_CITIES list from WAQI
//   and returns a sorted list with PM2.5 and AQI.
// - range=week | range=month: returns a server-aggregated averaged ranking from
//   accumulated daily snapshots in the "janvayu-rankings" Netlify Blobs store.
//   Each call also writes today's snapshot, so the dataset grows over time.

import { getBlobStore } from "./lib/blob.mjs";


const WAQI_TOKEN = process.env.WAQI_TOKEN || "1f64cc8563a165dc5a6ce48f7eeb9ba0221b63f3";

const CITIES = {
  delhi: { name: "Delhi", lat: 28.6139, lon: 77.209 },
  mumbai: { name: "Mumbai", lat: 19.076, lon: 72.8777 },
  kolkata: { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
  chennai: { name: "Chennai", lat: 13.0827, lon: 80.2707 },
  bangalore: { name: "Bengaluru", lat: 12.9716, lon: 77.5946 },
  hyderabad: { name: "Hyderabad", lat: 17.385, lon: 78.4867 },
  gurgaon: { name: "Gurgaon", lat: 28.4595, lon: 77.0266 },
  noida: { name: "Noida", lat: 28.5355, lon: 77.391 },
  faridabad: { name: "Faridabad", lat: 28.4089, lon: 77.3178 },
  ghaziabad: { name: "Ghaziabad", lat: 28.6692, lon: 77.4538 },
  lucknow: { name: "Lucknow", lat: 26.8467, lon: 80.9462 },
  kanpur: { name: "Kanpur", lat: 26.4499, lon: 80.3319 },
  patna: { name: "Patna", lat: 25.5941, lon: 85.1376 },
  jaipur: { name: "Jaipur", lat: 26.9124, lon: 75.7873 },
  ahmedabad: { name: "Ahmedabad", lat: 23.0225, lon: 72.5714 },
  pune: { name: "Pune", lat: 18.5204, lon: 73.8567 },
  chandigarh: { name: "Chandigarh", lat: 30.7333, lon: 76.7794 },
  varanasi: { name: "Varanasi", lat: 25.3176, lon: 82.9739 },
  agra: { name: "Agra", lat: 27.1767, lon: 78.0081 },
  bhopal: { name: "Bhopal", lat: 23.2599, lon: 77.4126 },
  indore: { name: "Indore", lat: 22.7196, lon: 75.8577 },
  nagpur: { name: "Nagpur", lat: 21.1458, lon: 79.0882 },
  kochi: { name: "Kochi", lat: 9.9312, lon: 76.2673 },
  visakhapatnam: { name: "Visakhapatnam", lat: 17.6868, lon: 83.2185 },
  thiruvananthapuram: { name: "Thiruvananthapuram", lat: 8.5241, lon: 76.9366 },
  coimbatore: { name: "Coimbatore", lat: 11.0168, lon: 76.9558 },
  muzaffarpur: { name: "Muzaffarpur", lat: 26.1197, lon: 85.391 },
  gaya: { name: "Gaya", lat: 24.7914, lon: 85.0002 },
  raipur: { name: "Raipur", lat: 21.2514, lon: 81.6296 },
  jodhpur: { name: "Jodhpur", lat: 26.2389, lon: 73.0243 },
  guwahati: { name: "Guwahati", lat: 26.1445, lon: 91.7362 },
  dehradun: { name: "Dehradun", lat: 30.3165, lon: 78.0322 },
  amritsar: { name: "Amritsar", lat: 31.634, lon: 74.8723 },
  ludhiana: { name: "Ludhiana", lat: 30.901, lon: 75.8573 },
  jalandhar: { name: "Jalandhar", lat: 31.326, lon: 75.5762 },
  patiala: { name: "Patiala", lat: 30.3398, lon: 76.3869 },
  bathinda: { name: "Bathinda", lat: 30.211, lon: 74.9455 },
  rohtak: { name: "Rohtak", lat: 28.8955, lon: 76.6066 },
  panipat: { name: "Panipat", lat: 29.3909, lon: 76.9635 },
  hisar: { name: "Hisar", lat: 29.1492, lon: 75.7217 },
  sonipat: { name: "Sonipat", lat: 28.9931, lon: 77.0151 },
  kota: { name: "Kota", lat: 25.2138, lon: 75.8648 },
  udaipur: { name: "Udaipur", lat: 24.5854, lon: 73.7125 },
  ajmer: { name: "Ajmer", lat: 26.4499, lon: 74.6399 },
  bikaner: { name: "Bikaner", lat: 28.0229, lon: 73.3119 },
  bareilly: { name: "Bareilly", lat: 28.367, lon: 79.4304 },
  moradabad: { name: "Moradabad", lat: 28.8386, lon: 78.7733 },
  aligarh: { name: "Aligarh", lat: 27.8974, lon: 78.088 },
  meerut: { name: "Meerut", lat: 28.9845, lon: 77.7064 },
  firozabad: { name: "Firozabad", lat: 27.1591, lon: 78.3958 },
  prayagraj: { name: "Prayagraj", lat: 25.4358, lon: 81.8463 },
  gorakhpur: { name: "Gorakhpur", lat: 26.7606, lon: 83.3732 },
  saharanpur: { name: "Saharanpur", lat: 29.968, lon: 77.546 },
  srinagar: { name: "Srinagar", lat: 34.0837, lon: 74.7973 },
  jammu: { name: "Jammu", lat: 32.7266, lon: 74.857 },
  shimla: { name: "Shimla", lat: 31.1048, lon: 77.1734 },
  surat: { name: "Surat", lat: 21.1702, lon: 72.8311 },
  vadodara: { name: "Vadodara", lat: 22.3072, lon: 73.1812 },
  rajkot: { name: "Rajkot", lat: 22.3039, lon: 70.8022 },
  nashik: { name: "Nashik", lat: 19.9975, lon: 73.7898 },
  aurangabad: { name: "Chhatrapati Sambhajinagar", lat: 19.8762, lon: 75.3433 },
  solapur: { name: "Solapur", lat: 17.6599, lon: 75.9064 },
  kolhapur: { name: "Kolhapur", lat: 16.705, lon: 74.2433 },
  jabalpur: { name: "Jabalpur", lat: 23.1815, lon: 79.9864 },
  gwalior: { name: "Gwalior", lat: 26.2183, lon: 78.1828 },
  ujjain: { name: "Ujjain", lat: 23.1765, lon: 75.7885 },
  ranchi: { name: "Ranchi", lat: 23.3441, lon: 85.3096 },
  jamshedpur: { name: "Jamshedpur", lat: 22.8046, lon: 86.2029 },
  dhanbad: { name: "Dhanbad", lat: 23.7957, lon: 86.4304 },
  asansol: { name: "Asansol", lat: 23.6739, lon: 86.9524 },
  durgapur: { name: "Durgapur", lat: 23.5204, lon: 87.3119 },
  howrah: { name: "Howrah", lat: 22.5958, lon: 88.2636 },
  siliguri: { name: "Siliguri", lat: 26.7271, lon: 88.3953 },
  rourkela: { name: "Rourkela", lat: 22.2604, lon: 84.8536 },
  bhubaneswar: { name: "Bhubaneswar", lat: 20.2961, lon: 85.8245 },
  cuttack: { name: "Cuttack", lat: 20.4625, lon: 85.883 },
  mysuru: { name: "Mysuru", lat: 12.2958, lon: 76.6394 },
  vijayawada: { name: "Vijayawada", lat: 16.5062, lon: 80.648 },
  guntur: { name: "Guntur", lat: 16.3067, lon: 80.4365 },
  nellore: { name: "Nellore", lat: 14.4426, lon: 79.9865 },
  kurnool: { name: "Kurnool", lat: 15.8281, lon: 78.0373 },
  warangal: { name: "Warangal", lat: 17.9784, lon: 79.5941 },
  madurai: { name: "Madurai", lat: 9.9252, lon: 78.1198 },
  tiruchirappalli: { name: "Tiruchirappalli", lat: 10.7905, lon: 78.7047 },
  salem: { name: "Salem", lat: 11.6643, lon: 78.146 },
  erode: { name: "Erode", lat: 11.341, lon: 77.7172 },
  vellore: { name: "Vellore", lat: 12.9165, lon: 79.1325 },
  thoothukudi: { name: "Thoothukudi", lat: 8.7642, lon: 78.1348 },
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
