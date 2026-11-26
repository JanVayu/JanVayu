# डिप्लॉयमेंट
JanVayu को **Netlify** पर डिप्लॉय किया गया है, जो GitHub पर `main` ब्रांच में हर पुश पर बिल्ड करता है।
---
## डिप्लॉयमेंट कैसे काम करता है
1. GitHub पर `main` में पुश करें
2. Netlify वेबहुक के ज़रिए नए कमिट का पता लगाता है
3. Netlify बिल्ड कमांड (`node scripts/bump-version.mjs`, एक वर्ज़न-स्टैम्प स्क्रिप्ट; कोई बंडलर नहीं है) चलाता है और रेपो रूट को पब्लिश डायरेक्टरी मानकर डिप्लॉय करता है
4. साइट [www.janvayu.in](https://www.janvayu.in) पर लाइव हो जाती है
स्टेप 4 Netlify की एक सेटिंग पर निर्भर करता है जो इस रिपॉजिटरी में नहीं है। `CLAUDE.md` साइट को पब्लिश-लॉक्ड के रूप में वर्णित करता है, जिसका मतलब है कि एक पुश बिल्ड बनाता है और डिप्लॉय अगले पब्लिश विंडो पर लाइव होता है। किसी को यह बताने से पहले कि कोई मर्ज किया गया बदलाव लाइव है, वर्तमान सेटिंग के लिए Netlify डैशबोर्ड चेक करें।
README में Netlify बिल्ड स्टेटस बैज वर्तमान डिप्लॉय स्थिति को दर्शाता है।
---
## Netlify कॉन्फ़िगरेशन (`netlify.toml`)
```toml
# संक्षिप्त: असली netlify.toml में कई और हेडर और रीडायरेक्ट नियम हैं
[build]
  command = "node scripts/bump-version.mjs"
  publish = "."         # रेपो रूट से सर्व करें
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
# .../docs, /blog, /embed, /api, /ask, /status आदि के लिए विशिष्ट नियम फॉलबैक से पहले आते हैं
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
मुख्य बिंदु:
- SPA फॉलबैक (`/* → /index.html`) यह सुनिश्चित करता है कि डीप लिंक्स सही ढंग से काम करें
- नॉन-www को www (कैनोनिकल डोमेन) पर रीडायरेक्ट किया जाता है
- सुरक्षा हेडर विश्व स्तर पर लागू किए जाते हैं
---
## डोमेन और DNS
कस्टम डोमेन `janvayu.in` को Netlify DNS में कॉन्फ़िगर किया गया है। रेपो रूट में `CNAME` फ़ाइल में `www.janvayu.in` है; Netlify पर इसका कोई प्रभाव नहीं पड़ता है, और यह पहले के GitHub Pages सेटअप की है या नहीं, यह रिपॉजिटरी में रिकॉर्ड नहीं है।
---
## प्रीव्यू डिप्लॉय
पुल रिक्वेस्ट स्वचालित रूप से एक प्रीव्यू URL (जैसे, `https://deploy-preview-42--janvayu.netlify.app`) जनरेट करते हैं। यह समीक्षकों को `main` में मर्ज करने से पहले बदलावों का परीक्षण करने की अनुमति देता है।
---
## प्रोडक्शन में एनवायरनमेंट वेरिएबल्स
सभी आवश्यक वेरिएबल्स को Netlify डैशबोर्ड में सेट करें:
1. [app.netlify.com](https://app.netlify.com) पर जाएँ
2. JanVayu साइट खोलें
3. **Site Configuration → Environment Variables** पर जाएँ
4. प्रत्येक वेरिएबल जोड़ें (देखें [Environment Variables](environment-variables.md))
प्रोडक्शन एनवायरनमेंट वेरिएबल्स **कभी भी** रिपॉजिटरी में स्टोर नहीं किए जाते हैं।
---
## रोलबैक
पिछले डिप्लॉय पर रोलबैक करने के लिए:
1. Netlify डैशबोर्ड → Deploys पर जाएँ
2. आखिरी ज्ञात-सही डिप्लॉय खोजें
3. "Publish deploy" पर क्लिक करें
Netlify पूरे डिप्लॉय इतिहास को सुरक्षित रखता है, इसलिए रोलबैक तुरंत हो जाते हैं।
---
## मॉनिटरिंग
- **डिप्लॉय स्टेटस:** Netlify डैशबोर्ड → Deploys
- **फंक्शन लॉग्स:** Netlify डैशबोर्ड → Functions → Logs
- **फीड फ्रेशनेस:** `GET /.netlify/functions/feed-status` — सभी फीड्स के लिए अंतिम अपडेट टाइमस्टैम्प लौटाता है
- **अपटाइम:** [/status/](https://www.janvayu.in/status/) पर पब्लिक स्टेटस पेज उस इतिहास को पढ़ता है जिसे `health-monitor.mjs` हर 15 मिनट में रिकॉर्ड करता है। `.github/workflows/function-health.yml` उसी अंतराल पर साइट और उसके फंक्शन्स की जांच करता है और जब तक कोई डाउन रहता है, तब तक "status: outage" इश्यू को खुला रखता है।
- **लाइव रीडिंग:** `.github/workflows/live-audit.yml` दिन में एक बार साइट की लाइव रीडिंग की तुलना CPCB के दैनिक बुलेटिन से करता है; लाल रंग का शेड्यूल्ड रन एक अलर्ट है।
- **शेड्यूल्ड फंक्शन लॉग्स:** Netlify डैशबोर्ड → Functions → Scheduled Functions
