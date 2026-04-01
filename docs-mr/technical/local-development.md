# स्थानिक विकास

## पूर्वतयारी

- [Node.js](https://nodejs.org/) 18 किंवा उच्च
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (`npm install -g netlify-cli`)
- [Resend](https://resend.com) अकाउंट — फक्त ईमेल डायजेस्ट वैशिष्ट्यांवर काम करत असाल तर आवश्यक
- [Google AI Studio](https://aistudio.google.com) अकाउंट — फक्त AI वैशिष्ट्यांसाठी आवश्यक

---

## सेटअप

```bash
# 1. रिपॉझिटरी क्लोन करा
git clone https://github.com/JanVayu/JanVayu.git
cd JanVayu

# 2. dependencies इन्स्टॉल करा
npm install

# 3. environment variables टेम्पलेट कॉपी करा
cp .env.example .env

# 4. तुमचे environment variables भरा (खाली पहा)
# .env तुमच्या मूल्यांसह संपादित करा

# 5. स्थानिक विकास सर्व्हर सुरू करा
netlify dev
```

साइट `http://localhost:8888` वर उपलब्ध होईल. Netlify Dev serverless functions स्थानिकपणे इम्युलेट करतो, scheduled functions आणि Blobs store यासह.

---

## Environment Variables

प्रकल्प रूटमध्ये `.env` फाइल तयार करा (ती gitignored आहे आणि कधीही commit केली जाणार नाही):

```bash
# ईमेल डायजेस्टसाठी आवश्यक
RESEND_API_KEY=your_resend_api_key
RESEND_FROM=digest@yourdomain.com

# Netlify Blobs साठी आवश्यक (स्थानिक dev)
BLOB_TOKEN=your_netlify_personal_access_token
NETLIFY_SITE_ID=your_netlify_site_id

# AI वैशिष्ट्यांसाठी आवश्यक
GEMINI_API_KEY=your_google_gemini_api_key
```

प्रत्येक मूल्य कसे मिळवायचे यासाठी [Environment Variables](environment-variables.md) पहा.

---

## Netlify Functions शिवाय चालवणे

जर तुम्हाला फक्त फ्रंट-एंडवर (AQI डॅशबोर्ड, नकाशा, चार्ट्स) काम करायचे असेल, तर तुम्हाला कोणत्याही environment variables किंवा Netlify सेटअपची गरज नाही:

```bash
# HTML फाइल थेट सर्व्ह करा
npx serve .
# किंवा
python3 -m http.server 8000
```

AQI डॅशबोर्ड, नकाशा आणि सर्व क्लायंट-साइड वैशिष्ट्ये काम करतील कारण WAQI API थेट ब्राउझरमधून कॉल केला जातो. सोशल फीड्स आणि ईमेल डायजेस्ट functions शिवाय काम करणार नाहीत.

---

## Netlify Functions स्थानिकपणे चाचणी करणे

```bash
# विशिष्ट function टेस्ट पेलोडसह इनव्होक करा
netlify functions:invoke air-query --payload '{"city":"delhi","question":"Is it safe to go for a run?"}'

# anomaly check इनव्होक करा
netlify functions:invoke anomaly-check

# feed status check इनव्होक करा
netlify functions:invoke feed-status
```

---

## Git Hooks

रिपोमध्ये `.githooks/` मध्ये Git hooks आहेत:

- **pre-commit** — प्रत्येक commit पूर्वी मूलभूत lint तपासण्या चालवतो
- **commit-msg** — conventional commit message format लागू करतो

Hooks `npm run prepare` स्क्रिप्टद्वारे स्वयंचलितपणे सक्षम केले जातात (जे `git config core.hooksPath .githooks` चालवते).

### Commit Message Format

```
type(scope): short description

उदाहरणे:
feat(dashboard): add PM10 toggle to city cards
fix(email): handle missing city in digest template
docs(readme): update setup instructions
```

---

## शाखा धोरण

| शाखा | उद्देश |
|--------|--------|
| `main` | उत्पादन — [www.janvayu.in](https://www.janvayu.in) वर ऑटो-डिप्लॉय |
| `feature/*` | नवीन वैशिष्ट्ये किंवा सामग्री भर |
| `fix/*` | बग फिक्सेस |
| `docs/*` | दस्तऐवज बदल |

नेहमी `main` वरून शाखा तयार करा आणि परत मर्ज करण्यासाठी pull request उघडा. `main` वर कधीही थेट push करू नका.
