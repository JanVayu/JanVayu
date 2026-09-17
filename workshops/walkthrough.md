# JanVayu walkthrough

One hour. A guided tour of the whole platform, ending with you having set an
alert for your own city and, if you want it, filed a Right to Information
request.

JanVayu is a citizen-led public record of India's air. It is not a campaign and
it endorses no party. Everything on it is built from public data and is free to
reuse.

Open **[janvayu.in](https://www.janvayu.in)** and keep it beside this.

> A note for the facilitator: on Workshopy's free plan a session runs 45
> minutes. Steps 1 to 7 fit inside that. Step 8 onwards is the second half, and
> can be a separate session or a Pro-plan hour.

# The size of the problem

Four numbers, each from a named source, and each worth stating before anything
else.

**1.72 million** deaths a year in India from outdoor PM2.5 (Lancet Countdown
2025, using 2022 data). Counting household air pollution as well, about 2.0
million (State of Global Air 2025).

**3.5 years** of life expectancy lost on average (Air Quality Life Index 2025).

**48.9 µg/m³**, India's national annual average PM2.5 (IQAir 2025). The WHO
annual guideline is **5**. India's own legal limit is **40**.

The crisis is year-round, not a Delhi winter story. Agartala in Tripura averages
61.3 µg/m³, which is two and a half times Itanagar and the same range as the
steel-and-coal belt of West Bengal. Nobody was looking, because Agartala had no
ward map until August 2026.

# Lead with PM2.5, not AQI

This is the single most useful idea in the hour, and most air-quality coverage
gets it wrong.

**AQI is an index, not a measurement.** It is built from up to six pollutants
and it reports **only the worst one**. Two cities both reading 200 can have
completely different air. It is also scaled differently by India's CPCB and the
US EPA, so a 150 on your phone may not be a 150 on the news.

**PM2.5 in µg/m³ is the measurement.** Every Indian legal limit, every health
study, and every NCAP target is written in µg/m³ of PM2.5. It is also the
pollutant most consistently tied to death and disease, because at 2.5
micrometres and below it crosses from the lungs into the blood.

So: give the µg/m³ figure as the headline and keep AQI beside it as the
same-day convenience it is. The exception is a warning about today, where an
index is exactly the right tool.

# Find your own number

On the dashboard, use the city selector or **Near me**. The live figure
refreshes every 10 minutes.

Now open the **Live map** and notice two things at once. The **dots** are
readings from roughly 565 continuous CPCB stations. The **shading** is an
annual average for 2024, estimated from satellite at about one kilometre.

They answer different questions and must never be merged into one sentence. Use
the dot for today. Use the shading for where you live.

> **Do this now.** Find your city's live figure and its annual figure. Note how
> far apart they are, and why that is not a contradiction.

# What that number does to a body

Three tools on the dashboard translate a µg/m³ figure into something you can
act on.

**Cigarettes per day.** Berkeley Earth's rule of thumb is that one cigarette is
roughly 22 µg/m³ of PM2.5 over a day. It is an illustration of inhaled dose, not
a medical equivalence, and we say so on the page.

**Should I go outside?** Reads your live figure and answers by activity and by
risk group.

**The purifier calculator.** Sizes a HEPA unit to your actual room, including
the low-cost options.

It is worth saying plainly that this is not only a lung problem. PM2.5 is linked
to heart attack and stroke, to kidney decline, to dementia and cognitive loss,
and to preterm birth and low birth weight. The Beyond the Lungs panel carries
the citations.

#[quiz] Halfway check

## Two cities both report AQI 200. What do you know about their PM2.5?

- [ ] Both are at the same PM2.5 level
- [x] Very little. AQI reports only whichever of six pollutants scores worst
- [ ] Both are above India's annual limit
- [ ] One of the readings must be wrong

## India's annual PM2.5 limit is 40 µg/m³. The WHO guideline is:

- [ ] 25
- [ ] 15
- [x] 5
- [ ] 40, the same

## The map's shading and the map's dots differ sharply. Why?

- [ ] One of them is broken
- [x] The dots are live hourly readings, the shading is a 2024 annual average
- [ ] The dots use AQI and the shading uses PM2.5
- [ ] The shading is a forecast

# Your neighbourhood, not your city

A city average is one figure standing in for a few million people, and it hides
the thing you want to know.

The map covers **983,149 administrative areas**: 36 states, 785 districts, 6,471
blocks and tehsils, 319,287 gram panchayats, **584,615 villages**, 3,359 city
bodies and **68,596 municipal wards**. Every one carries an annual PM2.5 figure,
and most carry surface heat, tree cover and built-up share as well.

This exists because it has to. Roughly 565 continuous monitors cannot tell
584,615 villages what their air is, and never will. The satellite layer is the
only estimate that reaches everywhere.

What it shows: **no Indian village meets the WHO annual guideline of 5**.
371,938 of them, 63.6%, are above India's own limit of 40. The median village
sits at 43.7 µg/m³.

> **Do this now.** Find your ward or village. Then use the Boundaries menu to
> find your MP's constituency and see what they answer for.

# Does the air actually get checked?

A fair question to ask of any site that hands you numbers.

Until recently every wide-coverage PM2.5 figure on JanVayu came from a model.
That was deliberate, for the reason in the last step. What was missing was the
measured record to check the models against.

It is now there. The India Air Quality Database from XKDR Forum publishes
India's hourly monitoring archive under an open licence. For 2024, **534
stations reported** and **284** had a complete enough year to use. Across the
276 that pair with a district, the measured annual mean is **53.8 µg/m³**
against **51.9** from the satellite layer, correlating at **0.83**.

A station is one point and the satellite figure is a district average, so the
measured number sitting a little higher is expected by construction. Neither
corrects the other. What the comparison buys you is confidence in the pattern.

# Was it policy, or was it the wind?

This is the question every "air improved by X%" headline rests on not knowing
the answer to.

A still, cold week traps whatever a city emits near the ground and the monitors
read high. A windy, wet week scatters the same emissions and they read low.
Nothing about the traffic, the kilns, the construction or the stubble has
changed. The air is simply being counted under different conditions.

The correction is meteorological normalisation, after Grange and colleagues
(*Atmospheric Chemistry and Physics* 18, 2018). A model learns from several
years of daily readings how much of each day was weather and how much was the
date and the place. Then every day is re-run with weather drawn at random from
the whole record. What survives is the part the weather cannot explain.

For **44 Indian cities over 2018 to 2024: 33 are getting cleaner and 11 are
not.**

Steepest real falls, in µg/m³ a year: Meerut −14.6, Varanasi −14.2, Lucknow
−14.0, Moradabad −13.5, Agra −10.6. Getting worse: Chandigarh +3.1, Gwalior
+2.4, Chandrapur +2.4, Solapur +1.7, Mumbai +0.8.

The most interesting case is Lucknow. Its uncorrected fall was −11.6 and its
corrected fall is −14.0, which means the weather had been **hiding** an
improvement rather than flattering one.

Two limits stated plainly. What survives the correction is not proof that policy
caused it: emissions, fuel mix, construction and economic activity all sit
inside it. And 194 cities with some data did not qualify, which is a statement
about where India has put its instruments, not about their air.

# Follow the promises and the money

**NCAP**, the National Clean Air Programme, set a 40% PM10 reduction target for
non-attainment cities with a deadline of 31 March 2026. Of the **100 cities**
with enough PM10 monitoring data to judge, only **23** met it, and **23 saw PM10
rise** (CREA, *Tracing the Hazy Air 2026*, 9 January 2026).

**GRAP**, the Graded Response Action Plan, is Delhi-NCR's stage-by-stage
emergency response. In May 2026 the Commission for Air Quality Management
invoked Stage I off-season for the first time, at AQI 208.

JanVayu tracks both, plus a budget tracker following NCAP and 15th Finance
Commission grants and their per-city utilisation, and city scorecards.

There is also an uncomfortable finding here that is worth putting in front of
anyone who works on clean-air policy. Across all 785 Indian districts, **89% of
the variation in annual PM2.5 between one district and another is explained by
which state it sits in.** Only 11% comes from the district itself. NCAP sets a
target per city and measures each city against its own number, which addresses
the 11% and not the 89%.

# Do one thing before you leave

Pick one. Mark this step done when you have finished it.

**Set an alert.** Open AQI Alerts, choose a threshold, and turn on push
notifications or the daily email. It works when the site is closed.

**Install the app.** On Android, browser menu then "Install app". On iOS, Share
then "Add to Home Screen". It works offline.

**File an RTI.** The RTI Assistant pre-fills a request about your city's
monitoring network or its clean-air spending. ₹10, free with a BPL card, reply
due in 30 days.

**Add your voice.** The Field Testimony wall carries 250 first-person accounts
from 107 cities in 14 languages. Send yours, in your own language, to
contribute@janvayu.in.

# Take it with you

Everything here is free and reusable.

**Ask JanVayu** answers air-quality questions in 10 languages with sources, at
[janvayu.in/ask](https://www.janvayu.in/ask).

**The Open Data API** at [janvayu.in/api](https://www.janvayu.in/api) indexes
every dataset. Content and data are CC BY-NC-SA 4.0; the code is MIT.

**The blog** at [janvayu.in/blog](https://www.janvayu.in/blog) carries the
working behind everything in this hour, including the mistakes.

**The source** is at [github.com/JanVayu/JanVayu](https://github.com/JanVayu/JanVayu),
including a list of good first issues.

If a figure here looks wrong to you, please say so. Local knowledge has caught
more of our errors than any check we have written. contribute@janvayu.in
