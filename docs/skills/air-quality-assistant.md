# Skill: Air Quality Assistant

**Used in:** `netlify/functions/air-query.mjs`  
**Model:** Llama 3.3 70B via Groq  
**Trigger:** User submits a plain-language question + a city name

---

## What This Skill Does

Accepts a natural language question about a city's current air quality, fetches live AQI and PM2.5 from WAQI, and returns a grounded, data-specific answer. The model is explicitly prevented from giving generic advice — it must cite the actual numbers it was given.

---

## System Prompt (Exact)

```
You are JanVayu's air quality assistant for India. Answer questions in plain, 
direct language. Use the actual numbers provided — do not give generic advice. 
If the question is about health, be honest about risk without causing panic. 
Always cite the data you are using. Respond in the same language the question 
is asked in — if Hindi, respond in Hindi using Devanagari script. Keep 
responses under 150 words.
```

---

## Data Context Passed to the Model

```
City: {city}, AQI: {aqi}, PM2.5: {pm25} µg/m³, PM10: {pm10} µg/m³,
Station: {station}, Updated: {time}, WHO PM2.5 guideline: 5 µg/m³.

Question: {user_question}
```

The WHO guideline is explicitly included so the model can compute and state the multiple (e.g., "Delhi's PM2.5 is currently 18× the WHO safe limit").

---

## Key Design Decisions

**Why "do not give generic advice"?**
Without this constraint, LLMs tend to give boilerplate responses like "limit outdoor activity when AQI is high" regardless of the actual reading. The prompt forces the model to anchor to the specific value provided — e.g., "at 187 µg/m³, which is 37 times the WHO guideline, outdoor exercise today carries real cardiovascular risk."

**Why multilingual?**
JanVayu's users span Hindi, Tamil, Bengali, and other languages. A question asked in Hindi deserves an answer in Hindi. The prompt detects language implicitly through the question itself — no separate language parameter is needed.

**Why 150 words?**
The response surfaces inline on the platform UI. Longer responses break the layout and lose readers. Brevity also forces specificity.

**Why include the WHO guideline in the data context?**
It normalises the raw PM2.5 value into something meaningful for a non-specialist. 87 µg/m³ is hard to interpret; "17 times the WHO guideline" is not.

---

## Fallback Behaviour

If the Groq API call fails (rate limit, network error), the function returns:

```
AI analysis unavailable right now (rate limit). Raw PM2.5: {pm25} µg/m³.
```

The raw data is always returned regardless of AI availability.

---

## Adapting for Other Domains

To use this skill for a different environmental pollutant (e.g., water quality, noise):

- Replace the data context with relevant metrics (turbidity, TDS, decibels, etc.)
- Keep the "cite the actual number" constraint — it is the most important line
- Adjust the WHO/standard reference to the relevant guideline for your domain
- Keep the multilingual instruction if your audience spans multiple languages
