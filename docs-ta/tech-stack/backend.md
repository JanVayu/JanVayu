# Backend அடுக்கு

JanVayu-ன் backend முழுவதும் serverless — தரவு ப்ராக்ஸி, கேச்சிங், திட்டமிடப்பட்ட பணிகள், மின்னஞ்சல் விநியோகம் மற்றும் AI அம்சங்களை கையாளும் 13 Netlify Functions.

---

## Netlify Functions

**Runtime:** Node.js 18
**Module format:** AI அம்சங்களுக்கு ES Modules (`.mjs`), feed proxies-க்கு CommonJS (`.js`)
**இருப்பிடம்:** `netlify/functions/`

### Function பட்டியல்

| Function | வகை | நோக்கம் |
|----------|------|---------|
| `scheduled-fetch.mjs` | Scheduled (cron, ஒவ்வொரு 4 மணி நேரம்) | அனைத்து சமூக/செய்தி feeds-ஐ முன்-பெறுகிறது |
| `daily-digest.mjs` | Scheduled (cron, காலை 8 AM IST) | தினசரி AQI மின்னஞ்சல் சுருக்கம் அனுப்புகிறது |
| `air-query.mjs` | On-demand (POST) | AI: இயற்கை மொழி AQI Q&A |
| `health-advisory.mjs` | On-demand (POST) | AI: தனிப்பயனாக்கப்பட்ட சுகாதார ஆலோசனை |
| `accountability-brief.mjs` | On-demand (POST) | AI: வார்டு அளவிலான ஆளுமை சுருக்கங்கள் |
| `anomaly-check.mjs` | On-demand (GET) | AI: PM2.5 எகிற்சி கண்டறிதல் |
| `reddit-feed.js` | On-demand (GET) | Cache செய்யப்பட்ட Reddit காற்று தர பதிவுகள் |
| `twitter-feed.js` | On-demand (GET) | Cache செய்யப்பட்ட Twitter/X பதிவுகள் |
| `instagram-feed.js` | On-demand (GET) | Cache செய்யப்பட்ட Instagram பதிவுகள் |
| `news-proxy.js` | On-demand (GET) | Cache செய்யப்பட்ட செய்தி கட்டுரைகள் |
| `subscribe.js` | On-demand (POST) | மின்னஞ்சல் சந்தா மேலாண்மை |
| `feed-status.js` | On-demand (GET) | Feed புத்தம்புதிய நிலை சோதனை |
| `blob-store.js` | Utility (shared) | Netlify Blobs store துவக்கம் |

### பொதுவான வடிவங்கள்

ஒவ்வொரு function-ம் ஒரே template-ஐ பின்பற்றுகிறது:

```javascript
export default async (req, context) => {
  // 1. CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: corsHeaders });
  }

  try {
    // 2. முக்கிய logic (தரவு பெறுதல், AI அழைப்பு, போன்றவை)
    const result = await doWork();

    // 3. JSON திருப்புதல்
    return Response.json(result, { headers: corsHeaders });
  } catch (error) {
    // 4. அழகான fallback — body இல்லாத 500 ஒருபோதும் இல்லை
    console.log('Error:', error.message);
    return Response.json({ error: 'Service unavailable', fallback: rawData }, {
      status: 200,
      headers: corsHeaders,
    });
  }
};
```

---

## Netlify Blobs (Cache அடுக்கு)

**Package:** `@netlify/blobs` v8.1.0
**Consistency:** Strong (eventual அல்ல)
**Store name:** `feed-cache`

### கேச்சிங் எவ்வாறு வேலை செய்கிறது

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────┐
│ scheduled-fetch  │────▶│  Netlify Blobs    │◀────│ On-demand    │
│ (ஒவ்வொரு 4 மணி) │     │  (JSON cache)     │     │ functions    │
│                  │     │                   │     │ (உடனடி)     │
│ Reddit, Twitter, │     │ reddit-posts      │     │ Cache-       │
│ News, Instagram  │     │ twitter-posts     │     │ லிருந்து     │
│ பெறுகிறது       │     │ news-articles     │     │ serve        │
└──────────────────┘     │ instagram-posts   │     └──────────────┘
                         └──────────────────┘
```

**Cache-first உத்தி:**
1. On-demand function Blobs-ல் cache செய்யப்பட்ட தரவை சோதிக்கிறது
2. Cache hit → உடனடியாக திருப்புகிறது (sub-50ms பதில்)
3. Cache miss → நேரடியாக பெறுகிறது, Blobs-க்கு எழுதுகிறது, திருப்புகிறது
4. நேரடி fetch தோல்வியடைந்தால் → cache-ல் உள்ளதை திருப்புகிறது (பழையதாக இருந்தாலும், ஒன்றுமில்லாமல் இருப்பதை விட நல்லது)

இது feed செயலிழப்புகள் (Reddit rate limits, Nitter downtime) சற்று பழைய தரவை விளைவிக்கும் — UI உடைவதில்லை.

---

## Resend (மின்னஞ்சல் விநியோகம்)

**Package:** `resend` v6.9.3
**பயன்படுத்துவது:** `daily-digest.mjs`
**From address:** `digest@janvayu.in`

### தினசரி சுருக்க flow

1. `daily-digest.mjs` காலை 8:00 AM IST-க்கு இயங்குகிறது (Netlify scheduled function)
2. சந்தாதாரரின் நகரங்களுக்கான நேரடி AQI-ஐ WAQI-லிருந்து பெறுகிறது
3. AQI தரவு, போக்குகள் மற்றும் சுகாதார வழிகாட்டுதலுடன் சுத்தமான HTML மின்னஞ்சலை வடிவமைக்கிறது
4. Resend API வழியாக அனுப்புகிறது

**ஏன் Resend (SendGrid/Mailgun-ஐ விட):**
- சுத்தமான API, குறைந்தபட்ச குறியீடு
- Free tier JanVayu-ன் சந்தாதாரர் எண்ணிக்கையை உள்ளடக்குகிறது
- இந்திய மின்னஞ்சல் வழங்குநர்களுக்கு (Gmail India, Outlook India) நல்ல deliverability
- Built-in bounce/complaint handling

---

## WAQI API (கிளையண்ட்-பக்கம்)

World Air Quality Index API என்பது உலாவியிலிருந்து நேரடியாக அழைக்கப்படும் ஒரே வெளிப்புற API.

**Token:** Free-tier public key (கிளையண்ட் JS-ல் உட்பொதிக்கப்பட்டது — இது வடிவமைப்பால், கசிவு அல்ல)
**புதுப்பிப்பு:** `setInterval` வழியாக ஒவ்வொரு 10 நிமிடம்
**பயன்படுத்தப்படும் Endpoints:**
- `api.waqi.info/feed/{city}/` — ஒற்றை நகர AQI
- `api.waqi.info/map/bounds/` — புவியியல் எல்லைகளுக்குள் நிலையங்கள்

**ஏன் கிளையண்ட்-பக்கம்:**
- நிகழ்நேர தரவு (கேச்சிங் தாமதம் இல்லை)
- Free tier-ல் பொது பயன்பாட்டில் API key கட்டுப்பாடு இல்லை
- Serverless function invocations-ஐ குறைக்கிறது
