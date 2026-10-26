# AI Features (Groq / gpt-oss-120b)

JanVayu uses **OpenAI gpt-oss-120b**, an open-weight LLM served via the **Groq API**, to power four AI-assisted features. All AI calls are server-side (Netlify Functions) and require the `GROQ_API_KEY` environment variable. The model name is read from the optional `GROQ_MODEL` variable and defaults to `openai/gpt-oss-120b`.

> **Update 2 Oct 2026:** Groq retired Llama 3.3 70B on 16 Aug 2026 ([Groq deprecations](https://console.groq.com/docs/deprecations)); the functions run `openai/gpt-oss-120b`.

---

## Features

### 1. Natural Language AQI Query (`air-query.mjs`)

Ask a plain-language question about a city's air quality and receive a contextual, data-grounded answer.

**How it works:**
1. User submits a city and a question
2. The function fetches live AQI and PM2.5 from WAQI for that city
3. Both the live data and the question are sent to gpt-oss-120b via Groq as a prompt
4. The model generates a response grounded in the actual reading

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

Monitors AQI for five major cities (Delhi, Mumbai, Kolkata, Chennai, Bengaluru) against seasonal baselines. The baselines are hand-entered constants in `anomaly-check.mjs`; a code comment attributes them to CREA/IQAir data without naming a report or year. When a significant spike is detected, gpt-oss-120b via Groq explains the likely causes.

**Seasonal baselines used:**

| City | Winter (Oct–Mar) | Summer/Monsoon |
|------|-----------------|----------------|
| Delhi | 95 µg/m³ | 55 µg/m³ |
| Mumbai | 45 µg/m³ | 45 µg/m³ |
| Kolkata | 80 µg/m³ | 35 µg/m³ |
| Chennai | 40 µg/m³ | 40 µg/m³ |
| Bengaluru | 40 µg/m³ | 40 µg/m³ |

A reading more than 100% above the seasonal baseline (a ratio above 2x) triggers an anomaly alert.

**Gated reference blocks.** Heavy knowledge is sent only when the question is about it, so that the common question stays small. `TOPICAL_REFERENCE` and `METHODOLOGY_REFERENCE` were the first. On 26 Oct 2026 four more were added, each about 300 to 600 tokens: `ABOUT_REFERENCE` (the AIPC origin, so the assistant can answer "who is behind this" without guessing and never claims neutrality), `SECONDARY_REFERENCE` (ammonium sulphate against the 42% state maximum, and Wang et al. on ammonia), `WINTER_PEAKS_REFERENCE` (the timing of Delhi's winter peaks from `data/delhi-weekly.json`, and what the figures cannot say about causes) and `ENSO_REFERENCE` (NOAA's 8 October 2026 outlook and the Yadav, Beig and Kripalani study, with an instruction never to forecast a winter from it). Each is switched on by a detector in `air-query.mjs` (`isAboutQuery` and its siblings). `test/knowledge-gates.test.mjs` pins the detectors on questions they must and must not catch, the token cost of each block, the AIPC wording, and the winter figures against `data/delhi-weekly.json`, so a changed data file fails the test until the block is edited. The ENSO block carries a date and goes stale monthly: update it after each NOAA discussion (next on 12 November 2026) or remove it.

---

## API Key Setup

Groq's published base limits for `openai/gpt-oss-120b` are 30 requests a minute, 1,000 a day, **8,000 tokens a minute and 200,000 a day** ([Groq rate limits](https://console.groq.com/docs/rate-limits), checked 26 Oct 2026). Whether the production key sits on that plan is not recorded in the repository. If it does, the limits bind: the system prompt for `air-query.mjs` is about 5,700 tokens before any question, and up to about 12,000 with every block switched on (measured by building it, 26 Oct 2026). That allows about one answered question a minute and roughly 25 to 30 a day across all visitors, and it is why a weekly eval of 37 cases takes about 40 minutes and can find itself rate-limited. Check the plan in the Groq console before relying on any figure here.

Set the key as `GROQ_API_KEY` in:
- Your `.env` file for local development
- The Netlify dashboard (Site Settings → Environment Variables) for production
