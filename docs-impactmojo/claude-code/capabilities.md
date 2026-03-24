# Claude Code Setup — Full Capabilities Reference

This page is a comprehensive reference of everything the ImpactMojo Claude Code setup can do — covering development tools, enforcement mechanisms, deployment infrastructure, premium tool architecture, and documentation workflows.

---

## 1. Core Development Capabilities

### File Operations
- **Read any file** in the repository — HTML pages, client scripts, Edge Functions, configs, documentation
- **Write new files** — create Edge Functions, documentation pages, config files, new tool sites
- **Edit existing files** — targeted inline edits without rewriting unrelated code
- **Search by filename pattern** — glob matching (e.g., `**/*.js`, `docs-impactmojo/**/*.md`)
- **Search by content** — regex-powered full-text search across the codebase

### Shell & Terminal Access
- Run `npm install` to manage dependencies
- Run `netlify dev` for local development server
- Execute any non-destructive shell command
- Access to `git`, `gh` (GitHub CLI), `ls`, `mkdir`
- **Blocked by convention**: `rm -rf`, `git push --force`, `git reset --hard`

### Multi-File Coordination
A single Claude Code session can touch all of these in one pass:
- Static HTML pages and client-side scripts (`auth.js`, `router.js`, `premium.js`, `resource-launch.js`)
- Netlify Edge Functions (`mint-resource-token`, `auth-gate`)
- Supabase configuration (migrations, RLS policies, Edge Functions)
- Configuration files (`netlify.toml`, `package.json`)
- Documentation (`docs-impactmojo/**/*.md`)

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
- Subscribe to PR activity (CI results, review comments) and respond in real time

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

## 3. ImpactMojo Platform Architecture

### Main Site (impactmojo.in)
- **Hosting**: Netlify (static deployment)
- **Frontend**: Vanilla HTML/CSS/JS — no React, Vue, Angular, or build tools
- **Key scripts**: `auth.js`, `router.js`, `premium.js`, `resource-launch.js`
- **No server-side env variables** needed on the main site

### Authentication & Token Service
- **Provider**: Supabase Auth (email + password)
- **Token generation**: `mint-resource-token` Netlify Edge Function
- **Token type**: JWT (HMAC-SHA256 signed)
- **Token lifetime**: 5 minutes
- **Session**: 24-hour `resource_session` cookie set by tool-side `auth-gate`

### Database (Supabase PostgreSQL — 21+ Tables)
| Table | Purpose |
|-------|---------|
| `profiles` | User accounts with subscription tier and status |
| `organizations` | Team accounts with admin and seat limits |
| `course_progress` | Module completion tracking |
| `bookmarks` | Saved resources per user |
| `certificates` | Verifiable completion records |
| `payments` | Payment history and subscription management |
| `cohorts` | Scheduled group learning sessions |
| `notifications` | In-app and email alert queue |
| `user_preferences` | Theme, language, notification settings |

All tables use **Row-Level Security** — users can only view and modify their own records.

### Premium Tool Sites (7 Separate Netlify Deployments)
| Tool | Description | Min Tier |
|------|-------------|----------|
| **RQ Builder Pro** | Research question design workbench | Practitioner |
| **Qual Insights Lab** | AI-assisted qualitative interview analysis | Professional |
| **Statistical Code Converter** | Converts between R, Stata, SPSS, Python | Professional |
| **VaniScribe** | AI transcription in 10+ South Asian languages | Professional |
| **DevData Practice** | Practice datasets and visualisation recipes | Professional |
| **Viz Cookbook** | Data visualisation template library | Professional |
| **DevEcon Toolkit** | Interactive development economics analysis | Professional |

### Premium Access Flow
```
1. User clicks "Launch Tool" on impactmojo.in
2. Client calls mint-resource-token (POST) with Supabase auth token
3. Edge Function checks subscription tier against resource requirements
4. If authorised: returns JWT token + redirect URL
5. User is redirected to tool site with ?token= parameter
6. Tool's auth-gate Edge Function validates JWT signature
7. If valid: sets 24-hour resource_session cookie
8. User accesses the tool for 24 hours without re-authentication
```

---

## 4. CI/CD & Automation

### GitHub Actions Workflows

