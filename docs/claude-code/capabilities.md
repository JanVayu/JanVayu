# Claude Code Setup — Full Capabilities Reference

This page is a comprehensive, detailed reference of everything the JanVayu Claude Code setup can do — covering development tools, enforcement mechanisms, AI features, CI/CD automation, deployment infrastructure, and documentation workflows.

---

## 1. Core Development Capabilities

### File Operations
- **Read any file** in the repository — `index.html`, Netlify Functions, configs, documentation
- **Write new files** — create Netlify Functions, documentation pages, config files
- **Edit existing files** — targeted inline edits without rewriting unrelated code
- **Search by filename pattern** — glob matching (e.g., `**/*.mjs`, `docs/**/*.md`)
- **Search by content** — regex-powered full-text search across the codebase

### Shell & Terminal Access
- Run `npm install` to manage dependencies
- Run `netlify dev` for local development server
- Execute any non-destructive shell command
- Access to `git`, `gh` (GitHub CLI), `ls`, `mkdir`
- **Blocked by convention**: `rm -rf`, `git push --force`, `git reset --hard`

### Multi-File Coordination
A single Claude Code session can touch all of these in one pass:
- `index.html` (HTML structure, inline CSS, inline JS)
- Netlify Functions (`netlify/functions/*.mjs` or `*.js`)
- Configuration files (`netlify.toml`, `package.json`, `.editorconfig`)
- Documentation (`docs/**/*.md`, `CHANGELOG.md`, `README.md`)
- Git hooks (`.githooks/pre-commit`, `.githooks/commit-msg`)
- GitHub workflows (`.github/workflows/*.yml`)

---

## 2. Git Workflow Capabilities

### Branching & Commits
- Create feature branches (e.g., `claude/feature-name`)
- Stage specific files (avoids accidental inclusion of `.env` or secrets)
- Commit with messages following enforced prefix convention:
  - `Add:` — new feature or file
  - `Fix:` — bug fix
  - `Update:` — improvement to existing feature
  - `Translate:` — translation work
  - `Docs:` — documentation changes
  - `Refactor:` — code restructuring (no behaviour change)
  - `Test:` — test additions
  - `CI:` — CI/CD pipeline changes
  - `Chore:` — maintenance tasks
- Subject lines kept under 72 characters (enforced by hook)

### Pull Request Management
- Create PRs with structured title, summary, and test plan
- Manage multi-PR workflows (e.g., backend first, then frontend, then docs)
- Review PR diffs and suggest changes
- Add comments and respond to review feedback

### Git Hook Enforcement
The setup includes two custom git hooks that run automatically:

**Pre-commit hook** (`.githooks/pre-commit`):
| Check | Action |
|-------|--------|
| `.env`, `.env.local`, `.env.production` | **Block commit** |
| `credentials.json`, `*.pem`, `*.key` | **Block commit** |
| `debugger` statements, `breakpoint()` | **Block commit** |
| Merge conflict markers (`<<<<<<<`, `>>>>>>>`) | **Block commit** |
| `console.log`, `console.debug`, `console.warn` | **Warn** (bypass with `// keep`) |
| Files > 500 KB | **Warn** |

**Commit message hook** (`.githooks/commit-msg`):
| Check | Action |
|-------|--------|
| Missing required prefix | **Block commit** |
| Subject line > 72 characters | **Warn** |
| Merge/revert/fixup commits | **Skip enforcement** |

---

## 3. AI-Powered Features (Llama 3.3 70B via Groq)

The setup includes four production AI features, each implemented as a Netlify Function with a structured skill file:

### 3.1 Air Quality Assistant (`air-query.mjs`)
- **Input**: City name + natural language question
- **Output**: Grounded answer in < 150 words, citing actual AQI numbers
- **Languages**: English and Hindi
- **Key constraint**: Must cite real data — no generic advice
- **Fallback**: Returns raw AQI data if Groq is rate-limited
- **Skill file**: `docs/skills/air-quality-assistant.md`

### 3.2 Health Advisory (`health-advisory.mjs`)
- **Input**: City + age + health conditions + hours spent outdoors
- **Output**: Colour-coded risk level + concrete recommendations (3-4 sentences)
- **Key constraint**: Direct advice, no hedging — "Stay indoors" not "Consider staying indoors"
- **Pre-AI step**: JavaScript function calculates risk level for instant UI colour-coding before AI response arrives
- **Fallback**: Risk level still displays even if AI explanation fails
- **Skill file**: `docs/skills/health-advisory.md`

### 3.3 Accountability Brief (`accountability-brief.mjs`)
- **Input**: City + ward/area + time period
- **Output**: Structured 6-section brief (area, current PM2.5, status, data analysis, likely sources, actionable steps, data caveat)
- **Max output**: 400 tokens
- **Audience**: Ward councillors, local journalists, RWAs (Resident Welfare Associations)
- **Key feature**: Includes specific local regulatory mechanisms (NCAP targets, GRAP actions, municipal powers)
- **Fallback**: Returns raw data without AI analysis
- **Skill file**: `docs/skills/accountability-brief.md`

