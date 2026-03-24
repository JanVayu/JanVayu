# डिप्लॉयमेंट

JanVayu GitHub के `main` ब्रांच से Netlify पर स्वचालित रूप से डिप्लॉय होता है।

---

## डिप्लॉयमेंट प्रक्रिया

```
GitHub main ब्रांच पर पुश
        │
        ▼
Netlify स्वचालित बिल्ड ट्रिगर
        │
        ▼
npm install (3 पैकेज)
        │
        ▼
Root directory सर्व (index.html)
+ Functions डिप्लॉय (netlify/functions/)
        │
        ▼
Netlify CDN पर लाइव
(www.janvayu.in)
```

---

## Netlify कॉन्फ़िगरेशन (`netlify.toml`)

```toml
[build]
  publish = "."
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"
```

- **बिल्ड कमांड:** कोई नहीं (कोई बिल्ड स्टेप नहीं)
- **पब्लिश डायरेक्टरी:** `.` (रिपॉजिटरी रूट)
- **फ़ंक्शन डायरेक्टरी:** `netlify/functions/`

---

## कस्टम डोमेन

- **डोमेन:** janvayu.in
- **DNS:** Netlify DNS
- **SSL:** स्वचालित Let's Encrypt
- **CNAME:** रिपॉजिटरी में `CNAME` फ़ाइल

---

## सुरक्षा हेडर

सभी प्रतिक्रियाओं पर लागू:

| हेडर | मूल्य | उद्देश्य |
|------|-------|---------|
| `X-Frame-Options` | `DENY` | क्लिकजैकिंग रोकथाम |
| `X-Content-Type-Options` | `nosniff` | MIME स्निफ़िंग रोकथाम |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | रेफ़रर डेटा सीमित |

---

## रीडायरेक्ट

- `www.janvayu.in` → `janvayu.in` (canonical URL)
- सभी रूट → `/index.html` (SPA फ़ॉलबैक)
- `/robots.txt` और `/sitemap.xml` SPA फ़ॉलबैक से बाहर

---

## लागत

| सेवा | टियर | मासिक लागत |
|------|------|-----------|
| Netlify (होस्टिंग + फ़ंक्शन) | निःशुल्क | ₹0 |
| GitHub | निःशुल्क | ₹0 |
| WAQI API | निःशुल्क | ₹0 |
| Gemini API | निःशुल्क | ₹0 |
| Resend | निःशुल्क | ₹0 |
| डोमेन (janvayu.in) | वार्षिक | ~₹800/वर्ष |

**कुल: ~₹800/वर्ष**
