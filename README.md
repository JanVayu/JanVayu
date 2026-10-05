# JanVayu जनवायु

**A citizen-led national archive of India's air quality crisis**

[![Netlify Status](https://api.netlify.com/api/v1/badges/85a162b6-dd49-45e3-8605-6cc4c815cab8/deploy-status)](https://www.janvayu.in)
[![Website](https://img.shields.io/badge/Website-janvayu.in-7C3AED)](https://www.janvayu.in)
[![License: MIT](https://img.shields.io/badge/Code-MIT-green.svg)](LICENSE)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/Content-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![GitHub Issues](https://img.shields.io/github/issues/JanVayu/JanVayu)](https://github.com/JanVayu/JanVayu/issues)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/JanVayu/JanVayu)](https://github.com/JanVayu/JanVayu/commits/main)
[![Zotero Library](https://img.shields.io/badge/Zotero-Research%20Library-CC2936)](https://www.zotero.org/groups/6508140/janvayu/library)

---

## About

**JanVayu** (जनवायु, "People's Air") is a non-partisan, citizen-led initiative to build India's first comprehensive public archive of the air quality crisis: its data, its victims, its policies and its public memory.

It keeps a record and runs no campaign.

**Live at [https://www.janvayu.in](https://www.janvayu.in)**

---

## Recent highlights (September 2026)

Forty-three years of PM2.5 are now on the site for 783 of 785 districts. The figures are annual and seasonal (four seasons), run from 1980 to 2022, and come from [LongPMInd](https://doi.org/10.5194/essd-16-3565-2024) (Wang et al., *Earth System Science Data*, 2024; CC BY 4.0). The airshed panel charts them. New Delhi stays flat near 55 µg/m³ through the 1990s, climbs from 1999 and levels off near 90. In winter it rises from about 65 in the 1980s to about 138 in 2013–2022. These decade means match the ones in Hawa Ka Hisab's "Destruction of Delhi" report (51 for the 1980s, 87 for the 2010s), but that report is built on the same LongPMInd data, so the match is a consistency check and not independent confirmation. The series is a reconstruction. It should not be subtracted from the roughly 1 km 2024 satellite layer to show change.

A new panel, "Your airshed, or your town?", asks where a district's air comes from. Across districts, 89.2% of the variance in annual PM2.5 lies between states, and the remainder lies within them. NCAP sets targets city by city. If most of a city's burden arrives from its airshed, a city acting alone can only reach what is left. Pick a district and the panel shows the split. It says plainly that the local gap names no cause.

Two global land-pressure maps, Biodiversity Intactness and Human Footprint (Impact Observatory / Vizzuality), were tested and left out. Across districts they correlate with PM2.5 at −0.61 and +0.62, better than anything else on the site. Once differences between states are held fixed, the added explanatory power (incremental R²) falls to +0.007 and +0.008. At 100 m resolution they mostly show where the Gangetic Plain is. [The write-up](blog/posts/2026-09-05-a-map-of-the-gangetic-plain.md) also describes the join error that nearly led to the wrong table being published.

The monthly update of the current-year air layer had never run. The layer says it is rebuilt on the 3rd of each month, but its first scheduled run failed because a folder it needed to write to did not exist. That is fixed, and the fix was tested with the workflow's own command.

## Earlier highlights (August 2026)

The map's air figures are the 2024 satellite annual mean, because SatPM2.5 V6GL03 has published nothing newer. A second layer, at district level, now answers the question everyone asks about this year so far. It uses CAMS estimates via Open-Meteo, corrected against the satellite series for 2024 (r = 0.91, held-out RMSE 5.76 µg/m³ over 200 splits), and is rebuilt on the 3rd of each month. It is never merged with the annual layer, never drawn below district level and never called a measurement.

The site now leads with PM2.5 and not AQI, after a fair criticism at a conference. AQI is a unitless index that reports only its worst pollutant and cannot be averaged over a year. Every Indian limit, health study and NCAP target is written in µg/m³ of PM2.5. The reasoning is in [Why we lead with PM2.5, not AQI](blog/posts/2026-08-09-why-pm25-not-aqi.md).

Field Testimony grew from 142 to 250 voices, across 107 cities and 14 languages. Field-collected quotes carry their collection date and mode. Every speaker consented and is named as they asked, and code-mixed speech is marked as spoken. The wall is shuffled daily, so no voice stays at the bottom.

The social feeds now say what they can and cannot do. Reddit works again through its public Atom feed, after its JSON interface began refusing requests from data-centre addresses. YouTube is read through channel feeds, and searched when a free Data API key is set. X and Instagram are links out, because neither can be read without a paid or authenticated API. Every X link is checked against X's public embed endpoint before it goes live.

Three things on the site now check themselves. Every stated figure is recomputed from the data, and a mismatch stops a release; this caught a photo count and a ward count that had each been five releases out of date. The homepage blog list is generated from the blog itself. The current-year layer rebuilds monthly.

Two new posts: [How to read the JanVayu map](blog/posts/2026-08-09-how-to-read-the-map.md), a plain reader's manual, and [What the air looks like](blog/posts/2026-08-09-what-the-air-looks-like.md), on why a data site carries 31 photographs of something 2.5 µm across.

---

## Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | **The first screen** | Asks what you are breathing. You enter a city, ward or village, or let it read the nearest station, and it replies with an instruction instead of a number. The headline is the verdict, with the reading, the CPCB band, and the same answer for a child, for asthma or COPD, and for going running. Bands follow the CPCB National AQI PM2.5 24-hour sub-index thresholds (30/60/90/120/250 µg/m³) |
| 2 | **Ask JanVayu on the homepage** | A question box under the first screen, with nine worked examples, in 10 Indian languages. Answers appear in place with their source named, and default to the place you just searched. `/ask/` keeps conversation history and offers the installable app |
| 3 | **Role-based views** | An optional view for 12 audience roles: parent, student, researcher, policymaker, journalist, citizen, activist, doctor, teacher, NGO, business owner, and woman/caregiver. It is offered from the header switcher and never stands in front of the homepage |
| 4 | **Simple language mode** | A toggle in the header that switches the whole site to simple language. The choice lasts for the browser session |
| 5 | **Glossary (Ctrl+K)** | A searchable glossary of air quality terms, opened with Ctrl+K |
| 6 | **Intro tour** | A guided walkthrough of the main sections for first-time visitors |
| 7 | **Real-time AQI dashboard** | Live PM2.5 and AQI for 157 Indian cities from WAQI and CPCB, with Beijing, London and Singapore alongside for comparison. 33 cities refresh every 10 minutes, and the rest are fetched when you select them |
| 8 | **Interactive AQI map** | A map with station-level AQI markers across India. You can switch on layers from [indianopenmaps.com](https://indianopenmaps.com): live-AQI shading by Lok Sabha constituency ("the air your MP answers for") and by district, assembly-constituency boundaries, and a pollution-sources layer showing landfills, dumpsites, coal mines, CPCB red and orange category industrial parks, and SEZs |
| 9 | **Health impact research** | Curated evidence from Lancet Countdown 2025, Harvard and IHME studies |
| 10 | **Economic cost tracker** | Estimated losses in GDP and productivity ($339.4B / 9.5% GDP) |
| 11 | **Policy tracker** | NCAP progress, GRAP stage history, and Supreme Court and NGT orders |
| 12 | **Citizen voices archive** | Social media posts, testimonies and viral content from affected communities |
| 13 | **Accountability tracker** | How institutions and officials responded to pollution episodes |
| 14 | **Social media feeds** | Live posts from Reddit (public Atom feed), YouTube (channel feeds, plus search when a free Data API key is set) and Indian news. X and Instagram are links out, not feeds. Neither can be read without a paid or authenticated API, so the site links to live searches and named accounts, and each X link is checked against X's public embed endpoint before it goes live |
| 15 | **Daily email digest** | A daily AQI summary for your city, emailed at 8:00 AM IST |
| 16 | **AQI calculator** | A tool for working out AQI breakpoints and the health advice that goes with each |
| 17 | **RTI templates** | Ready-to-use Right to Information templates for asking about pollution |
| 18 | **Action guides** | Practical guides on citizen action, choosing a mask and indoor air quality |
| 19 | **Downloadable reports** | Research papers and datasets to keep for offline reference |
| 20 | **Cultural archive** | Satire, memes, art and other cultural responses to the pollution crisis |
| 21 | **Blog** | Updates, data analysis and reflections on India's air quality crisis at [janvayu.in/blog](https://www.janvayu.in/blog) |
| 22 | **Zotero bibliography** | A public bibliography of air quality research papers at [zotero.org/groups/janvayu](https://www.zotero.org/groups/6508140/janvayu/library) |
| 23 | **Ask JanVayu app** | The same assistant as an installable app at [janvayu.in/ask](https://www.janvayu.in/ask). It covers 33 cities and 10 languages, takes thumbs up or down feedback, and works on Android, iOS and desktop |
| 24 | **Learning games** | Seven self-paced educational games at [janvayu.in/#games](https://www.janvayu.in/#games): India-context Air Quality Jeopardy (5×5 board, ₹1k–₹5k tiles), a 10-question PM Quick-Quiz, a 7-source matcher, Clean Air Snakes & Ladders after Moksha Patam, Jodi Match memory cards, Air Tambola (Indian housie), and Vayu Junction, a word-grouping puzzle inspired by *Only Connect*, NYT *Connections* and *Torchlight*, with four sets of India air quality puzzles |
| 25 | **Women's health** | Gender-specific air pollution analysis: indoor cooking exposure, maternal health, occupational risks and the gender data gap. Linked to the "Woman / Caregiver" role |
| 26 | **Historical map overlay** | A time slider on the live map showing monthly PM2.5 from Jan 2024 to the present, coloured by pollution level |
| 27 | **Automatic updates** | The sitemap, site statistics, feed-health checks and translation keys are kept in step without manual work, and a reference data API and the Zotero library stay linked to the site |
| 28 | **Understanding AQI** | An interactive breakdown of up to 8 pollutants (PM2.5, PM10, NO2, SO2, CO, O3, NH3, Pb), a comparison of the CPCB and US EPA AQI scales, and an explanation of why PM2.5 is not the whole story |
| 29 | **Shareable AQI cards** | Makes a PNG card for Instagram or WhatsApp, coloured by severity, and shares it through the phone's share sheet |
| 30 | **Exposure diary** | Log 16 daily activities, each with an illustrative (not yet sourced) PM2.5 multiplier, and get a weighted exposure, a cigarette equivalence and a life-expectancy impact |
| 31 | **Migration comparison** | Compares two cities side by side with live AQI, source apportionment charts and a verdict in life-years gained |
| 32 | **Data source selector** | Explains how CPCB, WAQI, IQAir and Sensor.Community differ, with a Source Impact Simulator |
| 33 | **City policy tracker** | An 8-city NCAP target dashboard with expenditure tables, a timeline of government action and public feedback |
| 34 | **Ward-level atlas** | "How Polluted Is Your Ward?" A choropleth map of every municipal ward across **142 Indian cities**, so every state and UT capital is now mapped. Boundaries come from several sources: 15 collected by hand; 74 from the Swachh Bharat Mission via indianopenmaps.com; 45 from the ESRI India Living Atlas layer; 7 West Bengal cities from the state's AMRUT GIS master plans; and Guwahati from OpenCity/Oorvani via BharatLas under ODbL-1.0. Every city has live PM2.5 (interpolated), an annual satellite PM2.5 layer, heat (Landsat 8/9 surface temperature), green cover and built-up area (ESA WorldCover 10 m). Overlays of schools (UDISE/NCOG) and health centres (Bharatmaps) show who breathes the air. Each layer has a legend, tooltips and live statistics, and the maps show the urban heat-island link from each city's own data |
| 35 | **Citizen testimony** | A multilingual wall of 250 first-person testimonies on how bad the air is, from 107 cities, in Hindi, English and 12 other Indian languages (Bengali, Tamil, Marathi, Telugu, Kannada, Gujarati, Punjabi, Malayalam, Odia, Urdu, Assamese, Nepali), each with an English translation. Field-collected entries carry their collection date and mode, and each speaker is named as they asked. You can filter by language, search the text and read Urdu right to left. To add your own, write to contribute@janvayu.in |
| 36 | **Live 5-day forecast** | An independent PM2.5 forecast (Open-Meteo / CAMS, no key needed) in the Forecast panel: daily mean and peak, a band-coloured summary, a trend chart and a 33-city selector. It sits beside reliability tracking for SAFAR/CPCB forecasts. Ask JanVayu can answer "will it be bad tomorrow?" |
| 37 | **Farm fire tracker** | A live map of stubble burning and farm fires (NASA FIRMS, VIIRS/NOAA-20) across the Punjab–Haryana–NCR belt, with region and time-window toggles. It shows the seasonal pattern, with a peak from mid-October to late November |
| 38 | **Beyond the lungs** | PM2.5's toll on the whole body: kidneys (a 2026 Chennai–Delhi eGFR cohort), heart and blood vessels, brain, metabolism and pregnancy. It argues for health alerts that cover all of these |
| 39 | **Occupational exposure** | Who is exposed most, by occupation: street vendors, traffic police, gig riders, and construction and waste workers, built around a 2026 Chennai street-vendor study |
| 40 | **Open data API** | A versioned, open public data API at [janvayu.in/api](https://www.janvayu.in/api): a manifest of every dataset and a CSV export of rankings. Free to use with attribution (CC BY-NC-SA 4.0) |
| 41 | **Hand-drawn diagrams** | Diagrams in a hand-drawn style: the system diagram, "How the AQI number is built", "PM2.5 through the body", "How dirty air drains the economy", and the blog headers. Each has a wide desktop version and a portrait mobile version. Sources are in `assets/diagrams/` |
| 42 | **Photo gallery** | "The air, in pictures": 31 documentary photographs (CC or public domain) from Wikimedia Commons, in a grid that opens full screen, with credit and source for each image |
| 43 | **Web push alerts** | An installable app that sends real alerts when air crosses a threshold, even when the site is closed |
| 44 | **Automated fact-check** | A periodic routine (currently unscheduled) checks every statistic and calculator constant against current primary sources on the web and opens a review. Findings are archived in `docs/fact-check-*.md` |
| 45 | **Village boundaries** | A Villages layer on the live map covering all **584,615** Indian village boundaries (LGD via indianopenmaps.com). It loads at zoom 9 and above, and only for districts in view |
| 46 | **Annual PM2.5 per village** | Every one of the 584,615 villages has an annual mean PM2.5 from SatPM2.5 V6GL03 (ACAG, Washington University; a CNN over satellite AOD and GEOS-Chem, about 1 km, CC BY 4.0). The ~565-station live network can never offer that: 100% coverage. Villages are coloured by the figure and banded against the WHO guideline (5) and India's NAAQS limit (40). The live estimate stays separate in the popup, because the two cover different timescales, and the card notes that a ~1 km product smooths over very local sources. Not one village meets the WHO guideline, and 63.6% exceed India's own limit of 40 |
| 47 | **Annual PM2.5 per ward** | The Ward Atlas has an "Air, yearly" layer: an annual mean PM2.5 for all **9,015 wards** across the 142 cities, from the same SatPM2.5 V6GL03 grid. It is the year-scale partner that the heat, green and built-up layers lacked. Unlike the live snapshot it can fairly be compared with them, so the ward-vs-built-up scatter is now a like-for-like correlation. Colours are shaded within each city, since a whole city usually sits inside one national band, with absolute µg/m³ endpoints in the legend. Ask JanVayu can use these figures too |
| 48 | **Airshed decomposition** | "Your airshed, or your town?" 89.2% of the variance in district annual PM2.5 lies between states, and the remainder within them. Pick any of 785 districts to see how the gap between its air and the national median divides into its region and its own local deviation. State medians run from Delhi (92.7 µg/m³) to Ladakh (13.9). The panel makes the case for managing air by airshed, using India's own district figures, and says plainly that the gap names no cause |

---

## Key statistics (July 2026)

| Metric | Value | Source |
|--------|-------|--------|
| Annual PM2.5 Deaths | 1.72 million | Lancet Countdown 2025 |
| Economic Cost | $339.4 billion (9.5% GDP) | Lancet Countdown 2025 |
| India's Global Share | India and China each recorded more than 2 million air-pollution deaths in 2023 (of 7.9 million worldwide) | State of Global Air 2025 |
| Most Polluted Capital | New Delhi (82.2 µg/m³, 8th straight year worst) | IQAir 2025 |
| Most Polluted City | Loni, India (112.5 µg/m³) | IQAir 2025 |
| Cities Meeting WHO Guideline | Only 14% globally | IQAir 2025 |
| India Average PM2.5 | 48.9 µg/m³ (~10× WHO limit) | IQAir 2025 |
| Life Expectancy Loss (India) | 3.5 years | AQLI 2025 |

---

## How it is built

JanVayu is a light site with no front-end framework. Social and news feeds are gathered on the server:

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

**Main design choices:**

- The whole front end is one `index.html` with its CSS and JavaScript inline. There is no build step, bundler or framework.
- Social media and news APIs are fetched through Netlify Functions, which avoids browser cross-origin limits and keeps API keys private.
- A scheduled function fetches all feeds every 4 hours and stores them in Netlify Blobs. The on-demand API functions read from that store, so responses are instant.
- The browser calls the WAQI API directly every 10 minutes. The token is a free-tier public key.
- A scheduled function runs daily at 8:00 AM IST (2:30 AM UTC), reads subscribers from Blobs, fetches current AQI and sends personalised HTML emails through Resend.

---

## Automatic update schedule

| Task | Frequency | Mechanism |
|------|-----------|----------|
| Social/news feed refresh | Every 4 hours | `scheduled-fetch.mjs` (Netlify Scheduled Function) |
| Daily AQI email digest | Daily at 8:00 AM IST | `daily-digest.mjs` (Netlify Scheduled Function) |
| Live AQI dashboard refresh | Every 10 minutes | Client-side JavaScript (WAQI API) |
| Current-year district air layer | 3rd of each month | `current-year-air.yml` → `scripts/build-current-year-air.py` |
| Stated figures vs the data | Every push and PR | `guard-site-figures` → `scripts/check-site-figures.py` |
| Homepage blog list vs the blog | Every push and PR | `scripts/build-blog-index.py --check` |
| Social + news sweep for the Voices panel | Mondays, 04:00 UTC | Scheduled Claude routine (opens a branch for review) |

---

## Project structure

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
│       ├── twitter-feed.js             # API: retired; it read Nitter, whose public instances are gone, and nothing calls it
│       ├── news-proxy.js               # API: serves cached news articles
│       ├── instagram-feed.js           # API: serves cached Instagram posts
│       ├── feed-status.js              # API: reports feed freshness and health
│       ├── subscribe.js                # API: manages email subscriptions
│       └── blob-store.js              # Shared: Netlify Blobs store helper
└── node_modules/                       # Dependencies (git-ignored)
```

---

## Technical stack

| Layer | Technology | Purpose |
|-------|-----------|--------|
| Frontend | Vanilla HTML / CSS / JavaScript | Zero-dependency single-page application |
| Charts | Chart.js | AQI trends and health data visualizations |
| Maps | Leaflet.js + OpenStreetMap | Interactive AQI station maps |
| AQI Data | WAQI API | Real-time air quality from the stations WAQI aggregates for India |
| Serverless | Netlify Functions | Server-side API proxying and scheduled tasks |
| Caching | Netlify Blobs | Persistent JSON cache with strong consistency |
| Email | Resend | Transactional email delivery for daily digests |
| Hosting | Netlify (auto-deploy from GitHub) | CDN, edge functions, scheduled functions |
| Domain | janvayu.in | Custom domain via Netlify DNS |

---

## Environment variables

The following environment variables must be configured in the Netlify dashboard for full functionality:

| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | Yes | API key from [Resend](https://resend.com) for sending email digests |
| `RESEND_FROM` | Yes | Verified sender email address (e.g., `digest@janvayu.in`) |
| `BLOB_TOKEN` | Yes | Netlify personal access token for Blob store access |
| `NETLIFY_SITE_ID` | Yes | Netlify site identifier (used by Blob store and scheduled functions) |
| `GROQ_API_KEY` | Yes | Groq API key for AI features; runs the `openai/gpt-oss-120b` open model (free at [console.groq.com](https://console.groq.com)). Optional `GROQ_MODEL` overrides the model without a code change. |

> **Note:** The WAQI API token (`1f64cc8563a165dc5a6ce48f7eeb9ba0221b63f3`) is a free-tier public key embedded in the client-side code. It is rate-limited by WAQI and does not require server-side protection.

---

## Self-hosting and local development

### Prerequisites

- [Node.js](https://nodejs.org/) 22.12 or later
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

## Data sources

JanVayu integrates public data sources, including:

| Source | Type | Access |
|--------|------|--------|
| [WAQI](https://waqi.info) | Real-time AQI | Free API |
| [CPCB CAAQMS](https://app.cpcbccr.com/ccr/) | Official AQI | Free |
| [OpenAQ](https://openaq.org) | Hyperlocal CPCB + community stations (My Neighbourhood) | Free API key |
| [Open-Meteo](https://open-meteo.com/) | 5-day PM2.5 forecast (CAMS) for the Forecast panel | Free, key-less |
| [IHME GBD](https://vizhub.healthdata.org/gbd-results/) | Health burden | Free |
| [Lancet Countdown](https://lancetcountdown.org) | Annual health reports | Open Access |
| [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/) | Active-fire detection for the Farm Fire Tracker (VIIRS/NOAA-20) | Free API key |
| [Indian Kanoon](https://indiankanoon.org/) | Legal/court orders | Free |
| [PRANA Portal](https://prana.cpcb.gov.in/) | NCAP tracking | Free |
| [IQAir](https://iqair.com) | World Air Quality Report | Free |
| [ESA WorldCover](https://esa-worldcover.org/) | 10 m land cover (green / built-up) | Open (CC BY) |
| [USGS/NASA Landsat](https://www.usgs.gov/landsat-missions) | Land-surface temperature | Free (via [Planetary Computer](https://planetarycomputer.microsoft.com/)) |
| [DataMeet](https://github.com/datameet/Municipal_Spatial_Data) | Municipal ward boundaries | Open (CC BY) |
| [BharatLas](https://bharatlas.com) (OpenCity / Oorvani Foundation) | Municipal ward boundaries for cities Swachh Bharat omits (Guwahati) | Open (ODbL-1.0) |
| [AMRUT GIS master plans](https://amrut.mohua.gov.in/) (West Bengal), via indianopenmaps.com | Municipal ward boundaries for 7 West Bengal cities | Community mirror of govt data |
| ESRI India Living Atlas wards, via indianopenmaps.com | Municipal ward boundaries for 45 cities incl. every remaining state capital | Community mirror of govt data |
| [SatPM2.5 V6GL03](https://sites.wustl.edu/acag/datasets/surface-pm2-5/) (ACAG, Washington University) | Annual mean PM2.5, ~1 km, for every village and ward | Open (CC BY 4.0) |
| [Indian Open Maps](https://indianopenmaps.com) | Ward/constituency/district boundaries, pollution sources, schools & health centres (SBM, LGD/Bharatmaps, GatiShakti, NCOG mirrors) | Community mirror of govt data ("not-so-open"; attributed, simplified derivatives) |

---

## Roadmap

Full phased roadmap: **[docs/wiki/Roadmap.md](docs/wiki/Roadmap.md)** · tracked on [GitHub Issues](https://github.com/JanVayu/JanVayu/issues).

**Recently shipped (v26.6.235):** every standalone page now loads the shared stylesheet and follows the theme control, and the choice is remembered between pages (v26.6.232). Five of the six pollutant pages printed a random value under a real unit from 26 April to 22 September 2026. They now show the per-pollutant sub-index that WAQI reports, labelled as one, and [a post explains what happened](blog/posts/2026-10-02-five-pollutant-pages-random-numbers.md). CPCB's own daily AQI bulletins, 2015 to 2026, cover 297 cities and 507,334 city-days, with the monitor count beside every figure and no trend line, because the number of stations behind each city grew over the period (v26.6.199 to 202). Weather-normalised trends for 44 cities replaced the single Delhi-NCR run as the national view (v26.6.193), and a colour-contrast check now sweeps every page in both themes before a pull request can merge.

**Before that (v26.6.155):** PM2.5 now leads everywhere, after a criticism at a conference that was fair. AQI is a unitless index that reports only its worst pollutant and cannot be averaged over a year, while every Indian limit, health study and NCAP target is written in µg/m³ of PM2.5. The decks, dashboard and section copy now say so, and [a post explains why](blog/posts/2026-08-09-why-pm25-not-aqi.md). [How to read the JanVayu map](blog/posts/2026-08-09-how-to-read-the-map.md) is a reader's manual for the atlas, not an engineering note. The Field Testimony wall grew from 142 to 250 voices across 107 cities and 14 languages, with field-collected quotes stamped by collection date and mode and code-mixed speech marked as spoken. The Reddit feed works again through the public Atom feed after Reddit's JSON API began refusing data-centre addresses, and X/Twitter was removed rather than left as an empty tab.

**Before that (v26.6.153):** the boundary atlas is complete. A single Boundaries menu covers 983,149 areas across seven levels (state, district, block/mandal/tehsil, gram panchayat and village on the rural side, city and ward on the urban side), and each carries the same nine measures: annual PM2.5, the same air split into four seasons, surface heat from a national Landsat mosaic, and tree, green and built-up cover from ESA WorldCover. Six levels ship as PMTiles read by HTTP range request. Villages carry the same numbers in per-district TopoJSON, because a 267 MB tile archive cannot ship. A Compare panel plots any two measures against each other for whatever is on screen. The per-city ward panel is retired, and `#ward-map` points at the map.

**Next up:**

- Publish the boundary tiles as a release. `scripts/fetch-tiles.mjs` is written and unwired. Publishing the archives would take about 159 MB (`data/tiles`) out of the working tree, and would let villages use PMTiles like the other six levels instead of the per-district loader.
- Reduce the repository's weight. The working tree is ~395 MB (excluding `.git`; `data/villages` is ~192 MB and `data/tiles` ~159 MB). A shallow-clone or data-split path would help contributors.
- Answer whole-country correlations. The Compare panel covers only what is on screen, and says so. A precomputed statistics file would let it answer nationally.
- Cover the states no ward source reaches, Manipur, Mizoram, Srinagar and Siliguri among them. An RTI to West Bengal Municipal Affairs is the realistic route for Siliguri.
- Fix Thiruvananthapuram's last ward with no heat figure. It sits in a Landsat coverage seam, and the national mosaic closed five of six.

## Contributing

We welcome contributions from:

* Researchers, with datasets, papers and analysis
* Journalists, with investigations and verified reports
* Developers, with code, visualizations and tools
* Citizens, with testimonies, local documentation and translations
* Designers, with accessibility and communication work

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

## Name change note

This project was previously known as "Vayu Smriti" (वायु स्मृति). It was renamed to **JanVayu** (जनवायु) for better linguistic inclusivity across India's diverse language communities.

---

## Forking and reuse

JanVayu is designed to be forked for other cities, regions, or countries. Designed to run on the free tiers of WAQI, Groq, Resend and Netlify (free-tier limits change; check each provider).

See **[FORKING.md](FORKING.md)** for a complete guide to what to change, which API keys you need and how to attribute the project.

If you create a fork, let us know and we'll list it in the README.

---

## License

* Code: MIT License. Use it freely, modify it, redistribute it.
* Content and documentation: CC BY-NC-SA 4.0. Share with attribution, non-commercially, under the same license.
* Data: individual sources keep their original licenses.

See [LICENSE](LICENSE) for details. If you fork this project, please credit JanVayu as the upstream source.

---

## Contact

* Email: [contribute@janvayu.in](mailto:contribute@janvayu.in)
* Website: [https://www.janvayu.in](https://www.janvayu.in)
* GitHub: [github.com/JanVayu/JanVayu](https://github.com/JanVayu/JanVayu)

---

## Support

JanVayu is a public interest project. If you wish to support:

* Contribute data or expertise (see Contributing above)
* Report a problem by [opening an issue](https://github.com/JanVayu/JanVayu/issues)
* Share the website

---

*JanVayu is built on the principle that public memory is a prerequisite for public accountability.*

**जनवायु, क्योंकि हवा सबकी है।**
