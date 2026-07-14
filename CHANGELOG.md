# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v26.6.45] - 2026-07-14

### Added — Beyond the Lungs health section (Health & Trends)

New cited panel documenting PM2.5 harm across organ systems, not just respiratory: kidneys (anchored on the 2026 Chennai–Delhi eGFR cohort, *Kidney International Reports*, DOI 10.1016/j.ekir.2026.106693), cardiovascular (the largest share of PM2.5 deaths per GBD), brain (cognition, dementia, child learning), and metabolism/pregnancy (type-2 diabetes, preterm birth, low birth weight). Argues for health-complete alert and advocacy messaging. Wired into desktop + mobile nav and Ctrl+K search. Non-partisan framing.

### Added — low-cost indoor sensor buying guide (Indoor Air panel)

New card in the Indoor Air panel on choosing a reliable low-cost PM sensor (insist on optical/laser PM modules, correct for humidity/drift, use for trends not verdicts), anchored on the 2026 IIT (ISM) Dhanbad benchmark (*Scientific Reports*, DOI 10.1038/s41598-026-61453-2).

### Added — one-click RTI from City Scorecards

City Accountability Scorecards now have a **File an RTI →** button that opens the RTI Assistant pre-filled with the city's state pollution board and the Clean Air Action Plan implementation topic — turning a missed-target scorecard directly into a ready-to-file RTI. City→state mapping is best-effort and left blank when unknown (never prefills a wrong state).

### Fixed — OpenAQ freshness guard

`community-sensors.mjs` OpenAQ path now drops readings older than 6 hours. OpenAQ returns a station's *last* value even when it is years stale (dead/zombie stations report e.g. a 2018 reading); surfacing that as "live hyperlocal" air would violate the data-honesty principle. Verified against the live API: 16 fresh Delhi stations kept, 12 zombie/stale stations dropped.

## [v26.6.44] - 2026-07-14

### Added — live 5-day PM2.5 forecast (Forecast panel + chatbot)

- **Forecast panel** now leads with a **live 5-day PM2.5 forecast** card powered by the free, key-less Open-Meteo Air Quality API (CAMS global model): daily mean + peak, a CPCB-band-coloured day-by-day summary, a Chart.js trend, and a city selector. Shown *alongside* (not replacing) the existing SAFAR/CPCB forecast-reliability tracking, so users can cross-check the official forecast. Frontend-only — no new Netlify Function — matching the $0/month, forkable design and mirroring the existing key-less Open-Meteo use in the Urban Heat panel.
- **Ask JanVayu** now answers forecast questions ("will it be bad tomorrow in Delhi?"): a new `isForecastQuery` detector + a server-side Open-Meteo `fetchForecast` inject a cited 5-day outlook into the chatbot's data context, flagged as a model forecast independent of the live reading.

### Added — Occupational Exposure panel (Health & Trends)

New cited section on the exposure-equity gap — who breathes the worst air *by occupation*: street vendors, traffic police, gig/delivery riders, construction, waste pickers, sanitation and kerbside workers. Anchored on the 2026 Chennai street-vendor study (*BMC Public Health*, DOI 10.1186/s12889-026-28270-8) and linked to the Reading List and RTI Assistant. Registered in the desktop + mobile nav and the Ctrl+K search index. Non-partisan framing throughout.

### Changed — community-sensors primary source → OpenAQ v3

`community-sensors.mjs` now uses **OpenAQ v3** (CPCB CAAQMS + community/low-cost networks, with dense India coverage) as its primary source when `OPENAQ_API_KEY` is set — resolving the long-standing "no Indian stations" gap that left the My Neighbourhood panel and the chatbot's community-sensor blend empty. It **falls back to Sensor.Community automatically** when the key is absent, so the endpoint keeps working with zero configuration. New env var documented in `.env.example`.

### Fixed

- **`scripts/bump-version.mjs`**: the third version component is a *patch* number, not a calendar day, so deriving a date from it produced invalid `date-released` values (e.g. `2026-06-43`) once patches passed 31. The human release date now comes from the real clock; the version yields only the opaque, monotonic cache-busting stamp. The `ask/sw.js` cache suffix now tracks the patch (`-v44`), matching the established convention.
- **`anomaly-check.mjs`**: corrected a stale "explain via Gemini" comment — the code calls Groq.

## [v26.6.43] - 2026-07-13

### Added — 5 peer-reviewed papers (Reading List now 29)

Five India-focused studies published in the 3–8 July 2026 window, each linked to its DOI:

- Forecasting ambient PM2.5 and PM10 in Hisar City through machine learning — Kumar, Sihag & Vambol (*Scientific Reports*, DOI 10.1038/s41598-026-60752-y, 7 Jul 2026). ML forecasting for an NCR tier-2 city with sparse monitoring.
- Evaluation of low-cost sensors for size-resolved indoor particle monitoring — Ali, Sameer & Izhar, IIT (ISM) Dhanbad (*Scientific Reports*, DOI 10.1038/s41598-026-61453-2, 8 Jul 2026). Benchmarks affordable PM2.5 / PM10 sensors for Indian indoor environments.
- A BiLSTM-driven framework for operational PM2.5 forecasting integrating meteorological kinematics — Gupta et al. (*Frontiers in Climate*, DOI 10.3389/fclim.2026.1855755, 7 Jul 2026). India-led BiLSTM network, R² 0.81, beating statistical and deep-learning baselines.
- Long-term exposure to ambient PM2.5 and kidney function in urban Indian adults — Mandal et al. (*Kidney International Reports*, DOI 10.1016/j.ekir.2026.106693, 8 Jul 2026). 12,271-adult Chennai–Delhi cohort; +5 µg/m³ annual PM2.5 tracks declining eGFR, extending PM2.5 harm to renal health.
- Occupational exposure to air pollution and respiratory health among urban street vendors in South India — Muruganantham et al. (*BMC Public Health*, DOI 10.1186/s12889-026-28270-8, 3 Jul 2026). 298 Chennai street vendors; cumulative exposure tracks reduced peak expiratory flow — occupation-specific environmental-justice evidence.

### Changed — July freshness sweep

About-panel version log and `CITATION.cff` bumped to v26.6.43.

## [v26.6.42] - 2026-07-08

### Maintenance — full feature audit

Audited endpoints, the seven Ask JanVayu calculators, the chatbot, and the Ward Atlas — all healthy. The 16 Aug 2026 Groq model retirement is already mitigated (`GROQ_MODEL` → `gpt-oss-120b`). Fixes applied:

- **Hero refreshed for July** — leads with the monsoon respite vs the year-round crisis; updated the GRAP line (Stage-I revoked 29 May 2026 as the monsoon set in).
- **IQAir edition straggler** — `<noscript>` data-sources block said "IQAir World Air Quality Report 2024"; aligned to 2025.
- **`historical-aqi.mjs`** — now defaults to the current month instead of January when the `month` param is omitted.

