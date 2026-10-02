# AI Layer — OpenAI gpt-oss-120B via Groq

JanVayu's AI features are powered by **OpenAI gpt-oss-120B**, an open-source LLM served via the **Groq API** (OpenAI-compatible REST API) from Netlify Functions.

---

## Why OpenAI gpt-oss-120B via Groq?

| Criterion | Choice |
|-----------|--------|
| **Cost** | Free tier (Groq Console) — no billing required |
| **Speed** | Served from Groq's hosted inference service (latency not measured here) |
| **Rate limits** | Generous free tier — sufficient for a public interest platform |
| **Multilingual** | Strong Hindi support (critical for JanVayu's audience) |
| **Quality** | Adequate for data-grounded factual responses (not creative writing) |
| **Open source** | OpenAI gpt-oss-120B is an open model (OpenAI), ensuring transparency and reproducibility |

### Trade-offs Accepted

- **Not GPT-4 / Claude** — Groq's free tier with an open-source model is the differentiator. JanVayu runs on zero budget.
- **Output token cap** — Output is capped per function at 512 to 1,024 `max_tokens` (air-query 700, accountability-brief 1,024, health-advisory 768, anomaly-check 512). Reasoning models spend part of that cap on reasoning, so the cap bounds the whole response, not only the visible text.
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
    │ openai/gpt-oss-120b model
    │ max_tokens: 512-1,024 (per function)
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
- **Output:** Grounded in the actual reading
- **Languages:** Answers in the language of the question; the Ask JanVayu UI is available in 10 languages
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
- **Max tokens:** 1,024
- **Fallback:** Returns raw data table

### 4. Anomaly Detection (`anomaly-check.mjs`)
- **Input:** None (monitors 5 metros automatically)
- **Threshold:** 2× seasonal baseline = anomaly
- **Output:** One-sentence AI explanation per anomaly
- **Cache:** 10-minute HTTP `Cache-Control` header (not Netlify Blobs)
- **Fallback:** Returns anomaly flag without AI explanation

---

## Rate Limiting Strategy

Free-tier Groq limits (subject to change — check [console.groq.com](https://console.groq.com) for current values):

| Limit | Value (openai/gpt-oss-120b, Groq free plan, checked 2 Oct 2026) |
|-------|-------|
| Requests per minute | 30 |
| Requests per day | 1,000 |
| Tokens per minute | 8,000 |
| Tokens per day | 200,000 |

Source: [Groq rate limits](https://console.groq.com/docs/rate-limits). The 8,000 tokens-per-minute limit is tight against the long air-query system prompt, so 429 responses are worth monitoring.

JanVayu distributes this budget across features (planning estimates, not measured from Netlify logs):
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
