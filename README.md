# JanVayu जनवायु

**A Citizen-Led National Archive of India's Air Quality Crisis**

[![Netlify Status](https://api.netlify.com/api/v1/badges/85a162b6-dd49-45e3-8605-6cc4c815cab8/deploy-status)](https://www.janvayu.in)
[![Website](https://img.shields.io/badge/Website-janvayu.in-7C3AED)](https://www.janvayu.in)
[![License: MIT](https://img.shields.io/badge/Code-MIT-green.svg)](LICENSE)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/Content-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![GitHub Issues](https://img.shields.io/github/issues/Varnasr/JanVayu)](https://github.com/Varnasr/JanVayu/issues)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Varnasr/JanVayu)](https://github.com/Varnasr/JanVayu/commits/main)

---

## About

**JanVayu** (जनवायु — "People's Air") is a non-partisan, citizen-led initiative to build India's first comprehensive public archive documenting the air quality crisis — its data, its victims, its policies, and its public memory.

This is not a campaign. It is a record.

**Live at [https://www.janvayu.in](https://www.janvayu.in)**

---

## Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Role-Based Landing Page** | Personalized entry point for 10 audience roles: parent, student, researcher, policymaker, journalist, activist, doctor, teacher, NGO, and business owner |
| 2 | **Simple Language Mode** | Site-wide plain language toggle in the header that switches all content to simple language (persisted via sessionStorage) |
| 3 | **Glossary (Ctrl+K)** | Searchable glossary overlay for air quality terms, accessible via Ctrl+K keyboard shortcut |
| 4 | **Intro Tour** | Guided walkthrough for first-time visitors highlighting key sections and features |
| 5 | **Real-Time AQI Dashboard** | Live air quality data from 16+ Indian cities via WAQI/CPCB, auto-refreshing every 10 minutes |
| 6 | **Interactive AQI Map** | Leaflet.js-powered map with station-level AQI markers across India |
| 7 | **Health Impact Research** | Curated evidence from Lancet Countdown 2025, Harvard, Karolinska, and IHME studies |
| 8 | **Economic Cost Tracker** | Quantified GDP and productivity losses ($339.4B / 9.5% GDP) |
| 9 | **Policy Tracker** | NCAP progress, GRAP stage history, Supreme Court and NGT orders |
| 10 | **Citizen Voices Archive** | Social media posts, testimonies, viral content from affected communities |
| 11 | **Accountability Tracker** | Institutional and official responses to pollution episodes |
| 12 | **Social Media Feeds** | Aggregated Reddit, Twitter/X, Instagram, and news coverage on air quality |
| 13 | **Daily Email Digest** | Subscribers receive a daily AQI summary for their city at 8:00 AM IST |
| 14 | **AQI Calculator** | Interactive tool for citizens to understand AQI breakpoints and health advice |
| 15 | **RTI Templates** | Ready-to-use Right to Information templates for pollution accountability |
| 16 | **Action Guides** | Practical guides for citizen action, mask selection, and indoor air quality |
| 17 | **Downloadable Reports** | Curated research papers and datasets for offline reference |
| 18 | **Cultural Archive** | Satire, memes, art, and cultural responses to the pollution crisis |

---

## Key Statistics (March 2026)

| Metric | Value | Source |
|--------|-------|--------|
| Annual PM2.5 Deaths | 1.72 million | Lancet Countdown 2025 |
| Economic Cost | $339.4 billion (9.5% GDP) | Lancet Countdown 2025 |
| India's Global Share | 70% of pollution deaths | Lancet Countdown 2025 |
| Most Polluted Capital | New Delhi (91.6 µg/m³) | IQAir 2024 |
| Most Polluted City | Byrnihat (128.2 µg/m³) | IQAir 2024 |

---

## Architecture

JanVayu is designed as a lightweight, zero-framework architecture with server-side feed aggregation:

```
┌─────────────────────────────────────────────────────────┐
│                     Client (Browser)                    │
│  Single-page HTML app · Chart.js · Leaflet.js · WAQI   │
└──────────────────────────┬──────────────────────────────┘
                           │
              HTTPS (Netlify CDN)
                           │
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
│           │              └─────────────┬─────────────┘   │
│           │                            │                  │
│           ▼                            ▼                  │
│  ┌─────────────────────────────────────────────┐         │
│  │           Netlify Blobs (Cache)              │         │
│  │  Feeds cached as JSON · Strong consistency   │         │
│  └─────────────────────────────────────────────┘         │
│                                                          │
│  ┌─────────────────────────────────────────────┐         │
│  │         Resend (Email Delivery)              │         │
│  │  Daily AQI digest to subscribers             │         │
│  └─────────────────────────────────────────────┘         │
└──────────────────────────────────────────────────────────┘
```

**Key design decisions:**

- **Single HTML file** — the entire front-end is one `index.html` with inline CSS and JS. No build step, no bundler, no framework.
- **Server-side proxying** — social media and news APIs are fetched via Netlify Functions to avoid CORS issues and protect API keys.
- **Blob caching** — the scheduled function pre-fetches all feeds every 4 hours and writes results to Netlify Blobs. On-demand API functions read from the blob cache, resulting in instant responses.
- **Client-side AQI** — the WAQI API is called directly from the browser every 10 minutes (the token is a free-tier public key).
- **Email digests** — a scheduled function runs daily at 8:00 AM IST (2:30 AM UTC), reads subscribers from Blobs, fetches current AQI, and sends personalized HTML emails via Resend.

---

## Auto-Updating Schedule

| Task | Frequency | Mechanism |
|------|-----------|-----------|
| Social/news feed refresh | Every 4 hours | `scheduled-fetch.mjs` (Netlify Scheduled Function) |
| Daily AQI email digest | Daily at 8:00 AM IST | `daily-digest.mjs` (Netlify Scheduled Function) |
| Live AQI dashboard refresh | Every 10 minutes | Client-side JavaScript (WAQI API) |

---

## Project Structure

```
JanVayu/
├── index.html                          # Main website (single-page application)
├── favicon.svg                         # Site favicon
├── package.json                        # Node.js dependencies (Netlify Blobs, Resend)
├── netlify.toml                        # Netlify build & deploy configuration
├── .gitignore                          # Ignored files (node_modules/, .netlify/)
├── CNAME                               # Custom domain configuration
├── README.md                           # This file
├── CONTRIBUTING.md                     # Contribution guidelines
├── CODE_OF_CONDUCT.md                  # Community standards
├── LICENSE                             # MIT (code) + CC BY-NC-SA 4.0 (content)
├── downloads/                          # Downloadable reports and datasets
├── netlify/
│   └── functions/                      # Netlify serverless functions
│       ├── scheduled-fetch.mjs         # Cron: fetches all feeds every 4 hours
│       ├── daily-digest.mjs            # Cron: sends daily AQI email digest
│       ├── reddit-feed.js              # API: serves cached Reddit posts
│       ├── twitter-feed.js             # API: serves cached Twitter/X posts
│       ├── news-proxy.js               # API: serves cached news articles
│       ├── instagram-feed.js           # API: serves cached Instagram posts
│       ├── feed-status.js              # API: reports feed freshness and health
│       ├── subscribe.js                # API: manages email subscriptions
│       └── blob-store.js              # Shared: Netlify Blobs store helper
└── node_modules/                       # Dependencies (git-ignored)
```

---

## Technical Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Vanilla HTML / CSS / JavaScript | Zero-dependency single-page application |
| Charts | Chart.js | AQI trends and health data visualizations |
| Maps | Leaflet.js + OpenStreetMap | Interactive AQI station maps |
| AQI Data | WAQI API | Real-time air quality from 500+ stations |
| Serverless | Netlify Functions | Server-side API proxying and scheduled tasks |
| Caching | Netlify Blobs | Persistent JSON cache with strong consistency |
| Email | Resend | Transactional email delivery for daily digests |
| Hosting | Netlify (auto-deploy from GitHub) | CDN, edge functions, scheduled functions |
| Domain | janvayu.in | Custom domain via Netlify DNS |

---

## Environment Variables

The following environment variables must be configured in the Netlify dashboard for full functionality:

| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | Yes | API key from [Resend](https://resend.com) for sending email digests |
| `RESEND_FROM` | Yes | Verified sender email address (e.g., `digest@janvayu.in`) |
| `BLOB_TOKEN` | Yes | Netlify personal access token for Blob store access |
| `NETLIFY_SITE_ID` | Yes | Netlify site identifier (used by Blob store and scheduled functions) |
| `GROQ_API_KEY` | Yes | Groq API key for AI features — runs Llama 3.3 70B open-source LLM (free at [console.groq.com](https://console.groq.com)) |

> **Note:** The WAQI API token (`1f64cc8563a165dc5a6ce48f7eeb9ba0221b63f3`) is a free-tier public key embedded in the client-side code. It is rate-limited by WAQI and does not require server-side protection.

---

## Self-Hosting / Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (`npm install -g netlify-cli`)
- A [Resend](https://resend.com) account (for email digest functionality)

### Setup

```bash
# Clone the repository
git clone https://github.com/Varnasr/JanVayu.git
cd JanVayu

# Install dependencies
npm install

# Set environment variables (create a .env file or configure in Netlify CLI)
export RESEND_API_KEY="your_resend_api_key"
export RESEND_FROM="your_verified_sender@example.com"
export BLOB_TOKEN="your_netlify_personal_access_token"
export NETLIFY_SITE_ID="your_netlify_site_id"

# Start local development server with Netlify Functions support
netlify dev
```

The site will be available at `http://localhost:8888`. Netlify Dev emulates the serverless functions locally so you can test the full stack.

### Without Netlify Functions

If you only need the front-end (no social feeds or email digests):

```bash
# Serve index.html with any static file server
npx serve .
# or
python3 -m http.server 8000
```

The AQI dashboard will work without any server-side setup since it calls the WAQI API directly from the browser.

---

## Data Sources

JanVayu integrates **160+ verified public data sources**, including:

| Source | Type | Access |
|--------|------|--------|
| [WAQI](https://waqi.info) | Real-time AQI | Free API |
| [CPCB CAAQMS](https://app.cpcbccr.com/ccr/) | Official AQI | Free |
| [IHME GBD](https://vizhub.healthdata.org/gbd-results/) | Health burden | Free |
| [Lancet Countdown](https://lancetcountdown.org) | Annual health reports | Open Access |
| [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/) | Fire detection | Free |
| [Indian Kanoon](https://indiankanoon.org/) | Legal/court orders | Free |
| [PRANA Portal](https://prana.cpcb.gov.in/) | NCAP tracking | Free |
| [IQAir](https://iqair.com) | World Air Quality Report | Free |

---

## Contributing

We welcome contributions from:

* **Researchers** — datasets, papers, analysis
* **Journalists** — investigations, verified reports
* **Developers** — code, visualizations, tools
* **Citizens** — testimonies, local documentation, translations
* **Designers** — accessibility, communication

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## Governance

JanVayu is a **non-partisan initiative**. It is not affiliated with any political party, government body, or corporate entity.

Editorial decisions are guided by:

* Factual accuracy and verification
* Source transparency
* Respect for affected communities
* Accessibility across languages and regions

---

## Name Change Note

This project was previously known as "Vayu Smriti" (वायु स्मृति). Following community feedback and a vote, it was renamed to **JanVayu** (जनवायु) in January 2026 for better linguistic inclusivity across India's diverse language communities.

---

## License

* **Code:** MIT License
* **Content/Documentation:** CC BY-NC-SA 4.0
* **Data:** Individual sources retain original licenses

See [LICENSE](LICENSE) for details.

---

## Contact

* **Email:** [contribute@janvayu.in](mailto:contribute@janvayu.in)
* **Website:** [https://www.janvayu.in](https://www.janvayu.in)
* **GitHub:** [github.com/Varnasr/JanVayu](https://github.com/Varnasr/JanVayu)

---

## Support

JanVayu is a public interest project. If you wish to support:

* **Contribute data or expertise** — see Contributing above
* **Report issues** — [Open an issue](https://github.com/Varnasr/JanVayu/issues)
* **Spread awareness** — Share the website

---

*JanVayu is built on the principle that public memory is a prerequisite for public accountability.*

**जनवायु — क्योंकि हवा सबकी है।**
