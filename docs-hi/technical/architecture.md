# आर्किटेक्चर

JanVayu एक **zero-framework, single-page application** है जिसे Netlify पर डिप्लॉय किया गया है। इसमें डेटा प्रॉक्सींग, कैशिंग और शेड्यूल्ड टास्क के लिए server-side serverless functions का इस्तेमाल किया गया है।

---

## सिस्टम डायग्राम

```
┌─────────────────────────────────────────────────────────┐
│                     Client (Browser)                    │
│  HTML + CSS + JS · Chart.js · Leaflet.js · WAQI API    │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTPS (Netlify CDN)
┌──────────────────────────▼──────────────────────────────┐
│                   Netlify Functions                      │
│                                                          │
│  Scheduled (cron)              On-demand (API)           │
│  ┌──────────────────┐   ┌───────────────────────────┐   │
│  │ scheduled-fetch   │   │ reddit-feed.js            │   │
│  │ (every 4 hours)   │   │ youtube-feed.js           │   │
│  │                   │   │ news-proxy.js             │   │
│  │ daily-digest      │   │ instagram-feed.js         │   │
│  │ (8 AM IST daily)  │   │ feed-status.js            │   │
│  │                   │   │ subscribe.js              │   │
│  │ health-monitor    │   │ air-query.mjs             │   │
│  │ (every 15 min)    │   │ health-advisory.mjs       │   │
│  │ push-send (3 h)   │   │ accountability-brief.mjs  │   │
│  │ feed-health       │   │ anomaly-check.mjs         │   │
│  │ (daily)           │   │ ...and others (see below) │   │
│  └────────┬──────────┘   └─────────────┬─────────────┘   │
│           ▼                                              │
│  ┌──────────────────────────────────────────────────┐    │
│  │           Netlify Blobs (Cache)                   │    │
│  │  Feeds cached as JSON · Strong consistency        │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │         Resend (Email Delivery)                   │    │
│  │  Daily AQI digest to subscribers                  │    │
│  └──────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
    WAQI API           Groq API       External Feeds
  (Real-time AQI)    (AI features)  (Reddit, News)
```

---

## प्रमुख डिज़ाइन निर्णय


---
### स्टैटिक फ्रंट-एंड, कोई बंडलर नहीं
फ्रंट-एंड में `index.html` के साथ `styles.css`, `app.js`, `games.js` और `panels/` में 19 लेज़ी-लोडेड पैनल फ्रैगमेंट्स शामिल हैं। इसमें कोई बंडलर और कोई फ्रेमवर्क नहीं है (देखें [Frontend Stack](../tech-stack/frontend.md))। इससे बेसिक HTML/JS स्किल्स वाले योगदानकर्ताओं के लिए कोडबेस को समझना आसान हो जाता है और बिल्ड-टाइम की जटिलता लगभग शून्य रहती है।

### सर्वर-साइड प्रॉक्सीइंग
CORS समस्याओं से बचने और API कीज़ को सुरक्षित रखने के लिए सोशल मीडिया और न्यूज़ API को Netlify Functions के ज़रिए फेच किया जाता है। क्लाइंट कभी भी सीधे इन API को एक्सेस नहीं करता है।

### ब्लॉब कैशिंग
`scheduled-fetch.mjs` फ़ंक्शन हर 4 घंटे में चलता है और फीड डेटा (Reddit, न्यूज़; Instagram को आज़माया जाता है और आमतौर पर कुछ नहीं मिलता) को Netlify Blobs में लिखता है। जब यूज़र्स फीड्स की रिक्वेस्ट करते हैं, तो ऑन-डिमांड फ़ंक्शन्स कैश से तुरंत सर्व करते हैं — जिससे लेटेंसी और API रेट लिमिट्स की समस्या खत्म हो जाती है।

### क्लाइंट-साइड AQI
WAQI API को हर 10 मिनट में सीधे ब्राउज़र से कॉल किया जाता है। टोकन WAQI द्वारा उनकी terms of service के तहत जारी किया जाता है और यह क्लाइंट कोड में दिखाई देता है। इसका मतलब है कि रियल-टाइम AQI डेटा बिना किसी सर्वर-साइड इंफ्रास्ट्रक्चर के काम करता है।

