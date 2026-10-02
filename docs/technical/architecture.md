# Architecture

JanVayu is a **zero-framework, single-page application** deployed on Netlify with server-side serverless functions for data proxying, caching, and scheduled tasks.

---

## System Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Client (Browser)                    │
│  HTML + CSS + JS · Chart.js · Leaflet.js · WAQI API    │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTPS (Netlify CDN)
┌──────────────────────────▼──────────────────────────────┐
│                   Netlify Functions                      │
│                                                          │
│  Scheduled (cron)              On-demand (API)           │
│  ┌──────────────────┐   ┌───────────────────────────┐   │
│  │ scheduled-fetch   │   │ reddit-feed.js            │   │
│  │ (every 4 hours)   │   │ youtube-feed.js           │   │
│  │                   │   │ news-proxy.js             │   │
│  │ daily-digest      │   │ instagram-feed.js         │   │
│  │ (8 AM IST daily)  │   │ feed-status.js            │   │
│  │                   │   │ subscribe.js              │   │
│  │ health-monitor    │   │ air-query.mjs             │   │
│  │ (every 15 min)    │   │ health-advisory.mjs       │   │
│  │ push-send (3 h)   │   │ accountability-brief.mjs  │   │
│  │ feed-health       │   │ anomaly-check.mjs         │   │
│  │ (daily)           │   │ ...and others (see below) │   │
│  └────────┬──────────┘   └─────────────┬─────────────┘   │
│           ▼                                              │
│  ┌──────────────────────────────────────────────────┐    │
│  │           Netlify Blobs (Cache)                   │    │
│  │  Feeds cached as JSON · Strong consistency        │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │         Resend (Email Delivery)                   │    │
│  │  Daily AQI digest to subscribers                  │    │
│  └──────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
    WAQI API           Groq API       External Feeds
  (Real-time AQI)    (AI features)  (Reddit, News)
```

---

## Key Design Decisions

### Static Front-End, No Bundler
The front-end is `index.html` plus `styles.css`, `app.js`, `games.js` and 19 lazy-loaded panel fragments in `panels/`, with no bundler and no framework (see the [Frontend Stack](../tech-stack/frontend.md)). This makes the codebase accessible to contributors with basic HTML/JS skills and keeps build-time complexity close to zero.

### Server-Side Proxying
Social media and news APIs are fetched via Netlify Functions to avoid CORS issues and protect API keys. The client never touches these APIs directly.

### Blob Caching
The `scheduled-fetch.mjs` function runs every 4 hours and writes feed data (Reddit, news; Instagram is attempted and normally returns nothing) to Netlify Blobs. When users request feeds, the on-demand functions serve instantly from the cache — eliminating latency and API rate limits.

### Client-Side AQI
The WAQI API is called directly from the browser every 10 minutes. The token is issued by WAQI under its terms of service and is visible in the client code. This means real-time AQI data works without any server-side infrastructure.

### No Framework, No Build Step
There is no `npm run build`, no Webpack, no React. The only build command is `node scripts/bump-version.mjs`, which stamps the version, and the deploy artefact is otherwise the repository itself. Netlify serves `index.html` from the root.

---

## Auto-Update Schedule

| Task | Frequency | Function |
|------|-----------|----------|
| Social/news feed refresh | Every 4 hours | `scheduled-fetch.mjs` |
| Daily AQI email digest | 8:00 AM IST daily | `daily-digest.mjs` |
| Live AQI dashboard | Every 10 minutes | Client-side JS (WAQI API) |
| Anomaly detection | On-demand | `anomaly-check.mjs` |
| Uptime and function health checks | Every 15 minutes | `health-monitor.mjs` |
| Web push notifications | Every 3 hours | `push-send.mjs` |
| Feed health check | Daily | `feed-health.mjs` |

---

## File Structure

```
JanVayu/
├── index.html                    # SPA shell (plus styles.css, app.js, games.js, panels/)
├── favicon.svg
├── package.json                  # Node.js deps (Netlify Blobs, Resend, web-push)
├── netlify.toml                  # Build & deploy config
├── CNAME                         # Custom domain
├── docs/                         # This documentation (Docsify)
├── downloads/                    # Downloadable reports (PDF, PPTX, DOCX)
└── netlify/
    └── functions/
        ├── scheduled-fetch.mjs   # Cron: all feeds, every 4h
        ├── daily-digest.mjs      # Cron: email digest, 8am IST
        ├── reddit-feed.js        # API: cached Reddit posts
        ├── twitter-feed.js       # API: retired — read Nitter, whose public instances are gone
        ├── news-proxy.js         # API: cached news articles
        ├── instagram-feed.js     # API: cached Instagram posts
        ├── feed-status.js        # API: feed freshness health check
        ├── subscribe.js          # API: email subscription management
        ├── blob-store.js         # Shared: Blobs store helper
        ├── air-query.mjs         # AI: natural language AQI queries
        ├── health-advisory.mjs   # AI: personalised health advice
        ├── accountability-brief.mjs  # AI: ward-level accountability briefs
        └── anomaly-check.mjs     # AI: PM2.5 spike detection
```

This list is not exhaustive: `netlify/functions/` holds 29 function files plus shared `lib/` (for example `waqi-proxy`, `rankings`, `data-api`, `push-send`, `fire-tracker`, `terra-collab` and `zotero-library`).
