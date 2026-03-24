# डिप्लॉयमेंट

JanVayu **Netlify** वर डिप्लॉय केलेले आहे, GitHub वरील `main` शाखेवर प्रत्येक push द्वारे स्वयंचलित deploys ट्रिगर होतात.

---

## डिप्लॉयमेंट कसे कार्य करते

1. GitHub वर `main` वर push करा
2. Netlify webhook द्वारे नवीन commit शोधतो
3. Netlify बिल्ड आणि डिप्लॉय करतो (कोणतीही बिल्ड स्टेप नाही — रिपो रूट हे publish directory आहे)
4. साइट [www.janvayu.in](https://www.janvayu.in) वर 30–90 सेकंदात लाइव्ह होते

README मधील Netlify build status badge सध्याची deploy स्थिती दर्शवतो.

---

## Netlify कॉन्फिगरेशन (`netlify.toml`)

```toml
[build]
  publish = "."         # रिपो रूटमधून सर्व्ह करा
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"

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

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

प्रमुख मुद्दे:
- SPA fallback (`/* → /index.html`) deep links योग्यरित्या काम करतील याची खात्री करतो
- Non-www ला www वर redirect केले जाते (canonical domain)
- Security headers सर्वत्र लागू केले जातात

---

## Domain आणि DNS

कस्टम domain `janvayu.in` Netlify DNS मध्ये कॉन्फिगर केलेले आहे. रिपो रूटमधील `CNAME` फाइल GitHub Pages कस्टम domain सेट करते (legacy, Netlify migration पूर्वीचे).

---

## Preview Deploys

Pull requests स्वयंचलितपणे preview URL तयार करतात (उदा., `https://deploy-preview-42--janvayu.netlify.app`). यामुळे reviewers `main` मध्ये merge करण्यापूर्वी बदल चाचणी करू शकतात.

---

## उत्पादनात Environment Variables

Netlify dashboard मध्ये सर्व आवश्यक variables सेट करा:

1. [app.netlify.com](https://app.netlify.com) वर जा
2. JanVayu साइट उघडा
3. **Site Configuration → Environment Variables** वर जा
4. प्रत्येक variable जोडा ([Environment Variables](environment-variables.md) पहा)

उत्पादनातील environment variables **कधीही** रिपॉझिटरीमध्ये साठवले जात नाहीत.

---

## Rollback

मागील deploy वर परत जाण्यासाठी:

1. Netlify dashboard → Deploys वर जा
2. शेवटचा ज्ञात-चांगला deploy शोधा
3. "Publish deploy" वर क्लिक करा

Netlify पूर्ण deploy इतिहास ठेवतो, त्यामुळे rollbacks तात्काळ आहेत.

---

## मॉनिटरिंग

- **Deploy स्थिती:** Netlify dashboard → Deploys
- **Function logs:** Netlify dashboard → Functions → Logs
- **फीड ताजेपणा:** `GET /.netlify/functions/feed-status` — सर्व फीड्ससाठी शेवटचा अपडेट timestamps परत करतो
- **Scheduled function logs:** Netlify dashboard → Functions → Scheduled Functions
