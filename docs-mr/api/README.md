# API संदर्भ

JanVayu 12 सार्वजनिक एंडपॉइंट्स (11 Netlify Functions आणि `/api` ओपन-डेटा एंट्री पॉईंट; त्यापैकी एक, `/twitter-feed`, आता बंद करण्यात आले आहे) प्रदान करते. हे सर्व सार्वजनिकरित्या उपलब्ध आहेत आणि CORS ला सपोर्ट करतात. ते JSON परत करतात, फक्त CSV एक्सपोर्ट वगळता, जे `text/csv` परत करते. रिपॉझिटरीमध्ये Open Data API (rankings, reference-data, historical-aqi, community-sensors, status-history) मागे आणखी काही फंक्शन्स आणि अंतर्गत फंक्शन्स देखील आहेत.

**बेस URL:** `https://www.janvayu.in/.netlify/functions`

---

## क्विक रेफरन्स

### AI फीचर्स (v25.1)

| एंडपॉइंट | मेथड | वर्णन |
|----------|--------|-------------|
| `/air-query` | POST | नॅचरल लँग्वेज AQI Q&A |
| `/health-advisory` | POST | वैयक्तिकृत आरोग्य सल्ला |
| `/accountability-brief` | POST | वॉर्ड-पातळीवरील प्रशासकीय माहिती |
| `/anomaly-check` | GET | PM2.5 स्पाइक शोधणे |

### सोशल फीड्स

| एंडपॉइंट | मेथड | वर्णन |
|----------|--------|-------------|
| `/reddit-feed` | GET | कॅश केलेले Reddit पोस्ट्स |
| `/twitter-feed` | — | **बंद केले.** Nitter वाचा, ज्याचे सार्वजनिक इन्स्टन्सेस आता उपलब्ध नाहीत; हे एंडपॉइंट आता उत्तर देत नाही आणि कोणीही ते कॉल करत नाही. |
| `/youtube-feed` | GET | YouTube चॅनेल RSS मधील कॅश केलेले भारत हवामान गुणवत्ता व्हिडिओ |
| `/news-proxy` | GET | कॅश केलेले बातम्यांचे लेख |
| `/instagram-feed` | GET | कॅश केलेले Instagram पोस्ट्स |

### प्लॅटफॉर्म

| एंडपॉइंट | मेथड | वर्णन |
|----------|--------|-------------|
| `/subscribe` | POST | ईमेल सबस्क्रिप्शन व्यवस्थापन |
| `/feed-status` | GET | फीड हेल्थ मॉनिटरिंग |

### ओपन डेटा

| एंडपॉइंट | मेथड | वर्णन |
|----------|--------|-------------|
| `/api` | GET | व्हर्जन केलेला डेटा मॅनिफेस्ट + CSV एक्सपोर्ट |

---

## ओपन डेटा API

JanVayu ने प्रकाशित केलेल्या डेटासेटवरील एकच, शोधण्यायोग्य एंट्री पॉईंट — पत्रकार, संशोधक आणि फोर्क्ससाठी बनवलेला. फक्त वाचण्यासाठी, CORS-ओपन, योग्य श्रेय देऊन वापरण्यासाठी मोफत.

**मॅनिफेस्ट (प्रत्येक डेटासेट, त्याचे पॅरामीटर्स, परवाना आणि संदर्भ यांची यादी):**

```bash
curl https://www.janvayu.in/api
```

**लाइव्ह सिटी रँकिंग्सचे CSV एक्सपोर्ट:**

```bash
curl "https://www.janvayu.in/api?dataset=rankings&format=csv"          # live
curl "https://www.janvayu.in/api?dataset=rankings&format=csv&range=week" # 7-day average
curl "https://www.janvayu.in/api?dataset=rankings&format=csv&range=month" # 30-day average
```

