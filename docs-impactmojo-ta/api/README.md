# API குறிப்பு

ImpactMojo அங்கீகாரம், டோக்கன் உருவாக்கம் மற்றும் பிரீமியம் வள அணுகலுக்கான சிறிய தொகுப்பு முனைப்புள்ளிகளை வெளிப்படுத்துகிறது.

**அடிப்படை URL:** `https://www.impactmojo.in/.netlify/functions` (Netlify Functions)
**Supabase URL:** `https://<project>.supabase.co/functions/v1` (Edge Functions)

---

## முனைப்புள்ளிகள்

### அங்கீகாரம்

ImpactMojo Supabase Auth ஐப் பயன்படுத்துகிறது. பதிவு, உள்நுழைவு மற்றும் அமர்வு மேலாண்மைக்கு [Supabase Auth API ஆவணங்களைப்](https://supabase.com/docs/reference/javascript/auth-signup) பார்க்கவும்.

### mint-resource-token

**`POST`** `/functions/v1/mint-resource-token`

பிரீமியம் கருவிகளை அணுகுவதற்கான குறுகிய ஆயுள் JWT ஐ உருவாக்குகிறது.

**தலைப்புகள்:**
```
Authorization: Bearer <supabase_access_token>
Content-Type: application/json
```

**கோரிக்கை உடல்:**
```json
{
  "resource_id": "rq-builder"
}
```

**வெற்றிப் பதில் (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "url": "https://rq-builder.impactmojo.in/?token=eyJhbGciOiJIUzI1NiIs..."
}
```

**பிழைப் பதில் (403):**
```json
{
  "error": "Your subscription tier does not include this resource"
}
```

**டோக்கன் உரிமைக்கோரல்கள்:**
| உரிமைக்கோரல் | விவரம் |
|-------|-------------|
| `sub` | பயனர் ID (UUID) |
| `resource` | வள பெயர் (எ.கா., `rq-builder`) |
| `tier` | பயனரின் சந்தா நிலை |
| `exp` | காலாவதி (வழங்கலிலிருந்து 5 நிமிடங்கள்) |

---

### auth-gate (Edge Function)

**ஒவ்வொரு பிரீமியம் கருவி தளத்திலும் இயங்குகிறது.** நேரடியாக அழைக்கப்படாது — கருவிக்கான அனைத்து கோரிக்கைகளையும் இடைமறிக்கிறது.

**சரிபார்ப்பு ஓட்டம்:**
1. ஏற்கனவே உள்ள `resource_session` குக்கீயைச் சரிபார்க்கவும்
2. குக்கீ இல்லையெனில், `?token=` வினவல் அளவுரு JWT கையொப்பத்தைச் சரிபார்க்கவும்
3. வள உரிமைக்கோரல் தளத்தின் `RESOURCE_NAME` சூழல் மாறியுடன் பொருந்துகிறதா என்பதை உறுதிப்படுத்தவும்
4. வெற்றியின் போது 24-மணி நேர `resource_session` குக்கீயை அமைக்கவும்
5. அங்கீகரிக்கப்படாத பயனர்களை உள்நுழைவுக்கு திருப்பிவிடவும்

---

## வள ID-கள்

| வள ID | கருவி | குறைந்தபட்ச நிலை |
|------------|------|-------------|
| `rq-builder` | Research Question Builder Pro | Practitioner |
| `code-convert` | Statistical Code Converter Pro | Professional |
| `qual-insights` | Qualitative Insights Lab Pro | Professional |
| `vaniscribe` | VaniScribe AI Transcription | Professional |
| `devdata` | DevData Practice | Professional |
| `viz-cookbook` | Viz Cookbook | Professional |
| `devecon-toolkit` | DevEconomics Toolkit | Professional |

---

## தரவுத்தள வரையறை

### Profiles அட்டவணை

| நெடுவரிசை | வகை | விவரம் |
|--------|------|-------------|
| `id` | UUID | முதன்மை விசை (Supabase auth பயனர் ID உடன் பொருந்தும்) |
| `email` | text | பயனர் மின்னஞ்சல் |
| `full_name` | text | காட்சிப் பெயர் |
| `subscription_tier` | enum | `explorer`, `practitioner`, `professional`, `organization` |
| `subscription_status` | enum | `active`, `expired`, `cancelled` |
| `organization_id` | UUID | organizations அட்டவணைக்கான வெளி விசை (nullable) |

### Organizations அட்டவணை

| நெடுவரிசை | வகை | விவரம் |
|--------|------|-------------|
| `id` | UUID | முதன்மை விசை |
| `name` | text | நிறுவனப் பெயர் |
| `admin_id` | UUID | profiles க்கான வெளி விசை |
| `max_seats` | integer | அதிகபட்ச குழு உறுப்பினர்கள் |

**Row-Level Security:** அனைத்து அட்டவணைகளும் RLS ஐ அமல்படுத்துகின்றன. பயனர்கள் தங்கள் சொந்த பதிவுகளை மட்டுமே பார்க்கவும் மாற்றவும் முடியும்.

---

## வீத வரம்புகள்

| முனைப்புள்ளி | வரம்பு |
|----------|-------|
| Supabase Auth | IP ஒன்றுக்கு நிமிடத்திற்கு 30 கோரிக்கைகள் |
| mint-resource-token | Supabase Edge Function வரம்புகள் (மாதம் 500K இலவச அழைப்புகள்) |
| பிரீமியம் கருவி அணுகல் | அங்கீகரிக்கப்பட்ட பின் வரம்பு இல்லை (24-மணி நேர அமர்வு) |

---

## எடுத்துக்காட்டு: முழு அணுகல் ஓட்டம்

```bash
# 1. Supabase வழியாக உள்நுழையவும்
curl -X POST https://<project>.supabase.co/auth/v1/token?grant_type=password \
  -H "apikey: <anon_key>" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# 2. வள டோக்கனை உருவாக்கவும்
curl -X POST https://<project>.supabase.co/functions/v1/mint-resource-token \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"resource_id": "rq-builder"}'

# 3. பயனர் டோக்கன் அளவுருவுடன் கருவி URL க்கு திருப்பிவிடப்படுவார்
# auth-gate Edge Function சரிபார்த்து அமர்வு குக்கீயை அமைக்கும்
```
