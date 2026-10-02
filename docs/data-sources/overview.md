# Data Sources Overview

JanVayu draws on a Reading List of 160+ public sources and papers. Figures link to their original source where one is public; some map layers are modelled estimates (for example SatPM2.5, CAMS and LongPMInd) and are labelled as such. This page lists the major categories.

---

## Real-Time Air Quality

| Source | Type | Access | Used For |
|--------|------|--------|---------|
| [WAQI](https://waqi.info) | Real-time AQI | Free API | Dashboard, map, all city data |
| [CPCB CAAQMS](https://app.cpcbccr.com/ccr/) | Official AQI | Free web | Verification, official readings |
| [OpenAQ](https://openaq.org) | Hyperlocal CPCB + community stations | Free API key | My Neighbourhood panel, chatbot hyperlocal (primary; Sensor.Community fallback) |
| [Open-Meteo](https://open-meteo.com/) | PM2.5/PM10 forecast (CAMS) | Free, key-less | Live 5-day Forecast panel, chatbot "will it be bad tomorrow?" |
| [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/) | Active-fire detection (VIIRS/NOAA-20 NRT) | Free API key | Farm Fire Tracker (stubble burning) |
| [Sensor.Community](https://sensor.community/) | Low-cost community sensors (data under the Open Data Commons Database Contents License v1.0) | Free | Hyperlocal fallback |
| [IMD](https://mausam.imd.gov.in) | Meteorological | Free | Reference only (not fetched by the platform's code) |
| [XKDR India Air Quality Database](https://airquality.xkdr.org) | Observed hourly station readings, 2009 onwards (CPCB CAAQM + US Embassy), CC BY 4.0 | Free API key | Observed station layer, checking the satellite map against the monitors. See [xkdr-air-quality.md](xkdr-air-quality.md) |
| [Open-Meteo archive](https://open-meteo.com/en/docs/historical-weather-api) | Hourly historical meteorology | Free, key-less | Meteorological normalisation for 44 cities, 2018–2024. See [deweathered-national.md](deweathered-national.md) |

---

## Health & Mortality

| Source | Type | Used For |
|--------|------|---------|
| [Lancet Countdown 2025](https://lancetcountdown.org) | Peer-reviewed | India-specific mortality, economic cost |
| [IHME GBD 2021](https://vizhub.healthdata.org/gbd-results/) | Peer-reviewed | Disease burden, age-standardised rates |
| [PNAS (Burnett et al. 2018)](https://doi.org/10.1073/pnas.1803222115) | Peer-reviewed | GEMM methodology |
| [Harvard T.H. Chan School](https://www.hsph.harvard.edu) | Academic | Children's health |
| [WHO Air Quality Guidelines 2021](https://www.who.int/publications/i/item/9789240034228) | Guideline | PM2.5 and PM10 standards |
| [AQLI (EPIC)](https://aqli.epic.uchicago.edu) | Research | Life expectancy estimates |
| [Lancet Planetary Health — PM2.5 Mortality (2024)](https://www.thelancet.com/journals/lanplh/article/PIIS2542-5196(24)00248-1/fulltext) | Peer-reviewed | Causal PM2.5 mortality estimates for India |
| [Science Advances — PM2.5 Inequality (2025)](https://www.science.org/doi/10.1126/sciadv.adq1071) | Peer-reviewed | Unequal air quality improvements across India |

---

## Policy & Governance

| Source | Type | Used For |
|--------|------|---------|
| [PRANA Portal](https://prana.cpcb.gov.in/) | Official | NCAP city-wise tracking |
| [MoEFCC](https://moef.gov.in) | Official | NCAP budgets, ministry responses |
| [Indian Kanoon](https://indiankanoon.org/) | Legal | Supreme Court and NGT orders |
| [CAQM](https://caqm.nic.in/) | Official | GRAP orders, NCR directives |
| [Union Budget documents](https://www.indiabudget.gov.in) | Official | Fund allocation tracking |

---

## Economic & Social Data

| Source | Used For |
|--------|---------|
| [World Bank — Cost of Air Pollution](https://openknowledge.worldbank.org/handle/10986/25013) | GDP loss, productivity |
| [TERI](https://www.teriin.org) | Background reference (specific report not named here) |
| [ILO](https://www.ilo.org) | Background reference (specific report not named here) |
| [PLFS (MoSPI)](https://mospi.gov.in) | Informal-employment counts used to size the exposed workforce |

---

## Investigative & Research

| Source | Used For |
|--------|---------|
| [CREA — Tracing the Hazy Air](https://energyandcleanair.org) | City-level source analysis |
| [CSE — Centre for Science and Environment](https://www.cseindia.org) | Policy analysis, GRAP evaluation |
| [IQAir World Air Quality Report 2025](https://www.iqair.com/world-air-quality-report) | City rankings, global compliance data |
| [UrbanEmissions.info](https://www.urbanemissions.info) | Emissions inventories (Dr. Sarath Guttikunda) |

---

## Zotero Bibliography

JanVayu maintains a public Zotero group library for collaborative bibliography management:

**[zotero.org/groups/6508140/janvayu/library](https://www.zotero.org/groups/6508140/janvayu/library)**

The library holds a selection of the papers, reports, and datasets referenced across the platform (21 items when checked on 2 Oct 2026); the Reading List panel carries the fuller list. Researchers and contributors can use it to:

- Browse a selection of cited sources
- Export citations in any format (BibTeX, APA, Chicago, etc.)
- Suggest new papers for inclusion

---

## Citation and Attribution

JanVayu always links to primary sources. When reproducing data from JanVayu:

- Cite the original source (Lancet, CPCB, etc.), not JanVayu
- JanVayu is mostly an aggregator and accountability platform; the derived datasets it does produce (such as `deweathered-national.json`, `aqi-bulletins.json` and `station-observed.json`) are documented in this folder
- For methodology questions, refer to the original research papers

**Content licence:** CC BY-NC-SA 4.0 — you may share and adapt content for non-commercial purposes with attribution and the same licence.
