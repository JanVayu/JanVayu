# टेक स्टॅक विहंगावलोकन

JanVayu जाणूनबुजून किमान स्टॅकवर बनवलेले आहे — शून्य frontend frameworks, तीन npm dependencies, आणि serverless backend. हे पेज प्रत्येक वापरलेले तंत्रज्ञान आणि ते का निवडले गेले ते नकाशा करतो.

---

## एका दृष्टीक्षेपात स्टॅक

| स्तर | तंत्रज्ञान | उद्देश |
|-------|-----------|---------|
| **Frontend** | Vanilla HTML/CSS/JS | सिंगल-पेज अॅप्लिकेशन (बिल्ड स्टेप नाही) |
| **चार्ट्स** | Chart.js (CDN) | AQI ट्रेंड व्हिज्युअलायझेशन |
| **नकाशे** | Leaflet.js + OpenStreetMap (CDN) | इंटरॅक्टिव्ह स्टेशन नकाशे |
| **Backend** | Netlify Functions (Node.js 18) | Serverless API endpoints |
| **कॅश** | Netlify Blobs | Persistent JSON कॅश (strong consistency) |
| **ईमेल** | Resend API | दैनिक AQI डायजेस्ट डिलिव्हरी |
| **AI** | Google Gemini 2.5 Flash | NL प्रश्न, आरोग्य सल्ला, विसंगती शोध |
| **होस्टिंग** | Netlify CDN | GitHub `main` वरून ऑटो-डिप्लॉय |
| **CI** | GitHub Actions | लिंक तपासणी, Dependabot |
| **Domain** | Netlify DNS | janvayu.in कस्टम domain |
| **विकास** | Claude Code (Anthropic) | AI-सहाय्यित विकास कार्यप्रवाह |

---

## हा स्टॅक का?

### झिरो-फ्रेमवर्क Frontend

JanVayu च्या प्रेक्षकांमध्ये भारतभर 2G कनेक्शन आणि कमी-किमतीच्या Android उपकरणांवर असलेले लोक आहेत. React किंवा Vue सारखा फ्रेमवर्क एकही वैशिष्ट्य लोड होण्यापूर्वी 40-100 KB JavaScript जोडेल. त्याऐवजी:

- संपूर्ण अॅप एक `index.html` फाइल आहे (इनलाइन CSS + JS)
- कोणतेही transpilation, bundling, tree-shaking आवश्यक नाही
- Deploy artefact = रिपो स्वतःच
- मूलभूत HTML/JS कौशल्ये असलेला कोणताही योगदानकर्ता योगदान देऊ शकतो

### फक्त 3 npm Dependencies

```json
{
  "@google/generative-ai": "^0.24.1",
  "@netlify/blobs": "^8.1.0",
  "resend": "^6.9.3"
}
```

तिन्ही फक्त सर्व्हर-साइड आहेत (Netlify Functions द्वारे वापरले जातात). क्लायंटकडे शून्य npm dependencies आहेत — Chart.js आणि Leaflet.js CDN वरून लोड होतात.

### Serverless ओव्हर Server

Netlify Functions persistent server ची गरज दूर करतात. फायदे:
- शून्य ops भार (सर्व्हर patching नाही, scaling नाही)
- फ्री टियर JanVayu चा ट्रॅफिक कव्हर करतो
- स्वयंचलित HTTPS, CDN आणि edge deployment
- Functions < 500ms मध्ये cold-start होतात

---

## तपशीलवार विभाजन

| विभाग | पेज |
|---------|------|
| Frontend (HTML/CSS/JS, Chart.js, Leaflet) | [Frontend स्टॅक](frontend.md) |
| Backend (Netlify Functions, Blobs, Resend) | [Backend स्टॅक](backend.md) |
| AI Layer (Gemini 2.5 Flash) | [AI स्टॅक](ai-layer.md) |
| इन्फ्रास्ट्रक्चर (Netlify, GitHub, DNS) | [इन्फ्रास्ट्रक्चर](infrastructure.md) |
| विकास साधने (Claude Code, Git hooks) | [विकास साधने](dev-tooling.md) |
