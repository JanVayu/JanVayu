# Health & Mortality Data

JanVayu's health impact figures are sourced exclusively from peer-reviewed academic research. This page documents the key sources and their methodology.

---

## GEMM (Global Exposure Mortality Model)

**Source:** Burnett et al. (2018), *PNAS* — "Global estimates of mortality associated with long-term exposure to outdoor fine particle matter"

GEMM is the methodology behind the Health Impact Calculator. It is preferred over earlier integrated exposure-response (IER) models because:

- It captures non-linear concentration-response relationships
- It is calibrated on data from high-pollution settings (including India)
- It covers five disease outcomes: ischemic heart disease, stroke, COPD, lung cancer, and lower respiratory infections

---

## Lancet Countdown on Health and Climate Change

**Latest edition:** 2025 Report  
**URL:** [lancetcountdown.org](https://lancetcountdown.org)

The Lancet Countdown is an annual publication tracking health impacts of climate change and air pollution. JanVayu's headline figures — 1.72 million annual deaths, $339.4 billion economic cost — come from the India-specific chapter of the 2025 report.

---

## Global Burden of Disease (GBD) 2021

**Source:** Institute for Health Metrics and Evaluation (IHME)  
**URL:** [vizhub.healthdata.org/gbd-results](https://vizhub.healthdata.org/gbd-results/)

GBD 2021 provides country- and state-level estimates of disability-adjusted life years (DALYs) and deaths attributable to ambient PM2.5. JanVayu uses GBD data for:

- Disease burden by state (for the regional breakdown)
- Age-stratified mortality estimates
- Comparison between India and global benchmarks

---

## Air Quality Life Index (AQLI)

**Source:** Energy Policy Institute at the University of Chicago (EPIC)  
**URL:** [aqli.epic.uchicago.edu](https://aqli.epic.uchicago.edu)

AQLI converts PM2.5 exposure into life expectancy terms — how many years of life are lost due to pollution above the WHO guideline. JanVayu uses the 2025 AQLI figure: **3.5 years** average life expectancy loss for Indian residents.

---

## IQAir World Air Quality Report 2025

**Source:** IQAir (released March 24, 2026)  
**URL:** [iqair.com/world-air-quality-report](https://www.iqair.com/world-air-quality-report)

The 8th annual report analysed 9,446 cities across 143 countries. Key findings for India:

- **Loni, India** is the most polluted city globally (112.5 µg/m³ — up 23% from 2024, 22× the WHO guideline)
- Only **14% of global cities** met the WHO annual PM2.5 guideline of 5 µg/m³ (down from 17%)
- India's average PM2.5: **48.9 µg/m³** (~10× WHO limit)
- Loss of US State Department embassy monitoring (March 2025) left millions without independent air quality data

Used for:
- Global city and country rankings
- Delhi's position as most polluted capital city
- Loni's position as most polluted city globally

---

## Lancet Countdown 2025 — Headline Mortality Figure

**Source:** The Lancet Countdown on Health and Climate Change (2025 report, India chapter)  
**URL:** [thelancet.com/countdown-health-climate](https://www.thelancet.com/countdown-health-climate)

The annual *Lancet Countdown* synthesises the latest exposure-response functions, demographic data, and PM2.5 exposure surfaces into a single attributable-mortality estimate. The 2025 report places annual ambient PM2.5 mortality in India at **1.72 million** &mdash; up from 1.5 million in earlier syntheses. The increase comes from re-attribution of household biomass deaths and a tighter exposure-response at the high end of the PM2.5 distribution. India's share of the global PM2.5 mortality burden remains ~70%.

This is the **canonical headline figure** used throughout JanVayu &mdash; on the dashboard, in the Health Impact panel, and in the README's *Key Statistics* table.

---

## Lancet Planetary Health — PM2.5 Mortality Studies (2024)

**Source:** The Lancet Planetary Health  

Two peer-reviewed studies, distinct from the Lancet Countdown synthesis above, published in late 2024:

1. **Krishna et al. — "Estimating the effect of annual PM2·5 exposure on mortality in India: a difference-in-differences approach"** &mdash; India's **first causal-inference estimate** from domestic cohort data. Tracked seven districts over a decade and produced a dose-response of approximately **8.6% increase in all-cause mortality per +10 µg/m³** in long-term PM2.5. When applied to India's PM2.5 exposure surface, the model attributed approximately **1.5 million** additional deaths per year compared to WHO-guideline conditions. This 1.5M figure is study-specific and pre-dates the Lancet Countdown 2025 synthesis (1.72M).  
   [DOI: 10.1016/S2542-5196(24)00248-1](https://www.thelancet.com/journals/lanplh/article/PIIS2542-5196(24)00248-1/fulltext)

2. **"Ambient air pollution and daily mortality in ten cities of India: a causal modelling study"** &mdash; First multi-city study examining short-term PM2.5 exposure and daily mortality using causal methods.  
   [DOI: 10.1016/S2542-5196(24)00114-1](https://www.thelancet.com/journals/lanplh/article/PIIS2542-5196(24)00114-1/fulltext)

> **Note on the two figures.** The 1.5 million (Krishna et al.) and 1.72 million (Lancet Countdown 2025) numbers are **both legitimate and both cited** on JanVayu &mdash; they come from different methods (causal cohort vs. annual synthesis) and we keep both in the Research Library so readers can see them side by side. The dashboard hero uses 1.72 million, the more recent and commonly-cited figure.

---

## Science Advances — PM2.5 Inequality in India (2025)

**Source:** Science Advances  
**Title:** "Improved daily PM2.5 estimates in India reveal inequalities in recent enhancement of air quality"  
**URL:** [doi.org/10.1126/sciadv.adq1071](https://www.science.org/doi/10.1126/sciadv.adq1071)

Demonstrates that air quality improvements in India have been unequal — wealthier urban areas have seen gains while poorer regions remain heavily polluted. Emphasises the need for equitable air quality control policies.

---

## Children's Health Data

| Claim | Source |
|-------|--------|
| Lung development impairment | Harvard T.H. Chan School of Public Health |
| School closure data | CPCB/state PCB orders during Severe+ AQI episodes |
| Stunting and PM2.5 linkage | UNICEF India / Lancet |
| Cognitive development impacts | Karolinska Institute studies on South Asian populations |

---

## Household Air Pollution

| Claim | Source |
|-------|--------|
| 500,000+ annual deaths from household cooking | WHO Global Burden of Disease |
| Ujjwala scheme coverage | Petroleum Ministry official data |
| Solid fuel usage rates | NFHS-5 (National Family Health Survey) |

---

## Full Bibliography

All sources cited across JanVayu are catalogued in our public Zotero library:

**[zotero.org/groups/6508140/janvayu/library](https://www.zotero.org/groups/6508140/janvayu/library)**
