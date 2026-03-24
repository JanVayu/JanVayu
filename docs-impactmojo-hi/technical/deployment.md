# डिप्लॉयमेंट गाइड

ImpactMojo बैकएंड के रूप में Supabase के साथ Netlify पर एक स्टैटिक साइट के रूप में डिप्लॉय होता है। किसी बिल्ड चरण की आवश्यकता नहीं है।

---

## मुख्य साइट डिप्लॉयमेंट

### स्वचालित (Git के माध्यम से)

1. GitHub पर `main` ब्रांच में पुश करें
2. Netlify पुश का पता लगाता है और स्वचालित रूप से डिप्लॉय करता है
3. कोई बिल्ड कमांड आवश्यक नहीं — साइट स्टैटिक HTML/CSS/JS है
4. साइट 30-90 सेकंड के भीतर [www.impactmojo.in](https://www.impactmojo.in) पर लाइव हो जाती है

### मैनुअल

```bash
# Netlify CLI इंस्टॉल करें
npm install -g netlify-cli

# प्रोजेक्ट रूट से डिप्लॉय करें
netlify deploy --prod
```

---

## डोमेन कॉन्फ़िगरेशन

कस्टम डोमेन `impactmojo.in` Netlify DNS में कॉन्फ़िगर किया गया है।

| रिकॉर्ड | प्रकार | मान |
|--------|------|-------|
| `@` | A | Netlify लोड बैलेंसर |
| `www` | CNAME | Netlify साइट URL |
| `docs` | CNAME | `hosting.gitbook.io` |

`netlify.toml` में रीडायरेक्ट नियम:
```toml
[[redirects]]
  from = "https://impactmojo.in/*"
  to = "https://www.impactmojo.in/:splat"
  status = 301
  force = true
```

---

## प्रीमियम उपकरण साइटें

प्रत्येक प्रीमियम उपकरण एक अलग Netlify साइट है:

| उपकरण | Netlify साइट | Auth Gate |
|------|-------------|-----------|
| RQ Builder Pro | अलग डिप्लॉय | `auth-gate.ts` Edge Function |
| Qual Insights Lab | अलग डिप्लॉय | `auth-gate.ts` Edge Function |
| Statistical Code Converter | अलग डिप्लॉय | `auth-gate.ts` Edge Function |
| VaniScribe | अलग डिप्लॉय | `auth-gate.ts` Edge Function |
| DevData Practice | अलग डिप्लॉय | `auth-gate.ts` Edge Function |
| Viz Cookbook | अलग डिप्लॉय | `auth-gate.ts` Edge Function |
| DevEcon Toolkit | अलग डिप्लॉय | `auth-gate.ts` Edge Function |

प्रत्येक उपकरण साइट को टोकन सत्यापन के लिए `JWT_SECRET` एनवायरनमेंट वेरिएबल की आवश्यकता होती है।

---

## Supabase कॉन्फ़िगरेशन

### आवश्यक तालिकाएँ

सुनिश्चित करें कि Supabase माइग्रेशन के माध्यम से सभी 21+ तालिकाएँ बनाई गई हैं। प्रमुख तालिकाएँ:
- `profiles` — उपयोगकर्ता खाते और सदस्यता स्तर
- `organizations` — टीम खाते
- `course_progress`, `bookmarks`, `certificates`, `payments`

### Row-Level Security

सभी तालिकाओं में RLS सक्षम होना चाहिए। उपयोगकर्ता केवल अपनी पंक्तियाँ पढ़/लिख सकते हैं।

### Edge Functions

`mint-resource-token` फ़ंक्शन Supabase पर डिप्लॉय किया जाना चाहिए:
```
supabase functions deploy mint-resource-token
```

---

## एनवायरनमेंट वेरिएबल

पूरी सूची के लिए [एनवायरनमेंट वेरिएबल](environment-variables.md) देखें।

---

## लागत संरचना

| सेवा | योजना | अनुमानित लागत |
|---------|------|---------------|
| Netlify (मुख्य साइट) | निःशुल्क स्तर | $0/माह |
| Netlify (प्रत्येक उपकरण साइट) | निःशुल्क स्तर | $0/माह |
| Supabase | निःशुल्क स्तर (500MB तक, 50K MAU) | $0/माह |
| डोमेन (impactmojo.in) | वार्षिक नवीनीकरण | ~₹800/वर्ष |
| Resend (ईमेल सूचनाएँ) | निःशुल्क स्तर (100 ईमेल/दिन) | $0/माह |

---

## इंटरैक्टिव डेमो

> **जल्द आ रहा है** — एक इंटरैक्टिव डिप्लॉयमेंट वॉकथ्रू यहाँ एम्बेड किया जाएगा, जो पुश-टू-डिप्लॉय प्रवाह और एनवायरनमेंट वेरिएबल कॉन्फ़िगरेशन दिखाएगा।

<!-- Replace this section with an Arcade embed once recorded -->
