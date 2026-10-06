# Netlify Functions

JanVayu सभी सर्वर-साइड ऑपरेशन्स के लिए [Netlify Functions](https://docs.netlify.com/functions/overview/) का उपयोग करता है। फंक्शन्स `netlify/functions/` में होते हैं और साइट के साथ ही अपने आप डिप्लॉय हो जाते हैं।

---

## Function Reference

### Scheduled Functions (Cron)

#### `scheduled-fetch.mjs`
**Trigger:** हर 4 घंटे में  
**Purpose:** सभी सोशल और न्यूज़ फीड्स को फेच करता है और उन्हें Netlify Blobs में JSON कैश के रूप में लिखता है।

फेच की गई फीड्स:
- r/india, r/delhi, r/indianews, r/environment, r/worldnews से Reddit पोस्ट्स
- ~~Nitter RSS इंस्टेंसेस के ज़रिए Twitter/X पोस्ट्स~~ — **रिटायर हो गया।** Nitter के पब्लिक इंस्टेंसेस बंद हो गए हैं और एंडपॉइंट अब बिल्कुल भी रिस्पॉन्स नहीं देता। X अब लिंक किया गया है, फेच नहीं किया जाता: लाइव सर्च और नेम्ड अकाउंट्स, जिनमें से हर एक को X के पब्लिक एम्बेड एंडपॉइंट के खिलाफ `scripts/verify-x-links.py` के साथ वेरिफाई किया जाता है।
- एयर क्वालिटी टॉपिक्स के लिए Google News RSS
- RSS-Bridge के ज़रिए Instagram हैशटैग्स

यह फंक्शन सुनिश्चित करता है कि ऑन-डिमांड फीड फंक्शन्स हर यूज़र रिक्वेस्ट पर लाइव API कॉल्स करने के बजाय, कैश से तुरंत रिस्पॉन्स दें।

---

#### `daily-digest.mjs`
**Trigger:** रोज़ सुबह 8:00 बजे IST (2:30 बजे UTC)  
**Purpose:** Netlify Blobs से सभी सब्सक्राइबर्स को पढ़ता है, हर सब्सक्राइबर के शहर के लिए मौजूदा AQI फेच करता है, और Resend के ज़रिए एक पर्सनलाइज़्ड HTML ईमेल भेजता है।

हर ईमेल में शामिल होता है:
- मौजूदा AQI रीडिंग और कैटेगरी
- दिन के लिए हेल्थ एडवाइज़री

**Dependencies:** `RESEND_API_KEY`, `RESEND_FROM`, `BLOB_TOKEN`, `NETLIFY_SITE_ID`

---

### On-Demand API Functions

#### `reddit-feed.js`
**Endpoint:** `GET /.netlify/functions/reddit-feed`  
**Purpose:** Netlify Blobs से एयर क्वालिटी पर कैश्ड Reddit पोस्ट्स रिटर्न करता है।  
अगर कैश खाली है, तो लाइव Reddit फेच पर फॉलबैक करता है।

---

#### `twitter-feed.js`
**Endpoint:** `GET /.netlify/functions/twitter-feed`  
**Purpose:** *रिटायर हो गया।* यह Nitter को पढ़ता था, जिसके पब्लिक इंस्टेंसेस बंद हो गए हैं; प्रोडक्शन के मुकाबले यह बिल्कुल भी रिस्पॉन्स नहीं देता। इसे कोई कॉल नहीं करता — फ्रंट एंड इसके बजाय X से लिंक करता है।

---

#### `news-proxy.js`
**Endpoint:** `GET /.netlify/functions/news-proxy`  
**Purpose:** एयर क्वालिटी टॉपिक्स पर कैश्ड Google News RSS आर्टिकल्स रिटर्न करता है।

---

#### `instagram-feed.js`
**Endpoint:** `GET /.netlify/functions/instagram-feed`  
**Purpose:** RSS-Bridge इंस्टेंसेस के ज़रिए कैश्ड Instagram हैशटैग पोस्ट्स रिटर्न करता है।

---
#### `feed-status.js`
**Endpoint:** `GET /.netlify/functions/feed-status`  
**उद्देश्य:** फीड की ताज़गी (freshness) बताता है — यानी हर फीड आखिरी बार कब अपडेट हुई थी और क्या हाल ही की फेच (fetches) सफल रहीं। इसका इस्तेमाल क्लाइंट द्वारा "Data last updated: X" दिखाने के लिए किया जाता है, ताकि सर्वर-साइड की सटीक जानकारी मिल सके।

**रिस्पॉन्स का स्ट्रक्चर:**
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
**उद्देश्य:** ईमेल सब्सक्रिप्शन मैनेज करता है। इसमें `subscribe` और `unsubscribe` एक्शन्स एक्सेप्ट किए जाते हैं।

**रिक्वेस्ट बॉडी:**
```json
{
  "email": "user@example.com",
  "cities": ["delhi", "mumbai"],
  "threshold": 150,
  "action": "subscribe"
}
```

| फील्ड | ज़रूरी | विवरण |
|-------|----------|-------------|
| `email` | हाँ | सब्सक्राइबर का ईमेल |
| `cities` | हाँ | सिटी कीज़ का ऐरे (`daily-digest.mjs` में सिटी लिस्ट देखें) |
| `threshold` | नहीं | AQI थ्रेशोल्ड; अगर इसे नहीं दिया जाता है तो यह डिफ़ॉल्ट रूप से 200 होता है। यह डाइजेस्ट को नहीं रोकता: `daily-digest.mjs` हर सब्सक्राइबर को रोज़ ईमेल भेजता है, और थ्रेशोल्ड सिर्फ अलर्ट के शब्दों को बदलता है |
| `action` | हाँ | `"subscribe"` या `"unsubscribe"` |

---

### AI Functions (Groq-Powered)

सभी AI फंक्शन्स Groq REST API (OpenAI-compatible) के ज़रिए OpenAI gpt-oss-120b (एक ओपन-वेट LLM; डिफ़ॉल्ट रूप से `openai/gpt-oss-120b`, जिसे `GROQ_MODEL` के साथ ओवरराइड किया जा सकता है) का इस्तेमाल करते हैं। इनके लिए `GROQ_API_KEY` की ज़रूरत होती है।

#### `air-query.mjs`
**Endpoint:** `POST /.netlify/functions/air-query` (अन्य मेथड्स रिजेक्ट हो जाते हैं)  
**उद्देश्य:** किसी शहर की हवा की क्वालिटी के बारे में एक नेचुरल लैंग्वेज सवाल एक्सेप्ट करता है, WAQI से लाइव AQI लाता है, और एक सटीक रिस्पॉन्स के लिए Groq के ज़रिए gpt-oss-120b को दोनों चीज़ें भेजता है।

**रिक्वेस्ट बॉडी:**
```json
{
  "city": "delhi",
  "question": "Is it safe to take my child to the park today?"
}
```

एक ऑप्शनल `lang` फील्ड रिस्पॉन्स की भाषा तय करता है।

---

#### `health-advisory.mjs`
**Endpoint:** `POST /.netlify/functions/health-advisory`  
**उद्देश्य:** यूज़र के प्रोफ़ाइल (उम्र, स्वास्थ्य संबंधी स्थितियां) और उनके शहर के मौजूदा AQI के आधार पर एक पर्सनलाइज़्ड हेल्थ एडवाइज़री जनरेट करता है।

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
**एंडपॉइंट:** `POST /.netlify/functions/accountability-brief` जिसमें `{"city": "delhi", "area": "..."}` जैसा JSON बॉडी हो (`city` और `area` आवश्यक हैं; `period` वैकल्पिक है)  
**उद्देश्य:** निर्दिष्ट शहर के लिए एक स्ट्रक्चर्ड अकाउंटेबिलिटी ब्रीफ (जवाबदेही संक्षिप्त विवरण) जनरेट करता है — जो वार्ड पार्षदों, पत्रकारों या रेजिडेंट एसोसिएशन के लिए उपयुक्त है। इसमें वर्तमान AQI, NCAP की प्रगति और सुझाए गए प्रश्न शामिल हैं।

---

#### `anomaly-check.mjs`
**एंडपॉइंट:** `GET /.netlify/functions/anomaly-check`  
**उद्देश्य:** प्रमुख शहरों के लिए मौसमी बेसलाइन के आधार पर AQI की जांच करता है और महत्वपूर्ण उछाल (spikes) को फ्लैग करता है। यह विसंगति (anomaly) के संभावित कारण को समझाने के लिए Groq के माध्यम से gpt-oss-120b का भी उपयोग कर सकता है।

---

### अन्य फंक्शन्स

`netlify/functions/` में कुल 29 फंक्शन फाइलें हैं। ऊपर बताए गए फंक्शन्स के अलावा इनमें `waqi-proxy`, `rankings`, `historical-aqi`, `data-api`, `fire-tracker`, `community-sensors`, `push-subscribe`, `push-send`, `health-monitor`, `feed-health`, `status-history`, `terra-collab`, `workshop-submit`, `zotero-library` और `reference-data` शामिल हैं। इनके रेफरेंस एंट्री अभी तक नहीं लिखे गए हैं।

---

### साझा यूटिलिटीज

#### `blob-store.js`
यह कोई HTTP फंक्शन नहीं है — यह एक साझा CommonJS मॉड्यूल है जिसका उपयोग अन्य फंक्शन्स द्वारा स्पष्ट क्रेडेंशियल फॉलबैक के साथ Netlify Blobs स्टोर इंस्टेंस बनाने के लिए किया जाता है।

```js
const { getBlobStore } = require('./blob-store');
const store = getBlobStore('janvayu-feeds');
```