### कोई फ्रेमवर्क नहीं, कोई बिल्ड स्टेप नहीं
कोई `npm run build` नहीं है, कोई Webpack नहीं है, कोई React नहीं है। एकमात्र बिल्ड कमांड `node scripts/bump-version.mjs` है, जो वर्ज़न को अपडेट करता है, और डिप्लॉय आर्टिफैक्ट रिपॉजिटरी ही होती है। Netlify रूट से `index.html` सर्व करता है।

---

## ऑटो-अपडेट शेड्यूल

| टास्क | फ्रीक्वेंसी | फ़ंक्शन |
|------|-----------|----------|
| सोशल/न्यूज़ फीड रिफ्रेश | हर 4 घंटे में | `scheduled-fetch.mjs` |
| डेली AQI ईमेल डाइजेस्ट | रोज़ सुबह 8:00 बजे IST | `daily-digest.mjs` |
| लाइव AQI डैशबोर्ड | हर 10 मिनट में | क्लाइंट-साइड JS (WAQI API) |
| एनोमली डिटेक्शन | ऑन-डिमांड | `anomaly-check.mjs` |
| अपटाइम और फ़ंक्शन हेल्थ चेक | हर 15 मिनट में | `health-monitor.mjs` |
| वेब पुश नोटिफिकेशन्स | हर 3 घंटे में | `push-send.mjs` |
| फीड हेल्थ चेक | रोज़ | `feed-health.mjs` |

---

## फ़ाइल स्ट्रक्चर
```
JanVayu/
├── index.html                    # SPA शेल (साथ ही styles.css, app.js, games.js, panels/)
├── favicon.svg
├── package.json                  # Node.js डिपेंडेंसीज़ (Netlify Blobs, Resend, web-push)
├── netlify.toml                  # बिल्ड और डिप्लॉय कॉन्फ़िगरेशन
├── CNAME                         # कस्टम डोमेन
├── docs/                         # यह डॉक्यूमेंटेशन (Docsify)
├── downloads/                    # डाउनलोड करने योग्य रिपोर्ट्स (PDF, PPTX, DOCX)
└── netlify/
    └── functions/
        ├── scheduled-fetch.mjs   # क्रॉन: सभी फीड्स, हर 4 घंटे
        ├── daily-digest.mjs      # क्रॉन: ईमेल डाइजेस्ट, सुबह 8 बजे IST
        ├── reddit-feed.js        # API: कैश्ड Reddit पोस्ट्स
        ├── twitter-feed.js       # API: बंद कर दिया गया — Nitter का इस्तेमाल करें, जिसके पब्लिक इंस्टेंस अब नहीं हैं
        ├── news-proxy.js         # API: कैश्ड न्यूज़ आर्टिकल्स
        ├── instagram-feed.js     # API: कैश्ड Instagram पोस्ट्स
        ├── feed-status.js        # API: फीड की ताज़गी का हेल्थ चेक
        ├── subscribe.js          # API: ईमेल सब्सक्रिप्शन मैनेजमेंट
        ├── blob-store.js         # शेयर्ड: Blobs स्टोर हेल्पर
        ├── air-query.mjs         # AI: नेचुरल लैंग्वेज AQI क्वेरीज़
        ├── health-advisory.mjs   # AI: पर्सनलाइज़्ड हेल्थ एडवाइज़री
        ├── accountability-brief.mjs  # AI: वार्ड-लेवल अकाउंटेबिलिटी ब्रीफ्स
        └── anomaly-check.mjs     # AI: PM2.5 स्पाइक डिटेक्शन
```

यह सूची पूरी नहीं है: `netlify/functions/` में 29 फंक्शन फ़ाइलें और शेयर्ड `lib/` शामिल हैं (उदाहरण के लिए `waqi-proxy`, `rankings`, `data-api`, `push-send`, `fire-tracker`, `terra-collab` और `zotero-library`)।
