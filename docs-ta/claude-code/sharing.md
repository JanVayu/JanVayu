# இந்த அமைப்பை பகிர்வதும் நகலெடுப்பதும்

இந்த பக்கம் JanVayu-வின் Claude Code வேலைப்பாய்வை (workflow) உங்கள் குழுவுடன் எவ்வாறு பகிர்வது அல்லது உங்கள் சொந்த திட்டத்திற்காக அதை எவ்வாறு நகலெடுப்பது என்பதை விளக்குகிறது.
---
## உங்கள் குழுவிற்கு
### ஆவணங்களை பகிரவும்
இந்த ஆவணங்கள் JanVayu-வின் சொந்த தளமான [`/docs/`](/docs/ ':ignore') இல் தொகுக்கப்பட்டுள்ளன, இது களஞ்சியத்திலிருந்து (repo) நேரடியாக markdown-ஐப் படிக்கும் ஒரு ஒற்றைப் பக்க Docsify shell ஆகும். பின்வருவனவற்றைப் புரிந்து கொள்ள வேண்டிய எவருக்கும் இந்த URL-ஐ அனுப்பவும்:
- JanVayu எவ்வாறு உருவாக்கப்பட்டது
- Claude Code-ஐப் பயன்படுத்தி எவ்வாறு பங்களிப்பது
- வேறு நகரம் அல்லது களத்திற்கு JanVayu-வை எவ்வாறு fork செய்வது
### புதிய பங்களிப்பாளரை இணைத்தல்
1. **களஞ்சியத்தை clone செய்யவும்** — `git clone https://github.com/JanVayu/JanVayu.git`
2. **ஆவணங்களைப் படிக்கவும்**: [`/docs/`](/docs/ ':ignore') இல் தொடங்கவும், குறிப்பாக:
   - [Tech Stack Overview](../tech-stack/overview.md)
   - [Architecture](../technical/architecture.md)
   - [Local Development](../technical/local-development.md)
