# Ward-Level Atlas — Data & Methodology

The **Ward-Level Atlas** ("How Polluted Is Your Ward?", under *City Data*) colours every municipal ward of a city, with five switchable layers. This page documents where each layer's data comes from and how it is computed.

The atlas moves JanVayu from **city-level** to **ward-level** resolution — making the point that a single city AQI number hides large differences between neighbourhoods. It was inspired by Vaishnavi Iyer / Unmapped's "How hot is your ward?" maps of Bengaluru.

---

## Cities & ward boundaries

**90 cities, 6,596 wards** are live. The list is not a curated shortlist — it is everything we could find an openly-licensed ward boundary for.

Boundaries come from four different upstreams with four different licences, so each city's file records the source it actually came from in a `source` field, and the atlas prints that credit under the map for whichever city is on screen. `raster` marks the 39 cities the heat / green / built-up pipeline has been run for; the two air layers exist for all 90.

| City | Wards | Boundary source | raster |
|------|-------|-----------------|--------|
| Delhi | 290 | DataMeet | yes |
| Bengaluru | 243 | DataMeet | yes |
| Mumbai | 227 | Mumbai spatial-data project | yes |
| Chennai | 201 | DataMeet | yes |
| Jodhpur | 160 | Swachh Bharat Mission | yes |
| Kota | 150 | Swachh Bharat Mission | yes |
| Hyderabad | 145 | DataMeet | yes |
| Kolkata | 141 | DataMeet | yes |
| Chhatrapati Sambhajinagar | 115 | Swachh Bharat Mission | — |
| Lucknow | 112 | DataMeet | yes |
| Navi Mumbai | 111 | Swachh Bharat Mission | — |
| Coimbatore | 100 | Swachh Bharat Mission | yes |
| Dehradun | 100 | Swachh Bharat Mission | yes |
| Prayagraj | 100 | Swachh Bharat Mission | yes |
| Thiruvananthapuram | 100 | Swachh Bharat Mission | — |
| Agra | 99 | Swachh Bharat Mission | yes |
| Varanasi | 99 | Varanasi Smart City ArcGIS | yes |
| Ghaziabad | 94 | Swachh Bharat Mission | yes |
| Ludhiana | 94 | Swachh Bharat Mission | yes |
| Visakhapatnam | 91 | Swachh Bharat Mission | yes |
| Meerut | 90 | Swachh Bharat Mission | yes |
| Bhopal | 86 | DataMeet | yes |
| Amritsar | 85 | Swachh Bharat Mission | yes |
| Indore | 85 | Swachh Bharat Mission | yes |
| Gorakhpur | 81 | Swachh Bharat Mission | — |
| Ajmer | 80 | Swachh Bharat Mission | — |
| Aligarh | 80 | Swachh Bharat Mission | — |
| Bareilly | 80 | Swachh Bharat Mission | — |
| Bikaner | 80 | Swachh Bharat Mission | — |
| Jalandhar | 80 | Swachh Bharat Mission | yes |
| Jabalpur | 79 | Swachh Bharat Mission | — |
| Jaipur | 77 | DataMeet | yes |
| Jammu | 75 | Swachh Bharat Mission | — |
| Kochi | 74 | Swachh Bharat Mission | — |
| Patna | 71 | Swachh Bharat Mission | yes |
| Firozabad | 70 | Swachh Bharat Mission | — |
| Moradabad | 70 | Swachh Bharat Mission | yes |
| Raipur | 70 | Swachh Bharat Mission | yes |
| Udaipur | 70 | Swachh Bharat Mission | — |
| Bhubaneswar | 67 | Swachh Bharat Mission | — |
| Hubballi | 67 | Swachh Bharat Mission | — |
| Gwalior | 66 | Swachh Bharat Mission | yes |
| Alwar | 65 | Swachh Bharat Mission | — |
| Mysuru | 65 | Swachh Bharat Mission | — |
| Vijayawada | 64 | Swachh Bharat Mission | — |
| Bhiwadi | 60 | Swachh Bharat Mission | — |
| Erode | 60 | Swachh Bharat Mission | — |
| Guwahati | 60 | OpenCity / Oorvani (BharatLas) | — |
| Mangaluru | 60 | Swachh Bharat Mission | — |
| Nizamabad | 60 | Swachh Bharat Mission | — |
| Patiala | 60 | Swachh Bharat Mission | — |
| Salem | 60 | Swachh Bharat Mission | — |
| Thoothukudi | 60 | Swachh Bharat Mission | — |
| Cuttack | 59 | Swachh Bharat Mission | — |
| Kanpur | 58 | DataMeet | yes |
| Pune | 58 | DataMeet | yes |
| Belagavi | 57 | Swachh Bharat Mission | — |
| Guntur | 57 | Swachh Bharat Mission | — |
| Dhanbad | 55 | Swachh Bharat Mission | — |
| Kollam | 55 | Swachh Bharat Mission | — |
| Thrissur | 55 | Swachh Bharat Mission | — |
| Nellore | 54 | Swachh Bharat Mission | — |
| Ujjain | 54 | Swachh Bharat Mission | — |
| Gaya | 53 | Swachh Bharat Mission | — |
| Ranchi | 53 | Swachh Bharat Mission | yes |
| Kurnool | 52 | Swachh Bharat Mission | — |
| Bathinda | 50 | Swachh Bharat Mission | — |
| Bhagalpur | 50 | Swachh Bharat Mission | — |
| Kalaburagi | 50 | Swachh Bharat Mission | — |
| Ahmedabad | 48 | DataMeet | yes |
| Muzaffarpur | 48 | Swachh Bharat Mission | yes |
| Faridabad | 40 | DataMeet | yes |
| Tirupati | 39 | Swachh Bharat Mission | — |
| Nagpur | 38 | Swachh Bharat Mission | yes |
| Puducherry | 33 | Swachh Bharat Mission | — |
| Thane | 33 | Swachh Bharat Mission | — |
| Panaji (Goa) | 30 | Swachh Bharat Mission | — |
| Surat | 30 | Swachh Bharat Mission | yes |
| Chandigarh | 28 | DataMeet | yes |
| Panipat | 26 | Swachh Bharat Mission | — |
| Solapur | 26 | Swachh Bharat Mission | — |
| Nashik | 23 | Swachh Bharat Mission | yes |
| Amravati | 22 | Swachh Bharat Mission | — |
| Rohtak | 22 | Swachh Bharat Mission | — |
| Hisar | 20 | Swachh Bharat Mission | — |
| Sonipat | 20 | Swachh Bharat Mission | — |
| Gangtok | 19 | Swachh Bharat Mission | — |
| Rajkot | 18 | Swachh Bharat Mission | yes |
| Vadodara | 18 | Swachh Bharat Mission | yes |
| Jamnagar | 16 | Swachh Bharat Mission | — |

