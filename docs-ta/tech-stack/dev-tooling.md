# மேம்பாட்டு கருவிகள்

இந்தப் பக்கம் JanVayu-ஐ உருவாக்கவும் பராமரிக்கவும் பயன்படுத்தப்படும் கருவிகள் மற்றும் பணிப்பாய்வுகளை உள்ளடக்குகிறது — முதன்மை AI-உதவி மேம்பாட்டு கருவியான Claude Code மீது கவனம் செலுத்துகிறது.

---

## Claude Code (Anthropic)

JanVayu **Claude Code**, Anthropic-ன் software engineering-க்கான CLI agent-ன் குறிப்பிடத்தக்க உதவியுடன் உருவாக்கப்பட்டது. Claude Code இவற்றுக்கு பயன்படுத்தப்பட்டது:

- அனைத்து 13 Netlify Functions-ஐ எழுதுதல்
- `index.html`-ல் முழு frontend-ஐ உருவாக்குதல்
- Gemini prompt engineering (skill files) வடிவமைத்தல்
- இந்த GitBook ஆவணங்களை உருவாக்குதல்
- Git workflow நிர்வகித்தல் (commits, PRs, changelogs)
- Serverless function சிக்கல்களை debug செய்தல்
- Code review மற்றும் refactoring

முழுமையான Claude Code அமைப்பு, பணிப்பாய்வு மற்றும் கட்டமைப்புக்கு, [Claude Code பிரிவை](../claude-code/overview.md) பார்க்கவும்.

---

## Editor கட்டமைப்பு

`.editorconfig` அனைத்து பங்களிப்பாளர்களிடையே formatting-ஐ தரப்படுத்துகிறது:

| கோப்பு வகை | Indentation |
|-----------|-------------|
| HTML, CSS, JS, JSON, YAML | 2 spaces |
| Python | 4 spaces |
| Makefile | Tabs |

அனைத்து கோப்புகள்: UTF-8, LF line endings, trailing whitespace trim (Markdown தவிர).

---

## Git பணிப்பாய்வு

### Commit Message மரபு

`commit-msg` hook-ஆல் செயல்படுத்தப்படுகிறது. ஒவ்வொரு commit-ம் இவற்றில் ஒன்றால் தொடங்க வேண்டும்:

```
Add:       — புதிய அம்சம் அல்லது கோப்பு
Fix:       — பிழை திருத்தம்
Update:    — ஏற்கனவே உள்ள அம்சத்தின் மேம்படுத்தல்
Translate: — புதிய அல்லது புதுப்பிக்கப்பட்ட மொழிபெயர்ப்பு
Docs:      — ஆவண மாற்றங்கள்
Refactor:  — குறியீடு மறுகட்டமைப்பு (நடத்தை மாற்றம் இல்லை)
Test:      — சோதனை சேர்க்கைகள் அல்லது மாற்றங்கள்
CI:        — CI/CD pipeline மாற்றங்கள்
Chore:     — பராமரிப்பு பணிகள்
Merge:     — Merge commits
```

### Pre-Commit சோதனைகள்

`pre-commit` hook தானாக:
1. `.env`, credentials மற்றும் ரகசிய கோப்புகளை staging செய்வதை தடுக்கிறது
2. `console.log` debug statements பற்றி எச்சரிக்கிறது
3. Merge conflict markers-ஐ (`<<<<<<<`) கண்டறிகிறது
4. 500 KB-க்கு மேல் உள்ள கோப்புகளில் எச்சரிக்கிறது

### கிளை உத்தி

- `main` — உற்பத்தி (Netlify-க்கு தானாக deploy)
- `claude/*` — Claude Code மேம்பாட்டு கிளைகள் (main-க்கு PR)
- Feature கிளைகள் Pull Request வழியாக இணைக்கப்படும்

---

## உள்ளூர் மேம்பாடு

```bash
# Dependencies நிறுவுதல் (சர்வர்-பக்கம் மட்டும்)
npm install

# Netlify Functions emulation-உடன் உள்ளூரில் இயக்குதல்
netlify dev
```

`netlify dev` முழு Netlify சூழலை உள்ளூரில் emulate செய்கிறது:
- `localhost:8888`-ல் `index.html`-ஐ serve செய்கிறது
- அனைத்து Netlify Functions-ஐ emulate செய்கிறது
- சூழல் மாறிகளுக்கு `.env`-ஐ படிக்கிறது
- Netlify Blobs-ஐ simulate செய்கிறது

வேறு setup தேவையில்லை. Docker இல்லை, database இல்லை, build படி இல்லை.

---

## Dependency மேலாண்மை

- **Dependabot** npm மற்றும் GitHub Actions updates-ஐ மாதாந்திரம் சோதிக்கிறது
- பராமரிக்க 3 npm packages மட்டுமே
- CDN-ல் ஏற்றப்படும் libraries (Chart.js, Leaflet.js) சமீபத்திய stable-க்கு தானாக update ஆகின்றன
