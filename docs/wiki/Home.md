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
| [Role-Based Landing Page](Role-Based-Landing-Page) | 12-role audience system with personalized dashboards |
| [Simple Language Mode](Simple-Language-Mode) | Site-wide plain language toggle system |
| [Adding a New Panel](Adding-a-New-Panel) | Step-by-step guide for contributors |
| [Adding a New Role](Adding-a-New-Role) | How to add roles to the role selector |
| [Translation Guide](Translation-Guide) | How to contribute translations |
| [Roadmap](Roadmap) | Feature roadmap and planned releases |
| [FAQ](FAQ) | Frequently asked questions |

---

## About JanVayu

**JanVayu** (जनवायु — "People's Air") is a non-partisan, citizen-led initiative documenting India's air quality crisis through real-time data, health research, policy tracking, and public testimony.

### What's New (v26.6.x)

**v26.6.58–71 — Multilingual fix, accessibility & a 42%-lighter site (15 Jul 2026)**
- Fixed a crash that had silently disabled the entire 5-language switcher — Hindi, Tamil, Marathi and Bengali now actually apply across the UI. Lazy panels translate on open; the About panel is fully translated as a template.
- Accessibility sweep (WCAG 2.1 AA, axe-verified): form-control labels, underlined prose links, chart alt-text, and theme-aware badge contrast.
- Live rankings expanded 27 → 88 cities. Backend CORS handling consolidated into a shared helper.
- `index.html` shrank from ~1.59 MB to ~0.92 MB by lazy-loading 12 heavy panels and externalising the Games engine and testimony data.

**v26.6.43–47 — Forecast, Fire Tracker, Beyond the Lungs, Open Data API (14 Jul 2026)**
- 5-day PM2.5 forecast (Open-Meteo/CAMS), NASA-FIRMS farm-fire tracker, OpenAQ hyperlocal data, whole-body health section, and a CORS-open public Open Data API at `/api`.

**v26.6.23 — 7 new panels, shareable AQI cards, 12 roles, nav audit (27 May 2026)**
- 4 new panels: Understanding AQI (pollutant breakdown + CPCB vs EPA scales), Shareable AQI Cards (canvas PNG for Instagram/WhatsApp), Exposure Diary (16-activity weighted exposure with cigarette equivalence), enhanced Migration Comparison (side-by-side live AQI + life-years verdict).
- 3 more panels: Data Source Selector (CPCB/WAQI/IQAir/Sensor.Community education + Source Impact Simulator), City Policy Tracker (8-city NCAP dashboard), enhanced Legal Framework (8-region court rulings + citizen recourse guide).
- Citizen/Activist split into two roles (now 12). Women & Air Quality renamed to Women's Health. 17 nav label fixes. 8 grid fixes, 2 table wraps, Rankings table + loading fix, 9 broken Sargam icons replaced.
- Blog post: "The May 26 Overhaul: 21 Fixes in One Day". Updated walkthrough deck (65 slides).

**v26.6.22 — Women & Air Quality panel + historical map overlay (26 May 2026)**
- New "Women & Air Quality" panel: indoor cooking exposure, maternal health, occupational exposure, gender data gap, action items. New "Woman / Caregiver" role.
- Historical data time-slider on map: month/year slider (Jan 2024 → present), color-coded PM2.5 markers for 12 cities.

**v26.6.21 — Auto-update infrastructure (26 May 2026)**
- 7 systems for freshness automation: version single-source script, sitemap auto-gen, feed health monitoring, translation key sync, data-stat system for dashboard numbers, reference data endpoint, Zotero → Reading List function.
- Version bump now runs on every Netlify deploy. Service worker caches auto-sync. Key stats auto-patch from `stats.json`.

**v26.6.20 — Chatbot accuracy + intent-based nav + feedback UI (26 May 2026)**
- Chatbot station-count accuracy: CPCB reference data for 27 cities with CAAQMS vs manual bifurcation.
- Multi-station AQI range for generic queries (fixes Delhi/Mandir Marg single-station bias).
- Navigation reorganized from data-type to intent-based: new "My Air" tab surfaces personal tools first. Resources cut from 16 → 8 items. All 43 panels preserved.
- Renamed: Hyperlocal → My Neighbourhood, Research Library → Reading List, Policy Effectiveness → Policy Tracker.
- Thumbs up/down feedback buttons on chatbot responses.
- City bar expanded from 10 → 33 cities.
- Service worker cache bumped so returning visitors see new features.