**Translation Sync** (`impactmojo-translations.yml`):
- **Triggers**: Changes to `docs-impactmojo/`, `docs-impactmojo-hi/`, `docs-impactmojo-bn/`, `docs-impactmojo-mr/`, `docs-impactmojo-ta/`
- **Checks**: Translation file coverage across 4 languages, SUMMARY.md parity, stale translation detection
- **Reports**: Coverage percentage per language

**Dependabot** (`dependabot.yml`):
- **Scope**: GitHub Actions dependencies only
- **Frequency**: Monthly
- **Max open PRs**: 2

### Netlify Auto-Deploy
- Every push to `main` triggers automatic deploy for the main site
- Each premium tool has its own independent Netlify deployment
- Static site — no build step required

---

## 5. Environment Variables

### Supabase Edge Functions
| Variable | Purpose |
|----------|---------|
| `SUPABASE_URL` | Project URL |
| `SUPABASE_ANON_KEY` | Public key (safe to expose client-side) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-only, never expose) |
| `JWT_SECRET` | HMAC-SHA256 secret for signing resource tokens |

### Premium Tool Sites
| Variable | Purpose |
|----------|---------|
| `JWT_SECRET` | Must match main site secret for token validation |
| `RESOURCE_NAME` | Tool identifier (e.g., `rq-builder`, `vaniscribe`) |

### Email (Resend)
| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | API key for transactional email |
| `RESEND_FROM` | Verified sender email address |

---

## 6. MCP Server Integrations

Claude Code supports Model Context Protocol (MCP) servers that extend its tool access:

| MCP Server | Tools Available | Use Case for ImpactMojo |
|------------|----------------|------------------------|
| **GitHub** | PR management, issue tracking, code search, CI checks | Active — manages PRs, reviews, issue comments |
| **Notion** | Create pages, query databases, search, update | Project planning, course content tracking |
| **Gmail** | Search messages, read threads, create drafts | Referencing educator feedback and partnerships |
| **Figma** | Get design context, screenshots, metadata | Translating design mockups into HTML/CSS |
| **Google Calendar** | List events, create events, find free time | Planning development sessions and releases |
| **Excalidraw** | Create views, save checkpoints | Architecture diagrams and auth flow visualisation |

---

## 7. Documentation Capabilities

### Multilingual Documentation (5 Languages)
| Language | Directory | Sync Target |
|----------|-----------|-------------|
| English | `docs-impactmojo/` | GitBook (primary space) |
| Hindi | `docs-impactmojo-hi/` | GitBook (Hindi space) |
| Bengali | `docs-impactmojo-bn/` | GitBook (Bengali space) |
| Marathi | `docs-impactmojo-mr/` | GitBook (Marathi space) |
| Tamil | `docs-impactmojo-ta/` | GitBook (Tamil space) |

### Documentation Sections (20 files per language)
- **For Educators** — platform overview, getting started, workshops, handouts guide, dataverse guide, FAQ
- **Technical** — architecture, deployment, environment variables
- **API Reference** — endpoints overview, OpenAPI spec
- **Contributing** — contribution guidelines, translations
- **Reference** — roadmap, changelog, glossary
- **Claude Code** — capabilities (this page), global skills reference
- **About** — project background, license, contact

---

## 8. Global Skills (Shared Development Patterns)

These skills are shared across both JanVayu and ImpactMojo and guide how Claude Code approaches any development task. Full details are in the [Global Skills Reference](skills.md).

### Coding Practices
- **Constraint-first prompting** — always specify what NOT to do (no frameworks, no build step, no TypeScript)
- **Civic data pattern** — prioritise load speed over visual complexity for users on 2G/low-end devices
- **Serverless function pattern** — CORS preflight, try/catch, env vars, graceful fallback
- **API proxy pattern** — cache-first with Blobs, stale-data-over-no-data philosophy
- **Accessibility audit pattern** — specific fixes, not generic WCAG checklists
- **Refactor for readability pattern** — no behaviour change, extract magic numbers, self-documenting names
- **Debugging pattern** — identify the specific line, propose minimum change, do not rewrite

