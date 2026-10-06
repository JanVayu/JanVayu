# Ward-Level Atlas: data and method

> **Retired in v26.6.151.** This panel no longer ships. Everything it did is on the [boundary map](boundary-map.md), for the whole country and not just 142 cities: annual PM2.5, surface heat, tree cover, green cover and built-up across all **68,596 wards**, plus six other administrative levels. Its correlation view moved too, and now compares any two of the five measures at any level, not the active layer against built-up inside one city. The `#ward-map` route still resolves, to a page pointing at the map, so existing links keep working.
>
> Before it was retired, the **14 cities it had that the national sources missed** were folded into the map's ward level: Kolkata, Madurai, Asansol, Warangal, Durgapur, Kharagpur, Bardhaman, Haldia, and the north-eastern capitals Agartala, Imphal, Shillong, Itanagar, Aizawl and Kohima. The per-city files remain in `data/wards/`.
>
> This page is kept as the record of how the panel's numbers were produced, because they differ from the map's. The panel's heat was a single clear-sky scene per city, and the map's is a national seasonal composite. Read what follows as history, not as a description of what is live.

The **Ward-Level Atlas** ("How Polluted Is Your Ward?", under *City Data*) coloured every municipal ward of a city, with five switchable layers. This page records where each layer's data came from and how it was computed.

The atlas moved JanVayu from city-level to ward-level resolution, to show that a single city AQI number hides large differences between neighbourhoods. It was inspired by Bengaluru urban-heat mapping by Vaishnavi Iyer of Unmapped.blr.

---

## Cities and ward boundaries

**142 cities and 9,015 wards** were live, and **every state and union-territory capital was mapped**. The list was not a curated shortlist. It was every city for which we could find an openly licensed ward boundary.

Boundaries come from six upstream sources with different licences, so each city's file records the source it actually came from, and the atlas printed that credit under the map for whichever city was on screen. All five layers covered all 142 cities.

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

### The six upstream sources

