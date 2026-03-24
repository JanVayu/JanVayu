# Claude Code सेटअप एवं कॉन्फ़िगरेशन

JanVayu के विकास के लिए उपयोग किया गया Claude Code कॉन्फ़िगरेशन।

---

## CLAUDE.md — प्रोजेक्ट निर्देश

JanVayu वर्तमान में `CLAUDE.md` फ़ाइल का उपयोग नहीं करता। प्रोजेक्ट सम्मेलन Git hooks, `.editorconfig`, और `.gitmessage` द्वारा लागू होते हैं।

### फ़ोर्क के लिए अनुशंसित CLAUDE.md

```markdown
# CLAUDE.md — JanVayu प्रोजेक्ट निर्देश

## आर्किटेक्चर
- एकल HTML फ़ाइल (index.html) — सभी CSS और JS इनलाइन
- कोई फ्रेमवर्क नहीं, कोई बिल्ड स्टेप नहीं

## कोड शैली
- Vanilla JavaScript (ES2020 अधिकतम)
- 2-स्पेस इंडेंटेशन

## कमिट संदेश
Add, Fix, Update, Translate, Docs, Refactor, Test, CI, Chore, Merge से शुरू

## न करें
- फ्रेमवर्क जोड़ें (React, Vue, Angular)
- बिल्ड स्टेप जोड़ें
- क्लाइंट में API कुंजियाँ उजागर करें
```

---

## स्किल फ़ाइलें

स्किल फ़ाइलें संरचित सिस्टम प्रॉम्प्ट हैं। JanVayu चारों Gemini सुविधाओं के लिए इनका उपयोग करता है।

विस्तृत जानकारी: [स्किल्स अनुभाग](../skills/README.md)

---

## MCP सर्वर एकीकरण

विकास के दौरान उपलब्ध MCP एकीकरण:
- **Notion** — प्रोजेक्ट प्लानिंग
- **Gmail** — संचार संदर्भ
- **Figma** — डिज़ाइन-टू-कोड
- **Google Calendar** — शेड्यूलिंग
- **Excalidraw** — आर्किटेक्चर आरेख

---

## अनुमतियाँ

अनुशंसित अनुमति सेटिंग्स:
- ✅ Read, Write, Edit, Glob, Grep
- ✅ `npm install`, `netlify dev`, `git *`, `gh pr *`
- ❌ `rm -rf *`, `git push --force *`, `git reset --hard *`
