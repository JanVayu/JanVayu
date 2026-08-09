# We Were Measuring the Wrong Green

**Published:** 8 August 2026 | **Author:** Team JanVayu | **Reading time:** 6 min

---

[Earlier today](2026-08-08-heat-on-every-ward.md) we published a result that bothered us. We had put surface temperature on all 70,417 of India's municipal wards, and green cover alongside it, and the two barely moved together: a national correlation of **−0.07**. Within a single city it was **negative in 55% of them** — a coin toss. We wrote the honest, narrow version of the claim and left it there.

The narrow version was wrong. Not the arithmetic — the variable.

The [map](https://www.janvayu.in/#map) now has a **Tree cover** layer, canopy alone, for every level from ward to state. Against the same heat data, on the same wards:

| Against ward surface heat | Green cover | **Tree cover** |
|---|---:|---:|
| National correlation | −0.069 | **−0.429** |
| Within-city median correlation | −0.107 | **−0.412** |
| Cities where the relationship is negative | 680 / 1,247 (55%) | **1,087 / 1,240 (88%)** |
| Coolest fifth vs hottest fifth of wards | 0.8 °C | **4.8 °C** |

The heat-island effect was there the whole time. We were looking at it through the wrong lens.

## What "green cover" actually counts

ESA WorldCover classifies every 10 m of the planet. Its vegetation classes are tree cover, shrubland, grassland, **cropland**, wetland and mangrove. "Green cover" is all of those added together.

In a city that is a reasonable proxy for greenery — parks, scrub, roadside trees. Outside one, it is farmland. The median Indian gram panchayat is **97% green**. Eighty-seven percent of them are above 90%. That number is arithmetically correct and tells you almost nothing, because it is really measuring "not built and not bare", which describes nearly all of rural India.

Worse for the heat question: a wheat field in Vidarbha in May is *green* by this definition and is one of the hottest surfaces in the country. Fallow cropland hits 57 °C. So the layer was mixing "shaded by canopy" and "bare dirt that used to be a crop" into a single number and then being asked which places are cool.

Tree canopy on its own — WorldCover class 10 — separates places properly. The median ward is **9%** treed. The median panchayat, **12%**. The median state, **38%**. It spreads across the full range instead of piling up at 97%.

## The number that matters

**The least-treed fifth of India's wards averages 43.9 °C at the surface. The most-treed fifth averages 39.1 °C.**

A 4.8 °C difference, measured across roughly 13,500 wards on each side, in the same season, from the same satellite. Green cover's version of that comparison is 0.8 °C — which is to say, nothing.

And it holds nearly everywhere. In 88% of the 1,240 Indian cities with twenty or more wards, the wards with more canopy are the cooler ones. Bengaluru moves from −0.17 on green cover to **−0.44** on tree cover. Savanur, the town we singled out last time as a baffling reversal at +0.83, goes to **−0.03** — the reversal was cropland the entire time, not some quirk of arid urban form.

Delhi makes it concrete. Naraina, in west Delhi: 12% tree cover, 87% built, **41.5 °C**. A ward in New Delhi's Lutyens area: 45% tree cover, 53% built, **39.9 °C**. Comparable levels of construction, very different canopy, and 1.6 °C between them.

## Two corrections to this morning's post

**The earlier framing was narrower than the data warranted.** This morning's post said the honest statement was "within a humid or temperate Indian city, green cover tracks cooler ward surfaces; across India, and inside arid cities, it does not". Every word of that is defensible about *green cover*. But we framed it as a limit on what the data could show, when it was a limit on the variable we had chosen. The better move would have been to ask what green cover was actually made of before drawing conclusions from it.

**The ward counts have been revised down.** While chasing an unrelated bug we found the ward atlas carries **2,541 exact-duplicate geometries**, bunched in a few cities. Patna's "628 wards" are 116 distinct shapes. Mangalore's "540" are 61. "Ward 1" appears twenty-three times in Patna. Every correlation in this post is computed on deduplicated wards; the earlier post's table has a correction note attached, with the wrong figures left visible. The correlations barely moved — the national one is identical to three decimals — but the counts were wrong and we had printed them.

That bug was itself only found because a total went *down*. Our new land-cover pass draws every polygon of a level into one grid, so each pixel belongs to exactly one ward — fine when wards tile the map, wrong when they overlap. Patna came back with 556 of 628 wards having no data at all. It looked exactly like ordinary missing data; the only reason it got investigated is that the previous method had managed more.

## What to do with it

Open the [map](https://www.janvayu.in/#map), pick any boundary level, set **Colour** to tree cover. Every level except villages has it — ward, block, panchayat, city, district, state — at 99.93% coverage or better. Tap anything for all five figures at once: annual air, surface heat, tree cover, green cover, built-up.

If you are arguing for planting in a specific ward, the ward's canopy percentage and its surface temperature are now both a click away, next to the same figures for the ward next door.

Two cautions, unchanged and still on the map itself. **Surface temperature is not air temperature** — it is how hot the ground gets under a clear pre-monsoon sky, well above the shade forecast. And **this is a seasonal figure**, deliberately the hottest clearest stretch of the year: it answers "how hot does this place get", not "how hot is it usually".

We are also not claiming canopy *causes* the difference. Wards with more trees differ in other ways — density, building materials, water, wealth. What the data supports is that canopy is the vegetation measure that tracks surface heat in India, and cropland-inclusive "green cover" is not.

---

*Method, per-level coverage and caveats: [The Boundary Map](https://www.janvayu.in/docs/#/data-sources/boundary-map). Land cover from [ESA WorldCover 2021](https://esa-worldcover.org/) (CC BY 4.0); heat from [Landsat 8/9](https://www.usgs.gov/landsat-missions) via [Microsoft Planetary Computer](https://planetarycomputer.microsoft.com/); annual PM2.5 from [SatPM2.5 V6GL03](https://sites.wustl.edu/acag/datasets/surface-pm2-5/).*
