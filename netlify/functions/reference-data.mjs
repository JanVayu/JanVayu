// Netlify Function: Reference Data Endpoint
//
// GET /.netlify/functions/reference-data
// GET /.netlify/functions/reference-data?dataset=cpcb_stations
// GET /.netlify/functions/reference-data?dataset=ncap_cities
// GET /.netlify/functions/reference-data?dataset=iqair_annual
//
// Serves the chatbot's reference data (CPCB station counts, NCAP data,
// IQAir annual figures) from a single editable JSON file rather than
// having them hardcoded in air-query.mjs.

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const VALID_DATASETS = ["cpcb_stations", "ncap_cities", "iqair_annual"];

let cachedData = null;

async function loadData() {
  if (cachedData) return cachedData;
  const filePath = join(__dirname, "data", "reference-data.json");
  const raw = await readFile(filePath, "utf-8");
  cachedData = JSON.parse(raw);
  return cachedData;
}

export default async function handler(request) {
  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  try {
    const url = new URL(request.url);
    const dataset = url.searchParams.get("dataset");

    const data = await loadData();

    // If a specific dataset is requested, return just that subset
    if (dataset) {
      if (!VALID_DATASETS.includes(dataset)) {
        return new Response(
          JSON.stringify({
            error: `Invalid dataset. Valid options: ${VALID_DATASETS.join(", ")}`,
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "public, max-age=3600",
              ...CORS_HEADERS,
            },
          }
        );
      }

      return new Response(
        JSON.stringify({
          [dataset]: data[dataset],
          last_updated: data.last_updated,
          source: data.sources[dataset],
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=3600",
            ...CORS_HEADERS,
          },
        }
      );
    }

    // Return the full reference data object
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
        ...CORS_HEADERS,
      },
    });
  } catch (err) {
    console.error("reference-data error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to load reference data" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...CORS_HEADERS,
        },
      }
    );
  }
}
