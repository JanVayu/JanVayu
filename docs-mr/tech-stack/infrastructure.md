# इन्फ्रास्ट्रक्चर

JanVayu पूर्णपणे Netlify च्या प्लॅटफॉर्मवर चालते आणि GitHub हे 'source of truth' (मुख्य स्रोत) आहे. यात कोणतेही पारंपारिक सर्व्हर्स, डेटाबेसेस किंवा कंटेनर ऑर्केस्ट्रेशन नाही.

---

## Netlify

### होस्टिंग

- **CDN:** Netlify चे ग्लोबल एज नेटवर्क
- **डिप्लॉय ट्रिगर:** GitHub वर `main` वर पुश करणे
- **बिल्ड कमांड:** `node scripts/bump-version.mjs` (फक्त व्हर्जन स्टॅम्प; कोणताही बंडलर नाही)
- **पब्लिश डिरेक्टरी:** `.` (रिपॉझिटरी रूट)
- **फंक्शन्स डिरेक्टरी:** `netlify/functions/`

### कॉन्फिगरेशन (`netlify.toml`)

```toml
[build]
  command = "node scripts/bump-version.mjs"
  publish = "."
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "22"
```

### सिक्युरिटी हेडर्स

दोन अपवाद वगळता सर्व पाथ्सवर (`/*`) लागू केले जातात: `/embed/*` हे `X-Frame-Options = "ALLOWALL"` सेट करते जेणेकरून विजेट्स कोणत्याही ओरिजिनमधून फ्रेम केले जाऊ शकतील, आणि `/walkthrough/*` हे `SAMEORIGIN` सेट करते:

| हेडर | व्हॅल्यू | उद्देश |
|--------|-------|--------|
| `X-Frame-Options` | `DENY` | क्लिकजॅकिंग टाळते |
| `X-Content-Type-Options` | `nosniff` | MIME स्निफिंग टाळते |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | रेफरर डेटा मर्यादित करते |

### रीडायरेक्ट्स

- `janvayu.in/*` → `www.janvayu.in/:splat` (301; कॅनॉनिकल URL `www.janvayu.in` आहे)
- इतर सर्व रूट्स → `/index.html` (SPA फॉलबॅक), `/docs`, `/blog`, `/embed`, `/api`, `/ask`, `/status` आणि प्रत्येक प्रदूषक पृष्ठांसाठी `netlify.toml` मधील विशिष्ट नियमांनंतर
- `/robots.txt` आणि `/sitemap.xml` हे SPA फॉलबॅक बायपास करतात

---

## GitHub

### रिपॉझिटरी

- **Repo:** [github.com/JanVayu/JanVayu](https://github.com/JanVayu/JanVayu)
- **डिफॉल्ट ब्रांच:** `main`
- **डिप्लॉय:** `main` वर पुश केल्यावर ऑटो-डिप्लॉय

### CI/CD

- **GitHub Actions** (`.github/workflows/`, 14 वर्कफ्लोज): `ci.yml` (`index.html`, साइट आकडेवारी आणि Netlify फंक्शन्ससाठी गार्ड्स, तसेच Lychee लिंक चेकर), `link-audit`, `accessibility`, `lighthouse`, `codeql`, `translations`, `quality` आणि इतर
- **Dependabot** (`dependabot.yml`): GitHub Actions आणि npm साठी मासिक अपडेट्स, ज्यामध्ये मायनर आणि पॅच बम्प्स एकत्र केले जातात

### Git Hooks (`.githooks/`)

| हूक | उद्देश |
|------|--------|
| `pre-commit` | `.env` फाइल्स ब्लॉक करते, `console.log` डीबग स्टेटमेंट्स तपासते, मर्ज कॉन्फ्लिक्ट मार्कर्स शोधते, 500 KB पेक्षा मोठ्या फाइल्सवर चेतावणी देते |
| `commit-msg` | कमिट मेसेज प्रीफिक्स लागू करते: `Add`, `Fix`, `Update`, `Translate`, `Docs`, `Refactor`, `Test`, `CI`, `Chore`, `Merge` |

### टेम्पलेट्स
- **Issue templates** (बग रिपोर्ट, फीचर रिक्वेस्ट)
- **PR template** चेकलिस्टसह
- **Commit message template** (`.gitmessage`)

---

## डोमेन आणि DNS

- **डोमेन:** `janvayu.in`
- **रजिस्ट्रार आणि DNS होस्ट:** येथे डॉक्युमेंट केलेले नाही (ते वेगवेगळ्या सेवा असू शकतात)
- **HTTPS:** Netlify द्वारे सर्व्ह केले जाते
- **CNAME फाईल:** रिपोच्या `CNAME` मध्ये `www.janvayu.in` आहे; `CNAME` फाईलचा Netlify वर कोणताही परिणाम होत नाही, कारण ते स्वतःच्या डॅशबोर्डवरून कस्टम डोमेन घेते

---

## SEO

- `robots.txt` — सर्व क्रॉलर्सना परवानगी देते
- `sitemap.xml` — सर्च इंजिन्ससाठी साइट मॅप
- `og-image.png` — ओपन ग्राफ सोशल प्रीव्ह्यू इमेज
- टायटल, डिस्क्रिप्शन आणि OG डेटासाठी `index.html` मधील मेटा टॅग्स

---

## खर्च

JanVayu **शून्य खर्चात** चालते:

| सेवा | टियर | मासिक खर्च |
|---------|------|-------------|
| Netlify (होस्टिंग + फंक्शन्स) | मोफत | $0 |
| GitHub | मोफत | $0 |
| WAQI API | मोफत (WAQI द्वारे इश्यू केलेले टोकन) | $0 |
| Groq API | मोफत टियर | $0 |
| Resend | मोफत प्लॅन (दररोज 100 ईमेल्सची मर्यादा) | $0 |
| डोमेन (janvayu.in) | वार्षिक रिन्युअल | किंमत येथे नोंदवलेली नाही |

**एकूण:** केवळ डोमेन रिन्युअल, रिअल-टाइम डेटा, AI फीचर्स आणि ईमेल डायजेस्टसह 160 शहरांना (157 भारतीय, अधिक तीन परदेशी तुलनात्मक शहरे) सेवा देणाऱ्या प्लॅटफॉर्मसाठी.
