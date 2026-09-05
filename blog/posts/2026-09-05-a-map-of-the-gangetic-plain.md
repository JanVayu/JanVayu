# The Dataset That Looked Like Our Best Predictor, and Was a Map of the Gangetic Plain

**Published:** 5 September 2026 | **Author:** Team JanVayu | **Reading time:** 9 min

---

Someone sent us a link and asked a reasonable question: could we use this on JanVayu?

The link was the [Biodiversity Intactness](https://source.coop/vizzuality/biodiversity-intactness-100m-v1-1) dataset from Impact Observatory and Vizzuality. Annual global maps, 100 metre pixels, 2017 to 2025, openly licensed. It scores every patch of land from 0 to 1 on how intact its ecological community still is, built by fitting the Natural History Museum's PREDICTS database of 32,000 field sites against satellite measures of human pressure.

We said no. Then we measured it, and had to say that our reason for saying no was wrong. Then we measured it properly, and said no again, for a better reason.

The whole sequence took an afternoon and it is worth writing down, because the middle step is the one that would have put a bad layer on this site.

---

## Why we expected nothing

JanVayu has been here before. In June we shipped green cover on every ward, from ESA WorldCover, and let readers put it next to surface heat. Trees cool cities; this was going to show it.

It showed almost nothing. Across 67,732 wards the correlation between green cover and surface heat was **−0.069**. Effectively a flat line.

The layer was not broken. Green cover was the wrong variable. WorldCover counts cropland as vegetation, so the median Indian gram panchayat is 97% green while its typical village has single-digit tree canopy. We [replaced it with tree cover](/blog/#/posts/2026-08-08-tree-cover-answers-it), which reads **−0.429** nationally and −0.412 within the median city, and the heat-island relationship was there all along under a bad proxy.

So when a biodiversity raster arrived, the prior wrote itself. Ecological intactness is not a measure of air. The mechanism connecting species abundance to fine particulate matter is long and indirect, and we had just spent a month learning that a plausible-looking land layer can measure nothing at all.

We wrote that down as the answer. Then we ran the numbers, because writing it down is not the same as knowing it.

---

## The prior was wrong

We took the zonal mean of the 2025 biodiversity grid inside all 785 Indian district boundaries and set it against each district's 2024 annual PM2.5 from the satellite layer the map already uses. For comparison we did the same with [Human Footprint](https://source.coop/vizzuality/hfp-100), a second raster from the same publisher that scores land 0 to 50 on population density, built environment, croplands, roads, railways, electrical infrastructure and navigable waterways.

Alongside them, the two land variables JanVayu already ships.

| Variable | Correlation with district annual PM2.5 |
|---|---:|
| Built-up cover | +0.411 |
| Tree cover | −0.321 |
| **Biodiversity Intactness** | **−0.608** |
| **Human Footprint** | **+0.620** |

Not a flat line. Not remotely. On this table either raster is the strongest district-level predictor of annual PM2.5 we have ever put on a chart, comfortably beating both layers currently on the site. Biodiversity intactness alone explains 37% of the variance in district PM2.5; human footprint 38%.

If we had stopped here, we would have shipped it. It is exactly the shape of a result that gets shipped: a clean number, a plausible story about degraded land and dirty air, and a colour ramp that would have looked persuasive over northern India.

One thing did stand out. The two rasters correlate with **each other** at −0.876. They are not two findings. They are one variable measured twice, which meant at most one could ever go on the map, and it raised the obvious question of what that variable actually is.

---

## The control that ended it

Indian air has a geography, and it is not subtle. The Indo-Gangetic Plain is a 2,500-kilometre trough closed by the Himalaya to the north, and in winter it traps everything emitted into it. A district in Bihar and a district in Karnataka are not two towns that made different choices. They are two airsheds.

Human pressure has a geography too, and it is much the same one. The plain is where the people are.

So we asked how much of the raw correlation survives once you compare districts **within the same state** rather than across the country. That is what state fixed effects do: they absorb everything constant within a state, meteorology and airshed included, and ask what the variable explains after that.

| Model | R² | Gain |
|---|---:|---:|
| Built-up + tree cover | 0.260 | |
| Built-up + tree + Biodiversity Intactness | 0.302 | +0.042 |
| Built-up + tree + Human Footprint | 0.312 | +0.052 |
| Built-up + tree + **state fixed effects** | **0.900** | |
| ...+ Biodiversity Intactness | 0.907 | **+0.007** |
| ...+ Human Footprint | 0.907 | **+0.008** |

Built-up cover, tree cover and which state you are in explain **90%** of the variation in district annual PM2.5 across India. Add either global raster to that and you gain less than one percentage point.

The −0.61 is real. It is also, for our purposes, a map of where the Gangetic Plain is. The raster is dark where the plain is and the air is bad where the plain is, and a correlation coefficient cannot tell those two facts apart on its own.

Neither dataset goes on the map. Not because it failed, but because it passed for the wrong reason, which is harder to notice and worse to publish.

---

## The join that nearly published the wrong table

The first version of that regression was completely wrong, and the way it was wrong is worth more than the result.

Two files in this repository describe districts. One carries the air value, one carries the land cover. Both key districts by a numeric code. The codes are different systems.

Joining on them matched **518 of 520 districts to the wrong place**. Ahmadabad took Dhule's land cover. Anand took Mumbai's. Jamnagar took Hingoli's. And the regression ran perfectly: it produced a full table, sensible coefficients, plausible R² values, and not one error message. We had a complete analysis of noise.

What caught it was not inspection. It was that the two air figures disagreed. Each district has two independently derived annual PM2.5 estimates in this repo, one sampled at the district centroid and one averaged over all its villages. They should be nearly identical. Under the bad join they correlated at +0.56, which is a number that looks unremarkable until you ask what it ought to be.

Rejoined by name and state, they correlate at **+0.9985**.

The script now asserts that before it will report anything. If those two figures do not agree above 0.99, it exits and refuses to print a table. That assertion is the only reason the wrong numbers were thrown away instead of published, and it is now the first thing the script does.

This is the third time this year a silent join or fallback has produced confident, wrong, complete-looking output here: villages nearly shipped labelled with their state, wards came back empty where three sources overlapped, and now this. The pattern is always the same. Nothing errors. The output is the right shape. Only a number that should have been something else gives it away.

---

## What we built instead

The negative result had a positive finding inside it that we had not been looking for.

**89.2% of the variance in district annual PM2.5 in India lies between states rather than within them.** That is what makes the rasters redundant, and on its own it is the most policy-relevant number in the whole exercise.

The National Clean Air Programme sets reduction targets city by city. If most of a city's annual burden arrives from an airshed spanning several states, then a city acting alone can only reach the smaller remainder, however well it is run. That argument is usually made in the abstract. It can be made from India's own district figures.

So rather than leave it in a script, it is now a panel: **[Your airshed, or your town?](/#airshed)**

Pick a district and it tells you, in one sentence, how much of the distance between your air and the national median is the region you live in and how much is your own district.

- **New Delhi**: Delhi as a whole sits 53.7 µg/m³ above the national median. New Delhi is a further 1.5 *below* its own state, putting it 52.2 above the country.
- **Ludhiana**: Punjab sits 16.8 above. Ludhiana adds 3.0 on top of that.

The state medians run from **Delhi at 92.7 µg/m³** down to **Ladakh at 13.9**. India's own annual limit is 40. Thirteen states and union territories have a median district above it.

The panel is explicit about what it will not say. A district below its state median is **not** thereby well governed, and one above is not thereby badly run. The figure names no cause. Local deviation can be terrain, a river valley, an industrial cluster, or simply how a one-kilometre satellite grid falls across an oddly shaped district. We say so on the panel, because the temptation to read it as a league table is obvious and the data does not support one.

---

## What we would use, if we used anything

For completeness, since the question was asked in good faith and deserves a straight answer.

Of the two rasters, **Human Footprint is the better one**. It beats biodiversity intactness on every measure we tried, its inputs are closer to the things that actually burn, and it is easier to explain to a reader. Adding biodiversity intactness on top of it is worth +0.001 R².

But neither earns a place here. Both are, at 100 metres and annual cadence, largely a recombination of land cover, and JanVayu already carries built-up, tree and green cover from WorldCover at **10 metres**, ten times finer, on all six boundary levels. A coarser modelled index of variables we already hold at better resolution is not an addition.

The honest summary is that the dataset is good and the question was a fair one, and the answer is still no. Not every dataset that correlates with your outcome is telling you something about your outcome. Sometimes it is telling you where the mountains are.

---

*The full analysis is reproducible: [`scripts/analyse-land-pressure-vs-air.py`](https://github.com/JanVayu/JanVayu/blob/main/scripts/analyse-land-pressure-vs-air.py) reads both rasters directly over HTTP, and [`data/land-pressure-vs-air.json`](https://github.com/JanVayu/JanVayu/blob/main/data/land-pressure-vs-air.json) carries every district figure. Biodiversity Intactness and Human Footprint are both CC BY 4.0 from Impact Observatory and Vizzuality via [Source Cooperative](https://source.coop). Air data is SatPM2.5 V6GL03 (ACAG, Washington University), 2024 annual mean.*
