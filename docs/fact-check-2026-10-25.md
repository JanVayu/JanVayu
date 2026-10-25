# Fact-check, 25 October 2026

Method. Five verifiers each took a set of files and checked every claim that carries a number, date, legal citation, programme figure, agency name or provider term against a primary source. They changed nothing. The corrections below were then applied by hand, and each one is a statement the verifier could source. Items a verifier could not source are listed at the end as open.

Scope. This round covers what the 2 October round (`docs/fact-check-2026-10-02.md`) did not: the 59 study cards that were on the Reading List (the two added today were checked by hand), 36 of the 49 blog posts (the other 13 carry no external claim or rest on the site's own data), `README.md`, the English documentation under `docs/`, the About, Team, Voices and Gallery panels, the Delhi page, the walkthrough deck and the workshop guides. About 90 claims in the documentation were checked. Not covered: testimonies and photograph captions, and every figure the site computes from its own data files, which `check-site-figures.py` polices. The full text of 22 of the first 30 papers was not read; those verdicts rest on the abstract and the Crossref record.

Prompted by. Two articles in The Hindu, on 23 and 24 October 2026 (an excerpt from Jacob Koshy's *The Nitrogen Bomb*, and Neelima Vallangi's report on record Pacific warming). Checking the first against CREA's own documents found the largest error of the round, below.

---

## Corrections made

### Claims that were wrong

| Where | Was | Now | Source |
|---|---|---|---|
| Secondary PM2.5 post (8 July), Reading List card, Citizen Voices card | "Up to 42% of India's PM2.5 is secondary" | 42% is Chhattisgarh's annual ammonium sulphate share (states range 17% to 42%); CREA's national average for ammonium sulphate is about 34%; total secondary share is larger than either. The post is retitled and carries a correction note. | CREA press release, 24 Dec 2025; CREA report, 30 Jun 2025 |
| We-fact-checked-ourselves post | Dementia "about 17% per 10 µg/m³" | Pooled hazard ratio 1.08 (95% CI 1.02 to 1.14) per 5 µg/m³; the 2 October round had corrected the homepage but not this post | Lancet Planetary Health, 2025 |
| Understanding-AQI post | "The CPCB scale is more lenient across the range" | Lower numbers than the US EPA index below about 80 µg/m³ and higher above it: 100 µg/m³ is 232 on the CPCB scale and 182 on the EPA scale (recomputed from both breakpoint tables) | CPCB NAQI; EPA AQI technical assistance document |
| Citizen Voices panel | Messi event at "JLN Stadium" | Arun Jaitley Stadium, 15 December 2025 | press reports of the event |
| Policy tracker doc | 15th Finance Commission "₹12,139 crore ... over 5 years" | ₹16,539 crore to 42 million-plus cities for 2020-21 to 2025-26 (the Delhi panel already used this figure) | PIB, Lok Sabha reply, 5 Feb 2024 |
| MP post | Patna "a city with 71 approved wards" | 628 boundary entries, 71 marked approved; Patna Municipal Corporation has 75 wards | Patna Municipal Corporation |
| README | All 31 gallery photographs "CC or public domain" | 29 openly licensed or public-domain, two by Bryan Denton shown with permission | gallery panel |
| About panel and README | New Delhi "flat near 50" and "near 55" in the 1990s | "near 55" in both (district history file: 51 to 57, mean about 54.7) | `data/district-history.json` |
| Economic cost post, Reading List card | Out-of-pocket health spending "down sharply over the past decade" | 43.4% in 2022-23, up from 39.4%, after falling for a decade | National Health Accounts 2022-23 |
| Reading List, Pandey et al. 2026 | "emission factors for PM2.5"; "Delhi's winter source apportionment has had to estimate these figures" | Factors for 17 species including PM1, from two plume events; the second sentence is not in the paper | npj Clean Air 2, 56 |

### Claims stated more strongly than the source

| Where | Change |
|---|---|
| Wang et al. 2024 card | "Health burden keeps climbing even as concentrations fall" now says premature deaths rise under every scenario (1.01 million in the 2020s to 4.12 to 5.44 million in the 2100s), concentrations fall in every scenario except SSP3-7.0, and ageing and growth offset the gain |
| Chowdhury et al. 2019 card | "cutting household sources" now says "completely mitigating", the paper's condition |
| Guttikunda et al. 2023 card | "quantitative review" removed; the abstract reports limited consensus on source contributions |
| Ghosh and Sinha 2025 card | "trends" removed; the abstract does not claim them |
| Ali et al. 2026 card | Rewritten to the paper's result: PM1 tracked closely (R² about 0.90 to 0.95), PM10 poorly (about 0.28 to 0.68), nothing below 0.3 µm |
| Mandal, Muruganantham, Parikh, Agarwal, Muni Lakshmi and Shafi cards | Rewritten to what each abstract reports, including the study design, effect sizes and the authors' own caveats |
| Alsafari and Ghanchi cards | The 15 µg/m³ WHO threshold behind "2,025 exceedance days" is stated; the 18.39 RMSE is tied to the run that produced it |
| Stubble post | "The fires have fallen sharply" now sets the official >90% fall in counted fire incidents beside the ISRO geostationary finding of no decline in total activity over 2020 to 2024; seeder prices carry the subsidy; the 4 to 6 PM finding is attributed to Jethva's geostationary analysis |
| NCAP post | Target stated as PM10, 20 to 30% by 2024-25 against 2017-18, revised to up to 40% or 60 µg/m³ by 2025-26; the 68% is "allocated", not "spent"; secondary particles added to the list of sources |
| Economic cost and Lancet posts | Retitled to what the sources measure: monetised premature deaths in 2022, and a causal estimate of excess deaths; "settle the scientific case" softened |
| Children post | Vital Strategies' 90% is global; the 1.72 million is PM2.5 in 2022 across all ages; the 10.4-point stunting estimate is from NFHS-4 data; GRAP Stage IV discontinued physical classes for all but Classes 10 and 12 |
| Urban heat island post | Bloomer et al.: 21 years, rural eastern United States, about 3.2 ppb per °C before 2002 and 2.2 after; Analitis et al.: the 54% is the heat-wave excess in daily deaths |
| Delhi 211-days post | Monsoon season was 16% above the long-period average, which IMD classes as normal; the Satisfactory-or-better count is for the city-wide figure |
| Villages, map, air-pictures, Gangetic Plain, 33-cities and what-we-do posts | Byrnihat dated to the 2024 ranking; CAMS cells about 45 km; household air pollution figure restated as SoGA's all-air-pollution total (more than 2 million, 2023); "700 km" removed; Human Footprint year stated; XKDR coverage caveat dated; Hawa Ka Hisab described as opened on 19 July 2026 with its baseline window and publisher wording as its own pages give them |
| WAQI doc | Quota is 1,000 requests per minute with bursts of 60, and the terms on attribution, non-profit notification and cached copies are stated |

### New material

- Blog: "Ammonia, the other half of secondary PM2.5, checked against what has been published" and "A very strong El Niño is forecast, and one study asks what it did to winter air last time".
- Reading List: Wang et al. (2025, ammonia and South Asian PM2.5, CC BY 4.0) and Yadav, Beig and Kripalani (2026, ENSO and winter PM2.5). The list is 61 studies; the BibTeX and RIS files are rebuilt.

---

## Open, and for the owner

These were found and are not changed here, because each needs a decision or a source the verifiers could not reach.

1. Resolved on 25 October, on the owner's instruction. The "non-partisan", "independent of any government or party" and "not affiliated with any political party" claims were replaced everywhere by a statement that JanVayu grew out of an AIPC campaign and was built under its fellowship programme. The practices stay as rules. The translated docs (`docs-bn`, `docs-hi`, `docs-mr`, `docs-ta`) and the PowerPoint and PDF walkthroughs still carry the old wording until they are regenerated.
2. WAQI's terms of service. The terms ask non-profit users to notify WAQI by email before public use, and do not allow data to be redistributed as cached or archived copies. JanVayu caches WAQI readings and publishes derived datasets. Whether WAQI has been notified, and whether the derived datasets fall inside the terms, needs the owner's answer.
3. Dr Guttikunda's attributions in three posts (the Jeopardy format, his workshops and teaching) still have no written confirmation, as recorded on 2 October.
4. Claims no verifier could source: Varanasi's 26.9 µg/m³ in 2023 (NCAP post); the AQLI 2024 values in the data-corrections post; the list of 13 countries meeting the WHO guideline (IQAir post); the WHO developmental-delay sentence (children post); the Census 2011 village count of 649,481, where 640,867 also circulates; the "160+ public sources" in the data-sources overview; ₹11,211.13 crore in the policy tracker; the 1,600 monitoring stations in the city comparison guide.
5. `docs/tech-stack/ai-layer.md` labels Groq's 30 requests per minute and 200,000 tokens per day as free-plan limits. Groq's page now calls them developer-plan base limits; the numbers are unchanged.
6. The SatPM2.5 citations (`docs/data-sources/boundary-map.md`, `ward-map.md`, `README.md`) point to a page that does not yet list V6.GL.03. The data, licence (CC BY 4.0) and 2024 end year are confirmed at satpm.org/v6-gl-03.
7. The Reading List describes itself as "peer-reviewed studies on India's air quality", but three cards (Walter, Ilenic, Alsafari) are not studies of India. Their descriptions name the places, so nothing is false.
8. The Delhi page could add that CPCB's own bulletin gives a January to September 2026 average AQI of 167.6, against 164.3 a year earlier, beside CAQM's fewer poor days.
9. Health Policy Watch writes that Delhi was the most polluted capital "for the seventh time in the last eight years". Wherever the site says "eighth", check it against IQAir.

## Not an error, left alone

The 17 em dashes the style check reports in the Voices panel are verbatim quotations and testimonies. The 16 in `index.html` are "no value" placeholders in tables and counters.
