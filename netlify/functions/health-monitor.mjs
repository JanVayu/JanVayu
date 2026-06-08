// Netlify Scheduled Function: Live health monitor with email alerts.
//
// Runs every 15 minutes, probes the public site + serverless functions, and
// emails an alert the moment a service goes DOWN (HTTP 5xx / unreachable) and
// again when everything RECOVERS. Uses Resend with the RESEND_API_KEY already
// configured in Netlify (same provider as the daily digest), so no extra
// secrets are needed.
//
// State is persisted in Netlify Blobs so email fires only on a transition —
// a prolonged outage sends exactly one alert, not one every 15 minutes. This
// complements the GitHub Actions monitor (which keeps a tracking issue in
// sync) and the public status page at /status.

import { getStore } from "@netlify/blobs";
import { Resend } from "resend";

const BASE_URL = process.env.URL || "https://www.janvayu.in";
const PROBE_TIMEOUT_MS = 12000;

// Recipients: comma-separated, defaults to the JanVayu inbox + maintainer.
const RECIPIENTS = (process.env.ALERT_EMAIL || "contribute@janvayu.in,varna.sr@gmail.com")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const FROM_ADDRESS = process.env.RESEND_FROM || "JanVayu Status <alerts@janvayu.in>";

// Each probe: POST {} to a function hits its own validation (4xx = alive)
// without spending Groq tokens; the site uses a plain GET. 5xx / network
// error = DOWN.
const CHECKS = [
  { name: "Website", method: "GET", url: `${BASE_URL}/` },
  { name: "Ask JanVayu chatbot (air-query)", method: "POST", url: `${BASE_URL}/.netlify/functions/air-query` },
  { name: "reference-data", method: "POST", url: `${BASE_URL}/.netlify/functions/reference-data` },
  { name: "health-advisory", method: "POST", url: `${BASE_URL}/.netlify/functions/health-advisory` },
  { name: "accountability-brief", method: "POST", url: `${BASE_URL}/.netlify/functions/accountability-brief` },
  { name: "rankings", method: "POST", url: `${BASE_URL}/.netlify/functions/rankings` },
  { name: "historical-aqi", method: "POST", url: `${BASE_URL}/.netlify/functions/historical-aqi` },
  { name: "anomaly-check", method: "POST", url: `${BASE_URL}/.netlify/functions/anomaly-check` },
];

function getBlobStore(name) {
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
  const token = process.env.BLOB_TOKEN;
  if (siteID && token) {
    return getStore({ name, siteID, token, consistency: "strong" });
  }
  return getStore({ name, consistency: "strong" });
}

async function probe(check) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), PROBE_TIMEOUT_MS);
  const started = Date.now();
  try {
    const opts = { method: check.method, signal: ctrl.signal, cache: "no-store" };
    if (check.method === "POST") {
      opts.headers = { "Content-Type": "application/json" };
      opts.body = "{}";
    }
    const res = await fetch(check.url, opts);
    return { ...check, status: res.status, down: res.status >= 500, ms: Date.now() - started };
  } catch (e) {
    return { ...check, status: "unreachable", down: true, ms: Date.now() - started, error: e.message };
  } finally {
    clearTimeout(t);
  }
}

function buildEmailHTML(subject, results) {
  const rows = results
    .map((r) => {
      const ok = !r.down;
      const color = ok ? "#16A34A" : "#DC2626";
      const label = ok ? "Operational" : "DOWN";
      return `<tr>
        <td style="padding:6px 10px;border-bottom:1px solid #eee">${r.name}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;font-family:monospace">${r.status}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;color:${color};font-weight:700">${label}</td>
      </tr>`;
    })
    .join("");
  return `<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:640px">
    <h2 style="margin:0 0 4px">${subject}</h2>
    <p style="color:#555;margin:0 0 16px">
      Checked ${new Date().toUTCString()} ·
      <a href="https://www.janvayu.in/status" style="color:#7C3AED">Status page</a>
    </p>
    <table style="border-collapse:collapse;width:100%;font-size:14px">
      <thead><tr>
        <th align="left" style="padding:6px 10px;border-bottom:2px solid #ddd">Service</th>
        <th align="left" style="padding:6px 10px;border-bottom:2px solid #ddd">HTTP</th>
        <th align="left" style="padding:6px 10px;border-bottom:2px solid #ddd">Status</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="color:#888;font-size:12px;margin-top:18px">
      Automated alert from the JanVayu health monitor. You receive this only when
      a service changes state (down or recovered), not on every check.
    </p>
  </div>`;
}

async function sendAlert(transition, results) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.log("RESEND_API_KEY not set — skipping alert email.");
    return;
  }
  const down = results.filter((r) => r.down);
  const subject =
    transition === "down"
      ? `🔴 JanVayu: ${down.length} service${down.length === 1 ? "" : "s"} DOWN — ${down.map((d) => d.name).join(", ")}`
      : "✅ JanVayu: all services recovered";

  const resend = new Resend(RESEND_API_KEY);
  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: RECIPIENTS,
      subject,
      html: buildEmailHTML(subject, results),
    });
    console.log(`Alert email (${transition}) sent to ${RECIPIENTS.join(", ")}`);
  } catch (e) {
    console.log(`Failed to send alert email: ${e.message}`);
  }
}

export default async () => {
  const results = await Promise.all(CHECKS.map(probe));
  const downServices = results.filter((r) => r.down).map((r) => r.name);
  const healthy = downServices.length === 0;
  const now = new Date().toISOString();

  const store = getBlobStore("janvayu-feeds");
  let prev = null;
  try {
    prev = await store.get("health-monitor-state", { type: "json" });
  } catch {
    prev = null;
  }
  // First run with no prior state is treated as previously-healthy, so an
  // alert only fires if we are currently down.
  const prevHealthy = prev ? !!prev.healthy : true;

  let transition = "";
  if (prevHealthy && !healthy) transition = "down";
  else if (!prevHealthy && healthy) transition = "recovered";

  if (transition) {
    await sendAlert(transition, results);
  }

  await store.setJSON("health-monitor-state", {
    healthy,
    downServices,
    lastChecked: now,
    since: transition || !prev ? now : prev.since,
    lastTransition: transition || (prev && prev.lastTransition) || null,
  });

  console.log(
    `health-monitor: ${healthy ? "all healthy" : "DOWN: " + downServices.join(", ")}` +
      (transition ? ` (transition: ${transition}, emailed ${RECIPIENTS.join(", ")})` : "")
  );

  return new Response(
    JSON.stringify({ healthy, downServices, transition, checked: now }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

export const config = {
  schedule: "*/15 * * * *", // every 15 minutes
};
