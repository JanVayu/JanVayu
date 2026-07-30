# JanVayu जनवायु

**A Citizen-Led National Archive of India's Air Quality Crisis**

[![Netlify Status](https://api.netlify.com/api/v1/badges/85a162b6-dd49-45e3-8605-6cc4c815cab8/deploy-status)](https://www.janvayu.in)
[![Website](https://img.shields.io/badge/Website-janvayu.in-7C3AED)](https://www.janvayu.in)
[![License: MIT](https://img.shields.io/badge/Code-MIT-green.svg)](LICENSE)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/Content-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![GitHub Issues](https://img.shields.io/github/issues/JanVayu/JanVayu)](https://github.com/JanVayu/JanVayu/issues)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/JanVayu/JanVayu)](https://github.com/JanVayu/JanVayu/commits/main)
[![Zotero Library](https://img.shields.io/badge/Zotero-Research%20Library-CC2936)](https://www.zotero.org/groups/6508140/janvayu/library)

---

## About

**JanVayu** (जनवायु — "People's Air") is a non-partisan, citizen-led initiative to build India's first comprehensive public archive documenting the air quality crisis — its data, its victims, its policies, and its public memory.

This is not a campaign. It is a record.

**Live at [https://www.janvayu.in](https://www.janvayu.in)**

---

## ✨ Recent highlights (July 2026)

- 🎨 **Hand-drawn diagrams throughout** — the "How JanVayu works" system diagram, "How the AQI number is built", "PM2.5 through the body", "How dirty air drains the economy", and blog heroes, all in a native Excalidraw-style (`rough.js` + Kalam) engine with desktop + mobile variants.
- 🖼️ **"The air, in pictures"** photo gallery — 24 openly-licensed documentary photographs (Wikimedia Commons), reachable from *Learn → Photo Gallery*.
- 🔎 **Site-wide fact-check + a weekly automated fact-check routine** — every statistic and calculator constant is web-verified against current primary sources (Lancet Countdown, IQAir, AQLI, State of Global Air, WHO, CPCB, CREA, NASA); see [`docs/fact-check-2026-07.md`](docs/fact-check-2026-07.md). A scheduled job re-runs this weekly and opens a PR for review.
- 📱 **Installable PWA + Web Push** — add JanVayu (and the standalone *Ask JanVayu* assistant) to your home screen; opt in to threshold alerts delivered even when the site is closed.
- 🧭 **Conference-ready visual refresh** — self-hosted Fraunces headline type, labelled section headers, a decluttered dashboard, and version-stamped assets so every deploy appears on the first refresh.

---

## Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Role-Based Landing Page** | Personalized entry point for 12 audience roles: parent, student, researcher, policymaker, journalist, citizen, activist, doctor, teacher, NGO, business owner, and woman/caregiver |
| 2 | **Simple Language Mode** | Site-wide plain language toggle in the header that switches all content to simple language (persisted via sessionStorage) |
| 3 | **Glossary (Ctrl+K)** | Searchable glossary overlay for air quality terms, accessible via Ctrl+K keyboard shortcut |
| 4 | **Intro Tour** | Guided walkthrough for first-time visitors highlighting key sections and features |
| 5 | **Real-Time AQI Dashboard** | Live air quality across 115+ Indian cities via WAQI/CPCB — the core ~33 auto-refresh every 10 minutes, the rest are fetched on demand when selected |
| 6 | **Interactive AQI Map** | Leaflet.js-powered map with station-level AQI markers across India, plus toggleable accountability and source layers from [indianopenmaps.com](https://indianopenmaps.com): live-AQI choropleths by **Lok Sabha constituency** ("the air your MP answers for") and **district**, **assembly-constituency** boundaries (vector tiles), and a **pollution-sources** overlay — landfills, dumpsites, coal mines, CPCB red/orange-category industrial parks, SEZs |
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
| 19 | **Blog** | Updates, data analysis, and reflections on India's air quality crisis at [janvayu.in/blog](https://www.janvayu.in/blog) |
| 20 | **Zotero Bibliography** | Public bibliography of air quality research papers at [zotero.org/groups/janvayu](https://www.zotero.org/groups/6508140/janvayu/library) |
| 21 | **Ask JanVayu PWA** | Installable standalone AI chat app for air quality Q&A at [janvayu.in/ask](https://www.janvayu.in/ask) — 33 cities, 10 languages, thumbs up/down feedback, works on Android, iOS, desktop |
| 22 | **Learning Games** | Seven self-paced educational games at [janvayu.in/#games](https://www.janvayu.in/#games) — India-context Air Quality Jeopardy (5×5 board, ₹1k–₹5k tiles), 10-question PM Quick-Quiz, 7-source matcher, Clean Air Snakes & Ladders inspired by Moksha Patam, Jodi Match memory cards, Air Tambola (Indian housie), and **Vayu Junction** — an *Only Connect* / NYT-*Connections* / *Torchlight*-inspired word-grouping puzzle with four India-AQ puzzle sets |
| 23 | **Women's Health** | Gender-specific air pollution analysis — indoor cooking exposure, maternal health, occupational risks, gender data gap. "Woman / Caregiver" role |
| 24 | **Historical Map Overlay** | Time-slider on the live map showing monthly PM2.5 data from Jan 2024 to present, color-coded by pollution level |
| 25 | **Auto-Update Infrastructure** | Version sync, sitemap auto-gen, feed health monitoring, translation key sync, data-stat system, reference data API, Zotero integration |
| 26 | **Understanding AQI** | Interactive breakdown of 6 criteria pollutants, CPCB vs US EPA AQI scale comparison, "Why PM2.5 isn't the whole story" |
| 27 | **Shareable AQI Cards** | Canvas-based PNG generator (Instagram/WhatsApp sizes), color-coded by severity, Web Share API on mobile |
| 28 | **Exposure Diary** | Log 16 daily activities with PM2.5 multipliers, get weighted exposure, cigarette equivalence, life-expectancy impact |
| 29 | **Migration Comparison** | Side-by-side city comparison with live AQI, source apportionment charts, life-years gained verdict |
| 30 | **Data Source Selector** | Educational panel on CPCB/WAQI/IQAir/Sensor.Community with Source Impact Simulator |
| 31 | **City Policy Tracker** | 8-city NCAP target dashboard with expenditure tables, government action timeline, public feedback |
| 32 | **Ward-Level Atlas** | "How Polluted Is Your Ward?" — Leaflet choropleth of every municipal ward across **39 Indian cities** (15 hand-collected + 24 extracted from Swachh Bharat Mission ward boundaries via indianopenmaps.com, `scripts/fetch-openmaps.mjs`), with a four-layer toggle: live PM2.5 (interpolated), heat (Landsat surface temperature), green cover and built-up (ESA WorldCover, 14 cities). "Who breathes it" overlays stream schools (UDISE/NCOG) and health centres (Bharatmaps) as vector tiles. Per-layer legend, tooltips and live stats; surfaces the urban heat-island link from each city's own data |
| 33 | **Citizen Testimony** | A multilingual wall of 100+ on-the-ground, first-person testimonies on how bad the air is, across 86 cities — in Hindi, English and 11 other Indian languages (Bengali, Tamil, Marathi, Telugu, Kannada, Gujarati, Punjabi, Malayalam, Odia, Urdu, Assamese), each with an English translation. Language-filter chips, free-text search, RTL rendering for Urdu, and a submission CTA to add your testimony via contribute@janvayu.in |
| 34 | **Live 5-Day Forecast** | Independent PM2.5 forecast (Open-Meteo / CAMS, key-less) in the Forecast panel — daily mean + peak, band-coloured summary, trend chart, 33-city selector — shown alongside SAFAR/CPCB reliability tracking. Ask JanVayu answers "will it be bad tomorrow?" |
| 35 | **Farm Fire Tracker** | Live stubble-burning / farm-fire map (NASA FIRMS, VIIRS/NOAA-20) across the Punjab–Haryana–NCR belt, with region + time-window toggles and honest seasonal framing (peak mid-Oct to late-Nov) |
| 36 | **Beyond the Lungs** | PM2.5's whole-body toll — kidneys (2026 Chennai–Delhi eGFR cohort), cardiovascular, brain, metabolism, pregnancy — arguing for health-complete alerts |
| 37 | **Occupational Exposure** | Exposure-equity by occupation: street vendors, traffic police, gig riders, construction and waste workers, anchored on a 2026 Chennai street-vendor study |
| 38 | **Open Data API** | Versioned, CORS-open public data API at [janvayu.in/api](https://www.janvayu.in/api) — JSON manifest of every dataset + CSV export of rankings; free to use with attribution (CC BY-NC-SA 4.0) |
| 39 | **Hand-drawn Diagrams** | A native Excalidraw-style (`rough.js` + self-hosted Kalam) engine renders the system diagram, "How the AQI number is built", "PM2.5 through the body", "How dirty air drains the economy", and blog heroes — each with a wide desktop and a portrait mobile variant. Sources in `assets/diagrams/` |
| 40 | **Photo Gallery** | "The air, in pictures" — 24 openly-licensed (CC / public-domain) documentary photographs from Wikimedia Commons in a masonry grid + full-screen lightbox with per-image credit and source |
| 41 | **Web Push Alerts** | Installable PWA with real server-sent threshold alerts (VAPID/Web Push), delivered even when the site is closed |
| 42 | **Automated Fact-Check** | A weekly scheduled routine web-verifies every statistic + calculator constant against current primary sources and opens a review PR; findings archived in `docs/fact-check-*.md` |

---

## Key Statistics (July 2026)

| Metric | Value | Source |
|--------|-------|--------|
| Annual PM2.5 Deaths | 1.72 million | Lancet Countdown 2025 |
| Economic Cost | $339.4 billion (9.5% GDP) | Lancet Countdown 2025 |
| India's Global Share | World's largest national PM2.5 death toll (~a quarter of the global total) | Lancet Countdown 2025 |
| Most Polluted Capital | New Delhi (82.2 µg/m³, 8th straight year worst) | IQAir 2025 |
| Most Polluted City | Loni, India (112.5 µg/m³) | IQAir 2025 |
| Cities Meeting WHO Guideline | Only 14% globally | IQAir 2025 |
| India Average PM2.5 | 48.9 µg/m³ (~10× WHO limit) | IQAir 2025 |
| Life Expectancy Loss (India) | 3.5 years | AQLI 2025 |

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
|------|-----------|----------|
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
├── blog/                               # Blog (Docsify-powered, Markdown posts)
│   ├── index.html                      # Docsify blog config
│   ├── _sidebar.md                     # Blog navigation
│   ├── README.md                       # Blog home page
│   └── posts/                          # Blog posts (YYYY-MM-DD-slug.md)
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
|-------|-----------|--------|
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
| `GROQ_API_KEY` | Yes | Groq API key for AI features — runs the `openai/gpt-oss-120b` open model (free at [console.groq.com](https://console.groq.com)). Optional `GROQ_MODEL` overrides the model without a code change. |

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
git clone https://github.com/JanVayu/JanVayu.git
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
| [OpenAQ](https://openaq.org) | Hyperlocal CPCB + community stations (My Neighbourhood) | Free API key |
| [Open-Meteo](https://open-meteo.com/) | 5-day PM2.5 forecast (CAMS) — Forecast panel | Free, key-less |
| [IHME GBD](https://vizhub.healthdata.org/gbd-results/) | Health burden | Free |
| [Lancet Countdown](https://lancetcountdown.org) | Annual health reports | Open Access |
| [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/) | Active-fire detection — Farm Fire Tracker (VIIRS/NOAA-20) | Free API key |
| [Indian Kanoon](https://indiankanoon.org/) | Legal/court orders | Free |
| [PRANA Portal](https://prana.cpcb.gov.in/) | NCAP tracking | Free |
| [IQAir](https://iqair.com) | World Air Quality Report | Free |
| [ESA WorldCover](https://esa-worldcover.org/) | 10 m land cover (green / built-up) | Open (CC BY) |
| [USGS/NASA Landsat](https://www.usgs.gov/landsat-missions) | Land-surface temperature | Free (via [Planetary Computer](https://planetarycomputer.microsoft.com/)) |
| [DataMeet](https://github.com/datameet/Municipal_Spatial_Data) | Municipal ward boundaries | Open (CC BY) |

---

## Roadmap

Full phased roadmap: **[docs/wiki/Roadmap.md](docs/wiki/Roadmap.md)** · tracked on [GitHub Issues](https://github.com/JanVayu/JanVayu/issues).

**Recently shipped (v26.6.71):** the **5-language switcher works again** (a crash had silently disabled Hindi/Tamil/Marathi/Bengali across the UI), a **WCAG 2.1 AA accessibility sweep** (axe-verified form labels, prose-link underlines, chart alt-text, theme-aware badge contrast), **live rankings expanded 27 → 88 cities**, and a **42%-lighter first load** (`index.html` ~1.59 MB → ~0.92 MB by lazy-loading 12 heavy panels). Earlier in July: 5-day forecast, farm-fire tracker, OpenAQ hyperlocal data, and a CORS-open Open Data API.

**Next up:**

- **More cities** — now 14 (added Kanpur, Varanasi, Bhopal, Faridabad); extending further as open ward boundaries are sourced (Agra, Lucknow, Patna still lack open files).
- **Time-aware heat** — seasonal-median land-surface temperature to reduce single-day noise.
- Platform-wide: 100+ CPCB cities, full WCAG 2.1 AA, AQI forecast horizon, push notifications.

> Two earlier roadmap ideas were dropped as not feasible on open data: satellite-derived per-ward PM2.5 (no openly-fetchable ~1 km PM2.5 raster) and a Surat ward map (no open boundary file) — Chandigarh was added as the 10th city instead.

---

## Contributing

We welcome contributions from:

* **Researchers** — datasets, papers, analysis
* **Journalists** — investigations, verified reports
* **Developers** — code, visualizations, tools
* **Citizens** — testimonies, local documentation, translations
* **Designers** — accessibility, communication

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines and the [Collaborator Statement of Work](docs/contributing/collaborators.md) for detailed workstream descriptions.

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

## Forking & Reuse

JanVayu is designed to be forked for other cities, regions, or countries. Total cost to run a fork: **$0/month** on free tiers (WAQI, Groq, Resend, Netlify).

See **[FORKING.md](FORKING.md)** for a complete guide — what to change, API keys needed, and attribution requirements.

If you create a fork, let us know — we'll list it in the README.

---

## License

* **Code:** MIT License — use freely, modify, redistribute
* **Content/Documentation:** CC BY-NC-SA 4.0 — share with attribution, non-commercial, same license
* **Data:** Individual sources retain original licenses

See [LICENSE](LICENSE) for details. If you fork this project, please credit JanVayu as the upstream source.

---

## Contact

* **Email:** [contribute@janvayu.in](mailto:contribute@janvayu.in)
* **Website:** [https://www.janvayu.in](https://www.janvayu.in)
* **GitHub:** [github.com/JanVayu/JanVayu](https://github.com/JanVayu/JanVayu)

---

## Support

JanVayu is a public interest project. If you wish to support:

* **Contribute data or expertise** — see Contributing above
* **Report issues** — [Open an issue](https://github.com/JanVayu/JanVayu/issues)
* **Spread awareness** — Share the website

---

*JanVayu is built on the principle that public memory is a prerequisite for public accountability.*

**जनवायु — क्योंकि हवा सबकी है।**
