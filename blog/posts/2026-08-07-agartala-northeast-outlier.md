# Agartala Breathes Like the Coal Belt, and Nobody Was Looking

**Published:** 7 August 2026 | **Author:** Team JanVayu | **Reading time:** 5 min

---

India's Northeast is usually described in one breath: hills, forest, clean air. For most of the region that is simply true. Itanagar averages **23.5 µg/m³** of PM2.5 over a year. Aizawl **23.9**. Kohima **24.0**. Shillong **30.2**. Imphal **31.3**. All comfortably under India's annual limit of 40, in a country where 64% of the urban wards we map are above it.

Agartala averages **61.3**.

Tripura's capital is not a little worse than its neighbours. It is **two and a half times** Itanagar, and it sits in the same range as Durgapur (63.0) and Asansol (60.9) — the steel-and-coal belt of West Bengal. It is dirtier than Kolkata (49.1). Every one of its 51 wards is above India's annual limit, from Ward 9 at 57.0 to Ward 35 at 65.0. Ranked against all 142 cities on our ward map, Agartala is **34th dirtiest**.

We only know this because, this week, Agartala got a ward map for the first time.

## Why nobody had seen it

Air pollution in India is measured where the monitors are. There are roughly **565 continuous CPCB stations** for the entire country. They cluster in the big cities and the Indo-Gangetic plain, which is both understandable and self-reinforcing: the places we measure are the places we discover problems, and the places we discover problems are where we put more monitors.

Tripura is not one of those places. Neither is most of the Northeast. And when a region has almost no ground monitoring, the absence of alarming numbers reads as an absence of a problem.

The satellite record does not work that way. It covers the whole country at about one kilometre, whether or not anyone is watching. Every one of India's 584,615 villages and all 9,015 wards on our map now carry an annual PM2.5 estimate from it (SatPM2.5 V6GL03, Atmospheric Composition Analysis Group, Washington University — a neural network over satellite aerosol measurements combined with an atmospheric model, calibrated against ground stations).

That estimate has existed for Agartala all along. What was missing was the ward map to hang it on — and the reason *that* was missing is embarrassing, so we wrote it up separately in [Every Capital, and the Directory We Never Read](2026-08-07-every-capital-and-the-directory.md). The short version: the data was sitting in a file we had been downloading past for weeks.

## What the number does and does not say

Three honest limits, because a figure like this is easy to over-read.

**It is an annual average, not a bad day.** 61.3 µg/m³ is what the air averages over a year. It says nothing about how bad a particular week in December gets, and for a city in a valley — Agartala sits in a low plain near the Bangladesh border, where winter inversions trap smoke close to the ground — the seasonal peak is likely to be considerably worse than the average. We do not yet have a monthly layer. That is the most important thing missing from this picture.

**It is modelled, not measured in Agartala.** The satellite product is calibrated against ground monitors, but there are few nearby to calibrate against, which is precisely the situation that makes it valuable and also the situation where its uncertainty is highest. A ground reference station in Agartala would settle it. There is a strong case for one.

**At ~1 km it smooths anything hyperlocal.** A single brick kiln, a crusher, a busy junction — none of these will show up. The within-city spread we can see (57.0 to 65.0) is real but narrow, which usually means the pollution is regional rather than driven by one point source inside the city.

That last point matters for what to do about it. When every ward in a city sits within eight units of every other, the problem is unlikely to be a specific factory on a specific street. It looks like an airshed — the whole plain breathing the same thing.

## What this is not

It is not a claim that Agartala is a crisis city on the scale of Delhi (93.4) or Ghaziabad (92.7). It is not a ranking exercise. And it is emphatically not a reason to describe the Northeast as polluted: five of its capitals are among the cleanest urban air in India, and that deserves saying as loudly as the Agartala number.

What it is, is a data point that could not previously exist, in a place that gets discussed as though the question had already been settled.

## What would actually help

**A reference-grade monitor reporting from Agartala.** When we query our own live-air pipeline for Agartala, nothing comes back — no CPCB or WAQI station is feeding a current reading for the city. (We have not audited Tripura's full monitoring inventory, so treat that as "nothing publicly reporting into the networks we read", not as a count of what exists.) A station whose data reaches the public feeds would convert a modelled estimate into a measured one, and let anyone check our figure rather than take it on faith. This is the kind of thing a state pollution control board can be asked for directly, and the kind of thing an RTI can establish the current status of. JanVayu has [RTI templates](https://www.janvayu.in/#rti-assistant) for exactly this.

**Seasonal data.** An annual mean is the wrong instrument for a country whose pollution is violently seasonal. We are building a monthly layer; until then, treat 61.3 as a floor for winter rather than a description of it.

**Someone local checking our work.** We have never been to Agartala. We have a satellite estimate, a ward map from a government GIS programme, and no ground truth. If you live there and this matches or contradicts what you breathe, we would like to know.

Look at Agartala ward by ward on the [map](https://www.janvayu.in/#ward-map) — pick it from the city list and press **Air, yearly**. If you find something wrong, or you know of monitoring data we have missed, write to **contribute@janvayu.in**.
