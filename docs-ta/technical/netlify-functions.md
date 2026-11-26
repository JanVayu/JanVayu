# Netlify Functions
ஜான்வாயு (JanVayu) அனைத்து சர்வர்-பக்க செயல்பாடுகளுக்கும் [Netlify Functions](https://docs.netlify.com/functions/overview/) ஐப் பயன்படுத்துகிறது. Functions `netlify/functions/` இல் உள்ளன, மேலும் தளத்துடன் தானாகவே deploy செய்யப்படுகின்றன.
---
## Function Reference
### Scheduled Functions (Cron)
#### `scheduled-fetch.mjs`
**Trigger:** ஒவ்வொரு 4 மணி நேரத்திற்கும்  
**Purpose:** அனைத்து சமூக மற்றும் செய்தி ஃபீட்களைப் (feeds) பெற்று, அவற்றை Netlify Blobs இல் JSON cache ஆக எழுதுகிறது.
பெறப்பட்ட ஃபீட்கள்:
- r/india, r/delhi, r/indianews, r/environment, r/worldnews ஆகியவற்றிலிருந்து Reddit பதிவுகள்
- ~~Nitter RSS instances வழியாக Twitter/X பதிவுகள்~~ — **ஓய்வு பெற்றது.** Nitter-இன் பொது instances இப்போது இல்லை, மேலும் அந்த endpoint இனி பதிலளிப்பதில்லை. X இப்போது link செய்யப்பட்டுள்ளது, fetch செய்யப்படவில்லை: நேரடி தேடல்கள் மற்றும் பெயரிடப்பட்ட கணக்குகள் ஒவ்வொன்றும் X-இன் பொது embed endpoint-க்கு எதிராக `scripts/verify-x-links.py` மூலம் சரிபார்க்கப்படுகின்றன.
- காற்றுத் தரத் தலைப்புகளுக்கான Google News RSS
- RSS-Bridge வழியாக Instagram hashtags
ஒவ்வொரு பயனர் கோரிக்கையின்போதும் நேரடி API அழைப்புகளைச் செய்வதற்குப் பதிலாக, on-demand feed functions cache-லிருந்து உடனடியாக பதிலளிப்பதை இந்த function உறுதி செய்கிறது.
---
#### `daily-digest.mjs`
**Trigger:** தினமும் காலை 8:00 மணி IST (காலை 2:30 மணி UTC)  
**Purpose:** Netlify Blobs-லிருந்து அனைத்து சந்தாதாரர்களையும் படித்து, ஒவ்வொரு சந்தாதாரரின் நகரத்திற்கான தற்போதைய AQI-ஐப் பெற்று, Resend வழியாக தனிப்பயனாக்கப்பட்ட HTML மின்னஞ்சலை அனுப்புகிறது.
ஒவ்வொரு மின்னஞ்சலிலும் உள்ளவை:
- சந்தாதாரரின் நகரங்களின் அட்டவணை, தற்போதைய PM2.5-க்கான CPCB-இன் வகைப்பாடு, மற்றும் PM2.5 மற்றும் PM10 மதிப்புகள் µg/m³ இல்
- மோசமான நகரத்தின் வகைப்பாட்டிற்கு CPCB வெளியிடும் சுகாதார விளைவுகள்
- எந்தவொரு நகரமும் சந்தாதாரரின் PM2.5 எச்சரிக்கை நிலைக்கு மேல் உள்ளதா என்பதைக் கூறும் ஒரு வரி
ஆறு மணி நேரத்திற்கும் மேலான அல்லது நம்பமுடியாத அளவிற்கு குறைவான அளவீடு காட்டப்படாது. அந்த வரி "இன்று நம்பகமான அளவீடு இல்லை" என்று கூறி அதற்கான காரணத்தைக் கூறுகிறது (`daily-digest.mjs`-இல் உள்ள `assessReading`).
**Dependencies:** `RESEND_API_KEY`, `RESEND_FROM`, `BLOB_TOKEN`, `NETLIFY_SITE_ID`
---
### On-Demand API Functions
#### `reddit-feed.js`
**Endpoint:** `GET /.netlify/functions/reddit-feed`  
**Purpose:** Netlify Blobs-லிருந்து காற்றுத் தரம் குறித்த cached Reddit பதிவுகளைத் தருகிறது.  
Cache காலியாக இருந்தால் நேரடி Reddit fetch-க்கு மாறுகிறது.
---
#### `twitter-feed.js`
**Endpoint:** `GET /.netlify/functions/twitter-feed`  
**Purpose:** *ஓய்வு பெற்றது.* இது Nitter-ஐப் படித்தது, அதன் பொது instances இப்போது இல்லை; production-க்கு எதிராக அளவிடப்படும்போது இது பதிலளிப்பதே இல்லை. எதுவும் இதை அழைக்கவில்லை — front end அதற்குப் பதிலாக X-க்கு link செய்கிறது.
---
#### `news-proxy.js`
**Endpoint:** `GET /.netlify/functions/news-proxy`  
**Purpose:** காற்றுத் தரத் தலைப்புகள் குறித்த cached Google News RSS கட்டுரைகளைத் தருகிறது.
---
#### `instagram-feed.js`
**Endpoint:** `GET /.netlify/functions/instagram-feed`  
**Purpose:** RSS-Bridge இன்ஸ்டன்ஸ்கள் வழியாக கேச் செய்யப்பட்ட Instagram ஹேஷ்டேக் பதிவுகளை வழங்குகிறது.
---
#### `feed-status.js`
**Endpoint:** `GET /.netlify/functions/feed-status`  
**Purpose:** ஃபீட்டின் புத்துணர்ச்சியை வழங்குகிறது — ஒவ்வொரு ஃபீடும் கடைசியாக எப்போது அப்டேட் செய்யப்பட்டது மற்றும் சமீபத்திய ஃபெட்ச்கள் வெற்றி பெற்றதா என்பதை அறிய. சர்வர்-சைடு உண்மையுடன் "Data last updated: X" என்பதைக் காட்ட கிளையண்டால் பயன்படுத்தப்படுகிறது.
**Response shape:**
```json
{
  "last_updated": "2026-03-23T12:00:00Z",
  "schedule": "Netlify feeds every 4 hours, email digest daily at 8 AM IST",
  "log": { },
  "email_log": { },
  "server_time": "2026-03-23T12:05:00Z"
}
```
---
#### `subscribe.js`
**Endpoint:** `POST /.netlify/functions/subscribe`  
**Purpose:** மின்னஞ்சல் சந்தாக்களை நிர்வகிக்கிறது. `subscribe` மற்றும் `unsubscribe` செயல்களை ஏற்றுக்கொள்கிறது.
**Request body:**
```json
{
  "email": "user@example.com",
  "cities": ["delhi", "mumbai"],
  "pm25_threshold": 90,
  "action": "subscribe"
}
```
| Field | Required | Description |
|-------|----------|-------------|
| `email` | Yes | சந்தாதாரரின் மின்னஞ்சல் |
| `cities` | No | நகரக் குறிப்புகளின் வரிசை (array) (`daily-digest.mjs`-ல் உள்ள நகரப் பட்டியலைப் பார்க்கவும்); இயல்புநிலையாக `["delhi"]` இருக்கும் |
| `pm25_threshold` | No | PM2.5-இன் µg/m³ அளவிலான எச்சரிக்கை நிலை; இயல்புநிலையாக 90 ஆக இருக்கும், மேலும் இது 10 முதல் 500 வரை பராமரிக்கப்படும். இது டைஜஸ்ட்டை நிறுத்தாது: `daily-digest.mjs` ஒவ்வொரு சந்தாதாரருக்கும் தினமும் மின்னஞ்சல் அனுப்புகிறது, இந்த நிலை எச்சரிக்கை வார்த்தைகளை மட்டுமே மாற்றுகிறது. 29 October 2026-க்கு முன் உருவாக்கப்பட்ட பதிவுகள் பழைய `threshold` (ஒரு US AQI) கொண்டுள்ளன, இது `lib/cpcb.mjs`-ல் உள்ள `thresholdPM25()` மூலம் மாற்றப்படுகிறது |
| `action` | No | `"unsubscribe"` முகவரியை நீக்குகிறது; வேறு எதுவாக இருந்தாலும், அல்லது எதுவுமே இல்லை என்றாலும் சந்தா செலுத்தும் |
---
### AI Functions (Groq-Powered)
அனைத்து AI ஃபங்ஷன்களும் Groq REST API (OpenAI-compatible) வழியாக OpenAI gpt-oss-120b (ஒரு open-weight LLM; இயல்புநிலையாக `openai/gpt-oss-120b`, `GROQ_MODEL` மூலம் மாற்றக்கூடியது) பயன்படுத்துகின்றன. அவற்றுக்கு `GROQ_API_KEY` தேவை.
#### `air-query.mjs`
**Endpoint:** `POST /.netlify/functions/air-query` (பிற மெத்தட்கள் நிராகரிக்கப்படும்)  
**Purpose:** ஒரு நகரத்தின் காற்றின் தரம் பற்றிய இயல்பான மொழி கேள்வியை ஏற்றுக்கொள்கிறது, WAQI-லிருந்து நேரடி AQI-ஐ ஃபெட்ச் செய்கிறது, மேலும் தகவலறிந்த பதிலுக்காக இரண்டையும் Groq வழியாக gpt-oss-120b-க்கு அனுப்புகிறது.
**Request body:**
```json
{
  "city": "delhi",
  "question": "Is it safe to take my child to the park today?"
}
```
விருப்பமிருந்தால் `lang` ஃபீல்டு மூலம் பதில் மொழியைக் கோரலாம்.
---
#### `health-advisory.mjs`
**Endpoint:** `POST /.netlify/functions/health-advisory`  
**Purpose:** பயனரின் சுயவிவரம் (வயது, உடல்நலக் குறைபாடுகள்) மற்றும் அவர்கள் வசிக்கும் நகரத்தின் தற்போதைய AQI ஆகியவற்றின் அடிப்படையில் தனிப்பயனாக்கப்பட்ட சுகாதார ஆலோசனையை உருவாக்குகிறது.
**Request body:**
```json
{
  "city": "delhi",
  "age": 45,
  "conditions": ["asthma", "heart disease"]
}
```
---

#### `accountability-brief.mjs`
**Endpoint:** `{"city": "delhi", "area": "..."}` போன்ற JSON body உடன் `POST /.netlify/functions/accountability-brief` (`city` மற்றும் `area` ஆகியவை கட்டாயம்; `period` என்பது விருப்பத்திற்குரியது)  
**Purpose:** குறிப்பிட்ட நகரத்திற்கான கட்டமைக்கப்பட்ட பொறுப்புக்கூறல் சுருக்கத்தை உருவாக்குகிறது — இது வார்டு கவுன்சிலர்கள், பத்திரிகையாளர்கள் அல்லது குடியிருப்போர் சங்கங்களுக்கு ஏற்றது. இதில் தற்போதைய AQI, NCAP முன்னேற்றம் மற்றும் பரிந்துரைக்கப்பட்ட கேள்விகள் அடங்கும்.
---

#### `anomaly-check.mjs`
**Endpoint:** `GET /.netlify/functions/anomaly-check`  
**Purpose:** முக்கிய நகரங்களின் AQI-ஐ பருவகால அடிப்படையுடன் ஒப்பிட்டுச் சரிபார்த்து, குறிப்பிடத்தக்க ஏற்றங்களைக் கண்டறிந்து காட்டுகிறது. விருப்பப்படி, முரண்பாட்டிற்கான சாத்தியமான காரணத்தை விளக்க Groq வழியாக gpt-oss-120b-ஐப் பயன்படுத்துகிறது.
---
### பிற செயல்பாடுகள் (Other Functions)
#### `waqi-proxy.mjs`
**Endpoint:** `GET /.netlify/functions/waqi-proxy`  
**Purpose:** உலாவி (browser) வழியாக `api.waqi.info`-க்குச் செல்லும் ஒரே வழி இதுதான். இது சேவையகத்தில் `WAQI_TOKEN`-ஐச் சேர்க்கிறது, நகர ஸ்லக்குகள் (city slugs), வரம்பிற்குள் உள்ள ஆயத்தொலைவுகள் (coordinates) மற்றும் மூன்று டிகிரிக்கு மிகாத எல்லைப் பெட்டி (bounding box) ஆகியவற்றை மட்டுமே ஏற்கிறது. ஆயத்தொலைவுகள் மூலம் தேடும்போது, நிலையம் 30 km தொலைவுக்குள் இருந்து, கடந்த 6 மணிநேரத்திற்குள் தரவைப் பதிவு செய்திருந்தால் மட்டுமே அதைத் திருப்பித் தரும்.
---
#### `air-model.mjs`
**Endpoint:** `GET /.netlify/functions/air-model?lat=..&lon=..`  
**Purpose:** Open-Meteo (CAMS)-லிருந்து இந்தியாவின் ஒரு குறிப்பிட்ட புள்ளிக்கான PM2.5 மதிப்பீடு இதுவாகும். `js/air-sources.js`-ல் உள்ள சங்கிலியில் இதுவே கடைசி இணைப்பாகும். ஒரு இடத்திற்கு அருகில் உள்ள எந்த நிலையமும் சமீபத்தில் தரவைப் பதிவு செய்யாதபோதும், CPCB-யின் தினசரி அறிக்கையில் சமீபத்திய தரவு இல்லாதபோதும் மட்டுமே இது பயன்படுத்தப்படுகிறது.
---
`netlify/functions/`-ல் மொத்தம் 29 கோப்புகள் உள்ளன: 28 செயல்பாடுகள் மற்றும் `blob-store.js` துணைச் செயல்பாடு. மேலே விவரிக்கப்படாதவற்றில் `youtube-feed`, `rankings`, `historical-aqi`, `data-api`, `fire-tracker`, `community-sensors`, `push-subscribe`, `push-send`, `health-monitor`, `feed-health`, `status-history`, `terra-collab`, `workshop-submit` மற்றும் `reference-data` ஆகியவை அடங்கும். அவற்றிற்கான குறிப்புப் பதிவுகள் இன்னும் எழுதப்படவில்லை.
---
### பகிரப்பட்ட பயன்பாடுகள் (Shared Utilities)
#### `blob-store.js`
இது ஒரு HTTP செயல்பாடு அல்ல — மற்ற செயல்பாடுகள் Netlify Blobs சேமிப்பக நிகழ்வை உருவாக்கப் பயன்படுத்தும் பகிரப்பட்ட CommonJS தொகுதியாகும். இது வெளிப்படையான சான்று மாற்று வழியைக் (explicit credential fallback) கொண்டுள்ளது.
</arg_value>
</tool_call>
```js
const { getBlobStore } = require('./blob-store');
const store = getBlobStore('janvayu-feeds');
```
