# Live vs Annual: The Honest Version of "How Polluted Is Your Ward?"

**Published:** 11 June 2026 | **Author:** Team JanVayu | **Reading time:** 4 min

---

When we built the [Ward Atlas](/index.html#ward-map) — a map that colours every municipal ward of a city by its air, heat, green cover and built-up area — we ran into a question that's easy to get wrong, and that a lot of dashboards *do* get wrong. This post is about how we answered it, because the answer is more interesting than the map.

## The temptation

The Ward Atlas has four layers. Three of them — heat, green cover, built-up area — come from satellites and are **annual / structural**: they describe what a ward *is*, and they barely change from month to month. The fourth — air quality (PM2.5) — is a **live snapshot**, interpolated from the city's working government monitors at the moment you load the page.

The tempting story writes itself: *"This ward is 88% concrete and only 10% green, which is why its air is bad today."* It sounds rigorous. It even fits, sometimes.

But it's a category error — and a JanVayu reader caught us mixing exactly these two things.

## Why it's wrong

A single hour's interpolated PM2.5 is shaped by **today's weather, which monitors happen to be running, and any nearby source** — a fire, a construction site, traffic. It is *not* a clean read-out of a ward's permanent structure. We checked: on one clean-air afternoon, Delhi's "worst-air" ward came out as a **leafy rural fringe** (76% green), not a concrete core. If we'd hard-wired the "built-up = dirty" narrative, the bot would have confidently told you something the data flatly contradicted that hour.

Annual structure correlates with **annual** air. It does not, reliably, correlate with *this* hour. The honest partner for "88% built-up" would be a ward's *yearly average* PM2.5 — which needs satellite-derived pollution data we looked for and couldn't get from any open, usable source. So we don't have it, and we won't fake it.

## What we shipped instead

Both the map and [Ask JanVayu](/ask) now keep the two clocks separate:

- **Air is the headline, and it's labelled as a live estimate** — the citywide *spread* across wards, sharper where there are more monitors, never a calibrated per-street number.
- **Heat, green and built-up are framed as drivers of a ward's *typical* air** — "the kind of place that *tends* to run hotter and dirtier over the year" — never as the cause of the current reading.
- The chatbot is explicitly instructed: if today's dirtiest-air ward is actually green and low-built, **say so**, and attribute the reading to weather or a nearby source rather than inventing a story.

Where the cross-sectional comparison *is* legitimate, we kept it: comparing the *spatial pattern* of heat against built-up *across wards on the same day* is standard urban-heat-island analysis, and in Delhi it's strong (correlation ≈ 0.69). Comparing a live snapshot to annual form is not. The difference is the whole point.

## The experiment that didn't make it

We also tried replacing each city's single-day heat layer with a **median of several summer scenes**, hoping to cut noise. It didn't earn its place: it didn't improve the one city (Bengaluru) whose heat–built-up link was weak, and it *lost* coverage (cloud gaps across every scene left some wards blank). So we dropped it and kept the cleaner single-scene version. Not every idea ships — and saying so is part of the method.

## Why this matters

JanVayu exists to push back on false precision in air-quality data — the broken monitor behind a clean-air award, the single station standing in for a whole city. It would be hypocritical to then dress up a live snapshot as a structural verdict on your neighbourhood. The map can tell you two true things at once: **what your ward breathes right now**, and **what kind of place it tends to be**. It just shouldn't pretend the second one explains the first.

Explore it: [**How Polluted Is Your Ward?**](/index.html#ward-map) — or ask the bot "which ward in my city has the worst air right now, and why?"

---

*Air quality: CPCB / WAQI monitors, interpolated (live). Heat: USGS/NASA Landsat surface temperature. Green cover & built-up: ESA WorldCover 2021. Ward boundaries: DataMeet and the Mumbai spatial-data project. Methodology and limits are described on each layer of the panel itself.*
