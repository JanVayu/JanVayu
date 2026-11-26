# बैकएंड स्टैक
JanVayu का बैकएंड पूरी तरह से सर्वरलेस है — 29 Netlify Function फ़ाइलें (साथ ही साझा `lib/`) जो डेटा प्रॉक्सीइंग, कैशिंग, शेड्यूल्ड टास्क, ईमेल डिलीवरी और AI फ़ीचर्स को संभालती हैं।
---
## Netlify Functions
**रनटाइम:** Node.js 24 (`netlify.toml` में `NODE_VERSION`; `package.json` 22.12 या उसके बाद के वर्ज़न की मांग करता है)
**मॉड्यूल फ़ॉर्मेट:** AI फ़ीचर्स के लिए ES Modules (`.mjs`), फ़ीड प्रॉक्सी के लिए CommonJS (`.js`)
**लोकेशन:** `netlify/functions/`
### फ़ंक्शन इन्वेंट्री
| फ़ंक्शन | प्रकार | उद्देश्य |
|----------|------|---------|
| `scheduled-fetch.mjs` | शेड्यूल्ड (cron, हर 4 घंटे) | सभी सोशल/न्यूज़ फ़ीड को पहले से फ़ेच करता है |
| `daily-digest.mjs` | शेड्यूल्ड (cron, सुबह 8 बजे IST) | दैनिक AQI ईमेल डाइजेस्ट भेजता है |
| `air-query.mjs` | ऑन-डिमांड (POST) | AI: प्राकृतिक भाषा में AQI Q&A |
| `health-advisory.mjs` | ऑन-डिमांड (POST) | AI: व्यक्तिगत स्वास्थ्य सलाह |
| `accountability-brief.mjs` | ऑन-डिमांड (POST) | AI: वार्ड-स्तरीय गवर्नेंस ब्रीफ़ |
| `anomaly-check.mjs` | ऑन-डिमांड (GET) | AI: PM2.5 स्पाइक का पता लगाना |
| `reddit-feed.js` | ऑन-डिमांड (GET) | कैश्ड Reddit एयर क्वालिटी पोस्ट |
| `twitter-feed.js` | — | **रिटायर्ड।** Nitter से पढ़ें, जिसके पब्लिक इंस्टेंस बंद हो चुके हैं; कोई भी इसे कॉल नहीं करता। |
| `youtube-feed.js` | ऑन-डिमांड (GET) | YouTube चैनल RSS से कैश्ड भारत एयर-क्वालिटी वीडियो |
| `instagram-feed.js` | ऑन-डिमांड (GET) | कैश्ड Instagram पोस्ट |
| `news-proxy.js` | ऑन-डिमांड (GET) | कैश्ड न्यूज़ आर्टिकल्स |
| `subscribe.js` | ऑन-डिमांड (POST) | ईमेल सब्सक्रिप्शन मैनेजमेंट |
| `feed-status.js` | ऑन-डिमांड (GET) | फ़ीड फ़्रेशनेस हेल्थ चेक |
| `blob-store.js` | यूटिलिटी (साझा) | Netlify Blobs स्टोर इनिशियलाइज़ेशन |
यह टेबल केवल मुख्य फ़ंक्शन्स को सूचीबद्ध करती है। `netlify/functions/` में अन्य फ़ंक्शन्स में `waqi-proxy`, `air-model`, `rankings`, `historical-aqi`, `data-api`, `fire-tracker`, `community-sensors`, `push-subscribe`, `push-send`, `health-monitor`, `feed-health`, `status-history`, `terra-collab`, `workshop-submit` और `reference-data` शामिल हैं।
### सामान्य पैटर्न
हर फ़ंक्शन एक ही टेम्पलेट का पालन करता है:
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
**Store name:** `janvayu-feeds` (कोड में `janvayu-subscribers`, `janvayu-rankings` और `janvayu-push-subs` का भी उपयोग किया गया है)
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
`youtube` और `sensor-community` कीज़ `youtube-feed.js` और `community-sensors.mjs` द्वारा लिखी जाती हैं, न कि `scheduled-fetch` द्वारा।
**Cache-first रणनीति:**
1. On-demand function Blobs में कैश्ड डेटा चेक करता है
2. अगर cache hit होता है → तुरंत रिटर्न करें
3. अगर cache miss होता है → लाइव डेटा लाएं, Blobs में लिखें, रिटर्न करें
4. अगर लाइव फेच विफल हो जाता है → पुराना (stale) cache रिटर्न करें (कुछ न मिलने से बेहतर है)
इससे यह सुनिश्चित होता है कि फीड आउटेज (Reddit rate limits, Nitter downtime) के परिणामस्वरूप थोड़ा पुराना डेटा मिले — UI कभी खराब नहीं होता।
---
## Resend (Email Delivery)
**Package:** `resend` ^6.14.0
**Used by:** `daily-digest.mjs`
**From address:** `digest@janvayu.in`
### Daily Digest Flow
1. `daily-digest.mjs` सुबह 8:00 AM IST पर फायर होता है (Netlify scheduled function)
2. WAQI से सब्सक्राइबर्स के शहरों के लिए लाइव AQI लाता है
3. AQI डेटा और स्वास्थ्य मार्गदर्शन के साथ एक साफ HTML ईमेल फॉर्मेट करता है
4. Resend API के माध्यम से भेजता है
---
**SendGrid/Mailgun के बजाय Resend क्यों:**
- क्लीन API, न्यूनतम कोड
- फ्री प्लान में रोज़ाना 100 ईमेल की लिमिट है ([resend.com/pricing](https://resend.com/pricing)); इसे सब्सक्राइबर काउंट के साथ चेक करें
- इन-बिल्ट बउंस/शिकायत हैंडलिंग
---
## WAQI API (एक प्रॉक्सी के ज़रिए)
लाइव स्टेशन रीडिंग्स का सोर्स World Air Quality Index API है। 27 October 2026 से ब्राउज़र इसे सीधे कॉल नहीं करता। हर रिक्वेस्ट `waqi-proxy` फ़ंक्शन पर जाती है।
**टोकन:** WAQI द्वारा अपने [terms of service](https://aqicn.org/data-platform/token/) के तहत रजिस्ट्रेंट को इश्यू किया जाता है; यह `WAQI_TOKEN` एनवायरनमेंट वेरिएबल में रखा जाता है और `netlify/functions/lib/waqi-token.mjs` के ज़रिए पढ़ा जाता है। अगर कोई टोकन कमिट किया जाता है, तो `scripts/check-no-waqi-token.py` बिल्ड को फेल कर देता है।
**रिफ्रेश:** ब्राउज़र में `setInterval` के ज़रिए हर 10 मिनट में
**प्रॉक्सी द्वारा कॉल किए जाने वाले एंडपॉइंट्स:**
- किसी एक शहर के AQI के लिए `api.waqi.info/feed/{city}/`
- किसी पॉइंट के सबसे नज़दीकी स्टेशन के लिए `api.waqi.info/feed/geo:{lat};{lon}/`
- भौगोलिक सीमाओं के भीतर के स्टेशनों के लिए `api.waqi.info/map/bounds/`
**प्रॉक्सी द्वारा लागू की जाने वाली शर्तें:**
- केवल सिटी स्लग्स, इन-रेंज कोऑर्डिनेट्स और तीन डिग्री से ज़्यादा चौड़ा न होने वाला बॉक्स
- कोऑर्डिनेट्स के ज़रिए लुकअप के लिए, 30 km के भीतर का एक स्टेशन जिसने पिछले 6 घंटों में रिपोर्ट किया हो (`lib/waqi-station.mjs`)
- कोई कैश्ड एरर नहीं, और एरर में कोई अपस्ट्रीम URL (जिसमें टोकन होता है) नहीं
जब प्रॉक्सी के पास देने के लिए कोई स्टेशन नहीं होता, तो `js/air-sources.js` CPCB के डेली बुलेटिन और फिर `air-model` फ़ंक्शन (Open-Meteo, CAMS) पर फॉलबैक करता है।
