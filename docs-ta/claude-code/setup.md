# JanVayu-க்கான Claude Code அமைப்பு

Claude Code-ஐப் பயன்படுத்தி JanVayu-ஐ உருவாக்கப் பயன்படுத்தப்பட்ட சரியான அமைப்பு இந்த பக்கத்தில் ஆவணப்படுத்தப்பட்டுள்ளது — இதில் CLAUDE.md கோப்பு, அனுமதிகள் மற்றும் MCP ஒருங்கிணைப்புகள் ஆகியவை அடங்கும்.

---

## CLAUDE.md — திட்ட வழிமுறைகள்

JanVayu தற்போது களஞ்சியத்தில் `CLAUDE.md` கோப்பைப் பயன்படுத்தவில்லை. அதற்குப் பதிலாக, திட்டத்தின் மரபுகள் இவற்றின் மூலம் செயல்படுத்தப்படுகின்றன:

1. **Git hooks** (`.githooks/pre-commit` மற்றும் `.githooks/commit-msg`) — commit செய்தி வடிவத்தை தானாகவே செயல்படுத்துகிறது மற்றும் முக்கியமான கோப்புகளைத் தடுக்கிறது
2. **`.editorconfig`** — indentation மற்றும் encoding-ஐத் தரப்படுத்துகிறது
3. **`.gitmessage`** — commit செய்தி வார்ப்புரு
4. **Inline documentation** — README.md, CONTRIBUTING.md, மற்றும் குறியீடு குறிப்புகள்

### Forks-க்கான பரிந்துரைக்கப்பட்ட CLAUDE.md

நீங்கள் JanVayu-ஐ fork செய்து, Claude Code-க்குத் திட்ட-குறிப்பிட்ட வழிமுறைகளை வழங்க விரும்பினால், repo root-ல் ஒரு `CLAUDE.md`-ஐ உருவாக்கவும்:

```markdown
# CLAUDE.md — JanVayu Project Instructions

## Architecture
- Three front-end files: index.html (markup), app.js (logic), styles.css (styling)
- No frameworks, no build step, no npm dependencies on the client
- Netlify Functions for server-side logic (ES modules, .mjs)
- Netlify Blobs for caching (strong consistency)

## Code Style
- Vanilla JavaScript only (ES2022, as set in eslint.config.mjs)
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
- Model: openai/gpt-oss-120b via Groq (default; override with the GROQ_MODEL env var)
- All AI calls server-side (Netlify Functions)
- Every AI feature has a non-AI fallback
- Output token ceilings: 512 to 1,024 per response (max_tokens)

## Do Not
- Add frameworks (React, Vue, Angular, Svelte)
- Add a build step (Webpack, Vite, Rollup)
- Add TypeScript
- Import npm packages on the client side
- Expose API keys in client code
```

---

## Skill கோப்புகள்

Skill கோப்புகள் என்பவை AI மாடல்கள் எவ்வாறு செயல்படுகின்றன என்பதை வரையறுக்கும் கட்டமைக்கப்பட்ட system prompts ஆகும். JanVayu தனது Groq-hosted AI அம்சங்களுக்கு இவற்றைப் பயன்படுத்துகிறது, ஆனால் இதே கருத்து Claude Code workflows-க்கும் பொருந்தும்.
[Skills section](../skills/README.md) இல் ஆவணப்படுத்தப்பட்டுள்ள திறன் கோப்புகள் (skill files) பின்வருமாறு செயல்படுகின்றன:
1. **Groq system prompts** — Netlify Functions-இல் உட்பொதிக்கப்பட்டுள்ளன (`air-query.mjs`-இல் உள்ள Ask JanVayu prompt, அதை ஆவணப்படுத்தும் பக்கத்தை விட மிகவும் நீளமானது)
2. **Development reference** — AI அம்சங்களை மாற்றியமைக்கும் போது Claude Code-க்கு வழிகாட்டுகிறது
3. **Reusable templates** — பிற களங்களுக்காக JanVayu-வை fork செய்யும் எவருக்கும்

### Skill File Structure

ஒவ்வொரு திறன் கோப்பும் (skill file) இந்த வடிவத்தைப் பின்பற்றுகிறது:

```markdown
# Skill: [Name]

## Role
மாடல் எந்தப் பாத்திரத்தில் செயல்பட வேண்டும் என்பது.

## Context
அது பெறும் தரவு.

## Output Format
பதிலின் சரியான அமைப்பு.

## Constraints
வார்த்தை வரம்புகள், தொனி, மொழி, தோல்வி முறைகள்.

## Examples
மாதிரி உள்ளீடுகள் மற்றும் எதிர்பார்க்கப்படும் வெளியீடுகள்.
```

---

## MCP Server Integrations

Claude Code விரிவான கருவி அணுகலுக்கு Model Context Protocol (MCP) சேவையகங்களை ஆதரிக்கிறது. JanVayu போன்ற ஒரு திட்டத்துடன் பின்வரும் MCP ஒருங்கிணைப்புகளைப் பயன்படுத்தலாம் (வளர்ச்சியின் போது எவை பயன்படுத்தப்பட்டன என்பதை களஞ்சியம் பதிவு செய்யவில்லை):

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

Claude Code கட்டமைக்கக்கூடிய அனுமதிகளுடன் (permissions) செயல்படுகிறது. JanVayu வளர்ச்சிக்காக:

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
- **Read/Write/Edit/Glob/Grep** — முக்கிய மேம்பாட்டுத் தளவாடங்கள்
- **npm install** — சார்புகளை நிறுவுதல்
- **netlify dev** — உள்ளூர் மேம்பாட்டு சேவையகத்தை இயக்குதல்
- **git** — பதிப்பு கட்டுப்பாட்டுப் பணிப்பாய்வு
- **gh pr** — இழுவைக் கோரிக்கைகளை உருவாக்குதல் மற்றும் நிர்வகித்தல்
- **Deny destructive commands** — எதிர்பாராத தரவு இழப்பிலிருந்து பாதுகாத்தல்

---

## மேம்பாட்டிற்கான சூழல்

Claude Code ஷெல் சூழலை ஏற்றுக்கொள்கிறது. JanVayu-க்கு:

```bash
# Required
export GROQ_API_KEY=your_key
export RESEND_API_KEY=your_key
export NETLIFY_SITE_ID=your_site_id

# Optional (for Netlify Blobs in local dev)
export BLOB_TOKEN=your_token
```

உள்ளூர் மேம்பாட்டின் போது `netlify dev` மூலம் இவை `.env` இலிருந்து படிக்கப்படும்.
