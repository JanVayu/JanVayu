# Backend Stack

ஜான்வாயுவின் (JanVayu) பேக்கெண்ட் முழுவதுமாக சர்வர்லெஸ் (serverless) முறைமையில இயங்குகிறது — டேட்டா ப்ராக்ஸிங், கேஷிங், ஷெட்யூல்டு டாஸ்க்குகள், ஈமெயில் டெலிவரி மற்றும் AI அம்சங்களைக் கையாளும் 29 நெட்லிஃபை (Netlify) ஃபங்ஷன் ஃபைல்கள் (கூடுதலாக பகிரப்பட்ட `lib/`) இதில் உள்ளன.

---

## Netlify Functions

**Runtime:** Node.js 22
**Module format:** AI அம்சங்களுக்கான ES Modules (`.mjs`), ஃபீட் ப்ராக்ஸிகளுக்கான CommonJS (`.js`)
**Location:** `netlify/functions/`

### Function Inventory

| Function | Type | Purpose |
|----------|------|---------|
| `scheduled-fetch.mjs` | Scheduled (cron, every 4h) | அனைத்து சோஷியல்/நியூஸ் ஃபீட்களையும் முன்கூட்டியே ஃபெட்ச் செய்யும் |
| `daily-digest.mjs` | Scheduled (cron, 8 AM IST) | தினசரி AQI ஈமெயில் டைஜெஸ்ட்டை அனுப்பும் |
| `air-query.mjs` | On-demand (POST) | AI: இயற்கை மொழி AQI கேள்விகள் மற்றும் பதில்கள் |
| `health-advisory.mjs` | On-demand (POST) | AI: தனிப்பயனாக்கப்பட்ட சுகாதார ஆலோசனைகள் |
| `accountability-brief.mjs` | On-demand (POST) | AI: வார்டு அளவிலான நிர்வாகச் சுருக்கங்கள் |
| `anomaly-check.mjs` | On-demand (GET) | AI: PM2.5 அதிகரிப்பைக் கண்டறிதல் |
| `reddit-feed.js` | On-demand (GET) | கேஷ் செய்யப்பட்ட Reddit காற்று தரப் பதிவுகள் |
| `twitter-feed.js` | — | **ஓய்வு பெற்றது (Retired).** Nitter-ஐப் பயன்படுத்தும், அதன் பொது இன்ஸ்டன்ஸ்கள் இப்போது இல்லை; இதை யாரும் பயன்படுத்துவதில்லை. |
| `youtube-feed.js` | On-demand (GET) | YouTube சேனல் RSS-லிருந்து கேஷ் செய்யப்பட்ட இந்திய காற்று தர வீடியோக்கள் |
| `instagram-feed.js` | On-demand (GET) | கேஷ் செய்யப்பட்ட Instagram பதிவுகள் |
| `news-proxy.js` | On-demand (GET) | கேஷ் செய்யப்பட்ட செய்தி கட்டுரைகள் |
| `subscribe.js` | On-demand (POST) | ஈமெயில் சந்தா (subscription) மேலாண்மை |
| `feed-status.js` | On-demand (GET) | ஃபீட் ஃப்ரெஷ்னஸ் (freshness) ஹெல்த் செக் |
| `blob-store.js` | Utility (shared) | Netlify Blobs ஸ்டோர் இனிஷியலைசேஷன் |

இந்த அட்டவணை முக்கிய ஃபங்ஷன்களை மட்டுமே பட்டியலிடுகிறது. `netlify/functions/` இல் உள்ள மற்ற ஃபங்ஷன்களில் `waqi-proxy`, `rankings`, `historical-aqi`, `data-api`, `fire-tracker`, `community-sensors`, `push-subscribe`, `push-send`, `health-monitor`, `feed-health`, `status-history`, `terra-collab`, `workshop-submit` மற்றும் `reference-data` ஆகியவை அடங்கும்.

### Common Patterns

ஒவ்வொரு ஃபங்ஷனும் ஒரே மாதிரியான டெம்ப்ளேட்டைப் பின்பற்றுகிறது:
```javascript
export default async (req, context) => {
  // 1. CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: corsHeaders });
  }

  try {
    // 2. Core logic (fetch data, call AI, etc.)
    const result = await doWork();

    // 3. Return JSON
    return Response.json(result, { headers: corsHeaders });
  } catch (error) {
    // 4. Graceful fallback — never a 500 with no body
    console.log('Error:', error.message);
    return Response.json({ error: 'Service unavailable', fallback: rawData }, {
      status: 200,
      headers: corsHeaders,
    });
  }
};
```

