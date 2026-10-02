# When a Politician Says 'AQI Improved 20%', Ask: Which Monitor?

**Published:** 27 May 2026 | **Author:** Team JanVayu | **Reading time:** 4 min

---

Imagine a state environment minister announcing that PM2.5 had dropped 20% year-on-year under NCAP. The number could be real and the context still missing. The station showing the improvement might sit on a highway median that had been repaved and planted with a dust barrier. The station near the industrial estate — the one that had consistently shown the worst readings — might have been decommissioned months earlier for "maintenance." This is a hypothetical example, not a report of a specific announcement.

This is the data source problem. **Four different platforms, four different numbers, four different conclusions about whether the air is getting better or worse.**

## The four sources

**CPCB (Central Pollution Control Board)** operates India's official Continuous Ambient Air Quality Monitoring Stations (CAAQMS). These are regulatory-grade continuous monitors. When they work, they are the reference standard in India. But siting and data quality have been questioned: Newslaundry's 2025 field check of 25 Delhi monitoring stations found that **88% flouted CPCB's siting criteria**, and a CAG audit tabled in the Delhi Assembly in April 2025 found that 13 of the 24 Delhi Pollution Control Committee stations it verified in 2020 were sited too close to trees (Newslaundry, 1 April 2025). Many cities have only two or three operational stations covering millions of residents.

**WAQI (World Air Quality Index)** aggregates data from government networks worldwide, including CPCB. It applies the US EPA scale rather than the Indian CPCB scale, which means the same raw readings produce different AQI numbers. WAQI is useful for international comparison but can confuse users who see a different AQI for their city than what CPCB reports.

**IQAir** combines government data with its own proprietary monitoring network and correction algorithms. It applies machine-learning adjustments for humidity and cross-sensitivity. IQAir's annual World Air Quality Report is widely cited.

**Sensor.Community (formerly Luftdaten)** is a global citizen-science network of low-cost PM sensors — primarily the SDS011 and SPS30. Its footprint in India is very small: as of 2 October 2026, the Sensor.Community live feed returned no Indian sensors. Field studies find large, humidity-dependent errors in low-cost sensors such as the SDS011 (for example, [Atmospheric Aerosol and Air Quality Research, 2023](https://aaqr.org/articles/aaqr-23-04-oa-0080)), so accuracy is lower than reference instruments, but where they exist the spatial density is unmatched. A single CPCB station cannot tell you whether the air in your child's school playground is different from the air at the monitoring station 4 km away. A cluster of community sensors can.

## Why the differences matter

Consider Delhi on a typical winter evening. CPCB might report an AQI of 280 from its Anand Vihar station, which corresponds to PM2.5 of about 114 µg/m³. On the US EPA scale used by WAQI, the same reading comes to about 190, a lower number, because above roughly 80 µg/m³ the CPCB index runs higher than the EPA index for the same PM2.5. IQAir might show a different figure for "Delhi" because it combines data from additional sensors. These figures are illustrative, not recorded readings. A Sensor.Community node 500 metres from a construction site reads PM2.5 of 450 µg/m³ — which would translate to an AQI well above 400.

None of these numbers is "wrong." Each reflects a different measurement methodology, spatial coverage, and indexing convention. **The problem is when any single number is presented as "the" truth about a city's air.**

## The accountability angle

When a government claims air quality improvement, the critical questions are:

1. **Which stations?** Were the same stations compared year-on-year, or were new (possibly cleaner-sited) stations added?
2. **Which scale?** A 20% drop on CPCB's lenient scale might still leave air far above WHO guidelines.
3. **Which period?** Annual averages smooth over crisis episodes. A city can show an improving annual trend while experiencing worse peak-season pollution.
4. **What about missing data?** If a station was offline during the worst pollution month, the annual average will look artificially good.

A CAG audit tabled in the Delhi Assembly in April 2025 found Delhi's AQI data unreliable because station locations did not meet CPCB siting criteria.

## Source transparency is step one

JanVayu's new [Data Source Selector](/index.html#source-selector) panel lets you toggle between CPCB, WAQI, IQAir, and Sensor.Community readings for any monitored city. You can see where the numbers agree and where they diverge. You can check which stations are currently reporting and which have gone silent.

This is not about declaring one source better than another. It is about making the methodology visible. When you know that IQAir's number includes a humidity correction and CPCB's does not, you can evaluate the 20% improvement claim for yourself. When you see that a city's "improvement" disappears if you include the decommissioned station's historical data, you can ask the right questions at the next public hearing.

Source transparency is the first step to data accountability. And data accountability is the first step to clean air.

Explore the tool: [Data Source Selector on JanVayu](/index.html#source-selector).

---

*Sources: CAG performance audit of air pollution control in Delhi, tabled in the Delhi Assembly, 1 April 2025, as reported by [Newslaundry](https://www.newslaundry.com/2025/04/01/delhi-air-quality-data-unreliable-cag-report-confirms-newslaundry-probe) (press report); CPCB CAAQMS network documentation; Sensor.Community India network stats (May 2026); IQAir World Air Quality Report 2025; CREA analysis of NCAP target cities (January 2026).*
