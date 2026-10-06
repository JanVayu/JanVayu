# உள்ளூர் மேம்பாடு

## முன்நிபந்தனைகள்

- [Node.js](https://nodejs.org/) 22.12 அல்லது அதற்கு மேல்
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (`npm install -g netlify-cli`)
- ஒரு [Resend](https://resend.com) கணக்கு — மின்னஞ்சல் digest அம்சங்களில் வேலை செய்தால் மட்டுமே தேவை
- ஒரு [Groq Console](https://console.groq.com) கணக்கு — AI அம்சங்களுக்கு மட்டுமே தேவை

---

## அமைப்பு

```bash
# 1. களஞ்சியத்தை clone செய்யவும்
git clone https://github.com/JanVayu/JanVayu.git
cd JanVayu

# 2. சார்புகளை நிறுவவும்
npm install

# 3. சூழல் மாறிகள் template-ஐ நகலெடுக்கவும்
cp .env.example .env

# 4. உங்கள் சூழல் மாறிகளை நிரப்பவும் (கீழே பார்க்கவும்)
# உங்கள் மதிப்புகளுடன் .env-ஐ edit செய்யவும்

# 5. உள்ளூர் மேம்பாட்டு சேவையகத்தை தொடங்கவும்
netlify dev
```

இந்த தளம் `http://localhost:8888` என்ற முகவரியில் கிடைக்கும். Netlify Dev சேவையகம் இல்லாத செயல்பாடுகளை (serverless functions) உள்ளூரிலேயே வழங்குகிறது.

---

## சூழல் மாறிகள்

Project root-ல் ஒரு `.env` கோப்பை உருவாக்கவும் (இது gitignored செய்யப்பட்டுள்ளது, எனவே எப்போதுமே commit செய்யப்படாது):

```bash
# மின்னஞ்சல் digest-க்கு தேவை
RESEND_API_KEY=your_resend_api_key
RESEND_FROM=digest@yourdomain.com

# Netlify Blobs (உள்ளூர் மேம்பாடு)-க்கு தேவை
BLOB_TOKEN=your_netlify_personal_access_token
NETLIFY_SITE_ID=your_netlify_site_id

# AI அம்சங்களுக்கு தேவை
GROQ_API_KEY=your_groq_api_key
```

ஒவ்வொரு மதிப்பையும் பெறுவதற்கான முழு விவரங்களுக்கும் [Environment Variables](environment-variables.md) பார்க்கவும்.

---

## Netlify Functions இல்லாமல் இயக்குதல்

நீங்கள் front-end (AQI dashboard, map, charts) மட்டுமே வேலை செய்ய வேண்டும் என்றால், உங்களுக்கு எந்த சூழல் மாறிகளோ அல்லது Netlify அமைப்போ தேவையில்லை:

```bash
# HTML கோப்பை நேரடியாக வழங்கவும்
npx serve .
# அல்லது
python3 -m http.server 8000
```

AQI dashboard மற்றும் map அவற்றின் நேரடி AQI-ஐ browser-ல் உள்ள WAQI API-லிருந்து நேரடியாகப் பெறுகின்றன, எனவே அவை functions இல்லாமல் வேலை செய்யும். ஒரு function-ஐச் சார்ந்திருக்கும் எந்தவொரு அம்சமும் (rankings, forecast, fire tracker, social feeds, email digest) அவை இல்லாமல் வேலை செய்யாது.

---

## Netlify Functions-ஐ உள்ளூரில் சோதித்தல்

```bash
# சோதனை payload-உடன் ஒரு குறிப்பிட்ட function-ஐ அழைக்கவும்
netlify functions:invoke air-query --payload '{"city":"delhi","question":"Is it safe to go for a run?"}'

# anomaly check-ஐ அழைக்கவும்
netlify functions:invoke anomaly-check

# feed status check-ஐ அழைக்கவும்
netlify functions:invoke feed-status
```

---

## Git Hooks

Repo-வில் `.githooks/`-ல் Git hooks உள்ளன:
- **pre-commit**: ஸ்டேஜ் செய்யப்பட்ட `.env` மற்றும் சான்றுகள் (credential) கோப்புகளைத் தடுக்கிறது, `console.log` ஸ்டேட்மென்ட்களைப் பற்றி எச்சரிக்கிறது, மெர்ஜ் கான்ஃப்ளிக்ட் (merge conflict) மார்க்கர்களைக் கண்டறிகிறது, மேலும் 500 KB-க்கும் பெரிய கோப்புகளுக்கு எச்சரிக்கை விடுக்கிறது (இது லின்டரை (linter) ரன் செய்யாது)
- **commit-msg**: கமிட் மெசேஜ் ப்ரிஃபிக்ஸ் (prefix) முறையைப் பின்பற்றச் செய்கிறது

`npm run prepare` ஸ்கிரிப்ட் மூலம் ஹூக்குகள் (Hooks) தானாகவே இயங்கும் (இது `git config core.hooksPath .githooks` என்பதை ரன் செய்யும்).

### கமிட் மெசேஜ் ஃபார்மேட்

```
Prefix: short description

Allowed prefixes: Add, Fix, Update, Translate, Docs, Refactor, Test, CI, Chore

Examples:
Add: PM10 toggle to city cards
Fix: handle missing city in digest template
Docs: update setup instructions
```

`feat(dashboard): ...` போன்ற Conventional-commit ஸ்டைல் மெசேஜ்களை இந்த ஹூக் நிராகரிக்கும்.

---

## பிரான்ச் ஸ்ட்ராட்டஜி

| Branch | Purpose |
|--------|--------|
| `main` | புரொடக்‌ஷன் — [www.janvayu.in](https://www.janvayu.in)-க்கு தானாகவே டிப்ளாய் ஆகும் |
| `feature/*` | புதிய அம்சங்கள் அல்லது புதிய கன்டென்ட் சேர்த்தல் |
| `fix/*` | பக் (Bug) ஃபிக்ஸ்கள் |
| `docs/*` | டாக்குமென்டேஷன் மாற்றங்கள் |

எப்போதும் `main`-லிருந்து பிரான்ச் (branch) உருவாக்கி, மீண்டும் மெர்ஜ் (merge) செய்ய ஒரு புல் ரெக்வெஸ்ட்டை (pull request) ஓபன் செய்யவும். நேரடியாக `main`-ல் புஷ் (push) செய்ய வேண்டாம்.
