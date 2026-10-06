# Netlify Functions

JanVayu सर्व सर्व्हर-साइड ऑपरेशन्ससाठी [Netlify Functions](https://docs.netlify.com/functions/overview/) वापरते. फंक्शन्स `netlify/functions/` मध्ये असतात आणि साइटसोबत आपोआप डिप्लॉय होतात.

---

## फंक्शन रेफरन्स

### शेड्युल्ड फंक्शन्स (Cron)

#### `scheduled-fetch.mjs`
**ट्रिगर:** दर ४ तासांनी  
**उद्देश:** सर्व सोशल आणि न्यूज फीड्स मिळवते आणि त्यांना Netlify Blobs मध्ये JSON कॅशे म्हणून लिहिते.

मिळवलेले फीड्स:
- r/india, r/delhi, r/indianews, r/environment, r/worldnews मधील Reddit पोस्ट्स
- ~~Nitter RSS इन्स्टन्सेसद्वारे Twitter/X पोस्ट्स~~ — **बंद केले.** Nitter चे पब्लिक इन्स्टन्सेस बंद झाले आहेत आणि एंडपॉइंट आता अजिबात रिस्पॉन्स देत नाही. X आता लिंक केले जाते, मिळवले जात नाही: लाईव्ह सर्च आणि नावासह खाती, प्रत्येक X च्या पब्लिक एम्बेड एंडपॉइंटच्या विरुद्ध `scripts/verify-x-links.py` ने व्हेरिफाय केले जाते.
- हवेच्या गुणवत्तेच्या विषयांसाठी Google News RSS
- RSS-Bridge द्वारे Instagram हॅशटॅग्स

हे फंक्शन सुनिश्चित करते की ऑन-डिमांड फीड फंक्शन्स प्रत्येक युझर रिक्वेस्टवर लाईव्ह API कॉल्स करण्याऐवजी कॅशेमधून त्वरित रिस्पॉन्स देतात.

---

#### `daily-digest.mjs`
**ट्रिगर:** दररोज सकाळी ८:०० वाजता IST (सकाळी २:३० UTC)  
**उद्देश:** Netlify Blobs मधून सर्व सबस्क्रायबर्स वाचते, प्रत्येक सबस्क्रायबरच्या शहरासाठी सध्याचा AQI मिळवते आणि Resend द्वारे पर्सनलाईज्ड HTML ईमेल पाठवते.

प्रत्येक ईमेलमध्ये समाविष्ट असते:
- सध्याचे AQI रीडिंग आणि कॅटेगरी
- त्या दिवसासाठी हेल्थ ॲडव्हायझरी

**डिपेंडन्सीज:** `RESEND_API_KEY`, `RESEND_FROM`, `BLOB_TOKEN`, `NETLIFY_SITE_ID`

---

### ऑन-डिमांड API फंक्शन्स

#### `reddit-feed.js`
**एंडपॉइंट:** `GET /.netlify/functions/reddit-feed`  
**उद्देश:** Netlify Blobs मधील हवेच्या गुणवत्तेबद्दलच्या कॅशे केलेल्या Reddit पोस्ट्स रिटर्न करते.  
जर कॅशे रिकामे असेल तर लाईव्ह Reddit फेचवर फॉलबॅक करते.

---

#### `twitter-feed.js`
**एंडपॉइंट:** `GET /.netlify/functions/twitter-feed`  
**उद्देश:** *बंद केले.* हे Nitter वाचायचे होते, ज्याचे पब्लिक इन्स्टन्सेस बंद झाले आहेत; प्रोडक्शनच्या विरुद्ध मोजले असता ते अजिबात रिस्पॉन्स देत नाही. कोणीही याला कॉल करत नाही — फ्रंट एंड त्याऐवजी X ला लिंक करते.

---

#### `news-proxy.js`
**एंडपॉइंट:** `GET /.netlify/functions/news-proxy`  
**उद्देश:** हवेच्या गुणवत्तेच्या विषयांवरील कॅशे केलेले Google News RSS आर्टिकल्स रिटर्न करते.

---

#### `instagram-feed.js`
**एंडपॉइंट:** `GET /.netlify/functions/instagram-feed`  
**उद्देश:** RSS-Bridge इन्स्टन्सेसद्वारे कॅशे केलेले Instagram हॅशटॅग पोस्ट्स रिटर्न करते.

---
#### `feed-status.js`
**एंडपॉइंट:** `GET /.netlify/functions/feed-status`  
**उद्देश:** फीडची ताजेपणा (freshness) माहिती देतो — प्रत्येक फीड शेवटची कधी अपडेट झाली आणि अलीकडील फेचेस यशस्वी झाले की नाही. सर्व्हर-साइडच्या अचूक माहितीसह "Data last updated: X" दाखवण्यासाठी क्लायंटद्वारे याचा वापर केला जातो.

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
**उद्देश:** ईमेल सबस्क्रिप्शन्स व्यवस्थापित करतो. `subscribe` आणि `unsubscribe` ॲक्शन्स स्वीकारतो.

**रिक्वेस्ट बॉडी:**
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
| `threshold` | नाही | AQI थ्रेशोल्ड; वगळल्यास डिफॉल्ट 200 असते. यामुळे डायजेस्ट थांबत नाही: `daily-digest.mjs` दररोज प्रत्येक सबस्क्रायबरला ईमेल पाठवते, आणि थ्रेशोल्ड फक्त अलर्टच्या शब्दांमध्ये बदल करते |
| `action` | होय | `"subscribe"` किंवा `"unsubscribe"` |

---

### एआय फंक्शन्स (Groq-Powered)

सर्व एआय फंक्शन्स Groq REST API (OpenAI-compatible) द्वारे OpenAI gpt-oss-120b (एक ओपन-वेट LLM; डिफॉल्टनुसार `openai/gpt-oss-120b`, जे `GROQ_MODEL` वापरून बदलता येते) वापरतात. त्यांना `GROQ_API_KEY` ची आवश्यकता असते.

#### `air-query.mjs`
**एंडपॉइंट:** `POST /.netlify/functions/air-query` (इतर मेथड्स रिजेक्ट केल्या जातात)  
**उद्देश:** शहराच्या हवेच्या गुणवत्तेबद्दल नैसर्गिक भाषेतील प्रश्न स्वीकारतो, WAQI कडून लाईव्ह AQI मिळवतो, आणि माहितीपूर्ण रिस्पॉन्ससाठी Groq द्वारे gpt-oss-120b ला दोन्ही गोष्टी पाठवतो.

**रिक्वेस्ट बॉडी:**
```json
{
  "city": "delhi",
  "question": "Is it safe to take my child to the park today?"
}
```

पर्यायी `lang` फील्ड रिस्पॉन्सची भाषा मागण्यासाठी वापरता येते.

---

#### `health-advisory.mjs`
**एंडपॉइंट:** `POST /.netlify/functions/health-advisory`  
**उद्देश:** वापरकर्त्याचा प्रोफाईल (वय, आरोग्य स्थिती) आणि त्यांच्या शहरातील सध्याच्या AQI वर आधारित वैयक्तिकृत (personalised) हेल्थ ॲडव्हायझरी तयार करतो.

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
**Endpoint:** `POST /.netlify/functions/accountability-brief` सोबत JSON body जसे की `{"city": "delhi", "area": "..."}` (`city` आणि `area` आवश्यक आहेत; `period` ऐच्छिक आहे)  
**उद्देश:** विशिष्ट शहरासाठी एक स्ट्रक्चर्ड अकाउंटेबिलिटी ब्रीफ तयार करणे — जे वॉर्ड कौन्सिलर्स, पत्रकार किंवा निवासी संस्थांसाठी उपयुक्त आहे. यामध्ये सध्याचा AQI, NCAP ची प्रगती आणि सुचवलेले प्रश्न समाविष्ट आहेत.

---

#### `anomaly-check.mjs`
**Endpoint:** `GET /.netlify/functions/anomaly-check`  
**उद्देश:** प्रमुख शहरांच्या AQI ची हंगामी बेसलाइनसोबत तपासणी करणे आणि लक्षणीय वाढ (spikes) आढळल्यास ते फ्लॅग करणे. यातील विसंगतीचे (anomaly) संभाव्य कारण स्पष्ट करण्यासाठी Groq द्वारे पर्यायीरीत्या gpt-oss-120b चा वापर केला जातो.

---

### इतर फंक्शन्स

`netlify/functions/` मध्ये एकूण २९ फंक्शन फाइल्स आहेत. वर वर्णन न केलेल्या फंक्शन्समध्ये `waqi-proxy`, `rankings`, `historical-aqi`, `data-api`, `fire-tracker`, `community-sensors`, `push-subscribe`, `push-send`, `health-monitor`, `feed-health`, `status-history`, `terra-collab`, `workshop-submit`, `zotero-library` आणि `reference-data` यांचा समावेश आहे. त्यांचे संदर्भ (reference entries) अद्याप लिहिलेले नाहीत.

---

### सामायिक युटिलिटीज (Shared Utilities)

#### `blob-store.js`
हे HTTP फंक्शन नाही — हे एक सामायिक CommonJS मॉड्यूल आहे जे इतर फंक्शन्सद्वारे Netlify Blobs स्टोअर इन्स्टन्स तयार करण्यासाठी वापरले जाते, ज्यामध्ये स्पष्ट क्रेडेंशियल फॉलबॅक असतो.

```js
const { getBlobStore } = require('./blob-store');
const store = getBlobStore('janvayu-feeds');
```
