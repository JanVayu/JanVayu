# உள்ளூர் மேம்பாடு
## முன்நிபந்தனைகள்
- [Node.js](https://nodejs.org/) 22.12 அல்லது அதற்கு மேல்
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (`npm install -g netlify-cli`)
- ஒரு [Resend](https://resend.com) கணக்கு — மின்னஞ்சல் டைஜஸ்ட் அம்சங்களில் வேலை செய்தால் மட்டுமே தேவைப்படும்
- ஒரு [Groq Console](https://console.groq.com) கணக்கு — AI அம்சங்களுக்கு மட்டுமே தேவைப்படும்
---
## அமைப்பு
```bash
# 1. களஞ்சியத்தை குளோன் செய்யவும்
git clone https://github.com/JanVayu/JanVayu.git
cd JanVayu
# 2. சார்புகளை நிறுவவும்
npm ci
# 3. சுற்றுச்சூழல் மாறிகளின் வார்ப்புருவை நகலெடுக்கவும்
cp .env.example .env
# 4. உங்கள் சுற்றுச்சூழல் மாறிகளை நிரப்பவும் (கீழே காண்க)
# உங்கள் மதிப்புகளுடன் .env ஐ திருத்தவும்
# 5. உள்ளூர் மேம்பாட்டு சேவையகத்தை தொடங்கவும்
netlify dev
```
இந்த தளம் `http://localhost:8888` இல் கிடைக்கும். Netlify Dev சேவையற்ற செயல்பாடுகளை உள்ளூரிலேயே வழங்குகிறது.
---
## சுற்றுச்சூழல் மாறிகள்
திட்டத்தின் மூலத்தில் ஒரு `.env` கோப்பை உருவாக்கவும் (இது gitignored செய்யப்பட்டுள்ளது, எனவே ஒருபோதும் commit செய்யப்படாது):
```bash
# மின்னஞ்சல் டைஜெஸ்ட்டுக்கு தேவை
RESEND_API_KEY=your_resend_api_key
RESEND_FROM=digest@yourdomain.com
# Netlify Blobs (உள்ளூர் மேம்பாடு) க்கு தேவை
BLOB_TOKEN=your_netlify_personal_access_token
NETLIFY_SITE_ID=your_netlify_site_id
# AI அம்சங்களுக்கு தேவை
GROQ_API_KEY=your_groq_api_key
# நேரடி அளவீடுகளுக்கு தேவை (aqicn.org/data-platform/token இல் இலவசம்)
WAQI_TOKEN=your_waqi_token
```
`.env.example` இல் இன்னும் `WAQI_TOKEN` இல்லை, எனவே அந்த வரியை நீங்களே சேர்க்கவும்.
ஒவ்வொரு மதிப்பையும் எவ்வாறு பெறுவது என்பது குறித்த முழு விவரங்களுக்கும் [Environment Variables](environment-variables.md) ஐப் பார்க்கவும்.
---
## Netlify செயல்பாடுகள் இல்லாமல் இயக்குதல்
வடிவமைப்பு, பேனல்கள் அல்லது நிலையான பக்கங்களில் மட்டுமே நீங்கள் வேலை செய்ய வேண்டும் என்றால், உங்களுக்கு எந்த சுற்றுச்சூழல் மாறிகளோ அல்லது Netlify அமைப்போ தேவையில்லை:
```bash
# HTML கோப்பை நேரடியாக வழங்கவும்
npx serve .
# அல்லது
python3 -m http.server 8000
```
இந்த வழியில் நேரடி அளவீடுகள் ஏற்றப்படாது. 27 October 2026 முதல் பக்கங்கள் `waqi-proxy` செயல்பாடு வழியாக WAQI ஐ அடைகின்றன, எனவே ஒரு சாதாரண நிலையான சேவையகத்தில் நேரடி AQI இல்லை. முகப்புப் பக்கம் CPCB இன் தினசரி செய்திமடலுக்கு மாறுகிறது, இது ஒரு நிலையான கோப்பு (`data/cpcb-latest.json`). ஒரு செயல்பாட்டைச் சார்ந்திருக்கும் வேறு எதுவும் (தரவரிசைகள், மாதிரியாக்கப்பட்ட மதிப்பீடு, தீ கண்காணிப்பாளர், சமூக ஊடகங்கள், மின்னஞ்சல் டைஜஸ்ட், Ask JanVayu) `netlify dev` இல்லாமல் வேலை செய்யாது.
---
## Netlify செயல்பாடுகளை உள்ளூரில் சோதித்தல்
###
```bash
# ஒரு சோதனை payload உடன் குறிப்பிட்ட function-ஐ அழைக்கவும்
netlify functions:invoke air-query --payload '{"city":"delhi","question":"Is it safe to go for a run?"}'
# முரண்பாடு சோதனையை (anomaly check) அழைக்கவும்
netlify functions:invoke anomaly-check
# feed status சோதனையை அழைக்கவும்
netlify functions:invoke feed-status
```
---
## சோதனைகள் மற்றும் சரிபார்ப்புகள்
```bash
npm test                         # test/ இல் உள்ள unit tests (node --test)
bash scripts/run-ci-checks.sh    # CI இயக்கும் அனைத்து gating check-களும்
```
`scripts/run-ci-checks.sh` ஆனது `scripts/list-ci-checks.py` மூலம் workflows-லிருந்து உருவாக்கப்படுகிறது. இதில் பெரும்பாலானவை சில வினாடிகளிலேயே முடிந்துவிடும். முடிவில் உள்ள contrast gate ஒரு browser-ஐ இயக்குகிறது, இதற்கு சுமார் 2 நிமிடங்கள் ஆகும்.
---
## Git Hooks
இந்த repo-வில் `.githooks/` இல் Git hooks உள்ளன:
- **pre-commit**: stage செய்யப்பட்ட `.env` மற்றும் credential கோப்புகளைத் தடுக்கிறது, `console.log` statements பற்றி எச்சரிக்கிறது, merge conflict markers-ஐக் கண்டறிகிறது, மேலும் 500 KB-க்கும் பெரிய கோப்புகள் இருந்தால் எச்சரிக்கிறது (இது linter-ஐ இயக்காது)
- **commit-msg**: commit message prefix மரபை கட்டாயமாக்குகிறது
`npm run prepare` script மூலம் Hooks தானாகவே இயக்கப்படும் (இது `git config core.hooksPath .githooks` ஐ இயக்கும்).
### Commit Message Format
```
Prefix: சுருக்கமான விளக்கம்
Allowed prefixes: Add, Fix, Update, Translate, Docs, Refactor, Test, CI, Chore, Merge
Examples:
Add: PM10 toggle to city cards
Fix: handle missing city in digest template
Docs: update setup instructions
```
`feat(dashboard): ...` போன்ற Conventional-commit style செய்திகளை இந்த hook நிராகரிக்கும்.
---
## Branch Strategy
| Branch | Purpose |
|--------|--------|
| `main` | Production — [www.janvayu.in](https://www.janvayu.in) க்கு தானாகவே deploy ஆகும் |
| `feature/*` | புதிய அம்சங்கள் அல்லது உள்ளடக்கச் சேர்த்தல்கள் |
| `fix/*` | Bug fixes |
| `docs/*` | Documentation மாற்றங்கள் |
எப்போதும் `main`-லிருந்து branch உருவாக்கி, மீண்டும் merge செய்ய ஒரு pull request-ஐத் திறக்கவும். நேரடியாக `main`-க்கு push செய்ய வேண்டாம்.
