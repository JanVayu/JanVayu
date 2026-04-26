# What's New: Cigarette Equivalence, City Rankings, Community Sensors, Workshops

**Published:** 26 April 2026 | **Author:** Team JanVayu | **Reading time:** 5 min

---

JanVayu shipped its largest single update since launch this week. Here is what changed, why, and what each piece is for.

## Why this update

We benchmarked JanVayu against two peers we get asked about often: **aqi.in** (a polished consumer AQI portal) and **oaq.notf.in** (an open hyperlocal sensor platform run by researchers and community organisations). The benchmark surfaced a clear gap: JanVayu was strong on accountability — NCAP tracking, RTI, court orders, citizen voices — and weaker on the fast, visceral, "what is this air doing to me right now" questions that drive most first-time visits.

This update closes that gap, without diluting the accountability mission.

## On the dashboard, you now see

**Cigarettes per day equivalent.** Live PM2.5 converted to a daily smoking equivalent using the Berkeley Earth coefficient (one cigarette ≈ 22 µg/m³ over 24 hours). At 100 µg/m³ — typical for Delhi in winter — that is roughly 4.5 cigarettes a day, every day. Walking past a bus stop in November is hard to wave away once you have that number on screen.

**Disease-risk badges.** Five common harms — asthma flare-ups, heart attack and stroke, allergies, respiratory infection, and risk to children and the elderly — colour-coded by today's AQI band. The mapping comes from the GBD literature; the colours match the AQI gradient so the framing stays internally consistent.

**Solution recommendations.** What to actually do today. At AQI 50, "open windows." At AQI 250, "N95 mandatory outdoors and run a HEPA purifier 24/7." At AQI 450, "treat outdoor air as toxic and create a clean room indoors if needed." The card cross-links to the existing Purifier Calculator and "Should I Go Outside?" panels.

**Near Me.** A button next to the city dropdown that asks for your location and pulls the nearest WAQI monitoring station. We do not store the location. It rides on a synthetic city entry so all the cards on the dashboard refresh together.

## A new City Rankings panel

Live, past 7 days, and past 30 days rankings of Indian cities by PM2.5 — sortable, searchable, with a delta column that will fill in over the coming month as the rankings function accumulates daily snapshots. This is a deliberate pace move. We did not want to ship a leaderboard that sums one snapshot to look like a trend.

## A heatmap on the map, and richer popups

The Live Map now has a heatmap layer toggle. Marker popups show cigarette equivalence and a one-click jump to that city's full dashboard view. The default station markers stay where they were.

## A 24-hour scrubbable trend chart

In the Trends panel, a new card lets you drag a slider across the last 24 hours and see PM2.5 at any specific hour, with the WHO-multiple readout updating live. Useful for understanding how bad your morning commute really was.

## Year-over-year city comparison

In the Compare panel, pick a city and a month and overlay 2024, 2025, and 2026 monthly averages. The data uses a CPCB and IQAir-2024 sourced climatology baseline that is enriched as the rankings function accumulates real readings. Shows whether things are actually getting better.

## Six pollutant pages for search

`/pm25`, `/pm10`, `/co`, `/no2`, `/so2`, `/o3` — standalone, SEO-friendly pages with sources, health effects, the WHO and Indian standards, and the live top-10 most-polluted Indian cities for that pollutant. Built from a single template and fully crawlable. The point is that someone searching "PM2.5 Delhi" finds JanVayu, not just IQAir.

## Free community sensors via Sensor.Community

The Hyperlocal panel now blends CPCB and WAQI stations with **Sensor.Community** — a global, CC0-licensed network of citizen-run low-cost monitors. Each station carries a `COMMUNITY` or `CPCB/WAQI` source badge so you know what you are reading. Treat community sensors as indicative; they are less calibrated than CPCB stations but fill coverage gaps in places that have no official station.

We considered building our own "Host a Monitor" hardware program. This integration gets us the same coverage benefit, today, without the hardware lift. We may still do hardware later, but only if there is a coverage gap that the community network does not solve.

## Embeddable widgets

Two iframe-friendly endpoints:

- `https://www.janvayu.in/embed/aqi/?city=delhi&theme=light` — small live AQI badge, auto-refreshing
- `https://www.janvayu.in/embed/rankings/?n=10&order=worst` — top-N polluted cities right now

Drop them into your blog, RWA notice board, or newsroom dashboard. Light and dark themes supported.

## A real PWA

JanVayu is now installable on Android, iOS, and desktop. The service worker caches the app shell and last-known AQI, so opening it on the metro with no signal still gives you the most recent reading. Look for the "Install JanVayu" prompt in the bottom corner, or use your browser's Add to Home Screen.

## Workshops

A new **Workshops** page under the Action menu. Two cards:

- **Air Quality workshop with UrbanEmissions** — request a session with Dr. Sarath Guttikunda, who runs the Air Quality Jeopardy game (interactive, tested with school and adult cohorts). Class 9+ students, college, adult cohorts, and educators all welcome.
- **1-hour JanVayu walkthrough** — book a hands-on session with our team. Set AQI alerts, file an RTI in one sitting, read the NCAP scorecard, find the right purifier. Pick three preferred IST slots; we confirm one. Free, online, English or Hindi.

Both forms run on Netlify Forms. We do not share contact details with anyone other than the workshop facilitator.

## What we deliberately did not do

- **No native iOS or Android app wrapping.** The PWA install path covers about ninety percent of the value, and a Capacitor wrapper adds maintenance cost we cannot justify yet.
- **No global expansion.** JanVayu is positioned for India. Chasing 190-country coverage would dilute the brand.
- **No vertical or industry dashboards.** Smart-city, real-estate, hospitality variants are out of scope for a citizen accountability platform.

## Programme attribution updated

You will see "AirQuality for Janhit by MMSF Fellows, AIPC" in the footer, About panel, citation block, and pollutant page footers — the official programme name we are part of. The `#AQIForJanHit` hashtag stays as the public campaign tag.

## What we are looking at next

In rough priority order:

- An NCAP city scorecard upgrade that matches and exceeds NCAP Tracker's depth, with a one-click pre-filled RTI to the responsible CPCB officer for every missed target.
- A stubble-burning live tracker built on NASA FIRMS, focused on Punjab and Haryana during October and November.
- A source-apportionment ring per city, using CREA and UrbanEmissions inventory data.
- A 24 to 72-hour AQI forecast, extending the existing forecast panel.
- Browser push notifications gated on user-picked AQI thresholds (using the new service worker).
- An in-browser AQ literacy quiz as a companion to Sharath's Jeopardy game.

If something on this list matters to you — or you spotted a bug — let us know via the [Workshops page](https://www.janvayu.in/#workshops) booking form, or open an issue on the [JanVayu GitHub](https://github.com/JanVayu/JanVayu/issues).

---

*Part of AirQuality for Janhit by MMSF Fellows, AIPC. Code is MIT-licensed; content is CC BY-NC-SA 4.0.*
