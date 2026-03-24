# Backend स्टॅक

JanVayu चा backend पूर्णपणे serverless आहे — डेटा proxying, caching, scheduled tasks, ईमेल delivery आणि AI वैशिष्ट्ये हाताळणारे 13 Netlify Functions.

---

## Netlify Functions

**Runtime:** Node.js 18
**Module format:** AI वैशिष्ट्यांसाठी ES Modules (`.mjs`), feed proxies साठी CommonJS (`.js`)
**स्थान:** `netlify/functions/`

### Function सूची

| Function | प्रकार | उद्देश |
|----------|------|---------|
| `scheduled-fetch.mjs` | Scheduled (cron, दर 4 तासांनी) | सर्व सोशल/बातम्या फीड्स पूर्व-आणतो |
| `daily-digest.mjs` | Scheduled (cron, 8 AM IST) | दैनिक AQI ईमेल डायजेस्ट पाठवतो |
| `air-query.mjs` | On-demand (POST) | AI: नैसर्गिक भाषा AQI Q&A |
| `health-advisory.mjs` | On-demand (POST) | AI: वैयक्तिकृत आरोग्य सल्ला |
| `accountability-brief.mjs` | On-demand (POST) | AI: वॉर्ड-स्तरीय शासन ब्रीफ |
| `anomaly-check.mjs` | On-demand (GET) | AI: PM2.5 स्पाइक शोध |
| `reddit-feed.js` | On-demand (GET) | कॅश केलेले Reddit हवा गुणवत्ता पोस्ट |
| `twitter-feed.js` | On-demand (GET) | कॅश केलेले Twitter/X पोस्ट |
| `instagram-feed.js` | On-demand (GET) | कॅश केलेले Instagram पोस्ट |
| `news-proxy.js` | On-demand (GET) | कॅश केलेले बातम्या लेख |
| `subscribe.js` | On-demand (POST) | ईमेल सदस्यत्व व्यवस्थापन |
| `feed-status.js` | On-demand (GET) | फीड ताजेपणा हेल्थ चेक |
| `blob-store.js` | Utility (शेअर्ड) | Netlify Blobs store initialization |

### सामान्य पॅटर्न

प्रत्येक function समान टेम्पलेट फॉलो करतो:

```javascript
export default async (req, context) => {
  // 1. CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: corsHeaders });
  }

  try {
    // 2. मुख्य तर्क (डेटा आणणे, AI कॉल करणे, इ.)
    const result = await doWork();

    // 3. JSON परत करा
    return Response.json(result, { headers: corsHeaders });
  } catch (error) {
    // 4. सुंदर fallback — कधीही body नसलेला 500 नाही
    console.log('Error:', error.message);
    return Response.json({ error: 'Service unavailable', fallback: rawData }, {
      status: 200,
      headers: corsHeaders,
    });
  }
};
```

---

## Netlify Blobs (कॅश स्तर)

**Package:** `@netlify/blobs` v8.1.0
**Consistency:** Strong (eventual नाही)
**Store name:** `feed-cache`

### कॅशिंग कसे कार्य करते

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────┐
│ scheduled-fetch  │────▶│  Netlify Blobs    │◀────│ On-demand    │
│ (दर 4 तासांनी)  │     │  (JSON cache)     │     │ functions    │
│                  │     │                   │     │ (तात्काळ)    │
│ Reddit,          │     │ reddit-posts      │     │ कॅशमधून     │
│ Twitter, News,   │     │ twitter-posts     │     │ प्रथम सर्व्ह │
│ Instagram आणतो   │     │ news-articles     │     │              │
└──────────────────┘     │ instagram-posts   │     └──────────────┘
                         └──────────────────┘
```

**Cache-first धोरण:**
1. On-demand function कॅश केलेल्या डेटासाठी Blobs तपासतो
2. कॅश hit असल्यास → तात्काळ परत करा (sub-50ms प्रतिसाद)
3. कॅश miss असल्यास → लाइव्ह आणा, Blobs मध्ये लिहा, परत करा
4. लाइव्ह fetch अयशस्वी झाल्यास → जुना कॅश परत करा (काहीच नसण्यापेक्षा चांगले)

हे सुनिश्चित करते की फीड खंडित (Reddit rate limits, Nitter downtime) परिणामी किंचित जुना डेटा मिळतो — कधीही तुटलेला UI नाही.

---

## Resend (ईमेल Delivery)

**Package:** `resend` v6.9.3
**वापरतो:** `daily-digest.mjs`
**From address:** `digest@janvayu.in`

### दैनिक डायजेस्ट प्रवाह

1. `daily-digest.mjs` 8:00 AM IST ला fire होतो (Netlify scheduled function)
2. सदस्याच्या शहरांसाठी WAQI वरून लाइव्ह AQI आणतो
3. AQI डेटा, ट्रेंड आणि आरोग्य मार्गदर्शनासह स्वच्छ HTML ईमेल स्वरूपित करतो
4. Resend API द्वारे पाठवतो

**SendGrid/Mailgun ऐवजी Resend का:**
- स्वच्छ API, किमान कोड
- फ्री टियर JanVayu च्या सदस्य volume कव्हर करतो
- भारतीय ईमेल प्रदात्यांना चांगली deliverability (Gmail India, Outlook India)
- अंगभूत bounce/complaint handling

---

## WAQI API (Client-Side)

World Air Quality Index API हा ब्राउझरमधून थेट कॉल केला जाणारा एकमेव बाह्य API आहे.

**Token:** फ्री-टियर पब्लिक key (क्लायंट JS मध्ये एम्बेड — हे डिझाइनने आहे, लीक नाही)
**Refresh:** `setInterval` द्वारे दर 10 मिनिटांनी
**वापरलेले Endpoints:**
- `api.waqi.info/feed/{city}/` — एका शहराचा AQI
- `api.waqi.info/map/bounds/` — भौगोलिक सीमांमधील स्टेशन

**Client-side का:**
- रिअल-टाइम डेटा (कॅशिंग विलंब नाही)
- फ्री टियरला पब्लिक वापरावर API key निर्बंध नाही
- Serverless function invocations कमी करते
