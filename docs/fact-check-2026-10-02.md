# Fact-check, 2 October 2026

**Method.** Five verifiers each took a set of claim-bearing files, extracted the checkable claims, and checked them against a primary source: `index.html` and `try.html`; the economics and policy panels (`economic`, `budget`, `progress`, `accountability`); the health and explainer panels (`aqi-explainer`, `faq`, `lifetime`, `citizen-action`, `actions`); `legal` and `resources`; and the calculators and the assistant's prompt (`calc.mjs`, `app.js`, `air-query.mjs`). They changed nothing. Every correction below was then checked a second time before it went in: I opened the source myself, recomputed the arithmetic, or parsed the document locally (the CAQM Act, the CREA 2026 report, the CPCB 2012 children's study, the Crossref record for LongPMInd). Where a verifier's claim could not be reproduced it was not applied; those are listed at the end.

**Scope.** About 415 claims were extracted across the files above; roughly 170 were reported as table rows and checked individually. Not covered: `voices`, `gallery`, `team` (testimonies and photographs), the 40 study cards on `resources`, and everything derived from the site's own data files, which `check-site-figures.py` polices.

**Last round:** 8 September 2026 (targeted, 12 statistics). The cadence the routines are meant to keep is weekly. Scheduled routines stop when credits run out, so this round was run by hand.

---

## Corrections made

### Claims that were wrong

