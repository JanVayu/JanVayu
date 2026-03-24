# JanVayu-க்கான Claude Code அமைப்பு

இந்தப் பக்கம் Claude Code-உடன் JanVayu-ஐ உருவாக்கப் பயன்படுத்தப்பட்ட துல்லியமான கட்டமைப்பை ஆவணப்படுத்துகிறது — CLAUDE.md கோப்பு, அனுமதி settings மற்றும் MCP integrations உட்பட.

---

## CLAUDE.md — திட்ட அறிவுறுத்தல்கள்

JanVayu தற்போது repository-ல் `CLAUDE.md` கோப்பை பயன்படுத்தவில்லை. அதற்கு பதிலாக, திட்ட மரபுகள் இவற்றின் மூலம் செயல்படுத்தப்படுகின்றன:

1. **Git hooks** (`.githooks/pre-commit` மற்றும் `.githooks/commit-msg`) — commit message format-ஐ தானாக செயல்படுத்துகிறது, sensitive files-ஐ தடுக்கிறது
2. **`.editorconfig`** — indentation மற்றும் encoding-ஐ தரப்படுத்துகிறது
3. **`.gitmessage`** — commit message template
4. **Inline documentation** — README.md, CONTRIBUTING.md மற்றும் code comments

### Forks-க்கான பரிந்துரைக்கப்பட்ட CLAUDE.md

JanVayu-ஐ fork செய்து Claude Code-க்கு திட்ட-குறிப்பிட்ட அறிவுறுத்தல்கள் கொடுக்க விரும்பினால், repo root-ல் `CLAUDE.md` உருவாக்கவும்:

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

Skill files என்பது AI models எவ்வாறு நடந்துகொள்ள வேண்டும் என்பதை வரையறுக்கும் கட்டமைக்கப்பட்ட system prompts. JanVayu Gemini அம்சங்களுக்கு இவற்றைப் பயன்படுத்துகிறது, ஆனால் அதே கருத்து Claude Code பணிப்பாய்வுகளுக்கும் பொருந்தும்.

[Skills பிரிவில்](../skills/README.md) ஆவணப்படுத்தப்பட்ட skill files இவற்றாக செயல்படுகின்றன:
1. **Gemini system prompts** — Netlify Functions-ல் உட்பொதிக்கப்பட்டவை
2. **மேம்பாட்டு குறிப்பு** — AI அம்சங்களை மாற்றும்போது Claude Code-ஐ வழிநடத்துகிறது
3. **மறுபயன்படுத்தக்கூடிய templates** — JanVayu-ஐ மற்ற domains-க்கு fork செய்பவர்களுக்கு

### Skill File அமைப்பு

ஒவ்வொரு skill file-ம் இந்த format-ஐ பின்பற்றுகிறது:

```markdown
# Skill: [Name]

## Role
Model எதாக செயல்பட வேண்டும்.

## Context
என்ன தரவு கிடைக்கும்.

## Output Format
பதிலின் துல்லியமான அமைப்பு.

## Constraints
சொல் வரம்புகள், தொனி, மொழி, தோல்வி முறைகள்.

## Examples
மாதிரி உள்ளீடுகள் மற்றும் எதிர்பார்க்கப்படும் வெளியீடுகள்.
```

---

## MCP Server Integrations

Claude Code extended tool access-க்கான Model Context Protocol (MCP) servers-ஐ ஆதரிக்கிறது. JanVayu மேம்பாட்டின் போது, பின்வரும் MCP integrations கிடைத்தன:

### Notion MCP
- **நோக்கம்:** திட்ட திட்டமிடல், பணி கண்காணிப்பு, கூட்ட குறிப்புகள்
- **கருவிகள்:** Pages உருவாக்குதல், databases வினவுதல், தேடல், pages புதுப்பித்தல்

### Gmail MCP
- **நோக்கம்:** தொடர்பு சூழல்
- **கருவிகள்:** Messages தேடுதல், threads படித்தல், drafts உருவாக்குதல்

### Figma MCP
- **நோக்கம்:** Design-to-code பணிப்பாய்வு
- **கருவிகள்:** Design context, screenshots, metadata பெறுதல்

### Google Calendar MCP
- **நோக்கம்:** திட்டமிடல் சூழல்
- **கருவிகள்:** Events பட்டியல், events உருவாக்குதல், free time கண்டறிதல்

### Excalidraw MCP
- **நோக்கம்:** Architecture வரைபடங்கள்
- **கருவிகள்:** Views உருவாக்குதல், checkpoints சேமித்தல்

---

## அனுமதி கட்டமைப்பு

Claude Code கட்டமைக்கக்கூடிய அனுமதிகளுடன் இயங்குகிறது. JanVayu மேம்பாட்டிற்கு:

### பரிந்துரைக்கப்பட்ட அனுமதிகள்

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

### ஏன் இந்த அனுமதிகள்?

- **Read/Write/Edit/Glob/Grep** — முக்கிய மேம்பாட்டு கருவிகள்
- **npm install** — dependencies நிறுவுதல்
- **netlify dev** — உள்ளூர் மேம்பாட்டு server இயக்குதல்
- **git** — version control பணிப்பாய்வு
- **gh pr** — pull requests உருவாக்குதல் மற்றும் நிர்வகித்தல்
- **அழிவுகரமான commands-ஐ தடு** — தற்செயலான data loss-ஐ தடுக்க

---

## மேம்பாட்டிற்கான சூழல்

Claude Code shell சூழலை inherit செய்கிறது. JanVayu-க்கு:

```bash
# தேவை
export GEMINI_API_KEY=your_key
export RESEND_API_KEY=your_key
export NETLIFY_SITE_ID=your_site_id

# விருப்பம் (local dev-ல் Netlify Blobs-க்கு)
export BLOB_TOKEN=your_token
```

உள்ளூர் மேம்பாட்டின் போது `netlify dev`-ஆல் `.env`-லிருந்து இவை படிக்கப்படுகின்றன.
