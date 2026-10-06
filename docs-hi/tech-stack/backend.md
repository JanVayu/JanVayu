# बैकएंड स्टैक

JanVayu का बैकएंड पूरी तरह से सर्वरलेस है — 29 Netlify Function फ़ाइलें (साथ ही साझा `lib/`) जो डेटा प्रॉक्सीइंग, कैशिंग, शेड्यूल्ड टास्क, ईमेल डिलीवरी और AI फ़ीचर संभालती हैं।

---

## Netlify Functions

**Runtime:** Node.js 22
**Module format:** AI फ़ीचर के लिए ES Modules (`.mjs`), फीड प्रॉक्सी के लिए CommonJS (`.js`)
**Location:** `netlify/functions/`

### फ़ंक्शन इन्वेंट्री

| Function | Type | Purpose |
|----------|------|---------|
| `scheduled-fetch.mjs` | शेड्यूल्ड (cron, हर 4 घंटे) | सभी सोशल/न्यूज़ फीड को प्री-फ़ेच करता है |
| `daily-digest.mjs` | शेड्यूल्ड (cron, सुबह 8 बजे IST) | रोज़ाना AQI ईमेल डाइजेस्ट भेजता है |
| `air-query.mjs` | ऑन-डिमांड (POST) | AI: प्राकृतिक भाषा में AQI Q&A |
| `health-advisory.mjs` | ऑन-डिमांड (POST) | AI: पर्सनलाइज़्ड हेल्थ सलाह |
| `accountability-brief.mjs` | ऑन-डिमांड (POST) | AI: वार्ड-लेवल गवर्नेंस ब्रीफ़ |
| `anomaly-check.mjs` | ऑन-डिमांड (GET) | AI: PM2.5 स्पाइक डिटेक्शन |
| `reddit-feed.js` | ऑन-डिमांड (GET) | कैश्ड Reddit एयर क्वालिटी पोस्ट |
| `twitter-feed.js` | — | **रिटायर्ड।** Nitter से रीड करता है, जिसके पब्लिक इंस्टेंस अब बंद हो चुके हैं; कोई भी इसे कॉल नहीं करता। |
| `youtube-feed.js` | ऑन-डिमांड (GET) | YouTube चैनल RSS से कैश्ड इंडिया एयर-क्वालिटी वीडियो |
| `instagram-feed.js` | ऑन-डिमांड (GET) | कैश्ड Instagram पोस्ट |
| `news-proxy.js` | ऑन-डिमांड (GET) | कैश्ड न्यूज़ आर्टिकल |
| `subscribe.js` | ऑन-डिमांड (POST) | ईमेल सब्सक्रिप्शन मैनेजमेंट |
| `feed-status.js` | ऑन-डिमांड (GET) | फीड फ्रेशनेस हेल्थ चेक |
| `blob-store.js` | यूटिलिटी (शेयर्ड) | Netlify Blobs स्टोर इनिशियलाइज़ेशन |

यह टेबल केवल मुख्य फ़ंक्शन की लिस्ट है। `netlify/functions/` में अन्य फ़ंक्शन में `waqi-proxy`, `rankings`, `historical-aqi`, `data-api`, `fire-tracker`, `community-sensors`, `push-subscribe`, `push-send`, `health-monitor`, `feed-health`, `status-history`, `terra-collab`, `workshop-submit`, `zotero-library` और `reference-data` शामिल हैं।

### कॉमन पैटर्न

हर फ़ंक्शन एक ही टेम्पलेट को फ़ॉलो करता है:
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

## Netlify Blobs (कैश लेयर)

**पैकेज:** `@netlify/blobs` ^11.0.2
**कंसिस्टेंसी:** स्ट्रॉन्ग (इवेंचुअल नहीं)
**स्टोर का नाम:** `janvayu-feeds` (कोड में `janvayu-subscribers`, `janvayu-rankings` और `janvayu-push-subs` का भी इस्तेमाल होता है)

### कैशिंग कैसे काम करती है

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

`youtube` और `sensor-community` कीज़ को `youtube-feed.js` और `community-sensors.mjs` लिखते हैं, न कि `scheduled-fetch`।

**कैश-फर्स्ट स्ट्रेटेजी:**
1. ऑन-डिमांड फंक्शन कैश किए गए डेटा के लिए Blobs चेक करता है
2. अगर कैश हिट होता है → तुरंत रिटर्न करता है
3. अगर कैश मिस होता है → लाइव फेच करता है, Blobs में लिखता है, फिर रिटर्न करता है
4. अगर लाइव फेच फेल हो जाता है → पुराना कैश रिटर्न करता है (कुछ न होने से बेहतर है)

इससे यह पक्का होता है कि फीड आउटेज (Reddit रेट लिमिट, Nitter डाउनटाइम) की वजह से डेटा थोड़ा पुराना हो सकता है — लेकिन UI कभी नहीं टूटेगा।

---

## Resend (ईमेल डिलीवरी)

**पैकेज:** `resend` ^6.14.0
**इस्तेमाल:** `daily-digest.mjs`
**फ्रॉम एड्रेस:** `digest@janvayu.in`

### डेली डाइजेस्ट फ्लो

1. `daily-digest.mjs` सुबह 8:00 बजे IST पर ट्रिगर होता है (Netlify शेड्यूल्ड फंक्शन)
2. WAQI से सब्सक्राइबर्स के शहरों का लाइव AQI फेच करता है
3. AQI डेटा और हेल्थ गाइडेंस के साथ एक साफ HTML ईमेल फॉर्मेट करता है
4. Resend API के ज़रिए भेजता है
**SendGrid/Mailgun के बजाय Resend क्यों:**
- क्लीन API, कम से कम कोड
- फ्री प्लान में रोज़ाना 100 ईमेल की लिमिट है ([resend.com/pricing](https://resend.com/pricing)); इसे सब्सक्राइबर्स की संख्या के साथ चेक करें
- बिल्ट-इन बाउंस/कंप्लेंट हैंडलिंग

---

## WAQI API (Client-Side)

वर्ल्ड एयर क्वालिटी इंडेक्स API ब्राउज़र से कॉल किया जाने वाला मुख्य लाइव-AQI सोर्स है।

**टोकन:** WAQI द्वारा अपने [terms of service](https://aqicn.org/data-platform/token/) के तहत रजिस्ट्रेन्ट को जारी किया जाता है; इसे क्लाइंट JS में एम्बेड किया गया है, इसलिए कोई भी इसे पढ़ सकता है
**रिफ्रेश:** `setInterval` के ज़रिए हर 10 मिनट में
**इस्तेमाल किए गए एंडपॉइंट्स:**
- `api.waqi.info/feed/{city}/` — एक शहर का AQI
- `api.waqi.info/map/bounds/` — भौगोलिक सीमाओं के भीतर के स्टेशन

**क्लाइंट-साइड क्यों:**
- रियल-टाइम डेटा (कैशिंग में कोई देरी नहीं)
- WAQI को सभी API एक्सेस के लिए एक वैलिड की (key) की ज़रूरत होती है
- सर्वरलेस फंक्शन कॉल्स को कम करता है
