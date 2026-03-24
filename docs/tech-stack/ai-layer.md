# AI Layer — Llama 3.3 70B via Groq

JanVayu's AI features are powered by **Llama 3.3 70B**, an open-source LLM served via the **Groq API** (OpenAI-compatible REST API) from Netlify Functions.

---

## Why Llama 3.3 70B via Groq?

| Criterion | Choice |
|-----------|--------|
| **Cost** | Free tier (Groq Console) — no billing required |
| **Speed** | Groq's LPU inference engine delivers ultra-low-latency responses |
| **Rate limits** | Generous free tier — sufficient for a public interest platform |
| **Multilingual** | Strong Hindi support (critical for JanVayu's audience) |
| **Quality** | Adequate for data-grounded factual responses (not creative writing) |
| **Open source** | Llama 3.3 70B is an open-source model (Meta), ensuring transparency and reproducibility |

### Trade-offs Accepted

- **Not GPT-4 / Claude** — Groq's free tier with an open-source model is the differentiator. JanVayu runs on zero budget.
- **Output token cap** — All prompts limit output to 150-400 tokens. This is a feature: concise responses are more useful for civic data.
- **No fine-tuning** — Prompt engineering only. Every skill is a system prompt, not a fine-tuned model.

---

## Integration Architecture

```
Browser (client)
    │
    │ POST /.netlify/functions/air-query
    │ POST /.netlify/functions/health-advisory
    │ POST /.netlify/functions/accountability-brief
    │ GET  /.netlify/functions/anomaly-check
    │
    ▼
Netlify Function (server-side)
    │
    │ 1. Parse user input
    │ 2. Fetch live AQI data from WAQI
    │ 3. Construct prompt with real data
    │ 4. Call Groq API
    │ 5. Return response (or fallback to raw data)
    │
    ▼
Groq API
    │
    │ llama-3.3-70b-versatile model
    │ max_tokens: 150-400
    │ temperature: 0.3-0.7
    │
    ▼
Structured response → Browser
```

**Key security principle:** The `GROQ_API_KEY` never touches the client. All AI calls are server-side via Netlify Functions.

---

## The Four AI Features

### 1. Ask JanVayu (`air-query.mjs`)
- **Input:** City name + free-text question
- **Context injected:** Live PM2.5 and AQI from WAQI
- **Output:** < 150 words, grounded in actual reading
- **Languages:** English and Hindi
- **Fallback:** Returns raw AQI data if Groq is rate-limited

### 2. Health Advisory (`health-advisory.mjs`)
- **Input:** City + age + health conditions + outdoor hours
- **Context injected:** Live AQI for that city
- **Output:** Colour-coded risk level + concrete recommendations
- **Fallback:** Generic WHO-guideline advice

### 3. Accountability Brief (`accountability-brief.mjs`)
- **Input:** City name
- **Context injected:** Live AQI + seasonal baselines + GRAP stages
- **Output:** Structured brief (current status, NCAP targets, 5 accountability questions)
- **Max tokens:** 400
- **Fallback:** Returns raw data table

### 4. Anomaly Detection (`anomaly-check.mjs`)
- **Input:** None (monitors 5 metros automatically)
- **Threshold:** 2× seasonal baseline = anomaly
- **Output:** One-sentence AI explanation per anomaly
- **Cache:** 10-minute Netlify Blobs cache
- **Fallback:** Returns anomaly flag without AI explanation

---

## Rate Limiting Strategy

Free-tier Groq limits (subject to change — check [console.groq.com](https://console.groq.com) for current values):

| Limit | Value |
|-------|-------|
| Requests per minute | 30 |
| Tokens per minute | 15,000 |
| Tokens per day | 500,000 |

JanVayu distributes this budget across features:
- Anomaly check: ~144/day (cached, fires on page load)
- Air query: ~50/day (user-initiated)
- Health advisory: ~30/day (user-initiated)
- Accountability brief: ~20/day (user-initiated)

If limits are hit, every function gracefully falls back to raw data. The user always gets a response — just without the AI analysis.

---

## Prompt Engineering

All prompts follow these principles:

1. **Always inject real data** — the model never generates from memory
2. **Specify exact output format** — especially for structured briefs
3. **Constrain word count** — explicit limits in every prompt
4. **Name failure modes** — "do not give generic advice", "do not hedge"
5. **Multilingual instruction** — "respond in the language of the question"
6. **Graceful degradation** — every function has a non-AI fallback path

See the [Skills & AI Prompts](../skills/README.md) section for the full prompt documentation.
