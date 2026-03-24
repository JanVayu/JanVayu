# Deployment Guide

ImpactMojo deploys as a static site on Netlify with Supabase as the backend. No build step is required.

---

## Main Site Deployment

### Automatic (via Git)

1. Push to `main` branch on GitHub
2. Netlify detects the push and deploys automatically
3. No build command needed — the site is static HTML/CSS/JS
4. Site is live at [www.impactmojo.in](https://www.impactmojo.in) within 30–90 seconds

### Manual

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy from project root
netlify deploy --prod
```

---

## Domain Configuration

The custom domain `impactmojo.in` is configured in Netlify DNS.

| Record | Type | Value |
|--------|------|-------|
| `@` | A | Netlify load balancer |
| `www` | CNAME | Netlify site URL |
| `docs` | CNAME | `hosting.gitbook.io` |

Redirect rule in `netlify.toml`:
```toml
[[redirects]]
  from = "https://impactmojo.in/*"
  to = "https://www.impactmojo.in/:splat"
  status = 301
  force = true
```

---

## Premium Tool Sites

Each premium tool is a separate Netlify site:

| Tool | Netlify Site | Auth Gate |
|------|-------------|-----------|
| RQ Builder Pro | Separate deploy | `auth-gate.ts` Edge Function |
| Qual Insights Lab | Separate deploy | `auth-gate.ts` Edge Function |
| Statistical Code Converter | Separate deploy | `auth-gate.ts` Edge Function |
| VaniScribe | Separate deploy | `auth-gate.ts` Edge Function |
| DevData Practice | Separate deploy | `auth-gate.ts` Edge Function |
| Viz Cookbook | Separate deploy | `auth-gate.ts` Edge Function |
| DevEcon Toolkit | Separate deploy | `auth-gate.ts` Edge Function |

Each tool site requires the `JWT_SECRET` environment variable for token validation.

---

## Supabase Configuration

### Required Tables

Ensure all 21+ tables are created via Supabase migrations. Key tables:
- `profiles` — user accounts and subscription tiers
- `organizations` — team accounts
- `course_progress`, `bookmarks`, `certificates`, `payments`

### Row-Level Security

All tables must have RLS enabled. Users can only read/write their own rows.

### Edge Functions

The `mint-resource-token` function must be deployed to Supabase:
```
supabase functions deploy mint-resource-token
```

---

## Environment Variables

See [Environment Variables](environment-variables.md) for the full list.

---

## Cost Structure

| Service | Plan | Estimated Cost |
|---------|------|---------------|
| Netlify (main site) | Free tier | $0/month |
| Netlify (each tool site) | Free tier | $0/month |
| Supabase | Free tier (up to 500MB, 50K MAU) | $0/month |
| Domain (impactmojo.in) | Annual renewal | ~₹800/year |
| Resend (email notifications) | Free tier (100 emails/day) | $0/month |

---

## Interactive Demo

> **Upcoming** — An interactive deployment walkthrough will be embedded here, showing the push-to-deploy flow and environment variable configuration.

<!-- Replace this section with an Arcade embed once recorded -->
