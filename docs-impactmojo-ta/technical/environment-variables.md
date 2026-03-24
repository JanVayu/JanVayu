# சூழல் மாறிகள்

ImpactMojo Supabase சான்றுகள், JWT கையொப்பமிடுதல் மற்றும் மின்னஞ்சல் விநியோகத்திற்கு சூழல் மாறிகளைப் பயன்படுத்துகிறது.

---

## முதன்மை தளம்

முதன்மை தளம் (impactmojo.in) முழுமையாக நிலையானது மற்றும் **சேவையக-பக்க சூழல் மாறிகள் தேவையில்லை**. Supabase கிளையன்ட் சான்றுகள் முன்னணி JavaScript இல் உட்பொதிக்கப்பட்டுள்ளன (இவை பொது anon keys, ரகசியங்கள் அல்ல).

---

## Supabase Edge Functions

| மாறி | தேவை | விவரம் |
|----------|----------|-------------|
| `SUPABASE_URL` | ஆம் | Supabase திட்ட URL |
| `SUPABASE_ANON_KEY` | ஆம் | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | ஆம் | Supabase service role key (சேவையக-பக்கம் மட்டும்) |
| `JWT_SECRET` | ஆம் | வள டோக்கன்களை கையொப்பமிடுவதற்கான HMAC-SHA256 ரகசியம் |

---

## பிரீமியம் கருவி தளங்கள் (Netlify Edge Functions)

ஒவ்வொரு பிரீமியம் கருவி தளமும் தேவைப்படுவது:

| மாறி | தேவை | விவரம் |
|----------|----------|-------------|
| `JWT_SECRET` | ஆம் | `mint-resource-token` பயன்படுத்தும் ரகசியத்துடன் பொருந்த வேண்டும் |
| `RESOURCE_NAME` | ஆம் | இந்த கருவிக்கான அடையாளங்காட்டி (எ.கா., `rq-builder`, `qual-lab`) |

---

## மின்னஞ்சல் அறிவிப்புகள் (Resend)

| மாறி | தேவை | விவரம் |
|----------|----------|-------------|
| `RESEND_API_KEY` | ஆம் | [Resend](https://resend.com) இலிருந்து API key |
| `RESEND_FROM` | ஆம் | சரிபார்க்கப்பட்ட அனுப்புநர் மின்னஞ்சல் முகவரி |

**எடுத்துக்காட்டு:** `hello@impactmojo.in`

---

## எடுத்துக்காட்டு `.env` கோப்பு

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

## பாதுகாப்பு குறிப்புகள்

- **`.env` கோப்புகளை ஒருபோதும் commit செய்யாதீர்கள்** — அவை `.gitignore` இல் உள்ளன
- `SUPABASE_SERVICE_ROLE_KEY` RLS ஐ புறக்கணிக்கிறது — சேவையக-பக்க செயல்பாடுகளில் மட்டும் பயன்படுத்தவும்
- `JWT_SECRET` டோக்கன் உருவாக்க செயல்பாடு மற்றும் அனைத்து கருவி auth gates முழுவதும் ஒரே மாதிரியாக இருக்க வேண்டும்
- `SUPABASE_ANON_KEY` கிளையன்ட்-பக்கம் வெளிப்படுத்துவது பாதுகாப்பானது (RLS ஐ அமல்படுத்துகிறது)
