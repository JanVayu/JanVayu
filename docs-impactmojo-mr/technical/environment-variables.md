# पर्यावरण चल

ImpactMojo Supabase क्रेडेन्शियल्स, JWT स्वाक्षरी आणि ईमेल वितरणासाठी पर्यावरण चल वापरते.

---

## मुख्य साइट

मुख्य साइट (impactmojo.in) पूर्णपणे स्टॅटिक आहे आणि **कोणत्याही सर्व्हर-साइड पर्यावरण चलांची** आवश्यकता नाही. Supabase क्लायंट क्रेडेन्शियल्स फ्रंटएंड JavaScript मध्ये एम्बेड केले आहेत (हे सार्वजनिक anon कळ आहेत, गुप्त नाहीत).

---

## Supabase Edge Functions

| चल | आवश्यक | वर्णन |
|----------|----------|-------------|
| `SUPABASE_URL` | होय | Supabase प्रकल्प URL |
| `SUPABASE_ANON_KEY` | होय | Supabase अनामिक/सार्वजनिक कळ |
| `SUPABASE_SERVICE_ROLE_KEY` | होय | Supabase सेवा भूमिका कळ (केवळ सर्व्हर-साइड) |
| `JWT_SECRET` | होय | संसाधन टोकन स्वाक्षरीसाठी HMAC-SHA256 गुप्त |

---

## प्रीमियम साधन साइट्स (Netlify Edge Functions)

प्रत्येक प्रीमियम साधन साइटला आवश्यक आहे:

| चल | आवश्यक | वर्णन |
|----------|----------|-------------|
| `JWT_SECRET` | होय | `mint-resource-token` ने वापरलेल्या गुप्ताशी जुळणे आवश्यक |
| `RESOURCE_NAME` | होय | या साधनासाठी ओळखकर्ता (उदा., `rq-builder`, `qual-lab`) |

---

## ईमेल सूचना (Resend)

| चल | आवश्यक | वर्णन |
|----------|----------|-------------|
| `RESEND_API_KEY` | होय | [Resend](https://resend.com) कडून API कळ |
| `RESEND_FROM` | होय | सत्यापित प्रेषक ईमेल पत्ता |

**उदाहरण:** `hello@impactmojo.in`

---

## उदाहरण `.env` फाइल

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

## सुरक्षा टिपा

- **`.env` फाइल्स कधीही कमिट करू नका** — त्या `.gitignore` मध्ये आहेत
- `SUPABASE_SERVICE_ROLE_KEY` RLS बायपास करते — फक्त सर्व्हर-साइड फंक्शन्समध्ये वापरा
- `JWT_SECRET` टोकन मिंटिंग फंक्शन आणि सर्व साधन auth gates मध्ये एकसारखे असणे आवश्यक
- `SUPABASE_ANON_KEY` क्लायंट-साइड उघड करणे सुरक्षित आहे (RLS लागू करते)
