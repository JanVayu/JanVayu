# Deployment

JanVayu is deployed on **Netlify** with automatic deploys triggered by every push to the `main` branch on GitHub.

---

## How Deployment Works

1. Push to `main` on GitHub
2. Netlify detects the new commit via webhook
3. Netlify runs the build command (`node scripts/bump-version.mjs`, a version-stamp script; there is no bundler) and deploys, with the repo root as the publish directory
4. The site goes live at [www.janvayu.in](https://www.janvayu.in)

The Netlify build status badge in the README reflects the current deploy state.

---

## Netlify Configuration (`netlify.toml`)

```toml
# Abridged: the real netlify.toml has many more headers and redirect rules
[build]
  command = "node scripts/bump-version.mjs"
  publish = "."         # Serve from repo root
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "22"

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

# ...specific rules for /docs, /blog, /embed, /api, /ask, /status etc. come before the fallback
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

The custom domain `janvayu.in` is configured in Netlify DNS. The `CNAME` file in the repo root contains `www.janvayu.in`; it has no effect on Netlify, and whether it dates from an earlier GitHub Pages setup is not recorded in the repository.

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
