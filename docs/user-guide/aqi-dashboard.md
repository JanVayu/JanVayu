# AQI dashboard

The AQI dashboard shows live air quality readings for 157 Indian cities, with Beijing, London and Singapore alongside for comparison. Readings come from WAQI and CPCB monitoring stations. The 33 largest cities refresh every 10 minutes, and the others load when you select them.

A reading is shown as live only when a station within 30 km of the place has reported in the last 6 hours. On 8 November 2026 only 5 of the 33 largest cities had one (Delhi, Gurgaon, Noida, Faridabad and Ghaziabad), because WAQI's feeds for most cities outside Delhi-NCR had stopped updating. When no station has reported, the page shows one of two other figures and says which:

- CPCB's daily bulletin for the city: one AQI for the whole city for one day, on CPCB's own scale, with its date and the number of stations that reported. CPCB publishes it about a day late.
- A computer model's estimate of PM2.5 (Open-Meteo, CAMS), when there is no recent bulletin either. It is labelled as an estimate and can read far too low in a polluted city.

Neither is called live, and neither enters the city ranking or the alerts.

---

## The first screen

The home page asks what you are breathing and has a field for your city, ward or village, with a Near me button beside it. Since 20 November 2026 the answer is set out as figures under a one-line headline. Each figure has its own row and a one-line label, and a tab on the top rule names the source.

| What is on screen | The figures | The tab reads |
|---|---|---|
| A live station | Its PM2.5 in µg/m³, and CPCB's band for that level | WAQI and the station's name |
| CPCB's daily bulletin | The AQI on CPCB's scale, CPCB's category, and how many of the city's stations reported | CPCB daily bulletin and its date |
| A model estimate | PM2.5 in µg/m³, labelled as estimated by a model | Open-Meteo (CAMS model) |

A bulletin that is two or more days old carries a notice saying how old it is. Under a live reading the page gives advice for five situations: buying groceries, sending a child to school, working outside all day, playing a sport, and being older or having asthma or COPD. The card beside the figures (below them on a phone) holds the city list and the share buttons.

On a phone the bar at the top is the wordmark and one Menu control. Menu opens the six controls: Who you are, the language, Simple, the reading font, Theme and Index. On a wider screen the six sit in the bar. Index lists every destination on the site.

## Reading the Dashboard

### AQI colour scale

WAQI reports AQI on the US EPA scale, so the dashboard labels a station's AQI with the US EPA names:

| AQI Range | Category |
|-----------|----------|
| 0 to 50 | Good |
| 51 to 100 | Moderate |
| 101 to 150 | Unhealthy for Sensitive Groups |
| 151 to 200 | Unhealthy |
| 201 to 300 | Very Unhealthy |
| Above 300 | Hazardous |

These are not CPCB's names. CPCB's AQI, the one in the daily bulletin, runs Good (0 to 50), Satisfactory (51 to 100), Moderate (101 to 200), Poor (201 to 300), Very Poor (301 to 400) and Severe (above 400), and the two scales must not be read against each other.

The first screen bands the live PM2.5 value instead, in µg/m³, on CPCB's thresholds: Good up to 30, Satisfactory up to 60, Moderate up to 90, Poor up to 120, Very poor up to 250, Severe above that. The bands start from different inputs, so the site keeps them apart.

### PM2.5 (µg/m³) standards

| Standard | Annual Average | 24-hour Average |
|----------|---------------|-----------------|
| WHO Guideline (2021) | 5 µg/m³ | 15 µg/m³ |
| India NAAQS | 40 µg/m³ | 60 µg/m³ |
| Delhi (actual, IQAir 2025) | 82.2 µg/m³ | None given |

---

## Cities covered

The dashboard covers 160 cities in all: 157 Indian cities and the three abroad. Among the Indian ones are:

Northern India: Delhi, Gurgaon, Noida, Faridabad, Ghaziabad, Lucknow, Kanpur, Agra, Varanasi, Jaipur, Chandigarh

Eastern India: Kolkata, Patna, Guwahati

Western India: Mumbai, Pune, Ahmedabad, Surat, Nagpur, Indore, Bhopal

Southern India: Bengaluru, Chennai, Hyderabad

---

## Data refresh

The dashboard refreshes every 10 minutes. Your browser asks a JanVayu function (`waqi-proxy`), which asks WAQI. CPCB's daily bulletin is fetched once a day. The social and news feeds refresh every 4 hours, on the server. The daily email digest goes out at 8:00 AM IST.

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
