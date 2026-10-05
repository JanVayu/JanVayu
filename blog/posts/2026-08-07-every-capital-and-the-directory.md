# Every Capital, and the Directory We Never Read

**Published:** 7 August 2026 | **Author:** Team JanVayu | **Reading time:** 6 min

---

This morning we published a post saying West Bengal's municipal wards were not openly available. By afternoon we had found them, added seven Bengal cities, and written a correction. By evening we had found 45 more cities, including every state capital we had ever written off, in the same place.

The ward atlas now covers **142 cities and 9,015 wards**. Every state capital in the Northeast and most others are on it; we still lack, among others, Gandhinagar, Amaravati, Leh and Kavaratti. A week ago it covered 39 cities.

*Update, 2 October 2026: the city dropdown was replaced by a national map of 68,596 wards (v26.6.151).*

None of this came from newly published data. It came from finally reading a directory listing.

## The same mistake, three times

Our ward boundaries are downloaded from a GitHub release maintained by the volunteer project [indianopenmaps.com](https://indianopenmaps.com). Our code fetched one file from it, the Swachh Bharat Mission ward set.

Swachh Bharat is a national release with real holes. It carries wards for only seven West Bengal municipalities, 67 small Assam towns but not Guwahati, and none for Manipur, Mizoram or Tripura. (The release notes list West Bengal, Tripura, Mizoram and Manipur as missing; the counts are ours, from the file as it stood on 2 October 2026.) Each time we hit one of those holes, we searched elsewhere: OpenStreetMap, DataMeet, state portals. When those came up empty, we concluded the data did not exist, and said so in public.

We never listed the *other files in the release we were already downloading from*.

Two more ward datasets were sitting in it. One has 1,633 ward polygons across 52 West Bengal urban local bodies, from the state's AMRUT GIS master-plan programme. The other has **9,100 wards across 157 towns**, from the ESRI India Living Atlas, reaching every state in the country.

We had been reading one file out of a folder and calling the rest of the folder empty.

## What was hiding in there

Seven state capitals had never had a ward map on JanVayu. All seven were in that data:

**Srinagar** (75 wards), **Agartala** (51), **Imphal** (28), **Shillong** (27), **Itanagar** (20), **Aizawl** (19) and **Kohima** (19). So were **Madurai** (100) and **Gurugram** (35), both of which we had listed as blocked for months.

Once they were on the map, two things became visible that nobody could see before.

**The Northeast is not one air-quality story.** It is usually discussed as a single clean region, and mostly that holds: Itanagar averages 23.5 µg/m³ over the year, Aizawl 23.9, Kohima 24.0, Shillong 30.2, Imphal 31.3. All are well under India's annual limit of 40.

**Agartala averages 61.3.** That is two and a half times Itanagar, above India's limit in every one of its 51 wards, and in the same range as Durgapur and Asansol in the industrial belt of West Bengal. Tripura's capital has an air problem its neighbours do not, and it stayed invisible because nobody had the ward map to show it.

**Gurugram enters the atlas at 81.9 µg/m³**, the fourth dirtiest city of the 142. That completes the NCR picture: Delhi 93.4, Ghaziabad 92.7, Faridabad 83.4, Gurugram 81.9. Four adjoining cities have four different municipal corporations and one shared airshed, with no shared municipal authority. The statutory body for the airshed is the Commission for Air Quality Management ([CAQM Act, 2021](https://prsindia.org/billtrack/the-commission-for-air-quality-management-in-national-capital-region-and-adjoining-areas-bill-2021)).

At the other end, the cleanest ward in the 142-city atlas is now **Ward 3 in Port Blair, at 18.5 µg/m³**, still more than three times the WHO annual guideline of 5. Across all 9,015 wards, **5,792 (64.2%) exceed India's own annual limit of 40, and not one meets the WHO guideline.**

*Update, 2 October 2026: across the 68,596 wards now on the map, 57.7% exceed 40, and none is at or under 5 (the cleanest is 10.3).*

## Two bugs we found by re-running everything

While adding the new cities we re-ran the satellite heat pass over all 142, not only the new ones. The old cities were still carrying values measured from 2023 scenes, because the process only handled cities flagged as missing data, so the earliest ones had never been refreshed.

Two real defects came out of it.

**Delhi was measuring only 236 of its 290 ward polygons.** (These are DataMeet's older delimitation; the unified Municipal Corporation of Delhi has had 250 wards since 2022, per the [Delhi State Election Commission](https://sec.delhi.gov.in/sites/default/files/SEC/generic_multiple_files/public_notice_for_publication_of_draft_list_of_polling_stations_for_inviting_suggestions_objections.pdf).) Delhi straddles two Landsat satellite paths, so no single scene contains the whole city. Finding none that covered Delhi completely, our code fell back to whichever scene was least cloudy. It picked one covering 82.8% of the city over one covering 99.3% that was equally clear. It was optimising for the wrong thing. Ranking by coverage first fixed it: Delhi is now 290/290 from one scene.

**Gaps were being left, not filled.** If cloud sat over part of a city, those wards simply got no heat value. Now the next-clearest scenes are tried until nothing is left unmeasured.

One gap survives, and we described it wrongly at first. **Six of Thiruvananthapuram's 100 wards have no heat value, and cloud is not the reason.** They sit in a seam between Landsat scene footprints. We checked 8 pre-monsoon scenes and 6 more across a full year, and every one returns about 5,500 pixels of nothing over those wards. Closing it means stitching two satellite paths together, which we cannot yet do. Those wards are drawn uncoloured rather than filled with a guess.

*Update, 2 October 2026: the national heat mosaic (v26.6.148) filled five of the six; one remains.*

## The chatbot can now answer for your district

Two numbers existed in our data but Ask JanVayu could not reach them.

Every ward has carried an annual satellite PM2.5 figure for days. The chatbot's instructions told it, in as many words, to use that number, but the code that assembles what the chatbot sees never included it. It was told to use a figure it was never shown. That is fixed: ask about a ward and you get its annual average and where it ranks among its city's wards.

Village air was not reachable at all. Ask "how is the air in my village" and you got a national average, even though every one of India's 584,615 villages has an estimate. It now answers by **district**. That covers 645 districts, giving the district's village average, how many villages exceed India's limit, and the dirtiest and cleanest village by name.

We chose district over village on purpose. A full village-name lookup would be about 79 MB, and about 12 to 14% of India's distinct village names occur in more than one district (our count of the village files, lower-cased names). "Rampur" is not an address.

## What we would tell anyone doing this

The lesson is not about air quality. Three times we searched hard in the wrong place, found nothing, and published a confident negative. "No open data exists for X" is a claim, and it needs a source just as a number does. We gave it three external checks and never the obvious internal one.

If you maintain something that pulls from a public data release, list the whole release, not only the file you already know about.

Find your ward at [janvayu.in](https://www.janvayu.in/#ward-map). If your city is still missing, or your boundaries look wrong, write to **contribute@janvayu.in**. If you know of an open source for Siliguri's 47 municipal wards, we would particularly like to hear from you. It is the one large city we have looked for in every source we know and cannot find.
