# கட்டமைப்பு

JanVayu என்பது **சூன்ய-கட்டமைப்பு, ஒற்றைப்பக்க பயன்பாடு** ஆகும், இது Netlify-ல் வரிசைப்படுத்தப்பட்டுள்ளது, தரவு ப்ராக்ஸி, கேச்சிங் மற்றும் திட்டமிடப்பட்ட பணிகளுக்கான சர்வர்-பக்க serverless functions-உடன்.

---

## கணினி வரைபடம்

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

## முக்கிய வடிவமைப்பு முடிவுகள்

### ஒற்றை HTML கோப்பு
முழு முன்-இறுதியும் `index.html`-ல் வாழ்கிறது — inline CSS மற்றும் JavaScript, build படி இல்லை, bundler இல்லை, framework இல்லை. இது அடிப்படை HTML/JS திறன்கள் கொண்ட பங்களிப்பாளர்களுக்கு குறியீட்டு தளத்தை அணுகக்கூடியதாக்குகிறது மற்றும் சூன்ய build-நேர சிக்கலை உறுதி செய்கிறது.

### சர்வர்-பக்க ப்ராக்ஸி
சமூக ஊடகம் மற்றும் செய்தி API-கள் CORS சிக்கல்களைத் தவிர்க்கவும் API keys-ஐ பாதுகாக்கவும் Netlify Functions வழியாக பெறப்படுகின்றன. கிளையண்ட் இந்த API-களை நேரடியாகத் தொடுவதில்லை.

### Blob கேச்சிங்
`scheduled-fetch.mjs` function ஒவ்வொரு 4 மணி நேரமும் இயங்கி அனைத்து feed தரவையும் (Reddit, Twitter/X, செய்திகள், Instagram) Netlify Blobs-க்கு எழுதுகிறது. பயனர்கள் feeds-ஐ கோரும்போது, on-demand functions கேச்சிலிருந்து உடனடியாக வழங்குகின்றன — தாமதம் மற்றும் API வரம்புகளை நீக்குகிறது.

### கிளையண்ட்-பக்க AQI
WAQI API ஒவ்வொரு 10 நிமிடமும் உலாவியிலிருந்து நேரடியாக அழைக்கப்படுகிறது. token ஒரு free-tier public key ஆகும். இதன் பொருள் நிகழ்நேர AQI தரவு எந்த சர்வர்-பக்க உள்கட்டமைப்பும் இல்லாமல் வேலை செய்கிறது.

### Framework இல்லை, Build படி இல்லை
`npm run build` இல்லை, Webpack இல்லை, React இல்லை. வரிசைப்படுத்தல் கலைப்பொருள் repository-யே. Netlify root-லிருந்து `index.html`-ஐ வழங்குகிறது.

---

## தானியங்கி-புதுப்பிப்பு அட்டவணை

| பணி | அதிர்வெண் | Function |
|------|-----------|----------|
| சமூக/செய்தி feed புதுப்பிப்பு | ஒவ்வொரு 4 மணி நேரம் | `scheduled-fetch.mjs` |
| தினசரி AQI மின்னஞ்சல் சுருக்கம் | தினமும் காலை 8:00 AM IST | `daily-digest.mjs` |
| நேரடி AQI டாஷ்போர்டு | ஒவ்வொரு 10 நிமிடம் | கிளையண்ட்-பக்க JS (WAQI API) |
| முரண்பாடு கண்டறிதல் | தேவைக்கேற்ப | `anomaly-check.mjs` |

---

## கோப்பு அமைப்பு

```
JanVayu/
├── index.html                    # முழு முன்-இறுதி (SPA)
├── favicon.svg
├── package.json                  # Node.js deps (Netlify Blobs, Resend, Gemini)
├── netlify.toml                  # Build & deploy config
├── CNAME                         # Custom domain
├── docs/                         # இந்த ஆவணங்கள் (GitBook)
├── downloads/                    # பதிவிறக்கக்கூடிய அறிக்கைகள் (PDF, PPTX, DOCX)
└── netlify/
    └── functions/
        ├── scheduled-fetch.mjs   # Cron: அனைத்து feeds, ஒவ்வொரு 4 மணி நேரம்
        ├── daily-digest.mjs      # Cron: மின்னஞ்சல் சுருக்கம், காலை 8am IST
        ├── reddit-feed.js        # API: கேச் செய்யப்பட்ட Reddit பதிவுகள்
        ├── twitter-feed.js       # API: கேச் செய்யப்பட்ட Twitter/X பதிவுகள்
        ├── news-proxy.js         # API: கேச் செய்யப்பட்ட செய்தி கட்டுரைகள்
        ├── instagram-feed.js     # API: கேச் செய்யப்பட்ட Instagram பதிவுகள்
        ├── feed-status.js        # API: feed புத்தம்புதிய நிலை சோதனை
        ├── subscribe.js          # API: மின்னஞ்சல் சந்தா மேலாண்மை
        ├── blob-store.js         # பகிரப்பட்ட: Blobs store உதவியாளர்
        ├── air-query.mjs         # AI: இயற்கை மொழி AQI வினவல்கள்
        ├── health-advisory.mjs   # AI: தனிப்பயனாக்கப்பட்ட சுகாதார ஆலோசனை
        ├── accountability-brief.mjs  # AI: வார்டு அளவிலான பொறுப்புணர்வு சுருக்கங்கள்
        └── anomaly-check.mjs     # AI: PM2.5 எகிற்சி கண்டறிதல்
```
