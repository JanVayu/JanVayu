# Claude Code Setup for JanVayu
இந்த பக்கம் Claude Code-ஐப் பயன்படுத்தி JanVayu-வை உருவாக்கப் பயன்படுத்தப்பட்ட சரியான கட்டமைப்பு ஆவணப்படுத்துகிறது — இதில் CLAUDE.md கோப்பு, அனுமதி அமைப்புகள் மற்றும் MCP ஒருங்கிணைப்புகள் அடங்கும்.
---
## CLAUDE.md — Project Instructions
JanVayu-வின் repository root-ல் ஒரு சிறிய `CLAUDE.md` உள்ளது. இது இந்தப் பக்கங்கள், `CONTRIBUTING.md` மற்றும் `FORKING.md`, மற்றும் `.claude/engineering-standards.md`-ல் உள்ள பகிரப்பட்ட பொறியியல் தரநிலை ஆகியவற்றைக் குறிக்கிறது. இது `scripts/`-ல் உள்ள CI சோதனைகளைக் குறிப்பிடுகிறது மற்றும் commits-ஐ push செய்யும் திட்டமிடப்பட்ட workflows பற்றிய எச்சரிக்கையை அளிக்கிறது. இது மரபுகளை மீண்டும் கூறவில்லை, அவை பின்வருவனவற்றின் மூலம் செயல்படுத்தப்படுகின்றன:
1. **Git hooks** (`.githooks/pre-commit` மற்றும் `.githooks/commit-msg`) — commit message வடிவமைப்பை தானாகவே செயல்படுத்துகிறது மற்றும் முக்கியமான கோப்புகளைத் தடுக்கிறது
2. **`.editorconfig`** — indentation மற்றும் encoding-ஐ தரப்படுத்துகிறது
3. **`.gitmessage`** — commit message வார்ப்புரு
4. **Inline documentation** — README.md, CONTRIBUTING.md, மற்றும் code comments
### Recommended CLAUDE.md for Forks
நீங்கள் JanVayu-வை fork செய்து, Claude Code-க்கு project-specific வழிமுறைகளை வழங்க விரும்பினால், repo root-ல் உள்ள `CLAUDE.md`-ஐ உங்களுடையதாக மாற்றவும். இந்த repository-ல் உள்ளதை விட முழுமையான தொடக்கப் புள்ளி:
```markdown
# CLAUDE.md — JanVayu Project Instructions
## Architecture
- Front end: index.html (markup), app.js (logic), styles.css (styling), games.js, js/ and panels/
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
## திறன் கோப்புகள் (Skill Files)
திறன் கோப்புகள் (Skill files) என்பவை AI மாடல்கள் எவ்வாறு செயல்பட வேண்டும் என்பதை வரையறுக்கும் கட்டமைக்கப்பட்ட சிஸ்டம் ப்ராம்ப்ட்கள் ஆகும். JanVayu தனது Groq-hosted AI அம்சங்களுக்கு இவற்றைப் பயன்படுத்துகிறது, ஆனால் இதே கருத்து Claude Code பணிப்பாய்வுகளுக்கும் பொருந்தும்.
[Skills பிரிவில்](../skills/README.md) ஆவணப்படுத்தப்பட்டுள்ள திறன் கோப்புகள் பின்வருமாறு செயல்படுகின்றன:
1. **Groq சிஸ்டம் ப்ராம்ப்ட்கள்** — Netlify Functions-இல் உட்பொதிக்கப்பட்டவை (`air-query.mjs`-இல் உள்ள Ask JanVayu ப்ராம்ப்ட், அதை ஆவணப்படுத்தும் பக்கத்தை விட மிகவும் நீளமானது)
2. **மேம்பாட்டு குறிப்பு** — AI அம்சங்களை மாற்றியமைக்கும்போது Claude Code-க்கு வழிகாட்டுதல்
3. **மீண்டும் பயன்படுத்தக்கூடிய டெம்ப்ளேட்கள்** — பிற களங்களுக்காக JanVayu-வை ஃபோர்க் செய்யும் எவருக்கும் பயன்படும்
### திறன் கோப்பு கட்டமைப்பு
ஒவ்வொரு திறன் கோப்பும் இந்த வடிவமைப்பைப் பின்பற்றுகிறது:
```markdown
# Skill: [Name]
## Role
மாடல் எவ்வாறு செயல்பட வேண்டும்.
## Context
அது பெறும் தரவு என்ன.
## Output Format
பதிலின் சரியான கட்டமைப்பு.
## Constraints
சொல் வரம்புகள், தொனி, மொழி, தோல்வி முறைகள்.
## Examples
மாதிரி உள்ளீடுகள் மற்றும் எதிர்பார்க்கப்படும் வெளியீடுகள்.
```
---
## MCP சர்வர் ஒருங்கிணைப்புகள்
விரிவாக்கப்பட்ட கருவி அணுகலுக்காக Claude Code Model Context Protocol (MCP) சர்வர்களை ஆதரிக்கிறது. JanVayu போன்ற ஒரு திட்டத்துடன் பின்வரும் MCP ஒருங்கிணைப்புகளைப் பயன்படுத்தலாம் (மேம்பாட்டின் போது எவை பயன்படுத்தப்பட்டன என்பதை களஞ்சியம் பதிவு செய்யவில்லை):
### Notion MCP
- **நோக்கம்:** திட்டமிடல், பணி கண்காணிப்பு, கூட்டக் குறிப்புகள்
- **கருவிகள்:** பக்கங்களை உருவாக்குதல், தரவுத்தளங்களை வினவுதல், தேடுதல், பக்கங்களைப் புதுப்பித்தல்
- **பயன்பாட்டு நிலை:** அம்சம் மேம்பாட்டைக் கண்காணித்தல், திட்ட வரைபடத்தைப் பராமரித்தல்
### Gmail MCP
- **நோக்கம்:** தகவல் தொடர்பு சூழல்
- **கருவிகள்:** செய்திகளைத் தேடுதல், த்ரெட்களைப் படித்தல், வரைவுகளை உருவாக்குதல்
- **பயன்பாட்டு நிலை:** அம்சங்கள் அல்லது கூட்டாண்மைகள் பற்றிய மின்னஞ்சல் விவாதங்களைக் குறிப்பிடுதல்
### Figma MCP
- **நோக்கம்:** டிசைன்-டு-கோட் பணிப்பாய்வு
- **கருவிகள்:** டிசைன் சூழலைப் பெறுதல், ஸ்கிரீன்ஷாட்கள், மெட்டாடேட்டா
- **பயன்பாட்டு நிலை:** JanVayu UI பிரிவுகளுக்கான டிசைன் மாக்அப்களை HTML/CSS ஆக மாற்றுதல்
### Google Calendar MCP
- **நோக்கம்:** திட்டமிடல் சூழல்
- **கருவிகள்:** நிகழ்வுகளைப் பட்டியலிடுதல், நிகழ்வுகளை உருவாக்குதல், இலவச நேரத்தைக் கண்டறிதல்
- **பயன்பாட்டு நிலை:** மேம்பாட்டு அமர்வுகள் மற்றும் வெளியீட்டு தேதிகளைத் திட்டமிடுதல்
### Excalidraw MCP
- **நோக்கம்:** கட்டமைப்பு வரைபடங்கள்
- **கருவிகள்:** பார்வைகளை உருவாக்குதல், செக்பாயிண்ட்களைச் சேமித்தல்
- **பயன்பாட்டு நிலை:** சிஸ்டம் கட்டமைப்பு மற்றும் தரவு ஓட்டத்தைக் காட்சிப்படுத்துதல்
---
## அனுமதி கட்டமைப்பு

Claude Code கட்டமைக்கக்கூடிய அனுமதிகளுடன் செயல்படுகிறது. JanVayu மேம்பாட்டிற்கு:
### பரிந்துரைக்கப்பட்ட அனுமதிகள்
-
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
### இந்த அனுமதிகள் ஏன்?
- **Read/Write/Edit/Glob/Grep** — முக்கிய மேம்பாட்டு கருவிகள்
- **npm install** — சார்புகளை (dependencies) நிறுவுதல்
- **netlify dev** — உள்ளூர் மேம்பாட்டு சேவையகத்தை இயக்குதல்
- **git** — பதிப்பு கட்டுப்பாட்டு பணிப்பாய்வு
- **gh pr** — இழுப்புக் கோரிக்கைகளை (pull requests) உருவாக்குதல் மற்றும் நிர்வகித்தல்
- **அழிக்கும் கட்டளைகளைத் தடுப்பது** — தற்செயலான தரவு இழப்பிலிருந்து பாதுகாத்தல்
---
## மேம்பாட்டிற்கான சூழல்
Claude Code ஷெல் சூழலைப் பெறுகிறது. JanVayu-க்கு:
```bash
# தேவையானவை
export GROQ_API_KEY=your_key
export WAQI_TOKEN=your_token
export RESEND_API_KEY=your_key
export NETLIFY_SITE_ID=your_site_id
# விருப்பத்திற்குரியவை (உள்ளூர் மேம்பாட்டில் Netlify Blobs-க்கு)
export BLOB_TOKEN=your_token
```
உள்ளூர் மேம்பாட்டின் போது `netlify dev` மூலம் இவை `.env`-லிருந்து படிக்கப்படும்.
