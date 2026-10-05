# Live vs Annual: The Honest Version of "How Polluted Is Your Ward?"

**Published:** 11 June 2026 | **Author:** Team JanVayu | **Reading time:** 4 min

---

When we built the [Ward Atlas](/index.html#ward-map), a map that colours every municipal ward of a city by its air, heat, green cover and built-up area, we ran into a question that is easy to get wrong. Plenty of dashboards do get it wrong. This post explains how we answered it.

## The temptation

The Ward Atlas has four layers. Three of them (heat, green cover, built-up area) come from satellites and are **annual or structural**: they describe what a ward is, and they barely change from month to month. The fourth, air quality (PM2.5), is a **live snapshot**, interpolated from the city's working government monitors at the moment you load the page.

The tempting story writes itself: *"This ward is 88% concrete and only 10% green, which is why its air is bad today."* It sounds rigorous, and it sometimes fits.

It still mixes two different things, and a JanVayu reader caught us doing it.

## Why it is wrong

A single hour's interpolated PM2.5 depends on **today's weather, which monitors happen to be running, and any nearby source** such as a fire, a construction site or traffic. It does not read out a ward's permanent structure. We checked: on one clean-air afternoon, Delhi's "worst-air" ward came out as a **leafy rural fringe** (76% green), not a concrete core. Had we hard-wired the "built-up means dirty" story, the chatbot would have told you something the data contradicted that hour.

Annual structure goes with **annual** air. It does not reliably go with *this* hour. The fair partner for "88% built-up" would be a ward's *yearly average* PM2.5, which needs satellite-derived pollution data. We looked for it and could not get it from any open, usable source. So we do not have it, and we will not fake it.

*Update, 6 August 2026: we later built an annual per-ward PM2.5 layer from SatPM2.5 V6GL03, so the live-versus-annual comparison can now be made on matching clocks.*

## What we did instead

Both the map and [Ask JanVayu](/ask) now keep the two clocks apart.

Air is the headline, and it is labelled as a live estimate: the citywide *spread* across wards, sharper where there are more monitors, and never a calibrated number for a single street. Heat, green cover and built-up area are described as what makes a ward's *typical* air, the kind of place that *tends* to run hotter and dirtier over the year, and never as the cause of the current reading. The chatbot is told that if today's dirtiest-air ward is green and lightly built, it should say so and put the reading down to weather or a nearby source rather than invent a story.

One cross-ward comparison is legitimate, and we kept it. Comparing the *spatial pattern* of heat against built-up area *across wards on the same day* is standard urban-heat-island analysis. In Delhi it was strong in the scene used at publication (Pearson correlation about 0.69 across the 290 wards). With the April 2026 Landsat scene now in the repository it is 0.29 (JanVayu analysis of `data/wards/delhi.json`). Comparing a live snapshot to annual form is a different matter, and the difference is the point.

## An experiment that did not make it

We also tried replacing each city's single-day heat layer with a **median of several summer scenes**, hoping to cut noise. It did not improve the one city (Bengaluru) whose heat and built-up link was weak, and it *lost* coverage, because cloud gaps across every scene left some wards blank. We dropped it and kept the single-scene version.

## Why this matters

JanVayu exists to push back on false precision in air-quality data: the broken monitor behind a clean-air award, the single station standing in for a whole city. It would be hypocritical to dress up a live snapshot as a verdict on your neighbourhood's structure. The map can tell you two true things at once, what your ward breathes right now and what kind of place it tends to be. It should not claim that the second explains the first.

Explore it: [**How Polluted Is Your Ward?**](/index.html#ward-map), or ask the chatbot "which ward in my city has the worst air right now, and why?"

---

*Air quality: CPCB / WAQI monitors, interpolated (live). Heat: USGS/NASA Landsat surface temperature. Green cover & built-up: ESA WorldCover 2021. Ward boundaries: DataMeet and the Mumbai spatial-data project. Methodology and limits are described on each layer of the panel itself.*
