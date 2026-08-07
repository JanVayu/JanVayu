# Ward-Level Atlas — Data & Methodology

The **Ward-Level Atlas** ("How Polluted Is Your Ward?", under *City Data*) colours every municipal ward of a city, with five switchable layers. This page documents where each layer's data comes from and how it is computed.

The atlas moves JanVayu from **city-level** to **ward-level** resolution — making the point that a single city AQI number hides large differences between neighbourhoods. It was inspired by Vaishnavi Iyer / Unmapped's "How hot is your ward?" maps of Bengaluru.

---

## Cities & ward boundaries

**142 cities, 9,015 wards** are live, and **every state and union-territory capital is now mapped**. The list is not a curated shortlist — it is everything we could find an openly-licensed ward boundary for.

Boundaries come from six upstreams with different licences, so each city's file records the source it actually came from in a `source` field, and the atlas prints that credit under the map for whichever city is on screen. All five layers cover all 142 cities.

| City | Wards | Boundary source |
|------|-------|-----------------|
| Delhi | 290 | DataMeet |
| Bengaluru | 243 | DataMeet |
| Mumbai | 227 | Mumbai spatial-data project |
| Chennai | 201 | DataMeet |
| Jodhpur | 160 | Swachh Bharat Mission |
| Kota | 150 | Swachh Bharat Mission |
| Hyderabad | 145 | DataMeet |
| Kolkata | 141 | DataMeet |
| Kalyan-Dombivli | 123 | ESRI India Living Atlas |
| Chhatrapati Sambhajinagar | 115 | Swachh Bharat Mission |
| Lucknow | 112 | DataMeet |
| Navi Mumbai | 111 | Swachh Bharat Mission |
| Asansol | 106 | WB AMRUT GIS master plans |
| Kakinada | 101 | ESRI India Living Atlas |
| Coimbatore | 100 | Swachh Bharat Mission |
| Dehradun | 100 | Swachh Bharat Mission |
| Madurai | 100 | ESRI India Living Atlas |
| Prayagraj | 100 | Swachh Bharat Mission |
| Thiruvananthapuram | 100 | Swachh Bharat Mission |
| Agra | 99 | Swachh Bharat Mission |
| Varanasi | 99 | Varanasi Smart City ArcGIS |
| Ghaziabad | 94 | Swachh Bharat Mission |
| Ludhiana | 94 | Swachh Bharat Mission |
| Visakhapatnam | 91 | Swachh Bharat Mission |
| Meerut | 90 | Swachh Bharat Mission |
| Bhopal | 86 | DataMeet |
| Amritsar | 85 | Swachh Bharat Mission |
| Indore | 85 | Swachh Bharat Mission |
| Gorakhpur | 81 | Swachh Bharat Mission |
| Kolhapur | 81 | ESRI India Living Atlas |
| Ajmer | 80 | Swachh Bharat Mission |
| Aligarh | 80 | Swachh Bharat Mission |
| Bareilly | 80 | Swachh Bharat Mission |
| Bikaner | 80 | Swachh Bharat Mission |
| Jalandhar | 80 | Swachh Bharat Mission |
| Jabalpur | 79 | Swachh Bharat Mission |
| Jaipur | 77 | DataMeet |
| Jammu | 75 | Swachh Bharat Mission |
| Srinagar | 75 | ESRI India Living Atlas |
| Kochi | 74 | Swachh Bharat Mission |
| Patna | 71 | Swachh Bharat Mission |
| Bhilai | 70 | ESRI India Living Atlas |
| Firozabad | 70 | Swachh Bharat Mission |
| Moradabad | 70 | Swachh Bharat Mission |
| Raipur | 70 | Swachh Bharat Mission |
| Saharanpur | 70 | ESRI India Living Atlas |
| Udaipur | 70 | Swachh Bharat Mission |
| Bhubaneswar | 67 | Swachh Bharat Mission |
| Hubballi | 67 | Swachh Bharat Mission |
| Korba | 67 | ESRI India Living Atlas |
| Warangal | 67 | ESRI India Living Atlas |
| Bilaspur | 66 | ESRI India Living Atlas |
| Gwalior | 66 | Swachh Bharat Mission |
| Alwar | 65 | Swachh Bharat Mission |
| Mysuru | 65 | Swachh Bharat Mission |
| Vijayawada | 64 | Swachh Bharat Mission |
| Bhiwadi | 60 | Swachh Bharat Mission |
| Erode | 60 | Swachh Bharat Mission |
| Guwahati | 60 | OpenCity / Oorvani (BharatLas) |
| Jhansi | 60 | ESRI India Living Atlas |
| Mangaluru | 60 | Swachh Bharat Mission |
| Nizamabad | 60 | Swachh Bharat Mission |
| Patiala | 60 | Swachh Bharat Mission |
| Salem | 60 | Swachh Bharat Mission |
| Thoothukudi | 60 | Swachh Bharat Mission |
| Vizianagaram | 60 | ESRI India Living Atlas |
| Cuttack | 59 | Swachh Bharat Mission |
| Kanpur | 58 | DataMeet |
| Pune | 58 | DataMeet |
| Belagavi | 57 | Swachh Bharat Mission |
| Guntur | 57 | Swachh Bharat Mission |
| Dhanbad | 55 | Swachh Bharat Mission |
| Kollam | 55 | Swachh Bharat Mission |
| Thrissur | 55 | Swachh Bharat Mission |
| Nellore | 54 | Swachh Bharat Mission |
| Ujjain | 54 | Swachh Bharat Mission |
| Gaya | 53 | Swachh Bharat Mission |
| Ranchi | 53 | Swachh Bharat Mission |
| Kurnool | 52 | Swachh Bharat Mission |
| Agartala | 51 | ESRI India Living Atlas |
| Bathinda | 50 | Swachh Bharat Mission |
| Bhagalpur | 50 | Swachh Bharat Mission |
| Howrah | 50 | WB AMRUT GIS master plans |
| Kalaburagi | 50 | Swachh Bharat Mission |
| Sagar | 50 | ESRI India Living Atlas |
| Ratlam | 49 | ESRI India Living Atlas |
| Ahmedabad | 48 | DataMeet |
| Muzaffarpur | 48 | Swachh Bharat Mission |
| Bihar Sharif | 46 | ESRI India Living Atlas |
| Satna | 46 | ESRI India Living Atlas |
| Arrah | 45 | ESRI India Living Atlas |
| Davanagere | 45 | ESRI India Living Atlas |
| Katihar | 45 | ESRI India Living Atlas |
| Murwara | 45 | ESRI India Living Atlas |
| Durgapur | 43 | WB AMRUT GIS master plans |
| Vasai-Virar | 43 | ESRI India Living Atlas |
| Bidhannagar | 42 | WB AMRUT GIS master plans |
| Silchar | 42 | ESRI India Living Atlas |
| Raurkela | 41 | ESRI India Living Atlas |
| Faridabad | 40 | DataMeet |
| Naya Raipur | 40 | ESRI India Living Atlas |
| Sasaram | 40 | ESRI India Living Atlas |
| Damoh | 39 | ESRI India Living Atlas |
| Tirupati | 39 | Swachh Bharat Mission |
| Nagpur | 38 | Swachh Bharat Mission |
| Siwan | 38 | ESRI India Living Atlas |
| Bardhaman | 35 | WB AMRUT GIS master plans |
| Gurugram | 35 | ESRI India Living Atlas |
| Kharagpur | 35 | WB AMRUT GIS master plans |
| Shivamogga | 35 | ESRI India Living Atlas |
| Tumakuru | 35 | ESRI India Living Atlas |
| Puducherry | 33 | Swachh Bharat Mission |
| Thane | 33 | Swachh Bharat Mission |
| Pimpri Chinchwad | 32 | ESRI India Living Atlas |
| Thanesar | 32 | ESRI India Living Atlas |
| Nanded-Waghala | 31 | ESRI India Living Atlas |
| Panaji (Goa) | 30 | Swachh Bharat Mission |
| Surat | 30 | Swachh Bharat Mission |
| Haldia | 29 | WB AMRUT GIS master plans |
| Chandigarh | 28 | DataMeet |
| Imphal | 28 | ESRI India Living Atlas |
| Shillong | 27 | ESRI India Living Atlas |
| Panipat | 26 | Swachh Bharat Mission |
| Solapur | 26 | Swachh Bharat Mission |
| Shimla | 25 | ESRI India Living Atlas |
| Port Blair | 24 | ESRI India Living Atlas |
| Nashik | 23 | Swachh Bharat Mission |
| Amravati | 22 | Swachh Bharat Mission |
| Rohtak | 22 | Swachh Bharat Mission |
| Ambala | 20 | ESRI India Living Atlas |
| Hisar | 20 | Swachh Bharat Mission |
| Itanagar | 20 | ESRI India Living Atlas |
| Karnal | 20 | ESRI India Living Atlas |
| Sonipat | 20 | Swachh Bharat Mission |
| Aizawl | 19 | ESRI India Living Atlas |
| Gangtok | 19 | Swachh Bharat Mission |
| Kohima | 19 | ESRI India Living Atlas |
| Rajkot | 18 | Swachh Bharat Mission |
| Vadodara | 18 | Swachh Bharat Mission |
| Dharamshala | 17 | ESRI India Living Atlas |
| Jamnagar | 16 | Swachh Bharat Mission |
| Silvassa | 15 | ESRI India Living Atlas |

