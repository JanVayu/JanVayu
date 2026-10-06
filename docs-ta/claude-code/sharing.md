# இந்த அமைப்பைப் பகிர்வதும் நகலெடுப்பதும்

JanVayu-வின் Claude Code வேலைப்பாய்வை (workflow) உங்கள் குழுவுடன் எப்படிப் பகிர்வது அல்லது உங்கள் சொந்த ப்ராஜெக்ட்டுக்கு அதை எப்படி நகலெடுப்பது என்பதை இந்தப் பக்கம் விளக்குகிறது.

---

## உங்கள் குழுவிற்காக

### ஆவணங்களைப் பகிரவும்

இந்த ஆவணங்கள் JanVayu-வின் சொந்த தளமான [`/docs/`](/docs/) இல் வழங்கப்படுகின்றன — இது ரெப்போவிலிருந்து நேரடியாக மார்க்டவுனைப் படிக்கும் ஒரு சிங்கிள்-பேஜ் Docsify ஷெல் ஆகும். கீழ்க்கண்டவற்றைத் தெரிந்துகொள்ள வேண்டிய எவருக்கும் இந்த URL-ஐ அனுப்பவும்:
- JanVayu எப்படி உருவாக்கப்பட்டுள்ளது
- Claude Code-ஐப் பயன்படுத்தி எப்படிப் பங்களிப்பது
- வேறொரு நகரம் அல்லது டொமைனுக்காக JanVayu-வை எப்படி ஃபோர்க் (fork) செய்வது

### புதிய பங்களிப்பாளரைச் சேர்த்தல்

1. **ரெப்போவை க்ளோன் செய்யவும்** — `git clone https://github.com/JanVayu/JanVayu.git`
2. **ஆவணங்களைப் படிக்கவும்** — [`/docs/`](/docs/) இல் தொடங்கி, குறிப்பாக:
   - [Tech Stack Overview](../tech-stack/overview.md)
   - [Architecture](../technical/architecture.md)
   - [Local Development](../technical/local-development.md)
3. **Claude Code-ஐ இன்ஸ்டால் செய்யவும்** — `npm install -g @anthropic-ai/claude-code`
4. **ஒரு செஷனைத் தொடங்கவும்** — `cd JanVayu && claude`
5. **வேலைப்பாய்வைப் பின்பற்றவும்** — [Workflow](workflow.md) இல் விவரிக்கப்பட்டுள்ளது

---

## உங்கள் சொந்த ப்ராஜெக்ட்டிற்காக

### படி 1: கட்டுப்பாடுகளுக்கு-முதன்மையான (Constraint-First) அணுகுமுறையைப் பின்பற்றுங்கள்

JanVayu-விலிருந்து கற்றுக்கொள்ளக்கூடிய மிக முக்கியமான பாடம் **கட்டுப்பாடுகளுக்கு-முதன்மையான ப்ராம்ப்ட்டிங் (constraint-first prompting)** ஆகும். Claude Code-ஐ எதையும் உருவாக்கச் சொல்வதற்கு முன்:

1. உங்கள் ப்ராஜெக்ட் எதைப் பயன்படுத்த *மாட்டாது* என்பதை வரையறுக்கவும் (ஃப்ரேம்வொர்க்குகள், பில்ட் டூல்கள் போன்றவை)
2. உங்கள் கோட் ஸ்டைல் மற்றும் மரபுகளை வரையறுக்கவும்
3. உங்கள் டெப்லாய்மென்ட் டார்கெட்டை வரையறுக்கவும்
4. இவற்றை உங்கள் ரெப்போவின் ரூட்டில் உள்ள `CLAUDE.md` ஃபைலில் வைக்கவும்

### படி 2: ஸ்கில் ஃபைல்களை (Skill Files) உருவாக்கவும்

உங்கள் ப்ராஜெக்ட் AI அம்சங்களைப் பயன்படுத்தினால் (எந்த மாடலாக இருந்தாலும் — Groq, OpenAI, Claude API), ஒவ்வொரு AI தொடர்பையும் ஒரு ஸ்கில் ஃபைலாக ஆவணப்படுத்தவும்:

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

### படி 3: Git Hooks-ஐ செட் அப் செய்யவும்

கீழ்க்கண்டவற்றைச் செயல்படுத்த JanVayu-வின் git hooks-ஐ (`.githooks/`) காப்பி செய்யவும்:
- கமிட் மெசேஜ் மரபுகள்
- கமிட்களில் ரகசியங்கள் (secrets) இருக்கக்கூடாது
- டீபக் ஸ்டேட்மென்ட்கள் இருக்கக்கூடாது

### படி 4: உருவாக்கும்போதே ஆவணப்படுத்தவும்

உங்கள் கோடுடன் Docsify (அல்லது எந்த மார்க்டவுன்-அடிப்படையிலான) ஆவணங்களையும் உருவாக்கவும். Claude Code உங்கள் கோட் பேஸிலிருந்து ஆவணங்களை உருவாக்க முடியும் — அதைப் பயன்படுத்தவும்.

---

## வேறொரு நகரத்திற்காக JanVayu-வை ஃபோர்க் (Fork) செய்தல்

JanVayu-வின் கோடு MIT-லைசென்ஸ் பெற்றது (அதன் உள்ளடக்கம் CC BY-NC-SA 4.0 ஆகும்). வேறொரு நகரம் அல்லது நாட்டிற்காக அதை ஃபோர்க் செய்ய:


