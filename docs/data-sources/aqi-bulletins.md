# CPCB daily AQI bulletins, 2015–2025

CPCB publishes an AQI bulletin every day at 4pm as a PDF, covering 200+ cities,
and has done since May 2015. It is the **official** number: the one a minister
quotes and a court cites. It has never been available as a series, because it is
a decade of PDFs.

[UrbanEmissions.Info](https://github.com/urbanemissionsinfo/AQI_bulletins)
parsed them. `scripts/build-aqi-bulletins.py` turns that table into the question
a citizen can act on: **how many days of each official category did my city have
in a given year, and how many stations was that figure built from.**

- Source file: `data/aqi-bulletins.json`
- **297 cities, 2015–2026**, from 507,334 city-days. 2015 (from 1 May, CPCB's first bulletin) and 2026 (to the last fetch) are flagged `partial`, with the measured `coverage` published beside the flag.

## Why this, when we already have XKDR

Different pipeline, and it fills the gap the other one leaves.

| | XKDR India Air Quality Database | CPCB daily bulletins |
|---|---|---|
| Unit | one station | one city |
| Cadence | hourly | daily |
| Measure | PM2.5 µg/m³ | the official AQI category |
| Ends | CPCB feed stops **1 Sep 2025** | ran to **31 Dec 2025** |

The bulletin PDFs kept coming when the station feed into the archive stopped.
They are also the *official* figure rather than a reconstruction from raw
readings, which is what makes them useful for accountability: it is CPCB's own
statement about the city, in writing, on that date.

## What this file deliberately does not contain

**No annual mean AQI.** The site's own rule is that AQI is a unitless index
reporting only whichever of six pollutants scores worst, and that an index
cannot be averaged over a year. Counting **days in each category** is the
legitimate use of a daily index, and it is what GRAP stages and school closures
are actually triggered by. `--check` fails if a mean creeps in.

**No trend over time**, and this is the part worth reading before anyone adds
one.

The first version of the builder computed a "like-for-like" panel: the ten
cities that reported a usable year in every year from 2015 to 2025. It showed
Poor-or-worse days falling from **26.3% of city-days in 2015 to 8.3% in 2025**,
and severe days from 55 to 8. A clean, quotable, apparently rigorous result.

It is not usable. Those same ten cities went from a median of **one** reporting
station to six:

| | 2015 | 2025 |
|---|---:|---:|
| Agra | 1 | 6 |
| Kanpur | 1 | 3 |
| Varanasi | 1 | 4 |
| Faridabad | 1 | 3 |
| Navi Mumbai | 1 | 6 |
| Delhi | 5 | 37 |

Holding the city list constant does not hold the **measurement** constant. A
city AQI aggregated over one station and the same city aggregated over six are
different instruments, and nothing in this data separates a change in the air
from a change in the sensor. Delhi, the one city in the panel that was never
thin, shows no trend at all across the window: 136 Poor-or-worse days in 2015,
157 in 2024.

So the file states no trend, `_meta.no_trend` says why, and `--check` refuses a
`like_for_like` block. Read one year, not a series.

## What it does say, and the finding worth publishing

**Most Indian cities with an official AQI are measuring it with one monitor.**
In CPCB's own 2024 bulletin, **264 cities** reported a usable year and **221 of
them (84%) did so on a median of fewer than three stations**. For **204 cities
the median was exactly one.** Agartala, Ajmer, Amritsar, Aizawl and two hundred
others have a daily official air quality figure that is a reading from one place
with a city's name on it.

That is a within-year fact, needs no trend, and is the sort of thing an RTI can
follow up on.

Among the cities with at least three stations, 2024's worst by Poor-or-worse
days: Gurugram 164 of 365, Delhi 157 of 366, Noida 153, Patna 148, Faridabad
140, Ghaziabad 128.

## Traps

**A station count of one is not a city.** Every city-year carries
`median_stations` and a `thin` flag. Never compare a one-station city against a
thirty-station city and never rank them together.

**City names needed manual cleaning.** The source calls it the "Chihuahua
problem": the same city spelled several ways across years. Only the
`_openrefined` file, which has been through that cleaning, is used here.

**2015 is a partial year** — the bulletins begin on 1 May 2015. The 180-day
floor keeps it usable but it is eight months, not twelve.

## Licence and credit

The **bulletins** are Government of India publications and the figures in them
are facts. The **parsing and the city-name cleaning** are UrbanEmissions.Info's
work, published under **GPL-3.0**, which is a software licence and an awkward
fit for a derived dataset.

JanVayu therefore publishes **only this derived summary** — day counts per city
per year — and not the source table, and credits both CPCB and the parsing
project in `_meta.source`. If you want the underlying rows, get them from that
repository rather than from us.

## Rebuild

```bash
git clone --depth 1 https://github.com/urbanemissionsinfo/AQI_bulletins /tmp/bulletins
python3 scripts/build-aqi-bulletins.py \
  --source /tmp/bulletins/data/Processed/AllIndiaBulletinsMaster2025_openrefined.csv
python3 scripts/build-aqi-bulletins.py --check
```

The check is network-free and recomputes every category count from the records.
