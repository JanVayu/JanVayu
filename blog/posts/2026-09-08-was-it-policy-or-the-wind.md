# Was It Policy, or Was It the Wind?

**Published:** 8 September 2026 | **Author:** Team JanVayu | **Reading time:** 8 min

---

Every winter somebody announces that Delhi's air has improved. Every winter somebody else announces that it has not. Both can point at real numbers.

The reason they can is that the number everyone points at is not measuring only what they think it is measuring. A week of still, cold weather traps whatever the city emits close to the ground and the monitors read high. A week of wind and rain scatters the same emissions and the monitors read low. Nothing about the traffic, the kilns, the construction or the stubble has changed. The air is simply being counted under different conditions.

Until now JanVayu could not tell those apart, and we said so on the site. We led with annual averages partly because averaging over a year smooths out some of the weather. That is honest, and it is also a limit: it let us say *what* the air was, not *why* it changed.

<div class="jv-dgm jv-dgm-wide"><img src="/blog/diagrams/deweather.svg" alt="Was it policy or was it the wind. The same emissions read differently in different weather: a still cold week disperses nothing and reads dirty, a windy wet week blows everything away and reads clean, while the emissions in both weeks are identical. The method has three steps: first, a random forest learns from five years of daily readings how much of each day was wind, temperature and humidity, and how much was the season, the day of week and the station; second, the date and station are held fixed while weather is swapped in at random from the whole record and averaged over sixty draws, so no day is flattered or punished by the week it fell in; third, what survives that swap is the part the weather cannot explain. For Delhi in September and October between 2018 and 2022, the measured figures fall by 5.5 micrograms per cubic metre a year, but with the weather removed only 1.1 remains, about a fifth of it. Neither figure clears its own margin of error, so JanVayu claims no direction: most of the apparent improvement in those months was the wind. Yesterday's pollution is never fed in as a predictor, because that would manufacture a trend out of the fact that dirty days come in runs."></div>
<div class="jv-dgm jv-dgm-tall"><img src="/blog/diagrams/deweather-tall.svg" alt="" aria-hidden="true"></div>

## Putting every day under the same weather

