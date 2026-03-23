# Real-Time AQI (WAQI)

JanVayu uses the [World Air Quality Index (WAQI)](https://waqi.info) API as its primary source of real-time AQI data.

---

## About WAQI

WAQI is an independent non-profit project that aggregates data from 20,000+ monitoring stations across 100+ countries, including all CPCB CAAQMS stations in India. For India, WAQI aggregates data from:

- CPCB (Central Pollution Control Board) — official government monitoring network
- State Pollution Control Boards
- Embassy monitoring (US Embassy, etc.)

---

## How JanVayu Uses WAQI

The WAQI API is called **directly from the browser** (client-side) every 10 minutes. The API token is a free-tier public key embedded in `index.html`.

```javascript
// Client-side AQI fetch (simplified)
const url = `https://api.waqi.info/feed/${cityStation}/?token=${WAQI_TOKEN}`;
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

The public WAQI token is rate-limited at the IP level. If you are running many API calls locally (e.g., testing all 30 cities simultaneously), you may hit rate limits. Options:

1. **Use your own WAQI token** — register free at [aqicn.org/data-platform/token](https://aqicn.org/data-platform/token/) and replace the token in `index.html`
2. **Slow down requests** — add a small delay between city fetches in development

---

## Station Coverage

WAQI coverage for India is strong in major metros and state capitals. Coverage is sparser in:

- Smaller district towns
- Rural areas
- Northeast states (limited CPCB station presence)

Where ground monitoring is absent, JanVayu notes the limitation and may reference satellite-derived estimates.
