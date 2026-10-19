# Netlify Functions

அனைத்து சர்வர்-சைடு செயல்பாடுகளுக்கும் JanVayu [Netlify Functions](https://docs.netlify.com/functions/overview/) பயன்படுத்துகிறது. Functions `netlify/functions/` இல் இருக்கும், மேலும் தளத்துடன் சேர்த்து தானாகவே டெப்லாய் செய்யப்படும்.

---

## Function Reference

### Scheduled Functions (Cron)

#### `scheduled-fetch.mjs`
**Trigger:** ஒவ்வொரு 4 மணி நேரத்திற்கும்  
**Purpose:** அனைத்து சமூக மற்றும் செய்தி ஃபீட்களையும் (feeds) பெற்று, அவற்றை Netlify Blobs இல் JSON கேஷேவாக (cache) எழுதும்.

பெறப்பட்ட ஃபீட்கள்:
- r/india, r/delhi, r/indianews, r/environment, r/worldnews ஆகியவற்றிலிருந்து Reddit பதிவுகள்
- ~~Nitter RSS instances வழியாக Twitter/X பதிவுகள்~~ — **பழையது.** Nitter-இன் பொதுவான instances இப்போது இல்லை, மேலும் endpoint இனி பதிலளிக்காது. X இப்போது நேரடியாக இணைக்கப்பட்டுள்ளது, பெறப்படவில்லை: நேரடி தேடல்கள் மற்றும் குறிப்பிட்ட கணக்குகள், ஒவ்வொன்றும் X-இன் பொதுவான embed endpoint-க்கு எதிராக `scripts/verify-x-links.py` மூலம் சரிபார்க்கப்படுகின்றன.
- காற்றின் தரம் (air quality) தொடர்பான தலைப்புகளுக்கான Google News RSS
- RSS-Bridge வழியாக Instagram ஹேஷ்டேக்குகள்

ஒவ்வொரு பயனர் கோரிக்கையின்போதும் நேரடி API அழைப்புகளைச் செய்வதற்குப் பதிலாக, ஆன்-டிமாண்ட் ஃபீட் செயல்பாடுகள் கேஷேவிலிருந்து உடனடியாக பதிலளிப்பதை இந்த function உறுதி செய்கிறது.

---

#### `daily-digest.mjs`
**Trigger:** தினமும் காலை 8:00 AM IST (2:30 AM UTC)  
**Purpose:** Netlify Blobs-லிருந்து அனைத்து சந்தாதாரர்களையும் (subscribers) படித்து, ஒவ்வொரு சந்தாதாரரின் நகரத்திற்கான தற்போதைய AQI-ஐப் பெற்று, Resend வழியாக தனிப்பயனாக்கப்பட்ட HTML மின்னஞ்சலை அனுப்புகிறது.

ஒவ்வொரு மின்னஞ்சலிலும் உள்ளவை:
- தற்போதைய AQI அளவு மற்றும் வகை
- அன்றைய தினத்திற்கான சுகாதார ஆலோசனை

**Dependencies:** `RESEND_API_KEY`, `RESEND_FROM`, `BLOB_TOKEN`, `NETLIFY_SITE_ID`

---

### On-Demand API Functions

#### `reddit-feed.js`
**Endpoint:** `GET /.netlify/functions/reddit-feed`  
**Purpose:** Netlify Blobs-லிருந்து காற்றின் தரம் குறித்த கேஷே செய்யப்பட்ட Reddit பதிவுகளைத் தருகிறது. கேஷே காலியாக இருந்தால் நேரடி Reddit fetch-க்கு மாறும்.

---

#### `twitter-feed.js`
**Endpoint:** `GET /.netlify/functions/twitter-feed`  
**Purpose:** *பழையது.* இது Nitter-ஐப் படித்தது, அதன் பொதுவான instances இப்போது இல்லை; production-க்கு எதிராக இது முற்றிலும் பதிலளிக்காது. இதை யாரும் பயன்படுத்துவதில்லை — front end-க்கு பதிலாக X-ஐ நேரடியாக இணைக்கிறது.

---

#### `news-proxy.js`
**Endpoint:** `GET /.netlify/functions/news-proxy`  
**Purpose:** காற்றின் தரம் தொடர்பான தலைப்புகளின் கேஷே செய்யப்பட்ட Google News RSS கட்டுரைகளைத் தருகிறது.

---

#### `instagram-feed.js`
**Endpoint:** `GET /.netlify/functions/instagram-feed`  
**Purpose:** RSS-Bridge instances வழியாக கேஷே செய்யப்பட்ட Instagram ஹேஷ்டேக் பதிவுகளைத் தருகிறது.

---
#### `feed-status.js`
**Endpoint:** `GET /.netlify/functions/feed-status`  
**நோக்கம்:** ஃபீட் (feed) எவ்வளவு அப்டேட்டாக உள்ளது என்பதைத் தருகிறது — ஒவ்வொரு ஃபீடும் கடைசியாக எப்போது அப்டேட் செய்யப்பட்டது மற்றும் சமீபத்திய ஃபெட்ச்கள் (fetches) வெற்றி பெற்றனவா என்பதைத் தெரிவிக்கும். சர்வர் தரவுகளின் அடிப்படையில் "Data last updated: X" என்பதைக் காட்ட கிளையண்டால் (client) பயன்படுத்தப்படுகிறது.

**பதிலின் அமைப்பு (Response shape):**
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
**நோக்கம்:** மின்னஞ்சல் சந்தாக்களை (email subscriptions) நிர்வகிக்கிறது. `subscribe` மற்றும் `unsubscribe` செயல்களை ஏற்கும்.

**Request body:**
```json
{
  "email": "user@example.com",
  "cities": ["delhi", "mumbai"],
  "threshold": 150,
  "action": "subscribe"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `email` | Yes | சந்தாதாரரின் மின்னஞ்சல் |
| `cities` | Yes | நகரக் குறியீடுகளின் வரிசை (array) (`daily-digest.mjs`-ல் உள்ள நகரப் பட்டியலைப் பார்க்கவும்) |
| `threshold` | No | AQI வரம்பு; தவிர்க்கப்பட்டால் இயல்பாக 200 ஆக இருக்கும். இது தினசரி டைஜஸ்ட்டை (digest) நிறுத்தாது: `daily-digest.mjs` ஒவ்வொரு சந்தாதாரருக்கும் தினமும் மின்னஞ்சல் அனுப்பும், இந்த வரம்பு எச்சரிக்கை வார்த்தைகளை மட்டுமே மாற்றும் |
| `action` | Yes | `"subscribe"` அல்லது `"unsubscribe"` |

---

### AI Functions (Groq-Powered)

அனைத்து AI ஃபங்ஷன்களும் OpenAI gpt-oss-120b-ஐ (ஒரு open-weight LLM; இயல்பாக `openai/gpt-oss-120b`, `GROQ_MODEL` மூலம் மாற்றிக்கொள்ளலாம்) Groq REST API (OpenAI-compatible) வழியாகப் பயன்படுத்துகின்றன. இதற்கு `GROQ_API_KEY` தேவை.

#### `air-query.mjs`
**Endpoint:** `POST /.netlify/functions/air-query` (மற்ற மெத்தட்கள் நிராகரிக்கப்படும்)  
**நோக்கம்:** ஒரு நகரத்தின் காற்றுத் தரம் பற்றிய இயல்பான மொழி (natural language) கேள்வியை ஏற்றுக்கொள்கிறது, WAQI-லிருந்து நேரடி AQI-ஐக் கொண்டுவருகிறது, மற்றும் சரியான பதிலுக்காக Groq வழியாக gpt-oss-120b-க்கு இரண்டையும் அனுப்புகிறது.

**Request body:**
```json
{
  "city": "delhi",
  "question": "Is it safe to take my child to the park today?"
}
```

விருப்பமிருந்தால் `lang` ஃபீல்டு மூலம் பதிலை எந்த மொழியில் வேண்டும் என்பதைக் குறிப்பிடலாம்.

---

#### `health-advisory.mjs`
**Endpoint:** `POST /.netlify/functions/health-advisory`  
**நோக்கம்:** பயனரின் விவரங்கள் (வயது, உடல்நலக் குறைபாடுகள்) மற்றும் அவர்களின் நகரத்தின் தற்போதைய AQI ஆகியவற்றின் அடிப்படையில் தனிப்பயனாக்கப்பட்ட உடல்நல ஆலோசனையை (personalised health advisory) உருவாக்குகிறது.

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
**எண்ட்பாயிண்ட்:** `{"city": "delhi", "area": "..."}` போன்ற JSON பாடியுடன் `POST /.netlify/functions/accountability-brief` (`city` மற்றும் `area` கட்டாயம்; `period` கட்டாயமில்லை)  
**நோக்கம்:** குறிப்பிட்ட நகரத்திற்கான ஒரு கட்டமைக்கப்பட்ட பொறுப்புக்கூறல் சுருக்கத்தை உருவாக்குகிறது — இது வார்டு கவுன்சிலர்கள், பத்திரிகையாளர்கள் அல்லது குடியிருப்போர் சங்கங்களுக்குப் பொருத்தமானது. இதில் தற்போதைய AQI, NCAP முன்னேற்றம் மற்றும் பரிந்துரைக்கப்பட்ட கேள்விகள் ஆகியவை அடங்கும்.

---

#### `anomaly-check.mjs`
**எண்ட்பாயிண்ட்:** `GET /.netlify/functions/anomaly-check`  
**நோக்கம்:** முக்கிய நகரங்களுக்கான AQI-ஐ பருவகால அடிப்படை அளவுகளுடன் ஒப்பிட்டு சரிபார்த்து, குறிப்பிடத்தக்க அதிகரிப்புகளைக் கண்டறிந்து காட்டுகிறது. அனாமலி (anomaly) ஏற்படுவதற்கான சாத்தியமான காரணத்தை விளக்க Groq மூலம் gpt-oss-120b-ஐ விருப்பப்படி பயன்படுத்துகிறது.

---

### பிற செயல்பாடுகள்

`netlify/functions/` கோப்பகத்தில் மொத்தம் 28 ஃபங்ஷன் கோப்புகள் உள்ளன. மேலே விவரிக்கப்படாதவை: `waqi-proxy`, `rankings`, `historical-aqi`, `data-api`, `fire-tracker`, `community-sensors`, `push-subscribe`, `push-send`, `health-monitor`, `feed-health`, `status-history`, `terra-collab`, `workshop-submit` மற்றும் `reference-data`. அவற்றிற்கான குறிப்புகள் இன்னும் எழுதப்படவில்லை.

---

### பகிரப்பட்ட பயன்பாடுகள்

#### `blob-store.js`
இது ஒரு HTTP ஃபங்ஷன் அல்ல — மற்ற ஃபங்ஷன்களால் Netlify Blobs ஸ்டோர் இன்ஸ்டன்ஸை (instance) உருவாக்கப் பயன்படுத்தப்படும் ஒரு பகிரப்பட்ட CommonJS மாட்யூல் ஆகும். இதில் வெளிப்படையான க்ரெடென்ஷியல் ஃபால்பேக் (credential fallback) உள்ளது.

```js
const { getBlobStore } = require('./blob-store');
const store = getBlobStore('janvayu-feeds');
```
