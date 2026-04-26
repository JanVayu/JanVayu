# Sharing and Replicating This Setup

This page explains how to share JanVayu's Claude Code workflow with your team or replicate it for your own project.

---

## For Your Team

### Share the Docs

This documentation is hosted on JanVayu's own site at [`/docs/`](/docs/) — a single-page Docsify shell that reads the markdown directly from the repo. Send the URL to anyone who needs to understand:
- How JanVayu is built
- How to contribute using Claude Code
- How to fork JanVayu for another city or domain

### Onboard a New Contributor

1. **Clone the repo** — `git clone https://github.com/JanVayu/JanVayu.git`
2. **Read the docs** — start at [`/docs/`](/docs/), especially:
   - [Tech Stack Overview](../tech-stack/overview.md)
   - [Architecture](../technical/architecture.md)
   - [Local Development](../technical/local-development.md)
3. **Install Claude Code** — `npm install -g @anthropic-ai/claude-code`
4. **Start a session** — `cd JanVayu && claude`
5. **Follow the workflow** — described in [Workflow](workflow.md)

---

## For Your Own Project

### Step 1: Adopt the Constraint-First Approach

The most transferable lesson from JanVayu is **constraint-first prompting**. Before asking Claude Code to build anything:

1. Define what your project will *not* use (frameworks, build tools, etc.)
2. Define your code style and conventions
3. Define your deployment target
4. Put these in a `CLAUDE.md` file in your repo root

### Step 2: Create Skill Files

If your project uses AI features (any model — Groq, OpenAI, Claude API), document each AI interaction as a skill file:

```markdown
# Skill: [Feature Name]

## Role
[What the model acts as]

## Data Context
[What real data gets injected into the prompt]

## Output Format
[Exact structure expected]

## Constraints
[Word limits, tone, language, what NOT to do]

## Fallback
[What happens if the AI call fails]
```

### Step 3: Set Up Git Hooks

Copy JanVayu's git hooks (`.githooks/`) to enforce:
- Commit message conventions
- No secrets in commits
- No debug statements

### Step 4: Document as You Build

Create Docsify (or any markdown-based) docs alongside your code. Claude Code can generate documentation from your codebase — use it.

---

## Forking JanVayu for Another City

JanVayu is MIT-licensed. To fork it for another city or country:

1. **Fork the repo** on GitHub
2. **Update the city list** in `index.html`
3. **Update seasonal baselines** in `anomaly-check.mjs`
4. **Update WAQI station IDs** for your region
5. **Translate** strings for local languages
6. **Set up your own Netlify site** with environment variables
7. **Optional:** Replace the Groq/Llama model with another model (the skill files are model-agnostic)

Claude Code can help with all of these steps.

---

## Exporting This Documentation

### As a Standalone Site

The docs already are a standalone site. Point any reader at [`https://www.janvayu.in/docs/`](https://www.janvayu.in/docs/).

### As Markdown

The raw Markdown files are in `docs/` (English) and `docs-{lang}/` (Hindi, Bengali, Marathi, Tamil) in the repo. Share them directly or host them anywhere that renders Markdown — GitHub, Notion, HackMD, your own Docsify or MkDocs site.

### As a PDF

Docsify itself doesn't have a built-in PDF export. To turn the live docs into a PDF, use `wkhtmltopdf` or a headless-Chrome tool like Puppeteer to render `https://www.janvayu.in/docs/` to PDF.

---

## Docs Stack

JanVayu's docs run on Docsify — chosen because there is no build step, no server, and no third-party hosting bill.

### How the multilingual setup works

The English markdown lives in `docs/`. Each translated language lives in `docs-{lang}/`. A single Docsify shell at `/docs/index.html` declares an alias map that routes hash paths to the right directory, so visitors can reach:

| Language | URL | Source Directory |
|----------|-----|------------------|
| English (default) | [`/docs/`](/docs/) | `docs/` |
| Hindi | [`/docs/#/hi/`](/docs/#/hi/) | `docs-hi/` |
| Bengali | [`/docs/#/bn/`](/docs/#/bn/) | `docs-bn/` |
| Marathi | [`/docs/#/mr/`](/docs/#/mr/) | `docs-mr/` |
| Tamil | [`/docs/#/ta/`](/docs/#/ta/) | `docs-ta/` |

All five language trees auto-update whenever changes are pushed to `main` and Netlify redeploys (no separate sync step).

### Plugins

| Plugin | Purpose |
|--------|---------|
| `docsify-themeable` | Brand-coloured theme (JanVayu green) with dark mode toggle |
| `docsify-pagination` | Previous/Next navigation between pages |
| `docsify-copy-code` | One-click copy button on every code block |
| `docsify-footer-enh` | Footer line with copyright and license |
| `docsify` search | Built-in client-side search across all 5 language trees |
| Prism.js | Syntax highlighting for bash, JS, JSON, YAML, TOML, Markdown |
| Plausible | Privacy-friendly, cookie-free analytics |

### Custom domain

The docs are served from `https://www.janvayu.in/docs/` (a path on the main JanVayu site, not a subdomain) — no separate DNS or SSL config is needed.

### Branding

The theme variables sit in `docs/index.html` inside the `<style>` block:
- Primary colour: `#16A34A` (matches the platform's brand green)
- Sidebar accent: `#1a3a2a`
- Dark mode: triggered by a button bottom-right; preference saved in `localStorage`
