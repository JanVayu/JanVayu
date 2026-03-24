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
- Twitter/X posts via Nitter RSS instances (hashtags: DelhiAirQuality, DelhiPollution, CleanAirIndia, etc.)
- Google News RSS for air quality topics
- Instagram hashtags via RSS-Bridge

This function ensures that on-demand feed functions respond instantly from cache, rather than making live API calls on every user request.

---

#### `daily-digest.mjs`
**Trigger:** Daily at 8:00 AM IST (2:30 AM UTC)  
**Purpose:** Reads all subscribers from Netlify Blobs, fetches current AQI for each subscriber's city, and sends a personalised HTML email via Resend.

Each email includes:
- Current AQI reading and category
- Health advisory for the day
- Comparison with the previous day's reading

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
**Purpose:** Returns cached Twitter/X posts via Nitter RSS from Netlify Blobs.

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
  "feeds": {
    "reddit": { "updated_at": "...", "status": "ok" },
    "twitter": { "updated_at": "...", "status": "ok" },
    "news": { "updated_at": "...", "status": "ok" }
  }
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
  "threshold": 150,
  "action": "subscribe"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `email` | Yes | Subscriber email |
| `cities` | Yes | Array of city keys (see city list in `daily-digest.mjs`) |
| `threshold` | No | AQI threshold; if set, only send when AQI exceeds this value |
| `action` | Yes | `"subscribe"` or `"unsubscribe"` |

---

### AI Functions (Groq-Powered)

All AI functions use Llama 3.3 70B (an open-source LLM) via the Groq REST API (OpenAI-compatible). They require `GROQ_API_KEY`.

#### `air-query.mjs`
**Endpoint:** `GET /.netlify/functions/air-query?city={cityKey}&question={question}`  
**Purpose:** Accepts a natural language question about a city's air quality, fetches live AQI from WAQI, and sends both to Llama 3.3 70B via Groq for an informed response.

**Example:** `?city=delhi&question=Is it safe to take my child to the park today?`

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
**Endpoint:** `GET /.netlify/functions/accountability-brief?city={cityKey}`  
**Purpose:** Generates a structured accountability brief for the specified city — suitable for ward councillors, journalists, or resident associations. Includes current AQI, NCAP progress, and suggested questions.

---

#### `anomaly-check.mjs`
**Endpoint:** `GET /.netlify/functions/anomaly-check`  
**Purpose:** Checks AQI for major cities against seasonal baselines and flags significant spikes. Optionally uses Llama 3.3 70B via Groq to explain the likely cause of the anomaly.

---

### Shared Utilities

#### `blob-store.js`
Not an HTTP function — a shared CommonJS module used by other functions to create a Netlify Blobs store instance with explicit credential fallback.

```js
const { getBlobStore } = require('./blob-store');
const store = getBlobStore('janvayu-feeds');
```
