# Weekly fact-check — 20 July 2026

**Method:** Multi-agent sweep. Scope this run: `scripts/stats.json` (never previously audited — flagged CRITICAL, since its values override HTML `[data-stat]` elements at runtime), the README "Key Statistics" table (never previously audited), and every file newly added or substantially rewritten since the last round (`docs/fact-check-2026-07c.md`, 17 Jul 2026): `index.html`'s new accountability content, `panels/accountability.html` (rewritten — new promises tracker + interventions table), `panels/budget.html` (NCAP city rows + CRM figures), `netlify/functions/lib/calc.mjs`, and five new blog posts. `panels/economic.html`, `panels/aqi-explainer.html` (heading-level a11y fix only) and `panels/source-selector.html` were unchanged since the 17 Jul round and were not re-audited. 8 parallel research agents web-verified the extracted claims against current primary sources (IQAir, CREA, ResGov, PIB, EPIC, CAQM, Lancet Planetary Health).

## Summary

**~45 statistics/claims checked. ~20 confirmed current. 17 corrected. 2 rows removed (no credible source). 4 flagged, unresolved.**

The most consequential finding: a **live display bug** in `scripts/stats.json` — the exact failure mode this routine exists to catch, since JSON values silently override the HTML at runtime. Also found: a Chart.js dataset in `app.js` still serving five stale/fabricated per-city NCAP figures that had already been corrected in the `budget.html` panel weeks ago but never synced to the chart, and the same gap in the live Ask JanVayu system prompt (`netlify/functions/air-query.mjs`), which is even higher-blast-radius than a static page since every chatbot answer citing station counts was serving a stale figure.

## Corrected (applied, with source)

### scripts/stats.json — display bugs (CRITICAL scope)

- **`most_polluted_city` schema mismatch broke the homepage card.** The JSON had `{"value": "Loni", "pm25": "112.5", ...}`, but the injector script only reads `entry.value` + `entry.unit` — it ignores `pm25`. At runtime this overwrote the "Did You Know" card's `112.5 µg/m³` (the actual number the label needs) with the bare word `"Loni"`, directly under a label that already says "Loni, India — the world's most polluted city." Net effect: live homepage silently lost its headline number.
  `{"value": "Loni", "pm25": "112.5"}` → `{"value": "112.5", "unit": "µg/m³", "note": "Loni, India"}`
  *Source:* IQAir World Air Quality Report 2025 (pub. 24 Mar 2026) — Loni 112.5 µg/m³, most polluted city.
- **`economic_pct_gdp` was stripping its own citation on override.** JSON value `"9.5%"` replaced the HTML's `"9.5% GDP (Lancet)"`, silently dropping the unit and source label from the live hero card.
  `"9.5%"` → `"9.5% GDP (Lancet)"`
  *Source:* Lancet Countdown on Health and Climate Change 2025, India data sheet.
- **`india_avg_pm25.updated` had a year typo** ("2025-03" for a report published March **2026**), understating the data's actual vintage by a year.
  `"2025-03"` → `"2026-03"`
- **`cpcb_stations` was stale** — "~533" (undated "CPCB Annual Report") vs. the current CAAQMS network of ~565 stations (2025 data). Network has grown steadily (409 in 2022 → 423 in Feb 2023 → 558 in 2024 → 565 in 2025); the exact live count fluctuates ±10-20 depending on snapshot date, so this is stated as approximate.
  `"~533"` → `"~565"`
  *Source:* CPCB data via CREA "Tracing the Hazy Air 2026" (Jan 2026).
- **Added a missing `delhi_annual_pm25` entry.** This key didn't exist in the JSON at all, so the homepage hero's hardcoded HTML value ("96") was never being kept current by anything — see the Delhi PM2.5 fix below, which this entry now enforces site-wide going forward.

### The Delhi PM2.5 number — three different values on one site

The homepage hero, the README, and old internal notes each carried a **different** figure for Delhi's annual PM2.5: 96, 91.6, ~82, and ~99.6 all appeared somewhere. None was correct for the current report. Verified against IQAir's press release for the report covering full-year 2025 data (published 24 Mar 2026): **Delhi's annual average is 82.2 µg/m³** (a three-year low, though still ~16× the WHO guideline, not 19×), and this is New Delhi's **8th consecutive year** as the world's most polluted capital.
- `index.html` hero stat: `96` (note: "19x WHO (2025 avg)") → `82.2` (note: "16x WHO (IQAir 2025)")
- `scripts/stats.json`: added `delhi_annual_pm25` = 82.2 µg/m³ so the hero card is enforced from a single source going forward
- `README.md`: `New Delhi (91.6 µg/m³)` → `New Delhi (82.2 µg/m³, 8th straight year worst)`
- *Source:* IQAir, 8th annual World Air Quality Report, iqair.com/newsroom/waqr-2025-pr (24 Mar 2026), covering calendar-2025 data. Corroborated by delhipollution.in and thedailyjagran.com.

