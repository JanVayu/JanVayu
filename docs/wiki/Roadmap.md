# JanVayu Roadmap

Track progress on [GitHub Issues](https://github.com/JanVayu/JanVayu/issues) and the [Roadmap Issue (#34)](https://github.com/JanVayu/JanVayu/issues/34).

---

## Phase 1: Foundation (✅ Completed)

- [x] Single-page real-time AQI dashboard
- [x] 16-city monitoring via WAQI API
- [x] Interactive Leaflet.js map with color-coded AQI markers
- [x] Health impact statistics panel (Lancet Countdown 2025 data)
- [x] Policy tracker (NCAP, GRAP, legal orders)
- [x] Citizen testimonials panel
- [x] Dark mode support
- [x] Mobile-responsive design
- [x] Hindi language support (bilingual headers)

---

## Phase 2: Social & News Integration (✅ Completed)

- [x] Server-side feed aggregation (Netlify Functions)
- [x] Reddit, Twitter/X, Google News, Instagram feeds
- [x] Netlify Blobs caching layer (4-hour refresh)
- [x] Unified social feed panel with filtering

---

## Phase 3: Alerts & Communication (✅ Completed)

- [x] AQI threshold alerts with sound notifications
- [x] Email subscription system via Resend
- [x] Daily AQI digest emails with health advisory

---

## Phase 4: AI Features & Deep Content (✅ Completed — v25.1-v25.3)

- [x] Ask JanVayu — natural language air quality Q&A (Groq/Llama 3.3 70B)
- [x] Health Advisory AI — personalized health recommendations
- [x] Accountability Brief Generator — AI-powered ward-level briefs
- [x] Anomaly Explainer — contextual AQI spike analysis
- [x] GEMM Health Risk Calculator
- [x] Business Productivity Loss Calculator
- [x] Policy Effectiveness Tracker
- [x] Political Accountability Tracker
- [x] Budget Tracker (NCAP fund flow)
- [x] Clean Air Mission Tracker
- [x] Historical trends with seasonal patterns
- [x] City comparison with international benchmarks
- [x] 40 content panels across 6 navigation categories

---

## Phase 5: Role-Based Platform & Accessibility (✅ Completed — v25.3)

- [x] Role-based landing page with 10 audience roles
- [x] Personalized dashboards per role
- [x] Role switcher in header navigation
- [x] Simple language mode (site-wide plain language toggle)
- [x] sessionStorage persistence for role + simple mode
- [x] Glossary overlay with Ctrl+K shortcut
- [x] Intro tour for first-time visitors
- [x] 5-language UI (EN, HI, TA, MR, BN)
- [x] data-simple plain language text on 30+ template intros

---

## Phase 5.5: Content & Research Update (✅ Completed — v25.4)

- [x] Docsify-powered blog at /blog/ with inaugural post
- [x] Zotero research library integration ([zotero.org/groups/janvayu](https://www.zotero.org/groups/6508140/janvayu/library))
- [x] IQAir 2025 World Air Quality Report data (Loni, 112.5 µg/m³)
- [x] New Lancet Planetary Health PM2.5 mortality studies
- [x] Science Advances PM2.5 inequality study
- [x] Remaining Varnasr → JanVayu URL migration (index.html, docs-ta)

---

## Phase 5.6: Competitor Gap Closure (✅ Completed — v26.4)

Closes specific UX/data gaps against aqi.in (consumer-polished AQI portal) and oaq.notf.in (open hyperlocal sensor platform), without disturbing the accountability-first positioning.

- [x] Cigarette-equivalence card (Berkeley Earth: 1 cig ≈ 22 µg/m³·day)
- [x] Disease-risk badges tied to live AQI (asthma, heart, allergies, respiratory, vulnerable)
- [x] Solution-recommendation card (N95, purifier, exercise, school closure)
- [x] "Near Me" geolocation → nearest WAQI station
- [x] City Rankings panel (Live / 7d / 30d) with `rankings.mjs` Netlify function
- [x] Per-pollutant SEO pages (`/pm25`, `/pm10`, `/co`, `/no2`, `/so2`, `/o3`) with schema.org JSON-LD
- [x] Hourly 24-hr scrubbable PM2.5 chart in the Trends panel
- [x] Year-over-year city comparison + `historical-aqi.mjs` climatology baseline
- [x] Leaflet.heat heatmap toggle + richer station popups on the Live Map
- [x] Embeddable widgets at `/embed/aqi/` and `/embed/rankings/`
- [x] Root PWA (`manifest.json` + `sw.js` + install banner) with offline shell and last-known AQI cache
- [x] Sensor.Community community-sensor integration via `community-sensors.mjs` (replaces hardware "Host a Monitor" plan)
- [x] Workshops panel with Sharath / UrbanEmissions request form and JanVayu walkthrough booking (Netlify Forms)
- [x] Programme attribution updated to "AirQuality for Janhit by MMSF Fellows, AIPC" everywhere

---

## Phase 6: Mobile & Performance (🔄 Q2 2026)

**Issues:** [#33](https://github.com/JanVayu/JanVayu/issues/33), [#3](https://github.com/JanVayu/JanVayu/issues/3)

- [x] Touch-friendly interactions (44px+ targets)
- [x] Comprehensive mobile CSS (768px + 375px breakpoints)
- [x] Role overlay mobile fix (logo/content no longer cut off)
- [x] Chart.js and Leaflet.js deferred (were render-blocking)
- [ ] Lazy-load panel templates
- [ ] Code-split JavaScript
- [ ] Lighthouse mobile score > 80

---

## Phase 7: Accessibility & i18n (Q2-Q3 2026)

**Issues:** [#4](https://github.com/JanVayu/JanVayu/issues/4), [#1](https://github.com/JanVayu/JanVayu/issues/1)

- [x] Skip-to-content link, :focus-visible, prefers-reduced-motion
- [ ] Full WCAG 2.1 AA compliance (heading audit, contrast, screen reader)
- [ ] Complete data-i18n coverage
- [ ] Translate all 40 panel templates

---

## Phase 8: Data Expansion & CI (Q3 2026)

**Issues:** [#2](https://github.com/JanVayu/JanVayu/issues/2), [#5](https://github.com/JanVayu/JanVayu/issues/5)

- [ ] Expand to 100+ CPCB cities
- [ ] Lighthouse CI on PRs
- [ ] axe-core accessibility testing

---

## Phase 9: Community & Scale (2027)

- [x] PWA with offline support — shipped in v26.4
- [ ] WhatsApp bot integration
- [ ] ML-based AQI forecast (extend the existing forecast panel beyond WAQI's 3-day window)
- [ ] South Asian expansion
- [ ] Open data API (currently we have read-only function endpoints for rankings + community sensors; needs versioning, docs, rate limits)

---

## Phase 10: Next batch — competing with peer accountability platforms (Q3 2026)

Recommended next-build list, drawing on the latest scan of NCAP Tracker (Climate Trends + Respirer Living Sciences), CREA, UrbanEmissions, IQAir, and aqi.in.

- [ ] **NCAP city scorecard upgrade** — match/exceed NCAP Tracker. Per-city met/missed flag, station-level fund utilization, PM2.5 vs target chart, with one-click pre-filled RTI to the responsible CPCB officer.
- [ ] **Stubble-burning live tracker** — NASA FIRMS API + Punjab/Haryana focus during Oct–Nov; overlay on the Live Map.
- [ ] **Source apportionment ring** — per-city %-from transport / industry / biomass / construction / dust, sourced from CREA + UrbanEmissions inventories. Interactive city picker.
- [ ] **AQI forecast 24–72hr** — extend the existing forecast panel with WAQI's daily forecast arrays, render as a 3-day horizon chart with confidence bands.
- [ ] **Push notifications** — browser push via the new service worker, gated on user-picked AQI thresholds. Complement to email digest.
- [ ] **In-browser AQ literacy quiz** — companion to Sharath's Jeopardy game; runs on the Workshops page.
- [ ] **Story-of-the-week rotation** — surface a blog post on the dashboard hero each week.
