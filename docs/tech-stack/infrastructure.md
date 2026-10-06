# Infrastructure

JanVayu runs entirely on Netlify's platform with GitHub as the source of truth. There are no traditional servers, databases, or container orchestration.

---

## Netlify

### Hosting

- **CDN:** Netlify's global edge network
- **Deploy trigger:** Push to `main` on GitHub
- **Build command:** `node scripts/bump-version.mjs` (version stamp only; no bundler)
- **Publish directory:** `.` (repository root)
- **Functions directory:** `netlify/functions/`

### Configuration (`netlify.toml`)

```toml
[build]
  command = "node scripts/bump-version.mjs"
  publish = "."
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "22"
```

### Security Headers

Applied to all paths (`/*`), with two exceptions: `/embed/*` sets `X-Frame-Options = "ALLOWALL"` so widgets can be framed from any origin, and `/walkthrough/*` sets `SAMEORIGIN`:

| Header | Value | Purpose |
|--------|-------|--------|
| `X-Frame-Options` | `DENY` | Prevents clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits referrer data |

### Redirects

- `janvayu.in/*` → `www.janvayu.in/:splat` (301; the canonical URL is `www.janvayu.in`)
- All other routes → `/index.html` (SPA fallback), after the specific rules in `netlify.toml` for `/docs`, `/blog`, `/embed`, `/api`, `/ask`, `/status` and the per-pollutant pages
- `/robots.txt` and `/sitemap.xml` bypass SPA fallback

---

## GitHub

### Repository

- **Repo:** [github.com/JanVayu/JanVayu](https://github.com/JanVayu/JanVayu)
- **Default branch:** `main`
- **Deploys:** Auto-deploy on push to `main`

### CI/CD

- **GitHub Actions** (`.github/workflows/`, 14 workflows): `ci.yml` (guards for `index.html`, site figures and Netlify functions, plus the Lychee link checker), `link-audit`, `accessibility`, `lighthouse`, `codeql`, `translations`, `quality` and others
- **Dependabot** (`dependabot.yml`): Monthly updates for GitHub Actions and npm, with minor and patch bumps grouped

### Git Hooks (`.githooks/`)

| Hook | Purpose |
|------|--------|
| `pre-commit` | Blocks `.env` files, checks for `console.log` debug statements, detects merge conflict markers, warns on files > 500 KB |
| `commit-msg` | Enforces commit message prefixes: `Add`, `Fix`, `Update`, `Translate`, `Docs`, `Refactor`, `Test`, `CI`, `Chore`, `Merge` |

### Templates

- **Issue templates** (bug report, feature request)
- **PR template** with checklist
- **Commit message template** (`.gitmessage`)

---

## Domain & DNS

- **Domain:** `janvayu.in`
- **Registrar and DNS host:** not documented here (they can be different services)
- **HTTPS:** served by Netlify
- **CNAME file:** the repo's `CNAME` contains `www.janvayu.in`; a `CNAME` file has no effect on Netlify, which takes the custom domain from its own dashboard

---

## SEO

- `robots.txt` — allows all crawlers
- `sitemap.xml` — site map for search engines
- `og-image.png` — Open Graph social preview image
- Meta tags in `index.html` for title, description, and OG data

---

## Cost

JanVayu runs at **zero cost**:

| Service | Tier | Monthly cost |
|---------|------|-------------|
| Netlify (hosting + functions) | Free | $0 |
| GitHub | Free | $0 |
| WAQI API | Free (token issued by WAQI) | $0 |
| Groq API | Free tier | $0 |
| Resend | Free plan (daily limit of 100 emails) | $0 |
| Domain (janvayu.in) | Annual renewal | price not recorded here |

**Total:** only the domain renewal, for a platform serving 160 cities (157 Indian, plus three comparison cities abroad) with real-time data, AI features, and email digests.
