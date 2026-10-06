# डिप्लॉयमेंट

JanVayu **Netlify** वर डिप्लॉय केले आहे. GitHub वरील `main` ब्रांचवर प्रत्येक पुश केल्यावर आपोआप डिप्लॉयमेंट ट्रिगर होते.

---

## डिप्लॉयमेंट कसे काम करते

1. GitHub वर `main` वर पुश करा
2. Netlify वेबहूकद्वारे नवीन कमिट शोधते
3. Netlify बिल्ड कमांड (`node scripts/bump-version.mjs`, एक व्हर्जन-स्टॅम्प स्क्रिप्ट; यात कोणतेही बंडलर नाही) रन करते आणि रेपो रूटला पब्लिश डिरेक्टरी म्हणून वापरून डिप्लॉय करते
4. साईट [www.janvayu.in](https://www.janvayu.in) वर लाईव्ह होते

README मधील Netlify बिल्ड स्टेटस बॅज सध्याची डिप्लॉय स्टेट दर्शवतो.

---

## Netlify कॉन्फिगरेशन (`netlify.toml`)

```toml
# संक्षिप्त: खऱ्या netlify.toml मध्ये आणखी अनेक हेडर्स आणि रीडायरेक्ट नियम आहेत
[build]
  command = "node scripts/bump-version.mjs"
  publish = "."         # रेपो रूटमधून सर्व्ह करा
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "22"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[redirects]]
  from = "https://janvayu.in/*"
  to = "https://www.janvayu.in/:splat"
  status = 301
  force = true

# ... /docs, /blog, /embed, /api, /ask, /status इत्यादींसाठी विशिष्ट नियम फॉलबॅकच्या आधी येतात
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

महत्त्वाचे मुद्दे:
- SPA फॉलबॅक (`/* → /index.html`) डीप लिंक्स योग्यरित्या काम करत असल्याची खात्री देतो
- नॉन-www ला www (कॅनॉनिकल डोमेन) वर रीडायरेक्ट केले जाते
- सिक्युरिटी हेडर्स जागतिक स्तरावर लागू केले जातात

---

## डोमेन आणि DNS

कस्टम डोमेन `janvayu.in` Netlify DNS मध्ये कॉन्फिगर केलेले आहे. रेपो रूटमधील `CNAME` फाईलमध्ये `www.janvayu.in` आहे; याचा Netlify वर कोणताही परिणाम होत नाही, आणि ते आधीच्या GitHub Pages सेटअपमधील आहे की नाही याची नोंद रिपॉझिटरीमध्ये नाही.

---

## प्रीव्ह्यू डिप्लॉयमेंट्स

पुल रिक्वेस्ट्स आपोआप प्रीव्ह्यू URL तयार करतात (उदा., `https://deploy-preview-42--janvayu.netlify.app`). यामुळे रिव्ह्यूअर्सना `main` मध्ये मर्ज करण्यापूर्वी बदल तपासता येतात.

---

## प्रॉडक्शनमधील एन्व्हायर्नमेंट व्हेरिएबल्स

Netlify डॅशबोर्डमध्ये सर्व आवश्यक व्हेरिएबल्स सेट करा:

1. [app.netlify.com](https://app.netlify.com) वर जा
2. JanVayu साईट उघडा
3. **Site Configuration → Environment Variables** वर जा
4. प्रत्येक व्हेरिएबल जोडा ([Environment Variables](environment-variables.md) पहा)

प्रॉडक्शन एन्व्हायर्नमेंट व्हेरिएबल्स **कधीही** रिपॉझिटरीमध्ये स्टोअर केले जात नाहीत.

---

## रोलबॅक

मागील डिप्लॉयवर रोलबॅक करण्यासाठी:

1. Netlify डॅशबोर्ड → Deploys वर जा
2. शेवटचे ज्ञात-चांगले डिप्लॉय शोधा
3. "Publish deploy" वर क्लिक करा
---
Netlify सर्व डिप्लॉयमेंटचा संपूर्ण इतिहास ठेवते, त्यामुळे रोलबॅक लगेच करता येतात.

---

## मॉनिटरिंग

- **डिप्लॉय स्थिती:** Netlify डॅशबोर्ड → Deploys
- **फंक्शन लॉग्स:** Netlify डॅशबोर्ड → Functions → Logs
- **फीड फ्रेशनेस:** `GET /.netlify/functions/feed-status` — सर्व फीड्ससाठी शेवटच्या अपडेटची वेळ देते
- **शेड्युल्ड फंक्शन लॉग्स:** Netlify डॅशबोर्ड → Functions → Scheduled Functions
