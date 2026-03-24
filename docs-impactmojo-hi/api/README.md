# API संदर्भ

ImpactMojo प्रमाणीकरण, टोकन मिंटिंग, और प्रीमियम संसाधन पहुँच के लिए एंडपॉइंट का एक छोटा सेट प्रदान करता है।

**बेस URL:** `https://www.impactmojo.in/.netlify/functions` (Netlify Functions)
**Supabase URL:** `https://<project>.supabase.co/functions/v1` (Edge Functions)

---

## एंडपॉइंट

### प्रमाणीकरण

ImpactMojo Supabase Auth का उपयोग करता है। साइनअप, लॉगिन, और सत्र प्रबंधन के लिए [Supabase Auth API प्रलेखन](https://supabase.com/docs/reference/javascript/auth-signup) देखें।

### mint-resource-token

**`POST`** `/functions/v1/mint-resource-token`

प्रीमियम उपकरणों तक पहुँच के लिए अल्पकालिक JWT उत्पन्न करता है।

**हेडर:**
```
Authorization: Bearer <supabase_access_token>
Content-Type: application/json
```

**अनुरोध बॉडी:**
```json
{
  "resource_id": "rq-builder"
}
```

**सफल प्रतिक्रिया (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "url": "https://rq-builder.impactmojo.in/?token=eyJhbGciOiJIUzI1NiIs..."
}
```

**त्रुटि प्रतिक्रिया (403):**
```json
{
  "error": "Your subscription tier does not include this resource"
}
```

**टोकन दावे:**
| दावा | विवरण |
|-------|-------------|
| `sub` | उपयोगकर्ता ID (UUID) |
| `resource` | संसाधन नाम (जैसे, `rq-builder`) |
| `tier` | उपयोगकर्ता का सदस्यता स्तर |
| `exp` | समाप्ति (जारी करने से 5 मिनट) |

---

### auth-gate (Edge Function)

**प्रत्येक प्रीमियम उपकरण साइट पर चलता है।** सीधे कॉल नहीं किया जाता — उपकरण के सभी अनुरोधों को रोकता है।

**सत्यापन प्रवाह:**
1. मौजूदा `resource_session` कुकी की जाँच करें
2. यदि कोई कुकी नहीं है, तो `?token=` क्वेरी पैरामीटर JWT हस्ताक्षर सत्यापित करें
3. पुष्टि करें कि संसाधन दावा साइट के `RESOURCE_NAME` एनवायरनमेंट वेरिएबल से मेल खाता है
4. सफलता पर 24-घंटे की `resource_session` कुकी सेट करें
5. अप्रमाणित उपयोगकर्ताओं को लॉगिन पर रीडायरेक्ट करें

---

## संसाधन ID

| संसाधन ID | उपकरण | न्यूनतम स्तर |
|------------|------|-------------|
| `rq-builder` | Research Question Builder Pro | Practitioner |
| `code-convert` | Statistical Code Converter Pro | Professional |
| `qual-insights` | Qualitative Insights Lab Pro | Professional |
| `vaniscribe` | VaniScribe AI Transcription | Professional |
| `devdata` | DevData Practice | Professional |
| `viz-cookbook` | Viz Cookbook | Professional |
| `devecon-toolkit` | DevEconomics Toolkit | Professional |

---

## डेटाबेस स्कीमा

### Profiles तालिका

| कॉलम | प्रकार | विवरण |
|--------|------|-------------|
| `id` | UUID | प्राथमिक कुंजी (Supabase auth उपयोगकर्ता ID से मेल खाती है) |
| `email` | text | उपयोगकर्ता ईमेल |
| `full_name` | text | प्रदर्शन नाम |
| `subscription_tier` | enum | `explorer`, `practitioner`, `professional`, `organization` |
| `subscription_status` | enum | `active`, `expired`, `cancelled` |
| `organization_id` | UUID | Organizations तालिका की विदेशी कुंजी (शून्य हो सकती है) |

### Organizations तालिका

| कॉलम | प्रकार | विवरण |
|--------|------|-------------|
| `id` | UUID | प्राथमिक कुंजी |
| `name` | text | संगठन का नाम |
| `admin_id` | UUID | Profiles की विदेशी कुंजी |
| `max_seats` | integer | अधिकतम टीम सदस्य |

**Row-Level Security:** सभी तालिकाएँ RLS लागू करती हैं। उपयोगकर्ता केवल अपने रिकॉर्ड देख और संशोधित कर सकते हैं।

---

## दर सीमाएँ

| एंडपॉइंट | सीमा |
|----------|-------|
| Supabase Auth | 30 अनुरोध/मिनट प्रति IP |
| mint-resource-token | Supabase Edge Function सीमाएँ (500K आमंत्रण/माह निःशुल्क) |
| प्रीमियम उपकरण पहुँच | प्रमाणित होने के बाद कोई सीमा नहीं (24-घंटे का सत्र) |

---

## उदाहरण: पूर्ण पहुँच प्रवाह

```bash
# 1. Supabase के माध्यम से लॉगिन
curl -X POST https://<project>.supabase.co/auth/v1/token?grant_type=password \
  -H "apikey: <anon_key>" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# 2. संसाधन टोकन मिंट करें
curl -X POST https://<project>.supabase.co/functions/v1/mint-resource-token \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"resource_id": "rq-builder"}'

# 3. उपयोगकर्ता को टोकन पैरामीटर के साथ उपकरण URL पर रीडायरेक्ट किया जाता है
# auth-gate Edge Function सत्यापित करता है और सत्र कुकी सेट करता है
```
