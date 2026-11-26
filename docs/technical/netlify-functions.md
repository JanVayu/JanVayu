# Netlify Functions

JanVayu uses [Netlify Functions](https://docs.netlify.com/functions/overview/) for all server-side operations. Functions live in `netlify/functions/` and are deployed automatically alongside the site.

---

## Function Reference

### Scheduled Functions (Cron)

#### `scheduled-fetch.mjs`
**Trigger:** Every 4 hours  
**Purpose:** Fetches all social and news feeds and writes them to Netlify Blobs as JSON cache.

Feeds fetched:
- Reddit posts from r/india, r/delhi, r/indianews, r/environment, r/worldnews
- ~~Twitter/X posts via Nitter RSS instances~~ — **retired.** Nitter's public instances are gone and the endpoint no longer answers at all. X is now linked, not fetched: live searches and named accounts, each verified with `scripts/verify-x-links.py` against X's public embed endpoint.
- Google News RSS for air quality topics
- Instagram hashtags via RSS-Bridge

This function ensures that on-demand feed functions respond instantly from cache, rather than making live API calls on every user request.

---

#### `daily-digest.mjs`
**Trigger:** Daily at 8:00 AM IST (2:30 AM UTC)  
**Purpose:** Reads all subscribers from Netlify Blobs, fetches current AQI for each subscriber's city, and sends a personalised HTML email via Resend.

Each email includes:
- A table of the subscriber's cities, with CPCB's category for the current PM2.5, and PM2.5 and PM10 in µg/m³
- The health effects CPCB publishes for the worst city's category
- A line saying whether any city is above the subscriber's PM2.5 alert level

A reading older than six hours, or implausibly low, is not shown. The row says "No reliable reading today" and gives the reason (`assessReading` in `daily-digest.mjs`).

**Dependencies:** `RESEND_API_KEY`, `RESEND_FROM`, `BLOB_TOKEN`, `NETLIFY_SITE_ID`

---

### On-Demand API Functions

#### `reddit-feed.js`
**Endpoint:** `GET /.netlify/functions/reddit-feed`  
**Purpose:** Returns cached Reddit posts on air quality from Netlify Blobs.  
Falls back to a live Reddit fetch if the cache is empty.

---

#### `twitter-feed.js`
**Endpoint:** `GET /.netlify/functions/twitter-feed`  
**Purpose:** *Retired.* It read Nitter, whose public instances are gone; measured against production it does not answer at all. Nothing calls it — the front end links to X instead of fetching it.

---

#### `news-proxy.js`
**Endpoint:** `GET /.netlify/functions/news-proxy`  
**Purpose:** Returns cached Google News RSS articles on air quality topics.

---

#### `instagram-feed.js`
**Endpoint:** `GET /.netlify/functions/instagram-feed`  
**Purpose:** Returns cached Instagram hashtag posts via RSS-Bridge instances.

---

#### `feed-status.js`
**Endpoint:** `GET /.netlify/functions/feed-status`  
**Purpose:** Returns feed freshness — when each feed was last updated and whether recent fetches succeeded. Used by the client to show "Data last updated: X" with server-side truth.

**Response shape:**
```json
{
  "last_updated": "2026-03-23T12:00:00Z",
  "schedule": "Netlify feeds every 4 hours, email digest daily at 8 AM IST",
  "log": { },
  "email_log": { },
  "server_time": "2026-03-23T12:05:00Z"
}
```

---

#### `subscribe.js`
**Endpoint:** `POST /.netlify/functions/subscribe`  
**Purpose:** Manages email subscriptions. Accepts `subscribe` and `unsubscribe` actions.

**Request body:**
```json
{
  "email": "user@example.com",
  "cities": ["delhi", "mumbai"],
  "pm25_threshold": 90,
  "action": "subscribe"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `email` | Yes | Subscriber email |
| `cities` | No | Array of city keys (see city list in `daily-digest.mjs`); defaults to `["delhi"]` |
| `pm25_threshold` | No | Alert level in µg/m³ of PM2.5; defaults to 90 and is held between 10 and 500. It does not suppress the digest: `daily-digest.mjs` emails every subscriber daily, and the level only changes the alert wording. Records made before 29 October 2026 carry an older `threshold` (a US AQI), which `thresholdPM25()` in `lib/cpcb.mjs` converts |
| `action` | No | `"unsubscribe"` removes the address; anything else, or nothing, subscribes |

---

### AI Functions (Groq-Powered)

All AI functions use OpenAI gpt-oss-120b (an open-weight LLM; `openai/gpt-oss-120b` by default, overridable with `GROQ_MODEL`) via the Groq REST API (OpenAI-compatible). They require `GROQ_API_KEY`.

#### `air-query.mjs`
**Endpoint:** `POST /.netlify/functions/air-query` (other methods are rejected)  
**Purpose:** Accepts a natural language question about a city's air quality, fetches live AQI from WAQI, and sends both to gpt-oss-120b via Groq for an informed response.

**Request body:**
```json
{
  "city": "delhi",
  "question": "Is it safe to take my child to the park today?"
}
```

An optional `lang` field requests a response language.

---

#### `health-advisory.mjs`
**Endpoint:** `POST /.netlify/functions/health-advisory`  
**Purpose:** Generates a personalised health advisory based on the user's profile (age, health conditions) and their city's current AQI.

**Request body:**
```json
{
  "city": "delhi",
  "age": 45,
  "conditions": ["asthma", "heart disease"]
}
```

---

#### `accountability-brief.mjs`
**Endpoint:** `POST /.netlify/functions/accountability-brief` with a JSON body such as `{"city": "delhi", "area": "..."}` (`city` and `area` are required; `period` is optional)  
**Purpose:** Generates a structured accountability brief for the specified city — suitable for ward councillors, journalists, or resident associations. Includes current AQI, NCAP progress, and suggested questions.

---

#### `anomaly-check.mjs`
**Endpoint:** `GET /.netlify/functions/anomaly-check`  
**Purpose:** Checks AQI for major cities against seasonal baselines and flags significant spikes. Optionally uses gpt-oss-120b via Groq to explain the likely cause of the anomaly.

---

### Other Functions

#### `waqi-proxy.mjs`
**Endpoint:** `GET /.netlify/functions/waqi-proxy`  
**Purpose:** The only route from a browser to `api.waqi.info`. It adds the `WAQI_TOKEN` on the server, accepts only city slugs, in-range coordinates and a bounding box no wider than three degrees, and for a lookup by coordinates returns a station only if it is within 30 km and has reported in the last 6 hours.

---

#### `air-model.mjs`
**Endpoint:** `GET /.netlify/functions/air-model?lat=..&lon=..`  
**Purpose:** A modelled PM2.5 estimate for a point in India from Open-Meteo (CAMS). It is the last link in the chain in `js/air-sources.js`, used only when no station near a place has reported recently and CPCB's daily bulletin has no recent figure.

---

`netlify/functions/` holds 29 files in total: 28 functions and the `blob-store.js` helper. Those not described above include `youtube-feed`, `rankings`, `historical-aqi`, `data-api`, `fire-tracker`, `community-sensors`, `push-subscribe`, `push-send`, `health-monitor`, `feed-health`, `status-history`, `terra-collab`, `workshop-submit` and `reference-data`. Their reference entries have not been written yet.

---

### Shared Utilities

#### `blob-store.js`
Not an HTTP function — a shared CommonJS module used by other functions to create a Netlify Blobs store instance with explicit credential fallback.

```js
const { getBlobStore } = require('./blob-store');
const store = getBlobStore('janvayu-feeds');
```
