// Netlify Scheduled Function: Sends daily AQI digest emails via Resend
// Runs every day at 8:00 AM IST (2:30 AM UTC)
// Reads subscribers from Blobs, fetches current AQI, sends personalized emails

import { getBlobStore } from "./lib/blob.mjs";
import { Resend } from "resend";
import { iaqiToPM25, iaqiToPM10 } from "./lib/iaqi.mjs";
import { getCpcbPM25Category, thresholdPM25 } from "./lib/cpcb.mjs";

export { getCpcbPM25Category };


import { WAQI_TOKEN } from "./lib/waqi-token.mjs";

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

function getHealthAdvice(worstCity) {
  if (!worstCity) return "No city on your list had a reliable PM2.5 reading today.";
  const cat = getCpcbPM25Category(worstCity.pm25);
  if (!cat) return "No PM2.5 reading was available for the worst-affected city today.";
  return `${worstCity.city} is the worst-affected city on your list today, in the CPCB ${cat.label} category. CPCB says: ${cat.impact}`;
}

// A station feed can answer 200 and still be wrong: stale, or near zero. On 30 October the
// Delhi feed gave PM2.5 1 and PM10 3 at 8 AM, which the digest printed as "Good" a day after
// Delhi read 123. A reading is held back, not shown, when it is older than six hours or when
// PM2.5 and PM10 are both implausibly low for a city with a monitor.
const STALE_AFTER_MS = 6 * 60 * 60 * 1000;
export function assessReading({ pm25, pm10, time }, now = Date.now()) {
  if (pm25 == null || Number.isNaN(Number(pm25))) return { ok: false, reason: "no PM2.5 reading" };
  // WAQI's time.s is the station's own clock, which for an Indian station is IST.
  const m = String(time || "").match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
  if (m) {
    const at = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]) - 5.5 * 60 * 60 * 1000;
    if (now - at > STALE_AFTER_MS) return { ok: false, reason: "the station has not reported for over six hours" };
  }
  if (Number(pm25) < 3 && (pm10 == null || Number(pm10) < 10)) return { ok: false, reason: "the reading is implausibly low" };
  return { ok: true, reason: null };
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
      const reading = {
        city: city.name,
        key: cityKey,
        aqi: data.data.aqi,
        pm25: iaqiToPM25(data.data.iaqi?.pm25?.v),
        pm10: iaqiToPM10(data.data.iaqi?.pm10?.v),
        time: data.data.time?.s || new Date().toISOString(),
      };
      const check = assessReading(reading);
      return { ...reading, unreliable: check.ok ? null : check.reason };
    }
  } catch (e) {
    console.log(`Failed to fetch AQI for ${cityKey}:`, e.message);
  }
  return null;
}

