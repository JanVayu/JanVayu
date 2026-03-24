# Environment Variables

सर्व secrets आणि कॉन्फिगरेशन environment variables द्वारे व्यवस्थापित केले जातात. ते **कधीही रिपॉझिटरीमध्ये commit केले जात नाहीत**.

- **स्थानिक विकासासाठी**: प्रकल्प रूटमध्ये `.env` फाइल तयार करा (ती gitignored आहे)
- **उत्पादनासाठी**: [Netlify dashboard](https://app.netlify.com) मध्ये Site Settings → Environment Variables अंतर्गत सेट करा

---

## आवश्यक Variables

### `RESEND_API_KEY`
**वापरतो:** `daily-digest.mjs`

दैनिक ईमेल डायजेस्ट सदस्यांना पाठवण्यासाठी [Resend](https://resend.com) वरून तुमची API key.

**कसे मिळवायचे:**
1. [resend.com](https://resend.com) वर अकाउंट तयार करा
2. API Keys → Create API Key वर जा
3. Key कॉपी करा (ती फक्त एकदाच दाखवली जाते)

---

### `RESEND_FROM`
**वापरतो:** `daily-digest.mjs`

डायजेस्ट ईमेलसाठी सत्यापित पाठवणाऱ्याचा ईमेल पत्ता. Resend मध्ये तुम्ही सत्यापित केलेला डोमेन असणे आवश्यक आहे.

**उदाहरण:** `digest@janvayu.in`

---

### `BLOB_TOKEN`
**वापरतो:** Netlify Blobs वाचणारे/लिहिणारे सर्व functions

Blobs read/write परवानग्यांसह Netlify personal access token.

**कसे मिळवायचे:**
1. [Netlify User Settings → Personal Access Tokens](https://app.netlify.com/user/applications) वर जा
2. नवीन token तयार करा
3. कॉपी करा (फक्त एकदाच दाखवला जातो)

---

### `NETLIFY_SITE_ID`
**वापरतो:** Netlify Blobs वाचणारे/लिहिणारे सर्व functions

तुमच्या Netlify साइटचा अनन्य ID.

**कसे मिळवायचे:**
1. [app.netlify.com](https://app.netlify.com) वर जा
2. JanVayu साइट उघडा
3. Site Settings → General → Site ID वर जा
4. UUID कॉपी करा (फॉर्मॅट: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

---

### `GEMINI_API_KEY`
**वापरतो:** `air-query.mjs`, `health-advisory.mjs`, `accountability-brief.mjs`, `anomaly-check.mjs`

AI-चालित वैशिष्ट्यांसाठी Google Gemini API key.

**कसे मिळवायचे:**
1. [aistudio.google.com](https://aistudio.google.com) वर जा
2. "Get API Key" वर क्लिक करा
3. नवीन किंवा विद्यमान प्रकल्पात key तयार करा

JanVayu मधील AI वैशिष्ट्यांसाठी फ्री टियर पुरेसा आहे.

---

## पब्लिक Key (Secret नाही)

### WAQI API Token
WAQI API token (`1f64cc8563a165dc5a6ce48f7eeb9ba0221b63f3`) हा **फ्री-टियर पब्लिक key** आहे जो थेट `index.html` मध्ये एम्बेड केलेला आहे. हा secret नाही — WAQI हे tokens सार्वजनिकपणे प्रदान करतो. WAQI द्वारे IP स्तरावर रेट-लिमिटेड आहे.

तुम्हाला तुमचा स्वतःचा WAQI token वापरायचा असल्यास (जास्त रेट लिमिट्ससाठी), [aqicn.org/data-platform/token](https://aqicn.org/data-platform/token/) वर नोंदणी करा आणि `index.html` मधील token बदला.

---

## स्थानिक `.env` उदाहरण

```bash
# Email digest (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RESEND_FROM=digest@janvayu.in

# Netlify Blobs
BLOB_TOKEN=nfp_xxxxxxxxxxxxxxxxxxxx
NETLIFY_SITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# AI features (Google Gemini)
GEMINI_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
