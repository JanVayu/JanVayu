# Netlify Functions

JanVayu அனைத்து சர்வர்-பக்க செயல்பாடுகளுக்கும் [Netlify Functions](https://docs.netlify.com/functions/overview/)-ஐ பயன்படுத்துகிறது. Functions `netlify/functions/`-ல் உள்ளன, site-உடன் தானாக வரிசைப்படுத்தப்படுகின்றன.

---

## Function குறிப்பு

### திட்டமிடப்பட்ட Functions (Cron)

#### `scheduled-fetch.mjs`
**தூண்டுதல்:** ஒவ்வொரு 4 மணி நேரம்
**நோக்கம்:** அனைத்து சமூக மற்றும் செய்தி feeds-ஐ பெற்று JSON cache-ஆக Netlify Blobs-க்கு எழுதுகிறது.

பெறப்படும் feeds:
- r/india, r/delhi, r/indianews, r/environment, r/worldnews-லிருந்து Reddit பதிவுகள்
- Nitter RSS instances வழியாக Twitter/X பதிவுகள் (hashtags: DelhiAirQuality, DelhiPollution, CleanAirIndia போன்றவை)
- காற்று தர தலைப்புகளுக்கான Google News RSS
- RSS-Bridge வழியாக Instagram hashtags

இந்த function on-demand feed functions cache-லிருந்து உடனடியாக பதிலளிப்பதை உறுதி செய்கிறது, ஒவ்வொரு பயனர் கோரிக்கையிலும் நேரடி API அழைப்புகள் செய்வதை விட.

---

#### `daily-digest.mjs`
**தூண்டுதல்:** தினமும் காலை 8:00 AM IST (2:30 AM UTC)
**நோக்கம்:** Netlify Blobs-லிருந்து அனைத்து சந்தாதாரர்களையும் படிக்கிறது, ஒவ்வொரு சந்தாதாரரின் நகரத்திற்கும் தற்போதைய AQI-ஐ பெறுகிறது, Resend வழியாக தனிப்பயனாக்கப்பட்ட HTML மின்னஞ்சலை அனுப்புகிறது.

ஒவ்வொரு மின்னஞ்சலிலும் உள்ளடங்கியவை:
- தற்போதைய AQI அளவீடு மற்றும் வகை
- அன்றைய சுகாதார ஆலோசனை
- முந்தைய நாள் அளவீட்டுடன் ஒப்பீடு

**சார்புகள்:** `RESEND_API_KEY`, `RESEND_FROM`, `BLOB_TOKEN`, `NETLIFY_SITE_ID`

---

### On-Demand API Functions

#### `reddit-feed.js`
**Endpoint:** `GET /.netlify/functions/reddit-feed`
**நோக்கம்:** Netlify Blobs-லிருந்து cache செய்யப்பட்ட Reddit காற்று தர பதிவுகளை திருப்புகிறது.
Cache காலியாக இருந்தால் நேரடி Reddit fetch-க்கு மாறுகிறது.

---

#### `twitter-feed.js`
**Endpoint:** `GET /.netlify/functions/twitter-feed`
**நோக்கம்:** Netlify Blobs-லிருந்து Nitter RSS வழியாக cache செய்யப்பட்ட Twitter/X பதிவுகளை திருப்புகிறது.

---

#### `news-proxy.js`
**Endpoint:** `GET /.netlify/functions/news-proxy`
**நோக்கம்:** காற்று தர தலைப்புகளில் cache செய்யப்பட்ட Google News RSS கட்டுரைகளை திருப்புகிறது.

---

#### `instagram-feed.js`
**Endpoint:** `GET /.netlify/functions/instagram-feed`
**நோக்கம்:** RSS-Bridge instances வழியாக cache செய்யப்பட்ட Instagram hashtag பதிவுகளை திருப்புகிறது.

---

#### `feed-status.js`
**Endpoint:** `GET /.netlify/functions/feed-status`
**நோக்கம்:** Feed புத்தம்புதிய நிலையை திருப்புகிறது — ஒவ்வொரு feed கடைசியாக எப்போது புதுப்பிக்கப்பட்டது, சமீபத்திய fetch-கள் வெற்றியடைந்ததா என்பது. கிளையண்ட் "தரவு கடைசியாக புதுப்பிக்கப்பட்டது: X" காட்ட சர்வர்-பக்க உண்மையுடன் பயன்படுத்துகிறது.

**பதில் வடிவம்:**
```json
{
  "last_updated": "2026-03-23T12:00:00Z",
  "feeds": {
    "reddit": { "updated_at": "...", "status": "ok" },
    "twitter": { "updated_at": "...", "status": "ok" },
    "news": { "updated_at": "...", "status": "ok" }
  }
}
```

---

#### `subscribe.js`
**Endpoint:** `POST /.netlify/functions/subscribe`
**நோக்கம்:** மின்னஞ்சல் சந்தாக்களை நிர்வகிக்கிறது. `subscribe` மற்றும் `unsubscribe` செயல்களை ஏற்கிறது.

**கோரிக்கை body:**
```json
{
  "email": "user@example.com",
  "cities": ["delhi", "mumbai"],
  "threshold": 150,
  "action": "subscribe"
}
```

| புலம் | தேவை | விளக்கம் |
|-------|----------|-------------|
| `email` | ஆம் | சந்தாதாரர் மின்னஞ்சல் |
| `cities` | ஆம் | நகர keys-ன் array (`daily-digest.mjs`-ல் நகர பட்டியல் பார்க்கவும்) |
| `threshold` | இல்லை | AQI வரம்பு; அமைத்தால், AQI இந்த மதிப்பை தாண்டும்போது மட்டும் அனுப்பும் |
| `action` | ஆம் | `"subscribe"` அல்லது `"unsubscribe"` |

---

### AI Functions (Gemini-இயக்கப்படுவது)

அனைத்து AI functions-ம் `@google/generative-ai` வழியாக Google Gemini-ஐ பயன்படுத்துகின்றன. `GEMINI_API_KEY` தேவை.

#### `air-query.mjs`
**Endpoint:** `GET /.netlify/functions/air-query?city={cityKey}&question={question}`
**நோக்கம்:** ஒரு நகரத்தின் காற்று தரம் பற்றிய இயற்கை மொழி கேள்வியை ஏற்றுக்கொண்டு, WAQI-லிருந்து நேரடி AQI-ஐ பெற்று, இரண்டையும் Gemini-க்கு அனுப்பி அறிவார்ந்த பதிலை உருவாக்குகிறது.

**எடுத்துக்காட்டு:** `?city=delhi&question=Is it safe to take my child to the park today?`

---

#### `health-advisory.mjs`
**Endpoint:** `POST /.netlify/functions/health-advisory`
**நோக்கம்:** பயனரின் சுயவிவரம் (வயது, சுகாதார நிலைமைகள்) மற்றும் அவர்களின் நகரத்தின் தற்போதைய AQI-ன் அடிப்படையில் தனிப்பயனாக்கப்பட்ட சுகாதார ஆலோசனையை உருவாக்குகிறது.

**கோரிக்கை body:**
```json
{
  "city": "delhi",
  "age": 45,
  "conditions": ["asthma", "heart disease"]
}
```

---

#### `accountability-brief.mjs`
**Endpoint:** `GET /.netlify/functions/accountability-brief?city={cityKey}`
**நோக்கம்:** குறிப்பிட்ட நகரத்திற்கான கட்டமைக்கப்பட்ட பொறுப்புணர்வு சுருக்கத்தை உருவாக்குகிறது — வார்டு கவுன்சிலர்கள், பத்திரிகையாளர்கள் அல்லது குடியிருப்பு சங்கங்களுக்கு பொருத்தமானது. தற்போதைய AQI, NCAP முன்னேற்றம் மற்றும் பரிந்துரைக்கப்பட்ட கேள்விகளை உள்ளடக்கியது.

---

#### `anomaly-check.mjs`
**Endpoint:** `GET /.netlify/functions/anomaly-check`
**நோக்கம்:** முக்கிய நகரங்களுக்கான AQI-ஐ பருவகால அடிப்படை மதிப்புகளுக்கு எதிராக சோதித்து குறிப்பிடத்தக்க எகிற்சிகளை அடையாளம் காட்டுகிறது. முரண்பாட்டின் சாத்தியமான காரணத்தை விளக்க விருப்பமாக Gemini-ஐ பயன்படுத்துகிறது.

---

### பகிரப்பட்ட பயன்பாடுகள்

#### `blob-store.js`
HTTP function அல்ல — வெளிப்படையான credential fallback-உடன் Netlify Blobs store instance-ஐ உருவாக்க மற்ற functions-ஆல் பயன்படுத்தப்படும் பகிரப்பட்ட CommonJS module.

```js
const { getBlobStore } = require('./blob-store');
const store = getBlobStore('janvayu-feeds');
```
