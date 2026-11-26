# Environment Variables
அனைத்து ரகசியங்களும் கட்டமைப்பு அமைப்புகளும் environment variables மூலமாகவே நிர்வகிக்கப்படுகின்றன. அவை **ஒருபோதும் repository-க்கு commit செய்யப்படுவதில்லை**.
- **local development**-க்கு: project root-ல் ஒரு `.env` file-ஐ உருவாக்கவும் (இது gitignored ஆகும்)
- **production**-க்கு: [Netlify dashboard](https://app.netlify.com)-ல் Site Settings → Environment Variables என்பதன் கீழ் அவற்றை அமைக்கவும்
---
## Required Variables
### `RESEND_API_KEY`
**பயன்படுத்தப்படுபவை:** `daily-digest.mjs`, `health-monitor.mjs`, `workshop-submit.mjs`, `terra-collab.mjs`
[Resend](https://resend.com)-ல் இருந்து பெறப்பட்ட உங்கள் API key. சந்தாதாரர்களுக்கு தினசரி email digests அனுப்புவதற்கு இது தேவை.
**எப்படிக் பெறுவது:**
1. [resend.com](https://resend.com)-ல் ஒரு கணக்கை உருவாக்கவும்
2. API Keys → Create API Key என்பதற்குச் செல்லவும்
3. Key-ஐ காப்பி செய்யவும் (இது ஒருமுறை மட்டுமே காட்டப்படும்)
---
### `RESEND_FROM`
**பயன்படுத்தப்படுபவை:** `daily-digest.mjs`
digest email-களுக்கான சரிபார்க்கப்பட்ட sender email முகவரி. Resend-ல் நீங்கள் சரிபார்த்த domain-ஆக இது இருக்க வேண்டும்.
**உதாரணம்:** `digest@janvayu.in`
---
### `BLOB_TOKEN`
**பயன்படுத்தப்படுபவை:** Netlify Blobs-ஐப் படிக்கும்/எழுதும் அனைத்து function-களும்
Blobs படிக்கும்/எழுதும் அனுமதிகளுடன் கூடிய Netlify personal access token.
**எப்படிக் பெறுவது:**
1. [Netlify User Settings → Personal Access Tokens](https://app.netlify.com/user/applications)-க்குச் செல்லவும்
2. புதிய token-ஐ உருவாக்கவும்
3. அதைக் காப்பி செய்யவும் (ஒருமுறை மட்டுமே காட்டப்படும்)
---
### `NETLIFY_SITE_ID`
**பயன்படுத்தப்படுபவை:** Netlify Blobs-ஐப் படிக்கும்/எழுதும் அனைத்து function-களும்
உங்கள் Netlify site-ன் தனித்துவமான ID.
**எப்படிக் பெறுவது:**
1. [app.netlify.com](https://app.netlify.com)-க்குச் செல்லவும்
2. JanVayu site-ஐத் திறக்கவும்
3. Site Settings → General → Site ID என்பதற்குச் செல்லவும்
4. UUID-ஐ காப்பி செய்யவும் (வடிவம்: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
---
### `GROQ_API_KEY`
**பயன்படுத்தப்படுபவை:** `air-query.mjs`, `health-advisory.mjs`, `accountability-brief.mjs`, `anomaly-check.mjs`
AI-ஆல் இயங்கும் feature-களுக்கான Groq API key (`openai/gpt-oss-120b` என்ற open-weight LLM-ஐப் பயன்படுத்துகிறது; விருப்பத்திற்குரிய `GROQ_MODEL` variable மூலம் இந்த model-ஐ மாற்றிக்கொள்ளலாம்).
**எப்படிக் பெறுவது:**
1. [console.groq.com](https://console.groq.com)-க்குச் செல்லவும்
2. Sign up செய்யவும் அல்லது log in செய்யவும்
3. API Keys என்பதற்குச் சென்று புதிய key-ஐ உருவாக்கவும்
JanVayu-ல் உள்ள AI feature-களுக்கு free tier போதுமானது.
---
## Optional Variables
இந்த variable-கள் இல்லாமலும் site வேலை செய்யும். ஒவ்வொன்றும் ஒரு feature-ஐ மேம்படுத்துகின்றன, அவை இல்லாவிட்டாலும் எதுவும் வேலை செய்யாமல் போகாது.
### function-களால் படிக்கப்படும் பிற variable-கள்
Code இவற்றையும் படிக்கிறது; ஒவ்வொன்றுக்கும் அதைப் பயன்படுத்தும் function-ல் ஒரு default அல்லது fallback உள்ளது.
| Variable | வாசிப்பது | நோக்கம் |
|----------|---------|---------|
| `GROQ_MODEL` | `air-query`, `health-advisory`, `accountability-brief`, `anomaly-check` | Groq மாடல் பெயர்; இயல்புநிலையாக `openai/gpt-oss-120b` இருக்கும் |
| `WAQI_TOKEN` (அல்லது `WAQI_API_TOKEN`) | `waqi-proxy` மற்றும் நேரடியாக WAQI-ஐ வாசிக்கும் செயல்பாடுகள் | WAQI டோக்கன். கட்டாயம் தேவை. மூலக் குறியீட்டில் மாற்று வழி இல்லை |
| `OPENAQ_API_KEY` | `community-sensors` | OpenAQ API key |
| `FIRMS_MAP_KEY` | `fire-tracker` | NASA FIRMS வரைபட key |
| `WORKSHOP_INBOX_EMAIL` | `workshop-submit`, `terra-collab` | பயிலரங்கு சமர்ப்பிப்புகளுக்கான பெறுநர்; இயல்புநிலையாக `contribute@janvayu.in` |
| `ALERT_EMAIL` | `health-monitor` | இயங்குநிலை எச்சரிக்கைகளுக்கான பெறுநர்கள், கமாவால் பிரிக்கப்பட்டவை |
| `TERRA_COLLAB_SECRET` | `terra-collab` | அந்த செயல்பாட்டிற்கான பகிரப்பட்ட ரகசியம் |

### `YOUTUBE_API_KEY`
**பயன்படுத்துபவை:** `youtube-feed.js`

இது இல்லையென்றால், வீடியோ ஃபீட் எட்டு இந்திய செய்தி மற்றும் சுற்றுச்சூழல் சேனல்களின் பொது RSS ஃபீட்களைப் படித்து, தலைப்பில் காற்றுத் தரத்தைக் குறிப்பிடும் வீடியோக்களை மட்டுமே வைத்திருக்கும். இதற்கு key-யோ அல்லது quota-வோ தேவையில்லை, ஆனால் நாம் பட்டியலிட்ட சேனல்களின் கவரேஜை மட்டுமே அதனால் கண்டுபிடிக்க முடியும், மேலும் மாசு பருவத்திற்கு வெளியே அந்த சேனல்கள் வாரக்கணக்கில் காற்று பற்றி எதையும் வெளியிடாது — எனவே ஆகஸ்ட் மாதத்தில் ஃபீட் காலியாக இருப்பது நியாயமே.
இது இருந்தால், அந்த செயல்பாடு **YouTube-ஐ தேடவும்** செய்யும், இதன் மூலம் பட்டியலிடப்படாத சேனல்களையும் அடைய முடியும்.
**எப்படிக் பெறுவது:**
1. [console.cloud.google.com](https://console.cloud.google.com)-க்குச் சென்று ஏதேனும் Google கணக்கில் உள்நுழையவும்.
2. ஒரு திட்டத்தை உருவாக்கவும் (மேல் பட்டை → **New Project**), அல்லது ஏற்கனவே உள்ள ஒன்றைத் தேர்ந்தெடுக்கவும்.
3. **APIs & Services → Library**, **YouTube Data API v3** எனத் தேடி, அதைத் திறந்து, **Enable** அழுத்தவும்.
4. **APIs & Services → Credentials → Create Credentials → API key**. key-ஐ நகலெடுக்கவும்.
5. **Edit API key** அழுத்தி, **API restrictions**-க்கு கீழ் **Restrict key** → *YouTube Data API v3* என்பதைத் தேர்ந்தெடுக்கவும். பயன்பாட்டு கட்டுப்பாடுகளை **None** என விட்டுவிடவும்: Netlify செயல்பாடுகளுக்கு allow-list செய்ய நிலையான IP இல்லை. ஒன்றை மட்டும் API என கட்டுப்படுத்துவதால், கசிந்த key பொது YouTube தரவை வாசிப்பதைத் தவிர வேறு எதையும் செய்ய முடியாது.
6. Netlify-இல்: **Site configuration → Environment variables → Add a variable**, `YOUTUBE_API_KEY` எனப் பெயரிட்டு, மதிப்பை ஒட்டி, பின்னர் மீண்டும் deploy செய்யவும்.
இந்த செயல்பாடு கேச் ரீஃபில்லுக்கு மூன்று தேடல் வினவல்களை இயக்குகிறது, மேலும் முடிவு கேச் செய்யப்படுகிறது, எனவே ஒரு பிஸியான நாள் தேடல் ஒதுக்கீட்டின் ஒரு சிறிய பகுதியை மட்டுமே பயன்படுத்தும்.
---
> **Update 2 Oct 2026:** Google-இன் quota பக்கத்தில் இப்போது `search.list`-க்கு தினசரி 100 calls கொண்ட தனி bucket வழங்கப்படுகிறது, ஒவ்வொரு call-க்கும் 1 unit; தனிப்பட்ட தினசரி 10,000 units மற்ற endpoints-க்கு பொருந்தும் ([quota cost reference](https://developers.google.com/youtube/v3/determine_quota_cost)). எனவே refill-க்கு மூன்று queries பயன்படுத்தினால், தினசரி 100 searches-ல் 3 பயன்படுத்தப்படும்.
**இது server-side-ல் மட்டுமே படிக்கப்படும்.** இந்த key Netlify function-ல் உள்ளது, இது ஒருபோதும் browser-க்கு அனுப்பப்படாது. இதை `index.html`-ல் போட வேண்டாம்.
**இது வேலை செய்கிறதா என்பதை உறுதிப்படுத்த**, function-ஐ fetch செய்து `source`-ஐப் பார்க்கவும்:
```bash
curl -s https://www.janvayu.in/.netlify/functions/youtube-feed | head -c 200
```
`"source": "channel-rss"` என்றால் எந்த key-யும் அமைக்கப்படவில்லை என்று அர்த்தம். `"source": "channel-rss + data-api"` என்றால் key பயன்பாட்டில் உள்ளது என்று அர்த்தம்.
---
## WAQI Token (Server-Side)
### WAQI API Token
WAQI API token என்பது ஒரு server-side அமைப்பாகும். இது Netlify site settings-ல் உள்ள `WAQI_TOKEN` environment variable ஆகும், மேலும் இந்த repository-ல் உள்ள எந்த page, script அல்லது function-லும் இது இருக்காது. Browser ஆனது `/.netlify/functions/waqi-proxy` வழியாக மட்டுமே WAQI-ஐ சென்றடையும், இது server-ல் token-ஐ சேர்க்கிறது, city slugs, coordinates மற்றும் மூன்று டிகிரிக்கு மிகாத bounding box ஆகியவற்றை மட்டுமே ஏற்கும், மேலும் பதில்களை ஐந்து நிமிடங்களுக்கு cache செய்யும். Token commit செய்யப்பட்டால் `scripts/check-no-waqi-token.py` build-ஐ fail செய்யும். 27 October 2026 வரை token ஆனது `app.js`, `js/try-home.js` மற்றும் எட்டு functions-ல் எழுதப்பட்டிருந்தது, எனவே ஒவ்வொரு பார்வையாளரும் அதைக் கொண்டிருந்தனர்; git history-ல் உள்ள நகல் படிக்கக்கூடியதாகவே உள்ளது, எனவே எப்போதாவது commit செய்யப்பட்ட token-ஐ [aqicn.org/data-platform/token](https://aqicn.org/data-platform/token/)-ல் இருந்து புதியதாக மாற்ற வேண்டும், மேலும் Netlify-ல் `WAQI_TOKEN`-ஐ update செய்ய வேண்டும் (புதிய deploy அதைப் பெற்றுக்கொள்ளும்).
ஒரு fork-க்கு, [aqicn.org/data-platform/token](https://aqicn.org/data-platform/token/)-ல் உங்களுக்கான token-ஐ பதிவு செய்து, அதை `WAQI_TOKEN` ஆக அமைக்கவும்.
---
## Local `.env` Example
```bash
# Email digest (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RESEND_FROM=digest@janvayu.in

# Netlify Blobs
BLOB_TOKEN=nfp_xxxxxxxxxxxxxxxxxxxx
NETLIFY_SITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# AI features (Groq, gpt-oss-120b)
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Live readings (WAQI), read by waqi-proxy and the functions
WAQI_TOKEN=your_waqi_token

# Optional: YouTube search for the video feed (free tier, no card)
YOUTUBE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
