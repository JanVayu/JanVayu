# लोकल डेवलपमेंट

## पूर्व आवश्यकताएं

- [Node.js](https://nodejs.org/) 22.12 या इससे अधिक
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (`npm install -g netlify-cli`)
- एक [Resend](https://resend.com) अकाउंट — केवल तभी चाहिए जब आप ईमेल डाइजेस्ट फीचर्स पर काम कर रहे हों
- एक [Groq Console](https://console.groq.com) अकाउंट — केवल AI फीचर्स के लिए चाहिए

---

## सेटअप

```bash
# 1. रिपॉजिटरी क्लोन करें
git clone https://github.com/JanVayu/JanVayu.git
cd JanVayu

# 2. डिपेंडेंसीज़ इंस्टॉल करें
npm install

# 3. एनवायरनमेंट वेरिएबल्स टेम्पलेट कॉपी करें
cp .env.example .env

# 4. अपने एनवायरनमेंट वेरिएबल्स भरें (नीचे देखें)
# अपनी वैल्यूज़ के साथ .env फ़ाइल एडिट करें

# 5. लोकल डेवलपमेंट सर्वर शुरू करें
netlify dev
```

साइट `http://localhost:8888` पर उपलब्ध होगी। Netlify Dev सर्वरलेस फ़ंक्शन्स को लोकली सर्व करता है।

---

## एनवायरनमेंट वेरिएबल्स

प्रोजेक्ट रूट में एक `.env` फ़ाइल बनाएं (इसे gitignore किया गया है और कभी कमिट नहीं किया जाएगा):

```bash
# ईमेल डाइजेस्ट के लिए आवश्यक
RESEND_API_KEY=your_resend_api_key
RESEND_FROM=digest@yourdomain.com

# Netlify Blobs (लोकल dev) के लिए आवश्यक
BLOB_TOKEN=your_netlify_personal_access_token
NETLIFY_SITE_ID=your_netlify_site_id

# AI फीचर्स के लिए आवश्यक
GROQ_API_KEY=your_groq_api_key
```

हर वैल्यू कैसे प्राप्त करें, इसकी पूरी जानकारी के लिए [Environment Variables](environment-variables.md) देखें।

---

## Netlify फ़ंक्शन्स के बिना चलाना

अगर आपको केवल फ्रंट-एंड (AQI डैशबोर्ड, मैप, चार्ट) पर काम करना है, तो आपको किसी एनवायरनमेंट वेरिएबल या Netlify सेटअप की आवश्यकता नहीं है:

```bash
# HTML फ़ाइल को सीधे सर्व करें
npx serve .
# या
python3 -m http.server 8000
```

AQI डैशबोर्ड और मैप ब्राउज़र में सीधे WAQI API से अपना लाइव AQI लोड करते हैं, इसलिए वे फ़ंक्शन्स के बिना काम करते हैं। कोई भी चीज़ जो किसी फ़ंक्शन पर निर्भर करती है (रैंकिंग, फ़ोरकास्ट, फ़ायर ट्रैकर, सोशल फ़ीड, ईमेल डाइजेस्ट) उनके बिना काम नहीं करेगी।

---

## Netlify फ़ंक्शन्स को लोकली टेस्ट करना

```bash
# टेस्ट पेलोड के साथ एक विशिष्ट फ़ंक्शन को इन्वोक करें
netlify functions:invoke air-query --payload '{"city":"delhi","question":"Is it safe to go for a run?"}'

# एनोमली चेक को इन्वोक करें
netlify functions:invoke anomaly-check

# फ़ीड स्टेटस चेक को इन्वोक करें
netlify functions:invoke feed-status
```

---

## Git Hooks

रिपॉजिटरी में `.githooks/` में Git हुक्स शामिल हैं:
- **pre-commit**: स्टेज की गई `.env` और क्रेडेंशियल फ़ाइलों को ब्लॉक करता है, `console.log` स्टेटमेंट्स के बारे में चेतावनी देता है, मर्ज कॉन्फ्लिक्ट मार्कर्स का पता लगाता है, और 500 KB से बड़ी फ़ाइलों पर चेतावनी देता है (यह लंटर नहीं चलाता है)
- **commit-msg**: कमिट मैसेज प्रीफ़िक्स कन्वेंशन को लागू करता है

हुक्स `npm run prepare` स्क्रिप्ट के ज़रिए अपने आप इनेबल हो जाते हैं (जो `git config core.hooksPath .githooks` चलाता है)।

### कमिट मैसेज फ़ॉर्मेट

```
Prefix: short description

Allowed prefixes: Add, Fix, Update, Translate, Docs, Refactor, Test, CI, Chore

Examples:
Add: PM10 toggle to city cards
Fix: handle missing city in digest template
Docs: update setup instructions
```

कन्वेंशनल-कमिट स्टाइल मैसेज जैसे `feat(dashboard): ...` को हुक द्वारा रिजेक्ट कर दिया जाता है।

---

## ब्रांच स्ट्रेटेजी

| ब्रांच | उद्देश्य |
|--------|--------|
| `main` | प्रोडक्शन — [www.janvayu.in](https://www.janvayu.in) पर ऑटो-डिप्लॉय होता है |
| `feature/*` | नए फ़ीचर्स या कंटेंट जोड़ना |
| `fix/*` | बग फिक्स |
| `docs/*` | डॉक्यूमेंटेशन में बदलाव |

हमेशा `main` से ब्रांच बनाएं और वापस मर्ज करने के लिए पुल रिक्वेस्ट खोलें। कभी भी सीधे `main` पर पुश न करें।
