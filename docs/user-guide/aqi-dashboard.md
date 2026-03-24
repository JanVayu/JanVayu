# AQI Dashboard

The AQI Dashboard provides live air quality readings for 30+ Indian cities, updated automatically every 10 minutes directly from WAQI and CPCB monitoring stations.

---

## Reading the Dashboard

### AQI Colour Scale

| AQI Range | Category | Health Implication |
|-----------|----------|--------------------|
| 0–50 | Good | Air quality is satisfactory |
| 51–100 | Moderate | Acceptable; some concern for sensitive groups |
| 101–150 | Unhealthy for Sensitive Groups | Sensitive individuals should limit outdoor activity |
| 151–200 | Unhealthy | Everyone may begin to experience effects |
| 201–300 | Very Unhealthy | Health warnings; serious risk for all |
| 301–500 | Hazardous | Emergency conditions; entire population at risk |

### PM2.5 (µg/m³) Standards

| Standard | Annual Average | 24-hour Average |
|----------|---------------|-----------------|
| WHO Guideline (2021) | 5 µg/m³ | 15 µg/m³ |
| India NAAQS | 40 µg/m³ | 60 µg/m³ |
| Delhi (actual, 2024) | ~100 µg/m³ | — |

---

## Cities Covered

The dashboard covers 30+ cities including:

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

The live map uses Leaflet.js with OpenStreetMap tiles and displays CPCB monitoring station markers colour-coded by current AQI. Click any marker to see the station name, current AQI, and PM2.5 reading.

---

## Interactive Demo

> **Upcoming** — An interactive demo of the AQI Dashboard will be embedded here, showing live city readings, the colour-coded map, and real-time data refresh in action.

<!-- Replace this section with an Arcade embed once recorded -->

---

## Data Limitations

- Some cities have only one or two official monitoring stations; readings may not represent the entire city
- Monitoring gaps can occur due to equipment downtime at CPCB stations
- Satellite-derived estimates (used where ground monitors are absent) carry higher uncertainty
