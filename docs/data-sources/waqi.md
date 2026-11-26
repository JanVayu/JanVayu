# Real-time AQI (WAQI)

JanVayu's source of live station readings is the [World Air Quality Index (WAQI)](https://waqi.info) project. Since 8 November 2026 it is the first of three sources, and the page says which one it is showing.

---

## About WAQI

WAQI shows real-time readings from more than 10,000 stations on its map ([waqi.info](https://waqi.info)), gathered from national environmental agencies in more than 100 countries ([aqicn.org](https://aqicn.org/here/)), including most CPCB CAAQMS stations in India. For India it combines:

- CPCB (Central Pollution Control Board), the official government monitoring network
- State Pollution Control Boards
- Embassy monitors (the US Embassy programme ended in March 2025, per [IQAir](https://www.iqair.com/newsroom/waqr-2025-pr))

---

## How JanVayu uses it

Your browser asks for the reading nearest a place every 10 minutes while the page is open. Since 27 October 2026 the request goes to a JanVayu function, `waqi-proxy`, which adds the access key on the server and passes the question to WAQI. The key is not in the pages. Until that date it was, and every visitor's browser held it.

A reading is shown as live only when the station is within 30 km of the place and has reported in the last 6 hours. That rule dates from 8 November 2026, when two faults were found. WAQI's lookup by coordinates was answering with a Delhi station for Bengaluru, Hyderabad, Chennai, Mumbai and other cities. And WAQI's feeds for most Indian cities outside Delhi-NCR were frozen: Bengaluru's last reading was 23 June 2026, and Pune's was 15 November 2021, each still returned as current. Checked against the live site that day, 5 of the 33 tracked cities had a live reading (Delhi, Gurgaon, Noida, Faridabad and Ghaziabad).

## When no station has reported

`js/air-sources.js` tries two more sources, in order, and words each as what it is:

1. CPCB's daily bulletin for the nearest tracked city, within 50 km and no more than 7 days old. It is a figure for the whole city for one day, on CPCB's own AQI scale, shown with its date and the number of stations that reported. See [CPCB daily AQI bulletins](aqi-bulletins.md).
2. An Open-Meteo (CAMS) model estimate for the exact point, from the `air-model` function. It is a last resort and is labelled as an estimate. On 8 November 2026 it gave Delhi PM2.5 of 106 µg/m³ while Delhi's stations read AQI 335, so it can read far too low in a polluted city.

A daily figure and a model estimate are never called live, never enter the city ranking, the alerts or a share card, and are never averaged with another source.

---

## AQI and PM2.5

WAQI reports AQI on the US EPA scale. JanVayu shows two numbers: the AQI, a standardised 0–500 index on the US EPA scale, and PM2.5 in µg/m³, the raw concentration of fine particles.

The conversion from PM2.5 to AQI uses US EPA breakpoints. India has its own National AQI (NAQI) scale, whose breakpoints differ slightly, and JanVayu points this out where it matters.

---

## Rate limits

Each WAQI key has a quota (by default 1,000 requests per minute with bursts of up to 60, per [WAQI's terms of service](https://aqicn.org/api/tos/)). The terms also require credit to the World Air Quality Index Project and the originating EPA, ask non-profit users to notify WAQI by email before public use, and do not allow the data to be redistributed as cached or archived copies. Anyone running many requests at once, for example testing all 157 cities together, can hit it. Two remedies: register your own free key at [aqicn.org/data-platform/token](https://aqicn.org/data-platform/token/), or space the requests out.

---

## Station coverage

WAQI coverage in India is strong in the large metros and state capitals. It is thinner in:

- Smaller district towns
- Rural areas
- The northeast, where CPCB has few stations

Where no monitor has reported, JanVayu says so and shows the daily bulletin or the model estimate described above. The map's annual layers are satellite-derived estimates and are labelled as such.
