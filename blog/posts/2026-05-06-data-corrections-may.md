# Data Refresh, May 2026: Latest Numbers, Updated Hero, and What We're Reading

**Published:** 6 May 2026 | **Author:** Team JanVayu | **Reading time:** 4 min

---

We try to publish the source-of-truth dataset for India's air quality crisis. That only works if we keep the front-of-site numbers current. Six weeks after the IQAir 2025 release reset many of our headline figures, here is what we have just refreshed, what now ships on the hero panel, and the studies we are watching for the next data cycle.

## What's now on the hero

The dashboard hero alert has been updated for May 2026. The headline numbers it shows:

- **Most polluted city:** Loni, India — 112.5 µg/m³ annual PM2.5 (IQAir 2025 World Air Quality Report, covering calendar 2024).
- **Global air quality compliance:** only **14% of cities** meet the WHO 5 µg/m³ guideline. Up from 9% in IQAir 2024 — a real, measurable improvement, driven mostly by Chinese mid-tier cities continuing their long pollution decline.
- **India average PM2.5:** 48.9 µg/m³ — about 10× the WHO guideline.
- **Annual mortality:** **1.72 million** — the Lancet Countdown 2025 figure, lifted from 1.5M in earlier reports through re-attribution of household biomass deaths and a tighter exposure-response at the very high end of the PM2.5 distribution. India's share of the global burden held at ~70%.

These were already in the README's *Key Statistics* table. The dashboard hero now reads consistently with that table.

## Two distinct mortality numbers (and why we keep both)

We are sometimes asked why the resource library still cites "1.5M deaths" in one row and "1.72M deaths" in another. The answer is: they are two different studies.

- **1.5M** comes from Krishna et al. 2024 in *Lancet Planetary Health* — India's first **causal inference** dose-response study from domestic cohort data. It established that every 10 µg/m³ rise in long-term PM2.5 raises all-cause mortality by ~8.6%. The 1.5M figure is what that coefficient produced when applied to India's population in 2024.
- **1.72M** comes from the *Lancet Countdown 2025* — an annual synthesis estimate that combines newer exposure-response functions with updated demographic and exposure data. It is the figure currently used by most agencies for India's PM2.5 mortality burden.

Both are legitimate. We cite both, separately, in the Health Studies section of the [Research Library](https://www.janvayu.in/#resources). The headline number on the dashboard is now the Lancet Countdown 2025 figure of 1.72M.

## Life-expectancy loss: 3.5 years on average, 7-8 in the IGP

[AQLI 2025](https://aqli.epic.uchicago.edu/) is now our primary source for this number. The Indo-Gangetic Plain loss is unchanged from 2024 at 7-8 years. The national average ticked up from 3.4 to 3.5 because the rural baseline got marginally worse in north-Karnataka and central-MP basins.

## What we are still chasing

**A second post-2024 Indian dose-response coefficient.** Krishna et al. 2024 produced India's first causal estimate from Indian cohort data: ~8.6% all-cause mortality rise per 10 µg/m³. That is what we cite, and it is what the new PM Quick-Quiz uses. But it is one paper, with seven districts. A second cohort estimate — ideally from a different research group, with a different set of districts — would let us anchor the dose-response with more confidence. We are tracking pre-prints; if you spot one that fits, [drop us a line](mailto:contribute@janvayu.in).

**A clean rural exposure dataset.** Most CPCB CAAQMS sites are urban. Rural PM2.5 in the IGP is being inferred from satellite retrievals, which have a known bias around biomass-burn aerosols. The new Sensor.Community integration is helping fill the gap but is uneven by state.

## Other updates this week

- **Pollutant pages** (`/pm25`, `/pm10`, `/co`, `/no2`, `/so2`, `/o3`) had their "top 10 most polluted Indian cities" tables refreshed against rolling 30-day WAQI data. The "WHO standard" lines reflect the 2021 guideline values.
- **Three new Indian cohort references** added to the [Zotero library](https://www.zotero.org/groups/6508140/janvayu/library) under the "India dose-response" tag.
- **Hero CTA**: a small note added pointing first-time visitors at the new [Learning Games panel](https://www.janvayu.in/#games), shipped this week.

## What we are reading

Recent things that informed the numbers above and may interest you:

- **Lancet Countdown 2025** (full report, India chapter): the source of the 1.72M number.
- **IQAir 2025 World Air Quality Report** (covering 2024): the source of every city ranking we cite.
- **CEEW 2024 source apportionment review**: the most current synthesis of where Indian PM2.5 actually comes from. The new Source Matcher game pulls heavily from this.
- **Krishna et al. 2024 *Lancet Planetary Health***: India's first all-cause mortality dose-response from domestic cohorts.

If you find anything we have got wrong, file a [GitHub issue](https://github.com/JanVayu/JanVayu/issues) or write to [contribute@janvayu.in](mailto:contribute@janvayu.in). The whole point of this archive is that it is correctable in public.

---

**Next post:** the methodology behind the Source Matcher game — why we picked seven categories and how the CEEW 2024 review fits with the IIT-Delhi DSS apportionment.
