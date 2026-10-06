# डिप्लॉयमेंट

JanVayu को **Netlify** पर डिप्लॉय किया गया है। GitHub पर `main` ब्रांच में किए गए हर पुश के साथ ऑटोमैटिक डिप्लॉय ट्रिगर हो जाते हैं।

---

## डिप्लॉयमेंट कैसे काम करता है

1. GitHub पर `main` पर पुश करें
2. Netlify वेबहुक के ज़रिए नए कमिट का पता लगाता है
3. Netlify बिल्ड कमांड (`node scripts/bump-version.mjs`, एक वर्ज़न-स्टैम्प स्क्रिप्ट; इसमें कोई बंडलर नहीं है) रन करता है और रेपो रूट को पब्लिश डायरेक्टरी के रूप में इस्तेमाल करके डिप्लॉय करता है
4. साइट [www.janvayu.in](https://www.janvayu.in) पर लाइव हो जाती है

README में Netlify बिल्ड स्टेटस बैज मौजूदा डिप्लॉय स्टेट को दिखाता है।

---

## Netlify कॉन्फ़िगरेशन (`netlify.toml`)

```toml
# संक्षिप्त: असली netlify.toml में और भी कई हेडर्स और रीडायरेक्ट रूल्स हैं
[build]
  command = "node scripts/bump-version.mjs"
  publish = "."         # रेपो रूट से सर्व करें
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

# .../docs, /blog, /embed, /api, /ask, /status आदि के लिए विशिष्ट रूल्स फॉलबैक से पहले आते हैं
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

मुख्य बिंदु:
- SPA फॉलबैक (`/* → /index.html`) यह सुनिश्चित करता है कि डीप लिंक्स सही से काम करें
- नॉन-www को www (कैनोनिकल डोमेन) पर रीडायरेक्ट किया जाता है
- सिक्योरिटी हेडर्स को ग्लोबली लागू किया जाता है

---

## डोमेन और DNS

कस्टम डोमेन `janvayu.in` को Netlify DNS में कॉन्फ़िगर किया गया है। रेपो रूट में मौजूद `CNAME` फ़ाइल में `www.janvayu.in` है; इसका Netlify पर कोई असर नहीं होता, और यह पहले के GitHub Pages सेटअप का हिस्सा था या नहीं, इसका कोई रिकॉर्ड रिपॉजिटरी में मौजूद नहीं है।

---

## प्रीव्यू डिप्लॉय

पुल रिक्वेस्ट अपने आप एक प्रीव्यू URL जनरेट कर देते हैं (जैसे, `https://deploy-preview-42--janvayu.netlify.app`)। इससे रिव्यूअर्स को `main` में मर्ज करने से पहले बदलावों को टेस्ट करने में मदद मिलती है।

---

## प्रोडक्शन में एनवायरनमेंट वेरिएबल्स

Netlify डैशबोर्ड में सभी ज़रूरी वेरिएबल्स सेट करें:

1. [app.netlify.com](https://app.netlify.com) पर जाएँ
2. JanVayu साइट खोलें
3. **Site Configuration → Environment Variables** पर जाएँ
4. हर वेरिएबल जोड़ें ([Environment Variables](environment-variables.md) देखें)

प्रोडक्शन एनवायरनमेंट वेरिएबल्स **कभी भी** रिपॉजिटरी में स्टोर नहीं किए जाते हैं।

---

## रोलबैक

पिछले डिप्लॉय पर रोलबैक करने के लिए:

1. Netlify डैशबोर्ड → Deploys पर जाएँ
2. आखिरी ज्ञात-सही डिप्लॉय खोजें
3. "Publish deploy" पर क्लिक करें
Netlify पूरी डिप्लॉय हिस्ट्री रखता है, इसलिए रोलबैक तुरंत हो जाते हैं।

---

## मॉनिटरिंग

- **डिप्लॉय स्टेटस:** Netlify डैशबोर्ड → Deploys
- **फंक्शन लॉग्स:** Netlify डैशबोर्ड → Functions → Logs
- **फीड की ताज़गी:** `GET /.netlify/functions/feed-status` — सभी फीड्स के लिए आखिरी अपडेट टाइमस्टैम्प देता है
- **शेड्यूल्ड फंक्शन लॉग्स:** Netlify डैशबोर्ड → Functions → Scheduled Functions
