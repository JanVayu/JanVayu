# We Fact-Checked Our Own Site — and Changed 33 Numbers

**Published:** 17 July 2026 | **Author:** Team JanVayu | **Reading time:** 4 min

---

![Delhi's skyline dissolves into smog at sunset](/gallery/g01.jpg)

<small>*Delhi's skyline dissolves into smog at sunset. Photo: Ville Miettinen, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0), via Wikimedia Commons.*</small>

JanVayu exists to hold others accountable with numbers. So the numbers had better be right. This month we turned that scrutiny on ourselves — and it was uncomfortable in exactly the way it should be.

## What we did

We ran a **site-wide fact-check**: a fleet of agents extracted every checkable statistic and every hard-coded scientific constant from the homepage, the data-heavy panels, the calculator code, and the blog, then **web-verified each one against current primary sources** — the Lancet Countdown, IQAir's World Air Quality Report, the Air Quality Life Index, State of Global Air, WHO, CPCB, CREA and NASA. Each figure came back tagged: *current*, *stale*, *wrong*, *unsourced*, or *unverifiable*.

The tally: **around 80 figures checked, 47 confirmed current, and 33 that needed fixing.**

## The one that stung

Our own homepage claimed India carries **"~70% of the global PM2.5 mortality burden."** That's false. India's toll is the world's largest of any single country, but it's roughly **a quarter** of the global total — not a majority.

Worse, it was *hiding*. The corrected wording sat in the HTML, but a small data file injected the old "70%" over it at runtime — so the site looked fixed while still serving the wrong number. We fixed the data file, and we taught our weekly checker to read data files too, not just the visible page. Honesty has to survive the plumbing.

## A sample of what else changed

- **Ghaziabad's NCAP spending** was labelled "26% — below threshold." CREA's 2026 report says the city spent **over 80%** — a leader, not a laggard. We were mislabelling a good performer.
- **Dementia risk** was stated as "40% higher." The supported figure is about **17% per 10 µg/m³** of PM2.5 (Lancet Planetary Health, 2025).
- **Life expectancy loss** appeared as both 3.5 and 5.3 years in different places; we unified it to **3.5 years** (AQLI 2025).
- **India's ranking** moved to **6th most polluted, 48.9 µg/m³** (IQAir 2025), from an older 5th / 50.6.
- A "49% of households cook with biomass, **Census 2021**" line cited a census that **doesn't exist yet** — India's is postponed to 2026–27. Corrected to ~40% (NSO HCES 2023–24).
- Several per-city NCAP spending rows traced to **no credible source**. Rather than invent numbers, we **removed them**.

## The rules we followed

Three principles kept us honest:

1. **Change to the newest figure we can actually source** — with the citation, in-line.
2. **Never collapse two honest methods into one.** India's air-pollution death toll is ~1.72 million from ambient PM2.5 (Lancet Countdown 2025) *and* ~2.1 million counting household air pollution (State of Global Air 2024). Both are true; we show both, each labelled with its scope and year.
3. **Never invent.** If a number can't be verified, it gets flagged — not guessed.

## From now on, every week

A one-off audit ages. So this now runs **automatically, every Monday**: the same verification sweep, applied to the live site, opening a pull request for a human to review before anything changes. The full findings from this first pass are public in the repository ([`fact-check-2026-07.md`](https://github.com/JanVayu/JanVayu/blob/main/docs/fact-check-2026-07.md)), and every corrected number on the site now names its source.

Clean air is a right, and the case for it is strong enough that it never needs an exaggerated number. If you spot a figure that looks off, [tell us](mailto:contribute@janvayu.in) — being corrected in public is the whole point.
