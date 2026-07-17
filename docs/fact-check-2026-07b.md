# Fact-check pass — July 2026 (round 2)

**Date:** 2026-07-17  
**Method:** Automated site-wide extraction (267 statistics) followed by a 12-agent, file-scoped verification pass. Each prior finding was re-checked against the *current* file state and re-verified against primary sources (Lancet Countdown, IQAir, AQLI, State of Global Air/HEI, WHO, CPCB, CREA, NASA).

## Summary

| Decision | Count | Meaning |
|---|---:|---|
| applied | 34 | Wrong/stale figure corrected with a sourced value |
| already fixed | 17 | Current file already correct (prior pass) |
| rejected | 21 | Prior finding was itself wrong; site value defensible |
| flagged | 45 | Real issue, needs human judgement (editorial / contested sources) |

Total decisions: 117 across 12 files.

## Applied corrections

### index.html

- **NCAP body text says '27 of 96 cities' met target — actual CREA figure is 23 (JSON-LD schema, line ~128)**  
  `27 of 96 cities with adequate data had met this target` → `23 of 96 cities with adequate data had met this target`  
  A prior pass changed the correct '23' to an unsupported '27'. CREA Tracing the Hazy Air 2026 states 23 cities met the 40% PM10 target. Correcting back to 23. Does not flip the accountability direction (still a large-majority failure); simply restores the CREA-sourced figure.  
  *Source:* CREA, Tracing the Hazy Air 2026 (Jan 2026)
- **NCAP body text '27 of 96 cities' in accountability alert (line ~3455)**  
  `<strong>27 of 96 cities</strong>` → `<strong>23 of 96 cities</strong>`  
  Same error as above; the alert already cites '(CREA, Jan 2026)' and 'Tracing the Hazy Air 2026', both of which report 23 (not 27) cities meeting the 40% PM10 target. Correcting the count to match the cited source and the page's own 23/100 callout.  
  *Source:* CREA, Tracing the Hazy Air 2026 (Jan 2026)
- **NCAP table row '27 of 96 cities' (line ~3615)**  
  `27 of 96 cities with sufficient data met the 40% PM10 target` → `23 of 96 cities with sufficient data met the 40% PM10 target`  
  Restores the CREA-verified count (23) attributed to the CREA count in the same cell.  
  *Source:* CREA, Tracing the Hazy Air 2026 (Jan 2026)
- **NCAP suggested-question text 'Only 27 of 96 cities met it' (line ~3828)**  
  `Only 27 of 96 cities met it.` → `Only 23 of 96 cities met it.`  
  Restores the CREA-verified count (23).  
  *Source:* CREA, Tracing the Hazy Air 2026 (Jan 2026)
- **CSE '37 of 131' five-year review misattribution + 'CSE five-year review, Apr 2026' citation**  
  `31 March 2026 deadline elapsed; CSE five-year review, Apr 2026` → `31 March 2026 deadline elapsed; CREA, Tracing the Hazy Air 2026`  
  The erroneous '37 of 131' figure is already gone from the file, but the card header still cites a 'CSE five-year review, Apr 2026' that does not exist (CSE's five-year NCAP assessment was July 2024). All numbers in this card come from CREA's Tracing the Hazy Air 2026, which is already cited in the card body. Correcting the source label to CREA for consistency and accuracy.  
  *Source:* CREA, Tracing the Hazy Air 2026 (Jan 2026); no CSE Apr 2026 five-year review exists
- **Life expectancy: 'Indo-Gangetic Plain residents lose 7-8 years'**  
  `AQLI 2025 (UChicago EPIC). Indo-Gangetic Plain residents lose 7-8 years &mdash; ` → `AQLI 2025 (UChicago EPIC). Delhi residents lose up to 8.2 years &mdash; the larg`  
  The '7-8 years' IGP figure is stale (older AQLI editions). AQLI 2025 (2023 data) puts Delhi's loss at 8.2 years (largest of any major city); IGP state averages are lower (Bihar ~5.6, Haryana ~5.3, UP ~5.0). Replacing with the verified AQLI 2025 Delhi peak while preserving the accurate 'IGP is the world's most polluted region' point. National average 3.5 yrs in the same card is correct.  
  *Source:* AQLI 2025 Annual Update, EPIC/University of Chicago (2023 PM2.5 data); Business Standard & ETV Bharat coverage, Sep 2025
- **Informal workforce = 93% (key-statistics card)**  
  `color: var(--purple);">93%</div>` → `color: var(--purple);">~90%</div>`  
  The 93% stat card is stale (NCEUS-era unorganised-sector share) and contradicts current data and the page's own other panels, which already say '~90%' (lines 1839, 3289, citing ILO). NSO PLFS/ILO India Employment Report 2024 put informal employment at ~90%. Changing 93% to ~90% for accuracy and internal consistency.  
  *Source:* ILO/IHD India Employment Report 2024; NSO PLFS 2023-24 (~90% informally employed)
- **49% of households on solid fuel (attributed to Census 2021)**  
  `color: var(--amber);">49%</div>` → `color: var(--amber);">~40%</div>`  
  Two-part finding: (1) the 'Census 2021' citation is already gone — this card's footer (line 1947) now cites 'NSO HCES 2023-24'. (2) The 49% value remains stale and contradicts the page's own line 1823 ('~40% ... NSO HCES 2023-24') and line 2955 ('40%'). HCES 2023-24 shows solid-fuel primary use ~40% (firewood ~33% + dung/residue ~7%); NFHS-5 gave ~41%. Changing 49% to ~40% to match the cited source and the rest of the page. (India's decennial census was postponed, so 'Census 2021' could not have been a source.)  
  *Source:* NSO Household Consumption Expenditure Survey 2023-24; NFHS-5 (2019-21)

### panels/budget.html

- **PM E-DRIVE period 2024-2028**  
  `<td>2024-2028</td>` → `<td>2024-2026</td>`  
  PM E-DRIVE officially runs from 1 October 2024 to 31 March 2026 (a two-year scheme), not 2024-2028. The table's period label is wrong; it is also internally contradicted by the card's own note that 'Industry seeks extension beyond March 2026.' Correcting the row's period cell.  
  *Source:* PIB/Ministry of Heavy Industries PM E-DRIVE notification (Oct 2024); IBEF
- **EV mobility card header 'FAME to E-DRIVE (2015-2028)'**  
  `Electric Mobility: FAME to E-DRIVE (2015-2028)` → `Electric Mobility: FAME to E-DRIVE (2015-2026)`  
  The card header end-year 2028 reflects the same PM E-DRIVE end-date error; the scheme window closes March 2026, so the header range should end 2026.  
  *Source:* PIB/Ministry of Heavy Industries PM E-DRIVE notification (Oct 2024)

### panels/source-selector.html

- **88% of stations had data-quality issues, attributed to CAG 2025 audit**  
  `88% of stations had data-quality issues (CAG 2025 audit).` → `88% of stations flouted CPCB siting criteria (Newslaundry investigation, 2025); `  
  Confirmed misattribution. The 88% figure comes from Newslaundry's own field investigation of 25 Delhi monitoring stations (88% flouted CPCB siting criteria), not the CAG audit. The CAG Performance Audit physically verified 13 of 24 DPCC stations and found all sited too close to trees/buildings. Re-attributing to Newslaundry and adding the CAG's own 13-of-24 finding keeps the accountability point (stations are poorly sited) while fixing the source.  
  *Source:* Newslaundry, 'Delhi air quality data unreliable: CAG report confirms Newslaundry probe,' 1 April 2025; CAG Performance Audit tabled in Delhi Assembly, 1 April 2025 (13 of 24 stations)
- **CPCB card data-simple tooltip: 'a 2025 audit found 88% of stations had data quality problems'**  
  `But many cities have only 2-3 stations, and a 2025 audit found 88% of stations h` → `But many cities have only 2-3 stations, and investigations found many stations a`  
  Same misattribution as above inside the simplified-language tooltip: the 88% is Newslaundry's field survey, not a government audit. Reword to attribute the 88% to a field survey and separately note the CAG audit finding, so the simplified text matches the corrected weakness text.  
  *Source:* Newslaundry investigation, 1 April 2025; CAG Delhi air-monitoring audit, 1 April 2025
- **WAQI/aqicn.org coverage: ~12,000 stations worldwide**  
  `Global &mdash; ~12,000 stations worldwide.` → `Global &mdash; 50,000+ stations across ~2,000 cities in 132 countries (aqicn.org`  
  Confirmed stale. WAQI's own coverage page (aqicn.org/sources) states real-time data is available for 'more than 50,000 stations in 2000 major cities from 132 countries.' The ~12,000 figure matches an older count. Updated with a dated inline citation.  
  *Source:* aqicn.org/sources ('more than 50,000 stations in 2000 major cities from 132 countries'), accessed 2026
- **IQAir coverage: 7,800+ cities globally**  
  `7,800+ cities globally.` → `9,446 cities across 143 countries (IQAir 2025 World Air Quality Report).`  
  Confirmed stale. IQAir's 2025 World Air Quality Report covers 9,446 cities in 143 countries, regions and territories (up from 8,954 in the prior edition). Updated with citation.  
  *Source:* IQAir 2025 World Air Quality Report (9,446 cities in 143 countries); IQAir newsroom press release, 2026
- **Sensor.Community: ~3,000+ sensors in India**  
  `~3,000+ sensors in India. Hyperlocal density in cities where volunteers deploy t` → `a small footprint in India &mdash; part of a global network of ~12,000 active se`  
  The unsourced '3,000+ sensors in India' is contradicted by Sensor.Community's own data: the entire global active network is only ~12,000 active sensors across 82 countries, overwhelmingly in Europe (Germany-dominant), so India cannot plausibly hold 3,000+. India's actual share is small (order of dozens to low hundreds) and could not be authoritatively pinned to an exact figure, so rather than invent an India number the coverage line is reframed to the verifiable global total with a source, removing the unsupported figure.  
  *Source:* sensor.community / aqicn.org (global network ~12,000 active sensors across 82 countries, concentrated in Europe), 2026

### panels/accountability.html

- **Real-time source apportionment badge: 50/130 Cities Only (Promises table)**  
  `<span class="badge badge-warning">50/130 Cities Only</span>` → `<span class="badge badge-warning">90/130 Studies Done (CREA 2026)</span>`  
  The 50/130 figure is CREA's April-2025 number; CREA's Jan-2026 report (already cited elsewhere on this page) updates completed source-apportionment studies to 90/130. Relabeling 'Cities Only' to 'Studies Done' also corrects the conflation of one-time studies with true real-time supersites.  
  *Source:* CREA, Tracing the Hazy Air 2026 (9 Jan 2026): '90 of 130 cities completed source apportionment studies'
- **NCAP funds allocated: Rs 11,211 crore to 131 cities (budget tracker)**  
  `<strong>Allocated:</strong> ₹11,211 crore to 131 cities` → `<strong>Released:</strong> ₹13,415 crore to 130 cities — CREA 2026`  
  Superseded by CREA's Jan-2026 report, which this same page already cites (line 59): Rs 13,415 crore released across 130 NCAP cities. Updating removes an internal inconsistency; the label 'Allocated' is corrected to 'Released' to match the source's terminology.  
  *Source:* CREA, Tracing the Hazy Air 2026 (Rs 13,415 cr released, 130 cities)
- **NCAP funds utilized: ~Rs 7,594 crore (68%) — CREA 2025 (budget tracker)**  
  `<strong>Utilized:</strong> ~₹7,594 crore (68%) — CREA 2025` → `<strong>Utilized:</strong> ~₹9,929 crore (74%) — CREA 2026`  
  Superseded by CREA Jan-2026 (Rs 9,929 crore, 74% of Rs 13,415 cr released), the same figure the page's own CREA card already states (line 59). Updating fixes internal inconsistency and refreshes the source year.  
  *Source:* CREA, Tracing the Hazy Air 2026 (Rs 9,929 cr utilized, 74%)
- **Where NCAP funds went: 64% on dust control (CSE) — budget tracker**  
  `<strong>Where it went:</strong> 64% on dust control (sweeping, sprinkling) — CSE` → `<strong>Where it went:</strong> 68% on road dust control (sweeping, sprinkling) `  
  The 64% (CSE, ~2024) is superseded by CREA Jan-2026's 68% on road dust management — the same breakdown the page's CREA card already shows (line 66). Update figure and source for consistency.  
  *Source:* CREA, Tracing the Hazy Air 2026 (road dust 68%)
- **What's missing: Only 50/130 cities completed source apportionment (budget tracker)**  
  `<strong>What's missing:</strong> Only 50/130 cities completed source apportionme` → `<strong>What's missing:</strong> Only 90/130 cities completed source apportionme`  
  The 50/130 figure is CREA's April-2025 number; CREA's Jan-2026 report (already cited on this page) reports 90 of 130 cities completed source apportionment studies. Update for accuracy and internal consistency.  
  *Source:* CREA, Tracing the Hazy Air 2026 (90/130 cities completed studies)
- **Budget tracker source line cites CREA Report April 2025**  
  `Source: RTI Jan 2025, CREA Report April 2025, CSE Assessment` → `Source: RTI Jan 2025, CREA Report Jan 2026, CSE Assessment`  
  Consequent to updating the NCAP fund/dust/source-apportionment figures above to CREA's Jan-2026 edition, the card's source line must be refreshed from 'CREA Report April 2025' to the newer report to stay consistent.  
  *Source:* CREA, Tracing the Hazy Air 2026 (9 Jan 2026)
- **Four I's / Information: Real-time source apportionment only in 50/130 cities**  
  `Real-time source apportionment only in 50/130 cities.` → `Source apportionment studies completed in only 90/130 cities (CREA 2026).`  
  Updates the stale 50/130 (April 2025) to CREA Jan-2026's 90/130 completed source-apportionment studies, and corrects the 'real-time' mislabel (true real-time supersites exist in only a handful of cities, so bumping the number under a 'real-time' label would be inaccurate).  
  *Source:* CREA, Tracing the Hazy Air 2026 (90/130 completed source apportionment studies)

### blog/posts/2026-03-25-economic-cost.md

- **World Bank ~$150 billion/year earlier estimate**  
  `The World Bank's earlier estimate of ~$150 billion per year, widely cited throug` → `An earlier Greenpeace/CREA estimate (2020) of ~$150 billion per year from fossil`  
  The ~$150 billion/year (5.4% of GDP) figure is misattributed. Primary source confirms it comes from Greenpeace Southeast Asia / CREA, 'Toxic Air: The Price of Fossil Fuels' (Feb 2020), which pegged India's fossil-fuel air pollution cost at ~$150bn (10.7 lakh crore, 5.4% of GDP). It is not a World Bank number (the World Bank's own India metric is expressed as welfare loss, ~8.5% of GDP, 2016 report). Re-attributing preserves the sentence's meaning while fixing the source.  
  *Source:* Greenpeace India / CREA, 'Toxic Air: The Price of Fossil Fuels', Feb 2020 (greenpeace.org press release; Business Standard 12 Feb 2020)
- **Out-of-pocket health expenditure over 55 percent of total health spending**  
  `Out-of-pocket health expenditure accounts for over 55 percent of total health sp` → `Out-of-pocket health expenditure accounts for about 43 percent of total health s`  
  'Over 55 percent' is stale (accurate around 2015-16). India's own National Health Accounts 2022-23 (released 2025) reports OOPE at 43.4% of total health expenditure, down from 64.2% in 2013-14 (NHA 2021-22 gave 39.4%); WHO data corroborate ~44%. The paired 'one of the highest rates in the world' is also no longer accurate at ~43% and is softened. Updated to the latest authoritative India-specific figure with citation.  
  *Source:* MoHFW National Health Accounts 2022-23, PIB PRID 2265816 (OOPE 43.4%); corroborated by WHO Global Health Expenditure Database

### blog/posts/2026-04-01-children-air-pollution.md

- **Share of Indian children under five who are stunted = 38 percent**  
  `world: 38 percent of children under five are stunted.` → `world: 35.5 percent of children under five are stunted (NFHS-5, 2019-21).`  
  38% is the NFHS-4 (2015-16) round (38.4%). The latest national survey NFHS-5 (2019-21) puts under-five stunting at 35.5% (down from 38.4%). Updating the figure and adding the survey source. Not a direction-flip of any accountability/promise claim; a factual update to the most recent national survey.  
  *Source:* National Family Health Survey (NFHS-5), 2019-21, India (35.5%); corroborated by ORF/PIB analyses of NFHS-5
- **GBD 'most recent India estimate, 2021 cycle' attributed 8.8% of under-five deaths in 2017 to air pollution**  
  `The Global Burden of Disease study (most recent India estimate, 2021 cycle) attr` → `The Global Burden of Disease study (GBD 2017, Lancet Planetary Health) attribute`  
  The value is internally inconsistent with its label: a '2021 cycle' estimate cannot report a 2017 reference-year figure. The 8.8%/2017 under-five air-pollution death share comes from the GBD 2017 India study (Lancet Planetary Health, 2018) — 'almost 1 in 10' under-five deaths, ~195,546 child deaths in 2017. I could not independently verify an India-specific 2021 under-five replacement figure, so rather than invent a number I correct the misattribution to reflect the actual GBD 2017 source, keeping the verified value. This resolves the flagged contradiction without changing the (correct) number.  
  *Source:* GBD 2017 India study, 'The impact of air pollution on deaths, disease burden, and life expectancy across the states of India,' Lancet Planetary Health, 2018/2019; Down To Earth coverage (~1 in 10 under-five deaths, 2017)

### blog/posts/2026-04-05-ncap-deadline.md

- **Rs 11,211 crore released under NCAP + XV-FC combined (2019-2025)**  
  `released Rs 11,211 crore under NCAP and Fifteenth Finance Commission grants comb` → `released Rs 13,415 crore under NCAP and Fifteenth Finance Commission grants comb`  
  CREA's 2026 progress report (already listed in the post's own Sources) updates the combined NCAP + XV-FC released total to Rs 13,415 crore since inception. The Rs 11,211 crore figure is from the superseded 2025 edition. Confirmed verbatim in the 2026 report PDF.  
  *Source:* CREA, Tracing the Hazy Air 2026: Progress Report on NCAP (Jan 2026) — 'a total of Rs 13,415 crore has been released under NCAP and XV-FC funds from its inception until now'
