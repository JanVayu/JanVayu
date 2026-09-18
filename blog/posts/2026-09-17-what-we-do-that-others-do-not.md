# What JanVayu Does That the Other Indian Air-Quality Sites Do Not

**Published:** 17 September 2026 | **Author:** Team JanVayu | **Reading time:** 11 min

---

Dr Sarath Guttikunda published a list this month of where to get air-quality data
for Indian cities. It is the most useful thing of its kind, and reading it sent
us to a dataset we had missed and should not have.

It also prompted an obvious question, which somebody asked us directly: if all
of that exists, what is JanVayu for?

What follows is a capability table. Two caveats belong in front of it, since we
are one of the parties being compared.

Most of the sites listed are not competitors, and several supply data we use.
CPCB, WAQI, OpenAQ, Sensor.Community, XKDR and CREA all appear inside JanVayu.

The verification is uneven. Every JanVayu figure below sits in a file in our
public repository and is recomputed by a check that fails the build if it
drifts. For the other columns we have used what their pages state and what we
could test ourselves. Where we could test neither, the cell says *unverified*.
Several of these sites block automated requests, which is their right and our
limit.

## The short version

Most Indian air-quality sites answer one question: what is the air like right
now, where a monitor is. They answer it well, and several answer it better than
we do.

JanVayu is built around four questions a live map cannot answer, whatever its
quality:

1. **What is the air where there is no monitor?** India has roughly 565
   continuous stations and 5,84,615 villages.
2. **Is it actually getting better, or was that the weather?**
3. **Who promised what, and did they do it?**
4. **What do I do about it on Tuesday?**

## The table

Legend: **yes** = we verified it. **no** = we checked and could not find it.
*unverified* = we could not test it and their pages do not say.

*Updated 18 September 2026: a Hawa Ka Hisab column was added, and two rows that
read "no" everywhere but our own column were wrong. See the correction under
"Weather removed from the trend".*

| | JanVayu | CPCB portal | AQI.in / IQAir / AQICN | OpenAQ | XKDR | CREA | Sensor networks | VayuBuddy | Hawa Ka Hisab |
|---|---|---|---|---|---|---|---|---|---|
| **Live city AQI** | yes, 160 cities | yes, official | yes | yes, raw stations | no (archive) | no | yes, hyperlocal | via CPCB | daily, Delhi + NCR |
| **Raw station data via API** | via our Open Data API | download by station | no | **yes, its whole point** | yes, hourly | no | yes | no | no |
| **A number for a village** | **yes, all 5,84,615** | no | no | no | no | no | no | no | no |
| **A number for a ward** | **yes, all 68,596** | no | no | no | no | no | no | no | no |
| **Air back to 1980** | yes, 783 districts | no | no | no | no | no | no | no | **yes, Delhi + N India** |
| **Weather removed from the trend** | **yes, 44 cities** | no | no | no | no | no | no | no | **yes, Delhi, daily** |
| **Official bulletin as a series** | yes, 297 cities 2015–2026 | publishes the PDF | no | no | no | uses it | no | no | no |
| **Instruments checked against the model** | yes, r = 0.834 | no | no | no | n/a | no | no | no | n/a |
| **NCAP / GRAP tracking** | yes | the source data | no | no | no | **yes, the best of it** | no | no | weather vs policy, daily |
| **Per-city budget utilisation** | yes | no | no | no | no | yes | no | no | no |
| **Pre-filled RTI templates** | **yes** | n/a | no | no | no | no | no | no | no |
| **Health-impact calculators** | yes | no | partly | no | no | no | no | no | no |
| **Answers questions in plain language** | yes, 10 languages | no | no | no | no | no | no | **yes** | daily film, in Hindi |
| **First-person testimony** | yes, 250 in 14 languages | no | no | no | no | no | no | no | no |
| **Teaching material you can take** | **yes, 4 workshops + 7 games** | no | no | no | no | reports | no | no | no |
| **Open source** | yes, MIT + CC BY-NC-SA | no | no | **yes** | data CC BY 4.0 | reports free | mixed | yes | no repo; free to republish |
| **Free, no ads, no login** | yes | yes | ads / paid tiers | yes | key required | yes | mixed | yes | yes |

## The rows that carry the argument

Most of the table is convenience. These five are the substance.

### A number for every village and every ward

**983,149 administrative areas**: 36 states, 785 districts, 6,471 blocks and
tehsils, 319,287 gram panchayats, **5,84,615 villages**, 3,359 city bodies and
**68,596 wards**. Every one carries an annual PM2.5 figure, most carry surface
heat, tree cover and built-up share.

No live network can do this and none ever will. 565 monitors cannot cover
5,84,615 villages. The satellite retrieval can, and that is the entire reason we
lead with a modelled layer rather than apologising for one.

The consequence is concrete: no Indian village meets the WHO annual guideline of
5 µg/m³, **371,938 of them (63.6%) are above India's own limit of 40**, and the
median village sits at 43.7. You cannot get that number from a dashboard of 160
cities.

### Weather removed from the trend

Every "air improved by X%" headline rests on not knowing whether it was the
policy or the wind. A still, cold week traps emissions and the monitors read
high; a windy week scatters them and they read low, with nothing changed at the
source.

We run meteorological normalisation (Grange et al., *Atmos. Chem. Phys.* 18,
2018) over seven years of hourly readings for **44 cities**. **33 are getting
cleaner once weather is removed and 11 are not.** Meerut −14.6 µg/m³ a year,
Varanasi −14.2, Lucknow −14.0; Chandigarh +3.1, Gwalior +2.4, Mumbai +0.8.

