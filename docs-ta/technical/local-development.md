# உள்ளூர் மேம்பாடு

## முன்நிபந்தனைகள்

- [Node.js](https://nodejs.org/) 18 அல்லது அதற்கு மேல்
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (`npm install -g netlify-cli`)
- [Resend](https://resend.com) கணக்கு — மின்னஞ்சல் சுருக்க அம்சங்களில் வேலை செய்தால் மட்டும் தேவை
- [Google AI Studio](https://aistudio.google.com) கணக்கு — AI அம்சங்களுக்கு மட்டும் தேவை

---

## அமைப்பு

```bash
# 1. Repository-ஐ clone செய்யுங்கள்
git clone https://github.com/JanVayu/JanVayu.git
cd JanVayu

# 2. Dependencies-ஐ நிறுவுங்கள்
npm install

# 3. சூழல் மாறிகள் வார்ப்புருவை நகலெடுக்கவும்
cp .env.example .env

# 4. உங்கள் சூழல் மாறிகளை நிரப்புங்கள் (கீழே பார்க்கவும்)
# .env-ஐ உங்கள் மதிப்புகளுடன் திருத்தவும்

# 5. உள்ளூர் மேம்பாட்டு சர்வரைத் தொடங்குங்கள்
netlify dev
```

தளம் `http://localhost:8888`-ல் கிடைக்கும். Netlify Dev serverless functions-ஐ உள்ளூரில் பின்பற்றுகிறது, திட்டமிடப்பட்ட functions மற்றும் Blobs store உட்பட.

---

## சூழல் மாறிகள்

திட்ட root-ல் ஒரு `.env` கோப்பை உருவாக்கவும் (இது gitignore ஆகிறது, commit ஆகாது):

```bash
# மின்னஞ்சல் சுருக்கத்திற்கு தேவை
RESEND_API_KEY=your_resend_api_key
RESEND_FROM=digest@yourdomain.com

# Netlify Blobs-க்கு தேவை (local dev)
BLOB_TOKEN=your_netlify_personal_access_token
NETLIFY_SITE_ID=your_netlify_site_id

# AI அம்சங்களுக்கு தேவை
GEMINI_API_KEY=your_google_gemini_api_key
```

ஒவ்வொரு மதிப்பையும் எவ்வாறு பெறுவது என்பதற்கான முழு விவரங்களுக்கு [சூழல் மாறிகள்](environment-variables.md) பார்க்கவும்.

---

## Netlify Functions இல்லாமல் இயக்குதல்

முன்-இறுதியில் (AQI டாஷ்போர்டு, வரைபடம், charts) மட்டும் வேலை செய்ய வேண்டும் என்றால், எந்த சூழல் மாறிகளும் Netlify அமைப்பும் தேவையில்லை:

```bash
# HTML கோப்பை நேரடியாக வழங்குங்கள்
npx serve .
# அல்லது
python3 -m http.server 8000
```

AQI டாஷ்போர்டு, வரைபடம் மற்றும் அனைத்து கிளையண்ட்-பக்க அம்சங்களும் வேலை செய்யும், ஏனெனில் WAQI API உலாவியிலிருந்து நேரடியாக அழைக்கப்படுகிறது. சமூக feeds மற்றும் மின்னஞ்சல் சுருக்கம் functions இல்லாமல் வேலை செய்யாது.

---

## Netlify Functions-ஐ உள்ளூரில் சோதிப்பது

```bash
# ஒரு குறிப்பிட்ட function-ஐ சோதனை payload-உடன் அழைக்கவும்
netlify functions:invoke air-query --payload '{"city":"delhi","question":"Is it safe to go for a run?"}'

# anomaly check-ஐ அழைக்கவும்
netlify functions:invoke anomaly-check

# feed status check-ஐ அழைக்கவும்
netlify functions:invoke feed-status
```

---

## Git Hooks

Repo-வில் `.githooks/`-ல் Git hooks உள்ளன:

- **pre-commit** — ஒவ்வொரு commit-க்கு முன் அடிப்படை lint சோதனைகளை இயக்குகிறது
- **commit-msg** — வழக்கமான commit செய்தி வடிவமைப்பை செயல்படுத்துகிறது

`npm run prepare` script (இது `git config core.hooksPath .githooks`-ஐ இயக்குகிறது) வழியாக hooks தானாக இயக்கப்படும்.

### Commit செய்தி வடிவமைப்பு

```
type(scope): short description

எடுத்துக்காட்டுகள்:
feat(dashboard): add PM10 toggle to city cards
fix(email): handle missing city in digest template
docs(readme): update setup instructions
```

---

## கிளை உத்தி

| கிளை | நோக்கம் |
|--------|---------|
| `main` | உற்பத்தி — [www.janvayu.in](https://www.janvayu.in)-க்கு தானாக வரிசைப்படுத்துகிறது |
| `feature/*` | புதிய அம்சங்கள் அல்லது உள்ளடக்க சேர்க்கைகள் |
| `fix/*` | பிழை திருத்தங்கள் |
| `docs/*` | ஆவண மாற்றங்கள் |

எப்போதும் `main`-லிருந்து கிளை பிரித்து, மீண்டும் இணைக்க pull request திறக்கவும். `main`-க்கு நேரடியாக push செய்ய வேண்டாம்.
