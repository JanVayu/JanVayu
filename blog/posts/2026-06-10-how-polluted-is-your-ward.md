# A City Is Not One Number: Mapping India's Air Ward by Ward

**Published:** 10 June 2026 | **Author:** Team JanVayu | **Reading time:** 4 min

---

When the news says "Delhi AQI is 320," it hides a good deal. There is no single Delhi. For example (illustrative figures), on the same evening one ward can sit at PM2.5 of 70 µg/m³ while another, a few kilometres away, is at 270. The headline number is usually whichever station made the news, and it squeezes a varied city into one frightening digit.

A recent series by **Unmapped** (Vaishnavi Iyer) showed this for Bengaluru. It coloured all of the city's wards by land-surface temperature, green cover and built-up area, under the question *"How hot is your ward? How cool is your ward?"* Zoom from the city down to the ward and the inequality is plain to see.

We asked whether the same could be done for air, and built it: [**How Polluted Is Your Ward?**](/index.html#ward-map), under *City Data*. It grew into four layers across nine cities.

*Update, 2 October 2026: the ward map was folded into the Ward Atlas, which now covers 142 cities and has an added annual satellite "Air, yearly" layer. The link above points to the retired panel.*

## What it shows

Choose a city and every municipal ward is shaded four different ways, switchable with one click. The first layer is each ward's PM2.5 right now. The second is land-surface temperature on a hot-season afternoon. The third is how much of the ward is vegetation, and the fourth is how much is concrete.

Nine of India's ten largest cities are live: **Delhi (290 wards), Mumbai (227), Bengaluru (243), Hyderabad (145), Chennai (201), Kolkata (141), Jaipur (77), Pune (58) and Ahmedabad (48)**. Hover over any ward for its value. A "But…" panel names the extremes: the dirtiest and cleanest ward, the hottest and coolest, the greenest and most paved-over.

On a typical Delhi afternoon, PM2.5 runs from roughly **45 to 270 µg/m³ across wards**. That is a sixfold difference in one city at one hour. A single AQI number cannot show it: clean air is unevenly shared, and where you live changes what you breathe.

Switch to the **Heat** layer and a second pattern appears. In six of the nine cities (Delhi, Mumbai, Chennai, Hyderabad, Kolkata and Jaipur), the hottest fifth of wards are more built-up than the coolest fifth. In Bengaluru, Pune and Ahmedabad the pattern does not hold (JanVayu analysis of `data/wards/*.json`, comparing the top and bottom quintile of wards by Landsat land-surface temperature). This is the urban heat-island effect, and most of these cities show it in their own data. The four layers describe the same unequal city from four sides.

## Why air is harder to map than heat

Unmapped's heat and green maps work because temperature, vegetation and built-up area are measured by **satellite**. Every pixel of the city has a value, so colouring 200 or more wards is straightforward.

**Air quality has no equally dense network on the ground.** Delhi, the best-monitored city in India, has about 40 live government monitors for 290 wards. Most cities have a handful. So in this first version each ward's value is **interpolated** from the city's nearest live CPCB/WAQI monitors, with closer monitors counting for more (inverse-distance weighting).

The map therefore shows the citywide **spread**, not a calibrated reading for every street. It is sharper where there are more monitors (Delhi) and coarser where there are few (Jaipur). We say so on the panel, because hiding the method would be the false precision JanVayu exists to push back against. It is the same lesson as our [Data Source Selector](/index.html#source-selector): ask which monitor, and which method.

The three satellite layers come from open, calibrated data. Heat is Landsat 8/9 land-surface temperature (~30 m). Green cover and built-up area come from ESA WorldCover 2021 (10 m). Each ward's value is worked out from the satellite pixels inside its boundary. Unlike the interpolated air layer, these are measured directly, and every ward is covered.

## What comes next

1. Satellite-derived PM2.5 for each ward. The air layer is still interpolated from monitors. There is also satellite-derived PM2.5, modelled from aerosol optical depth at about 1 km. Averaged over wards, it would give the air layer the full coverage that the heat and green layers already have. That is the next piece of work.

   *Update, 6 August 2026: shipped, as an annual "Air, yearly" layer from SatPM2.5 V6GL03 (0.01 degree grid, about 1 km).*
2. More cities. Nine of the top ten are in. Surat is missing only because no open ward-boundary file exists for it yet. The map can take any city once we have its ward boundaries.

   *Update, 2 October 2026: Surat was added later, and the Ward Atlas now covers 142 cities.*

The aim is that anyone in any Indian city can look past the headline number and ask how clean the air is on their own street, and why it differs from the next ward over.

Explore it: [**How Polluted Is Your Ward?**](/index.html#ward-map).

---

*Inspiration: Vaishnavi Iyer / Unmapped, "How hot is your ward?" ward-level maps of Bengaluru. Ward boundaries: DataMeet Municipal Spatial Data and the Mumbai spatial-data project (open). Air quality: CPCB / WAQI station network, interpolated. Heat: USGS/NASA Landsat 8/9 surface temperature via Microsoft Planetary Computer. Green cover & built-up: ESA WorldCover 2021. Method and limitations are described on each layer of the panel itself.*
