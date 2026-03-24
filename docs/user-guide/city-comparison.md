# City Comparison & Map

## City Comparison

The City Comparison section ranks Indian cities by current AQI in real time, refreshed every 10 minutes. It shows:

- Live AQI and PM2.5 for each city
- Colour-coded status (Good / Moderate / Unhealthy / Very Unhealthy / Hazardous)
- Trend indicator (improving / worsening / stable vs. yesterday)
- Annual average PM2.5 against the WHO guideline of 5 µg/m³

### Seasonal Context

AQI varies significantly by season in India:

| Season | Typical PM2.5 (Delhi) | Key Drivers |
|--------|----------------------|------------|
| Winter (Oct–Feb) | 80–300 µg/m³ | Crop stubble burning, temperature inversion, low wind speed |
| Pre-monsoon (Mar–May) | 50–100 µg/m³ | Dust storms, construction |
| Monsoon (Jun–Sep) | 20–50 µg/m³ | Rain washout reduces particulates |

---

## Interactive Map

The live map displays all CPCB and WAQI monitoring stations across India, with markers colour-coded by current AQI.

**How to use the map:**

1. Zoom in on any region to see individual monitoring stations
2. Click a marker to view: station name, current AQI, PM2.5 reading, and last update time
3. Use the layer toggle to switch between AQI categories and PM2.5 values
4. The "Locate me" button centres the map on your current location

**Technology:** The map uses [Leaflet.js](https://leafletjs.com) with [OpenStreetMap](https://www.openstreetmap.org) tiles and live data from the [WAQI API](https://waqi.info).

---

## Interactive Demo

> **Upcoming** — An interactive demo will be embedded here showing city rankings, the live map with clickable station markers, and the seasonal comparison view.

<!-- Replace this section with an Arcade embed once recorded -->

---

## Station Coverage Limitations

India has approximately 800 CAAQMS (Continuous Ambient Air Quality Monitoring Stations) as of 2025. However:

- Coverage is concentrated in large cities; smaller towns have limited or no monitoring
- Many stations experience downtime (equipment failure, power outages)
- Rural areas largely lack ground-level monitoring

JanVayu supplements ground data with satellite-derived estimates (NASA MODIS/VIIRS) for areas with no station coverage.
