# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v26.5.6] - 2026-05-08

### Added — Chart accessibility, SRI, Q3 priorities

- **Chart canvas accessibility**: every `<canvas>` element on the platform now has `role="img"` and a meaningful `aria-label` describing the chart in plain English. Fifteen canvases updated (metro/region bar charts, ncap allocation chart, budget breakdowns, year-over-year compare, hourly scrub, Delhi history, seasonal pattern, exposure report, pollution calendar, correlation scatter). Preempts the largest single category of axe-core violations that the new `accessibility.yml` workflow would flag.
- **Subresource Integrity (SRI)** hashes pinned for the three lazy-loaded CDN scripts (`chart.js@4.4.7`, `leaflet@1.9.4`, `leaflet.heat@0.2.0`). Hashes computed via `sha384`, embedded in the `ensureChartJs()` / `ensureLeaflet()` helpers; if the CDN ever serves modified bytes under the same URL, the browser rejects the script rather than executing it.
- **`docs/wiki/Roadmap.md`** — added Phase 5.8 "CI / Quality / Mobile / Performance" capturing the v26.5.4–6 ship list, and a new Phase 6 "Q3 2026 Priorities" with concrete next moves: CSS split, axe-to-zero, per-panel mobile sweep, i18n coverage push, city expansion, Agent-Reach activation.
- **`docs/wiki/Home.md`** — "What's New" expanded to a three-tier history (v26.5.6 → v26.5.4–5 → v26.5.0–3) with bullet-by-bullet ship lists.
- **Blog post** `2026-05-08-quality-and-performance.md` — narrative tying together the lazy-load, SRI, chart accessibility, mobile work, and the five new advisory CI pipelines. Frames the order-of-operations choice: ship value first, instrument second.

### Changed — Version markers

- `package.json` 26.5.3 → **26.5.6**
- `CITATION.cff` `version` 26.5.3 → **26.5.6**
- `index.html` footer ribbon line refreshed for v26.5.6 with the full ship list

## [v26.5.5] - 2026-05-08

### Performance — Lazy-load Chart.js + Leaflet

