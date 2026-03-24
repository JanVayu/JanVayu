# Netlify Functions

JanVayu का बैकएंड 13 सर्वरलेस फ़ंक्शन से बना है, सभी `netlify/functions/` में स्थित हैं।

---

## फ़ंक्शन सूची

### अनुसूचित कार्य (Cron)

| फ़ंक्शन | शेड्यूल | कार्य |
|---------|---------|------|
| `scheduled-fetch.mjs` | हर 4 घंटे | सभी सोशल/समाचार फ़ीड्स प्री-फ़ेच |
| `daily-digest.mjs` | 8 AM IST दैनिक | AQI ईमेल डाइजेस्ट भेजना |

### ऑन-डिमांड API

| फ़ंक्शन | मेथड | कार्य |
|---------|------|------|
| `air-query.mjs` | POST | AI: प्राकृतिक भाषा AQI प्रश्नोत्तर |
| `health-advisory.mjs` | POST | AI: व्यक्तिगत स्वास्थ्य सलाह |
| `accountability-brief.mjs` | POST | AI: वार्ड-स्तरीय जवाबदेही ब्रीफ़ |
| `anomaly-check.mjs` | GET | AI: PM2.5 स्पाइक पहचान |
| `reddit-feed.js` | GET | कैश्ड Reddit पोस्ट |
| `twitter-feed.js` | GET | कैश्ड Twitter/X पोस्ट |
| `instagram-feed.js` | GET | कैश्ड Instagram पोस्ट |
| `news-proxy.js` | GET | कैश्ड समाचार लेख |
| `subscribe.js` | POST | ईमेल सदस्यता प्रबंधन |
| `feed-status.js` | GET | फ़ीड स्वास्थ्य जाँच |

### यूटिलिटी

| फ़ंक्शन | कार्य |
|---------|------|
| `blob-store.js` | Netlify Blobs स्टोर इनिशियलाइज़ेशन |

---

## सामान्य पैटर्न

हर फ़ंक्शन इस टेम्पलेट का पालन करता है:

```javascript
export default async (req, context) => {
  // 1. CORS प्रीफ़्लाइट
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: corsHeaders });
  }

  try {
    // 2. मुख्य कार्य
    const result = await doWork();

    // 3. JSON वापस करें
    return Response.json(result, { headers: corsHeaders });
  } catch (error) {
    // 4. ग्रेसफुल फ़ॉलबैक — कभी खाली 500 नहीं
    console.log('Error:', error.message);
    return Response.json(
      { error: 'सेवा अनुपलब्ध', fallback: rawData },
      { status: 200, headers: corsHeaders }
    );
  }
};
```

---

## कैशिंग रणनीति

```
scheduled-fetch (हर 4 घंटे)
        │
        ▼
  Netlify Blobs (JSON कैश)
        │
        ▼
  ऑन-डिमांड फ़ंक्शन (तुरंत सर्व)
```

1. ऑन-डिमांड फ़ंक्शन पहले Blobs में कैश जाँचता है
2. कैश हिट → तुरंत लौटाएँ (< 50ms)
3. कैश मिस → लाइव फ़ेच, Blobs में लिखें, लौटाएँ
4. लाइव फ़ेच विफल → पुराना कैश लौटाएँ (टूटे UI से बेहतर)