### 3.4 Anomaly Detection (`anomaly-check.mjs`)
- **Input**: Automatic — monitors Delhi, Mumbai, Kolkata, Chennai, Bengaluru
- **Threshold**: PM2.5 > 2× seasonal baseline = anomaly
- **Output**: One-sentence explanation per spike
- **Seasonal baselines**: Hardcoded from CREA/IQAir data (not computed dynamically)
- **Fallback**: Returns anomaly flag without AI explanation
- **Skill file**: `docs/skills/anomaly-explainer.md`

### Shared AI Architecture
All four features share:
- Server-side execution only (no API keys exposed to client)
- CORS preflight handling (OPTIONS → 204)
- JSON response with appropriate status codes
- try/catch on every external call
- Graceful degradation — every AI feature has a non-AI fallback

---

## 4. Netlify Functions (13 Serverless Functions)

### Scheduled Functions
| Function | Schedule | Purpose |
|----------|----------|---------|
| `scheduled-fetch.mjs` | Every 4 hours | Pre-fetches all social media and news feeds into Netlify Blobs cache |
| `daily-digest.mjs` | 8:00 AM IST daily | Sends AQI email digest to subscribers via Resend API |

### On-Demand Functions (AI)
| Function | Method | Purpose |
|----------|--------|---------|
| `air-query.mjs` | POST | Natural language AQI Q&A |
| `health-advisory.mjs` | POST | Personalised health advice |
| `accountability-brief.mjs` | POST | Governance accountability briefs |
| `anomaly-check.mjs` | GET | PM2.5 spike detection |

### On-Demand Functions (Data)
| Function | Method | Purpose |
|----------|--------|---------|
| `reddit-feed.js` | GET | Cached Reddit posts about air quality |
| `twitter-feed.js` | GET | Cached Twitter/X posts |
| `instagram-feed.js` | GET | Cached Instagram posts |
| `news-proxy.js` | GET | Cached news articles |
| `subscribe.js` | POST | Email subscription management |
| `feed-status.js` | GET | Feed freshness health check |

### Shared Utility
| Function | Purpose |
|----------|---------|
| `blob-store.js` | Netlify Blobs store initialisation (imported by other functions) |

### Standard Function Pattern
Every function follows this template:
1. CORS preflight handling (`OPTIONS` → `204`)
2. Core logic wrapped in `try/catch`
3. JSON response body with CORS headers
4. Graceful fallback on error (never returns `500` with empty body)

---

## 5. CI/CD & Automation

### GitHub Actions Workflows

**Link Checking** (`ci.yml`):
- **Triggers**: Push to `main`, PRs to `main`
- **Tool**: Lychee link checker
- **Excludes**: localhost, social media platforms, rate-limited domains
- **Config**: 30-second timeout, 2 retries per link

**Translation Sync** (`translations.yml`):
- **Triggers**: Changes to `docs/`, `docs-hi/`, `docs-bn/`, `docs-mr/`, `docs-ta/`
- **Checks**: Translation file coverage across 4 languages, SUMMARY.md parity, stale translation detection
- **Reports**: Coverage percentage per language

**ImpactMojo Translation Sync** (`impactmojo-translations.yml`):
- Same logic as above for `docs-impactmojo/` directories

**Dependabot** (`dependabot.yml`):
- **Scope**: GitHub Actions dependencies only
- **Frequency**: Monthly
- **Max open PRs**: 2

### Netlify Auto-Deploy
- Every push to `main` triggers an automatic deploy
- Build publishes from repo root (`.`)
- Functions directory: `netlify/functions/`
- Node.js 18 runtime

---

## 6. Deployment & Infrastructure

### Hosting — Netlify CDN
- Automatic HTTPS with Let's Encrypt
- Global CDN distribution
- Non-www → www redirect (canonical domain)
- SPA fallback: all routes → `/index.html`
- Special routes for `/robots.txt` and `/sitemap.xml`

### Security Headers
| Header | Value | Purpose |
|--------|-------|---------|
| `X-Frame-Options` | `DENY` | Prevents clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controls referrer information |

### Caching — Netlify Blobs
- Strong consistency model
- Used by scheduled functions to pre-cache social feeds and news
- On-demand functions read from cache first, fetch live as fallback
- Accessed via `@netlify/blobs` package

### Email — Resend API
- Transactional email delivery for daily digest and subscription confirmations
- Server-side only (via Netlify Functions)

### Environment Variables Required
| Variable | Purpose | Where Used |
|----------|---------|------------|
| `GROQ_API_KEY` | Llama 3.3 70B AI features | `air-query.mjs`, `health-advisory.mjs`, `accountability-brief.mjs`, `anomaly-check.mjs` |
| `RESEND_API_KEY` | Email delivery | `daily-digest.mjs`, `subscribe.js` |
| `RESEND_FROM` | Sender email address | `daily-digest.mjs` |
| `BLOB_TOKEN` | Netlify Blobs access | All caching functions |
| `NETLIFY_SITE_ID` | Site identifier | Blobs store initialisation |
| `WAQI_TOKEN` | Air quality data (public, safe to expose) | Client-side `index.html` |

---

## 7. MCP Server Integrations