`rankings` फंक्शन `range=live`, `range=week` आणि `range=month` समजते. इतर कोणताही व्हॅल्यू, ज्यामध्ये `7d` आणि `30d` (जे मॅनिफेस्टमध्ये सूचीबद्ध आहेत) समाविष्ट आहे, तो 30-दिवसांची रेंज म्हणून मानला जातो.
---
> **Known issue:** `/api` मॅनिफेस्टमध्ये `range=7d` चा उल्लेख आहे, पण रँकिंग्ज फंक्शन ते ओळखत नाही, त्यामुळे ते 7-दिवसांची सरासरी न देता 30-दिवसांची सरासरी देते. जोपर्यंत कोड दुरुस्त होत नाही, तोपर्यंत 7-दिवसांच्या सरासरीसाठी `range=week` वापरा.

मॅनिफेस्टमधील लिंक्स मूळ JSON एंडपॉइंट्सकडे निर्देशित करतात — `rankings`, `reference-data` (CPCB स्टेशन्स / NCAP शहरे / IQAir वार्षिक), `historical-aqi`, `community-sensors`, आणि `status-history` — जे स्वतंत्रपणे कॉल केले जाऊ शकतात.

**Licence:** डेटा सामग्री CC BY-NC-SA 4.0 आहे; कोड MIT आहे. कृपया मॅनिफेस्टमधील `citation` फील्डमध्ये दाखवल्याप्रमाणे संदर्भ द्या.

---

## OpenAPI Specification

संपूर्ण OpenAPI 3.1 स्पेक [`openapi.yaml`](openapi.yaml) येथे उपलब्ध आहे. Swagger UI, Postman, Insomnia किंवा कोणत्याही OpenAPI-सुसंगत टूलमध्ये ते इम्पोर्ट करा.

---

## Authentication

ऑथेंटिकेशनची आवश्यकता नाही. सर्व एंडपॉइंट्स सार्वजनिक आहेत.

- **AI एंडपॉइंट्स** Groq च्या रेट लिमिट्सवर अवलंबून आहेत
- **Feed एंडपॉइंट्स** कॅशेमधून (दर 4 तासांनी प्री-फेच केलेले) सर्व्ह केले जातात
- **CORS:** सर्व रिस्पॉन्सेसवर `Access-Control-Allow-Origin: *`

---

## Common Response Patterns

### Success
अपस्ट्रीम किंवा AI फेल्युअरसाठी एंडपॉइंट्स HTTP 200 रिटर्न करतात (फॉल-बॅक बॉडीसह), पण चुकीच्या इनपुटसाठी 400, चुकीच्या मेथडसाठी 405, आणि अंतर्गत किंवा अपस्ट्रीम एरर्ससाठी 500 किंवा 502 रिटर्न करतात (उदाहरणार्थ, रँकिंग्ज CSV बनवता न आल्यास `/api` 502 रिटर्न करते). स्टेटस कोड आणि रिस्पॉन्स बॉडी तपासा.

### Fallback
जर Groq रेट-लिमिटेड असेल, तर AI एंडपॉइंट्स रॉ डेटा (AI विश्लेषणशिवाय) रिटर्न करतात. जर लाईव्ह फेच फेल झाले, तर फीड एंडपॉइंट्स जुना कॅशे रिटर्न करतात.

### CORS Preflight
सर्व POST एंडपॉइंट्स OPTIONS रिक्वेस्ट्स 204 No Content सह हँडल करतात.

---

## Example Requests

### Ask about air quality

```bash
curl -X POST https://www.janvayu.in/.netlify/functions/air-query \
  -H "Content-Type: application/json" \
  -d '{"city": "delhi", "question": "Is it safe to go for a run today?"}'
```

### Get health advisory

```bash
curl -X POST https://www.janvayu.in/.netlify/functions/health-advisory \
  -H "Content-Type: application/json" \
  -d '{"city": "mumbai", "age": 35, "conditions": ["asthma"], "hoursOutdoor": 3}'
```

### Check anomalies

```bash
curl https://www.janvayu.in/.netlify/functions/anomaly-check
```

### Get Reddit feed

```bash
curl https://www.janvayu.in/.netlify/functions/reddit-feed?filter=delhi
```

### Subscribe to digest

```bash
curl -X POST https://www.janvayu.in/.netlify/functions/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "cities": ["delhi", "mumbai"]}'
```