### The six upstreams

| Source | Cities | Licence | How we get it |
|--------|--------|---------|---------------|
| [Swachh Bharat Mission](https://indianopenmaps.com) ULB wards | 74 | flagged "not-so-open" on the mirror; sourced from a government portal | `scripts/fetch-openmaps.mjs wards` — every urban local body uploaded its own ward map to SBM; the community mirror by ramSeraph makes the 3,675-ULB, 70,416-polygon national release fetchable |
| [DataMeet Municipal Spatial Data](https://github.com/datameet/Municipal_Spatial_Data) | 13 | CC BY | hand-collected, the original atlas cities |
| **ESRI India Living Atlas wards**, via indianopenmaps.com | 45 | same "not-so-open" mirror as SBM | `scripts/import-livingatlas-wards.mjs` — 9,100 wards across 157 towns, and unlike SBM it reaches every state. This is what finally mapped Srinagar, Agartala, Imphal, Shillong, Itanagar, Aizawl, Kohima and Madurai |
| **West Bengal [AMRUT](https://amrut.mohua.gov.in/) GIS master plans**, via indianopenmaps.com | 7 | same "not-so-open" mirror as SBM | `scripts/import-wb-amrut-wards.mjs` — 1,633 ward polygons across 52 WB urban local bodies, from the AMRUT GIS master-plan programme |
| [OpenCity / Oorvani Foundation](https://bharatlas.com) via BharatLas | 1 (Guwahati) | **ODbL-1.0** | `scripts/import-bharatlas-wards.mjs` |
| [Mumbai spatial-data project](https://github.com/sanjanakrishnan/mumbai_spatial_data) · Varanasi Smart City ArcGIS | 2 | open / official | hand-collected |

Boundaries are simplified with Douglas–Peucker at ~28 m tolerance (shared helpers in `scripts/lib/geo.mjs`, so both importers produce byte-identical geometry for the same input), coordinate precision rounded, and an area-weighted centroid baked in for label and interpolation use. Each city's processed file lives at `/data/wards/<city>.json` and is lazy-loaded only when the panel opens.

### What is still missing, and why

**Every state and union-territory capital is now mapped.** Seven of them arrived only with the Living Atlas layer, having never had a ward map here: Srinagar, Agartala, Imphal, Shillong, Itanagar, Aizawl and Kohima.

**The correction that produced most of this page.** For a while this page, the roadmap and a published blog post all said that whatever Swachh Bharat lacked was not openly available — West Bengal in particular. That was wrong three times over, and always the same way. We were downloading exactly one asset (`SBM_Wards.geojsonl.7z`) out of a GitHub release that also contains `WB_AMRUT_Wards` and `LivingAtlas_Wards`, and treating the gap in that one file as a gap in the world. Enumerating the release added West Bengal (7 cities) and then 45 more, including every capital we had written off. When a source looks absent, list the container before concluding anything.

**Siliguri** is the one genuine hole left among large cities, and it is now well-evidenced rather than assumed: absent from Swachh Bharat; 4 wards of 47 in the West Bengal AMRUT upload, which is a partial record rather than a city; and absent from the Living Atlas layer. The Siliguri Jalpaiguri Development Authority publishes only mouza (revenue village) maps as PDFs for two rural blocks — the wrong unit, the wrong format, and the wrong area — and our village layer already carries those same mouzas as vector polygons with annual PM2.5.

A softer gap: a few ULBs uploaded coarse revenue wards rather than true municipal wards — Silvassa (15), Jamnagar (16), Rajkot and Vadodara (18 each) are the thinnest. We show what they published rather than dropping them, and the importers warn below 15 wards.

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
- **Ward boundaries carry the delimitation date of whatever the ULB uploaded**, which is not the same year everywhere. Guwahati is the 2022 delimitation; several SBM cities are older, and the West Bengal AMRUT layer dates from that programme's master-plan surveys rather than the latest delimitation.
- **Six wards in Thiruvananthapuram have no heat value** (6 of 100), and the reason is not cloud, which is what we first assumed. Those wards sit in a Landsat coverage seam at the northern edge of every scene available for the city: checked across 8 pre-monsoon and 6 full-year scenes, each returns roughly 5,500 masked pixels containing zero valid data. Fixing it requires mosaicking two Landsat paths, which this pipeline does not yet do. Those wards draw uncoloured rather than filled with a guess.
- **Heat gaps are filled across scenes.** If the clearest scene leaves wards without a value, the next-clearest scenes are tried until none are left. Where more than one scene contributed, the dates are recorded in `lst_dates`. Scene ranking prefers coverage over cloud, because a city that straddles two Landsat paths (Delhi sits across paths 46 and 47) would otherwise get a cloud-free scene that misses a fifth of it.

See also: [Data Sources Overview](overview.md) · [Real-Time AQI (WAQI)](waqi.md) · [Roadmap](../wiki/Roadmap.md).
