# The Boundary Map — every Indian administrative level, on one map

The [live map](https://www.janvayu.in/#map) has a **Boundaries** menu covering
the whole administrative hierarchy of India, and a **Colour** menu choosing what
the polygons are shaded by. This page documents where those numbers come from.

It is a different data path from the [Ward-Level Atlas](ward-map.md), which is
the older per-city panel. The panel bakes values into one GeoJSON per city; the
boundary map reads national PMTiles archives with per-feature properties baked
in. Where the two disagree, they disagree because they were computed
differently, and this page says how.

---

## The levels

| Level | Features | Source | Zooms |
|-------|---------:|--------|-------|
| State / UT | 36 | LGD | 0–7 |
| District (zila) | 785 | LGD | 3–9 |
| Block / mandal / tehsil | 6,471 | LGD | 5–11 |
| Gram panchayat | 319,287 | LGD | 6–10 |
| Village | 584,615 | LGD | 7–12 |
| City / ULB | 3,368 | SBM | 5–12 |
| Ward | 70,417 | SBM + AMRUT + Living Atlas | 9–13 |

Boundaries via [ramSeraph/indian_admin_boundaries](https://github.com/ramSeraph/indian_admin_boundaries),
which republishes LGD and Swachh Bharat Mission geometries.

Each level is one PMTiles archive in `data/tiles/`. The browser issues HTTP
range requests for only the byte ranges covering what is on screen — rendering
Delhi NCR styles about 700 wards from roughly 120 KB of a 36 MB archive.

Villages are the exception: their archive is 267 MB, over GitHub's 100 MB file
limit, so that level still loads through the older per-district TopoJSON path.
Same menu entry, different loader underneath.

---

## What the colours mean

| Colour | Source | Resolution | Levels | Notes |
|--------|--------|-----------|--------|-------|
| **Air** (annual PM2.5) | SatPM2.5 V6GL03 (ACAG / Washington University) | ~1 km | all | 2024 annual mean. A CNN over satellite AOD plus GEOS-Chem, calibrated against ground monitors. |
| **Surface heat** | Landsat 8/9 Collection 2 Level 2 | ~110 m | all but village | Mean land-surface temperature across the 2026 pre-monsoon season, from a national mosaic. |
| **Green cover** | ESA WorldCover 2021 | 10 m | ward | Share classified as vegetation — tree, shrub, grass, cropland, wetland. |
| **Built-up** | ESA WorldCover 2021 | 10 m | ward | Share classified as built / impervious surface. |

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
| City / ULB | 3,364 / 3,368 (99.9%) |
| Ward | 70,306 / 70,417 (99.8%) |

---

## How green cover and built-up are computed

`scripts/build-ward-landcover-national.py` reads ESA WorldCover 2021 as
windowed `/vsicurl` reads over the remote COGs — no bulk download — and counts
class shares per ward with the same rasterise-and-bincount pass.

**70,368 of 70,417 wards (99.93%)** have green and built-up values. Reaching
that took two passes: the first left 4,046 wards short, because the script
deliberately gives up on wards it cannot read rather than losing their
neighbours to a bisection, and those failures are transient. `--fill` retries
only the wards still missing a value and recovered 3,997 of them.

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

- **Green cover and built-up exist for wards only, so far.** Choosing them at
  another level colours by annual air instead, and the map says so rather than
  drawing a grey map with no explanation.

- **Land cover is 2021** and may lag very recent construction.

- **The remaining gaps are real gaps.** 111 wards have no heat value and 49 have
  no land cover; they draw uncoloured rather than filled with a guess. One
  Thiruvananthapuram ward still lacks heat — down from the six the per-city
  pipeline could never resolve, but not zero.

- **Ward boundaries carry the delimitation date of whatever the ULB uploaded**,
  which is not the same year everywhere.

See also: [Ward-Level Atlas](ward-map.md) · [Data Sources Overview](overview.md) ·
[Roadmap](../wiki/Roadmap.md).
