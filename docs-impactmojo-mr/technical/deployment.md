# तैनाती मार्गदर्शिका

ImpactMojo Supabase बॅकएंडसह Netlify वर स्टॅटिक साइट म्हणून तैनात होते. कोणत्याही बिल्ड स्टेपची आवश्यकता नाही.

---

## मुख्य साइट तैनाती

### स्वयंचलित (Git द्वारे)

1. GitHub वरील `main` शाखेवर पुश करा
2. Netlify पुश ओळखते आणि स्वयंचलितपणे तैनात करते
3. कोणत्याही बिल्ड कमांडची आवश्यकता नाही — साइट स्टॅटिक HTML/CSS/JS आहे
4. साइट ३०-९० सेकंदांत [www.impactmojo.in](https://www.impactmojo.in) वर लाइव्ह होते

### मॅन्युअल

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy from project root
netlify deploy --prod
```

---

## डोमेन कॉन्फिगरेशन

सानुकूल डोमेन `impactmojo.in` Netlify DNS मध्ये कॉन्फिगर केले आहे.

| नोंद | प्रकार | मूल्य |
|--------|------|-------|
| `@` | A | Netlify load balancer |
| `www` | CNAME | Netlify site URL |
| `docs` | CNAME | `hosting.gitbook.io` |

`netlify.toml` मधील पुनर्निर्देशन नियम:
```toml
[[redirects]]
  from = "https://impactmojo.in/*"
  to = "https://www.impactmojo.in/:splat"
  status = 301
  force = true
```

---

## प्रीमियम साधन साइट्स

प्रत्येक प्रीमियम साधन एक स्वतंत्र Netlify साइट आहे:

| साधन | Netlify साइट | Auth Gate |
|------|-------------|-----------|
| RQ Builder Pro | स्वतंत्र डिप्लॉय | `auth-gate.ts` Edge Function |
| Qual Insights Lab | स्वतंत्र डिप्लॉय | `auth-gate.ts` Edge Function |
| Statistical Code Converter | स्वतंत्र डिप्लॉय | `auth-gate.ts` Edge Function |
| VaniScribe | स्वतंत्र डिप्लॉय | `auth-gate.ts` Edge Function |
| DevData Practice | स्वतंत्र डिप्लॉय | `auth-gate.ts` Edge Function |
| Viz Cookbook | स्वतंत्र डिप्लॉय | `auth-gate.ts` Edge Function |
| DevEcon Toolkit | स्वतंत्र डिप्लॉय | `auth-gate.ts` Edge Function |

प्रत्येक साधन साइटला टोकन प्रमाणीकरणासाठी `JWT_SECRET` पर्यावरण चल आवश्यक आहे.

---

## Supabase कॉन्फिगरेशन

### आवश्यक सारण्या

Supabase migrations द्वारे सर्व २१+ सारण्या तयार केल्याची खात्री करा. प्रमुख सारण्या:
- `profiles` — वापरकर्ता खाती आणि सदस्यत्व स्तर
- `organizations` — संघ खाती
- `course_progress`, `bookmarks`, `certificates`, `payments`

### Row-Level Security

सर्व सारण्यांवर RLS सक्षम असणे आवश्यक आहे. वापरकर्ते फक्त त्यांच्या स्वतःच्या पंक्ती वाचू/लिहू शकतात.

### Edge Functions

`mint-resource-token` फंक्शन Supabase वर तैनात करणे आवश्यक आहे:
```
supabase functions deploy mint-resource-token
```

---

## पर्यावरण चल

संपूर्ण यादीसाठी [पर्यावरण चल](environment-variables.md) पहा.

---

## खर्च रचना

| सेवा | योजना | अंदाजित खर्च |
|---------|------|---------------|
| Netlify (मुख्य साइट) | मोफत स्तर | $0/महिना |
| Netlify (प्रत्येक साधन साइट) | मोफत स्तर | $0/महिना |
| Supabase | मोफत स्तर (५००MB पर्यंत, ५०K MAU) | $0/महिना |
| डोमेन (impactmojo.in) | वार्षिक नूतनीकरण | ~₹८००/वर्ष |
| Resend (ईमेल सूचना) | मोफत स्तर (१०० ईमेल/दिवस) | $0/महिना |

---

## परस्परसंवादी डेमो

> **आगामी** — एक परस्परसंवादी तैनाती वॉकथ्रू येथे एम्बेड केले जाईल, ज्यामध्ये पुश-टू-डिप्लॉय प्रवाह आणि पर्यावरण चल कॉन्फिगरेशन दाखवले जाईल.

<!-- Replace this section with an Arcade embed once recorded -->