### index.html hero — source misattribution

- **`deaths_annual` hero note said "State of Global Air 2025"** next to the value `1.72M` — but 1.72M is the **Lancet Countdown** figure (ambient PM2.5 only); State of Global Air's figure for India (total, incl. household air pollution) is ~2.1M. This conflated the platform's own two-source standing policy on a single card.
  `State of Global Air 2025` → `Lancet Countdown 2025`

### index.html — NCAP city-level figures never synced from earlier corrections

These are figures that a prior fact-check round already corrected in `panels/budget.html`, but the same numbers, hardcoded separately in `index.html`'s per-city action tables, were never updated:
- **15th Finance Commission grant scope, 2 occurrences**: `₹16,539 Cr for 49 cities` → `₹16,539 Cr for 42 million-plus cities` (matches the figure `budget.html` already carries; "49 cities" was a different, smaller XV-FC grouping).
  *Source:* PIB/MoEFCC PRID 2002614.
- **Mumbai NCAP row**: `₹380 Cr allocated / ₹220 Cr utilised (58%)`, cited to "CREA NCAP Analysis" → `15th FC: ₹620 Cr released, ~94% utilised; plus ₹95.5 Cr MoEFCC direct funds, 100% utilised`, re-attributed to BMC data via Free Press Journal (14 Feb 2025). The 58% figure was wrong; Mumbai is actually one of the highest utilizers.
- **Patna NCAP row**: `₹120 Cr allocated / ₹84 Cr utilised (70%)`, cited to "CREA NCAP Analysis" → `₹298.60 Cr received / ₹194.26 Cr utilised (~65%)`, re-attributed to the Bihar government's own NGT filing (OA 687/2023) — the only credible per-city source located.
- **Lucknow NCAP row removed**: `₹180 Cr allocated / ₹72 Cr utilised (40%)`, cited to "CREA NCAP Analysis" — no CREA report (2025 or 2026 edition) publishes this figure, and no other credible source was located. `budget.html` had already removed its equivalent row for the same reason weeks ago; `index.html` still carried it. Removed rather than invented, per standing policy.

### app.js — Chart.js dataset never synced from panel corrections