The technique is called meteorological normalisation, and the version we use comes from [Grange and colleagues (2018)](https://acp.copernicus.org/articles/18/6223/2018/) in *Atmospheric Chemistry and Physics*. It is also what [Hawa Ka Hisab](https://hawakahisab.in/) does, and reading their method is part of why we built ours.

The idea is simpler than the name. First you let a model learn how Delhi's daily PM2.5 responds to weather: wind speed, which direction the wind came from, temperature, humidity. You also let it learn the things that are not weather but do vary — the time of year, the day of the week, which station is reporting, and the slow drift across five years.

Then you do something slightly strange. You take a particular day, keep its date and its station exactly as they were, and give it somebody else's weather, drawn at random from anywhere in the five-year record. You ask the model what that day would have read. Then you do it again, sixty times, with sixty different weather draws, and average the answers.

What comes out is that day's reading as it would have been under ordinary weather rather than the weather it actually got. A day that got lucky with a strong westerly is no longer flattered. A day trapped under a November inversion is no longer punished. Compare *those* numbers across years and you are comparing emissions rather than luck.

## What we deliberately refuse to tell the model

There is an obvious way to make this model look much better, and it is a trap.

Air pollution is strongly autocorrelated: dirty days arrive in runs. If you let the model use yesterday's PM2.5 as a clue for today's, its accuracy leaps. It also becomes worthless for our purpose, because it is now predicting pollution from pollution. Whatever is left over gets labelled "the part weather cannot explain", and you have manufactured a confident trend out of nothing but the calendar.

So lagged pollutant values are not inputs. The model is allowed to know what the weather was doing and what day it was. It is not allowed to know what the air was doing.

## The answer for Delhi, and why it is narrower than we wanted

Across September and October, from 2018 to 2022, at ten stations in Delhi-NCR:

| | change per year | 95% interval |
|---|---:|---|
| As measured | **−5.5** µg/m³ | −9.9 to +0.2 |
| With weather removed | **−1.1** µg/m³ | −1.9 to +0.1 |

Read the first row and Delhi looks like it is improving briskly. Read the second and about four-fifths of that improvement turns out to have been the weather.

And then read the intervals, which is the part that matters. Neither of them clears zero. So the honest statement is not "Delhi improved a little". It is **we cannot tell whether Delhi improved at all** in those months, once you stop giving the weather credit for it.

That is a negative result and we are publishing it as one.

## Why only September and October

Because that is where the data actually is, and pretending otherwise would have produced something much more satisfying and completely wrong.

Our first run compared plain annual averages of whatever days had reported. It said Delhi's air got *worse* over the period, by 4.7 µg/m³ a year, and it said so with apparent confidence. That was an artefact. The station record has holes, and the holes are not spread evenly through the year. 2021 is missing April to August — its cleaner months — so its average was computed almost entirely from its dirty ones and came out at 137.6. 2022 is missing November and December, its two worst months, so its average came out at 55.2. Line those two up and you have invented a trend out of a filing gap.

Everything reported here is therefore restricted to the months present in *every* year, which turns out to be September and October. It is a narrower claim than we set out to make. It is a claim the data supports.

There was a second trap underneath the first. OpenAQ's records for these stations advertise coverage from 2016 to 2026, which reads like a decade of continuous monitoring. It is not: it is the union of separate sensors with a gap of roughly two and a half years in the middle, and at one station the "decade" turns out to be two sensors seven years apart. Taken at face value it would have given us a series with a hole in it and no error message anywhere.

## How we know the model is not just making things up

A model that produces a satisfying answer is not the same as a model that works, so we tested it the way you test for self-deception: by giving it a problem that has no answer.

We took the PM2.5 readings and shuffled them against their dates at random, then asked the same model to learn from the nonsense. If it still scored well, something in our pipeline was leaking — the model would be finding structure that was not there, and every number above would be worthless.

On the real data it explains about 75% of the variation in held-out days. On the shuffled data it scores **below zero** — worse than guessing the average. That is what a clean pipeline looks like.

Two other checks. Weather alone, with no time information at all, predicts daily PM2.5 at about 0.70, which confirms the premise of this entire exercise rather than assuming it: in Delhi, most of what a monitor reads on a given day is meteorology. And the adjustment removes 72% of the day-to-day variance, which is the weather being taken out.

All of these figures ship inside the data file itself, at [`/data/deweathered.json`](https://www.janvayu.in/data/deweathered.json), along with the coverage gaps, the station list and the caveats. Our build refuses to publish the file at all if the shuffled-data score ever rises above 0.05.

## What this does not say

It is Delhi-NCR only. Ten stations, one airshed, one window. Nothing here transfers to Kanpur or Patna or Bengaluru, and we are not going to imply that it does.

The 2020 lockdowns sit inside the period. Normalisation removes weather; it does not remove lockdowns. The 2020 dip is a real change in emissions and it stays in the adjusted series, where it belongs.

And "no direction called" means exactly that. It is not a coded way of saying things got worse. It is a statement that this evidence, honestly handled, does not settle the question.

You can see all of it in the [Your Airshed, or Your Town?](https://www.janvayu.in/#airshed) panel, which now asks a third question alongside the first two. Your air is mostly your region rather than your town. And the year-to-year change in it may be mostly the wind.

---

**Sources.** PM2.5 from CPCB, DPCC and IMD monitoring stations via [OpenAQ](https://openaq.org/), 7,346 station-days. Meteorology from [NOAA's Integrated Surface Database](https://www.ncei.noaa.gov/products/land-based-station/integrated-surface-database), Delhi Safdarjung and Palam. Method after Grange et al. (2018), *Atmospheric Chemistry and Physics* 18, 6223–6239. Full working in `scripts/build-deweathered.py`.
