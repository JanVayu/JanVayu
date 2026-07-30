# The Air Your MP Answers For: Our Maps Now Cover 39 Cities, 543 Constituencies, and the Places the Smoke Starts

**Published:** 30 July 2026 | **Author:** Team JanVayu | **Reading time:** 6 min

---

Until this week, our ward map could show you fifteen cities. If you lived in Patna, Ludhiana, Ghaziabad or Indore — some of the most polluted places in the country — the answer to "how bad is my ward?" was: we don't have the boundaries. Now we do, for 24 more cities. And the live map learned something bigger: it can show you the air of the constituency that elected your MP.

Here is what changed, where the data comes from, and what we found while cleaning it.

## From 15 cities to 39

["How Polluted Is Your Ward?"](https://www.janvayu.in/#ward-map) now covers **39 cities**. The 24 new ones: Agra, Amritsar, Coimbatore, Dehradun, Ghaziabad, Gwalior, Indore, Jalandhar, Jodhpur, Kota, Ludhiana, Meerut, Moradabad, Muzaffarpur, Nagpur, Nashik, Patna, Prayagraj, Raipur, Rajkot, Ranchi, Surat, Vadodara and Visakhapatnam.

The boundaries come from the **Swachh Bharat Mission**, where every urban local body uploaded its own ward map. We reached them through [Indian Open Maps](https://indianopenmaps.com), a volunteer-run archive (more on it below). For each new city, the air layer works the way it always has: estimated live from the city's own CPCB/WAQI monitors, showing the citywide spread — not an exact street-by-street reading, and the map says so.

[Ask JanVayu](https://www.janvayu.in/ask) can now answer "which ward is worst right now?" for all 39 cities too.

## What government ward data actually looks like

We publish how the sausage is made, so here it is.

Patna's file contained **628 boundary entries for a city with 71 approved wards** — hundreds of abandoned drafts sat alongside the real ones, so we keep only the versions marked APPROVED. Meerut's corporation named every single ward "M_Ward"; we number them so search works. Kota is served by two municipal corporations that each have a "Ward 5". Rajkot and Vadodara uploaded only 18 coarse revenue wards each, so their maps are blockier than the others — that is what their corporations published, and we show it rather than pretend otherwise.

Some cities we wanted are simply absent: the SBM dataset has **no ward boundaries for West Bengal, Manipur, Mizoram or Tripura**, and no usable file for Guwahati, Srinagar or Madurai. If your city is one of these, the missing map is itself a fact about how your government publishes data — and a fair subject for an RTI.

## The air your MP answers for

The [live map](https://www.janvayu.in/#map) has four new toggles. The one we care most about is **MPs**: all **543 Lok Sabha constituencies** (boundaries from the Local Government Directory / Bharatmaps), each coloured by the air its residents are breathing right now.

One honest caveat, stated on the map itself: most constituencies contain no monitor at all. We estimate each one from the nearest monitored cities, and where the nearest monitor is more than about 200 km away we colour the constituency grey rather than guess. The grey patches are not a rendering gap — they are the actual state of India's monitoring network, and they are worth staring at.

Tap any constituency and you get its estimated AQI, which monitor it leans on, and two buttons: one to the [Accountability tracker](https://www.janvayu.in/#accountability), one to a pre-filled [RTI template](https://www.janvayu.in/#rti-assistant). An **MLAs** toggle does the same for Vidhan Sabha constituencies, and a **Districts** toggle covers all 785 districts.

Air quality in India is usually discussed as a city problem. But budgets are voted, questions are asked, and clean-air funds are spent by people elected from constituencies. Naming the constituency puts the number where the responsibility lives.

## Where the smoke starts

The fourth toggle, **Sources**, plots the fixed infrastructure that makes air dirty:

- **1,473 landfills and 5,396 dumpsites** (Swachh Bharat Mission urban sanitation data) — the kind of sites behind recurring landfill fires like Bhalswa and Ghazipur;
- **459 coal mines**, each with its 2019–20 production tonnage (Indian coal-mines dataset, Harvard Dataverse, CC0);
- **1,092 industrial parks in CPCB's red and orange categories** (PM Gati Shakti data). The Central Pollution Control Board grades industrial areas by pollution potential — red is the highest band, orange the next — so these are, by the government's own classification, the industrial areas most likely to foul the air around them;
- **376 Special Economic Zones**.

None of this says "this site caused today's smog" — attribution needs source-apportionment studies, and we have [a whole panel](https://www.janvayu.in/#apportionment) about those. What the overlay does is simpler: when a town's air is persistently bad, you can now see what sits upwind.

## Who breathes it

On the ward map, two new overlays answer the question the AQI number never does: who is actually in this air? Toggle **Schools** (from the UDISE education directory) and **Health centres** (from Bharatmaps) and the dots appear over the ward colours. A school inside a dark-red ward is not an abstraction — it is a specific building with children in it, and now it is visible.

## About Indian Open Maps — and an honest note on licensing

Every boundary and source location above comes to us via [indianopenmaps.com](https://indianopenmaps.com), a volunteer project by one mapper (GitHub: ramSeraph) that collects geodata from official portals — SBM, the Local Government Directory, Bharatmaps, Gati Shakti, NCOG — and republishes it in usable formats, 574 datasets and counting. It is the kind of quiet public-interest infrastructure that deserves to be named and thanked.

The honest note: much of this data is flagged *"not-so-open"* upstream. It was published by government bodies, on public portals, but mostly without an explicit open licence. We ship simplified copies with attribution rather than live-scraping anyone's servers, the coal-mine data is properly CC0, and we document all of it in our [Data Source Selector](https://www.janvayu.in/#source-selector). If any agency involved would rather grant these datasets a real open licence, nothing would make us happier — that is the actual fix.

## Try it

Open the [ward map](https://www.janvayu.in/#ward-map) and find your ward — then toggle the schools. Open the [live map](https://www.janvayu.in/#map), press **MPs**, and look at your constituency; if it is grey, you have just learned something about the monitoring network. And if your city's wards are missing or look wrong, that is government data we faithfully passed on — tell us at **contribute@janvayu.in**, or better, ask your corporation why.
