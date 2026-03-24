# Citizen Action Tools

JanVayu provides practical tools for citizens, journalists, researchers, and advocates to take action on air quality.

---

## RTI Templates

Pre-drafted Right to Information Act (2005) templates for:

| Template | Target Authority |
|----------|-----------------|
| NCAP fund utilisation | State Pollution Control Board |
| GRAP compliance report | Commission for Air Quality Management (CAQM) |
| Source apportionment study | Central Pollution Control Board (CPCB) |
| Industrial emission data | State PCB / MoEFCC |
| City Action Plan status | Municipal Corporation |

Templates are available in **English and Hindi**, formatted for the RTI online portal at [rtionline.gov.in](https://rtionline.gov.in).

---

## Advocacy Guides

Step-by-step guides covering:

- **How to file an RTI** — from submission to first appeal
- **How to approach your ward councillor** — using the ward-level accountability brief generator
- **How to engage media** — framing the air quality story with data
- **How to participate in public hearings** — for Environmental Impact Assessments

---

## Ward-Level Accountability Brief

The platform's AI-assisted brief generator (powered by Google Gemini) creates a customised accountability brief for any city, tailored for ward councillors, resident welfare associations, or journalists. It includes:

- Current AQI readings for the city
- Comparison against NCAP targets
- Key local pollution sources
- Suggested questions to ask elected officials

To generate a brief, use the API endpoint: `GET /.netlify/functions/accountability-brief?city={cityKey}`

---

## Mask Selection Guide

A practical guide on choosing the right mask for different AQI levels:

| AQI Level | Recommended Protection |
|-----------|----------------------|
| Good–Moderate | No mask needed |
| Unhealthy for Sensitive Groups | N95/KN95 for sensitive individuals |
| Unhealthy | N95/KN95 recommended for all |
| Very Unhealthy | N95/KN95, limit outdoor time |
| Hazardous | Stay indoors; N95 if going out |

---

## Indoor Air Quality

The Indoor Air Quality section covers:

- Ventilation strategies for different building types
- Air purifier selection (HEPA filter standards, CADR ratings for room size)
- Cooking fuels and health — LPG vs. solid fuels, Ujjwala scheme reach
- Monitoring indoor air quality with low-cost sensors
