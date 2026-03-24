# Tech Stack Overview

JanVayu is built on a deliberately minimal stack — zero frontend frameworks, three npm dependencies, and a serverless backend. This page maps every technology used and why it was chosen.

---

## Stack at a Glance

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Vanilla HTML/CSS/JS | Single-page application (no build step) |
| **Charts** | Chart.js (CDN) | AQI trend visualisations |
| **Maps** | Leaflet.js + OpenStreetMap (CDN) | Interactive station maps |
| **Backend** | Netlify Functions (Node.js 18) | Serverless API endpoints |
| **Cache** | Netlify Blobs | Persistent JSON cache (strong consistency) |
| **Email** | Resend API | Daily AQI digest delivery |
| **AI** | Llama 3.3 70B via Groq | NL queries, health advice, anomaly detection |
| **Hosting** | Netlify CDN | Auto-deploy from GitHub `main` |
| **CI** | GitHub Actions | Link checking, translation coverage, Dependabot |
| **Domain** | Netlify DNS | janvayu.in custom domain |
| **Docs** | GitBook (5 languages) | Auto-synced from `docs/` and `docs-{lang}/` directories |
| **Docs Integrations** | Arcade, PlantUML, Formspree, Plausible | Interactive demos, diagrams, forms, analytics |
| **Development** | Claude Code (Anthropic) | AI-assisted development workflow |

---

## Why This Stack?

### Zero-Framework Frontend

JanVayu's audience includes people on 2G connections and low-end Android devices across India. A framework like React or Vue would add 40-100 KB of JavaScript before a single feature loads. Instead:

- The entire app is one `index.html` file (inline CSS + JS)
- No transpilation, no bundling, no tree-shaking needed
- Deploy artefact = the repo itself
- Any contributor with basic HTML/JS skills can contribute

### Only 3 npm Dependencies

```json
{
  "@netlify/blobs": "^8.1.0",
  "resend": "^6.9.3"
}
```

Both are server-side only (used by Netlify Functions). AI features use the Groq REST API (OpenAI-compatible) directly via `fetch` — no SDK needed. The client has zero npm dependencies — Chart.js and Leaflet.js load from CDN.

### Serverless Over Server

Netlify Functions eliminate the need for a persistent server. Benefits:
- Zero ops burden (no server patching, no scaling)
- Free tier covers JanVayu's traffic
- Automatic HTTPS, CDN, and edge deployment
- Functions cold-start in < 500ms

---

## Detailed Breakdown

| Section | Page |
|---------|------|
| Frontend (HTML/CSS/JS, Chart.js, Leaflet) | [Frontend Stack](frontend.md) |
| Backend (Netlify Functions, Blobs, Resend) | [Backend Stack](backend.md) |
| AI Layer (Llama 3.3 70B via Groq) | [AI Stack](ai-layer.md) |
| Infrastructure (Netlify, GitHub, DNS) | [Infrastructure](infrastructure.md) |
| Development Tools (Claude Code, Git hooks) | [Dev Tooling](dev-tooling.md) |
