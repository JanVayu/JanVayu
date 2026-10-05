# Five of Our Six Pollutant Pages Were Printing Random Numbers

**Published:** 2 October 2026 | **Author:** Team JanVayu | **Reading time:** 4 min

---

For about five months, the PM10, CO, NO₂, SO₂ and O₃ pages on JanVayu showed a table of "live levels" whose numbers were random. We removed the code on 22 September 2026. This post says what the pages did, how long it ran, what they show now, and what a second error in the same area did to some of the answers Ask JanVayu gave.

## What the pages showed

Each pollutant page lists ten Indian cities with a reading for that pollutant. The data feed behind the pages returned two numbers per city: the overall AQI and a "pm25" field. That field was in fact WAQI's PM2.5 sub-index (or 0.7 times the overall AQI where WAQI reported none), not a concentration. It returned nothing for PM10, CO, NO₂, SO₂ or O₃.

The PM2.5 page used that PM2.5 field but in the wrong unit: it printed the sub-index as µg/m³, so it overstated concentrations (about twice over at a sub-index of 160). That is the second error described below. The other five needed a number from somewhere, and the code made one up. It took the city's overall AQI and multiplied it by a random factor between 0.5 and 0.7. The result went into a column headed with the pollutant's name and unit, with a coloured badge beside it.

The factor was redrawn on every page load, so two visits a minute apart gave two different tables. A comment in the code said the values were approximated from AQI. The page itself said nothing of the kind.

## How long it ran

The formula is in the earliest version of the page generator in our repository, merged on 26 April 2026 ([commit 0f00f39](https://github.com/JanVayu/JanVayu/commit/0f00f390fa9537a71756487db5144bd95bf4d2af)). It stayed until pull request [#393](https://github.com/JanVayu/JanVayu/pull/393) removed it on 22 September 2026. That is 149 days.

We cannot tell you how many people read those tables or what any of them saw. The values were generated in each visitor's browser, and nothing recorded them. We found the problem while moving every page onto one stylesheet, not through a report from a reader.

## Why nothing caught it

A blank cell looks unfinished. A plausible number looks complete. Every automated check on the site passed for five months, because a random number is still a number and the page rendered. The only symptom was two loads that disagreed, and nobody was comparing loads.

## What the pages show now

The rankings feed now also returns the per-pollutant sub-index exactly as WAQI reports it. The pages show that, labelled as a sub-index, and list only cities whose stations report the pollutant. PM2.5 and PM10 also carry a concentration.

NO₂, SO₂, O₃ and CO carry no concentration. The US EPA breakpoints for those are written in ppb or ppm over different averaging windows, and converting to the units India's standards use needs an assumed temperature and pressure. We would rather print a sub-index we can name than a concentration we had to assume.

## A second error in the same place

WAQI reports each pollutant as a US EPA sub-index: a unitless number on a 0 to 500 scale, not a concentration in µg/m³. The dashboard has carried the conversion since 3 May 2026 (commit 123b9ec), after a reader, Sarath Guttikunda, reported that map popups showed sub-indices as µg/m³. Six server functions (`rankings`, `air-query`, `health-advisory`, `daily-digest`, `accountability-brief` and `anomaly-check`) never applied it. They passed the sub-index along as if it were µg/m³. The rankings sorted on it, and the embeddable widget coloured it against a 5, 15, 35, 55 and 150 µg/m³ scale (WHO guideline levels at the low end, US EPA breakpoints above).

The one that mattered most was the fallback reply in Ask JanVayu, which states a PM2.5 figure and how many times the WHO annual guideline of 5 µg/m³ it is. At a sub-index of 160, someone asking whether it was safe to go out was told 160 µg/m³, 32 times the guideline. On the conversion table the site uses, 160 is about 73 µg/m³, about 15 times. The answer was out by a factor of two, in the direction of alarm. The conversion now lives in one shared file, `netlify/functions/lib/iaqi.mjs`.

## What we changed

A new automated check, `check-no-random-data.py`, fails on any `Math.random()` in site code outside the games unless a written reason sits next to it. We tested it by putting the original formula back, and it failed.

One such use remains, in the demo fallback in `app.js`. It returns values flagged as not live, under a station name ending in "(Fallback)". If you think a few per cent of wobble on demo values is itself misleading, say so and we will remove it.

The check catches random numbers. It would not have caught the second error, which was a real number in the wrong unit. We know of no automated check that would have, and that one was found by reading the code.

## If you cited one of these pages

If you quoted a figure from the PM10, CO, NO₂, SO₂ or O₃ page between 26 April and 22 September 2026, please treat it as invalid. The PM2.5 page, the rankings and the widget were also affected by the unit error above, so treat a PM2.5 figure from them in that window as overstated, and use the dashboard (fixed for the map on 3 May 2026) or CPCB's own readings. If you tell us where it appeared, we will say so publicly next to the correction. And if you ever see a number on this site that changes when you reload the page, that is a bug. Write to **contribute@janvayu.in**.
