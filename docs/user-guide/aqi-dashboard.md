# AQI Dashboard

The AQI Dashboard provides live air quality readings for 157 Indian cities, updated automatically every 10 minutes directly from WAQI and CPCB monitoring stations.

---

## Reading the Dashboard

### AQI Colour Scale

The dashboard labels a reading by its AQI value using these bands (`getAQILabel` in `app.js`). They are not the US EPA scale:

| AQI Range | Category |
|-----------|----------|
| 0–50 | Good |
| 51–100 | Moderate |
| 101–200 | Poor |
| 201–300 | Very Poor |
| 301–400 | Severe |
| Above 400 | Hazardous |

The hero banner at the top of the dashboard bands the live **PM2.5** value instead, in µg/m³: Good up to 30, Satisfactory up to 60, Moderate up to 90, Poor up to 120, Very poor up to 250, Severe above that. The two answer different inputs and are not merged.

### PM2.5 (µg/m³) Standards

| Standard | Annual Average | 24-hour Average |
|----------|---------------|-----------------|
| WHO Guideline (2021) | 5 µg/m³ | 15 µg/m³ |
| India NAAQS | 40 µg/m³ | 60 µg/m³ |
| Delhi (actual, IQAir 2025) | 82.2 µg/m³ | — |

---

## Cities Covered

The dashboard covers 160 cities including:

**Northern India:** Delhi, Gurgaon, Noida, Faridabad, Ghaziabad, Lucknow, Kanpur, Agra, Varanasi, Jaipur, Chandigarh

**Eastern India:** Kolkata, Patna, Guwahati

**Western India:** Mumbai, Pune, Ahmedabad, Surat, Nagpur, Indore, Bhopal

**Southern India:** Bengaluru, Chennai, Hyderabad

---

## Data Refresh

- **Dashboard refresh:** every 10 minutes (client-side, WAQI API)
- **Social/news feeds:** every 4 hours (server-side, Netlify scheduled function)
- **Daily email digest:** 8:00 AM IST daily

---

## Interactive Map

The live map uses Leaflet.js with OpenStreetMap tiles and displays WAQI station markers (many of which are CPCB stations) colour-coded by current AQI. Click any marker to see the station name, current AQI, and PM2.5 reading.

---

## Interactive Demo

> **Upcoming** — An interactive demo of the AQI Dashboard will be embedded here, showing live city readings, the colour-coded map, and real-time data refresh in action.

<!-- Replace this section with an Arcade embed once recorded -->

---

## Data Limitations

- Some cities have only one or two official monitoring stations; readings may not represent the entire city
- Monitoring gaps can occur due to equipment downtime at CPCB stations
- Satellite-derived estimates (used where ground monitors are absent) carry higher uncertainty
