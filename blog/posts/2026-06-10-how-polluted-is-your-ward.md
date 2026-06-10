# A City Is Not One Number: Mapping India's Air Ward by Ward

**Published:** 10 June 2026 | **Author:** Team JanVayu | **Reading time:** 4 min

---

When the news says "Delhi AQI is 320," it hides something important: there is no single Delhi. On the same evening, one ward can sit at PM2.5 of 70 µg/m³ while another, a few kilometres away, chokes at 270. The headline number — usually whichever station made the news — flattens a city of enormous variation into one scary digit.

A recent series by **Unmapped** (Vaishnavi Iyer) made this beautifully clear for Bengaluru, colouring all of the city's wards by land-surface temperature, green cover, and built-up area — *"How hot is your ward? How cool is your ward?"* It's a powerful idea: zoom from the city down to the ward, and the inequality jumps out.

We asked the obvious question — **can we do this for air?** — and just shipped the first version: [**How Polluted Is Your Ward?**](/index.html#ward-map), under *City Data*.

## What it shows

Choose a city and every municipal ward is shaded by its current PM2.5 — **Delhi (290 wards), Bengaluru (243), and Jaipur (77)** are live, with more coming. Hover any ward for its estimate and category. A live "But…" panel calls out the spread: how many wards are in *Poor* air or worse right now, the dirtiest and cleanest ward, and the citywide range.

On a typical Delhi afternoon, that range runs from roughly **45 to 270 µg/m³ across wards** — a 6× difference, same city, same hour. The map makes a point that a single AQI number can never make: clean air is unevenly distributed, and where you live changes what you breathe.

## The honest part: why this is harder for air than for heat

Here's the catch we want to be upfront about. Unmapped's heat and green maps work because temperature, vegetation, and built-up area are measured by **satellite** — every pixel of the city has a value, so colouring 200+ wards is straightforward.

**Air quality has no equivalent dense ground network.** Delhi — the best-monitored city in India — has about 40 live government monitors, not 290. Most cities have a handful. So for this first version, each ward's value is **interpolated** from the city's nearest live CPCB/WAQI monitors (inverse-distance weighted: closer monitors count more).

That means the map shows the citywide **spread**, not a calibrated reading for every street. It's sharper where there are more monitors (Delhi) and coarser where there are few (Jaipur). We label this clearly on the panel, because hiding the method would be exactly the kind of false precision JanVayu exists to push back against. This is the same lesson as our [Data Source Selector](/index.html#source-selector): always ask *which monitor, which method*.

## What's next

Two upgrades are on the roadmap:

1. **Satellite-derived per-ward PM2.5.** Just as Unmapped used satellite temperature, there is satellite-derived PM2.5 (modelled from aerosol optical depth at ~1 km). Aggregated to ward boundaries, it would give true full-coverage values — the methodological twin of their heat map. This is a data-pipeline job, and it's the planned successor to the live-interpolation version.
2. **More cities.** The map is built to take any city once we have its ward boundaries — the metros next, then tier-1 and tier-2 cities.

The ambition is simple: let anyone in any Indian city zoom past the headline number and ask the real question — *how clean is the air on my street, and why is it different from the next ward over?*

Explore it: [**How Polluted Is Your Ward?**](/index.html#ward-map).

---

*Inspiration: Vaishnavi Iyer / Unmapped, "How hot is your ward?" ward-level maps of Bengaluru. Ward boundaries: DataMeet Municipal Spatial Data (open). Live air-quality data: CPCB / WAQI station network, interpolated. Method and limitations are described on the panel itself.*
