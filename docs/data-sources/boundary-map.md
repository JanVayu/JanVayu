# The Boundary Map — every Indian administrative level, on one map

The [live map](https://www.janvayu.in/#map) has a **Boundaries** menu covering
the whole administrative hierarchy of India, and a **Colour** menu choosing what
the polygons are shaded by. This page documents where those numbers come from.

It replaces the [Ward-Level Atlas](ward-map.md), the older per-city panel,
which was retired in v26.6.151. The panel baked values into one GeoJSON per
city for 142 cities; the boundary map reads national PMTiles archives with
per-feature properties baked in, for the whole country.

<img src="/blog/diagrams/atlas-layers.svg" alt="How the boundary atlas is built: four sources — SatPM2.5 annual and monthly grids, Landsat 8/9 scenes, ESA WorldCover 2021, and boundary geometry from LGD, Swachh Bharat Mission, WB AMRUT and Living Atlas — feed a national heat mosaic and a tile-major land-cover pass, then one zonal pass stamps nine numbers onto every polygon: annual PM2.5, the same by season for winter, summer, monsoon and post-monsoon, surface heat, tree cover, green cover and built-up. Six of the seven levels ship as PMTiles read by HTTP range request, from 36 states down to 68,596 wards; the 584,615 villages carry the same numbers but load one quantized file per district instead." style="width:100%;max-width:980px;display:block;margin:1.5rem auto;">

The shape is the point: every layer is one national raster and one zonal pass.
Nothing is computed per city, so adding a level costs a pass rather than a
list — which is exactly what heat could not do before, and why it reached 142
cities and left holes.

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

**Two counts changed, and it is worth saying why.** The city/ULB level read
3,368 until 9 August; the same overlap that duplicated wards left **9
byte-identical duplicate ULB geometries**, so it is 3,359 distinct cities now.

**The ward count changed for the same reason, and one other.** It read 70,417 until
8 August. That was a count of *records*, not places: the three merged sources
overlap for a few dozen ULBs, leaving **2,541 byte-identical duplicate
geometries** — Patna held 628 ward records across 115 distinct shapes, and
"Ward 1" appeared there twenty-three times. Collapsing those, and folding in
**720 wards from 14 cities the three sources missed entirely** — Kolkata,
Madurai, Asansol, and the north-eastern capitals Agartala, Imphal, Shillong,
Itanagar, Aizawl and Kohima, all of which existed only in the older per-city
panel — gives 68,596 distinct wards. Fewer records, more places.

Boundaries via [ramSeraph/indian_admin_boundaries](https://github.com/ramSeraph/indian_admin_boundaries),
which republishes LGD and Swachh Bharat Mission geometries.

Each level is one PMTiles archive in `data/tiles/`. The browser issues HTTP
range requests for only the byte ranges covering what is on screen — rendering
Delhi NCR styles about 700 wards from roughly 120 KB of a 42 MB archive.

Villages are the exception: their archive is 267 MB, over GitHub's 100 MB file
limit, so that level still loads through the older per-district TopoJSON path —
one quantized file per district, fetched for whatever is on screen. Same menu
entry, same nine numbers on every polygon since v26.6.153, different loader
underneath.

---

## What the colours mean

| Colour | Source | Resolution | Levels | Notes |
|--------|--------|-----------|--------|-------|
| **Air** (annual PM2.5) | SatPM2.5 V6GL03 (ACAG / Washington University) | ~1 km | all | 2024 annual mean. A CNN over satellite AOD plus GEOS-Chem, calibrated against ground monitors. |
| **Air by season** | SatPM2.5 V6GL03 monthly | ~1 km | all | Winter (Dec–Feb), summer (Mar–May), monsoon (Jun–Sep), post-monsoon (Oct–Nov), each the mean of its months. |
| **Surface heat** | Landsat 8/9 Collection 2 Level 2 | ~110 m | all | Mean land-surface temperature across the 2026 pre-monsoon season, from a national mosaic. |
| **Tree cover** | ESA WorldCover 2021 | 10 m | all | Share under tree canopy (class 10). Cropland is *not* counted. |
| **Green cover** | ESA WorldCover 2021 | 10 m | all | Share classified as vegetation — tree, shrub, grass, **cropland**, wetland. |
| **Built-up** | ESA WorldCover 2021 | 10 m | all | Share classified as built / impervious surface. |

Sources: [ESA WorldCover](https://esa-worldcover.org/) (CC BY 4.0),
[Landsat](https://www.usgs.gov/landsat-missions) via
[Microsoft Planetary Computer](https://planetarycomputer.microsoft.com/),
[SatPM2.5 V6GL03](https://sites.wustl.edu/acag/datasets/surface-pm2-5/) (CC BY 4.0).

---

## How heat is computed

`scripts/build-lst-mosaic.py` builds **one national raster**, and
`scripts/build-boundary-heat.py` runs a single zonal pass over it. That shape
matters: the ward panel's heat came from a per-city Landsat scene search, which
had to be re-run for every city ever added and produced a scene seam that left
six Thiruvananthapuram wards permanently blank. A national mosaic makes heat
work the same way as every other layer here.

1. **Scene selection.** A STAC search over a 3° grid across India picks the
   least-cloudy Landsat 8/9 scenes in the 1 March – 15 June window, up to four
   per WRS path/row. Grouping by path/row rather than taking the top N
   nationally is deliberate — the latter would cluster scenes in whichever
   region happened to be clearest and leave holes elsewhere. 388 path/rows,
   1,516 scenes.
2. **Cloud masking.** `QA_PIXEL` bits for cloud, dilated cloud, cloud shadow
   and snow are read at full 30 m resolution, then reduced with any-bad-wins
   onto the 120 m read grid — so a cell is dropped if *any* of the 16 source
   pixels behind it was contaminated. Physically implausible temperatures
   (outside 10–75 °C) are rejected too.
3. **Compositing.** Each scene is warped into a national ~111 m grid and
   accumulated. Every output pixel is the **mean of its clear observations**.
4. **Zonal pass.** Boundary polygons are rasterised to a label grid and
   averaged with NumPy `bincount`, the same routine the PM2.5 pass uses.
   Polygons smaller than a pixel fall back to a point sample.

The mosaic itself (518 MB) is an intermediate and is not committed — the values
ship inside the PMTiles archives. Rebuild it with `build-lst-mosaic.py`, about
20 minutes.

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

An annual mean is a bad summary of Indian air. A Delhi ward reads **94 µg/m³**
for the year — and **46 in the monsoon, 154 after it**. The annual figure
describes neither state, and the gap between them is most of the argument
about what to do.

`scripts/build-boundary-seasonal.py` downloads the twelve monthly SatPM2.5
grids for the year, averages them into four seasons, and runs the same zonal
pass as the annual layer:

| Season | Months | What it captures |
|--------|--------|------------------|
| Winter | Dec, Jan, Feb | inversions trapping what is already there |
| Summer | Mar, Apr, May | pre-monsoon dust; the south's cleanest air |
| Monsoon | Jun–Sep | washout, the annual minimum |
| Post-monsoon | Oct, Nov | stubble burning and Diwali; the peak |

Each season is the mean of its months, so winter weights December, January and
February equally rather than whichever month was processed last. All six
shipping levels have all four seasons at **100%** coverage.

The monthly files are 95 MB each; they are fetched one at a time, added into
their season, and deleted, so peak disk is one file. Every feature is checked
after the pass: its annual mean must fall inside its own seasonal range, and it
does for all 398,543 of them — if it did not, a grid would be misaligned.

**The colour scale does not change between seasons.** The same colour means the
same µg/m³ whether you are looking at the monsoon or at November, so switching
season shows the air changing rather than the scale moving under you.

---

## How green cover and built-up are computed

Two scripts, because the cheap direction depends on how big the polygons are.

**Wards** were first done with `scripts/build-ward-landcover-national.py`:
one windowed `/vsicurl` read per ward over the remote COGs — no bulk download.
They now go through the same tile-major pass as every other level, with that
per-feature method kept as the fallback described below.

**Blocks and panchayats** use `scripts/build-boundary-landcover.py`, which
turns the loop inside out. A read per feature is fine for a 2 km² ward and
absurd for a 500 km² block or for 319,287 separate round trips; WorldCover is a
fixed global raster, so the pass goes tile-major instead — open each 3-degree
tile once, walk it in 1024-row strips clipped to the columns its polygons span,
and score everything inside as it goes. 45.8 Gpx read, at full 10 m.

| Level | With tree, green and built-up |
|-------|------------------------------:|
| State | 36 / 36 (100%) |
| District | 785 / 785 (100%) |
| Block / tehsil | 6,470 / 6,471 (99.98%) |
| Gram panchayat | 319,109 / 319,287 (99.94%) |
| City / ULB | 3,358 / 3,359 (99.97%) |
| Ward | 68,564 / 68,596 (99.95%) |

Two details worth recording, because both were nearly got wrong:

**No overviews.** Reading the `/4` overview is ~10x faster, and for the heat
mosaic that was the right call. Here it is not: land cover is categorical, so
its overviews are mode-resampled, and mode does not preserve class shares in
fragmented terrain. Measured over central Delhi against full 10 m, built-up is
overstated by +1.0 points at `/4`, +2.3 at `/8` and +4.5 at `/16`, always in
the same direction. These ship as integer percentages beside ward figures
computed at 10 m, so the shortcut was rejected.

**Polygons that cross a tile edge.** The per-ward script picks its WorldCover
tile from the polygon centroid and reads boundless past the tile edge, where
the raster returns nodata that then gets filtered out — so a polygon straddling
a 3-degree boundary is scored on the part inside its centroid's tile only. At
ward size that is a rounding error. A block is ~22 km across, so the tile-major
pass scores each polygon against every tile it touches and sums the counts.

**Polygons that overlap each other.** The tile pass rasterises a whole level
into one label grid, so each pixel belongs to exactly one feature. That is
correct for levels whose polygons tile the plane — panchayats, blocks,
districts — and wrong for wards, which come from three merged sources and
genuinely overlap in 272 ULBs. Where they overlap, every polygon but the
last-drawn loses its pixels, and the first run reported **556 of Patna's 628
wards and 480 of Mangalore's 540 with no land cover at all**. It looked exactly
like ordinary missing data.

Whatever the tile pass leaves below the 20-pixel floor now gets a second,
per-feature pass: an individual windowed read masked by that polygon alone, so
an overlapping neighbour cannot take its pixels. That is the slow method, but
it runs on ~3,200 features rather than 400,000, and it lifts wards from 95.90%
to 99.93%.

---

## Honesty notes

- **Surface temperature is not air temperature.** This is how hot the ground
  itself gets under a clear pre-monsoon sky. It runs well above what a
  thermometer in the shade reads, and the map's bands are set against that. A
  ward at 45 °C surface temperature is not a ward where the forecast says 45.

- **Heat is a seasonal mean, not an annual one.** The window is deliberately
  the hottest, clearest part of the year, so it answers "how hot does this
  place get" rather than "how hot is this place on average". Comparing a
  Himalayan block against a Rajasthan one compares their pre-monsoon peaks.

- **It is a mean of clear observations, not a median.** A true median needs
  every scene's value for every pixel held at once — about 15 GB of
  accumulator — which is why the mask is deliberately conservative instead:
  cloud tops are cold, and a single leaked cloud pixel would drag a mean down
  and *understate* heat.

- **Tree cover is the layer that answers the question people are actually
  asking.** Green cover counts cropland, so it says almost nothing outside
  cities. Tree cover is canopy alone, and it separates places everywhere: the
  median ward is 9% treed, the median panchayat 12%, the median state 38%.
  It is also the one that tracks heat — nationally, tree cover against ward
  surface temperature is **r = −0.43**, against **−0.07** for green cover, and
  the least-treed fifth of India's wards runs **4.8 °C hotter** than the
  most-treed fifth. Green cover's equivalent gap is 0.9 °C.

- **"Green" includes cropland, and in rural India that is nearly all of it.**
  WorldCover's vegetation classes are tree, shrub, grassland, cropland and
  wetland. In a ward that mostly means parks, scrub and roadside trees. In a
  gram panchayat it mostly means farmland — the median panchayat is **97%
  green**, and 87% of them are above 90%. That figure is correct and it is not
  a measure of tree cover. Read it as "how much of this place is not built or
  bare", not as "how leafy is it". Tree cover on its own is a separate
  WorldCover class and is not yet extracted; it is the more useful rural
  question and is on the roadmap.

- **Because of that, green barely discriminates between rural units.** The map
  bands are deliberately bunched at the top end (85 / 93 / 97 / 100) so the
  countryside is not one flat colour, but built-up share is the more
  informative layer at block and panchayat level, and the map is honest about
  which is which rather than implying green is doing work it cannot do here.

- **Bands are absolute, not per level.** The same colour means the same
  percentage on a ward and on a block, which makes the two comparable at the
  cost of rural green looking uniform. Rescaling per level would have made a
  panchayat at 97% look like a ward at 42%.

- **Villages carry every metric, but were joined rather than tiled.** The
  passes always scored them; the values had nowhere to go until they were
  written into the per-district TopoJSON. Two things made that join harder than
  a dictionary lookup. **4,856 LGD codes are carried by more than one polygon**
  and those polygons genuinely differ — code 645088 covers one shape 12% treed
  and another 67% — so a shared code is resolved by centroid rather than by
  taking the first. And **37,563 villages have no LGD code at all**, blank on
  both sides, so they are matched by geometry against a 2 km grid of the
  codeless records, each claimed once, within 3 km. Anything further is refused
  rather than guessed, and the script prints how many.

  **The join checks itself.** Both files carry an annual PM2.5 computed
  independently — `build-village-pm25.py` sampled the TopoJSON polygon,
  `build-boundary-tiles.py` sampled the boundary polygon, from the same grid —
  so `--verify` compares them. Median difference **0.00 µg/m³** and p95 0.10 on
  both paths; 0.023% of code matches and 0.072% of geometry matches differ by
  more than 2 µg/m³. The geometric fallback is as reliable as the key it
  replaces. Final coverage: **584,586 of 584,615 villages (100.00%)**, air and
  the four seasons on all of them, land cover on 99.98%, heat on 99.87%.

- **32 wards, 178 panchayats, one block and one ULB still have no land
  cover**, 143 villages have none either, and 115 wards and 749 villages have
  no heat. These are sub-pixel or degenerate
  geometries that survive both passes; they draw uncoloured rather than filled
  with a guess.

- **Land cover is 2021** and may lag very recent construction.

- **The remaining gaps are real gaps.** 111 wards have no heat value and 49 have
  no land cover; they draw uncoloured rather than filled with a guess. One
  Thiruvananthapuram ward still lacks heat — down from the six the per-city
  pipeline could never resolve, but not zero.

- **Ward boundaries carry the delimitation date of whatever the ULB uploaded**,
  which is not the same year everywhere.

See also: [Ward-Level Atlas](ward-map.md) · [Data Sources Overview](overview.md) ·
[Roadmap](../wiki/Roadmap.md).
