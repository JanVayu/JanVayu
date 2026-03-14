// Shared Netlify Blobs store factory with explicit config fallback
const { getStore } = require('@netlify/blobs');

function getBlobStore(name) {
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
  const token = process.env.BLOB_TOKEN;

  if (siteID && token) {
    return getStore({ name, siteID, token, consistency: "strong" });
  }
  // Fall back to auto-detection (works in Netlify build context)
  return getStore({ name, consistency: "strong" });
}

module.exports = { getBlobStore };