3. **Claude Code-ஐ நிறுவவும்** — `npm install -g @anthropic-ai/claude-code`
4. **ஒரு session-ஐ தொடங்கவும்** — `cd JanVayu && claude`
5. **வேலைப்பாய்வைப் பின்பற்றவும்** — [Workflow](workflow.md) இல் விவரிக்கப்பட்டுள்ளது
---
## உங்கள் சொந்த திட்டத்திற்கு
### படி 1: Constraint-First அணுகுமுறையைப் பின்பற்றவும்
JanVayu-விலிருந்து எளிதாகப் பயன்படுத்தக்கூடிய மிக முக்கியமான பாடம் **constraint-first prompting** ஆகும். Claude Code-ஐ எதையாவது உருவாக்கச் சொல்வதற்கு முன்:
1. உங்கள் திட்டம் எதை *பயன்படுத்தாது* என்பதை வரையறுக்கவும் (frameworks, build tools போன்றவை)
2. உங்கள் code style மற்றும் மரபுகளை வரையறுக்கவும்
3. உங்கள் deployment target-ஐ வரையறுக்கவும்
4. இவற்றை உங்கள் repo root-இல் உள்ள `CLAUDE.md` கோப்பில் வைக்கவும்
### படி 2: Skill கோப்புகளை உருவாக்கவும்
உங்கள் திட்டம் AI அம்சங்களைப் பயன்படுத்தினால் (எந்த மாடலாக இருந்தாலும் — Groq, OpenAI, Claude API), ஒவ்வொரு AI தொடர்பையும் ஒரு skill கோப்பாக ஆவணப்படுத்தவும்:
```markdown
# Skill: [Feature Name]
## Role
[மாடல் என்னவாகச் செயல்படுகிறது]
## Data Context
[உண்மையான தரவு prompt-இல் எவ்வாறு செலுத்தப்படுகிறது]
## Output Format
[எதிர்பார்க்கப்படும் சரியான கட்டமைப்பு]
## Constraints
[சொல் வரம்புகள், தொனி, மொழி, என்ன செய்யக் கூடாது]
## Fallback
[AI அழைப்பு தோல்வியடைந்தால் என்ன நடக்கும்]
```
### படி 3: Git Hooks-ஐ அமைக்கவும்
பின்வருவனவற்றைச் செயல்படுத்த JanVayu-வின் git hooks-ஐ (`.githooks/`) நகலெடுக்கவும்:
- Commit message மரபுகள்
- Commits-இல் ரகசியங்கள் இருக்கக்கூடாது
- Debug statements இருக்கக்கூடாது
### படி 4: உருவாக்கும்போதே ஆவணப்படுத்தவும்
உங்கள் code-க்கு இணையாக Docsify (அல்லது ஏதேனும் markdown அடிப்படையிலான) ஆவணங்களை உருவாக்கவும். Claude Code உங்கள் codebase-லிருந்து ஆவணங்களை உருவாக்க முடியும் — அதைப் பயன்படுத்தவும்.
---
## வேறு நகரத்திற்காக JanVayu-வை Fork செய்தல்
JanVayu-வின் code MIT-license பெற்றது (அதன் உள்ளடக்கம் CC BY-NC-SA 4.0 ஆகும்). வேறு நகரம் அல்லது நாட்டிற்காக அதை fork செய்ய:
1. **GitHub-இல் repo-ஐ Fork செய்யவும்**
2. **`app.js` மற்றும் Netlify functions-இல் உள்ள `CITIES` அட்டவணைகளில் நகரங்களின் பட்டியலைப் புதுப்பிக்கவும்**
3. **`anomaly-check.mjs`-இல் பருவகால அடிப்படைகளைப் புதுப்பிக்கவும்**
4. **உங்கள் பகுதிக்குரிய WAQI station ID-களைப் புதுப்பிக்கவும்**
5. **உள்ளூர் மொழிகளுக்கான strings-ஐ மொழிபெயர்க்கவும்**
6. **environment variables-உடன் உங்கள் சொந்த Netlify தளத்தை அமைக்கவும்**
7. **விருப்பமிருந்தால்:** இயல்புநிலை Groq model-ஐ (`openai/gpt-oss-120b`) வேறு model-ஆல் மாற்றவும் (skill கோப்புகள் model-agnostic ஆனவை)
இந்த அனைத்து படிகளிலும் Claude Code உதவ முடியும்.
---
## இந்த ஆவணங்களை Export செய்தல்
### Standalone Site ஆக
இந்த docs ஏற்கனவே ஒரு standalone site ஆக உள்ளது. எந்தவொரு வாசகரையாவது [`https://www.janvayu.in/docs/`](https://www.janvayu.in/docs/) என்ற முகவரிக்கு அனுப்பவும்.
### Markdown ஆக
Raw Markdown கோப்புகள் repo-வில் `docs/` (English) மற்றும் `docs-{lang}/` (Hindi, Bengali, Marathi, Tamil) என்ற இடங்களில் உள்ளன. அவற்றை நேரடியாகப் பகிரலாம் அல்லது Markdown-ஐ render செய்யும் எந்த இடத்திலும் host செய்யலாம் — GitHub, Notion, HackMD, உங்கள் சொந்த Docsify அல்லது MkDocs தளம்.
### PDF ஆக
Docsify-இல் உள்ளமைக்கப்பட்ட PDF export வசதி இல்லை. Live docs-ஐ PDF ஆக மாற்ற, `https://www.janvayu.in/docs/`-ஐ PDF ஆக render செய்ய `wkhtmltopdf` அல்லது Puppeteer போன்ற headless-Chrome கருவியைப் பயன்படுத்தவும்.
---
## Docs Stack
JanVayu-வின் docs Docsify-இல் இயங்குகின்றன — build step, server மற்றும் மூன்றாம் தரப்பு hosting கட்டணம் இல்லாததால் இது தேர்ந்தெடுக்கப்பட்டது.
### பன்மொழி அமைப்பு எவ்வாறு செயல்படுகிறது
English markdown `docs/`-இல் உள்ளது. ஒவ்வொரு மொழிபெயர்க்கப்பட்ட மொழியும் `docs-{lang}/`-இல் உள்ளது. `/docs/index.html`-இல் உள்ள ஒரே ஒரு Docsify shell, hash paths-ஐ சரியான directory-க்கு அனுப்பும் ஒரு alias map-ஐ அறிவிக்கிறது, இதனால் பார்வையாளர்கள் இவற்றை அடைய முடியும்:
| மொழி | URL | Source Directory |
|----------|-----|------------------|
| English (default) | [`/docs/`](/docs/ ':ignore') | `docs/` |
| Hindi | [`/docs/#/hi/`](/docs/#/hi/ ':ignore') | `docs-hi/` |
| Bengali | [`/docs/#/bn/`](/docs/#/bn/ ':ignore') | `docs-bn/` |
| Marathi | [`/docs/#/mr/`](/docs/#/mr/ ':ignore') | `docs-mr/` |
| Tamil | [`/docs/#/ta/`](/docs/#/ta/ ':ignore') | `docs-ta/` |
மொழிபெயர்க்கப்பட்ட மரங்கள் ஒரு CI auto-translate job (`.github/workflows/translations.yml`, இதற்கு Sarvam API key தேவை) மூலம் புதுப்பிக்கப்படுகின்றன, மேலும் இவை English docs-ஐ விட பின்தங்கியிருக்கலாம். 21 November 2026 அன்று, 74 English Markdown பக்கங்களில், 70 பக்கங்களுக்கு Hindi counterpart, 68-க்கு Bengali counterpart, 70-க்கு Marathi counterpart மற்றும் 71-க்கு Tamil counterpart இருந்தது. விடுபட்டவற்றில் பெரும்பாலானவை தேதியிடப்பட்ட fact-check அறிக்கைகள் ஆகும்.
### Plugins
 
---
பகுதி 2 இன் முடிவு.
| Plugin | நோக்கம் |
|--------|---------|
| `docsify-themeable` | பிராண்ட் நிறமுள்ள தீம் (JanVayu பச்சை) மற்றும் dark mode toggle |
| `docsify-pagination` | பக்கங்களுக்கு இடையே Previous/Next நேவிகேஷன் |
| `docsify-copy-code` | ஒவ்வொரு code block-லும் one-click copy button |
| `docsify-footer-enh` | காப்புரிமை மற்றும் உரிமத்துடன் கூடிய Footer வரி |
| `docsify` search | அனைத்து 5 மொழி மரங்களிலும் Built-in client-side search |
| Prism.js | bash, JS, JSON, YAML, TOML, Markdown ஆகியவற்றிற்கான Syntax highlighting |
| Docsify zoom-image | படங்களை Click-to-zoom செய்தல் |
### Custom domain
ஆவணங்கள் `https://www.janvayu.in/docs/` இலிருந்து வழங்கப்படுகின்றன (இது முக்கிய JanVayu தளத்தின் ஒரு பாதை, subdomain அல்ல) — தனி DNS அல்லது SSL கட்டமைப்பு தேவையில்லை.
### Branding
தீம் மாறிகள் `docs/index.html`-க்குள் உள்ள `<style>` block-ல் உள்ளன:
- Primary colour: `#16A34A` (தளம் சார்ந்த பிராண்ட் பச்சையுடன் பொருந்துகிறது)
- Sidebar accent: `#1a3a2a`
- Dark mode: பகிரப்பட்ட தள header-லிருந்து (`js/chrome.js`) toggle செய்யப்படுகிறது; இந்த விருப்பம் `localStorage`-ல் `janvayu-theme` என்பதன் கீழ் சேமிக்கப்படுகிறது
