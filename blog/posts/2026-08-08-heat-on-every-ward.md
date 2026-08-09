# Surface Heat on Every Ward in India — and What It Showed

**Published:** 8 August 2026 | **Author:** Team JanVayu | **Reading time:** 7 min

---

The [map](https://www.janvayu.in/#map) has a new **Colour** menu. Alongside annual air, you can now shade any boundary by **surface heat**, and — for wards — by **green cover** and **built-up share**.

The numbers behind it: **70,306 of India's 70,417 municipal wards** have a land-surface temperature. So do all 785 districts, all 36 states, 6,459 blocks and tehsils, 3,364 city bodies and 319,114 gram panchayats. Green cover and built-up share cover **70,368 wards (99.93%)**.

Until this week, heat existed for 142 cities.

## Why it was stuck at 142

Every other layer on this site works the same way: one national raster, one pass over the polygons. PM2.5 loads a single grid and counts every boundary against it. Land cover reads windows from a fixed global raster.

Heat was the exception. It did a per-city satellite search — find the clearest Landsat scene over *this* city, mask *its* clouds, average *those* pixels — and it did that 142 times. Which meant every heat bug we had was the same bug wearing different clothes. Six wards in Thiruvananthapuram sat in a gap between two Landsat scene footprints and could never get a value, no matter how many scenes we tried. Bhopal was 34% blank from residual cloud. And adding a city meant running the whole search again.

So we stopped fixing instances and replaced the shape. `build-lst-mosaic.py` now composites **1,512 Landsat 8/9 scenes across 388 orbital path/rows** into a single national grid at roughly 111 metres, for the 2026 pre-monsoon season. Then one zonal pass stamps a value onto every polygon at every level. Ward, village, panchayat, block — none of them are special-cased, because there is nothing left to special-case.

## The version that looked hung

The first attempt appeared to stall at about 30 scenes out of 1,516. It wasn't stuck. It was reading each scene's full thermal band — 7741 × 7591 pixels, 12.8 seconds over the network — and there were two bands per scene. About eleven hours, with no progress line frequent enough to say so.

The fix was embarrassing in hindsight: the output grid is 111 m, so every one of those 30 m pixels was being averaged away immediately. Landsat files carry pre-built lower-resolution copies inside them. Reading the quarter-scale one gives 120 m directly, in 1.2 seconds.

But there was a trap in that shortcut, and it is the kind we've been caught by before — the kind where the output looks fine.

Cloud masking works off a separate quality band, pixel by pixel. If the *temperature* overview averages 16 source pixels into one, and the *quality* overview just picks one of the 16 and discards the rest, then you'd be checking one pixel for cloud and letting fifteen through unexamined. Clouds are cold. A leaked cloud pixel drags the average down. You would get a map that looks entirely reasonable and quietly **understates** how hot places are.

So rather than assume, we measured how each overview was built. The temperature overviews are averaged — only 31% of their pixels match the matching source pixel. The quality overviews are pure subsampling — 99.9% identical. Different resampling, exactly as feared.

The quality band is a bitmask, so it compresses hard and reads whole in 1.1 seconds. It's now read at full resolution and reduced with *any-bad-wins*: a 120 m cell is thrown out if **any** of the sixteen 30 m pixels behind it was cloud, shadow, snow or cloud-adjacent. That's a stricter mask than the original slow version used, at a tenth of the cost.

**Final run: 1,512 of 1,516 scenes, zero failures, 22 minutes.**

## Then the data disagreed with us

Here is the thing we would have quietly skipped if we weren't in the habit of checking.

The heat-island story is a familiar one: more concrete, hotter; more trees, cooler. We have written a version of it ourselves. With 70,000 wards now carrying both green cover and surface temperature, we could finally test it across the whole country.

Nationally, the correlation between green cover and ward surface temperature is **−0.054**. Essentially nothing.

That's not a contradiction of the heat-island effect. It's a scale error — ours. The hottest wards in the country are in Vidarbha, and they are **99% "green"**: dry cropland in Amravati district, fallow in May, reading 57 °C at the surface. The coolest are in Pahalgam and Shopian, sitting at 20 °C because they are in the Himalaya. Comparing a Kashmiri ward with a Vidarbha ward measures latitude and altitude. It does not measure urban form.

> **Correction, 8 August 2026 (later the same day).** The ward counts in the table below are wrong, and we are leaving them visible rather than quietly editing them. Chasing an unrelated bug, we found the ward atlas carries **2,541 exact-duplicate geometries**, concentrated in a handful of cities: Patna's "628 wards" are 116 distinct shapes, Mangalore's "540" are 61, Savanur's "356" are 27. "Ward 1" appears 23 times in Patna. The *correlations* survive deduplication nearly unchanged — Patna −0.35, Mangalore −0.42, Savanur +0.82, and the national figure is identical to three decimals — so the argument below stands. The counts do not. Deduplicating the atlas is now on the roadmap.
>
> **A second update.** The puzzle this post ends on — that green cover barely tracks heat — turned out to have an answer, and it is not the one we implied. See [the follow-up](2026-08-08-tree-cover-answers-it.md): green cover was simply the wrong variable. Tree canopy alone tracks heat at **r = −0.43** nationally and in 88% of cities.

Within a single city, where climate is held constant, the effect does appear:

| City | Wards | Green vs heat | Built-up vs heat | Hottest-to-coolest ward |
|------|------:|--------------:|-----------------:|------------------------:|
| Mangalore | 540 | −0.39 | +0.50 | 11.8 °C |
| Patna | 628 | −0.38 | +0.39 | 6.6 °C |
| Chennai | 199 | −0.22 | +0.38 | 8.4 °C |
| Bengaluru | 197 | −0.17 | +0.18 | 4.7 °C |
| Hyderabad | 145 | −0.15 | +0.25 | 8.1 °C |

Greener wards are cooler; more built-up wards are hotter. In Mangalore an 11.8 °C gap separates its hottest ward from its coolest.

And then Jaipur: **+0.45**. Greener wards are *hotter*. Not an error — in arid India, "green" in the satellite's classification is largely dry cropland and scrub, which is bare and scorching by May, while the dense old city's narrow lanes shade their own ground. Savanur in Karnataka runs to +0.83.

Across 1,258 cities with 20 or more wards, the correlation is negative in **683 of them — 54%**. A little better than a coin toss.

We are not going to smooth that over. The honest statement is narrower than the one we'd have liked to make: *within a humid or temperate Indian city, green cover tracks cooler ward surfaces, and built-up share tracks hotter ones. Across India, and inside arid cities, it does not.* That is what 70,000 wards say, and it is more useful than the tidier claim, because it tells you where planting trees for cooling is the obvious move and where the answer needs local evidence.

## What to do with it

Open the [map](https://www.janvayu.in/#map), set **Boundaries** to Ward, set **Colour** to surface heat, and find your city. Tap any ward and you get all four numbers at once — annual air, surface heat, green cover, built-up — because someone checking their air shouldn't have to change a dropdown to learn how green their neighbourhood is.

One thing we found while checking this, which we'd rather say than quietly fix: **tapping a boundary had never worked.** Not since the unified map launched. The library that draws the boundaries calls a Leaflet function that Leaflet deleted in version 1.6, and we ship 1.9.4 — so every tap threw an error deep inside a browser event handler and stopped before the popup could open. Nothing looked broken. The map drew fine, the console was clean on load, and the caption underneath confidently told you to tap.

We only caught it because the pre-release check this time actually *clicked* the map instead of confirming it rendered. That's the lesson, and it's the same one as the cloud mask above: a thing that draws correctly is not a thing that works.

Two cautions, both on the map itself:

**Surface temperature is not air temperature.** This is how hot the *ground* gets under a clear pre-monsoon sky. It runs well above the shade forecast. A ward at 45 °C here is not a place where the weather report says 45.

**It is a seasonal figure, not an annual one.** The window is deliberately the hottest, clearest stretch of the year. It answers "how hot does this place get", not "how hot is this place usually".

Green cover and built-up are wards only for now. Choosing them at another level colours by air instead and tells you why, rather than handing you a grey map with no explanation.

111 wards still have no heat value and 49 have no land cover. They draw uncoloured. One ward in Thiruvananthapuram remains in that list — down from the six that the old per-city pipeline could never resolve, but not zero, and we would rather say so than paint it in.

---

*Method, coverage tables and caveats: [The Boundary Map](https://www.janvayu.in/docs/#/data-sources/boundary-map). Heat from [Landsat 8/9](https://www.usgs.gov/landsat-missions) via [Microsoft Planetary Computer](https://planetarycomputer.microsoft.com/); land cover from [ESA WorldCover 2021](https://esa-worldcover.org/); annual PM2.5 from [SatPM2.5 V6GL03](https://sites.wustl.edu/acag/datasets/surface-pm2-5/).*
