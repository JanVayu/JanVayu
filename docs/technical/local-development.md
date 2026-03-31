# Local Development

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or higher
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
npm install

# 3. Copy the environment variables template
cp .env.example .env

# 4. Fill in your environment variables (see below)
# Edit .env with your values

# 5. Start the local development server
netlify dev
```

The site will be available at `http://localhost:8888`. Netlify Dev emulates the serverless functions locally, including scheduled functions and the Blobs store.

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
```

See [Environment Variables](environment-variables.md) for full details on how to obtain each value.

---

## Running Without Netlify Functions

If you only need to work on the front-end (AQI dashboard, map, charts), you don't need any environment variables or Netlify setup:

```bash
# Serve the HTML file directly
npx serve .
# or
python3 -m http.server 8000
```

The AQI dashboard, map, and all client-side features will work because the WAQI API is called directly from the browser. Social feeds and email digest will not work without the functions.

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

## Git Hooks

The repo includes Git hooks in `.githooks/`:

- **pre-commit** — runs basic lint checks before each commit
- **commit-msg** — enforces the conventional commit message format

Hooks are enabled automatically via the `npm run prepare` script (which runs `git config core.hooksPath .githooks`).

### Commit Message Format

```
type(scope): short description

Examples:
feat(dashboard): add PM10 toggle to city cards
fix(email): handle missing city in digest template
docs(readme): update setup instructions
```

---

## Branch Strategy

| Branch | Purpose |
|--------|--------|
| `main` | Production — auto-deploys to [www.janvayu.in](https://www.janvayu.in) |
| `feature/*` | New features or content additions |
| `fix/*` | Bug fixes |
| `docs/*` | Documentation changes |

Always branch from `main` and open a pull request to merge back. Never push directly to `main`.
