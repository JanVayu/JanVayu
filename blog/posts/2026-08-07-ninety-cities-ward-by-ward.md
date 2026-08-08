# Ninety Cities, Ward by Ward — and the One We Had to Go Somewhere Else For

**Published:** 7 August 2026 | **Updated:** 7 August 2026 | **Author:** Team JanVayu | **Reading time:** 7 min

> **This post has been overtaken twice in one day.** The atlas is now **142 cities and 9,015 wards**, and every state capital is on it. The follow-up — [Every Capital, and the Directory We Never Read](2026-08-07-every-capital-and-the-directory.md) — explains how, and why the same mistake caught us three times.

---

If you live in an Indian city, the number you see on the news is a city average. It is one figure standing in for a few million people, and it hides the thing you actually want to know: whether *your* neighbourhood breathes worse than the one across the flyover.

Eight days ago our ward map covered 39 cities. Today it covers **97 cities and 6,936 wards**. Open [How Polluted Is Your Ward?](https://www.janvayu.in/#ward-map), pick your city, and press **Air, yearly**.

## What was actually stopping us

Not the air data. Since Wednesday every one of India's 584,615 villages carries an annual PM2.5 estimate from satellite, and the same grid covers every city block in the country. Air was never the constraint.

The constraint was a list. Somewhere in our code sat a hand-written allowlist of 39 city names — the ones a person had got round to adding. Meanwhile the source it was reading from, the Swachh Bharat Mission ward release mirrored by the volunteer project [indianopenmaps.com](https://indianopenmaps.com), holds **3,675 urban local bodies and 70,416 ward polygons**. We had been drawing from a lake through a straw.

Mining it properly added 50 cities. It also turned up a bug worth confessing: Swachh Bharat files a single city under several spellings of its own state — "Andhra Pradhesh" alongside "Andhra Pradesh", "Telanagana" alongside "Telangana". Our matcher was quietly dropping everything filed under the misspelling. **Vijayawada had imported 1 ward instead of 64.** It looked fine on screen. It was wrong, and it had been wrong for a week.

## What 6,936 wards show

**4,597 of them — 66.3% — are above India's own annual limit of 40 µg/m³.** That is close to the village figure (63.6%), which is a small piece of evidence that the two datasets are behaving consistently. **Not one ward in India meets the WHO annual guideline of 5.**

But the national percentage is the least interesting number here. Three things it hides:

**The gap between cities is enormous.** Delhi's *cleanest* ward, Khera at 63.5 µg/m³, is dirtier than the *dirtiest* ward in **67 of the other 96 cities**. The single worst ward we found is Vaishali III in Ghaziabad, at 99.3. The cleanest is Chathinakulam in Kollam, at 21.6 — still more than four times the WHO guideline.

**Twenty-five cities have no ward over 40 at all** — every ward under India's limit. They are almost entirely southern and coastal: Thrissur, Kollam, Thiruvananthapuram, Kochi, Mysuru, Mangaluru, Coimbatore, Chennai, Bengaluru, Visakhapatnam, Vijayawada, plus Gangtok and Panaji. This is the part of the picture the Delhi-in-November coverage never shows.

**Inside a single city the spread can be a third of the total.** Delhi runs 63.5 to 98.7 across its 290 wards — a 35-point gap between neighbourhoods in the same city, breathing under the same policy. Ghaziabad spans 71.7 to 99.3. That spread is the entire argument for mapping wards rather than cities.

## Guwahati, and why it needed its own door

Swachh Bharat is a national release, but it is not a complete one. Five states publish no urban ward boundaries in it at all: **West Bengal, Assam, Manipur, Mizoram and Tripura.**

Assam mattered. Guwahati has real winter pollution and it had no ward map. So we went looking, and found the 2022 Guwahati Municipal Corporation delimitation published by the **OpenCity / Oorvani Foundation** and republished by [BharatLas](https://bharatlas.com) under the Open Database Licence. Sixty wards, now on the map.

Guwahati's spread is narrow — **43.7 to 54.5 µg/m³** — but every single one of its 60 wards sits above India's limit of 40. It is worth saying plainly what this layer can and cannot see: it is an *annual* average, so it says nothing about a bad week in November, which for Guwahati's winter inversions is much of the story. And at roughly one kilometre it smooths very local sources — a single kiln or a busy junction will not appear in it.

For West Bengal we came up empty — or so we wrote here this morning. **We were wrong, and we found out within hours of publishing.**

> **Update, later on 7 August.** Bengal's wards were open all along. We checked OpenStreetMap (only 38 ward-level administrative relations in the whole state, and they turn out to be villages, not municipal wards) and DataMeet (31 cities, Kolkata the only Bengal one), found nothing, and published the conclusion. What we never did was look at the other files in the GitHub release we download from on every single run. `WB_AMRUT_Wards` sits in the same folder as the Swachh Bharat wards this pipeline had been reading for weeks: **1,633 ward polygons across 52 West Bengal urban local bodies**, from the state's AMRUT GIS master-plan programme.
>
> Seven Bengal cities are now on the map — **Asansol (106 wards), Howrah (50), Durgapur (43), Bidhannagar (42), Kharagpur (35), Bardhaman (35) and Haldia (29)** — 340 wards, taking the atlas to **97 cities and 6,936 wards**.
>
> And they change the Bengal story. **Durgapur averages 63.0 µg/m³ a year and Asansol 60.9 — both well above Kolkata's 49.1.** The industrial belt, not the metro, is the state's worst air, and that was invisible while Kolkata was the only Bengal city we could draw. Siliguri is still missing for a real reason: its upload contains 4 wards out of 47.
>
> We are leaving the wrong paragraph above rather than quietly deleting it, because the mistake is the useful part. "No open data exists" is a claim that needs the same sourcing as any number, and we did not give it that. We had looked at three outside sources and none of our own.

## Four sources, four licences, one credit line

Adding Guwahati created a problem we should have fixed earlier. Our ward boundaries now come from four different upstreams under four different licences — Swachh Bharat via indianopenmaps (74 cities), DataMeet under CC BY (13), OpenCity/Oorvani under ODbL (Guwahati), and two city projects. Those licences carry different obligations. Flattening them into one generic credit would have been the easy thing and the wrong one.

So every ward file now records the source it actually came from, and the map prints that credit underneath, for whichever city you are looking at. Doing this exposed that **14 cities — including Delhi, Mumbai and Chennai — had been shipping with no source recorded at all.** They have one now.

## Where this still falls short

All five layers — live air, annual air, heat, green cover and built-up — now cover all 97 cities. The satellite pipeline that had only been run for 39 has been run for the rest. Three cities still have wards with no heat value at all (Bhopal 34%, Thiruvananthapuram 6%, Kolkata 4%) because the clearest available scene still had cloud over part of the city; those wards are drawn uncoloured rather than filled with a guess.

And the honest limitation runs deeper than coverage: an annual mean is a blunt instrument for a country whose pollution is violently seasonal. A monthly layer is the next thing worth building.

Find your ward on the [map](https://www.janvayu.in/#ward-map). If the boundaries look wrong for your city — stale delimitation, missing wards, a name nobody local would recognise — tell us at **contribute@janvayu.in** — a local correction is worth more than another pass over the data by us.
