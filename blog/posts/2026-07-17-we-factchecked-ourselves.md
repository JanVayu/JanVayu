# We fact-checked our own site and changed 33 numbers

**Published:** 17 July 2026 | **Author:** Team JanVayu | **Reading time:** 4 min

---

![Delhi's skyline dissolves into smog at sunset](/gallery/g01.jpg)

<small>*Delhi's skyline dissolves into smog at sunset. Photo: Ville Miettinen, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0), via Wikimedia Commons.*</small>

JanVayu exists to hold others accountable with numbers, so our own numbers have to be right. This month we turned that scrutiny on ourselves. It was uncomfortable, as it should be.

## What we did

We ran a **site-wide fact-check**. Automated agents pulled out every checkable statistic and every fixed scientific constant from the homepage, the data-heavy panels, the calculator code and the blog. They then **checked each one on the web against current primary sources**: the Lancet Countdown, IQAir's World Air Quality Report, the Air Quality Life Index, State of Global Air, WHO, CPCB, CREA and NASA. Each figure came back marked *current*, *stale*, *wrong*, *unsourced* or *unverifiable*.

The tally: **around 80 figures checked, 47 confirmed current, and 33 that needed fixing.**

## The one that stung

Our own homepage claimed India carries **"~70% of the global PM2.5 mortality burden."** That is false. India's toll is one of the world's two largest national tolls (State of Global Air 2024: India 2.1 million deaths, China 2.3 million, in 2021), but it is roughly **a quarter** of the global total, not a majority.

The error was also hidden. The corrected wording was in the page, but a small data file put the old "70%" back over it each time the page loaded, so the site looked fixed while still showing the wrong number. We fixed the data file, and we taught our weekly checker to read data files as well as the visible page.

## A sample of what else changed

- Ghaziabad's NCAP spending was labelled "26%, below threshold." A written reply by the Ministry of Environment in the Lok Sabha (February 2026, as reported by [The Indian Express](https://indianexpress.com/article/cities/delhi/delhi-ncap-funds-fight-air-pollution-since-2019-lags-far-behind-ncr-cities-10512700/), a press report) says the city spent **over 80%**. It was a leader, and we had labelled it a laggard.
- Dementia risk was stated as "40% higher." The supported figure is about **17% per 10 µg/m³** of PM2.5 (Lancet Planetary Health, 2025).
- Life expectancy loss appeared as both 3.5 and 5.3 years in different places. We settled on **3.5 years** (AQLI 2025).
- India's ranking moved to **6th most polluted, 48.9 µg/m³** (IQAir 2025), from an older 5th / 50.6.
- A "49% of households cook with biomass, **Census 2021**" line cited a census that **does not exist yet**, because India's is postponed to 2026–27. It now reads about 41% of households using solid fuel for cooking (NFHS-5, 2019–21, Table 2.6).
- Several per-city NCAP spending rows traced to **no credible source**. We **removed them** rather than invent numbers.

## The rules we followed

1. Use the newest figure we can actually source, with the citation beside it.
2. Keep two honest methods separate. India's air-pollution death toll is ~1.72 million from ambient PM2.5 (Lancet Countdown 2025) and ~2.1 million when household air pollution is counted (State of Global Air 2024). Both are true. We show both, each with its scope and year.
3. Never invent. A number that cannot be verified is flagged, not guessed.

## Every week from now on

A one-off audit goes stale, so the same check now runs **automatically every Monday** on the live site. It proposes its changes for a person to review before anything is altered. The full findings from this first pass are public in the repository ([`fact-check-2026-07.md`](https://github.com/JanVayu/JanVayu/blob/main/docs/fact-check-2026-07.md)), and every number we corrected carries its source.

*Update, 2 October 2026: the scheduled routines stopped after 8 September 2026 because credits ran out; the 2 October 2026 round was run by hand.*

Clean air is a right, and the case for it is strong enough to need no exaggerated number. If you spot a figure that looks off, [tell us](mailto:contribute@janvayu.in). Being corrected in public is the point.
