# Backend Stack

JanVayu's backend is entirely serverless — 29 Netlify Function files (plus shared `lib/`) handling data proxying, caching, scheduled tasks, email delivery, and AI features.

---

## Netlify Functions

**Runtime:** Node.js 22
**Module format:** ES Modules (`.mjs`) for AI features, CommonJS (`.js`) for feed proxies
**Location:** `netlify/functions/`

### Function Inventory

| Function | Type | Purpose |
|----------|------|---------|
| `scheduled-fetch.mjs` | Scheduled (cron, every 4h) | Pre-fetches all social/news feeds |
| `daily-digest.mjs` | Scheduled (cron, 8 AM IST) | Sends daily AQI email digest |
| `air-query.mjs` | On-demand (POST) | AI: natural language AQI Q&A |
| `health-advisory.mjs` | On-demand (POST) | AI: personalised health advice |
| `accountability-brief.mjs` | On-demand (POST) | AI: ward-level governance briefs |
| `anomaly-check.mjs` | On-demand (GET) | AI: PM2.5 spike detection |
| `reddit-feed.js` | On-demand (GET) | Cached Reddit air quality posts |
| `twitter-feed.js` | — | **Retired.** Read Nitter, whose public instances are gone; nothing calls it. |
| `youtube-feed.js` | On-demand (GET) | Cached India air-quality videos from YouTube channel RSS |
| `instagram-feed.js` | On-demand (GET) | Cached Instagram posts |
| `news-proxy.js` | On-demand (GET) | Cached news articles |
| `subscribe.js` | On-demand (POST) | Email subscription management |
| `feed-status.js` | On-demand (GET) | Feed freshness health check |
| `blob-store.js` | Utility (shared) | Netlify Blobs store initialisation |

The table lists the core functions only. Others in `netlify/functions/` include `waqi-proxy`, `rankings`, `historical-aqi`, `data-api`, `fire-tracker`, `community-sensors`, `push-subscribe`, `push-send`, `health-monitor`, `feed-health`, `status-history`, `terra-collab`, `workshop-submit`, `zotero-library` and `reference-data`.

### Common Patterns

Every function follows the same template:

```javascript
export default async (req, context) => {
  // 1. CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: corsHeaders });
  }

  try {
    // 2. Core logic (fetch data, call AI, etc.)
    const result = await doWork();

    // 3. Return JSON
    return Response.json(result, { headers: corsHeaders });
  } catch (error) {
    // 4. Graceful fallback — never a 500 with no body
    console.log('Error:', error.message);
    return Response.json({ error: 'Service unavailable', fallback: rawData }, {
      status: 200,
      headers: corsHeaders,
    });
  }
};
```

---

## Netlify Blobs (Cache Layer)

**Package:** `@netlify/blobs` ^11.0.2
**Consistency:** Strong (not eventual)
**Store name:** `janvayu-feeds` (the code also uses `janvayu-subscribers`, `janvayu-rankings` and `janvayu-push-subs`)

### How Caching Works

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────┐
│ scheduled-fetch  │────▶│  Netlify Blobs    │◀────│ On-demand    │
│ (every 4 hours)  │     │  (JSON cache)     │     │ functions    │
│                  │     │                   │     │ (instant)    │
│ Fetches Reddit,  │     │ reddit            │     │ Serve from   │
│ News, Instagram  │     │ news              │     │ cache first  │
└──────────────────┘     │ instagram         │     └──────────────┘
                         │ youtube           │
                         │ sensor-community  │
                         └──────────────────┘
```

The `youtube` and `sensor-community` keys are written by `youtube-feed.js` and `community-sensors.mjs`, not by `scheduled-fetch`.

**Cache-first strategy:**
1. On-demand function checks Blobs for cached data
2. If cache hit → return immediately
3. If cache miss → fetch live, write to Blobs, return
4. If live fetch fails → return stale cache (better than nothing)

This ensures feed outages (Reddit rate limits, Nitter downtime) result in slightly stale data — never broken UI.

---

## Resend (Email Delivery)

**Package:** `resend` ^6.14.0
**Used by:** `daily-digest.mjs`
**From address:** `digest@janvayu.in`

### Daily Digest Flow

1. `daily-digest.mjs` fires at 8:00 AM IST (Netlify scheduled function)
2. Fetches live AQI for subscriber's cities from WAQI
3. Formats a clean HTML email with AQI data and health guidance
4. Sends via Resend API

**Why Resend over SendGrid/Mailgun:**
- Clean API, minimal code
- Free plan has a daily limit of 100 emails ([resend.com/pricing](https://resend.com/pricing)); check it against the subscriber count
- Built-in bounce/complaint handling

---

## WAQI API (Client-Side)

The World Air Quality Index API is the main live-AQI source called from the browser.

**Token:** issued by WAQI to a registrant under its [terms of service](https://aqicn.org/data-platform/token/); embedded in client JS, so anyone can read it
**Refresh:** Every 10 minutes via `setInterval`
**Endpoints used:**
- `api.waqi.info/feed/{city}/` — single city AQI
- `api.waqi.info/map/bounds/` — stations within geographic bounds

**Why client-side:**
- Real-time data (no caching delay)
- WAQI requires a valid key for all API access
- Reduces serverless function invocations
