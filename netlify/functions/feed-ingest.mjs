// Netlify Function: Ingests social media feed data from GitHub Actions (Agent-Reach)
// Accepts POST with JSON body, validates API key, stores in Netlify Blobs
// Keys: twitter-agent, youtube, news-enhanced (separate from existing feed keys)

import { getStore } from "@netlify/blobs";

function getBlobStore(name) {
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
  const token = process.env.BLOB_TOKEN;
  if (siteID && token) return getStore({ name, siteID, token, consistency: "strong" });
  return getStore({ name, consistency: "strong" });
}

function deduplicateByKey(existing, incoming, keyFn) {
  const seen = new Set();
  const merged = [];
  // Incoming first (newer data)
  for (const item of incoming) {
    const key = keyFn(item);
    if (key && !seen.has(key)) {
      seen.add(key);
      merged.push(item);
    }
  }
  // Then existing (older data)
  for (const item of existing) {
    const key = keyFn(item);
    if (key && !seen.has(key)) {
      seen.add(key);
      merged.push(item);
    }
  }
  return merged;
}

export default async (req) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, x-api-key",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") {
    return new Response("", { status: 204, headers });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers,
    });
  }

  // Validate API key
  const apiKey = req.headers.get("x-api-key");
  const expectedKey = process.env.FEED_INGEST_KEY;
  if (!expectedKey || apiKey !== expectedKey) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers,
    });
  }

  let body;
  try {
    body = await req.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400, headers,
    });
  }

  const store = getBlobStore("janvayu-feeds");
  const timestamp = body.fetched_at || new Date().toISOString();
  const results = {};

  // Store Twitter data from Agent-Reach (bird CLI)
  if (body.twitter && body.twitter.posts) {
    try {
      const existing = await store.get("twitter-agent", { type: "json" }).catch(() => null);
      const existingPosts = existing?.posts || [];
      const merged = deduplicateByKey(
        existingPosts, body.twitter.posts,
        (p) => p.link || p.text?.substring(0, 80)
      );
      // Keep max 100 posts
      const data = {
        posts: merged.slice(0, 100),
        count: merged.length,
        fetched_at: timestamp,
        source: "agent-reach-bird",
      };
      await store.setJSON("twitter-agent", data);
      results.twitter = { ok: true, count: data.count };
    } catch (e) {
      results.twitter = { ok: false, error: e.message };
    }
  }

  // Store YouTube data
  if (body.youtube && body.youtube.videos) {
    try {
      const existing = await store.get("youtube", { type: "json" }).catch(() => null);
      const existingVideos = existing?.videos || [];
      const merged = deduplicateByKey(
        existingVideos, body.youtube.videos,
        (v) => v.url || v.title?.substring(0, 60)
      );
      const data = {
        videos: merged.slice(0, 50),
        count: merged.length,
        fetched_at: timestamp,
        source: "agent-reach-ytdlp",
      };
      await store.setJSON("youtube", data);
      results.youtube = { ok: true, count: data.count };
    } catch (e) {
      results.youtube = { ok: false, error: e.message };
    }
  }

  // Store enhanced news data
  if (body.news_enhanced && body.news_enhanced.articles) {
    try {
      const existing = await store.get("news-enhanced", { type: "json" }).catch(() => null);
      const existingArticles = existing?.articles || [];
      const merged = deduplicateByKey(
        existingArticles, body.news_enhanced.articles,
        (a) => a.link || a.title?.toLowerCase().substring(0, 50)
      );
      const data = {
        articles: merged.slice(0, 60),
        count: merged.length,
        fetched_at: timestamp,
        source: "agent-reach-jina",
      };
      await store.setJSON("news-enhanced", data);
      results.news_enhanced = { ok: true, count: data.count };
    } catch (e) {
      results.news_enhanced = { ok: false, error: e.message };
    }
  }

  // Log the ingest
  await store.setJSON("last-agent-reach-ingest", {
    timestamp,
    results,
  });

  return new Response(JSON.stringify({ ok: true, results, timestamp }), {
    status: 200, headers,
  });
};
