# When a Politician Says 'AQI Improved 20%', Ask: Which Monitor?

**Published:** 27 May 2026 | **Author:** Team JanVayu | **Reading time:** 4 min

---

Suppose a state environment minister announces that PM2.5 has dropped 20% year-on-year under NCAP. The figure could be real and still leave out the context. The station that shows the improvement might sit on a highway median that was repaved and given a dust barrier. The station near the industrial estate, which had always shown the worst readings, might have been shut months earlier for "maintenance." This is a hypothetical example, not a report of a specific announcement.

It shows the data source problem. Four platforms give four different numbers, and four different answers to whether the air is getting better or worse.

## The four sources

**CPCB (Central Pollution Control Board)** runs India's official Continuous Ambient Air Quality Monitoring Stations (CAAQMS), which are regulatory-grade continuous monitors. When they work, they are India's reference standard. Their siting and data quality have been questioned, though: Newslaundry's 2025 field check of 25 Delhi monitoring stations found that **88% flouted CPCB's siting criteria**, and a CAG audit tabled in the Delhi Assembly in April 2025 found that 13 of the 24 Delhi Pollution Control Committee stations it verified in 2020 were sited too close to trees (Newslaundry, 1 April 2025). Many cities have only two or three working stations for millions of residents.

**WAQI (World Air Quality Index)** aggregates data from government networks worldwide, including CPCB. It uses the US EPA scale and not the Indian CPCB scale, so the same raw readings give different AQI numbers. WAQI helps with international comparison, but a reader may be confused to see a different AQI for their city from the one CPCB reports.

**IQAir** combines government data with its own monitoring network and applies machine-learning corrections for humidity and cross-sensitivity. Its annual World Air Quality Report is widely cited.

**Sensor.Community (formerly Luftdaten)** is a global citizen-science network of low-cost PM sensors, mainly the SDS011 and SPS30. Its footprint in India is very small: as of 2 October 2026, the Sensor.Community live feed returned no Indian sensors. Field studies find large, humidity-dependent errors in low-cost sensors such as the SDS011 (for example, [Atmospheric Aerosol and Air Quality Research, 2023](https://aaqr.org/articles/aaqr-23-04-oa-0080)), so they are less accurate than reference instruments. Where they exist, though, they are far denser than anything else. A single CPCB station cannot tell you whether the air in your child's school playground differs from the air at a monitoring station 4 km away. A cluster of community sensors can.

## Why the numbers differ

Take Delhi on a typical winter evening. CPCB might report an AQI of 280 from its Anand Vihar station, which corresponds to PM2.5 of about 114 µg/m³. On the US EPA scale used by WAQI, the same reading comes to about 190, a lower number, because above roughly 80 µg/m³ the CPCB index runs higher than the EPA index for the same PM2.5. IQAir might show a different figure for "Delhi" because it combines data from additional sensors. These figures are illustrative, not recorded readings. A Sensor.Community node 500 metres from a construction site reads PM2.5 of 450 µg/m³, which would translate to an AQI well above 400.

None of these numbers is wrong. Each reflects a different way of measuring, a different spread of stations and a different indexing convention. The trouble starts when one of them is presented as the truth about a city's air.

## Questions to ask about an improvement claim

When a government claims that air quality has improved, four questions are worth asking.

1. Which stations? Were the same stations compared year-on-year, or were new, possibly cleaner-sited stations added?
2. Which scale? A 20% drop on CPCB's more lenient scale might still leave the air far above WHO guidelines.
3. Which period? Annual averages smooth over crisis episodes, so a city can show an improving annual trend while its peak-season pollution gets worse.
4. What about missing data? If a station was offline during the worst pollution month, the annual average will look better than the air was.

A CAG audit tabled in the Delhi Assembly in April 2025 found Delhi's AQI data unreliable because station locations did not meet CPCB siting criteria.

## See the sources side by side

JanVayu's new [Data Source Selector](/index.html#source-selector) panel lets you switch between CPCB, WAQI, IQAir and Sensor.Community readings for any monitored city. You can see where the numbers agree and where they diverge, and which stations are reporting now and which have gone silent.

We do not rank the sources. The panel shows how each one measures. Once you know that IQAir's number includes a humidity correction and CPCB's does not, you can weigh a 20% improvement claim yourself. If a city's "improvement" disappears once the decommissioned station's history is included, you will know what to ask at the next public hearing.

Try the tool: [Data Source Selector on JanVayu](/index.html#source-selector).

---

*Sources: CAG performance audit of air pollution control in Delhi, tabled in the Delhi Assembly, 1 April 2025, as reported by [Newslaundry](https://www.newslaundry.com/2025/04/01/delhi-air-quality-data-unreliable-cag-report-confirms-newslaundry-probe) (press report); CPCB CAAQMS network documentation; Sensor.Community India network stats (May 2026); IQAir World Air Quality Report 2025; CREA analysis of NCAP target cities (January 2026).*