Claude Code supports Model Context Protocol (MCP) servers that extend its tool access beyond the local filesystem:

| MCP Server | Tools Available | Use Case for JanVayu |
|------------|----------------|---------------------|
| **GitHub** | PR management, issue tracking, code search, CI checks | Active — manages PRs, reviews, issue comments |
| **Notion** | Create pages, query databases, search, update | Project planning, task tracking, meeting notes |
| **Gmail** | Search messages, read threads, create drafts | Referencing email discussions about features |
| **Figma** | Get design context, screenshots, metadata | Translating design mockups into HTML/CSS |
| **Google Calendar** | List events, create events, find free time | Planning development sessions and releases |
| **Excalidraw** | Create views, save checkpoints | Architecture diagrams and data flow visualisation |

---

## 8. Documentation Capabilities

### Multilingual Documentation (5 Languages)
| Language | Directory | Sync Target |
|----------|-----------|-------------|
| English | `docs/` | GitBook (primary space) |
| Hindi | `docs-hi/` | GitBook (Hindi space) |
| Bengali | `docs-bn/` | GitBook (Bengali space) |
| Marathi | `docs-mr/` | GitBook (Marathi space) |
| Tamil | `docs-ta/` | GitBook (Tamil space) |

### Documentation Sections (54 files)
- **Claude Code guides** — overview, setup, workflow, sharing, capabilities
- **Skills & AI** — air quality assistant, health advisory, accountability brief, anomaly explainer, coding practices, visual design, automation
- **Tech Stack** — overview, frontend, backend, AI layer, infrastructure, dev tooling
- **Data Sources** — overview, WAQI, health data, policy data
- **Contributing** — contribution guidelines
- **Wiki** — translation guide, role-based landing page, adding a new panel

### GitBook Integration
- Bi-directional sync via `.gitbook.yaml` and GitHub integration
- Auto-updates on push to `main`
- Installed integrations: Formspree (feedback forms), Arcade (interactive demos), PlantUML (architecture diagrams), Plausible (privacy-friendly analytics), GitHub Files (live code embeds)
- AI-powered search for visitors
- Custom domain support (`docs.janvayu.in`)

---

## 9. Code Quality & Conventions

### Architecture Constraints
- **Single HTML file** (`index.html`) — all CSS and JS inline
- **No frameworks** — no React, Vue, Angular, Svelte
- **No build step** — no Webpack, Vite, Rollup
- **No TypeScript** — vanilla JavaScript only
- **ES2020 maximum** — no bleeding-edge syntax
- **No client-side npm packages** — CDN-only for Chart.js and Leaflet.js

### Formatting Standards (`.editorconfig`)
- 2-space indentation for HTML, CSS, JS, JSON
- UTF-8 encoding
- LF line endings
- Trailing newline at end of file

### Dependencies (Minimal)
Only 3 npm packages in `package.json`:
- `@netlify/blobs` — server-side caching
- `resend` — email delivery
- (dev/transitive dependencies as needed)

---

## 10. What Claude Code Built vs. What Needs Humans

### Claude Code Built
- All 13 Netlify Functions (serverless backend)
- The entire 12,633-line `index.html` single-page application
- All AI skill prompts and prompt engineering
- Complete multilingual GitBook documentation (54 files, 5 languages)
- Git hooks for commit enforcement
- GitHub Actions workflows
- CHANGELOG entries and version management
- Code review and targeted refactoring
- Bug diagnosis and minimal fixes
- PR creation and management

### Requires Human Intervention
| Task | Reason |
|------|--------|
| Netlify dashboard configuration | Environment variables, domain setup, build settings are UI-only |
| API key generation | Groq Console, Resend, WAQI — require account creation |
| Design decisions | Feature priority, data source selection, UX direction |
| Content review | Data accuracy, policy correctness, legal compliance |
| Deployment verification | Checking live site behaviour after deploy |
| GitBook account setup | Creating spaces, connecting repo, custom domain DNS |
| DNS configuration | Domain registrar changes for custom domains |

---

## 11. Cost Profile

| Component | Cost |
|-----------|------|
| Netlify hosting + functions | Free tier |
| Groq API (Llama 3.3 70B) | Free tier |
| Resend email | Free tier (100 emails/day) |
| WAQI API | Free tier |
| GitHub Actions | Free tier |
| GitBook | Ultimate plan (for multilingual + integrations) |
| Domain (`janvayu.in`) | ~$10/year |
| **Total** | **~$10/year + GitBook plan** |

---

## Summary

This Claude Code setup provides a complete development environment for a production web platform with:
- **13 serverless functions** (4 AI-powered, 5 data feeds, 2 scheduled, 1 email, 1 health check)
- **Automated code quality** via git hooks (secret blocking, commit conventions, debug detection)
- **CI/CD pipelines** for link checking, translation coverage, and dependency updates
- **Multilingual documentation** auto-synced to GitBook in 5 languages
- **Zero-framework architecture** enforced by convention and documentation
- **MCP integrations** for GitHub, Notion, Gmail, Figma, Calendar, and Excalidraw
- **Minimal cost** — nearly everything runs on free tiers
