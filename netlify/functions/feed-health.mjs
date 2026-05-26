// Netlify Scheduled Function: Daily feed health check
// Calls each feed endpoint and reports which are healthy, stale, or broken.

export const config = { schedule: "@daily" };

const FEEDS = [
  { name: "reddit-feed", path: "/.netlify/functions/reddit-feed" },
  { name: "twitter-feed", path: "/.netlify/functions/twitter-feed" },
  { name: "instagram-feed", path: "/.netlify/functions/instagram-feed" },
  { name: "youtube-feed", path: "/.netlify/functions/youtube-feed" },
  { name: "news-proxy", path: "/.netlify/functions/news-proxy" },
];

// Items older than 48 hours are considered stale
const STALE_THRESHOLD_MS = 48 * 60 * 60 * 1000;

async function checkFeed(baseUrl, feed) {
  const url = `${baseUrl}${feed.path}`;
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) {
      return { name: feed.name, status: "broken", reason: `HTTP ${res.status}` };
    }

    let data;
    try {
      data = await res.json();
    } catch {
      return { name: feed.name, status: "broken", reason: "Invalid JSON" };
    }

    // Determine the items array — feeds may return an array directly or { items: [...] } or { data: [...] }
    const items = Array.isArray(data)
      ? data
      : Array.isArray(data.items)
        ? data.items
        : Array.isArray(data.data)
          ? data.data
          : null;

    if (!items || items.length === 0) {
      return { name: feed.name, status: "broken", reason: "No items returned" };
    }

    // Check freshness: look for a date field on the first item
    const firstItem = items[0];
    const dateStr =
      firstItem.created_utc
        ? new Date(firstItem.created_utc * 1000).toISOString()
        : firstItem.date || firstItem.published || firstItem.timestamp || null;

    if (dateStr) {
      const age = Date.now() - new Date(dateStr).getTime();
      if (age > STALE_THRESHOLD_MS) {
        return {
          name: feed.name,
          status: "stale",
          itemCount: items.length,
          newestItem: dateStr,
          ageHours: Math.round(age / 3_600_000),
        };
      }
    }

    return { name: feed.name, status: "healthy", itemCount: items.length };
  } catch (err) {
    return {
      name: feed.name,
      status: "broken",
      reason: err.name === "TimeoutError" ? "Timeout (15s)" : err.message,
    };
  }
}

export default async function handler(req) {
  // Determine base URL from the request or fall back to env/default
  const baseUrl =
    process.env.URL || process.env.DEPLOY_PRIME_URL || "https://www.janvayu.in";

  const results = await Promise.allSettled(
    FEEDS.map((feed) => checkFeed(baseUrl, feed))
  );

  const report = { healthy: [], stale: [], broken: [], checked_at: new Date().toISOString() };

  for (const r of results) {
    const entry = r.status === "fulfilled" ? r.value : { name: "unknown", status: "broken", reason: r.reason?.message };
    report[entry.status].push(entry);
  }

  const summary = [
    `Feed Health Check @ ${report.checked_at}`,
    `  Healthy: ${report.healthy.map((f) => f.name).join(", ") || "none"}`,
    `  Stale:   ${report.stale.map((f) => f.name).join(", ") || "none"}`,
    `  Broken:  ${report.broken.map((f) => f.name).join(", ") || "none"}`,
  ].join("\n");

  console.log(summary);

  return new Response(JSON.stringify(report, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  });
}
