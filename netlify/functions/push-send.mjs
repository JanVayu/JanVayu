// Netlify Function: Web Push sender (scheduled + manual)
//
// Runs every 3 hours: for each stored subscription, checks its city's live AQI
// (WAQI) and — if AQI exceeds the subscriber's threshold and they haven't been
// pushed in the last COOLDOWN — delivers a browser push notification via the
// Web Push protocol, so users are warned even when JanVayu is closed.
//
// Also callable directly (GET/POST) for ops. Expired subscriptions (404/410)
// are pruned. Requires VAPID_* env vars.

import { getStore } from "@netlify/blobs";
import webpush from "web-push";

export const config = { schedule: "0 */3 * * *" };

function getBlobStore(name) {
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
  const token = process.env.BLOB_TOKEN;
  if (siteID && token) return getStore({ name, siteID, token, consistency: "strong" });
  return getStore({ name, consistency: "strong" });
}

const WAQI_TOKEN = process.env.WAQI_TOKEN || process.env.WAQI_API_TOKEN || "1f64cc8563a165dc5a6ce48f7eeb9ba0221b63f3";
const COOLDOWN_MS = 6 * 60 * 60 * 1000; // don't push the same person more than once per 6 h

// Coordinates for the cities offered in the AQI Alerts panel (+ common extras).
const CITIES = {
  delhi: [28.6139, 77.209], mumbai: [19.076, 72.8777], kolkata: [22.5726, 88.3639],
  chennai: [13.0827, 80.2707], bangalore: [12.9716, 77.5946], hyderabad: [17.385, 78.4867],
  lucknow: [26.8467, 80.9462], patna: [25.5941, 85.1376], gurgaon: [28.4595, 77.0266],
  noida: [28.5355, 77.391], pune: [18.5204, 73.8567], ahmedabad: [23.0225, 72.5714],
  jaipur: [26.9124, 75.7873], kanpur: [26.4499, 80.3319], varanasi: [25.3176, 82.9739],
  ghaziabad: [28.6692, 77.4538], faridabad: [28.4089, 77.3178],
};

async function fetchAQI(city) {
  const c = CITIES[city];
  if (!c) return null;
  try {
    const res = await fetch(`https://api.waqi.info/feed/geo:${c[0]};${c[1]}/?token=${WAQI_TOKEN}`, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    const j = await res.json();
    return j?.data?.aqi != null ? Number(j.data.aqi) : null;
  } catch (e) { return null; }
}

export default async () => {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
  const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } = process.env;
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return new Response(JSON.stringify({ error: "VAPID not configured", checked: 0, sent: 0 }), { status: 503, headers });
  }
  webpush.setVapidDetails(VAPID_SUBJECT || "mailto:contribute@janvayu.in", VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

  const store = getBlobStore("janvayu-push-subs");
  let listing;
  try { listing = await store.list(); } catch (e) {
    return new Response(JSON.stringify({ error: "store list failed: " + e.message }), { status: 500, headers });
  }
  const keys = (listing.blobs || []).map((b) => b.key);

  // AQI per city, fetched once and reused across subscribers.
  const aqiCache = {};
  const now = Date.now();
  let checked = 0, sent = 0, pruned = 0, skipped = 0;

  for (const key of keys) {
    let rec;
    try { rec = await store.get(key, { type: "json" }); } catch (e) { continue; }
    if (!rec || !rec.subscription) continue;
    checked++;

    if (aqiCache[rec.city] === undefined) aqiCache[rec.city] = await fetchAQI(rec.city);
    const aqi = aqiCache[rec.city];
    if (aqi == null) { skipped++; continue; }

    if (aqi <= rec.threshold) { skipped++; continue; }
    if (now - (rec.last_pushed || 0) < COOLDOWN_MS) { skipped++; continue; }

    const cityName = rec.city.charAt(0).toUpperCase() + rec.city.slice(1);
    try {
      await webpush.sendNotification(rec.subscription, JSON.stringify({
        title: `⚠ ${cityName} air is unhealthy — AQI ${aqi}`,
        body: `AQI ${aqi} is above your alert threshold of ${rec.threshold}. Consider limiting outdoor exposure and wearing an N95.`,
        url: "https://www.janvayu.in/#aqi-alerts",
      }));
      sent++;
      rec.last_pushed = now;
      await store.setJSON(key, rec).catch(() => {});
    } catch (e) {
      if (e.statusCode === 404 || e.statusCode === 410) { await store.delete(key).catch(() => {}); pruned++; }
    }
  }

  return new Response(JSON.stringify({ checked, sent, pruned, skipped, at: new Date().toISOString() }), { headers });
};