---

## Netlify Blobs (Cache Layer)

**Package:** `@netlify/blobs` ^11.0.2
**Consistency:** Strong (not eventual)
**Store name:** `janvayu-feeds` (the code also uses `janvayu-subscribers`, `janvayu-rankings` and `janvayu-push-subs`)

### How Caching Works

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────┐
│ scheduled-fetch  │────▶│  Netlify Blobs    │◀────│ On-demand    │
│ (every 4 hours)  │     │  (JSON cache)     │     │ functions    │
│                  │     │                   │     │ (instant)    │
│ Fetches Reddit,  │     │ reddit            │     │ Serve from   │
│ News, Instagram  │     │ news              │     │ cache first  │
└──────────────────┘     │ instagram         │     └──────────────┘
                         │ youtube           │
                         │ sensor-community  │
                         └──────────────────┘
```

`youtube` மற்றும் `sensor-community` keys-ஐ `scheduled-fetch` அல்ல, `youtube-feed.js` மற்றும் `community-sensors.mjs` தான் எழுதுகின்றன.

**Cache-first strategy:**
1. On-demand function Blobs-ல் cached data உள்ளதா என சரிபார்க்கும்
2. Cache hit ஆக இருந்தால் → உடனடியாக return செய்யும்
3. Cache miss ஆக இருந்தால் → live-ஆக fetch செய்து, Blobs-ல் எழுதி, return செய்யும்
4. Live fetch fail ஆனால் → stale cache-ஐ return செய்யும் (எதுவுமே இல்லாததை விட இது மேல்)

இதனால் feed outages (Reddit rate limits, Nitter downtime) ஏற்படும் போது தரவுகள் சற்று பழையதாக இருந்தாலும், UI எப்போதுமே உடையாமல் இருப்பதை இது உறுதி செய்கிறது.

---

## Resend (Email Delivery)

**Package:** `resend` ^6.14.0
**Used by:** `daily-digest.mjs`
**From address:** `digest@janvayu.in`

### Daily Digest Flow

1. `daily-digest.mjs` காலை 8:00 AM IST-க்கு fire ஆகும் (Netlify scheduled function)
2. WAQI-லிருந்து subscribers-இன் நகரங்களுக்கான live AQI-ஐ fetch செய்யும்
3. AQI data மற்றும் சுகாதார வழிகாட்டுதல்களுடன் ஒரு சுத்தமான HTML email-ஐ format செய்யும்
4. Resend API மூலம் அனுப்பும்
**SendGrid/Mailgun-ஐ விட Resend ஏன்:**
- சுத்தமான API, குறைந்தபட்ச கோட்
- இலவச திட்டத்தில் ஒரு நாளைக்கு 100 மின்னஞ்சல்கள் என்ற வரம்பு உள்ளது ([resend.com/pricing](https://resend.com/pricing)); சந்தாதாரர்களின் எண்ணிக்கையுடன் இதைச் சரிபார்க்கவும்
- உள்ளமைக்கப்பட்ட பவுன்ஸ்/புகார் கையாளுதல்

---

## WAQI API (Client-Side)

World Air Quality Index API என்பது பிரவுசரில் இருந்து அழைக்கப்படும் முக்கிய நேரடி-AQI மூலமாகும்.

**Token:** [terms of service](https://aqicn.org/data-platform/token/) இன் கீழ் பதிவு செய்தவருக்கு WAQI வழங்கும்; client JS-ல் உட்பொதிக்கப்பட்டுள்ளது, எனவே இதை யார் வேண்டுமானாலும் படிக்கலாம்
**Refresh:** `setInterval` மூலம் ஒவ்வொரு 10 நிமிடங்களுக்கும்
**பயன்படுத்தப்படும் Endpoints:**
- `api.waqi.info/feed/{city}/` — ஒரு நகரத்தின் AQI
- `api.waqi.info/map/bounds/` — புவியியல் எல்லைகளுக்குள் உள்ள நிலையங்கள்

**ஏன் client-side:**
- நிகழ்நேர தரவு (கேஷிங் தாமதம் இல்லை)
- அனைத்து API அணுகலுக்கும் WAQI-க்கு சரியான key தேவை
- serverless function அழைப்புகளைக் குறைக்கிறது
