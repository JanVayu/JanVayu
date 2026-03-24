# தொழில்நுட்ப அடுக்கு கண்ணோட்டம்

JanVayu வேண்டுமென்றே குறைந்தபட்ச அடுக்கில் கட்டமைக்கப்பட்டுள்ளது — சூன்ய frontend frameworks, மூன்று npm dependencies மற்றும் serverless backend. இந்தப் பக்கம் பயன்படுத்தப்படும் ஒவ்வொரு தொழில்நுட்பத்தையும் ஏன் தேர்ந்தெடுக்கப்பட்டது என்பதையும் வரைபடமாக்குகிறது.

---

## ஒரு பார்வையில் அடுக்கு

| அடுக்கு | தொழில்நுட்பம் | நோக்கம் |
|-------|-----------|---------|
| **Frontend** | Vanilla HTML/CSS/JS | ஒற்றைப்பக்க பயன்பாடு (build படி இல்லை) |
| **Charts** | Chart.js (CDN) | AQI போக்கு காட்சிப்படுத்தல்கள் |
| **Maps** | Leaflet.js + OpenStreetMap (CDN) | ஊடாடும் நிலைய வரைபடங்கள் |
| **Backend** | Netlify Functions (Node.js 18) | Serverless API endpoints |
| **Cache** | Netlify Blobs | நிலையான JSON cache (strong consistency) |
| **Email** | Resend API | தினசரி AQI சுருக்க விநியோகம் |
| **AI** | Google Gemini 2.5 Flash | NL வினவல்கள், சுகாதார ஆலோசனை, முரண்பாடு கண்டறிதல் |
| **Hosting** | Netlify CDN | GitHub `main`-லிருந்து தானாக deploy |
| **CI** | GitHub Actions | இணைப்பு சோதனை, Dependabot |
| **Domain** | Netlify DNS | janvayu.in custom domain |
| **மேம்பாடு** | Claude Code (Anthropic) | AI-உதவி மேம்பாட்டு பணிப்பாய்வு |

---

## ஏன் இந்த அடுக்கு?

### சூன்ய-Framework Frontend

JanVayu-ன் பயனர்களில் இந்தியா முழுவதும் 2G இணைப்புகள் மற்றும் குறைந்த-தர Android சாதனங்களில் உள்ளவர்கள் அடங்குவர். React அல்லது Vue போன்ற framework ஒரு அம்சம் ஏற்றப்படுவதற்கு முன் 40-100 KB JavaScript-ஐ சேர்க்கும். அதற்கு பதிலாக:

- முழு app ஒரு `index.html` கோப்பு (inline CSS + JS)
- Transpilation இல்லை, bundling இல்லை, tree-shaking தேவையில்லை
- Deploy artefact = repo தானே
- அடிப்படை HTML/JS திறன்கள் கொண்ட எவரும் பங்களிக்கலாம்

### 3 npm Dependencies மட்டுமே

```json
{
  "@google/generative-ai": "^0.24.1",
  "@netlify/blobs": "^8.1.0",
  "resend": "^6.9.3"
}
```

மூன்றும் சர்வர்-பக்கம் மட்டுமே (Netlify Functions-ஆல் பயன்படுத்தப்படுகிறது). கிளையண்டுக்கு சூன்ய npm dependencies — Chart.js மற்றும் Leaflet.js CDN-லிருந்து ஏற்றப்படுகின்றன.

### Serverless Over Server

Netlify Functions நிரந்தர சர்வரின் தேவையை நீக்குகிறது. நன்மைகள்:
- சூன்ய ops சுமை (சர்வர் patching இல்லை, scaling இல்லை)
- Free tier JanVayu-ன் traffic-ஐ உள்ளடக்குகிறது
- தானாக HTTPS, CDN மற்றும் edge deployment
- Functions cold-start < 500ms-ல்

---

## விரிவான பிரிப்பு

| பிரிவு | பக்கம் |
|---------|------|
| Frontend (HTML/CSS/JS, Chart.js, Leaflet) | [Frontend அடுக்கு](frontend.md) |
| Backend (Netlify Functions, Blobs, Resend) | [Backend அடுக்கு](backend.md) |
| AI அடுக்கு (Gemini 2.5 Flash) | [AI அடுக்கு](ai-layer.md) |
| உள்கட்டமைப்பு (Netlify, GitHub, DNS) | [உள்கட்டமைப்பு](infrastructure.md) |
| மேம்பாட்டு கருவிகள் (Claude Code, Git hooks) | [மேம்பாட்டு கருவிகள்](dev-tooling.md) |
