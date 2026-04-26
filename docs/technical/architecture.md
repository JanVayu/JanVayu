# Architecture

JanVayu is a **zero-framework, single-page application** deployed on Netlify with server-side serverless functions for data proxying, caching, and scheduled tasks.

---

## System Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Client (Browser)                    │
│  Single HTML file · Chart.js · Leaflet.js · WAQI API   │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTPS (Netlify CDN)
┌──────────────────────────▼──────────────────────────────┐
│                   Netlify Functions                      │
│                                                          │
│  Scheduled (cron)              On-demand (API)           │
│  ┌──────────────────┐   ┌───────────────────────────┐   │
│  │ scheduled-fetch   │   │ reddit-feed.js            │   │
│  │ (every 4 hours)   │   │ twitter-feed.js           │   │
│  │                   │   │ news-proxy.js             │   │
│  │ daily-digest      │   │ instagram-feed.js         │   │
│  │ (8 AM IST daily)  │   │ feed-status.js            │   │
│  └────────┬──────────┘   │ subscribe.js              │   │
│           │              │ air-query.mjs             │   │
│           │              │ health-advisory.mjs       │   │
│           │              │ accountability-brief.mjs  │   │
│           │              │ anomaly-check.mjs         │   │
│           ▼              └─────────────┬─────────────┘   │
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
  (Real-time AQI)    (AI features)  (Reddit, News, X)
```

---

## Key Design Decisions

### Single HTML File
The entire front-end lives in `index.html` — inline CSS and JavaScript, no build step, no bundler, no framework. This makes the codebase accessible to contributors with basic HTML/JS skills and ensures zero build-time complexity.

### Server-Side Proxying
Social media and news APIs are fetched via Netlify Functions to avoid CORS issues and protect API keys. The client never touches these APIs directly.

### Blob Caching
The `scheduled-fetch.mjs` function runs every 4 hours and writes all feed data (Reddit, Twitter/X, news, Instagram) to Netlify Blobs. When users request feeds, the on-demand functions serve instantly from the cache — eliminating latency and API rate limits.

### Client-Side AQI
The WAQI API is called directly from the browser every 10 minutes. The token is a free-tier public key. This means real-time AQI data works without any server-side infrastructure.

### No Framework, No Build Step
There is no `npm run build`, no Webpack, no React. The deploy artefact is the repository itself. Netlify serves `index.html` from the root.

---

## Auto-Update Schedule

| Task | Frequency | Function |
|------|-----------|----------|
| Social/news feed refresh | Every 4 hours | `scheduled-fetch.mjs` |
| Daily AQI email digest | 8:00 AM IST daily | `daily-digest.mjs` |
| Live AQI dashboard | Every 10 minutes | Client-side JS (WAQI API) |
| Anomaly detection | On-demand | `anomaly-check.mjs` |

---

## File Structure

```
JanVayu/
├── index.html                    # Entire front-end (SPA)
├── favicon.svg
├── package.json                  # Node.js deps (Netlify Blobs, Resend)
├── netlify.toml                  # Build & deploy config
├── CNAME                         # Custom domain
├── docs/                         # This documentation (Docsify)
├── downloads/                    # Downloadable reports (PDF, PPTX, DOCX)
└── netlify/
    └── functions/
        ├── scheduled-fetch.mjs   # Cron: all feeds, every 4h
        ├── daily-digest.mjs      # Cron: email digest, 8am IST
        ├── reddit-feed.js        # API: cached Reddit posts
        ├── twitter-feed.js       # API: cached Twitter/X posts
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