- **Chart.js** (~70 KB gzipped) and **Leaflet + leaflet.heat** (~50 KB gzipped) are no longer loaded eagerly on every page-load. Replaced the `<script defer>` tags with `window.ensureChartJs()` and `window.ensureLeaflet()` lazy-loaders that fetch on first use and resolve on subsequent calls. Combined first-paint saving for sessions that never open the Trends, Map, or chart-heavy panels: **~120 KB**.
- The dashboard's small mini-charts still appear quickly because `ensureChartJs()` is pre-warmed inside `requestIdleCallback` (with a `setTimeout` fallback for Safari) — fetched after first paint, rendered when ready.
- All chart-rendering functions (`initAllCharts`, `generateExposureReport`, `renderYoYChart`, `drawHourlyChart`, `renderPollutionCalendar`, `updateCorrelation`) and the map (`initMap`) are now `async` and `await` their respective ensure-helper before touching the global `Chart` / `L` objects. Existing fire-and-forget callers (`loadPanel`, page-load init) work unchanged.
- Added `<link rel="preconnect">` for `cdn.jsdelivr.net` and `unpkg.com` so the lazy fetch starts as fast as possible when triggered.
- Tracked in [issue #3](https://github.com/JanVayu/JanVayu/issues/3); next step is the CSS split documented in `docs/technical/performance-roadmap.md`.

### Added — HTML validate + ESLint advisory CI

- New `.github/workflows/quality.yml` runs `html-validate@9` against `index.html`, blog, ask, embed, downloads, and all six pollutant pages; runs ESLint v9 against the Netlify Functions, scripts, the Ask PWA, and root `sw.js`.
- Both jobs are advisory (`continue-on-error: true`) and surface a problem count + last-100-lines log in the PR step summary. Full logs uploaded as 30-day artifacts.
- New `.htmlvalidate.json` config — extends `html-validate:recommended`; relaxes `no-inline-style` and `no-trailing-whitespace` for now, keeps `no-dup-id`, `no-dup-attr`, `no-unknown-elements`, `void-content` as gating-track errors.

### Mobile responsiveness — first pass (issue #33)

- **Tap targets**: every `.btn` is now ≥44px high on screens ≤480px (WCAG 2.5.5 / Android guidance); `.btn-sm` ≥40px. `.quick-link` cards and footer links pad to comfortable touch heights.
- **Long-token wrapping**: `overflow-wrap: anywhere` added to body text (`p, li, dd, .voice-body, .resource-desc`) and to `code` / `.code-box` at all widths so long URLs and acronym strings break instead of forcing horizontal scroll.
- **Air Tambola ticket**: 3×9 grid wrapped in a horizontal-scroll container with `min-width: 540px` and `minmax(56px, 1fr)` columns so cells stay readable on 360 px Galaxy displays.
- Existing `.icon-btn` (44×44), grid-2/3/4 single-column collapse at 600 px, table horizontal scroll at 480 px, and PWA install banner safe-area handling were already in place — verified.

## [v26.5.4] - 2026-05-08

### Added — CI / quality scaffolding

A pass through the deferred items from the v26.5.3 audit. None of these change user-visible behaviour; they install measurement and reporting so the quality gaps tracked in issues #1, #3, #4, #5, #45 become visible on every PR.

- **Lychee link audit (strict, weekly).** New `.github/workflows/link-audit.yml` runs every Monday with `fail: true` and opens a tracking issue if anything breaks. The PR-time lychee in `ci.yml` stays advisory but now surfaces a broken-link count and full report in the PR step summary. New `.lycheeignore` at the repo root with a documented add-an-entry workflow.
- **i18n coverage audit script.** New `scripts/check-i18n-coverage.py` parses `index.html`, identifies every visible English string, and reports the percentage whose immediate parent carries a `data-i18n` attribute. Wired into `.github/workflows/translations.yml` as an advisory step that posts coverage to the GitHub Step Summary. Pass `--min-coverage <pct>` to gate CI; for now no floor is set (current coverage is ~0.7%).
- **Accessibility CI (axe-core).** New `.github/workflows/accessibility.yml` runs `@axe-core/cli` against the four highest-traffic URLs (`/`, `/ask/`, `/blog/`, `/downloads/`) tagged `wcag2a,wcag2aa`. Surfaces a per-page violation count and top three rule IDs in the PR step summary; full JSON reports uploaded as artifacts (30-day retention). Advisory only (`continue-on-error: true`); flip the assertion mode once the count is at zero.
- **Lighthouse CI.** New `.github/workflows/lighthouse.yml` and `.lighthouserc.json`. Runs three iterations against four URLs and uploads to `temporary-public-storage`. Budget assertions (Performance ≥ 0.60, Accessibility ≥ 0.85, FCP ≤ 3,000 ms, LCP ≤ 4,500 ms, TBT ≤ 600 ms, CLS ≤ 0.15) are `warn`-level — flip key assertions to `error` once three green runs land on `main`.
- **Agent-Reach scheduled fetch.** New `.github/workflows/agent-reach-fetch.yml` runs `scripts/agent-reach-fetch.py` every 2 hours. Gracefully skips with a clear log message and step-summary note if any of the four required secrets (`TWITTER_AUTH_TOKEN`, `TWITTER_CT0`, `FEED_INGEST_KEY`, `NETLIFY_SITE_URL`) are absent. Activation is one set-secrets pass — see [issue #45](https://github.com/JanVayu/JanVayu/issues/45) and `scripts/README.md`.
- **`docs/technical/performance-roadmap.md`** documents the full lazy-load plan for Chart.js + Leaflet (the biggest single FCP win), CSS split, Brotli verification, and the order-of-attack for the next dedicated performance cycle. Added to `_sidebar.md` and `SUMMARY.md`.
- **`scripts/README.md`** updated to list the new `check-i18n-coverage.py` and reflect the now-wired `agent-reach-fetch.py` workflow.
- **GitHub housekeeping**: status comments posted on the long-open issues #1, #3, #4, #5, #33, #45 documenting what has shipped vs what remains, plus a substantive Q2 2026 status update on the roadmap issue #34.

## [v26.5.3] - 2026-05-08

### Changed — May 2026 freshness sweep across the whole repo

A systematic audit-and-fix pass across the main app, English docs, multilingual docs, blog/ask/embed/pollutant pages, build scripts, and Netlify config. No new user-facing features — just consistency, currency, and one operational hardening.

- **Version markers and dates aligned to v26.5.3 / 8 May 2026**: `package.json` (was 25.4.0), `CITATION.cff` (gained an explicit `version` field), `sitemap.xml` (lastmod for `/`, `/ask/`, `/blog/`, all six pollutant pages), `index.html` footer ribbon, all six pollutant page JSON-LD `dateModified`.
- **Hero rewrites**: dashboard headline went from "2 million people" to "**1.72 million people**" (matching the Lancet Countdown 2025 figure already used elsewhere). The same fix applied to the `i18n` `hero_title` fallback string. Hero alert "ships this week" CTA replaced with "now live". About-page schema `text` and `description` updated to lead with the canonical 1.72M figure plus a Krishna et al. + GBD bracket.
- **Dashboard quick-link** updated from "Jeopardy, quiz, matcher" to "Six games: Jeopardy, quiz & more".
- **Blog sidebar / index** Lancet post title gained a "(Krishna et al. 2024)" qualifier so the 1.5M causal-study figure is no longer confused with the 1.72M Lancet Countdown headline; data-corrections post title corrected.
- **English docs refresh**:
  - `docs/data-sources/health-data.md` led with the Lancet Countdown 2025 1.72M figure; Krishna et al. 1.5M kept side by side with a clear methodological note.
  - `docs/wiki/Home.md` "What's New" expanded to a five-tier history (v26.5 → v26.4 → v25.4 → v25.3); "Key Stats" date and content refreshed to May 2026 with AQLI, NAAQS gap, CSE NCAP findings, Krishna et al. dose-response, and Sensor.Community sensors.
  - `docs/wiki/Roadmap.md` added Phase 5.7 "Learning, Engagement & May 2026 Refresh" documenting the v26.5 ship list; fixed "Sharath" typo to "Sarath"; Phase 6 retitled Q2-Q3 2026.
  - `docs/user-guide/overview.md` Key Statistics header bumped to May 2026; six new rows added for Did You Know, Learning Games, Ask JanVayu PWA, April-May Voices, April-May Research Updates, and Workshops cross-link.
  - **New page**: `docs/user-guide/learning-games.md` documents all six games with worked examples, scoring rules, and pairing tables. Added to `_sidebar.md` and `SUMMARY.md`.
- **Multilingual docs refresh** (May 2026 parity for the most-cited page):
  - `docs-hi/data-sources/health-data.md` rewritten from a 31-line stub to full parity with the English version: leads with Lancet Countdown 2025 (17.2 लाख / वर्ष), preserves Krishna et al. 2024 (15 लाख) as a separate citation with a methodology note, adds AQLI 2025, IQAir 2025, the WHO 2021 update, and a NAAQS-vs-WHO comparison table.
  - `docs-bn/data-sources/health-data.md` — same rewrite (১৭.২ লক্ষ + Krishna et al. ১৫ লক্ষ).
  - `docs-mr/data-sources/health-data.md` — same rewrite (17.2 लाख + Krishna et al. 15 लाख).
  - `docs-ta/data-sources/health-data.md` — already cited 1.72 million; left as-is (verified).
  - `docs-bn/`, `docs-mr/`, `docs-ta/user-guide/overview.md` — Key Statistics header bumped from March 2026 to May 2026.
- **Pollutant pages**: all six page JSON-LD `dateModified` updated from 2026-04-26 to 2026-05-08.
- **Embed widgets — operational hardening**: WAQI API token previously hardcoded in `/embed/aqi/index.html` is now fetched server-side via a new Netlify Function `netlify/functions/waqi-proxy.mjs`. The function reads from `WAQI_API_TOKEN` (with a fallback for backwards compatibility), validates `?city=` / `?geo=` inputs strictly, and CDN-caches responses for 5 minutes. If the token is ever rate-limited or revoked, only one place needs updating instead of every widget instance live on third-party sites.
- **Service workers bumped**: `sw.js` (root) `'janvayu-v3'` → `'janvayu-20260508'`; `ask/sw.js` `'ask-janvayu-v1'` → `'ask-janvayu-20260508'`. Installed PWAs will pick up the latest manifest and shell on next visit.
- **Netlify build runtime**: `NODE_VERSION` bumped from 18 (EOL since April 2024) to 20 LTS.
- **`scripts/README.md`** added — clarifies the purpose, runtime, and wiring of the three scripts (`build-pollutant-pages.mjs`, `translate-docs.py`, `agent-reach-fetch.py`); explicitly notes the pending agent-reach secrets activation issue.
- **`/downloads/index.html`** added — previously the `/downloads/` directory exposed five raw binary files via direct URL with no index. The new index lists each file with a short description, metadata pill (PDF/PPTX/DOCX), size, and last-updated note.
- **`blog/index.html`** Docsify CDN deps pinned to `docsify@4.13.1` and `docsify-themeable@0.9.0` (was `@4` and `@0` floating tags) so a CDN-side major bump cannot break the blog.

## [v26.5.2] - 2026-05-08

### Fixed — Games panel rendering

- **Games panel was not rendering**: the Learning Games JavaScript had been appended to a `<script type="module">` block, which scopes its functions to the module rather than to `window`. Inline `onclick="switchGame(...)"` and `onclick="rollSnakesLadders()"` handlers in the panel template could not find module-scoped names and silently failed. Fix: closed the module script and reopened a plain `<script>` immediately before the games code so all game functions are global. All six games now render and the tab buttons work as expected.

### Added — Two more Indian games (now six total)

- **Jodi Match** &mdash; a 12-card memory game (six pairs / *jodis*). Tap any two; matching pairs stay face-up. Pairings teach the core associations every Indian newsroom and RWA conversation should make automatically: *PM2.5 ↔ chulha smoke*, *NCAP ↔ National Clean Air Programme*, *GRAP-IV ↔ AQI > 450*, *CAQM ↔ NCR statutory body (2021 Act)*, *WHO PM2.5 ↔ 5 µg/m³*, *N95 ↔ ≥95% PM2.5 filtration when fitted*. Format is the household memory-card game (Pelmanism) every Indian grew up with.
- **Air Tambola** &mdash; classic 3×9 Indian housie ticket with 15 air-quality terms drawn from a 27-item pool (PM2.5, GRAP-IV, NCAP, CAAQMS, Loni, Stubble, FGD, N95, HEPA, BS-VI, AQLI, Lancet 1.72M, RTI, Black Carbon, Brick Kiln, ozone, NOx, SO₂, etc.). Press **Call next** to hear a one-line clue; tap the matching cell to mark it. Auto-detects all four classic Indian wins: Top Line, Middle Line, Bottom Line, Full House.

### Added — Research, voices, and dashboard facts refreshed

- **Research Library** &mdash; new "April–May 2026 Updates" featured card group at the top of `/#resources` with six current items: **Lancet Countdown 2025** (1.72M Indian PM2.5 deaths/year), **AQLI 2025** (3.5-year national life-expectancy loss; 7-8 years in IGP), **IQAir 2025** (Loni #1 most polluted city), **CSE NCAP Five-Year Review** (37/131 cities at target; 64% of NCAP funds went to dust suppression), **Krishna et al. 2024 *Lancet Planetary Health*** (India's first causal dose-response: +10 µg/m³ → 8.6% all-cause mortality), and **CEEW 2024 source apportionment** synthesis.
- **Citizen Voices** &mdash; new "April–May 2026 Updates" block at the top of `/#voices` with six fresh curated cards: Lancet Countdown 2025 launch (1.72M figure), Loni residents post-IQAir 2025 (Down To Earth ground report), Dr. Soumya Swaminathan at the Maharashtra "Be Cool" launch, Supreme Court four-week deadline on CAQM long-term recommendations, Bhavreen Kandhari (Warrior Moms) on the delayed NAAQS revision, and the CSE NCAP five-year review.
- **Dashboard "Did You Know"** strip &mdash; six India-specific, sourced fact cards directly under the anomaly banner: 1.72M deaths, 112.5 µg/m³ Loni, 3.5 years life-expectancy loss, 64% NCAP dust spend, 8× NAAQS-vs-WHO gap, 8.6% mortality rise per +10 µg/m³.

### Updated — Blog post and feature table

- Launch blog post `2026-05-08-learning-games.md` rewritten to "Six Learning Games" with full sections on Jodi Match and Air Tambola; reading time updated 5 → 6 min.
- README feature row 22 reworded for six games; blog sidebar / index titles updated.

## [v26.5.1] - 2026-05-08

### Added — Snakes & Ladders game; INR values; clearer game explainer

- **New game: Clean Air Snakes & Ladders** (4th game on the `/#games` panel) — a 6×6 board, 36 squares, classic serpentine path inspired by *Moksha Patam*, the original Indian Snakes & Ladders. Press **Roll dice** to move 1–6 squares. Five **ladders** represent positive citizen actions (LPG switch from chulha, fit-tested N95, RTI on NCAP funds, public comment on draft City Action Plan, joining RWA pollution committee); five **snakes** represent pollution events or policy slips (Diwali fireworks, missed FGD deadlines, stubble-burn peak, GRAP-IV trigger, NCAP deadline slip). Each special square pops up a one-line learning fact. Goal: reach square 36 — *"India meets the WHO 5 µg/m³ guideline."* Fewer rolls = better.
- **Jeopardy values converted to INR**: tiles are now **₹1,000 / ₹2,000 / ₹3,000 / ₹4,000 / ₹5,000** (was $100–$500). Top score is **₹75,000**. Numbers are formatted with Indian-style grouping via `toLocaleString('en-IN')`.

### Changed — Clearer Jeopardy explainer; positive framing throughout

- The Jeopardy panel now opens with an explicit "How it works" block: tile shows a *statement* (the answer), player thinks of the *question* it answers, with a worked example (statement: *"This Indian city was named the most polluted capital in the world in IQAir 2025"* → matching question: *"What is New Delhi?"*). The earlier "Jeopardy style" shorthand was replaced with this plain-language walkthrough.
- The clue-overlay prompt was changed from "In the form of a question:" to "The matching question:" for accessibility.
- The panel intro now says "Inspired by the long-running classroom Air Quality Jeopardy that Dr. Sarath Guttikunda runs live at UrbanEmissions.info, and by Moksha Patam — the original Indian Snakes & Ladders." The earlier "inspired by, but not copied from" phrasing is gone in favour of positive attribution.

## [v26.5.0] - 2026-05-08

### Added — Learning Games panel + two new blog posts

- **New `/#games` panel** (Action → Learning Games) with self-paced games built from original India-context content. Initial release: Air Quality Jeopardy, PM Quick-Quiz, Source Matcher (Snakes & Ladders added in v26.5.1).
  - **Air Quality Jeopardy** — 5 categories (Sources, Health, Policy, Cities, Action) × 5 clues each. Each clue ships with a one-paragraph explainer pulling from CEEW 2024, IIT-Delhi DSS apportionment, NCAP records, IQAir 2025, and the Lancet Countdown 2025. Score saved locally only. Inspired by Dr. Sarath Guttikunda's classroom Jeopardy at UrbanEmissions.info.
  - **PM Quick-Quiz** — 10 multiple-choice questions, ~3 minutes, with per-question factual notes explaining the right answer and why distractors are wrong. Topics: PM2.5 basics, WHO 5 µg/m³ guideline, Lancet 1.72M figure, GRAP stage thresholds, Berkeley Earth cigarette equivalence, IQAir 2025 city rankings, NAAQS gap.
  - **Source Matcher** — tap-to-match seven dominant Indian PM2.5 source categories to one-line descriptions (stubble, residential biomass, coal thermal, road dust + non-exhaust, brick kilns, diesel gensets, open waste burning).
- **Dashboard quick-link** "Learning Games" added to the dashboard quick-links grid; cross-link from Workshops panel; footer "Tools & Action" link added; mobile nav and "Action" dropdown both expose the new panel.
- **Blog post**: `2026-05-08-learning-games.md` — launch post for the new games panel, with rationale, examples, and roadmap (Hindi/Tamil/Bengali/Marathi translations, facilitator pack PDF, monthly clue rotation).
- **Blog post**: `2026-05-06-data-corrections-may.md` — May data refresh covering Lancet Countdown 2025 (1.72M figure), IQAir 2025 city rankings, AQLI 2025 life-expectancy loss, and the distinction between two coexisting Indian PM2.5 mortality figures (1.5M from Krishna et al. 2024 vs 1.72M from Lancet Countdown 2025).

### Changed — Hero alert updated for May 2026

- Dashboard hero alert refreshed: month label "April 2026" → "May 2026", and the embedded mortality figure switched from "1.5 million additional deaths" (Lancet causal study) to **1.72 million** (Lancet Countdown 2025 — the figure already used in the README's *Key Statistics* table). Adds a one-line CTA to the new Learning Games panel.

## [v26.4.2] - 2026-04-26

### Changed — Workshop forms now use Resend instead of Netlify Forms

- New Netlify Function `workshop-submit.mjs` handles both `workshop-request` and `walkthrough-booking` POSTs. Emails the submission to `contribute@janvayu.in` (overridable via `WORKSHOP_INBOX_EMAIL` env) using the existing Resend integration (`RESEND_API_KEY`, `RESEND_FROM`). Reply-to is set to the submitter's email so the team can reply directly.
- Submissions are also written to Netlify Blobs (`janvayu-feeds` store under `workshops/<form-name>/<timestamp>-<email>.json`) for a durable record.
- Honeypot anti-spam preserved — `bot-field` submissions are silently accepted and discarded.
- Removed the Netlify Forms detection stubs and `data-netlify="true"` attributes since Netlify Forms is disabled at the project level (`processing_settings.ignore_html_forms: true`). The forms now POST directly to the function.
- Fixed a stale `hello@janvayu.in` reference in the submit-error fallback to use the documented `contribute@janvayu.in`.

## [v26.4.1] - 2026-04-26

### Added — Workshops, Roadmap docs, Programme attribution

- **Workshops panel** at `/#workshops` (under the Action nav). Two side-by-side cards:
  - "Air Quality workshop with UrbanEmissions" — request form for Dr. Sarath Guttikunda's interactive sessions, including the Air Quality Jeopardy game. Captures audience (Class 9+, college, adult cohort, educators), group size, format, city, preferred dates, notes.
  - "1-hour JanVayu walkthrough" — booking form that collects three preferred IST slots, group context, attendees, language preference, learning goals.
  - Both forms run on Netlify Forms (`data-netlify="true"`) with detection stubs and honeypot anti-spam. Inline success message replaces the form on submit.
- **Programme attribution updated**: every reference to "MMSF Air Quality Initiative" replaced with the official programme name **AirQuality for Janhit by MMSF Fellows, AIPC** in the meta tag, two schema.org JSON-LD blocks, footer credits, footer bottom strip, About panel, citation in `docs/about/license.md` and `docs-ta/about/license.md`, and the per-pollutant SEO page footer.
- **No-emoji style enforced**: removed decorative emojis introduced this cycle from the dashboard (Near Me button, PWA install banner, solution-recommendation card list, Workshops cards, success messages). Replaced with text labels, dot bullets, or existing `si-*` SVG icons.

## [v26.4.0] - 2026-04-26

### Added — Competitor gap closure (vs. aqi.in / oaq.notf.in)

- **Cigarette-equivalence card** on the dashboard: live PM2.5 → "≈ X cigarettes/day" using the Berkeley Earth coefficient (1 cig ≈ 22 µg/m³·day).
- **Disease-risk badges** tied to live AQI: asthma flare-up, heart attack/stroke, allergies, respiratory infection, vulnerable groups — colour-coded by AQI band.
- **Solution-recommendation card**: AQI-gated guidance on N95, purifier, exercise, school closure, and cardiac/lung patient precautions, with cross-links to Purifier Calculator and "Should I go outside?".
- **"Near Me" geolocation** in the hero: nearest WAQI station via `navigator.geolocation` → `https://api.waqi.info/feed/geo:.../`. Result is injected as a synthetic city option so all dashboard cards reuse the same flow.
- **City Rankings panel** (`/#rankings`) under the Monitoring nav: Live / Past 7 days / Past 30 days tabs, search, and worst-first/best-first sort. Live tab uses the current WAQI cache; aggregated tabs use accumulating Netlify Blobs snapshots.
- **Hourly 24-hr scrubbable PM2.5 chart** in the Trends panel: drag the slider to inspect any hour; readout shows µg/m³ + WHO multiple at that time.
- **Year-over-year city comparison** in the Compare panel: pick a city + month, see 2024/2025/2026 PM2.5 monthly averages with delta percentages.
- **Per-pollutant SEO pages** at `/pm25`, `/pm10`, `/co`, `/no2`, `/so2`, `/o3` with schema.org JSON-LD, sitemap entries, and live top-10 readings. Built via `scripts/build-pollutant-pages.mjs`.
- **Leaflet.heat heatmap layer** on the Live Map with a toggle. Marker popups upgraded with cigarette equivalence and a "View on dashboard" jump.
- **Embeddable widgets** at `/embed/aqi/?city=...&theme=light|dark` and `/embed/rankings/?n=10&order=worst|best` with iframe-friendly headers.
- **Root PWA**: `manifest.json` + `sw.js` (offline shell + last-known AQI cache). `beforeinstallprompt`-driven install banner with persistent dismissal in `localStorage`.
- **Sensor.Community integration**: free CC0 community sensors blended into the Hyperlocal panel with a `COMMUNITY` vs `CPCB/WAQI` source badge. Replaces the proposed hardware program.

### Added — Backend functions

- `netlify/functions/rankings.mjs` — live + accumulated daily snapshots in `janvayu-rankings` blob store.
- `netlify/functions/historical-aqi.mjs` — monthly PM2.5 climatology baseline (CPCB / IQAir 2024 sourced) enriched with snapshot data.
- `netlify/functions/community-sensors.mjs` — 10-min-cached Sensor.Community pull with EPA breakpoint PM2.5 → AQI conversion.

### Changed

- `generateWidget()` now emits a JanVayu `/embed/aqi` iframe instead of the previous aqicn.org one.
- `netlify.toml` — `X-Frame-Options: ALLOWALL` for `/embed/*`, `Service-Worker-Allowed: /` header on `/sw.js`, redirects for the six pollutant pages and the two embed widgets.
- `sitemap.xml` — added the six pollutant page URLs.

### Mobile

- PWA install banner refactored from inline styles to a CSS class set with `flex-shrink: 0` and `white-space: nowrap` on the CTA, plus `@media (max-width: 480px)` layout that respects `env(safe-area-inset-bottom)`. Fixes the "I-n-s-t-a-l-l" letter-per-line wrap reported on Android Chrome.

## [v25.4.0] - 2026-04-12

### Added — Blog & Research Updates

- **Blog redesign**: Editorial typography with Newsreader serif headings, DM Sans body, proper post metadata styling, mobile-responsive layout, branded sidebar
- **6 blog posts** (~750 words each, by Team JanVayu):
  - IQAir 2025 analysis, Lancet causal mortality evidence, NCAP deadline assessment, children's health impact, stubble burning satellite evasion, economic cost of pollution
- **Ask JanVayu PWA**: Standalone installable AI chat app at `/ask/` — chat-style interface, city chip selector, typing indicators, offline fallback, service worker caching. Installable on Android/iOS/desktop home screens via browser "Install" prompt.
- **Blog**: New Docsify-powered blog at `/blog/` for data analysis, platform updates, and reflections on India's air quality crisis
  - Inaugural post: "IQAir 2025: India's Air Got Worse" — analysis of the 8th annual World Air Quality Report
  - Markdown-based posts, same Docsify theme as docs, dark mode support
  - Netlify redirects configured for `/blog/` routes
- **Zotero Research Library**: Public bibliography at [zotero.org/groups/janvayu](https://www.zotero.org/groups/6508140/janvayu/library) — linked from README, data sources docs, and health data reference

### Changed — Data & Statistics

- **Key Statistics updated to April 2026**: Most polluted city updated from Byrnihat (IQAir 2024) to Loni, India (112.5 ug/m3, IQAir 2025); added global WHO compliance rate (14%), India average PM2.5 (48.9 ug/m3), and life expectancy loss (3.5 years, AQLI 2025)
- **IQAir 2024 references upgraded to IQAir 2025** across data sources documentation
- **New research papers added** to data sources:
  - Lancet Planetary Health — two causal PM2.5 mortality studies for India (difference-in-differences and multi-city causal modelling)
  - Science Advances — PM2.5 inequality study showing unequal air quality improvements across India

### Repository & Governance

- **Branch protection tightened**: PRs now require 1 approval, code owner review, dismiss stale reviews, conversation resolution
- **CODEOWNERS**: `@Varnasr` as maintainer; critical files (index.html, netlify.toml, functions, .github) require explicit approval
- **PR template**: Strengthened checklist (no secrets, source citations, mobile testing, no unapproved deps)
- **FORKING.md**: Complete guide for forking — what to change, API keys, attribution requirements, $0/month hosting
- **README**: Added Forking & Reuse section with attribution guidance

### Changed — Mobile & Accessibility

- **Mobile responsiveness**: 44px touch targets, comprehensive phone layout (768px + 375px breakpoints)
- **Role overlay mobile fix**: Logo shrinks to 56px/44px, content starts from top instead of center (no more cut-off)
- **Mobile header decluttered**: Reduced from 9 to 5 buttons; GitHub, Docs, Simple mode hidden (accessible via hamburger)
- **Language button**: Text labels (EN/हि) replaced with globe icon to prevent wrapping
- **Mobile hamburger menu**: Added Blog, Docs, Zotero, Wiki, Discussions links
- **Accessibility**: Skip-to-content link, `:focus-visible` outlines, `prefers-reduced-motion: reduce`
- **Performance**: Chart.js and Leaflet.js load deferred (were render-blocking)
- **Social feeds (#52)**: Re-enabled at 3x/day (was 12x/day), 75% Netlify credit reduction
- **Ask JanVayu enhanced AI**: System prompt upgraded with seasonal awareness (stubble burning, monsoon, winter inversion, Diwali), WHO activity thresholds by PM2.5 level, transport exposure multipliers, NCAP city budget/performance data, and cross-city comparison support. Responds to "Should I..." questions with direct YES/NO, generates RTI drafts, estimates personal exposure, explains seasonal causes.
- **Ask JanVayu in FAB widget**: Integrated into green floating button as third tab (Search / Ask JanVayu / Feedback)
- **Role switcher mobile**: Dropdown moved outside header DOM; renders as proper bottom sheet with backdrop overlay, drag handle, and tap-outside-to-close
- **Hero alert**: Updated from March 2026 to April 2026 with IQAir 2025 data
- **Varnasr purge**: All references to old personal account removed (60+ files)
- **Wiki**: 7 pages pushed to GitHub Wiki
- **Discussions**: 6 seed discussions created; issue #35 closed
- **Blog, Docs, Research Library** links added to site header, footer, and mobile nav
- **v25.4 changelog** added to About & Changelog panel on the website

### Fixed

- Updated CITATION.cff date-released to 2026-04-12
- Synced package.json version to 25.4.0
- Updated sitemap.xml lastmod date and added `/blog/` URL
- Docs link fixed: gitbook.io → local `/docs/`

## [v25.3.0] - 2026-03-24

### Added — Role-Based Landing Page & UX Improvements

- **Role-based landing page**: Personalized entry point with 10 audience roles — parent, student, researcher, policymaker, journalist, activist, doctor, teacher, NGO, and business owner
- **Simple language mode**: Site-wide plain language toggle in the header that switches all content to simple language, with sessionStorage persistence across page navigation
- **Glossary overlay**: Searchable glossary of air quality terms accessible via **Ctrl+K** keyboard shortcut
- **Intro tour**: Guided walkthrough for first-time visitors highlighting key sections and features
- **Role switcher in header navigation**: Allows users to change their selected role at any time from the header
- **Tooltips on all navigation icons**: Descriptive tooltips on hover for all nav icons

### Changed

- All navigation icons now have proper `aria-label` attributes for improved screen reader accessibility

## [v25.2.0] - 2026-03-24

### Added — Documentation & Translations

- **GitBook Documentation**: Complete documentation site with user guides, tech stack reference, contributing guidelines, data source documentation, and AI skills reference
- **Multilingual GitBook Translations**: Full documentation translated into Hindi (`docs-hi/`), Tamil (`docs-ta/`), Marathi (`docs-mr/`), and Bengali (`docs-bn/`)
- **OpenAPI Specification**: API reference docs for all Netlify Function endpoints
- **Interactive Demo Placeholders**: Embedded demo sections in user guide pages (AQI dashboard, health calculator, city comparison, citizen action, policy tracker)
- **Translation CI Workflow**: Automated GitHub Actions workflow for translation coverage tracking and staleness detection
- **Contributing Guide for Translations**: Dedicated documentation for translation contributors
- **Dev Tooling Documentation**: Tech stack and developer tooling reference pages

### Changed

- Improved Bengali translation quality across all documentation sections
- Updated docs README with translation status and GitBook integration details
- Reorganized Claude Code sharing documentation

## [v25.1.0] - 2026-03-23

### Added — AI-Powered Features (Google Gemini 2.5 Flash)

- **Ask JanVayu (AI)**: Natural language Q&A interface grounded in live WAQI data
  - Supports questions in English and Hindi; responds in the user's language
  - Covers 40+ Indian cities with real-time AQI data
  - Concise, data-grounded responses (under 150 words)
  - Endpoint: `POST /.netlify/functions/air-query`

- **AI Health Advisory**: Personalised health guidance based on user profile and live PM2.5 levels
  - Considers age, pre-existing health conditions, and daily hours spent outdoors
  - Colour-coded risk levels: low / moderate / high / severe
  - Evaluates against WHO guideline (5 µg/m³) and user-specific risk factors
  - Provides concrete, actionable recommendations (e.g., "stay indoors until 2 pm")
  - Endpoint: `POST /.netlify/functions/health-advisory`

- **Ward-Level Accountability Brief (AI)**: Structured briefs for local governance and civic action
  - Target audiences: ward councillors, journalists, and resident welfare associations
  - Includes seasonal baselines from CREA/IQAir data with anomaly detection (1.5× threshold)
  - References GRAP stages, RTI powers, and MCD complaint lines for actionable next steps
  - Downloadable as `.txt` files for offline sharing
  - Endpoint: `POST /.netlify/functions/accountability-brief`

- **Anomaly Detection Banner**: Automatic PM2.5 spike monitoring across 5 major metros
  - Monitors Delhi, Mumbai, Kolkata, Chennai, and Bengaluru
  - Runs on page load and refreshes every 30 minutes
  - Triggers at 2× seasonal baseline with one-sentence, month-aware AI explanations (e.g., stubble burning context in Oct–Mar)
  - Dismissible, expandable banner UI for multiple simultaneous alerts
  - 10-minute response caching for performance
  - Endpoint: `GET /.netlify/functions/anomaly-check`

### Added — Infrastructure

- **Demo Day mode**: `?demo=true` URL parameter pre-populates all AI features with Delhi/Anand Vihar defaults and shows a "DEMO MODE" badge
- 4 new Netlify Functions: `air-query.mjs`, `health-advisory.mjs`, `accountability-brief.mjs`, `anomaly-check.mjs`
- `.env.example` file with all required environment variables including `GEMINI_API_KEY`

### Changed
- Added `@google/generative-ai` SDK dependency (`^0.24.1`)
- Updated navigation: "Ask JanVayu (AI)" under Tools, "Accountability Brief (AI)" under Accountability
- Health Impact panel now includes AI Health Advisory subsection

### Technical Notes
- All Gemini API calls route through Netlify Functions — API keys are never exposed client-side
- Free tier rate limits: 250 requests/day, 10 requests/minute — fallback always returns raw PM2.5 data so users are never left without information
- Seasonal baselines sourced from CREA/IQAir data (1.5× threshold triggers accountability briefs, 2× triggers anomaly banner)
- Maximum output tokens capped at 400 for accountability briefs to keep responses focused

## [v25.0.0] - 2026-03-14

### Added
- Server-side auto-updating via Netlify Scheduled Functions for AQI data
- Netlify Functions backend for serverless API endpoints
- Email subscription system for air quality alerts
- City-specific AQI dashboard pages with detailed breakdowns
- Pollutant-level health advisory cards
- Historical AQI trend charts with daily/weekly/monthly views
- Multi-city comparison tool
- Air quality forecast predictions display
- Downloadable AQI reports (PDF export)
- Regional heatmap visualization for AQI across India
- Automated daily data archival pipeline
- Subscriber notification system for hazardous AQI events
- Dark mode support across all pages
- Multilingual support for Hindi and English

### Changed
- Migrated data fetching from client-side polling to server-side scheduled updates
- Improved dashboard load performance with pre-fetched data
- Updated research library with latest 2026 publications

### Fixed
- AQI gauge rendering on mobile viewports
- Intermittent data fetch failures during high-traffic periods
- Timezone handling for IST-based data timestamps

## [v24.0.0] - 2026-01-15

### Added
- Initial public release of JanVayu dashboard
- Real-time AQI monitoring for major Indian cities via WAQI API
- Interactive AQI dashboard with city selector
- Research library with curated air quality studies and reports
- Health impact documentation and advisories
- Accountability tracker for policy commitments
- Citizen testimony archive (anonymized submissions)
- Mobile-responsive design
- CPCB and WHO standard AQI scale reference
- Source attribution and data provenance tracking

### Changed
- N/A (initial release)

### Fixed
- N/A (initial release)

[v25.3.0]: https://github.com/JanVayu/JanVayu/compare/v25.2.0...v25.3.0
[v25.2.0]: https://github.com/JanVayu/JanVayu/compare/v25.1.0...v25.2.0
[v25.1.0]: https://github.com/JanVayu/JanVayu/compare/v25.0.0...v25.1.0
[v25.0.0]: https://github.com/JanVayu/JanVayu/releases/tag/v25.0.0
[v24.0.0]: https://github.com/JanVayu/JanVayu/releases/tag/v24.0.0
