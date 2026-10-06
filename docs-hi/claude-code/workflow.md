# Claude Code डेवलपमेंट वर्कफ़्लो

यह पेज Claude Code के साथ JanVayu बनाने के रोज़मर्रा के वर्कफ़्लो को दस्तावेज़ करता है — फ़ीचर डेवलपमेंट से लेकर बग फ़िक्स और दस्तावेज़ीकरण तक।

---

## फ़ीचर डेवलपमेंट वर्कफ़्लो

### चरण 1: फ़ीचर को परिभाषित करें

एक स्पष्ट, पाबंदियों को ध्यान में रखते हुए विवरण के साथ शुरुआत करें:

```
> एक वार्ड-लेवल अकाउंटेबिलिटी ब्रीफ़ फ़ीचर जोड़ें।
> यह एक Netlify Function (ES मॉड्यूल, .mjs) होना चाहिए जो:
> - इनपुट के रूप में शहर का नाम लेता हो
> - WAQI से लाइव AQI प्राप्त करता हो
> - एक स्ट्रक्चर्ड प्रॉम्प्ट के साथ Groq-होस्टेड मॉडल को डेटा भेजता हो
> - रिटर्न करता हो: वर्तमान स्थिति, NCAP लक्ष्य, 5 अकाउंटेबिलिटी प्रश्न
> - यदि Groq रेट-लिमिटेड हो तो इसमें फ़ॉलबैक हो
> मौजूदा पैटर्न का पालन करते हुए index.html में UI सेक्शन भी जोड़ें।
```

### चरण 2: Claude एक्सप्लोर करता है

Claude Code पढ़ता है:
- `index.html` — मौजूदा UI पैटर्न, CSS वेरिएबल, JS नियम
- मौजूदा Netlify Functions — कोड स्टाइल, CORS हैंडलिंग, एरर पैटर्न
- `package.json` — उपलब्ध डिपेंडेंसी
- `netlify.toml` — डिप्लॉयमेंट कॉन्फ़िगरेशन

### चरण 3: Claude लागू करता है

Claude फ़ाइलें बनाता/बदलता है:
1. `netlify/functions/accountability-brief.mjs` — सर्वरलेस फ़ंक्शन
2. `index.html` — नया HTML सेक्शन, CSS स्टाइल, JS फ़ेच लॉजिक

### चरण 4: रिव्यू और इटरेट करें

```
> ब्रीफ़ बहुत लंबा है। मॉडल आउटपुट को 1,024 टोकन (max_tokens) तक सीमित करें।
> ब्रीफ़ जनरेट होते समय लोडिंग स्पिनर भी जोड़ें।
```

Claude बिना किसी असंबंधित कोड को दोबारा लिखे, लक्षित बदलाव करता है।

### चरण 5: कमिट और PR

```
> इसे "Add ward-level accountability brief feature" मैसेज के साथ कमिट करें
> और एक PR बनाएँ
```

Claude `git add`, `git commit`, `git push`, और `gh pr create` चलाता है।

---

## बग फ़िक्स वर्कफ़्लो

```
> जब WAQI डाउन होता है तो anomaly-check फ़ंक्शन 500 रिटर्न करता है।
> इसे कैश किए गए डेटा के आधार पर एनोमली फ़्लैग के साथ 200 रिटर्न करना चाहिए।
```

Claude Code:
1. `anomaly-check.mjs` पढ़ता है
2. अनहैंडल्ड एरर पाथ की पहचान करता है
3. कैश किए गए डेटा पर फ़ॉलबैक के साथ try/catch जोड़ता है
4. फ़िक्स को कमिट करता है

**मुख्य सिद्धांत:** Claude को *न्यूनतम बदलाव* करने का निर्देश दिया जाता है — पूरे फ़ंक्शन को रिफ़ैक्टर नहीं करना है।

---

## दस्तावेज़ीकरण वर्कफ़्लो

```
> JanVayu के लिए Docsify दस्तावेज़ीकरण बनाएँ जिसमें टेक स्टैक,
> Claude Code सेटअप और AI फ़ीचर शामिल हों। एक SUMMARY.md शामिल करें।
```

Claude Code:
1. सभी मौजूदा डॉक्स, कॉन्फ़िग और सोर्स कोड पढ़ता है
2. डायरेक्टरी स्ट्रक्चर बनाता है
3. सटीक, कोड-रेफ़रेंस्ड सामग्री के साथ प्रत्येक पेज लिखता है
4. प्रत्येक भाषा के लिए `SUMMARY.md` और Docsify `_sidebar.md` अपडेट करता है

---
## Changelog और Release Workflow

```
> नए AI फीचर्स के लिए v25.1 changelog एंट्री जोड़ें।
> मौजूदा CHANGELOG.md फॉर्मेट का पालन करें।
```

Claude:
1. फॉर्मेट के लिए मौजूदा CHANGELOG.md पढ़ता है
2. सभी नए फीचर्स (functions, UI sections) पढ़ता है
3. एक विस्तृत changelog एंट्री लिखता है
4. अपडेट के साथ एक PR बनाता है

---

## Multi-PR Workflow

बड़े फीचर्स के लिए, Claude Code कई PRs को मैनेज करता है:

```
PR #1: AI इंटीग्रेशन जोड़ें (केवल functions; v25.1 Gemini 2.5 Flash पर लॉन्च हुआ और बाद में Groq पर मूव हुआ)
PR #2: AI फीचर्स के लिए frontend UI जोड़ें
PR #3: CHANGELOG और version history अपडेट करें
PR #4: About section version line अपडेट करें
```

हर PR स्वतंत्र रूप से self-contained, reviewable और mergeable है।

---

## Prompt Patterns That Work Well

### New Features के लिए

```
[feature] जोड़ें। Requirements:
- [Constraint 1]
- [Constraint 2]
[reference file] में मौजूदा patterns का पालन करें।
किसी भी मौजूदा functionality को न बदलें।
```

### Bug Fixes के लिए

```
[Function] [condition] होने पर [error] रिटर्न करता है।
Expected: [correct behaviour]।
इसे ठीक करने के लिए न्यूनतम बदलाव करें।
आसपास के code को refactor न करें।
```

### Documentation के लिए

```
[topic] के लिए documentation बनाएं।
Include: [specific sections]।
Repo से वास्तविक code और configuration का reference दें।
[existing doc file] जैसी ही tone का उपयोग करें।
```

### Code Review के लिए

```
[file] को इनके लिए review करें:
- Security issues (विशेष रूप से API key एक्सपोज़र)
- CORS handling
- Error recovery
- Accessibility
Line references के साथ विशिष्ट issues की सूची बनाएं।
```

---

## इस Workflow को प्रभावी क्या बनाता है

1. **Full codebase context** — Claude कोड लिखने से पहले आपका कोड पढ़ता है
2. **Constraint-first prompts** — Claude को यह बताना कि क्या *नहीं* करना है, framework bloat को रोकता है
3. **Iterative refinement** — एक ही session में review, adjust, commit
4. **Git-native** — branches, commits, PRs उसी टूल के अंदर होते हैं
5. **Multi-file coordination** — एक ही prompt functions, HTML, CSS, JS और docs को टच कर सकता है
6. **Reproducible** — हर session का काम स्पष्ट messages के साथ git में commit किया जाता है
