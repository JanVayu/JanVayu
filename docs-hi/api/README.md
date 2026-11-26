# API Reference
 
इस पेज पर 12 पब्लिक एंडपॉइंट्स की लिस्ट है (11 Netlify Functions और `/api` ओपन-डेटा एंट्री पॉइंट; इनमें से एक, `/twitter-feed`, रिटायर हो चुका है)। साइट के अपने पेजों द्वारा कॉल किए जाने वाले दो और एंडपॉइंट्स, `/waqi-proxy` और `/air-model`, [Netlify Functions](../technical/netlify-functions.md) में वर्णित हैं। ये सभी पब्लिकली एक्सेसिबल हैं और CORS सपोर्ट करते हैं। ये JSON रिटर्न करते हैं, सिवाय CSV एक्सपोर्ट के, जो `text/csv` रिटर्न करता है। रिपॉजिटरी में Open Data API (rankings, reference-data, historical-aqi, community-sensors, status-history) के पीछे और भी फंक्शन्स और इंटरनल फंक्शन्स शामिल हैं।
**Base URL:** `https://www.janvayu.in/.netlify/functions`
---
## क्विक रेफरेंस
### AI फीचर्स (पहली बार v25.1 में शिप किए गए)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/air-query` | POST | नेचुरल लैंग्वेज AQI Q&A |
| `/health-advisory` | POST | पर्सनलाइज्ड हेल्थ एडवाइस |
| `/accountability-brief` | POST | वार्ड-लेवल गवर्नेंस ब्रीफ्स |
| `/anomaly-check` | GET | PM2.5 स्पाइक डिटेक्शन |
### सोशल फीड्स
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/reddit-feed` | GET | कैश्ड Reddit पोस्ट्स |
| `/twitter-feed` | — | **रिटायर हो चुका है।** Nitter पढ़ें, जिसके पब्लिक इंस्टेंसेस अब नहीं हैं; यह एंडपॉइंट अब जवाब नहीं देता और कोई भी इसे कॉल नहीं करता। |
| `/youtube-feed` | GET | YouTube चैनल RSS से कैश्ड इंडिया एयर-क्वालिटी वीडियो |
| `/news-proxy` | GET | कैश्ड न्यूज़ आर्टिकल्स |
| `/instagram-feed` | GET | कैश्ड Instagram पोस्ट्स |
### प्लेटफॉर्म
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/subscribe` | POST | ईमेल सब्सक्रिप्शन मैनेजमेंट |
| `/feed-status` | GET | फीड हेल्थ मॉनिटरिंग |
### ओपन डेटा
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api` | GET | वर्ज़न्ड डेटा मैनिफेस्ट + CSV एक्सपोर्ट |
---
## ओपन डेटा API
JanVayu द्वारा पब्लिश किए गए डेटासेट्स पर एक सिंगल, डिस्कवरेबल एंट्री पॉइंट — पत्रकारों, शोधकर्ताओं और फोर्क्स के लिए बनाया गया। रीड-ओनली, CORS-ओपन, एट्रिब्यूशन के साथ इस्तेमाल करने के लिए फ्री।
**मैनिफेस्ट (हर डेटासेट, उसके पैरामीटर्स, लाइसेंस और साइटेशन की लिस्ट):**
```bash
curl https://www.janvayu.in/api
```
**लाइव सिटी रैंकिंग्स का CSV एक्सपोर्ट:**
```bash
curl "https://www.janvayu.in/api?dataset=rankings&format=csv"          # live
curl "https://www.janvayu.in/api?dataset=rankings&format=csv&range=week" # 7-day average
curl "https://www.janvayu.in/api?dataset=rankings&format=csv&range=month" # 30-day average
```
`rankings` फ़ंक्शन `range=live`, `range=week` और `range=month` को समझता है। कोई भी अन्य वैल्यू, जिसमें `7d` और `30d` (जो मैनिफेस्ट में सूचीबद्ध हैं) शामिल हैं, को 30-दिन की रेंज के रूप में माना जाता है।
> **ज्ञात समस्या:** `/api` मैनिफेस्ट में `range=7d` का प्रचार किया गया है, लेकिन रैंकिंग फ़ंक्शन इसे पहचानता नहीं है। इसलिए यह 7-दिन के औसत के बजाय 30-दिन का औसत लौटाता है। कोड ठीक होने तक 7-दिन के औसत के लिए `range=week` का उपयोग करें।
मैनिफेस्ट अंतर्निहित JSON एंडपॉइंट्स की ओर इशारा करता है — `rankings`, `reference-data` (CPCB स्टेशन / NCAP शहर / IQAir वार्षिक), `historical-aqi`, `community-sensors`, और `status-history` — जिन्हें अलग-अलग कॉल किया जा सकता है।
**लाइसेंस:** डेटा सामग्री CC BY-NC-SA 4.0 है; कोड MIT है। कृपया मैनिफेस्ट के `citation` फ़ील्ड में दिखाए गए अनुसार उद्धृत करें।
---
## OpenAPI Specification

पूरी OpenAPI 3.1 स्पेसिफिकेशन [`openapi.yaml`](https://www.janvayu.in/docs/api/openapi.yaml) पर उपलब्ध है। इसे Swagger UI, Postman, Insomnia, या किसी भी OpenAPI-संगत टूल में इम्पोर्ट करें।
---
## Authentication

किसी प्रमाणीकरण (authentication) की आवश्यकता नहीं है। सभी एंडपॉइंट सार्वजनिक हैं।
- **AI एंडपॉइंट** Groq की दर सीमाओं (rate limits) पर निर्भर करते हैं
- **Feed एंडपॉइंट** कैश से सर्व किए जाते हैं (हर 4 घंटे में प्री-फ़ेच किए जाते हैं)
- **CORS:** सभी प्रतिक्रियाओं पर `Access-Control-Allow-Origin: *`
---
## Common Response Patterns
### Success
अपस्ट्रीम या AI विफलताओं के लिए एंडपॉइंट HTTP 200 लौटाते हैं (एक फ़ॉलबैक बॉडी के साथ), लेकिन अमान्य इनपुट के लिए 400, गलत मेथड के लिए 405, और आंतरिक या अपस्ट्रीम त्रुटियों पर 500 या 502 लौटाते हैं (उदाहरण के लिए, जब रैंकिंग CSV नहीं बनाई जा सकती है तो `/api` 502 लौटाता है)। स्टेटस कोड और प्रतिक्रिया बॉडी की जांच करें।
### Fallback
यदि Groq रेट-लिमिटेड है, तो AI एंडपॉइंट रॉ डेटा (बिना AI विश्लेषण के) लौटाते हैं। यदि लाइव फ़ेच विफल हो जाते हैं, तो फीड एंडपॉइंट पुराना कैश लौटाते हैं।
### CORS Preflight
सभी POST एंडपॉइंट 204 No Content के साथ OPTIONS अनुरोधों को संभालते हैं।
---
## Example Requests
### वायु गुणवत्ता के बारे में पूछें
```bash
curl -X POST https://www.janvayu.in/.netlify/functions/air-query \
  -H "Content-Type: application/json" \
  -d '{"city": "delhi", "question": "Is it safe to go for a run today?"}'
```
### स्वास्थ्य संबंधी सलाह प्राप्त करें
```bash
curl -X POST https://www.janvayu.in/.netlify/functions/health-advisory \
  -H "Content-Type: application/json" \
  -d '{"city": "mumbai", "age": 35, "conditions": ["asthma"], "hoursOutdoor": 3}'
```
### विसंगतियों की जांच करें
```bash
curl https://www.janvayu.in/.netlify/functions/anomaly-check
```
### Reddit फ़ीड प्राप्त करें
```bash
curl https://www.janvayu.in/.netlify/functions/reddit-feed?filter=delhi
```
### डाइजेस्ट की सदस्यता लें
```bash
curl -X POST https://www.janvayu.in/.netlify/functions/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "cities": ["delhi", "mumbai"], "pm25_threshold": 90}'
```
