# What Shipped This Week: Forecasts, Fire Maps, and Pollution Beyond the Lungs

**Published:** 14 July 2026 | **Author:** Team JanVayu | **Reading time:** 4 min

---

Five updates went live over the past few days. Here is what changed and why it helps.

## A 5-day forecast

The [Forecast panel](https://www.janvayu.in/#forecast) already tracked how accurate India's official forecasters (SAFAR, CPCB) are. It now also shows its own 5-day PM2.5 forecast, from the free Open-Meteo (CAMS) model: daily mean and peak, a colour-coded day-by-day strip, and a chart, for any of 33 cities.

*Update, 2 October 2026: since 15 July 2026 the forecast selector covers 117 cities.*

The use is comparison. When the official day-3 number looks low, you can check it against an independent model on the same screen. [Ask JanVayu](https://www.janvayu.in/ask) can now answer "will it be bad tomorrow?" from the same forecast.

## A live map of farm fires

Each autumn, stubble burning in Punjab and Haryana sends smoke into Delhi-NCR. The new [Farm Fire Tracker](https://www.janvayu.in/#fire-tracker) plots those fires from NASA's satellites (VIIRS on NOAA-20). You can show the stubble belt or all of India, over the last 24 hours, 3 days or 7 days.

At the moment, in the monsoon, the map is nearly empty because the fires have not started. Stubble burning peaks from mid-October to late November, and the panel says so. For most of the year, traffic, dust, industry and secondary particles matter more, and the panel says that too. A fire map that looked alarming all year would mislead people about when fires actually drive the smog.

## Real local data

The "My Neighbourhood" panel used to come up empty, because its community-sensor source had almost no Indian coverage. We switched it to OpenAQ, which carries CPCB's own monitoring stations as well as community sensors. It now returns real Delhi stations (R K Puram, Anand Vihar, Chandni Chowk) with current readings.

One problem needed handling. OpenAQ returns a station's last reading even when that station stopped reporting years ago. We drop anything older than six hours. On a live Delhi query that kept 16 current stations and discarded a dozen dead ones still showing 2018 values. Presenting an old number as live is what this platform should never do.

## Health beyond the lungs

Two new sections widen what we cover.

[Beyond the Lungs](https://www.janvayu.in/#beyond-lungs) collects the evidence that PM2.5 harms more than the lungs. It opens with a 2026 study of 12,271 adults in Chennai and Delhi linking annual PM2.5 to lower kidney function. It also covers the cardiovascular toll (the largest share of pollution deaths), effects on the brain (cognition, dementia, children's learning), and pregnancy (preterm birth, low birth weight). Alerts that mention only breathing understate the risk.

[Occupational Exposure](https://www.janvayu.in/#occupational) looks at who breathes the worst air by job: street vendors, traffic police, delivery riders, construction and waste workers. It draws on a 2026 study of 298 Chennai street vendors who had measurably weaker lung function. The city AQI is the same for everyone, but the dose is not, and informal workers (about 90% of India's workforce) have little protection.

## Two practical tools

The Indoor Air panel now has a guide to buying a low-cost sensor. Choose one with a real optical PM sensor, correct for humidity, and use it to track changes rather than trust exact numbers. The guide draws on a 2026 IIT (ISM) Dhanbad study of low-cost indoor particle sensors (Ali, Sameer and Izhar, Scientific Reports, July 2026).

The City Scorecards now have a "File an RTI" button. If a city has missed its clean-air target, the button opens a pre-filled Right to Information request to its state pollution board.

## For developers and researchers

There is now an [Open Data API](https://www.janvayu.in/api) at `/api`: a documented, openly accessible list of the datasets we publish (rankings, CPCB stations, NCAP cities, year-over-year PM2.5, hyperlocal sensors, uptime), plus a CSV export of the rankings. It is free to use with attribution. We also moved the seven health calculators into one tested set of code, so a stray edit cannot quietly change a mortality or life-expectancy number.

## Five new papers

The Reading List went from 24 to 29 studies, all India-focused and from early July 2026: machine-learning PM2.5 forecasting for Hisar, a BiLSTM forecaster, the low-cost indoor-sensor study, the PM2.5 and kidney cohort, and the street-vendor study. Several fed directly into the features above.
