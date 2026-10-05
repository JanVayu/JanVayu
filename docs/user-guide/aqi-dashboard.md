# AQI dashboard

The AQI dashboard shows live air quality readings for 157 Indian cities. It updates itself every 10 minutes, with readings taken from WAQI and CPCB monitoring stations.

---

## Reading the Dashboard

### AQI colour scale

The dashboard labels a reading by its AQI value using these bands. They are not the US EPA scale:

| AQI Range | Category |
|-----------|----------|
| 0–50 | Good |
| 51–100 | Moderate |
| 101–200 | Poor |
| 201–300 | Very Poor |
| 301–400 | Severe |
| Above 400 | Hazardous |

The banner at the top of the dashboard bands the live PM2.5 value instead, in µg/m³: Good up to 30, Satisfactory up to 60, Moderate up to 90, Poor up to 120, Very poor up to 250, Severe above that. The two bands start from different inputs, so the site keeps them apart.

### PM2.5 (µg/m³) standards

| Standard | Annual Average | 24-hour Average |
|----------|---------------|-----------------|
| WHO Guideline (2021) | 5 µg/m³ | 15 µg/m³ |
| India NAAQS | 40 µg/m³ | 60 µg/m³ |
| Delhi (actual, IQAir 2025) | 82.2 µg/m³ | None given |

---

## Cities covered

The dashboard covers 160 cities, including:

Northern India: Delhi, Gurgaon, Noida, Faridabad, Ghaziabad, Lucknow, Kanpur, Agra, Varanasi, Jaipur, Chandigarh

Eastern India: Kolkata, Patna, Guwahati

Western India: Mumbai, Pune, Ahmedabad, Surat, Nagpur, Indore, Bhopal

Southern India: Bengaluru, Chennai, Hyderabad

---

## Data refresh

The dashboard refreshes every 10 minutes, with readings fetched from the WAQI API by your browser. The social and news feeds refresh every 4 hours, on the server. The daily email digest goes out at 8:00 AM IST.

---

## Interactive map

The live map is drawn on OpenStreetMap and shows WAQI station markers (many of them CPCB stations), coloured by current AQI. Click any marker to see the station name, current AQI, and PM2.5 reading.

---

## Interactive demo

> **Upcoming:** An interactive demo of the AQI Dashboard will be embedded here, showing live city readings, the colour-coded map, and real-time data refresh in action.

<!-- Replace this section with an Arcade embed once recorded -->

---

## Data limitations

- Some cities have only one or two official monitoring stations, so a reading may not represent the whole city
- Equipment downtime at CPCB stations can leave gaps in monitoring
- Satellite-derived estimates (used where ground monitors are absent) carry higher uncertainty
