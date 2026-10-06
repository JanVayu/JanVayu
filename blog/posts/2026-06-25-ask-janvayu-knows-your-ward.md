# Ask JanVayu can now answer questions about your ward

**Published:** 25 June 2026 | **Author:** Team JanVayu | **Reading time:** 3 min

---

We built the [Ward Atlas](/index.html#ward-map), a map of every municipal ward across 14 cities coloured by air, heat, green cover and built-up area, and at first it lived only on the map. You had to go and look. Now you can ask.

*Update, 2 October 2026: the Ward Atlas now covers 142 cities.*

[Ask JanVayu](/ask), our chat assistant, has learned the ward data. Try:

- "Which ward in Delhi has the worst air right now?"
- "How green is Ward 13 in Chandigarh?"
- "Is my neighbourhood in Mumbai more built-up than average?"

It answers with real per-ward numbers and, as elsewhere on JanVayu, says where each one comes from.

## Air first, on the right clock

We were most careful about time. Per-ward PM2.5 is a *live snapshot*, interpolated from the city's working government monitors at the moment you ask. The other three layers (heat, green cover, built-up) are *annual, structural* satellite data. They run on different clocks, so the assistant keeps them apart. It will tell you a ward's air right now, and separately describe the kind of place the ward is over the year. It will **not** say that a ward's annual concrete *caused* this particular hour's reading.

We tested this on a clean-air afternoon when Delhi's dirtiest-air ward turned out to be a leafy rural fringe. A naive bot would have insisted that the ward is built-up, so the air is bad. Ours says that today's reading there comes from weather or a nearby source, not from the shape of the neighbourhood. (We wrote about that decision in [Live vs Annual](/blog/#/posts/2026-06-11-live-vs-annual-honest-ward-data).)

## A change you should not notice

Around the same time, Groq announced it was retiring the model that powered Ask JanVayu. We moved all of the assistant's features to its production replacement, so answers keep coming as before. We mention it because an AI that quietly stops working is something we would rather you never meet.

## Try it

Open [Ask JanVayu](/ask) and ask about your own ward: worst air, greenest, most built-up, or simply how the air is in your area. If something looks off, tell us at contribute@janvayu.in. The more awkward questions people put to it, the better it gets.

---

*Air: CPCB / WAQI monitors, interpolated (live). Heat: USGS/NASA Landsat surface temperature. Green & built-up: ESA WorldCover 2021. Ward boundaries: DataMeet, the Mumbai spatial-data project, and the Varanasi Smart City portal. The assistant runs an open model via Groq and cites a primary source for every number.*
