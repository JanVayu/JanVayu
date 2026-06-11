# A City Is Not One Number: Mapping India's Air Ward by Ward

**Published:** 10 June 2026 | **Author:** Team JanVayu | **Reading time:** 4 min

---

When the news says "Delhi AQI is 320," it hides something important: there is no single Delhi. On the same evening, one ward can sit at PM2.5 of 70 µg/m³ while another, a few kilometres away, chokes at 270. The headline number — usually whichever station made the news — flattens a city of enormous variation into one scary digit.

A recent series by **Unmapped** (Vaishnavi Iyer) made this beautifully clear for Bengaluru, colouring all of the city's wards by land-surface temperature, green cover, and built-up area — *"How hot is your ward? How cool is your ward?"* It's a powerful idea: zoom from the city down to the ward, and the inequality jumps out.

We asked the obvious question — **can we do this for air?** — and built it: [**How Polluted Is Your Ward?**](/index.html#ward-map), under *City Data*. It grew into four layers across nine cities.

## What it shows

Choose a city and every municipal ward is shaded four different ways, switchable with one click:

- **Air quality** — each ward's PM2.5 right now
- **Heat** — land-surface temperature on a hot-season afternoon
- **Green cover** — how much of the ward is vegetation
- **Built-up** — how much is concrete

Nine of India's ten largest cities are live — **Delhi (290 wards), Mumbai (227), Bengaluru (243), Hyderabad (145), Chennai (201), Kolkata (141), Jaipur (77), Pune (58) and Ahmedabad (48)**. Hover any ward for its value, and a "But…" panel calls out the extremes: the dirtiest and cleanest ward, the hottest and coolest, the greenest and most paved-over.

On a typical Delhi afternoon, the PM2.5 range runs from roughly **45 to 270 µg/m³ across wards** — a 6× difference, same city, same hour. The map makes a point that a single AQI number can never make: clean air is unevenly distributed, and where you live changes what you breathe.

Flip to the **Heat** layer and a second story appears. In every city, the hottest fifth of wards are markedly more built-up and less green than the coolest fifth — the urban heat-island effect, visible in each city's own data. The four layers aren't separate trivia; they're the same story of unequal cities told four ways.

## The honest part: why this is harder for air than for heat

Here's the catch we want to be upfront about. Unmapped's heat and green maps work because temperature, vegetation, and built-up area are measured by **satellite** — every pixel of the city has a value, so colouring 200+ wards is straightforward.

**Air quality has no equivalent dense ground network.** Delhi — the best-monitored city in India — has about 40 live government monitors, not 290. Most cities have a handful. So for this first version, each ward's value is **interpolated** from the city's nearest live CPCB/WAQI monitors (inverse-distance weighted: closer monitors count more).

That means the map shows the citywide **spread**, not a calibrated reading for every street. It's sharper where there are more monitors (Delhi) and coarser where there are few (Jaipur). We label this clearly on the panel, because hiding the method would be exactly the kind of false precision JanVayu exists to push back against. This is the same lesson as our [Data Source Selector](/index.html#source-selector): always ask *which monitor, which method*.

The three satellite layers come from open, calibrated data: **heat** from Landsat 8/9 land-surface temperature (~30 m), **green** and **built-up** from ESA WorldCover 2021 (10 m). Each ward's value is computed by aggregating the satellite pixels that fall inside its boundary. Unlike the interpolated air layer, these are measured directly — every ward has true coverage.

## What's next

1. **Satellite-derived per-ward PM2.5.** The air layer is still interpolated from monitors. There is also satellite-derived PM2.5 (modelled from aerosol optical depth at ~1 km); aggregated to wards, it would give the air layer the same full coverage the heat and green layers already have. That's the next pipeline.
2. **More cities.** Nine of the top ten are in (Surat is missing only because no open ward-boundary file exists for it yet). The map takes any city the moment we have its ward boundaries — tier-1 and tier-2 cities follow.

The ambition is simple: let anyone in any Indian city zoom past the headline number and ask the real question — *how clean is the air on my street, and why is it different from the next ward over?*

Explore it: [**How Polluted Is Your Ward?**](/index.html#ward-map).

---

*Inspiration: Vaishnavi Iyer / Unmapped, "How hot is your ward?" ward-level maps of Bengaluru. Ward boundaries: DataMeet Municipal Spatial Data and the Mumbai spatial-data project (open). Air quality: CPCB / WAQI station network, interpolated. Heat: USGS/NASA Landsat 8/9 surface temperature via Microsoft Planetary Computer. Green cover & built-up: ESA WorldCover 2021. Method and limitations are described on each layer of the panel itself.*
