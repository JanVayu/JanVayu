# Was it policy, or was it the wind? For 44 cities

A city's PM2.5 can fall because it emitted less, or because the wind blew harder. Annual averages hide the difference, and every "air improved by X%" headline depends on not knowing which one happened.

This analysis separates the two for **44 Indian cities over 2018 to 2024**. It extends the earlier Delhi-NCR analysis, which covered 2018 to 2022.

---

## The result

**33 of 44 cities are improving once weather is removed. Eleven are not.**

The steepest falls are in Uttar Pradesh and the western NCR:

| City | Normalised trend | Raw trend | R² |
|---|---|---|---|
| Meerut | **−14.63** µg/m³/yr | −12.35 | 0.87 |
| Varanasi | −14.19 | −14.62 | 0.90 |
| Lucknow | −13.98 | −11.62 | 0.83 |
| Moradabad | −13.51 | −13.40 | 0.75 |
| Agra | −10.61 | −11.73 | 0.89 |

Some cities are getting worse, and weather cannot be blamed for any of them:

| City | Normalised trend | Raw trend | R² |
|---|---|---|---|
| Chandigarh | **+3.07** µg/m³/yr | +2.32 | 0.81 |
| Gwalior | +2.37 | +1.51 | 0.82 |
| Chandrapur | +2.36 | +2.81 | 0.80 |
| Solapur | +1.73 | +1.27 | 0.82 |
| Mumbai | +0.80 | +0.87 | 0.84 |

Delhi falls at **−1.78** µg/m³/yr normalised against −1.75 raw, so weather explains almost none of its change in either direction.

---

## What removing the weather changes

In 38 of 44 cities it barely moves the answer. Only six shift by a microgram per year or more. In four of those the raw figure understated the improvement: Lucknow reads −11.62 raw and −13.98 normalised, Meerut −12.35 and −14.63. There, weather was working against the emission cuts. In the other two, Agra and Pune, weather had flattered the raw figure.

The common fear is that a city might claim credit the wind earned. On this record that happens rarely, and where the two numbers differ, the raw one is usually the more pessimistic.

---

## Method

The method follows Grange et al. (2018), *Atmos. Chem. Phys.* 18, 6223–6239. It is the same one the Delhi analysis used, and the same one Hawa Ka Hisab uses.

1. For each city, a random forest model learns to predict daily mean PM2.5 from the weather (wind speed, the two components of wind direction, temperature, relative humidity), from time terms (long-run trend, season treated as a circle, day of week) and from the station.
2. To remove the weather, the time terms and the station are held fixed while the weather is resampled from the city's whole observed record. The model predicts again for each draw, and the result is averaged over 30 draws. What remains is the concentration that day would have had under average weather.
3. The trend through the normalised annual series is the part weather cannot explain.

On data held back from training, R² runs from 0.52 (Bengaluru) to 0.91 (Kolkata), with a median of 0.80.

Two exclusions matter as much as what goes in. Yesterday's PM2.5 is not used as an input. Feeding it to a model meant to isolate emissions routes the answer through the thing being predicted, and manufactures a trend out of autocorrelation alone. And the station is held fixed during normalisation, so the result does not depend on which stations happened to report on a given day. That matters more here than in Delhi, because the network reached 534 reporting stations in 2024.

---

## Sources

**PM2.5** comes from the [India Air Quality Database](https://airquality.xkdr.org) (XKDR Forum, CC BY 4.0), which compiles CPCB's CAAQM network and US Department of State monitors via AirNow. The Delhi analysis used OpenAQ, whose Indian history is shallower.

**Weather** comes from the Open-Meteo archive, hourly, at the mean position of each city's stations, in Indian Standard Time. The time zone matters. XKDR's timestamps are in IST with no offset, so weather data in UTC would sit five and a half hours out of step and scramble the daily cycle the model relies on. Wind is averaged as a vector (east-west and north-south parts separately), because averaging compass degrees across the 360/0 boundary is meaningless.

---

## Limits

**A normalised trend is not proof that policy caused it.** Emissions, fuel mix, construction, industrial output and economic activity all sit inside the part weather cannot explain. The method rules out one confounder, not all of them.

**Cities are not comparable on R².** It measures how much of that city's variation its own weather explains. It does not say how good the estimate is.

**A city qualifies with at least 1,800 station-days, 2 stations, and 5 of the 7 years.** Below that, a random forest has too little to learn the local weather, and the trend is noise dressed as a trend. 194 cities in the archive have some data and do not qualify.

**62 stations are dropped, about 51,000 station-days.** XKDR's station table gives them no city, no state and no coordinates, so they can be placed in no city and given no weather. Their names often contain a place ("Alandi Pune"), but parsing that would invent geography, not read it.

**The window ends in 2024 because the data does.** CPCB's feed into the source archive stops on 1 September 2025. See [xkdr-air-quality.md](xkdr-air-quality.md).

**Thirty resamples, not sixty.** The Delhi run used 60 draws and 200 bootstrap replicates for one city. Across 44 cities that is hours of computing for a second decimal place. This run uses 30 and reports no confidence interval, rather than report one it did not earn.

**The Delhi-only analysis stays as it is.** It covers 2018–2022 and is still what the Delhi figures and one blog post read from. Moving them to this panel is a separate change.
