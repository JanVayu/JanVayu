# स्थानिक विकास
## पूर्वअटी
- [Node.js](https://nodejs.org/) 22.12 किंवा त्याहून अधिक आवृत्ती
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (`npm install -g netlify-cli`)
- एक [Resend](https://resend.com) खाते — हे फक्त तुम्हाला ईमेल डायजेस्ट वैशिष्ट्यांवर काम करायचे असल्यास आवश्यक आहे
- एक [Groq Console](https://console.groq.com) खाते — हे फक्त AI वैशिष्ट्यांसाठी आवश्यक आहे
---
## सेटअप
```bash
# 1. रिपॉझिटरी क्लोन करा
git clone https://github.com/JanVayu/JanVayu.git
cd JanVayu
# 2. डिपेंडन्सीज इन्स्टॉल करा
npm ci
# 3. एन्व्हायर्नमेंट व्हेरिएबल्स टेम्पलेट कॉपी करा
cp .env.example .env
# 4. तुमचे एन्व्हायर्नमेंट व्हेरिएबल्स भरा (खाली पहा)
# .env फाईलमध्ये तुमच्या व्हॅल्यूज टाका
# 5. स्थानिक विकास सर्व्हर सुरू करा
netlify dev
```
ही साईट `http://localhost:8888` वर उपलब्ध होईल. Netlify Dev सर्व्हरलेस फंक्शन्स स्थानिक पातळीवर सर्व्ह करते.
---
## एन्व्हायर्नमेंट व्हेरिएबल्स
प्रोजेक्टच्या रूटमध्ये एक `.env` फाईल तयार करा (ती gitignored आहे आणि कधीही कमिट केली जाणार नाही):
```bash
# ईमेल डायजेस्टसाठी आवश्यक
RESEND_API_KEY=your_resend_api_key
RESEND_FROM=digest@yourdomain.com
# Netlify Blobs (स्थानिक dev) साठी आवश्यक
BLOB_TOKEN=your_netlify_personal_access_token
NETLIFY_SITE_ID=your_netlify_site_id
# AI वैशिष्ट्यांसाठी आवश्यक
GROQ_API_KEY=your_groq_api_key
# लाईव्ह रीडिंगसाठी आवश्यक (aqicn.org/data-platform/token वर मोफत)
WAQI_TOKEN=your_waqi_token
```
`.env.example` मध्ये अद्याप `WAQI_TOKEN` दिलेला नाही, त्यामुळे ती ओळ तुम्ही स्वतः जोडा.
प्रत्येक व्हॅल्यू कशी मिळवायची याच्या संपूर्ण तपशीलांसाठी [Environment Variables](environment-variables.md) पहा.
---
## Netlify फंक्शन्सशिवाय चालवणे
जर तुम्हाला फक्त लेआउट, पॅनल्स किंवा स्टॅटिक पेजेसवर काम करायचे असेल, तर तुम्हाला कोणत्याही एन्व्हायर्नमेंट व्हेरिएबल्सची किंवा Netlify सेटअपची आवश्यकता नाही:
```bash
# HTML फाईल थेट सर्व्ह करा
npx serve .
# किंवा
python3 -m http.server 8000
```
या पद्धतीने लाईव्ह रीडिंग लोड होत नाहीत. 27 October 2026 पासून पेजेस `waqi-proxy` फंक्शनद्वारे WAQI पर्यंत पोहोचतात, त्यामुळे साध्या स्टॅटिक सर्व्हरवर लाईव्ह AQI नसते. होम पेज CPCB च्या दैनंदिन बुलेटिनवर फॉलबॅक होते, जी एक स्टॅटिक फाईल (`data/cpcb-latest.json`) आहे. फंक्शनवर अवलंबून असलेले इतर काहीही (रँकिंग्ज, मॉडेल केलेले अंदाज, फायर ट्रॅकर, सोशल फीड्स, ईमेल डायजेस्ट, Ask JanVayu) `netlify dev` शिवाय काम करणार नाही.
---
## स्थानिक पातळीवर Netlify फंक्शन्सची चाचणी करणे
###
```bash
# एका विशिष्ट फंक्शनला टेस्ट पेलोडसह कॉल करा
netlify functions:invoke air-query --payload '{"city":"delhi","question":"Is it safe to go for a run?"}'
# विसंगती तपासणी (anomaly check) कॉल करा
netlify functions:invoke anomaly-check
# फीड स्टेटस तपासणी कॉल करा
netlify functions:invoke feed-status
```
---
## चाचण्या आणि तपासण्या
```bash
npm test                         # test/ मधील युनिट टेस्ट्स (node --test)
bash scripts/run-ci-checks.sh    # CI द्वारे केल्या जाणाऱ्या सर्व गेटिंग तपासण्या
```
`scripts/run-ci-checks.sh` हे `scripts/list-ci-checks.py` द्वारे वर्कफ्लोमधून तयार केले जाते. यातील बहुतांश काम काही सेकंदांत पूर्ण होते. शेवटी असलेला कॉन्ट्रास्ट गेट ब्राउझर चालवतो आणि त्याला सुमारे दोन मिनिटे लागतात.
---
## Git Hooks
या रिपॉझिटरीमध्ये `.githooks/` मध्ये Git hooks समाविष्ट आहेत:
- **pre-commit**: स्टेज केलेल्या `.env` आणि क्रेडेंशियल फाइल्स ब्लॉक करते, `console.log` स्टेटमेंट्सबद्दल इशारा देते, मर्ज कॉन्फ्लिक्ट मार्कर्स शोधते आणि 500 KB पेक्षा मोठ्या फाइल्सवर इशारा देते (हे लिंटर चालवत नाही)
- **commit-msg**: कमिट मेसेज प्रीफिक्स पद्धत लागू करते
`npm run prepare` स्क्रिप्टद्वारे (जी `git config core.hooksPath .githooks` चालवते) हुक्स आपोआप सक्षम केले जातात.
### कमिट मेसेज स्वरूप
```
Prefix: संक्षिप्त वर्णन
अनुमत प्रीफिक्स: Add, Fix, Update, Translate, Docs, Refactor, Test, CI, Chore, Merge
उदाहरणे:
Add: शहर कार्ड्सवर PM10 टॉगल
Fix: डायजेस्ट टेम्पलेटमध्ये शहर नसल्यास हाताळणे
Docs: सेटअप सूचना अपडेट करणे
```
`feat(dashboard): ...` सारखे कन्व्हेन्शनल-कमिट स्टाईल मेसेजेस हुकद्वारे नाकारले जातात.
---
## ब्रांच स्ट्रॅटेजी
| ब्रांच | उद्देश |
|--------|--------|
| `main` | प्रोडक्शन — [www.janvayu.in](https://www.janvayu.in) वर आपोआप डिप्लॉय होते |
| `feature/*` | नवीन फीचर्स किंवा कंटेंट ॲडिशन्स |
| `fix/*` | बग फिक्सेस |
| `docs/*` | डॉक्युमेंटेशनमधील बदल |
नेहमी `main` मधून ब्रांच करा आणि मर्ज करण्यासाठी पुल रिक्वेस्ट उघडा. `main` वर थेट पुश करू नका.