| Where | Was | Now | Source |
|---|---|---|---|
| `index.html` hero, 3 more places in `index.html`, `legal`, `voices`, `progress`, `resources`, `air-query.mjs`, `workshops/walkthrough.md` | "first-ever off-season GRAP Stage-I" on 19 May 2026 | Stage I was imposed in May 2025 and on 16 April 2026 (AQI 226) before the 19 May 2026 invocation | AIR, 16 May 2025; The Week, 17 Apr 2026 |
| FAQ structured data (deaths) | One answer giving 1.72 million, with "1.5 to 2 million depending on methodology" | Three figures, kept apart: ambient PM2.5 1.72 million (2022, Lancet Countdown 2025); ambient, household and ozone about 2 million (2023, State of Global Air 2025); about 1.5 million a year, 2009 to 2019 (Jaganathan et al. 2024) | the three sources |
| FAQ (Delhi) | "approximately 100 µg/m³, 20 times" | New Delhi 82.2 µg/m³ in 2025, about 16 times | IQAir 2025 |
| FAQ (NCAP funds) | "over ₹11,200 crore, 68% utilisation, 67% to road dust" (the 2025 edition) | ₹13,415 crore released, ₹9,929 crore utilised (74%), 68% to road dust | CREA, *Tracing the Hazy Air 2026*, read in full |
| FAQ (children) | "reduced lung capacity ... comparable to smoking" | 43.5% of Delhi schoolchildren had reduced lung function, against 25.7% in a control group; no smoking comparison appears in the report | CPCB-commissioned study, 2012, read in full |
| `index.html` Did-you-know | dementia "~17% higher per 10 µg/m³" | about 8% per 5 µg/m³ (hazard ratio 1.08, 95% CI 1.02 to 1.14); the paper reports per 5 | Lancet Planetary Health 2025 |
| `progress` | Varanasi 76.4% and Moradabad 58% "PM10 reduction (NCAP top performer)"; "26.8% nationwide NCAP aggregate" | PM2.5 reductions 2019 to 2024 from Respirer Living Sciences (Jan 2025); 27% across all monitored cities, 24% in NCAP cities. A Lancet Regional Health SE Asia (2024) model forecast only 40% PM10 for Varanasi | Outlook Business report of the Respirer study; the Lancet paper (PMC11492728) |
| `progress` | Delhi e-bus target 7,500 by end 2026 | 7,000 | electrive, 9 Jul 2026, quoting the Delhi government |
| `progress`, `air-query` | PM-eBus Sewa "$2.4 billion ... by 2026" | ₹57,613 crore scheme, ₹20,000 crore central support, 10 years of operating support | Union Cabinet, Aug 2023 |
| `budget` | XV-FC "87% of all NCAP city funding" | 82% of funds released (₹11,021 of ₹13,415 crore) | CREA 2026 |
| `budget` | "40 of 131 cities lack source apportionment" | 40 of 130 | CREA 2026 |
| `budget` | Fire reduction "-79%" | "-78%": 18,457 / 82,533 = 22.4% | arithmetic on the page's own figures |
| `accountability` | Promise: "40% PM2.5 reduction by 2026" | 20 to 30% PM10 by 2024, revised to up to 40% PM10 (or the 60 µg/m³ standard) by 2025-26 | CREA 2026; MoEFCC via PIB |
| `legal` (CAQM Act) | "Section 14, 15 ... 5 years imprisonment" | ss.3(6) proviso, 14, 15: Commission's directions prevail over the state governments, CPCB and the state boards; s.14 penalty up to 5 years or ₹1 crore or both, **not applicable to farmers for stubble burning**, for whom s.15 provides environmental compensation | the Act's text, parsed locally |
| `legal` (MV Act) | s.190(2) "Mandatory PUC ... fuel denial" | s.190(2) penalises driving a vehicle that breaches pollution standards; "no PUC, no fuel" is a Delhi enforcement measure, not part of the section | |
| `legal` (Art. 21) | "Article 21 overrides Article 19(1)(g)" | a trade restriction must pass Article 19(6) reasonableness; Article 21 includes the right to clean air (*Subhash Kumar*, 1991) | flagged for the owner's review |
| `legal` (*Ranjitsinh*) | "frames air pollution as constitutional rights defense" | right to be free from the adverse effects of climate change, Arts 14 and 21; the case concerned the Great Indian Bustard | 2024 INSC 280 |
| `legal` (10/15-year rule) | "Enforcement: de-registration + impounding active" | SC, 12 Aug 2025: no coercive action while the review is heard; a later order reportedly narrows this to BS-IV and newer vehicles | LiveLaw; SCC Online |
| `legal` (transport share) | vehicles "the largest single local source ... ~39%" | 39% of the emissions inventory but 28% of modelled winter concentration, below industry's 30% | TERI-ARAI 2018 executive summary, parsed locally |
| `legal` (NGT) | fee "₹1,000 (waived for BPL)", "mandated to dispose within 6 months", "no lawyer required" | ₹1,000 where no compensation is claimed, none for BPL applicants claiming compensation; "endeavour" to decide within 6 months (s.18(3)) | NGT Rules 2011; NGT Act |
| `legal` (template letter) | janvayu.org | janvayu.in | |
| `resources` (CSE) | one document shown three times, as "Apr 2026", "May 2025" and "2024", with the CREA 23-of-100 figure attributed to CSE | one document, 19 July 2024; "64% of the overall utilisation (funds data as of 3 May 2024) went to road dust" | CSE press release |
| `resources` (TERI-ARAI) | vehicles 28, industry 30, dust 18, biomass 12 | industry 30, transport 28, dust 17, fuel and biomass 14 (winter, Delhi) | executive summary |
| `resources` (GRAP-4) | badge "Dec 2024" | Dec 2025 | Hindustan Times URL timestamp (13 Dec 2025) |
| `resources` (XKDR) | "553 CPCB CAAQM stations" | 558 monitoring stations | xkdr.org |
| LongPMInd citation, 13 files | "Wei et al., 2024" | **Wang et al., 2024** (Wang, Zhang, Zhao, Wang, Kota, Fu, Liu, Zhang) | Crossref, DOI 10.5194/essd-16-3565-2024 |
| `citizen-action` | anti-smog guns "Rs 58 Cr" and "reduce AQI by only 5-10 points" | about Rs 5.9 crore (Rs 58,834,480); the AQI effect had no source and is removed | ThePrint, 7 Nov 2025 |
| `citizen-action` | stubble "15-35% at peak" and "zero stubble burning = AQI >300" | season average about 4.2% (Oct-Nov 2025) and 0.2% in December 2025, when PM2.5 averaged 210 µg/m³ | CSE |
| `actions` | cloth mask 10 to 30%, surgical 30 to 50%; "box fan + HEPA = 80% as effective"; indoor plants "trap particulates" and "more effective in sealed apartments"; MCD helpline 1800-111-6397 | cloth about 15 to 65% in one lab study; box-fan claim replaced by the Corsi-Rosenthal box result; plants do not clean indoor air at a useful rate; MCD Citizen's Call Center 155305 | Shakya et al. 2017; Aerosol Sci Technol 2022; Cummings and Waring 2020; mcdonline.nic.in |
| `air-query.mjs` (PM2.5 60 and 100) | "CPCB AQI ≈ 150" and "≈ 174, Moderate" | CPCB 100 (Satisfactory) at 60; ≈ 232 (Poor) at 100; EPA (2024) ≈ 154 and ≈ 182 | CPCB NAQI bands; EPA Table 6 |
| `air-query.mjs`, `source-selector` ("88% of stations") | "CAG April 2025: 88% of CPCB stations had a data-quality issue in 2023-24" | 88% of the 25 Delhi stations Newslaundry checked flouted siting criteria; the CAG tabled an audit in April 2025 saying Delhi siting did not meet CPCB requirements; CAG's 13-of-24 check was in 2020 | Newslaundry, 1 Apr 2025 |
| `air-query.mjs` (RTI template) | "BS-III/BS-IV ban during GRAP **Stage IV**" | Stage III | ThePrint, 29 Sep 2026 |
| `air-query.mjs` (stubble) | "25-40% of Delhi-NCR PM2.5 during peak weeks" | CPCB RTI reply: October-December average 3.5% in 2025, 9 to 13% in 2020 to 2024; single days are far higher | Tribune, 30 Dec 2025 |
| `air-query.mjs` (charging stations) | 8,849 | 29,151 installed (8,805 fast, 20,346 slow) | MoHI reply, 16 Dec 2025 |
| `air-query.mjs`, `budget` (PM E-DRIVE) | "₹10,900 Cr, 2024-2026", "industry seeks extension" | extended to 31 March 2028 within the same outlay; e-2W and e-3W subsidies end 31 March 2026 | PIB, 8 Aug 2025; Autocar Professional |
| `air-query.mjs` | "16th FC report expected Oct 2026" | tabled 1 February 2026 | PRS |
| `air-query.mjs` (bug) | December was given the stubble-season text | October and November only | code reading |
| `app.js` exposure report | life-years lost = (PM2.5 − 5) × **0.018** × hours/8 | (PM2.5 − 5) × **0.098**, the AQLI coefficient the other calculators already use; Delhi at 82.2 now reads about 7.6 years, not about 1.4 at eight hours outdoors | AQLI methodology |
| `app.js` | "Based on GEMM model estimates" | AQLI and Berkeley Earth, which is what the formulas are | |

