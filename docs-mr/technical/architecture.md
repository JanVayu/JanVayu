# आर्किटेक्चर

JanVayu हे **झिरो-फ्रेमवर्क, सिंगल-पेज अॅप्लिकेशन** आहे जे Netlify वर डिप्लॉय केलेले आहे, डेटा प्रॉक्सिंग, कॅशिंग आणि शेड्युल्ड टास्कसाठी सर्व्हर-साइड serverless functions सह.

---

## सिस्टम आकृती

```
┌─────────────────────────────────────────────────────────┐
│                     Client (Browser)                    │
│  Single HTML file · Chart.js · Leaflet.js · WAQI API   │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTPS (Netlify CDN)
┌──────────────────────────▼──────────────────────────────┐
│                   Netlify Functions                      │
│                                                          │
│  Scheduled (cron)              On-demand (API)           │
│  ┌──────────────────┐   ┌───────────────────────────┐   │
│  │ scheduled-fetch   │   │ reddit-feed.js            │   │
│  │ (every 4 hours)   │   │ twitter-feed.js           │   │
│  │                   │   │ news-proxy.js             │   │
│  │ daily-digest      │   │ instagram-feed.js         │   │
│  │ (8 AM IST daily)  │   │ feed-status.js            │   │
│  └────────┬──────────┘   │ subscribe.js              │   │
│           │              │ air-query.mjs             │   │
│           │              │ health-advisory.mjs       │   │
│           │              │ accountability-brief.mjs  │   │
│           │              │ anomaly-check.mjs         │   │
│           ▼              └─────────────┬─────────────┘   │
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
    WAQI API          Google Gemini    External Feeds
  (Real-time AQI)    (AI features)  (Reddit, News, X)
```

---

## प्रमुख डिझाइन निर्णय

### सिंगल HTML फाइल
संपूर्ण फ्रंट-एंड `index.html` मध्ये आहे — इनलाइन CSS आणि JavaScript, कोणतीही बिल्ड स्टेप नाही, कोणता बंडलर नाही, कोणता फ्रेमवर्क नाही. यामुळे कोडबेस मूलभूत HTML/JS कौशल्ये असलेल्या योगदानकर्त्यांसाठी सुलभ होतो आणि शून्य बिल्ड-टाइम जटिलता सुनिश्चित होते.

### सर्व्हर-साइड प्रॉक्सिंग
सोशल मीडिया आणि बातम्या APIs Netlify Functions द्वारे आणले जातात CORS समस्या टाळण्यासाठी आणि API keys संरक्षित करण्यासाठी. क्लायंट या APIs ला थेट स्पर्श करत नाही.

### Blob कॅशिंग
`scheduled-fetch.mjs` function दर 4 तासांनी चालतो आणि सर्व फीड डेटा (Reddit, Twitter/X, बातम्या, Instagram) Netlify Blobs मध्ये लिहितो. जेव्हा वापरकर्ते फीड मागतात, तेव्हा ऑन-डिमांड functions कॅशमधून तात्काळ सर्व्ह करतात — विलंब आणि API रेट लिमिट्स दूर करतात.

### क्लायंट-साइड AQI
WAQI API थेट ब्राउझरमधून दर 10 मिनिटांनी कॉल केला जातो. टोकन हा फ्री-टियर पब्लिक key आहे. याचा अर्थ रिअल-टाइम AQI डेटा कोणत्याही सर्व्हर-साइड इन्फ्रास्ट्रक्चरशिवाय काम करतो.

### कोणता फ्रेमवर्क नाही, कोणती बिल्ड स्टेप नाही
`npm run build` नाही, Webpack नाही, React नाही. डिप्लॉय आर्टिफॅक्ट रिपॉझिटरी स्वतःच आहे. Netlify रूटमधून `index.html` सर्व्ह करतो.

---

## ऑटो-अपडेट शेड्यूल

| कार्य | वारंवारता | Function |
|------|-----------|----------|
| सोशल/बातम्या फीड रिफ्रेश | दर 4 तासांनी | `scheduled-fetch.mjs` |
| दैनिक AQI ईमेल डायजेस्ट | दररोज 8:00 AM IST | `daily-digest.mjs` |
| लाइव्ह AQI डॅशबोर्ड | दर 10 मिनिटांनी | क्लायंट-साइड JS (WAQI API) |
| विसंगती शोध | ऑन-डिमांड | `anomaly-check.mjs` |

---

## फाइल रचना

```
JanVayu/
├── index.html                    # संपूर्ण फ्रंट-एंड (SPA)
├── favicon.svg
├── package.json                  # Node.js deps (Netlify Blobs, Resend, Gemini)
├── netlify.toml                  # बिल्ड आणि डिप्लॉय कॉन्फिग
├── CNAME                         # कस्टम डोमेन
├── docs/                         # हे दस्तऐवज (Docsify)
├── downloads/                    # डाउनलोड करण्यायोग्य अहवाल (PDF, PPTX, DOCX)
└── netlify/
    └── functions/
        ├── scheduled-fetch.mjs   # Cron: सर्व फीड्स, दर 4 तासांनी
        ├── daily-digest.mjs      # Cron: ईमेल डायजेस्ट, 8am IST
        ├── reddit-feed.js        # API: कॅश केलेले Reddit पोस्ट
        ├── twitter-feed.js       # API: कॅश केलेले Twitter/X पोस्ट
        ├── news-proxy.js         # API: कॅश केलेले बातम्या लेख
        ├── instagram-feed.js     # API: कॅश केलेले Instagram पोस्ट
        ├── feed-status.js        # API: फीड ताजेपणा हेल्थ चेक
        ├── subscribe.js          # API: ईमेल सदस्यत्व व्यवस्थापन
        ├── blob-store.js         # शेअर्ड: Blobs स्टोअर हेल्पर
        ├── air-query.mjs         # AI: नैसर्गिक भाषा AQI प्रश्न
        ├── health-advisory.mjs   # AI: वैयक्तिकृत आरोग्य सल्ला
        ├── accountability-brief.mjs  # AI: वॉर्ड-स्तरीय उत्तरदायित्व ब्रीफ
        └── anomaly-check.mjs     # AI: PM2.5 स्पाइक शोध
```
