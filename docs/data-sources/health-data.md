# Health and mortality data

JanVayu's health figures come mainly from peer-reviewed research and official statistics. This page lists the key sources and how each is used.

---

## GEMM (Global Exposure Mortality Model)

**Source:** Burnett et al. (2018), *PNAS*, "Global estimates of mortality associated with long-term exposure to outdoor fine particulate matter"

GEMM is the method behind the Health Impact Calculator. It replaced the older integrated exposure-response (IER) models for three reasons:

- It captures non-linear concentration-response relationships.
- It extends the exposure range using a cohort of Chinese men (exposures up to 84 µg/m³). India is a country the model is applied to, not a cohort source.
- It covers five disease outcomes: ischemic heart disease, stroke, COPD, lung cancer, and lower respiratory infections.

---

## Lancet Countdown on Health and Climate Change

**Latest edition:** 2025 Report  
**URL:** [lancetcountdown.org](https://lancetcountdown.org)

The Lancet Countdown is an annual publication tracking the health effects of climate change and air pollution. JanVayu's headline figures, 1.72 million annual deaths and a $339.4 billion economic cost, come from the India chapter of the 2025 report.

---

## Global Burden of Disease (GBD) 2021

**Source:** Institute for Health Metrics and Evaluation (IHME)  
**URL:** [vizhub.healthdata.org/gbd-results](https://vizhub.healthdata.org/gbd-results/)

GBD 2021 gives country and state estimates of disability-adjusted life years (DALYs) and deaths attributable to ambient PM2.5. JanVayu uses it for disease burden by state, for age-specific mortality, and for comparing India with global benchmarks.

---

## Air Quality Life Index (AQLI)

**Source:** Energy Policy Institute at the University of Chicago (EPIC)  
**URL:** [aqli.epic.uchicago.edu](https://aqli.epic.uchicago.edu)

AQLI converts PM2.5 exposure into life expectancy: how many years of life are lost to pollution above the WHO guideline. JanVayu uses the 2025 AQLI figure of **3.5 years** of average life expectancy lost for Indian residents.

---

## IQAir World Air Quality Report 2025

**Source:** IQAir (released March 24, 2026)  
**URL:** [iqair.com/world-air-quality-report](https://www.iqair.com/world-air-quality-report)

The 8th annual report analysed 9,446 cities across 143 countries. For India it found:

- Loni, India, is the most polluted city in the world (112.5 µg/m³, up 23% from 2024 and 22 times the WHO guideline).
- Only **14% of global cities** met the WHO annual PM2.5 guideline of 5 µg/m³, down from 17%.
- India's average PM2.5 was **48.9 µg/m³**, about 10 times the WHO limit.
- The loss of US State Department embassy monitoring (March 2025) left millions without independent air quality data.

JanVayu uses it for global city and country rankings, for Delhi's position as the most polluted capital city, and for Loni's position as the most polluted city in the world.

---

## Lancet Countdown 2025: the headline mortality figure

**Source:** The Lancet Countdown on Health and Climate Change (2025 report, India data sheet)  
**URL:** [thelancet.com/countdown-health-climate](https://www.thelancet.com/countdown-health-climate)

Each year the *Lancet Countdown* combines the latest exposure-response functions, demographic data and PM2.5 exposure maps into one estimate of attributable deaths. The 2025 report attributes over 1,718,000 deaths in India in 2022 to anthropogenic PM2.5 (**1.72 million**), 38% more than in 2010. For scale, India's fossil-fuel PM2.5 deaths (752,000) are about 30% of the Countdown's global 2.52 million (2022). That compares fossil-fuel deaths with fossil-fuel deaths, not 1.72 million against a global total. India's share is not a majority. A far larger global share claimed earlier on JanVayu was **retracted** in July 2026 and is now policed by `scripts/check-retracted-claims.py`.

This is the **headline figure** JanVayu uses throughout: on the dashboard, in the Health Impact panel, and in the README's *Key Statistics* table.

---

## Lancet Planetary Health: PM2.5 mortality studies (2024)

**Source:** The Lancet Planetary Health  

Two peer-reviewed studies from 2024, separate from the Lancet Countdown synthesis above:

1. Jaganathan et al., "Estimating the effect of annual PM2·5 exposure on mortality in India: a difference-in-differences approach." A nationwide causal estimate. It compares changes in mortality across 655 districts (2009–2019) and finds that all-cause mortality rises by about **8.6% for each +10 µg/m³** of long-term PM2.5. Applied to India's PM2.5 exposure, the model attributed about **1.5 million** extra deaths a year compared with WHO-guideline conditions. That 1.5M figure belongs to this study and pre-dates the Lancet Countdown 2025 synthesis (1.72M).  
   [DOI: 10.1016/S2542-5196(24)00248-1](https://www.thelancet.com/journals/lanplh/article/PIIS2542-5196(24)00248-1/fulltext)

2. "Ambient air pollution and daily mortality in ten cities of India: a causal modelling study." The first multi-city study of short-term PM2.5 exposure and daily mortality using causal methods.  
   [DOI: 10.1016/S2542-5196(24)00114-1](https://www.thelancet.com/journals/lanplh/article/PIIS2542-5196(24)00114-1/fulltext)

> **Two figures, both valid.** The 1.5 million (Jaganathan et al.) and 1.72 million (Lancet Countdown 2025) numbers are both cited on JanVayu. They come from different methods, a nationwide difference-in-differences design and an annual synthesis, and the Reading List keeps both so readers can compare them. The dashboard headline uses 1.72 million, the more recent and more widely cited figure.

---

## Science Advances: PM2.5 inequality in India (2025)

**Source:** Science Advances  
**Title:** "Improved daily PM2.5 estimates in India reveal inequalities in recent enhancement of air quality"  
**URL:** [doi.org/10.1126/sciadv.adq1071](https://www.science.org/doi/10.1126/sciadv.adq1071)

The study shows that India's air quality gains have been uneven. Wealthier urban areas improved, while poorer regions stayed heavily polluted. The authors argue for air quality policy that reaches those regions.

---

## Children's health data

| Claim | Source |
|-------|--------|
| School closure data | State government and CAQM orders during Severe+ AQI episodes (specific orders to be cited) |
| Stunting and PM2.5 linkage | [PMC9699051](https://pmc.ncbi.nlm.nih.gov/articles/PMC9699051/): ambient prenatal and postnatal PM2.5 account for 2.7% and 2.5% of the population attributable risk of stunting in the study area |

Claims about lung development and cognitive effects are not listed until specific studies are named.

---

## Household air pollution

| Claim | Source |
|-------|--------|
| Ujjwala scheme coverage | Petroleum Ministry official data |
| Solid fuel usage rates | NFHS-5 (National Family Health Survey) |

A dated, India-specific figure for household-air-pollution deaths is not cited here until a source table (IHME GBD or the State of Global Air India profile) is added.

---

## Full bibliography

A selection of the sources cited across JanVayu is catalogued in our public Zotero library:

**[zotero.org/groups/6508140/janvayu/library](https://www.zotero.org/groups/6508140/janvayu/library)**
