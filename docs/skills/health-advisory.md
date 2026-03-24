# Skill: Public Health Advisor

**Used in:** `netlify/functions/health-advisory.mjs`  
**Model:** Llama 3.3 70B via Groq  
**Trigger:** User submits a profile (age, health conditions, hours outdoors) + a city

---

## What This Skill Does

Generates a personalised, actionable health advisory based on the individual's vulnerability profile and the city's current PM2.5 reading. Critically: it does not hedge. It gives a concrete recommendation — "stay indoors until 2pm" rather than "consider limiting outdoor exposure."

---

## System Prompt (Exact)

```
You are a public health advisor specialising in air pollution exposure in India. 
Given a person's profile and current air quality data, generate a specific, 
actionable advisory. Be concrete: say 'stay indoors until 2pm' not 'limit 
outdoor exposure'. Reference the actual PM2.5 value. If the person has a health 
condition, address it directly. Do not hedge — give a clear recommendation. 
3-4 sentences maximum. Respond in English.
```

---

## Data Context Passed to the Model

```
Person: age {age}, conditions: {conditions}, hours outdoors daily: {hoursOutdoor}.
City: {city}, AQI: {aqi}, PM2.5: {pm25} µg/m³, PM10: {pm10} µg/m³,
Station: {station}, Updated: {time}. WHO PM2.5 guideline: 5 µg/m³.
```

---

## Pre-AI Risk Calculation

Before the Groq API call, the function computes a `riskLevel` in plain JavaScript — this is always returned alongside the AI advisory, so the UI can colour-code the response without waiting for the AI:

```javascript
function getRiskLevel(pm25, conditions) {
  const hasSensitive = conditions && conditions.some(c => c !== "none");
  if (pm25 <= 12) return "low";
  if (pm25 <= 35) return hasSensitive ? "moderate" : "low";
  if (pm25 <= 55) return hasSensitive ? "high" : "moderate";
  if (pm25 <= 150) return hasSensitive ? "severe" : "high";
  return "severe";
}
```

The thresholds are adapted from US EPA AQI breakpoints, adjusted to account for India's baseline exposure levels and the higher sensitivity of individuals with pre-existing conditions.

---

## Key Design Decisions

**Why "do not hedge"?**
Health communication research consistently shows that hedged advice ("you may want to consider...") is less acted upon than direct advice ("do X until Y"). For a public health tool serving people with asthma or heart disease, hedging is not neutral — it actively reduces protective behaviour.

**Why 3-4 sentences maximum?**
A health advisory that requires reading effort will not be read during a high-pollution emergency. It must be scannable in under 10 seconds.

**Why compute `riskLevel` in JavaScript rather than relying on the model?**
Reliability. The risk level drives UI colour-coding and fallback messaging. Delegating it to the LLM introduces non-determinism. The rule-based function always produces a consistent result, regardless of AI availability.

**Why include the conditions list in the prompt?**
"Address it directly" forces the model to say "for someone with asthma, PM2.5 at this level means..." rather than a generic response. This is the main personalisation lever.

---

## Fallback Behaviour

```
AI analysis unavailable. Raw data: {pm25} µg/m³ PM2.5 (AQI {aqi}).
```

The `riskLevel` is still computed and returned from the JavaScript function, so the UI can still colour-code the result even without the AI text.

---

## Adapting for Other Domains

This skill pattern — profile + live data → concrete advisory — is reusable for:

- **Heat advisory:** age + conditions + temperature/heat index → concrete advice on outdoor activity and hydration
- **Water contamination alert:** location + contaminant level + demographic → drinking/usage advisory
- **Noise exposure:** profile + decibel reading + duration → hearing protection advice
