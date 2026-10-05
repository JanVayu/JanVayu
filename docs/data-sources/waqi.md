# Real-time AQI (WAQI)

JanVayu's main source of live AQI readings is the [World Air Quality Index (WAQI)](https://waqi.info) project.

---

## About WAQI

WAQI shows real-time readings from more than 10,000 stations on its map ([waqi.info](https://waqi.info)), gathered from national environmental agencies in more than 100 countries ([aqicn.org](https://aqicn.org/here/)), including most CPCB CAAQMS stations in India. For India it combines:

- CPCB (Central Pollution Control Board), the official government monitoring network
- State Pollution Control Boards
- Embassy monitors (the US Embassy programme ended in March 2025, per [IQAir](https://www.iqair.com/newsroom/waqr-2025-pr))

---

## How JanVayu uses it

Your browser asks WAQI directly for the reading nearest a city, every 10 minutes, using a free public access key. Nothing passes through a JanVayu server. Readings refresh by themselves while the page is open, and the arrangement costs nothing beyond WAQI's free-tier limits.

---

## AQI and PM2.5

WAQI reports AQI on the US EPA scale. JanVayu shows two numbers: the AQI, a standardised 0–500 index on the US EPA scale, and PM2.5 in µg/m³, the raw concentration of fine particles.

The conversion from PM2.5 to AQI uses US EPA breakpoints. India has its own National AQI (NAQI) scale, whose breakpoints differ slightly, and JanVayu points this out where it matters.

---

## Rate limits

Each WAQI key has a quota (by default 1,000 requests per second, per [WAQI's terms](https://aqicn.org/api/)). Anyone running many requests at once, for example testing all 157 cities together, can hit it. Two remedies: register your own free key at [aqicn.org/data-platform/token](https://aqicn.org/data-platform/token/), or space the requests out.

---

## Station coverage

WAQI coverage in India is strong in the large metros and state capitals. It is thinner in:

- Smaller district towns
- Rural areas
- The northeast, where CPCB has few stations

Where there is no ground monitor, JanVayu says so and may point to satellite-derived estimates.
