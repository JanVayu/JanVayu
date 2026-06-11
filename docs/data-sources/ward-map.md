# Ward-Level Atlas — Data & Methodology

The **Ward-Level Atlas** ("How Polluted Is Your Ward?", under *City Data*) colours every municipal ward of a city, with four switchable layers. This page documents where each layer's data comes from and how it is computed.

The atlas moves JanVayu from **city-level** to **ward-level** resolution — making the point that a single city AQI number hides large differences between neighbourhoods. It was inspired by Vaishnavi Iyer / Unmapped's "How hot is your ward?" maps of Bengaluru.

---

## Cities & ward boundaries

9 of India's top-10 cities are live (Surat is pending an open boundary file):

| City | Wards | Boundary source |
|------|-------|-----------------|
| Delhi | 290 | DataMeet |
| Mumbai | 227 | Mumbai spatial-data project (electoral wards 2017) |
| Bengaluru | 243 | DataMeet (BBMP) |
| Chennai | 201 | DataMeet (GCC) |
| Hyderabad | 145 | DataMeet (GHMC) |
| Kolkata | 141 | DataMeet (KMC) |
| Jaipur | 77 | DataMeet |
| Pune | 58 | DataMeet (electoral wards 2022) |
| Ahmedabad | 48 | DataMeet (AMC) |

Boundaries are simplified with shapely (topology-preserving, ~35 m tolerance), coordinate precision rounded, and an inside-polygon representative point baked in for label/interpolation use. Each city's processed file lives at `/data/wards/<city>.json` and is lazy-loaded only when the panel opens.

Sources: [DataMeet Municipal Spatial Data](https://github.com/datameet/Municipal_Spatial_Data) (CC BY) and the [Mumbai spatial-data project](https://github.com/sanjanakrishnan/mumbai_spatial_data).

---

## The four layers

| Layer | Source | Resolution | Type | Notes |
|-------|--------|-----------|------|-------|
| **Air quality** (PM2.5) | CPCB / WAQI live monitors | station network | Live, interpolated | Inverse-distance-weighted from the city's live stations to each ward centroid. Shows the citywide *spread*, not a calibrated per-street reading; sharper where there are more monitors. |
| **Heat** | USGS/NASA Landsat 8/9 (C2 L2) surface temperature | ~30 m | Satellite, per-city snapshot | Land-surface temperature on a clear-sky hot-season afternoon. The scene date is stored per city (`lst_date`). Surface temp runs hotter than air temp. Colours are scaled within each city. |
| **Green cover** | ESA WorldCover 2021 | 10 m | Satellite, annual | Share of each ward classified as vegetation (tree, shrub, grass, cropland, wetland). |
| **Built-up** | ESA WorldCover 2021 | 10 m | Satellite, annual | Share of each ward classified as built / impervious surface. |

Sources: [ESA WorldCover](https://esa-worldcover.org/) (CC BY 4.0), [Landsat](https://www.usgs.gov/landsat-missions) via [Microsoft Planetary Computer](https://planetarycomputer.microsoft.com/).

---

## How the satellite layers are computed

The three satellite layers are computed **offline** and baked into each city's GeoJSON as per-ward properties (`green`, `built`, `lst`). The pipeline never downloads whole rasters:

1. **Windowed reads over cloud-optimized GeoTIFFs.** Using `rasterio` with GDAL's `/vsicurl/`, only each city's bounding-box window is fetched from the remote COG — ESA WorldCover tiles on AWS S3, and the Landsat surface-temperature band signed anonymously via Planetary Computer.
2. **Zonal statistics.** Ward polygons are rasterized to a label grid aligned to the raster window; per-ward class shares (green/built) and mean surface temperature (heat) are computed with NumPy `bincount`.
3. **Heat scene selection.** For each city, a STAC search picks the lowest-cloud Landsat 8/9 scene in the hot season whose footprint covers the city; clouds are masked via the `QA_PIXEL` band.

The **air-quality** layer is *not* baked in — it is interpolated live in the browser each time the panel loads, from the WAQI bounds endpoint.

---

## Honesty notes

- **Air quality is interpolated, not measured per ward.** India has no ward-dense ground network; the layer reveals the spread, not a per-street value. This is labelled on the panel. Satellite-derived per-ward PM2.5 is the planned upgrade (see the [Roadmap](../wiki/Roadmap.md), Phase 11).
- **Heat is a single hot-season day**, not an annual average — a snapshot of surface temperature, useful for relative comparison between wards within a city.
- **Green/built-up are 2021 annual** land cover and may lag very recent construction.

See also: [Data Sources Overview](overview.md) · [Real-Time AQI (WAQI)](waqi.md).
