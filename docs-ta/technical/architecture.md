# கட்டமைப்பு
ஜான்வாயு (JanVayu) என்பது **பூஜ்ஜிய-கட்டமைப்பு, ஒற்றைப் பக்க பயன்பாடு (single-page application)** ஆகும். இது தரவு ப்ராக்ஸிங், கேஷிங் மற்றும் திட்டமிடப்பட்ட பணிகளுக்கான சர்வர்-சைடு சர்வர்லெஸ் செயல்பாடுகளுடன் நெட்லைஃபியில் (Netlify) பயன்படுத்தப்பட்டுள்ளது.
---
## கணினி வரைபடம்
```
┌─────────────────────────────────────────────────────────┐
│                     Client (Browser)                    │
│  HTML + CSS + JS · Chart.js · Leaflet.js               │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTPS (Netlify CDN)
┌──────────────────────────▼──────────────────────────────┐
│                   Netlify Functions                      │
│                                                          │
│  Scheduled (cron)              On-demand (API)           │
│  ┌──────────────────┐   ┌───────────────────────────┐   │
│  │ scheduled-fetch   │   │ reddit-feed.js            │   │
│  │ (every 4 hours)   │   │ waqi-proxy.mjs            │   │
│  │                   │   │ news-proxy.js             │   │
│  │ daily-digest      │   │ instagram-feed.js         │   │
│  │ (8 AM IST daily)  │   │ feed-status.js            │   │
│  │                   │   │ subscribe.js              │   │
│  │ health-monitor    │   │ air-query.mjs             │   │
│  │ (every 15 min)    │   │ health-advisory.mjs       │   │
│  │ push-send (3 h)   │   │ accountability-brief.mjs  │   │
│  │ feed-health       │   │ anomaly-check.mjs         │   │
│  │ (daily)           │   │ ...மற்றும் பிறவை (கீழே காணவும்) │   │
│  └────────┬──────────┘   └─────────────┬─────────────┘   │
│           ▼                                              │
│  ┌──────────────────────────────────────────────────┐    │
│  │           Netlify Blobs (Cache)                   │    │
│  │  Feeds JSON ஆக கேச் செய்யப்பட்டுள்ளது · வலுவான நிலைத்தன்மை        │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │         Resend (Email Delivery)                   │    │
│  │  பயனாளர்களுக்கு தினசரி AQI சுருக்கம்                      │    │
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
### ஸ்டாட்டிக் ஃபிரண்ட்-எண்ட், பண்ட்லர் இல்லை
ஃபிரண்ட்-எண்ட் என்பது `index.html` மற்றும் `styles.css`, `app.js`, `games.js` ஆகியவற்றுடன் `panels/` இல் உள்ள 19 லேஸி-லோடட் பேனல் துண்டுகளைக் கொண்டுள்ளது. இதில் பண்ட்லரோ அல்லது ஃபிரேம்வொர்க்கோ இல்லை ([Frontend Stack](../tech-stack/frontend.md) ஐப் பார்க்கவும்). இதனால் அடிப்படை HTML/JS திறன்களைக் கொண்ட பங்களிப்பாளர்களுக்கும் கோட் பேஸை எளிதாக அணுக முடியும். மேலும், பில்ட்-டைம் சிக்கல்தன்மை கிட்டத்தட்ட பூஜ்ஜியமாக இருக்கும்.
### சர்வர்-சைடு ப்ராக்ஸிங்
CORS சிக்கல்களைத் தவிர்க்கவும், API கீகளைப் பாதுகாக்கவும் சோஷியல் மீடியா மற்றும் நியூஸ் API-கள் Netlify Functions வழியாகப் பெறப்படுகின்றன. கிளையண்ட் இந்த API-களை நேரடியாக அணுகாது.
### ப்ளாப் கேஷிங்
`scheduled-fetch.mjs` ஃபங்ஷன் ஒவ்வொரு 4 மணி நேரத்திற்கும் இயங்கி, ஃபீட் டேட்டாவை (Reddit, செய்திகள்; Instagram முயற்சிக்கப்படுகிறது, ஆனால் பொதுவாக எதையும் திருப்பித் தராது) Netlify Blobs-இல் எழுதுகிறது. பயனர்கள் ஃபீட்களைக் கோரும்போது, ஆன்-டிமாண்ட் ஃபங்ஷன்கள் கேஷிலிருந்து உடனடியாக வழங்குகின்றன — இதனால் தாமதம் மற்றும் API ரேட் லிமிட்கள் தவிர்க்கப்படுகின்றன.
### ப்ராக்ஸி மூலம் நேரடி AQI
பிரவுசர் ஒவ்வொரு 10 நிமிடங்களுக்கும் நேரடி அளவீடுகளைக் கேட்கிறது, மேலும் 27 October 2026 முதல் ஒவ்வொரு கோரிக்கையும் `waqi-proxy` ஃபங்ஷன் வழியாகச் செல்கிறது. WAQI டோக்கன் என்பது `WAQI_TOKEN` சூழல் மாறி (environment variable) ஆகும், இது கிளையண்ட் கோடில் இல்லை. கேட்கப்பட்ட இடத்திலிருந்து 30 km தொலைவிற்குள் இருந்து, கடந்த 6 மணி நேரத்திற்குள் ரிப்போர்ட் செய்திருந்தால் மட்டுமே ப்ராக்ஸி ஒரு ஸ்டேஷனை ஏற்றுக்கொள்ளும் (`netlify/functions/lib/waqi-station.mjs`).
### நேரடி அளவீட்டிற்குப் பின் உள்ள ஃபால்பேக் செயின்
ஒரு இடத்தில் உள்ள காற்றைப் பற்றி என்ன சொல்வது என்பதை `js/air-sources.js` தீர்மானிக்கிறது. இது வரிசையாக, நேரடி WAQI ஸ்டேஷன், அருகிலுள்ள கண்காணிக்கப்படும் நகரத்திற்கான CPCB-இன் தினசரி புல்லட்டின் (`data/cpcb-latest.json`, 50 km தொலைவிற்குள் மற்றும் 7 நாட்களுக்கு மிகாமல் இருக்க வேண்டும்) மற்றும் `air-model` ஃபங்ஷனிலிருந்து Open-Meteo (CAMS) மாடல் மதிப்பீடு ஆகியவற்றை முயற்சிக்கிறது. ஒவ்வொரு பதிலிலும் அதன் வகை, ஆதாரம் மற்றும் அளவு ஆகியவை இருக்கும். தினசரி அளவீடும் மாடல் மதிப்பீடும் ஒருபோதும் நேரடி எனத் திருப்பித் தரப்படாது, மேலும் அவை நகர ரேங்கிங் அல்லது அலர்ட்டுகளில் இடம்பெறாது.
### ஃபிரேம்வொர்க் இல்லை, பில்ட் ஸ்டெப் இல்லை
`npm run build`, Webpack, React என எதுவும் இல்லை. பதிப்பை முத்திரையிடும் `node scripts/bump-version.mjs` மட்டுமே ஒரே பில்ட் கமாண்ட் ஆகும். மற்றபடி டெப்லாய் ஆர்ட்டிஃபாக்ட் என்பது ரெபாசிட்டரியே ஆகும். Netlify ரூட்டிலிருந்து `index.html` ஐ வழங்குகிறது.
---
## ஆட்டோ-அப்டேட் ஷெட்யூல்
| பணி | அதிர்வெண் | செயல்பாடு |
|------|-----------|----------|
| சமூக/செய்தி ஃபீட் புதுப்பிப்பு | ஒவ்வொரு 4 மணி நேரத்திற்கும் | `scheduled-fetch.mjs` |
| தினசரி AQI மின்னஞ்சல் சுருக்கம் | தினமும் காலை 8:00 IST | `daily-digest.mjs` |
| நேரடி AQI டேஷ்போர்டு | ஒவ்வொரு 10 நிமிடங்களுக்கும் | கிளையன்ட்-சைடு JS, `waqi-proxy.mjs` வழியாக |
| முரண்பாடு கண்டறிதல் | தேவைப்படும்போது | `anomaly-check.mjs` |
| அப்டைம் மற்றும் ஃபங்ஷன் ஆரோக்கிய சோதனைகள் | ஒவ்வொரு 15 நிமிடங்களுக்கும் | `health-monitor.mjs` |
| வெப் புஷ் அறிவிப்புகள் | ஒவ்வொரு 3 மணி நேரத்திற்கும் | `push-send.mjs` |
| ஃபீட் ஆரோக்கிய சோதனை | தினமும் | `feed-health.mjs` |
| CPCB தினசரி AQI புல்லட்டின்கள் | தினமும் 12:00 UTC-க்கு | `.github/workflows/cpcb-bulletins.yml` (ஒரு GitHub Actions ஒர்க்ஃப்ளோ, ஃபங்ஷன் அல்ல) |
| நேரடி அளவீடுகள் CPCB புல்லட்டினுடன் சரிபார்க்கப்படுதல் | தினமும் 06:17 UTC-க்கு | `.github/workflows/live-audit.yml` |
| நடப்பு ஆண்டு மாவட்ட காற்று அடுக்கு | ஒவ்வொரு மாதமும் 3ஆம் தேதி, 04:00 UTC-க்கு | `.github/workflows/current-year-air.yml` |
---
## கோப்பு அமைப்பு
JanVayu/
├── index.html                    # SPA shell (கூடுதலாக styles.css, app.js, games.js, panels/)
├── js/                           # air-sources.js (live, daily, model chain), chrome.js (பகிரப்பட்ட பட்டை)
├── data/                         # Bulletins, boundary tiles, villages, wards மற்றும் பிற வழங்கப்பட்ட தரவுகள்
├── scripts/                      # Builders, checks மற்றும் fetchers (scripts/README.md ஐப் பார்க்கவும்)
├── favicon.svg
├── package.json                  # Node.js deps (Netlify Blobs, Resend, web-push)
├── netlify.toml                  # Build & deploy config
├── CNAME                         # Custom domain
├── docs/                         # இந்த ஆவணங்கள் (Docsify)
├── downloads/                    # பதிவிறக்கக்கூடிய அறிக்கைகள் (PDF, PPTX, DOCX)
└── netlify/
    └── functions/
        ├── scheduled-fetch.mjs   # Cron: அனைத்து feeds, ஒவ்வொரு 4h-க்கும்
        ├── daily-digest.mjs      # Cron: மின்னஞ்சல் digest, காலை 8am IST
        ├── reddit-feed.js        # API: cache செய்யப்பட்ட Reddit பதிவுகள்
        ├── twitter-feed.js       # API: நிறுத்தப்பட்டது — Nitter-ஐப் படிக்கவும், அதன் பொது நிகழ்வுகள் முடிந்துவிட்டன
        ├── news-proxy.js         # API: cache செய்யப்பட்ட செய்தி கட்டுரைகள்
        ├── instagram-feed.js     # API: cache செய்யப்பட்ட Instagram பதிவுகள்
        ├── waqi-proxy.mjs        # API: ஒரு browser-லிருந்து WAQI-க்கு உள்ள ஒரே வழி
        ├── air-model.mjs         # API: Open-Meteo (CAMS) மதிப்பீடு, கடைசி fallback
        ├── feed-status.js        # API: feed freshness health check
        ├── subscribe.js          # API: மின்னஞ்சல் subscription நிர்வாகம்
        ├── blob-store.js         # பகிரப்பட்டது: Blobs store helper
        ├── air-query.mjs         # AI: இயல்பான மொழி AQI வினாக்கள்
        ├── health-advisory.mjs   # AI: தனிப்பயனாக்கப்பட்ட சுகாதார ஆலோசனை
        ├── accountability-brief.mjs  # AI: ward-level accountability briefs
        └── anomaly-check.mjs     # AI: PM2.5 spike detection
```
இந்த பட்டியல் முழுமையானது அல்ல: `netlify/functions/`-ல் 29 கோப்புகள் (28 functions மற்றும் பகிரப்பட்ட `blob-store.js` helper) மற்றும் `lib/` மற்றும் `data/` ஆகியவை உள்ளன. மற்றவற்றில் `rankings`, `data-api`, `push-send`, `fire-tracker` மற்றும் `terra-collab` ஆகியவை அடங்கும்.
```
