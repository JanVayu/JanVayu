# बैकएंड स्टैक

JanVayu का बैकएंड पूरी तरह से सर्वरलेस है — 29 Netlify Function फ़ाइलें (साथ ही `lib/` में शेयर्ड कोड) जो डेटा प्रॉक्सीइंग, कैशिंग, शेड्यूल्ड टास्क, ईमेल डिलीवरी और AI फीचर्स को संभालती हैं।

---

## Netlify Functions

**रनटाइम:** Node.js 22
**मॉड्यूल फॉर्मेट:** AI फीचर्स के लिए ES Modules (`.mjs`), फीड प्रॉक्सी के लिए CommonJS (`.js`)
**लोकेशन:** `netlify/functions/`

### फंक्शन इन्वेंट्री

| फंक्शन | टाइप | उद्देश्य |
|----------|------|---------|
| `scheduled-fetch.mjs` | शेड्यूल्ड (cron, हर 4 घंटे में) | सभी सोशल/न्यूज़ फीड्स को प्री-फेच करता है |
| `daily-digest.mjs` | शेड्यूल्ड (cron, सुबह 8 बजे IST) | रोज़ाना AQI ईमेल डाइजेस्ट भेजता है |
| `air-query.mjs` | ऑन-डिमांड (POST) | AI: प्राकृतिक भाषा (natural language) में AQI Q&A |
| `health-advisory.mjs` | ऑन-डिमांड (POST) | AI: व्यक्तिगत स्वास्थ्य सलाह |
| `accountability-brief.mjs` | ऑन-डिमांड (POST) | AI: वार्ड-स्तर के गवर्नेंस ब्रीफ |
| `anomaly-check.mjs` | ऑन-डिमांड (GET) | AI: PM2.5 स्पाइक डिटेक्शन |
| `reddit-feed.js` | ऑन-डिमांड (GET) | कैश किए गए Reddit एयर क्वालिटी पोस्ट |
| `twitter-feed.js` | — | **रिटायर्ड।** Nitter से रीड करता था, जिसके पब्लिक इंस्टेंस अब बंद हो चुके हैं; अब कोई इसे कॉल नहीं करता। |
| `youtube-feed.js` | ऑन-डिमांड (GET) | YouTube चैनल RSS से कैश किए गए इंडिया एयर-क्वालिटी वीडियो |
| `instagram-feed.js` | ऑन-डिमांड (GET) | कैश किए गए Instagram पोस्ट |
| `news-proxy.js` | ऑन-डिमांड (GET) | कैश किए गए न्यूज़ आर्टिकल |
| `subscribe.js` | ऑन-डिमांड (POST) | ईमेल सब्सक्रिप्शन मैनेजमेंट |
| `feed-status.js` | ऑन-डिमांड (GET) | फीड की ताज़गी का हेल्थ चेक |
| `blob-store.js` | यूटिलिटी (शेयर्ड) | Netlify Blobs स्टोर इनिशियलाइज़ेशन |

यह टेबल केवल मुख्य फंक्शन्स की सूची देती है। `netlify/functions/` में अन्य फंक्शन्स में `waqi-proxy`, `rankings`, `historical-aqi`, `data-api`, `fire-tracker`, `community-sensors`, `push-subscribe`, `push-send`, `health-monitor`, `feed-health`, `status-history`, `terra-collab`, `workshop-submit` और `reference-data` शामिल हैं।

### कॉमन पैटर्न्स

हर फंक्शन एक ही टेम्पलेट का पालन करता है:
```javascript
export default async (req, context) => {
  // 1. CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: corsHeaders });
  }

  try {
    // 2. Core logic (fetch data, call AI, etc.)
    const result = await doWork();

    // 3. Return JSON
    return Response.json(result, { headers: corsHeaders });
  } catch (error) {
    // 4. Graceful fallback — never a 500 with no body
    console.log('Error:', error.message);
    return Response.json({ error: 'Service unavailable', fallback: rawData }, {
      status: 200,
      headers: corsHeaders,
    });
  }
};
```

