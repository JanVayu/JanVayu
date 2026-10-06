# API Reference

JanVayu 12 पब्लिक एंडपॉइंट्स (11 Netlify Functions और `/api` ओपन-डेटा एंट्री पॉइंट; इनमें से एक, `/twitter-feed`, अब बंद हो चुका है) एक्सपोज़ करता है। ये सभी पब्लिकली एक्सेसिबल हैं और CORS को सपोर्ट करते हैं। ये JSON रिटर्न करते हैं, सिवाय CSV एक्सपोर्ट के, जो `text/csv` रिटर्न करता है। रिपॉजिटरी में Open Data API के पीछे कुछ और फंक्शन्स (rankings, reference-data, historical-aqi, community-sensors, status-history) और इंटरनल फंक्शन्स भी शामिल हैं।

**बेस URL:** `https://www.janvayu.in/.netlify/functions`

---

## क्विक रेफरेंस

### AI फीचर्स (v25.1)

| एंडपॉइंट | मेथड | विवरण |
|----------|--------|-------------|
| `/air-query` | POST | नेचुरल लैंग्वेज AQI Q&A |
| `/health-advisory` | POST | पर्सनलाइज़्ड हेल्थ एडवाइस |
| `/accountability-brief` | POST | वार्ड-लेवल गवर्नेंस ब्रीफ्स |
| `/anomaly-check` | GET | PM2.5 स्पाइक डिटेक्शन |

### सोशल फीड्स

| एंडपॉइंट | मेथड | विवरण |
|----------|--------|-------------|
| `/reddit-feed` | GET | कैश्ड Reddit पोस्ट्स |
| `/twitter-feed` | — | **रिटायर्ड।** Nitter पढ़ें, जिसके पब्लिक इंस्टेंसेस अब मौजूद नहीं हैं; यह एंडपॉइंट अब जवाब नहीं देता और कोई भी इसे कॉल नहीं करता। |
| `/youtube-feed` | GET | YouTube चैनल RSS से कैश्ड इंडिया एयर-क्वालिटी वीडियो |
| `/news-proxy` | GET | कैश्ड न्यूज़ आर्टिकल्स |
| `/instagram-feed` | GET | कैश्ड Instagram पोस्ट्स |

### प्लेटफॉर्म

| एंडपॉइंट | मेथड | विवरण |
|----------|--------|-------------|
| `/subscribe` | POST | ईमेल सब्सक्रिप्शन मैनेजमेंट |
| `/feed-status` | GET | फीड हेल्थ मॉनिटरिंग |

### ओपन डेटा

| एंडपॉइंट | मेथड | विवरण |
|----------|--------|-------------|
| `/api` | GET | वर्ज़न्ड डेटा मेनिफेस्ट + CSV एक्सपोर्ट |

---

## ओपन डेटा API

JanVayu द्वारा पब्लिश किए गए डेटासेट्स के लिए एक सिंगल, आसानी से खोजा जा सकने वाला एंट्री पॉइंट — जो पत्रकारों, शोधकर्ताओं और फोर्क्स के लिए बनाया गया है। रीड-ओनली, CORS-ओपन, एट्रिब्यूशन के साथ इस्तेमाल करने के लिए फ्री।

**मेनिफेस्ट (हर डेटासेट, उसके पैरामीटर्स, लाइसेंस और साइटेशन की लिस्ट देता है):**

```bash
curl https://www.janvayu.in/api
```

**लाइव सिटी रैंकिंग्स का CSV एक्सपोर्ट:**

```bash
curl "https://www.janvayu.in/api?dataset=rankings&format=csv"          # live
curl "https://www.janvayu.in/api?dataset=rankings&format=csv&range=week" # 7-day average
curl "https://www.janvayu.in/api?dataset=rankings&format=csv&range=month" # 30-day average
```