export function buildEmailHTML(subscriber, cityData, alertCities) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const hasAlerts = alertCities.length > 0;

  const cell = "padding: 10px 6px; text-align: center; font-size: 13px;";
  const cityRows = cityData.map((c) => {
    const isAlert = alertCities.includes(c.key);
    if (c.unreliable) {
      return `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 10px 6px; font-weight: 600; font-size: 14px;">${c.city}</td>
        <td colspan="3" style="${cell} color: #6b7280;">No reliable reading today (${c.unreliable})</td>
      </tr>`;
    }
    const cpcb = getCpcbPM25Category(c.pm25);
    return `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 10px 6px; font-weight: 600; font-size: 14px;">${c.city}${isAlert ? " (alert)" : ""}</td>
        <td style="${cell}">${cpcb ? `<span style="color: ${cpcb.color}; font-weight: 700;">${cpcb.label}</span>` : "-"}</td>
        <td style="${cell}">${c.pm25 != null ? Math.round(c.pm25) : "-"}</td>
        <td style="${cell}">${c.pm10 != null ? Math.round(c.pm10) : "-"}</td>
      </tr>`;
  }).join("");

  const reliable = cityData.filter((c) => !c.unreliable);
  const worstCity = reliable.length ? reliable.reduce((a, b) => ((a.pm25 ?? -1) > (b.pm25 ?? -1) ? a : b), reliable[0]) : null;
  const advice = getHealthAdvice(worstCity);

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background: white;">
    <!-- Header -->
    <div style="background: #166534; padding: 24px 16px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 1px;">JanVayu</h1>
      <p style="color: #bbf7d0; margin: 4px 0 0; font-size: 13px;">Daily Air Quality Digest</p>
    </div>

    <!-- Date & Alert Banner -->
    <div style="padding: 20px 16px 0;">
      <p style="color: #6b7280; font-size: 13px; margin: 0;">${dateStr}</p>
      ${hasAlerts ? `
      <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px 16px; margin-top: 12px;">
        <strong style="color: #dc2626;">Alert:</strong>
        <span style="color: #991b1b;"> PM2.5 exceeds your alert level (${Math.round(thresholdPM25(subscriber))} µg/m³) in: ${alertCities.map(k => CITIES[k]?.name).join(", ")}</span>
      </div>` : `
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; margin-top: 12px;">
        <span style="color: #166534;">All monitored cities are below your PM2.5 alert level (${Math.round(thresholdPM25(subscriber))} µg/m³)</span>
      </div>`}
    </div>

    <!-- AQI Table -->
    <div style="padding: 20px 16px;">
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <thead>
          <tr style="background: #f9fafb;">
            <th style="padding: 8px 6px; text-align: left; font-size: 11px; color: #6b7280;">City</th>
            <th style="padding: 8px 6px; text-align: center; font-size: 11px; color: #6b7280;">CPCB category</th>
            <th style="padding: 8px 6px; text-align: center; font-size: 11px; color: #6b7280;">PM2.5<br>(&micro;g/m&sup3;)</th>
            <th style="padding: 8px 6px; text-align: center; font-size: 11px; color: #6b7280;">PM10<br>(&micro;g/m&sup3;)</th>
          </tr>
        </thead>
        <tbody>
          ${cityRows}
        </tbody>
      </table>
    </div>

    <!-- Health Advice -->
    <div style="padding: 0 16px 20px;">
      <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px;">
        <strong style="color: #92400e; font-size: 13px;">Health effects (CPCB):</strong>
        <p style="color: #78350f; margin: 6px 0 0; font-size: 13px; line-height: 1.5;">${advice}</p>
        <p style="color: #92400e; margin: 8px 0 0; font-size: 11px; line-height: 1.5;">CPCB category is India's national scale, applied here to the current PM2.5 reading. CPCB publishes health effects, not instructions. The WHO 24-hour PM2.5 guideline is 15 µg/m³. For practical steps, use Ask JanVayu at janvayu.in.</p>
      </div>
    </div>

    <!-- CTA -->
    <div style="padding: 0 16px 24px; text-align: center;">
      <a href="https://janvayu.in" style="display: inline-block; background: #16a34a; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
        View Full Dashboard →
      </a>
    </div>

    <!-- Footer -->
    <div style="background: #f9fafb; padding: 20px 32px; border-top: 1px solid #e5e7eb;">
      <p style="color: #9ca3af; font-size: 11px; margin: 0; text-align: center;">
        You're receiving this because you subscribed to JanVayu AQI alerts for ${subscriber.cities.map(k => CITIES[k]?.name || k).join(", ")}.<br>
        <a href="https://janvayu.in" style="color: #16a34a;">Visit JanVayu</a> ·
        <a href="mailto:contribute@janvayu.in" style="color: #16a34a;">Contact Us</a> ·
        To unsubscribe, visit the Alerts page: janvayu.in/#aqi-alerts
      </p>
    </div>
  </div>
</body>
</html>`;
}

export default async () => {
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
  await Promise.allSettled(
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
        .filter((c) => !c.unreliable && c.pm25 != null && c.pm25 > thresholdPM25(sub))
        .map((c) => c.key);

      const html = buildEmailHTML(sub, subCityData, alertCities);
      const worstPM25 = Math.max(...subCityData.filter((c) => !c.unreliable).map((c) => c.pm25 ?? -1), -1);
      const worstCat = worstPM25 >= 0 ? getCpcbPM25Category(worstPM25) : null;
      const hasAlerts = alertCities.length > 0;

      const subject = hasAlerts
        ? `PM2.5 alert: ${alertCities.map(k => CITIES[k]?.name).join(", ")} above ${Math.round(thresholdPM25(sub))} µg/m³ — JanVayu Daily Digest`
        : worstCat
          ? `Air Quality Update: worst PM2.5 ${Math.round(worstPM25)} µg/m³, CPCB ${worstCat.label} — JanVayu Daily Digest`
          : `Air Quality Update — JanVayu Daily Digest`;

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
