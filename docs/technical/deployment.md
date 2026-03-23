# Deployment

JanVayu is deployed on **Netlify** with automatic deploys triggered by every push to the `main` branch on GitHub.

---

## How Deployment Works

1. Push to `main` on GitHub
2. Netlify detects the new commit via webhook
3. Netlify builds and deploys (no build step — the repo root is the publish directory)
4. The site is live at [www.janvayu.in](https://www.janvayu.in) within 30–90 seconds

The Netlify build status badge in the README reflects the current deploy state.

---

## Netlify Configuration (`netlify.toml`)

```toml
[build]
  publish = "."         # Serve from repo root
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[redirects]]
  from = "https://janvayu.in/*"
  to = "https://www.janvayu.in/:splat"
  status = 301
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Key points:
- The SPA fallback (`/* → /index.html`) ensures deep links work correctly
- Non-www is redirected to www (canonical domain)
- Security headers are applied globally

---

## Domain & DNS

The custom domain `janvayu.in` is configured in Netlify DNS. The `CNAME` file in the repo root sets the GitHub Pages custom domain (legacy, from before Netlify migration).

---

## Preview Deploys

Pull requests automatically generate a preview URL (e.g., `https://deploy-preview-42--janvayu.netlify.app`). This allows reviewers to test changes before merging to `main`.

---

## Environment Variables in Production

Set all required variables in the Netlify dashboard:

1. Go to [app.netlify.com](https://app.netlify.com)
2. Open the JanVayu site
3. Go to **Site Configuration → Environment Variables**
4. Add each variable (see [Environment Variables](environment-variables.md))

Production environment variables are **never** stored in the repository.

---

## Rollback

To roll back to a previous deploy:

1. Go to the Netlify dashboard → Deploys
2. Find the last known-good deploy
3. Click "Publish deploy"

Netlify keeps a full deploy history, so rollbacks are instant.

---

## Monitoring

- **Deploy status:** Netlify dashboard → Deploys
- **Function logs:** Netlify dashboard → Functions → Logs
- **Feed freshness:** `GET /.netlify/functions/feed-status` — returns last update timestamps for all feeds
- **Scheduled function logs:** Netlify dashboard → Functions → Scheduled Functions
