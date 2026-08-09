# One Map, Every Boundary in India

**Published:** 8 August 2026 | **Author:** Team JanVayu | **Reading time:** 5 min

---

Until yesterday, finding out how polluted your neighbourhood is meant knowing something you shouldn't have to know: whether the place you live is officially a *ward* or a *village*.

Wards were in one panel, behind a dropdown of 142 cities. Villages were a layer on a different map. If your town wasn't in the dropdown, you got nothing. That wasn't a design decision — it was our database structure leaking into the navigation, and a reader spotted it immediately.

The [live map](https://www.janvayu.in/#map) now has a single **Boundaries** menu covering the whole administrative hierarchy of India:

**State → district (zila) → block, mandal or tehsil → gram panchayat → village**, on the rural side.
**City or ULB → ward**, on the urban side.

Every one of them coloured by its annual satellite PM2.5. Pick a level, zoom to where you live, tap.

<div class="jv-dgm jv-dgm-wide"><img src="/blog/diagrams/atlas-layers.svg" alt="How the boundary atlas is built: four sources — SatPM2.5 annual and monthly grids, Landsat 8/9 scenes, ESA WorldCover 2021 and boundary geometry — feed a national heat mosaic and a tile-major land-cover pass, then one zonal pass bakes nine numbers into every polygon. Six levels ship as PMTiles read by HTTP range request; villages carry the same numbers in one file per district."></div>
<div class="jv-dgm jv-dgm-tall"><img src="/blog/diagrams/atlas-layers-tall.svg" alt="" aria-hidden="true"></div>

## What this actually adds

**All 70,417 municipal wards in the country**, not the 142 cities someone had got round to adding. The dropdown is gone; wards are simply what's under the map when you zoom in far enough. Noida, Bhiwandi, Bardhaman, thousands of small municipalities nobody had listed — all there now.

**319,287 gram panchayats.** This is the tier where most rural governance actually happens, and it has never been on an air-quality map in India as far as we can tell.

**6,471 blocks, mandals and tehsils** — the administrative level a district collector actually works with.

## How it stays fast

A naive version of this would be unusable. The village layer alone is 584,615 polygons.

The map uses **PMTiles**: each level is one file, and your browser asks for only the specific byte ranges covering what's on your screen. Nothing else is downloaded.

The effect is easier to see in numbers than to describe. Loading the Delhi region at ward level draws **671 wards** — Delhi, Noida, Ghaziabad and Gurugram together — and transfers **109 KB**. The old ward atlas downloaded **224 KB** to show Delhi's 290 wards alone. Twice the data, four cities instead of one, half the bytes.

## Three failure modes this build surfaced

We write these up because in a data pipeline the dangerous failures are the *quiet* ones — output that looks right and isn't. Naming them is how the next build avoids them, and how a reader can judge what the numbers are worth.

**Every one of 584,615 villages was briefly labelled with its state.** Our code picks the "name" column out of each government dataset, since they all spell it differently. The matcher expected the column to end in "name"; the real ones are `vilname11` and `vilnam_soi`. It matched nothing — and a fallback we'd written to be helpful quietly grabbed the first name-ish column in the file, which was the state. Nothing errored. The build reported success. Every village in India would have been labelled "BIHAR" or "KERALA".

We deleted the fallback. The build now stops and prints the actual column names, because a run that mislabels the whole country is worse than one that fails. Adding a check across all seven levels immediately caught two more of the same kind.

**Gram panchayats came out at 439 MB** because we'd rendered them at village-level detail — for a layer that is a *grouping* of villages. Retuned to 68 MB with no visible loss.

**We disabled the wrong compression.** PMTiles files must not be compressed by the CDN, or byte-range addressing breaks. We misread that as "don't compress the tiles inside either", which is a different thing entirely and simply made every file bigger. Measured the cost at 13%, then fixed it.

## What's still not right

**Villages use the old loader underneath.** Their tile archive is 267 MB and GitHub refuses files over 100 MB, so it can't ship the way the other six do. Same menu, same place in the hierarchy — you won't notice — but it's a workaround, not a design.

**An annual mean is still the wrong instrument** for a country whose pollution is violently seasonal. Every number on these layers is a 2024 average. It says nothing about a bad week in November, which for the Indo-Gangetic plain is most of the story. A monthly layer is the most valuable thing we could build next.

**The old ward panel is still there**, because it does things the map doesn't yet: summer heat, green cover, built-up share, and the schools and health-centre overlays. It now points here instead of being a dead end for anyone whose city isn't on its list.

Find your place at [janvayu.in](https://www.janvayu.in/#map) — press **Boundaries**, pick your level, zoom in. If your panchayat's name is wrong, or your ward boundary doesn't match what you know on the ground, tell us at **contribute@janvayu.in**. Local knowledge beats another pass over the data by us.
