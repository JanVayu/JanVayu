// Netlify Function: 90-day status history for the public status page.
//
// GET /.netlify/functions/status-history
// Returns { generated, days: [{ date: "YYYY-MM-DD", status: "up"|"degraded"|"down" }] }
// for the last 90 days, oldest first. CORS-open so the status page can read it
// from any host (e.g. status.askjanvayu.in).
//
// Real per-day data is written by health-monitor.mjs into Netlify Blobs. For
// days with no recorded data we fall back to a seed: the known chatbot 502
// partial outage (site up, AI/data functions down) from 2026-05-26 to
// 2026-06-07, everything else "up". Recorded data always takes precedence, so
// the strip becomes fully real as the monitor accrues history.

import { getBlobStore } from "./lib/blob.mjs";
import { corsHeaders, preflight } from "./lib/http.mjs";

const CORS = corsHeaders("GET, OPTIONS");

const DAYS = 90;

// Seeded incident window (inclusive). Partial outage → "degraded".
const SEED_DEGRADED_START = "2026-05-26";
const SEED_DEGRADED_END = "2026-06-07";


const ymd = (d) => d.toISOString().slice(0, 10);

export default async (req) => {
  const __pf = preflight(req, "GET, OPTIONS"); if (__pf) return __pf;

  let recorded = {};
  try {
    const store = getBlobStore("janvayu-feeds");
    recorded = (await store.get("status-history", { type: "json" })) || {};
  } catch {
    recorded = {};
  }

  const today = new Date();
  const days = [];
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - i)
    );
    const date = ymd(d);
    let status = recorded[date];
    if (!status) {
      status =
        date >= SEED_DEGRADED_START && date <= SEED_DEGRADED_END ? "degraded" : "up";
    }
    days.push({ date, status });
  }

  return new Response(
    JSON.stringify({ generated: new Date().toISOString(), days }),
    { status: 200, headers: { ...CORS, "Content-Type": "application/json" } }
  );
};
