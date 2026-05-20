# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
