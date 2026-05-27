# When a Politician Says 'AQI Improved 20%', Ask: Which Monitor?

**Published:** 27 May 2026 | **Author:** Team JanVayu | **Reading time:** 4 min

---

In April 2026, the environment minister of a major Indian state announced that PM2.5 had dropped 20% year-on-year under NCAP. The number was real. The context was missing. The station showing the improvement was on a highway median that had been repaved and planted with a dust barrier. The station near the industrial estate — the one that had consistently shown the worst readings — had been decommissioned six months earlier for "maintenance."

This is the data source problem. **Four different platforms, four different numbers, four different conclusions about whether the air is getting better or worse.**

## The four sources

**CPCB (Central Pollution Control Board)** operates India's official Continuous Ambient Air Quality Monitoring Stations (CAAQMS). These are regulatory-grade instruments — beta attenuation monitors, chemiluminescence analysers — housed in climate-controlled shelters. When they work, they are the gold standard. But the CAG's April 2025 audit found that **88% of CPCB stations had data-quality issues**: sensor drift, calibration gaps, missing pollutant channels, or hours-long reporting blackouts. Many cities have only two or three operational stations covering millions of residents.

**WAQI (World Air Quality Index)** aggregates data from government networks worldwide, including CPCB. It applies the US EPA scale rather than the Indian CPCB scale, which means the same raw readings produce different AQI numbers. WAQI is useful for international comparison but can confuse users who see a different AQI for their city than what CPCB reports.

**IQAir** combines government data with its own proprietary monitoring network and correction algorithms. It applies machine-learning adjustments for humidity and cross-sensitivity. IQAir numbers tend to diverge most from CPCB during high-humidity monsoon months, when uncorrected government sensors can undercount particles. IQAir's annual World Air Quality Report is widely cited but uses its own station selection criteria, which can shift city rankings from year to year.

**Sensor.Community (formerly Luftdaten)** is a global citizen-science network of low-cost PM sensors — primarily the SDS011 and SPS30. India now has over 3,000 registered sensors. The accuracy is lower — **typically ±20-50% compared to reference instruments** — but the spatial density is unmatched. A single CPCB station cannot tell you whether the air in your child's school playground is different from the air at the monitoring station 4 km away. A cluster of community sensors can.

## Why the differences matter

Consider Delhi on a typical winter evening. CPCB might report an AQI of 280 from its Anand Vihar station. WAQI shows 310 for the same station because it uses US EPA breakpoints. IQAir shows 340 for "Delhi" because it includes data from additional sensors and applies humidity correction. A Sensor.Community node 500 metres from a construction site reads PM2.5 of 450 µg/m³ — which would translate to an AQI well above 400.

None of these numbers is "wrong." Each reflects a different measurement methodology, spatial coverage, and indexing convention. **The problem is when any single number is presented as "the" truth about a city's air.**

## The accountability angle

When a government claims air quality improvement, the critical questions are:

1. **Which stations?** Were the same stations compared year-on-year, or were new (possibly cleaner-sited) stations added?
2. **Which scale?** A 20% drop on CPCB's lenient scale might still leave air far above WHO guidelines.
3. **Which period?** Annual averages smooth over crisis episodes. A city can show an improving annual trend while experiencing worse peak-season pollution.
4. **What about missing data?** If a station was offline during the worst pollution month, the annual average will look artificially good.

The CAG audit was blunt: the data infrastructure underpinning NCAP's claimed progress is not reliable enough to support the claims being made from it.

## Source transparency is step one

JanVayu's new [Data Source Selector](/index.html#source-selector) panel lets you toggle between CPCB, WAQI, IQAir, and Sensor.Community readings for any monitored city. You can see where the numbers agree and where they diverge. You can check which stations are currently reporting and which have gone silent.

This is not about declaring one source better than another. It is about making the methodology visible. When you know that IQAir's number includes a humidity correction and CPCB's does not, you can evaluate the 20% improvement claim for yourself. When you see that a city's "improvement" disappears if you include the decommissioned station's historical data, you can ask the right questions at the next public hearing.

Source transparency is the first step to data accountability. And data accountability is the first step to clean air.

Explore the tool: [Data Source Selector on JanVayu](/index.html#source-selector).

---

*Sources: CAG Performance Audit of NCAP (April 2025); CPCB CAAQMS network documentation; Sensor.Community India network stats (May 2026); IQAir World Air Quality Report 2025; CREA analysis of NCAP target cities (January 2026).*
