# Data Refresh, May 2026: Latest Numbers, Updated Hero, and What We're Reading

**Published:** 6 May 2026 | **Author:** Team JanVayu | **Reading time:** 4 min

---

We aim to keep a reliable public record of India's air quality, and that means keeping the numbers on the front page current. The IQAir 2025 release reset many of our headline figures six weeks ago. This post lists what we have refreshed, what the top of the dashboard now says, and the studies we are watching for the next round of data.

## What the dashboard now says

The alert at the top of the dashboard has been updated for May 2026. It shows four figures:

- Most polluted city: Loni, India, at 112.5 µg/m³ annual PM2.5 (IQAir 2025 World Air Quality Report, covering calendar 2025).
- Global compliance: only 14% of cities met the WHO guideline of 5 µg/m³ in 2025, down from 17% in 2024 (IQAir).
- India's average PM2.5: 48.9 µg/m³, about 10 times the WHO guideline.
- Mortality: 1.72 million deaths attributable to anthropogenic ambient PM2.5 in 2022 (Lancet Countdown 2025). This does not revise the 1.5 million figure from Jaganathan et al. 2024, which comes from a separate study.

These figures were already in the project's Key Statistics table, and the dashboard now matches it.

## Two mortality numbers, and why we keep both

People ask why the resource library cites 1.5 million deaths in one place and 1.72 million in another. They come from two different studies.

The 1.5 million figure is from Jaganathan et al. 2024 in *Lancet Planetary Health*, India's first nationwide causal estimate. It compares 655 districts over 2009 to 2019 using a difference-in-differences design, and finds that every 10 µg/m³ rise in long-term PM2.5 raises all-cause mortality by about 8.6%. Applying that coefficient to India's population against a WHO-guideline (5 µg/m³) scenario gives roughly 1.5 million deaths.

The 1.72 million figure is from the *Lancet Countdown 2025*. It counts deaths attributable to anthropogenic ambient PM2.5 in 2022, and the method is described in the Lancet Countdown 2025 indicator documentation.

Both are sound, and we cite them separately in the Health Studies section of the [Research Library](https://www.janvayu.in/#resources). The headline number on the dashboard is now the Lancet Countdown figure of 1.72 million.

## Life expectancy: 3.5 years lost on average

[AQLI 2025](https://aqli.epic.uchicago.edu/) is now our main source for this number. The national average is 3.5 years (2023 data), down from 3.6 in AQLI 2024. The Northern Plains lose 5.0 years (5.4 in 2024) and Delhi alone 8.2 years.

## What we still lack

We would like a second Indian dose-response estimate from after 2024. Jaganathan et al. 2024 gave India's first nationwide causal estimate from Indian data: about 8.6% higher all-cause mortality per 10 µg/m³, across 655 districts. That is the figure we cite, and the one the new Jeopardy clue uses. It is still one paper with one design. A second estimate, ideally from a different research group using a different method or cohort, would let us rely on the dose-response with more confidence. We are following pre-prints. If you spot one that fits, [drop us a line](mailto:contribute@janvayu.in).

We also lack a clean rural exposure dataset. Most CPCB CAAQMS stations are in cities, so rural PM2.5 in the Indo-Gangetic Plain is inferred from satellite retrievals that have had less checking against ground readings. The new Sensor.Community data is helping to fill the gap, but coverage differs a lot from state to state.

## Other changes this week

- The "top 10 most polluted Indian cities" tables on the pollutant pages (`/pm25`, `/pm10`, `/co`, `/no2`, `/so2`, `/o3`) were changed. *Update, 2 October 2026: for five of the six pages the tables were randomly generated, not refreshed from WAQI. See [the 2 October post](/blog/#/posts/2026-10-02-five-pollutant-pages-random-numbers).* The "WHO standard" lines use the 2021 guideline values.
- Three new Indian cohort references were added to the [Zotero library](https://www.zotero.org/groups/6508140/janvayu/library) under the "India dose-response" tag.
- A small note at the top now points first-time visitors to the new [Learning Games panel](https://www.janvayu.in/#games), which went live on 8 May.

## What we are reading

These informed the numbers above and may interest you:

- The full *Lancet Countdown 2025* report, India chapter, which is the source of the 1.72 million figure.
- The *IQAir 2025 World Air Quality Report* (covering 2025), the source of every city ranking we cite.
- CEEW's source apportionment work (exact title and link to be added), one of the syntheses we use for where Indian PM2.5 comes from. The new Source Matcher game draws heavily on it.
- Jaganathan et al. 2024 in *Lancet Planetary Health*, an estimate of the all-cause mortality dose-response from national district-level death registration data.

If you find anything we have got wrong, file a [GitHub issue](https://github.com/JanVayu/JanVayu/issues) or write to [contribute@janvayu.in](mailto:contribute@janvayu.in). The archive is meant to be corrected in public.

---

**Next post:** the methodology behind the Source Matcher game, including why we picked seven categories and how the CEEW 2024 review fits with the IIT-Delhi DSS apportionment.