### Wording tightened

"Among the world's largest" for the death toll in share-card alt text (the "largest" claim could not be sourced); "meet the WHO PM2.5 guideline" for the 14%; the Lancet figure is for 2022, not "per year"; the hero label on the 82.2 figure now reads "New Delhi"; the activity-threshold bands in the assistant's prompt are labelled as US-EPA category bands, not WHO guidance; the transport multipliers are labelled as JanVayu assumptions, not Goel et al.'s ratios; the Jaganathan mortality coefficient is labelled indicative above about 70 µg/m³; the "Delhi shame" funding lines show both the RTI and Lok Sabha figures and say they differ in basis.

---

## Checked and unchanged

| Figure | Site | Source | Verdict |
|---|---|---|---|
| Annual PM2.5 deaths | 1.72 million (2022) | Lancet Countdown 2025 India data sheet | correct |
| Economic cost | $339.4 billion, 9.5% of GDP | same | correct |
| IQAir 2025 | India 6th, 48.9; Loni 112.5; 14% of cities meet the WHO guideline; New Delhi 82.2, eighth year as worst capital | IQAir press release (Loni, 14%, 9,446 cities, 24 Mar 2026); India's rank and 48.9 and New Delhi's 82.2 from secondary reports (Outlook Traveller, 25 Mar 2026, among them), not the release text | correct; the 14% and Loni are primary, the rest secondary |
| CREA 2026 | 130 cities, 102 with monitors, 100 with ≥80% PM10 data, 23 met 40%, 51 met the first target, 23 rose; 565 CAAQMS in 289 cities; ₹13,415 / ₹9,929 crore; 90 of 130 with source apportionment; 28 without CAAQMS | CREA PDF, read in full | correct |
| NCAP cities | 131 | PIB PRID 1989207 | correct |
| AQLI 2025 | India 3.5 years, Delhi-NCR 8.2 | EPIC, via press | correct |
| Berkeley Earth | 22 µg/m³ = 1 cigarette | Berkeley Earth | correct; a rule of thumb from average chronic mortality, not an acute-dose equivalence |
| WHO guideline / NAAQS | 5 / 40 µg/m³ | WHO 2021; CPCB 2009 | correct |
| AQI explainer, EPA column | 30, 60, 100, 250 µg/m³ give 90, 154, 182, 350 | EPA Technical Assistance Document, Table 6 (2024 breakpoints, 151 to 200 band is 55.5 to 125.4) | correct, recomputed |
| AQI explainer, CPCB column | 50, 100, 232, 400 | CPCB NAQI | correct |
| NAAQS and WHO 2021 tables for PM10, NO₂, SO₂, O₃, CO | as shown | CPCB 2009 notification; WHO 2021 Table 0.1 | correct |
| WAQI sub-index conversion | tables use the 2016 EPA breakpoints (151 to 200 is 55.5 to 150.4) | aqicn.org's scale page still publishes the 2016 table | correct for WAQI; EPA's 2024 table is used on the explainer page, where the page says so. The "160 reads about 73 µg/m³" example in the correction post is on WAQI's table |
| Monsoon retreat, GRAP revision | 21 Sep; 37% and 26% deficits; revised GRAP of 28 Sep | Tribune, 24 Sep; ThePrint, 29 Sep | correct (news events) |
| Delhi AQI over 500 on 17 Jan 2026, 73 times the WHO guideline | | IQAir | correct |
| Delhi stations: 88% flouted siting norms (Newslaundry's 25) | | Newslaundry | correct as now worded |
| FGD, CRM, FAME I and II, XV-FC ₹16,539 crore | | PIB and press | correct |
| Delhi day counts (1.5 Good, 188 Poor-or-worse, 175 Satisfactory or Moderate; 5 Good in 2020) | the tile shows 2, 189 and 175, which sum to 366 | the repo's own `data/aqi-bulletins.json` | the tile was right apart from rounding (the three averages sum to 364.7 days); 189 became 188, and the source line now names the data, not a newspaper |
| Report vintages | Lancet Countdown 2025; AQLI 2025; IQAir 2025 | the 2026 global Lancet Countdown launches at the Health and Climate Change Conference on 28 October 2026; no 2026 AQLI edition found | current; **re-check after 28 October** |

---

## Flagged, not changed

These need a decision or a primary document that could not be reached. Nothing here was edited.

1. **The state-wise court rulings in `legal.html`: resolved.** A second pass sent four verifiers to find the actual order behind each of the 28 entries and to quote it. **One entry (the off-season GRAP invocation, a news event) was confirmed; none of the other 27 could be confirmed as worded.** Most had no matching order at all: for example the ₹25 lakh penalty on Patna Municipal Corporation, ₹50 lakh on the Howrah foundry cluster, 10 additional CAAQMS in Bihar, 50 PUC stations in Kolkata, the Madras High Court Ennore-Manali audit, the Maharashtra Pollution Control Board's 14 closure notices in Chakan, and the Supreme Court's "four-week deadline" on stubble burning. Some figures resemble unrelated matters: the only ₹10 lakh figure found for Mumbai Metro is a Supreme Court fine over tree-felling at Aarey, and ₹2,500 an acre was a 2019 state incentive, not a 2025 order. Those entries are removed. In their place are the real orders in the same areas, each with court, case name and number, date and what it directed: NGT OA 687/2023; Patna HC CWJC 17536/2022; Calcutta HC WPA(P) 1/2026 and 5/2026; the NGT Southern Zone order of 28 April 2026 (the page had said Principal Bench); Bombay HC Suo Motu PIL 3/2023; NGT OA 343/2022; Singrauli OA 240/2024; NGT Central Zone OA 181/2025 and 175/2025; NGT OA 681/2018; and the Supreme Court's stubble orders of 3 Feb and 12 Nov 2025, 6 Nov 2019 and 16 Oct 2024. One finding changes the site more widely: **M.C. Mehta v. Union of India, W.P.(C) 13029/1985, was disposed of on 12 March 2026**, with a fresh suo motu case on NCR air pollution registered; "ongoing" is corrected on the legal panel, the homepage link text and a quiz clue. Where an order's text could not be opened (for example the NGT Southern Zone order of 28 April 2026), the entry says what the press reported and tells readers to read the order itself.
2. **"SC four-week deadline on stubble burning (2025)" and "₹2,500 an acre": resolved** as above; neither was in a 2025 order.
3. **NGT Southern Bench order, 28 April 2026: corrected** to the Southern Zone bench in Chennai; "first order beyond the Indo-Gangetic Plain" removed. The order text itself was not retrieved, so the entry carries no case number.
4. **GRAP table in `legal.html`** (lines 92 to 115): the Stage III and IV measures predate CAQM's 21 November 2025 revision; the schedule PDF could not be fetched. The AQI bands are right.
5. **Solid Waste Management Rules 2026** reported as replacing the 2016 Rules from 1 April 2026 (`legal` cites the 2016 Rules in five places). Not confirmed against the notification.
6. **Per-city NCAP rupee figures** (`budget.html`): Delhi 81.36 / 14.10 / 17% is the RTI figure; press reports of a Lok Sabha reply of 2 February 2026 give ₹14.1 of ₹99.77 crore released (14%). The sansad.in reply could not be opened. Noida (₹127 / ₹30 crore / 24%, a share of allocation) and Ghaziabad (₹48.50 crore, over 80%) could not be traced to a source. Rebuild all three rows from the Lok Sabha reply.
7. **"Roughly a quarter to a third of the global PM2.5 death burden"** (`stats.json`, `index.html` line 1621, `resources`, `air-query`). The one-third ratio found is for the fossil-fuel subset (752,000 of about 2.52 million), not for 1.72 million. Not changed because `check-site-figures.py` ties it to `stats.json`.
8. **Source-apportionment tables in `air-query.mjs`** (the city and national splits, "CEEW 2024 *Source Apportionment of PM2.5 in India*", "CAQM 27th meeting"): every block sums to exactly 100 with round numbers, and no CEEW report with that title was found. Rules 19 and 20 of the prompt forbid inventing exactly this. Needs a human check against what CEEW and IITM-DSS actually published.
9. **Calculators** (partly fixed). The transport multipliers now use Goel et al.'s on-road to ambient concentration ratios (walk 1.4, cycle 1.1, auto 1.3, bus 1.2, air-conditioned car 0.5, metro carriage 0.8), say that they are concentration and not dose ratios, and no longer list "train", which had no source; `test/calc.test.mjs` is updated. `CITY_ANNUAL_PM25` carries Delhi as 82.2 (IQAir 2025) and says the other cities are hand-entered approximations. **Still open:** the diary multipliers in `app.js` (cooking with solid fuel 15, and others) are unsourced, and the other 32 city annual values are unsourced.
10. **School-closure risk** (fixed). The assistant now converts live PM2.5 to the CPCB scale (`pm25ToCpcbAqi`, from CPCB's NAQI bands, tested at 30, 60, 100 and 250 µg/m³) before comparing with GRAP's triggers, and says the result is indicative because a CPCB AQI is the worst of several pollutants. The Diwali window in `getSeasonalContext` is now mid-October to mid-November and no longer states a peak figure.
11. **Dementia and children claims in `index.html` and `faq.html`**: "stunting and cognitive development delays" was removed for lack of a primary paper; Pandey et al. (2026) in `resources` could not be confirmed (17 days old).
12. **`citizen-action.html`**: the NYT child-exposure comparison (Monu and Aamya) has unsourced peak values (180 and 80 µg/m³) and the Delhi source-apportionment bars sum to 92% with no source; CSE's own figure is 51 to 53% for vehicles over 10 to 20 November, and 46% over 1 to 15 December 2025.
13. **Other items without a primary source**: "No lawyer required" at the NGT; Supreme Court filing fee "₹50"; "Proposed ICE sales ban (2026)"; Jan Vishwas amendments to the Air Act and EPA (a lawyer's check before any penalty is added); the Diwali window in `getSeasonalContext` is hard-coded to 1 to 15 November, though Diwali fell on 20 October in 2025; sensor and accuracy ranges in the prompt ("20 to 50%", "5 to 10%"); "~3,000+ CC0 sensors in India".

---

## What this round says about the process

**The verifiers were wrong often enough that a second look was necessary.** Of the corrections they proposed, these did not survive checking: a PM E-DRIVE outlay of ₹11,900 crore (the sources I read say ₹10,900 crore, unchanged); a claim that the Delhi day-count tile was inconsistent (it is correct to rounding); a claim that the Raebareli figure should be 57% (the paper says 58%); and several search-snippet summaries that gave a wrong figure for a page the verifier had not opened (the CREA dust share as 64%, where the page says 68%). The method that held up was opening the source and recomputing.

**Most errors were old and consistent, not new.** The "first-ever off-season" wording, the Wei/Wang citation, and the "CSE" figures each appeared in three to thirteen places. The 8 September round found the same pattern. A correction that reaches the homepage and misses `air-query.mjs` or `walkthrough.md` is the common failure; this round grepped each corrected phrase across the repository, and that is the step to keep.

**The assistant's prompt carried the most unsourced material.** It states numbers with the confidence of a source and no citation, and it is the one part of the site that composes its own sentences from them. It is the best place to spend the next round.

**Routines.** The weekly fact-check and the Ask JanVayu eval stop when credits run out. `check-factcheck-freshness.py` allows 120 days, which is looser than the weekly promise; a person has to notice a lapse. This report is the first since 8 September, a gap of 24 days.