**v26.6.11 — `/walkthrough/` guided-tour page featured**
- New public page at [janvayu.in/walkthrough/](https://www.janvayu.in/walkthrough/) embedding the 64-slide JanVayu MMSF Fellows deck via Google Slides iframe.
- PPTX (24 MB) and PDF (13 MB) downloads pulled directly from the live deck.
- Dashboard quick-link card with NEW badge; hero alert extended; footer link under Tools & Action.

**v26.6.10 — Temporal-framing fixes**
- 8 more sentences with the same class of bug as v26.6.9 (action verbs like *"shows"* / *"found"* paired with year-only citations from 2023–2024 papers that are now 5–29 months old). Reframed to "*A 2023 study in X documented…*" so publication vintage is explicit.

**v26.6.9 — Hero alert IQAir 2025 framing fix**
- Hero said *"May 2026: IQAir 2025 confirms Loni…"* — confusing because IQAir 2025 was actually published March 2025 (covering 2024 data), ~14 months old. Reframed to lead with the freshest items (Lancet Countdown launched May 2026, CAQM off-season GRAP 19 May) and explicitly label IQAir's vintage.

**v26.6.8 — Final corners**
- `docs/wiki/Home.md` "What's New" rewritten to lead with the v26.6.x ship list; v26.5.x history preserved as "Previous".

**v26.6.7 — Deep sweep**
- Every outbound HTTP request from JanVayu's serverless tier (all 19 Netlify Functions) now reports v26.6 as its User-Agent — combined `scheduled-fetch.mjs`, `instagram-feed.js`, `news-proxy.js`, `community-sensors.mjs`, `waqi-proxy.mjs`, `reddit-feed.js`, `twitter-feed.js` bumps.
- English `docs/user-guide/aqi-dashboard.md` + `health-calculator.md` and three translated copies (Bengali, Marathi, Tamil) updated to **Delhi 91.6 µg/m³ (IQAir 2025)** from `~100 µg/m³`.
- ImpactMojo docs confirmed as a separate project (development education, not air quality).

**v26.6.6 — Secondary surface sweep**
- Six per-pollutant SEO pages regenerated; **build-script bug fixed** (`datePublished` was being reset to today's date on every regeneration — now pinned to 2026-04-26 with `dateModified` updating to current date).
- Root service worker cache bumped `janvayu-20260508` → `janvayu-20260520` so returning visitors pick up everything from v26.6.0–v26.6.5.
- Four blog posts realigned to canonical 1.72M / $339.4B figures (lancet-causal-evidence, iqair-2025-india, learning-games "six → now seven", economic-cost World Bank framing clarified).

**v26.6.5 — Complete panel content freshness sweep**
- Every remaining panel template (30+) audited and either refreshed or confirmed evergreen.
- Historical Trends timeline gains 3 May 2026 entries (NCAP deadline elapsed, NGT south-India order, off-season GRAP).
- Legal Framework gains a new "Recent Court & Regulator Action (Apr–May 2026)" card.
- Policy GRAP Stages, Citizen Voices, Industrial Sources, Citizen Action Plan, AQI Forecast, Climate Displacement all gained May-2026 framing.

**v26.6.4 — Top-five panel freshness**
- **Clean Air Wins** gains an "Update — May 2026" card (CAQM off-season GRAP, NGT south-India order, SPCB diesel-generator notices).
- **Budget Tracker** Funding Cliff Alert reframed: 15th FC grants *expired* 31 Mar 2026; 16th FC report expected Oct 2026.
- **Mission Tracker** NCAP card retitled "Deadline Missed" with CREA 23/100 + CSE Apr 2026 37/131 outcomes.
- **Children's Health**, **Political Accountability** also refreshed.

**v26.6.3 — Back-to-home button visibility patch**
- Solid accent-green background + white house icon (was light-on-accent and easy to miss). 52 px desktop, 48 px mobile. One-time gentle pulse on appearance.

**v26.6.2 — Audit sweep: Resources + stale stats**
- Five fresh May 2026 items in Resources (CREA April snapshot, two NGT orders, CAQM off-season GRAP, DTE/AAD 2026 briefing).
- SEO meta + Twitter Card: "2 million" → "1.72 million (Lancet Countdown 2025)".
- `docs/README.md` in all five languages updated to canonical 1.72M / $339.4B / 91.6 µg/m³ figures.
- "Latest Research 2025" card relabelled "Recent Peer-Reviewed Findings (2024–2025)".
- Headless click-through of all 43 panels — zero uncaught JS exceptions.

**v26.6.1 — Back-to-home floating button**
- Small arrow button bottom-left (mirror of the search FAB) — returns to dashboard hero from any panel.
- `data-i18n-attr` extension to `setLanguage()` so icon-only buttons can be translated without touching innerHTML.

**v26.6.0 — Vayu Junction (7th learning game)**
- Word-grouping puzzle inspired by BBC's *Only Connect*, NYT *Connections*, and the *Torchlight* climate puzzle at Times of Climate Change.
- Four original India-AQ puzzles ship at launch: Basics, Sources/Seasons/Protection, Names & Numbers, Devious.
- 16 tiles on a 4×4 grid, four hidden groups of four, four strikes, auto-detects "one-off" near-misses.
- Ask JanVayu verified end-to-end in all five UI languages (EN/HI/TA/BN/MR).
- Roadmap restructured: Phase 5.7 returned to numeric order; duplicate Phase 6 renamed; new Phase 5.9.

### Previous (v26.5.x — May 2026)

**v26.5.6 — Performance + accessibility hardening**
- **Lazy-loaded Chart.js + Leaflet** behind `window.ensureChartJs()` and `window.ensureLeaflet()` — ~120 KB off first paint for sessions that don't open Trends/Map; dashboard mini-charts pre-warmed in `requestIdleCallback`.
- **Chart canvas accessibility** — every `<canvas>` now has `role="img"` and a meaningful `aria-label` so screen readers can describe each chart.
- **Subresource Integrity (SRI)** hashes pinned for the three lazy-loaded CDN scripts so a CDN compromise can't inject untrusted code.

**v26.5.4–5 — CI quality + mobile first pass**
- **CI now reports on every PR**: Lighthouse, axe-core (WCAG 2 AA), html-validate, ESLint, lychee broken-link audit, i18n coverage % — all advisory, all in the PR step summary.
- **Strict weekly link audit** opens a tracking issue if anything dies.
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
- **Full Bibliography (Zotero)** — Public bibliography at [zotero.org/groups/janvayu](https://www.zotero.org/groups/6508140/janvayu/library).
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
- **8.6%** all-cause mortality rise per +10 µg/m³ — Jaganathan et al. 2024, India's first causal dose-response
- 16+ cities monitored in real-time + ~200 Sensor.Community community sensors
- 160+ verified data sources integrated
- 51 content panels across 7 navigation categories
- 5 languages (EN, HI, TA, MR, BN)

---

**जनवायु — क्योंकि हवा सबकी है।**
