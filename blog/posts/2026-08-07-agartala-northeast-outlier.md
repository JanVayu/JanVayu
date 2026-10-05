# Agartala Breathes Like the Coal Belt, and Nobody Was Looking

**Published:** 7 August 2026 | **Author:** Team JanVayu | **Reading time:** 5 min

---

India's Northeast is usually described in one breath: hills, forest, clean air. For most of the region that is true. Itanagar averages **23.5 µg/m³** of PM2.5 over a year. Aizawl **23.9**. Kohima **24.0**. Shillong **30.2**. Imphal **31.3**. All are under India's annual limit of 40, in a country where 64% of the urban wards we map are above it.

*Update, 2 October 2026: the atlas now holds 68,596 wards across the country, and 57.7% of them exceed 40.*

Agartala averages **61.3**.

Tripura's capital is not a little worse than its neighbours. It is **two and a half times** Itanagar, and it sits in the same range as Durgapur (63.0) and Asansol (60.9), the steel-and-coal belt of West Bengal. It is dirtier than Kolkata (49.1). Every one of its 51 wards is above India's annual limit, from Ward 9 at 57.0 to Ward 35 at 65.0. Ranked against all 142 cities on our ward map, Agartala is **34th dirtiest**.

We only know this because, this week, Agartala got a ward map for the first time.

## Why nobody had seen it

Air pollution in India is measured where the monitors are. There are roughly **565 continuous CPCB stations** for the entire country. They cluster in the big cities and the Indo-Gangetic plain, and the pattern feeds itself: we find problems where we measure, and we put more monitors where we have found problems.

Agartala has two real-time monitors run by the Tripura State Pollution Control Board ([ANI, 21 June 2024](https://www.aninews.in/news/national/general-news/agartala-embraces-advanced-air-quality-monitoring-citizens-gain-real-time-access20240621171216/)), but they are not part of the long records that define the national picture, and the Northeast has few stations overall. When a region has few ground monitors, the absence of alarming numbers reads as the absence of a problem.

The satellite record does not work that way. It covers the whole country at about one kilometre, whether or not anyone is watching. Every one of India's 584,615 villages and all 9,015 wards on our map now carry an annual PM2.5 estimate from it (SatPM2.5 V6GL03, Atmospheric Composition Analysis Group, Washington University). The method is a neural network over satellite aerosol measurements, combined with an atmospheric model and calibrated against ground stations.

*Update, 2 October 2026: the map now carries 68,596 wards, not 9,015.*

That estimate has existed for Agartala all along. What was missing was the ward map to hang it on. The reason it was missing is embarrassing, so we wrote it up separately in [Every Capital, and the Directory We Never Read](2026-08-07-every-capital-and-the-directory.md). The short version: the data sat in a file we had been downloading past for weeks.

## What the number does and does not say

A figure like this is easy to over-read, so here are three limits.

**It is an annual average, not a bad day.** 61.3 µg/m³ is what the air averages over a year. It says nothing about how bad a particular week in December gets. Agartala sits in a low plain near the Bangladesh border, where winter inversions trap smoke close to the ground, so the seasonal peak is likely to be considerably worse than the average. We do not yet have a monthly layer, and that is the biggest gap in this picture.

*Update, 2 October 2026: a four-season layer now exists. Agartala's winter mean is 121.4 µg/m³, so 61.3 was indeed a floor.*

**It is modelled, not measured in Agartala.** The satellite product is calibrated against ground monitors, but few are nearby, and that is where its uncertainty is highest. A ground reference station in Agartala would settle it. There is a strong case for one.

**At about 1 km it smooths anything hyperlocal.** A single brick kiln, a crusher or a busy junction will not show up. The spread we can see within the city (57.0 to 65.0) is real but narrow, which usually means the pollution is regional and not driven by one source inside the city.

That last point matters for what to do about it. When every ward in a city sits within eight units of every other, the cause is unlikely to be one factory on one street. It looks like an airshed, with the whole plain breathing the same thing.

## What this is not

It is not a claim that Agartala is a crisis city on the scale of Delhi (93.4) or Ghaziabad (92.7). It is not a ranking exercise. And it is no reason to call the Northeast polluted: five of its capitals have some of the cleanest urban air in India, and that deserves saying as loudly as the Agartala number.

What it is: a data point that could not exist before, in a place discussed as though the question were already settled.

## What would help

**A reference-grade monitor reporting from Agartala.** Our own live-air pipeline does not pick up a current reading for Agartala, although the Tripura State Pollution Control Board runs two real-time monitors in the city ([ANI, 21 June 2024](https://www.aninews.in/news/national/general-news/agartala-embraces-advanced-air-quality-monitoring-citizens-gain-real-time-access20240621171216/)). (We have not audited Tripura's full monitoring inventory, so read that as "nothing publicly reporting into the networks we read", not as a count of what exists.) A station whose data reaches the public feeds would turn a modelled estimate into a measured one, and let anyone check our figure instead of taking it on trust. A state pollution control board can be asked for this directly, and an RTI can establish the current status. JanVayu has [RTI templates](https://www.janvayu.in/#rti-assistant) for exactly this.

**Seasonal data.** An annual mean is the wrong tool for a country whose pollution swings so sharply with the season. We are building a monthly layer. Until then, treat 61.3 as a floor for winter and not a description of it.

**Someone local checking our work.** We have never been to Agartala. We have a satellite estimate, a ward layer from the ESRI India Living Atlas (original government source not stated), and no ground truth. If you live there and this matches or contradicts what you breathe, we would like to know.

Look at Agartala ward by ward on the [map](https://www.janvayu.in/#ward-map): pick it from the city list and press **Air, yearly**. If you find something wrong, or know of monitoring data we have missed, write to **contribute@janvayu.in**.