### The four upstreams

| Source | Cities | Licence | How we get it |
|--------|--------|---------|---------------|
| [Swachh Bharat Mission](https://indianopenmaps.com) ULB wards | 74 | flagged "not-so-open" on the mirror; sourced from a government portal | `scripts/fetch-openmaps.mjs wards` — every urban local body uploaded its own ward map to SBM; the community mirror by ramSeraph makes the 3,675-ULB, 70,416-polygon national release fetchable |
| [DataMeet Municipal Spatial Data](https://github.com/datameet/Municipal_Spatial_Data) | 13 | CC BY | hand-collected, the original atlas cities |
| [OpenCity / Oorvani Foundation](https://bharatlas.com) via BharatLas | 1 (Guwahati) | **ODbL-1.0** | `scripts/import-bharatlas-wards.mjs` |
| [Mumbai spatial-data project](https://github.com/sanjanakrishnan/mumbai_spatial_data) · Varanasi Smart City ArcGIS | 2 | open / official | hand-collected |

Boundaries are simplified with Douglas–Peucker at ~28 m tolerance (shared helpers in `scripts/lib/geo.mjs`, so both importers produce byte-identical geometry for the same input), coordinate precision rounded, and an area-weighted centroid baked in for label and interpolation use. Each city's processed file lives at `/data/wards/<city>.json` and is lazy-loaded only when the panel opens.

### What is still missing, and why

Swachh Bharat is a national release but not a complete one. Whole states publish no ULB wards in it: **West Bengal, Assam, Manipur, Mizoram and Tripura**. That is why Kolkata still comes from DataMeet rather than SBM, and why Guwahati needed a separate importer and a separate licence.

Checked, and not usable, for the Bengal gap: OpenStreetMap carries only 38 `admin_level` 9/10 relations in all of West Bengal and they are villages rather than municipal wards; DataMeet's collection covers 31 cities with Kolkata the only Bengal one. So beyond Kolkata, Bengal's municipal wards are not openly available at the time of writing. If you know of a source, [contribute@janvayu.in](mailto:contribute@janvayu.in).

A second, softer gap: a few ULBs uploaded coarse revenue wards rather than true municipal wards — Jamnagar (16), Rajkot and Vadodara (18 each) are the thinnest. We show what they published rather than dropping them, and the importer warns below 15 wards.

---

## The five layers

| Layer | Source | Resolution | Type | Notes |
|-------|--------|-----------|------|-------|
| **Air quality** (PM2.5) | CPCB / WAQI live monitors | station network | Live, interpolated | Inverse-distance-weighted from the city's live stations to each ward centroid. Shows the citywide *spread*, not a calibrated per-street reading; sharper where there are more monitors. |
| **Air, yearly** (PM2.5) | SatPM2.5 V6GL03 (ACAG / Washington University) | ~1 km | Satellite, annual | Annual mean PM2.5 for 2024 (`pma`), computed offline by `scripts/build-village-pm25.py --target wards`. A CNN over satellite AOD plus GEOS-Chem, calibrated against ground monitors. Shaded *within* each city, with absolute µg/m³ endpoints in the legend. |
| **Heat** | USGS/NASA Landsat 8/9 (C2 L2) surface temperature | ~30 m | Satellite, per-city snapshot | Land-surface temperature on a clear-sky hot-season afternoon. The scene date is stored per city (`lst_date`). Surface temp runs hotter than air temp. Colours are scaled within each city. |
| **Green cover** | ESA WorldCover 2021 | 10 m | Satellite, annual | Share of each ward classified as vegetation (tree, shrub, grass, cropland, wetland). |
| **Built-up** | ESA WorldCover 2021 | 10 m | Satellite, annual | Share of each ward classified as built / impervious surface. |

Sources: [ESA WorldCover](https://esa-worldcover.org/) (CC BY 4.0), [Landsat](https://www.usgs.gov/landsat-missions) via [Microsoft Planetary Computer](https://planetarycomputer.microsoft.com/), [SatPM2.5 V6GL03](https://sites.wustl.edu/acag/datasets/surface-pm2-5/) (CC BY 4.0).

---

## How the satellite layers are computed

The satellite layers are computed **offline** and baked into each city's GeoJSON as per-ward properties (`green`, `built`, `lst`, `pma`). The pipeline never downloads whole rasters:

1. **Windowed reads over cloud-optimized GeoTIFFs.** Using `rasterio` with GDAL's `/vsicurl/`, only each city's bounding-box window is fetched from the remote COG — ESA WorldCover tiles on AWS S3, and the Landsat surface-temperature band signed anonymously via Planetary Computer.
2. **Zonal statistics.** Ward polygons are rasterized to a label grid aligned to the raster window; per-ward class shares (green/built), mean surface temperature (heat) and mean annual PM2.5 are computed with NumPy `bincount`. Wards smaller than a raster cell fall back to a centroid sample.
3. **Heat scene selection.** For each city, a STAC search picks the lowest-cloud Landsat 8/9 scene in the hot season whose footprint covers the city; clouds are masked via the `QA_PIXEL` band.

The **live air-quality** layer is *not* baked in — it is interpolated in the browser each time the panel loads, from the WAQI bounds endpoint. The annual figures are also mirrored into `netlify/functions/data/ward-stats.json` so Ask JanVayu can answer ward questions.

---

## Honesty notes

- **The two air layers are different timescales and must not be merged.** "Air quality" is a live snapshot; "Air, yearly" is a 2024 annual mean. Only the annual one can honestly be compared with heat, green and built-up, because only it describes the same slow timescale.
- **Live air is interpolated, not measured per ward.** India has no ward-dense ground network; the layer reveals the spread, not a per-street value. This is labelled on the panel.
- **The annual layer is modelled, and ~1 km smooths hyperlocal sources.** A single kiln, smelter or busy junction next door will not show up in it, and it is calibrated against ground monitors rather than measured in that ward.
- **Heat is a single hot-season day**, not an annual average — a snapshot of surface temperature, useful for relative comparison between wards within a city.
- **Green/built-up are 2021 annual** land cover and may lag very recent construction.
- **Ward boundaries carry the delimitation date of whatever the ULB uploaded**, which is not the same year everywhere. Guwahati is the 2022 delimitation; several SBM cities are older.

See also: [Data Sources Overview](overview.md) · [Real-Time AQI (WAQI)](waqi.md) · [Roadmap](../wiki/Roadmap.md).
