# வரிசைப்படுத்தல் வழிகாட்டி

ImpactMojo Supabase ஐ பின்தளமாகக் கொண்டு Netlify இல் நிலையான தளமாக வரிசைப்படுத்தப்படுகிறது. உருவாக்க படி தேவையில்லை.

---

## முதன்மை தள வரிசைப்படுத்தல்

### தானியங்கி (Git வழியாக)

1. GitHub இல் `main` கிளைக்கு தள்ளுங்கள்
2. Netlify தள்ளலைக் கண்டறிந்து தானாக வரிசைப்படுத்துகிறது
3. உருவாக்க கட்டளை தேவையில்லை — தளம் நிலையான HTML/CSS/JS
4. தளம் 30–90 வினாடிகளுக்குள் [www.impactmojo.in](https://www.impactmojo.in) இல் நேரடியாகிறது

### கைமுறை

```bash
# Netlify CLI ஐ நிறுவுங்கள்
npm install -g netlify-cli

# திட்ட மூலத்திலிருந்து வரிசைப்படுத்துங்கள்
netlify deploy --prod
```

---

## டொமைன் கட்டமைப்பு

தனிப்பயன் டொமைன் `impactmojo.in` Netlify DNS இல் கட்டமைக்கப்பட்டுள்ளது.

| பதிவு | வகை | மதிப்பு |
|--------|------|-------|
| `@` | A | Netlify load balancer |
| `www` | CNAME | Netlify site URL |
| `docs` | CNAME | `hosting.gitbook.io` |

`netlify.toml` இல் திருப்பிவிடல் விதி:
```toml
[[redirects]]
  from = "https://impactmojo.in/*"
  to = "https://www.impactmojo.in/:splat"
  status = 301
  force = true
```

---

## பிரீமியம் கருவி தளங்கள்

ஒவ்வொரு பிரீமியம் கருவியும் தனி Netlify தளமாகும்:

| கருவி | Netlify தளம் | Auth Gate |
|------|-------------|-----------|
| RQ Builder Pro | தனி வரிசைப்படுத்தல் | `auth-gate.ts` Edge Function |
| Qual Insights Lab | தனி வரிசைப்படுத்தல் | `auth-gate.ts` Edge Function |
| Statistical Code Converter | தனி வரிசைப்படுத்தல் | `auth-gate.ts` Edge Function |
| VaniScribe | தனி வரிசைப்படுத்தல் | `auth-gate.ts` Edge Function |
| DevData Practice | தனி வரிசைப்படுத்தல் | `auth-gate.ts` Edge Function |
| Viz Cookbook | தனி வரிசைப்படுத்தல் | `auth-gate.ts` Edge Function |
| DevEcon Toolkit | தனி வரிசைப்படுத்தல் | `auth-gate.ts` Edge Function |

ஒவ்வொரு கருவி தளமும் டோக்கன் சரிபார்ப்புக்கு `JWT_SECRET` சூழல் மாறி தேவை.

---

## Supabase கட்டமைப்பு

### தேவையான அட்டவணைகள்

Supabase migrations வழியாக அனைத்து 21+ அட்டவணைகளும் உருவாக்கப்பட்டிருப்பதை உறுதி செய்யுங்கள். முக்கிய அட்டவணைகள்:
- `profiles` — பயனர் கணக்குகள் மற்றும் சந்தா நிலைகள்
- `organizations` — குழு கணக்குகள்
- `course_progress`, `bookmarks`, `certificates`, `payments`

### Row-Level Security

அனைத்து அட்டவணைகளிலும் RLS இயக்கப்பட்டிருக்க வேண்டும். பயனர்கள் தங்கள் சொந்த வரிசைகளை மட்டுமே படிக்க/எழுத முடியும்.

### Edge Functions

`mint-resource-token` செயல்பாடு Supabase இல் வரிசைப்படுத்தப்பட வேண்டும்:
```
supabase functions deploy mint-resource-token
```

---

## சூழல் மாறிகள்

முழுப் பட்டியலுக்கு [சூழல் மாறிகள்](environment-variables.md) பார்க்கவும்.

---

## செலவு கட்டமைப்பு

| சேவை | திட்டம் | மதிப்பிடப்பட்ட செலவு |
|---------|------|---------------|
| Netlify (முதன்மை தளம்) | இலவச நிலை | $0/மாதம் |
| Netlify (ஒவ்வொரு கருவி தளம்) | இலவச நிலை | $0/மாதம் |
| Supabase | இலவச நிலை (500MB வரை, 50K MAU) | $0/மாதம் |
| டொமைன் (impactmojo.in) | ஆண்டு புதுப்பிப்பு | ~₹800/ஆண்டு |
| Resend (மின்னஞ்சல் அறிவிப்புகள்) | இலவச நிலை (நாளுக்கு 100 மின்னஞ்சல்கள்) | $0/மாதம் |

---

## ஊடாடும் டெமோ

> **விரைவில்** — push-to-deploy ஓட்டம் மற்றும் சூழல் மாறி கட்டமைப்பைக் காட்டும் ஊடாடும் வரிசைப்படுத்தல் வழிப்பயணம் இங்கே உட்பொதிக்கப்படும்.

<!-- Replace this section with an Arcade embed once recorded -->
