// Netlify Scheduled Function: Sends daily AQI digest emails via Resend
// Runs every day at 8:00 AM IST (2:30 AM UTC)
// Reads subscribers from Blobs, fetches current AQI, sends personalized emails

import { getStore } from "@netlify/blobs";
import { Resend } from "resend";

function getBlobStore(name) {
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
  const token = process.env.BLOB_TOKEN;
  if (siteID && token) return getStore({ name, siteID, token, consistency: "strong" });
  return getStore({ name, consistency: "strong" });
}

const WAQI_TOKEN = "1f64cc8563a165dc5a6ce48f7eeb9ba0221b63f3";

const CITIES = {
  delhi: { name: "Delhi", station: "delhi" },
  mumbai: { name: "Mumbai", station: "mumbai" },
  kolkata: { name: "Kolkata", station: "kolkata" },
  chennai: { name: "Chennai", station: "chennai" },
  bangalore: { name: "Bengaluru", station: "bangalore" },
  hyderabad: { name: "Hyderabad", station: "hyderabad" },
  lucknow: { name: "Lucknow", station: "lucknow" },
  patna: { name: "Patna", station: "patna" },
  gurgaon: { name: "Gurgaon", station: "gurgaon" },
  noida: { name: "Noida", station: "noida" },
};

function getAQILevel(aqi) {
  if (aqi <= 50) return { label: "Good", color: "#22c55e", emoji: "🟢" };
  if (aqi <= 100) return { label: "Moderate", color: "#eab308", emoji: "🟡" };
  if (aqi <= 150) return { label: "Unhealthy for Sensitive", color: "#f97316", emoji: "🟠" };
  if (aqi <= 200) return { label: "Unhealthy", color: "#ef4444", emoji: "🔴" };
  if (aqi <= 300) return { label: "Very Unhealthy", color: "#a855f7", emoji: "🟣" };
  return { label: "Hazardous", color: "#7f1d1d", emoji: "⚫" };
}

function getHealthAdvice(aqi) {
  if (aqi <= 50) return "Air quality is good. Enjoy outdoor activities!";
  if (aqi <= 100) return "Acceptable air quality. Unusually sensitive people should limit prolonged outdoor exertion.";
  if (aqi <= 150) return "Sensitive groups should reduce prolonged outdoor exertion. Consider wearing a mask outdoors.";
  if (aqi <= 200) return "Everyone should reduce prolonged outdoor exertion. Wear N95 masks outside. Keep windows closed.";
  if (aqi <= 300) return "Health alert! Avoid all outdoor physical activities. Use air purifiers indoors. Wear N95 masks if going out.";
  return "EMERGENCY: Stay indoors. Seal windows. Run air purifiers on max. Avoid all outdoor exposure.";
}

async function fetchCityAQI(cityKey) {
  const city = CITIES[cityKey];
  if (!city) return null;
  try {
    const res = await fetch(
      `https://api.waqi.info/feed/${city.station}/?token=${WAQI_TOKEN}`,
      { signal: AbortSignal.timeout(8000) }
    );
    const data = await res.json();
    if (data.status === "ok" && data.data) {
      return {
        city: city.name,
        key: cityKey,
        aqi: data.data.aqi,
        pm25: data.data.iaqi?.pm25?.v || null,
        pm10: data.data.iaqi?.pm10?.v || null,
        time: data.data.time?.s || new Date().toISOString(),
      };
    }
  } catch (e) {
    console.log(`Failed to fetch AQI for ${cityKey}:`, e.message);
  }
  return null;
}

