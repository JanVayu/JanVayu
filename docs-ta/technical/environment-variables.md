# சூழல் மாறிகள்

அனைத்து ரகசியங்களும் அமைப்புகளும் சூழல் மாறிகள் (environment variables) மூலமாகவே நிர்வகிக்கப்படுகின்றன. அவை **ஒருபோதும் களஞ்சியத்தில் (repository) சேர்க்கப்படுவதில்லை**.

- **உள்ளூர் மேம்பாட்டிற்கு (local development)**: திட்டத்தின் மூலத்தில் (project root) ஒரு `.env` கோப்பை உருவாக்கவும் (இது gitignored)
- **உற்பத்திச் சூழலுக்கு (production)**: [Netlify dashboard](https://app.netlify.com) இல் Site Settings → Environment Variables என்பதன் கீழ் அவற்றை அமைக்கவும்

---

## தேவையான மாறிகள்

### `RESEND_API_KEY`
**பயன்படுத்துபவை:** `daily-digest.mjs`

[Resend](https://resend.com) இலிருந்து பெறப்பட்ட உங்கள் API key. சந்தாதாரர்களுக்கு தினசரி மின்னஞ்சல் சுருக்கங்களை (daily email digests) அனுப்புவதற்கு இது தேவை.

**இதைப் பெறுவது எப்படி:**
1. [resend.com](https://resend.com) இல் கணக்கை உருவாக்கவும்
2. API Keys → Create API Key என்பதற்குச் செல்லவும்
3. key-ஐ நகலெடுக்கவும் (இது ஒரு முறை மட்டுமே காட்டப்படும்)

---

### `RESEND_FROM`
**பயன்படுத்துபவை:** `daily-digest.mjs`

சுருக்க மின்னஞ்சல்களுக்கான சரிபார்க்கப்பட்ட அனுப்புநர் மின்னஞ்சல் முகவரி. இது Resend-இல் நீங்கள் சரிபார்த்த டொமைனாக இருக்க வேண்டும்.

**எடுத்துக்காட்டு:** `digest@janvayu.in`

---

### `BLOB_TOKEN`
**பயன்படுத்துபவை:** Netlify Blobs-ஐப் படிக்கும்/எழுதும் அனைத்துச் செயல்பாடுகளும்

Blobs-ஐப் படிக்கும்/எழுதும் அனுமதிகளுடன் கூடிய Netlify தனிப்பட்ட அணுகல் token.

**இதைப் பெறுவது எப்படி:**
1. [Netlify User Settings → Personal Access Tokens](https://app.netlify.com/user/applications) என்பதற்குச் செல்லவும்
2. புதிய token-ஐ உருவாக்கவும்
3. அதை நகலெடுக்கவும் (ஒரு முறை மட்டுமே காட்டப்படும்)

---

### `NETLIFY_SITE_ID`
**பயன்படுத்துபவை:** Netlify Blobs-ஐப் படிக்கும்/எழுதும் அனைத்துச் செயல்பாடுகளும்

உங்கள் Netlify தளத்தின் தனித்துவமான ID.

**இதைப் பெறுவது எப்படி:**
1. [app.netlify.com](https://app.netlify.com) என்பதற்குச் செல்லவும்
2. JanVayu தளத்தைத் திறக்கவும்
3. Site Settings → General → Site ID என்பதற்குச் செல்லவும்
4. UUID-ஐ நகலெடுக்கவும் (வடிவம்: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

---

### `GROQ_API_KEY`
**பயன்படுத்துபவை:** `air-query.mjs`, `health-advisory.mjs`, `accountability-brief.mjs`, `anomaly-check.mjs`

AI-ஆல் இயங்கும் அம்சங்களுக்கான Groq API key (இது `openai/gpt-oss-120b` என்ற திறந்த-எடை LLM-ஐப் பயன்படுத்துகிறது; விருப்பத்திற்குரிய `GROQ_MODEL` மாறியைக் கொண்டு இந்த மாதிரியை மாற்றிக்கொள்ளலாம்).

**இதைப் பெறுவது எப்படி:**
1. [console.groq.com](https://console.groq.com) என்பதற்குச் செல்லவும்
2. கணக்கு உருவாக்கவும் அல்லது உள்நுழையவும்
3. API Keys என்பதற்குச் சென்று புதிய key-ஐ உருவாக்கவும்

JanVayu-இல் உள்ள AI அம்சங்களுக்கு இலவசத் திட்டமே (free tier) போதுமானது.

---

## விருப்பத்திற்குரிய மாறிகள்

இவை இல்லாமலும் தளம் வேலை செய்யும். ஒவ்வொன்றும் ஒரு குறிப்பிட்ட அம்சத்தை மேம்படுத்துகின்றன, அவை இல்லாவிட்டாலும் எந்தச் செயல்பாடும் பாதிக்கப்படாது.

### செயல்பாடுகளால் படிக்கப்படும் பிற மாறிகள்

குறியீடு (code) இவையும் படிக்கிறது; ஒவ்வொன்றுக்கும் அதைப் பயன்படுத்தும் செயல்பாட்டில் ஒரு இயல்புநிலை (default) அல்லது மாற்று மதிப்பு (fallback) உள்ளது.
| Variable | Read by | Purpose |
|----------|---------|---------|
| `GROQ_MODEL` | `air-query`, `health-advisory`, `accountability-brief`, `anomaly-check` | Groq மாடல் பெயர்; இயல்புநிலையாக `openai/gpt-oss-120b` |
| `WAQI_TOKEN`, `WAQI_API_TOKEN` | `rankings`, `push-send`, `waqi-proxy` | WAQI டோக்கன் ஓவர்ரைடு; மூலத்தில் உள்ள டோக்கனை இந்த செயல்பாடுகள் பயன்படுத்தும் |
| `OPENAQ_API_KEY` | `community-sensors` | OpenAQ API key |
| `FIRMS_MAP_KEY` | `fire-tracker` | NASA FIRMS மேப் key |
| `WORKSHOP_INBOX_EMAIL` | `workshop-submit`, `terra-collab` | ஒர்க்ஷாப் சமர்ப்பிப்புகளுக்கான பெறுநர்; இயல்புநிலையாக `contribute@janvayu.in` |
| `ALERT_EMAIL` | `health-monitor` | அப் டைம் அலர்ட்டுகளுக்கான பெறுநர்கள் (கமா பிரித்து) |
| `TERRA_COLLAB_SECRET` | `terra-collab` | அந்த செயல்பாட்டிற்கான பகிரப்பட்ட ரகசியம் |

### `YOUTUBE_API_KEY`
**பயன்படுத்துபவை:** `youtube-feed.js`

இது இல்லாமல், வீடியோ ஃபீட் எட்டு இந்திய செய்தி மற்றும் சுற்றுச்சூழல் சேனல்களின் பொது RSS ஃபீட்களைப் படித்து, தலைப்பில் காற்றுத் தரம் பற்றிய வீடியோக்களை மட்டும் வைத்திருக்கும். இதற்கு எந்த key-யும் quota-வும் தேவையில்லை. ஆனால், நாங்கள் பட்டியலிட்ட சேனல்களின் கவரேஜை மட்டுமே அதனால் கண்டுபிடிக்க முடியும். மேலும், மாசுக்காலம் அல்லாத நேரங்களில் அந்த சேனல்கள் பல வாரங்களுக்கு காற்றுத் தரம் பற்றி எதையும் வெளியிடாது — அதனால் ஆகஸ்ட் மாதத்தில் ஃபீட் காலியாகவே இருக்கும்.

இதை வைத்துக்கொண்டால், இந்த ஃபங்ஷன் YouTube-ஐ **தேடியும்** பார்க்கும். இதன் மூலம் பட்டியலில் இல்லாத சேனல்களையும் சென்றடைய முடியும்.

**எப்படிக் பெறுவது:**
1. [console.cloud.google.com](https://console.cloud.google.com)-க்குச் சென்று எந்தவொரு Google கணக்கிலும் உள்நுழையவும்.
2. ஒரு புதிய ப்ராஜெக்ட்டை உருவாக்கவும் (மேல் பட்டை → **New Project**), அல்லது ஏற்கனவே உள்ள ஒன்றைத் தேர்ந்தெடுக்கவும்.
3. **APIs & Services → Library**-க்குச் சென்று, **YouTube Data API v3**-ஐத் தேடி, அதைத் திறந்து, **Enable**-ஐ அழுத்தவும்.
4. **APIs & Services → Credentials → Create Credentials → API key**-ஐத் தேர்ந்தெடுத்து key-ஐ காப்பி செய்யவும்.
5. **Edit API key**-ஐ அழுத்தி, **API restrictions**-ன் கீழ் **Restrict key** → *YouTube Data API v3*-ஐத் தேர்ந்தெடுக்கவும். அப்ளிகேஷன் கட்டுப்பாடுகளை **None** என வைக்கவும்: Netlify ஃபங்ஷன்களுக்கு allow-list செய்ய நிலையான IP இல்லை. இதை ஒரே ஒரு API-க்கு மட்டும் கட்டுப்படுத்துவதால், key கசிந்தாலும் பொது YouTube தரவை மட்டுமே படிக்க முடியும்; வேறு எதையும் செய்ய முடியாது.
6. Netlify-ல்: **Site configuration → Environment variables → Add a variable**, `YOUTUBE_API_KEY` எனப் பெயரிட்டு, மதிப்பை பேஸ்ட் செய்து, மீண்டும் டெப்லாய் செய்யவும்.

இந்த ஃபங்ஷன் ஒவ்வொரு கேச் ரீஃபில்லுக்கும் மூன்று தேடல் வினவல்களை இயக்குகிறது. இதன் முடிவு கேச் செய்யப்படுவதால், ஒரு பிஸியான நாளில் தேடல் ஒதுக்கீட்டின் ஒரு சிறிய பகுதி மட்டுமே பயன்படுத்தப்படும்.
---
> **Update 2 Oct 2026:** Google-இன் quota பக்கத்தில் இப்போது `search.list`-க்கு தனியாக ஒரு நாளைக்கு 100 calls (ஒரு call-க்கு 1 unit) என ஒதுக்கப்பட்டுள்ளது; தனிப்பட்ட 10,000 units ஒரு நாளைக்கு மற்ற endpoints-க்கு பொருந்தும் ([quota cost reference](https://developers.google.com/youtube/v3/determine_quota_cost)). எனவே refill செய்யப்படும் ஒவ்வொரு முறையும் 3 queries, 100 தினசரி தேடல்களில் 3-ஐப் பயன்படுத்தும்.

**இது server-side-ல் மட்டுமே படிக்கப்படும்.** இந்த key Netlify function-ல் உள்ளது, இது browser-க்கு அனுப்பப்படாது, எனவே WAQI token-ஐப் போல இது public-ஆக இருக்க வேண்டிய அவசியமில்லை. இதை `index.html`-ல் போட வேண்டாம்.

**இது வேலை செய்கிறதா என்பதை உறுதிப்படுத்த**, function-ஐ fetch செய்து `source`-ஐப் பார்க்கவும்:

```bash
curl -s https://www.janvayu.in/.netlify/functions/youtube-feed | head -c 200
```

`"source": "channel-rss"` என்றால் key எதுவும் அமைக்கப்படவில்லை என்று அர்த்தம். `"source": "channel-rss + data-api"` என்றால் key பயன்பாட்டில் உள்ளது என்று அர்த்தம்.

---

## Client-Side Token (ரகசியம் அல்ல)

### WAQI API Token
WAQI API token (`1f64cc8563a165dc5a6ce48f7eeb9ba0221b63f3`) ஆனது `app.js` மற்றும் `js/try-home.js` மற்றும் பல Netlify functions-ல் சேர்க்கப்பட்டுள்ளது, எனவே யார் வேண்டுமானாலும் இதைப் படிக்கலாம், இதை ரகசியமாக வைத்திருக்க முடியாது. WAQI தனது [terms of service](https://aqicn.org/data-platform/token/)-ன் கீழ் பதிவு செய்யும் ஒவ்வொருவருக்கும் tokens-ஐ வழங்குகிறது, மேலும் அனைத்து API access-க்கும் சரியான key தேவை; ஒரு key-க்கு ஒரு வினாடிக்கு 1,000 requests என்பது default quota ஆகும்.

நீங்கள் உங்கள் சொந்த WAQI token-ஐப் பயன்படுத்த விரும்பினால் (அதிக rate limits-க்காக), [aqicn.org/data-platform/token](https://aqicn.org/data-platform/token/)-ல் பதிவு செய்து, `index.html`-ல் உள்ள token-ஐ மாற்றவும்.

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

# Optional: YouTube search for the video feed (free tier, no card)
YOUTUBE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
