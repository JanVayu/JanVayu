# Sharing and Replicating This Setup

This page explains how to share JanVayu's Claude Code workflow with your team or replicate it for your own project.

---

## For Your Team

### Share the GitBook

This documentation is hosted on GitBook and is publicly shareable. Send the GitBook URL to anyone who needs to understand:
- How JanVayu is built
- How to contribute using Claude Code
- How to fork JanVayu for another city or domain

### Onboard a New Contributor

1. **Clone the repo** — `git clone https://github.com/Varnasr/JanVayu.git`
2. **Read the docs** — start with this GitBook, especially:
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

If your project uses AI features (any model — Gemini, OpenAI, Claude API), document each AI interaction as a skill file:

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

Create GitBook docs alongside your code. Claude Code can generate documentation from your codebase — use it.

---

## Forking JanVayu for Another City

JanVayu is MIT-licensed. To fork it for another city or country:

1. **Fork the repo** on GitHub
2. **Update the city list** in `index.html`
3. **Update seasonal baselines** in `anomaly-check.mjs`
4. **Update WAQI station IDs** for your region
5. **Translate** strings for local languages
6. **Set up your own Netlify site** with environment variables
7. **Optional:** Replace Gemini with another model (the skill files are model-agnostic)

Claude Code can help with all of these steps.

---

## Exporting This Documentation

### As a GitBook Space

This documentation syncs from the `docs/` directory in the GitHub repo. Any changes pushed to `main` automatically update the GitBook.

### As a PDF

GitBook Ultimate plan supports PDF export:
1. Open the GitBook space
2. Click the **...** menu → **Export as PDF**
3. Share the PDF

### As Markdown

The raw Markdown files are in `docs/` in the repo — share them directly or host them anywhere that renders Markdown (GitHub, Notion, HackMD).

---

## GitBook Configuration Tips (Ultimate Plan)

Since JanVayu uses GitBook Ultimate, here are configurations to maximise the platform:

### Git Sync

Already configured in `.gitbook.yaml`:
```yaml
root: ./docs
structure:
  readme: README.md
  summary: SUMMARY.md
```

This syncs the `docs/` directory bi-directionally with GitBook.

### Recommended Ultimate Features

| Feature | How to Use |
|---------|-----------|
| **Custom domain** | Settings → Custom domain → point `docs.janvayu.in` |
| **Visitor authentication** | Settings → Publishing → Require sign-in (for internal docs) |
| **AI search** | Enabled by default on Ultimate — lets visitors ask questions |
| **PDF export** | Available per-page or full-space export |
| **Insights** | Track which pages are most visited |
| **Integrations** | Connect Slack, Linear, or GitHub for notifications |
| **Custom branding** | Settings → Customization → Logo, colours, favicon |
| **Broken link detection** | Automatic — flags internal broken links |
| **OpenAPI spec** | Import API specs to auto-generate endpoint docs |
| **Snippet blocks** | Reusable content blocks across multiple pages |
| **Page ratings** | Visitors can rate page helpfulness |
| **Change requests** | Team members propose edits via GitBook UI |

### Recommended Space Structure

```
JanVayu Docs (public)
├── Getting Started
├── User Guide
├── Tech Stack        ← NEW
├── Claude Code       ← NEW
├── Technical Reference
├── Data Sources
├── Skills & AI Prompts
├── Contributing
└── About
```

### Custom Domain Setup

1. In GitBook: Settings → Custom domain → `docs.janvayu.in`
2. In DNS: Add CNAME record `docs` → `hosting.gitbook.io`
3. Wait for SSL provisioning (automatic)

### Branding

- Upload JanVayu logo (favicon.svg from repo)
- Set primary colour to `#2563eb` (matches CSS `--primary`)
- Enable dark mode toggle (matches the platform's dark mode)