---
1. GitHub-ல் **Fork the repo**
2. `app.js` மற்றும் Netlify function-களில் உள்ள `CITIES` table-களை **Update the city list**
3. `anomaly-check.mjs` இல் **Update seasonal baselines**
4. உங்கள் பகுதிக்கு **Update WAQI station IDs**
5. உள்ளூர் மொழிகளுக்கான string-களை **Translate** செய்யவும்
6. environment variable-களுடன் **Set up your own Netlify site**
7. **Optional:** இயல்புநிலை Groq model-ஐ (`openai/gpt-oss-120b`) வேறு model-ஆல் மாற்றவும் (skill file-கள் model-agnostic ஆகும்)

இந்த எல்லா படிகளுக்கும் Claude Code உதவ முடியும்.

---

## இந்த Documentation-ஐ Export செய்தல்

### ஒரு Standalone Site ஆக

இந்த docs ஏற்கனவே ஒரு standalone site ஆக உள்ளது. எந்தவொரு வாசகருக்கும் [`https://www.janvayu.in/docs/`](https://www.janvayu.in/docs/) என்ற link-ஐ பகிரவும்.

### Markdown ஆக

Raw Markdown file-கள் repo-வில் `docs/` (English) மற்றும் `docs-{lang}/` (Hindi, Bengali, Marathi, Tamil) ஆகியவற்றில் உள்ளன. அவற்றை நேரடியாக பகிரலாம் அல்லது Markdown-ஐ render செய்யும் எங்கு வேண்டுமானாலும் host செய்யலாம் — GitHub, Notion, HackMD, உங்கள் சொந்த Docsify அல்லது MkDocs site.

### PDF ஆக

Docsify-ல் built-in PDF export வசதி இல்லை. Live docs-ஐ PDF ஆக மாற்ற, `https://www.janvayu.in/docs/`-ஐ PDF ஆக render செய்ய `wkhtmltopdf` அல்லது Puppeteer போன்ற headless-Chrome tool-ஐப் பயன்படுத்தவும்.

---

## Docs Stack

JanVayu-வின் docs Docsify-ல் இயங்குகின்றன — build step, server மற்றும் third-party hosting கட்டணம் இல்லாததால் இது தேர்ந்தெடுக்கப்பட்டது.

### Multilingual அமைப்பு எப்படி வேலை செய்கிறது

English markdown `docs/`-ல் உள்ளது. ஒவ்வொரு மொழிபெயர்க்கப்பட்ட மொழியும் `docs-{lang}/`-ல் உள்ளது. `/docs/index.html`-ல் உள்ள ஒரு Docsify shell, hash path-களை சரியான directory-க்கு அனுப்பும் ஒரு alias map-ஐ அறிவிக்கிறது, இதனால் பார்வையாளர்கள் கீழ்க்கண்டவற்றை அடைய முடியும்:

| மொழி | URL | Source Directory |
|----------|-----|------------------|
| English (default) | [`/docs/`](/docs/) | `docs/` |
| Hindi | [`/docs/#/hi/`](/docs/#/hi/) | `docs-hi/` |
| Bengali | [`/docs/#/bn/`](/docs/#/bn/) | `docs-bn/` |
| Marathi | [`/docs/#/mr/`](/docs/#/mr/) | `docs-mr/` |
| Tamil | [`/docs/#/ta/`](/docs/#/ta/) | `docs-ta/` |

மொழிபெயர்க்கப்பட்ட file-கள் ஒரு CI auto-translate job (`.github/workflows/translations.yml`, இதற்கு Sarvam API key தேவை) மூலம் refresh செய்யப்படுகின்றன, மேலும் இவை English docs-ஐ விட பின்தங்கியிருக்கலாம்: 65 English page-களில் 47-க்கு தற்போது ஒவ்வொரு மொழியிலும் மொழிபெயர்க்கப்பட்ட counterpart உள்ளது.

### Plugins
| செருகுநிரல் | நோக்கம் |
|--------|---------|
| `docsify-themeable` | டார்க் மோட் மாற்றியுடன் கூடிய பிராண்ட் நிற தீம் (JanVayu பச்சை) |
| `docsify-pagination` | பக்கங்களுக்கு இடையே முந்தைய/அடுத்த பக்கங்களுக்குச் செல்லுதல் |
| `docsify-copy-code` | ஒவ்வொரு கோட் பிளாக்கிலும் ஒன்-கிளிக் காப்பி பட்டன் |
| `docsify-footer-enh` | காப்புரிமை மற்றும் உரிமத்துடன் கூடிய ஃபுட்டர் வரி |
| `docsify` தேடல் | அனைத்து 5 மொழி மரங்களிலும் உள்ளமைக்கப்பட்ட கிளைண்ட்-சைடு தேடல் |
| Prism.js | bash, JS, JSON, YAML, TOML, Markdown ஆகியவற்றுக்கான சின்டாக்ஸ் ஹைலைட்டிங் |
| Docsify zoom-image | படங்களை பெரிதாக்க கிளிக் செய்தல் |

### தனிப்பயன் டொமைன்

ஆவணங்கள் `https://www.janvayu.in/docs/` என்பதிலிருந்து வழங்கப்படுகின்றன (இது முக்கிய JanVayu தளத்தில் உள்ள ஒரு பாதை, சப்-டொமைன் அல்ல) — தனி DNS அல்லது SSL கட்டமைப்பு எதுவும் தேவையில்லை.

### பிராண்டிங்

தீம் மாறிகள் `docs/index.html`-க்குள் உள்ள `<style>` பிளாக்கில் உள்ளன:
- முதன்மை நிறம்: `#16A34A` (தளத்தின் பிராண்ட் பச்சையுடன் பொருந்துகிறது)
- பக்கவாட்டு நிறம்: `#1a3a2a`
- டார்க் மோட்: பகிரப்பட்ட தளத்தின் ஹெட்டரிலிருந்து (`js/chrome.js`) மாற்றப்படுகிறது; இந்த விருப்பம் `janvayu-theme` என்பதன் கீழ் `localStorage`-ல் சேமிக்கப்படுகிறது
