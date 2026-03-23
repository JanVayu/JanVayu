# Skill: Automation

These are the patterns used to design and prompt JanVayu's scheduled tasks, cache architecture, and recurring maintenance — the parts of the platform that run without human intervention.

---

## Core Principle: Fail Visibly, Degrade Gracefully

Every automated system on JanVayu is designed with two properties:

1. **Fail visibly** — when something breaks, it logs clearly and returns a meaningful response, not a silent 500
2. **Degrade gracefully** — the UI still renders with stale or partial data rather than going blank

This principle was the starting constraint for every automation prompt:

```
Write a [scheduled/on-demand] Netlify Function for [task]. 
Requirements:
- If any external call fails, log the error with context (function name, 
  city/feed, error message) and continue — do not abort the entire run
- Always return a response body (never a raw 500)
- Stale data is better than no data — if a cache read fails, try a live 
  fetch; if the live fetch fails, return whatever stale data exists
- Log the start and end of every scheduled run with a timestamp
```

---

## Scheduled Function Patterns

### The "Cache Warmer" Pattern (`scheduled-fetch.mjs`)

For functions that pre-fetch data on a schedule:

```
Write a Netlify Scheduled Function that fetches [list of feeds] and stores 
results in Netlify Blobs. Requirements:
- Fetch all feeds in parallel (Promise.allSettled — not Promise.all, 
  so one failure doesn't cancel the others)
- Write a "last-fetch-time" key to Blobs after each run (ISO timestamp)
- Write a "last-fetch-log" key summarising which feeds succeeded/failed 
  and how many items were retrieved
- If a feed fetch fails, write the previous cached value back with an 
  error flag rather than writing nothing
- The on-demand functions that serve these feeds should check the age 
  of the cache and serve it without making a live call if < 4 hours old
```

The "last-fetch-log" key is what the `feed-status.js` function reads to show the admin "Data last updated: X minutes ago" — observable automation is much easier to debug than silent automation.

**Why `Promise.allSettled` not `Promise.all`?**
`Promise.all` cancels all pending promises the moment any one rejects. In a feed warmer with 5+ sources, one Reddit timeout should not prevent the news feed from being cached. `Promise.allSettled` runs everything to completion and returns a result for each, success or failure.

---

### The "Daily Digest" Pattern (`daily-digest.mjs`)

For functions that send personalised communications on a schedule:

```
Write a Netlify Scheduled Function that:
1. Reads a list of subscribers from Blobs (email, city preferences, threshold)
2. For each subscriber, fetches current AQI for their city
3. If AQI exceeds the subscriber's threshold, send an email via Resend
4. Log: total subscribers, emails sent, emails skipped (threshold not met), 
   emails failed
5. Write the log to Blobs as "last-email-log" after the run completes
6. Never let a single subscriber failure abort the loop — catch errors 
   per subscriber and continue
```

"Never let a single subscriber failure abort the loop" is the most important constraint for a digest sender. One malformed email address should not prevent 200 other subscribers from receiving their digest.

---

## Feed Freshness Architecture

The cache freshness check is a pattern used across all on-demand feed functions:

```javascript
// Check cache age before deciding whether to fetch live
const cacheAge = Date.now() - new Date(lastFetchTime).getTime();
const FOUR_HOURS = 4 * 60 * 60 * 1000;

if (cacheAge < FOUR_HOURS && cachedData) {
  return cachedData; // serve from cache
}
// else: fetch live, update cache, return
```

**Why 4 hours?**
Reddit, news, and Twitter/X feeds change meaningfully on a ~4-hour cycle. More frequent refreshes hit rate limits; less frequent refreshes make the platform feel stale during active pollution events.

**Why not use HTTP Cache-Control headers?**
Netlify's CDN caches HTTP responses, but the feeds contain dynamic JSON. Using Blobs as an application-level cache gives explicit control over expiry — no risk of serving a stale response because of an upstream CDN cache header set incorrectly.

---

## Monitoring Pattern

JanVayu uses `feed-status.js` as a lightweight health endpoint:

```
Write a Netlify Function that reads Blobs keys:
- "last-fetch-time" (ISO timestamp of last scheduled fetch)
- "last-fetch-log" (JSON: per-feed success/failure/count)
- "last-email-log" (JSON: digest send stats)

Return all three as a JSON response. This endpoint is called by the 
client on page load to show "Data last updated: X" with a warning 
if the last fetch was > 5 hours ago.
```

This makes the automation observable from the front end — a user (or maintainer) can check the platform's data freshness without accessing the Netlify dashboard.

---

## Cron Timing Pattern

All scheduled functions use UTC cron expressions. The IST offset is always computed explicitly, not assumed:

```
IST = UTC + 5:30
8:00 AM IST = 2:30 AM UTC → cron: "30 2 * * *"
Every 4 hours from midnight IST = "30 18,22,2,6,10,14 * * *" (approx)
```

**Always use Python or a reliable converter to verify UTC conversions before deploying a scheduled function.** Off-by-one-hour errors from DST confusion (even though India does not observe DST, collaborators in other timezones sometimes introduce this error) have caused digest emails to arrive at 9 PM instead of 8 AM.

---

## Adapting for Other Projects

The cache-warmer + on-demand-server pattern is reusable for any project that:
- Needs to display data from rate-limited or unreliable third-party APIs
- Has users who expect fast page loads regardless of API availability
- Cannot afford a persistent database (Netlify Blobs is serverless and free-tier)

The key architectural decision: **separate the fetch from the serve**. The scheduled function fetches; the on-demand function serves. They communicate only through the Blobs cache. This makes both independently testable and independently debuggable.
