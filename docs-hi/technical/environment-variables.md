# एनवायरनमेंट वेरिएबल्स

JanVayu के सर्वर-साइड फ़ंक्शन को चलाने के लिए आवश्यक एनवायरनमेंट वेरिएबल्स।

---

## आवश्यक वेरिएबल्स

| वेरिएबल | उद्देश्य | कहाँ से प्राप्त करें |
|---------|---------|-------------------|
| `GEMINI_API_KEY` | Google Gemini AI API | [aistudio.google.com](https://aistudio.google.com) (निःशुल्क) |
| `RESEND_API_KEY` | ईमेल डिलीवरी सेवा | [resend.com](https://resend.com) |
| `RESEND_FROM` | भेजने वाले का ईमेल पता | `digest@janvayu.in` |
| `NETLIFY_SITE_ID` | Netlify साइट पहचानकर्ता | Netlify डैशबोर्ड |
| `BLOB_TOKEN` | Netlify Blobs एक्सेस टोकन | Netlify डैशबोर्ड |

---

## लोकल डेवलपमेंट

`.env` फ़ाइल बनाएँ:

```bash
cp .env.example .env
```

फ़ाइल का प्रारूप:

```
GEMINI_API_KEY=your_gemini_key
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM=digest@janvayu.in
NETLIFY_SITE_ID=your_site_id
BLOB_TOKEN=your_blob_token
```

> ⚠️ **सावधानी:** `.env` फ़ाइल कभी भी Git में कमिट न करें। यह `.gitignore` में पहले से शामिल है।

---

## प्रोडक्शन (Netlify)

Netlify डैशबोर्ड में सेट करें:

1. **Site Settings** → **Environment Variables** पर जाएँ
2. प्रत्येक वेरिएबल जोड़ें
3. डिप्लॉय स्वचालित रूप से नए वेरिएबल्स उठा लेगा

---

## WAQI API टोकन

WAQI API टोकन क्लाइंट-साइड कोड में एम्बेडेड है। यह एक **फ्री-टियर पब्लिक कुंजी** है — यह जानबूझकर है, कोई सुरक्षा चूक नहीं।

---

## कौन सा वेरिएबल कहाँ उपयोग होता है

| वेरिएबल | फ़ंक्शन |
|---------|---------|
| `GEMINI_API_KEY` | `air-query.mjs`, `health-advisory.mjs`, `accountability-brief.mjs`, `anomaly-check.mjs` |
| `RESEND_API_KEY` | `daily-digest.mjs`, `subscribe.js` |
| `RESEND_FROM` | `daily-digest.mjs` |
| `NETLIFY_SITE_ID` | `blob-store.js` |
| `BLOB_TOKEN` | `blob-store.js` |
