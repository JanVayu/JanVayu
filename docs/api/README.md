# API Reference

JanVayu exposes 10 serverless API endpoints via Netlify Functions. All endpoints are publicly accessible, return JSON, and support CORS.

**Base URL:** `https://www.janvayu.in/.netlify/functions`

---

## Quick Reference

### AI Features (v25.1)

| Endpoint | Method | Description |
|----------|--------|-------------|
| [`/air-query`](#air-query) | POST | Natural language AQI Q&A |
| [`/health-advisory`](#health-advisory) | POST | Personalised health advice |
| [`/accountability-brief`](#accountability-brief) | POST | Ward-level governance briefs |
| [`/anomaly-check`](#anomaly-check) | GET | PM2.5 spike detection |

### Social Feeds

| Endpoint | Method | Description |
|----------|--------|-------------|
| [`/reddit-feed`](#reddit-feed) | GET | Cached Reddit posts |
| [`/twitter-feed`](#twitter-feed) | GET | Cached Twitter/X posts |
| [`/news-proxy`](#news-proxy) | GET | Cached news articles |
| [`/instagram-feed`](#instagram-feed) | GET | Cached Instagram posts |

### Platform

| Endpoint | Method | Description |
|----------|--------|-------------|
| [`/subscribe`](#subscribe) | POST | Email subscription management |
| [`/feed-status`](#feed-status) | GET | Feed health monitoring |

---

## OpenAPI Specification

The full OpenAPI 3.1 spec is available at [`openapi.yaml`](openapi.yaml). Import it into GitBook, Swagger UI, Postman, or any OpenAPI-compatible tool.

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
