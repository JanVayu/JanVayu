# बॅकएंड स्टॅक
जॅनवायुचे बॅकएंड पूर्णपणे सर्व्हरलेस आहे — डेटा प्रॉक्सींग, कॅशिंग, शेड्युल्ड टास्क, ईमेल डिलिव्हरी आणि AI फीचर्स हाताळण्यासाठी 29 नेटलिफाय फंक्शन फाइल्स (अधिक शेअर्ड `lib/`) आहेत.
---
## नेटलिफाय फंक्शन्स
**रनटाइम:** Node.js 24 (`netlify.toml` मधील `NODE_VERSION`; `package.json` मध्ये 22.12 किंवा त्यानंतरची आवृत्ती आवश्यक आहे)
**मॉड्यूल फॉरमॅट:** AI फीचर्ससाठी ES मॉड्यूल्स (`.mjs`), फीड प्रॉक्सीसाठी CommonJS (`.js`)
**स्थान:** `netlify/functions/`
### फंक्शन इन्व्हेंटरी
| फंक्शन | प्रकार | उद्देश |
|----------|------|---------|
| `scheduled-fetch.mjs` | शेड्युल्ड (क्रॉन, दर 4 तासांनी) | सर्व सोशल/न्यूज फीड्स प्री-फेच करते |
| `daily-digest.mjs` | शेड्युल्ड (क्रॉन, सकाळी 8 IST) | दररोजचा AQI ईमेल डायजेस्ट पाठवते |
| `air-query.mjs` | ऑन-डिमांड (POST) | AI: नैसर्गिक भाषेतील AQI प्रश्नोत्तर |
| `health-advisory.mjs` | ऑन-डिमांड (POST) | AI: वैयक्तिकृत आरोग्य सल्ला |
| `accountability-brief.mjs` | ऑन-डिमांड (POST) | AI: वॉर्ड-स्तरीय प्रशासकीय माहितीपत्रके |
| `anomaly-check.mjs` | ऑन-डिमांड (GET) | AI: PM2.5 स्पाइक शोधणे |
| `reddit-feed.js` | ऑन-डिमांड (GET) | कॅश केलेले रेडिट एअर क्वालिटी पोस्ट्स |
| `twitter-feed.js` | — | **रिटायर झालेले.** निटर (Nitter) वाचा, ज्याचे सार्वजनिक इन्स्टन्सेस बंद झाले आहेत; याला काहीही कॉल करत नाही. |
| `youtube-feed.js` | ऑन-डिमांड (GET) | यूट्यूब चॅनेल RSS मधून कॅश केलेले भारतातील एअर-क्वालिटी व्हिडिओ |
| `instagram-feed.js` | ऑन-डिमांड (GET) | कॅश केलेले इंस्टाग्राम पोस्ट्स |
| `news-proxy.js` | ऑन-डिमांड (GET) | कॅश केलेले न्यूज आर्टिकल्स |
| `subscribe.js` | ऑन-डिमांड (POST) | ईमेल सबस्क्रिप्शन व्यवस्थापन |
| `feed-status.js` | ऑन-डिमांड (GET) | फीड फ्रेशनेस हेल्थ चेक |
| `blob-store.js` | युटिलिटी (शेडर्ड) | नेटलिफाय ब्लॉब्स स्टोअर इनिशियलायझेशन |
या टेबलमध्ये केवळ मुख्य फंक्शन्स दिली आहेत. `netlify/functions/` मधील इतर फंक्शन्समध्ये `waqi-proxy`, `air-model`, `rankings`, `historical-aqi`, `data-api`, `fire-tracker`, `community-sensors`, `push-subscribe`, `push-send`, `health-monitor`, `feed-health`, `status-history`, `terra-collab`, `workshop-submit` आणि `reference-data` यांचा समावेश आहे.
### सामान्य पॅटर्न्स
प्रत्येक फंक्शन एकाच टेम्पलेटचे पालन करते:
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
## Netlify Blobs (कॅशे लेयर)
**पॅकेज:** `@netlify/blobs` ^11.0.2
**कन्सिस्टन्सी:** मजबूत (इव्हेंचुअल नाही)
**स्टोअरचे नाव:** `janvayu-feeds` (कोडमध्ये `janvayu-subscribers`, `janvayu-rankings` आणि `janvayu-push-subs` देखील वापरले आहेत)
### कॅशिंग कसे काम करते
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
`youtube` आणि `sensor-community` कीज `scheduled-fetch` द्वारे नाही, तर `youtube-feed.js` आणि `community-sensors.mjs` द्वारे लिहिल्या जातात.
**कॅशे-फर्स्ट स्ट्रॅटेजी:**
1. ऑन-डिमांड फंक्शन ब्लब्समध्ये कॅशे केलेला डेटा तपासते
2. कॅशे हिट झाल्यास → त्वरित रिटर्न करा
3. कॅशे मिस झाल्यास → लाईव्ह फेच करा, ब्लब्समध्ये लिहा, रिटर्न करा
4. लाईव्ह फेच फेल झाल्यास → जुना कॅशे रिटर्न करा (काहीच नसण्यापेक्षा चांगले)
यामुळे फीड आउटेज (Reddit रेट लिमिट्स, Nitter डाउनटाइम) मुळे डेटा थोडा जुना असला तरी UI कधीच तुटत नाही याची खात्री होते.
---
## Resend (ईमेल डिलिव्हरी)
**पॅकेज:** `resend` ^6.14.0
**द्वारे वापरले:** `daily-digest.mjs`
**फ्रॉम ॲड्रेस:** `digest@janvayu.in`
### डेली डायजेस्ट फ्लो
1. `daily-digest.mjs` सकाळी 8:00 AM IST ला फायर होते (Netlify शेड्युल्ड फंक्शन)
2. WAQI कडून सबस्क्रायबरच्या शहरांसाठी लाईव्ह AQI फेच करते
3. AQI डेटा आणि आरोग्य मार्गदर्शनासह एक स्वच्छ HTML ईमेल फॉरमॅट करते
4. Resend API द्वारे पाठवते
**SendGrid/Mailgun पेक्षा Resend का:**
- स्वच्छ API, कमीत कमी कोड
- मोफत प्लॅनमध्ये दररोज 100 ईमेल्सची मर्यादा आहे ([resend.com/pricing](https://resend.com/pricing)); सबस्क्रायबर संख्येसोबत याची तपासणी करा
- अंगभूत बाऊन्स/तक्रार हाताळणी

---
## WAQI API (एका प्रॉक्सीद्वारे)
वर्ल्ड एअर क्वालिटी इंडेक्स API हा लाईव्ह स्टेशन रीडिंगचा स्रोत आहे. 27 October 2026 पासून ब्राउझर थेट याला कॉल करत नाही. प्रत्येक विनंती `waqi-proxy` फंक्शनकडे जाते.
**टोकन:** WAQI द्वारे त्याच्या [terms of service](https://aqicn.org/data-platform/token/) अंतर्गत नोंदणीकर्त्याला दिले जाते; हे `WAQI_TOKEN` एन्व्हायरन्मेंट व्हेरिएबलमध्ये ठेवले जाते आणि `netlify/functions/lib/waqi-token.mjs` द्वारे वाचले जाते. जर टोकन कमिट केले असेल तर `scripts/check-no-waqi-token.py` बिल्ड फेल करते.
**रिफ्रेश:** ब्राउझरमध्ये `setInterval` द्वारे दर 10 मिनिटांनी
**प्रॉक्सी कॉल करत असलेले एंडपॉइंट्स:**
- एका शहराच्या AQI साठी `api.waqi.info/feed/{city}/`
- एखाद्या बिंदूच्या सर्वात जवळच्या स्टेशनसाठी `api.waqi.info/feed/geo:{lat};{lon}/`
- भौगोलिक सीमांमधील स्टेशन्ससाठी `api.waqi.info/map/bounds/`
**प्रॉक्सी काय लागू करते:**
- फक्त सिटी स्लग्ज, इन-रेंज कोऑर्डिनेट्स आणि तीन अंशांपेक्षा जास्त रुंद नसलेला बॉक्स
- कोऑर्डिनेट्सद्वारे शोधण्यासाठी, गेल्या 6 तासांत रिपोर्ट केलेले 30 km मधील स्टेशन (`lib/waqi-station.mjs`)
- कॅशे केलेले एरर्स नाहीत, आणि एररमध्ये अपस्ट्रीम URL (ज्यामध्ये टोकन असते) नाही
जेव्हा प्रॉक्सीकडे देण्यासाठी कोणतेही स्टेशन नसते, तेव्हा `js/air-sources.js` CPCB च्या दैनंदिन बुलेटिनवर आणि नंतर `air-model` फंक्शनवर (Open-Meteo, CAMS) फॉलबॅक होते.
