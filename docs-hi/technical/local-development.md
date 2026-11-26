# लोकल डेवलपमेंट
## पूर्व आवश्यकताएँ
- [Node.js](https://nodejs.org/) 22.12 या उससे अधिक
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (`npm install -g netlify-cli`)
- एक [Resend](https://resend.com) अकाउंट — केवल तभी चाहिए जब आप ईमेल डाइजेस्ट फ़ीचर पर काम कर रहे हों
- एक [Groq Console](https://console.groq.com) अकाउंट — केवल AI फ़ीचर के लिए चाहिए
---
## सेटअप
```bash
# 1. रिपॉजिटरी क्लोन करें
git clone https://github.com/JanVayu/JanVayu.git
cd JanVayu

# 2. डिपेंडेंसीज़ इंस्टॉल करें
npm ci

# 3. एनवायरनमेंट वेरिएबल्स टेम्पलेट कॉपी करें
cp .env.example .env

# 4. अपने एनवायरनमेंट वेरिएबल्स भरें (नीचे देखें)
# अपनी वैल्यूज़ के साथ .env एडिट करें
# 5. लोकल डेवलपमेंट सर्वर स्टार्ट करें
netlify dev
```
साइट `http://localhost:8888` पर उपलब्ध होगी। Netlify Dev सर्वरलेस फ़ंक्शन्स को लोकली सर्व करता है।
---
## एनवायरनमेंट वेरिएबल्स
प्रोजेक्ट रूट में एक `.env` फ़ाइल बनाएँ (इसे gitignore किया गया है और कभी कमिट नहीं किया जाएगा):
```bash
# ईमेल डाइजेस्ट के लिए ज़रूरी
RESEND_API_KEY=your_resend_api_key
RESEND_FROM=digest@yourdomain.com

# Netlify Blobs (लोकल dev) के लिए ज़रूरी
BLOB_TOKEN=your_netlify_personal_access_token
NETLIFY_SITE_ID=your_netlify_site_id

# AI फ़ीचर के लिए ज़रूरी
GROQ_API_KEY=your_groq_api_key

# लाइव रीडिंग्स के लिए ज़रूरी (aqicn.org/data-platform/token पर मुफ़्त)
WAQI_TOKEN=your_waqi_token
```
`.env.example` में अभी `WAQI_TOKEN` शामिल नहीं है, इसलिए इसे खुद जोड़ें।
प्रत्येक वैल्यू कैसे प्राप्त करें, इसकी पूरी जानकारी के लिए [Environment Variables](environment-variables.md) देखें।
---
## Netlify फ़ंक्शन्स के बिना रन करना
यदि आपको केवल लेआउट, पैनल या स्टैटिक पेजों पर काम करना है, तो आपको किसी एनवायरनमेंट वेरिएबल या Netlify सेटअप की आवश्यकता नहीं है:
```bash
# HTML फ़ाइल को सीधे सर्व करें
npx serve .
# या
python3 -m http.server 8000
```
इस तरह लाइव रीडिंग्स लोड नहीं होती हैं। 27 October 2026 से पेज `waqi-proxy` फ़ंक्शन के माध्यम से WAQI तक पहुँचते हैं, इसलिए एक साधारण स्टैटिक सर्वर में लाइव AQI नहीं होता। होम पेज CPCB के दैनिक बुलेटिन पर वापस आ जाता है, जो एक स्टैटिक फ़ाइल (`data/cpcb-latest.json`) है। कोई भी अन्य चीज़ जो किसी फ़ंक्शन पर निर्भर है (रैंकिंग, मॉडल किया गया अनुमान, फ़ायर ट्रैकर, सोशल फ़ीड, ईमेल डाइजेस्ट, Ask JanVayu) `netlify dev` के बिना काम नहीं करेगी।
---
## Netlify फ़ंक्शन्स को लोकली टेस्ट करना
###
```bash
# एक टेस्ट पेलोड के साथ किसी विशिष्ट फ़ंक्शन को कॉल करें
netlify functions:invoke air-query --payload '{"city":"delhi","question":"Is it safe to go for a run?"}'
# विसंगति जाँच (anomaly check) को कॉल करें
netlify functions:invoke anomaly-check
# फ़ीड स्टेटस जाँच को कॉल करें
netlify functions:invoke feed-status
```
---
## टेस्ट और जाँच
```bash
npm test                         # test/ में यूनिट टेस्ट (node --test)
bash scripts/run-ci-checks.sh    # हर गेटिंग चेक जो CI रन करता है
```
`scripts/run-ci-checks.sh` को `scripts/list-ci-checks.py` द्वारा वर्कफ़्लो से जनरेट किया गया है। इसका ज़्यादातर हिस्सा कुछ ही सेकंड में पूरा हो जाता है। अंत में कंट्रास्ट गेट एक ब्राउज़र चलाता है और इसमें लगभग दो मिनट लगते हैं।
---
## Git Hooks
रिपॉजिटरी में `.githooks/` में Git hooks शामिल हैं:
- **pre-commit**: स्टेज की गई `.env` और क्रेडेंशियल फ़ाइलों को ब्लॉक करता है, `console.log` स्टेटमेंट्स के बारे में चेतावनी देता है, मर्ज कॉन्फ्लिक्ट मार्कर्स का पता लगाता है, और 500 KB से बड़ी फ़ाइलों पर चेतावनी देता है (यह लिंटर नहीं चलाता है)
- **commit-msg**: कमिट मैसेज प्रीफ़िक्स कन्वेंशन को लागू करता है
हुक्स को `npm run prepare` स्क्रिप्ट के माध्यम से स्वचालित रूप से सक्षम किया जाता है (जो `git config core.hooksPath .githooks` चलाता है)।
### कमिट मैसेज फ़ॉर्मेट
```
Prefix: short description
Allowed prefixes: Add, Fix, Update, Translate, Docs, Refactor, Test, CI, Chore, Merge
Examples:
Add: PM10 toggle to city cards
Fix: handle missing city in digest template
Docs: update setup instructions
```
`feat(dashboard): ...` जैसे conventional-commit स्टाइल मैसेज हुक द्वारा अस्वीकार कर दिए जाते हैं।
---
## ब्रांच रणनीति
| ब्रांच | उद्देश्य |
|--------|--------|
| `main` | प्रोडक्शन — [www.janvayu.in](https://www.janvayu.in) पर ऑटो-डिप्लॉय होता है |
| `feature/*` | नए फ़ीचर या कंटेंट जोड़ना |
| `fix/*` | बग फ़िक्स |
| `docs/*` | दस्तावेज़ीकरण (documentation) में बदलाव |
हमेशा `main` से ब्रांच बनाएँ और वापस मर्ज करने के लिए पुल रिक्वेस्ट खोलें। कभी भी सीधे `main` पर पुश न करें।
---
