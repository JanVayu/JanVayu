# Real-Time AQI (WAQI)

JanVayu uses the [World Air Quality Index (WAQI)](https://waqi.info) API as its primary source of real-time AQI data.

---

## About WAQI

The World Air Quality Index project (WAQI) publishes real-time readings from more than 10,000 stations on its map ([waqi.info](https://waqi.info)), collated from national environmental agencies in more than 100 countries ([aqicn.org](https://aqicn.org/here/)), including most CPCB CAAQMS stations in India. For India, WAQI aggregates data from:

- CPCB (Central Pollution Control Board) — official government monitoring network
- State Pollution Control Boards
- Embassy monitoring (the US Embassy programme ended in March 2025, per [IQAir](https://www.iqair.com/newsroom/waqr-2025-pr))

---

## How JanVayu Uses WAQI

The WAQI API is called **directly from the browser** (client-side) every 10 minutes. The API token is a free-tier public key embedded in `app.js`.

```javascript
// Client-side AQI fetch (simplified)
const url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${WAQI_TOKEN}`;
const response = await fetch(url);
const data = await response.json();
```

This means:
- No server-side infrastructure needed for live AQI
- Data refreshes automatically while the page is open
- Costs nothing beyond WAQI's free-tier rate limits

---

## AQI vs. PM2.5

WAQI reports AQI on the US EPA scale. JanVayu displays both:

- **AQI** — the standardised 0–500 index (US EPA scale)
- **PM2.5 (µg/m³)** — the raw fine particulate concentration

The conversion between PM2.5 concentration and AQI uses the US EPA breakpoints. India uses its own National AQI (NAQI) scale with slightly different breakpoints — JanVayu notes this distinction where relevant.

---

## Rate Limits

The WAQI API is subject to a per-key quota (default 1,000 requests per second, per [WAQI's terms](https://aqicn.org/api/)). If you are running many API calls locally (e.g., testing all 157 cities simultaneously), you may hit rate limits. Options:

1. **Use your own WAQI token** — register free at [aqicn.org/data-platform/token](https://aqicn.org/data-platform/token/) and replace the token in `app.js`
2. **Slow down requests** — add a small delay between city fetches in development

---

## Station Coverage

WAQI coverage for India is strong in major metros and state capitals. Coverage is sparser in:

- Smaller district towns
- Rural areas
- Northeast states (limited CPCB station presence)

Where ground monitoring is absent, JanVayu notes the limitation and may reference satellite-derived estimates.
