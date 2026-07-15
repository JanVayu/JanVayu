// Netlify Function: Web Push subscription management
//
// POST /.netlify/functions/push-subscribe
//   { action: "subscribe",   subscription, city, threshold }
//   { action: "unsubscribe", subscription }
//   { action: "test",        subscription }   → sends an immediate test push
//
// Stores each browser's PushSubscription (keyed by a hash of its endpoint) in
// the `janvayu-push-subs` blob store, alongside the user's chosen city and AQI
// threshold. The scheduled push-send.mjs reads this store to deliver real
// alerts even when the site is closed. Requires VAPID_* env vars.

import { getStore } from "@netlify/blobs";
import crypto from "node:crypto";
import webpush from "web-push";

function getBlobStore(name) {
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
  const token = process.env.BLOB_TOKEN;
  if (siteID && token) return getStore({ name, siteID, token, consistency: "strong" });
  return getStore({ name, consistency: "strong" });
}

function vapidReady() {
  const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } = process.env;
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) return false;
  webpush.setVapidDetails(VAPID_SUBJECT || "mailto:contribute@janvayu.in", VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  return true;
}

const subKey = (endpoint) => crypto.createHash("sha256").update(endpoint).digest("hex").slice(0, 40);

export default async (req) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "POST only" }), { status: 405, headers });

  let body;
  try { body = await req.json(); } catch (e) { return new Response(JSON.stringify({ error: "invalid JSON" }), { status: 400, headers }); }

  const { action, subscription } = body;
  if (!subscription || !subscription.endpoint) {
    return new Response(JSON.stringify({ error: "subscription with endpoint required" }), { status: 400, headers });
  }

  const store = getBlobStore("janvayu-push-subs");
  const key = subKey(subscription.endpoint);

  try {
    if (action === "unsubscribe") {
      await store.delete(key);
      return new Response(JSON.stringify({ ok: true, action: "unsubscribed" }), { headers });
    }

    if (action === "test") {
      if (!vapidReady()) return new Response(JSON.stringify({ error: "push not configured on server" }), { status: 503, headers });
      try {
        await webpush.sendNotification(subscription, JSON.stringify({
          title: "JanVayu alerts are on ✓",
          body: "This is a test. You'll get a push when your city's AQI crosses your threshold — even when this tab is closed.",
          url: "https://www.janvayu.in/#aqi-alerts",
        }));
        return new Response(JSON.stringify({ ok: true, action: "test-sent" }), { headers });
      } catch (e) {
        if (e.statusCode === 404 || e.statusCode === 410) await store.delete(key).catch(() => {});
        return new Response(JSON.stringify({ error: "send failed: " + (e.statusCode || e.message) }), { status: 502, headers });
      }
    }

    // default: subscribe (create/update)
    const city = (body.city || "delhi").toLowerCase();
    const threshold = Math.max(50, Math.min(500, parseInt(body.threshold, 10) || 200));
    await store.setJSON(key, {
      subscription,
      city,
      threshold,
      created_at: Date.now(),
      last_pushed: 0,
    });
    return new Response(JSON.stringify({ ok: true, action: "subscribed", city, threshold }), { headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
  }
};