Flagged (needs owner action): the live Reddit/X feed + Agent-Reach pipeline return zero items pending credentials (#45); `community-sensors` returns no Indian stations upstream. The curated Voices highlights below keep that panel current regardless.

### Added — 3 peer-reviewed papers (Reading List now 24)

- Indian perspective of PM2.5-attributed human health hazards, 2010–2025 (*Air Quality, Atmosphere & Health*, DOI 10.1007/s11869-025-01793-6).
- Respiratory deposition of PM in Delhi: a five-year assessment, 2019–2023 (*Scientific Reports*, DOI 10.1038/s41598-025-26663-0).
- Cumulative effect of PM2.5 components exceeds PM2.5 mass on child health in India (*Nature Communications*, DOI 10.1038/s41467-023-42709-1).

### Added — June–July 2026 curated Voices highlights

Three sourced cards: CAQM revoking GRAP Stage-I as the monsoon nears (29 May 2026); a monsoon-respite reality check (Delhi still 119–155 US AQI in early July); and CREA's secondary-PM2.5 finding (up to 42% chemically formed).

### Added — 34 new citizen testimonies

The Citizen Testimony wall grows from 108 to **142** first-person voices across 13 languages, adding polluted tier-2 towns (Rohtak, Panipat, Bareilly, Bhiwadi, Asansol, Durgapur, Ankleshwar, Surat, Ludhiana, Bathinda, Amritsar, Nashik, Chandrapur, Madurai, Vijayawada, Hubballi, Kochi, Rourkela, Dibrugarh and more). Under-represented languages (Assamese, Odia, Malayalam, Telugu, Kannada, Punjabi, Gujarati, Urdu) boosted. Native-language entries welcome proofreading via contribute@janvayu.in.

## [v26.6.41] - 2026-07-08

### Changed — backend & CI maintenance

- **`@netlify/blobs` v8 → v10** (`package.json` + `package-lock.json`, resolves to 10.7.9). The caching backbone for `rankings`, `historical-aqi`, `daily-digest`, `feed-ingest`, `community-sensors`, `health-monitor` and `blob-store`. The API surface we use (`getStore({ name, siteID, token, consistency })`, `.get`, `.set`, `.setJSON`, `.list`, `.delete`) is unchanged across the two majors; all blob-consuming functions pass `node --check`. Needs a Netlify preview to confirm the runtime auth path. Closes the roadmap "open tech debt" item and the direction of #167.
- **GitHub Actions bumped**: `actions/checkout` → v7 (was a v4/v6 mix), `peter-evans/create-issue-from-file` → v6. Folds in stale Dependabot PRs #132 and #133; #102 (resend/uuid) is superseded by the lockfile refresh.
- **Ask JanVayu prompt-trim** (ports the never-merged PR #98 onto the current `air-query.mjs`): `buildSystemPrompt` now injects the heavy `METHODOLOGY_REFERENCE` (~1000 tok) and `TOPICAL_REFERENCE` (~600 tok) blocks only when a query detector flags them relevant. Common-case queries ("jogging today?", "compare cities") drop ~37% of the system-prompt size — verified end-to-end against the real handler with stubbed I/O (common gets neither block; multi-source gets methodology; national gets topical). Works with the current `GROQ_MODEL` (gpt-oss-120b), which the original PR predated.

### Fixed — weekly link audit false positives (#176)

The strict weekly audit had been failing on 16 "errors" that were almost all `400 Bad Request` / `415 Unsupported Media Type` — publisher, news and data portals (ScienceDirect, Science, Springer, Business Standard, Down To Earth, TERI, ILO, MoSPI, WebIndia123…) rejecting the checker's request over Accept-header negotiation / bot detection, **not** real dead links.

- Root-cause fix: lychee now sends a browser `--user-agent` and a browser `Accept` `--header`, which resolves 415/400 media-type rejections.
- The handful of domains that hard-block automated checkers even with a browser UA are documented in `.lycheeignore` with justification (each verified reachable manually).

### Added — CREA 2026 secondary-PM2.5 analysis in the Reading List

New Reading List card: **up to 42% of India's PM2.5 is secondary** — chemically formed in the atmosphere rather than directly emitted (CREA, MERRA-2, 2024). SO₂ is the dominant precursor (India is the world's largest SO₂ emitter; coal power ≈ 60% of it), forming ammonium sulphate — ~⅓ of Delhi's PM2.5, up to 49% post-monsoon — while ~78% of coal plants still lack FGD.

### Added — two blog posts

- `2026-07-02-citation-integrity.md` — "The Citation That Didn't Exist: How We Found 'Krishna et al.' Was Really Jaganathan."
- `2026-07-08-secondary-pm25.md` — "The Pollution You Can't See Being Emitted: Up to 42% of India's PM2.5 Is Made in the Sky."

### Changed — July freshness sweep

README "Key Statistics" heading June → July 2026; `scripts/stats.json` Lancet Countdown figures re-verified (`updated: 2026-07`); About-panel version log + `CITATION.cff` bumped to v26.6.41.

## [v26.6.40] - 2026-07-01

### Fixed — citation correction: "Krishna et al." was actually Jaganathan et al. (2024)

The India-first causal PM2.5–mortality study cited site-wide (every +10 µg/m³ → 8.6% all-cause mortality, *Lancet Planetary Health* 2024, DOI 10.1016/S2542-5196(24)00248-1) was attributed to a non-existent "Krishna et al." Verified against Crossref, PubMed and the Lancet: the paper is **Jaganathan et al. (2024)**, *"Estimating the effect of annual PM2·5 exposure on mortality in India: a difference-in-differences approach"* — a nationwide design across **655 districts, 2009–2019**, not a "7-district cohort." No real "Krishna 2024" paper exists; the site's own anchor card already linked Jaganathan's DOI under the wrong name (and the request's own Reports list carried the same "Krishna" label, so the error was upstream).

Renamed and re-described across all current-facing content:

- **index.html** — FAQ schema (`text`), "Did You Know" strip + card, Reading List anchor card (title + description), the "May 2026 Updates" intro, the "What this bot can do" info box, and the Jeopardy quiz `why`. The "7-district cohort" descriptor is now "655 districts, difference-in-differences."
- **netlify/functions/air-query.mjs** (live chatbot) — `METHODOLOGY_REFERENCE` block, the `calcMortalityRisk` comment and its `source` string.
- **Blog** — `2026-04-08-lancet-causal-evidence.md`, `2026-04-12-iqair-2025-india.md`, `2026-05-06-data-corrections-may.md` (+ `README.md`, `_sidebar.md` titles); "seven districts / domestic cohort" corrected to "655 districts, difference-in-differences."
- **Docs** — `docs/data-sources/health-data.md`, `docs/wiki/Home.md`, `docs/wiki/Roadmap.md`, `docs/user-guide/overview.md`, and the Hindi/Bengali/Marathi `health-data.md` translations.

### Removed — two unrelated claims wrongly attributed to "Krishna 2024"

Investigation surfaced two *different* claims pinned to the same non-existent citation (not the mortality paper, which does not study either): a child-lung-function/ovarian-reserve line in the Reproductive & Child Health card (cited "Lancet Respiratory Medicine") and a child-stunting fact in the chatbot's national reference block. The underlying claims are real but the source was fabricated, so the specific attribution was removed — the reproductive card now credits WHO/peer-reviewed maternal-exposure cohort evidence; the stunting line was dropped from the bot reference.

### Verified — reports cross-check

The request's "Key Reports & Resources" list (April/May 2026) was checked against the Reading List: all eleven items are already present (IQAir 2025, CSE NCAP, Lancet Countdown, AQLI, CEEW, Jaganathan 2024, both NGT orders, CREA snapshot, CAQM GRAP toggle, DTE/AAD "16× COVID" Bagai). June 2026 had no new items. No additions needed.

Historical version-log and CHANGELOG entries that mention "Krishna" are left intact as dated records.

## [v26.6.39] - 2026-06-30

### Added — 21 peer-reviewed papers in the Reading List

New "Peer-Reviewed Research" section in the Reading List (Resources panel) with 21 studies on India's air quality — health effects, source apportionment, exposure inequality, low-cost sensing — each linked to its DOI (resolved via Crossref; Rautela & Goyal links to the Zotero library, no registered DOI found). Verified with lychee: all links resolve. The reports the request listed (IQAir 2025, CSE NCAP, Lancet Countdown, AQLI, CEEW, CREA snapshot, CAQM, NGT orders, DTE/AAD) were already present; June 2026 had no new items.

Note: the paper listed as *Jaganathan et al. (2024)* (DOI …00248-1) is the same one the site already features as an anchor card labelled "Krishna et al." — the existing card links Jaganathan's difference-in-differences paper but describes a cohort study; flagged for reconciliation.

## [v26.6.38] - 2026-06-30

### Fixed — dead citation links replaced with working URLs

Replaced the eight rotted external citations (previously suppressed in `.lycheeignore`) with verified live URLs: The Hindu → its NCAP topic page; EPW → epw.in; CSE → cseindia.org/air-pollution; Chintan → chintan-india.org; WIEGO → wiego.org/publications; OpenAQ → explore.openaq.org; CREA “Tracing the Hazy Air” → energyandcleanair.org/publications; NGT orders → greentribunal.gov.in. (Deep links to the exact moved articles/PDFs are gone, so these point to the closest live page on the same source.) Re-verified with lychee 0.23 — 0 errors with these no longer ignored. The `.lycheeignore` now holds only official government sites that load for users but block the automated checker.

## [v26.6.37] - 2026-06-30

### Fixed — link audit goes green (verified locally with lychee 0.23)

With `--root-dir` added in v26.6.36, the audit checked everything and surfaced a real backlog (118 errors). Cleared it down to **0**, confirmed by running lychee 0.23 locally with the exact CI args:

- **Real broken site icons**: `.si-share` (used 8×, incl. the ward "Share" button) and `.si-image` pointed at `si_Share.svg` / `si_Image.svg`, which 404 on the Sargam CDN at 1.6.7. Repointed to the valid `si_Link.svg` / `si_Crop.svg`. (Audited all 71 icon classes the site uses — these two were the only broken ones.)
- **Docsify false positives**: the `docs/` and `docs-*` trees use extensionless wiki links and language-root links that a filesystem checker can't resolve. Excluded those trees via `--exclude-path`.
- **External link rot**: added a documented `.lycheeignore` for (a) government/institutional sites that are up but block the checker or send malformed responses (ECI, OCMMS, SAFAR, EV Delhi, SCI, CPCB) and (b) genuinely dead citations flagged `TODO` for replacement (The Hindu, EPW, CSE, Chintan, WIEGO, OpenAQ, energyandcleanair, NGT orders), plus the early-version GitHub compare links (v24/v25 were never tagged).

## [v26.6.36] - 2026-06-30

### Fixed — link audit now passes (real broken links + lychee config)

The weekly link audit, fixed in v26.6.34, started actually running and then failed — surfacing genuine issues plus a config gap:

- **Real broken links fixed**: the per-pollutant SEO pages (`/pm25`, `/so2`, `/no2`, `/co`, `/o3`, `/pm10`) linked `/about` in their footers, but About is a SPA route — corrected to `/#about`. The `/walkthrough/` page linked a `JanVayu_Walkthrough_with_notes.pdf` that isn't in the repo — repointed to the committed `JanVayu_MMSF_Walkthrough.pdf`.
- **lychee config**: added `--root-dir` so valid root-relative links (`/`, `/blog/`, `/pm25/`, `/favicon.svg`…) resolve to files instead of erroring, and excluded `cpcb.nic.in` (a government site that reliably times out / blocks crawlers). Applied to both `link-audit.yml` and the advisory `ci.yml` pass.

## [v26.6.35] - 2026-06-25

### Changed — Urban Heat Island panel reframed (air-first, national)

- The panel now **leads with the air↔heat connection** — opening with "why does an air-quality platform map heat?" — instead of opening on Delhi temperatures. Fitting for JanVayu: heat and dirty air are framed as two sides of one problem from the first line.
- Reframed as a **national** problem (Mumbai, Hyderabad, Ahmedabad, Lucknow, Kanpur and every fast-building city); **Delhi is now explicitly the "worked example,"** not the headline.
- Moved the "How heat and air pollution are connected" card to be the **first** section (before the Delhi map), so the connection surfaces first structurally, not just in the intro.

## [v26.6.34] - 2026-06-25

### Fixed — broken weekly link-audit workflow (false "broken links" issues)

- The weekly link audit had been failing on every run because lychee v0.23 removed the `--exclude-mail` flag — the job errored *before checking any links*, then auto-filed a "broken links detected" issue. Removed the flag (mail is excluded by default) in both `link-audit.yml` and `ci.yml`, so link checking actually runs again. The ~7 existing audit issues were false alarms, not real broken links.

### Changed — backend maintenance

- **Node 20 → 22** (Node 20 reached end-of-life) across `netlify.toml` and all CI workflows; added an `engines.node >= 22` field.
- `resend` bumped to `^6.14.0`. `@netlify/blobs` (v8, two majors behind) left as tracked tech-debt for a deliberate, tested upgrade — it's the caching backbone, so not bumped blind.
- Bumped deprecated `actions/checkout@v4 → v6` in the link-audit workflow.

### Added

- Blog post: "Ask JanVayu Can Now Answer About Your Ward."

## [v26.6.33] - 2026-06-25

### Changed — Ask JanVayu model migration (Groq retirement)

- Groq is **retiring `llama-3.3-70b-versatile` on 16 Aug 2026**. Migrated all four AI functions (`air-query`, `health-advisory`, `accountability-brief`, `anomaly-check`) to the production replacement **`openai/gpt-oss-120b`**, now read from a `GROQ_MODEL` env var (default to the new model) so future swaps need no code change.
- Tuned for the reasoning model: `reasoning_effort: "low"`, higher `max_tokens` (it spends some budget thinking), longer timeouts, and a `message.reasoning` fallback when `content` is empty. The `GROQ_API_KEY` / WAQI tokens were verified working — this is purely the model retirement.
- Docs/UI updated to name the new model (README env-var table, docs AI-layer page + SUMMARY, in-app "what this bot can do"). Historical release-notes entries left as-is.

### Fixed — shipped merge-conflict markers

- Removed unresolved Git conflict markers that had been committed to `CITATION.cff` and **`ask/sw.js`** in an earlier rebase. The `ask/sw.js` markers were a real bug — they would break the Ask JanVayu PWA service worker on parse.

## [v26.6.32] - 2026-06-11

### Added — Ward Atlas: 4 more cities (now 14)

- Added **Kanpur (58 wards), Varanasi (99), Bhopal (86), Faridabad (40)** — bringing the atlas to **14 cities**, each with all four layers, and pulling it into the polluted Gangetic belt. All wired into the map dropdown and Ask JanVayu (`ward-stats.json`, 1,741 wards).
- Sources: DataMeet (Kanpur/Bhopal/Faridabad) and the official Varanasi Smart City ArcGIS server. Notes: Kanpur's file was in Web Mercator and was reprojected to EPSG:4326; Bhopal's ward names are the official Hindi names; Bhopal's heat layer covers 57/86 wards (it straddles a Landsat scene edge — air/green/built-up are full).
- Agra, Lucknow, Patna, Nagpur, Indore remain unavailable — no open, curl-verifiable ward-polygon files found.

## [v26.6.31] - 2026-06-11

### Added — Per-ward share cards + a methodology blog post

- **Share a ward**: tap any ward on the Ward Atlas map (or search / locate one) and a "Share ward" button generates a 1080×1080 PNG card — air-first (the ward's live PM2.5 estimate as the headline, heat / green / built-up as supporting context), with JanVayu branding and the map link. Uses the Web Share API on mobile, downloads on desktop.
- **Blog post**: "Live vs Annual: The Honest Version of How Polluted Is Your Ward?" — explains the live-snapshot-vs-annual-structure decision and the dropped seasonal-median experiment.
- Ask JanVayu: small refinement so "my ward" (without a named ward) returns the city's worst/cleanest-air wards and invites the user to name their ward or use the map's locate button.

### Tested and dropped — seasonal-median heat

- Evaluated replacing each city's single-day Landsat heat layer with a multi-scene summer **median** to cut noise. It did **not** improve the weak-signal city (Bengaluru's heat-vs-built-up correlation stayed ~0) and it **reduced ward coverage** (persistent cloud/edge gaps across all scenes left some wards blank). Kept the cleaner, full-coverage single-scene version. Documented as a negative result rather than shipping a regression.

## [v26.6.30] - 2026-06-18

### Added — Citizen Testimony: a multilingual wall of on-the-ground voices

A new **Citizen Testimony** panel (under *Take Action*) that puts lived experience of the air crisis front and centre, in the languages people actually speak.

- **100+ first-person testimonies** (108 at launch) across **86 cities** and **13 languages** — Hindi, English, Bengali, Tamil, Marathi, Telugu, Kannada, Gujarati, Punjabi, Malayalam, Odia, Urdu and Assamese — each non-English entry carrying an English translation so every voice is legible to every reader.
- **Language-filter chips** (with per-language counts), **free-text search** across city / state / name / quote, a live summary line (testimonies · cities · languages), and **RTL rendering** for Urdu.
- A clear **submission CTA** invites people to add their own testimony in any Indian language via `contribute@janvayu.in` to grow the archive.
- Wired through the full app: desktop + mobile nav, dashboard quick-link, in-app search index, and `data-i18n` nav labels (EN/HI/TA/MR/BN). Renders client-side from a bundled data array — zero new network calls.

## [v26.6.29] - 2026-06-11

### Changed — Ward Atlas: honest timescale separation (live air vs annual drivers)

Tightens a methodological mismatch: per-ward PM2.5 is a **live snapshot** (this hour, interpolated from sparse monitors + weather), while built-up / green / heat are **annual / structural**. Relating them causally on a per-hour basis isn't sound — a single hour's interpolated air is not driven by stable urban form.

- **Ask JanVayu**: instruction #17 now enforces a timescale rule — the model must NOT claim a ward's annual structure *causes* its live reading (no "88% built-up, so today's air is bad"). It keeps the two separate ("right now it's ~X µg/m³; structurally it's a dense, low-green ward that *tends* to have worse air over the year, though today's reading is driven by current conditions"), and notes the proper partner for annual structure — annual per-ward PM2.5 — is the data JanVayu doesn't have. The context block labels driver values as "annual structure (context only, not the cause of this hour's reading)".
- **Ward Atlas panel**: the air layer's explanation now carries a timescale note — the air is a live snapshot, the drivers are annual/structural, so the drivers explain a ward's *typical* air, not the exact hour.

## [v26.6.28] - 2026-06-11

### Changed — Ward Atlas made air-first (bot + panel)

JanVayu is an air-quality platform, so the Ward Atlas now leads with **air** everywhere; heat / green cover / built-up are framed as the *drivers* that explain a ward's air, never as standalone facts.

- **Ask JanVayu**: ward answers now lead with **per-ward PM2.5**, interpolated server-side from live CPCB/WAQI monitors to each ward centroid (worst-air / cleanest-air ward, citywide spread, named-ward air). Heat/green/built-up are woven in only as the "why". Crucially, the model is instructed to be **honest when the data doesn't fit** the textbook story — e.g. if the dirtiest-air ward today is a leafy fringe (driven by weather or a nearby source), say so rather than forcing the "built-up = dirty" narrative. Bundled `ward-stats.json` now carries ward centroids for the interpolation. Example chips reworded to air ("Which Delhi ward has the worst air?").
- **Ward Atlas panel**: intro reframed — air quality is the headline, the other three layers "shape that air". Each driver layer's explanation now states *why it's here* (heat → ozone + worse health hit; green → filters particulates + cools; built-up → traps pollutants + radiates heat), with the honest caveat that it's a typical/annual tendency, not a per-hour rule.

## [v26.6.27] - 2026-06-11

### Added — Ward Atlas data wired into Ask JanVayu

- The chatbot (`air-query.mjs`) can now answer **ward / neighbourhood-level** questions from the Ward Atlas: "which ward in Delhi is hottest / coolest / greenest / most built-up", and per-ward lookups ("how green is Ward 13 in Chandigarh"). A compact, geometry-free `ward-stats.json` (10 cities, 1,458 wards: heat, green %, built-up %) is bundled with the function; a `isWardQuery` detector + `buildWardContext` builder inject real per-ward numbers into the prompt, and a new system instruction (#17) tells the model to cite "JanVayu Ward Atlas".
- Per-ward **air quality** is intentionally not in the dataset (it's interpolated live on the map) — the bot points users to janvayu.in/#ward-map for ward air quality.
- Discoverability: a "Which Delhi ward is hottest?" example chip added to the in-page Ask panel and the `/ask/` PWA.

### Fixed

- Delhi ward data: one boundary feature had no name/number in the source (DataMeet) and displayed as "Ward None" on the map and in chatbot answers; relabelled to "Unnamed Ward".

## [v26.6.26] - 2026-06-11

### Added — Ward Atlas: 10th city (Chandigarh)

- **Chandigarh** (28 wards) added to the Ward-Level Atlas, bringing it to **10 cities**, each with all four layers. It is the greenest city in the atlas (median ward ~49% vegetation) — a contrast to the dense metros — and its live air layer draws on the wider tricity (Chandigarh / Mohali / Panchkula) monitors.

### Removed — roadmap items dropped (not feasible on open data)

- **Satellite-derived per-ward PM2.5** ([#149](https://github.com/JanVayu/JanVayu/issues/149), closed not-planned): no openly-fetchable ~1 km PM2.5 raster exists (ACAG is portal-gated; Planetary Computer hosts only Sentinel-3 aerosol optical depth, not a calibrated PM2.5 product). The air layer remains live-interpolated.
- **Surat ward map** ([#150](https://github.com/JanVayu/JanVayu/issues/150), closed not-planned): no open ward-boundary file exists. Chandigarh was added as the 10th city in its place.

### Fixed

- Ward map: the "How this is built" explanation could be blank on first paint of the default Air-quality layer if a non-critical UI step (touch-pan / search datalist) threw before the layer rendered. The layer now renders first and those enhancements run after, guarded; the air-layer explanation is also seeded into the template so it shows even before JS runs. Service-worker cache bumped to refresh returning visitors.
- Ward map mobile toolbar: the City label and "My ward" button collapsed into one-character-wide vertical columns on narrow screens. The toolbar row now wraps and the labels/buttons no longer shrink, so the controls lay out cleanly on phones.

## [v26.6.25] - 2026-06-11

### Added — Ward Atlas polish ([#151](https://github.com/JanVayu/JanVayu/issues/151))

- **Ward search + "My ward"**: type-ahead search (datalist of every ward name) zooms to and highlights the chosen ward; a geolocation button finds the nearest ward to the user.
- **Correlation view**: a per-ward scatter (Chart.js) of the active layer's metric vs how built-up the ward is (green uses built; built uses green), with the Pearson *r* and a plain-language read-out. Surfaces the heat-island relationship quantitatively — e.g. Delhi built-up vs surface temp *r* ≈ +0.69, green vs temp *r* ≈ −0.70 — and honestly reports weak/no correlation where it exists (e.g. Bengaluru ≈ 0).
- **Two-finger pan on touch**: the tall mobile ward map no longer traps page scroll — one finger scrolls the page, two fingers move the map, with an on-map hint.

### Notes — roadmap items still blocked on data

- **Satellite-derived per-ward PM2.5** ([#149](https://github.com/JanVayu/JanVayu/issues/149)) remains open: no openly-fetchable ~1 km PM2.5 raster (ACAG is behind a portal; Planetary Computer hosts only Sentinel-3 aerosol optical depth, not a calibrated PM2.5 product).
- **Surat** ([#150](https://github.com/JanVayu/JanVayu/issues/150)) remains open: no open ward-boundary file found.

## [v26.6.24] - 2026-06-11

### Added — Ward-Level Atlas ("How Polluted Is Your Ward?")

- **`tmpl-ward-map`** panel (City Data → "How Polluted Is Your Ward?"): a Leaflet choropleth colouring every municipal ward of a city, with a **four-layer toggle**:
  - **Air quality** — per-ward PM2.5 interpolated (inverse-distance weighted) from the city's live CPCB/WAQI monitors.
  - **Heat** — land-surface temperature from Landsat 8/9 (~30 m), a per-city clear-sky summer scene (via Microsoft Planetary Computer).
  - **Green cover** & **Built-up** — vegetation and impervious-surface share per ward from ESA WorldCover 2021 (10 m).
- **9 of India's top-10 cities**: Delhi (290 wards), Mumbai (227), Bengaluru (243), Chennai (201), Hyderabad (145), Kolkata (141), Jaipur (77), Pune (58), Ahmedabad (48). Ward boundaries simplified (shapely) and centroid-tagged; per-ward satellite values baked into bundled GeoJSON at `/data/wards/*.json`.
- Per-layer legend, tooltips, methodology note, and live "But…" statistics. The Heat layer surfaces the urban heat-island link — hottest vs coolest fifth of wards compared by built-up and green cover.
- Blog post: "A City Is Not One Number: Mapping India's Air Ward by Ward".

### Added — Urban Heat Island panel

- **`tmpl-urban-heat`** panel with Chart.js visual, integrated into Ask JanVayu's knowledge base and starter questions. Blog post: "The Same Sun, a Different City: Why Your Neighbourhood's Heat Is an Air-Quality Story".

### Fixed

- Ward map mobile layout: responsive `.ward-grid` / `.ward-canvas` / `.ward-toolbar` classes replacing an inline grid that broke (squished 2-column) on phones.

### Data pipelines

- Offline zonal statistics via **rasterio over remote cloud-optimized GeoTIFFs** (windowed reads only — no bulk downloads): ESA WorldCover (AWS S3) for green/built-up, USGS/NASA Landsat C2 L2 (Microsoft Planetary Computer, anonymous signing) for surface temperature.

### Changed — Documentation

- New roadmap phases (5.14 shipped, 11 planned) in `docs/wiki/Roadmap.md`; `README.md` feature table + Roadmap section; new `docs/data-sources/ward-map.md` (linked in `docs/SUMMARY.md`); About-panel roadmap card + data-source list refresh; roadmap issues [#149](https://github.com/JanVayu/JanVayu/issues/149)–[#151](https://github.com/JanVayu/JanVayu/issues/151).

## [v26.6.23] - 2026-05-27

### Added — New panels (Batch 1)

- **Understanding AQI** (`tmpl-aqi-explainer`): interactive breakdown of 6 criteria pollutants (PM2.5, PM10, NO2, SO2, O3, CO) with individual cards, CPCB vs US EPA AQI scale comparison table, and "Why PM2.5 isn't the whole story" section.
- **Shareable AQI Cards**: canvas-based PNG generator (1080x1080 Instagram, 1200x630 WhatsApp), color-coded by severity. Share buttons on dashboard, rankings, map popups, comparison cards. Web Share API on mobile.
- **Exposure Diary** (`tmpl-exposure-diary`): log daily routine (16 activities with calibrated PM2.5 multipliers), weighted daily exposure, cigarette equivalence, life-expectancy impact, stacked bar chart, personalized reduction tips, localStorage history.
- **Migration Comparison** (enhanced `tmpl-migration-calc`): replaced simple calculator with full side-by-side comparison — live AQI for both cities, 7-row table, source apportionment bar charts, verdict with life-years gained.

### Added — New panels + enhancements (Batch 2)

- **Data Source Selector** (`tmpl-source-selector`): educational panel on CPCB/WAQI/IQAir/Sensor.Community. Toggle switches, instrument/accuracy/coverage details, Source Impact Simulator.
- **City Policy Tracker** (`tmpl-city-policy`): 8-city NCAP target dashboard with expenditure tables, government action timeline, public feedback section, governance questions.
- **Enhanced Legal Framework**: state-wise court rulings (8 regions), Key Legal Rights summary (5 laws), "What Can I Do from Home?" 5-step citizen recourse guide with template letter.

### Changed — Role & navigation updates

- Split Citizen/Activist into two separate roles (now 12 roles total).
- Women & Air Quality renamed to **Women's Health** in nav.
- Nav label audit: 17 fixes (RTI footer link, cryptic labels, mismatches).

### Fixed

- Site-wide formatting sweep: 8 grid fixes + 2 table wraps.
- City Rankings table formatting fix.
- Rankings loading fix: fetch data if not ready on panel open.
- 9 broken Sargam icons replaced with working alternatives.

### Added — Content & docs

- Blog post: "The May 26 Overhaul: 21 Fixes in One Day".
- Updated walkthrough deck (65 slides, new PDF/PPTX/index.html).

### Changed — Version markers

- `package.json` 26.6.22 → **26.6.23**
- `CITATION.cff` 26.6.22 → **26.6.23**

## [v26.6.22] - 2026-05-26

### Added — Women & Air Quality panel

New `tmpl-gender` panel under Health & Trends covering the gendered burden of air pollution:
- **Indoor cooking exposure**: 70% of rural Indian women still cook with solid fuels (NFHS-5). 3-5 hours/day near chulha, PM2.5 levels 20-40× WHO guideline.
- **Maternal health**: Every +10 µg/m³ PM2.5 → 3-5% increase in preterm birth, 6-9% increase in low birth weight (Lancet Planetary Health 2023).
- **Mortality**: ~500,000 Indian women die annually from household air pollution; women represent ~60% of global HAP deaths (GBD 2021).
- **Occupational exposure**: Women in construction, brick kilns, street vending face sustained exposure without protection.
- **Gender data gap**: No CPCB indoor monitoring, health studies rarely disaggregate by gender.
- **Action items**: Complete LPG transition, workplace standards, gender-disaggregated surveillance.
- New "Woman / Caregiver" role in role selector with curated dashboard.
- Added to Health & Trends nav (desktop + mobile) and search index.

### Added — Historical data time-slider on map

- "History" toggle in map layer controls with month/year range slider (Jan 2024 → present).
- Fetches from `historical-aqi` function for 12 cities in parallel.
- Color-coded circle markers by PM2.5 level (green < 30 → purple 150+).
- In-memory cache, "Live" button to restore real-time, mobile-responsive.

### Changed — Version markers

- `package.json` 26.6.21 → **26.6.22**
- `CITATION.cff` 26.6.21 → **26.6.22**

## [v26.6.21] - 2026-05-26

### Added — Auto-update infrastructure (7 systems)

- **Version single-source script** (`scripts/bump-version.mjs`): Reads version from `package.json` and patches `CITATION.cff`, both service workers' cache names. Optional CLI arg to bump version. Runs automatically on every Netlify deploy via `netlify.toml` build command.
- **Sitemap auto-generation** (`scripts/build-sitemap.mjs`): Generates `sitemap.xml` with real lastmod dates from git history. Run via `npm run sitemap`.
- **Feed health monitoring** (`netlify/functions/feed-health.mjs`): Daily scheduled function that checks all 5 feed endpoints (Reddit, Twitter, Instagram, YouTube, News). Reports healthy/stale/broken feeds.
- **Translation key sync** (`scripts/translations.json` + `scripts/check-translations.mjs`): JSON map of UI terms across hi/bn/mr/ta. Checker script greps translated docs for stale English terms. Run via `npm run check:translations`.
- **Data-stat system** (`scripts/stats.json` + `data-stat` attributes in `index.html`): Canonical stats JSON as single source of truth for key dashboard numbers (1.72M deaths, $339.4B cost, etc.). Dashboard elements tagged with `data-stat` attributes, auto-patched on page load.
- **Reference data endpoint** (`netlify/functions/reference-data.mjs` + `netlify/functions/data/reference-data.json`): CPCB station counts, NCAP data, IQAir annual figures extracted to editable JSON. Serves via `/.netlify/functions/reference-data` with caching.
- **Zotero → Reading List** (`netlify/functions/zotero-library.mjs`): Fetches from public Zotero API, caches in Netlify Blobs (6hr TTL). Returns simplified card format for the Reading List panel.

### Changed — Version markers

- `package.json` 26.6.20 → **26.6.21**
- `CITATION.cff` 26.6.20 → **26.6.21**
- Service worker cache names auto-synced via bump-version.mjs

## [v26.6.20] - 2026-05-26

### Fixed — Chatbot accuracy (user feedback from Komal)

- **Patna station count**: Added `CPCB_STATION_DATA` with per-city CAAQMS vs manual bifurcation for 27 cities. Patna now correctly reports 7 total = 3 CAAQMS (IGSC Planetarium, Muradpur, Samanpura) + 4 manual. System prompt instruction #13 rewritten to require bifurcated reporting.
- **Delhi Mandir Marg bias**: Generic "how is the air quality" queries now auto-fetch all WAQI stations via `fetchCityStations()` and present a city-wide AQI range (min–max + average) instead of just the nearest station to centroid.
- **Low-cost sensor detection**: `isHyperlocalQuery()` regex expanded to match "low cost sensors in [city]" patterns that were previously missed.
- **Service worker cache**: Bumped `ask-janvayu-20260520-v3` → `ask-janvayu-20260526-v4` so returning visitors pick up the new HTML with feedback buttons.

### Changed — Navigation reorganized (intent-based)

Old structure (data-type grouping, Resources had 16 items):
- Dashboard | Data & Health (5) | Monitoring (7) | Accountability (8) | Action (7) | Resources (16)

New structure (intent-based, max 8 per group):
- Dashboard | **My Air (7)** | City Data (6) | Health & Trends (6) | Accountability (8) | Take Action (8) | Resources (8)

Key moves:
- New "My Air" tab surfaces personal tools first (Ask JanVayu AI, Should I Go Outside, AQI Alerts, Exposure Report, School Closures, Purifier Calculator, Migration Calculator).
- RTI Assistant: Resources → Take Action (it's an action, not reference).
- Correlations: Monitoring → Health & Trends (analytical context).
- Pollution Calendar: Resources → City Data (city-specific).
- Social Media Feed + Live News: Monitoring → Resources (reference material).
- All 43 panels preserved — zero functionality removed.

### Changed — Renames for clarity

- "Hyperlocal" → **My Neighbourhood**
- "Policy Effectiveness" → **Policy Tracker**
- "Research Library" → **Reading List** (in-app curated panel)
- "Zotero Research Library" → **Full Bibliography (Zotero)** (external academic citation)

### Added — Feedback UI on chatbot

- Thumbs up/down buttons on every AI response in `/ask/` PWA.
- Feedback stored in localStorage (question, city, timestamp, vote) for accuracy tracking.

### Added — City bar expanded

- City chip selector expanded from 10 to all 33 backend-supported cities.
- Bar is horizontally scrollable — no extra vertical space taken.

### Changed — Version markers

- `package.json` 26.6.19 → **26.6.20**
- `CITATION.cff` 26.6.19 → **26.6.20**
- i18n updated for en, hi, ta, mr, bn across all nav labels and group names.

## [v26.6.19] - 2026-05-20

### Fixed — In-page Ask JanVayu widget (separate from /ask/ PWA) was unchanged

User pointed to a screenshot showing the **in-page Ask JanVayu panel** at `tmpl-ask-janvayu` (accessible via the dashboard nav) still displaying the pre-v26.6.x text: *"Ask any question about air quality in your city. Get answers grounded in live data, in English or Hindi."*

v26.6.18 had updated the standalone `/ask/` PWA but the in-page widget inside `index.html` is a **separate UI surface** that I missed. Both share the name but they're distinct templates. Fixed now.

#### In-page widget rewritten

- **Section intro paragraph**: from "Ask any question..." to the full v26.6.x capability statement (live AQI, calculators, rankings, trends, apportionment, RTI drafts, multi-source reliability, source citation on every number).
- **Language list** explicitly named (English, हिन्दी, தமிழ், বাংলা, मराठी, తెలుగు, ગુજરાતી, ಕನ್ನಡ, മലയാളം, ਪੰਜਾਬੀ) — was "English or Hindi" before.
- **10 example chips** added in a green-accent info-box: tap any chip to load the question into the input. Same chip list as the `/ask/` PWA (jogging, top-5 worst, transport exposure, apportionment, RTI, reliability, cigarettes, trend, migration, comparison).
- **New language dropdown** in the question form so users can pick the response language explicitly. Defaults to English. All 10 languages selectable.
- **"How it works" rewritten** to describe what the bot actually does — 4 data fetches (WAQI live + WAQI bounds + community sensors + IQAir cached annual), 7 calculators, 6 RTI templates, source citation requirement, national framing for topical queries. Plus a pointer to `/ask/` for the full chat experience with history + PWA install.
- **Placeholder text** updated from the Delhi-specific phrasing to a generic capability hint.

#### Wiring

- `submitAirQuery()` now reads the new `#ask-lang` dropdown and passes `lang` to the function call, so the existing 10-language Groq pinning works.
- New `loadAskChip(text)` helper (exposed on `window`) fills the input when a chip is tapped, then focuses — does NOT auto-submit so the user can change city/language first.

### Changed — Version markers

- `package.json` 26.6.18 → **26.6.19**
- `CITATION.cff` 26.6.18 → **26.6.19**

## [v26.6.18] - 2026-05-20

### Changed — Ask JanVayu onboarding refresh + 5 new languages

User feedback after testing the live chatbot:
> *"I am not seeing any overlap or instruction on Ask JanVayu section with types of questions to ask. Also I see the explanation for what Ask JanVayu does is the same. Also why don't we support more languages — why only English and Hindi?"*

All three fixed.

#### Welcome subtitle rewritten — surfaces what the bot can actually do

Was generic across all 5 languages: *"Ask about air quality, health risks, pollution sources, or government action in any Indian city."*

Now reflects the v26.6.x Phase A–D capabilities, in EN:
> "Live AQI · health & exposure calculators · city rankings & trends · source apportionment · RTI drafts · multi-source reliability checks. Every answer cites a primary source (CPCB, IQAir, Lancet Countdown, AQLI, CREA, Sensor.Community)."

Mirrored across all 10 supported languages.

#### Suggestion chips refreshed — 10 instead of 7, showcasing new capabilities

The chip list previously showed 7 city-specific health/lifestyle examples that didn't hint at rankings, RTI drafting, apportionment, trend, multi-source, or migration. New chip list covers the breadth:

1. "Should I go jogging today?" — health
2. **"Top 5 worst Indian cities right now"** — Phase A ranking
3. "I commute 2 hours by auto — what's my PM2.5 exposure?" — Phase B transport calculator
4. "Compare Delhi vs Bangalore air quality" — multi-city
5. **"Where does the pollution in Patna come from?"** — Phase C apportionment
6. **"Draft an RTI about brick kilns near my school"** — Phase C RTI template
7. **"How reliable is today's AQI reading?"** — Phase D multi-source spread
8. **"How many cigarettes equivalent am I smoking today?"** — Phase B cigarette calculator
9. **"Has Mumbai air gotten worse since 2019?"** — Phase A trend
10. **"Should I move from Delhi to Bangalore?"** — Phase B migration calculator

The 6 bolded chips are new — they exercise capabilities the chatbot shipped between v26.6.12 and v26.6.17.

#### Five new languages added — total now 10

The language picker had EN/HI/TA/BN/MR (English, Hindi, Tamil, Bengali, Marathi). User asked *"why not more?"* — fair point. Added:

| Code | Language | Script | Speakers |
|------|----------|--------|----------|
| `te` | Telugu | తె (Telugu script) | ~83M (4th most-spoken in India) |
| `gu` | Gujarati | ગુ (Gujarati script) | ~56M |
| `kn` | Kannada | ಕ (Kannada script) | ~44M |
| `ml` | Malayalam | മ (Malayalam script) | ~35M |
| `pa` | Punjabi | ਪੰ (Gurmukhi script) | ~33M |

Each language gets the full I18N entry: title, subtitle, welcome heading, welcome subtitle, 10 suggestion chips, input placeholder, install prompts, error messages.

Backend (`netlify/functions/air-query.mjs`) `LANG_NAMES` map extended with the 5 new entries so the Groq Llama 3.3 70B response-language pinning (the "CRITICAL — RESPONSE LANGUAGE" instruction in the system prompt) works for all 10.

Combined with the existing 5, this covers **the 10 most-spoken languages of India** by mother-tongue speaker count — together ~95% of the population's mother tongues.

#### Service worker cache bumped

`ask-janvayu-20260520` → `ask-janvayu-20260520-v3` so returning visitors pick up the new welcome text + suggestion chips + language options rather than getting the cached v26.6.0 shell.

### Verified

- `node --check air-query.mjs` passes
- All 10 I18N entries present with all required fields
- 10 lang picker options

### Changed — Version markers

- `package.json` 26.6.17 → **26.6.18**
- `CITATION.cff` 26.6.17 → **26.6.18**

## [v26.6.17] - 2026-05-20

### Fixed — Two bugs from live integration testing

After Phase D merged, integration testing exercised 9 representative queries against the live endpoint. Two bugs surfaced:

**Bug 1 — Rankings stripped city names.** `rankings.mjs` returns each city as `{key, name, aqi, pm25}` but the Phase A integration code in `air-query.mjs` used `c.city` (undefined). The LLM saw "undefined (PM2.5 174 µg/m³)" and summarised as "A city with PM2.5 174 µg/m³" — no name. Fixed: `c.name || c.city || c.key`.

**Bug 2 — Empty Groq responses returned "No response generated."** Now the fallback surfaces live data + Groq error message + retry hint, and the raw Groq response is logged for diagnostics.

### Verified

8 queries end-to-end against the live endpoint — live AQI, station count, ranking, national/topical, migration, RTI, multi-source spread, cigarette equivalence — all returning useful, sourced answers.

### Changed — Version markers

- `package.json` 26.6.16 → **26.6.17**
- `CITATION.cff` 26.6.16 → **26.6.17**

## [v26.6.16] - 2026-05-20

### Added — Ask JanVayu Phase D: multi-source spread + divergence flagging

**Final phase** of the Ask JanVayu upgrade. Cross-references four sources (WAQI nearest, WAQI bounds-network, Sensor.Community, IQAir 2025 cached annual) and surfaces three diagnostics:

- Intra-city spatial spread (>2× station-AQI range flagged WIDE)
- Snapshot agreement between WAQI and community sensors (>50% diff flagged WIDE)
- Today-vs-baseline anomaly (live PM2.5 vs IQAir 2025 annual; >1.5× or <0.5× flagged)

`IQAIR_2025_ANNUAL` cached for 37 Indian cities. Always-on anomaly note injected on any query when today's live PM2.5 is notably off baseline.

### Cumulative across Phases A → D

- 4 internal tools wired (rankings, historical, sensors, station-bounds)
- 7 deterministic calculators (cigarette, mortality, life-expectancy, migration, transport, purifier, school-closure)
- 10 cities' source apportionment with primary-source citations
- 6 RTI templates with correct PIO + statutory anchors
- 4-source cross-reference + divergence flagging
- Source citation required on every number

### Changed — Version markers

- `package.json` 26.6.15 → **26.6.16**
- `CITATION.cff` 26.6.15 → **26.6.16**
- `index.html` About-panel footer ribbon + on-page Version History card refreshed

## [v26.6.15] - 2026-05-20

### Added — Ask JanVayu Phase C: source apportionment + RTI drafting

**Apportionment.** New `APPORTIONMENT` dataset covers 10 cities (Delhi, Mumbai, Bengaluru, Kolkata, Chennai, Lucknow, Patna, Pune, Varanasi, Ahmedabad) with PM2.5 source-mix percentages, each carrying a primary-source citation (CEEW 2024, TERI/ARAI/IIT-Delhi DSS, CSIR-NEERI, Bose Institute, etc.) and a seasonal note. National fallback for un-indexed cities (CEEW 2024 synthesis).

Triggered by `isApportionmentQuery()`: *"sources of pollution"*, *"where does the pollution come from"*, *"main source"*, *"source mix"*, *"breakdown"*, *"dominant source"*, *"how much is from vehicles/industry/biomass"*.

**RTI drafting.** Six properly-formatted templates the bot renders inline:

| Key | Topic | Department |
|-----|-------|------------|
| `station_data` | Monitoring stations / sensors | CPCB PIO, Parivesh Bhawan |
| `ncap_funds` | NCAP utilisation / tenders | State PCB |
| `industry_compliance` | Brick kilns / industries / CEMS / FGD | State PCB Regional |
| `grap_enforcement` | GRAP / construction ban / vehicle impound | CAQM PIO |
| `school_closure` | School-closure records | State Dept of Education |
| `health_burden` | Hospital admissions / surveillance | State Dept of Health |

Each template has 5 pre-formatted questions + statutory anchors + 30-day response window note. Instruction #15 tells the LLM to present AS-IS without paraphrasing.

### Changed — Version markers

- `package.json` 26.6.14 → **26.6.15**
- `CITATION.cff` 26.6.14 → **26.6.15**
- `index.html` About-panel footer ribbon + on-page Version History card refreshed

## [v26.6.14] - 2026-05-20

### Added — Ask JanVayu Phase B: calculators the bot actually runs

Seven deterministic calculators wired in. Each runs when the question implies it, returns its result tagged `(computed)` with a primary-source citation, and Instruction #14 tells the LLM to use those numbers verbatim.

| Calculator | Trigger | Formula | Source |
|------------|---------|---------|--------|
| Cigarette equivalence | cigarette / smoke / cig | `cigs/day = PM2.5 / 22` | Berkeley Earth |
| Mortality risk | mortality / risk / hazard | `(PM2.5−5)/10 × 8.6%` | Krishna et al. 2024, Lancet Planetary Health |
| Life-expectancy loss | life expectancy / AQLI / years lost | `(PM2.5−5)/10 × 0.98 yr` | AQLI 2025 |
| Migration benefit | should I move / moving from X to Y | Δ LE + Δ cigarette-days using LIVE PM2.5 of both cities | AQLI + Berkeley Earth |
| Transport exposure | by auto/cab/cycle/metro + N hours | `local PM2.5 = ambient × mode mult` + cig-equivalent for window | WHO/CPCB exposure |
| Purifier CADR | purifier + N sqft | `CADR (CFM) = sqft × 9 × 5 / 60` | AHAM CADR formula |
| School closure | school closure / will schools close | GRAP III @ 401, IV @ 451 | CAQM GRAP framework |

Input extraction: transport mode + hours from "2 hours by auto-rickshaw"; room sqft from "300 sqft"; destination city matched against CITIES dictionary + bengaluru alias.

### Changed — Version markers

- `package.json` 26.6.13 → **26.6.14**
- `CITATION.cff` 26.6.13 → **26.6.14**
- `index.html` About-panel footer ribbon + on-page Version History card refreshed

## [v26.6.13] - 2026-05-20

### Added — Ask JanVayu Phase A: tool wiring + methodology calibration

User direction after v26.6.12: *"What other broad queries can make the chatbot useful? It should surface and use all of the JanVayu tools. Responses must be calibrated across multiple sources and be better than the average chatbot."*

This release is **Phase A** of a four-phase upgrade. Three new internal tool calls wired in (each behind a query detector, all running in parallel) plus a methodology block in every system prompt so the LLM can explain why CPCB ≠ WAQI ≠ IQAir.

#### Wired in: three tool calls

| Detector | Trigger phrases | Tool | Injects into LLM context |
|----------|-----------------|------|--------------------------|
| `isRankingQuery` | top N worst, cleanest, most polluted, leaderboard, which city is worst/best | `rankings.mjs?range=live\|7d\|30d` | Top 5 worst + 5 cleanest cities with live PM2.5/AQI |
| `isTrendQuery` | trend, history, over time, past year, since 20XX, getting better/worse, YoY | `historical-aqi.mjs?city=&month=` | Year-by-year PM2.5 series for user's city + current month |
| `isHyperlocalQuery` | my area/colony/ward, near me, hyperlocal, community sensor, street level | `community-sensors.mjs?lat=&lon=&radius=25` | Up to 5 nearest Sensor.Community sensors |

All three run via `Promise.all` after the WAQI live fetch with 6 s timeouts. Failures are graceful.

#### `METHODOLOGY_REFERENCE` block

Covers five "why do two sources disagree?" cases: CPCB Indian AQI vs US EPA AQI (same µg/m³, different scale); WAQI single-station vs CPCB CAAQMS network; CPCB annual vs IQAir World AQ Report; Krishna 1.5M causal vs Lancet Countdown 1.72M synthesis; low-cost vs regulatory-grade trade-offs.

#### Coming

- **Phase B**: GEMM exposure calculator, migration calculator, school-closure predictor, cigarette-equivalence — bot *executes* these.
- **Phase C**: New `apportionment.mjs` (CEEW 2024); RTI Assistant as a callable tool.
- **Phase D**: Multi-source spread — WAQI + community-sensors + IQAir-cached + CPCB-direct cross-fetch with divergence flagging.

### Changed — Version markers

- `package.json` 26.6.12 → **26.6.13**
- `CITATION.cff` 26.6.12 → **26.6.13**
- `index.html` About-panel footer ribbon and on-page Version History card refreshed

## [v26.6.12] - 2026-05-20

### Fixed — Ask JanVayu: three real bugs from user testing

User feedback after using `/ask/` in production:

> *"Chatbot — does not give number of station data correctly, no sources are mentioned in some answers (low cost sensors, EVs), for most questions I just got Delhi based information (mandir marg data)."*

All three issues were genuine bugs in `netlify/functions/air-query.mjs`. Fixed below.

#### Bug 1 — Station-count questions returned guesses

The function only fetched a **single station** for the user's city via the WAQI `geo:` endpoint (which returns the nearest station to the city centroid). When asked "how many CAAQMS stations does Delhi have?", the Llama model had no station-count data in its context and made up an answer.

**Fix.** New `fetchCityStations(cityKey)` helper hits the WAQI `map/bounds/` endpoint with a ~0.5° box (~50 km wide) around the city centroid and returns the indexed-station list. Triggered when `isStationCountQuery(question)` matches phrases like *"how many stations"*, *"number of monitoring stations"*, *"station count"*, *"how many sensors/monitors"*. The fetched count and a sample of station names are injected into the `dataContext` block sent to Groq. A national reference is also added: *"CPCB CAAQMS national total is ~533 stations across ~250 Indian cities (CPCB Annual Report). Sensor.Community runs ~3,000+ low-cost community sensors nationwide."*

#### Bug 2 — No sources cited in topical answers

The system prompt mentioned canonical reference data (Lancet Countdown, IQAir, CREA) but never **required** the model to cite the source of any number it gave. Topical answers about low-cost sensors, EVs, BS-VI etc. came out as generic prose with no provenance.

**Fix.** Two changes to `buildSystemPrompt()`:

1. New **`TOPICAL_REFERENCE`** block injected into every system prompt — covers the monitoring network (CPCB CAAQMS ~533 stations, WAQI subset, Sensor.Community ~3,000+ low-cost sensors, CAG April 2025 audit finding 88% had data-quality issues), low-cost sensors (Sensor.Community CC0, IQAir commercial, OpenAQ aggregators), EVs & transport (BS-VI from Apr 2020, PM-eBus Sewa ₹20,000 Cr / 10,000 buses by 2026, FAME-II→E-DRIVE, Delhi 4,286 e-buses Feb 2026, 8,849 charging stations Dec 2025), and recent Apr–May 2026 policy moves (CAQM off-season GRAP, NGT south-India order, NGT SPCB diesel-genset notices, NCAP deadline elapsed, 15th FC cliff).
2. New **Instruction #11**: *"ALWAYS cite the source for any specific number or claim. Use the formats: 'per CREA Jan 2026', 'IQAir 2025', 'Lancet Countdown 2025', 'CPCB CAAQMS', 'Sensor.Community', 'CAG April 2025 audit', 'CSE April 2026', 'NGT order Apr 2026', etc. **If you cite a number without a source, you have failed.**"*

#### Bug 3 — Delhi / Mandir Marg dominance on topical questions

Mandir Marg is the CPCB station nearest to Delhi's centroid (28.6139, 77.2090); the WAQI `geo:` endpoint always returned it for Delhi. The system prompt also led with Delhi-specific reference text ("Most polluted capital globally", "₹300 Cr pollution budget"). When users asked **national topical questions** (EVs, low-cost sensors, NCAP), the model fell back to Delhi context because that was the heaviest signal in the prompt.

**Fix.** Two changes:

1. New **`isNationalQuery(question)`** detector matches phrases like *"India(n)"*, *"nationwide"*, *"across cities"*, *"BS-VI"*, *"e-bus / electric vehicle"*, *"low-cost sensor"*, *"community sensor"*, *"FAME"*, *"PM-eBus"*, *"CAAQMS"*, *"CPCB"*, *"how many stations/sensors/monitors"*. When matched, the system prompt gains a hard instruction: *"IMPORTANT — NATIONAL/TOPICAL QUERY: The user's question is about an India-wide topic… Frame your answer for India broadly. Do NOT default to Delhi-specific or single-station (e.g. Mandir Marg) context."*
2. **KEY REFERENCE DATA block** restructured to lead with India-wide figures (NAAQS, India average PM2.5, Lancet Countdown national death toll, NCAP national outcome, AQLI national life-expectancy loss, Loni #1) rather than Delhi-first framing. Delhi is now just one example, not the anchor.
3. The single-station context now reads "**Nearest WAQI station**: …" (was "Station: …") so it's clear to the model that the value is one station, not "the city's data".

### Verified

- `node --check netlify/functions/air-query.mjs` → Syntax OK
- New `fetchCityStations()` uses the same WAQI token and timeout pattern as the existing `fetchCityAQI()` — no new auth surface
- `isStationCountQuery()` and `isNationalQuery()` regexes tested against the canonical bug examples (low-cost sensors / EVs / monitoring stations) — all match correctly
- `TOPICAL_REFERENCE` block is ~300 words; well within Groq's context window even with the existing prompt and live data context

### Changed — Version markers

- `package.json` 26.6.11 → **26.6.12**
- `CITATION.cff` 26.6.11 → **26.6.12**
- `index.html` About-panel footer ribbon and on-page Version History card refreshed

## [v26.6.11] - 2026-05-20

### Added — Feature the new /walkthrough/ page on the dashboard

The `/walkthrough/` page shipped in the previous (unversioned) commit, surfaced only via a footer link. This release features it prominently on the dashboard and updates the hero alert + Roadmap + wiki Home to reference it.

#### Dashboard quick-link card

A new **"Walkthrough"** quick-link card has been added to the dashboard's `.grid-4` quick-links row, sitting next to "Learning Games":

- Amber accent (`#FEF3C7` / `#B45309`) to differentiate from the green Learning Games card and the existing red/blue/green role-specific cards
- **NEW badge** in the heading
- Description: "64-slide guided tour (MMSF Fellows deck)"
- Links to `/walkthrough/` (target is a separate static page; opens in same tab, with a Back-to-JanVayu link at the top of the walkthrough page itself)

#### Hero alert addition

The "May 2026:" hero alert previously closed with the games-panel mention. Now extends to: "*…and a 64-slide guided walkthrough of the whole platform built for the MMSF Fellows cohort.*" — so first-time visitors see the walkthrough exists.

#### Roadmap update

`docs/wiki/Roadmap.md` gets a new bullet under Phase 5.9 (May 20 Polish) listing the walkthrough page.

#### Wiki Home update

`docs/wiki/Home.md` "What's New (v26.6.x)" section gets a v26.6.10 → v26.6.11 entry noting the walkthrough.

### Changed — Version markers

- `package.json` 26.6.10 → **26.6.11**
- `CITATION.cff` 26.6.10 → **26.6.11**
- `index.html` About-panel footer ribbon and on-page Version History card refreshed

## [v26.6.10] - 2026-05-20

### Fixed — Temporal-framing mismatches (same class of bug as v26.6.9)

User feedback after the v26.6.9 IQAir-framing fix: *"Go through and look for instances like this"*. A focused Explore-agent audit found **8 more sentences** with the same problem — action verbs implying recent discovery paired with year-only citations whose source dates are months/years old. All fixed below.

The pattern: phrases like *"PNAS (2024) **shows**…"* or *"Lancet Respiratory Medicine (2023) **found**…"* read as if the discovery is current — but a paper that appeared anywhere in calendar-year 2024 is now 5–17 months old, and a 2023 paper is 17–29 months old. Fixed by switching to "*A 2023 study in X documented…*" or "*Research published in X in 2024…*" framing that makes the publication vintage explicit.

#### `index.html` — seven fixes

| Where | Before | After |
|-------|--------|-------|
| Children's Health (line 12402) | "Lancet Respiratory Medicine (2023) **found** that children…" | "A 2023 study in *Lancet Respiratory Medicine* **documented** that children…" |
| Children's Health (line 12403) | "Studies in PNAS (2024) **show** PM2.5 exposure…" | "Research published in *PNAS* in 2024 **documented** that PM2.5 exposure…" |
| Mission Tracker (line 12552) | "Guttikunda et al. (2024) **found** PM10 concentrations showed 'no change in the fraction…'" | "Guttikunda et al.'s 2024 analysis (examining 2019–2023 data) **documented** 'no change in the fraction…'" |
| Clean Air Wins honest caveat (line 13235) | "Guttikunda et al. (2024) **found** 'no change…' … Cities like Surat **won** national awards but their monitoring stations **don't work** (The Plank, 2025)" | "Guttikunda et al.'s 2024 analysis of 2019–2023 data documented 'no change…' … The Plank **reported in 2025** that cities like Surat won national clean-air awards while their monitoring stations were non-functional" |
| Clean Air Wins citizen advocacy (line 13269) | "This grassroots advocacy, **documented by** Policy Circle (Sep 2025), **shows** how…" | "Policy Circle documented the campaign in September 2025: **an example of how** informed citizens can redirect infrastructure spending…" |
| Policy Effectiveness public comment study (line 13307) | "A PMC study (2023) **confirmed** that CAQM's Supreme Court-mandated open public comment process actually influenced policy" | "A 2023 study published in PMC **analysed** CAQM's Supreme Court-mandated open public comment process **and documented that it actually influenced policy**" |
| Jeopardy (line 15395) | "TERI 2023 source apportionment for Delhi **found** road dust + non-exhaust contributing 30-40%…" | "TERI's 2023 source apportionment study for Delhi **quantified** road dust and non-exhaust contributions at 30-40%…" |
| Jeopardy (line 15402) | "Karolinska 2024 and Harvard MAPLE-MIA studies **show** neuro and cardiovascular pathways" | "**2024 research from Karolinska and Harvard's MAPLE-MIA studies has documented** neuro and cardiovascular pathways" |

#### `blog/posts/2026-04-01-children-air-pollution.md` — two fixes

| Where | Before | After |
|-------|--------|-------|
| Line 21 | "A working paper from the Institute of Economic Growth in Delhi **found** measurable effects…" | "A working paper from the Institute of Economic Growth in Delhi **(Greenstone, Hanna et al., 2021) documented** measurable effects…" — adds the missing publication year |
| Line 33 | "Vital Strategies **reported** that **new research** links air pollution…" | "**Vital Strategies' 2023 analysis** (\"Air pollution hinders childhood development\") **found** that air pollution affects childhood development…" — replaces vague "new research" with the actual 2023 publication date |

The Global Burden of Disease line on the same blog post also gained a vintage hint: "**most recent India estimate, 2021 cycle**" so readers don't read the 2017 mortality figure as fresh.

### Why this matters

The JanVayu positioning is **archive and accountability** — a "permanent public record". The site has to be honest about *when* each finding entered the record, not just *what* the finding is. The previous phrasing made every cited study feel like it had just landed, which weakens the reader's trust in everything else on the page.

### Changed — Version markers

- `package.json` 26.6.9 → **26.6.10**
- `CITATION.cff` 26.6.9 → **26.6.10**
- `index.html` About-panel footer ribbon and on-page Version History card refreshed

## [v26.6.9] - 2026-05-20

### Fixed — Hero alert IQAir 2025 framing was confusing

User feedback: *"May 2026: IQAir 2025 confirms... — This is the box. It quotes IQAIR 2025?!"*

The hero alert read **"May 2026: IQAir 2025 confirms Loni..."** which was genuinely confusing — it implied that IQAir 2025 had just been published, when in reality the IQAir World Air Quality Report 2025 was published in March 2025 and covers calendar-year 2024 data. By 20 May 2026 that report is ~14 months old, and the next edition (IQAir 2026, covering 2025 data) was not yet available at the time of this commit.

#### Hero alert (`#section-dashboard`)

Reframed to be honest about data vintage AND to surface the most-current items first:

| | Before | After |
|---|---|---|
| **Opener** | "**May 2026:** IQAir 2025 confirms Loni..." | "**May 2026:** India's air remains in crisis. The most recent IQAir World Air Quality Report (the 2025 edition, published March 2025 covering 2024 data) ranks **Loni, India** as the most polluted city on Earth..." |
| **Lancet attribution** | "The Lancet Countdown 2025 attributes 1.72 million..." | "The Lancet Countdown 2025 (**launched May 2026**) attributes 1.72 million..." |
| **NCAP deadline** | "NCAP's 2026 deadline has arrived with most cities far from targets" | "NCAP's 31 March 2026 deadline **has elapsed**: only 23 of 100 cities with sufficient data hit the target (CREA Jan 2026); CSE's April 2026 five-year review counts 37 of 131" |
| **New addition** | (none) | "CAQM invoked Stage-I GRAP off-season for the first time on 19 May 2026, signalling year-round enforcement" |

Now the user can see at a glance which numbers are recent (Lancet Countdown launched this month; CAQM order from yesterday) versus which are last year's (IQAir 2025) — and exactly *why*.

#### "Did You Know" dashboard strip

Two related fixes:

- **Strip header** — "Six India-specific facts updated for May 2026 · sourced" implied the underlying *figures* were updated for May 2026. Reworded: "Six sourced India-specific facts · figures are the most recent published values from each source (Lancet Countdown 2025, IQAir 2025, AQLI 2025, CSE 2026, Krishna et al. 2024)" — the framing now matches the reality (we surface the freshest values from each canonical source).
- **Loni card source citation** — "IQAir 2025." → "IQAir World Air Quality Report 2025 (covering 2024 data; the most recent annual)." Same fix as the hero, applied to the standalone card.

### Changed — Version markers

- `package.json` 26.6.8 → **26.6.9**
- `CITATION.cff` 26.6.8 → **26.6.9**
- `index.html` About-panel footer ribbon and on-page Version History card refreshed

## [v26.6.8] - 2026-05-20

### Changed — Final corners: wiki Home, last small surfaces

User feedback: *"Yes I want you to do all small or big. Everything."* Final pass on the smallest remaining surfaces from the v26.6.7 stocktake. Audit confirmed most are already clean.

#### `docs/wiki/Home.md` — "What's New" rewritten for the v26.6.x cycle

The wiki landing page's "What's New" section was anchored to v26.5.x (May 2026 cycle, when v26.5.6 was the latest). It now leads with the v26.6.x ship list:

- **v26.6.7** — Deep sweep (every outbound HTTP request now reports v26.6; English + 3 translated docs Delhi PM2.5 aligned to IQAir 2025)
- **v26.6.6** — Secondary surface sweep (pollutant pages regenerated, root SW cache bumped, 4 blog posts realigned)
- **v26.6.5** — Complete panel content freshness sweep (every remaining panel template)
- **v26.6.4** — Top-five panel freshness (Clean Air Wins / Budget / Mission Tracker / Children / Political Accountability)
- **v26.6.3** — Back-to-home button visibility patch
- **v26.6.2** — Audit sweep + Resources + stale stats
- **v26.6.1** — Back-to-home floating button
- **v26.6.0** — Vayu Junction (7th learning game) + Ask JanVayu verification + Roadmap restructure

The v26.5.x history is preserved below the new section as **"Previous (v26.5.x — May 2026)"**.

### Verified clean — no edits needed

- **`docs/wiki/Adding-a-New-Panel.md`, `Adding-a-New-Role.md`, `Role-Based-Landing-Page.md`, `Simple-Language-Mode.md`, `Translation-Guide.md`** — contributor-facing how-to docs; no stat references; no version markers visible to end users
- **`TerraStudioCollab/index.html`** — gated internal page for the Terra.Do studio collab; no stale stats, no version markers in body
- **`downloads/index.html`** — file listing page; no stats; the underlying PDFs/PPTX are historical documents and properly dated
- **`manifest.json`** (root) — current
- **`robots.txt`** — current
- **`netlify.toml`** — cron schedules and redirects current
- **`.github/workflows/`** (9 yml files) — all current; advisory CI from v26.5.x
- **GitHub Discussions seed text** — none stored in the repo; lives on the GitHub Discussions UI

### What's now complete

After v26.6.0 → v26.6.8, **every meaningful user-facing and developer-facing surface** in the JanVayu repository has been swept for May-2026 freshness:

- ✅ All 43 panel templates in `index.html` (content + version markers + click-through verified)
- ✅ Ask JanVayu PWA (all 5 languages)
- ✅ Vayu Junction game (new) + 6 existing games
- ✅ Back-to-home floating button
- ✅ All 19 Netlify Functions (UAs, code health)
- ✅ Both service workers (root + `/ask/`)
- ✅ Six per-pollutant SEO pages (regenerated)
- ✅ Two embed widgets
- ✅ Daily email digest
- ✅ All 10 blog posts (stat alignment) + 1 new blog post
- ✅ Resources panel + Latest Research card relabel
- ✅ `docs/` in 5 languages (READMEs + key sub-pages)
- ✅ Wiki: Home + Roadmap (restructured)
- ✅ Per-language sidebars + learning-games.md in 5 languages
- ✅ SEO meta description + Twitter Card
- ✅ All version markers (package.json, CITATION.cff, sitemap.xml, footer ribbon, on-page changelog)
- ✅ CHANGELOG.md — eight new entries (v26.6.0 → v26.6.8)
- ✅ ImpactMojo docs confirmed as a separate project (no audit needed)

### Changed — Version markers

- `package.json` 26.6.7 → **26.6.8**
- `CITATION.cff` 26.6.7 → **26.6.8**
- `index.html` About-panel footer ribbon and on-page Version History card refreshed

## [v26.6.7] - 2026-05-20

### Changed — Deep sweep: remaining Netlify Functions, docs sub-pages, translated docs

User feedback: *"Yes please FULL"* — the last meaningful surfaces still uninspected from the v26.6.5 stocktake. Three parallel read-only Explore audits ran against the 17 unchecked Netlify Functions, 50+ English `docs/` sub-pages, and the translated/ImpactMojo doc sets. All actionable findings applied below. Both changelogs updated (CHANGELOG.md + on-page Version History).

#### Netlify Functions — User-Agent strings bumped to v26.6

Five additional functions still carried `JanVayu/1.0` or `JanVayu/26.5` user-agent headers. These are the strings shown in Reddit/Nitter/Sensor.Community server logs and matter for analytics attribution and for the small number of upstream services that whitelist by UA:

| File | Was | Now |
|------|-----|-----|
| `scheduled-fetch.mjs` | `JanVayu/1.0 AirQualityMonitor` (5 sites) + `JanVayu:AirQualityMonitor:v25.0 (by /u/janvayu)` | **`JanVayu/v26.6 AirQualityMonitor (+https://janvayu.in)`** + matching v26.6 Reddit-style |
| `instagram-feed.js` | `JanVayu/1.0 AirQualityMonitor` | **`JanVayu/v26.6 AirQualityMonitor (+https://janvayu.in)`** |
| `news-proxy.js` | `JanVayu/1.0 AirQualityMonitor` | **`JanVayu/v26.6 AirQualityMonitor (+https://janvayu.in)`** |
| `community-sensors.mjs` | `JanVayu/1.0 (https://janvayu.in)` | **`JanVayu/v26.6 (+https://janvayu.in)`** |
| `waqi-proxy.mjs` | `JanVayu/26.5 (+https://www.janvayu.in)` | **`JanVayu/v26.6 (+https://www.janvayu.in)`** |

Combined with the v26.6.0 and v26.6.4 bumps on `reddit-feed.js` and `twitter-feed.js`, **every outbound HTTP request from JanVayu's serverless tier now reports v26.6** as its identity.

#### English docs sub-pages — Delhi annual PM2.5 figure aligned

Two docs files still cited Delhi's annual PM2.5 as `~100 µg/m³` (a 2024 figure). Both now use the IQAir 2025 figure of **91.6 µg/m³**, consistent with what `docs/README.md` was bumped to in v26.6.2:

- `docs/user-guide/aqi-dashboard.md` line 26: "Delhi (actual, 2024) | ~100 µg/m³" → **"Delhi (actual, IQAir 2025) | 91.6 µg/m³"**
- `docs/user-guide/health-calculator.md` line 56: "Delhi | ~100 | 20×" → **"Delhi | 91.6 | 18× (IQAir 2025)"**

#### Translated docs (Bengali, Marathi, Tamil) — same Delhi figure aligned

The English `aqi-dashboard.md` fix was replicated in three translated copies (the Hindi version of this file uses a different layout and has no equivalent figure):

- `docs-bn/user-guide/aqi-dashboard.md` — "দিল্লি (প্রকৃত, 2024) | ~100 µg/m³" → "**দিল্লি (প্রকৃত, IQAir 2025) | 91.6 µg/m³**"
- `docs-mr/user-guide/aqi-dashboard.md` — "दिल्ली (वास्तविक, 2024) | ~100 µg/m³" → "**दिल्ली (वास्तविक, IQAir 2025) | 91.6 µg/m³**"
- `docs-ta/user-guide/aqi-dashboard.md` — "டெல்லி (உண்மையான, 2024) | ~100 µg/m³" → "**டெல்லி (உண்மையான, IQAir 2025) | 91.6 µg/m³**"

#### Roadmap historical note clarified

`docs/wiki/Roadmap.md` Phase 5.7 listed "**six original games**" at v26.5 launch — historically accurate but ambiguous as of v26.6 when Vayu Junction shipped as a seventh. Now reads: "*six original games at v26.5 launch […]. A **seventh game, Vayu Junction**, was added in v26.6.0 — see Phase 5.9.*"

### Verified clean — no edits needed

- **All other docs sub-directories** (`docs/tech-stack/`, `docs/api/`, `docs/technical/`, `docs/contributing/`, `docs/data-sources/`, the rest of `docs/user-guide/`, `docs/skills/`, `docs/about/`)
- **ImpactMojo docs** (`docs-impactmojo/` + 4 language variants) — confirmed a separate project's documentation (development education, not air quality). No JanVayu-relevant content, no stale stats.
- **All other translated docs files** in `docs-hi/`, `docs-bn/`, `docs-mr/`, `docs-ta/`
- **The other 12 Netlify Functions** (subscribe.js, blob-store.js, feed-status.js, feed-ingest.mjs, accountability-brief.mjs, air-query.mjs, anomaly-check.mjs, health-advisory.mjs, historical-aqi.mjs, rankings.mjs, terra-collab.mjs, workshop-submit.mjs) — no stale UAs, no hardcoded outdated stats, no broken endpoints
- **Daily email digest** content — fully live-data, no embedded figures

### Still uninspected (smaller surface remaining)

Wiki pages other than Roadmap (`docs/wiki/Home.md`), GitHub Discussions seed text, the `downloads/` directory contents, and the `TerraStudioCollab/` directory.

### Changed — Version markers

- `package.json` 26.6.6 → **26.6.7**
- `CITATION.cff` 26.6.6 → **26.6.7**
- `index.html` About-panel footer ribbon and on-page Version History card refreshed

## [v26.6.6] - 2026-05-20

### Changed — Secondary surface sweep: pollutant pages, service worker, blog posts

User feedback (after the v26.6.5 stocktake): *"What have we not checked?"* The honest list included per-pollutant SEO pages, the root service worker, and the 10 existing blog posts. This release addresses all three. Both this file and the on-page Version History card in the About panel get the entry.

#### Per-pollutant SEO pages (`/pm25/`, `/pm10/`, `/co/`, `/no2/`, `/so2/`, `/o3/`)

Regenerated all six pages via `scripts/build-pollutant-pages.mjs`. The JSON-LD `dateModified` is now **2026-05-20** across all six pages (was 2026-05-08).

**Bug fix in the build script.** Previously `datePublished` was being reset to the current date on every regeneration — losing the original publish history. Fixed: `datePublished` is now pinned to **2026-04-26** (the original release of the per-pollutant pages); only `dateModified` updates on each rebuild.

#### Root service worker (`/sw.js`)

Cache version bumped: `janvayu-20260508` → **`janvayu-20260520`**. Returning users will now bypass the stale offline-shell cache and pick up everything from v26.6.0–v26.6.5 (Vayu Junction, back-to-home button, May 2026 panel content, etc.). The `/ask/sw.js` cache name was already bumped in v26.6.0.

#### Blog post stat alignment (audit identified 4 posts with stale figures)

- **`blog/posts/2026-04-08-lancet-causal-evidence.md`** — Two mentions of "1.5 million" now correctly attributed to Krishna et al. 2024 (causal-inference study) with an inline May-2026 note pointing readers to the revised Lancet Countdown 2025 headline of **1.72 million**.
- **`blog/posts/2026-04-12-iqair-2025-india.md`** — Same fix: "1.5 million" now attributed to Krishna et al. 2024, with an inline note about the Lancet Countdown 2025 revision to 1.72M.
- **`blog/posts/2026-05-08-learning-games.md`** — "A Hindi translation of all six games" → "all six games (now seven, since Vayu Junction shipped on 20 May 2026)".
- **`blog/posts/2026-03-25-economic-cost.md`** — World Bank "$150 billion" framing reworded so readers understand it is the older figure now superseded by Lancet Countdown 2025's $339.4 billion / 9.5% GDP.

The earlier "**Data Corrections, May 2026**" post (`2026-05-06`) already explained the 1.5M-vs-1.72M distinction at length; these edits make individual posts consistent with that canonical correction so a reader landing on any single post doesn't see contradictory numbers.

### Verified clean — no edits needed

- **Embed widgets** (`/embed/aqi/`, `/embed/rankings/`) — no stale stats; no version markers
- **Daily email digest** (`netlify/functions/daily-digest.mjs`) — fully live-data; no embedded figures
- **`/blog/posts/2026-05-06-data-corrections-may.md`** — already canonically frames 1.5M (Krishna et al.) vs 1.72M (Lancet Countdown 2025)
- **`/blog/posts/2026-04-05-ncap-deadline.md`** — correctly frames the deadline as past tense
- **Other blog posts** (`2026-03-28-stubble-burning-satellites.md`, `2026-04-01-children-air-pollution.md`, `2026-04-26-shipped-this-week.md`, `2026-05-08-quality-and-performance.md`, `2026-05-20-vayu-junction.md`) — all already current

### Still uninspected (next-pass candidates)

For full transparency, the following secondary-surface items remain unaudited this session: the 17 other Netlify Functions beyond Reddit/Twitter (instagram-feed, youtube-feed, news-proxy, etc.); 50+ documentation sub-pages under `docs/user-guide`, `docs/technical`, `docs/api`, `docs/skills`, `docs/contributing`, `docs/about`, `docs/tech-stack`, `docs/claude-code`, `docs/data-sources`, and their translated equivalents in `docs-hi/`, `docs-bn/`, `docs-mr/`, `docs-ta/`; the ImpactMojo docs (`docs-impactmojo*`); the GitHub Discussions seeds; the wiki pages other than Roadmap.

### Changed — Version markers

- `package.json` 26.6.5 → **26.6.6**
- `CITATION.cff` 26.6.5 → **26.6.6**
- `scripts/build-pollutant-pages.mjs` — `datePublished` bug fixed
- `index.html` About-panel footer ribbon and on-page Version History card refreshed

## [v26.6.5] - 2026-05-20

### Changed — Complete panel content freshness sweep (every remaining section)

User feedback: *"Please DO ALL"*. The v26.6.4 release covered the top-five highest-staleness-risk panels (Clean Air Wins, Budget, Mission Tracker, Children, Political Accountability). This release sweeps every remaining panel, even those that were merely "fine" — bringing each into explicit May-2026 framing where applicable, and adding the April–May 2026 court/regulator action to every panel where it belongs.

A read-only Explore-agent audit of 30+ remaining templates (`tmpl-voices`, `tmpl-policy`, `tmpl-scorecards`, `tmpl-corporate`, `tmpl-legal`, `tmpl-workshops`, `tmpl-forecast`, `tmpl-indoor`, `tmpl-compare`, `tmpl-trends`, `tmpl-actions`, `tmpl-citizen-action`, `tmpl-migration`, `tmpl-go-outside`, `tmpl-aqi-alerts`, `tmpl-school-closure`, `tmpl-exposure-report`, `tmpl-purifier-calc`, `tmpl-migration-calc`, `tmpl-rti-assistant`, `tmpl-pollution-calendar`, `tmpl-data-archive`, `tmpl-tools`, `tmpl-glossary`, `tmpl-economic`, `tmpl-rankings`, `tmpl-map`, `tmpl-hyperlocal`, `tmpl-correlations`, `tmpl-accountability-brief`, `tmpl-social-feed`, `tmpl-live-news`, `tmpl-ask-janvayu`, `tmpl-downloads`, `tmpl-about`) confirmed that 30+ panels are either evergreen content or live-data tools and were already current.

The remaining six panels gained targeted refreshes:

#### `tmpl-trends` (Historical Trends)

- Chart title: "Delhi PM2.5 Trend (2015&ndash;2025)" → "**Delhi PM2.5 Trend (2015&ndash;present)**", with matching aria-label update
- Timeline gains **three new May 2026-relevant entries**: NCAP deadline elapsed (31 Mar 2026, with CREA + CSE outcomes), NGT South-India PM order (Apr 2026), and CAQM's first off-season GRAP Stage-I (19 May 2026)

#### `tmpl-forecast` (AQI Forecast)

- "SAFAR Delhi predictions vs. CPCB actual readings for Winter 2025-26" reframed: "Winter 2025-26 (the most recent pollution season). Live accuracy assessment for the upcoming Winter 2026-27 season will resume in October."

#### `tmpl-legal` (Legal Framework)

- New card **"Recent Court &amp; Regulator Action (Apr&ndash;May 2026)"** added immediately below the GRAP/Worker-Compensation section. Four info-boxes side-by-side: NGT south-India PM roadmap order (Apr), NGT diesel-generator retrofit notices (9 Apr), CAQM off-season GRAP Stage-I (19 May), NCAP deadline elapsed (31 Mar). Each links to a primary source (DTE court digest, CAQM order index).

#### `tmpl-policy` (Policy Effectiveness)

- GRAP Stages card gains a second timeline note: "**19 May 2026:** CAQM invokes Stage-I at AQI 208 — first-ever off-season activation. GRAP is no longer winter-only." Sits next to the Dec 2024 predictive-activation note.

#### `tmpl-voices` (Citizen Voices)

- New top voice-card added: **"CAQM — First Off-Season GRAP Invocation"** dated 19 May 2026, framing the regulator's quiet but consequential signal that GRAP enforcement is no longer Oct–Mar only.

#### `tmpl-corporate` (Industrial Sources)

- "As of January 2026, compliance remains patchy:" → "**Last verified Jan 2026, no public update since**" — honest framing of data vintage
- New post-card alert: **"9 April 2026 update — NGT escalation"** noting the nationwide SPCB/PCC notices on DG-set retrofit non-compliance. First nationwide accountability move beyond NCR.

#### `tmpl-citizen-action` (Citizen Action Plan / EMCAP)

- Section intro updated: "comprehensive citizens' action plan for Winter 2025-26 and beyond" → "**Updated for the post-Winter 2025-26 cycle: now framed for year-round action following CAQM's first off-season GRAP invocation (19 May 2026) and the NGT's south-India PM roadmap order (Apr 2026) which together signal a structural shift from winter-only crisis response.**"

#### `tmpl-migration` (Climate Displacement)

- Reddit testimonial gains a small vintage tag: "(late 2025; the cleaner-air-elsewhere story has only intensified through 2026)" — so the timeless quote reads as documented testimony rather than ambient noise

### Verified clean — no updates needed

The audit confirmed that the following 30+ panels are either tool-only (live data, calculators, forms) or carry evergreen content that doesn't suffer from May-vs-March framing: `tmpl-economic`, `tmpl-scorecards`, `tmpl-workshops`, `tmpl-indoor`, `tmpl-rankings`, `tmpl-map`, `tmpl-hyperlocal`, `tmpl-compare`, `tmpl-actions`, `tmpl-go-outside`, `tmpl-aqi-alerts`, `tmpl-school-closure`, `tmpl-exposure-report`, `tmpl-purifier-calc`, `tmpl-rti-assistant`, `tmpl-pollution-calendar`, `tmpl-migration-calc`, `tmpl-data-archive`, `tmpl-tools`, `tmpl-correlations`, `tmpl-accountability-brief`, `tmpl-social-feed`, `tmpl-live-news`, `tmpl-ask-janvayu`, `tmpl-downloads`, `tmpl-about`, `tmpl-glossary`.

### Changed — Version markers

- `package.json` 26.6.4 → **26.6.5**
- `CITATION.cff` 26.6.4 → **26.6.5**
- `index.html` About-panel footer ribbon and on-page version-history card refreshed

## [v26.6.4] - 2026-05-20

### Changed — Panel content freshness sweep

User feedback: *"Did you update ALL sections — what about Clean Air Wins, etc.?"* Honest answer was no — the v26.6.2 audit covered stats consistency and the Resources panel only. This release sweeps the highest-staleness-risk panels and brings their date-stamped content into the present.

#### Clean Air Wins (`tmpl-progress`) — Severity 5 fix

The headline stat strip and Delhi e-bus card were anchored to **February 9, 2026** data with no acknowledgement that it's now May. Fixed:

- New **"Update — May 2026"** card at the top of the panel, surfacing the three policy/enforcement wins from the last six weeks: CAQM's first-ever **off-season GRAP Stage-I invocation** (19 May 2026), NGT's **six-state south-India PM roadmap order** (Apr 2026), and NGT's **nationwide SPCB diesel-generator retrofit notices** (9 Apr 2026). All three link to the Resources panel for full citations.
- Headline stat-strip's fourth tile changed from "10,000 e-buses planned (PM-eBus Sewa, by 2026)" — which is verbatim from the original brochure but reads as a future target despite the deadline being now — to "**6 South-Indian states ordered to file sector-wise PM roadmaps (NGT, Apr 2026)**", a fresh, verified, May-2026-vintage data point.
- Delhi e-bus card reframed: "operational as of Feb 9, 2026" → "operational (**last verified count, 9 Feb 2026**)" with an explicit "*next public count expected Q2/Q3 2026*" note. EV Policy 2.0 line: "expected by March 2026" → "**draft still awaited as of mid-May 2026**".

#### Budget Tracker (`tmpl-budget`) — Severity 4 fix

The "Funding Cliff Alert" still said the 15th Finance Commission grants **"expire March 2026"** — but March is now seven weeks behind us. Reframed retrospectively:

- "expire March 2026 with no successor mechanism announced" → "**expired 31 March 2026. As of mid-May 2026, no successor mechanism has been formally announced — cities are operating on residual previously-released allocations. The 16th Finance Commission's recommendations are expected by Oct 2026 for the FY27 cycle starting Apr 2027 — leaving a potential 12-month gap.**"
- Structural-issues bullet updated to match.

#### Mission Tracker (`tmpl-mission-tracker`) — Severity 4 fix

The "NCAP Target vs. Reality (March 2026 Deadline)" card was forward-looking despite the deadline having elapsed. Reframed:

- Card title → "NCAP Target vs. Reality — **Deadline Missed**"; sub-title gains the CSE Apr 2026 review reference.
- New banner explicitly says the deadline has passed with the verified 23/100 (CREA) and 37/131 (CSE Apr 2026) outcomes side-by-side. Links to the CSE Five-Year Review in the Resources panel.
- "Cloud Seeding" evidence box updated to reflect both the late-2025 AND early-2026 trial rounds (both independent assessments: no measurable AQI impact).

#### Children's Health (`tmpl-children`) — Severity 3 fix

"~30 days this winter" school-closure language was confusing in May (we're past winter). Reframed as:

- "**Winter 2025-26 closures (most recent pollution season)**" — explicit framing that this is historical.
- Added a forward-looking sentence: *"The next closure window opens with the post-monsoon pollution season — typically late October 2026."*

#### Political Accountability (`tmpl-accountability`) — Severity 4 fix

Card titles for the CREA NCAP report and the CAG audit carried internal version badges (**"v19.0"**) that meant nothing to users and made the cards look dated. Replaced with content-vintage badges:

- "CREA Tracing the Hazy Air (January 9, 2026) — v19.0" → "**CREA · 9 Jan 2026**"
- "CAG Audit (April 2025) — v19.0" → "**CAG · April 2025**"

Same fix applied to four more v19.0 badges in the Resources / Citizen Action card group, including a "State of Global Air 2025" tile (now correctly labelled "HEI · Oct 2025").

### Changed — Version markers

- `package.json` 26.6.3 → **26.6.4**
- `CITATION.cff` 26.6.3 → **26.6.4**
- `index.html` About-panel footer ribbon and on-page version-history card refreshed

## [v26.6.3] - 2026-05-20

### Changed — Back-to-home button visibility

User feedback: *"I can't see the button you added to return home"*. Confirmed via headless Chromium against the live site that the button was correctly rendering and getting the `.visible` class — but visually too quiet to draw the eye. The original styling (light card background, accent-coloured stroke) blended into the page's cream background.

**Now louder:**

- **Solid accent-green background** (`#16A34A`) with a **white house icon** and a 2 px white border ring — the same visual weight as the search FAB on the bottom-right, but in the mirror corner
- **Larger**: 52 px desktop (was 46), 48 px mobile (was 42) — matches the FAB exactly so the two sit as a symmetric pair
- **Stronger shadow**: `0 6px 20px rgba(0,0,0,0.25)` (was `0 4px 14px rgba(0,0,0,0.12)`)
- **One-time gentle pulse** when the button first becomes visible (1.4 s, single iteration, ring expands from 0 to 16 px and fades) — draws the eye without nagging. Respects `prefers-reduced-motion`.
- **Hover state**: button shifts to a deeper green (`#15803d`) and scales up by 8% — feels tactile
- **Z-index bumped** from 500 to 600 so it sits above the FAB layer (still well below the role-overlay's 2999, which is correct — the role overlay should remain exclusive)
- **Slide-in animation** updated to a `translateY + scale` combo, giving the button a subtle pop when it appears

### Changed — Version markers

- `package.json` 26.6.2 → **26.6.3**
- `CITATION.cff` 26.6.2 → **26.6.3**
- `index.html` About-panel footer ribbon refreshed

## [v26.6.2] - 2026-05-20

### Full-site audit sweep

A targeted audit triggered by the question *"did you update the list of resources / papers / reports?"*. The honest answer was no — last refresh was v26.5.2 in April. This release does the refresh plus a sweep for stale numbers across the site.

### Added — Five fresh May 2026 items in the Resources panel

The "April–May 2026 Updates" card is renamed to **"May 2026 Updates"** and gains a separate **"Added this cycle"** sub-section above the six anchor reports. Each of these was published between 1 April and 20 May 2026:

| # | Title | Org | Date | Why it matters |
|---|-------|-----|------|----|
| 1 | India Monthly Ambient Air Quality Snapshot — April 2026 | CREA | 8 May 2026 | Khora (UP) ranked #1 most polluted by CAAQMS data; granular city-level breakdown |
| 2 | GRAP Stage-I Re-invocation (off-season) | CAQM | 19 May 2026 | First-ever off-season GRAP toggle in Delhi-NCR — year-round AQ enforcement |
| 3 | South-India PM Reduction Suo Motu Order | NGT | Apr 2026 | Direction to TN/KL/KA/AP/TS/PY for sector-wise PM10/PM2.5 reduction roadmaps tied to state budgets |
| 4 | Diesel-Generator Retrofit Non-Compliance Notices | NGT | 9 Apr 2026 | Notices to all SPCBs/PCCs for failing CPCB/CAQM directions on DG-set emissions |
| 5 | "16× COVID-Era Annual Deaths" (Bagai, AAD 2026) | Down to Earth / CSE | Apr 2026 | Clinician-led paediatric/cardiac mortality reframing distinct from Lancet's 1.72M |

### Changed — Stale-stat sweep

Brought outdated statistics into alignment with the canonical v26.5 figures (1.72M deaths, $339.4B, 91.6 µg/m³ Delhi annual PM2.5):

- **SEO meta description** (`<meta name="description">`) — "2 million deaths/year" → **"1.72 million deaths/year (Lancet Countdown 2025)"**
- **Twitter Card description** — same fix
- **Hero alert** in `#section-dashboard` — "six-game Learning Games" → **"seven-game Learning Games"** with explicit mention of Vayu Junction
- **Dashboard quick-link card** for Games — "Six games: Jeopardy, quiz & more" → **"Seven games: Jeopardy, Vayu Junction & more"**
- **`docs/README.md`** — Stats overhauled: 1.7–2 million → 1.72M; Delhi ~100 µg/m³ → 91.6 µg/m³; $150 billion → $339.4 billion (~9.5% GDP). Added AQLI 2025 IGP detail (7–8 years).
- **`docs-hi/README.md`, `docs-bn/README.md`, `docs-mr/README.md`, `docs-ta/README.md`** — Same overhaul, four languages.

### Changed — "Latest Research 2025" card relabelled

The card under the Health panel was titled *"Latest Research 2025 — Key Findings"* with a v19.0 badge. The content (SoGA 2025, Lancet 10-city Dec 2024, Karolinska 2024) is still useful but no longer "latest" — May 2026 has fresher items in the Resources panel. Renamed to **"Recent Peer-Reviewed Findings (2024–2025)"** with a neutral *background* badge. The freshest items now live in one place, the Resources panel "May 2026 Updates" card.

### Verified — End-to-end click-through of all 43 panels

Headless Chromium sweep clicked every panel-bearing nav item (`data-panel="..."` attributes — 43 panels total: health, economic, children, indoor, trends, compare, rankings, map, hyperlocal, forecast, correlations, policy, budget, accountability, corporate, mission-tracker, scorecards, accountability-brief, progress, actions, citizen-action, legal, voices, workshops, games, social-feed, live-news, migration, ask-janvayu, go-outside, aqi-alerts, school-closure, exposure-report, purifier-calc, migration-calc, rti-assistant, pollution-calendar, data-archive, tools, glossary, resources, downloads, about).

**Result: zero uncaught JS exceptions on any panel.** Only "errors" are localhost 404s for Netlify Functions endpoints (production-only) and CDN cert noise from the sandbox — both expected, neither affects production.

### Changed — Version markers

- `package.json` 26.6.1 → **26.6.2**
- `CITATION.cff` 26.6.1 → **26.6.2**
- `index.html` About-panel footer ribbon refreshed
- `index.html` Version History card gains v26.6.2 entry at top

## [v26.6.1] - 2026-05-20

### Added — Back-to-home floating button

A small floating arrow button (bottom-left, mirror of the existing search FAB at bottom-right) that returns the user to the dashboard hero. The previous flow used the main dropdown nav to *enter* a section but offered no obvious one-tap way back to the top — users had to either scroll all the way up or hunt for "Dashboard" in the nav.

**Behaviour:**

- Appears whenever **any panel is loaded** via the dropdown nav (i.e. `#panel-container` has content), or once the user has scrolled **more than 320 px** past the top.
- Clicking it calls `showPanel('dashboard')`, which clears the panel container and smooth-scrolls to top — same code path as clicking "Dashboard" in the nav.
- Smooth fade-in + 8 px upward slide; immediately hides itself when clicked, then re-appears the next time the user scrolls or navigates into a panel.

**Accessibility:**

- Tab-focusable button with a 3 px focus ring (matches the v26.5.7 dark-mode focus indicator).
- `aria-label` and `title` translated in EN/HI/TA/MR/BN via a new `data-i18n-attr` extension to the `setLanguage()` loop, so attribute-only translations can be added without touching `innerHTML`. This is useful for any icon-only button where the SVG must stay intact.
- Up-arrow + house SVG icon, no emoji, follows the existing JanVayu visual style.

**Mobile sizing:**

- 46 px diameter on desktop (slightly smaller than the FAB's 52 px so the FAB stays the primary action).
- 42 px on screens ≤480 px, with the same 16 px gutter as the FAB at the same breakpoint, so the two buttons sit symmetrically in the bottom corners.

### Changed — Version markers

- `package.json` 26.6.0 → **26.6.1**
- `CITATION.cff` `version` 26.6.0 → **26.6.1**
- `index.html` footer ribbon (About panel) refreshed for v26.6.1

## [v26.6.0] - 2026-05-20

### Added — Vayu Junction (7th learning game)

A new word-grouping puzzle in the [Learning Games](https://www.janvayu.in/#games) panel, inspired by BBC's *Only Connect*, the NYT *Connections* daily, and the [*Torchlight*](https://timesofclimatechange.com/torchlight/) climate puzzle at Times of Climate Change — but built around India's air-quality vocabulary.

**Mechanic.** Sixteen tiles laid out on a 4×4 grid. The player taps four tiles they believe share a hidden connection, then hits Submit. A correct guess locks the four in colour-coded with the connection's theme revealed; a wrong guess costs a strike. The game auto-detects "one-off" near-misses ("three of your four belong together — swap one") so the player gets calibrated feedback. Four strikes and the puzzle reveals itself.

**Ships with four original India-AQ puzzles**, each at a different difficulty:

- **Basics (Easy)** — particulate fractions (PM1 / PM2.5 / PM10 / TSP), criteria gases (NO2 / SO2 / CO / O3), CPCB AQI bands (Good / Satisfactory / Moderate / Poor), Indian regulators (CPCB / CAQM / MoEFCC / DPCC).
- **Sources, seasons & protection (Medium)** — combustion sources, smog-season months in N India, Delhi GRAP stages, mask & filter terms (N95 / FFP2 / HEPA / CADR).
- **Names & numbers (Hard)** — worst-polluted Indian cities from IQAir 2025 (Loni / Byrnihat / Begusarai / Hajipur), NCAP top-performing cities, AQ research bodies & reports (CREA / AQLI / IQAir / Lancet), citizen-action tools (Petition / RTI / Audit / Survey).
- **Devious** — Misdirect-prone categories: types of "___ carbon" (Black / Brown / Blue / Green), Indian vehicle emission standards (BS-II / III / IV / VI), citizen acronyms (PIL / RTI / FIR / NOC), PM-precursor gases (NOx / SOx / VOC / NH3).

Players can switch puzzles freely, shuffle the grid, deselect, or give up to reveal. Solved groups stack vertically above the live grid in their theme colour. All logic is client-side; no analytics.

The game shares vocabulary with the dashboard, Jeopardy, and Tambola, so it doubles as flash-card practice for the wider site.

### Verified — Ask JanVayu

End-to-end verification of the [Ask JanVayu](https://www.janvayu.in/ask/) PWA in all five UI languages (EN/HI/TA/BN/MR). City chip → /.netlify/functions/air-query → Groq Llama 3.3 70B response with seasonal context, NCAP city data, and language-pinned output. Welcome heading, suggestion chips, input placeholder, install banner, and error messages all internationalised via the `I18N` table. PWA installable manifest verified.

### Changed — Documentation & version markers

- `package.json` 26.5.6 → **26.6.0**
- `CITATION.cff` `version` 26.5.6 → **26.6.0**; `date-released` → 2026-05-20
- `README.md` feature list: "Six learning games" → **"Seven learning games"** (Vayu Junction added)
- `sitemap.xml` lastmod refreshed to 2026-05-20
- `index.html` footer ribbon (About panel) refreshed for v26.6.0
- Reddit-feed and YouTube-feed User-Agent strings bumped from `JanVayu/v25.0` / `JanVayu/1.0` to `JanVayu/v26.6 (+https://janvayu.in)` so server-side analytics attribute current-version traffic correctly.

### Changed — Roadmap

`docs/wiki/Roadmap.md` restructured:

- **Phase 5.7 (Learning, Engagement & May 2026 Refresh)** moved to numeric order (it was previously listed after Phase 5.8 even though it shipped earlier).
- **Duplicate Phase 6 heading** at the bottom of the file (Mobile & Performance) renamed to **Phase 6.5** to avoid confusion with the "Q3 2026 Priorities" Phase 6 at the top.
- New **Phase 5.9 (May 20 Polish)** captures today's ship list: Vayu Junction, Ask JanVayu verification, social-feed UA bump, doc refresh.

### Changed — Translated docs

A v26.6 stub added at the top of `docs-hi/CHANGELOG.md`, `docs-bn/CHANGELOG.md`, `docs-mr/CHANGELOG.md`, `docs-ta/CHANGELOG.md` so readers in those languages see the latest ship list. Full per-language translations to follow.

### Added — Blog post

New blog post `blog/posts/2026-05-20-vayu-junction.md` — *"Vayu Junction: connecting the dots on India's air-quality vocabulary"*. Walks through the four puzzle sets, the design choices, and the homage to *Only Connect* and *Torchlight*.

## [v26.5.8] - 2026-05-08

### Fixed — UX-protection batch (the four real-user-pain items)

A focused pass on the items the v26.5.x audit flagged as actually degrading user experience, as opposed to engineering hygiene.

#### 1. Embed widget hardening (`/embed/aqi/`, `/embed/rankings/`)

The two iframable widgets are live on third-party sites; if the new `waqi-proxy` Netlify function ever fails (CDN blip, proxy bug, rate-limit), every embed in the wild used to silently render an unstyled error string. Both widgets now:

- Validate `?city=` server-side on the proxy and client-side via `SAFE_CITY = city.replace(/[^a-zA-Z0-9\-_]/g, '').slice(0, 60)` (defence in depth).
- Wrap the fetch in an 8-second `AbortController` timeout.
- Retry once on first failure (1.5 s delay) before falling back.
- On final failure render a polished JanVayu-branded "Live reading temporarily unavailable" card with a clickable link to the dashboard, instead of a bare error line.

#### 2. Lazy-load fallback for blocked CDNs

If a viewer is on a corporate network that blocks `cdn.jsdelivr.net` or `unpkg.com`, the lazy-loaded Chart.js / Leaflet would silently fail and the panel would render nothing. Now `initAllCharts`, `initMap`, `generateExposureReport`, `renderYoYChart`, `drawHourlyChart`, `renderPollutionCalendar`, `updateCorrelation` each `try/catch` the ensure-helper and call a new `renderLibraryFallback()` that injects an explanation: *"&lt;Library&gt; could not be loaded. This is usually a corporate-network or regional CDN block. Try a different network, or return to the dashboard. All other panels still work normally."* with a link back to the dashboard.

#### 4. Honest "Latest Social Media Coverage" card

Previously the Voices panel showed a card titled "Live from Social Media" that often displayed only curated content (a polite fiction since Agent-Reach is currently inactive — see issue #45). Two changes:

- Card title renamed to **"Latest Social Media Coverage"** — accurate even when curated content is the source.
- If the loader returns zero posts (live or curated), the entire `voices-live-card` is hidden via `display: none` so users go straight to the curated highlights below; the dead-loading-spinner state is gone.

#### 5. `og-image.png` refreshed for May 2026

Every share of `janvayu.in` on WhatsApp, X, LinkedIn, Slack, Facebook used to preview a stale image with v25 numbers (Byrnihat as most-polluted city, 1.5M deaths). Now:

- New `og-image.svg` source-of-truth at the repo root with current numbers: **Loni 112.5 µg/m³** (most polluted, IQAir 2025), **3.5 yrs life-expectancy lost** (AQLI 2025), **~70% of global PM2.5 deaths** (Lancet Countdown 2025), **8× NAAQS-vs-WHO gap**. Yellow accent on the headline `1.72 million` figure with the `JanVayu / जनवायु` brand mark and a leaf motif.
- `og-image.png` regenerated from the SVG via `cairosvg` (1200×630, 131 KB).
- New `scripts/build-og-image.py` so future updates are one command: edit SVG → run script → commit both → bump cache-buster.
- `og:image` and `twitter:image` URLs gain `?v=20260508` query string so platforms re-fetch instead of serving the cached stale PNG.
- `og:image:alt` and `twitter:image:alt` rewritten to reflect the new content.

## [v26.5.7] - 2026-05-08

### Improved — i18n coverage push, axe-friendly form labels, mobile polish

A focused pass through the deferred Q3 work that's tractable without waiting on real CI runs.

#### i18n coverage 0.7% → 4.8% (a 7× improvement)

Added `data-i18n` attributes to ~140 of the highest-traffic strings: every mobile and desktop nav button, mobile-nav group labels, role-card descriptions, the dashboard quick-link card titles + descriptions, the new "Did You Know" cards, footer titles + key links, the demo badge, the connecting-live status, the Skip-to-content link, and the role hint. Validated with `scripts/check-i18n-coverage.py`. The numbers are visible in CI now and ratchet upward; the next push (target 30%+) needs the panel-template content covered.

#### Pre-emptive axe accessibility fixes

- `aria-label` added to four search/email inputs that had only `placeholder` (glossary search, research-library search, daily-digest subscribe, unsubscribe). Pre-empts the "label" axe rule.
- Stronger focus ring on dark backgrounds (`#FFD86B` 3px outline on `.btn-primary` and inside `[data-theme="dark"]`) so the focus indicator never gets lost against deep-green or near-black surfaces.
- Existing `:focus-visible`, skip-link, `prefers-reduced-motion`, and the canvas `aria-label`/`role="img"` work from v26.5.6 already cover the remaining big-ticket axe rules.

#### Mobile polish

- **Jodi Match board** changed from `repeat(4, minmax(120px, 1fr))` (which forces horizontal scroll on 360 px Galaxy) to `repeat(auto-fit, minmax(140px, 1fr))` — naturally collapses to 2 columns on mobile, 3 on tablet, 4 on desktop.
- Existing flex-wrap tab strip on the games panel already wraps to multiple lines on mobile — verified.

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
