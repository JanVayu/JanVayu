// Netlify Function: Zotero Library → Reading List
//
// GET /.netlify/functions/zotero-library
//
// Fetches items from the public JanVayu Zotero group library and returns
// them in a simplified card format. Results are cached in Netlify Blobs
// for 6 hours to avoid hitting the Zotero API on every request.

import { getStore } from "@netlify/blobs";

const ZOTERO_GROUP_ID = "6508140";
const ZOTERO_API_URL = `https://api.zotero.org/groups/${ZOTERO_GROUP_ID}/items?format=json&limit=50&sort=dateModified&direction=desc`;

const BLOB_STORE_NAME = "janvayu-cache";
const CACHE_KEY = "zotero-library";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function getBlobStore(name) {
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
  const token = process.env.BLOB_TOKEN;
  if (siteID && token) return getStore({ name, siteID, token, consistency: "strong" });
  return getStore({ name, consistency: "strong" });
}

/**
 * Transform a raw Zotero API item into a simplified card object.
 */
function transformItem(item) {
  const data = item.data || {};

  // Build authors string from creators array
  const authors = (data.creators || [])
    .filter((c) => c.creatorType === "author" || c.creatorType === "editor")
    .map((c) => {
      if (c.name) return c.name;
      return [c.lastName, c.firstName].filter(Boolean).join(", ");
    })
    .join("; ");

  // Extract year from date field
  const dateStr = data.date || "";
  const yearMatch = dateStr.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch ? yearMatch[0] : null;

  // Best URL: prefer DOI link, then url field, then Zotero public link
  let url = data.url || "";
  if (data.DOI) {
    url = `https://doi.org/${data.DOI}`;
  }
  if (!url && item.links && item.links.alternate) {
    url = item.links.alternate.href || "";
  }

  // Tags
  const tags = (data.tags || []).map((t) => t.tag);

  return {
    title: data.title || "(Untitled)",
    authors: authors || "Unknown",
    year,
    url,
    type: data.itemType || "unknown",
    tags,
    abstract: data.abstractNote || "",
  };
}

/**
 * Fetch fresh items from the Zotero API.
 */
async function fetchFromZotero() {
  const res = await fetch(ZOTERO_API_URL, {
    headers: {
      "Zotero-API-Version": "3",
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    throw new Error(`Zotero API returned ${res.status}: ${res.statusText}`);
  }

  const raw = await res.json();

  // Filter out attachments, notes, and other non-bibliographic items
  const items = raw
    .filter((item) => {
      const t = (item.data || {}).itemType || "";
      return t !== "attachment" && t !== "note" && t !== "annotation";
    })
    .map(transformItem);

  return items;
}

export default async function handler(request) {
  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  try {
    const store = getBlobStore(BLOB_STORE_NAME);

    // Try to read from cache
    let cached = null;
    try {
      const raw = await store.get(CACHE_KEY);
      if (raw) {
        cached = JSON.parse(raw);
      }
    } catch (e) {
      console.log("Blob cache read failed (non-fatal):", e.message);
    }

    const now = Date.now();

    // Return cached version if fresh
    if (cached && cached.timestamp && now - cached.timestamp < CACHE_TTL_MS) {
      return new Response(
        JSON.stringify({
          items: cached.items,
          count: cached.items.length,
          cached: true,
          fetched_at: new Date(cached.timestamp).toISOString(),
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...CORS_HEADERS,
          },
        }
      );
    }

    // Fetch fresh data from Zotero
    const items = await fetchFromZotero();
    const payload = { items, timestamp: now };

    // Write to cache (non-blocking, don't fail the request if this errors)
    try {
      await store.set(CACHE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.log("Blob cache write failed (non-fatal):", e.message);
    }

    return new Response(
      JSON.stringify({
        items,
        count: items.length,
        cached: false,
        fetched_at: new Date(now).toISOString(),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...CORS_HEADERS,
        },
      }
    );
  } catch (err) {
    console.error("zotero-library error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch Zotero library", detail: err.message }),
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
