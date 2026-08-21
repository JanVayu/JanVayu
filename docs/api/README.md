# API Reference

JanVayu exposes 10 serverless API endpoints via Netlify Functions. All endpoints are publicly accessible, return JSON, and support CORS.

**Base URL:** `https://www.janvayu.in/.netlify/functions`

---

## Quick Reference

### AI Features (v25.1)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/air-query` | POST | Natural language AQI Q&A |
| `/health-advisory` | POST | Personalised health advice |
| `/accountability-brief` | POST | Ward-level governance briefs |
| `/anomaly-check` | GET | PM2.5 spike detection |

### Social Feeds

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/reddit-feed` | GET | Cached Reddit posts |
| `/twitter-feed` | — | **Retired.** Read Nitter, whose public instances are gone; the endpoint no longer answers and nothing calls it. |
| `/youtube-feed` | GET | Cached India air-quality videos from YouTube channel RSS |
| `/news-proxy` | GET | Cached news articles |
| `/instagram-feed` | GET | Cached Instagram posts |

### Platform

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/subscribe` | POST | Email subscription management |
| `/feed-status` | GET | Feed health monitoring |

### Open Data

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api` | GET | Versioned data manifest + CSV export |

---

## Open Data API

A single, discoverable entry point over the datasets JanVayu publishes — built for journalists, researchers and forks. Read-only, CORS-open, free to use with attribution.

**Manifest (lists every dataset, its parameters, licence and citation):**

```bash
curl https://www.janvayu.in/api
```

**CSV export of the live city rankings:**

```bash
curl "https://www.janvayu.in/api?dataset=rankings&format=csv"          # live
curl "https://www.janvayu.in/api?dataset=rankings&format=csv&range=7d" # 7-day average
```

The manifest points at the underlying JSON endpoints — `rankings`, `reference-data` (CPCB stations / NCAP cities / IQAir annual), `historical-aqi`, `community-sensors`, and `status-history` — which remain individually callable.

**Licence:** data content is CC BY-NC-SA 4.0; code is MIT. Please cite as shown in the manifest's `citation` field.

---

## OpenAPI Specification

The full OpenAPI 3.1 spec is available at [`openapi.yaml`](openapi.yaml). Import it into Swagger UI, Postman, Insomnia, or any OpenAPI-compatible tool.

---

## Authentication

No authentication required. All endpoints are public.

- **AI endpoints** are rate-limited by the Groq free tier
- **Feed endpoints** serve from cache (pre-fetched every 4 hours)
- **CORS:** `Access-Control-Allow-Origin: *` on all responses

---

## Common Response Patterns

### Success
All endpoints return HTTP 200, even on partial failures. Check the response body for error details.

### Fallback
AI endpoints return raw data (without AI analysis) if Groq is rate-limited. Feed endpoints return stale cache if live fetches fail.

### CORS Preflight
All POST endpoints handle OPTIONS requests with 204 No Content.

---

## Example Requests

### Ask about air quality

```bash
curl -X POST https://www.janvayu.in/.netlify/functions/air-query \
  -H "Content-Type: application/json" \
  -d '{"city": "delhi", "question": "Is it safe to go for a run today?"}'
```

### Get health advisory

```bash
curl -X POST https://www.janvayu.in/.netlify/functions/health-advisory \
  -H "Content-Type: application/json" \
  -d '{"city": "mumbai", "age": 35, "conditions": ["asthma"], "hoursOutdoor": 3}'
```

### Check anomalies

```bash
curl https://www.janvayu.in/.netlify/functions/anomaly-check
```

### Get Reddit feed

```bash
curl https://www.janvayu.in/.netlify/functions/reddit-feed?filter=delhi
```

### Subscribe to digest

```bash
curl -X POST https://www.janvayu.in/.netlify/functions/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "cities": ["delhi", "mumbai"]}'
```
