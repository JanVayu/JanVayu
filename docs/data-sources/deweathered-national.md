# Was it policy, or was it the wind? For 44 cities

A city's PM2.5 can fall because it emitted less, or because the wind blew
harder. Annual averages hide the difference, and every "air improved by X%"
headline rests on not knowing which happened.

`scripts/build-deweathered-national.py` separates them, for **44 Indian cities
over 2018 to 2024**. It extends `build-deweathered.py`, which did the same for
Delhi-NCR alone over 2018 to 2022.

---

## The headline

**33 of 44 cities are improving once weather is removed. Eleven are not.**

The steepest falls are in Uttar Pradesh and the western NCR:

| City | Normalised trend | Raw trend | R² |
|---|---|---|---|
| Meerut | **−14.63** µg/m³/yr | −12.35 | 0.87 |
| Varanasi | −14.19 | −14.62 | 0.90 |
| Lucknow | −13.98 | −11.62 | 0.83 |
| Moradabad | −13.51 | −13.40 | 0.75 |
| Agra | −10.61 | −11.73 | 0.89 |

And the cities getting worse, none of which can blame the weather:

| City | Normalised trend | Raw trend | R² |
|---|---|---|---|
| Chandigarh | **+3.07** µg/m³/yr | +2.32 | 0.81 |
| Gwalior | +2.37 | +1.51 | 0.82 |
| Chandrapur | +2.36 | +2.81 | 0.80 |
| Solapur | +1.73 | +1.27 | 0.82 |
| Mumbai | +0.80 | +0.87 | 0.84 |

Delhi falls at **−1.78** µg/m³/yr normalised against −1.75 raw: weather explains
almost none of its change either way.

---

## What normalisation does and does not change

**In 38 of 44 cities it barely moves the answer.** Only six shift by a
microgram per year or more, and in five of those the raw figure was
*understating* the improvement: Lucknow reads −11.62 raw and −13.98 normalised,
Meerut −12.35 and −14.63. Weather in those years was working against the
emission cuts, not flattering them.

That is worth saying plainly because the intuitive fear runs the other way, that
a city might be claiming credit the wind earned. On this record that happens
rarely, and where the two diverge the raw number is usually the more pessimistic
one.

---

## Method

After Grange et al. (2018), *Atmos. Chem. Phys.* 18, 6223–6239, the same method
the Delhi original used and the same one Hawa Ka Hisab uses.

1. Per city, a random forest predicts daily mean PM2.5 from meteorology (wind
   speed, both wind vector components, temperature, relative humidity) plus time
   terms (trend, season as a circle, day of week) and the station.
2. To normalise, hold the time terms and the station **fixed** and resample the
   meteorology from that city's whole observed record, predict, and average over
   30 draws. What survives is the concentration that day would have had under an
   average-weather draw.
3. The trend through the normalised annual series is the part weather cannot
   explain.

Held-out R² runs 0.52 (Bengaluru) to 0.91 (Kolkata), median 0.81.

**Two exclusions matter as much as the inclusions.** Lagged pollutant values are
not features: feeding yesterday's PM2.5 into a model meant to isolate emissions
launders the answer through the target and manufactures a trend out of
autocorrelation alone. And the station term is held fixed during normalisation,
so the result is not contaminated by which stations happened to be reporting on
a given day. That matters more here than in Delhi: the network grew from 129
stations in 2018 to 534 in 2024.

---

## Sources

**PM2.5** from the [India Air Quality Database](https://airquality.xkdr.org)
(XKDR Forum, CC BY 4.0), compiling CPCB's CAAQM network and US Department of
State monitors via AirNow. The Delhi original used OpenAQ, whose Indian history
is shallower.

**Meteorology** from the Open-Meteo archive, hourly, at the mean position of
each city's stations, requested with `timezone=Asia/Kolkata`. That timezone is
not cosmetic: XKDR's `collected_at` is a naive IST stamp, so a UTC met series
would be misaligned by five and a half hours and would scramble the diurnal
cycle the model leans on. Wind is averaged as a vector, u and v separately,
because averaging compass degrees across the 360/0 boundary is meaningless.

---

## Limits, each of which is real

**A normalised trend is not proof that policy caused it.** Emissions, fuel mix,
construction, industrial output and economic activity all sit inside the part
weather cannot explain. The method rules out one confounder, not all of them.

**Cities are not comparable on R².** It measures how much of *that city's*
variance *its own* meteorology explains, not how good the estimate is.

**A city qualifies on at least 1,800 station-days, 2 stations, and 5 of the 7
years.** Below that a random forest has too little to learn the local
meteorology, and the trend is noise wearing a trend's clothes. 194 cities in the
archive have some data and do not qualify.

**62 stations are dropped, about 51,000 station-days.** They carry no city, no
state and no coordinates in XKDR's station table, so they can be placed in no
city and given no weather. Their names often embed a place ("Alandi Pune"), and
parsing that would be inventing geography rather than reading it.

**The window ends in 2024 because the data does.** CPCB's feed into the source
archive stops on 1 September 2025. See
[xkdr-air-quality.md](xkdr-air-quality.md).

**Thirty resamples, not sixty.** The Delhi run used 60 draws and 200 bootstrap
replicates for one city. Across 44 that is hours of compute for a second decimal
place. This uses 30 and reports no interval, rather than reporting one it did
not earn.

**This does not replace `deweathered.json`.** That file is Delhi 2018–2022 and
is read by `app.js` and a blog post. Migrating the panel is a separate change.
