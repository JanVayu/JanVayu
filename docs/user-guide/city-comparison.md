# City comparison and map

## City comparison

The city comparison section ranks Indian cities by current AQI in real time, refreshed every 10 minutes. It shows:

- Live AQI and PM2.5 for each city
- Colour-coded status (Good / Moderate / Unhealthy / Very Unhealthy / Hazardous)
- Annual average PM2.5 against the WHO guideline of 5 µg/m³

### Seasonal context

AQI varies a great deal by season in India. The ranges below are indicative only, and no source is cited for them. The site's own seasonal data (`data/district-history.json`) defines winter as Dec–Feb, summer as Mar–May, monsoon as Jun–Sep and post-monsoon as Oct–Nov, which differs from the month labels in this table.

| Season | Typical PM2.5 (Delhi) | Main causes |
|--------|----------------------|------------|
| Winter (Oct–Feb) | 80–300 µg/m³ | Crop stubble burning, temperature inversion, low wind speed |
| Pre-monsoon (Mar–May) | 50–100 µg/m³ | Dust storms, construction |
| Monsoon (Jun–Sep) | 20–50 µg/m³ | Rain washout reduces particulates |

---

## Interactive map

The live map shows all CPCB and WAQI monitoring stations across India, with markers coloured by current AQI.

To use the map:

1. Zoom in on any region to see individual monitoring stations
2. Click a marker to see the station name, current AQI, PM2.5 reading and last update time
3. Use the layer toggle to switch between AQI categories and PM2.5 values
4. The "Locate me" button centres the map on your current location

The map is drawn with [Leaflet.js](https://leafletjs.com) on [OpenStreetMap](https://www.openstreetmap.org) tiles, using live data from the [WAQI API](https://waqi.info).

---

## Interactive demo

> **Upcoming:** An interactive demo will be embedded here showing city rankings, the live map with clickable station markers, and the seasonal comparison view.

<!-- Replace this section with an Arcade embed once recorded -->

---

## Station coverage limitations

India had about 565 CAAQMS (Continuous Ambient Air Quality Monitoring Stations) in 2025, out of 1,600 monitoring stations including manual ones (CREA, *2026 Progress Report on the National Clean Air Programme*). Coverage still has gaps:

- Coverage is concentrated in large cities, and smaller towns have limited monitoring or none
- Many stations go down at times, through equipment failure or power outages
- Rural areas mostly have no ground-level monitoring

JanVayu adds to the ground data with satellite-derived estimates (SatPM2.5 V6GL03 from the Atmospheric Composition Analysis Group at Washington University, about 1 km) and CAMS model data via Open-Meteo. NASA FIRMS (VIIRS) is used only for the fire tracker.
