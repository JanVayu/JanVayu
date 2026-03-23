# Skill: Anomaly Explainer

**Used in:** `netlify/functions/anomaly-check.mjs`  
**Model:** Gemini 2.5 Flash  
**Trigger:** Invoked on-demand; checks five major cities against seasonal baselines

---

## What This Skill Does

Detects PM2.5 spikes across five major cities by comparing live readings against hardcoded seasonal baselines. When a spike is detected (reading > 2× the baseline), it asks Gemini to explain the most likely cause in a single, India-specific sentence.

This is the most constrained of the four skill files — one sentence, one cause, maximum specificity.

---

## System Prompt (Per-City, Exact)

```
In one sentence, explain why PM2.5 in {city} might be {pm25} µg/m³ right now 
— {month}, {hour}. Give the most likely cause. Be specific to the Indian context.
```

Note: this is sent as a **user message**, not a system instruction. Because the output is a single sentence with a clear factual structure, a user-turn prompt is sufficient — a full system instruction would add overhead without benefit.

---

## Spike Detection Logic (Pre-AI)

```javascript
const ratio = d.pm25 / baseline;
if (ratio > 2) {
  // flag as spike, then explain via Gemini
}
```

Threshold: **2× the seasonal baseline** (not a fixed absolute number). This matters because:
- Delhi's winter baseline is ~95 µg/m³ — a reading of 120 µg/m³ is not anomalous in January
- Mumbai's baseline is ~45 µg/m³ — 120 µg/m³ there is highly anomalous
- A fixed threshold (e.g., "flag anything above 150 µg/m³") would produce both false positives (Delhi winter) and false negatives (coastal cities)

**Seasonal Baselines (from CREA / IQAir historical data):**

| City | Oct–Mar (Winter) | Apr–Sep (Summer/Monsoon) |
|------|-----------------|--------------------------|
| Delhi | 95 µg/m³ | 55 µg/m³ |
| Mumbai | 45 µg/m³ | 45 µg/m³ |
| Kolkata | 80 µg/m³ | 35 µg/m³ |
| Chennai | 40 µg/m³ | 40 µg/m³ |
| Bengaluru | 40 µg/m³ | 40 µg/m³ |

---

## Key Design Decisions

**Why one sentence?**
The anomaly explanation appears as a tooltip or inline annotation in the UI. One sentence is the maximum that can be read without interrupting the user's flow. Anything longer becomes a paragraph, which requires a different UI treatment.

**Why include the month and hour in the prompt?**
Cause attribution depends heavily on time of day and season:
- Delhi at 7 AM in November → likely stubble burning + morning inversion
- Delhi at 2 PM in April → likely dust storms
- Mumbai at midnight → likely industrial/shipping activity
The model needs this temporal context to give a useful explanation rather than a generic list of possible causes.

**Why hardcode baselines rather than computing them from historical data?**
Simplicity and reliability. The seasonal baselines are stable year-on-year within ±15%. Computing a rolling baseline would require a persistent time-series database — unnecessary infrastructure for the marginal accuracy gain. The hardcoded values are sourced from CREA and IQAir annual reports and are updated manually when major new data is available.

**Why run the Gemini calls in parallel (`Promise.allSettled`)?**
The anomaly check may find spikes in multiple cities simultaneously. Running sequentially would take 3–5× longer. `Promise.allSettled` (not `Promise.all`) means a failure for one city's explanation does not cancel the others.

---

## Fallback Behaviour

```javascript
if (!s.explanation) {
  s.explanation = `PM2.5 is ${s.ratio}x above seasonal baseline.`;
}
```

If Gemini is unavailable, the response still includes the spike data and ratio — just without the AI-generated cause sentence.
