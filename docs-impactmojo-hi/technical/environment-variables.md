# एनवायरनमेंट वेरिएबल

ImpactMojo Supabase क्रेडेंशियल, JWT साइनिंग, और ईमेल डिलीवरी के लिए एनवायरनमेंट वेरिएबल का उपयोग करता है।

---

## मुख्य साइट

मुख्य साइट (impactmojo.in) पूरी तरह स्टैटिक है और इसके लिए **कोई सर्वर-साइड एनवायरनमेंट वेरिएबल आवश्यक नहीं** है। Supabase क्लाइंट क्रेडेंशियल फ़्रंटएंड JavaScript में एम्बेडेड हैं (ये सार्वजनिक anon कुंजियाँ हैं, गोपनीय नहीं)।

---

## Supabase Edge Functions

| वेरिएबल | आवश्यक | विवरण |
|----------|----------|-------------|
| `SUPABASE_URL` | हाँ | Supabase प्रोजेक्ट URL |
| `SUPABASE_ANON_KEY` | हाँ | Supabase अनाम/सार्वजनिक कुंजी |
| `SUPABASE_SERVICE_ROLE_KEY` | हाँ | Supabase सेवा भूमिका कुंजी (केवल सर्वर-साइड) |
| `JWT_SECRET` | हाँ | संसाधन टोकन पर हस्ताक्षर करने के लिए HMAC-SHA256 गोपनीय कुंजी |

---

## प्रीमियम उपकरण साइटें (Netlify Edge Functions)

प्रत्येक प्रीमियम उपकरण साइट को चाहिए:

| वेरिएबल | आवश्यक | विवरण |
|----------|----------|-------------|
| `JWT_SECRET` | हाँ | `mint-resource-token` द्वारा उपयोग किए गए गोपनीय कुंजी से मेल खाना चाहिए |
| `RESOURCE_NAME` | हाँ | इस उपकरण का पहचानकर्ता (जैसे, `rq-builder`, `qual-lab`) |

---

## ईमेल सूचनाएँ (Resend)

| वेरिएबल | आवश्यक | विवरण |
|----------|----------|-------------|
| `RESEND_API_KEY` | हाँ | [Resend](https://resend.com) से API कुंजी |
| `RESEND_FROM` | हाँ | सत्यापित प्रेषक ईमेल पता |

**उदाहरण:** `hello@impactmojo.in`

---

## उदाहरण `.env` फ़ाइल

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# JWT Token Signing
JWT_SECRET=your-256-bit-secret

# Email (Resend)
RESEND_API_KEY=re_...
RESEND_FROM=hello@impactmojo.in
```

---

## सुरक्षा नोट्स

- **कभी `.env` फ़ाइलें कमिट न करें** — वे `.gitignore` में हैं
- `SUPABASE_SERVICE_ROLE_KEY` RLS को बायपास करती है — केवल सर्वर-साइड फ़ंक्शन में उपयोग करें
- `JWT_SECRET` टोकन मिंटिंग फ़ंक्शन और सभी उपकरण auth gates में समान होना चाहिए
- `SUPABASE_ANON_KEY` क्लाइंट-साइड पर उजागर करना सुरक्षित है (RLS लागू करती है)
