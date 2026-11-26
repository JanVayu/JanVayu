# इन्फ्रास्ट्रक्चर
JanVayu पूरी तरह से Netlify के प्लेटफॉर्म पर चलता है और GitHub इसके सोर्स ऑफ ट्रुथ (source of truth) के रूप में काम करता है। इसमें कोई पारंपरिक सर्वर, डेटाबेस या कंटेनर ऑर्केस्ट्रेशन नहीं है।
---
## Netlify
### होस्टिंग
- **CDN:** Netlify का ग्लोबल एज नेटवर्क
- **डिप्लॉय ट्रिगर:** GitHub पर `main` में पुश करना
- **बिल्ड कमांड:** `node scripts/bump-version.mjs` (सिर्फ वर्ज़न स्टैम्प; कोई बंडलर नहीं)
- **पब्लिश डायरेक्टरी:** `.` (रिपॉजिटरी रूट)
- **फंक्शन्स डायरेक्टरी:** `netlify/functions/`
### कॉन्फ़िगरेशन (`netlify.toml`)
```toml
[build]
  command = "node scripts/bump-version.mjs"
  publish = "."
  functions = "netlify/functions"
[build.environment]
  NODE_VERSION = "24"
```
### सिक्योरिटी हेडर्स
ये सभी पाथ्स (`/*`) पर लागू होते हैं, बस दो अपवादों को छोड़कर: `/embed/*` में `X-Frame-Options = "ALLOWALL"` सेट किया गया है ताकि विजेट्स को किसी भी ओरिजिन से फ्रेम किया जा सके, और `/walkthrough/*` में `SAMEORIGIN` सेट किया गया है:
| हेडर | वैल्यू | उद्देश्य |
|--------|-------|--------|
| `X-Frame-Options` | `DENY` | क्लिकजैकिंग को रोकता है |
| `X-Content-Type-Options` | `nosniff` | MIME स्निफिंग को रोकता है |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | रेफरर डेटा को सीमित करता है |
### रीडायरेक्ट्स
- `janvayu.in/*` → `www.janvayu.in/:splat` (301; कैनोनिकल URL `www.janvayu.in` है)
- बाकी सभी रूट्स → `/index.html` (SPA फॉलबैक), जो `netlify.toml` में `/docs`, `/blog`, `/embed`, `/api`, `/ask`, `/status` और प्रति-प्रदूषक पेजों के विशिष्ट नियमों के बाद लागू होता है
- `/robots.txt` और `/sitemap.xml` SPA फॉलबैक को बायपास करते हैं
---
## GitHub
### रिपॉजिटरी
- **रिपॉजिटरी:** [github.com/JanVayu/JanVayu](https://github.com/JanVayu/JanVayu)
- **डिफ़ॉल्ट ब्रांच:** `main`
- **डिप्लॉय:** Netlify हर बार `main` में पुश होने पर बिल्ड करता है (बिल्ड कब लाइव होता है, इसके लिए [Deployment](../technical/deployment.md) देखें)
### CI/CD
- **GitHub Actions** (`.github/workflows/`, 16 वर्कफ़्लो): `ci.yml` (`index.html`, साइट फ़िगर्स और Netlify फंक्शन्स के गार्ड्स, यूनिट टेस्ट, और Lychee लिंक चेकर), `link-audit`, `accessibility`, `lighthouse`, `codeql`, `translations`, `quality`, `cpcb-bulletins` (दैनिक CPCB फ़ेच), `live-audit` (CPCB के विरुद्ध लाइव रीडिंग), `function-health`, `ask-eval`, `current-year-air` और अन्य
- **Dependabot** (`dependabot.yml`): GitHub Actions और npm के लिए मासिक अपडेट, जिसमें माइनर और पैच बम्प्स को ग्रुप किया गया है
### Git Hooks (`.githooks/`)
  
---
| हुक | उद्देश्य |
|------|--------|
| `pre-commit` | `.env` फ़ाइलों को ब्लॉक करता है, `console.log` डिबग स्टेटमेंट की जाँच करता है, मर्ज कॉन्फ्लिक्ट मार्कर का पता लगाता है, 500 KB से बड़ी फ़ाइलों पर चेतावनी देता है |
| `commit-msg` | कमिट मैसेज प्रीफ़िक्स लागू करता है: `Add`, `Fix`, `Update`, `Translate`, `Docs`, `Refactor`, `Test`, `CI`, `Chore`, `Merge` |
### टेम्पलेट्स
- **इश्यू टेम्पलेट्स** (बग रिपोर्ट, फ़ीचर रिक्वेस्ट)
- चेकलिस्ट के साथ **PR टेम्पलेट**
- **कमिट मैसेज टेम्पलेट** (`.gitmessage`)
---
## डोमेन और DNS
- **डोमेन:** `janvayu.in`
- **रजिस्ट्रार और DNS होस्ट:** यहाँ दस्तावेज़ीकृत नहीं है (वे अलग-अलग सेवाएँ हो सकती हैं)
- **HTTPS:** Netlify द्वारा सर्व किया जाता है
- **CNAME फ़ाइल:** रिपॉजिटरी की `CNAME` में `www.janvayu.in` है; `CNAME` फ़ाइल का Netlify पर कोई प्रभाव नहीं पड़ता, जो कस्टम डोमेन को अपने स्वयं के डैशबोर्ड से लेता है
---
## SEO
- `robots.txt` — सभी क्रॉलर को अनुमति देता है
- `sitemap.xml` — सर्च इंजन के लिए साइट मैप
- `og-image.png` — ओपन ग्राफ़ सोशल प्रीव्यू इमेज
- शीर्षक, विवरण और OG डेटा के लिए `index.html` में मेटा टैग
---
## लागत
JanVayu **शून्य लागत** पर चलता है:
| सेवा | टियर | मासिक लागत |
|---------|------|-------------|
| Netlify (होस्टिंग + फ़ंक्शन्स) | मुफ़्त | $0 |
| GitHub | मुफ़्त | $0 |
| WAQI API | मुफ़्त (WAQI द्वारा जारी टोकन) | $0 |
| Groq API | मुफ़्त टियर | $0 |
| Resend | मुफ़्त प्लान (100 ईमेल की दैनिक सीमा) | $0 |
| डोमेन (janvayu.in) | वार्षिक रिन्यूअल | कीमत यहाँ दर्ज नहीं है |
**कुल:** केवल डोमेन रिन्यूअल, एक ऐसे प्लेटफ़ॉर्म के लिए जो 160 शहरों (157 भारतीय, और विदेशों में तीन तुलनात्मक शहर) को रीयल-टाइम डेटा, AI फ़ीचर्स और ईमेल डाइजेस्ट के साथ सेवा प्रदान करता है।
