# Claude Code — JanVayu कसे बनवले गेले

JanVayu **Claude Code**, Anthropic चे अधिकृत सॉफ्टवेअर इंजिनिअरिंगसाठी CLI agent वापरून विकसित केले गेले. हा विभाग संपूर्ण सेटअप, कार्यप्रवाह आणि कॉन्फिगरेशन दस्तऐवजीकरण करतो — जेणेकरून तुम्ही तुमच्या स्वतःच्या प्रकल्पांसाठी ते प्रतिकृत करू शकता.

---

## Claude Code म्हणजे काय?

Claude Code हा टर्मिनल-आधारित AI कोडिंग agent आहे. तुम्ही तो तुमच्या प्रकल्प directory मध्ये चालवता आणि तो हे करू शकतो:

- फाइल्स वाचणे आणि लिहिणे
- Shell commands चालवणे
- Codebases शोधणे
- Commits आणि pull requests तयार करणे
- जटिल multi-file refactors व्यवस्थापित करणे
- पूर्ण संदर्भासह errors debug करणे

हा एक इंटरॅक्टिव्ह session म्हणून कार्य करतो जिथे तुम्ही तुम्हाला काय हवे ते वर्णन करता आणि Claude ते कार्यान्वित करतो — तुमचा कोड वाचतो, बदल करतो, चाचण्या चालवतो आणि कार्य पूर्ण होईपर्यंत पुनरावृत्ती करतो.

---

## JanVayu साठी Claude Code कसे वापरले गेले

### प्रारंभिक बिल्ड

मुख्य platform (`index.html`, सर्व Netlify Functions, infrastructure configs) पुनरावृत्ती Claude Code sessions द्वारे तयार केले गेले:

1. **वैशिष्ट्य वर्णन करा** — उदा., "Add a health impact calculator that takes age, conditions, and outdoor hours"
2. **Claude विद्यमान कोड वाचतो** — zero-framework constraint, विद्यमान patterns समजून घेतो
3. **Claude अंमलबजावणी लिहितो** — `index.html` मध्ये इनलाइन किंवा नवीन Netlify Function म्हणून
4. **पुनरावलोकन आणि पुनरावृत्ती** — समायोजन विनंती करा, edge cases दुरुस्त करा
5. **Claude commit करतो** — प्रकल्प convention नुसार योग्य commit message prefix सह

### v25.1 AI वैशिष्ट्ये

सर्व चार Gemini-चालित वैशिष्ट्ये (Ask JanVayu, Health Advisory, Accountability Brief, Anomaly Detection) Claude Code sessions मध्ये तयार केली गेली:

- Claude ने Netlify Functions (`.mjs` files) लिहिले
- Claude ने Gemini system prompts तयार केले
- Claude ने `index.html` मध्ये frontend UI विभाग जोडले
- Claude ने CHANGELOG entries तयार केले
- Claude ने PRs आणि merges व्यवस्थापित केले

### दस्तऐवजीकरण

हे संपूर्ण Docsify दस्तऐवजीकरण Claude Code ने तयार केले — तुम्ही आत्ता वाचत असलेले पेज यासह.

---

## Session कार्यप्रवाह

JanVayu साठी सामान्य Claude Code session हा pattern फॉलो करतो:

```
1. रिपो root मध्ये Claude Code सुरू करा
   $ claude

2. कार्य वर्णन करा
   > "Add an anomaly detection banner that checks PM2.5 against seasonal baselines
     for Delhi, Mumbai, Kolkata, Chennai, and Bengaluru"

3. Claude codebase explore करतो
   - विद्यमान UI patterns समजून घेण्यासाठी index.html वाचतो
   - Code style साठी विद्यमान Netlify Functions वाचतो
   - उपलब्ध dependencies साठी package.json तपासतो

4. Claude अंमलबजावणी करतो
   - netlify/functions/anomaly-check.mjs तयार करतो
   - index.html मध्ये banner HTML/CSS/JS जोडतो
   - function कॉल करण्यासाठी client-side code अपडेट करतो

5. Claude commit करतो आणि PR तयार करतो
   - Commit message convention फॉलो करतो (Add:, Fix:, इ.)
   - सारांश आणि चाचणी योजनेसह PR तयार करतो

6. पुनरावलोकन, पुनरावृत्ती, merge
```

---

## या प्रकल्पासाठी प्रमुख सामर्थ्ये

### संदर्भ जागरूकता
Claude Code तुमचा संपूर्ण codebase वाचतो. JanVayu साठी, याचा अर्थ त्याला हे समजले:
- Zero-framework constraint (React/Vue/Angular नाही)
- `index.html` मधील इनलाइन CSS/JS pattern
- Netlify Functions रचना आणि CORS handling
- Netlify Blobs वापरून cache-first pattern
- Git hooks द्वारे लागू commit message convention

### Multi-File Coordination
"Ask JanVayu" सारखे वैशिष्ट्य जोडण्यासाठी बदल आवश्यक आहेत:
- नवीन Netlify Function (`air-query.mjs`)
- Frontend HTML (`index.html` मध्ये नवीन विभाग)
- Frontend CSS (chat interface साठी styling)
- Frontend JS (function ला fetch कॉल, UI logic)
- CHANGELOG.md (वैशिष्ट्य दस्तऐवजीकरण)

Claude Code एका session मध्ये या सर्वांना हाताळतो.

### Git Integration
Claude Code natively हाताळतो:
- `git status`, `git diff`, `git log`
- योग्य messages सह commits तयार करणे
- `gh` CLI द्वारे branches आणि PRs तयार करणे
- प्रकल्प-विशिष्ट git hooks फॉलो करणे

---

## Claude Code काय करू शकत नाही

पारदर्शकतेसाठी, यासाठी मानवी हस्तक्षेप आवश्यक होता:

| कार्य | का |
|------|-----|
| Netlify dashboard configuration | Environment variables, domain setup, build settings |
| API key तयार करणे | Google AI Studio, Resend, WAQI accounts |
| Design निर्णय | कोणती वैशिष्ट्ये तयार करायची, प्राधान्य क्रम |
| सामग्री पुनरावलोकन | डेटा स्रोत अचूकता, धोरण शुद्धता सत्यापित करणे |
| Deployment सत्यापन | Deploy नंतर लाइव्ह साइट तपासणे |
| Docsify account setup | Docsify space तयार करणे, repo जोडणे |
