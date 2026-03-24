# வரிசைப்படுத்தல்

JanVayu **Netlify**-ல் வரிசைப்படுத்தப்பட்டுள்ளது, GitHub-ல் `main` கிளைக்கு ஒவ்வொரு push-ஆலும் தானாக வரிசைப்படுத்தல் தூண்டப்படுகிறது.

---

## வரிசைப்படுத்தல் எவ்வாறு வேலை செய்கிறது

1. GitHub-ல் `main`-க்கு push செய்யுங்கள்
2. Netlify webhook வழியாக புதிய commit-ஐ கண்டறிகிறது
3. Netlify build செய்து வரிசைப்படுத்துகிறது (build படி இல்லை — repo root publish directory)
4. 30–90 விநாடிகளுக்குள் [www.janvayu.in](https://www.janvayu.in)-ல் தளம் நேரடி

README-யில் உள்ள Netlify build status badge தற்போதைய deploy நிலையை பிரதிபலிக்கிறது.

---

## Netlify கட்டமைப்பு (`netlify.toml`)

```toml
[build]
  publish = "."         # Repo root-லிருந்து serve செய்
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[redirects]]
  from = "https://janvayu.in/*"
  to = "https://www.janvayu.in/:splat"
  status = 301
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

முக்கிய புள்ளிகள்:
- SPA fallback (`/* → /index.html`) deep links சரியாக வேலை செய்வதை உறுதி செய்கிறது
- www அல்லாதது www-க்கு redirect செய்யப்படுகிறது (canonical domain)
- பாதுகாப்பு headers உலகளாவியாக பொருந்தும்

---

## Domain & DNS

தனிப்பயன் domain `janvayu.in` Netlify DNS-ல் கட்டமைக்கப்பட்டுள்ளது. Repo root-ல் உள்ள `CNAME` கோப்பு GitHub Pages custom domain-ஐ அமைக்கிறது (Netlify-க்கு இடம்பெயர்வதற்கு முன்பிருந்த legacy).

---

## Preview வரிசைப்படுத்தல்கள்

Pull requests தானாக ஒரு preview URL-ஐ உருவாக்குகின்றன (எ.கா., `https://deploy-preview-42--janvayu.netlify.app`). இது மதிப்பாய்வாளர்களுக்கு `main`-க்கு இணைப்பதற்கு முன் மாற்றங்களை சோதிக்க அனுமதிக்கிறது.

---

## உற்பத்தியில் சூழல் மாறிகள்

Netlify dashboard-ல் தேவையான அனைத்து மாறிகளையும் அமைக்கவும்:

1. [app.netlify.com](https://app.netlify.com)-க்கு செல்லவும்
2. JanVayu site-ஐ திறக்கவும்
3. **Site Configuration → Environment Variables**-க்கு செல்லவும்
4. ஒவ்வொரு மாறியையும் சேர்க்கவும் ([சூழல் மாறிகள்](environment-variables.md) பார்க்கவும்)

உற்பத்தி சூழல் மாறிகள் repository-ல் **ஒருபோதும்** சேமிக்கப்படாது.

---

## Rollback

முந்தைய deploy-க்கு rollback செய்ய:

1. Netlify dashboard → Deploys-க்கு செல்லவும்
2. கடைசியாக நன்றாக வேலை செய்த deploy-ஐ கண்டறியுங்கள்
3. "Publish deploy" கிளிக் செய்யுங்கள்

Netlify முழுமையான deploy வரலாற்றை வைத்திருக்கிறது, எனவே rollbacks உடனடி.

---

## கண்காணிப்பு

- **Deploy நிலை:** Netlify dashboard → Deploys
- **Function logs:** Netlify dashboard → Functions → Logs
- **Feed புத்தம்புதிய நிலை:** `GET /.netlify/functions/feed-status` — அனைத்து feeds-க்கான கடைசி புதுப்பிப்பு timestamps திருப்புகிறது
- **திட்டமிடப்பட்ட function logs:** Netlify dashboard → Functions → Scheduled Functions
