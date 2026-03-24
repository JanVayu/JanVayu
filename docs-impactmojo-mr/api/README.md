# API संदर्भ

ImpactMojo प्रमाणीकरण, टोकन निर्मिती आणि प्रीमियम संसाधन प्रवेशासाठी एंडपॉइंट्सचा एक छोटा संच उघड करते.

**मूळ URL:** `https://www.impactmojo.in/.netlify/functions` (Netlify Functions)
**Supabase URL:** `https://<project>.supabase.co/functions/v1` (Edge Functions)

---

## एंडपॉइंट्स

### प्रमाणीकरण

ImpactMojo Supabase Auth वापरते. साइनअप, लॉगिन आणि सत्र व्यवस्थापनासाठी [Supabase Auth API दस्तऐवज](https://supabase.com/docs/reference/javascript/auth-signup) पहा.

### mint-resource-token

**`POST`** `/functions/v1/mint-resource-token`

प्रीमियम साधनांमध्ये प्रवेशासाठी अल्पकालीन JWT तयार करते.

**हेडर्स:**
```
Authorization: Bearer <supabase_access_token>
Content-Type: application/json
```

**विनंती मुख्य भाग:**
```json
{
  "resource_id": "rq-builder"
}
```

**यशस्वी प्रतिसाद (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "url": "https://rq-builder.impactmojo.in/?token=eyJhbGciOiJIUzI1NiIs..."
}
```

**त्रुटी प्रतिसाद (403):**
```json
{
  "error": "Your subscription tier does not include this resource"
}
```

**टोकन दावे:**
| दावा | वर्णन |
|-------|-------------|
| `sub` | वापरकर्ता ID (UUID) |
| `resource` | संसाधन नाव (उदा., `rq-builder`) |
| `tier` | वापरकर्त्याचा सदस्यत्व स्तर |
| `exp` | कालबाह्यता (जारी केल्यापासून ५ मिनिटे) |

---

### auth-gate (Edge Function)

**प्रत्येक प्रीमियम साधन साइटवर चालते.** थेट कॉल केले जात नाही — साधनावरील सर्व विनंत्या अडवते.

**प्रमाणीकरण प्रवाह:**
1. विद्यमान `resource_session` कुकी तपासा
2. कुकी नसल्यास, `?token=` क्वेरी पॅरामीटर JWT स्वाक्षरी सत्यापित करा
3. संसाधन दावा साइटच्या `RESOURCE_NAME` पर्यावरण चलाशी जुळतो याची पुष्टी करा
4. यश झाल्यावर २४-तासांची `resource_session` कुकी सेट करा
5. अप्रमाणीकृत वापरकर्त्यांना लॉगिनवर पुनर्निर्देशित करा

---

## संसाधन ID

| संसाधन ID | साधन | किमान स्तर |
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

### Profiles सारणी

| स्तंभ | प्रकार | वर्णन |
|--------|------|-------------|
| `id` | UUID | प्राथमिक कळ (Supabase auth वापरकर्ता ID शी जुळते) |
| `email` | text | वापरकर्ता ईमेल |
| `full_name` | text | प्रदर्शन नाव |
| `subscription_tier` | enum | `explorer`, `practitioner`, `professional`, `organization` |
| `subscription_status` | enum | `active`, `expired`, `cancelled` |
| `organization_id` | UUID | organizations सारणीची विदेशी कळ (nullable) |

### Organizations सारणी

| स्तंभ | प्रकार | वर्णन |
|--------|------|-------------|
| `id` | UUID | प्राथमिक कळ |
| `name` | text | संस्थेचे नाव |
| `admin_id` | UUID | profiles ची विदेशी कळ |
| `max_seats` | integer | कमाल संघ सदस्य |

**Row-Level Security:** सर्व सारण्या RLS लागू करतात. वापरकर्ते फक्त त्यांच्या स्वतःच्या नोंदी पाहू आणि बदलू शकतात.

---

## दर मर्यादा

| एंडपॉइंट | मर्यादा |
|----------|-------|
| Supabase Auth | प्रत्येक IP साठी ३०  विनंत्या/मिनिट |
| mint-resource-token | Supabase Edge Function मर्यादा (५००K आवाहने/महिना मोफत) |
| प्रीमियम साधन प्रवेश | प्रमाणीकरणानंतर कोणतीही मर्यादा नाही (२४-तासांचे सत्र) |

---

## उदाहरण: पूर्ण प्रवेश प्रवाह

```bash
# 1. Login via Supabase
curl -X POST https://<project>.supabase.co/auth/v1/token?grant_type=password \
  -H "apikey: <anon_key>" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# 2. Mint a resource token
curl -X POST https://<project>.supabase.co/functions/v1/mint-resource-token \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"resource_id": "rq-builder"}'

# 3. User is redirected to tool URL with token parameter
# The auth-gate Edge Function validates and sets a session cookie
```
