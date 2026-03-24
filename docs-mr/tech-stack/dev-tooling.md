# विकास साधने

हे पेज JanVayu तयार करण्यासाठी आणि देखभाल करण्यासाठी वापरलेली साधने आणि कार्यप्रवाह कव्हर करतो — Claude Code, प्राथमिक AI-सहाय्यित विकास साधनावर लक्ष केंद्रित करून.

---

## Claude Code (Anthropic)

JanVayu **Claude Code**, Anthropic च्या सॉफ्टवेअर इंजिनिअरिंगसाठी CLI agent च्या महत्त्वपूर्ण सहाय्याने विकसित केले गेले. Claude Code यासाठी वापरले गेले:

- सर्व 13 Netlify Functions लिहिणे
- `index.html` मधील संपूर्ण frontend तयार करणे
- Gemini prompt engineering (skill files) तयार करणे
- हे GitBook दस्तऐवज तयार करणे
- Git workflow (commits, PRs, changelogs) व्यवस्थापित करणे
- Serverless function समस्या debug करणे
- Code review आणि refactoring

संपूर्ण Claude Code सेटअप, कार्यप्रवाह आणि कॉन्फिगरेशनसाठी समर्पित [Claude Code विभाग](../claude-code/overview.md) पहा.

---

## Editor कॉन्फिगरेशन

`.editorconfig` सर्व योगदानकर्त्यांमध्ये formatting प्रमाणित करतो:

| फाइल प्रकार | Indentation |
|-----------|-------------|
| HTML, CSS, JS, JSON, YAML | 2 spaces |
| Python | 4 spaces |
| Makefile | Tabs |

सर्व फाइल्स: UTF-8, LF line endings, trailing whitespace trim (Markdown वगळून).

---

## Git कार्यप्रवाह

### Commit Message Convention

`commit-msg` hook द्वारे लागू. प्रत्येक commit यापैकी एकाने सुरू होणे आवश्यक आहे:

```
Add:       — नवीन वैशिष्ट्य किंवा फाइल
Fix:       — बग फिक्स
Update:    — विद्यमान वैशिष्ट्यात सुधारणा
Translate: — नवीन किंवा अपडेट केलेले भाषांतर
Docs:      — दस्तऐवज बदल
Refactor:  — कोड पुनर्रचना (वर्तन बदल नाही)
Test:      — चाचणी भर किंवा बदल
CI:        — CI/CD pipeline बदल
Chore:     — देखभाल कार्ये
Merge:     — Merge commits
```

### Pre-Commit तपासण्या

`pre-commit` hook स्वयंचलितपणे:
1. `.env`, credentials आणि secret फाइल्सचे staging ब्लॉक करतो
2. `console.log` debug statements बद्दल चेतावणी देतो
3. Merge conflict markers (`<<<<<<<`) शोधतो
4. 500 KB पेक्षा मोठ्या फाइल्सवर चेतावणी देतो

### शाखा धोरण

- `main` — उत्पादन (Netlify वर ऑटो-deploys)
- `claude/*` — Claude Code विकास शाखा (main वर PR)
- Feature branches Pull Request द्वारे merge होतात

---

## स्थानिक विकास

```bash
# Dependencies इन्स्टॉल करा (फक्त सर्व्हर-साइड)
npm install

# Netlify Functions emulation सह स्थानिकपणे चालवा
netlify dev
```

`netlify dev` पूर्ण Netlify वातावरण स्थानिकपणे emulate करतो:
- `localhost:8888` वर `index.html` सर्व्ह करतो
- सर्व Netlify Functions emulate करतो
- Environment variables साठी `.env` वाचतो
- Netlify Blobs simulate करतो

इतर कोणताही सेटअप आवश्यक नाही. Docker नाही, database नाही, build step नाही.

---

## Dependency व्यवस्थापन

- **Dependabot** npm आणि GitHub Actions अपडेट्ससाठी मासिक तपासणी करतो
- देखभाल करायला फक्त 3 npm packages
- CDN-loaded libraries (Chart.js, Leaflet.js) latest stable वर ऑटो-अपडेट होतात
