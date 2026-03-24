# Claude Code Development Workflow

This page documents the day-to-day workflow of building JanVayu with Claude Code — from feature development to bug fixes to documentation.

---

## Feature Development Workflow

### Step 1: Define the Feature

Start with a clear, constraint-aware description:

```
> Add a ward-level accountability brief feature.
> It should be a Netlify Function (ES module, .mjs) that:
> - Takes a city name as input
> - Fetches live AQI from WAQI
> - Sends the data to Llama 3.3 70B via Groq with a structured prompt
> - Returns a brief with: current status, NCAP targets, 5 accountability questions
> - Has a fallback if Groq is rate-limited
> Also add the UI section in index.html following existing patterns.
```

### Step 2: Claude Explores

Claude Code reads:
- `index.html` — existing UI patterns, CSS variables, JS conventions
- Existing Netlify Functions — code style, CORS handling, error patterns
- `package.json` — available dependencies
- `netlify.toml` — deployment configuration

### Step 3: Claude Implements

Claude creates/modifies files:
1. `netlify/functions/accountability-brief.mjs` — the serverless function
2. `index.html` — new HTML section, CSS styles, JS fetch logic

### Step 4: Review and Iterate

```
> The brief is too long. Limit the model output to 400 tokens.
> Also add a loading spinner while the brief generates.
```

Claude makes the targeted changes without rewriting unrelated code.

### Step 5: Commit and PR

```
> Commit this with message "Add ward-level accountability brief feature"
> and create a PR
```

Claude runs `git add`, `git commit`, `git push`, and `gh pr create`.

---

## Bug Fix Workflow

```
> The anomaly-check function returns a 500 when WAQI is down.
> It should return a 200 with the anomaly flag based on cached data.
```

Claude Code:
1. Reads `anomaly-check.mjs`
2. Identifies the unhandled error path
3. Adds a try/catch with fallback to cached data
4. Commits the fix

**Key principle:** Claude is instructed to make the *minimum change* — no refactoring the entire function.

---

## Documentation Workflow

```
> Create GitBook documentation for JanVayu covering the tech stack,
> Claude Code setup, and AI features. Include a SUMMARY.md.
```

Claude Code:
1. Reads all existing docs, configs, and source code
2. Creates the directory structure
3. Writes each page with accurate, code-referenced content
4. Updates `SUMMARY.md` and `.gitbook.yaml`

---

## Changelog and Release Workflow

```
> Add a v25.1 changelog entry for the new AI features.
> Follow the existing CHANGELOG.md format.
```

Claude:
1. Reads existing CHANGELOG.md for format
2. Reads all new features (functions, UI sections)
3. Writes a detailed changelog entry
4. Creates a PR with the update

---

## Multi-PR Workflow

For large features, Claude Code manages multiple PRs:

```
PR #1: Add Groq/Llama integration (functions only)
PR #2: Add frontend UI for AI features
PR #3: Update CHANGELOG and version history
PR #4: Update About section version line
```

Each PR is self-contained, reviewable, and mergeable independently.

---

## Prompt Patterns That Work Well

### For New Features

```
Add [feature]. Requirements:
- [Constraint 1]
- [Constraint 2]
Follow existing patterns in [reference file].
Do not change any existing functionality.
```

### For Bug Fixes

```
[Function] returns [error] when [condition].
Expected: [correct behaviour].
Make the minimum change to fix this.
Do not refactor surrounding code.
```

### For Documentation

```
Create documentation for [topic].
Include: [specific sections].
Reference actual code and configuration from the repo.
Use the same tone as [existing doc file].
```

### For Code Review

```
Review [file] for:
- Security issues (especially API key exposure)
- CORS handling
- Error recovery
- Accessibility
List specific issues with line references.
```

---

## What Makes This Workflow Effective

1. **Full codebase context** — Claude reads your code before writing code
2. **Constraint-first prompts** — telling Claude what *not* to do prevents framework bloat
3. **Iterative refinement** — review, adjust, commit in the same session
4. **Git-native** — branches, commits, PRs happen inside the same tool
5. **Multi-file coordination** — a single prompt can touch functions, HTML, CSS, JS, and docs
6. **Reproducible** — every session's work is committed to git with clear messages
