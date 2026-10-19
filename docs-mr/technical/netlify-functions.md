# Netlify Functions

JanVayu सर्व सर्व्हर-साइड ऑपरेशन्ससाठी [Netlify Functions](https://docs.netlify.com/functions/overview/) वापरते. फंक्शन्स `netlify/functions/` मध्ये असतात आणि साईटसोबत आपोआप डिप्लॉय होतात.

---

## Function Reference

### Scheduled Functions (Cron)

#### `scheduled-fetch.mjs`
**Trigger:** दर 4 तासांनी  
**Purpose:** सर्व सोशल आणि न्यूज फीड्स फेच करते आणि त्यांना Netlify Blobs मध्ये JSON कॅशे म्हणून लिहिते.

फेच केलेले फीड्स:
- r/india, r/delhi, r/indianews, r/environment, r/worldnews मधील Reddit पोस्ट्स
- ~~Nitter RSS इन्स्टन्सेसद्वारे Twitter/X पोस्ट्स~~ — **बंद.** Nitter चे पब्लिक इन्स्टन्सेस बंद झाले आहेत आणि एंडपॉईंट आता अजिबात रिस्पॉन्स देत नाही. X आता लिंक केले आहे, फेच केले जात नाही: लाईव्ह सर्च आणि विशिष्ट अकाउंट्स X च्या पब्लिक एम्बेड एंडपॉईंटवर `scripts/verify-x-links.py` द्वारे व्हेरिफाय केले जातात.
- हवेच्या गुणवत्तेच्या (air quality) विषयांसाठी Google News RSS
- RSS-Bridge द्वारे Instagram हॅशटॅग्स

या फंक्शनमुळे ऑन-डिमांड फीड फंक्शन्स प्रत्येक युझर रिक्वेस्टवर लाईव्ह API कॉल्स करण्याऐवजी कॅशेमधून लगेच रिस्पॉन्स देतात याची खात्री होते.

---

#### `daily-digest.mjs`
**Trigger:** दररोज सकाळी 8:00 AM IST (2:30 AM UTC)  
**Purpose:** Netlify Blobs मधून सर्व सबस्क्रायबर्स वाचते, प्रत्येक सबस्क्रायबरच्या शहरासाठी सध्याचा AQI फेच करते आणि Resend द्वारे पर्सनलाईज्ड HTML ईमेल पाठवते.

प्रत्येक ईमेलमध्ये खालील गोष्टी असतात:
- सध्याचे AQI रीडिंग आणि कॅटेगरी
- दिवसासाठी हेल्थ ॲडव्हायझरी

**Dependencies:** `RESEND_API_KEY`, `RESEND_FROM`, `BLOB_TOKEN`, `NETLIFY_SITE_ID`

---

### On-Demand API Functions

#### `reddit-feed.js`
**Endpoint:** `GET /.netlify/functions/reddit-feed`  
**Purpose:** Netlify Blobs मधील हवेच्या गुणवत्तेवरील Reddit पोस्ट्सचा कॅशे केलेला डेटा परत करते. कॅशे रिकामा असल्यास लाईव्ह Reddit फेचवर फॉलबॅक करते.

---

#### `twitter-feed.js`
**Endpoint:** `GET /.netlify/functions/twitter-feed`  
**Purpose:** *बंद.* हे Nitter वाचायचे, ज्याचे पब्लिक इन्स्टन्सेस आता बंद झाले आहेत; प्रोडक्शनच्या तुलनेत हे अजिबात रिस्पॉन्स देत नाही. याला कोणीही कॉल करत नाही — फ्रंट एंड त्याऐवजी X ला लिंक करते.

---

#### `news-proxy.js`
**Endpoint:** `GET /.netlify/functions/news-proxy`  
**Purpose:** हवेच्या गुणवत्तेच्या विषयांवरील Google News RSS आर्टिकल्सचा कॅशे केलेला डेटा परत करते.

---

#### `instagram-feed.js`
**Endpoint:** `GET /.netlify/functions/instagram-feed`  
**Purpose:** RSS-Bridge इन्स्टन्सेसद्वारे कॅशे केलेले Instagram हॅशटॅग पोस्ट्स परत करते.

---
#### `feed-status.js`
**Endpoint:** `GET /.netlify/functions/feed-status`  
**उद्देश:** फीडची ताजी स्थिती (freshness) दर्शवते — प्रत्येक फीड शेवटचे कधी अपडेट केले गेले आणि अलीकडील फेचेस यशस्वी झाले की नाही. सर्व्हर-साइड सत्यासह "Data last updated: X" दाखवण्यासाठी क्लायंट याचा वापर करतो.

**रिस्पॉन्स आकार (Response shape):**
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
**उद्देश:** ईमेल सबस्क्रिप्शन्स व्यवस्थापित करते. `subscribe` आणि `unsubscribe` या ॲक्शन्स स्वीकारते.

**रिक्वेस्ट बॉडी (Request body):**
```json
{
  "email": "user@example.com",
  "cities": ["delhi", "mumbai"],
  "threshold": 150,
  "action": "subscribe"
}
```

| फील्ड | आवश्यक | वर्णन |
|-------|----------|-------------|
| `email` | होय | सबस्क्रायबरचा ईमेल |
| `cities` | होय | सिटी कीजचा ॲरे (`daily-digest.mjs` मधील सिटी लिस्ट पहा) |
| `threshold` | नाही | AQI थ्रेशोल्ड; वगळल्यास 200 वर डिफॉल्ट होते. यामुळे डायजेस्ट थांबत नाही: `daily-digest.mjs` दररोज प्रत्येक सबस्क्रायबरला ईमेल पाठवते, आणि थ्रेशोल्ड फक्त अलर्टच्या शब्दांमध्ये बदल करतो |
| `action` | होय | `"subscribe"` किंवा `"unsubscribe"` |

---

### AI फंक्शन्स (Groq-Powered)

सर्व AI फंक्शन्स Groq REST API (OpenAI-compatible) द्वारे OpenAI gpt-oss-120b (एक ओपन-वेट LLM; `openai/gpt-oss-120b` बाय डिफॉल्ट, `GROQ_MODEL` द्वारे ओव्हरराइड करता येण्याजोगे) वापरतात. त्यांना `GROQ_API_KEY` ची आवश्यकता असते.

#### `air-query.mjs`
**Endpoint:** `POST /.netlify/functions/air-query` (इतर मेथड्स रिजेक्ट केल्या जातात)  
**उद्देश:** शहराच्या हवेच्या गुणवत्तेबद्दलचा नैसर्गिक भाषेतील प्रश्न स्वीकारते, WAQI कडून लाईव्ह AQI आणते आणि माहितीपूर्ण प्रतिसादासाठी दोन्ही गोष्टी Groq द्वारे gpt-oss-120b ला पाठवते.

**रिक्वेस्ट बॉडी:**
```json
{
  "city": "delhi",
  "question": "Is it safe to take my child to the park today?"
}
```

`lang` हे एक पर्यायी फील्ड आहे जे प्रतिसादाची भाषा विचारते.

---

#### `health-advisory.mjs`
**Endpoint:** `POST /.netlify/functions/health-advisory`  
**उद्देश:** वापरकर्त्याचे प्रोफाईल (वय, आरोग्याच्या समस्या) आणि त्यांच्या शहरातील सध्याच्या AQI वर आधारित वैयक्तिकृत आरोग्य सल्ला (health advisory) तयार करते.

**रिक्वेस्ट बॉडी:**
```json
{
  "city": "delhi",
  "age": 45,
  "conditions": ["asthma", "heart disease"]
}
```

---
#### `accountability-brief.mjs`
**एंडपॉइंट:** `POST /.netlify/functions/accountability-brief` सोबत `{"city": "delhi", "area": "..."}` सारखे JSON बॉडी (येथे `city` आणि `area` आवश्यक आहेत; `period` ऐच्छिक आहे)  
**उद्देश:** विशिष्ट शहरासाठी एक स्ट्रक्चर्ड अकाउंटेबिलिटी ब्रीफ तयार करते — जे वॉर्ड कौन्सिलर्स, पत्रकार किंवा रहिवासी संघटनांसाठी उपयुक्त आहे. यामध्ये सध्याचा AQI, NCAP ची प्रगती आणि सुचवलेले प्रश्न समाविष्ट आहेत.

---

#### `anomaly-check.mjs`
**एंडपॉइंट:** `GET /.netlify/functions/anomaly-check`  
**उद्देश:** प्रमुख शहरांच्या AQI ची हंगामी बेसलाइनशी तुलना करून तपासणी करते आणि लक्षणीय वाढ आढळल्यास ती दर्शवते. यातील त्रुटीचे संभाव्य कारण स्पष्ट करण्यासाठी Groq द्वारे gpt-oss-120b चा ऐच्छिक वापर केला जातो.

---

### इतर फंक्शन्स

`netlify/functions/` मध्ये एकूण 28 फंक्शन फाइल्स आहेत. वर वर्णन न केलेल्या फंक्शन्समध्ये `waqi-proxy`, `rankings`, `historical-aqi`, `data-api`, `fire-tracker`, `community-sensors`, `push-subscribe`, `push-send`, `health-monitor`, `feed-health`, `status-history`, `terra-collab`, `workshop-submit` आणि `reference-data` यांचा समावेश आहे. त्यांचे संदर्भ (रेफरन्स) अद्याप लिहिलेले नाहीत.

---

### शेअर्ड युटिलिटीज

#### `blob-store.js`
हे HTTP फंक्शन नाही — तर इतर फंक्शन्सद्वारे Netlify Blobs स्टोअर इन्स्टन्स तयार करण्यासाठी वापरले जाणारे एक शेअर्ड CommonJS मॉड्युल आहे, ज्यामध्ये स्पष्ट क्रेडेंशियल फॉलबॅक असतो.

```js
const { getBlobStore } = require('./blob-store');
const store = getBlobStore('janvayu-feeds');
```
