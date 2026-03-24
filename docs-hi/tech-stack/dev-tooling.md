# डेवलपमेंट टूलिंग

JanVayu के निर्माण और रखरखाव के लिए उपयोग किए गए उपकरण।

---

## Claude Code (Anthropic)

JanVayu का विकास **Claude Code** की महत्वपूर्ण सहायता से हुआ। Claude Code का उपयोग:
- सभी 13 Netlify Functions लिखने में
- पूरा फ्रंटएंड बनाने में
- Gemini प्रॉम्प्ट इंजीनियरिंग में
- यह GitBook प्रलेखन बनाने में
- Git वर्कफ़्लो प्रबंधन में

विस्तृत जानकारी: [Claude Code अनुभाग](../claude-code/overview.md)

---

## Git वर्कफ़्लो

### कमिट संदेश सम्मेलन
हर कमिट इनमें से एक उपसर्ग से शुरू होना चाहिए:
`Add`, `Fix`, `Update`, `Translate`, `Docs`, `Refactor`, `Test`, `CI`, `Chore`, `Merge`

### ब्रांच रणनीति
- `main` — प्रोडक्शन (Netlify पर ऑटो-डिप्लॉय)
- `claude/*` — Claude Code डेवलपमेंट ब्रांच
- फ़ीचर ब्रांच PR के माध्यम से मर्ज

---

## लोकल डेवलपमेंट

```bash
npm install
netlify dev
```

कोई Docker नहीं, कोई डेटाबेस नहीं, कोई बिल्ड स्टेप नहीं।