`rankings` फंक्शन `range=live`, `range=week` और `range=month` को समझता है। कोई भी दूसरा वैल्यू, जिसमें `7d` और `30d` (जो मेनिफेस्ट में लिस्टेड हैं) शामिल हैं, उसे 30-दिन की रेंज माना जाता है।
> **ज्ञात समस्या:** `/api` मेनिफेस्ट में `range=7d` का विज्ञापन दिया गया है, लेकिन रैंकिंग फ़ंक्शन इसे नहीं पहचानता है। इसलिए यह 7-दिन के औसत के बजाय 30-दिन का औसत लौटाता है। जब तक कोड ठीक नहीं हो जाता, 7-दिन के औसत के लिए `range=week` का उपयोग करें।

मेनिफेस्ट अंतर्निहित JSON एंडपॉइंट्स — `rankings`, `reference-data` (CPCB स्टेशन / NCAP शहर / IQAir वार्षिक), `historical-aqi`, `community-sensors`, और `status-history` — की ओर इशारा करता है, जिन्हें अलग-अलग कॉल किया जा सकता है।

**लाइसेंस:** डेटा सामग्री CC BY-NC-SA 4.0 है; कोड MIT है। कृपया मेनिफेस्ट के `citation` फ़ील्ड में दिखाए गए अनुसार उद्धृत करें।

---

## OpenAPI स्पेसिफिकेशन

पूरी OpenAPI 3.1 स्पेक [`openapi.yaml`](openapi.yaml) पर उपलब्ध है। इसे Swagger UI, Postman, Insomnia, या किसी भी OpenAPI-संगत टूल में इम्पोर्ट करें।

---

## प्रमाणीकरण

किसी प्रमाणीकरण की आवश्यकता नहीं है। सभी एंडपॉइंट सार्वजनिक हैं।

- **AI एंडपॉइंट्स** Groq की रेट लिमिट पर निर्भर करते हैं
- **फ़ीड एंडपॉइंट्स** कैश से सर्व होते हैं (हर 4 घंटे में पहले से प्राप्त किए गए)
- **CORS:** सभी प्रतिक्रियाओं पर `Access-Control-Allow-Origin: *`

---

## सामान्य प्रतिक्रिया पैटर्न

### सफलता
अपस्ट्रीम या AI विफलताओं के लिए एंडपॉइंट्स HTTP 200 लौटाते हैं (एक फ़ॉलबैक बॉडी के साथ), लेकिन अमान्य इनपुट के लिए 400, गलत मेथड के लिए 405, और आंतरिक या अपस्ट्रीम त्रुटियों पर 500 या 502 लौटाते हैं (उदाहरण के लिए `/api` 502 लौटाता है जब रैंकिंग CSV नहीं बन पाती है)। स्टेटस कोड और प्रतिक्रिया बॉडी की जाँच करें।

### फ़ॉलबैक
यदि Groq रेट-लिमिटेड है, तो AI एंडपॉइंट्स कच्चा डेटा (बिना AI विश्लेषण के) लौटाते हैं। यदि लाइव फ़ेच विफल हो जाते हैं, तो फ़ीड एंडपॉइंट्स पुराना कैश लौटाते हैं।

### CORS प्रीफ़्लाइट
सभी POST एंडपॉइंट्स 204 No Content के साथ OPTIONS अनुरोधों को संभालते हैं।

---

## उदाहरण अनुरोध

### वायु गुणवत्ता के बारे में पूछें

```bash
curl -X POST https://www.janvayu.in/.netlify/functions/air-query \
  -H "Content-Type: application/json" \
  -d '{"city": "delhi", "question": "Is it safe to go for a run today?"}'
```

### स्वास्थ्य सलाह प्राप्त करें

```bash
curl -X POST https://www.janvayu.in/.netlify/functions/health-advisory \
  -H "Content-Type: application/json" \
  -d '{"city": "mumbai", "age": 35, "conditions": ["asthma"], "hoursOutdoor": 3}'
```

### विसंगतियों की जाँच करें

```bash
curl https://www.janvayu.in/.netlify/functions/anomaly-check
```

### Reddit फ़ीड प्राप्त करें

```bash
curl https://www.janvayu.in/.netlify/functions/reddit-feed?filter=delhi
```

### डाइजेस्ट सब्सक्राइब करें

```bash
curl -X POST https://www.janvayu.in/.netlify/functions/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "cities": ["delhi", "mumbai"]}'
```
