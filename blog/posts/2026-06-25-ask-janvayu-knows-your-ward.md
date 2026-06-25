# Ask JanVayu Can Now Answer About Your Ward

**Published:** 25 June 2026 | **Author:** Team JanVayu | **Reading time:** 3 min

---

When we built the [Ward Atlas](/index.html#ward-map) — a map of every municipal ward across 14 cities, coloured by air, heat, green cover and built-up area — it lived only on the map. You had to go look. Now you can just *ask*.

[Ask JanVayu](/ask), our chat assistant, has learned the ward data. Try:

- "Which ward in Delhi has the worst air right now?"
- "How green is Ward 13 in Chandigarh?"
- "Is my neighbourhood in Mumbai more built-up than average?"

It answers with real per-ward numbers — and, true to the rest of JanVayu, it cites where each one comes from.

## Air first, on the right clock

The thing we were most careful about: **air quality is the headline, and it's honest about time.**

Per-ward PM2.5 is a *live snapshot*, interpolated from the city's working government monitors at the moment you ask. The other three layers — heat, green cover, built-up — are *annual, structural* satellite data. They sit on different clocks, so the bot keeps them apart. It will tell you a ward's air right now, and separately describe the kind of place it is over the year — but it will **not** claim that a ward's annual concrete *caused* this particular hour's reading.

We tested this on a clean-air afternoon when Delhi's dirtiest-air ward turned out to be a leafy rural fringe. A naive bot would have insisted "it's built-up, so the air is bad." Ours says the honest thing: today's reading there is driven by weather or a nearby source, not by urban form. (We wrote about that decision in [Live vs Annual](/blog/#/posts/2026-06-11-live-vs-annual-honest-ward-data).)

## A quieter change under the hood

Around the same time, Groq announced it is retiring the model that powered Ask JanVayu. We migrated all of the assistant's features to its production replacement — you shouldn't notice anything except that the answers keep coming. We mention it only because "the AI quietly stopped working" is a failure mode we'd rather you never experience, and keeping the lights on is part of the job.

## Try it

Open [Ask JanVayu](/ask) and ask about your own ward — worst air, greenest, most built-up, or just "how's the air in my area." If something looks off, tell us at contribute@janvayu.in; the more awkward questions people throw at it, the sharper it gets.

---

*Air: CPCB / WAQI monitors, interpolated (live). Heat: USGS/NASA Landsat surface temperature. Green & built-up: ESA WorldCover 2021. Ward boundaries: DataMeet, the Mumbai spatial-data project, and the Varanasi Smart City portal. The assistant runs an open model via Groq and cites a primary source for every number.*
