# Backend Stack

JanVayu's backend is entirely serverless — 13 Netlify Functions handling data proxying, caching, scheduled tasks, email delivery, and AI features.

---

## Netlify Functions

**Runtime:** Node.js 18
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
| `twitter-feed.js` | On-demand (GET) | Cached Twitter/X posts |
| `instagram-feed.js` | On-demand (GET) | Cached Instagram posts |
| `news-proxy.js` | On-demand (GET) | Cached news articles |
| `subscribe.js` | On-demand (POST) | Email subscription management |
| `feed-status.js` | On-demand (GET) | Feed freshness health check |
| `blob-store.js` | Utility (shared) | Netlify Blobs store initialisation |

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

**Package:** `@netlify/blobs` v8.1.0
**Consistency:** Strong (not eventual)
**Store name:** `feed-cache`

### How Caching Works

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────┐
│ scheduled-fetch  │────▶│  Netlify Blobs    │◀────│ On-demand    │
│ (every 4 hours)  │     │  (JSON cache)     │     │ functions    │
│                  │     │                   │     │ (instant)    │
│ Fetches Reddit,  │     │ reddit-posts      │     │ Serve from   │
│ Twitter, News,   │     │ twitter-posts     │     │ cache first  │
│ Instagram        │     │ news-articles     │     │              │
└──────────────────┘     │ instagram-posts   │     └──────────────┘
                         └──────────────────┘
```

**Cache-first strategy:**
1. On-demand function checks Blobs for cached data
2. If cache hit → return immediately (sub-50ms response)
3. If cache miss → fetch live, write to Blobs, return
4. If live fetch fails → return stale cache (better than nothing)

This ensures feed outages (Reddit rate limits, Nitter downtime) result in slightly stale data — never broken UI.

---

## Resend (Email Delivery)

**Package:** `resend` v6.9.3
**Used by:** `daily-digest.mjs`
**From address:** `digest@janvayu.in`

### Daily Digest Flow

1. `daily-digest.mjs` fires at 8:00 AM IST (Netlify scheduled function)
2. Fetches live AQI for subscriber's cities from WAQI
3. Formats a clean HTML email with AQI data, trends, and health guidance
4. Sends via Resend API

**Why Resend over SendGrid/Mailgun:**
- Clean API, minimal code
- Free tier covers JanVayu's subscriber volume
- Good deliverability to Indian email providers (Gmail India, Outlook India)
- Built-in bounce/complaint handling

---

## WAQI API (Client-Side)

The World Air Quality Index API is the only external API called directly from the browser.

**Token:** Free-tier public key (embedded in client JS — this is by design, not a leak)
**Refresh:** Every 10 minutes via `setInterval`
**Endpoints used:**
- `api.waqi.info/feed/{city}/` — single city AQI
- `api.waqi.info/map/bounds/` — stations within geographic bounds

**Why client-side:**
- Real-time data (no caching delay)
- Free tier has no API key restriction on public use
- Reduces serverless function invocations
