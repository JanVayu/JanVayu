# API Reference

JanVayu exposes 12 public endpoints (11 Netlify Functions plus the `/api` open-data entry point; one of them, `/twitter-feed`, is retired). All are publicly accessible and support CORS. They return JSON, except the CSV export, which returns `text/csv`. The repository also contains further functions behind the Open Data API (rankings, reference-data, historical-aqi, community-sensors, status-history) and internal ones.

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
curl "https://www.janvayu.in/api?dataset=rankings&format=csv&range=week" # 7-day average
curl "https://www.janvayu.in/api?dataset=rankings&format=csv&range=month" # 30-day average
```

The `rankings` function understands `range=live`, `range=week` and `range=month`. Any other value, including `7d` and `30d` (which the manifest lists), is treated as a 30-day range.

> **Known issue:** `range=7d` is advertised in the `/api` manifest but is not recognised by the rankings function, so it returns the 30-day average, not a 7-day average. Use `range=week` for the 7-day average until the code is fixed.

The manifest points at the underlying JSON endpoints — `rankings`, `reference-data` (CPCB stations / NCAP cities / IQAir annual), `historical-aqi`, `community-sensors`, and `status-history` — which remain individually callable.

**Licence:** data content is CC BY-NC-SA 4.0; code is MIT. Please cite as shown in the manifest's `citation` field.

---

## OpenAPI Specification

The full OpenAPI 3.1 spec is available at [`openapi.yaml`](openapi.yaml). Import it into Swagger UI, Postman, Insomnia, or any OpenAPI-compatible tool.

---

## Authentication

No authentication required. All endpoints are public.

- **AI endpoints** depend on Groq's rate limits
- **Feed endpoints** serve from cache (pre-fetched every 4 hours)
- **CORS:** `Access-Control-Allow-Origin: *` on all responses

---

## Common Response Patterns

### Success
Endpoints return HTTP 200 for upstream or AI failures (with a fallback body), but 400 for invalid input, 405 for the wrong method, and 500 or 502 on internal or upstream errors (for example `/api` returns 502 when the rankings CSV cannot be built). Check the status code and the response body.

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
