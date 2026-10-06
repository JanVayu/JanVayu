# Our maps now show the air your MP answers for, in 39 cities and 543 constituencies

**Published:** 30 July 2026 | **Author:** Team JanVayu | **Reading time:** 6 min

---

Until this week, our ward map could show you fifteen cities. If you lived in Patna, Ludhiana, Ghaziabad or Indore, some of the most polluted places in the country, the answer to "how bad is my ward?" was that we did not have the boundaries. Now we do, for 24 more cities. The live map can also show the air of the constituency that elected your MP.

Below: what changed, where the data comes from, and what we found while cleaning it.

*Update, 2 October 2026: the ward atlas covered 97 cities by 7 August 2026 (v26.6.139) and 142 cities by September. The ward atlas panel was retired in v26.6.151 and its wards are now part of the boundary map.*

## From 15 cities to 39

["How Polluted Is Your Ward?"](https://www.janvayu.in/#ward-map) now covers **39 cities**. The 24 new ones: Agra, Amritsar, Coimbatore, Dehradun, Ghaziabad, Gwalior, Indore, Jalandhar, Jodhpur, Kota, Ludhiana, Meerut, Moradabad, Muzaffarpur, Nagpur, Nashik, Patna, Prayagraj, Raipur, Rajkot, Ranchi, Surat, Vadodara and Visakhapatnam.

The boundaries come from the **Swachh Bharat Mission**, where every urban local body uploaded its own ward map. We reached them through [Indian Open Maps](https://indianopenmaps.com), a volunteer-run archive described further down. For each new city, the air layer works as it always has. It is estimated live from the city's own CPCB/WAQI monitors and shows the spread across the city. It is not an exact street-by-street reading, and the map says so.

[Ask JanVayu](https://www.janvayu.in/ask) can now answer "which ward is worst right now?" for all 39 cities too.

## What government ward data actually looks like

Here is how the data gets made usable.

Patna's file contained **628 boundary entries for a city with 71 approved wards**. Hundreds of abandoned drafts sat alongside the real ones, so we keep only the versions marked APPROVED. Meerut's corporation named every ward "M_Ward", so we number them to make search work. Kota is served by two municipal corporations that each have a "Ward 5". Rajkot and Vadodara uploaded only 18 coarse revenue wards each, so their maps are blockier than the others. That is what their corporations published, and we show it as it is.

Some cities we wanted are missing: the SBM dataset has **no ward boundaries for West Bengal, Manipur, Mizoram or Tripura**, and no usable file for Guwahati, Srinagar or Madurai. If your city is one of these, the missing map tells you something about how your government publishes data, and it is a fair subject for an RTI.

*Update, 2 October 2026: maps now exist for these places. West Bengal, which we had wrongly said was unavailable, came from AMRUT data (v26.6.139), and Srinagar, Agartala, Imphal, Shillong, Itanagar, Aizawl, Kohima and Madurai from other open sources, so the inference above no longer holds.*

## The air your MP answers for

The [live map](https://www.janvayu.in/#map) has four new toggles. The one we care most about is **MPs**: all **543 Lok Sabha constituencies** (boundaries from the Local Government Directory / Bharatmaps), each coloured by the air its residents are breathing right now.

Most constituencies contain no monitor at all, and the map says so. We estimate each one from the nearest monitored cities. Where the nearest monitor is more than about 200 km away, we colour the constituency grey rather than guess. The grey patches are not a drawing fault. They show where India's monitoring network has gaps.

Tap any constituency and you get its estimated AQI, which monitor it leans on, and two buttons: one to the [Accountability tracker](https://www.janvayu.in/#accountability), one to a pre-filled [RTI template](https://www.janvayu.in/#rti-assistant). An **MLAs** toggle does the same for Vidhan Sabha constituencies, and a **Districts** toggle covers all 785 districts.

Air quality in India is usually discussed as a city problem. Budgets are voted, questions are asked and clean-air funds are spent by people elected from constituencies. Naming the constituency puts the number next to the person responsible for it.

## Where the smoke starts

The fourth toggle, **Sources**, plots the fixed sites that make air dirty. It shows 1,473 landfills and 5,396 dumpsites (Swachh Bharat Mission urban sanitation data), the kind of sites behind recurring landfill fires like Bhalswa and Ghazipur. It shows 459 coal mines, each with its 2019–20 production tonnage (Indian coal-mines dataset, Harvard Dataverse, CC0). It shows 1,092 industrial parks in CPCB's red and orange categories (PM Gati Shakti data), and 376 Special Economic Zones.

The Central Pollution Control Board grades industrial areas by how much they can pollute. Red is the highest band and orange the next, so by the government's own classification these are the industrial areas most likely to foul the air around them.

None of this says "this site caused today's smog". Attribution needs source-apportionment studies, and we have [a whole panel](https://www.janvayu.in/#apportionment) about those. The overlay does something simpler. When a town's air is persistently bad, you can see what sits upwind.

## Who breathes it

On the ward map, two new overlays answer a question the AQI number never does: who is actually in this air? Toggle **Schools** (from the UDISE education directory) and **Health centres** (from Bharatmaps) and the dots appear over the ward colours. A school inside a dark-red ward is a specific building with children in it, and now you can see it.

## About Indian Open Maps, and a note on licensing

Every boundary and source location above comes to us via [indianopenmaps.com](https://indianopenmaps.com), a volunteer project by one mapper (GitHub: ramSeraph). It collects geodata from official portals (SBM, the Local Government Directory, Bharatmaps, Gati Shakti, NCOG) and republishes it in usable formats. It deserves to be named and thanked.

Much of this data is flagged *"not-so-open"* upstream. Government bodies published it on public portals, mostly without an explicit open licence. We ship simplified copies with attribution rather than live-scraping anyone's servers. The coal-mine data is properly CC0, and we document all of it in our [Data Source Selector](https://www.janvayu.in/#source-selector). If any agency involved would rather grant these datasets a real open licence, that is the actual fix, and we would welcome it.

## Try it

Open the [ward map](https://www.janvayu.in/#ward-map), find your ward, then toggle the schools. Open the [live map](https://www.janvayu.in/#map), press **MPs**, and look at your constituency. If it is grey, you have learned something about the monitoring network. If your city's wards are missing or look wrong, that is government data we passed on as we found it. Tell us at **contribute@janvayu.in**, or ask your corporation why.
