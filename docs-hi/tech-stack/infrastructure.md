# इन्फ्रास्ट्रक्चर

JanVayu पूरी तरह से Netlify के प्लेटफॉर्म पर चलता है और GitHub इसके सोर्स ऑफ ट्रुथ (source of truth) के रूप में काम करता है। इसमें कोई पारंपरिक सर्वर, डेटाबेस या कंटेनर ऑर्केस्ट्रेशन नहीं है।

---

## Netlify

### होस्टिंग

- **CDN:** Netlify का ग्लोबल एज नेटवर्क
- **डिप्लॉय ट्रिगर:** GitHub पर `main` में पुश करना
- **बिल्ड कमांड:** `node scripts/bump-version.mjs` (सिर्फ वर्ज़न स्टैम्प; कोई बंडलर नहीं)
- **पब्लिश डायरेक्टरी:** `.` (रिपॉजिटरी रूट)
- **फंक्शन्स डायरेक्टरी:** `netlify/functions/`

### कॉन्फ़िगरेशन (`netlify.toml`)

```toml
[build]
  command = "node scripts/bump-version.mjs"
  publish = "."
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "22"
```

### सिक्योरिटी हेडर

सभी पाथ्स (`/*`) पर लागू होते हैं, बस दो अपवाद हैं: `/embed/*` में `X-Frame-Options = "ALLOWALL"` सेट किया गया है ताकि विजेट्स को किसी भी ओरिजिन से फ्रेम किया जा सके, और `/walkthrough/*` में `SAMEORIGIN` सेट किया गया है:

| हेडर | वैल्यू | उद्देश्य |
|--------|-------|--------|
| `X-Frame-Options` | `DENY` | क्लिकजैकिंग को रोकता है |
| `X-Content-Type-Options` | `nosniff` | MIME स्निफिंग को रोकता है |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | रेफ़रर डेटा को सीमित करता है |

### रीडायरेक्ट्स

- `janvayu.in/*` → `www.janvayu.in/:splat` (301; कैनोनिकल URL `www.janvayu.in` है)
- बाकी सभी रूट → `/index.html` (SPA फ़ॉलबैक), `/docs`, `/blog`, `/embed`, `/api`, `/ask`, `/status` और पर-पॉल्यूटेंट पेजों के लिए `netlify.toml` में दिए गए विशिष्ट नियमों के बाद
- `/robots.txt` और `/sitemap.xml` SPA फ़ॉलबैक को बायपास करते हैं

---

## GitHub

### रिपॉजिटरी

- **रिपो:** [github.com/JanVayu/JanVayu](https://github.com/JanVayu/JanVayu)
- **डिफ़ॉल्ट ब्रांच:** `main`
- **डिप्लॉय:** `main` में पुश करने पर ऑटो-डिप्लॉय

### CI/CD

- **GitHub Actions** (`.github/workflows/`, 14 वर्कफ़्लो): `ci.yml` (`index.html`, साइट फ़िगर्स और Netlify फंक्शन्स के लिए गार्ड, साथ ही Lychee लिंक चेकर), `link-audit`, `accessibility`, `lighthouse`, `codeql`, `translations`, `quality` और अन्य
- **Dependabot** (`dependabot.yml`): GitHub Actions और npm के लिए मासिक अपडेट, जिसमें माइनर और पैच बंप्स को एक साथ ग्रुप किया गया है

### Git Hooks (`.githooks/`)

| हुक | उद्देश्य |
|------|--------|
| `pre-commit` | `.env` फ़ाइलों को ब्लॉक करता है, `console.log` डिबग स्टेटमेंट्स की जाँच करता है, मर्ज कॉन्फ़्लिक्ट मार्कर्स का पता लगाता है, 500 KB से बड़ी फ़ाइलों पर चेतावनी देता है |
| `commit-msg` | कमिट मैसेज प्रीफ़िक्स लागू करता है: `Add`, `Fix`, `Update`, `Translate`, `Docs`, `Refactor`, `Test`, `CI`, `Chore`, `Merge` |

### टेम्पलेट्स
- **Issue templates** (बग रिपोर्ट, फ़ीचर रिक्वेस्ट)
- **PR template** चेकलिस्ट के साथ
- **Commit message template** (`.gitmessage`)

---

## डोमेन और DNS

- **Domain:** `janvayu.in`
- **Registrar and DNS host:** यहाँ डॉक्यूमेंट नहीं किया गया है (ये अलग-अलग सर्विस हो सकती हैं)
- **HTTPS:** Netlify द्वारा सर्व किया जाता है
- **CNAME file:** रेपो की `CNAME` में `www.janvayu.in` है; एक `CNAME` फ़ाइल का Netlify पर कोई असर नहीं होता, जो कस्टम डोमेन को अपने खुद के डैशबोर्ड से लेता है

---

## SEO

- `robots.txt` — सभी क्रॉलर को अनुमति देता है
- `sitemap.xml` — सर्च इंजन के लिए साइट मैप
- `og-image.png` — Open Graph सोशल प्रीव्यू इमेज
- `index.html` में टाइटल, डिस्क्रिप्शन और OG डेटा के लिए मेटा टैग्स

---

## लागत

JanVayu **ज़ीरो लागत** पर चलता है:

| Service | Tier | Monthly cost |
|---------|------|-------------|
| Netlify (hosting + functions) | Free | $0 |
| GitHub | Free | $0 |
| WAQI API | Free (token issued by WAQI) | $0 |
| Groq API | Free tier | $0 |
| Resend | Free plan (daily limit of 100 emails) | $0 |
| Domain (janvayu.in) | Annual renewal | price not recorded here |

**कुल:** सिर्फ़ डोमेन रिन्यूअल, एक ऐसे प्लेटफ़ॉर्म के लिए जो 160 शहरों (157 भारतीय, और तीन तुलनात्मक विदेशी शहर) को रियल-टाइम डेटा, AI फ़ीचर्स और ईमेल डाइजेस्ट के साथ सर्व करता है।
