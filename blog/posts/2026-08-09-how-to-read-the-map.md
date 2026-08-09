# How to Read the JanVayu Map

**Published:** 9 August 2026 | **Author:** Team JanVayu | **Reading time:** 9 min

---

The [map](https://www.janvayu.in/#map) now holds a number for every place in India. Not every city — every *place*: all 983,149 administrative areas the country is divided into, from the 36 states down to the 584,615 villages, and every gram panchayat, block, district, city and ward in between.

That is a lot of map, and it does not explain itself. This post is the manual we should have written first. No engineering — just what the thing shows, what the words mean, and what you can actually find out with it.

---

<img src="/blog/diagrams/reading-the-map.svg" alt="How to read the JanVayu map: the dots are live readings from about 565 CPCB monitors updated hourly, the shading underneath is a satellite estimate averaged over a whole year, and the two are never one sentence. Pick one of seven levels from the Boundaries menu covering 983,149 areas, pick one of nine measures from the Colour menu, then tap any area. Caution: green cover counts cropland, so the typical Indian district is 97% green and 14% treed — use tree cover if you want to know about trees." style="width:100%;max-width:980px;display:block;margin:1.5rem auto;">

## First: the map shows two different things, and mixing them up is the one real mistake

Everything on the map is either **right now** or **over a year**. They are not the same measurement, they do not answer the same question, and no honest sentence contains both without saying so.

**Right now** is the coloured dots. Those are live readings from real monitoring machines — about 565 continuous CPCB stations, served to us through WAQI. A dot tells you the air at that machine, in the last hour or so. Tap one and you get the AQI, the PM2.5 and PM10 in µg/m³, the station's name, and when it last reported.

**Over a year** is the shaded areas underneath. Those are not measurements. They are satellite estimates of what a place breathed *across all of 2024* — a yearly average. They cannot tell you whether to go for a walk this evening. They can tell you what living there does to you over years, which is the thing that actually shortens lives.

Why have both? Because India has roughly 565 continuous stations for 1.4 billion people. If we only showed live monitors, most of the country would be blank forever. The satellite layer is the only estimate that reaches everywhere — including the village that will never have a machine in it.

So: **dots are today, colours are the year.** Everything below is about the colours.

---

## Finding your place: the Boundaries menu

India is divided up more than once, and which division applies to you depends on where you live.

Open **Boundaries** and you get seven choices:

**If you live in a town or city:**
- **City / ULB** — the municipal body itself. 3,359 of them.
- **Ward** — the individual councillor's ward inside it. 68,596 nationally.

**If you live in a village or the countryside:**
- **Village** — 584,615 of them, the smallest unit there is.
- **Gram panchayat** — 319,287. The tier where most rural governance actually happens.
- **Block / mandal / tehsil** — 6,471. What a district administration works in.

**Either way:**
- **District (zila)** — 785.
- **State / UT** — 36.

Pick one and zoom in. Each level appears at the zoom where it makes sense: states are visible from far out, wards and villages only when you are close. If you have picked a level and see nothing, you are too far away — the note under the map will say so.

**Fastest route: press "My area."** It jumps to where you are, at a zoom where the level you picked is actually drawn.

Then **tap any area**. You get its name, and every number the map holds about it.

---

## What the colours mean: the Colour menu

Nine measures. Every area carries all nine, at every level.

### Air (annual)

The yearly average PM2.5, from satellite. Compare it against two lines that matter:

- **India's own legal limit is 40 µg/m³** a year.
- **The WHO guideline is 5.**

Most of India is above the first. Almost nothing is near the second.

### Air by season

The same year, split four ways: **winter** (Dec–Feb), **summer** (Mar–May), **monsoon** (Jun–Sep) and **post-monsoon** (Oct–Nov).

This is the setting most people should look at, because **an annual average hides how bad the bad months are.** Villages in West Tripura average 54.1 µg/m³ across the year — which sounds like one steady problem. Split it up and the monsoon reads 24.2 while winter reads 106. That is more than four times, and nobody actually experiences 54. They experience clean air in July and a wall of smoke in January.

The colours stay on the same scale between seasons on purpose. When you switch from monsoon to winter and the map turns red, that is the air changing, not the scale.

### Surface heat

How hot the **ground** gets, from Landsat satellites, averaged over the pre-monsoon season — the hottest, clearest part of the year.

This is not the weather forecast. It is the temperature of the land surface itself: tarmac, roof, bare soil, field. It runs well above what a thermometer in the shade says. A 50°C reading here does not mean 50°C air.

It is the honest measure of which neighbourhoods bake — and it is where a treeless colony and a leafy one, two kilometres apart, stop looking similar.

### Tree cover, green cover, built-up

All three come from ESA WorldCover 2021, which classifies the whole planet at 10-metre resolution.

**This is the one place the map can mislead you, so it is worth a minute.**

- **Tree cover** is tree canopy. Only that.
- **Green cover** is anything vegetated — trees, but also shrub, grass, wetland, **and cropland**.
- **Built-up** is buildings, roads and other hard surface.

In rural India, "green cover" is mostly **farmland**. The typical Indian district's villages are **97% green and 14% treed.** In Nagaur, Rajasthan, the typical village is **98% green and 0% treed.**

Both numbers are true. Only one of them means what people mean when they ask "is there any greenery here". If you want to know whether there are trees, **look at tree cover.** If a place shows deep green on the green-cover layer and near-white on tree cover, you are looking at fields, not forest.

This distinction is why tree cover exists as its own layer rather than being folded into green cover — the two answer different questions, and only one of them tracks heat. [The analysis is here](/blog/#/posts/2026-08-08-tree-cover-answers-it).

---

## Three things you can actually find out

### 1. "When is the air worst where I live?"

Set **Boundaries** to your level, **Colour** to air, then step the season menu through winter → summer → monsoon → post-monsoon and watch your area change.

For most of north India the answer is post-monsoon and winter, and the size of the swing is the story. Amritsar's villages average 40.1 µg/m³ in the monsoon and 101.3 after it. That is the same fields, the same houses, the same people — two and a half times the pollution, for a couple of months, every year.

Knowing your own months is worth more than knowing your annual number. It tells you when to press, and when the air you are being shown in a press release was measured.

### 2. "Is my area hotter than the one next to it, and why?"

Set **Colour** to surface heat and zoom in until wards or villages appear. Then switch to tree cover and look at the same screen.

Across India these two track each other: the treeless places are the hot ones. Inside Maharashtra, villages in Akola have about **1% tree canopy and ground temperatures averaging 53.9°C**; villages in Sindhudurg have **71% canopy and 43.5°C** — ten degrees cooler, in the same state.

Be careful with that comparison, though. Sindhudurg is coastal and wet, Akola is inland and dry, and rainfall and elevation do a great deal of that work. The map shows you a pattern, not a proof. Where it is genuinely useful is **close up** — two wards in one city, same climate, same rainfall, one with trees and one without. There the difference is about the ground, not the geography.

### 3. "Does the thing I suspect actually hold here?"

Under the map there is a **Compare** panel. Pick any two of the nine measures, press Compare, and it plots every area currently on your screen against each other, with the strength of the relationship.

It answers questions about *your* place, not the country: whatever is on screen is what it uses, and it tells you how many areas that was. Zoom somewhere else, press it again, get a different answer. That is the point — "does tree cover cool things down in my city" is a different question from "does it nationally", and until now only the second had an answer.

---

## Two more overlays worth knowing about

**Schools** and **Health centres** put a dot on every school (UDISE) and every health centre (Bharatmaps) in view, over whatever you have coloured the map by. It answers a question that shading alone cannot: *who is actually breathing this.* A dark-red ward is an abstraction. A dark-red ward with forty schools in it is an argument.

---

## What this map cannot tell you

Being clear about this is more useful than another feature.

**It cannot tell you about the kiln next door.** The satellite air estimate is roughly one kilometre across. It is good at "what does this district breathe over a year" and blind to a single smelter, crusher or highway at the end of your street. Byrnihat — a small industrial pocket that topped IQAir's global city ranking — reads far lower here than its own ground station does. If you live beside a point source, this map understates you.

**It cannot tell you about today.** Nothing in the coloured layers is a forecast or a current reading. If someone quotes a yearly average as today's air quality, they are wrong, and if we ever do it, tell us.

**Land cover is from 2021.** Construction since then does not appear.

**Some areas have no value at all**, and are drawn uncoloured rather than filled with a guess: 143 villages have no land cover, 749 have no heat reading, a few dozen wards likewise. These are slivers and odd shapes too small for the satellite grid to resolve. A grey area means "we don't know", never "zero".

**Boundaries are as good as their sources.** Ward boundaries carry whatever delimitation each municipality last uploaded, which is not the same year everywhere. A handful of cities — Siliguri among them — are still missing because no open source has published them.

---

## Where the numbers come from

Every figure on the map is public data anyone can check:

- **Live air:** CPCB monitors, via WAQI.
- **Annual and seasonal PM2.5:** SatPM2.5 V6GL03, Atmospheric Composition Analysis Group, Washington University in St. Louis — satellite estimates calibrated against ground monitors. 2024. CC BY 4.0.
- **Surface heat:** Landsat 8 and 9, USGS, 2026 pre-monsoon.
- **Tree, green and built-up cover:** ESA WorldCover 2021, CC BY 4.0.
- **Boundaries:** the Local Government Directory and Swachh Bharat Mission, republished via [indianopenmaps.com](https://indianopenmaps.com), plus West Bengal AMRUT and Living Atlas ward layers.

The full method, with the coverage figures and known limits for every layer, is in [The Boundary Map](/docs/#/data-sources/boundary-map).

---

## Try it on your own place

Open the [map](https://www.janvayu.in/#map), press **My area**, set Boundaries to **Ward** if you are in a town or **Village** if you are not, and tap where you live.

Then do the thing this map was built for: switch the season to winter, and look again.

If something reads wrong for a place you know well — a boundary in the wrong spot, a name misspelt, a number that cannot be right — [tell us](https://github.com/JanVayu/JanVayu/issues). Local knowledge is the one input a satellite does not have.
