# लोकल डेवलपमेंट

JanVayu को अपने कंप्यूटर पर चलाने के लिए यह मार्गदर्शिका अनुसरण करें।

---

## आवश्यकताएँ

| सॉफ्टवेयर | न्यूनतम संस्करण |
|----------|---------------|
| Node.js | 18+ |
| npm | 9+ |
| Git | 2.30+ |
| Netlify CLI | नवीनतम |

---

## सेटअप

### 1. रिपॉजिटरी क्लोन करें

```bash
git clone https://github.com/Varnasr/JanVayu.git
cd JanVayu
```

### 2. डिपेंडेंसी इंस्टॉल करें

```bash
npm install
```

यह केवल 3 पैकेज इंस्टॉल करेगा:
- `@google/generative-ai` — Gemini AI
- `@netlify/blobs` — कैशिंग
- `resend` — ईमेल डिलीवरी

### 3. एनवायरनमेंट वेरिएबल्स सेटअप करें

```bash
cp .env.example .env
```

`.env` फ़ाइल में अपनी कुंजियाँ भरें:

```
GEMINI_API_KEY=your_key_here
RESEND_API_KEY=your_key_here
NETLIFY_SITE_ID=your_site_id
BLOB_TOKEN=your_token
RESEND_FROM=digest@janvayu.in
```

### 4. Netlify CLI इंस्टॉल करें

```bash
npm install -g netlify-cli
```

### 5. लोकल सर्वर चलाएँ

```bash
netlify dev
```

यह कमांड:
- `localhost:8888` पर `index.html` सर्व करेगा
- सभी Netlify Functions को इम्यूलेट करेगा
- `.env` से एनवायरनमेंट वेरिएबल्स पढ़ेगा
- Netlify Blobs को सिम्युलेट करेगा

---

## Git Hooks सेटअप

```bash
git config core.hooksPath .githooks
```

यह प्री-कमिट और कमिट-मैसेज हुक्स सक्रिय करेगा।

---

## बिना API कुंजियों के चलाना

- AQI डैशबोर्ड — ✅ काम करेगा (WAQI पब्लिक टोकन)
- सोशल फ़ीड्स — ✅ काम करेगा (कैश से)
- AI सुविधाएँ — ❌ `GEMINI_API_KEY` आवश्यक
- ईमेल डाइजेस्ट — ❌ `RESEND_API_KEY` आवश्यक
- डेमो मोड — ✅ `localhost:8888?demo=true`

---

## सामान्य समस्याएँ

| समस्या | समाधान |
|--------|--------|
| `netlify dev` काम नहीं कर रहा | `npm install -g netlify-cli` दोबारा चलाएँ |
| AI सुविधाएँ काम नहीं कर रही | `.env` में `GEMINI_API_KEY` जाँचें |
| फ़ीड्स खाली दिख रही हैं | `netlify dev` को पुनः शुरू करें |
| पोर्ट 8888 व्यस्त है | `netlify dev --port 9999` |
