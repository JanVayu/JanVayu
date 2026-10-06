# டெப்லாய்மென்ட்

ஜான்வாயூ (JanVayu) **Netlify**-ல் டெப்லாய் செய்யப்பட்டுள்ளது. GitHub-ல் உள்ள `main` பிராஞ்சுக்கு (branch) செய்யப்படும் ஒவ்வொரு புஷ்ஷும் (push) தானியங்கி டெப்லாய்மென்ட்களைத் தூண்டுகிறது.

---

## டெப்லாய்மென்ட் எப்படி வேலை செய்கிறது

1. GitHub-ல் `main`-க்கு புஷ் செய்யவும்
2. வெப்ஹூக் (webhook) மூலம் Netlify புதிய கமிட்டைக் (commit) கண்டறிகிறது
3. Netlify பில்ட் கமாண்டை இயக்குகிறது (`node scripts/bump-version.mjs`, இது ஒரு வெர்ஷன்-ஸ்டாம்ப் ஸ்கிரிப்ட்; இதில் பண்ட்லர் (bundler) இல்லை) மற்றும் ரெப்போ ரூட்டை (repo root) பப்ளிஷ் டைரக்டரியாகக் கொண்டு டெப்லாய் செய்கிறது
4. தளம் [www.janvayu.in](https://www.janvayu.in) இல் லைவ் ஆகிறது

README-ல் உள்ள Netlify பில்ட் ஸ்டேட்டஸ் பேட்ஜ் (badge) தற்போதைய டெப்லாய் நிலையைப் பிரதிபலிக்கிறது.

---

## Netlify கட்டமைப்பு (`netlify.toml`)

```toml
# சுருக்கப்பட்டது: உண்மையான netlify.toml-ல் இன்னும் பல ஹெட்டர்களும் ரீடைரக்ட் விதிகளும் உள்ளன
[build]
  command = "node scripts/bump-version.mjs"
  publish = "."         # ரெப்போ ரூட்டிலிருந்து சர்வ் செய்யவும்
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "22"

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

# ... /docs, /blog, /embed, /api, /ask, /status போன்றவற்றிற்கான குறிப்பிட்ட விதிகள் ஃபால்பேக்கிற்கு (fallback) முன் வரும்
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

முக்கிய குறிப்புகள்:
- SPA ஃபால்பேக் (`/* → /index.html`) டீப் லிங்குகள் (deep links) சரியாக வேலை செய்வதை உறுதி செய்கிறது
- non-www ஆனது www-க்கு (canonical domain) ரீடைரக்ட் செய்யப்படுகிறது
- செக்யூரிட்டி ஹெட்டர்கள் (Security headers) உலகளாவிய அளவில் பயன்படுத்தப்படுகின்றன

---

## டொமைன் & DNS

`janvayu.in` என்ற கஸ்டம் டொமைன் Netlify DNS-ல் கட்டமைக்கப்பட்டுள்ளது. ரெப்போ ரூட்டில் உள்ள `CNAME` ஃபைலில் `www.janvayu.in` உள்ளது; இது Netlify-ல் எந்த தாக்கத்தையும் ஏற்படுத்தாது, மேலும் இது முந்தைய GitHub Pages அமைப்பிலிருந்து வந்ததா என்பது ரெப்போசிட்டரியில் பதிவு செய்யப்படவில்லை.

---

## ப்ரிவியூ டெப்லாய்மென்ட்கள்

புல் ரெக்வெஸ்ட்கள் (Pull requests) தானாகவே ஒரு ப்ரிவியூ URL-ஐ உருவாக்குகின்றன (உதாரணமாக, `https://deploy-preview-42--janvayu.netlify.app`). இது ரிவியூ செய்பவர்கள் `main`-ல் மெர்ஜ் (merge) செய்வதற்கு முன் மாற்றங்களைச் சோதிக்க அனுமதிக்கிறது.

---

## புரொடக்‌ஷனில் என்விரான்மென்ட் வேரியபிள்கள்

தேவையான அனைத்து வேரியபிள்களையும் Netlify டேஷ்போர்டில் அமைக்கவும்:

1. [app.netlify.com](https://app.netlify.com)-க்குச் செல்லவும்
2. ஜான்வாயூ தளத்தைத் திறக்கவும்
3. **Site Configuration → Environment Variables**-க்குச் செல்லவும்
4. ஒவ்வொரு வேரியபிளையும் சேர்க்கவும் ([Environment Variables](environment-variables.md)-ஐப் பார்க்கவும்)

புரொடக்‌ஷன் என்விரான்மென்ட் வேரியபிள்கள் **எப்பொழுதும்** ரெப்போசிட்டரியில் சேமிக்கப்படுவதில்லை.

---

## ரோல்பேக்

முந்தைய டெப்லாய்க்கு ரோல்பேக் செய்ய:

1. Netlify டேஷ்போர்டுக்குச் செல்லவும் → Deploys
2. கடைசியாகச் சரியாக வேலை செய்த டெப்லாயைக் கண்டறியவும்
3. "Publish deploy"-ஐக் கிளிக் செய்யவும்
---
Netlify முழுமையான deployment வரலாற்றை வைத்திருக்கிறது, எனவே rollbacks உடனடியாக நடக்கும்.

---

## கண்காணிப்பு

- **Deployment நிலை:** Netlify dashboard → Deploys
- **Function பதிவுகள்:** Netlify dashboard → Functions → Logs
- **Feed புதுப்பிப்பு:** `GET /.netlify/functions/feed-status` — அனைத்து feeds-களின் கடைசி update நேரங்களை வழங்கும்
- **Scheduled function பதிவுகள்:** Netlify dashboard → Functions → Scheduled Functions