- **68 percent of funding utilised; NCAP-specific utilisation 63 percent**  
  `Only 68 percent of this funding was utilised, with NCAP-specific funds showing a` → `Only 74 percent of this funding was utilised, with NCAP-specific funds showing a`  
  CREA 2026 revises overall utilisation to 74% (Rs 9,929 crore of Rs 13,415 crore) and reports the NCAP-specific fund at Rs 2,395 crore released / Rs 1,417 crore utilised = 59%. The 68%/63% figures are from the 2025 edition. Both numbers updated to keep the sentence internally consistent with the 2026 source.  
  *Source:* CREA, Tracing the Hazy Air 2026 — overall 74%; 'Under the NCAP fund, Rs 2,395 crore was released, of which Rs 1,417 crore was utilised, resulting in a utilisation rate of 59%'
- **67 percent of NCAP funds allocated to road dust management**  
  `A staggering 67 percent of NCAP funds were allocated to road dust management` → `A staggering 68 percent of NCAP funds were allocated to road dust management`  
  CREA 2026 updates road dust management to 68% (from 67% in the 2025 edition). Confirmed in the 2026 report PDF: 'a disproportionate 68% has been allocated to road dust management, the transport sector... 14%... waste management and biomass burning (12%)'. 'Two-thirds' framing later in the paragraph remains accurate at 68%.  
  *Source:* CREA, Tracing the Hazy Air 2026 — road dust management 68%