The homepage's "NCAP Fund Utilization" bar chart (`ncapChart`) held its own hardcoded data array, independent of the `budget.html` panel table. It still served the **pre-correction** numbers for every city except Delhi — Mumbai (₹380/₹220, 58% — wrong), Ghaziabad (₹49/₹13, ~26% — the exact wrong figure debunked in the first fact-check round), Noida (₹56/₹7, 13% — stale), Lucknow (₹180/₹72, 40% — unsourced) — misattributed in the chart title to "CREA Jan 2026" (CREA does not publish per-city ₹ Cr figures for any of these cities; confirmed by full-text search of both the 2025 and 2026 editions).
Chart updated to the three cities with a verifiable current per-city source (Delhi, Noida, Ghaziabad — matching `budget.html`'s NCAP table below), title changed to avoid the false CREA attribution.

### netlify/functions/air-query.mjs — the Ask JanVayu chatbot was citing a stale CAAQMS count

Six places in the live chatbot's system prompt / data-context builder cited "~533 CAAQMS stations" as the CPCB reference figure — every chatbot answer discussing India's monitoring network was serving this stale number. Updated to ~565 (see `stats.json` fix above) with source. The paired "~250 cities" companion figure could not be independently verified this round (see Flagged, below) and was left unchanged rather than guessed.

### panels/budget.html — NCAP per-city rows

- **Noida row updated to the newest sourced figure.** `₹55.70 Cr allocated / ₹7.07 Cr utilised (13%)`, cited to "Outlook Business (Sep 2025)" → `₹127.00 Cr allocated / ₹30.00 Cr utilised (24%)`. The old figure was itself real (Sep 2025 committee data, though labelled "released" not "allocated" by its own source) but is superseded by a more current, more precisely sourced figure.
  *Source:* Foundation for Responsive Governance (ResGov), "Financing Clean Air" Noida City Brief 3 (4 Jan 2026).
- **Delhi and Ghaziabad source attribution fixed** (numbers unchanged, already correct): Delhi's ₹81.36/₹14.10/17% was cited to "Outlook Business (Sep 2025)" but does not match any Sep-2025 Outlook Business piece — it matches ResGov's Delhi City Brief 4 (23 Dec 2025) almost exactly. Ghaziabad's >80% was cited to "CREA 'Tracing the Hazy Air 2026'" but CREA's report contains no Ghaziabad fund-utilisation figure anywhere (confirmed by full-text search); the real source is a Jan 2026 Lok Sabha reply. Footer citations corrected; card values unchanged since they were already numerically right.
- **75% utilisation rule note re-dated.** The card's "75% Rule (Sep 2025)" is a real policy, but CREA's report documents the **2024** version of this rule (Sep 2024 Apex Committee), not a Sep 2025 CREA finding — the Sep 2025 reiteration comes from the NCAP Implementation/Monitoring Committee via Business Standard/Outlook Business, not CREA. Attribution corrected; the rule itself (cities below 75% utilisation risk losing FY2025-26 allocation) is confirmed current.
- **Crop Residue Management total updated**: `₹3,623 Cr` (Nov 2024 snapshot) → `₹4,266 Cr`, current as of the most recent official update. This is the fourth successive snapshot of the same metric (₹3,062 Cr → ₹3,623 Cr → ₹3,926.16 Cr → ₹4,266.47 Cr as the scheme adds fresh annual tranches); each was accurate on its date, only the newest is current today. The card date range updated 2018-2025 → 2018-2026.
  *Source:* PIB / Ministry of Agriculture & Farmers Welfare, Inter-Ministerial CRM review, 17 Jun 2026 (now also includes Madhya Pradesh).
  *Note:* the card's Punjab/Haryana/UP state-wise sub-breakdown (46%/30%/21%) is the older Nov 2024 snapshot and does not sum to the new total or include Madhya Pradesh — flagged inline on the card itself ("older snapshot — pending refresh") rather than inventing a new split; see Flagged below.

### panels/accountability.html

- **Odd-even scheme, 2 occurrences.** EPIC's actual 8am–8pm scheme-hours estimate is 14–16% (the site's "~13%" conflates a different full-24-hour/two-week-period estimate with the scheme-hours one).
  `~13%` → `~14-16%` (promises tracker row + interventions table verification cell)
  *Source:* EPIC/UChicago, Harish, Sudarshan, Greenstone, Pande, "Clearing the air on Delhi's odd-even program."
- **Zigzag brick-kiln adoption, date-stamped.** The 45% (UP) / 71% (Haryana-NCR) figures are real and traceable, but date to a February 2021 CPCB/NGT-committee count, not current 2024-2026 data — no updated statewide figure could be located. Added an inline "(2021 data)" qualifier rather than silently implying currency.
- **National "30% Compliance" zigzag figure — unsourced, replaced.** No CPCB/SPCB/CREA report states a national 30% compliance rate; state data is too heterogeneous to average cleanly to 30% (Bihar ~82-85%, Haryana-NCR ~71%, UP ~45%, some districts much lower). Replaced the invented-looking single number with a defensible qualitative framing drawn from the site's own already-cited state figures.
  `30% Compliance` → `Uneven, 45-85% by State`
- **Delhi Metro Phase 4 timeline — wrong.** "First sections opened Jan-Mar 2026" compressed two separate, year-apart events: the actual first section (Janakpuri West–Krishna Park Extension) opened **January 2025**, a full year earlier than stated; two more sections opened together on 8 March 2026.
  `first sections opened Jan-Mar 2026` → `first section opened Jan 2025, two more Mar 2026`
  *Source:* Metro Rail News, Outlook Traveller (Mar 2026 inauguration coverage); Wikipedia (Jan 2025 opening).
