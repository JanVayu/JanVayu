# பேக்கெண்ட் ஸ்டாக்

ஜான்வாயுவின் (JanVayu) பேக்கெண்ட் முழுமையாக சர்வர்லெஸ் (serverless) முறையில் இயங்குகிறது — 29 நெட்லிஃபி (Netlify) ஃபங்ஷன் ஃபைல்கள் (அத்துடன் பகிரப்பட்ட `lib/`) டேட்டா ப்ராக்ஸிங், கேஷிங், திட்டமிடப்பட்ட டாஸ்க்குகள், ஈமெயில் டெலிவரி மற்றும் AI அம்சங்களைக் கையாளுகின்றன.

---

## நெட்லிஃபி ஃபங்ஷன்கள்

**ரன்டைம்:** Node.js 22
**மாட்யூல் ஃபார்மேட்:** AI அம்சங்களுக்கு ES மாட்யூல்கள் (`.mjs`), ஃபீட் ப்ராக்ஸிகளுக்கு CommonJS (`.js`)
**இடம்:** `netlify/functions/`

### ஃபங்ஷன் பட்டியல்

| ஃபங்ஷன் | வகை | நோக்கம் |
|----------|------|---------|
| `scheduled-fetch.mjs` | திட்டமிடப்பட்டது (cron, ஒவ்வொரு 4 மணி நேரத்திற்கும்) | அனைத்து சோஷியல்/நியூஸ் ஃபீட்களையும் முன்கூட்டியே எடுப்பது |
| `daily-digest.mjs` | திட்டமிடப்பட்டது (cron, காலை 8 IST) | தினசரி AQI ஈமெயில் டைஜெஸ்ட்டை அனுப்புவது |
| `air-query.mjs` | தேவைப்படும்போது (POST) | AI: இயல்பான மொழியில் AQI கேள்வி-பதில் |
| `health-advisory.mjs` | தேவைப்படும்போது (POST) | AI: தனிப்பயனாக்கப்பட்ட சுகாதார ஆலோசனைகள் |
| `accountability-brief.mjs` | தேவைப்படும்போது (POST) | AI: வார்டு அளவிலான நிர்வாகச் சுருக்கங்கள் |
| `anomaly-check.mjs` | தேவைப்படும்போது (GET) | AI: PM2.5 ஸ்பைக் கண்டறிதல் |
| `reddit-feed.js` | தேவைப்படும்போது (GET) | கேஷ் செய்யப்பட்ட ரெடிட் (Reddit) காற்றுத் தரப் பதிவுகள் |
| `twitter-feed.js` | — | **ஓய்வு பெற்றது.** பொது இன்ஸ்டன்ஸ்கள் இல்லாத நிட்டரை (Nitter) படிக்கிறது; இதை எதுவும் அழைப்பதில்லை. |
| `youtube-feed.js` | தேவைப்படும்போது (GET) | யூடியூப் சேனல் RSS-லிருந்து கேஷ் செய்யப்பட்ட இந்திய காற்றுத் தர வீடியோக்கள் |
| `instagram-feed.js` | தேவைப்படும்போது (GET) | கேஷ் செய்யப்பட்ட இன்ஸ்டாகிராம் பதிவுகள் |
| `news-proxy.js` | தேவைப்படும்போது (GET) | கேஷ் செய்யப்பட்ட செய்திக் கட்டுரைகள் |
| `subscribe.js` | தேவைப்படும்போது (POST) | ஈமெயில் சந்தா மேலாண்மை |
| `feed-status.js` | தேவைப்படும்போது (GET) | ஃபீட் ஃப்ரெஷ்னஸ் ஹெல்த் செக் |
| `blob-store.js` | யூட்டிலிட்டி (பகிரப்பட்டது) | நெட்லிஃபி பிளாப்ஸ் (Blobs) ஸ்டோர் இனிஷியலைசேஷன் |

இந்த அட்டவணை முக்கிய ஃபங்ஷன்களை மட்டுமே பட்டியலிடுகிறது. `netlify/functions/` இல் உள்ள மற்ற ஃபங்ஷன்களில் `waqi-proxy`, `rankings`, `historical-aqi`, `data-api`, `fire-tracker`, `community-sensors`, `push-subscribe`, `push-send`, `health-monitor`, `feed-health`, `status-history`, `terra-collab`, `workshop-submit`, `zotero-library` மற்றும் `reference-data` ஆகியவை அடங்கும்.

