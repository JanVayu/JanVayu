# डिप्लॉयमेंट
JanVayu हे **Netlify** वर डिप्लॉय केले आहे, जे GitHub वरील `main` ब्रांचवर पुश केल्यावर प्रत्येक वेळी बिल्ड करते.
---
## डिप्लॉयमेंट कसे काम करते
1. GitHub वर `main` ला पुश करा
2. Netlify वेबहूकद्वारे नवीन कमिट शोधते
3. Netlify बिल्ड कमांड (`node scripts/bump-version.mjs`, एक व्हर्जन-स्टॅम्प स्क्रिप्ट; यात कोणताही बंडलर नाही) रन करते आणि रेपो रूटला पब्लिश डिरेक्टरी मानून डिप्लॉय करते
4. साइट [www.janvayu.in](https://www.janvayu.in) वर लाईव्ह होते
स्टेप 4 ही Netlify सेटिंगवर अवलंबून आहे जी या रिपॉझिटरीमध्ये नाही. `CLAUDE.md` मध्ये साइट पब्लिश-लॉक्ड असल्याचे वर्णन केले आहे, ज्याचा अर्थ असा की पुश केल्यावर डिप्लॉय तयार होते आणि पुढील पब्लिश विंडोमध्ये डिप्लॉय लाईव्ह होते. मर्ज केलेला बदल लाईव्ह झाला आहे असे कोणालाही सांगण्यापूर्वी सध्याची सेटिंग तपासण्यासाठी Netlify डॅशबोर्ड पहा.
README मधील Netlify बिल्ड स्टेटस बॅज सध्याची डिप्लॉय स्थिती दर्शवतो.
---
## Netlify कॉन्फिगरेशन (`netlify.toml`)
```toml
# संक्षिप्त: खऱ्या netlify.toml मध्ये आणखी अनेक हेडर आणि रीडायरेक्ट नियम आहेत
[build]
  command = "node scripts/bump-version.mjs"
  publish = "."         # रिपो रूटमधून सर्व्ह करा
  functions = "netlify/functions"
[build.environment]
  NODE_VERSION = "24"
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
# .../docs, /blog, /embed, /api, /ask, /status इत्यादींसाठी विशिष्ट नियम फॉलबॅकच्या आधी येतात
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
महत्त्वाचे मुद्दे:
- SPA फॉलबॅक (`/* → /index.html`) डीप लिंक्स योग्यरित्या काम करतील याची खात्री देतो
- नॉन-www ला www (कॅनॉनिकल डोमेन) वर रीडायरेक्ट केले जाते
- सिक्युरिटी हेडर जागतिक स्तरावर लागू केले जातात
---
## डोमेन आणि DNS
कस्टम डोमेन `janvayu.in` Netlify DNS मध्ये कॉन्फिगर केले आहे. रिपो रूटमधील `CNAME` फाईलमध्ये `www.janvayu.in` आहे; याचा Netlify वर कोणताही परिणाम होत नाही, आणि ते पूर्वीच्या GitHub Pages सेटअपचे आहे की नाही याची नोंद रिपॉझिटरीमध्ये केलेली नाही.
---
## प्रीव्ह्यू डिप्लॉय्स
पुल रिक्वेस्ट्स आपोआप एक प्रीव्ह्यू URL तयार करतात (उदा., `https://deploy-preview-42--janvayu.netlify.app`). यामुळे रिव्ह्यूअर्सना `main` मध्ये मर्ज करण्यापूर्वी बदलांची चाचणी घेता येते.
---
## प्रोडक्शनमधील एन्व्हायरन्मेंट व्हेरिएबल्स
Netlify डॅशबोर्डमध्ये सर्व आवश्यक व्हेरिएबल्स सेट करा:
१. [app.netlify.com](https://app.netlify.com) वर जा
२. JanVayu साईट ओपन करा
३. **Site Configuration → Environment Variables** वर जा
४. प्रत्येक व्हेरिएबल ॲड करा ([Environment Variables](environment-variables.md) पहा)
प्रोडक्शन एन्व्हायर्नमेंट व्हेरिएबल्स **कधीही** रिपॉझिटरीमध्ये स्टोअर केले जात नाहीत.
---
## रोलबॅक
मागील डिप्लॉयवर रोलबॅक करण्यासाठी:
१. Netlify डॅशबोर्ड → Deploys वर जा
२. शेवटचा ज्ञात-चांगला (known-good) डिप्लॉय शोधा
३. "Publish deploy" वर क्लिक करा
Netlify संपूर्ण डिप्लॉय इतिहास जतन करून ठेवते, त्यामुळे रोलबॅक लगेच होतात.
---
## मॉनिटरिंग
- **डिप्लॉय स्टेटस:** Netlify डॅशबोर्ड → Deploys
- **फंक्शन लॉग्स:** Netlify डॅशबोर्ड → Functions → Logs
- **फीड फ्रेशनेस:** `GET /.netlify/functions/feed-status` — सर्व फीड्ससाठी शेवटच्या अपडेटची वेळ (timestamps) रिटर्न करते
- **अपटाइम:** [/status/](https://www.janvayu.in/status/) वरील पब्लिक स्टेटस पेज, `health-monitor.mjs` ने दर 15 मिनिटांनी रेकॉर्ड केलेला इतिहास वाचते. `.github/workflows/function-health.yml` त्याच वेळेत साईट आणि तिच्या फंक्शन्सची तपासणी करते आणि जोपर्यंत एखादी साईट डाऊन असते, तोपर्यंत "status: outage" इश्यू ओपन ठेवते.
- **लाइव्ह रीडिंग्स:** `.github/workflows/live-audit.yml` साईटला जे लाईव्ह रीडिंग्स दिसतात, त्यांची CPCB च्या दैनंदिन बुलेटिनशी दिवसातून एकदा तुलना करते; लाल रंगातील शेड्युल्ड रन म्हणजे अलर्ट असतो.
- **शेड्युल्ड फंक्शन लॉग्स:** Netlify डॅशबोर्ड → Functions → Scheduled Functions
