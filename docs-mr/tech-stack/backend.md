# बॅकएंड स्टॅक

JanVayu चे बॅकएंड पूर्णपणे सर्व्हरलेस आहे — यात २९ Netlify Function फाइल्स (आणि शेअर केलेले `lib/`) आहेत, जे डेटा प्रॉक्सींग, कॅशिंग, शेड्युल्ड टास्क, ईमेल डिलिव्हरी आणि AI फीचर्स हाताळतात.

---

## Netlify Functions

**रनटाइम:** Node.js 22
**मॉड्यूल फॉरमॅट:** AI फीचर्ससाठी ES Modules (`.mjs`), फीड प्रॉक्सीसाठी CommonJS (`.js`)
**ठिकाण:** `netlify/functions/`

### फंक्शन इन्व्हेंटरी

| फंक्शन | प्रकार | उद्देश |
|----------|------|---------|
| `scheduled-fetch.mjs` | शेड्युल्ड (cron, दर ४ तासांनी) | सर्व सोशल/न्यूज फीड्स प्री-फेच करते |
| `daily-digest.mjs` | शेड्युल्ड (cron, सकाळी ८ IST) | रोजचा AQI ईमेल डायजेस्ट पाठवते |
| `air-query.mjs` | ऑन-डिमांड (POST) | AI: नॅचरल लँग्वेजमध्ये AQI Q&A |
| `health-advisory.mjs` | ऑन-डिमांड (POST) | AI: पर्सनलाइज्ड हेल्थ अ‍ॅडव्हाइस |
| `accountability-brief.mjs` | ऑन-डिमांड (POST) | AI: वॉर्ड-लेव्हल गव्हर्नन्स ब्रीफ्स |
| `anomaly-check.mjs` | ऑन-डिमांड (GET) | AI: PM2.5 स्पाइक डिटेक्शन |
| `reddit-feed.js` | ऑन-डिमांड (GET) | कॅश केलेले Reddit एअर क्वालिटी पोस्ट्स |
| `twitter-feed.js` | — | **रिटायर केलेले.** Nitter वाचते, ज्याचे पब्लिक इन्स्टन्सेस आता उपलब्ध नाहीत; याला कोणीही कॉल करत नाही. |
| `youtube-feed.js` | ऑन-डिमांड (GET) | YouTube चॅनेल RSS मधून कॅश केलेले इंडिया एअर-क्वालिटी व्हिडिओज |
| `instagram-feed.js` | ऑन-डिमांड (GET) | कॅश केलेले Instagram पोस्ट्स |
| `news-proxy.js` | ऑन-डिमांड (GET) | कॅश केलेले न्यूज आर्टिकल्स |
| `subscribe.js` | ऑन-डिमांड (POST) | ईमेल सबस्क्रिप्शन मॅनेजमेंट |
| `feed-status.js` | ऑन-डिमांड (GET) | फीड फ्रेशनेस हेल्थ चेक |
| `blob-store.js` | युटिलिटी (शेअर्ड) | Netlify Blobs स्टोअर इनिशियलायझेशन |

या टेबलमध्ये फक्त मुख्य फंक्शन्स दिली आहेत. `netlify/functions/` मधील इतर फंक्शन्समध्ये `waqi-proxy`, `rankings`, `historical-aqi`, `data-api`, `fire-tracker`, `community-sensors`, `push-subscribe`, `push-send`, `health-monitor`, `feed-health`, `status-history`, `terra-collab`, `workshop-submit`, `zotero-library` आणि `reference-data` यांचा समावेश आहे.

### कॉमन पॅटर्न्स

