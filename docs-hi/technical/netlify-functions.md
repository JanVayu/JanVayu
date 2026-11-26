# नेटलाइफ फंक्शन्स
जनवायु सभी सर्वर-साइड ऑपरेशन्स के लिए [Netlify Functions](https://docs.netlify.com/functions/overview/) का उपयोग करता है। फंक्शन्स `netlify/functions/` में रहते हैं और साइट के साथ स्वचालित रूप से डिप्लॉय हो जाते हैं।
---
## फंक्शन रेफरेंस
### शेड्यूल्ड फंक्शन्स (क्रॉन)
#### `scheduled-fetch.mjs`
**ट्रिगर:** हर 4 घंटे में  
**उद्देश्य:** सभी सोशल और न्यूज़ फीड्स को फेच करता है और उन्हें JSON कैश के रूप में Netlify Blobs में लिखता है।
फेच की गई फीड्स:
- r/india, r/delhi, r/indianews, r/environment, r/worldnews से Reddit पोस्ट
- ~~Nitter RSS इंस्टेंस के ज़रिए Twitter/X पोस्ट~~ — **रिटायर हो चुकी।** Nitter के पब्लिक इंस्टेंस बंद हो चुके हैं और एंडपॉइंट अब बिल्कुल भी जवाब नहीं देता। X अब लिंक किया गया है, फेच नहीं: लाइव सर्च और नाम वाले अकाउंट, जिनमें से प्रत्येक को X के पब्लिक एम्बेड एंडपॉइंट के खिलाफ `scripts/verify-x-links.py` के साथ वेरिफाई किया गया है।
- वायु गुणवत्ता के विषयों के लिए Google News RSS
- RSS-Bridge के ज़रिए Instagram हैशटैग
यह फंक्शन सुनिश्चित करता है कि ऑन-डिमांड फीड फंक्शन्स हर यूज़र रिक्वेस्ट पर लाइव API कॉल करने के बजाय कैश से तुरंत रिस्पॉन्स दें।
---
#### `daily-digest.mjs`
**ट्रिगर:** रोज़ सुबह 8:00 AM IST (2:30 AM UTC)  
**उद्देश्य:** Netlify Blobs से सभी सब्सक्राइबर्स को पढ़ता है, प्रत्येक सब्सक्राइबर के शहर के लिए वर्तमान AQI फेच करता है, और Resend के ज़रिए एक पर्सनलाइज़्ड HTML ईमेल भेजता है।
प्रत्येक ईमेल में शामिल है:
- सब्सक्राइबर के शहरों की एक टेबल, जिसमें वर्तमान PM2.5 के लिए CPCB की कैटेगरी, और PM2.5 और PM10 µg/m³ में
- सबसे खराब शहर की कैटेगरी के लिए CPCB द्वारा प्रकाशित स्वास्थ्य प्रभाव
- एक लाइन जो बताती है कि क्या कोई शहर सब्सक्राइबर के PM2.5 अलर्ट लेवल से ऊपर है
छह घंटे से पुरानी, या अकल्पनीय रूप से कम रीडिंग नहीं दिखाई जाती है। रो (row) कहता है "No reliable reading today" और कारण बताता है (`daily-digest.mjs` में `assessReading`)।
**डिपेंडेंसीज़:** `RESEND_API_KEY`, `RESEND_FROM`, `BLOB_TOKEN`, `NETLIFY_SITE_ID`
---
### ऑन-डिमांड API फंक्शन्स
#### `reddit-feed.js`
**एंडपॉइंट:** `GET /.netlify/functions/reddit-feed`  
**उद्देश्य:** Netlify Blobs से वायु गुणवत्ता पर कैश्ड Reddit पोस्ट लौटाता है।  
अगर कैश खाली है, तो लाइव Reddit फेच पर फॉलबैक करता है।
---
#### `twitter-feed.js`
**एंडपॉइंट:** `GET /.netlify/functions/twitter-feed`  
**उद्देश्य:** *रिटायर हो चुका।* यह Nitter को पढ़ता था, जिसके पब्लिक इंस्टेंस बंद हो चुके हैं; प्रोडक्शन के मुकाबले यह बिल्कुल भी जवाब नहीं देता। कोई भी इसे कॉल नहीं करता — फ्रंट एंड इसे फेच करने के बजाय X से लिंक करता है।
---
#### `news-proxy.js`
**एंडपॉइंट:** `GET /.netlify/functions/news-proxy`  
**उद्देश्य:** वायु गुणवत्ता के विषयों पर कैश्ड Google News RSS लेख लौटाता है।
---
#### `instagram-feed.js`
**Endpoint:** `GET /.netlify/functions/instagram-feed`  
**Purpose:** RSS-Bridge instances के माध्यम से कैश्ड Instagram हैशटैग पोस्ट लौटाता है।
---
#### `feed-status.js`
**Endpoint:** `GET /.netlify/functions/feed-status`  
**Purpose:** फीड की ताज़गी लौटाता है — प्रत्येक फीड को आखिरी बार कब अपडेट किया गया था और क्या हालिया फेच सफल रहे। क्लाइंट द्वारा "Data last updated: X" को सर्वर-साइड सत्य के साथ दिखाने के लिए उपयोग किया जाता है।
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
**Purpose:** ईमेल सब्सक्रिप्शन प्रबंधित करता है। `subscribe` और `unsubscribe` क्रियाओं को स्वीकार करता है।
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
| `email` | Yes | सब्सक्राइबर ईमेल |
| `cities` | No | सिटी कीज़ का ऐरे (`daily-digest.mjs` में सिटी सूची देखें); डिफ़ॉल्ट रूप से `["delhi"]` |
| `pm25_threshold` | No | PM2.5 का µg/m³ में अलर्ट स्तर; डिफ़ॉल्ट रूप से 90 है और 10 से 500 के बीच रखा जाता है। यह डाइजेस्ट को नहीं रोकता: `daily-digest.mjs` हर सब्सक्राइबर को रोज़ ईमेल करता है, और स्तर केवल अलर्ट की शब्दावली को बदलता है। 29 अक्टूबर 2026 से पहले बनाए गए रिकॉर्ड में एक पुराना `threshold` (एक US AQI) होता है, जिसे `lib/cpcb.mjs` में `thresholdPM25()` कन्वर्ट करता है |
| `action` | No | `"unsubscribe"` पते को हटाता है; कुछ और, या कुछ नहीं, सब्सक्राइब करता है |
---
### AI Functions (Groq-Powered)
सभी AI फ़ंक्शन्स Groq REST API (OpenAI-compatible) के माध्यम से OpenAI gpt-oss-120b (एक ओपन-वेट LLM; डिफ़ॉल्ट रूप से `openai/gpt-oss-120b`, जिसे `GROQ_MODEL` के साथ ओवरराइड किया जा सकता है) का उपयोग करते हैं। इनके लिए `GROQ_API_KEY` की आवश्यकता होती है।
#### `air-query.mjs`
**Endpoint:** `POST /.netlify/functions/air-query` (अन्य विधियां अस्वीकार की जाती हैं)  
**Purpose:** किसी शहर की वायु गुणवत्ता के बारे में एक प्राकृतिक भाषा का प्रश्न स्वीकार करता है, WAQI से लाइव AQI प्राप्त करता है, और एक सूचित प्रतिक्रिया के लिए Groq के माध्यम से gpt-oss-120b को दोनों भेजता है।
**Request body:**
```json
{
  "city": "delhi",
  "question": "Is it safe to take my child to the park today?"
}
```
एक वैकल्पिक `lang` फ़ील्ड प्रतिक्रिया की भाषा का अनुरोध करता है।
---
#### `health-advisory.mjs`
**Endpoint:** `POST /.netlify/functions/health-advisory`  
**उद्देश्य:** उपयोगकर्ता की प्रोफ़ाइल (उम्र, स्वास्थ्य स्थितियां) और उनके शहर के वर्तमान AQI के आधार पर एक व्यक्तिगत स्वास्थ्य सलाह (health advisory) तैयार करता है।
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
**Endpoint:** `{"city": "delhi", "area": "..."}` जैसे JSON बॉडी के साथ `POST /.netlify/functions/accountability-brief` (`city` और `area` आवश्यक हैं; `period` वैकल्पिक है)  
**उद्देश्य:** निर्दिष्ट शहर के लिए एक संरचित जवाबदेही ब्रीफ (accountability brief) तैयार करता है — जो वार्ड पार्षदों, पत्रकारों या निवासी संघों के लिए उपयुक्त है। इसमें वर्तमान AQI, NCAP प्रगति और सुझाए गए प्रश्न शामिल हैं।
---
#### `anomaly-check.mjs`
**Endpoint:** `GET /.netlify/functions/anomaly-check`  
**उद्देश्य:** प्रमुख शहरों के लिए मौसमी बेसलाइन के मुकाबले AQI की जांच करता है और बड़े उछालों (spikes) को चिह्नित करता है। यह विसंगति (anomaly) के संभावित कारण को समझाने के लिए Groq के माध्यम से gpt-oss-120b का भी विकल्प के रूप में उपयोग करता है।
---
### अन्य फंक्शन्स
#### `waqi-proxy.mjs`
**Endpoint:** `GET /.netlify/functions/waqi-proxy`  
**उद्देश्य:** ब्राउज़र से `api.waqi.info` तक का एकमात्र रूट। यह सर्वर पर `WAQI_TOKEN` जोड़ता है, केवल सिटी स्लग, इन-रेंज कोऑर्डिनेट्स और तीन डिग्री से अधिक चौड़े बाउंडिंग बॉक्स को स्वीकार नहीं करता है, और कोऑर्डिनेट्स द्वारा लुकअप के लिए केवल तभी स्टेशन लौटाता है जब वह 30 km के भीतर हो और पिछले 6 घंटों में रिपोर्ट किया गया हो।
---
#### `air-model.mjs`
**Endpoint:** `GET /.netlify/functions/air-model?lat=..&lon=..`  
**उद्देश्य:** Open-Meteo (CAMS) से भारत में किसी बिंदु के लिए एक मॉडल किया गया PM2.5 अनुमान। यह `js/air-sources.js` में चेन की आखिरी कड़ी है, जिसका उपयोग केवल तभी किया जाता है जब किसी जगह के पास किसी स्टेशन ने हाल ही में रिपोर्ट नहीं किया हो और CPCB के दैनिक बुलेटिन में कोई हालिया आंकड़ा न हो।
---
`netlify/functions/` में कुल 29 फाइलें हैं: 28 फंक्शन्स और `blob-store.js` हेल्पर। ऊपर वर्णित नहीं किए गए फंक्शन्स में `youtube-feed`, `rankings`, `historical-aqi`, `data-api`, `fire-tracker`, `community-sensors`, `push-subscribe`, `push-send`, `health-monitor`, `feed-health`, `status-history`, `terra-collab`, `workshop-submit` और `reference-data` शामिल हैं। उनके रेफरेंस एंट्री अभी तक नहीं लिखे गए हैं।
---
### साझा उपयोगिताएँ (Shared Utilities)
#### `blob-store.js`
यह कोई HTTP फंक्शन नहीं है — यह एक साझा CommonJS मॉड्यूल है जिसका उपयोग अन्य फंक्शन्स द्वारा स्पष्ट क्रेडेंशियल फॉलबैक के साथ Netlify Blobs स्टोर इंस्टेंस बनाने के लिए किया जाता है।
---
```js
const { getBlobStore } = require('./blob-store');
const store = getBlobStore('janvayu-feeds');
```
