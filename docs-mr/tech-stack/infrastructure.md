# पायाभूत सुविधा
JanVayu पूर्णपणे Netlify च्या प्लॅटफॉर्मवर चालते आणि GitHub हा सत्याचा स्रोत (source of truth) आहे. येथे कोणतेही पारंपारिक सर्व्हर, डेटाबेस किंवा कंटेनर ऑर्केस्ट्रेशन नाहीत.
---
## Netlify
### होस्टिंग
- **CDN:** Netlify चे ग्लोबल एज नेटवर्क
- **डिप्लॉय ट्रिगर:** GitHub वर `main` वर पुश करणे
- **बिल्ड कमांड:** `node scripts/bump-version.mjs` (केवळ व्हर्जन स्टॅम्प; कोणताही बंडलर नाही)
- **पब्लिश डिरेक्टरी:** `.` (रिपॉझिटरी रूट)
- **फंक्शन्स डिरेक्टरी:** `netlify/functions/`
### कॉन्फिगरेशन (`netlify.toml`)
```toml
[build]
  command = "node scripts/bump-version.mjs"
  publish = "."
  functions = "netlify/functions"
[build.environment]
  NODE_VERSION = "24"
```
### सिक्युरिटी हेडर्स
सर्व पाथ्सवर (`/*`) लागू केले जातात, दोन अपवाद वगळता: `/embed/*` हे `X-Frame-Options = "ALLOWALL"` सेट करते जेणेकरून विजेट्स कोणत्याही ओरिजिनवरून फ्रेम केले जाऊ शकतील, आणि `/walkthrough/*` हे `SAMEORIGIN` सेट करते:
| हेडर | मूल्य | उद्देश |
|--------|-------|--------|
| `X-Frame-Options` | `DENY` | क्लिकजॅकिंग प्रतिबंधित करते |
| `X-Content-Type-Options` | `nosniff` | MIME स्निफिंग प्रतिबंधित करते |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | रेफरर डेटा मर्यादित करते |
### रिडायरेक्ट्स
- `janvayu.in/*` → `www.janvayu.in/:splat` (301; कॅनॉनिकल URL `www.janvayu.in` आहे)
- इतर सर्व राउट्स → `/index.html` (SPA फॉलबॅक), `/docs`, `/blog`, `/embed`, `/api`, `/ask`, `/status` आणि प्रत्येक प्रदूषक पृष्ठांसाठी `netlify.toml` मधील विशिष्ट नियमांनंतर
- `/robots.txt` आणि `/sitemap.xml` हे SPA फॉलबॅक बायपास करतात
---
## GitHub
### रिपॉझिटरी
- **रिपो:** [github.com/JanVayu/JanVayu](https://github.com/JanVayu/JanVayu)
- **डिफॉल्ट ब्रांच:** `main`
- **डिप्लॉय:** Netlify प्रत्येक `main` वरील पुशवर बिल्ड करते (बिल्ड कधी लाईव्ह होते यासाठी [Deployment](../technical/deployment.md) पहा)
### CI/CD
- **GitHub Actions** (`.github/workflows/`, 16 वर्कफ्लो): `ci.yml` (`index.html`, साइट फिगर्स आणि Netlify फंक्शन्स, युनिट टेस्ट्स, तसेच Lychee लिंक चेकरसाठी गार्ड्स), `link-audit`, `accessibility`, `lighthouse`, `codeql`, `translations`, `quality`, `cpcb-bulletins` (दैनंदिन CPCB फेच), `live-audit` (CPCB विरुद्ध लाईव्ह रीडिंग्स), `function-health`, `ask-eval`, `current-year-air` आणि इतर
- **Dependabot** (`dependabot.yml`): GitHub Actions आणि npm साठी मासिक अपडेट्स, ज्यामध्ये मायनर आणि पॅच बम्प्स गटबद्ध केलेले असतात
### Git Hooks (`.githooks/`)
| हुक | उद्देश |
|------|--------|
| `pre-commit` | `.env` फाइल्स ब्लॉक करते, `console.log` डीबग स्टेटमेंट्स तपासते, मर्ज कॉन्फ्लिक्ट मार्कर्स शोधते, 500 KB पेक्षा मोठ्या फाइल्सवर चेतावणी देते |
| `commit-msg` | कमिट मेसेज प्रीफिक्स सक्तीचे करते: `Add`, `Fix`, `Update`, `Translate`, `Docs`, `Refactor`, `Test`, `CI`, `Chore`, `Merge` |
### टेम्पलेट्स
- **इश्यू टेम्पलेट्स** (बग रिपोर्ट, फीचर रिक्वेस्ट)
- चेकलिस्टसह **PR टेम्पलेट**
- **कमिट मेसेज टेम्पलेट** (`.gitmessage`)
---
## डोमेन आणि DNS
- **डोमेन:** `janvayu.in`
- **रजिस्ट्रार आणि DNS होस्ट:** येथे डॉक्युमेंट केलेले नाही (ते वेगवेगळ्या सेवा असू शकतात)
- **HTTPS:** Netlify द्वारे सर्व्ह केले जाते
- **CNAME फाइल:** रेपोच्या `CNAME` मध्ये `www.janvayu.in` समाविष्ट आहे; `CNAME` फाइलचा Netlify वर कोणताही परिणाम होत नाही, जे स्वतःच्या डॅशबोर्डवरून कस्टम डोमेन घेते
---
## SEO
- `robots.txt` — सर्व क्रॉलर्सना परवानगी देते
- `sitemap.xml` — सर्च इंजिनसाठी साईट मॅप
- `og-image.png` — ओपन ग्राफ सोशल प्रीव्ह्यू इमेज
- शीर्षक, वर्णन आणि OG डेटासाठी `index.html` मधील मेटा टॅग्स
---
## खर्च
JanVayu **शून्य खर्चात** चालते:
| सेवा | टियर | मासिक खर्च |
|---------|------|-------------|
| Netlify (होस्टिंग + फंक्शन्स) | मोफत | $0 |
| GitHub | मोफत | $0 |
| WAQI API | मोफत (WAQI द्वारे जारी केलेले टोकन) | $0 |
| Groq API | मोफत टियर | $0 |
| Resend | मोफत प्लॅन (दररोज 100 ईमेल्सची मर्यादा) | $0 |
| डोमेन (janvayu.in) | वार्षिक रिन्यूअल | किंमत येथे नोंदवलेली नाही |
**एकूण:** केवळ डोमेन रिन्यूअल, रिअल-टाइम डेटा, AI फीचर्स आणि ईमेल डायजेस्ट्ससह 160 शहरांना (157 भारतीय, आणि परदेशातील तीन तुलनात्मक शहरे) सेवा देणाऱ्या प्लॅटफॉर्मसाठी.
