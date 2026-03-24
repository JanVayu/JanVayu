# Netlify Functions

JanVayu सर्व सर्व्हर-साइड ऑपरेशन्ससाठी [Netlify Functions](https://docs.netlify.com/functions/overview/) वापरतो. Functions `netlify/functions/` मध्ये राहतात आणि साइटसह स्वयंचलितपणे डिप्लॉय होतात.

---

## Function संदर्भ

### Scheduled Functions (Cron)

#### `scheduled-fetch.mjs`
**ट्रिगर:** दर 4 तासांनी
**उद्देश:** सर्व सोशल आणि बातम्या फीड्स आणतो आणि Netlify Blobs मध्ये JSON कॅश म्हणून लिहितो.

आणलेले फीड्स:
- r/india, r/delhi, r/indianews, r/environment, r/worldnews वरील Reddit पोस्ट
- Nitter RSS instances द्वारे Twitter/X पोस्ट (hashtags: DelhiAirQuality, DelhiPollution, CleanAirIndia, इ.)
- हवा गुणवत्ता विषयांसाठी Google News RSS
- RSS-Bridge द्वारे Instagram hashtags

हा function सुनिश्चित करतो की ऑन-डिमांड फीड functions कॅशमधून तात्काळ प्रतिसाद देतात, प्रत्येक वापरकर्ता विनंतीवर लाइव्ह API कॉल करण्याऐवजी.

---

#### `daily-digest.mjs`
**ट्रिगर:** दररोज 8:00 AM IST (2:30 AM UTC)
**उद्देश:** Netlify Blobs मधून सर्व सदस्य वाचतो, प्रत्येक सदस्याच्या शहरासाठी सध्याचा AQI आणतो आणि Resend द्वारे वैयक्तिकृत HTML ईमेल पाठवतो.

प्रत्येक ईमेलमध्ये समाविष्ट आहे:
- सध्याचे AQI रीडिंग आणि वर्ग
- दिवसासाठी आरोग्य सल्ला
- मागील दिवसाच्या रीडिंगशी तुलना

**Dependencies:** `RESEND_API_KEY`, `RESEND_FROM`, `BLOB_TOKEN`, `NETLIFY_SITE_ID`

---

### On-Demand API Functions

#### `reddit-feed.js`
**Endpoint:** `GET /.netlify/functions/reddit-feed`
**उद्देश:** Netlify Blobs मधून कॅश केलेले हवा गुणवत्ता Reddit पोस्ट परत करतो.
कॅश रिकामा असल्यास लाइव्ह Reddit fetch वर fallback होतो.

---

#### `twitter-feed.js`
**Endpoint:** `GET /.netlify/functions/twitter-feed`
**उद्देश:** Netlify Blobs मधून Nitter RSS द्वारे कॅश केलेले Twitter/X पोस्ट परत करतो.

---

#### `news-proxy.js`
**Endpoint:** `GET /.netlify/functions/news-proxy`
**उद्देश:** हवा गुणवत्ता विषयांवर कॅश केलेले Google News RSS लेख परत करतो.

---

#### `instagram-feed.js`
**Endpoint:** `GET /.netlify/functions/instagram-feed`
**उद्देश:** RSS-Bridge instances द्वारे कॅश केलेले Instagram hashtag पोस्ट परत करतो.

---

#### `feed-status.js`
**Endpoint:** `GET /.netlify/functions/feed-status`
**उद्देश:** फीड ताजेपणा परत करतो — प्रत्येक फीड शेवटचे कधी अपडेट झाले आणि अलीकडील fetch यशस्वी झाले का. क्लायंटद्वारे "डेटा शेवटचे अपडेट: X" सर्व्हर-साइड सत्यासह दाखवण्यासाठी वापरले जाते.

**प्रतिसाद आकार:**
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
**उद्देश:** ईमेल सदस्यत्व व्यवस्थापित करतो. `subscribe` आणि `unsubscribe` क्रिया स्वीकारतो.

**विनंती बॉडी:**
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
| `email` | होय | सदस्य ईमेल |
| `cities` | होय | शहर keys चा array (`daily-digest.mjs` मधील शहर यादी पहा) |
| `threshold` | नाही | AQI थ्रेशोल्ड; सेट असल्यास, फक्त AQI या मूल्यापेक्षा जास्त असतानाच पाठवतो |
| `action` | होय | `"subscribe"` किंवा `"unsubscribe"` |

---

### AI Functions (Gemini-चालित)

सर्व AI functions `@google/generative-ai` द्वारे Google Gemini वापरतात. त्यांना `GEMINI_API_KEY` आवश्यक आहे.

#### `air-query.mjs`
**Endpoint:** `GET /.netlify/functions/air-query?city={cityKey}&question={question}`
**उद्देश:** शहराच्या हवा गुणवत्तेबद्दल नैसर्गिक भाषेतील प्रश्न स्वीकारतो, WAQI वरून लाइव्ह AQI आणतो, आणि दोन्ही माहितीपूर्ण प्रतिसादासाठी Gemini ला पाठवतो.

**उदाहरण:** `?city=delhi&question=Is it safe to take my child to the park today?`

---

#### `health-advisory.mjs`
**Endpoint:** `POST /.netlify/functions/health-advisory`
**उद्देश:** वापरकर्त्याच्या प्रोफाइल (वय, आरोग्य स्थिती) आणि त्यांच्या शहराच्या सध्याच्या AQI वर आधारित वैयक्तिकृत आरोग्य सल्ला तयार करतो.

**विनंती बॉडी:**
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
**उद्देश:** निर्दिष्ट शहरासाठी संरचित उत्तरदायित्व ब्रीफ तयार करतो — वॉर्ड नगरसेवक, पत्रकार किंवा रहिवासी संघटनांसाठी योग्य. सध्याचा AQI, NCAP प्रगती आणि सुचवलेले प्रश्न समाविष्ट आहेत.

---

#### `anomaly-check.mjs`
**Endpoint:** `GET /.netlify/functions/anomaly-check`
**उद्देश:** प्रमुख शहरांसाठी AQI हंगामी baselines विरुद्ध तपासतो आणि लक्षणीय स्पाइक फ्लॅग करतो. वैकल्पिकरित्या विसंगतीचे संभाव्य कारण स्पष्ट करण्यासाठी Gemini वापरतो.

---

### शेअर्ड युटिलिटीज

#### `blob-store.js`
HTTP function नाही — explicit credential fallback सह Netlify Blobs store instance तयार करण्यासाठी इतर functions द्वारे वापरला जाणारा शेअर्ड CommonJS मॉड्यूल.

```js
const { getBlobStore } = require('./blob-store');
const store = getBlobStore('janvayu-feeds');
```