### Visual Design
- **Design brief** — serious and data-driven, accessible on low-end devices, mobile-first
- **AQI colour card pattern** — dynamic CSS custom properties, readable at all contrast levels
- **Data table pattern** — mobile-first column hiding, sticky headers, linked source citations
- **Section header pattern** — consistent layout that works at 320px minimum width
- **Colour for urgency pattern** — distinguishable in greyscale for colour-blind users
- **Chart accessibility pattern** — aria-labels, text summaries, colour-blind-safe palettes

### Automation
- **Core principle** — fail visibly, degrade gracefully
- **Cache warmer pattern** — `Promise.allSettled`, per-feed error isolation, observable logs
- **Daily digest pattern** — per-subscriber error isolation, never abort the loop
- **Feed freshness architecture** — 4-hour cache cycle, application-level caching via Blobs
- **Monitoring pattern** — lightweight health endpoint readable from the frontend
- **Cron timing pattern** — explicit UTC/IST conversion, never assume timezone

---

## 9. Code Quality & Conventions

### Architecture Constraints
- **Static HTML/CSS/JS** — no frameworks, no build step
- **No TypeScript** — vanilla JavaScript only
- **Supabase for backend** — managed auth, PostgreSQL, RLS, Edge Functions
- **Separate tool deployments** — fault isolation for premium tools
- **Short-lived JWTs** (5 minutes) — minimises token misuse window

### Formatting Standards (`.editorconfig`)
- 2-space indentation for HTML, CSS, JS, JSON
- UTF-8 encoding
- LF line endings
- Trailing newline at end of file

### Pricing Tiers
| Tier | Price | Access |
|------|-------|--------|
| Explorer | Free forever | All courses, games, labs, handouts, ImpactLex, case studies, Dataverse |
| Practitioner | ₹399/month | RQ Builder Pro, certificates, community access |
| Professional | ₹999/month | All 7 premium tools, priority coaching |
| Organization | ₹1,499/user/month | Team dashboards, custom pathways, branded certificates |

---

## 10. What Claude Code Built vs. What Needs Humans

### Claude Code Built
- Static HTML pages and client-side scripts
- Netlify Edge Functions (token minting, auth gates)
- Supabase schema design and RLS policies
- Premium tool site scaffolding
- Complete multilingual GitBook documentation (20 files × 5 languages)
- Git workflow management (commits, branches, PRs)
- Code review and targeted refactoring
- Translation sync CI workflows

### Requires Human Intervention
| Task | Reason |
|------|--------|
| Supabase dashboard configuration | Project creation, auth settings, database UI |
| Netlify dashboard configuration | Environment variables, domain setup, build settings |
| API key generation | Supabase, Resend accounts |
| JWT secret generation | Must be securely generated and stored |
| DNS configuration | Domain registrar changes for custom domains |
| Payment infrastructure | UPI setup, tier enforcement logic |
| Content creation | Course material, case studies, datasets |
| Design decisions | Feature priority, UX direction, content curation |
| Deployment verification | Checking live site and tool sites after deploy |
| GitBook account setup | Creating spaces, connecting repo, custom domain |

---

## 11. Content Scale (March 2026)

| Content Type | Count |
|-------------|-------|
| Courses (Flagship + Foundational) | 48 |
| Interactive Games | 16 |
| Interactive Labs | 19 |
| Handouts | 400+ |
| Dev Case Studies | 200 |
| DevDiscourses (Curated Papers) | 500+ |
| Dataverse (Datasets & APIs) | 247 |
| Book Summaries | 5 |
| Learning Tracks | 6 |
| ImpactLex Terms | 500+ |
| Languages Supported | 6 |
| Premium Tools | 7 |

---

## Summary

This Claude Code setup provides a complete development environment for a production learning platform with:
- **Static zero-framework frontend** with Supabase backend (21+ tables with RLS)
- **7 premium tool sites** each with independent Netlify deployment and JWT-based auth
- **Automated code quality** via git hooks (secret blocking, commit conventions, debug detection)
- **CI/CD pipelines** for translation coverage and dependency updates
- **Multilingual documentation** auto-synced to GitBook in 5 languages
- **Global skills** — reusable coding, design, and automation patterns shared with JanVayu
- **MCP integrations** for GitHub, Notion, Gmail, Figma, Calendar, and Excalidraw
