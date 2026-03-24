# Claude Code — How JanVayu Was Built

JanVayu was developed using **Claude Code**, Anthropic's official CLI agent for software engineering. This section documents the complete setup, workflow, and configuration — so you can replicate it for your own projects.

---

## What is Claude Code?

Claude Code is a terminal-based AI coding agent. You run it in your project directory and it can:

- Read and write files
- Run shell commands
- Search codebases
- Create commits and pull requests
- Manage complex multi-file refactors
- Debug errors with full context

It operates as an interactive session where you describe what you want and Claude executes it — reading your code, making changes, running tests, and iterating until the task is done.

---

## How Claude Code Was Used for JanVayu

### Initial Build

The core platform (`index.html`, all Netlify Functions, infrastructure configs) was built through iterative Claude Code sessions:

1. **Describe the feature** — e.g., "Add a health impact calculator that takes age, conditions, and outdoor hours"
2. **Claude reads existing code** — understands the zero-framework constraint, existing patterns
3. **Claude writes the implementation** — inline in `index.html` or as a new Netlify Function
4. **Review and iterate** — request adjustments, fix edge cases
5. **Claude commits** — with proper commit message prefix per project convention

### v25.1 AI Features

All four Gemini-powered features (Ask JanVayu, Health Advisory, Accountability Brief, Anomaly Detection) were built in Claude Code sessions:

- Claude wrote the Netlify Functions (`.mjs` files)
- Claude crafted the Gemini system prompts
- Claude added the frontend UI sections in `index.html`
- Claude created the CHANGELOG entries
- Claude managed the PRs and merges

### Documentation

This entire GitBook documentation was created by Claude Code — including the page you're reading now.

---

## Session Workflow

A typical Claude Code session for JanVayu follows this pattern:

```
1. Start Claude Code in the repo root
   $ claude

2. Describe the task
   > "Add an anomaly detection banner that checks PM2.5 against seasonal baselines
     for Delhi, Mumbai, Kolkata, Chennai, and Bengaluru"

3. Claude explores the codebase
   - Reads index.html to understand existing UI patterns
   - Reads existing Netlify Functions for code style
   - Checks package.json for available dependencies

4. Claude implements
   - Creates netlify/functions/anomaly-check.mjs
   - Adds the banner HTML/CSS/JS to index.html
   - Updates the client-side code to call the function

5. Claude commits and creates a PR
   - Follows commit message convention (Add:, Fix:, etc.)
   - Creates PR with summary and test plan

6. Review, iterate, merge
```

---

## Key Strengths for This Project

### Context Awareness
Claude Code reads your entire codebase. For JanVayu, this means it understood:
- The zero-framework constraint (no React/Vue/Angular)
- The inline CSS/JS pattern in `index.html`
- The Netlify Functions structure and CORS handling
- The cache-first pattern using Netlify Blobs
- The commit message convention enforced by git hooks

### Multi-File Coordination
Adding a feature like "Ask JanVayu" requires changes across:
- A new Netlify Function (`air-query.mjs`)
- Frontend HTML (new section in `index.html`)
- Frontend CSS (styling for the chat interface)
- Frontend JS (fetch call to the function, UI logic)
- CHANGELOG.md (documenting the feature)

Claude Code handles all of these in a single session.

### Git Integration
Claude Code natively handles:
- `git status`, `git diff`, `git log`
- Creating commits with proper messages
- Creating branches and PRs via `gh` CLI
- Following project-specific git hooks

---

## What Claude Code Cannot Do

For transparency, here's what required human intervention:

| Task | Why |
|------|-----|
| Netlify dashboard configuration | Environment variables, domain setup, build settings |
| API key generation | Google AI Studio, Resend, WAQI accounts |
| Design decisions | Which features to build, priority order |
| Content review | Verifying data source accuracy, policy correctness |
| Deployment verification | Checking live site after deploy |
| GitBook account setup | Creating the GitBook space, connecting the repo |
