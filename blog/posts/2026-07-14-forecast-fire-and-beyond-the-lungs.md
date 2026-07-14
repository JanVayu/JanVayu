# What Shipped This Week: Forecasts, Fire Maps, and Pollution Beyond the Lungs

**Published:** 14 July 2026 | **Author:** Team JanVayu | **Reading time:** 5 min

---

The last few days brought one of the biggest feature drops in JanVayu's history — five releases (v26.6.43 through v26.6.47), all live now. None of it changes what JanVayu is: a non-partisan, evidence-first public record of India's air. All of it tries to make that record more useful, more honest, and reach further into the body and the calendar of the crisis. Here's what's new.

## You can now see the next five days

The [Forecast panel](https://www.janvayu.in/#forecast) used to do one thing: hold India's official forecasters (SAFAR, CPCB) accountable by tracking how often their predictions were right. It still does that. But it now *also* leads with a **live 5-day PM2.5 forecast** of its own, drawn from the free, key-less Open-Meteo (CAMS) global model — daily mean and peak, a colour-coded day-by-day strip, and a trend chart, for any of 33 cities.

Why a second forecast? So you can cross-check. When the official day-3 number looks optimistic, you now have an independent model sitting right beside it. And [Ask JanVayu](https://www.janvayu.in/ask) can answer the question people actually ask — *"will it be bad tomorrow?"* — with that same cited outlook instead of a guess.

## Watching the fires from space

Every autumn, paddy-stubble burning across Punjab and Haryana pours smoke into the Delhi-NCR airshed. The new [Farm Fire Tracker](https://www.janvayu.in/#fire-tracker) maps those fires **live, as NASA's satellites detect them** (VIIRS on NOAA-20), with a region toggle for the stubble belt or all of India and a 24-hour / 3-day / 7-day window.

We built it with the season in mind — and we say so on the panel. In monsoon July the map is nearly empty, because the fires genuinely aren't burning yet. It comes alive from mid-October to late November. That honesty matters: a tool that showed a scary-looking heat map year-round would be lying about *when* stubble is and isn't the story. For most of the year, local traffic, dust, industry and secondary particles dominate — and the panel says that too.

## Hyperlocal air, for real this time

The "My Neighbourhood" panel had a long-standing problem: its community-sensor source had essentially no Indian coverage, so it came up empty. We switched the primary source to **OpenAQ v3**, which aggregates CPCB's own monitoring stations plus community networks — and it's now live, returning real stations (R K Puram, Anand Vihar, Chandni Chowk…) with current readings.

One subtlety we're proud of: OpenAQ hands back a station's *last* value even if that station died years ago. So we added a freshness guard — any reading older than six hours is dropped. On a live Delhi query that meant keeping 17 fresh stations and quietly discarding a dozen zombie ones reporting 2018 numbers. Showing a years-old reading as "live" would break the one promise this project can't break.

## Air pollution is not just a lung problem

Two new sections widen the health lens:

- **[Beyond the Lungs](https://www.janvayu.in/#beyond-lungs)** collects the growing evidence that PM2.5 is a whole-body toxin. The anchor is a 2026 cohort of 12,271 adults in Chennai and Delhi linking annual PM2.5 to measurable decline in **kidney function** — on top of the established cardiovascular toll (the largest share of pollution deaths), the brain (cognition, dementia, children's learning), and pregnancy (preterm birth, low birth weight). Health alerts that mention only breathing understate the stakes.
- **[Occupational Exposure](https://www.janvayu.in/#occupational)** documents who breathes the worst air *by job* — street vendors, traffic police, gig-delivery riders, construction and waste workers — anchored on a 2026 study of 298 Chennai street vendors with measurably reduced lung function. Same city AQI, vastly different doses, and almost no protective infrastructure for the informal workforce that is ~90% of India's workers.

## Small tools that do real work

- A **low-cost sensor buying guide** now sits in the Indoor Air panel: insist on a real optical PM sensor, correct for humidity, use it for trends not verdicts — grounded in a 2026 IIT (ISM) Dhanbad benchmark.
- The **City Scorecards** grew a **one-click "File an RTI"** button: a city missing its clean-air target becomes a ready-to-file Right to Information request to its state pollution board, pre-filled and waiting.

## For researchers and builders

- There's now a proper **[Open Data API](https://www.janvayu.in/api)** at a clean `/api` path — a documented, CORS-open manifest of every dataset JanVayu publishes (rankings, CPCB stations, NCAP cities, year-over-year PM2.5, hyperlocal sensors, uptime), plus CSV export of the rankings. Free to use with attribution. An archive you can't query isn't much of an archive.
- Under the hood, the seven health calculators that produce numbers people act on now live in a single tested module with a unit-test suite — so a stray edit can't silently change a mortality or life-expectancy figure.

## And five new papers

The Reading List grew from 24 to 29 peer-reviewed studies, all India-focused and all from early July 2026: machine-learning PM2.5 forecasting for tier-2 Hisar, a BiLSTM forecaster, the low-cost indoor-sensor benchmark, the PM2.5–kidney cohort, and the street-vendor respiratory study. Several of them directly seeded the features above.

---

The thread through all of it is the same one that runs through the whole platform: show what the data actually says, be honest about what it doesn't, and put it where people — and the people who work outdoors in it — can use it. More soon.