---

## Netlify Blobs (Cache Layer)

**Package:** `@netlify/blobs` ^11.0.2
**Consistency:** Strong (not eventual)
**Store name:** `janvayu-feeds` (कोड में `janvayu-subscribers`, `janvayu-rankings` और `janvayu-push-subs` का भी इस्तेमाल होता है)

### Caching कैसे काम करता है

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────┐
│ scheduled-fetch  │────▶│  Netlify Blobs    │◀────│ On-demand    │
│ (every 4 hours)  │     │  (JSON cache)     │     │ functions    │
│                  │     │                   │     │ (instant)    │
│ Fetches Reddit,  │     │ reddit            │     │ Serve from   │
│ News, Instagram  │     │ news              │     │ cache first  │
└──────────────────┘     │ instagram         │     └──────────────┘
                         │ youtube           │
                         │ sensor-community  │
                         └──────────────────┘
```

`youtube` और `sensor-community` कीज़ को `scheduled-fetch` नहीं, बल्कि `youtube-feed.js` और `community-sensors.mjs` लिखते हैं।

**Cache-first strategy:**
1. On-demand function Blobs में cached डेटा चेक करता है
2. अगर cache hit हो → तुरंत रिटर्न करें
3. अगर cache miss हो → live डेटा लाएं, Blobs में लिखें, फिर रिटर्न करें
4. अगर live fetch फेल हो जाए → stale cache रिटर्न करें (कुछ न होने से बेहतर है)

इससे यह पक्का होता है कि feed आउटेज (Reddit rate limits, Nitter downtime) की वजह से थोड़ा पुराना डेटा मिले — UI कभी टूटा हुआ नहीं दिखेगा।

---

## Resend (Email Delivery)

**Package:** `resend` ^6.14.0
**Used by:** `daily-digest.mjs`
**From address:** `digest@janvayu.in`

### Daily Digest Flow

1. `daily-digest.mjs` सुबह 8:00 AM IST पर फायर होता है (Netlify scheduled function)
2. WAQI से सब्सक्राइबर्स के शहरों का live AQI लाता है
3. AQI डेटा और हेल्थ गाइडेंस के साथ एक साफ HTML ईमेल फॉर्मेट करता है
4. Resend API के ज़रिए भेजता है
---
**SendGrid/Mailgun के बजाय Resend क्यों:**
- क्लीन API, कम से कम कोड
- फ्री प्लान में रोज़ाना 100 ईमेल की लिमिट है ([resend.com/pricing](https://resend.com/pricing)); इसे सब्सक्राइबर्स की संख्या के हिसाब से चेक करें
- इन-बिल्ट बाउंस/कंप्लेंट हैंडलिंग

---

## WAQI API (Client-Side)

द वर्ल्ड एयर क्वालिटी इंडेक्स API, ब्राउज़र से कॉल किया जाने वाला मुख्य लाइव-AQI सोर्स है।

**टोकन:** WAQI द्वारा अपने [terms of service](https://aqicn.org/data-platform/token/) के तहत रजिस्ट्रेन्ट को इश्यू किया जाता है; इसे क्लाइंट JS में एम्बेड किया गया है, इसलिए कोई भी इसे पढ़ सकता है
**रिफ्रेश:** हर 10 मिनट में `setInterval` के ज़रिए
**इस्तेमाल किए गए एंडपॉइंट्स:**
- `api.waqi.info/feed/{city}/` — सिंगल सिटी AQI
- `api.waqi.info/map/bounds/` — जियोग्राफिक बाउंड्स के अंदर के स्टेशन्स

**क्लाइंट-साइड क्यों:**
- रियल-टाइम डेटा (कोई कैशिंग डिले नहीं)
- WAQI को सभी API एक्सेस के लिए एक वैलिड की (key) की ज़रूरत होती है
- सर्वरलेस फंक्शन इन्वोकेशन्स को कम करता है
