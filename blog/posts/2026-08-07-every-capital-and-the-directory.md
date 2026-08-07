# Every Capital, and the Directory We Never Read

**Published:** 7 August 2026 | **Author:** Team JanVayu | **Reading time:** 6 min

---

This morning we published a post saying West Bengal's municipal wards were not openly available. By afternoon we had found them, added seven Bengal cities, and written a correction. By evening we had found 45 more cities — including every state capital we had ever written off — in the same place.

The ward atlas now covers **142 cities and 9,015 wards**. Every state and union-territory capital in India is on it. A week ago it covered 39 cities.

None of that came from new data being published. All of it came from finally reading a directory listing.

## The same mistake, three times

Our ward boundaries are downloaded from a GitHub release maintained by the volunteer project [indianopenmaps.com](https://indianopenmaps.com). Our code fetches one file from it: `SBM_Wards.geojsonl.7z`, the Swachh Bharat Mission ward set.

Swachh Bharat is a national release with real holes — it carries no wards at all for West Bengal, Assam, Manipur, Mizoram or Tripura. Every time we hit one of those holes, we searched outside: OpenStreetMap, DataMeet, state portals. When those came up empty, we concluded the data did not exist, and said so in public.

What we never did was list the *other files in the release we were already downloading from*.

There were two more ward datasets sitting in it. `WB_AMRUT_Wards` — 1,633 ward polygons across 52 West Bengal urban local bodies, from the state's AMRUT GIS master-plan programme. And `LivingAtlas_Wards` — **9,100 wards across 157 towns**, from the ESRI India Living Atlas, reaching every state in the country.

We had been reading one file out of a folder and calling the rest of the folder empty.

## What was hiding in there

Seven state capitals had never had a ward map on JanVayu. All seven were in that file:

**Srinagar** (75 wards), **Agartala** (51), **Imphal** (28), **Shillong** (27), **Itanagar** (20), **Aizawl** (19) and **Kohima** (19). Along with **Madurai** (100) and **Gurugram** (35), both of which we had listed as blocked for months.

And the moment they were on the map, two things became visible that nobody could see before.

**The Northeast is not one air-quality story.** It usually gets discussed as a single clean region, and mostly that holds: Itanagar averages 23.5 µg/m³ over the year, Aizawl 23.9, Kohima 24.0, Shillong 30.2, Imphal 31.3. All well under India's annual limit of 40.

**Agartala averages 61.3.** Two and a half times Itanagar, above India's limit in every one of its 51 wards, and in the same range as Durgapur and Asansol in the industrial belt of West Bengal. Tripura's capital has an air problem that its neighbours do not, and it has been invisible because nobody had the ward map to show it.

**Gurugram enters the atlas at 81.9 µg/m³** — the fourth dirtiest city of the 142. That completes the NCR picture: Delhi 93.4, Ghaziabad 92.7, Faridabad 83.4, Gurugram 81.9. Four adjoining cities, four different municipal corporations, one shared airshed and no shared authority over it.

At the other end, the cleanest ward in India is now **Ward 3 in Port Blair, at 18.5 µg/m³** — still more than three times the WHO annual guideline of 5. Across all 9,015 wards, **5,792 (64.2%) exceed India's own annual limit of 40, and not one meets the WHO guideline.**

## Two bugs we found by re-running everything

While adding the new cities we re-ran the satellite heat pass over all 142, rather than only the new ones. That was worth doing, because the old cities were still carrying values measured from 2023 scenes — the pipeline only ever processed cities flagged as missing data, so the earliest ones had never been refreshed.

Two real defects came out of it.

**Delhi was measuring only 236 of its 290 wards.** Delhi straddles two Landsat satellite paths, so no single scene contains the whole city. Our code, finding nothing that covered Delhi completely, fell back to whichever scene was least cloudy — and picked one covering 82.8% of the city over one covering 99.3% that was equally clear. It was optimising for the wrong thing. Ranking by coverage first fixed it: Delhi is now 290/290 from one scene.

**Gaps were being left rather than filled.** If cloud sat over part of a city, those wards simply got no heat value. Now the next-clearest scenes are tried until nothing is left unmeasured.

One gap survives all of that, and it is worth being precise about because we described it wrongly at first. **Six of Thiruvananthapuram's 100 wards have no heat value, and it is not cloud.** They sit in a seam between Landsat scene footprints: we checked 8 pre-monsoon scenes and 6 more across a full year, and every one returns about 5,500 pixels of nothing over those wards. Closing it means stitching two satellite paths together, which our pipeline cannot yet do. Those wards are drawn uncoloured rather than filled with a guess.

## The chatbot can now answer for your district

Two numbers existed in our data but could not be reached by Ask JanVayu.

Every ward has carried an annual satellite PM2.5 figure for days. The chatbot's instructions told it, in as many words, to use that number. The code that assembles what the chatbot sees never actually included it — so it was being told to use a figure it was never shown. Fixed: ask about a ward now and you get its annual average, and where it ranks among its city's wards.

And village air was not reachable at all. Ask "how is the air in my village" and you got a national average, despite every one of India's 584,615 villages having an estimate. It now answers by **district** — 645 of them, with the district's village average, how many exceed India's limit, and the dirtiest and cleanest village by name.

District, not village, is deliberate. A full village-name lookup would be about 79 MB, and 15% of India's village names occur in more than one district. "Rampur" is not an address.

## What we would tell anyone doing this

The useful lesson here is not about air quality. Three times we searched hard in the wrong place, found nothing, and published a confident negative. "No open data exists for X" is a claim, and it needs sourcing exactly like a number does. We gave it three external checks and never the obvious internal one.

If you maintain something that pulls from a public data release: list the whole release. Not the file you already know about.

Find your ward at [janvayu.in](https://www.janvayu.in/#ward-map). If your city is still missing, or your boundaries look wrong, write to **contribute@janvayu.in** — and if you know of an open source for Siliguri's 47 municipal wards, we would particularly like to hear from you. It is the one large city we have looked for in every source we know and genuinely cannot find.
