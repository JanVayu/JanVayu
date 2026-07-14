// Netlify Function: JanVayu Open Data API (v1)
//
// GET /api                                   → JSON manifest (datasets, license, citation)
// GET /api?dataset=rankings&format=csv       → CSV of the live city rankings
// GET /api?dataset=rankings&format=csv&range=7d|30d
//
// A single, documented, CORS-open, read-only entry point over the data JanVayu
// already publishes — so journalists, researchers and forks can consume it and
// cite it. The underlying endpoints (rankings, reference-data, historical-aqi,
// community-sensors, status-history) remain individually callable; this adds a
// discoverable index plus CSV export for the tabular sets. Aligns with the
// project's "national public archive" mission.

const VERSION = "v1";
const LICENSE = "Data content: CC BY-NC-SA 4.0 · Code: MIT";

function corsHeaders(extra = {}) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Cache-Control": "public, max-age=300",
    ...extra,
  };
}

function toCSV(rows, cols) {
  const esc = (v) => {
    if (v == null) return "";
    const s = String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const header = cols.join(",");
  const body = rows.map((r) => cols.map((c) => esc(r[c])).join(",")).join("\n");
  return header + "\n" + body + "\n";
}

export default async (req) => {
  const url = new URL(req.url);
  const origin = process.env.URL || process.env.DEPLOY_PRIME_URL || url.origin;

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  const dataset = url.searchParams.get("dataset");
  const format = (url.searchParams.get("format") || "json").toLowerCase();

  // ── CSV export for the tabular datasets ──────────────────────────────────
  if (format === "csv" && dataset === "rankings") {
    const range = url.searchParams.get("range") || "live";
    try {
      const r = await fetch(
        `${origin}/.netlify/functions/rankings?range=${encodeURIComponent(range)}`,
        { signal: AbortSignal.timeout(8000) }
      );
      if (!r.ok) throw new Error("rankings upstream " + r.status);
      const j = await r.json();
      const rows = (j.cities || []).map((c, i) => ({
        rank: i + 1,
        city: c.name || c.key,
        key: c.key,
        aqi: c.aqi ?? "",
        pm25: c.pm25 ?? "",
      }));
      const csv = toCSV(rows, ["rank", "city", "key", "aqi", "pm25"]);
      return new Response(csv, {
        headers: corsHeaders({
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="janvayu-rankings-${range}.csv"`,
        }),
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 502,
        headers: corsHeaders({ "Content-Type": "application/json" }),
      });
    }
  }

  // ── Default: the manifest ────────────────────────────────────────────────
  const manifest = {
    name: "JanVayu Open Data API",
    version: VERSION,
    description:
      "Read-only, CORS-open access to the air-quality data JanVayu publishes. Free to use with attribution.",
    license: LICENSE,
    citation: `JanVayu (janvayu.in), ${new Date().toISOString().slice(0, 10)}. Data sources: CPCB, CREA, IQAir, WAQI, OpenAQ.`,
    docs: `${origin}/docs/#/api/`,
    updated: new Date().toISOString(),
    datasets: [
      {
        id: "rankings",
        title: "City AQI rankings (worst-first), live or averaged",
        url: `${origin}/.netlify/functions/rankings?range=live`,
        params: { range: "live | 7d | 30d" },
        formats: ["json", "csv"],
        csv: `${origin}/api?dataset=rankings&format=csv&range=live`,
      },
      {
        id: "reference",
        title: "Reference datasets: CPCB stations, NCAP cities, IQAir annual",
        url: `${origin}/.netlify/functions/reference-data`,
        params: { dataset: "cpcb_stations | ncap_cities | iqair_annual" },
        formats: ["json"],
      },
      {
        id: "historical",
        title: "Year-over-year monthly PM2.5 (climatology + snapshots)",
        url: `${origin}/.netlify/functions/historical-aqi?city=delhi`,
        params: { city: "city key (e.g. delhi)", month: "1-12" },
        formats: ["json"],
      },
      {
        id: "community-sensors",
        title: "Hyperlocal sensors near a point (OpenAQ / Sensor.Community)",
        url: `${origin}/.netlify/functions/community-sensors?lat=28.61&lon=77.21&radius=25`,
        params: { lat: "latitude", lon: "longitude", radius: "km (max 50)" },
        formats: ["json"],
      },
      {
        id: "status",
        title: "90-day platform + endpoint uptime history",
        url: `${origin}/.netlify/functions/status-history`,
        params: {},
        formats: ["json"],
      },
    ],
    notes:
      "Rankings and community-sensor data are cached snapshots (see Cache-Control). Low-cost sensor readings are ±20-50% vs regulatory-grade. Forecast data is served client-side from the free Open-Meteo (CAMS) API, not this endpoint.",
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: corsHeaders({ "Content-Type": "application/json" }),
  });
};