**Correction, 18 September 2026.** This section first said we knew of no other
public Indian source publishing weather-normalised air quality, and the table
gave every other column a flat *no* on that row. Both were wrong.
[Hawa Ka Hisab](https://hawakahisab.in), published by Ajay Maken, MP, has done
it daily for Delhi since 19 July 2026 and publishes its method in full. The
table above is corrected.

We should have caught this ourselves. Our own assistant already cites that site,
using its decadal figures for Delhi as an independent check on our 1980-to-2022
reconstruction. The site was in our repository while this post said no such
source existed. We knew it as a history and had not looked at what else it
publishes.

The two are not substitutes. Hawa Ka Hisab asks each day whether Delhi's air
was worse than the same fortnight last year once weather is accounted for,
comparing matched stations against a fifteen-day baseline window, using a model
trained on Delhi data from 2021 onward. That is the question you need if you are
holding a minister to account this week. We ask whether a multi-year trend is
real, across seven years and 44 cities, and report it in micrograms per cubic
metre per year. For Delhi specifically, and for anything current, theirs is the
better instrument.

### The official bulletin as a series, and what it shows

CPCB publishes an AQI bulletin every day at 4pm as a PDF covering 200+ cities,
and has since May 2015. It is the number a minister quotes and a court cites,
and it has never existed as a series because it is a decade of PDFs.
UrbanEmissions parsed the archive; we now read the PDFs directly as well.

**297 cities, 2015–2026**, as days in each official category per city per year. 2015 and 2026 are part years and are labelled as such on the page, because these are counts of days and a part year set against a full one is not a comparison.

The finding is uncomfortable. In CPCB's own 2024 bulletin, 264 cities reported a
usable year and **221 of them did so on a median of fewer than three monitoring
stations. For 204 cities the median was exactly one.** Agartala, Ajmer,
Amritsar, Aizawl and two hundred others have a daily official air-quality figure
that is a reading from one place with the city's name attached.

Every dashboard in the table above, ours included, shows those cities a number.
Only this tells you how thin it is.

### An RTI, pre-filled

This is the row we would keep if we had to keep one. A number that does not end
in a question to somebody is a number that changes nothing.

The RTI Assistant gives you the right Public Information Officer, questions
phrased as requests for records rather than opinions, and the statutory anchors.
₹10, free with a BPL card, reply due in 30 days. The RTI Clinic workshop ends
with a filed application, not a drafted one.

### Material you can take and teach

Four workshops as plain Markdown at
[janvayu.in/workshops](https://www.janvayu.in/workshops/README.md), seven games,
a 10-question self-check, 39 blog posts, and an Open Data API. CC BY-NC-SA 4.0,
so you can cut them, translate them and put your own city's numbers in.

## Where the others are better

**CPCB's portal is the official record** and ours is not. When the two disagree,
theirs is the one with legal standing. We read their bulletin because of that,
not despite it.

**OpenAQ is a better raw-data API than ours** and is not trying to be anything
else. If you want station measurements to build on, start there.

**CREA's NCAP analysis is better than ours** and our accountability pages lean on
it. *Tracing the Hazy Air* is the reference, and we cite it rather than
reproducing it.

**The sensor networks reach places we cannot.** PurpleAir, AirGradient, AirVeda,
Aurassure and Sensor.Community give street-level density that a regulatory
network never will. Less accurate, far denser, and the right tool for "is it
worse on my street than the next one".

**VayuBuddy answers questions against CPCB data** much as our assistant does. Two
independent answers to the same question are worth having, and we would rather
say so than pretend we are the only one.

**IQAir's global comparability** is something we do not attempt. Their World Air
Quality Report is what makes an international ranking possible.

**Hawa Ka Hisab covers Delhi better than we do, and is far more current.** It
publishes a twelve-page report daily, a short Hindi film with it, a weekly
edition, and a reconstruction of Delhi's air back to 1980. We give a city one
trend line across seven years. It gives Delhi a weather-adjusted verdict every
morning, measured against the same fortnight a year earlier.

Its provenance is worth stating, since the site states it itself: every page
says it is published by a serving opposition MP and is not a neutral third
party. JanVayu is non-partisan and that site is not. The method is published in
full, which is the part to read before deciding what the analysis is worth.

## What this adds up to

For whether to go running this evening, almost any of these will tell you, and
several will tell you faster than we will.

The questions we built for are slower ones. What does my village breathe, when
there is no monitor within fifty kilometres. Is my city's improvement real or
was it a wet year. How many days was my city officially Poor, and how many
monitors produced that figure. What do I write, and to whom. We know of no other
single site that answers all of those, though several answer one of them better
than we do.

We are not claiming to be better. We are built for a different question, and
somebody choosing a tool should know which.

---

**Corrections wanted, particularly on the other columns.** If we have understated
what a source does, that is our error and we will fix it in this post with a
dated note. Several of these sites block automated requests, so parts of the
table rest on their own descriptions rather than our testing, and those cells are
marked. **contribute@janvayu.in**

**Sources.** Guttikunda's list, September 2026. JanVayu figures from
`data/` in [our repository](https://github.com/JanVayu/JanVayu), each recomputed
by `scripts/check-site-figures.py` and the per-layer `--check` scripts. CPCB
bulletin figures parsed from the published PDFs by
`scripts/fetch-cpcb-bulletin.py`. De-weathering after Grange et al. (2018),
*Atmospheric Chemistry and Physics* 18, 6223–6239. Village and ward air from
SatPM2.5 V6GL03 (ACAG / Washington University, 2024).
