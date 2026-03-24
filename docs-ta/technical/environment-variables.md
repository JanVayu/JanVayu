# சூழல் மாறிகள்

அனைத்து ரகசியங்களும் கட்டமைப்பும் சூழல் மாறிகள் மூலம் நிர்வகிக்கப்படுகின்றன. அவை **repository-க்கு ஒருபோதும் commit செய்யப்படாது**.

- **உள்ளூர் மேம்பாட்டிற்கு**: திட்ட root-ல் `.env` கோப்பை உருவாக்கவும் (இது gitignore ஆகிறது)
- **உற்பத்திக்கு**: [Netlify dashboard](https://app.netlify.com)-ல் Site Settings → Environment Variables-ல் அமைக்கவும்

---

## தேவையான மாறிகள்

### `RESEND_API_KEY`
**பயன்படுத்துவது:** `daily-digest.mjs`

சந்தாதாரர்களுக்கு தினசரி மின்னஞ்சல் சுருக்கங்களை அனுப்ப [Resend](https://resend.com)-லிருந்து உங்கள் API key.

**எவ்வாறு பெறுவது:**
1. [resend.com](https://resend.com)-ல் கணக்கு உருவாக்கவும்
2. API Keys → Create API Key-க்கு செல்லவும்
3. key-ஐ நகலெடுக்கவும் (ஒருமுறை மட்டுமே காட்டப்படும்)

---

### `RESEND_FROM`
**பயன்படுத்துவது:** `daily-digest.mjs`

சுருக்க மின்னஞ்சல்களுக்கான சரிபார்க்கப்பட்ட அனுப்புநர் மின்னஞ்சல் முகவரி. Resend-ல் நீங்கள் சரிபார்த்த domain ஆக இருக்க வேண்டும்.

**எடுத்துக்காட்டு:** `digest@janvayu.in`

---

### `BLOB_TOKEN`
**பயன்படுத்துவது:** Netlify Blobs படிக்கும்/எழுதும் அனைத்து functions

Blobs படிக்க/எழுத அனுமதிகளுடன் Netlify personal access token.

**எவ்வாறு பெறுவது:**
1. [Netlify User Settings → Personal Access Tokens](https://app.netlify.com/user/applications)-க்கு செல்லவும்
2. புதிய token உருவாக்கவும்
3. நகலெடுக்கவும் (ஒருமுறை மட்டுமே காட்டப்படும்)

---

### `NETLIFY_SITE_ID`
**பயன்படுத்துவது:** Netlify Blobs படிக்கும்/எழுதும் அனைத்து functions

உங்கள் Netlify site-ன் தனித்துவ ID.

**எவ்வாறு பெறுவது:**
1. [app.netlify.com](https://app.netlify.com)-க்கு செல்லவும்
2. JanVayu site-ஐ திறக்கவும்
3. Site Settings → General → Site ID-க்கு செல்லவும்
4. UUID-ஐ நகலெடுக்கவும் (வடிவம்: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

---

### `GEMINI_API_KEY`
**பயன்படுத்துவது:** `air-query.mjs`, `health-advisory.mjs`, `accountability-brief.mjs`, `anomaly-check.mjs`

AI-இயக்கப்படும் அம்சங்களுக்கான Google Gemini API key.

**எவ்வாறு பெறுவது:**
1. [aistudio.google.com](https://aistudio.google.com)-க்கு செல்லவும்
2. "Get API Key" கிளிக் செய்யவும்
3. புதிய அல்லது ஏற்கனவே உள்ள project-ல் key உருவாக்கவும்

JanVayu-ன் AI அம்சங்களுக்கு free tier போதுமானது.

---

## பொது Key (ரகசியம் அல்ல)

### WAQI API Token
WAQI API token (`1f64cc8563a165dc5a6ce48f7eeb9ba0221b63f3`) என்பது `index.html`-ல் நேரடியாக உட்பொதிக்கப்பட்ட **free-tier public key** ஆகும். இது ரகசியம் அல்ல — WAQI இந்த token-களை பொதுவாக வழங்குகிறது. இது WAQI-ஆல் IP அளவில் வரம்பிடப்படுகிறது.

அதிக வரம்புகளுக்கு உங்கள் சொந்த WAQI token பயன்படுத்த விரும்பினால், [aqicn.org/data-platform/token](https://aqicn.org/data-platform/token/)-ல் பதிவு செய்து `index.html`-ல் token-ஐ மாற்றவும்.

---

## உள்ளூர் `.env` எடுத்துக்காட்டு

```bash
# மின்னஞ்சல் சுருக்கம் (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RESEND_FROM=digest@janvayu.in

# Netlify Blobs
BLOB_TOKEN=nfp_xxxxxxxxxxxxxxxxxxxx
NETLIFY_SITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# AI அம்சங்கள் (Google Gemini)
GEMINI_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
