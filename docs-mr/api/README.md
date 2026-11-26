# API Reference

या पृष्ठावर 12 सार्वजनिक एंडपॉइंट्सची यादी आहे (11 Netlify Functions अधिक `/api` ओपन-डेटा एंट्री पॉईंट; त्यापैकी एक, `/twitter-feed`, निवृत्त करण्यात आले आहे). साइटचे स्वतःचे पृष्ठे कॉल करत असलेले आणखी दोन, `/waqi-proxy` आणि `/air-model`, [Netlify Functions](../technical/netlify-functions.md) मध्ये वर्णन केले आहेत. सर्व सार्वजनिकरित्या प्रवेशयोग्य आहेत आणि CORS ला समर्थन देतात. ते JSON परत करतात, फक्त CSV एक्सपोर्ट वगळता, जे `text/csv` परत करते. रिपॉझिटरीमध्ये Open Data API (rankings, reference-data, historical-aqi, community-sensors, status-history) मागे आणखी फंक्शन्स आणि अंतर्गत फंक्शन्स देखील आहेत.
**Base URL:** `https://www.janvayu.in/.netlify/functions`
---
## Quick Reference
### AI features (first shipped in v25.1)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/air-query` | POST | Natural language AQI Q&A |
| `/health-advisory` | POST | Personalised health advice |
| `/accountability-brief` | POST | Ward-level governance briefs |
| `/anomaly-check` | GET | PM2.5 spike detection |
### Social Feeds
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/reddit-feed` | GET | Cached Reddit posts |
| `/twitter-feed` | — | **Retired.** Nitter वाचा, ज्याचे सार्वजनिक इन्स्टन्स आता अस्तित्वात नाहीत; हा एंडपॉइंट आता प्रतिसाद देत नाही आणि कोणीही तो कॉल करत नाही. |
| `/youtube-feed` | GET | YouTube चॅनेल RSS मधील कॅश्ड India air-quality व्हिडिओ |
| `/news-proxy` | GET | कॅश्ड न्यूज लेख |
| `/instagram-feed` | GET | कॅश्ड Instagram पोस्ट्स |
### Platform
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/subscribe` | POST | Email subscription management |
| `/feed-status` | GET | Feed health monitoring |
### Open Data
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api` | GET | Versioned data manifest + CSV export |
---
## Open Data API
JanVayu ने प्रकाशित केलेल्या डेटासेटवरील एकच, शोधण्यायोग्य एंट्री पॉईंट — पत्रकार, संशोधक आणि फोर्क्ससाठी बनवलेला. फक्त वाचण्यासाठी, CORS-ओपन, श्रेय देऊन वापरण्यासाठी मोफत.
**Manifest (प्रत्येक डेटासेट, त्याचे पॅरामीटर्स, परवाना आणि संदर्भ सूचीबद्ध करते):**
```bash
curl https://www.janvayu.in/api
```
**लाइव्ह सिटी रँकिंग्सचे CSV एक्सपोर्ट:**
```bash
curl "https://www.janvayu.in/api?dataset=rankings&format=csv"          # live
curl "https://www.janvayu.in/api?dataset=rankings&format=csv&range=week" # 7-day average
curl "https://www.janvayu.in/api?dataset=rankings&format=csv&range=month" # 30-day average
```
`rankings` फंक्शनला `range=live`, `range=week` आणि `range=month` समजते. इतर कोणतीही व्हॅल्यू, ज्यामध्ये `7d` आणि `30d` (जे मॅनिफेस्टमध्ये दिले आहेत) समाविष्ट आहेत, ती 30-दिवसांची रेंज मानली जाते.
> **Known issue:** `/api` मॅनिफेस्टमध्ये `range=7d` ची जाहिरात केली आहे, परंतु rankings फंक्शन ते ओळखत नाही, त्यामुळे ते 7-दिवसांच्या सरासरीऐवजी 30-दिवसांची सरासरी देते. जोपर्यंत कोड दुरुस्त होत नाही, तोपर्यंत 7-दिवसांच्या सरासरीसाठी `range=week` वापरा.
मॅनिफेस्ट मूळ JSON एंडपॉइंट्सकडे निर्देश करते — `rankings`, `reference-data` (CPCB स्टेशन्स / NCAP शहरे / IQAir वार्षिक), `historical-aqi`, `community-sensors`, आणि `status-history` — जे स्वतंत्रपणे कॉल केले जाऊ शकतात.
**Licence:** डेटा सामग्री CC BY-NC-SA 4.0 आहे; कोड MIT आहे. कृपया मॅनिफेस्टमधील `citation` फील्डमध्ये दर्शविल्याप्रमाणे संदर्भ द्या.
---
## OpenAPI Specification
संपूर्ण OpenAPI 3.1 स्पेक [`openapi.yaml`](https://www.janvayu.in/docs/api/openapi.yaml) वर उपलब्ध आहे. ते Swagger UI, Postman, Insomnia, किंवा कोणत्याही OpenAPI-सुसंगत टूलमध्ये इम्पोर्ट करा.
---
## Authentication
कोणत्याही ऑथेंटिकेशनची आवश्यकता नाही. सर्व एंडपॉइंट्स सार्वजनिक आहेत.
- **AI endpoints** Groq च्या रेट लिमिट्सवर अवलंबून असतात
- **Feed endpoints** कॅशेवरून सर्व्ह केले जातात (दर 4 तासांनी प्री-फेच केले जातात)
- **CORS:** सर्व रिस्पॉन्सवर `Access-Control-Allow-Origin: *`
---
## Common Response Patterns
### Success
अपस्ट्रीम किंवा AI फेल्युअरसाठी एंडपॉइंट्स HTTP 200 रिटर्न करतात (फॉलबॅक बॉडीसह), परंतु अवैध इनपुटसाठी 400, चुकीच्या मेथडसाठी 405, आणि अंतर्गत किंवा अपस्ट्रीम एरर्सवर 500 किंवा 502 (उदाहरणार्थ, जेव्हा rankings CSV तयार होऊ शकत नाही तेव्हा `/api` 502 रिटर्न करते). स्टेटस कोड आणि रिस्पॉन्स बॉडी तपासा.
### Fallback
जर Groq रेट-लिमिटेड असेल, तर AI एंडपॉइंट्स कच्चा डेटा (AI विश्लेषणशिवाय) रिटर्न करतात. जर लाईव्ह फेच फेल झाले, तर फीड एंडपॉइंट्स जुना कॅशे रिटर्न करतात.
### CORS Preflight
सर्व POST एंडपॉइंट्स 204 No Content सह OPTIONS रिक्वेस्ट्स हाताळतात.
---
## Example Requests
### हवेच्या गुणवत्तेबद्दल विचारा
```bash
curl -X POST https://www.janvayu.in/.netlify/functions/air-query \
  -H "Content-Type: application/json" \
  -d '{"city": "delhi", "question": "Is it safe to go for a run today?"}'
```
### आरोग्यविषयक सल्ला मिळवा
```bash
curl -X POST https://www.janvayu.in/.netlify/functions/health-advisory \
  -H "Content-Type: application/json" \
  -d '{"city": "mumbai", "age": 35, "conditions": ["asthma"], "hoursOutdoor": 3}'
```
### विसंगती तपासा
```bash
curl https://www.janvayu.in/.netlify/functions/anomaly-check
```
### Reddit फीड मिळवा
```bash
curl https://www.janvayu.in/.netlify/functions/reddit-feed?filter=delhi
```
### डायजेस्टची सदस्यता घ्या
```bash
curl -X POST https://www.janvayu.in/.netlify/functions/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "cities": ["delhi", "mumbai"], "pm25_threshold": 90}'
```
