# Deployment
ஜனவ்யூ (JanVayu) **Netlify**-இல் deploy செய்யப்பட்டுள்ளது, இது GitHub-இன் `main` branch-க்கு செய்யப்படும் ஒவ்வொரு push-ஐயும் build செய்கிறது.
---
## Deployment எப்படி வேலை செய்கிறது
1. GitHub-இல் `main`-க்கு push செய்யவும்
2. Netlify webhook வழியாக புதிய commit-ஐக் கண்டறிகிறது
3. Netlify build command-ஐ இயக்குகிறது (`node scripts/bump-version.mjs`, இது ஒரு version-stamp script; இதில் bundler எதுவும் இல்லை) மற்றும் repo root-ஐ publish directory-ஆகக் கொண்டு deploy செய்கிறது
4. தளம் [www.janvayu.in](https://www.janvayu.in)-இல் live ஆகிறது
படி 4 ஆனது இந்த repository-இல் இல்லாத ஒரு Netlify setting-ஐப் பொறுத்தது. `CLAUDE.md` தளத்தை publish-locked என விவரிக்கிறது, அதாவது ஒரு push ஒரு deploy-ஐ உருவாக்குகிறது மற்றும் அந்த deploy அடுத்த publish window-இல் live ஆகிறது. இணைக்கப்பட்ட மாற்றம் live ஆகிவிட்டது என்று யாரிடமும் சொல்வதற்கு முன், தற்போதைய setting-க்காக Netlify dashboard-ஐச் சரிபார்க்கவும்.
README-இல் உள்ள Netlify build status badge தற்போதைய deploy நிலையைப் பிரதிபலிக்கிறது.
---
## Netlify Configuration (`netlify.toml`)
```toml
# சுருக்கப்பட்டது: உண்மையான netlify.toml-இல் பல headers மற்றும் redirect rules உள்ளன
[build]
  command = "node scripts/bump-version.mjs"
  publish = "."         # repo root-லிருந்து சேவை செய்ய
  functions = "netlify/functions"
[build.environment]
  NODE_VERSION = "24"
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
# ... /docs, /blog, /embed, /api, /ask, /status போன்றவற்றிற்கான குறிப்பிட்ட விதிகள் fallback-க்கு முன்னால் வரும்
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
முக்கிய குறிப்புகள்:
- SPA fallback (`/* → /index.html`) deep links சரியாக வேலை செய்வதை உறுதி செய்கிறது
- Non-www ஆனது www-க்கு (canonical domain) redirect செய்யப்படுகிறது
- Security headers உலகளவில் பயன்படுத்தப்படுகின்றன
---
## Domain & DNS
`janvayu.in` என்ற custom domain Netlify DNS-இல் configure செய்யப்பட்டுள்ளது. repo root-இல் உள்ள `CNAME` file-இல் `www.janvayu.in` உள்ளது; இது Netlify-இல் எந்த தாக்கத்தையும் ஏற்படுத்தாது, மேலும் இது முந்தைய GitHub Pages setup-லிருந்து வந்ததா என்பது repository-இல் பதிவு செய்யப்படவில்லை.
---
## Preview Deploys
Pull requests தானாகவே ஒரு preview URL-ஐ உருவாக்குகின்றன (உதாரணமாக, `https://deploy-preview-42--janvayu.netlify.app`). இது reviewers `main`-இல் merge செய்வதற்கு முன் மாற்றங்களைச் சோதிக்க அனுமதிக்கிறது.
---
## Environment Variables in Production
தேவையான அனைத்து variables-ஐயும் Netlify dashboard-இல் அமைக்கவும்:
1. [app.netlify.com](https://app.netlify.com) க்குச் செல்லவும்
2. JanVayu தளத்தைத் திறக்கவும்
3. **Site Configuration → Environment Variables** க்குச் செல்லவும்
4. ஒவ்வொரு variable-ஐயும் சேர்க்கவும் ([Environment Variables](environment-variables.md) ஐப் பார்க்கவும்)
Production environment variables **எப்போதுமே** repository-இல் சேமிக்கப்படுவதில்லை.
---
## Rollback
முந்தைய deploy-க்கு rollback செய்ய:
1. Netlify dashboard → Deploys க்குச் செல்லவும்
2. கடைசியாகச் சரியாக வேலை செய்த deploy-ஐக் கண்டறியவும்
3. "Publish deploy" என்பதைக் கிளிக் செய்யவும்
Netlify முழு deploy history-ஐயும் வைத்திருக்கிறது, எனவே rollbacks உடனடியாக நடக்கும்.
---
## Monitoring
- **Deploy status:** Netlify dashboard → Deploys
- **Function logs:** Netlify dashboard → Functions → Logs
- **Feed freshness:** `GET /.netlify/functions/feed-status` — அனைத்து feeds-களுக்கான கடைசி update timestamps-ஐத் தருகிறது
- **Uptime:** [/status/](https://www.janvayu.in/status/) இல் உள்ள பொது status page, ஒவ்வொரு 15 நிமிடங்களுக்கும் `health-monitor.mjs` பதிவு செய்யும் history-ஐப் படிக்கிறது. `.github/workflows/function-health.yml` அதே இடைவெளியில் தளத்தையும் அதன் functions-ஐயும் probe செய்கிறது, மேலும் ஏதேனும் down ஆக இருந்தால் "status: outage" issue-ஐத் திறந்து வைத்திருக்கிறது
- **Live readings:** `.github/workflows/live-audit.yml` தினமும் ஒருமுறை தளத்தின் live readings-ஐ CPCB-இன் தினசரி bulletin-உடன் ஒப்பிடுகிறது; சிவப்பு நிற scheduled run தான் alert
- **Scheduled function logs:** Netlify dashboard → Functions → Scheduled Functions
