# Surface heat on every ward in India, and what it showed

**Published:** 8 August 2026 | **Author:** Team JanVayu | **Reading time:** 7 min

---

The [map](https://www.janvayu.in/#map) has a new **Colour** menu. Alongside annual air, you can now shade any boundary by **surface heat**, and for wards by **green cover** and **built-up share**.

**70,306 of India's 70,417 municipal wards** have a land-surface temperature. So do all 785 districts, all 36 states, 6,459 blocks and tehsils, 3,364 city bodies and 319,114 gram panchayats. Green cover and built-up share cover **70,368 wards (99.93%)**.

*Update, 2 October 2026: those ward and city-body counts included duplicate records. After deduplication, 68,481 of 68,596 wards (99.83%) and 3,355 of 3,359 city bodies have a land-surface temperature, and green cover and built-up share cover 68,564 of 68,596 wards (99.95%). The district, state, block and panchayat figures stand.*

Until this week, heat existed for 142 cities.

## Why it was stuck at 142

Every other layer on this site is worked out in one pass over the whole country. PM2.5 comes from a single national grid, and land cover from a single global one.

Heat was the exception. It searched for the clearest Landsat satellite scene over each city, masked that city's clouds and averaged those pixels, and it did that 142 times. So every heat problem we had was the same problem in a different place. Six wards in Thiruvananthapuram sat in a gap between two satellite scenes and could never get a value, however many scenes we tried. Bhopal was 34% blank from leftover cloud. Adding a city meant repeating the whole search.

So we stopped fixing cases and changed the method. We now combine **1,512 Landsat 8/9 scenes across 388 orbital paths and rows** into one national picture at roughly 111 metres, for the 2026 pre-monsoon season. One calculation then gives every boundary at every level, wards to panchayats, its value.

## Checking the clouds

Clouds are cold. A cloudy pixel that slips through drags a ward's average down and gives a map that looks reasonable and quietly **understates** how hot places are. So the cloud check had to be strict.

Shrinking the satellite images to a coarser grid risks exactly this. We measured how the shrunken temperature and cloud-quality layers were built. The temperature layer is averaged, and the quality layer simply picks one pixel in sixteen and discards the rest, which would check one pixel for cloud and let fifteen through unexamined. Different handling, as we had feared.

So the quality layer is now read at full detail, and a 111 m cell is thrown out if **any** of the sixteen finer pixels behind it was cloud, shadow, snow or next to cloud. The final run processed 1,512 of 1,516 scenes with no failures.

## Then the data disagreed with us

The heat-island story is familiar: more concrete, hotter; more trees, cooler. We have written a version of it ourselves. With 70,000 wards now carrying both green cover and surface temperature, we could finally test it across the whole country.

Nationally, the correlation between green cover and ward surface temperature is **−0.069** (computed after removing duplicate wards; our first calculation, before deduplication, gave −0.054). That is close to nothing.

This does not contradict the heat-island effect. The mistake was ours, one of scale. The hottest wards in the country are in Vidarbha, and they are **99% "green"**: dry cropland in Amravati district, fallow in May, reading 57 °C at the surface. The coolest are in Pahalgam and Shopian, at 20 °C because they are in the Himalaya. Comparing a Kashmiri ward with a Vidarbha ward measures latitude and altitude. It does not measure urban form.

> **Correction, 8 August 2026 (later the same day).** The ward counts in the table below are wrong, and we are leaving them visible instead of quietly editing them. Chasing an unrelated bug, we found the ward atlas carries **2,541 exact-duplicate geometries**, concentrated in a handful of cities: Patna's "628 wards" are 115 distinct shapes, Mangalore's "540" are 60, Savanur's "356" are 27. "Ward 1" appears 23 times in Patna. The *correlations* survive deduplication nearly unchanged (Patna −0.35, Mangalore −0.42, Savanur +0.82, and the national figure moves only from −0.054 to −0.069), so the argument below stands. The counts do not. Deduplicating the atlas is now on the roadmap.
>
> **A second update.** The puzzle this post ends on, that green cover barely tracks heat, has an answer, and it is not the one we implied. See [the follow-up](2026-08-08-tree-cover-answers-it.md): green cover was the wrong variable. Tree canopy alone tracks heat at **r = −0.43** nationally and in 88% of cities.

Within a single city, where climate is held constant, the effect does appear:

| City | Wards | Green vs heat | Built-up vs heat | Hottest-to-coolest ward |
|------|------:|--------------:|-----------------:|------------------------:|
| Mangalore | 540 (60 distinct) | −0.39 | +0.50 | 11.8 °C |
| Patna | 628 (115 distinct) | −0.38 | +0.39 | 6.6 °C |
| Chennai | 199 | −0.22 | +0.38 | 8.4 °C |
| Bengaluru | 197 | −0.17 | +0.18 | 4.7 °C |
| Hyderabad | 145 | −0.15 | +0.25 | 8.1 °C |

Greener wards are cooler, and more built-up wards are hotter. In Mangalore an 11.8 °C gap separates its hottest ward from its coolest.

Then there is Jaipur, at **+0.45**: greener wards are *hotter*. This is not an error. We suspect that in arid India the satellite's "green" class is largely dry cropland and scrub, bare and scorching by May, but we have not tested that here. Savanur in Karnataka runs to +0.83.

Across the 1,247 cities with 20 or more distinct wards, the correlation is negative in **680 of them (55%)**. That is a little better than a coin toss. (Our first count, made before the duplicate wards were removed, was 683 of 1,258, or 54%.)

We are not going to smooth that over. The statement the data supports is narrower than the one we wanted to make: *within a humid or temperate Indian city, green cover tracks cooler ward surfaces, and built-up share tracks hotter ones. Across India, and inside arid cities, it does not.* That is what 70,000 wards say. It is also more useful than a tidier claim, because it shows where planting trees for cooling is the obvious move and where the answer needs local evidence.

## What to do with it

Open the [map](https://www.janvayu.in/#map), set **Boundaries** to Ward, set **Colour** to surface heat, and find your city. Tap any ward and you get all four numbers at once (annual air, surface heat, green cover, built-up), so you do not have to change a dropdown to learn how green your neighbourhood is.

We found something else while checking this: **tapping a boundary had never worked.** Not since the unified map launched. The tool that draws the boundaries calls a function (`L.DomEvent.fakeStop`) that the mapping library Leaflet removed in version 1.8 (it is in the [1.7.1 source](https://raw.githubusercontent.com/Leaflet/Leaflet/v1.7.1/src/dom/DomEvent.js) and gone from the [1.8.0 source](https://raw.githubusercontent.com/Leaflet/Leaflet/v1.8.0/src/dom/DomEvent.js)), and we use 1.9.4. So every tap failed before the popup could open. Nothing looked broken: the map drew fine, and the caption underneath told you to tap.

We caught it because the pre-release check this time clicked the map instead of confirming it drew. The same lesson applies to the cloud check above: a map that draws correctly may still not work.

Two cautions, both on the map itself.

**Surface temperature is not air temperature.** This is how hot the *ground* gets under a clear pre-monsoon sky. It runs well above the shade forecast. A ward at 45 °C here is not a place where the weather report says 45.

**It is a seasonal figure, not an annual one.** The window is the hottest, clearest stretch of the year. It answers "how hot does this place get", not "how hot is this place usually".

Green cover and built-up are wards only for now. Choosing them at another level colours by air instead and tells you why, instead of showing a grey map with no explanation.

*Update, 2 October 2026: green cover, tree cover and built-up share now exist at every level of the map.*

111 wards still have no heat value and 49 have no land cover. They draw uncoloured. One ward in Thiruvananthapuram remains in that list, down from the six the old city-by-city method could never resolve, but not zero.

---

*Method, coverage tables and caveats: [The Boundary Map](https://www.janvayu.in/docs/#/data-sources/boundary-map). Heat from [Landsat 8/9](https://www.usgs.gov/landsat-missions) via [Microsoft Planetary Computer](https://planetarycomputer.microsoft.com/); land cover from [ESA WorldCover 2021](https://esa-worldcover.org/); annual PM2.5 from [SatPM2.5 V6GL03](https://www.satpm.org/).*