- **Crop Residue Management figure** (promises-tracker verification cell) updated in step with the `budget.html` fix above: `₹3,062 Cr allocated (2018-24)` → `₹4,266 Cr released (2018-19 to 2026-27, PIB Jun 2026)`. The old figure additionally mislabeled "released" funds as "allocated" and had the wrong end-year (2018-24 vs. the source's actual 2018-19–2022-23 coverage).

## Confirmed current (no change)

- **Jaganathan et al. 2024 mortality coefficient** (`calc.mjs`): 8.6% (95% CI 6.4–10.8) excess all-cause mortality per +10 µg/m³ PM2.5 — exact match to the published paper (Lancet Planetary Health, Dec 2024).
- **GRAP thresholds and school-closure rules** (`calc.mjs`): Stage I–IV AQI bands and the Class V / Class VI-IX+XI hybrid-mode provisions match the CAQM schedule's most recent revision (21.11.2025), confirmed still in force via a May 2026 Stage-I invocation under the same text.
- **BS-VI sulphur reduction** (50→10 ppm, 80%, April 2020) — confirmed against PIB and IOCL sources.
- **FAME I (₹895 Cr), FAME II (₹11,500 Cr), PM E-DRIVE (₹10,900 Cr)** outlays — all confirmed against PIB/Ministry of Heavy Industries releases. (PM E-DRIVE's tenure was separately extended to 2028, but its ₹10,900 Cr outlay is unchanged.)
- **Delhi Metro Phase 4 scale**: ~112 km sanctioned, ~25 km operational — both confirmed (only the *opening date* was wrong, fixed above).
- **NCAP non-attainment city count, 131** — confirmed as CPCB's own current official figure, though CREA's own reports have carried "130" across three consecutive editions without explanation; no source documents an actual removal of a city from the list, so 131 (the government's own list) is treated as current. Flagged below for future monitoring.
- Berkeley Earth cigarette-equivalence (22 µg/m³·day ≈ 1 cigarette), AQLI life-expectancy coefficient (-0.98 yr per 10 µg/m³ above WHO), and the transport-exposure multipliers in `calc.mjs` — unchanged since the last verification round, no new evidence found to revise them.
- `panels/economic.html`, `panels/source-selector.html` — unchanged since the 17 Jul round; still current per that round's verification.
- The five new blog posts published 17–18 Jul 2026 are meta/product posts (about the fact-check process itself, the mascot, contributing, and a shipped-features roundup) with no new external checkable statistics.

## Flagged for review (unresolved — need a human call)

1. **CPCB CAAQMS "~250 cities" companion figure.** The station count (~565) was updated, but the paired city-coverage figure could not be independently verified this round — secondary sources mix the CAAQMS-only network with the larger combined CAAQMS+manual-NAMP total (1,600 stations / 584 cities), which is a different, larger metric. Recommend a dedicated check against CPCB's live monitoring-network page (returned HTTP 503 to non-Indian-origin requests during this round).
2. **`budget.html`'s aggregate NCAP chart** (`budgetNcapChart` in `app.js`): MoEFCC Direct ₹1,615 Cr + XV-FC ₹11,800 Cr = Total ₹13,415 Cr. A prior round (17 Jul) found the XV-FC component should be ~₹11,021 Cr per Mongabay's coverage of CREA's report, but 1,615 + 11,021 ≠ 13,415 — the arithmetic doesn't reconcile against either the old or the suggested figure. Not touched this round; needs a fresh read of the CREA report's exact fund-release table before editing.
3. **Crop Residue Management state-wise breakdown** (Punjab 46% / Haryana 30% / UP 21%, `budget.html`) is a Nov 2024 snapshot that doesn't sum to the newly-updated ₹4,266 Cr total and predates Madhya Pradesh's inclusion. Flagged inline on the card; no updated per-state split was located this round.
4. **`accountability.html` interventions table**: "90/130 Studies Done (CREA 2026)" (real-time source apportionment) and "28/130 Cities Still No CAAQMS (2026)" were not part of this round's research scope and have not been independently verified — carried over unverified, not confirmed current.

## Files checked, no issues found requiring changes

`netlify/functions/lib/calc.mjs` (all constants current), `panels/economic.html`, `panels/aqi-explainer.html` (only an h4→h3 accessibility fix, no content change), `panels/source-selector.html`, `panels/resources.html`, `panels/voices.html`, `panels/faq.html`, `panels/progress.html` (all last verified 17 Jul, unchanged since), five blog posts published 17–18 Jul 2026.

---

*Prior rounds this month: [`fact-check-2026-07.md`](./fact-check-2026-07.md) (site-wide baseline sweep, 33 corrections), [`fact-check-2026-07b.md`](./fact-check-2026-07b.md) (round 2, 34 applied), [`fact-check-2026-07c.md`](./fact-check-2026-07c.md) (content sweep of previously-unchecked panels/posts, 18 applied/resolved). This round closes the gap those left open: the data files that inject values at runtime (`scripts/stats.json`, the live Ask JanVayu prompt data in `netlify/functions/air-query.mjs`), the README, and a Chart.js dataset in `app.js` that had drifted out of sync with already-corrected panel content.*
