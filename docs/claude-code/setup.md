# Claude Code Setup for JanVayu

This page documents the exact configuration used to develop JanVayu with Claude Code — including the CLAUDE.md file, permission settings, and MCP integrations.

---

## CLAUDE.md — Project Instructions

JanVayu does not currently use a `CLAUDE.md` file in the repository. Instead, project conventions are enforced through:

1. **Git hooks** (`.githooks/pre-commit` and `.githooks/commit-msg`) — automatically enforce commit message format and block sensitive files
2. **`.editorconfig`** — standardises indentation and encoding
3. **`.gitmessage`** — commit message template
4. **Inline documentation** — README.md, CONTRIBUTING.md, and code comments

### Recommended CLAUDE.md for Forks

If you fork JanVayu and want to give Claude Code project-specific instructions, create a `CLAUDE.md` in the repo root:

```markdown
# CLAUDE.md — JanVayu Project Instructions

## Architecture
- Single HTML file (index.html) — all CSS and JS inline
- No frameworks, no build step, no npm dependencies on the client
- Netlify Functions for server-side logic (ES modules, .mjs)
- Netlify Blobs for caching (strong consistency)

## Code Style
- Vanilla JavaScript only (ES2020 max)
- CSS custom properties for theming
- 2-space indentation (HTML, CSS, JS, JSON)
- No TypeScript, no preprocessors

## Commit Messages
Must start with: Add, Fix, Update, Translate, Docs, Refactor, Test, CI, Chore, Merge

## Netlify Functions Pattern
- Handle CORS preflight (OPTIONS → 204)
- Return JSON with appropriate status codes
- try/catch on every external call
- Never hardcode secrets — use process.env
- Graceful fallback if external API fails

## AI Features
- Model: Google Gemini 2.5 Flash
- All AI calls server-side (Netlify Functions)
- Every AI feature has a non-AI fallback
- Output token limits: 150-400 per response

## Do Not
- Add frameworks (React, Vue, Angular, Svelte)
- Add a build step (Webpack, Vite, Rollup)
- Add TypeScript
- Import npm packages on the client side
- Expose API keys in client code
```

---

## Skill Files

Skill files are structured system prompts that define how AI models behave. JanVayu uses them for Gemini features, but the same concept applies to Claude Code workflows.

The skill files documented in the [Skills section](../skills/README.md) serve as:
1. **Gemini system prompts** — embedded in Netlify Functions
2. **Development reference** — guiding Claude Code when modifying AI features
3. **Reusable templates** — for anyone forking JanVayu for other domains

### Skill File Structure

Every skill file follows this format:

```markdown
# Skill: [Name]

## Role
What the model should act as.

## Context
What data it will receive.

## Output Format
Exact structure of the response.

## Constraints
Word limits, tone, language, failure modes.

## Examples
Sample inputs and expected outputs.
```

---

## MCP Server Integrations

Claude Code supports Model Context Protocol (MCP) servers for extended tool access. During JanVayu development, the following MCP integrations were available:

### Notion MCP
- **Purpose:** Project planning, task tracking, meeting notes
- **Tools:** Create pages, query databases, search, update pages
- **Use case:** Tracking feature development, maintaining a project roadmap

### Gmail MCP
- **Purpose:** Communication context
- **Tools:** Search messages, read threads, create drafts
- **Use case:** Referencing email discussions about features or partnerships

### Figma MCP
- **Purpose:** Design-to-code workflow
- **Tools:** Get design context, screenshots, metadata
- **Use case:** Translating design mockups into HTML/CSS for JanVayu UI sections

### Google Calendar MCP
- **Purpose:** Scheduling context
- **Tools:** List events, create events, find free time
- **Use case:** Planning development sessions and release dates

### Excalidraw MCP
- **Purpose:** Architecture diagrams
- **Tools:** Create views, save checkpoints
- **Use case:** Visualising system architecture and data flow

---

## Permission Configuration

Claude Code operates with configurable permissions. For JanVayu development:

### Recommended Permissions

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "Write",
      "Edit",
      "Bash(npm install)",
      "Bash(netlify dev)",
      "Bash(git *)",
      "Bash(gh pr *)",
      "Bash(ls *)",
      "Bash(mkdir *)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force *)",
      "Bash(git reset --hard *)"
    ]
  }
}
```

### Why These Permissions?

- **Read/Write/Edit/Glob/Grep** — core development tools
- **npm install** — install dependencies
- **netlify dev** — run local development server
- **git** — version control workflow
- **gh pr** — create and manage pull requests
- **Deny destructive commands** — protect against accidental data loss

---

## Environment for Development

Claude Code inherits the shell environment. For JanVayu:

```bash
# Required
export GEMINI_API_KEY=your_key
export RESEND_API_KEY=your_key
export NETLIFY_SITE_ID=your_site_id

# Optional (for Netlify Blobs in local dev)
export BLOB_TOKEN=your_token
```

These are read from `.env` by `netlify dev` during local development.
