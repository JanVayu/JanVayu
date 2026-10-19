# Netlify Functions

JanVayu सभी सर्वर-साइड ऑपरेशन्स के लिए [Netlify Functions](https://docs.netlify.com/functions/overview/) का उपयोग करता है। Functions `netlify/functions/` में रहते हैं और साइट के साथ स्वचालित रूप से डिप्लॉय हो जाते हैं।

---

## Function Reference

### Scheduled Functions (Cron)

#### `scheduled-fetch.mjs`
**Trigger:** हर 4 घंटे  
**Purpose:** सभी सोशल और न्यूज़ फीड्स को फेच करता है और उन्हें Netlify Blobs में JSON कैश के रूप में लिखता है।

Feeds fetched:
- r/india, r/delhi, r/indianews, r/environment, r/worldnews से Reddit पोस्ट्स
- ~~Nitter RSS instances के माध्यम से Twitter/X पोस्ट्स~~ — **retired.** Nitter के पब्लिक इंस्टेंस बंद हो गए हैं और एंडपॉइंट अब बिल्कुल भी जवाब नहीं देता है। X अब लिंक किया गया है, फेच नहीं किया गया: लाइव सर्च और नाम वाले अकाउंट्स, प्रत्येक को X के पब्लिक एम्बेड एंडपॉइंट के खिलाफ `scripts/verify-x-links.py` के साथ वेरिफाई किया गया है।
- एयर क्वालिटी टॉपिक्स के लिए Google News RSS
- RSS-Bridge के माध्यम से Instagram हैशटैग

यह फंक्शन सुनिश्चित करता है कि ऑन-डिमांड फीड फंक्शन्स हर यूज़र रिक्वेस्ट पर लाइव API कॉल्स करने के बजाय कैश से तुरंत रिस्पॉन्स दें।

---

#### `daily-digest.mjs`
**Trigger:** रोज़ सुबह 8:00 AM IST (2:30 AM UTC)  
**Purpose:** Netlify Blobs से सभी सब्सक्राइबर्स को पढ़ता है, प्रत्येक सब्सक्राइबर के शहर के लिए वर्तमान AQI फेच करता है, और Resend के माध्यम से एक पर्सनलाइज़्ड HTML ईमेल भेजता है।

प्रत्येक ईमेल में शामिल है:
- वर्तमान AQI रीडिंग और कैटेगरी
- दिन के लिए हेल्थ एडवाइज़री

**Dependencies:** `RESEND_API_KEY`, `RESEND_FROM`, `BLOB_TOKEN`, `NETLIFY_SITE_ID`

---

### On-Demand API Functions

#### `reddit-feed.js`
**Endpoint:** `GET /.netlify/functions/reddit-feed`  
**Purpose:** Netlify Blobs से एयर क्वालिटी पर कैश्ड Reddit पोस्ट्स रिटर्न करता है।  
अगर कैश खाली है तो लाइव Reddit फेच पर फॉलबैक करता है।

---

#### `twitter-feed.js`
**Endpoint:** `GET /.netlify/functions/twitter-feed`  
**Purpose:** *Retired.* यह Nitter को पढ़ता था, जिसके पब्लिक इंस्टेंस बंद हो गए हैं; प्रोडक्शन के खिलाफ यह बिल्कुल भी जवाब नहीं देता है। कोई भी इसे कॉल नहीं करता — फ्रंट एंड इसके बजाय X को लिंक करता है।

---

#### `news-proxy.js`
**Endpoint:** `GET /.netlify/functions/news-proxy`  
**Purpose:** एयर क्वालिटी टॉपिक्स पर कैश्ड Google News RSS आर्टिकल्स रिटर्न करता है।

---

#### `instagram-feed.js`
**Endpoint:** `GET /.netlify/functions/instagram-feed`  
**Purpose:** RSS-Bridge इंस्टेंसेस के माध्यम से कैश्ड Instagram हैशटैग पोस्ट्स रिटर्न करता है।

---
#### `feed-status.js`
**एंडपॉइंट:** `GET /.netlify/functions/feed-status`  
**उद्देश्य:** फीड की ताज़गी बताता है — हर फीड आखिरी बार कब अपडेट हुई थी और क्या हाल ही में किए गए फेच सफल रहे। क्लाइंट इसका इस्तेमाल "Data last updated: X" दिखाने के लिए करता है, जिसमें सर्वर-साइड की सही जानकारी होती है।

**रिस्पॉन्स स्ट्रक्चर:**
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
**एंडपॉइंट:** `POST /.netlify/functions/subscribe`  
**उद्देश्य:** ईमेल सब्सक्रिप्शन को मैनेज करता है। `subscribe` और `unsubscribe` एक्शन्स को स्वीकार करता है।

**रिक्वेस्ट बॉडी:**
```json
{
  "email": "user@example.com",
  "cities": ["delhi", "mumbai"],
  "threshold": 150,
  "action": "subscribe"
}
```

| फ़ील्ड | ज़रूरी | विवरण |
|-------|----------|-------------|
| `email` | हाँ | सब्सक्राइबर का ईमेल |
| `cities` | हाँ | सिटी कीज़ का ऐरे (`daily-digest.mjs` में सिटी लिस्ट देखें) |
| `threshold` | नहीं | AQI थ्रेशोल्ड; अगर न दिया हो तो डिफ़ॉल्ट रूप से 200 रहता है। यह डाइजेस्ट को नहीं रोकता: `daily-digest.mjs` हर सब्सक्राइबर को रोज़ ईमेल भेजता है, और थ्रेशोल्ड सिर्फ अलर्ट के शब्दों को बदलता है |
| `action` | हाँ | `"subscribe"` या `"unsubscribe"` |

---

### AI फंक्शन्स (Groq-Powered)

सभी AI फंक्शन्स Groq REST API (OpenAI-कम्पैटिबल) के ज़रिए OpenAI gpt-oss-120b (एक ओपन-वेट LLM; डिफ़ॉल्ट रूप से `openai/gpt-oss-120b`, जिसे `GROQ_MODEL` से बदला जा सकता है) का इस्तेमाल करते हैं। इनके लिए `GROQ_API_KEY` की ज़रूरत होती है।

#### `air-query.mjs`
**एंडपॉइंट:** `POST /.netlify/functions/air-query` (अन्य मेथड्स रिजेक्ट हो जाते हैं)  
**उद्देश्य:** किसी शहर की हवा की क्वालिटी के बारे में एक प्राकृतिक भाषा (natural language) में सवाल लेता है, WAQI से लाइव AQI लाता है, और एक सही रिस्पॉन्स के लिए दोनों को Groq के ज़रिए gpt-oss-120b को भेजता है।

**रिक्वेस्ट बॉडी:**
```json
{
  "city": "delhi",
  "question": "Is it safe to take my child to the park today?"
}
```

एक वैकल्पिक `lang` फ़ील्ड रिस्पॉन्स की भाषा तय करने के लिए होता है।

---

#### `health-advisory.mjs`
**एंडपॉइंट:** `POST /.netlify/functions/health-advisory`  
**उद्देश्य:** यूज़र के प्रोफ़ाइल (उम्र, स्वास्थ्य की स्थिति) और उनके शहर के मौजूदा AQI के आधार पर एक पर्सनलाइज़्ड हेल्थ एडवाइज़री (health advisory) जनरेट करता है।

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
**Endpoint:** `POST /.netlify/functions/accountability-brief` एक JSON बॉडी के साथ जैसे `{"city": "delhi", "area": "..."}` (`city` और `area` आवश्यक हैं; `period` वैकल्पिक है)  
**उद्देश्य:** निर्दिष्ट शहर के लिए एक संरचित जवाबदेही ब्रीफ उत्पन्न करता है — जो वार्ड पार्षदों, पत्रकारों या निवासी संघों के लिए उपयुक्त है। इसमें वर्तमान AQI, NCAP प्रगति और सुझाए गए प्रश्न शामिल हैं।

---

#### `anomaly-check.mjs`
**Endpoint:** `GET /.netlify/functions/anomaly-check`  
**उद्देश्य:** प्रमुख शहरों के लिए मौसमी बेसलाइन के मुकाबले AQI की जांच करता है और महत्वपूर्ण उछाल को फ्लैग करता है। वैकल्पिक रूप से विसंगति के संभावित कारण को समझाने के लिए Groq के माध्यम से gpt-oss-120b का उपयोग करता है।

---

### अन्य फ़ंक्शन्स

`netlify/functions/` में कुल 28 फ़ंक्शन फ़ाइलें हैं। ऊपर वर्णित फ़ाइलों को छोड़कर, इनमें `waqi-proxy`, `rankings`, `historical-aqi`, `data-api`, `fire-tracker`, `community-sensors`, `push-subscribe`, `push-send`, `health-monitor`, `feed-health`, `status-history`, `terra-collab`, `workshop-submit` और `reference-data` शामिल हैं। इनकी संदर्भ प्रविष्टियां अभी तक नहीं लिखी गई हैं।

---

### साझा उपयोगिताएँ

#### `blob-store.js`
यह कोई HTTP फ़ंक्शन नहीं है — यह एक साझा CommonJS मॉड्यूल है जिसका उपयोग अन्य फ़ंक्शन्स द्वारा स्पष्ट क्रेडेंशियल फॉलबैक के साथ Netlify Blobs स्टोर इंस्टेंस बनाने के लिए किया जाता है।

```js
const { getBlobStore } = require('./blob-store');
const store = getBlobStore('janvayu-feeds');
```
