# City comparison and map

## City comparison

The city comparison section ranks Indian cities by current AQI in real time. The 33 largest cities refresh every 10 minutes and the others load when you select them. It shows:

- Live AQI and PM2.5 for each city
- Colour-coded status (Good / Moderate / Unhealthy / Very Unhealthy / Hazardous)
- Annual average PM2.5 against the WHO guideline of 5 µg/m³

### Seasonal context

Air quality in India changes a great deal with the season. The table uses the seasons the site itself uses: winter is December to February, summer is March to May, monsoon is June to September and post-monsoon is October and November. The figures are Delhi's 2022 averages from LongPMInd (Wang et al. 2024, in `data/district-history.json`), averaged over Delhi's 11 districts. They come from a model validated against monitors, not from an instrument, and they run at about 10 km resolution, so they will not match a single station.

| Season | Delhi PM2.5, 2022 | Main causes |
|--------|-------------------|-------------|
| Winter (Dec–Feb) | 132 µg/m³ | Temperature inversion, low wind speed |
| Summer (Mar–May) | 89 µg/m³ | Dust storms, construction |
| Monsoon (Jun–Sep) | 41 µg/m³ | Rain washes particles out of the air |
| Post-monsoon (Oct–Nov) | 129 µg/m³ | Crop stubble burning in Punjab and Haryana, falling temperatures |

The causes are the usual explanations for each season and are not measured by this table.

Correction, 6 October 2026: an earlier version of this table called winter October to February and gave ranges (80 to 300 µg/m³ in winter, for example) that cited no source. The seasons and figures above replace them.

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
