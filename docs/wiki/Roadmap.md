# JanVayu Roadmap

Track progress on [GitHub Issues](https://github.com/JanVayu/JanVayu/issues) and the [Roadmap Issue (#34)](https://github.com/JanVayu/JanVayu/issues/34).

---

## Phase 5.23: Every village in India, and an annual number for each (✅ Completed — v26.6.131–134)

An early-August 2026 batch that takes the maps below the ward and answers the question the live monitor network structurally cannot.

- [x] **All 584,615 village boundaries** — LGD via [indianopenmaps.com](https://indianopenmaps.com) (`scripts/build-villages.mjs`), vendored as one quantized TopoJSON per district (645 files, 150 MB). Villages tile the plane, so TopoJSON's shared arcs cut ~40% versus GeoJSON *and* remove sliver gaps between neighbours. The client is viewport-driven: zoom 9+, only districts whose bbox intersects the view, capped at 14, unloading as they pan.
- [x] **Annual PM2.5 for every village** — SatPM2.5 V6GL03 (ACAG / Washington University: a convolutional neural network over satellite AOD + GEOS-Chem, ~1 km, CC BY 4.0, public AWS Open Data), zonal-averaged per village by `scripts/build-village-pm25.py`. **100% coverage** — the answer the ~565-station live network can never give. Villages are coloured by it, banded on the WHO guideline (5) and India's NAAQS limit (40) and split again above it, because 57% of villages fall between 40 and 60.
- [x] **Two timescales, never merged** — the popup shows the annual satellite figure *and*, separately, the live estimate from the nearest monitor (50 km capped, honest "no monitor close enough" beyond). Discloses that a ~1 km product smooths hyperlocal sources: Byrnihat reads far below its own ground station.
- [x] **Ask JanVayu knows about it** — a village/rural rule with the annual figures, the timescale warning and the smoothing caveat; the ward instruction's "JanVayu doesn't have annual PM2.5" claim corrected to be ward-specific.
- [x] **Walkthrough + blog updated** — a village slide in the long deck (36 → 37) and a line in the short deck, exports regenerated; the ["Every Village in India"](https://www.janvayu.in/blog/#/posts/2026-08-05-every-village-on-the-map) post revised once the annual layer landed.
- [x] **Two bugs found by driving a real browser** — every district got its own `L.canvas()` renderer, and Leaflet canvases don't let clicks fall through, so only the topmost district's villages were clickable; and `.topojson` is an extension Netlify doesn't recognise, so 645 files shipped as uncompressed `application/octet-stream` (1.44 MB instead of ~350 KB brotli'd).

**What this found:** not one of India's 584,615 villages meets the WHO annual guideline of 5 µg/m³, **63.6% (371,938) exceed India's own annual limit of 40**, and the median village sits at 43.7. The median *district* is 41.4 — above India's own standard.

- [x] **Annual per-ward PM2.5** *(v26.6.136)* — the follow-up this phase opened, closed the same day. Every ward carries an annual mean from the same grid, as a new **"Air, yearly"** layer, shaded within each city because a whole city usually sits inside one national band. This gives the heat / green / built-up layers a year-scale partner they never had, makes the ward-vs-built-up scatter like-for-like, and lets Ask JanVayu drop the "we don't have this" caveat.

- [x] **Ward Atlas 39 → 89 cities** *(v26.6.137)* — the second follow-up, also closed the same day. The cap was never air data, which now covers the whole country: it was a hand-written allowlist of 39 cities standing against a source holding **3,675 ULBs and 70,416 ward polygons**. Two batches add **50 cities / 2,850 wards** (now 89 / 6,536), matched by name *and* geography — a candidate ULB only qualifies if its ward centroids sit within 35 km of the city's coordinates, which is what stopped Chhattisgarh's "Durg" being imported as West Bengal's Durgapur. Fixed a source bug that had been silently dropping wards (SBM files one city under several spellings of its own state — Vijayawada imported 1 ward instead of 64), removed the `WARD_FILES` map that let a city be added and still fail silently, and generated the city selector from the data so its counts can't drift.

- [x] **Guwahati, and honest per-city attribution** *(v26.6.138)* — the third follow-up. Guwahati is a city with real winter pollution and no ward map, because Assam is one of the states SBM omits entirely. Its 60 wards (2022 GMC delimitation) come from **OpenCity / Oorvani Foundation via [BharatLas](https://bharatlas.com), ODbL-1.0** — a different upstream under a different licence, so it got its own importer (`scripts/import-bharatlas-wards.mjs`) rather than another row in the SBM allowlist. The atlas is now **90 cities / 6,596 wards**. Since the boundaries no longer share a licence, every ward file records the source it actually came from and the map prints that credit for whichever city is on screen — which meant backfilling the 14 hand-collected cities that had been shipping with no `source` at all. Also extracted the geometry helpers both importers rely on into `scripts/lib/geo.mjs`, after a hand-rolled Douglas–Peucker silently returned zero wards (on a closed ring the first and last point coincide, so a point-to-*line* distance degenerates; the repo's proven implementation measures to the clamped *segment*).

**What we checked and could not use for West Bengal:** OpenStreetMap has only 38 `admin_level` 9/10 relations in the whole state and they are villages, not municipal wards; DataMeet's collection covers 31 cities with Kolkata the only Bengal one. Beyond Kolkata, Bengal's municipal wards do not appear to be openly published at all.

- [x] **All five layers on all 97 cities, and West Bengal after all** *(v26.6.139)* — two things closed together. First, `build-ward-satellite.py` was run for the 51 cities that had been shipping air-only: 51/51 complete, none below the 90% gate, so heat / green cover / built-up now cover every city rather than 39 of them. Second, **West Bengal**, which the previous entry recorded as having no open ward data.

  That claim was wrong, and worth recording honestly. We checked OpenStreetMap (38 `admin_level` 9/10 relations statewide, all villages rather than wards) and DataMeet (31 cities, Kolkata the only Bengal one), found nothing, and published "Bengal's municipal wards are not openly available" in the roadmap, the data doc and a blog post. What we never did was list the other assets in the GitHub release this pipeline already downloads from every run. **`WB_AMRUT_Wards.geojsonl.7z` sits in the same `urban` release as `SBM_Wards.geojsonl.7z`** — 1,633 ward polygons across 52 West Bengal ULBs, from the state's AMRUT GIS master-plan programme.

  Seven cities added (`scripts/import-wb-amrut-wards.mjs`): **Asansol 106, Howrah 50, Durgapur 43, Bidhannagar 42, Kharagpur 35, Bardhaman 35, Haldia 29** — 340 wards, taking the atlas to **97 cities / 6,936 wards**. Two upstream quirks needed handling: the `Name` column is unreliable (Asansol's 106 wards are all filed under the name "Ward No. 65"), so cities are keyed by `ULB_Code` and each is verified against expected coordinates before writing; and a ward can span several rows (Haldia: 58 rows, 29 wards), so rows are dissolved by ward number.

  **What Bengal shows:** Durgapur (63.0 µg/m³ annual mean) and Asansol (60.9) are markedly dirtier than Kolkata (49.1). The industrial belt, not the metro, is the state's worst air — a finding that was invisible while Kolkata was the only Bengal city on the map.

  Siliguri is still out: its AMRUT upload has 4 wards of 47, a partial record rather than a city.

- [x] **142 cities, every capital, and the release we never enumerated** *(v26.6.140)* — the roadmap item written one release earlier ("audit the other releases we already pull from") paid off immediately. The `urban` release we download `SBM_Wards` from also holds **`LivingAtlas_Wards`**: 9,100 wards across 157 towns from the ESRI India Living Atlas, reaching **every state**, including the five Swachh Bharat omits.

  45 cities added (`scripts/import-livingatlas-wards.mjs`), taking the atlas to **142 cities / 9,015 wards**. Deduplication is geographic rather than by name, because the town field spells the same place several ways — "Allahabad" for Prayagraj, "Aurangabad" for Chhatrapati Sambhajinagar, "Ahmadabad", "Vishakhapatanam", "Raurkela" — so a string match would have re-imported cities we already hold under a different name.

  **Every state and UT capital is now on the map.** Seven had never had one: Srinagar (75 wards), Agartala (51), Imphal (28), Shillong (27), Itanagar (20), Aizawl (19), Kohima (19). Plus Madurai (100) and Gurugram (35), both long-standing gaps.

  **What the new cities show:** **Agartala averages 61.3 µg/m³ a year — 2.5× the other Northeast capitals** (Itanagar 23.5, Aizawl 23.9, Kohima 24.0, Shillong 30.2, Imphal 31.3). The Northeast is not one air-quality story, and nobody could see that before. **Gurugram enters at 81.9**, the 4th dirtiest city in the atlas, completing NCR alongside Delhi (93.4), Ghaziabad (92.7) and Faridabad (83.4).

- [x] **All five layers on all 142 cities, and two heat bugs** *(v26.6.140)* — the raster pass was re-run for every city, not just the new ones, because the original 39 were still carrying values from 2023 scenes. Two real defects surfaced:

  **Scene ranking ignored coverage.** Delhi straddles Landsat paths 46 and 47, so no scene contains it; the fallback sorted by cloud alone and picked an 82.8%-coverage scene over a 99.3%-coverage one that was equally clear, leaving 54 wards unmeasured. Ranking now prefers coverage, then cloud. Delhi is 290/290 from a single scene.

  **Gaps were left rather than filled.** Wards without a value after the best scene are now retried against the next-clearest, with contributing dates recorded in `lst_dates`.

  Remaining: **6 of Thiruvananthapuram's 100 wards** have no heat value. This was first reported as residual cloud; it is not. They sit in a Landsat coverage seam — 8 pre-monsoon and 6 full-year scenes each return ~5,500 masked pixels with zero valid data. Mosaicking two paths would fix it.

- [x] **Ask JanVayu reaches the ward and village data it already had** *(v26.6.140)* — two gaps between the data and the chatbot. Rule 17 instructed the model to use each ward's annual satellite mean ("field `p` … USE THAT"), but `buildWardContext` never emitted it, so the model was told to use a number it was never shown. And village air was unreachable entirely — the function shipped only `ward-stats.json`, so rural questions got national averages. Now there is an annual-air block per city with a named ward's own annual mean and city rank, and a **district-level village dataset** (645 districts, 112 KB) built by `scripts/build-village-stats.mjs`. The district is the unit deliberately: a full village name index is ~79 MB, and 15% of India's village names occur in more than one district, so "Rampur" is not an address.

- [x] **One map, every boundary level** *(v26.6.145)* — the ward atlas and the village layer were two screens, so a reader had to know whether their place was a ward or a village to find the right one. A reader pointed this out; it was our data model leaking into the navigation. The live map now carries a single **Boundaries** menu: state → district → block/mandal/tehsil → gram panchayat → village, and city/ULB → ward.

  Six levels ship as **PMTiles** read by HTTP range request — verified Netlify returns 206 with correct `content-range` and no `content-encoding` before committing to it, since edge compression would silently break byte-range addressing. Delhi NCR at ward level: **671 wards across four cities from 109 KB**, against 224 KB for Delhi's 290 alone. Ward coverage goes from 142 cities to **all 70,417**; adds **319,287 gram panchayats** and **6,471 blocks**.

  **Three silent-failure bugs caught in the build**, the same class that has bitten this project repeatedly: all 584,615 villages would have shipped labelled with their *state* (a helpful fallback quietly picked the wrong column, nothing errored); every feature was buffered in memory before writing, echoing an earlier 4.4 GB blowup; and internal tile compression was disabled on a misreading of the CDN rule. The name-column fallback is gone entirely — the build stops and prints the real keys, because mislabelling the country is worse than failing.

  Also fixed the mobile map: the layer controls overlaid the map, wrapped to three rows, collided with the zoom buttons and clipped "Stations" to "ations". Below 700px they now sit above the map on one scrolling row.

- [x] **Heat and land cover go national, on the same map** *(v26.6.148)* — the unified map made the ward panel redundant except for four layers that only existed for 142 cities. Folding those in as-is would have shipped a green-cover layer that silently does nothing in the other 3,533 ULBs — the same "your town isn't in our list" failure the unified map had just removed. So both went national first.

  **Heat is now one raster, not 3,675 searches.** `build-lst-mosaic.py` composites 1,512 Landsat 8/9 scenes across 388 WRS path/rows into a single ~111 m national grid for the 2026 pre-monsoon season, and `build-boundary-heat.py` runs one zonal pass over it. Every level gets heat from the same pass: **state 100%, district 100%, block 99.8%, panchayat 99.9%, ULB 99.9%, ward 99.8%** — against a per-city pipeline that covered 142 cities and still left holes. It closes **"time-aware heat"** and **"mosaic two Landsat paths"** below: five of Thiruvananthapuram's six seam wards now have a value.

  **The first version of the mosaic looked hung.** It was reading whole 7741×7591 thermal bands — 12.8 s each over the network, ~11 hours for 1,516 scenes. The output grid is ~111 m, so the 30 m detail was being thrown away immediately. Reading the `/4` overview instead gives 120 m in 1.2 s. The catch was worth measuring rather than assuming: the thermal overviews are *average*-resampled (only 31% of overview pixels equal the matching source pixel) but the QA overviews are *nearest* (99.9% identical to plain decimation), so masking from a QA overview would have inspected 1 pixel in 16 and passed the other 15 blind — leaking cloud into a mean that clouds drag *downward*. QA compresses hard, so it is read at full resolution (1.1 s) and block-reduced with any-bad-wins. Stricter mask, a tenth of the time: **22 minutes, 0 failures**.

  **Green cover and built-up for all 70,417 wards** — 70,368 (99.93%) have values. The first pass left 4,046 short, because the script gives up on wards it cannot read rather than losing their neighbours to a bisection; those failures are transient, and a `--fill` retry pass recovered 3,997 of them.

  The map gained a **Colour** menu — air, surface heat, green cover, built-up — and a popup that shows every metric a feature carries rather than only the one being shaded. Choosing a metric a level does not have colours by air and says so, instead of drawing a grey map.

  **And the popup had never opened.** Driving the real page in a browser — not the isolated tile harness — showed that tapping a boundary did nothing, on `main` as well as on the branch. Leaflet.VectorGrid calls `L.DomEvent.fakeStop`, which Leaflet removed in 1.6; we ship 1.9.4, so every boundary click threw inside a DOM handler before the layer could fire its own event. Nothing looked broken: the map drew, the console stayed clean on load, and the note cheerfully said "tap any boundary for its figure". Shipped since the unified map went live, and only caught because the browser check clicked instead of just rendering. Shimmed in `leaflet-pmtiles-adapter.js`.

**Follow-ups still open after this phase:**

- **A monthly or seasonal layer** for both villages and wards — an annual mean hides the November peak entirely, which for the Indo-Gangetic plain is most of the story.
- [x] **Green cover and built-up for blocks and panchayats** *(v26.6.149)* — **6,470/6,471 blocks (99.98%)** and **318,979/319,287 gram panchayats (99.90%)**, at full 10 m.

  The per-ward script could not be pointed at them: a windowed read per feature is fine for a 2 km² ward and absurd for a 500 km² block or 319,287 round trips. `build-boundary-landcover.py` turns the loop inside out — tile-major over WorldCover's 3-degree COGs, 1024-row strips clipped to the columns their polygons span, 45.8 Gpx read. It also fixes a latent bug the ward path still has: picking the tile from a polygon's centroid and reading boundless past the edge scores a tile-straddling polygon on only the part inside its own tile. Invisible at ward size, wrong for a block 22 km across.

  **Two measurements that changed the design.** Reading the `/4` overview is 10x faster and was rejected: land cover is categorical, its overviews are mode-resampled, and mode overstates built-up by +1.0 points at `/4`, +2.3 at `/8`, +4.5 at `/16` — always the same direction, next to ward figures computed at 10 m. And profiling showed `np.bincount(np.where(valid, ids, 0).ravel())` at 4.84 s against 0.67 s for `np.bincount(ids[valid])`; three counters times two levels per strip, that one line was the difference between a 9-hour run and a 2-hour one. With five workers it then OOM-killed one and lost 90 finished tiles, so the pass now checkpoints per tile — the same lesson the ward run had already paid for once.

  **What the data then said.** The median gram panchayat is **97% green**, and 87% are above 90%, because WorldCover counts cropland as vegetation. That is correct and it is not tree cover. The ward-calibrated ramp put two-thirds of the countryside in one colour, so the bands were rebuilt with finer steps at the top (85/93/97/100) and kept absolute so a ward and a block remain comparable. Built-up is the discriminating rural layer; the docs say so plainly rather than implying green is doing work it cannot do here.

- [x] **Tree cover, and land cover on every shipping level** *(v26.6.150)* — one combined pass added a **Tree cover** metric and filled green/built in for ULBs, districts and states, so all six shipping levels now carry air, heat, tree, green and built. Coverage 99.93–100% everywhere.

  **Tree cover is the metric green cover should have been.** Green counts cropland, so the median gram panchayat is 97% green and the layer says almost nothing outside cities. Canopy alone separates places everywhere — median ward 9%, panchayat 12%, state 38% — and it settles the question the previous phase left open. The heat-island relationship was real all along; green cover was simply the wrong proxy:

  | | green vs heat | tree vs heat |
  |---|---:|---:|
  | National, 67,732 distinct wards | −0.069 | **−0.429** |
  | Within-city median *r* | −0.107 | **−0.412** |
  | Cities where negative | 680/1,247 (55%) | **1,087/1,240 (88%)** |
  | Coolest-vs-hottest fifth | 0.8 °C | **4.8 °C** |

  (Computed after removing 2,541 exact-duplicate ward geometries — see below.)

  **A silent-failure bug, caught by watching a total go down.** Ward coverage came back 67,527 of 70,417 — worse than the 70,368 the older per-feature script managed. The tile pass rasterises a level into one label grid, so each pixel belongs to exactly one feature; that is right for panchayats and blocks, which tile the plane, and wrong for wards, which come from three merged sources and overlap in 272 ULBs. Overlapping polygons lose their pixels to whichever was drawn last: **556 of Patna's 628 wards and 480 of Mangalore's 540** came back empty, looking exactly like ordinary missing data. Whatever the tile pass leaves short now gets a per-feature second pass — ~3,200 features, not 400,000 — and wards land at 99.93%, better than before.

- [x] **The ward atlas is now a count of places, not records** *(v26.6.151)* — **70,417 → 68,596**, and it covers *more* ground than before.

  Two problems, opposite in sign. The three merged sources overlap for a few dozen ULBs, leaving **2,541 byte-identical duplicate geometries**: Patna held 628 ward records across 115 distinct shapes, Mangalore 540 across 60, and "Ward 1" appeared 23 times in Patna. `dedupe-ward-atlas.py` collapses exact matches only, keeping the richest record of each set so a merge never costs a name; near-duplicates are deliberately left alone, because choosing between two similar shapes is a data question rather than a scripting one.

  And the same three sources **miss 14 cities outright** — 720 wards that existed only in the older per-city panel, including **Kolkata (141), Madurai (100), Asansol (106)** and every north-eastern capital we had added by hand: Agartala, Imphal, Shillong, Itanagar, Aizawl, Kohima. This was found while planning the panel's retirement, which would otherwise have quietly deleted Kolkata from the site. `merge-panel-wards.py` folds them in with geometry and name only — every satellite figure is recomputed by the national passes, so a Kolkata ward and a Delhi ward mean the same thing.

  Coverage after both: air 100%, heat 99.83%, tree/green/built 99.95%.

- **ULB duplicates** — the same scan found 9 duplicate geometries at ULB level. Small, but the same class of problem and not yet fixed.
- **Retire the ward panel.** Heat, green and built-up are now on the map nationally, so the panel's remaining exclusives are the correlation view and its "But…" stats. Those are worth keeping — the question is where they live.
- **Manipur, Mizoram, Tripura, Srinagar, Madurai, Siliguri** — the states SBM omits that no alternative source has covered yet, plus Siliguri's partial 4-of-47 AMRUT upload. Six more cities (Noida, Jamshedpur, Vellore, Kozhikode, Akola, Bhavnagar) are in SBM with only 1–13 polygons each — worth re-checking whenever upstream refreshes.
- **Finish auditing the releases we pull from.** `indian_admin_boundaries/urban` is now enumerated and yielded 52 cities across two files. `indian_facilities`, `indian_industries` and `indian_land_features` still have assets we have never listed.
- ~~**Mosaic two Landsat paths** for cities on a scene seam~~ — done nationally in v26.6.148, which is a mosaic of 1,512 scenes rather than two. Five of Thiruvananthapuram's six seam wards now have a value on the map; one still does not, and the ward *panel* keeps its own gap until it is retired.
- **Siliguri** — absent from all three ward sources. SJDA publishes mouza PDFs for two rural blocks, which our village layer already covers as vector. An RTI to the WB Municipal Affairs Department is the realistic route.
- **Repo weight** — the working tree is ~182 MB, so a contributor-friendly shallow-clone or data-split path is worth considering.

## Phase 5.22: Maps rebuilt on India's open geodata (✅ Completed — v26.6.125)

A late-July 2026 geodata batch: every boundary and source layer the maps were missing, built on [indianopenmaps.com](https://indianopenmaps.com) (ramSeraph's community mirror of SBM / LGD / Bharatmaps / GatiShakti / NCOG data), vendored as simplified derivatives with attribution.

- [x] **Ward Atlas 15 → 39 cities** — 24 new cities from Swachh Bharat Mission ULB ward boundaries (Agra, Amritsar, Coimbatore, Dehradun, Ghaziabad, Gwalior, Indore, Jalandhar, Jodhpur, Kota, Ludhiana, Meerut, Moradabad, Muzaffarpur, Nagpur, Nashik, Patna, Prayagraj, Raipur, Rajkot, Ranchi, Surat, Vadodara, Visakhapatnam), air layer only. The pipeline (`scripts/fetch-openmaps.mjs`) keeps only APPROVED ward versions (Patna: 628 raw entries → 71 wards), merges split geometries, fixes duplicate names (Meerut's "M_Ward" ×90, Kota's twin corporations), and simplifies to ~30 m. This unblocks the long-stalled "no open boundaries for Agra/Patna/Surat" roadmap item.
- [x] **Constituency accountability choropleths** — all 543 Lok Sabha constituencies and 785 districts (LGD/Bharatmaps) coloured by live AQI on the live map (IDW from monitored cities; honest grey where no monitor is within ~200 km), with popups linking to the Accountability tracker and RTI templates. Vidhan Sabha constituencies stream as vector tiles (Leaflet.VectorGrid, vendored).
- [x] **Pollution-sources overlay** — 1,473 SBM landfills, 5,396 dumpsites, 459 coal mines with 2019–20 production (Harvard Dataverse, CC0), 1,092 CPCB red/orange-category GatiShakti industrial parks, 376 SEZs, with legend and labelled popups.
- [x] **"Who breathes it" overlays** — UDISE/NCOG schools and Bharatmaps health centres as on-demand vector tiles on the ward map (health centres re-drawn as crisp markers because their z7 tiles smear when overzoomed).
- [x] **Ask JanVayu ward coverage 14 → 39 cities** — `ward-stats.json` regenerated from the ward files by the same pipeline.
- [x] **Provenance documented** — an Indian Open Maps card in the Data Source Selector covering the "not-so-open" upstream licensing, SBM quality caveats (coarse revenue wards in Rajkot/Vadodara; WB, Manipur, Mizoram, Tripura absent), and per-layer attribution. Data schema gated by `test/openmaps-data.test.mjs`.
- [x] **Blog post** — ["The Air Your MP Answers For"](https://www.janvayu.in/blog/#/posts/2026-07-30-the-air-your-mp-answers-for).

**Follow-ups opened by this phase:** satellite heat/green/built extraction for the 25 air-only cities; ward sources for WB/NE cities if boundaries surface; per-constituency accountability briefs.

## Phase 5.21: A longer walkthrough, plain language & mobile/IA polish (✅ Completed — v26.6.102–115)

A mid-July 2026 usability batch — almost no new panels, entirely about making the existing surface easier to find, read, and use on a phone. It also cleared the last two Phase 10 items and the Phase 6 combobox.

- [x] **Long walkthrough deck** — a comprehensive **36-slide** deck (`walkthrough/full.html`) across eight chapters, a slide for essentially every panel, alongside the existing short 13-slide deck; the `/walkthrough/` landing page offers **both** via a chooser. Data-driven (a `FULL_SLIDES` array rendered by the same engine). Also fixed the deck-preview iframe blanking on the tour page (added a `/walkthrough/*` `X-Frame-Options: SAMEORIGIN` header override to the global `DENY`). (#253, #254)
- [x] **Plain-language copy sweep** — an audit across every user-facing panel found copy written from the builder's chair; stripped it. Removed "built natively / never goes stale / no Google dependency / always in sync", the Pretext "300× faster than traditional browser text layout" brag, the "Under the hood / no black box" framing, "CORS-open manifest", ward-map GIS jargon ("interpolated, inverse-distance weighted" → "estimated from the nearest monitors", keeping the honest "pattern, not a per-street reading" caveat), and the bare "GEMM" acronym on the risk button/chips (full expansion kept in the explainer + glossary). (#254)
- [x] **About menu** — FAQ and the Team page were buried as the tail of the "Learn" dropdown and deep in the footer; split into a dedicated **About** nav dropdown (About · Team · FAQ · Contact · GitHub), mirrored in the mobile menu and as a footer column. Nav hamburger breakpoint raised to ~1180px so the ninth menu doesn't overflow. (#254)
- [x] **Mobile polish** — dashboard tile grids and the footer nav stack into a **single column** on phones (no more mid-word "Learnin g Games", no empty footer cell); tables that forced horizontal scroll fold into **labelled cards**; a **heading-order audit** removed all skipped levels; the crammed walkthrough-preview iframe got real height. (#252, #254)
- [x] **Mobile CSS de-duplication** — the footer/grid layout rules had drifted (`​.footer-grid` was redefined in **six** conflicting `@media` blocks, one commented "single column" while setting two). Consolidated each to a single source of truth; verified **pixel-identical** column behaviour at 12 widths (375–1280px). (#254)
- [x] **Air-quality self-check** — a 10-question literacy quiz on the Workshops page, and **Story-of-the-week** rotation on the dashboard hero (surfaces a blog post weekly, no redeploy). *(Completes the two remaining Phase 10 items.)* (#250)
- [x] **Searchable city combobox** — replaces the long grouped `<select>` in the hero selector, keeping the native value/change semantics. *(Completes the Phase 6 city-coverage combobox item.)* (#251)
- [x] **CI axe-audit repaired** — the accessibility job had been silently passing on a ChromeDriver/Chrome version mismatch; pinned a matching driver. (#252)
- [x] **Lucknow** added to the ward atlas — **112 municipal wards** (DataMeet open boundaries), air-layer only (satellite heat/green not yet available for the city, and the toggle says so). (#253)
- [x] **Two blog posts** — the fact-check transparency post and this usability round-up.

## Phase 5.20: Native deck, deeper fact-checks & the source-apportionment ring (✅ Completed — v26.6.95–101)

A mid-July 2026 batch: replace the stale slide deck, push the fact-check to the whole content surface, and ship the long-planned apportionment ring.

- [x] **Native HTML walkthrough deck** — the Google Slides embed is replaced by a self-hosted 13-slide deck (`walkthrough/deck.html`) with keyboard nav, speaker notes, overview grid, fullscreen, deep-links, touch swipe, and print-to-PDF. Self-hosts its fonts and inlines the hand-drawn diagrams, so it stays in sync with the site and needs no re-export. (v26.6.96)
- [x] **Fact-check rounds 2 & 2b** — a 12-agent verification pass re-checked the prior findings against the live files and fresh sources: **37 verified corrections** (incl. restoring CREA's 23/100 NCAP figure, removing a fabricated "CSE Apr 2026" citation, refreshing NCAP fund figures to CREA 2026) and **43 resolutions** of flagged items (neutral, sourced reframes of stale accountability claims — Delhi e-buses, odd-even, FGD — plus removals of unsourced figures). Logs in `docs/fact-check-2026-07b.md`. (v26.6.97–98)
- [x] **Content sweep** — extended the fact-check to the 8 panels and 10 data/research posts the earlier rounds hadn't reached: **327 statistics checked, 116 confirmed current, 8 corrected, 25 flagged** for review (`docs/fact-check-2026-07c.md`). (v26.6.101)
- [x] **Source-apportionment ring** (`#apportionment`) — "Where PM2.5 comes from": a doughnut with a 12-city picker (Delhi–Jaipur) showing each source's share of ambient PM2.5, each city sourced to its own study (CREA, UrbanEmissions.info, CSIR-NEERI, CSTEP, TERI, IIT Kanpur, state boards) with an honest method/season caveat and a methodology note. *(Delivers the Phase 10 "source apportionment ring" item.)* (v26.6.100)
- [x] **Team page** (`#team`) with Varna, Atul, and Komal (both with LinkedIn); **detailed FAQ page** (`#faq`); and a transparency **blog post** on the fact-check. (v26.6.95–99)

## Phase 5.19: Accuracy, reliability & more diagrams (✅ Completed — v26.6.89–93)

The follow-through after the visual refresh — correctness and trust.

- [x] **Four more hand-drawn diagrams** — "How the AQI number is built" (AQI explainer), "How PM2.5 travels through your body" (Beyond the Lungs), "How dirty air drains the economy" (Economic Cost), and blog heroes for the stubble-burning and children's-health posts — all responsive. (v26.6.91)
- [x] **Mobile polish** — quick-nav cards no longer break mid-word; the footer sits two-up instead of one endless column; the Photo Gallery anchor (`#gallery`) opens; "Citizen Voices"/"Citizen Testimony" renamed to the clearly-distinct **Voices Online** (social-media archive) and **Field Testimony** (on-ground). (v26.6.90)
- [x] **Deploys appear on the first refresh** — version-stamped `styles.css`/`app.js` URLs + no-cache HTML end the stale-service-worker-cache problem. (v26.6.92)
- [x] **Site-wide fact-check** — a multi-agent sweep web-verified ~80 statistics + calculator constants against current primary sources; **47 confirmed current, 33 corrected** (removed the false "70% of the global burden", fixed Ghaziabad NCAP utilisation, harmonised the death toll, updated IQAir/AQLI/HCES figures, removed unsourced NCAP rows). Findings in `docs/fact-check-2026-07.md`. (v26.6.93)
- [x] **Weekly automated fact-check** — a scheduled routine re-runs the sweep every Monday and a GitHub Action auto-opens a review PR (`auto-pr-factcheck.yml`); never auto-merges.

## Phase 5.18: Conference-ready visual refresh (✅ Completed — v26.6.84–88)

A mid-July 2026 design pass to make the platform read as a credible, considered
tool rather than a hobby project — ahead of a conference presentation slot.

- [x] **Colour discipline** — swept decorative heading/rail/number colours across the dashboard and every panel to a restrained ink + single-accent palette, so data (not chrome) carries the colour. (v26.6.84)
- [x] **Typography** — self-hosted **Fraunces** as the headline serif (with Kalam for hand-drawn labels); larger, balanced headings and a tightened type scale. Motion: hero rise, scroll-reveal, and panel fades, all `prefers-reduced-motion`-guarded.
- [x] **Hand-drawn system diagram** — "How JanVayu works" is a genuine Excalidraw-style `rough.js` sketch on its own light "paper", now with a **desktop horizontal** and a **mobile portrait** variant so it stays legible on phones. (v26.6.87–88)
- [x] **Photo gallery** — "The air, in pictures": 24 openly-licensed documentary photographs (Wikimedia Commons) in a masonry grid + full-screen lightbox with per-image credit and source. (v26.6.87)
- [x] **Decluttering** — floating Install / Search / Ask buttons moved into the section-nav; the Share-AQI card removed from prime dashboard space. (v26.6.86–87)
- [x] **Layout & ordering** — a feature walkthrough + Ask CTA fill the hero; the footer rebalanced to three even columns; the dashboard reordered top-to-bottom; **labelled section headers** (eyebrow + serif title) break the homepage into an ordered outline; duplicate quick-nav tiles removed. (v26.6.88)

## Phase 5.17: Multilingual fix, accessibility & a lighter site (✅ Completed — v26.6.58–71)

A mid-July 2026 platform-quality drop — mostly plumbing, and one significant bug fix.

- [x] **Multilingual UI restored** — `setLanguage()` was throwing on a missing button-label element *before* applying any translations, so the entire 5-language switcher (Hindi, Tamil, Marathi, Bengali) was silently dead. Guarded it; nav/hero/menus now translate. Lazy panels re-apply the active language on open, and the About panel is fully translated in all five languages as a template. (#1, #212)
- [x] **Accessibility sweep (WCAG 2.1 AA)** — audited with axe-core against the live panels: 12 form controls labelled, inline prose links underlined (WCAG 1.4.1), the last chart labelled, and status-badge colours made theme-aware to meet 4.5:1 in both themes. Dark-theme contrast pass tracked in #213. (#4, #209, #210)
- [x] **Rankings backend 27 → 88 cities** — the live rankings now reflect a national set (core cities + state capitals + NCAP cities) rather than a metro subset. (#2, #211)
- [x] **`index.html` ~1.59 MB → ~0.92 MB (~42%)** — 12 heavy panels moved to external fragments loaded on demand and cached; Games engine + testimonies data externalised; Leaflet CSS off the critical path. (#3)
- [x] **Backend CORS/HTTP helper** — the preflight/CORS boilerplate copy-pasted across serverless functions consolidated into one shared module. (#208)
- [x] **Housekeeping** — closed stale/duplicate issues (#5 CI/CD, #33 mobile, #167 blobs-v10, #183 link audit) after verifying each was already satisfied.

## Phase 5.16: Forecast, Fire Tracker, Health-Complete & Open Data (✅ Completed — v26.6.43–47)

A July 2026 feature drop that shipped several long-standing Phase 9 and Phase 10 items (see those phases below, now ticked).

- [x] **Live 5-day PM2.5 forecast** (`#forecast`) — free, key-less Open-Meteo (CAMS) model: daily mean + peak, band-coloured summary, trend chart, 33-city selector. Shown alongside the existing SAFAR/CPCB forecast-reliability tracking. Ask JanVayu now answers "will it be bad tomorrow?" via a server-side `fetchForecast`. *(Delivers the Phase 10 "AQI forecast 24–72hr" item.)*
- [x] **Farm Fire Tracker** (`#fire-tracker`) — `netlify/functions/fire-tracker.mjs` proxies NASA FIRMS active-fire detections (VIIRS/NOAA-20 NRT), plotted on a Leaflet map with region + time-window toggles and honest seasonal framing (peak mid-Oct to late-Nov). Reads `FIRMS_MAP_KEY`. *(Delivers the Phase 10 "Stubble-burning live tracker" item.)*
- [x] **Hyperlocal via OpenAQ v3** — `community-sensors.mjs` now uses OpenAQ (CPCB CAAQMS + community networks) as its primary source when `OPENAQ_API_KEY` is set, fixing the empty "My Neighbourhood" panel; Sensor.Community fallback. Added a 6-hour freshness guard so dead/zombie stations can't surface years-old readings as "live".
- [x] **Beyond the Lungs** (`#beyond-lungs`) — cited section on PM2.5's whole-body toll (kidneys, heart, brain, metabolism, pregnancy), anchored on the 2026 Chennai–Delhi eGFR cohort.
- [x] **Occupational Exposure** (`#occupational`) — exposure-equity by occupation (street vendors, traffic police, gig riders, construction, waste workers), anchored on the 2026 Chennai street-vendor study.
- [x] **Low-cost indoor sensor buying guide** — added to the Indoor Air panel (2026 IIT-Dhanbad benchmark).
- [x] **One-click RTI from City Scorecards** — "File an RTI" opens the RTI Assistant pre-filled with the city's state board + Clean Air Action Plan topic. *(Delivers the "one-click pre-filled RTI" part of the Phase 10 NCAP scorecard item.)*
- [x] **Open Data API** (`/api`) — `netlify/functions/data-api.mjs`: CORS-open JSON manifest of every dataset + CSV export of rankings, licence + citation. Surfaced in the Data Archive panel; documented in `docs/api/`. *(Delivers the Phase 9 "Open data API" item.)*
- [x] **Calculator test harness** — the 7 deterministic calculators extracted to `netlify/functions/lib/calc.mjs` (single source of truth), covered by `test/calc.test.mjs` (12 tests, `npm test`).
- [x] **Reading List → 29 papers** — 5 new India-focused July-2026 studies (Hisar ML forecasting, BiLSTM PM2.5, low-cost indoor sensors, PM2.5–kidney cohort, street-vendor respiratory).
- [x] **`bump-version.mjs` date fix** — no longer derives invalid `date-released` values from patch numbers > 31.

---

## Phase 1: Foundation (✅ Completed)

- [x] Single-page real-time AQI dashboard
- [x] 16-city monitoring via WAQI API
- [x] Interactive Leaflet.js map with color-coded AQI markers
- [x] Health impact statistics panel (Lancet Countdown 2025 data)
- [x] Policy tracker (NCAP, GRAP, legal orders)
- [x] Citizen testimonials panel
- [x] Dark mode support
- [x] Mobile-responsive design
- [x] Hindi language support (bilingual headers)

---

## Phase 2: Social & News Integration (✅ Completed)

- [x] Server-side feed aggregation (Netlify Functions)
- [x] Reddit, Twitter/X, Google News, Instagram feeds
- [x] Netlify Blobs caching layer (4-hour refresh)
- [x] Unified social feed panel with filtering

---

## Phase 3: Alerts & Communication (✅ Completed)

- [x] AQI threshold alerts with sound notifications
- [x] Email subscription system via Resend
- [x] Daily AQI digest emails with health advisory

---

## Phase 4: AI Features & Deep Content (✅ Completed — v25.1-v25.3)

- [x] Ask JanVayu — natural language air quality Q&A (Groq/Llama 3.3 70B)
- [x] Health Advisory AI — personalized health recommendations
- [x] Accountability Brief Generator — AI-powered ward-level briefs
- [x] Anomaly Explainer — contextual AQI spike analysis
- [x] GEMM Health Risk Calculator
- [x] Business Productivity Loss Calculator
- [x] Policy Effectiveness Tracker
- [x] Political Accountability Tracker
- [x] Budget Tracker (NCAP fund flow)
- [x] Clean Air Mission Tracker
- [x] Historical trends with seasonal patterns
- [x] City comparison with international benchmarks
- [x] 51 content panels across 7 intent-based navigation categories (reorganized v26.6.20, gender panel added v26.6.22, 7 new panels v26.6.23)

---

## Phase 5: Role-Based Platform & Accessibility (✅ Completed — v25.3)

- [x] Role-based landing page with 10 audience roles
- [x] Personalized dashboards per role
- [x] Role switcher in header navigation
- [x] Simple language mode (site-wide plain language toggle)
- [x] sessionStorage persistence for role + simple mode
- [x] Glossary overlay with Ctrl+K shortcut
- [x] Intro tour for first-time visitors
- [x] 5-language UI (EN, HI, TA, MR, BN)
- [x] data-simple plain language text on 30+ template intros

---

## Phase 5.5: Content & Research Update (✅ Completed — v25.4)

- [x] Docsify-powered blog at /blog/ with inaugural post
- [x] Zotero research library integration ([zotero.org/groups/janvayu](https://www.zotero.org/groups/6508140/janvayu/library))
- [x] IQAir 2025 World Air Quality Report data (Loni, 112.5 µg/m³)
- [x] New Lancet Planetary Health PM2.5 mortality studies
- [x] Science Advances PM2.5 inequality study
- [x] Remaining Varnasr → JanVayu URL migration (index.html, docs-ta)

---

## Phase 5.6: Competitor Gap Closure (✅ Completed — v26.4)

Closes specific UX/data gaps against aqi.in (consumer-polished AQI portal) and oaq.notf.in (open hyperlocal sensor platform), without disturbing the accountability-first positioning.

- [x] Cigarette-equivalence card (Berkeley Earth: 1 cig ≈ 22 µg/m³·day)
- [x] Disease-risk badges tied to live AQI (asthma, heart, allergies, respiratory, vulnerable)
- [x] Solution-recommendation card (N95, purifier, exercise, school closure)
- [x] "Near Me" geolocation → nearest WAQI station
- [x] City Rankings panel (Live / 7d / 30d) with `rankings.mjs` Netlify function
- [x] Per-pollutant SEO pages (`/pm25`, `/pm10`, `/co`, `/no2`, `/so2`, `/o3`) with schema.org JSON-LD
- [x] Hourly 24-hr scrubbable PM2.5 chart in the Trends panel
- [x] Year-over-year city comparison + `historical-aqi.mjs` climatology baseline
- [x] Leaflet.heat heatmap toggle + richer station popups on the Live Map
- [x] Embeddable widgets at `/embed/aqi/` and `/embed/rankings/`
- [x] Root PWA (`manifest.json` + `sw.js` + install banner) with offline shell and last-known AQI cache
- [x] Sensor.Community community-sensor integration via `community-sensors.mjs` (replaces hardware "Host a Monitor" plan)
- [x] Workshops panel with Sarath / UrbanEmissions request form and JanVayu walkthrough booking (Netlify Forms)
- [x] Programme attribution updated to "AirQuality for Janhit by MMSF Fellows, AIPC" everywhere

---

## Phase 5.7: Learning, Engagement & May 2026 Refresh (✅ Completed — v26.5)

Self-paced learning surfaces, fresh data points, and a sweep of stale labels. The bet: people learn air quality faster through games than through dashboards alone, and the front-of-site numbers must be visibly current.

- [x] **Learning Games panel** at `/#games` with **six original games** at v26.5 launch (Air Quality Jeopardy 5×5 board with ₹1k–₹5k tiles; 10-question PM Quick-Quiz; 7-source Source Matcher; Clean Air Snakes & Ladders inspired by *Moksha Patam*; Jodi Match memory cards; Air Tambola Indian-housie ticket). A **seventh game, Vayu Junction**, was added in v26.6.0 — see Phase 5.9.
- [x] **"Did You Know"** dashboard strip — six India-specific sourced fact cards under the anomaly banner.
- [x] **Hero alert refreshed** for May 2026 with the canonical Lancet Countdown 2025 1.72M figure.
- [x] **April–May 2026 Voices block** at `/#voices` with six fresh curated cards.
- [x] **April–May 2026 Research Updates** featured card group at `/#resources` (Lancet Countdown 2025, AQLI 2025, IQAir 2025, CSE NCAP review, Jaganathan et al. 2024, CEEW 2024).
- [x] **Two new blog posts**: launch post for the games panel and a May data refresh.
- [x] **Games rendering fix** — moved games JS out of a `<script type="module">` so inline `onclick` handlers can find global functions.
- [x] **Tier-1 freshness sweep** — version markers, sitemap lastmod, CITATION date, footer version line, dashboard quick-link text, pollutant page schema dateModified, blog sidebar Lancet causal-study context.

---

## Phase 5.8: CI / Quality / Mobile / Performance (✅ Completed — v26.5.4–6)

Installs measurement everywhere and lands the highest-leverage safe wins. Every quality dimension tracked in issues #1, #3, #4, #5, #33, #45 now reports on every PR.

- [x] **Lighthouse CI** — `.lighthouserc.json` + `.github/workflows/lighthouse.yml` (advisory; warn-only on Performance ≥ 0.60, FCP ≤ 3 s, LCP ≤ 4.5 s, TBT ≤ 600 ms, CLS ≤ 0.15)
- [x] **axe-core CI** — `.github/workflows/accessibility.yml` runs against `/`, `/ask/`, `/blog/`, `/downloads/` tagged WCAG 2 AA
- [x] **HTML validate + ESLint CI** — `.github/workflows/quality.yml`; `.htmlvalidate.json` config
- [x] **Strict weekly lychee link audit** — `.github/workflows/link-audit.yml` opens tracking issue on failure; PR-time lychee stays advisory
- [x] **`scripts/check-i18n-coverage.py`** — measurable i18n coverage % surfaced in PR step summary
- [x] **Lazy-loaded Chart.js + Leaflet** with SRI — ~120 KB off first paint
- [x] **Pre-warmed Chart.js** via `requestIdleCallback` so dashboard mini-charts stay snappy
- [x] **Chart canvas a11y** — `aria-label` + `role="img"` on every `<canvas>`
- [x] **Mobile tap targets** ≥44 px on `.btn`; `overflow-wrap: anywhere` for long-token wrap
- [x] **Air Tambola ticket** horizontal-scrolls on 360 px Galaxy
- [x] **Performance roadmap** docs/technical/performance-roadmap.md

---

## Phase 5.13: New Panels, Shareable Cards & Platform Polish (✅ Completed — v26.6.23)

Two batches of new panels plus a site-wide quality sweep.

**Batch 1 — New panels:**
- [x] **Understanding AQI** (`tmpl-aqi-explainer`): interactive breakdown of 6 criteria pollutants, CPCB vs US EPA AQI scale comparison table, "Why PM2.5 isn't the whole story" section.
- [x] **Shareable AQI Cards**: canvas-based PNG generator (1080x1080 Instagram, 1200x630 WhatsApp), color-coded by severity. Share buttons on dashboard, rankings, map popups, comparison cards. Web Share API on mobile.
- [x] **Exposure Diary** (`tmpl-exposure-diary`): 16 activities with calibrated PM2.5 multipliers, weighted daily exposure, cigarette equivalence, life-expectancy impact, stacked bar chart, personalized reduction tips, localStorage history.
- [x] **Migration Comparison** (enhanced `tmpl-migration-calc`): full side-by-side comparison — live AQI for both cities, 7-row table, source apportionment bar charts, verdict with life-years gained.

**Batch 2 — New panels + enhancements:**
- [x] **Data Source Selector** (`tmpl-source-selector`): educational panel on CPCB/WAQI/IQAir/Sensor.Community. Toggle switches, instrument/accuracy/coverage details, Source Impact Simulator.
- [x] **City Policy Tracker** (`tmpl-city-policy`): 8-city NCAP target dashboard with expenditure tables, government action timeline, public feedback section, governance questions.
- [x] **Enhanced Legal Framework**: state-wise court rulings (8 regions), Key Legal Rights summary (5 laws), "What Can I Do from Home?" 5-step citizen recourse guide with template letter.

**Other changes:**
- [x] Citizen/Activist split into two separate roles (now 12 roles total).
- [x] Women & Air Quality renamed to **Women's Health** in nav.
- [x] Nav label audit: 17 fixes (RTI footer link, cryptic labels, mismatches).
- [x] Site-wide formatting sweep: 8 grid fixes + 2 table wraps. Rankings table formatting + loading fix. 9 broken Sargam icons replaced.
- [x] Blog post: "The May 26 Overhaul: 21 Fixes in One Day".
- [x] Updated walkthrough deck (65 slides, new PDF/PPTX/index.html).

---

## Phase 5.12: Gender Panel & Historical Map (✅ Completed — v26.6.22)

- [x] **Women & Air Quality panel** (`tmpl-gender`): indoor cooking (NFHS-5), maternal health (Lancet), mortality (~500K HAP deaths/year), occupational exposure, gender data gap, and action items.
- [x] **"Woman / Caregiver" role** in role selector with curated dashboard.
- [x] **Historical map time-slider**: month/year range slider (Jan 2024 → present), fetches from `historical-aqi` function for 12 cities, color-coded PM2.5 circle markers, in-memory cache.
- [x] Added to Health & Trends nav, search index, and `data-simple` plain language mode.

---

## Phase 5.11: Auto-Update Infrastructure (✅ Completed — v26.6.21)

Seven systems to keep the platform fresh without manual edits on every release.

- [x] **Version single-source** (`scripts/bump-version.mjs`): reads package.json, patches CITATION.cff + both service worker cache names. Runs on every Netlify deploy.
- [x] **Sitemap auto-gen** (`scripts/build-sitemap.mjs`): generates sitemap.xml with real lastmod dates from git history.
- [x] **Feed health monitoring** (`netlify/functions/feed-health.mjs`): daily scheduled check of all 5 feed endpoints; reports healthy/stale/broken.
- [x] **Translation key sync** (`scripts/translations.json` + `check-translations.mjs`): detects stale English terms in translated docs.
- [x] **Data-stat system** (`scripts/stats.json` + `data-stat` attributes): single source of truth for key dashboard numbers; auto-patched on page load.
- [x] **Reference data endpoint** (`netlify/functions/reference-data.mjs`): CPCB stations, NCAP data, IQAir annual figures in editable JSON, served via API.
- [x] **Zotero → Reading List** (`netlify/functions/zotero-library.mjs`): public Zotero API → Netlify Blobs cache (6hr TTL) → card-format JSON.

---

## Phase 6: Q3 2026 Priorities

Now that quality is **measurable** on every PR, Q3 is where we drive the numbers down by acting on the data:

### Awaiting input (owner: Varna)

These features are ready to build but need specific content/decisions:

- [ ] **Janhit Partners page** — partner organization logos, names, work areas, and links. Need: list of partner orgs, logos, and descriptions.
- [ ] **Workshop/training calendar** — upcoming events, dates, registration links. Need: event schedule or a Google Calendar to embed.
- [ ] **Donate section** — donation mechanism for the platform. Need: payment platform (Razorpay/UPI) and legal structure for receiving donations.
- [ ] **Social media integration** — link JanVayu content to social accounts. Need: which accounts exist (Twitter/X, Instagram, LinkedIn, YouTube handles).

### Awaiting external setup

- [x] **Push notifications** — ✅ shipped v26.6.49: real Web Push (VAPID) via `push-subscribe.mjs` / `push-send.mjs` + service-worker handlers; scheduled threshold alerts that arrive even when the site is closed, with a "Send test" button. See Phase 5.16.

### Performance (issue #3)

- [x] **CSS split** (v26.6.52) — the ~2,280-line inline stylesheet is now an external, cacheable `styles.css` (`<link>` in `<head>`, precached by the service worker). Shrinks `index.html` by ~94 KB and lets the CSS be cached across visits instead of re-downloading with the HTML each time.
- [ ] Inline only critical-path CSS (hero, header, dashboard quick-link grid)
- [ ] JS split — extract the main inline app script to an external cached file (higher-risk on this single-file SPA; deferred to a dedicated pass with a preview deploy)
- [ ] Hit Lighthouse Performance ≥ 0.80 mobile; flip the `.lighthouserc.json` assertion from `warn` to `error`

### Accessibility (issue #4)

- [x] Drive axe-core violation count to zero on `/`, `/ask/`, `/blog/`, `/downloads/` — ✅ v26.6.93–115 (and the CI job's silent ChromeDriver/Chrome mismatch fixed so it actually runs)
- [ ] Add `/#health`, `/#policy`, `/#workshops`, `/#games` to the audited URL set
- [x] Heading hierarchy audit (h1 → h6, no skipping) — ✅ site-wide sweep, ~30 skips removed (Phase 5.21)
- [x] Color-contrast pass on stat-card pills, badges, chart legends — ✅ theme-aware pass (v26.6.93, #249)

### Mobile (issue #33)

- [x] Per-panel sweep across iPhone SE / 14, Galaxy, iPad Mini — ✅ Playwright sweep (58 panels, 0 overflow); dashboard tiles + footer restacked (Phase 5.21)
- [x] Convert any tables that currently rely on horizontal scroll to a card layout on small screens — ✅ label-above-value responsive cards (Phase 5.21)
- [ ] Touch testing on the Workshops and Games panels

### Translation (issue #1)

- [ ] Audit which `data-i18n` strings are most user-visible (hero, top nav, role overlay, intro tour) and complete coverage there first
- [ ] Set a measurable target — e.g. 60% by end of Q3 — and enforce via `--min-coverage` in CI
- [ ] Decide explicitly whether the wiki / API content is in scope for Hindi/Bn/Mr/Ta translation

### City coverage (issue #2)

- [x] **Expanded to 115+ Indian cities** (v26.6.51) — grew the static list from ~33 to 117, covering the major NCAP non-attainment towns. Selectable across the dashboard, comparison, alerts, forecast and calculators.
- [x] **Lazy-fetch to stay inside the WAQI free-tier** — only the core ~33 are fetched live on load; the extended cities are fetched on demand when a user selects them, so per-visit WAQI load is unchanged.
- [x] Searchable combobox replaces the city `<select>` — ✅ ARIA combobox wraps the native select, keeps value/change semantics (v26.6.10x, #251)
- [ ] Build-time CPCB station fetch to auto-maintain the list (vs the curated static array)

---

## Phase 5.9: Vayu Junction & May 20 Polish (✅ Completed — v26.6.0)

Adds a seventh learning game inspired by *Only Connect* / NYT *Connections* / *Torchlight* climate puzzle, verifies Ask JanVayu end-to-end in all five UI languages, and refreshes documentation and version markers.

- [x] **Vayu Junction** (7th learning game): 4×4 grid, sixteen tiles, four hidden groups of four, four strikes allowed. Auto-detects "one-off" near-misses. Ships with four original India-AQ puzzle sets: Basics, Sources/Seasons/Protection, Names & Numbers, Devious.
- [x] **Ask JanVayu verification** in EN/HI/TA/BN/MR: city chip → `air-query.mjs` → Groq Llama 3.3 70B with seasonal context, NCAP city data, and language-pinned output. Welcome heading, suggestions, input placeholder, install banner, and error messages all internationalised. PWA installable manifest verified.
- [x] **Reddit-feed and Twitter-feed User-Agent** bumped from `JanVayu/v25` / `JanVayu/1.0` to `JanVayu/v26.6 (+https://janvayu.in)` so server-side analytics attribute current-version traffic correctly.
- [x] **Roadmap restructured**: Phase 5.7 moved back into numeric order (it was previously listed after Phase 5.8 despite shipping earlier); the duplicate "Phase 6" heading at the bottom of the file renamed to **Phase 6.5: Legacy mobile & performance tracking** to avoid clashing with Phase 6 "Q3 2026 Priorities".
- [x] **Documentation refresh**: `README.md` "six games" → **"seven games"**; `package.json` 26.5.6 → **26.6.0**; `CITATION.cff` version + date-released; `sitemap.xml` lastmod; `index.html` About-panel footer ribbon.
- [x] **Translated changelogs**: v26.6 stub added to `docs-hi/CHANGELOG.md`, `docs-bn/CHANGELOG.md`, `docs-mr/CHANGELOG.md`, `docs-ta/CHANGELOG.md`.
- [x] **New blog post** `2026-05-20-vayu-junction.md` — walks through the four puzzle sets and the design choices.
- [x] **`/walkthrough/` guided-tour page** (v26.6.11) — public page at `janvayu.in/walkthrough/` embedding the 64-slide MMSF Fellows deck via Google Slides iframe, with PPTX (24 MB) and PDF (13 MB) as direct downloads, footer link under Tools & Action, and a NEW-badged dashboard quick-link card.

---

## Phase 5.10: Chatbot Accuracy & UX Feedback (✅ Completed — v26.6.20)

Addresses detailed user-testing feedback from a domain expert (Komal) who verified chatbot answers against ground truth.

- [x] **CPCB station reference data** for 27 cities with CAAQMS vs manual bifurcation — chatbot now reports exact station counts and types instead of relying on WAQI subset.
- [x] **Multi-station AQI range** for generic air quality queries — fixes the single-station (Mandir Marg) bias by fetching and presenting all stations in the city.
- [x] **Low-cost sensor detection** expanded to catch "low cost sensors in [city]" queries.
- [x] **Intent-based navigation** reorganization: 6 data-type tabs → 7 intent-based tabs. New "My Air" tab for personal tools. Resources cut from 16 → 8 items. All 43 panels preserved.
- [x] **Clarity renames**: Hyperlocal → My Neighbourhood, Policy Effectiveness → Policy Tracker, Research Library → Reading List.
- [x] **Feedback UI**: thumbs up/down on chatbot responses for accuracy tracking.
- [x] **City bar**: 10 → 33 cities in the `/ask/` quick-select chip bar.
- [x] **Service worker cache** bumped to force-refresh for returning visitors.
- [x] i18n updated for en, hi, ta, mr, bn across all nav labels and group names.

---

## Phase 5.14: Urban Heat & Ward-Level Atlas (✅ Completed — v26.6.24)

Moves JanVayu from city-level to **ward-level** resolution and adds an urban-heat lens — inspired by Vaishnavi Iyer / Unmapped's "How hot is your ward?" Bengaluru maps.

- [x] **Urban Heat Island panel** (`tmpl-urban-heat`) with Chart.js visual, wired into Ask JanVayu's knowledge + starter questions. Blog: "The Same Sun, a Different City".
- [x] **Ward-Level Atlas** (`tmpl-ward-map`) — "How Polluted Is Your Ward?" under City Data. Leaflet choropleth colouring every municipal ward, with a **four-layer toggle**:
  - [x] **Air quality** — per-ward PM2.5, inverse-distance-weighted from the city's live CPCB/WAQI monitors.
  - [x] **Heat** — Landsat 8/9 land-surface temperature (~30 m), per-city clear-sky summer scene via Microsoft Planetary Computer.
  - [x] **Green cover** + **Built-up** — vegetation and impervious-surface share per ward from ESA WorldCover 2021 (10 m).
- [x] **14 cities**: Delhi (290), Mumbai (227), Bengaluru (243), Chennai (201), Hyderabad (145), Varanasi (99), Bhopal (86), Jaipur (77), Kanpur (58), Pune (58), Kolkata (141), Ahmedabad (48), Faridabad (40), Chandigarh (28).
- [x] Per-layer legend, tooltips, methodology note, and live "But…" stats. The Heat layer surfaces the heat-island link (hottest vs coolest fifth of wards by built-up + green) from each city's own data.
- [x] Offline zonal-statistics pipelines: rasterio over **remote cloud-optimized GeoTIFFs** (windowed reads, no bulk downloads) — ESA WorldCover (S3) + Landsat C2 L2 (Planetary Computer). Per-ward values baked into `/data/wards/*.json`.
- [x] Responsive mobile layout for the ward map; blog: "A City Is Not One Number".

---

## Phase 5.15: Ward Atlas in the chatbot + platform maintenance (✅ Completed — v26.6.27–v26.6.34)

- [x] **Ward Atlas wired into Ask JanVayu** — air-first per-ward answers (live PM2.5 interpolated server-side; heat/green/built-up as drivers), with explicit live-snapshot-vs-annual-structure honesty.
- [x] **Per-ward share cards** + a "Live vs Annual" data-honesty blog post.
- [x] **Groq model migration** — `llama-3.3-70b-versatile` retires 16 Aug 2026; moved all four AI functions to `openai/gpt-oss-120b` behind a `GROQ_MODEL` env var.
- [x] **Maintenance**: Node 20 (EOL) → 22 across Netlify + CI; `resend` bumped; fixed the broken weekly link-audit workflow (lychee dropped `--exclude-mail`, which was silently failing the job and filing false "broken links" issues); removed stray merge-conflict markers shipped to `ask/sw.js` + `CITATION.cff`.
- [ ] **Open tech debt**: `@netlify/blobs` v8 → v10 (a tested upgrade; the caching backbone, so deliberately not bumped blind).

---

## Phase 6.5: Legacy mobile & performance tracking (🔄 partially superseded by Phase 5.8 / 6)

**Issues:** [#33](https://github.com/JanVayu/JanVayu/issues/33), [#3](https://github.com/JanVayu/JanVayu/issues/3). The items here are tracked individually now in Phase 5.8 (shipped) and Phase 6 (Q3 priorities).

- [x] Touch-friendly interactions (44px+ targets)
- [x] Comprehensive mobile CSS (768px + 375px breakpoints)
- [x] Role overlay mobile fix (logo/content no longer cut off)
- [x] Chart.js and Leaflet.js deferred (were render-blocking)
- [ ] Lazy-load panel templates
- [ ] Code-split JavaScript
- [ ] Lighthouse mobile score > 80

---

## Phase 7: Accessibility & i18n (Q2-Q3 2026)

**Issues:** [#4](https://github.com/JanVayu/JanVayu/issues/4), [#1](https://github.com/JanVayu/JanVayu/issues/1)

- [x] Skip-to-content link, :focus-visible, prefers-reduced-motion
- [ ] Full WCAG 2.1 AA compliance (heading audit, contrast, screen reader)
- [ ] Complete data-i18n coverage
- [ ] Translate all 40 panel templates

---

## Phase 8: Data Expansion & CI (Q3 2026)

**Issues:** [#2](https://github.com/JanVayu/JanVayu/issues/2), [#5](https://github.com/JanVayu/JanVayu/issues/5)

- [x] Expand to 100+ cities — ✅ 115+ (v26.6.51); see City coverage (issue #2)
- [ ] Lighthouse CI on PRs
- [ ] axe-core accessibility testing

---

## Phase 9: Community & Scale (2027)

- [x] PWA with offline support — shipped in v26.4
- [ ] ML-based AQI forecast (extend the existing forecast panel beyond WAQI's 3-day window)
- [ ] South Asian expansion
- [x] Open data API — ✅ shipped v26.6.46 (see Phase 5.16): versioned `/api` manifest + CSV export, documented in `docs/api/`

---

## Phase 10: Next batch — competing with peer accountability platforms (Q3 2026)

Recommended next-build list, drawing on the latest scan of NCAP Tracker (Climate Trends + Respirer Living Sciences), CREA, UrbanEmissions, IQAir, and aqi.in.

- [~] **NCAP city scorecard upgrade** — ✅ one-click pre-filled RTI to the state board shipped v26.6.45 (see Phase 5.16); ⏳ station-level fund utilization + PM2.5-vs-target chart still to do.
- [x] **Stubble-burning live tracker** — ✅ shipped v26.6.47 as the [Farm Fire Tracker](#fire-tracker) panel (NASA FIRMS, VIIRS/NOAA-20). See Phase 5.16.
- [x] **Source apportionment ring** — ✅ shipped v26.6.100 as the [Where PM2.5 Comes From](#apportionment) panel: per-city %-from transport / industry / biomass / construction / dust / power, a 12-city interactive picker, each city sourced to its own study with method + season caveats. See Phase 5.20.
- [x] **AQI forecast 24–72hr** — ✅ shipped v26.6.44 as a live 5-day Open-Meteo/CAMS forecast (mean + peak, day-by-day). See Phase 5.16.
- [x] **Push notifications** — ✅ shipped v26.6.49: real Web Push (VAPID), gated on user-picked AQI thresholds, delivered even when the site is closed. Complement to email digest.
- [x] **In-browser AQ literacy quiz** — ✅ shipped (Phase 5.21, #250): a 10-question air-quality self-check on the Workshops page, mirroring the quiz-game pattern.
- [x] **Story-of-the-week rotation** — ✅ shipped (Phase 5.21, #250): the dashboard hero surfaces a rotating blog post weekly, driven by `data/stories.json`, no redeploy needed.

*(With both items shipped, Phase 10 is complete.)*

---

## Phase 11: Ward-Level Atlas — next (planned)

Building on the Phase 5.14 ward atlas. Tracked on [GitHub Issues](https://github.com/JanVayu/JanVayu/issues).

- [~] **Ward Atlas polish** ([#151](https://github.com/JanVayu/JanVayu/issues/151)) — ✅ ward search / locate-me, ✅ two-finger pan on touch, ✅ correlation view (active layer vs built-up / green, with Pearson *r*); ⏳ time-aware (seasonal-median) heat still to do.
- [~] **Tier-1 / tier-2 cities** — added Kanpur, Varanasi, Bhopal, Faridabad, and **Lucknow** (112 wards, DataMeet open boundaries, air-layer only — 15 cities total). Still sourcing: Agra, Patna, Nagpur, Indore (Indore's file truncated on the host's download cap; Patna's is 8 MB / 628 sub-polygons and needs geometry simplification via geo libraries not yet in the pipeline).
- [ ] **Per-ward share cards** — extend the Shareable AQI Cards generator to ward snapshots ("My ward vs the city").

**Dropped (not feasible on open data):**

- ~~Satellite-derived per-ward PM2.5~~ ([#149](https://github.com/JanVayu/JanVayu/issues/149), closed) — no openly-fetchable ~1 km PM2.5 raster (ACAG is portal-gated; Planetary Computer hosts only Sentinel-3 aerosol optical depth, not a calibrated PM2.5 product). The air layer stays live-interpolated.
- ~~Surat ward map~~ ([#150](https://github.com/JanVayu/JanVayu/issues/150), closed) — no open ward-boundary file exists. **Chandigarh** was added as the 10th city instead.
