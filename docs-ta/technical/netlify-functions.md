# Netlify Functions

JanVayu அனைத்து சர்வர்-பக்க செயல்பாடுகளுக்கும் [Netlify Functions](https://docs.netlify.com/functions/overview/)-ஐப் பயன்படுத்துகிறது. Functions `netlify/functions/` என்ற கோப்பகத்தில் இருக்கும், மேலும் தளத்துடன் தானாகவே deploy செய்யப்படும்.

---

## Function Reference

### Scheduled Functions (Cron)

#### `scheduled-fetch.mjs`
**Trigger:** ஒவ்வொரு 4 மணி நேரத்திற்கும்  
**Purpose:** அனைத்து சமூக மற்றும் செய்தி ஃபீட்களையும் (feeds) fetch செய்து, அவற்றை Netlify Blobs-ல் JSON கேஷேவாக (cache) எழுதும்.

Fetch செய்யப்படும் ஃபீட்கள்:
- r/india, r/delhi, r/indianews, r/environment, r/worldnews ஆகியவற்றிலிருந்து Reddit பதிவுகள்
- ~~Nitter RSS instances வழியாக Twitter/X பதிவுகள்~~ — **பழையது.** Nitter-இன் பொது இன்ஸ்டன்ஸ்கள் தற்போது இல்லை, மேலும் அந்த endpoint இனி பதிலளிப்பதில்லை. X இப்போது fetch செய்யப்படாமல் இணைக்கப்பட்டுள்ளது: நேரடி தேடல்கள் மற்றும் பெயரிடப்பட்ட கணக்குகள், X-இன் பொது embed endpoint-க்கு எதிராக `scripts/verify-x-links.py` மூலம் சரிபார்க்கப்படுகின்றன.
- காற்றின் தரம் தொடர்பான தலைப்புகளுக்கான Google News RSS
- RSS-Bridge வழியாக Instagram ஹேஷ்டேக்குகள்

ஒவ்வொரு பயனர் கோரிக்கையின்போதும் நேரடி API அழைப்புகளை மேற்கொள்வதற்குப் பதிலாக, கேஷேவிலிருந்து உடனடியாக பதிலளிப்பதை இந்த function உறுதி செய்கிறது.

---

#### `daily-digest.mjs`
**Trigger:** தினமும் காலை 8:00 AM IST (காலை 2:30 UTC)  
**Purpose:** Netlify Blobs-லிருந்து அனைத்து சந்தாதாரர்களையும் படித்து, ஒவ்வொரு சந்தாதாரரின் நகரத்திற்கான தற்போதைய AQI-ஐ fetch செய்து, Resend வழியாக தனிப்பயனாக்கப்பட்ட HTML மின்னஞ்சலை அனுப்புகிறது.

ஒவ்வொரு மின்னஞ்சலிலும் உள்ளவை:
- தற்போதைய AQI அளவீடு மற்றும் வகை
- அன்றைய நாளுக்கான சுகாதார ஆலோசனை

**Dependencies:** `RESEND_API_KEY`, `RESEND_FROM`, `BLOB_TOKEN`, `NETLIFY_SITE_ID`

---

### On-Demand API Functions

#### `reddit-feed.js`
**Endpoint:** `GET /.netlify/functions/reddit-feed`  
**Purpose:** Netlify Blobs-லிருந்து காற்றின் தரம் குறித்த கேஷே செய்யப்பட்ட Reddit பதிவுகளைத் தருகிறது. கேஷே காலியாக இருந்தால் நேரடி Reddit fetch-க்கு மாறும்.

---

#### `twitter-feed.js`
**Endpoint:** `GET /.netlify/functions/twitter-feed`  
**Purpose:** *பழையது.* இது Nitter-ஐப் படித்தது, அதன் பொது இன்ஸ்டன்ஸ்கள் தற்போது இல்லை; production-க்கு எதிராக அளவிடப்படும்போது இது பதிலளிப்பதில்லை. எதற்கும் இது பயன்படுத்தப்படுவதில்லை — frontend-க்கு பதிலாக X-க்கு இணைக்கிறது.

---

#### `news-proxy.js`
**Endpoint:** `GET /.netlify/functions/news-proxy`  
**Purpose:** காற்றின் தரம் தொடர்பான தலைப்புகளில் கேஷே செய்யப்பட்ட Google News RSS கட்டுரைகளைத் தருகிறது.

---

#### `instagram-feed.js`
**Endpoint:** `GET /.netlify/functions/instagram-feed`  
**Purpose:** RSS-Bridge இன்ஸ்டன்ஸ்கள் வழியாக கேஷே செய்யப்பட்ட Instagram ஹேஷ்டேக் பதிவுகளைத் தருகிறது.

---
#### `feed-status.js`
**எண்ட்பாயிண்ட் (Endpoint):** `GET /.netlify/functions/feed-status`  
**நோக்கம்:** ஒவ்வொரு ஃபீடும் கடைசியாக எப்போது அப்டேட் செய்யப்பட்டது மற்றும் சமீபத்திய ஃபெட்ச்கள் (fetches) வெற்றி பெற்றதா என்பதைத் தெரிவிக்கிறது. சர்வர் தரவுகளின் அடிப்படையில் "Data last updated: X" என்பதைக் காட்ட கிளைன்ட் (client) இதைப் பயன்படுத்துகிறது.

**ரெஸ்பான்ஸ் வடிவம் (Response shape):**
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
**எண்ட்பாயிண்ட்:** `POST /.netlify/functions/subscribe`  
**நோக்கம்:** ஈமெயில் சப்ஸ்கிரிப்ஷன்களை (email subscriptions) நிர்வகிக்கிறது. `subscribe` மற்றும் `unsubscribe` ஆக்‌ஷன்களை ஏற்கும்.

**ரிக்வெஸ்ட் பாடி (Request body):**
```json
{
  "email": "user@example.com",
  "cities": ["delhi", "mumbai"],
  "threshold": 150,
  "action": "subscribe"
}
```

| ஃபீல்டு (Field) | கட்டாயமா | விளக்கம் |
|-------|----------|-------------|
| `email` | ஆம் | சப்ஸ்கிரைபர் ஈமெயில் |
| `cities` | ஆம் | சிட்டி கீகளின் வரிசை (array) (`daily-digest.mjs`-ல் உள்ள சிட்டி பட்டியலைப் பார்க்கவும்) |
| `threshold` | இல்லை | AQI த்ரெஷோல்டு (threshold); கொடுக்கப்படாவிட்டால் 200 ஆக இருக்கும். இது டைஜஸ்ட்டை (digest) நிறுத்தாது: `daily-digest.mjs` ஒவ்வொரு சப்ஸ்கிரைபருக்கும் தினமும் ஈமெயில் அனுப்பும், த்ரெஷோல்டு அலர்ட் வார்த்தைகளை மட்டுமே மாற்றும் |
| `action` | ஆம் | `"subscribe"` அல்லது `"unsubscribe"` |

---

### AI ஃபங்ஷன்கள் (Groq-Powered)

அனைத்து AI ஃபங்ஷன்களும் Groq REST API (OpenAI-compatible) வழியாக OpenAI gpt-oss-120b (ஒரு ஓபன்-வெயிட் LLM; இயல்பாக `openai/gpt-oss-120b`, `GROQ_MODEL` மூலம் மாற்றிக்கொள்ளலாம்) பயன்படுத்துகின்றன. இதற்கு `GROQ_API_KEY` தேவை.

#### `air-query.mjs`
**எண்ட்பாயிண்ட்:** `POST /.netlify/functions/air-query` (மற்ற மெத்தட்கள் நிராகரிக்கப்படும்)  
**நோக்கம்:** ஒரு சிட்டியின் காற்றுத் தரம் பற்றிய இயல்பான மொழி கேள்வியை ஏற்றுக்கொண்டு, WAQI-லிருந்து நேரடி AQI-ஐ எடுத்து, சரியான பதிலை வழங்க Groq வழியாக gpt-oss-120b-க்கு அனுப்புகிறது.

**ரிக்வெஸ்ட் பாடி:**
```json
{
  "city": "delhi",
  "question": "Is it safe to take my child to the park today?"
}
```

விருப்பமிருந்தால் `lang` ஃபீல்டை வழங்கி ரெஸ்பான்ஸ் மொழியைக் கேட்கலாம்.

---

#### `health-advisory.mjs`
**எண்ட்பாயிண்ட்:** `POST /.netlify/functions/health-advisory`  
**நோக்கம்:** பயனரின் விவரங்கள் (வயது, உடல்நலப் பிரச்சனைகள்) மற்றும் அவர்களின் சிட்டியின் தற்போதைய AQI ஆகியவற்றின் அடிப்படையில் தனிப்பயனாக்கப்பட்ட (personalised) சுகாதார ஆலோசனையை உருவாக்குகிறது.

**ரிக்வெஸ்ட் பாடி:**
```json
{
  "city": "delhi",
  "age": 45,
  "conditions": ["asthma", "heart disease"]
}
```

---
#### `accountability-brief.mjs`
**எண்ட்பாயிண்ட் (Endpoint):** `{"city": "delhi", "area": "..."}` போன்ற JSON பாடியுடன் `POST /.netlify/functions/accountability-brief` (`city` மற்றும் `area` கட்டாயம்; `period` விருப்பத்திற்குரியது)  
**நோக்கம்:** குறிப்பிட்ட நகரத்திற்கான கட்டமைக்கப்பட்ட பொறுப்புக்கூறல் சுருக்கத்தை (accountability brief) உருவாக்குகிறது — வார்டு கவுன்சிலர்கள், பத்திரிகையாளர்கள் அல்லது குடியிருப்போர் சங்கங்களுக்கு ஏற்றது. இதில் தற்போதைய AQI, NCAP முன்னேற்றம் மற்றும் பரிந்துரைக்கப்பட்ட கேள்விகள் ஆகியவை அடங்கும்.

---

#### `anomaly-check.mjs`
**எண்ட்பாயிண்ட் (Endpoint):** `GET /.netlify/functions/anomaly-check`  
**நோக்கம்:** முக்கிய நகரங்களின் AQI-ஐ பருவகால அளவுகோல்களுடன் (seasonal baselines) ஒப்பிட்டுப் பார்த்து, குறிப்பிடத்தக்க அதிகரிப்புகளைக் கண்டறிந்து காட்டுகிறது. இந்த முரண்பாட்டிற்கான (anomaly) சாத்தியமான காரணத்தை விளக்க, Groq வழியாக gpt-oss-120b-ஐ விருப்பத்தின் பேரில் பயன்படுத்துகிறது.

---

### பிற ஃபங்ஷன்கள் (Other Functions)

`netlify/functions/` கோப்பகத்தில் மொத்தம் 29 ஃபங்ஷன் ஃபைல்கள் உள்ளன. மேலே விவரிக்கப்படாத மற்ற ஃபைல்களில் `waqi-proxy`, `rankings`, `historical-aqi`, `data-api`, `fire-tracker`, `community-sensors`, `push-subscribe`, `push-send`, `health-monitor`, `feed-health`, `status-history`, `terra-collab`, `workshop-submit`, `zotero-library` மற்றும் `reference-data` ஆகியவை அடங்கும். அவற்றின் குறிப்புகள் (reference entries) இன்னும் எழுதப்படவில்லை.

---

### பகிரப்பட்ட பயன்பாடுகள் (Shared Utilities)

#### `blob-store.js`
இது ஒரு HTTP ஃபங்ஷன் அல்ல — மற்ற ஃபங்ஷன்கள் பயன்படுத்தும் பகிரப்பட்ட CommonJS மாட்யூல் (module). இது மாற்றுச் சான்றுகளுடன் (fallback credentials) கூடிய Netlify Blobs ஸ்டோர் இன்ஸ்டன்ஸை உருவாக்குகிறது.

```js
const { getBlobStore } = require('./blob-store');
const store = getBlobStore('janvayu-feeds');
```
