# AI Features (Gemini)

JanVayu uses the **Google Gemini API** to power four AI-assisted features. All AI calls are server-side (Netlify Functions) and require the `GEMINI_API_KEY` environment variable.

---

## Features

### 1. Natural Language AQI Query (`air-query.mjs`)

Ask a plain-language question about a city's air quality and receive a contextual, data-grounded answer.

**How it works:**
1. User submits a city and a question
2. The function fetches live AQI and PM2.5 from WAQI for that city
3. Both the live data and the question are sent to Gemini as a prompt
4. Gemini generates a response grounded in the actual reading

**Example inputs:**
- "Is it safe to go for a run in Delhi today?"
- "Should I keep my windows open in Mumbai right now?"
- "What is causing the high AQI in Kolkata this week?"

---

### 2. Personalised Health Advisory (`health-advisory.mjs`)

Generates a tailored health recommendation based on the user's profile and their city's current AQI.

**Inputs accepted:**
- City
- Age
- Health conditions (e.g., asthma, COPD, heart disease, pregnancy, diabetes)

**Output:** A structured advisory covering outdoor activity, mask use, medication precautions, and indoor air quality steps.

---

### 3. Ward-Level Accountability Brief (`accountability-brief.mjs`)

Generates a structured brief for local accountability — designed to be used by:
- Ward councillors in city council discussions
- Journalists writing local air quality stories
- Resident Welfare Associations (RWAs) approaching the municipal corporation

**Contents:**
- Current AQI and PM2.5 for the city
- NCAP target vs. actual PM2.5 trend
- Key local pollution sources
- Five suggested accountability questions for elected officials

---

### 4. Anomaly Detection (`anomaly-check.mjs`)

Monitors AQI for five major cities (Delhi, Mumbai, Kolkata, Chennai, Bengaluru) against seasonal baselines derived from CREA/IQAir data. When a significant spike is detected, Gemini explains the likely causes.

**Seasonal baselines used:**

| City | Winter (Oct–Feb) | Summer/Monsoon |
|------|-----------------|----------------|
| Delhi | 95 µg/m³ | 55 µg/m³ |
| Mumbai | 45 µg/m³ | 45 µg/m³ |
| Kolkata | 80 µg/m³ | 35 µg/m³ |
| Chennai | 40 µg/m³ | 40 µg/m³ |
| Bengaluru | 40 µg/m³ | 40 µg/m³ |

A reading more than 50% above the seasonal baseline triggers an anomaly alert.

---

## API Key Setup

The free tier of the Gemini API (available at [aistudio.google.com](https://aistudio.google.com)) is sufficient for all JanVayu AI features. Rate limits on the free tier are generous for the expected usage patterns of a public interest platform.

Set the key as `GEMINI_API_KEY` in:
- Your `.env` file for local development
- The Netlify dashboard (Site Settings → Environment Variables) for production