- **Industries, domestic fuel, public outreach received 1 percent each**  
  `Industries received just 1 percent. Domestic fuel interventions received 1 perce` → `Industries received less than 1 percent. Domestic fuel interventions received le`  
  CREA 2026 states industry, domestic fuel use, and public outreach each received 'less than 1%' (the 2025 edition's '1% each' is superseded). Updating to 'less than 1 percent' matches the current source and slightly strengthens, not weakens, the accountability point.  
  *Source:* CREA, Tracing the Hazy Air 2026 — 'industry, domestic fuel use... less than 1%' each

### blog/posts/2026-04-08-lancet-causal-evidence.md

- **'Update May 2026' parenthetical: Lancet Countdown 2025 'revised' India figure to 1.72M via tighter high-end exposure-response and re-attribution of household biomass deaths**  
  `*(Update May 2026: the Lancet Countdown 2025 has since revised the headline Indi` → `*(Update: the Lancet Countdown 2025 (published October 2025) attributes 1.72 mil`  
  The 1.72M figure is genuine (Lancet Countdown 2025 India Data Sheet: 'over 1,718,000 deaths attributable to anthropogenic air pollution (PM2.5) in 2022 in India, an increase of 38% since 2010'), but the surrounding claim is false on two counts: (1) the number is an anthropogenic-PM2.5 exposure trend (38% rise since 2010), not an upward methodological revision via a tighter high-end exposure-response or re-attribution of household biomass deaths; (2) the report was published 30-31 October 2025, not May 2026. New string preserves the italic markdown markup and the second sentence about the retained Jaganathan estimate, correcting only the false methodological narrative and the date.  
  *Source:* Lancet Countdown 2025 India Data Sheet (lancetcountdown.org, published October 2025) — '1,718,000 deaths attributable to anthropogenic air pollution (PM2.5) in 2022 in India, an increase of 38% since 2010'

### netlify/functions/lib/calc.mjs

- **Transport exposure multipliers sourced to 'WHO/CPCB transport exposure multipliers' (function source string)**  
  `    source: "WHO/CPCB transport exposure multipliers; cigarette equivalence per ` → `    source: "Peer-reviewed commute-exposure studies (e.g., Goel et al. 2015, Del`  
  Neither WHO (Global Air Quality Guidelines 2021) nor CPCB publishes any transport-mode exposure-multiplier table, so the named source is a fabricated attribution. The multiplier values themselves are defensible modeling assumptions consistent with the peer-reviewed India commute-exposure literature (Goel et al. 2015 Delhi: unenclosed modes 10-40% above ambient, auto-rickshaw ~30% above, AC car and metro lowest). Correct the misattributed source string to cite the real study rather than removing/changing the numbers. This single source-string fix addresses the fabricated-source concern for all modes in this function.  
  *Source:* Goel, Gani, Guttikunda, Wilson & Tiwari 2015, Atmospheric Environment 123:129-138; WHO GAQG 2021 and CPCB publish no transport multipliers
- **Auto-rickshaw multiplier 1.5x attributed to WHO/CPCB (code comment attribution)**  
  `// Multipliers from WHO/CPCB exposure literature, already in the prompt.` → `// Multipliers are modeling assumptions from peer-reviewed commute-exposure stud`  
  Same fabricated-source issue as the source string: the code comment credits 'WHO/CPCB exposure literature', which does not publish such multipliers. The 1.5x auto-rickshaw value is well-supported (Goel et al. 2015 Delhi: auto-rickshaw ~30% above ambient; Apte et al. 2011 in-auto ~1.5x). Fix the comment to attribute honestly to the peer-reviewed literature and label these as modeling assumptions; do not change the value.  
  *Source:* Goel et al. 2015, Atmospheric Environment (Delhi microenvironments); Apte et al. 2011, Environ. Sci. Technol. (auto-rickshaw ~1.5x)
- **School-closure trigger: GRAP Stage IV mandates primary school closure at AQI >= 451**  
  `  if (aqi >= 451) { risk = "imminent"; trigger = "GRAP Stage IV (AQI ≥ 451): pri` → `  if (aqi >= 451) { risk = "imminent"; trigger = "GRAP Stage IV (AQI > 450): hyb`  
  Confirmed against the CAQM revised GRAP schedule (and Delhi Education Dept circulars): primary-school hybrid/closure (children up to Class V) is triggered at GRAP Stage III (AQI 401-450), not Stage IV. Stage IV (AQI >450) additionally moves Classes VI-IX and XI to hybrid, leaving only board classes X and XII in person. The file misassigns primary closure to Stage IV, while its own Stage III line already references primary schools. Correct both trigger strings to match the CAQM schedule; the risk levels and monotonic AQI logic are preserved, and no accountability direction is flipped.  
  *Source:* CAQM revised Graded Response Action Plan schedule (Stage III: hybrid up to Class V; Stage IV: adds Classes VI-IX & XI); Delhi Directorate of Education circulars 2024-2025

## Flagged for human review

### index.html

- **Preterm birth ~1.3x (Delhi-NCR winter)**  
  The specific '~1.3x' multiplier (line 3044) is unsourced and, moreover, internally inconsistent with the same page's other preterm figures: line 3091 says '~1.5-1.7x' and line 3119 says '3-5% increase per +10 µg/m³ PM2.5 (Lancet Planetary Health 2023)'. The directional claim is well-supported (India-wide AOR ~1.67 for preterm birth, PLOS Global Public Health 2025), but there is no single clean, sourced replacement value that resolves the three conflicting figures, so I am not proposing an edit. Recommend harmonising all three to one sourced statement (e.g. ~12% per +10 µg/m³, or AOR 1.67 citing PLOS GPH 2025).  
  *Source:* Sharma et al., PLOS Global Public Health 2025; Lancet Planetary Health 2023
- **60% of HAP deaths are women**  
  The '60% of HAP deaths are women' claim appears at line 1825 and as '60% women' on the stat card (line 1926). The prior finding argues GBD 2021 shows the absolute HAP death/DALY burden is slightly higher in men (~54%), with the '60% women' figure originating from an older WHO 'women and children' framing. However, I could not verify the GBD 2021 sex-disaggregated split against a primary source, credible sources genuinely differ on this, and reframing a gender-justice accountability claim (women bear the majority of HAP deaths) is editorially sensitive. Not proposing an edit; recommend a human decide between (a) reframing to 'women bear higher exposure and are disproportionately affected' or (b) retaining '60%' with an explicit WHO citation.  
  *Source:* GBD 2021 HAP analysis (The Lancet, 2024); WHO Household Air Pollution factsheet — sex split disputed/unverified here

### panels/budget.html

- **Source apportionment: vehicles 38%**  
  Source apportionment is city- and season-specific; no authoritative national '38% vehicles' figure exists. CSE's figure is transport = 51.5% of Delhi's LOCAL winter PM2.5, and vehicles are ~20-30% of total ambient PM2.5 nationally. Replacing 38% with a scoped city figure would change an accountability ('critical mismatch') claim, so flag rather than apply. Options: cite a scoped figure (e.g. 'transport ~51.5% of Delhi local PM2.5, CSE 2024') or drop the single national percentage.  
  *Source:* CSE Delhi winter source-apportionment analysis (2024-2025)
- **Source apportionment: industry 18%**  
  No CREA/CSE/CPCB source publishes a single national '18% industry' contribution; industry share is city-specific (~10-35% across studies). 18% is within plausible range but not attributable to a specific national figure. Part of the same 'critical mismatch' accountability claim, so flag.  
  *Source:* CPCB city-specific source-apportionment studies (2024-2026)
- **Vehicles + industry receive <1% of NCAP funds combined**  
  Per CREA's NCAP fund breakdown, road dust ~68%, transport/vehicular ~14%, waste/biomass ~12%, and industry/domestic fuel/outreach ~1% each. So vehicles+industry COMBINED is roughly ~15%, not <1% — only industry alone (or domestic fuel alone) is <1%. The line 112 claim 'vehicles (38%) and industry (18%)... receive <1% of NCAP funds combined' conflates industry-alone with the combined total and is wrong. Correcting it substantially weakens the 'Critical Mismatch' accountability claim, so flag rather than auto-apply. Note: the separate stat cell ('<1% On Industry/Fuel') and the accountability-gaps line ('68% on dust vs <1% on industry/domestic fuel') refer to industry/fuel ALONE and are defensible.  
  *Source:* CREA 'Tracing the Hazy Air 2026' NCAP fund allocation breakdown
- **PMUY refills 4.47/year vs 9-12 subsidized**  
  The 4.47 refills/year is the correct FY2024-25 per-capita-consumption figure (confirmed via PIB), so it is defensible. However the denominator '9-12 subsidized' is imprecise: the FY2025-26 targeted subsidy (Rs 300) cap is 'up to 9 refills/year' (12 was the older general cap), and reporting suggests the cap may have been reduced further in mid-2026. Because the subsidy cap is in flux and this feeds the 'usage gap' accountability point, flag: recommend changing '9-12 subsidized' to 'up to 9 subsidized (FY2025-26)'.  
  *Source:* PIB / Cabinet PMUY subsidy approval FY2025-26 (up to 9 refills)
- **HAP 0.61 million deaths/year, 60% women**  
  The 0.61 million India HAP death figure is correct (GBD 2019) and attributed to PIB/IBEF, so that part is defensible. The '60% women' qualifier is not supported by primary data: GBD 2021's global HAP burden is slightly higher in men (~54% vs ~46% women); the 60% figure derives from an older WHO 'women and children' statistic. Because this is an equity/accountability claim and sources conflict, flag: recommend dropping '(60% women)' or reframing as 'women bear higher household exposure.'  
  *Source:* GBD 2021 HAP analysis (The Lancet, 2024); WHO HAP factsheet 2024
- **CAMPA ₹94,844 Cr collected, ₹26,002 Cr utilized (2019-24)**  
  The utilized figure (₹26,002 Cr) matches the latest CAG/parliamentary data almost exactly and is accurate. But the ₹94,844 Cr 'collected' figure could not be substantiated by any authoritative source — the accumulated CAMPA corpus is commonly cited at ~₹50,000-54,000 Cr, and only ~₹38,516 Cr was approved for the 2019-24 window. Because this is a 'hidden funds' accountability claim and the collected figure is uncertain, flag: recommend re-sourcing or clarifying whether ₹94,844 Cr is a cumulative-corpus metric.  
  *Source:* MoEFCC/CAG (2024-25); parliamentary replies on CAMPA
- **16th Finance Commission timing / 12-month funding gap**  
  The stated dates are factually wrong: the 16th Finance Commission SUBMITTED its report to the President on 17 November 2025 (not 'expected by Oct 2026'), and its award period is 1 April 2026 to 31 March 2031 — beginning immediately after the 15th FC period ends 31 March 2026 (not an 'FY27 cycle starting Apr 2027'). So the FC cycle transitions seamlessly and the claimed '12-month gap' in the finance-commission cycle does not exist. However, this is woven into the site's central 'Funding Cliff' accountability narrative, and there IS a genuine open question — whether air-quality-specific grants (the XV-FC million-plus-cities grant that expired 31 Mar 2026) will be continued under the 16th FC has not been publicly confirmed. Flag rather than apply: recommend correcting the dates (report submitted Nov 2025; cycle starts April 2026) and removing/reframing the '12-month gap' claim to be about the un-announced successor to the air-quality grant specifically, not the FC cycle. This appears twice (the top 'Funding Cliff' alert and the 'Key Accountability Gaps' list).  
  *Source:* PIB PRID 2190975 (16th FC submits report 17 Nov 2025, award period 2026-27 to 2030-31); fincomindia.nic.in

### panels/aqi-explainer.html

- **CPCB vs EPA AQI at PM2.5 = 30 (row: CPCB 100 Satisfactory vs EPA 88 Moderate)**  
  The CPCB value is miscalculated: 30 ug/m3 is the top of CPCB's 'Good' band (0-30 -> AQI 0-50), so the correct sub-index is 50 / 'Good', NOT 100 / 'Satisfactory'. The EPA 88 uses pre-2024 breakpoints; under the current 2024 EPA scale (Moderate 9.1-35.4 -> 51-100) it is ~90 / 'Moderate' (category unchanged). This row is one cell of the CPCB-vs-EPA comparison table whose overall accountability thesis is falsified at higher concentrations (see rows 100 and 250); correcting rows piecemeal would leave the table internally inconsistent with the unfixed rows and the 'Key insight' box. Flagging the whole comparison for a single coordinated editorial rewrite rather than swapping individual cells. Options: rewrite the table with correct CPCB sub-indices (30->50 Good, 60->100 Satisfactory, 100->232 Poor, 250->400 Very Poor) and current 2024 EPA values, and reframe the 'more lenient' narrative to note CPCB is more lenient only at low PM2.5.  
  *Source:* CPCB National AQI breakpoints (About_AQI / aqihub.info/indices/india); US EPA 2024 PM2.5 AQI breakpoints, 40 CFR Part 58, effective 6 May 2024
- **CPCB vs EPA AQI at PM2.5 = 60 (row: CPCB 150 Moderate vs EPA 154 Unhealthy [sensitive groups])**  
  CPCB is miscalculated: 60 ug/m3 is the top of the 'Satisfactory' band (31-60 -> AQI 51-100), so the correct sub-index is 100 / 'Satisfactory', NOT 150 / 'Moderate'. The EPA number 154 is correct (2024 Unhealthy band 55.5-125.4 -> 151-200), but the category label is wrong: 154 is 'Unhealthy', not 'Unhealthy (sensitive groups)' (which is the 101-150 band). Part of the same comparison-table cluster; flagged for a coordinated rewrite alongside the other three rows rather than an isolated cell fix.  
  *Source:* CPCB National AQI breakpoints; US EPA 2024 PM2.5 AQI breakpoints (40 CFR Part 58, 6 May 2024)
- **CPCB vs EPA AQI at PM2.5 = 100 (row: CPCB 174 Moderate vs EPA 174 Unhealthy)**  
  At 100 ug/m3, PM2.5 is in CPCB's 'Poor' band (91-120 -> AQI 201-300), giving a sub-index of ~232 / 'Poor' -- NOT 174 / 'Moderate'. The correct current EPA value is ~182 / 'Unhealthy' (2024 breakpoints), not 174 (pre-2024). Correcting this INVERTS the panel's central accountability claim: with correct values CPCB (232) is HARSHER than EPA (182) at this level, and CPCB reports 'Poor', not 'Moderate' -- which directly falsifies the on-page 'Key insight' box ('At 100 ug/m3 PM2.5, CPCB still says Moderate while the US EPA says Unhealthy') and the lead framing that 'the CPCB scale is significantly more lenient... masking the true severity'. Because fixing the numbers reverses the accountability narrative and requires rewriting the intro sentence and the 'Key insight' box together, this is an editorial decision, not a mechanical cell swap. Editor options: (a) rewrite to state CPCB is more lenient only at LOW concentrations (30-60 ug/m3) but harsher at high concentrations; or (b) drop the AQI-breakpoint leniency argument and rely on the well-sourced NAAQS-vs-WHO leniency (40 vs 5 ug/m3) already presented accurately elsewhere on the page.  
  *Source:* CPCB National AQI breakpoints (Poor 91-120 -> 201-300); US EPA 2024 PM2.5 AQI breakpoints (Unhealthy 55.5-125.4 -> 151-200), 40 CFR Part 58
- **CPCB vs EPA AQI at PM2.5 = 250 (row: CPCB 300 Very Poor vs EPA 300 Hazardous)**  
  At 250 ug/m3, PM2.5 is at the top of CPCB's 'Very Poor' band (121-250 -> AQI 301-400), so the correct sub-index is 400 / 'Very Poor', not 300. The current 2024 EPA value is ~325 / 'Hazardous' (Hazardous band 225.5-325.4 -> 301-400); the site's 300 comes from the retired pre-2024 table where 300 was 'Very Unhealthy', so the site even mislabels 300 as 'Hazardous'. Like the 100 ug/m3 row, the corrected values make CPCB (400) harsher than EPA (~325), reinforcing the reversal of the panel's leniency thesis. Flagged with the other three rows for one coordinated editorial rewrite of the comparison table and its surrounding narrative.  
  *Source:* CPCB National AQI breakpoints (Very Poor 121-250 -> 301-400); US EPA 2024 PM2.5 AQI breakpoints (Hazardous 225.5-325.4 -> 301-400), 40 CFR Part 58, 6 May 2024

### panels/source-selector.html

- **CPCB CAAQMS coverage: ~533 stations across ~250 cities**  
  The CPCB Central Control Room dashboard (airquality.cpcb.gov.in/ccr) returned HTTP 503 and no primary source could be reached to confirm the live count. Secondary sources give a mixed picture: MoEFCC network figures cite ~1,296 ambient stations across 473 cities and separately 'over 400' CAAQMS. The site's ~533/~250 is plausibly in range for continuous stations but names no source and the network grows continually, so it cannot be safely confirmed or corrected. Recommend re-verifying against the CPCB CCR dashboard once reachable and adding a dated citation. No safe edit available.  
  *Source:* CPCB CCR dashboard (unreachable, 503); MoEFCC monitoring-network figures (~1,296 ambient stations/473 cities; ~400+ CAAQMS)
- **WAQI may lag CPCB by 1-2 hours**  
  The hedged '1-2 hours' is a plausible ballpark for an hourly-cadence aggregator, but no authoritative WAQI/aqicn source publishes a station-to-platform latency figure, and the site cites none, so the specific number is unverifiable. It is a low-priority, already-hedged claim ('may lag'). Recommend either softening to 'typically under about an hour, occasionally longer' or dropping the specific figure. No sourced replacement value is available, so no edit is proposed.  
  *Source:* aqicn.org FAQ/data-platform docs state near-real-time/hourly publication but quantify no lag figure

### panels/accountability.html

- **NCAP '40% PM2.5 reduction by 2026' badge: 25-27% Achieved (CREA)**  
  The badge attributes a national '25-27% achieved' figure to CREA, but CREA publishes no such single national percentage; its metric is 23 of 100 monitored cities met the 40% PM10 (not PM2.5) target. The promise text also says 'PM2.5' where NCAP's revised 2026 target is PM10. However, this row substantially duplicates the separate, correctly-sourced row on line 25 ('Only 23/100 Met Target (CREA 2026)'), and correcting PM2.5->PM10 alters the historical promise wording, so a clean safe edit is not available. Options: (a) delete this duplicate row, (b) relabel badge to '23/100 cities met 40% PM10 (CREA 2026)' and fix PM2.5->PM10.  
  *Source:* CREA, Tracing the Hazy Air 2026 (9 Jan 2026), energyandcleanair.org
- **Delhi e-bus promise: ~400 deployed (RTI 2025) [Promises table + tracker]**  
  Verified stale: DTC operated ~1,250 e-buses by March 2025 and ~4,538 by April 2026, so the 1,000-bus target was met (late) and then far exceeded. The '~400 deployed' figure is factually wrong, but correcting it flips the accountability narrative from 'broken promise / E2 pilot' to 'target met ~1 year late and exceeded.' Appears twice (line 20 badge '~400 Deployed'; line 270 tracker '~400 deployed (RTI 2025)'). Recommend reframing to 'missed 2023 deadline; 1,000 target met by 2024, ~4,500 e-buses by 2026' rather than leaving ~400.  
  *Source:* Delhi Transport Corporation fleet data, Mar 2025 / Apr 2026 (en.wikipedia.org/wiki/Delhi_Transport_Corporation; electrive.com Dec 2025)
- **Brick kiln zigzag: 30% compliance (CPCB 2024)**  
  No CPCB 2024 source giving a 30% national compliance figure could be located, but credible sources disagree widely on the true value: regional CPCB tallies range 45-85% (UP ~45%, Haryana-NCR ~71%, Rajasthan/Alwar ~85-90%), and some 2024 reporting cites ~82-85% national zigzag adoption while the ~51% (6,443/12,551) figure comes from a Dec 2023 Rajya Sabha reply. Because the correct national number is genuinely contested and would materially change the accountability claim, do not auto-apply; recommend citing a specific CPCB parliamentary figure with its date.  
  *Source:* CPCB Rajya Sabha reply Dec 2023 (~51%); Mongabay India Aug 2024; Down To Earth (regional figures)
- **Odd-even reduction: 2-4% only (IIT Study)**  
  The '2-4% (IIT Study)' attribution could not be substantiated and credible primary estimates genuinely disagree: EPIC/UChicago found ~13% PM2.5 reduction during scheme hours in Jan 2016 (no effect in Apr 2016), IIT Delhi work cited 15-26%, and a corridor study ~5.7%. Correcting to a higher figure would weaken the accountability claim, and no single authoritative number exists, so this is editorially sensitive. Appears line 23 (badge) and line 277 (tracker). Recommend citing the EPIC Jan-2016 ~13% during-scheme-hours finding with its scope.  
  *Source:* Greenstone, Harish, Pande & Sudarshan / EPIC UChicago odd-even evaluation (2017)
- **March 2026 card: 204/238 cities exceed NAAQS PM2.5 (Oct 2025-Feb 2026, CREA)**  
  The 204/238 winter-window figure attributed to a CREA 'Oct 2025-Feb 2026' analysis could not be located in any CREA publication; CREA's Jan-2026 report gives 103 of 231 cities exceeding PM2.5 NAAQS (calendar-year 2025), which the page already states correctly on line 53-54. The number cannot be verified against a primary source, but a peak-winter exceedance count would plausibly exceed the annual one, so I cannot confirm it is wrong. Recommend re-sourcing to a dated CREA winter analysis or replacing with the sourced 103/231 calendar-year figure.  
  *Source:* CREA, Tracing the Hazy Air 2026 (103/231 cities, CY2025)
- **Delhi 2026: 0 of 68 days met WHO; annual AQI 244; 46.8% worse than 2020 (CREA)**  
  Composite figure is partly unverifiable and internally inconsistent: a 68-day peak-winter window (per the card's own 'Oct 2025-Feb 2026' header) cannot be a 2026 'annual' average, and no CREA report stating 'annual AQI 244' or '46.8% worse than 2020' could be found. CREA's actual Delhi metric is annual PM2.5 ~101 ug/m3 (~20x the WHO annual guideline). The '0 days met WHO safe limits' portion is directionally true. Recommend relabeling as a winter-window stat and citing the CREA annual PM2.5 figure instead of the unsourced AQI 244 / 46.8% claim.  
  *Source:* CREA, Tracing the Hazy Air 2026 (Delhi annual PM2.5 ~101 ug/m3)
- **GRAP triggers since Jan 2025: 17 times; Stage III 53 days, Stage IV 15 days**  
  CAQM publishes individual GRAP invocation/revocation orders but no compiled '17 times / 53 days / 15 days' aggregate, and the page names no source; the specific counts cannot be verified against any primary aggregate. Recommend citing dated CAQM order records or a CREA/press compilation with an as-of date, or hedging the figures.  
  *Source:* CAQM GRAP orders, caqm.nic.in (no aggregate published)
- **CAG Audit card: 88% of Delhi stations violate CPCB siting criteria (CAG, April 2025)**  
  Misattribution (high confidence): the 88% comes from a Newslaundry field probe of 25 stations, not the CAG audit. The CAG Performance Audit (tabled Delhi Assembly 1 Apr 2025) physically verified 13 of 24 DPCC stations and found them non-compliant with siting norms — it does not state 88%. The correct fix is contestable (relabel the 88% to Newslaundry, vs. restate the CAG's own 13/24 finding), and the whole card is structured around 'CAG,' so a safe unique edit is not clear-cut. Recommend either crediting 88% to 'Newslaundry investigation (Apr 2025)' or replacing with 'CAG: 13 of 24 verified stations non-compliant.'  
  *Source:* CAG Performance Audit on Vehicular Air Pollution in Delhi (Apr 2025); Newslaundry investigation (1 Apr 2025)
- **BS-VI: CPCB shows 15-25% SO2 reduction in monitoring stations**  
  No CPCB source documenting a 15-25% ambient SO2 reduction attributable to BS-VI fuel could be found. The verifiable fact is that BS-VI cut fuel sulphur 80% (50->10 ppm) from Apr 2020; ambient SO2 in India is dominated by coal-fired power (per CREA), so BS-VI's ambient SO2 effect is minor and not documented at this magnitude. Recommend replacing the unsourced ambient figure with the verifiable fuel-sulphur cut and dropping the CPCB attribution unless a specific report is cited.  
  *Source:* BS-VI notification (fuel S 50->10 ppm); CREA 2025 SO2 source analysis
- **Delhi Metro Phase 4: 65km operational, 45km under construction**  
  Phase 4's first sections only opened Jan-Mar 2026 (Magenta ext. 5 Jan; Pink loop 8 Mar), so '65 km operational' is implausibly high — roughly 10-20 km of ~112 km sanctioned is operational as of mid-2026. Confidence is medium and the primary figures are Wikipedia/DMRC secondary tallies, so recommend re-verifying against DMRC and updating the operational/under-construction split rather than an unverified auto-edit.  
  *Source:* DMRC Phase 4 opening dates 2026 (en.wikipedia.org/wiki/Delhi_Metro)
- **Industrial FGD: ~35% thermal plants compliant (CEA 2024)**  
  The ~35% compliance figure appears overstated (only ~8% of coal units, ~20-22 GW of 200+ GW, had operational FGD as of 2024), and more importantly the framing is superseded: the 11 July 2025 MoEFCC notification exempted ~78% of coal plants (Category C) from FGD entirely, making a single 'compliance %' misleading. Correcting this materially changes the accountability picture, so recommend a reframe (low actual FGD installation + 2025 exemption of most plants) rather than a simple number swap.  
  *Source:* CREA Emission Watch 2024; MoEFCC FGD exemption notification (11 Jul 2025)
- **Stubble subsidies: Rs 3,062 Cr (2018-24); 30% fewer fires 2024 vs 2021 peak (NASA FIRMS)**  
  The '30% fewer fires' appears to be the 2021->2022 drop mislabeled; against the 2021 peak the 2024 decline is far larger (Punjab ~71,304 -> ~10,909, ~85%), and CRM fund releases have grown past Rs 3,062 Cr (to ~Rs 3,698 Cr through FY2024-25, with even higher totals cited for 2025-26). Correcting the fire figure strengthens the government's case (direction-affecting), and the 2024 FIRMS count is itself disputed (burning shifted past the satellite overpass window), so credible sources disagree on the true reduction. Recommend flagging for editorial review rather than auto-updating.  
  *Source:* PIB/Min. of Agriculture (CRM releases, Feb 2025); Punjab Remote Sensing Centre / NASA FIRMS fire counts
- **Construction site dust screens: ~40% compliance (DPCC inspections)**  
  No published DPCC headline compliance percentage could be located to confirm or refute the ~40% figure, and it is a site-level enforcement metric not covered by any primary global source. Plausibly derived from DPCC inspections but unverifiable as stated; recommend attributing to a specific dated DPCC/CAQM inspection dataset or hedging.  
  *Source:* DPCC/CAQM inspection data (no public headline % located)
- **Stubble payment adequacy: Rs 1000/acre vs Rs 5000 needed**  
  Both figures are contestable: the widely-cited demanded/needed amount is ~Rs 2,500/acre (Punjab proposed Rs 2,000 Centre + Rs 500 state), the Centre declined direct cash funding in late 2024 so no per-acre cash incentive is currently paid (support is via CRM machinery subsidy), and the Rs 5,000 'needed' figure is unsupported. Correcting the incentive framing affects the accountability assessment, so flag for editorial review.  
  *Source:* Punjab govt proposal (Rs 2,000+500); farmer-union demands, Economic Times / Tribune 2024-25
- **Delhi air quality budget 2024-25: Rs 500 Cr (0.6% of budget)**  
  The Rs 500 Cr matches Delhi's 2023-24 pledge (~Rs 505 Cr), not the 2024-25 allocation; the FY2024-25 environment & forest sector allocation was ~Rs 822 Cr (~1.1% of budget). But there is no single official 'air quality' line item (env & forest is a broader bucket) and the page elsewhere cites a 'Rs 300 Cr pollution budget,' so scope is ambiguous — flag for editorial reconciliation rather than a scope-shifting auto-edit.  
  *Source:* Delhi Budget 2024-25 (env & forest allocation ~Rs 822 Cr)
- **Punjab stubble budget: Rs 300 Cr (mostly unspent)**  
  Newer figures (Rs 500 Cr allocated 2025-26 with ~79% disbursed; Rs 600 Cr in 2026-27) contradict the 'mostly unspent' characterization, which is an accountability judgment. Correcting both the amount and the 'unspent' framing changes the narrative direction, so flag for editorial review with sources.  
  *Source:* Punjab Dept. of Agriculture (2025-26 disbursement Feb 2026; 2026-27 budget Mar 2026)
- **Haryana air quality budget: Rs 150 Cr for 14 cities**  
  The unsourced Rs 150 Cr does not correspond to a clearly identifiable current figure; candidate replacements span very different scopes — the flagship Rs 3,647 Cr Haryana Clean Air Project (World Bank-backed, FY2024-25 to 2029-30) vs. a ~Rs 138 Cr FY2025-26 state-budget air-quality line. Because the correct scope is ambiguous, recommend replacing with a specific sourced figure rather than auto-editing.  
  *Source:* Haryana Clean Air Project (HCAPSD), World Bank 2024; Haryana Budget FY2025-26
- **UP air quality budget: Rs 400 Cr (mostly road dust)**  
  The page names no source and no accessible primary UP budget document could confirm the Rs 400 Cr allocation or the 'mostly road dust' split. Treat as unsourced pending verification against a UP state-budget / NCAP primary record.  
  *Source:* None reachable (UP state budget / NCAP not confirmable)

### blog/posts/2026-03-25-economic-cost.md

- **Construction worker loses Rs 9,000/year, roughly 4 percent of earnings**  
  Rs 600 x 15 = Rs 9,000 is correct arithmetic. The '~4 percent' is defensible only under a 365-earning-day assumption (9,000/219,000 = 4.1%); under a realistic 250-300 workday year (Rs 150,000-180,000) the loss is ~5-6%. There is no single correct percentage because the article never states the denominator (annual income), so an edit would require inventing an assumption. Separately, the Rs 600/day base is below Delhi's current statutory minimum wage for unskilled workers (~Rs 710/day, effective 2025). Options: (a) recompute to ~5% and state the workday assumption, or (b) update the wage base to Rs 710 and recompute. Flagged rather than edited to avoid imposing an unstated assumption on the author's illustrative example.  
  *Source:* Delhi Labour Department minimum wage notification, unskilled ~Rs 710/day effective 1 Apr 2025 (arithmetic self-evident)
- **Delhi tech workforce declined 18 percent to 14 percent over five years**  
  The specific 18%->14% decline is uncited on-site and no authoritative source (NASSCOM or industry data) publishing this figure could be located; it is an economic/labour statistic outside the scope of any air-quality primary source. It should be attributed to a named source or removed. It is not cleanly removable via a unique substring without breaking the following sentence ('Not all of this shift is attributable to pollution...'), which depends on it as its referent — so removal requires a small rewrite. Flagged for the editor to either source it (e.g. NASSCOM) or rewrite the paragraph to drop the specific numbers. The article already hedges the causal attribution.  
  *Source:* No primary source located; claim unverifiable

### blog/posts/2026-04-01-children-air-pollution.md

- **3 million fewer stunted children if India met national ambient standards (JEEM study)**  
  The named study (Balietti, Datta & Veljanoska, JEEM vol. 113, 2022) is correctly attributed and its companion figures on-site (5 pp / 2.4 pp per 1 SD PM2.5; 10.4 pp reduction under the WHO guideline) match the paper. But the specific '3 million fewer under national ambient standards' number is behind a paywall — ScienceDirect and the HAL open-access mirror both returned 403, and the abstract/secondary sources do not state it. It is plausible in magnitude but I cannot confirm it against a primary source and have no verified replacement, so no safe edit. Options: cite the exact page/section of the paper's policy-simulation to substantiate it, or attach the full PDF for verification; if it cannot be located in the paper, soften/remove the specific count.  
  *Source:* Balietti, Datta & Veljanoska, 'Air pollution and child development in India,' Journal of Environmental Economics and Management 113 (2022), doi:10.1016/j.jeem.2022.102624 (paywalled; 3M figure not verifiable this session)
- **Delhi-NCR primary schools closed 'over three weeks' in the 2024-25 winter season**  
  No primary authority (CAQM/CPCB/CREA) publishes a cumulative 'closure-weeks' statistic, and the site names no source. The figure is plausible and roughly consistent with the winter 2024-25 GRAP-3/4 physical-closure/hybrid timeline, but it cannot be tied to a specific published tally, and I have no authoritative number to substitute. Options: cite the specific GRAP order dates that closed primary schools, attribute to a named news retrospective, or soften the wording (e.g. 'roughly three weeks').  
  *Source:* CAQM/CPCB GRAP orders, winter 2024-25 (no published cumulative closure-weeks figure located)

### blog/posts/2026-04-05-ncap-deadline.md

- **Mumbai PM2.5 recorded a 38 percent rise under NCAP**  
  The '38 percent rise' is uncited and is an accountability claim (Mumbai listed among cities that 'moved in the wrong direction'). I could not confirm a current, primary-sourced 38% PM2.5 rise. CREA's official NCAP progress metric is PM10 change vs a 2017-18 baseline, not PM2.5, and the finding notes the ~38% was a transient 2019-2023 PM2.5 snapshot that reversed (Mumbai PM2.5 ~34 ug/m3 in 2024, below the 40 ug/m3 NAAQS). Because a defensible replacement value differs by dataset/window and correcting it would soften a 'wrong direction' accountability claim, this is editorially sensitive. Options: (a) re-source the 38% to the specific CREA edition/window it came from, (b) replace with the latest CREA PM2.5 figure (~34 ug/m3, 2024) plus the window, or (c) reframe on NCAP's actual PM10 metric. Do not apply without picking a sourced basis.  
  *Source:* CREA Tracing the Hazy Air 2025/2026 (PM2.5 city rankings vs PM10 change metric)
- **XV-FC grants (Rs 16,539 cr, 49 cities) represent 87 percent of all NCAP city-level funding**  
  There is a real internal inconsistency: Rs 16,539 crore (the XV-FC amount ALLOCATED to million-plus cities) exceeds the combined NCAP+XV-FC total the post cites in 'Follow the Money' (Rs 11,211 cr, being updated to Rs 13,415 cr) — because Rs 16,539 cr is an allocation figure while Rs 13,415 cr is the amount RELEASED. The '87 percent' share is a derived claim whose correct value depends on the basis: per CREA 2026, XV-FC funds RELEASED were Rs 11,021 crore of Rs 13,415 crore total = ~82%; the 2025-edition basis gives ~86% (Rs 9,595 cr of Rs 11,211 cr). Because the figure mixes allocated vs released and a defensible replacement (~82% released-basis vs ~86% 2025-basis) is genuinely ambiguous, and this underpins the 'funding cliff' accountability claim, do not auto-apply. Options: (a) change '87 percent' to '82 percent' and clarify the Rs 16,539 cr is the amount ALLOCATED (vs Rs 11,021 cr released) to avoid the allocated/released conflation; (b) reframe on released figures throughout. NOTE: a separate finding (budget panel) says Rs 16,539 cr went to 42 million-plus cities/UAs, not 49.  
  *Source:* CREA, Tracing the Hazy Air 2026 — XV-FC grants Rs 11,021 cr released of Rs 13,415 cr total (~82%); Rs 16,539 cr is the PIB/MoEFCC XV-FC allocation to million-plus cities (FY2020-21 to FY2025-26)

### netlify/functions/lib/calc.mjs

- **Car/taxi/cab/uber/ola multiplier 0.4x**  
  The fabricated 'WHO/CPCB' source is corrected via the source-string and comment edits above. The 0.4x value itself is a genuine modeling judgment where credible sources disagree: ~0.4-0.7x is supported only for sealed-window AC cars with recirculation (Goel et al. 2015: AC cars among lowest exposure), while windows-open or unfiltered taxis run ~0.8-1.0x+. For Indian app-cabs (Uber/Ola, typically AC/windows-up) 0.4x is defensible, but grouping all 'taxi/cab' at 0.4x may understate windows-open taxi exposure. Options: keep 0.4x scoped to AC cars, or raise/split the value for open-window taxis. Not editing the coefficient unilaterally.  
  *Source:* Goel et al. 2015, Atmospheric Environment; commuter microenvironment literature (Goel & Kumar)
- **Metro/subway multiplier 0.3x**  
  Fabricated 'WHO/CPCB' source corrected via edits above. The 0.3x value is a defensible modeling assumption for filtered AC metro carriages (Goel et al. 2015: metro among lowest exposure), but the exposure literature is genuinely mixed: underground metro platforms/carriages frequently equal or exceed ambient PM2.5 due to steel-wheel/brake rail dust, so 0.3x can understate some systems. City/line-specific; not editing the coefficient.  
  *Source:* Goel et al. 2015, Atmospheric Environment; underground-metro PM2.5 exposure literature
- **Train multiplier 0.5x**  
  Fabricated 'WHO/CPCB' source corrected via edits above. In-transit PM2.5:ambient ratios for rail vary widely by city/ventilation (~0.5-1.5x), and enclosed rail can exceed ambient. 0.5x is a plausible modeling assumption but not a sourced constant; no single primary figure exists, so I am not changing the value.  
  *Source:* Commuter microenvironment exposure literature (no standardized rail multiplier)
- **Bus multiplier 0.9x**  
  Fabricated 'WHO/CPCB' source corrected via edits above. 0.9x (slightly below ambient) is directionally questionable for Indian open-window buses, which several studies show at or above ambient; but no single authoritative national figure exists and values are route/ventilation-specific. Defensible as a modeling assumption; not editing the coefficient.  
  *Source:* Goel et al. 2015, Atmospheric Environment (bus among enclosed modes); no standardized bus multiplier
- **Motorcycle/scooter multiplier 1.4x**  
  Fabricated 'WHO/CPCB' source corrected via edits above. The prior finding suggests 1.3x per Goel et al. 2015; however Goel reports unenclosed two-wheeler exposure in the ~10-40% above-ambient band, so both 1.3x and 1.4x sit within the study's range and the distinction is within measurement noise. Not worth changing a defensible modeling assumption by 0.1x; keep 1.4x.  
  *Source:* Goel et al. 2015, Atmospheric Environment 123:129-138 (unenclosed modes 10-40% above ambient)
- **Purifier CADR: 9 ft ceiling default and 'CADR = volume x ACH' attributed to AHAM**  
  Confirmed AHAM's actual standard uses an 8-ft ceiling and its Verifide room-size guidance is based on 4.8 ACH (the 2/3 rule); AHAM also defines CADR as a MEASURED chamber-test rating, not the volume x ACH engineering identity the file uses. So the 9 ft ceiling and the 'CADR = volume x ACH' framing are loosely over-attributed to AHAM. The conversion factor (1 CFM = 1.699 m3/hr) and the 5 ACH 'polluted-area' target are fine. This is a modeling judgment, not a clean value fix: changing the default ceiling from 9 ft to 8 ft would REDUCE the recommended CADR and make the tool LESS protective (Indian rooms often have ~10 ft ceilings), so I am not applying it. Options: (a) change ceilingFt default to 8 to match AHAM's assumption, or (b) keep 9 ft/5 ACH but soften the source line to note these are JanVayu's own conservative assumptions layered on AHAM's CADR methodology rather than AHAM figures.  
  *Source:* AHAM AC-1 standard / AHAM Verifide room-size guidance (8-ft ceiling, 4.8 ACH 2/3 rule)

## Rejected (no change)

### index.html

- **NCAP cities meeting 40% PM10 target — callout 23/100 (finding proposed changing to 27/96)**  
  The prior finding is itself wrong. CREA 'Tracing the Hazy Air 2026' reports 23 cities met the 40% PM10 reduction target (and 51 met the 20-30% target), out of ~96 cities with adequate data. No CREA source states 27; I could not locate any 'April 2026' CREA analysis giving 27/96. The on-site callout value of 23 is the CREA-correct count and should NOT be changed to 27. (The denominator 100 vs 96 is a minor internal inconsistency but 23 is the load-bearing accountability number and it is right.)  
  *Source:* CREA, Tracing the Hazy Air 2026: Progress Report on NCAP (Jan 2026); RICE IAS 2026 analysis (96 cities with adequate data, 84 failed NAAQS)

### panels/economic.html

- **Headline economic cost $36.8B stale; promote $339.4B / 9.5% GDP**  
  The current file no longer presents $36.8B as an unlabeled headline. Line 13 explicitly labels it '$36.8 billion annually (1.36% GDP; Lancet Planetary Health, 2019 data)' AND presents the newer figure alongside: '$339 billion (9.5% GDP; Lancet Countdown 2025, 2022 data)'. Both figures are correctly attributed and dated, and — as the finding itself notes — they measure different things (GBD 2019 lost-output/welfare loss vs VSL-monetised mortality). Presenting both with clear vintages is honest sourcing, not stale/misleading. Web-confirmed $339.4B/9.5% GDP is Lancet Countdown 2025 (2022 data). Which figure leads is a defensible editorial choice, not a factual error, so no edit.  
  *Source:* Lancet Countdown 2025 India Data Sheet (Sept 2025, 2022 data); Down To Earth coverage confirming $339.4B / 9.5% GDP
- **17.8% of all deaths — stale/unsourced**  
  The 17.8% share is accurate and, per the finding's own current_value, is still the most recent PUBLISHED 'share of all deaths' figure (GBD 2019 / Lancet Planetary Health, Pandey et al. 2020); GBD 2021 raised the absolute count but no newer share percentage supersedes 17.8%. The value on the stat card is defensible and correct. The only concern the finding raises is adding an inline date/citation, but the stat cards on this panel are deliberately terse and adding a source label is stylistic polish, not a factual correction; the number itself needs no change.  
  *Source:* GBD 2019 / Lancet Planetary Health (Pandey et al., 2020) — 17.8% of total deaths in India

### panels/budget.html

- **Annual economic cost $36.8B (1.36% GDP) headline**  
  The $36.8B / 1.36% GDP headline is correct for its cited GBD 2019 / Lancet Planetary Health 2021 source, and the current file already discloses the newer Lancet Countdown 2025 figure in the same subtext ('$339 Billion at 9.5% GDP (Lancet Countdown 2025)'). The two use different methods (GBD lost-output vs monetised mortality). The value is defensible and transparently labeled; no edit needed.  
  *Source:* Lancet Planetary Health 2021 (GBD 2019); Lancet Countdown 2025
- **Annual air-pollution deaths 1.67M (17.8% of all deaths)**  
  1.67 million / 17.8% is the correct GBD 2019 figure and is explicitly attributed to 'Lancet Planetary Health 2021 (GBD 2019)' in the card footer. The 17.8% share is tied to the GBD 2019 edition, so the number and share are internally consistent and correctly dated. Newer GBD 2021 (~2.1M) exists but the labeled 2019 value is defensible.  
  *Source:* Lancet Planetary Health 2021 (GBD 2019); State of Global Air 2024 (GBD 2021, ~2.1M)
- **~₹15,000 Cr annual clean-air spending across all schemes**  
  This is an editorial aggregate, and the file already presents it as an estimate ('~₹15,000 Cr', 'Approximately $1.8 Billion across all schemes'). The bottom-up composite (NCAP + PMUY + PM E-DRIVE + crop-residue) sums roughly into this range, so the hedged estimate is defensible as presented.  
  *Source:* Union Budget 2025-26; CREA 2026 (composite)
- **Noida NCAP utilization 13% (₹55.70/₹7.07 Cr)**  
  The figures exactly match the file's named, dated source (Outlook Business, Sep 2025), which the footer now attributes correctly. A newer Jan 2026 dataset (~24%) exists but is medium-confidence; the site value is correctly sourced and defensible as labeled.  
  *Source:* Outlook Business (Sep 2025); CREA Jan 2026
- **Crop Residue Management total released ₹3,623 Cr (2018-2025)**  
  ₹3,623 Cr is exactly the cumulative released as of 15 Nov 2024, matching the card's cited source (Business Standard, Nov 2024). Newer cumulative totals exist (₹3,926 Cr, later ₹4,237.47 Cr as of Mar 2026) but they conflict with each other and cover different end-dates; the labeled ₹3,623 Cr is correctly sourced and defensible. Updating would require reconciling several competing newer totals.  
  *Source:* Business Standard (Nov 2024)
- **Crop residue fire reduction -79%**  
  -79% correctly matches the file's own series (82,533 fires in 2021 to 18,457 in 2024) from its cited Nov 2024/Feb 2025 sources. The newer -93% figure is Punjab-only for the 2025 season and mixes scopes with the multi-state 2021 baseline; the labeled -79% is internally consistent and defensible.  
  *Source:* Business Standard (Nov 2024), ETV Bharat (Feb 2025)
- **CRM release to Punjab ₹1,681 Cr (46%)**  
  ₹1,681 Cr is correct through FY2024-25 per the cited sources and is internally consistent with the ₹3,623 Cr total (46%). Newer figures add FY2025-26 sanctions, but that would require updating the total simultaneously; the labeled value is defensible as sourced.  
  *Source:* Business Standard (Nov 2024)
- **CRM release to Uttar Pradesh ₹764 Cr (21%)**  
  ₹764 Cr / 21% is consistent with the cited ₹3,623 Cr total (Nov 2024) and its named sources. Later cumulative totals (₹4,237 Cr, Mar 2026) are not itemized state-wise, so no clean updated UP figure is available to substitute; the labeled value is defensible.  
  *Source:* Business Standard (Nov 2024)
- **Fire incidents 82,533 (2021) to 18,457 (2024); 3 lakh+ machines**  
  The 2021 and 2024 figures and the 3 lakh+ machines are correctly attributed to the cited Nov 2024/Feb 2025 sources. Adding the 2025 season (Punjab 5,114 / Haryana 662) would extend the series but the existing labeled data is accurate and defensible.  
  *Source:* Business Standard (Nov 2024), ETV Bharat (Feb 2025)

### panels/aqi-explainer.html

- **PM2.5 = 1.72 million Indian deaths/year (Lancet Countdown 2025)**  
  Verified correct and correctly attributed. The Lancet Countdown 2025 India Data Sheet (published Oct 2025) attributes 1.72 million deaths to anthropogenic PM2.5 in India in 2022 (a ~38% rise since 2010), corroborated by multiple reports of the same figure. The site's PM2.5 card ('an estimated 1.72 million Indian deaths per year (Lancet Countdown 2025)') and the '17.2 lakh' data-simple text are accurate. The prior 'unverifiable' verdict was due to an exhausted search budget; the doubt is now resolved.  
  *Source:* Lancet Countdown 2025 India Data Sheet, lancetcountdown.org (Oct 2025)

### panels/accountability.html

- **Delhi health budget Rs 9,800 Cr; pollution causes 10-15% of health burden**  
  The '10-15% of health burden' claim is well-supported (ICMR-Lancet / GBD: air pollution ~17.8% of India deaths, ~11.5% of DALYs), so the site value is defensible. The only issue is minor: Rs 9,800 Cr matches Delhi's ~FY2023-24 health allocation (later grew to ~Rs 12,893 Cr in 2025-26), a low-confidence staleness on a rhetorical 'compare' aside not worth a risky edit. Prior finding does not warrant a change to the core claim.  
  *Source:* ICMR/PHFI India State-Level Disease Burden, Lancet Planetary Health (GBD); Delhi Budget 2025-26

### blog/posts/2026-03-25-economic-cost.md

- **AQLI 2025 India average 3.5 years life expectancy lost**  
  Prior finding (low confidence) is itself wrong. AQLI 2025 (Energy Policy Institute at the University of Chicago / EPIC) reports the average Indian loses 3.5 years of life expectancy relative to the WHO 5 ug/m3 guideline, and Delhi-NCR residents lose ~8.2 years. The 5.3-year value is from an older AQLI edition. Two independent higher-confidence findings elsewhere in this same worklist confirm 3.5 years is current and correctly sourced. Site value is correct.  
  *Source:* AQLI 2025 Annual Update, EPIC/University of Chicago (epic.uchicago.in; Business Standard 1 Sep 2025)
- **1.72 million annual deaths attributed to air pollution**  
  1.72 million is the current Lancet Countdown 2025 ambient PM2.5 mortality figure for India (2022 data, ~1,718,000), which the article's own headline sources. The finding's proposed 2.1 million is a different metric (total air-pollution deaths, all types, GBD 2021/SoGA 2024). Swapping in 2.1M would both change the metric and make this post inconsistent with the rest of the site, which uses 1.72M throughout (independently confirmed correct in a high-confidence index.html finding). The article's phrase 'Global Burden of Disease framework' is loose but defensible since Lancet Countdown derives from GBD data.  
  *Source:* Lancet Countdown on Health and Climate Change 2025 (India data sheet, 2022 data)
- **NCAP disbursed approximately Rs 11,211 crore (~$1.3 billion) over seven years**  
  Fresh sources confirm Rs 11,211 crore is a current, sourced figure: Rs 11,211 crore released under NCAP + Fifteenth Finance Commission (XV-FC) grants during 2019-2025. The finding's proposed Rs 13,036.52 crore could not be corroborated (fresh reporting gives Rs 11,211 crore released and ~Rs 12,636 crore allocated, neither matching 13,037). Rs 11,211 crore = ~$1.3 billion at ~83.5 INR/USD, so the dollar figure is also correct. Site value is defensible and current.  
  *Source:* CREA / Parliament data, NCAP + XV-FC funds released 2019-2025 = Rs 11,211 crore (Business Standard / TaxTMI reporting of Lok Sabha replies, 2025)
- **India spends less than 0.4 percent of annual pollution damage on mitigation**  
  This is the article's own back-of-envelope ratio derived from its stated inputs ($1.3B NCAP over 7 years vs $339B/year cost): 1.3/339 = 0.38%, correctly under 0.4%. It is arithmetically consistent and directionally robust across all credible cost estimates. Both underlying inputs (Rs 11,211 cr / $1.3B NCAP and the $339.4B Lancet Countdown 2025 cost) are verified current elsewhere in this pass, so no edit is needed.  
  *Source:* Self-derived from verified article inputs (NCAP Rs 11,211 cr; Lancet Countdown 2025 $339.4B)

### blog/posts/2026-03-28-stubble-burning-satellites.md

- **Punjab 10,207 wheat harvest fire events (April–May 2025), ISRO-IARI protocol**  
  Prior finding claims 10,207 is the 2024 figure and 2025 was 9,771. This is incorrect. The official CAQM statutory direction (Feb 2026, PIB PRID 2228743), reported verbatim by The Hans India and ESG Times, states the wheat harvesting season 1 April–31 May 2025 recorded 10,207 fires in Punjab, 1,832 in Haryana, 259 in UP NCR districts. The site's 10,207 (Punjab) and 1,832 (Haryana) for the 2025 wheat season match the authoritative source exactly. The site's own cited ESG Times source is built around this 10,207/2025 figure. Site value is correct and well-sourced.  
  *Source:* CAQM statutory direction Feb 2026 (PIB PRID 2228743); The Hans India, 16 Feb 2026; ESG Times
- **More than 90% reduction in Punjab+Haryana paddy fires, 2025 vs 2022**  
  Prior finding was only 'unverifiable' due to an exhausted search budget, not an identified error. Now confirmed: the Union MoS for Environment told Parliament (Dec 2025) that Punjab and Haryana together recorded about/over 90% reduction in paddy stubble fires in 2025 vs the same period in 2022 (Punjab 5,114 fires in 2025; -90% vs 2022). Corroborated by PIB, The Tribune, Down to Earth, and Big News Network. The site's 'more than a 90 percent reduction' is defensible and accurate.  
  *Source:* Union MoEFCC reply to Lok Sabha, Dec 2025 (PIB PRID 2197201); The Tribune; Down to Earth, 1 & 8 Dec 2025

### netlify/functions/lib/calc.mjs

- **All-cause mortality +8.6% per +10 ug/m3 PM2.5, Jaganathan et al. 2024 Lancet Planetary Health**  
  The prior finding is itself mistaken. PubMed 39674205 confirms the site's exact citation and figure: Suganthi Jaganathan et al. 2024, Lancet Planetary Health, an extended difference-in-differences causal design across 655 Indian districts (2009-2019), reports 8.6% (95% CI 6.4-10.8) higher ANNUAL all-cause mortality per +10 ug/m3 annual PM2.5. The prior finding conflated this with a DIFFERENT paper, de Bont et al. 2024 (ten Indian cities, SHORT-TERM daily mortality, 3.6% causal), which measures a distinct quantity. The site's calcMortalityRisk uses a long-term annual framing, for which 8.6% and the Jaganathan/Lancet Planetary Health attribution are correct and well-sourced. No edit.  
  *Source:* Jaganathan et al. 2024, Lancet Planetary Health (PMID 39674205), difference-in-differences causal study, 8.6% per 10 ug/m3 annual PM2.5

## Already fixed

### index.html

- **India PM2.5 deaths 1.72M + ~70% global share**  
  The false '~70% of global PM2.5 mortality burden' claim is no longer in the file. Line 1170 now reads 'among the world's largest national tolls (~a quarter of the global PM2.5 burden)', which is defensible (1.72M vs ~4.5-5.5M global ambient PM2.5 deaths is roughly a quarter to a third). The 1.72M count itself is correct (Lancet Countdown 2025).  
  *Source:* Lancet Countdown 2025; HEI State of Global Air 2024 (GBD 2021)
- **Hero stat card $260B labeled '9.5% GDP (Lancet)'**  
  The hero stat card (line 940) already shows $339.4B with the note '9.5% GDP (Lancet)', matching the Lancet Countdown 2025 monetised-mortality figure. (Some resource/nav card descriptions still say '$260B' but those are outside this finding's scope and refer to a different, separately-citable estimate; the hero card itself is corrected.)  
  *Source:* Lancet Countdown on Health and Climate Change 2025 (India data sheet, 2022 data)
- **IQAir rankings card: India 5th most polluted / 50.6 µg/m³**  
  The rankings card (line 3968) already reads 'India 6th most polluted; average PM2.5 48.9 ug/m3; Loni is the world's most polluted city', citing 2025 global rankings (IQAir). Matches the IQAir 2025 World Air Quality Report and the page's own hero figure.  
  *Source:* IQAir World Air Quality Report 2025
- **Low birth weight 15-20% higher risk**  
  Line 1666 already reads 'Low birth weight: ~20-28% higher risk at high PM2.5 (2024 meta-analysis)', which is sourced and within the credible range (Toxics 2024 high-exposure OR ~1.28). The unsourced 15-20% band is gone.  
  *Source:* Toxics 2024 systematic review/meta-analysis (PMC11280910)
- **Dementia risk 40% higher**  
  Line 1696 already reads 'Dementia risk: ~17% higher per 10 µg/m³ PM2.5 (Lancet Planetary Health 2025)', matching the authoritative pooled estimate. The unsupported '40% higher' figure is gone (the remaining '40%' on the page, line 1843, is a separate auto/taxi-driver respiratory-symptom stat).  
  *Source:* The Lancet Planetary Health, 2025 (pooled ~17% per 10 µg/m³)
- **481,700 HAP deaths described as 'nearly 30%' of India's air-pollution deaths**  
  Line 1820 already reads '481,700 deaths/year in India from household air pollution (HAP) — about 23% of India's air-pollution deaths', which is the corrected share (481,700 of ~2.1M ≈ 23%). The 'nearly 30%' overstatement is gone.  
  *Source:* GBD 2021 / State of Global Air 2024 (HEI/IHME)
- **500,000+ HAP deaths annually among women**  
  The '500,000+ deaths annually (women)' claim that conflated India's total both-sexes HAP toll with women alone is no longer present. The current file frames HAP deaths correctly as a total — e.g. line 1371 '~0.6 million deaths a year in India, GBD 2021' — not as a women-only figure. (The '500+' at line 2956 is indoor PM2.5 µg/m³, unrelated.)  
  *Source:* GBD 2019/2021 India HAP (~0.61M total, both sexes)

### panels/economic.html

- **$339 billion misattributed to 'Lancet Planetary Health'**  
  The current file already attributes the $339 billion figure correctly to 'Lancet Countdown 2025' in the section-intro prose (line 13: '$339 billion (9.5% GDP; Lancet Countdown 2025, 2022 data)') and in both SVG diagram captions ('Source: Lancet Countdown 2025.'). The misattribution the finding flagged is no longer present. Web-confirmed as correct.  
  *Source:* Lancet Countdown 2025 India Data Sheet (2022 data)
- **Annual deaths stat card shows stale 1.67 million**  
  The stat card now reads '1.72M / Deaths/Year (Lancet 2025)' (line 20), not the stale 1.67M the finding cited. 1.72 million human-caused PM2.5 deaths is the exact figure from Lancet Countdown 2025 (2022 data), web-confirmed. The finding's alternative (~2.1M) is total air-pollution deaths from GBD 2021/SoGA 2024 — a different scope (all air pollution vs ambient PM2.5); the on-site 1.72M with its Lancet 2025 attribution is internally consistent and correctly sourced, so no further edit is needed.  
  *Source:* Lancet Countdown 2025 (1.72M PM2.5 deaths, 2022 data); The Logical Indian / Down To Earth coverage
- **Life-expectancy loss 5.3 years stale**  
  The stat card now reads '3.5 yrs / Life Expectancy Loss (AQLI 2025)' (line 22), not the stale 5.3 years the finding cited. Web-confirmed: AQLI 2025 (EPIC, University of Chicago, 2023 PM2.5 data) puts India's national average life-expectancy loss at 3.5 years relative to the WHO 5 ug/m3 guideline. Correctly updated and sourced.  
  *Source:* AQLI 2025 Annual Update, EPIC University of Chicago (2023 data); epic.uchicago.in

### panels/budget.html

- **XV-FC grants for 49 cities → 42 million-plus cities**  
  Current file already reads '₹16,539 Cr for 42 million-plus cities' in both the alert intro and the data-simple summary. The prior '49 cities' error has been corrected.  
  *Source:* PIB/MoEFCC (PRID 2002614), Feb 2024
- **XV-FC released ₹11,800 Cr / 76% utilized → ~₹11,000 Cr / 74%**  
  Current file shows 'XV-FC Grants: ~₹11,000 Cr released, ~74% utilised (CREA 2026)' and the stat strip shows ₹13,415 Cr released / 74% utilization. The prior ₹11,800/76% figures are already corrected to the CREA 2026 values.  
  *Source:* CREA 'Tracing the Hazy Air 2026' (Jan 2026)
- **Ghaziabad NCAP utilization 26% (underutilizer) → >80% high performer**  
  Current file shows Ghaziabad utilized '>39' Cr, '>80%', status 'High performer (CREA 2026)'. The prior erroneous 26%/'Below threshold' row has been corrected.  
  *Source:* CREA 'Tracing the Hazy Air 2026' (Jan 2026)
- **Lucknow NCAP row (₹180/₹72/40%, unsourced)**  
  The Lucknow row has been removed from the current city-utilization table (only Delhi, Noida, Ghaziabad remain), and the footer notes 'Rows without a verifiable per-city source have been removed.'  
  *Source:* n/a (unsourced row removed)
- **Patna NCAP row (₹120/₹84/70%, wrong)**  
  The Patna row has been removed from the current table; footer confirms unsourced per-city rows were removed.  
  *Source:* n/a (row removed)
- **Mumbai NCAP row (₹380/₹220/58%, wrong)**  
  The Mumbai row has been removed from the current table; footer confirms unsourced per-city rows were removed.  
  *Source:* n/a (row removed)
- **PMUY connections 10.33 Cr → 10.55 Cr**  
  Current file shows '10.55 Cr' connections. The value has been updated from the prior 10.33 Cr. (Minor: the date label still reads 'Jul 2025' while 10.55 Cr is a later snapshot, but the value itself is current.)  
  *Source:* PMUY portal / PIB 2025-26



---

## Flag resolutions (round 2b)

**Totals:** 3 harmonize, 13 reframe, 12 remove, 15 fix, 10 skip.

### index.html

- **[harmonize · inconsistency]** Preterm birth ~1.3x (Delhi-NCR winter)  
  The page states the same Delhi-NCR-winter preterm relative risk three different ways: '~1.3x' (line 3044), '~1.5-1.7x' (line 3091), and a dose-response '3-5% per +10 ug/m3' (line 3119). Harmonising this instance to the best-sourced sibling value (~1.5-1.7x, line 3091), which matches the India-wide preterm-birth AOR 1.67 (95% CI 1.57-1.77) in PLOS Global Public Health 2025. The dose-response stat (line 3119) measures a different quantity and is left as-is; the LBW '~1.5x' is left unchanged (study AOR 1.37, within rounding). Note: line 3091 already carries the correct value, so no sibling alignment needed there.  
  *Source:* PLOS Global Public Health 2025 (Kumar et al., pub. 2 Jul 2025), preterm AOR 1.67 (95% CI 1.57-1.77); PMC12220995
- **[reframe · direction_flip]** 60% of HAP deaths are women (list bullet, line 1825)  
  GBD 2021 shows the global HAP death/DALY burden is actually slightly higher in males (60.6M DALYs male vs 50.8M female in 2021, ~54% male), so 'majority of deaths are women' is a directional error. Reframed to the well-supported reality: women bear the highest household smoke *exposure* (WHO fact sheet), dropping the unverifiable '60% of deaths' number. The global male-majority DALY split is deliberately not inserted into this India-context bullet to avoid a scope-mismatch; the defensible equity point (disproportionate exposure) is preserved.  
  *Source:* GBD 2021 household air pollution (Lancet 2024, PIIS0140-6736(24)02840-X; PMC12182166), 2021 DALYs; WHO household air pollution and health fact sheet
- **[reframe · direction_flip]** 60% women (stat card, line 1926)  
  Same '60% women' figure as line 1825, contradicted by GBD 2021 (HAP burden ~54% male). Stat-card caption reframed to the defensible WHO exposure point, preserving card structure (481,700 HAP deaths/year number above it is unaffected).  
  *Source:* GBD 2021 household air pollution (Lancet 2024; PMC12182166); WHO household air pollution and health fact sheet
- **[remove · unsourced]** 60% of global HAP deaths are women (Lancet Countdown 2025) (stat strip, line 3121)  
  Third instance of the '60% women' figure, here carrying an explicit 'Lancet Countdown 2025' citation that could not be verified (the 2025 report says HAP deaths fall 'largely among women and children' but publishes no 60% death-share). GBD 2021 primary data contradicts a majority-women HAP death share. This stat item's entire content is the unverifiable number + unconfirmed citation, so it is removed cleanly (the preceding ~500K GBD 2021 women stat, line 3120, remains and preserves the equity point). Strip drops from 4 to 3 items. anchored old_string keeps line 3120 intact.  
  *Source:* GBD 2021 household air pollution (Lancet 2024; PMC12182166); Lancet Countdown 2025 report (lancetcountdown.org/air-pollution-and-health) - no 60% figure locatable

### panels/budget.html

- **[remove · unsourced]** Source apportionment: vehicles 38%  
  No authoritative national '38% vehicles' source-apportionment figure exists; the share is city- and season-specific (e.g. CSE puts transport at ~51.5% of Delhi LOCAL winter PM2.5; vehicles ~20-30% of urban ambient PM2.5 nationally). Removing the invented single national percentage while preserving the qualitative point that vehicles are a top contributor. Non-overlapping with the industry-share and fund-share edits on the same sentence.  
  *Source:* CSE Delhi source-apportionment (2024); CREA 'Tracing the Hazy Air 2026' (Jan 2026)
- **[remove · unsourced]** Source apportionment: industry 18%  
  No CREA/CSE/CPCB publication gives a single national '18% industry' contribution; industry share is city-specific (~10-35% across studies). 18% is within range but not attributable to any national figure, so the specific number is removed while the qualitative 'top contributor' point is kept. Non-overlapping with the vehicles-share and fund-share edits on the same sentence.  
  *Source:* CREA 'Tracing the Hazy Air 2026' (Jan 2026); CSE assessment (2024)
- **[fix · objective_error]** Vehicles + industry receive <1% of NCAP funds combined  
  Objective error: the claim conflates industry-alone with the combined total. Per CREA's NCAP breakdown, spending is road dust ~68%, transport/vehicular ~14%, waste/biomass ~12%, and industry/domestic fuel/outreach ~1% EACH. So vehicles+industry COMBINED is ~15%, not <1% — only industry and domestic fuel are individually <1%. Restated to the defensible, CREA-sourced fund split (which also matches the page's own '68% dust' and '<1% Industry/Fuel' stat cells). Reads correctly after the two sibling removals of (38%)/(18%): 'vehicles and industry are among the top PM2.5 contributors, yet NCAP spends 68% on road-dust control and under 1% each on industry and domestic fuel (CREA 2026).'  
  *Source:* CREA 'Tracing the Hazy Air 2026' (Jan 2026): road dust 68%, transport 14%, industry/domestic fuel <1% each
- **[fix · objective_error]** PMUY refills 4.47/year vs 9-12 subsidized  
  The 4.47 refills/year per-capita figure is defensible (PIB), but the denominator '9-12' is outdated. The FY2025-26 targeted subsidy (Rs 300/14.2kg cylinder) is capped at 'up to 9 refills per year' (the 12 cap was the older general figure). Aligned to the current sourced cap; the usage-gap point is preserved.  
  *Source:* Union Cabinet / PIB, 6 Aug 2025 — Rs 12,000 Cr targeted PMUY subsidy of Rs 300 for up to 9 refills/year, FY2025-26
- **[remove · unsourced]** HAP 0.61 million deaths/year, 60% women  
  The 0.61 million India HAP deaths figure is correct (GBD 2019, Lancet Planetary Health) and sourced. The '60% women' qualifier is not supported by primary sex-disaggregated data — GBD analyses of HAP-attributable mortality show males with a slightly higher burden, and the '60% women' figure traces to an older WHO 'women and children' exposure framing, not a death-share statistic. Surgically removing the unverifiable qualifier while keeping the sourced death count and the clause structure ('...causes 0.61 million deaths annually.'). Editorially sensitive (equity claim); removed the specific unsourced number rather than leaving an unverifiable figure in place.  
  *Source:* GBD 2019 (Lancet Planetary Health 2020, India state-level); WHO HAP framing (legacy 'women and children') is exposure-based, not a mortality split
- **[remove · unsourced]** CAMPA ₹94,844 Cr collected, ₹26,002 Cr utilized (2019-24)  
  The utilized figure (₹26,002 Cr, 2019-24) matches CAG/parliamentary data (CAG Report No. 5 of 2024, PA on CAMPA) and is retained. The '₹94,844 Cr collected' figure could not be substantiated by any authoritative source — the CAMPA corpus is commonly cited at ~₹47,000-55,000 Cr (₹54,685 Cr transferred to the central fund in 2018; ₹47,436 Cr released to states). Removing the invented 'collected' number while preserving the under-utilization accountability point and adding the CAG attribution.  
  *Source:* CAG Report No. 5 of 2024 (Performance Audit on CAMPA); Compensatory Afforestation Fund Act 2016 corpus figures (~₹54,685 Cr, 2018 transfer)
- **[reframe · direction_flip]** 16th Finance Commission timing / 12-month funding gap (Funding Cliff alert)  
  Direction flip: the stated dates are wrong. The 16th FC submitted its report to the President on 17 Nov 2025 (not 'expected by Oct 2026'), and its award period is 1 Apr 2026-31 Mar 2031, beginning immediately after the 15th FC period ends 31 Mar 2026 (not an 'FY27 cycle starting Apr 2027'). So the claimed 12-month FC-cycle gap does not exist. Reframed neutrally: corrected the dates and narrowed the genuine open question to the un-announced successor to the specific air-quality grant. First of two instances (see the Key Accountability Gaps edit).  
  *Source:* PIB PRID 2190975 (16th FC submits 2026-31 report to President, 17 Nov 2025); award period 1 Apr 2026-31 Mar 2031
- **[reframe · direction_flip]** 16th Finance Commission timing (Key Accountability Gaps list)  
  Second instance of the same FC-timing error. 'Report expected Oct 2026' is wrong — the 16th FC report was submitted 17 Nov 2025 and its award period (2026-31) starts 1 Apr 2026 with no cycle gap. Reframed to the accurate submission date while keeping the genuine, still-open point that a successor to the expired air-quality grant has not been announced. Sibling of the Funding Cliff alert edit.  
  *Source:* PIB PRID 2190975 (16th FC report submitted 17 Nov 2025; award period 2026-27 to 2030-31)

### panels/aqi-explainer.html

- **[fix · objective_error]** CPCB vs EPA AQI at PM2.5 = 30 (row: CPCB 100 Satisfactory vs EPA 88 Moderate)  
  30 ug/m3 is the top of CPCB's Good band (0-30 -> AQI 0-50), so the sub-index is 50/Good, not 100/Satisfactory. EPA 88 used pre-2024 breakpoints; under the 2024 table (Moderate 9.1-35.4 -> 51-100) 30 ug/m3 computes to ~90/Moderate (category unchanged). Fixed both cells; direction of leniency at this low level is unchanged (CPCB still milder).  
  *Source:* CPCB National AQI 2014 breakpoints (aqihub.info/indices/india); US EPA 2024 AQI breakpoints (aqs.epa.gov/aqsweb/documents/codetables/aqi_breakpoints.html)
- **[fix · objective_error]** CPCB vs EPA AQI at PM2.5 = 60 (row: CPCB 150 Moderate vs EPA 154 Unhealthy [sensitive groups])  
  60 ug/m3 is the top of CPCB's Satisfactory band (31-60 -> AQI 51-100), so the sub-index is 100/Satisfactory, not 150/Moderate. EPA 154 is correct (2024 Unhealthy 55.5-125.4 -> 151-200), but its category is 'Unhealthy', not 'Unhealthy (sensitive groups)' (which is the 101-150 band). Fixed the CPCB number/label and the EPA category label.  
  *Source:* CPCB National AQI 2014 breakpoints; US EPA 2024 AQI breakpoints (aqs.epa.gov/aqsweb/documents/codetables/aqi_breakpoints.html)
- **[fix · objective_error]** CPCB vs EPA AQI at PM2.5 = 100 (row: CPCB 174 Moderate vs EPA 174 Unhealthy)  
  At 100 ug/m3 PM2.5 sits in CPCB's Poor band (91-120 -> AQI 201-300), giving sub-index ~232/Poor, not 174/Moderate. Under 2024 EPA breakpoints (Unhealthy 55.5-125.4 -> 151-200) it is ~182/Unhealthy, not 174 (pre-2024). NOTE: corrected values make CPCB (232) HIGHER than EPA (182), reversing the panel's leniency thesis at this level -- resolved by the paired reframes of the intro sentence and 'Key insight' box (this same file).  
  *Source:* CPCB National AQI 2014 breakpoints; US EPA 2024 AQI breakpoints (aqs.epa.gov/aqsweb/documents/codetables/aqi_breakpoints.html)
- **[fix · objective_error]** CPCB vs EPA AQI at PM2.5 = 250 (row: CPCB 300 Very Poor vs EPA 300 Hazardous)  
  At 250 ug/m3 PM2.5 is at the top of CPCB's Very Poor band (121-250 -> AQI 301-400), so the sub-index is 400/Very Poor, not 300. Under 2024 EPA breakpoints 250 ug/m3 is in the Hazardous band (225.5-325.4 -> AQI 301-500), computing to ~350/Hazardous; the site's 300 came from the retired pre-2024 table (where AQI 300 was 'Very Unhealthy', so labelling 300 'Hazardous' was also wrong). Fixed to CPCB 400 vs EPA 350; corrected CPCB (400) exceeds EPA (350), consistent with the reframed narrative.  
  *Source:* CPCB National AQI 2014 breakpoints; US EPA 2024 AQI breakpoints (aqs.epa.gov/aqsweb/documents/codetables/aqi_breakpoints.html)
- **[reframe · direction_flip]** The CPCB scale is significantly more lenient - masking the true severity of exposure. (table intro sentence)  
  Once the table cells are corrected, CPCB is more lenient than the US EPA only at low PM2.5 (30-60 ug/m3, CPCB 50/100 vs EPA 90/154); at 100 and 250 ug/m3 the corrected CPCB sub-index (232, 400) is HIGHER than the EPA's (182, 350). The blanket 'significantly more lenient / masking severity' framing is no longer true across the range, so reframed neutrally to state the scales diverge (CPCB milder at low, higher at high) and added the breakpoint-table citation the table previously lacked. Applies alongside the four row fixes and the Key-insight reframe (same file).  
  *Source:* CPCB National AQI 2014 breakpoints; US EPA 2024 AQI breakpoints (aqs.epa.gov/aqsweb/documents/codetables/aqi_breakpoints.html)
- **[reframe · direction_flip]** At 100 ug/m3 PM2.5, CPCB still says 'Moderate' while the US EPA says 'Unhealthy.' ('Key insight' box)  
  This claim is false once the table is corrected: at 100 ug/m3 CPCB reports ~232 'Poor' (not 'Moderate'), which is HIGHER than the EPA's ~182 'Unhealthy'. Replaced with a true, sourced comparison at 60 ug/m3 (CPCB 100 'Satisfactory' vs EPA 154 'Unhealthy') that captures the genuine leniency at the concentrations common in Indian cities, and noted the crossover at high concentrations. Kept the 'read the raw ug/m3' takeaway. Pairs with the four row fixes and the intro reframe (same file).  
  *Source:* CPCB National AQI 2014 breakpoints; US EPA 2024 AQI breakpoints (aqs.epa.gov/aqsweb/documents/codetables/aqi_breakpoints.html)

### panels/source-selector.html

- **[fix · unsourced]** CPCB CAAQMS coverage: ~533 stations across ~250 cities  
  The '~533 stations across ~250 cities' figure names no source. On re-verification the CPCB CCR dashboard (airquality.cpcb.gov.in/ccr) still returns HTTP 503, but a current citable count is available: aqicn.org's CPCB network page (2026) reports 586 real-time CPCB stations — which are the continuous CAAQMS feed this card describes. This supersedes the stale/unsourced ~533. The '~250 cities' figure has no locatable source and is dropped rather than guessed. I deliberately did NOT fold in the broader ~1,296-station / 473-city national ambient network (MoEFCC/CPCB), because that total mixes continuous CAAQMS with manual NAMP stations — two different methods that platform rule (2) says not to collapse; the card is specifically the continuous/regulatory CAAQMS source, so the fix stays scoped to the continuous count. Citation style matches other cards on the page (e.g. 'aqicn.org, 2026').  
  *Source:* aqicn.org CPCB network page (2026): 586 real-time CPCB stations; corroborated in scope by MoEFCC/CPCB monitoring-network figures ('over 400' CAAQMS).
- **[remove · unsourced]** WAQI may lag CPCB by 1-2 hours (weakness box)  
  The specific '1-2 hours' latency figure is unverifiable: no authoritative WAQI/aqicn.org publication states a station-to-platform latency, and the page cites none. Surgical removal of just the invented number while preserving the supportable qualitative point (aggregators can lag the underlying regulatory feed). A sibling instance carrying the same '1-2 hours' number sits in the data-simple attribute on the WAQI card's Instruments paragraph (line 72) and is harmonized in the second edit.  
  *Source:* No primary WAQI/aqicn.org latency figure exists; claim removed per platform rule (3) rather than guessed.
- **[remove · unsourced]** WAQI can lag behind CPCB by 1-2 hours (data-simple text)  
  Same unsourced '1-2 hours' latency number as the weakness box, repeated in the plain-language data-simple attribute. Removed the specific figure while keeping the qualitative lag point, so the two instances stay consistent after the visible-text edit above.  
  *Source:* No primary WAQI/aqicn.org latency figure exists; specific number removed rather than guessed.

### panels/accountability.html

- **[harmonize · inconsistency]** NCAP '40% PM2.5 reduction by 2026' promise badge: '25-27% Achieved (CREA)'  
  CREA publishes no single national '25-27% achieved' percentage. Its Jan 2026 'Tracing the Hazy Air 2026' metric is that only 23 of 100 NCAP cities (with adequate data) met the revised 40% PM10 target; the page already states this correctly at line 25 and in the stat tile at lines 49-50. Aligning this badge to the sourced figure (and fixing PM2.5->PM10, since the revised NCAP target is PM10). Sibling instances at line 25 and lines 49-50 are already correct.  
  *Source:* CREA, 'Tracing the Hazy Air 2026: Progress Report on NCAP', 9 Jan 2026
- **[reframe · direction_flip]** Delhi e-bus promise badge: '~400 Deployed'  
  The '~400 deployed' figure is stale and wrong. DTC missed the 2023 deadline but the 1,000-bus target was met by 2024 and far exceeded: ~4,538 e-buses operational by April 2026 (Delhi now has India's largest e-bus fleet). Stated plainly/neutrally as met-late-then-exceeded. (Companion tracker instance at line 270 corrected separately.)  
  *Source:* DTC / electrive.com reporting, Apr 2026 (~4,538 e-buses); Feb-Jul 2026 batches
- **[reframe · direction_flip]** Clean Air Mission tracker, Electric Bus Fleet row: grade E2, '~400 deployed (RTI 2025)'  
  Same stale figure in the intervention tracker; the E2 (pilot/partial) grade and '~400 deployed' no longer reflect reality. DTC operated ~4,538 e-buses by April 2026 (India's largest e-bus fleet), so the deployment is operational at scale (E4). Reframed neutrally: 2023 deadline missed, 1,000 target met by 2024, ~4,538 by 2026.  
  *Source:* DTC / electrive.com, Apr 2026 (~4,538 e-buses)
- **[reframe · direction_flip]** Odd-even promise badge: '2-4% Only (IIT Study)'  
  The '2-4% (IIT Study)' attribution is unsupported. The best-identified primary estimate is EPIC/University of Chicago (Greenstone et al.), which found PM2.5 fell ~13% during scheme hours (8am-8pm) in the Jan 2016 pilot, with no effect at night and no effect in the Apr 2016 repeat. Stated neutrally with scope. (Companion tracker instance at line 277 corrected separately.)  
  *Source:* EPIC, University of Chicago — 'Clearing the air on Delhi's odd-even program' (Jan 2016 pilot, ~13% during 8am-8pm)
- **[reframe · direction_flip]** Clean Air Mission tracker, Odd-Even row: 'IIT study: 2-4% reduction only'  
  Same unsupported '2-4%' figure. Replaced with the sourced EPIC/UChicago finding (~13% PM2.5 reduction during scheme hours in Jan 2016; none at night or in the Apr 2016 round), keeping the supportable point that exemptions and seasonal-only deployment limit effectiveness.  
  *Source:* EPIC, University of Chicago — Delhi odd-even analysis (Jan 2016)
- **[fix · unsourced]** Brick kiln zigzag: '30% compliance (CPCB 2024)'  
  No CPCB 2024 source gives a 30% national zigzag-compliance figure; the number is unlocatable. CPCB/SPCB inspection data instead show wide regional variation — ~45% of kilns in UP (1,024/2,215), ~71% in Haryana-NCR (of 2,163 units), ~85% in Rajasthan. Replaced the invented single national figure with the sourced regional range, preserving the 'enforcement weak' point.  
  *Source:* CPCB/SPCB joint inspection tallies (UP ~45.2%, Haryana-NCR ~71.3%), 2024-25 reporting
- **[reframe · direction_flip]** Industrial FGD: '~35% thermal plants compliant (CEA 2024)'  
  The ~35% compliance figure overstates installation (FGD was operational at only ~57 coal units, ~8%, as of Aug 2025) and, more importantly, is superseded: the 11 July 2025 MoEFCC notification (Environment Protection Fourth Amendment Rules 2025) exempted ~78% of coal units (Category C) from FGD/SO2 standards entirely, with only ~11% (Category A) required by Dec 2027. Reframed to state this plainly and neutrally.  
  *Source:* MoEFCC notification 11 Jul 2025 (Category C ~78% exempted); Min. of Power reply, ~57 units with FGD, Aug 2025
- **[fix · unsourced]** BS-VI: 'CPCB shows 15-25% SO2 reduction in monitoring stations'  
  No CPCB source documents a 15-25% ambient SO2 reduction attributable to BS-VI; ambient SO2 in India is dominated by coal power, not fuel. Replaced the unsourced CPCB ambient claim with the verifiable, primary-sourced fact: BS-VI cut fuel sulphur 80% (50->10 ppm) from Apr 2020, enabling DPF/SCR after-treatment.  
  *Source:* PIB / IOCL Media Brief — BS-VI fuel sulphur 50->10 ppm (80% cut), 1 Apr 2020
- **[fix · objective_error]** Delhi Metro Phase 4: '65km operational, 45km under construction'  
  Phase 4's first sections only opened Jan-Mar 2026 (Magenta ext. Jan; Pink/Magenta priority stretches Mar), totalling ~25 km of the ~112 km sanctioned; '65 km operational' is not achievable at that date. Corrected the operational/under-construction split.  
  *Source:* DMRC / TheMetroRailGuy Phase 4 status, Mar 2026 (~25 km of 112.32 km operational)
- **[fix · unsourced]** March 2026 card: 'Delhi 2026: 0 of 68 days met WHO; Annual AQI average 244 — 46.8% worse than 2020'  
  The 'annual AQI 244' and '46.8% worse than 2020' figures are unlocatable in any CREA publication and are internally inconsistent (a 68-day winter window cannot be an annual average). Replaced with the sourced CREA winter 2025-26 figure: Delhi PM2.5 averaged ~163 ug/m3, among the highest of any monitored city, with no day meeting the WHO daily guideline. The 'no day met WHO' point is thereby preserved and correctly sourced.  
  *Source:* CREA Winter 2025-26 (Oct 2025-Feb 2026) analysis — Delhi PM2.5 ~163 ug/m3; no city met WHO daily guideline
- **[remove · unsourced]** 'GRAP triggers: Imposed 17 times since Jan 2025 — Stage III for 53 days, Stage IV for 15 days'  
  CAQM publishes individual GRAP invocation/revocation orders but no compiled '17 times / 53 days / 15 days' aggregate, and the page cites no source; the precise counts cannot be verified against any primary aggregate. Removed the unverifiable specific numbers while preserving the supportable qualitative point (repeated invocation, prolonged Stage III/IV spells) and pointing to the actual primary record (CAQM orders).  
  *Source:* CAQM GRAP orders (no compiled aggregate published) — precise counts unverifiable
- **[fix · objective_error]** CAG Audit card: '88% of Delhi stations violate CPCB siting criteria (CAG, April 2025)'  
  Misattribution: the 88% comes from a Newslaundry field probe that physically measured 25 Delhi stations and found ~88% (22) flouting CPCB siting norms — not from the CAG audit. The CAG Performance Audit (tabled 1 Apr 2025) confirmed that CAAQMS locations did not meet CPCB siting criteria, rendering AQI data unreliable, but states no 88% figure. Corrected the attribution in the sub-label; the number itself is real and now sourced. (The card badge 'CAG · April 2025' still fairly frames the confirming audit.)  
  *Source:* Newslaundry investigation (Dec 2024/Apr 2025, 25 stations, ~88%); CAG Performance Audit tabled 1 Apr 2025 (data unreliable)
- **[reframe · direction_flip]** Stubble subsidies: 'NASA FIRMS shows 30% fewer fires in 2024 vs 2021 peak'  
  The '30% fewer' figure is unlocatable and appears mislabeled: against the 2021 peak (~71,300 Punjab fires) the FIRMS-reported 2024 count is far lower (~11,000, a much larger drop). But the true reduction is genuinely disputed — NASA scientists (Jethva) show farmers shifted burning outside satellite overpass windows, so FIRMS counts understate actual burning. Reframed to state the FIRMS-reported decline plainly with the overpass-timing caveat, removing the specific unsupported percentage. The Rs 3,062 Cr allocation figure is left as-is (a defensible 2018-24 cumulative).  
  *Source:* NASA FIRMS; NASA Earth Observatory / B. Standard reporting on overpass-timing shift, Nov 2024
- **[remove · unsourced]** Construction site dust screens: '~40% compliance (DPCC inspections)'  
  No published DPCC headline compliance percentage confirming ~40% could be located; it is a site-level enforcement metric absent from any primary dataset the page cites. Removed the unverifiable number while preserving the supportable points (NGT mandate exists; enforcement patchy; no impact measurement).  
  *Source:* No locatable DPCC published compliance figure
- **[reframe · direction_flip]** Stubble payment adequacy: '₹1000/acre vs ₹5000 needed'  
  The 'Rs 5000 needed' figure is unsupported. Punjab's actual proposal (Oct 2024) was Rs 2,500/acre CRMIP (Rs 1,500 Centre + Rs 1,000 Punjab/Delhi); the Centre declined to fund its share, so no per-acre cash incentive is currently paid — support runs through CRM machinery subsidy. Reframed to state this accurately; the qualitative 'incentives weak' assessment (badge WEAK) is preserved.  
  *Source:* The Tribune / Down To Earth — Punjab Rs 2,500/acre CRMIP proposal, Centre declined, Oct-Nov 2024
- **[skip · unsourced]** March 2026 card: '204/238 cities exceed NAAQS PM2.5 (Oct 2025-Feb 2026, CREA)' and '0/238 meet WHO guideline'  
  Verification CONFIRMS the site's figures are correct after all. CREA's winter 2025-26 analysis (Oct 2025-Feb 2026) found 204 of 238 monitored cities exceeded the PM2.5 NAAQS and not one met the WHO daily guideline (up from 173 the previous winter). The prior flag simply could not locate the source; no edit needed.  
  *Source:* CREA Winter 2025-26 report / press release (Oct 2025-Feb 2026): 204/238 cities exceed PM2.5 NAAQS; 0 meet WHO daily guideline
- **[skip · inconsistency]** Delhi air quality budget 2024-25: '₹500 Cr (0.6% of budget)'  
  Cannot produce a safe scoped edit. The Rs 500 Cr matches Delhi's 2023-24 pledge (~Rs 505 Cr), not FY2024-25; the FY2024-25 environment & forest allocation was ~Rs 822 Cr (~1.1%), but that is a broader bucket, not an 'air quality' line item, and the same card elsewhere (line 119) cites a 'Rs 300 Cr pollution budget.' Scope is genuinely ambiguous and internally inconsistent — needs editorial reconciliation of which figure/scope the platform intends, not a scope-shifting auto-edit. Candidate: relabel as '2023-24 pledge ~Rs 505 Cr' or restate to the sourced ~Rs 822 Cr env & forest allocation.  
  *Source:* Delhi Budget FY2024-25 (env & forest ~Rs 822 Cr); 2023-24 pledge ~Rs 505 Cr
- **[skip · direction_flip]** Punjab stubble budget: '₹300 Cr (mostly unspent)'  
  Editorially sensitive and needs sourced reconciliation. Newer figures contradict both the amount and the 'mostly unspent' judgment: Punjab allocated ~Rs 500 Cr for stubble management in 2025-26 (with a large share disbursed) and higher amounts cited for 2026-27. The 'mostly unspent' framing is an accountability judgment that flips direction if corrected; recommend restating with a specific budget-year figure and disbursement source rather than an auto-edit.  
  *Source:* Punjab state budget 2025-26 stubble/CRM allocation (~Rs 500 Cr) — needs primary-doc confirmation
- **[skip · unsourced]** Haryana air quality budget: '₹150 Cr (for 14 cities)'  
  Cannot produce a safe scoped edit. The unsourced Rs 150 Cr does not map cleanly to an identifiable current figure; candidate replacements span very different scopes — the flagship Rs 3,647 Cr Haryana Clean Air Project (World Bank-backed, FY2024-25 to 2029-30) vs a ~Rs 138 Cr FY2025-26 state-budget air-quality line. Scope ambiguity means an auto-edit would risk swapping in a mismatched-scope number; recommend the editor pick one specific sourced figure.  
  *Source:* Haryana Clean Air Project (~Rs 3,647 Cr, World Bank) vs FY2025-26 state AQ line (~Rs 138 Cr)
- **[skip · unsourced]** UP air quality budget: '₹400 Cr (mostly road dust)'  
  The page names no source and no accessible primary UP state-budget / NCAP record could confirm the Rs 400 Cr allocation or the 'mostly road dust' split. Unverifiable as stated; recommend attributing to a specific dated UP budget / NCAP city-plan figure or removing the number. Skipped rather than guess or fabricate a source.  
  *Source:* No locatable primary UP budget/NCAP figure confirming Rs 400 Cr

### blog/posts/2026-03-25-economic-cost.md

- **[fix · objective_error]** Construction worker loses Rs 9,000/year, roughly 4 percent of earnings  
  Rs 600 x 15 = Rs 9,000 is correct, but 'roughly 4 percent' implies annual earnings of ~Rs 225,000, which requires ~375 earning-days at Rs 600/day — arithmetically impossible. A realistic 250-300 working-day year yields Rs 150,000-180,000, making the loss ~5-6%. Rather than impose one hidden denominator, I make the assumption explicit and give the honest range. Left the illustrative Rs 600/day base unchanged (though it is below Delhi's 2025 unskilled statutory minimum of ~Rs 710/day) so as not to cascade a rewrite of the author's example.  
  *Source:* Arithmetic; Delhi Labour Dept / factoHR minimum-wage schedule effective Apr 2025 (unskilled Rs 18,456/mo ≈ Rs 710/day)
- **[remove · unsourced]** Delhi tech workforce declined 18 percent to 14 percent over five years  
  The specific 18%->14% decline is uncited on-site and could not be located in any NASSCOM Strategic Review, talent demand-supply report, or other primary labour source (verified via targeted search of nasscom.in). Surgically removing just the two invented numbers while keeping the qualitative claim of decline; the following sentence's referent ('this shift') is preserved, so no dangling markup or broken logic results.  
  *Source:* NASSCOM Strategic Review 2025/2026 and Talent Demand-Supply Analysis searched — figure absent; no primary source publishes this split

### blog/posts/2026-04-01-children-air-pollution.md

- **[remove · unsourced]** The researchers estimated that if air quality across India were improved to meet national ambient standards alone — not even the stricter WHO guideline — 3 million fewer children would be stunted.  
  The '3 million fewer children stunted under national ambient standards' figure cannot be verified. The JEEM paper's public abstract (ideas.repec.org) states only the 5 pp / 2.4 pp per-1-SD PM2.5 stunting/severe-stunting effects and does not describe any national-standards policy simulation. The post's own cited secondary source (Down to Earth) gives a WHO-guideline counterfactual (stunting -10.4 pp, severe -5.17 pp) but contains no '3 million' figure and no national-standards scenario. Full text is paywalled (ScienceDirect/HAL 403; ETH 500). Surgically removing this one sentence loses no verified content: the immediately following sentence already carries the sourced WHO-guideline figure (10.4 pp), and the paragraph reads cleanly without the middle sentence. Not replaced because no locatable source supports a national-standards absolute count.  
  *Source:* Balietti, Datta & Veljanoska, JEEM vol. 113 (2022), abstract via ideas.repec.org/a/eee/jeeman/v113y2022ics0095069622000122.html; Down to Earth feature (post's own cited source) — neither states a '3 million' or national-standards figure.
- **[fix · unsourced]** In the 2024-25 winter season, primary schools in Delhi-NCR were shut for a cumulative total of over three weeks.  
  No CAQM/CPCB/CREA authority publishes a cumulative 'closure-weeks' tally, so the specific 'over three weeks' cannot be tied to a primary source. The supportable qualitative point IS verifiable and sourceable: GRAP Stage IV imposed on 18 Nov 2024 suspended physical classes for all Delhi-NCR students except Classes 10 & 12, after which schools cycled through closure -> hybrid (25 Nov) -> in-person (5 Dec) -> hybrid again (16-17 Dec 2024). Per the platform's unsourced rule, since a sourced qualitative replacement exists I fix rather than blank-remove: I drop the unverifiable precise tally and replace it with the concrete, dated GRAP-IV closure sequence, cited inline in the article's by-name style. Neutral, no accountability spin altered.  
  *Source:* CAQM GRAP Stage IV order effective 18 Nov 2024 (Delhi CM/Directorate of Education physical-class suspension), reported by India TV / ANI / Deccan Herald 17-18 Nov 2024; subsequent hybrid/in-person transitions Nov 25 & Dec 5 & Dec 16-17 2024 (Business Today, India TV, Akashvani News).

### blog/posts/2026-04-05-ncap-deadline.md

- **[remove · unsourced]** Mumbai PM2.5 recorded a 38 percent rise under NCAP  
  The '38 percent rise' has no locatable primary source and is contradicted by the most recent data: Respirer Living Sciences' Maharashtra NCAP report shows Mumbai's PM2.5 falling from 34.45 ug/m3 (2019) to 28.19 ug/m3 (Jan-Sept 2024), below the 40 ug/m3 NAAQS, and explicitly names Mumbai among cities that 'Lead the Way in Air Quality Improvements Under NCAP.' Mumbai therefore does not belong in the 'wrong direction' list. Surgically removing only the Mumbai sentence preserves the two unflagged, still-listed examples (Navi Mumbai +46%, Ujjain +46%) and the surrounding structure. A sourced 'rise' replacement does not exist (the transient 2019-2023 peak reversed), so removal is safer than reframing.  
  *Source:* Respirer Living Sciences, 5-Year Analysis: Maharashtra NCAP Cities PM2.5 2019-2024 (Oct 2024) — Mumbai 34.45->28.19 ug/m3, named an NCAP improvement leader; corroborated by CREA Tracing the Hazy Air 2026
- **[harmonize · inconsistency]** XV-FC grants (Rs 16,539 cr, 49 cities) represent 87 percent of all NCAP city-level funding  
  The sentence conflated an allocated figure (Rs 16,539 cr) with the released total the post already cites in 'Follow the Money' (Rs 13,415 cr released), producing an inconsistent derived '87 percent.' CREA's Tracing the Hazy Air 2026 gives the clean released-basis figures: XV-FC released Rs 11,021 crore of the Rs 13,415 crore released across NCAP + XV-FC = 82.2%. Aligning this instance to the released basis makes it internally consistent with the rest of the post while preserving the 'funding cliff' point. The '49 cities' is correct and retained: CREA 2026 states '49 million-plus cities/urban agglomerations are funded under XV-FC air quality grant' (the sibling budget-panel flag's '42 cities' is the item that is wrong, not this one).  
  *Source:* CREA, Tracing the Hazy Air 2026 (Jan 2026), Financial Support section: 'Rs 11,021 crore was released' under XV-FC; 'Rs 13,415 crore has been released under NCAP and XV-FC funds'; '49 million-plus cities... funded under XV-FC air quality grant'

### netlify/functions/lib/calc.mjs

- **[skip · unsourced]** Car/taxi/cab/uber/ola multiplier 0.4x  
  The fabricated 'WHO/CPCB' source flagged for this coefficient is already gone from the current file: the TRANSPORT_MULTIPLIERS comment (line 56) and the calcTransportExposure source string (line 93) now cite 'peer-reviewed commute-exposure studies (e.g., Goel et al. 2015, Delhi)'. Nothing left to correct there. The 0.4x value itself is a defensible modeling assumption for AC/windows-up Indian app-cabs (Goel et al. 2015 place AC cars among the lowest-exposure modes); the flag's own reasoning recommends not editing the coefficient unilaterally, and it applies to five modes at once (car/taxi/cab/uber/ola) so there is no single safe unique old_string. Skipping.  
  *Source:* Goel et al. 2015, Atmospheric Environment (Delhi commute microenvironments); current file already reflects the corrected non-fabricated source string
- **[skip · unsourced]** Metro/subway multiplier 0.3x  
  Fabricated 'WHO/CPCB' source already corrected in the current file (line 56 / line 93 cite Goel et al. 2015). The 0.3x value is a defensible assumption for filtered AC metro carriages (Goel et al. 2015: metro among lowest exposure); the exposure literature is genuinely mixed (underground platform rail dust can exceed ambient) so no single sourced constant exists. Flag's own reasoning recommends not editing the coefficient. Skipping.  
  *Source:* Goel et al. 2015, Atmospheric Environment; current file source string already de-fabricated
- **[skip · unsourced]** Train multiplier 0.5x  
  Fabricated source already corrected in the current file. In-transit PM2.5:ambient ratios for rail vary widely (~0.5-1.5x) by ventilation; 0.5x is a plausible modeling assumption, not a sourced constant, and no single primary figure exists. Flag recommends not changing the value. Skipping.  
  *Source:* Peer-reviewed commute-exposure literature (rail microenvironments); no single authoritative constant
- **[skip · unsourced]** Bus multiplier 0.9x  
  Fabricated source already corrected in the current file. 0.9x is route/ventilation-specific and directionally arguable for open-window Indian buses, but no single authoritative national figure exists and the flag itself deems it a defensible modeling assumption not to edit. Skipping.  
  *Source:* Peer-reviewed commute-exposure literature; values route/ventilation-specific, no national constant
- **[skip · unsourced]** Motorcycle/scooter multiplier 1.4x  
  Fabricated source already corrected in the current file. Goel et al. 2015 reports unenclosed two-wheeler exposure ~10-40% above ambient, so both 1.3x and 1.4x sit within the study's range; the 0.1x distinction is within measurement noise. Not worth changing a defensible assumption; flag's own conclusion is 'keep 1.4x'. Skipping.  
  *Source:* Goel et al. 2015, Atmospheric Environment (two-wheeler exposure ~10-40% above ambient)
- **[fix · objective_error]** Purifier CADR: 9 ft ceiling default and 'CADR = volume x ACH' attributed to AHAM  
  Misattribution. AHAM's Verifide room-size guidance (the 2/3 rule) assumes an 8-ft ceiling and ~4.8 ACH, and AHAM defines CADR as a MEASURED chamber-test rating, not the volume x ACH engineering identity this function uses. Per the flag I am NOT changing the 9 ft ceiling / 5 ACH inputs (lowering the ceiling would make the tool less protective for typical ~10 ft Indian rooms), but I am correcting the source string so the volume x ACH sizing and the 9 ft / 5 ACH figures are presented as JanVayu's own conservative assumptions rather than being over-attributed to 'AHAM CADR formula'. Web-verified against AHAM Verifide guidance (2/3 rule, 8 ft ceiling, ~4.8 ACH). Only the source string is changed; the returned numbers are unaffected.  
  *Source:* AHAM Verifide air-filtration standards / 2/3 rule (8-ft ceiling, ~4.8 ACH); oransi.com, ahamverifide.org, seetheair.org, verified 2026-07-17

