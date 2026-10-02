# Tech Stack Overview

JanVayu is built on a deliberately minimal stack — zero frontend frameworks, three npm dependencies, and a serverless backend. This page maps every technology used and why it was chosen.

---

## Stack at a Glance

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Vanilla HTML/CSS/JS | Single-page application (no build step) |
| **Charts** | Chart.js (CDN) | AQI trend visualisations |
| **Maps** | Leaflet.js + OpenStreetMap (CDN) | Interactive station maps |
| **Backend** | Netlify Functions (Node.js 22) | Serverless API endpoints |
| **Cache** | Netlify Blobs | Persistent JSON cache (strong consistency) |
| **Email** | Resend API | Daily AQI digest delivery |
| **AI** | OpenAI gpt-oss-120b via Groq (env-overridable `GROQ_MODEL`) | NL queries, health advice, anomaly detection |
| **Hosting** | Netlify CDN | Auto-deploy from GitHub `main` |
| **CI** | GitHub Actions | Link audit, accessibility, Lighthouse, CodeQL, translation sync, site-figure guards, Dependabot |
| **Domain** | Netlify DNS | janvayu.in custom domain |
| **Docs** | Docsify (5 languages) | Single shell at `/docs/`; language hash routes (`/docs/#/hi/` etc.) load `docs-{lang}/` markdown |
| **Development** | Claude Code (Anthropic) | AI-assisted development workflow |

---

## Why This Stack?

### Zero-Framework Frontend

JanVayu's audience includes people on 2G connections and low-end Android devices across India. A framework like React or Vue would add a framework runtime to download before a single feature loads. Instead:

- The app is `index.html` plus `styles.css`, `app.js`, `games.js` and 19 lazy-loaded panel fragments, with no bundler
- No transpilation, no bundling, no tree-shaking needed
- Deploy artefact = the repo itself
- Any contributor with basic HTML/JS skills can contribute

### Only 3 npm Dependencies

```json
{
  "@netlify/blobs": "^11.0.2",
  "resend": "^6.14.0",
  "web-push": "^3.6.7"
}
```

All three are server-side only (used by Netlify Functions). AI features use the Groq REST API (OpenAI-compatible) directly via `fetch` — no SDK needed. The client has zero npm dependencies — Chart.js and Leaflet.js load from CDN.

### Serverless Over Server

Netlify Functions eliminate the need for a persistent server. Benefits:
- Zero ops burden (no server patching, no scaling)
- Automatic HTTPS, CDN, and edge deployment

---

## Detailed Breakdown

| Section | Page |
|---------|------|
| Frontend (HTML/CSS/JS, Chart.js, Leaflet) | [Frontend Stack](frontend.md) |
| Backend (Netlify Functions, Blobs, Resend) | [Backend Stack](backend.md) |
| AI Layer (OpenAI gpt-oss-120b via Groq) | [AI Stack](ai-layer.md) |
| Infrastructure (Netlify, GitHub, DNS) | [Infrastructure](infrastructure.md) |
| Development Tools (Claude Code, Git hooks) | [Dev Tooling](dev-tooling.md) |
