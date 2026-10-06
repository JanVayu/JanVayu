# CPCB daily AQI bulletins, 2015–2025

Every day at 4pm the Central Pollution Control Board (CPCB) publishes an AQI bulletin as a PDF covering 200+ cities. It has done so since May 2015, and the bulletin is the official number. Nobody had it as a series, because a decade of it sits in PDFs.

[UrbanEmissions.Info](https://github.com/urbanemissionsinfo/AQI_bulletins) parsed those PDFs into a table. JanVayu condenses that table into the question a citizen can act on: how many days of each official category did my city have in a given year, and how many stations was that figure built from?

The summary covers **297 cities, 2015–2026**, built from 507,334 city-days. 2015 (from 1 May, CPCB's first bulletin) and 2026 (to the last fetch) are marked as partial years, and the share of days actually covered is published beside the mark. The data is in `data/aqi-bulletins.json`.

## Why this, when we already have XKDR

The two sources differ in kind, and the bulletins cover the period the other one lost.

| | XKDR India Air Quality Database | CPCB daily bulletins |
|---|---|---|
| Unit | one station | one city |
| Cadence | hourly | daily |
| Measure | PM2.5 µg/m³ | the official AQI category |
| Ends | CPCB feed stops **1 Sep 2025** | ran to **31 Dec 2025** |

The bulletin PDFs kept coming after the station feed into the XKDR archive stopped. They are also the official figure, not a reconstruction from raw readings. That matters for accountability: it is CPCB's own statement about the city, in writing, on that date.

## What the summary leaves out

**It has no annual mean AQI.** AQI is a unitless index that reports only whichever pollutant scores worst on the day, so an index cannot be averaged over a year. Counting days in each category is the legitimate use of a daily index, and it is what GRAP stages and school closures are triggered by.

**It states no trend over time.** This is worth reading before anyone adds one.

The first version tried a like-for-like panel: the ten cities that reported a usable year in every year from 2015 to 2025. It showed Poor-or-worse days falling from **26.3% of city-days in 2015 to 8.3% in 2025**, and severe days from 55 to 8. A clean, quotable result, and not a usable one. Those same ten cities went from a median of **one** reporting station to six:

| | 2015 | 2025 |
|---|---:|---:|
| Agra | 1 | 6 |
| Kanpur | 1 | 3 |
| Varanasi | 1 | 4 |
| Faridabad | 1 | 3 |
| Navi Mumbai | 1 | 5 |
| Delhi | 5 | 37 |

Keeping the city list fixed does not keep the measurement fixed. A city AQI averaged over one station and the same city averaged over six are different instruments, and nothing in the data separates a change in the air from a change in the sensors. Delhi is the one city in the panel that was never thin, and it shows no trend across the window: 136 Poor-or-worse days in 2015, 157 in 2024. So read one year at a time, not a series.

## What the bulletins do show

**Most Indian cities with an official AQI measure it with one monitor.** In CPCB's 2024 bulletin, **264 cities** reported a usable year, and **221 of them (84%)** did so on a median of fewer than three stations. For **204 cities the median was exactly one.** Agartala, Ajmer, Amritsar, Aizawl and two hundred others have a daily official air quality figure that is one reading from one place, carrying the city's name.

That needs no trend to establish, and an RTI request could follow it up.

Among cities with at least three stations, the worst in 2024 by Poor-or-worse days were Gurugram (164 of 365), Delhi (157 of 366), Noida (153), Patna (148), Faridabad (140) and Ghaziabad (128).

## Cautions for anyone reusing the data

A station count of one is not a city. Every city-year carries a median station count and a "thin" flag. Do not compare a one-station city with a thirty-station city, and do not rank them together.

City names needed manual cleaning. The source describes it as the "Chihuahua problem": the same city spelled several ways across years. Only the version that went through that cleaning is used here.

2015 is a partial year, since bulletins begin on 1 May. A 180-day minimum keeps it usable, but it is eight months of data, not twelve.

## Licence and credit

The bulletins are Government of India publications, and the figures in them are facts. The parsing and the city-name cleaning are UrbanEmissions.Info's work, published under **GPL-3.0**, which is a software licence and an awkward fit for a dataset.

JanVayu therefore publishes only the derived summary (day counts per city per year), not the source table, and credits both CPCB and the parsing project in the file's source field. For the underlying rows, go to the [UrbanEmissions.Info repository](https://github.com/urbanemissionsinfo/AQI_bulletins).