प्रत्येक फंक्शन एकाच टेम्पलेटचे पालन करते:
```javascript
export default async (req, context) => {
  // 1. CORS प्रीफ्लाइट
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: corsHeaders });
  }

  try {
    // 2. कोअर लॉजिक (डेटा फेच करणे, AI ला कॉल करणे, इ.)
    const result = await doWork();

    // 3. JSON रिटर्न करा
    return Response.json(result, { headers: corsHeaders });
  } catch (error) {
    // 4. ग्रेसफुल फॉलबॅक — बॉडीशिवाय कधीही 500 नाही
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
**कन्सिस्टन्सी:** स्ट्रॉंग (इव्हेंचुअल नाही)
**स्टोअरचे नाव:** `janvayu-feeds` (कोडमध्ये `janvayu-subscribers`, `janvayu-rankings` आणि `janvayu-push-subs` देखील वापरले जातात)

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

`youtube` आणि `sensor-community` कीज `youtube-feed.js` आणि `community-sensors.mjs` द्वारे लिहिल्या जातात, `scheduled-fetch` द्वारे नाही.

**कॅशे-फर्स्ट स्ट्रॅटेजी:**
1. ऑन-डिमांड फंक्शन ब्लब्समध्ये कॅशे केलेला डेटा तपासते
2. जर कॅशे हिट झाले → लगेच रिटर्न करा
3. जर कॅशे मिस झाले → लाईव्ह फेच करा, ब्लब्समध्ये लिहा, रिटर्न करा
4. जर लाईव्ह फेच फेल झाले → जुना कॅशे रिटर्न करा (काहीच नसण्यापेक्षा चांगले)

यामुळे फीड आउटेज (Reddit रेट लिमिट्स, Nitter डाऊनटाइम) मुळे डेटा थोडा जुना (stale) मिळतो — UI कधीही ब्रेक होत नाही.

---

## Resend (ईमेल डिलिव्हरी)

**पॅकेज:** `resend` ^6.14.0
**वापरकर्ते:** `daily-digest.mjs`
**From ॲड्रेस:** `digest@janvayu.in`

### डेली डायजेस्ट फ्लो

1. `daily-digest.mjs` सकाळी 8:00 वाजता IST ला फायर होते (Netlify शेड्युल्ड फंक्शन)
2. WAQI वरून सबस्क्रायबर्सच्या शहरांसाठी लाईव्ह AQI फेच करते
3. AQI डेटा आणि आरोग्य मार्गदर्शनासह एक स्वच्छ HTML ईमेल फॉरमॅट करते
4. Resend API द्वारे पाठवते
---
**SendGrid/Mailgun ऐवजी Resend का:**
- स्वच्छ API, कमीत कमी कोड
- मोफत प्लॅनमध्ये दररोज 100 ईमेल्सची मर्यादा आहे ([resend.com/pricing](https://resend.com/pricing)); सबस्क्रायबरच्या संख्येसोबत याची तुलना करा
- इन-बिल्ट बाऊन्स/तक्रार हाताळणी

---

## WAQI API (क्लायंट-साइड)

The World Air Quality Index API हा मुख्य लाईव्ह-AQI सोर्स आहे जो ब्राउझरवरून कॉल केला जातो.

**टोकन:** WAQI द्वारे त्यांच्या [अटी व शर्ती](https://aqicn.org/data-platform/token/) नुसार नोंदणीकर्त्याला दिले जाते; हे क्लायंट JS मध्ये एम्बेड केलेले असते, त्यामुळे कोणीही ते वाचू शकतो
**रिफ्रेश:** `setInterval` द्वारे दर 10 मिनिटांनी
**वापरलेले एंडपॉइंट्स:**
- `api.waqi.info/feed/{city}/` — एका शहराचा AQI
- `api.waqi.info/map/bounds/` — भौगोलिक मर्यादेतील स्टेशन्स

**क्लायंट-साइड का:**
- रिअल-टाइम डेटा (कॅशिंगला विलंब नाही)
- WAQI ला सर्व API ॲक्सेससाठी वैध की (key) आवश्यक असते
- सर्व्हरलेस फंक्शन कॉल्स कमी होतात