function buildEmailHTML(subscriber, cityData, alertCities) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const hasAlerts = alertCities.length > 0;

  const cityRows = cityData.map((c) => {
    const level = getAQILevel(c.aqi);
    const isAlert = alertCities.includes(c.key);
    return `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px 16px; font-weight: 600;">${c.city} ${isAlert ? "⚠️" : ""}</td>
        <td style="padding: 12px 16px; text-align: center;">
          <span style="background: ${level.color}; color: white; padding: 4px 12px; border-radius: 12px; font-weight: 700; font-size: 14px;">
            ${level.emoji} ${c.aqi}
          </span>
        </td>
        <td style="padding: 12px 16px; text-align: center; color: #6b7280; font-size: 13px;">${level.label}</td>
        <td style="padding: 12px 16px; text-align: center; font-size: 13px;">${c.pm25 || "–"}</td>
        <td style="padding: 12px 16px; text-align: center; font-size: 13px;">${c.pm10 || "–"}</td>
      </tr>`;
  }).join("");

  const worstCity = cityData.reduce((a, b) => (a.aqi > b.aqi ? a : b), cityData[0]);
  const advice = getHealthAdvice(worstCity.aqi);

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background: white;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1a3a2a, #16a34a); padding: 24px 32px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 1px;">JanVayu</h1>
      <p style="color: #bbf7d0; margin: 4px 0 0; font-size: 13px;">Daily Air Quality Digest</p>
    </div>

    <!-- Date & Alert Banner -->
    <div style="padding: 20px 32px 0;">
      <p style="color: #6b7280; font-size: 13px; margin: 0;">${dateStr}</p>
      ${hasAlerts ? `
      <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px 16px; margin-top: 12px;">
        <strong style="color: #dc2626;">⚠️ Alert:</strong>
        <span style="color: #991b1b;"> AQI exceeds your threshold (${subscriber.threshold}) in: ${alertCities.map(k => CITIES[k]?.name).join(", ")}</span>
      </div>` : `
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; margin-top: 12px;">
        <span style="color: #166534;">✓ All monitored cities are below your alert threshold (${subscriber.threshold})</span>
      </div>`}
    </div>

    <!-- AQI Table -->
    <div style="padding: 20px 32px;">
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <thead>
          <tr style="background: #f9fafb;">
            <th style="padding: 10px 16px; text-align: left; font-size: 12px; color: #6b7280; text-transform: uppercase;">City</th>
            <th style="padding: 10px 16px; text-align: center; font-size: 12px; color: #6b7280; text-transform: uppercase;">AQI</th>
            <th style="padding: 10px 16px; text-align: center; font-size: 12px; color: #6b7280; text-transform: uppercase;">Level</th>
            <th style="padding: 10px 16px; text-align: center; font-size: 12px; color: #6b7280; text-transform: uppercase;">PM2.5</th>
            <th style="padding: 10px 16px; text-align: center; font-size: 12px; color: #6b7280; text-transform: uppercase;">PM10</th>
          </tr>
        </thead>
        <tbody>
          ${cityRows}
        </tbody>
      </table>
    </div>

    <!-- Health Advice -->
    <div style="padding: 0 32px 20px;">
      <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px;">
        <strong style="color: #92400e; font-size: 13px;">Health Advisory:</strong>
        <p style="color: #78350f; margin: 6px 0 0; font-size: 13px; line-height: 1.5;">${advice}</p>
      </div>
    </div>

    <!-- CTA -->
    <div style="padding: 0 32px 24px; text-align: center;">
      <a href="https://janvayu.in" style="display: inline-block; background: #16a34a; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
        View Full Dashboard →
      </a>
    </div>

    <!-- Footer -->
    <div style="background: #f9fafb; padding: 20px 32px; border-top: 1px solid #e5e7eb;">
      <p style="color: #9ca3af; font-size: 11px; margin: 0; text-align: center;">
        You're receiving this because you subscribed to JanVayu AQI alerts for ${subscriber.cities.map(k => CITIES[k]?.name || k).join(", ")}.<br>
        <a href="https://janvayu.in" style="color: #16a34a;">Visit JanVayu</a> ·
        <a href="mailto:talktous@janvayu.in" style="color: #16a34a;">Contact Us</a> ·
        To unsubscribe, visit the Alerts page on janvayu.in
      </p>
    </div>
  </div>
</body>
</html>`;
}

export default async (req) => {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.log("RESEND_API_KEY not set, skipping email digest");
    return;
  }

  const resend = new Resend(RESEND_API_KEY);
  const subStore = getBlobStore("janvayu-subscribers");
  const logStore = getBlobStore("janvayu-feeds");

  // Get all subscribers
  const { blobs } = await subStore.list();
  if (!blobs || blobs.length === 0) {
    console.log("No subscribers, skipping digest");
    await logStore.setJSON("last-email-log", { time: new Date().toISOString(), subscribers: 0, sent: 0 });
    return;
  }

  // Fetch AQI for all cities we need
  const allCityKeys = new Set();
  const subscribers = [];
  for (const blob of blobs) {
    try {
      const sub = await subStore.get(blob.key, { type: "json" });
      if (sub && sub.active && sub.email) {
        subscribers.push(sub);
        (sub.cities || []).forEach((c) => allCityKeys.add(c));
      }
    } catch (e) {
      console.log(`Failed to read subscriber ${blob.key}:`, e.message);
    }
  }

  if (subscribers.length === 0) {
    console.log("No active subscribers");
    return;
  }

  // Fetch AQI data for all needed cities
  const cityDataMap = {};
  const fetchResults = await Promise.allSettled(
    [...allCityKeys].map(async (key) => {
      const data = await fetchCityAQI(key);
      if (data) cityDataMap[key] = data;
    })
  );

  // Send emails to each subscriber
  let sent = 0;
  let failed = 0;
  const errors = [];

  // Determine sender - use verified domain or Resend's onboarding address
  const fromAddress = process.env.RESEND_FROM || "JanVayu <alerts@janvayu.in>";

  for (const sub of subscribers) {
    try {
      const subCityData = (sub.cities || [])
        .map((k) => cityDataMap[k])
        .filter(Boolean);

      if (subCityData.length === 0) continue;

      const alertCities = subCityData
        .filter((c) => c.aqi > (sub.threshold || 200))
        .map((c) => c.key);

      const html = buildEmailHTML(sub, subCityData, alertCities);
      const worstAQI = Math.max(...subCityData.map((c) => c.aqi));
      const hasAlerts = alertCities.length > 0;

      const subject = hasAlerts
        ? `⚠️ AQI Alert: ${alertCities.map(k => CITIES[k]?.name).join(", ")} exceeds ${sub.threshold} — JanVayu Daily Digest`
        : `Air Quality Update: Worst AQI ${worstAQI} — JanVayu Daily Digest`;

      await resend.emails.send({
        from: fromAddress,
        to: sub.email,
        subject,
        html,
      });

      sent++;
    } catch (e) {
      failed++;
      errors.push(`${sub.email}: ${e.message}`);
      console.log(`Failed to send to ${sub.email}:`, e.message);
    }
  }

  const log = {
    time: new Date().toISOString(),
    subscribers: subscribers.length,
    sent,
    failed,
    cities_checked: Object.keys(cityDataMap).length,
    errors: errors.length > 0 ? errors.slice(0, 10) : undefined,
  };

  await logStore.setJSON("last-email-log", log);
  console.log("Daily digest complete:", JSON.stringify(log));
};

export const config = {
  schedule: "30 2 * * *", // 2:30 AM UTC = 8:00 AM IST
};
