# கட்டமைப்பு

ஜான்வாயு (JanVayu) என்பது **ஜீரோ-ஃப்ரேம்வொர்க், சிங்கிள்-பேஜ் அப்ளிகேஷன்** ஆகும். இது Netlify-யில் பயன்படுத்தப்பட்டு, டேட்டா ப்ராக்ஸிங், கேஷிங் மற்றும் திட்டமிடப்பட்ட வேலைகளுக்கு சர்வர்-சைடு சர்வர்லெஸ் ஃபங்ஷன்களைக் கொண்டுள்ளது.

---

## சிஸ்டம் வரைபடம்

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

## முக்கிய வடிவமைப்பு முடிவுகள்


---
### ஸ்டாட்டிக் ஃபிரண்ட்-எண்ட், பண்ட்லர் இல்லை
ஃபிரண்ட்-எண்ட் என்பது `index.html` மற்றும் `styles.css`, `app.js`, `games.js` ஆகியவையும், `panels/`-ல் உள்ள 19 லேஸி-லோடட் பேனல் துண்டுகளும் சேர்ந்தது. இதில் பண்ட்லர் அல்லது ஃப்ரேம்வொர்க் எதுவும் இல்லை ([Frontend Stack](../tech-stack/frontend.md) பார்க்கவும்). இதனால், அடிப்படை HTML/JS தெரிந்த பங்களிப்பாளர்களும் கோட் பேஸைப் பயன்படுத்த முடியும்; மேலும் பில்ட்-டைம் சிக்கல்கள் கிட்டத்தட்ட பூஜ்ஜியமாக இருக்கும்.

### சர்வர்-சைடு ப்ராக்ஸிங்
CORS சிக்கல்களைத் தவிர்க்கவும், API கீகளைப் பாதுகாக்கவும் சோஷியல் மீடியா மற்றும் நியூஸ் API-கள் Netlify Functions வழியாகப் பெறப்படுகின்றன. கிளைண்ட் இந்த API-களை நேரடியாகப் பயன்படுத்துவதில்லை.

### பிளாப் கேஷிங்
`scheduled-fetch.mjs` ஃபங்ஷன் ஒவ்வொரு 4 மணி நேரத்திற்கும் இயங்கி, ஃபீட் டேட்டாவை (Reddit, செய்திகள்; Instagram முயற்சி செய்யப்படும், ஆனால் பொதுவாக எதுவும் வராது) Netlify Blobs-ல் எழுதுகிறது. பயனர்கள் ஃபீட்களைக் கேட்கும்போது, ஆன்-டிமாண்ட் ஃபங்ஷன்கள் கேஷிலிருந்து உடனடியாக வழங்குகின்றன — இதனால் தாமதம் மற்றும் API ரேட் லிமிட்கள் தவிர்க்கப்படுகின்றன.

### கிளைண்ட்-சைடு AQI
WAQI API நேரடியாக பிரவுசரில் இருந்து ஒவ்வொரு 10 நிமிடங்களுக்கும் அழைக்கப்படுகிறது. இந்த டோக்கன் WAQI-ஆல் அதன் சேவை விதிமுறைகளின் கீழ் வழங்கப்படுகிறது மற்றும் இது கிளைண்ட் கோடில் தெரியும். அதாவது, எந்த சர்வர்-சைடு உள்கட்டமைப்பும் இல்லாமல் ரியல்-டைம் AQI டேட்டா வேலை செய்யும்.

### ஃப்ரேம்வொர்க் இல்லை, பில்ட் ஸ்டெப் இல்லை
`npm run build`, Webpack, React எதுவும் இல்லை. பில்ட் கமாண்ட் `node scripts/bump-version.mjs` மட்டுமே, இது வெர்ஷனைக் குறிக்கிறது. மற்றபடி டிப்ளாய் ஆர்ட்டிஃபேக்ட் அந்த ரெபாசிட்டரிதான். Netlify ரூட்டிலிருந்து `index.html`-ஐ வழங்குகிறது.

---

## ஆட்டோ-அப்டேட் ஷெட்யூல்

| பணி | அதிர்வெண் | ஃபங்ஷன் |
|------|-----------|----------|
| சோஷியல்/நியூஸ் ஃபீட் ரீஃப்ரெஷ் | ஒவ்வொரு 4 மணி நேரத்திற்கும் | `scheduled-fetch.mjs` |
| தினசரி AQI ஈமெயில் டைஜஸ்ட் | தினமும் காலை 8:00 IST | `daily-digest.mjs` |
| லைவ் AQI டேஷ்போர்டு | ஒவ்வொரு 10 நிமிடங்களுக்கும் | கிளைண்ட்-சைடு JS (WAQI API) |
| முரண்பாடு கண்டறிதல் | ஆன்-டிமாண்ட் | `anomaly-check.mjs` |
| அப்டைம் மற்றும் ஃபங்ஷன் ஹெல்த் செக்குகள் | ஒவ்வொரு 15 நிமிடங்களுக்கும் | `health-monitor.mjs` |
| வெப் புஷ் நோட்டிஃபிகேஷன்கள் | ஒவ்வொரு 3 மணி நேரத்திற்கும் | `push-send.mjs` |
| ஃபீட் ஹெல்த் செக் | தினமும் | `feed-health.mjs` |

---

## ஃபைல் அமைப்பு
```
JanVayu/
├── index.html                    # SPA shell (plus styles.css, app.js, games.js, panels/)
├── favicon.svg
├── package.json                  # Node.js deps (Netlify Blobs, Resend, web-push)
├── netlify.toml                  # Build & deploy config
├── CNAME                         # Custom domain
├── docs/                         # This documentation (Docsify)
├── downloads/                    # Downloadable reports (PDF, PPTX, DOCX)
└── netlify/
    └── functions/
        ├── scheduled-fetch.mjs   # Cron: all feeds, every 4h
        ├── daily-digest.mjs      # Cron: email digest, 8am IST
        ├── reddit-feed.js        # API: cached Reddit posts
        ├── twitter-feed.js       # API: retired — read Nitter, whose public instances are gone
        ├── news-proxy.js         # API: cached news articles
        ├── instagram-feed.js     # API: cached Instagram posts
        ├── feed-status.js        # API: feed freshness health check
        ├── subscribe.js          # API: email subscription management
        ├── blob-store.js         # Shared: Blobs store helper
        ├── air-query.mjs         # AI: natural language AQI queries
        ├── health-advisory.mjs   # AI: personalised health advice
        ├── accountability-brief.mjs  # AI: ward-level accountability briefs
        └── anomaly-check.mjs     # AI: PM2.5 spike detection
```

இந்த பட்டியல் முழுமையானது அல்ல: `netlify/functions/` இல் 29 function கோப்புகள் மற்றும் பகிரப்பட்ட `lib/` ஆகியவை உள்ளன (உதாரணமாக `waqi-proxy`, `rankings`, `data-api`, `push-send`, `fire-tracker`, `terra-collab` மற்றும் `zotero-library`).
