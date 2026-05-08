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
- [x] Workshops panel with Sarath / UrbanEmissions request form and JanVayu walkthrough booking (Netlify Forms)
- [x] Programme attribution updated to "AirQuality for Janhit by MMSF Fellows, AIPC" everywhere

---

## Phase 5.8: CI / Quality / Mobile / Performance (✅ Completed — v26.5.4–6)

Installs measurement everywhere and lands the highest-leverage safe wins. Every quality dimension tracked in issues #1, #3, #4, #5, #33, #45 now reports on every PR.

- [x] **Lighthouse CI** — `.lighthouserc.json` + `.github/workflows/lighthouse.yml` (advisory; warn-only on Performance ≥ 0.60, FCP ≤ 3 s, LCP ≤ 4.5 s, TBT ≤ 600 ms, CLS ≤ 0.15)
- [x] **axe-core CI** — `.github/workflows/accessibility.yml` runs against `/`, `/ask/`, `/blog/`, `/downloads/` tagged WCAG 2 AA
- [x] **HTML validate + ESLint CI** — `.github/workflows/quality.yml`; `.htmlvalidate.json` config
- [x] **Strict weekly lychee link audit** — `.github/workflows/link-audit.yml` opens tracking issue on failure; PR-time lychee stays advisory
- [x] **`scripts/check-i18n-coverage.py`** — measurable i18n coverage % surfaced in PR step summary
- [x] **Lazy-loaded Chart.js + Leaflet** with SRI — ~120 KB off first paint
- [x] **Pre-warmed Chart.js** via `requestIdleCallback` so dashboard mini-charts stay snappy
- [x] **Chart canvas a11y** — `aria-label` + `role="img"` on every `<canvas>`
- [x] **Mobile tap targets** ≥44 px on `.btn`; `overflow-wrap: anywhere` for long-token wrap
- [x] **Air Tambola ticket** horizontal-scrolls on 360 px Galaxy
- [x] **Agent-Reach scheduled fetch workflow** — gracefully skips without secrets
- [x] **Performance roadmap** docs/technical/performance-roadmap.md

---

## Phase 6: Q3 2026 Priorities

Now that quality is **measurable** on every PR, Q3 is where we drive the numbers down by acting on the data:

### Performance (issue #3)

- [ ] CSS split — extract panel-specific styles to a deferred external file (~200 ms additional FCP per the roadmap doc)
- [ ] Inline only critical-path CSS (hero, header, dashboard quick-link grid)
- [ ] Hit Lighthouse Performance ≥ 0.80 mobile; flip the `.lighthouserc.json` assertion from `warn` to `error`

### Accessibility (issue #4)

- [ ] Drive axe-core violation count to zero on `/`, `/ask/`, `/blog/`, `/downloads/`
- [ ] Add `/#health`, `/#policy`, `/#workshops`, `/#games` to the audited URL set
- [ ] Heading hierarchy audit (h1 → h6, no skipping)
- [ ] Color-contrast pass on stat-card pills, badges, chart legends

### Mobile (issue #33)

- [ ] Per-panel sweep across iPhone SE / 14, Galaxy, iPad Mini using Chrome DevTools device emulation
- [ ] Convert any tables that currently rely on horizontal scroll to a card layout on small screens
- [ ] Touch testing on the Workshops and Games panels

### Translation (issue #1)

- [ ] Audit which `data-i18n` strings are most user-visible (hero, top nav, role overlay, intro tour) and complete coverage there first
- [ ] Set a measurable target — e.g. 60% by end of Q3 — and enforce via `--min-coverage` in CI
- [ ] Decide explicitly whether the wiki / API content is in scope for Hindi/Bn/Mr/Ta translation

### City coverage (issue #2)

- [ ] Replace the static 16-city array in `index.html` with a build-time CPCB station fetch
- [ ] Searchable combobox replaces the city `<select>`
- [ ] Lazy-fetch all but visible + favourites to stay inside WAQI free-tier

### Operational (issue #45)

- [ ] Activate Agent-Reach secrets (or replace with the official Twitter API v2 Basic tier)
- [ ] Rotate cookie-based scrapers on schedule once active

---

## Phase 5.7: Learning, Engagement & May 2026 Refresh (✅ Completed — v26.5)

Self-paced learning surfaces, fresh data points, and a sweep of stale labels. The bet: people learn air quality faster through games than through dashboards alone, and the front-of-site numbers must be visibly current.

- [x] **Learning Games panel** at `/#games` with **six games**, all original content:
  - Air Quality Jeopardy (5 categories × 5 clues, **₹1,000–₹5,000** INR tiles, max ₹75,000)
  - PM Quick-Quiz (10 multiple-choice questions, ~3 min)
  - Source Matcher (7 dominant Indian PM2.5 sources)
  - Clean Air Snakes & Ladders — 6×6 board, inspired by *Moksha Patam*; 5 ladders (citizen actions) + 5 snakes (pollution events)
  - Jodi Match — 12-card memory game (Pelmanism) teaching key acronym/source pairs
  - Air Tambola — Indian housie ticket with 27-clue caller, auto-detects Top/Middle/Bottom Line and Full House
- [x] **"Did You Know"** dashboard strip — six India-specific sourced fact cards under the anomaly banner.
- [x] **Hero alert refreshed** for May 2026 with the canonical Lancet Countdown 2025 1.72M figure.
- [x] **April–May 2026 Voices block** at `/#voices` with six fresh curated cards.
- [x] **April–May 2026 Research Updates** featured card group at `/#resources` (Lancet Countdown 2025, AQLI 2025, IQAir 2025, CSE NCAP review, Krishna et al. 2024, CEEW 2024).
- [x] **Two new blog posts**: launch post for the games panel and a May data refresh.
- [x] **Games rendering fix** — moved games JS out of a `<script type="module">` so inline `onclick` handlers can find global functions.
- [x] **Tier-1 freshness sweep** — version markers, sitemap lastmod, CITATION date, footer version line, dashboard quick-link text, pollutant page schema dateModified, blog sidebar Lancet causal-study context.

---

## Phase 6: Mobile & Performance (🔄 Q2-Q3 2026)

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
