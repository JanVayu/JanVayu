# The boundary map: every Indian administrative level on one map

The [live map](https://www.janvayu.in/#map) has a **Boundaries** menu covering the whole administrative hierarchy of India, and a **Colour** menu that chooses what the areas are shaded by. This page explains where those numbers come from.

It replaces the [Ward-Level Atlas](ward-map.md), an older per-city panel retired in v26.6.151. That panel held one file per city, for 142 cities. The boundary map covers the whole country.

<img src="/blog/diagrams/atlas-layers.svg" alt="How the boundary atlas is built: four sources (SatPM2.5 annual and monthly grids, Landsat 8/9 scenes, ESA WorldCover 2021, and boundary geometry from LGD, Swachh Bharat Mission, WB AMRUT and Living Atlas) feed a national heat mosaic and a tile-major land-cover pass, then one zonal pass stamps nine numbers onto every polygon: annual PM2.5, the same by season for winter, summer, monsoon and post-monsoon, surface heat, tree cover, green cover and built-up. Six of the seven levels ship as PMTiles read by HTTP range request, from 36 states down to 68,596 wards; the 584,615 villages carry the same numbers but load one quantized file per district instead." style="width:100%;max-width:980px;display:block;margin:1.5rem auto;">

Every layer works the same way. Each starts as one national grid of values, and one pass over it computes an average for every area. Nothing is computed city by city, so adding a new level means running the pass again, not compiling a list. That is what heat could not do before, and why it reached 142 cities and left holes.

---

## The levels

| Level | Features | Source | Zooms |
|-------|---------:|--------|-------|
| State / UT | 36 | LGD | 0–7 |
| District (zila) | 785 | LGD | 3–9 |
| Block / mandal / tehsil | 6,471 | LGD | 5–11 |
| Gram panchayat | 319,287 | LGD | 6–10 |
| Village | 584,615 | LGD | 7–12 |
| City / ULB | 3,359 | SBM | 5–12 |
| Ward | 68,596 | SBM + AMRUT + Living Atlas + panel imports | 9–13 |

Two counts changed in August 2026. The city/ULB level read 3,368 until 9 August. The same overlap that duplicated wards left **9 byte-identical duplicate ULB geometries**, so there are 3,359 distinct cities now.

The ward count read 70,417 until 8 August. That figure counted records, not places. The three merged sources overlap for a few dozen ULBs and left **2,541 byte-identical duplicate geometries**: Patna held 628 ward records but only 115 distinct shapes, and "Ward 1" appeared there twenty-three times. Collapsing those, and adding **720 wards from 14 cities the three sources missed entirely**, gives 68,596 distinct wards. Those 14 cities are Kolkata, Madurai, Asansol and the north-eastern capitals Agartala, Imphal, Shillong, Itanagar, Aizawl and Kohima, all of which existed only in the older per-city panel. So there are fewer records and more places.

Boundaries come from [ramSeraph/indian_admin_boundaries](https://github.com/ramSeraph/indian_admin_boundaries), which republishes the geometries of the Local Government Directory (LGD) and the Swachh Bharat Mission (SBM).

Six of the seven levels are stored as tile archives, and the browser fetches only the parts that are on screen. Showing Delhi NCR's roughly 700 wards takes about 120 KB of a 42 MB archive. Villages are the exception. Their archive is 267 MB, over GitHub's 100 MB file limit, so that level loads one compressed file per district for whatever is on screen. It has the same menu entry and the same nine numbers on every polygon (since v26.6.153), with a different loader underneath.

---

## What the colours mean

| Colour | Source | Resolution | Levels | Notes |
|--------|--------|-----------|--------|-------|
| **Air** (annual PM2.5) | SatPM2.5 V6GL03 (ACAG / Washington University) | ~1 km | all | The 2024 annual mean, the newest published; as of August 2026 no 2025 grid exists. A neural network over satellite aerosol data plus the GEOS-Chem atmospheric model, calibrated against ground monitors before release. |
| **Air by season** | SatPM2.5 V6GL03 monthly | ~1 km | all | Winter (Dec–Feb), summer (Mar–May), monsoon (Jun–Sep), post-monsoon (Oct–Nov), each the mean of its months. |
| **Surface heat** | Landsat 8/9 Collection 2 Level 2 | ~110 m | all | Mean land-surface temperature across the 2026 pre-monsoon season, from a national mosaic. |
| **Tree cover** | ESA WorldCover 2021 | 10 m | all | Share under tree canopy (class 10). Cropland is *not* counted. |
| **Green cover** | ESA WorldCover 2021 | 10 m | all | Share classified as vegetation: tree, shrub, grass, **cropland**, wetland. |
| **Built-up** | ESA WorldCover 2021 | 10 m | all | Share classified as built or impervious surface. |

Sources: [ESA WorldCover](https://esa-worldcover.org/) (CC BY 4.0), [Landsat](https://www.usgs.gov/landsat-missions) via [Microsoft Planetary Computer](https://planetarycomputer.microsoft.com/), [SatPM2.5 V6GL03](https://sites.wustl.edu/acag/datasets/surface-pm2-5/) (CC BY 4.0).

---

## How heat is computed

Heat starts as one national map of land-surface temperature, and then each boundary polygon is averaged over it. The old ward panel searched for a Landsat scene city by city. That had to be repeated for every city added, and a seam between scenes left six Thiruvananthapuram wards permanently blank. A national mosaic treats heat like every other layer.

1. Choosing scenes. For each of the Landsat tracks that cover India (388 path/rows), the least cloudy Landsat 8/9 scenes between 1 March and 15 June are picked, up to four per track, 1,516 scenes in all. Picking by track, not the cleanest scenes nationally, is deliberate. A national top-N would cluster in whichever region was clearest that year and leave holes elsewhere.
2. Masking cloud. The satellite's quality band flags cloud, thin cloud edges, cloud shadow and snow at full 30 m resolution. Those flags are then reduced to the coarser 120 m working grid so that a cell is dropped if *any* of the 16 pixels behind it was contaminated. Temperatures outside 10–75 °C are physically implausible and are rejected too.
3. Compositing. Each scene is placed on a national grid of about 111 m, and every output pixel is the **mean of its clear observations**.
4. Averaging by area. Each polygon's value is the average of the pixels inside it. A polygon smaller than one pixel takes the value at its centre point.

### Coverage

| Level | With a heat value |
|-------|------------------|
| State | 36 / 36 (100%) |
| District | 785 / 785 (100%) |
| Block / tehsil | 6,459 / 6,471 (99.8%) |
| Gram panchayat | 319,114 / 319,287 (99.9%) |
| City / ULB | 3,355 / 3,359 (99.88%) |
| Ward | 68,481 / 68,596 (99.83%) |

---

## How the seasonal air layers are computed

An annual mean is a poor summary of Indian air. A Delhi ward reads **94 µg/m³** for the year, **46 in the monsoon** and **154 after it**. The annual figure describes neither season, and the gap between them is most of the argument about what to do.

The twelve monthly SatPM2.5 grids for the year are averaged into four seasons, and each polygon is then averaged over each season in the same way as the annual layer:

| Season | Months | What it captures |
|--------|--------|------------------|
| Winter | Dec, Jan, Feb | inversions trapping what is already there |
| Summer | Mar, Apr, May | pre-monsoon dust; the south's cleanest air |
| Monsoon | Jun–Sep | washout, the annual minimum |
| Post-monsoon | Oct, Nov | stubble burning and Diwali; the peak |

Each season is the mean of its months, so winter weights December, January and February equally. All six levels that ship as tile archives have all four seasons at **100%** coverage.

There is a built-in check. Every feature's annual mean must fall inside its own seasonal range, and it does for all 398,534 of them. If it did not, a grid would be misaligned.

**The colour scale does not change between seasons.** The same colour means the same µg/m³ in the monsoon as in November, so switching season shows the air changing, not the scale shifting under you.

---

## How "this year so far" is computed

Every other air figure on the map is the **2024** annual mean, because SatPM2.5 V6GL03 has published nothing newer. This was checked: the data store returns 404 (not found) for 2025 and 2026, annual and monthly alike. The product is calibrated against ground monitors before release, so the lag comes from the science, not from neglect.

That leaves a real question, what about this year, without an answer. The live monitors answer "this hour", and only in cities.

For **districts only**, the map fills the gap using CAMS, the Copernicus atmospheric model, through the Open-Meteo air-quality archive, which is free, needs no key and publishes continuously.

### Why it can be published

CAMS on its own is not comparable with the satellite figures beside it. It is a model, not a retrieval, and its cells are roughly 40 km wide. But both cover 2024, so they can be checked against each other. Across all **758 districts** where both have a value:

| | |
|---|---|
| correlation | **r = 0.910**, so it tracks the spatial pattern |
| bias | **−7.3 µg/m³**, so it reads low everywhere |
| RMSE before correction | 9.6 µg/m³ |
| fitted correction | `sat ≈ 0.832 × cams + 12.80` |
| **held-out RMSE** | **5.76 µg/m³** (200 random 50/50 splits) |
| in-sample RMSE | 5.71, so the fit generalises instead of memorising |
| error size | under **3.1** for half the districts, under **8.5** for nine in ten |

A high correlation with a steady offset is the correctable case. The fitted offset is applied and nothing else is.

> An early pilot on 55 districts reported r = 0.955 and a held-out RMSE of 4.0. The full sample gives the honest numbers. A small sample of large, well-separated districts flatters any spatial fit.

### What it is not

- It is never merged with the 2024 layer. It has a separate menu entry, a separate label and its own line in the popup, and neither can be quoted as the other.
- It is never drawn below district level. A 40 km cell cannot resolve a ward, let alone a village, and colouring one would invent detail the model does not have.
- It is not a measurement. It is a corrected model, and the interface says so.
- It is calibrated to V6GL03, not to ground truth. If that product carries a bias, this layer inherits it. The choice was deliberate: continuity with the series already on the map, not an independent estimate.

### It updates itself

The layer is rebuilt on the **3rd of each month**, and the data is replaced only if the figures moved. The year is written nowhere in the interface. The menu entry, the label and the popup all read it from the data, so the layer moves into a new year without an edit.

The calibration was fitted on 2024 and is applied to a later year, which assumes that the relationship between CAMS and the satellite stays stable. That cannot be checked until a 2025 or 2026 grid is published. When one is, rerunning the fit will show whether the coefficients moved. If they did, this layer was wrong and should say so plainly.

---

## How green cover and built-up are computed

Two methods are used, because the cheap direction depends on how big the polygons are.

**Wards** were first scored one at a time, reading only the part of the remote land-cover map that each ward covers. They now go through the same tile-by-tile pass as every other level, with the one-at-a-time method kept as the fallback described below.

**Blocks and panchayats** are scored tile by tile. A separate read for each feature is fine for a 2 km² ward and absurd for a 500 km² block, or for 319,287 separate round trips. WorldCover is a fixed global raster, so each 3-degree tile is opened once, read in strips, and every polygon inside is scored as it goes. The pass read 45.8 billion pixels at the full 10 m resolution.

| Level | With tree, green and built-up |
|-------|------------------------------:|
| State | 36 / 36 (100%) |
| District | 785 / 785 (100%) |
| Block / tehsil | 6,470 / 6,471 (99.98%) |
| Gram panchayat | 319,109 / 319,287 (99.94%) |
| City / ULB | 3,358 / 3,359 (99.97%) |
| Ward | 68,564 / 68,596 (99.95%) |

Three details were nearly got wrong.

**No shortcuts through coarser versions of the map.** Reading a 4-times-coarser copy is about ten times faster, and for the heat mosaic that was the right call. Here it is not. Land cover is made of categories, so a coarse copy takes the commonest class in each block, and that does not preserve class shares in fragmented terrain. Measured over central Delhi against the full 10 m map, built-up is overstated by 1.0 percentage points at 4 times coarser, 2.3 at 8 times and 4.5 at 16 times, always in the same direction. These values appear as whole percentages beside ward figures computed at 10 m, so the shortcut was rejected.

**Polygons that cross a tile edge.** The first ward method chose its tile from the polygon's centre and read past the tile edge, where the raster returns "no data" that is then filtered out. A polygon straddling a 3-degree boundary was therefore scored only on the part inside its centre's tile. For a ward that is a rounding error. A block is about 22 km across, so the tile-by-tile pass scores each polygon against every tile it touches and adds up the counts.

**Polygons that overlap each other.** The tile pass paints a whole level onto one grid, so each pixel belongs to exactly one feature. That is correct for levels whose polygons fit together without overlap (panchayats, blocks, districts) and wrong for wards. Wards come from three merged sources and overlap in 272 ULBs. Where they overlap, every polygon but the last one drawn loses its pixels. The first run reported **556 of Patna's 628 wards and 480 of Mangalore's 540 with no land cover at all**, which looked exactly like ordinary missing data.

Anything the tile pass leaves below a 20-pixel floor now gets a second, slower pass, one polygon at a time, so an overlapping neighbour cannot take its pixels. That runs on about 3,200 features instead of 400,000, and it lifts ward coverage from 95.90% to 99.93%.

---

## Cautions

Surface temperature is not air temperature. The heat layer shows how hot the ground itself gets under a clear pre-monsoon sky. That runs well above what a thermometer in the shade reads, and the map's bands are set against it. A ward at 45 °C surface temperature is not a ward where the forecast says 45.

Heat is a seasonal mean, not an annual one. The window is deliberately the hottest, clearest part of the year, so it says how hot a place gets, not how hot it is on average. Comparing a Himalayan block with a Rajasthan one compares their pre-monsoon peaks.

Heat is a mean of clear observations, not a median. A true median needs every scene's value for every pixel held at once, about 15 GB of working memory. So the cloud mask is deliberately conservative instead. Cloud tops are cold, and a single leaked cloud pixel would drag a mean down and understate heat.

Tree cover answers the question people are asking. Green cover counts cropland, so outside cities it says almost nothing. Tree cover is canopy alone, and it separates places everywhere: the median ward is 9% treed, the median panchayat 12% and the median state 38%. It also tracks heat. Nationally, tree cover against ward surface temperature gives **r = −0.43**, against **−0.07** for green cover, and the least-treed fifth of India's wards runs **4.8 °C hotter** than the most-treed fifth. Green cover's equivalent gap is 0.8 °C.

"Green" includes cropland, and in rural India that is nearly all of it. WorldCover's vegetation classes are tree, shrub, grassland, cropland and wetland. In a ward that mostly means parks, scrub and roadside trees. In a gram panchayat it mostly means farmland. The median panchayat is **97% green**, and 87% of them are above 90%. That figure is correct, and it does not measure tree cover. Read it as how much of the place is not built or bare, not as how leafy it is. Tree cover on its own is a separate WorldCover class and is not yet extracted; it is the more useful rural question and is on the roadmap.

Because of that, green barely separates rural areas. The map's bands are deliberately bunched at the top (85 / 93 / 97 / 100) so the countryside is not one flat colour. Built-up share is the more informative layer at block and panchayat level, and the map says which is which and does not imply that green is doing work it cannot do here.

Bands are absolute, not per level. The same colour means the same percentage on a ward and on a block. That makes the two comparable, at the cost of rural green looking uniform. Rescaling per level would have made a panchayat at 97% look like a ward at 42%.

Villages carry every metric but were matched in, not tiled. The passes always scored them, but the values had nowhere to go until they were written into the per-district village files. Matching them took more than a lookup. **4,900 LGD codes are carried by more than one polygon**, and those polygons really differ (code 645088 covers one shape that is 12% treed and another that is 67% treed), so a shared code is resolved by the polygon's centre, not by taking the first. And **37,560 villages have no LGD code at all**, blank on both sides, so they are matched by shape against a 2 km grid of the codeless records, each claimed once, within 3 km. Anything further away is refused instead of guessed.

The match checks itself. Both files carry an annual PM2.5 computed independently from the same grid, so the two can be compared. The median difference is **0.00 µg/m³** and the 95th percentile 0.10, on both routes. Only 0.023% of code matches and 0.072% of shape matches differ by more than 2 µg/m³. So the shape-based fallback is as reliable as the code it replaces. Final coverage: **584,586 of 584,615 villages (100.00%)** for air and the four seasons, land cover on 99.98% and heat on 99.87%.

A few areas still have no value. 32 wards, 178 panchayats, one block and one ULB have no land cover, and so do 143 villages. 115 wards and 749 villages have no heat value. These are polygons too small or malformed for either pass to score. They draw uncoloured, not filled with a guess. One Thiruvananthapuram ward still lacks heat, down from the six the per-city method could never resolve.

Land cover is 2021 and may lag very recent construction.

Ward boundaries carry the delimitation date of whatever the ULB uploaded, which is not the same year everywhere.

See also: [Ward-Level Atlas](ward-map.md) · [Data sources overview](overview.md) · [Roadmap](../wiki/Roadmap.md).
