// Shared Netlify Blobs store factory — the single source of truth that was
// previously copy-pasted into every function. Uses explicit siteID/token when
// present (server context), else falls back to ambient Netlify config.
import { getStore } from "@netlify/blobs";

export function getBlobStore(name) {
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
  const token = process.env.BLOB_TOKEN;
  if (siteID && token) return getStore({ name, siteID, token, consistency: "strong" });
  return getStore({ name, consistency: "strong" });
}
