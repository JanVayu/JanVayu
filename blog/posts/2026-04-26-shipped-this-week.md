# What's New: Cigarette Equivalence, City Rankings, Community Sensors, Workshops

**Published:** 26 April 2026 | **Author:** Team JanVayu | **Reading time:** 5 min

---

This week's update is the biggest since JanVayu launched. It adds answers to the question most first-time visitors bring: what is this air doing to me right now?

## Why we made it

We compared JanVayu with two sites people often ask us about: **aqi.in**, a polished consumer AQI portal, and **oaq.notf.in**, an open platform for hyperlocal sensors run by researchers and community organisations. JanVayu was strong on accountability (NCAP tracking, RTI, court orders, citizen voices) and weaker on quick, personal answers about today's air. The new features fill that gap, and the accountability work stays as it was.

## On the dashboard

**Cigarettes per day.** Live PM2.5 is converted to a daily smoking equivalent using the Berkeley Earth coefficient, where one cigarette is about 22 µg/m³ over 24 hours. At 100 µg/m³, typical for Delhi in winter, that comes to roughly 4.5 cigarettes a day, every day.

**Health-risk badges.** Five common harms are colour-coded by today's AQI band: asthma flare-ups, heart attack and stroke, allergies, respiratory infection, and risk to children and the elderly. The badges are illustrative. We have not tied each one to a specific Global Burden of Disease outcome.

**What to do today.** At AQI 50 the advice is to open windows. At AQI 250 it is an N95 mask outdoors and a HEPA purifier running 24/7. At AQI 450 it is to treat outdoor air as toxic and make a clean room indoors if you can. The card links to the Purifier Calculator and the "Should I Go Outside?" panel.

**Near Me.** A button beside the city list asks for your location and finds the nearest WAQI monitoring station. We do not store your location, and every card on the dashboard updates to match.

## City rankings

A new panel ranks Indian cities by PM2.5 for right now, the past 7 days and the past 30 days. You can sort and search it. The change column will fill in over the next month, as we collect daily snapshots. We did not want to present a single day as a trend.

## The map and the trend charts

The Live Map has a heatmap you can switch on. Marker popups now show the cigarette equivalent and a link to that city's full dashboard. The station markers are where they were.

In the Trends panel, a new card lets you drag a slider across the last 24 hours to see PM2.5 at any hour, with the multiple of the WHO guideline shown beside it. It is useful for checking how bad your morning commute was.

In the Compare panel you can pick a city and a month and lay the monthly averages for 2024, 2025 and 2026 over each other, to see whether things are getting better. The baseline comes from CPCB and IQAir 2024 data and will be replaced with real readings as we collect them.

## Pages for each pollutant

There is now a page each for `/pm25`, `/pm10`, `/co`, `/no2`, `/so2` and `/o3`, with sources, health effects, the WHO and Indian standards, and a top-10 table of Indian cities for that pollutant. *Update, 2 October 2026: for five of the six pages (all except /pm25) the table's values were randomly generated from 26 April to 22 September 2026. See [the 2 October post](/blog/#/posts/2026-10-02-five-pollutant-pages-random-numbers).* The aim is that someone searching "PM2.5 Delhi" finds JanVayu as well as IQAir.

## Community sensors

The Hyperlocal panel now adds **Sensor.Community**, a global network of low-cost monitors run by citizens, to the CPCB and WAQI stations. Its data is published under the Open Data Commons Database Contents License (DbCL) 1.0. Each station is labelled `COMMUNITY` or `CPCB/WAQI`, so you can see which kind of reading you are looking at. Community sensors are less carefully calibrated than CPCB stations, so treat them as a guide. They do cover places that have no official station.

We had considered running our own "Host a Monitor" hardware programme. This gives the same coverage today without the hardware. We may still build one if the community network leaves a gap.

## Widgets for your own site

Two small embeddable pieces:

- `https://www.janvayu.in/embed/aqi/?city=delhi&theme=light` is a live AQI badge that refreshes itself.
- `https://www.janvayu.in/embed/rankings/?n=10&order=worst` shows the most polluted cities right now.

You can drop them into a blog, a housing society notice board or a newsroom dashboard. Both come in light and dark themes.

## Install it on your phone

JanVayu can now be installed on Android, iOS and desktop. It keeps the last reading it saw, so opening it on the metro with no signal still shows the most recent number. Look for the "Install JanVayu" prompt in the bottom corner, or use your browser's Add to Home Screen.

## Workshops

A new Workshops page under the Action menu has two options. The first is an air quality workshop with UrbanEmissions: request a session with Dr. Sarath Guttikunda of UrbanEmissions.info. Class 9+ students, college students, adult groups and educators are all welcome. The second is a 1-hour JanVayu walkthrough, a hands-on session with our team. In one sitting you can set AQI alerts, file an RTI, read the NCAP scorecard and find the right purifier. Pick three preferred IST slots and we confirm one. It is free and online, in English or Hindi.

*Update, 26 April 2026: the booking forms now email each submission to the JanVayu team and keep a copy. Contact details go to the JanVayu team and the person running the workshop.*

## What we chose not to do

We did not build separate iOS or Android apps, because installing from the browser gives most of the benefit without the upkeep. We did not chase coverage of 190 countries, because JanVayu is for India. We did not make dashboards for smart cities, real estate or hotels, which do not belong in a citizen accountability platform.

## Programme name

The footer, the About panel, the citation block and the pollutant pages now read "AirQuality for Janhit by MMSF Fellows, AIPC", the official name of the programme we belong to. The `#AQIForJanHit` hashtag stays as the public campaign tag.

## What we are looking at next

In rough order of priority:

- A better NCAP city scorecard, with a pre-filled RTI to the responsible CPCB officer for every missed target.
- A live stubble-burning tracker for Punjab and Haryana in October and November, built on NASA FIRMS.
- For each city, a breakdown of where its pollution comes from, using CREA and UrbanEmissions data.
- An AQI forecast for 24 to 72 hours, extending the existing forecast panel.
- Phone notifications when the AQI crosses a level you choose.
- A short air-quality quiz to go with the workshops.

If something on this list matters to you, or you spotted a bug, tell us through the booking form on the [Workshops page](https://www.janvayu.in/#workshops), or open an issue on the [JanVayu GitHub](https://github.com/JanVayu/JanVayu/issues).

---

*Part of AirQuality for Janhit by MMSF Fellows, AIPC. Code is MIT-licensed; content is CC BY-NC-SA 4.0.*
