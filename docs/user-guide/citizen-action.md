# Citizen action tools

JanVayu offers practical tools for citizens, journalists, researchers and advocates who want to act on air quality.

---

## RTI templates

Pre-drafted Right to Information Act (2005) templates for:

| Template | Target Authority |
|----------|-----------------|
| NCAP fund spending | State Pollution Control Board |
| GRAP compliance report | Commission for Air Quality Management (CAQM) |
| Source apportionment study | Central Pollution Control Board (CPCB) |
| Industrial emission data | State PCB / MoEFCC |
| City Action Plan status | Municipal Corporation |

Templates are available in English and Hindi, formatted for the RTI online portal at [rtionline.gov.in](https://rtionline.gov.in). That portal accepts applications only for Central Government authorities (CAQM, CPCB, MoEFCC); State Pollution Control Boards and municipal corporations are state authorities, so those applications go through the state's own RTI portal or by post.

---

## Advocacy guides

Step-by-step guides cover how to file an RTI, from submission to first appeal; how to approach your ward councillor, using the ward-level accountability brief generator; how to work with the media, framing the air quality story with data; and how to take part in public hearings for Environmental Impact Assessments.

---

## Ward-level accountability brief

The brief generator uses an AI model (OpenAI gpt-oss-120b, an open-weight model, run through Groq) to write an accountability brief for any city, tailored to ward councillors, resident welfare associations or journalists. Each brief includes:

- Current AQI readings for the city
- Comparison against NCAP targets
- Key local pollution sources
- Suggested questions to ask elected officials

Developers can request a brief by sending a `POST` with a JSON body (`city` and `area` are required) to `/.netlify/functions/accountability-brief`.

---

## Mask selection guide

A practical guide to choosing a mask at different AQI levels. It is general guidance, not sourced to a health authority, and its category names follow the US EPA scale instead of the dashboard's own bands:

| AQI Level | Recommended Protection |
|-----------|----------------------|
| Good to Moderate | No mask needed |
| Unhealthy for Sensitive Groups | N95/KN95 for sensitive individuals |
| Unhealthy | N95/KN95 recommended for all |
| Very Unhealthy | N95/KN95, limit outdoor time |
| Hazardous | Stay indoors; N95 if going out |

---

## Interactive demo

> **Upcoming:** An interactive demo will be embedded here walking through how to generate an AI accountability brief for your city and download an RTI template.

<!-- Replace this section with an Arcade embed once recorded -->

---

## Indoor air quality

The indoor air quality section covers:

- Ventilation for different kinds of buildings
- Choosing an air purifier (HEPA filter standards, and CADR ratings for room size)
- Cooking fuels and health: LPG against solid fuels, and how far the Ujjwala scheme has reached
- Measuring indoor air quality with low-cost sensors
