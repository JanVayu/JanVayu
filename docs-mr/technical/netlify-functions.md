# Netlify Functions
सर्व सर्व्हर-साइड ऑपरेशन्ससाठी JanVayu [Netlify Functions](https://docs.netlify.com/functions/overview/) वापरते. फंक्शन्स `netlify/functions/` मध्ये असतात आणि साइटसोबतच आपोआप डिप्लॉय होतात.
---
## Function Reference
### Scheduled Functions (Cron)
#### `scheduled-fetch.mjs`
**Trigger:** दर 4 तासांनी  
**Purpose:** सर्व सोशल आणि न्यूज फीड्स मिळवते आणि त्यांना JSON कॅशे म्हणून Netlify Blobs मध्ये लिहिते.
मिळालेले फीड्स:
- r/india, r/delhi, r/indianews, r/environment, r/worldnews मधील Reddit पोस्ट्स
- ~~Nitter RSS इन्स्टन्सेसद्वारे Twitter/X पोस्ट्स~~ — **बंद केले.** Nitter चे पब्लिक इन्स्टन्सेस बंद झाले आहेत आणि एंडपॉइंट आता अजिबात प्रतिसाद देत नाही. X आता लिंक केलेले आहे, फेच केलेले नाही: लाईव्ह सर्च आणि नेमड अकाउंट्स, प्रत्येक X च्या पब्लिक एम्बेड एंडपॉइंटच्या विरुद्ध `scripts/verify-x-links.py` ने व्हेरिफाय केलेले आहेत.
- हवेच्या गुणवत्तेच्या विषयांसाठी Google News RSS
- RSS-Bridge द्वारे Instagram हॅशटॅग्स
हे फंक्शन सुनिश्चित करते की ऑन-डिमांड फीड फंक्शन्स प्रत्येक युझर रिक्वेस्टवर लाईव्ह API कॉल्स करण्याऐवजी कॅशेमधून त्वरित प्रतिसाद देतात.
---

#### `daily-digest.mjs`
**Trigger:** दररोज सकाळी 8:00 वाजता IST (पहाटे 2:30 UTC)  
**Purpose:** Netlify Blobs मधून सर्व सबस्क्रायबर्स वाचते, प्रत्येक सबस्क्रायबरच्या शहरासाठी सध्याचा AQI मिळवते आणि Resend द्वारे पर्सनलाईज्ड HTML ईमेल पाठवते.
प्रत्येक ईमेलमध्ये समाविष्ट असते:
- सबस्क्रायबरच्या शहरांचे एक टेबल, ज्यामध्ये सध्याच्या PM2.5 साठी CPCB ची कॅटेगरी, आणि PM2.5 व PM10 ची µg/m³ मधील मूल्ये
- सर्वात वाईट शहराच्या कॅटेगरीसाठी CPCB ने प्रकाशित केलेले आरोग्यावरील परिणाम
- कोणतेही शहर सबस्क्रायबरच्या PM2.5 अलर्ट लेव्हलच्या वर आहे की नाही हे सांगणारी एक ओळ
सहा तासांपेक्षा जुने, किंवा अवास्तविक कमी असलेले रीडिंग दाखवले जात नाही. त्या रो मध्ये "No reliable reading today" असे लिहिलेले असते आणि त्याचे कारण दिले जाते (`daily-digest.mjs` मधील `assessReading`).
**Dependencies:** `RESEND_API_KEY`, `RESEND_FROM`, `BLOB_TOKEN`, `NETLIFY_SITE_ID`
---
### On-Demand API Functions
#### `reddit-feed.js`
**Endpoint:** `GET /.netlify/functions/reddit-feed`  
**Purpose:** Netlify Blobs मधील हवेच्या गुणवत्तेविषयीच्या कॅश केलेल्या Reddit पोस्ट्स परत करते.  
कॅशे रिकामे असल्यास लाईव्ह Reddit फेचवर फॉलबॅक करते.
---
#### `twitter-feed.js`
**Endpoint:** `GET /.netlify/functions/twitter-feed`  
**Purpose:** *बंद केले.* हे Nitter वाचायचे, ज्याचे पब्लिक इन्स्टन्सेस बंद झाले आहेत; प्रोडक्शनच्या तुलनेत ते अजिबात प्रतिसाद देत नाही. याला कोणीही कॉल करत नाही — फ्रंट एंड त्याऐवजी X ला लिंक करते.
---
#### `news-proxy.js`
**Endpoint:** `GET /.netlify/functions/news-proxy`  
**Purpose:** हवेच्या गुणवत्तेच्या विषयांवरील कॅश केलेले Google News RSS लेख परत करते.
---
#### `instagram-feed.js`
**Endpoint:** `GET /.netlify/functions/instagram-feed`  
**उद्देश:** RSS-Bridge इंस्टन्सेसद्वारे कॅश केलेले Instagram हॅशटॅग पोस्ट्स परत करते.
---

#### `feed-status.js`
**Endpoint:** `GET /.netlify/functions/feed-status`  
**उद्देश:** फीडची ताजेपणा परत करते — प्रत्येक फीड शेवटचे कधी अपडेट केले गेले आणि अलीकडील फेचेस यशस्वी झाले की नाही. सर्व्हर-साइड सत्यासह "Data last updated: X" दाखवण्यासाठी क्लायंटद्वारे वापरले जाते.
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
**उद्देश:** ईमेल सबस्क्रिप्शन्स व्यवस्थापित करते. `subscribe` आणि `unsubscribe` अ‍ॅक्शन्स स्वीकारते.
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
| `email` | Yes | सबस्क्रायबरचा ईमेल |
| `cities` | No | सिटी कीजचा अ‍ॅरे ( `daily-digest.mjs` मधील सिटी लिस्ट पहा); डिफॉल्ट `["delhi"]` |
| `pm25_threshold` | No | PM2.5 चे µg/m³ मधील अलर्ट लेव्हल; डिफॉल्ट 90 आणि 10 ते 500 च्या दरम्यान ठेवले जाते. हे डायजेस्ट दाबून टाकत नाही: `daily-digest.mjs` प्रत्येक सबस्क्रायबरला दररोज ईमेल पाठवते, आणि लेव्हल फक्त अलर्टचे शब्द बदलते. 29 October 2026 पूर्वी बनवलेल्या रेकॉर्ड्समध्ये जुने `threshold` (एक US AQI) असते, जे `lib/cpcb.mjs` मधील `thresholdPM25()` कन्व्हर्ट करते |
| `action` | No | `"unsubscribe"` अ‍ॅड्रेस काढून टाकते; इतर काहीही, किंवा काहीही नाही, सबस्क्राइब करते |
---
### AI Functions (Groq-Powered)
सर्व AI फंक्शन्स Groq REST API (OpenAI-compatible) द्वारे OpenAI gpt-oss-120b (एक ओपन-वेट LLM; बाय डिफॉल्ट `openai/gpt-oss-120b`, `GROQ_MODEL` द्वारे ओव्हरराइड करण्यायोग्य) वापरतात. त्यांना `GROQ_API_KEY` आवश्यक आहे.
#### `air-query.mjs`
**Endpoint:** `POST /.netlify/functions/air-query` (इतर मेथड्स रिजेक्ट केल्या जातात)  
**उद्देश:** शहराच्या हवेच्या गुणवत्तेबद्दल नैसर्गिक भाषेतील प्रश्न स्वीकारते, WAQI वरून लाईव्ह AQI फेच करते, आणि माहितीपूर्ण प्रतिसादासाठी दोन्ही Groq द्वारे gpt-oss-120b कडे पाठवते.
**Request body:**
```json
{
  "city": "delhi",
  "question": "Is it safe to take my child to the park today?"
}
```
पर्यायी `lang` फील्ड प्रतिसादाची भाषा विनंती करते.
---
#### `health-advisory.mjs`
**Endpoint:** `POST /.netlify/functions/health-advisory`  
**उद्देश:** वापरकर्त्याचा प्रोफाईल (वय, आरोग्याच्या समस्या) आणि त्यांच्या शहरातील सध्याचा AQI यावर आधारित वैयक्तिकृत आरोग्य सल्ला तयार करणे.
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
**Endpoint:** `{"city": "delhi", "area": "..."}` सारख्या JSON बॉडीसह `POST /.netlify/functions/accountability-brief` (`city` आणि `area` आवश्यक आहेत; `period` ऐच्छिक आहे)  
**उद्देश:** निर्दिष्ट शहरासाठी एक संरचित जबाबदारी ब्रीफ तयार करणे — जे वॉर्ड कौन्सिलर, पत्रकार किंवा निवासी संघटनांसाठी योग्य आहे. यामध्ये सध्याचा AQI, NCAP प्रगती आणि सुचवलेले प्रश्न समाविष्ट आहेत.
---
#### `anomaly-check.mjs`
**Endpoint:** `GET /.netlify/functions/anomaly-check`  
**उद्देश:** प्रमुख शहरांसाठी हंगामी बेसलाइन्सच्या तुलनेत AQI तपासणे आणि लक्षणीय वाढ दर्शवणे. विसंगतीचे संभाव्य कारण स्पष्ट करण्यासाठी हे पर्यायाने Groq द्वारे gpt-oss-120b वापरते.
---
### इतर फंक्शन्स
#### `waqi-proxy.mjs`
**Endpoint:** `GET /.netlify/functions/waqi-proxy`  
**उद्देश:** ब्राउझरकडून `api.waqi.info` पर्यंत जाणारा एकमेव मार्ग. हे सर्व्हरवर `WAQI_TOKEN` जोडते, केवळ सिटी स्लग्ज, इन-रेंज कोऑर्डिनेट्स आणि तीन अंशांपेक्षा जास्त नसलेला बाउंडिंग बॉक्स स्वीकारते, आणि कोऑर्डिनेट्सद्वारे शोधासाठी स्टेशन केवळ तेव्हाच परत करते जेव्हा ते 30 km च्या आत असेल आणि मागील 6 तासांत रिपोर्ट केलेले असेल.
---
#### `air-model.mjs`
**Endpoint:** `GET /.netlify/functions/air-model?lat=..&lon=..`  
**उद्देश:** Open-Meteo (CAMS) कडून भारतातील एका बिंदूसाठी मॉडेल केलेला PM2.5 अंदाज. हे `js/air-sources.js` मधील साखळीतील शेवटची लिंक आहे, ज्याचा वापर केवळ तेव्हाच केला जातो जेव्हा एखाद्या ठिकाणाजवळील कोणत्याही स्टेशनने अलीकडे रिपोर्ट केलेले नसते आणि CPCB च्या दैनिक बुलेटिनमध्ये अलीकडील आकडेवारी नसते.
---
`netlify/functions/` मध्ये एकूण 29 फाइल्स आहेत: 28 फंक्शन्स आणि `blob-store.js` हेल्पर. वर वर्णन न केलेल्या फाइल्समध्ये `youtube-feed`, `rankings`, `historical-aqi`, `data-api`, `fire-tracker`, `community-sensors`, `push-subscribe`, `push-send`, `health-monitor`, `feed-health`, `status-history`, `terra-collab`, `workshop-submit` आणि `reference-data` यांचा समावेश आहे. त्यांच्या संदर्भ नोंदी अद्याप लिहिल्या गेलेल्या नाहीत.
---
### सामायिक युटिलिटीज
#### `blob-store.js`
हे HTTP फंक्शन नाही — इतर फंक्शन्सद्वारे स्पष्ट क्रेडेंशियल फॉलबॅकसह Netlify Blobs स्टोअर इन्स्टन्स तयार करण्यासाठी वापरला जाणारा एक सामायिक CommonJS मॉड्यूल.
```js
const { getBlobStore } = require('./blob-store');
const store = getBlobStore('janvayu-feeds');
```
