# Development Tooling

This page covers the tools and workflows used to build and maintain JanVayu — with a focus on Claude Code, the primary AI-assisted development tool.

---

## Claude Code (Anthropic)

JanVayu was developed with significant assistance from **Claude Code**, Anthropic's CLI agent for software engineering. Claude Code was used for:

- Writing all 13 Netlify Functions
- Building the entire frontend in `index.html`
- Crafting Gemini prompt engineering (skill files)
- Creating this GitBook documentation
- Managing Git workflow (commits, PRs, changelogs)
- Debugging serverless function issues
- Code review and refactoring

For the complete Claude Code setup, workflow, and configuration used to build JanVayu, see the dedicated [Claude Code section](../claude-code/overview.md).

---

## Editor Configuration

`.editorconfig` standardises formatting across all contributors:

| File type | Indentation |
|-----------|-------------|
| HTML, CSS, JS, JSON, YAML | 2 spaces |
| Python | 4 spaces |
| Makefile | Tabs |

All files: UTF-8, LF line endings, trim trailing whitespace (except Markdown).

---

## Git Workflow

### Commit Message Convention

Enforced by the `commit-msg` hook. Every commit must start with one of:

```
Add:       — New feature or file
Fix:       — Bug fix
Update:    — Enhancement to existing feature
Translate: — New or updated translation
Docs:      — Documentation changes
Refactor:  — Code restructuring (no behaviour change)
Test:      — Test additions or changes
CI:        — CI/CD pipeline changes
Chore:     — Maintenance tasks
Merge:     — Merge commits
```

### Pre-Commit Checks

The `pre-commit` hook automatically:
1. Blocks staging of `.env`, credentials, and secret files
2. Warns about `console.log` debug statements
3. Detects merge conflict markers (`<<<<<<<`)
4. Warns on files larger than 500 KB

### Branch Strategy

- `main` — production (auto-deploys to Netlify)
- `claude/*` — Claude Code development branches (PR to main)
- Feature branches merge via Pull Request

---

## Local Development

```bash
# Install dependencies (server-side only)
npm install

# Run locally with Netlify Functions emulation
netlify dev
```

`netlify dev` emulates the full Netlify environment locally:
- Serves `index.html` on `localhost:8888`
- Emulates all Netlify Functions
- Reads `.env` for environment variables
- Simulates Netlify Blobs

No other setup required. No Docker, no database, no build step.

---

## Dependency Management

- **Dependabot** checks for npm and GitHub Actions updates monthly
- Only 3 npm packages to maintain
- CDN-loaded libraries (Chart.js, Leaflet.js) auto-update to latest stable
