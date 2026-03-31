# Infrastructure

JanVayu runs entirely on Netlify's platform with GitHub as the source of truth. There are no traditional servers, databases, or container orchestration.

---

## Netlify

### Hosting

- **CDN:** Netlify's global edge network
- **Deploy trigger:** Push to `main` on GitHub
- **Build command:** None (no build step)
- **Publish directory:** `.` (repository root)
- **Functions directory:** `netlify/functions/`

### Configuration (`netlify.toml`)

```toml
[build]
  publish = "."
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"
```

### Security Headers

Applied to all responses:

| Header | Value | Purpose |
|--------|-------|--------|
| `X-Frame-Options` | `DENY` | Prevents clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits referrer data |

### Redirects

- `www.janvayu.in` → `janvayu.in` (canonical URL)
- All routes → `/index.html` (SPA fallback)
- `/robots.txt` and `/sitemap.xml` bypass SPA fallback

---

## GitHub

### Repository

- **Repo:** [github.com/JanVayu/JanVayu](https://github.com/JanVayu/JanVayu)
- **Default branch:** `main`
- **Branch protection:** Auto-deploy on merge

### CI/CD

- **GitHub Actions** workflow (`ci.yml`): Lychee link checker on push/PR
- **Dependabot** (`dependabot.yml`): Monthly updates for GitHub Actions

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
- **Registrar:** Managed via Netlify DNS
- **SSL:** Automatic Let's Encrypt via Netlify
- **CNAME file:** Points custom domain to Netlify

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
| WAQI API | Free (public token) | $0 |
| Groq API | Free tier | $0 |
| Resend | Free tier | $0 |
| Domain (janvayu.in) | Annual renewal | ~$10/year |

**Total: ~$10/year** for a platform serving 40+ cities with real-time data, AI features, and email digests.
