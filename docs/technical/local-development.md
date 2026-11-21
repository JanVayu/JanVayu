# Local Development

## Prerequisites

- [Node.js](https://nodejs.org/) 22.12 or higher
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (`npm install -g netlify-cli`)
- A [Resend](https://resend.com) account — only needed if you are working on email digest features
- A [Groq Console](https://console.groq.com) account — only needed for AI features

---

## Setup

```bash
# 1. Clone the repository
git clone https://github.com/JanVayu/JanVayu.git
cd JanVayu

# 2. Install dependencies
npm ci

# 3. Copy the environment variables template
cp .env.example .env

# 4. Fill in your environment variables (see below)
# Edit .env with your values

# 5. Start the local development server
netlify dev
```

The site will be available at `http://localhost:8888`. Netlify Dev serves the serverless functions locally.

---

## Environment Variables

Create a `.env` file in the project root (it is gitignored and will never be committed):

```bash
# Required for email digest
RESEND_API_KEY=your_resend_api_key
RESEND_FROM=digest@yourdomain.com

# Required for Netlify Blobs (local dev)
BLOB_TOKEN=your_netlify_personal_access_token
NETLIFY_SITE_ID=your_netlify_site_id

# Required for AI features
GROQ_API_KEY=your_groq_api_key

# Required for live readings (free at aqicn.org/data-platform/token)
WAQI_TOKEN=your_waqi_token
```

`.env.example` does not list `WAQI_TOKEN` yet, so add the line yourself.

See [Environment Variables](environment-variables.md) for full details on how to obtain each value.

---

## Running Without Netlify Functions

If you only need to work on the layout, the panels or the static pages, you don't need any environment variables or Netlify setup:

```bash
# Serve the HTML file directly
npx serve .
# or
python3 -m http.server 8000
```

Live readings do not load this way. Since 27 October 2026 the pages reach WAQI through the `waqi-proxy` function, so a plain static server has no live AQI. The home page falls back to CPCB's daily bulletin, which is a static file (`data/cpcb-latest.json`). Anything else that depends on a function (rankings, the modelled estimate, fire tracker, social feeds, email digest, Ask JanVayu) will not work without `netlify dev`.

---

## Testing Netlify Functions Locally

```bash
# Invoke a specific function with a test payload
netlify functions:invoke air-query --payload '{"city":"delhi","question":"Is it safe to go for a run?"}'

# Invoke the anomaly check
netlify functions:invoke anomaly-check

# Invoke the feed status check
netlify functions:invoke feed-status
```

---

## Tests and checks

```bash
npm test                         # unit tests in test/ (node --test)
bash scripts/run-ci-checks.sh    # every gating check CI runs
```

`scripts/run-ci-checks.sh` is generated from the workflows by `scripts/list-ci-checks.py`. Most of it finishes in seconds. The contrast gate at the end drives a browser and takes about two minutes.

---

## Git Hooks

The repo includes Git hooks in `.githooks/`:

- **pre-commit**: blocks staged `.env` and credential files, warns about `console.log` statements, detects merge conflict markers, and warns on files larger than 500 KB (it does not run a linter)
- **commit-msg**: enforces the commit message prefix convention

Hooks are enabled automatically via the `npm run prepare` script (which runs `git config core.hooksPath .githooks`).

### Commit Message Format

```
Prefix: short description

Allowed prefixes: Add, Fix, Update, Translate, Docs, Refactor, Test, CI, Chore, Merge

Examples:
Add: PM10 toggle to city cards
Fix: handle missing city in digest template
Docs: update setup instructions
```

Conventional-commit style messages such as `feat(dashboard): ...` are rejected by the hook.

---

## Branch Strategy

| Branch | Purpose |
|--------|--------|
| `main` | Production — auto-deploys to [www.janvayu.in](https://www.janvayu.in) |
| `feature/*` | New features or content additions |
| `fix/*` | Bug fixes |
| `docs/*` | Documentation changes |

Always branch from `main` and open a pull request to merge back. Never push directly to `main`.
