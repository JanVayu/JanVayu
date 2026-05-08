# JanVayu Wiki जनवायु

Welcome to the JanVayu technical wiki — the comprehensive documentation for India's citizen-led air quality monitoring platform.

**Website:** [janvayu.in](https://www.janvayu.in) · **Repository:** [GitHub](https://github.com/JanVayu/JanVayu) · **Contact:** contribute@janvayu.in

---

## Quick Links

| Page | Description |
|------|-------------|
| [Architecture](Architecture) | System design, data flow, and technical decisions |
| [Netlify Functions](Netlify-Functions) | Server-side functions, scheduled tasks, and API endpoints |
| [Data Sources](Data-Sources) | All 160+ integrated data sources with access details |
| [API Reference](API-Reference) | Endpoint documentation for all Netlify Functions |
| [Deployment Guide](Deployment-Guide) | How to deploy, configure, and maintain JanVayu |
| [Role-Based Landing Page](Role-Based-Landing-Page) | 10-role audience system with personalized dashboards |
| [Simple Language Mode](Simple-Language-Mode) | Site-wide plain language toggle system |
| [Adding a New Panel](Adding-a-New-Panel) | Step-by-step guide for contributors |
| [Adding a New Role](Adding-a-New-Role) | How to add roles to the role selector |
| [Translation Guide](Translation-Guide) | How to contribute translations |
| [Roadmap](Roadmap) | Feature roadmap and planned releases |
| [FAQ](FAQ) | Frequently asked questions |

---

## About JanVayu

**JanVayu** (जनवायु — "People's Air") is a non-partisan, citizen-led initiative documenting India's air quality crisis through real-time data, health research, policy tracking, and public testimony.

### What's New (v26.5.x — May 2026)

**v26.5.6 — Performance + accessibility hardening**
- **Lazy-loaded Chart.js + Leaflet** behind `window.ensureChartJs()` and `window.ensureLeaflet()` — ~120 KB off first paint for sessions that don't open Trends/Map; dashboard mini-charts pre-warmed in `requestIdleCallback`.
- **Chart canvas accessibility** — every `<canvas>` now has `role="img"` and a meaningful `aria-label` so screen readers can describe each chart.
- **Subresource Integrity (SRI)** hashes pinned for the three lazy-loaded CDN scripts so a CDN compromise can't inject untrusted code.

**v26.5.4–5 — CI quality + mobile first pass**
- **CI now reports on every PR**: Lighthouse, axe-core (WCAG 2 AA), html-validate, ESLint, lychee broken-link audit, i18n coverage % — all advisory, all in the PR step summary.
- **Strict weekly link audit** opens a tracking issue if anything dies.
- **Agent-Reach scheduled fetch** — every 2 hours, gracefully skips when secrets are absent (issue #45).
- **Mobile responsiveness first pass** — `.btn` ≥44 px on small screens (WCAG 2.5.5), long URLs wrap with `overflow-wrap: anywhere`, Air Tambola ticket horizontal-scrolls cleanly on 360 px Galaxy.
- **Performance roadmap** documented at `docs/technical/performance-roadmap.md`.

**v26.5.0–3 — Learning Games + freshness sweep**
- **Six-game Learning Games panel** at `/#games` — India-context Air Quality Jeopardy with INR ₹1,000–₹5,000 tiles, PM Quick-Quiz (10 Q), Source Matcher, Clean Air Snakes & Ladders (inspired by Moksha Patam), Jodi Match (memory cards), and Air Tambola (Indian housie). All original questions sourced from Lancet Countdown 2025, IQAir 2025, CEEW 2024, NCAP records, and Indian Supreme Court orders.
- **"Did You Know" facts strip** on the dashboard — six India-specific sourced fact cards directly under the anomaly banner.
- **April–May 2026 Voices block** at `/#voices` — six fresh curated cards (Lancet Countdown launch, Loni residents post-IQAir, Soumya Swaminathan at Be Cool, Supreme Court four-week deadline, Bhavreen Kandhari / Warrior Moms, CSE NCAP review).
- **April–May 2026 Research Updates** featured card group at `/#resources`.
- **Hero refresh** — May 2026 alert with the canonical Lancet Countdown 2025 1.72M figure.
- **Multilingual docs** — Hindi, Bengali, Marathi `data-sources/health-data.md` brought to full parity with English.
- **Embed widget hardening** — WAQI token moved to a Netlify Function proxy.

### Previous (v26.4.x — April 2026)

- **Workshops panel** at `/#workshops` — request forms for UrbanEmissions / Dr. Sarath Guttikunda sessions and free JanVayu walkthroughs.
- **Cigarette-equivalence card**, **disease-risk badges**, and **solution-recommendation card** on the dashboard.
- **City Rankings panel** with Live / Past 7 days / Past 30 days tabs.
- **Hourly 24-hr scrubbable PM2.5 chart** in Trends; **year-over-year city comparison** in Compare.
- **Six per-pollutant SEO pages** at `/pm25`, `/pm10`, `/co`, `/no2`, `/so2`, `/o3`.
- **Embeddable widgets** at `/embed/aqi/` and `/embed/rankings/`.
- **Root PWA** (manifest.json + sw.js) with install banner.
- **Sensor.Community integration** in the Hyperlocal panel — free CC0 community sensors blended with CPCB/WAQI data.
- **Heatmap layer** on the Live Map.
- **Programme attribution updated** to "AirQuality for Janhit by MMSF Fellows, AIPC".

### Earlier (v25.4.0 — April 2026)

- **Blog** — Docsify-powered blog at [janvayu.in/blog](https://www.janvayu.in/blog).
- **Zotero Research Library** — Public bibliography at [zotero.org/groups/janvayu](https://www.zotero.org/groups/6508140/janvayu/library).
- **IQAir 2025 data** rolled in (Loni #1 globally; only 14% of cities meet WHO guideline).
- **Lancet Planetary Health** causal PM2.5 mortality studies and **Science Advances** inequality study added to the library.

### Earliest (v25.3.0 — March 2026)

- **Role-based landing page** — 10 audience roles with personalized dashboards.
- **Simple language mode** — site-wide plain-language toggle.
- **Glossary overlay** — Ctrl+K shortcut with 22+ terms.
- **Intro tour** — guided walkthrough for first-time visitors.
- **40 content panels** — Health calculator, policy tracker, budget tracker, legal framework, citizen action plans, and more.

### Core Principles

- **Evidence-based** — all data sourced from verified, public sources
- **Non-partisan** — no affiliation with any political party or entity
- **Accessible** — designed for India's diverse users, languages, and devices
- **Transparent** — open source, open data, open methodology
- **Persistent** — creating a permanent public record of the crisis

### Key Stats (May 2026)

- **1.72 million** annual Indian PM2.5 deaths (Lancet Countdown 2025) — ~70% of the global burden
- **3.5 years** average life expectancy lost to PM2.5; **7-8 years** in the Indo-Gangetic Plain (AQLI 2025)
- **$339.4 billion** economic cost (9.5% of GDP, Lancet Countdown 2025)
- **Loni, India** is the world's most polluted city at 112.5 µg/m³ (IQAir 2025)
- **48.9 µg/m³** India average PM2.5 — about 10× the WHO 2021 guideline of 5 µg/m³
- **64%** of NCAP funds spent on dust suppression (CSE 2026 review); 37/131 cities hit the original 20% target
- **8.6%** all-cause mortality rise per +10 µg/m³ — Krishna et al. 2024, India's first causal dose-response
- 16+ cities monitored in real-time + ~200 Sensor.Community community sensors
- 160+ verified data sources integrated
- 40+ content panels across 6 navigation categories
- 5 languages (EN, HI, TA, MR, BN)

---

**जनवायु — क्योंकि हवा सबकी है।**