| Source | Cities | Licence | How it was obtained |
|--------|--------|---------|---------------|
| [Swachh Bharat Mission](https://indianopenmaps.com) ULB wards | 74 | flagged "not-so-open" on the mirror; sourced from a government portal | Every urban local body uploaded its own ward map to SBM, and a community mirror by ramSeraph makes the national release (3,675 ULBs, 70,416 polygons) fetchable |
| [DataMeet Municipal Spatial Data](https://github.com/datameet/Municipal_Spatial_Data) | 13 | CC BY | Hand-collected; the original atlas cities |
| **ESRI India Living Atlas wards**, via indianopenmaps.com | 45 | same "not-so-open" mirror as SBM | 9,100 wards across 157 towns, and unlike SBM it reaches every state. This is what finally mapped Srinagar, Agartala, Imphal, Shillong, Itanagar, Aizawl, Kohima and Madurai |
| **West Bengal [AMRUT](https://amrut.mohua.gov.in/) GIS master plans**, via indianopenmaps.com | 7 | same "not-so-open" mirror as SBM | 1,633 ward polygons across 52 West Bengal urban local bodies, from the AMRUT GIS master-plan programme |
| [OpenCity / Oorvani Foundation](https://bharatlas.com) via BharatLas | 1 (Guwahati) | **ODbL-1.0** | Imported from BharatLas |
| [Mumbai spatial-data project](https://github.com/sanjanakrishnan/mumbai_spatial_data) · Varanasi Smart City ArcGIS | 2 | open / official | Hand-collected |

Boundaries were simplified to about 28 m tolerance, with coordinates rounded and an area-weighted centre point stored for labels and interpolation. Each city's processed file lives at `/data/wards/<city>.json` and loaded only when the panel opened.

### What was still missing, and why

**Every state and union-territory capital was mapped.** Seven of them arrived only with the Living Atlas layer, having never had a ward map here: Srinagar, Agartala, Imphal, Shillong, Itanagar, Aizawl and Kohima.

**A correction that shaped this page.** For a while this page, the roadmap and a published blog post all said that whatever Swachh Bharat lacked was not openly available, West Bengal in particular. That was wrong three times over, and always in the same way. We were downloading exactly one file (`SBM_Wards.geojsonl.7z`) from a GitHub release that also contains `WB_AMRUT_Wards` and `LivingAtlas_Wards`, and treating the gap in that one file as a gap in the world. Listing the whole release added West Bengal (7 cities) and then 45 more, including every capital we had written off. When a source looks absent, list everything in the container before concluding anything.

**Siliguri** was the one real hole left among large cities, and the evidence is firm: it is absent from Swachh Bharat; it has 4 wards of 47 in the West Bengal AMRUT upload, which is a partial record and not a city; and it is absent from the Living Atlas layer. The Siliguri Jalpaiguri Development Authority publishes only mouza (revenue village) maps as PDFs for two rural blocks, which is the wrong unit, the wrong format and the wrong area. Our village layer already carries those same mouzas as polygons with annual PM2.5.

A smaller gap: a few ULBs uploaded coarse revenue wards instead of true municipal wards. Silvassa (15), Jamnagar (16), Rajkot and Vadodara (18 each) are the thinnest. We showed what they published and did not drop them.

---

## The five layers

| Layer | Source | Resolution | Type | Notes |
|-------|--------|-----------|------|-------|
| **Air quality** (PM2.5) | CPCB / WAQI live monitors | station network | Live, interpolated | Each ward's value is estimated from the city's live stations, weighted by distance to the ward's centre. It shows the *spread* across the city, not a calibrated street-level reading, and is sharper where there are more monitors. |
| **Air, yearly** (PM2.5) | SatPM2.5 V6GL03 (ACAG / Washington University) | ~1 km | Satellite, annual | Annual mean PM2.5 for 2024, computed ahead of time. A neural network over satellite aerosol data plus the GEOS-Chem atmospheric model, calibrated against ground monitors. Shaded *within* each city, with absolute µg/m³ endpoints in the legend. |
| **Heat** | USGS/NASA Landsat 8/9 (C2 L2) surface temperature | ~30 m | Satellite, per-city snapshot | Land-surface temperature on a clear-sky hot-season afternoon. The scene date is stored for each city. Surface temperature runs hotter than air temperature. Colours are scaled within each city. |
| **Green cover** | ESA WorldCover 2021 | 10 m | Satellite, annual | Share of each ward classified as vegetation (tree, shrub, grass, cropland, wetland). |
| **Built-up** | ESA WorldCover 2021 | 10 m | Satellite, annual | Share of each ward classified as built / impervious surface. |

Sources: [ESA WorldCover](https://esa-worldcover.org/) (CC BY 4.0), [Landsat](https://www.usgs.gov/landsat-missions) via [Microsoft Planetary Computer](https://planetarycomputer.microsoft.com/), [SatPM2.5 V6GL03](https://sites.wustl.edu/acag/datasets/surface-pm2-5/) (CC BY 4.0).

---

## How the satellite layers were computed

The satellite layers were computed ahead of time and stored with each city's ward boundaries. The pipeline never downloaded whole maps.

1. Reading only what was needed. For each city, only the rectangle covering it was fetched from the remote ESA WorldCover tiles and the Landsat surface-temperature band.
2. Averaging by ward. Each ward polygon was laid over the grid. For green cover and built-up, the share of the ward's pixels in each class was counted. For heat and annual PM2.5, the mean over the ward was taken. A ward smaller than one grid cell took the value at its centre.
3. Choosing the heat scene. For each city, the lowest-cloud Landsat 8/9 scene in the hot season that covered the city was picked, and cloud was masked out using the satellite's quality band.

The **live air-quality** layer was not stored. It was interpolated in the browser each time the panel loaded, from the WAQI bounds endpoint. The annual figures were also copied into a data file that Ask JanVayu reads, so it could answer ward questions.

---

## Cautions

The two air layers cover different timescales and must not be merged. "Air quality" is a live snapshot, and "Air, yearly" is a 2024 annual mean. Only the annual one can fairly be compared with heat, green and built-up, because only it describes the same slow timescale.

Live air is interpolated, not measured per ward. India has no ward-dense ground network. The layer shows the spread, not a street-level value, and the panel said so.

The annual layer is modelled, and ~1 km smooths hyperlocal sources. A single kiln, smelter or busy junction next door will not show up in it. It is calibrated against ground monitors and not measured in that ward.

Heat is a single hot-season day, not an annual average. It is a snapshot of surface temperature, useful for comparing wards within a city.

Green and built-up are 2021 annual land cover and may lag very recent construction.

Ward boundaries carry the delimitation date of whatever the ULB uploaded, which is not the same year everywhere. Guwahati is the 2022 delimitation, several SBM cities are older, and the West Bengal AMRUT layer dates from that programme's master-plan surveys, not the latest delimitation.

Six wards in Thiruvananthapuram have no heat value (6 of 100) *in this panel*. The [boundary map](boundary-map.md) resolves five of the six from a national Landsat mosaic, which is the fix this note called for, though the panel's own per-city method still has the gap. The cause is not cloud, as we first assumed. Those wards sit in a Landsat coverage seam at the northern edge of every scene available for the city. Across 8 pre-monsoon and 6 full-year scenes, each returns roughly 5,500 masked pixels containing zero valid data. Fixing it needs two Landsat paths joined together, which this method did not do. Those wards draw uncoloured, not filled with a guess.

Heat gaps were filled from other scenes. If the clearest scene left wards without a value, the next-clearest scenes were tried until none were left, and the dates were recorded where more than one scene contributed. Scenes were ranked by coverage first and cloud second, because a city that straddles two Landsat paths (Delhi sits across WRS-2 paths 146 and 147) would otherwise get a cloud-free scene that misses a fifth of it.

See also: [Data sources overview](overview.md) · [Real-time AQI (WAQI)](waqi.md) · [Roadmap](../wiki/Roadmap.md).