### பொதுவான பேட்டர்ன்கள்

ஒவ்வொரு ஃபங்ஷனும் ஒரே டெம்ப்ளேட்டைப் பின்பற்றுகிறது:
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

`youtube` மற்றும் `sensor-community` keys-ஐ `scheduled-fetch` உருவாக்காது; இவை `youtube-feed.js` மற்றும் `community-sensors.mjs` மூலம் உருவாக்கப்படுகின்றன.

**Cache-first strategy:**
1. On-demand function Blobs-ல் cached data உள்ளதா என சரிபார்க்கும்
2. Cache hit ஆனால் → உடனடியாக திருப்பி அனுப்பும்
3. Cache miss ஆனால் → live data-வை fetch செய்து, Blobs-ல் எழுதி, திருப்பி அனுப்பும்
4. Live fetch தோல்வியடைந்தால் → பழைய cached data-வை திருப்பி அனுப்பும் (எதுவுமில்லாததை விட இது மேல்)

இதன் மூலம் feed outages (Reddit rate limits, Nitter downtime) ஏற்படும்போது UI உடன்பாடின்றி இருப்பதற்குப் பதிலாக, சற்று பழைய தரவை வழங்குகிறது.

---

## Resend (Email Delivery)

**Package:** `resend` ^6.14.0
**Used by:** `daily-digest.mjs`
**From address:** `digest@janvayu.in`

### Daily Digest Flow

1. `daily-digest.mjs` காலை 8:00 IST-க்கு (Netlify scheduled function) இயங்கும்
2. WAQI-லிருந்து சந்தாதாரரின் நகரங்களுக்கான live AQI-ஐ fetch செய்யும்
3. AQI தரவு மற்றும் சுகாதார வழிகாட்டுதல்களுடன் ஒரு சுத்தமான HTML email-ஐ உருவாக்கும்
4. Resend API மூலம் அனுப்பும்
**SendGrid/Mailgun-ஐ விட Resend-ஐ ஏன் தேர்ந்தெடுத்தோம்:**
- சுத்தமான API, குறைவான குறியீடு
- இலவசத் திட்டத்தில் தினசரி 100 மின்னஞ்சல்கள் என்ற வரம்பு உள்ளது ([resend.com/pricing](https://resend.com/pricing)); சந்தாதாரர்களின் எண்ணிக்கைக்கு ஏற்ப இதைச் சரிபார்க்கவும்
- பவுன்ஸ்/புகார் கையாளுதல் (bounce/complaint handling) உள்ளமைக்கப்பட்டுள்ளது

---

## WAQI API (கிளையன்ட்-சைடு)

பிரவுசரில் இருந்து அழைக்கப்படும் முக்கிய நேரடி-AQI ஆதாரமாக World Air Quality Index API உள்ளது.

**டோக்கன் (Token):** [terms of service](https://aqicn.org/data-platform/token/) படி பதிவு செய்தவர்களுக்கு WAQI வழங்கும் டோக்கன்; இது கிளைன்ட் JS-ல் இணைக்கப்பட்டுள்ளது, எனவே இதை யார் வேண்டுமானாலும் படிக்கலாம்
**புதுப்பித்தல் (Refresh):** `setInterval` மூலம் ஒவ்வொரு 10 நிமிடங்களுக்கும்
**பயன்படுத்தப்படும் எண்ட்பாயிண்ட்கள் (Endpoints):**
- `api.waqi.info/feed/{city}/` — ஒரு நகரத்தின் AQI
- `api.waqi.info/map/bounds/` — புவியியல் எல்லைகளுக்குள் உள்ள நிலையங்கள்

**கிளையன்ட்-சைடு ஏன்:**
- நிகழ்நேரத் தரவு (கேஷிங் தாமதம் இல்லை)
- அனைத்து API அணுகலுக்கும் WAQI-க்கு சரியான கீ (key) தேவை
- சர்வர்லெஸ் ஃபங்ஷன் (serverless function) அழைப்புகளைக் குறைக்கிறது
