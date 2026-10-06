# स्थानिक विकास

## पूर्वअटी

- [Node.js](https://nodejs.org/) 22.12 किंवा त्याहून अधिक
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (`npm install -g netlify-cli`)
- [Resend](https://resend.com) खाते — जर तुम्ही ईमेल डायजेस्ट फीचर्सवर काम करत असाल तरच आवश्यक
- [Groq Console](https://console.groq.com) खाते — फक्त AI फीचर्ससाठी आवश्यक

---

## सेटअप

```bash
# 1. रिपॉझिटरी क्लोन करा
git clone https://github.com/JanVayu/JanVayu.git
cd JanVayu

# 2. डिपेंडन्सीज इन्स्टॉल करा
npm install

# 3. एन्व्हायरन्मेंट व्हेरिएबल्स टेम्पलेट कॉपी करा
cp .env.example .env

# 4. तुमचे एन्व्हायरन्मेंट व्हेरिएबल्स भरा (खाली पहा)
# .env तुमच्या व्हॅल्यूजसह एडिट करा

# 5. लोकल डेव्हलपमेंट सर्व्हर सुरू करा
netlify dev
```

ही साईट `http://localhost:8888` वर उपलब्ध असेल. Netlify Dev सर्व्हरलेस फंक्शन्स स्थानिक पातळीवर सर्व्ह करते.

---

## एन्व्हायरन्मेंट व्हेरिएबल्स

प्रोजेक्टच्या रूटमध्ये एक `.env` फाईल तयार करा (ती gitignored आहे आणि कधीही कमिट केली जाणार नाही):

```bash
# ईमेल डायजेस्टसाठी आवश्यक
RESEND_API_KEY=your_resend_api_key
RESEND_FROM=digest@yourdomain.com

# Netlify Blobs (लोकल डेव्ह) साठी आवश्यक
BLOB_TOKEN=your_netlify_personal_access_token
NETLIFY_SITE_ID=your_netlify_site_id

# AI फीचर्ससाठी आवश्यक
GROQ_API_KEY=your_groq_api_key
```

प्रत्येक व्हॅल्यू कशी मिळवायची याच्या पूर्ण तपशीलासाठी [Environment Variables](environment-variables.md) पहा.

---

## Netlify फंक्शन्सशिवाय चालवणे

जर तुम्हाला फक्त फ्रंट-एंडवर (AQI डॅशबोर्ड, मॅप, चार्ट्स) काम करायचे असेल, तर तुम्हाला कोणत्याही एन्व्हायरन्मेंट व्हेरिएबल्स किंवा Netlify सेटअपची आवश्यकता नाही:

```bash
# HTML फाईल थेट सर्व्ह करा
npx serve .
# किंवा
python3 -m http.server 8000
```

AQI डॅशबोर्ड आणि मॅप ब्राउझरमध्ये WAQI API मधून थेट त्यांचा लाईव्ह AQI लोड करतात, त्यामुळे ते फंक्शन्सशिवाय काम करतात. जे काही फंक्शनवर अवलंबून आहे (रँकिंग्ज, फोरकास्ट, फायर ट्रॅकर, सोशल फीड्स, ईमेल डायजेस्ट) ते त्यांच्याशिवाय काम करणार नाही.

---

## Netlify फंक्शन्स स्थानिक पातळीवर टेस्ट करणे

```bash
# टेस्ट पेलोडसह विशिष्ट फंक्शन कॉल करा
netlify functions:invoke air-query --payload '{"city":"delhi","question":"Is it safe to go for a run?"}'

# ॲनोमली चेक कॉल करा
netlify functions:invoke anomaly-check

# फीड स्टेटस चेक कॉल करा
netlify functions:invoke feed-status
```

---

## Git Hooks

रिपॉझिटरीमध्ये `.githooks/` मध्ये Git hooks समाविष्ट आहेत:
- **pre-commit**: स्टेज केलेल्या `.env` आणि क्रेडेंशियल फाइल्स ब्लॉक करते, `console.log` स्टेटमेंट्सबद्दल चेतावणी देते, मर्ज कॉन्फ्लिक्ट मार्कर्स शोधते आणि 500 KB पेक्षा मोठ्या फाइल्सवर चेतावणी देते (हे लिंटर रन करत नाही)
- **commit-msg**: कमिट मेसेज प्रीफिक्स कन्व्हेन्शन लागू करते

`npm run prepare` स्क्रिप्टद्वारे हुक्स आपोआप सक्षम केले जातात (जी `git config core.hooksPath .githooks` रन करते).

### कमिट मेसेज फॉरमॅट

```
Prefix: short description

Allowed prefixes: Add, Fix, Update, Translate, Docs, Refactor, Test, CI, Chore

Examples:
Add: PM10 toggle to city cards
Fix: handle missing city in digest template
Docs: update setup instructions
```

`feat(dashboard): ...` सारखे conventional-commit स्टाईल मेसेजेस हुकद्वारे रिजेक्ट केले जातात.

---

## ब्रांच स्ट्रॅटेजी

| Branch | Purpose |
|--------|--------|
| `main` | प्रोडक्शन — [www.janvayu.in](https://www.janvayu.in) वर ऑटो-डिप्लॉय होते |
| `feature/*` | नवीन फीचर्स किंवा कंटेंट ॲडिशन्स |
| `fix/*` | बग फिक्सेस |
| `docs/*` | डॉक्युमेंटेशन बदल |

नेहमी `main` मधून ब्रांच करा आणि मर्ज करण्यासाठी पुल रिक्वेस्ट ओपन करा. `main` वर थेट पुश करू नका.
