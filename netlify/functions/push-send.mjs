// Netlify Function: Web Push sender (scheduled + manual)
//
// Runs every 3 hours: for each stored subscription, checks its city's live AQI
// (WAQI) and, if PM2.5 (ug/m3) exceeds the subscriber's alert level and they haven't been
// pushed in the last COOLDOWN — delivers a browser push notification via the
// Web Push protocol, so users are warned even when JanVayu is closed.
//
// Also callable directly (GET/POST) for ops. Expired subscriptions (404/410)
// are pruned. Requires VAPID_* env vars.

import { getBlobStore } from "./lib/blob.mjs";
import webpush from "web-push";
import { iaqiToPM25 } from "./lib/iaqi.mjs";
import { getCpcbPM25Category, thresholdPM25 } from "./lib/cpcb.mjs";

export const config = { schedule: "0 */3 * * *" };


import { WAQI_TOKEN } from "./lib/waqi-token.mjs";
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
    const pm25 = iaqiToPM25(j?.data?.iaqi?.pm25?.v);
    return pm25 != null && Number.isFinite(Number(pm25)) ? Number(pm25) : null;
  } catch { return null; }
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

  // PM2.5 (ug/m3) per city, fetched once and reused across subscribers.
  const aqiCache = {};
  const now = Date.now();
  let checked = 0, sent = 0, pruned = 0, skipped = 0;

  for (const key of keys) {
    let rec;
    try { rec = await store.get(key, { type: "json" }); } catch { continue; }
    if (!rec || !rec.subscription) continue;
    checked++;

    if (aqiCache[rec.city] === undefined) aqiCache[rec.city] = await fetchAQI(rec.city);
    const pm25 = aqiCache[rec.city];
    if (pm25 == null) { skipped++; continue; }

    const limit = thresholdPM25(rec);
    if (pm25 <= limit) { skipped++; continue; }
    const cat = getCpcbPM25Category(pm25);
    if (now - (rec.last_pushed || 0) < COOLDOWN_MS) { skipped++; continue; }

    const cityName = rec.city.charAt(0).toUpperCase() + rec.city.slice(1);
    try {
      await webpush.sendNotification(rec.subscription, JSON.stringify({
        title: `${cityName} air is ${cat.label} (CPCB): PM2.5 ${Math.round(pm25)} µg/m³`,
        body: `PM2.5 ${Math.round(pm25)} µg/m³ is above your alert level of ${Math.round(limit)} µg/m³. CPCB: ${cat.impact}`,
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
