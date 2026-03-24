# Skill: தானியங்கி

JanVayu-ன் திட்டமிடப்பட்ட பணிகள், cache கட்டமைப்பு மற்றும் தொடர் பராமரிப்பை வடிவமைக்கவும் prompt செய்யவும் பயன்படுத்தப்பட்ட patterns — மனித தலையீடு இல்லாமல் இயங்கும் தளத்தின் பகுதிகள்.

---

## முக்கிய கொள்கை: தெரியும்படி தோல்வியடை, அழகாக Degrade செய்

JanVayu-ன் ஒவ்வொரு automated system-ம் இரண்டு பண்புகளுடன் வடிவமைக்கப்பட்டது:

1. **தெரியும்படி தோல்வியடை** — ஏதாவது உடைந்தால், தெளிவாக log செய்து அர்த்தமுள்ள பதிலை திருப்பு, அமைதியான 500 அல்ல
2. **அழகாக degrade செய்** — பழைய அல்லது பகுதி தரவுடன் UI render ஆகும், வெறுமையாக போவதை விட

---

## திட்டமிடப்பட்ட Function Patterns

### "Cache Warmer" Pattern (`scheduled-fetch.mjs`)

```
Write a Netlify Scheduled Function that fetches [list of feeds] and stores
results in Netlify Blobs. Requirements:
- Fetch all feeds in parallel (Promise.allSettled — not Promise.all)
- Write a "last-fetch-time" key to Blobs after each run
- Write a "last-fetch-log" key summarising which feeds succeeded/failed
- If a feed fetch fails, write the previous cached value back with error flag
- The on-demand functions should check cache age and serve if < 4 hours old
```

**ஏன் `Promise.allSettled`, `Promise.all` அல்ல?**
`Promise.all` ஒன்று reject ஆனவுடன் நிலுவையில் உள்ள அனைத்து promises-ஐயும் ரத்து செய்கிறது. 5+ sources கொண்ட feed warmer-ல், ஒரு Reddit timeout news feed cache ஆவதை தடுக்கக் கூடாது.

---

### "Daily Digest" Pattern (`daily-digest.mjs`)

```
Write a Netlify Scheduled Function that:
1. Reads subscribers from Blobs (email, city preferences, threshold)
2. For each subscriber, fetches current AQI for their city
3. If AQI exceeds threshold, send an email via Resend
4. Log: total subscribers, emails sent, skipped, failed
5. Write log to Blobs as "last-email-log"
6. Never let a single subscriber failure abort the loop
```

"ஒரு சந்தாதாரர் தோல்வி loop-ஐ ரத்து செய்ய விடாதே" என்பது digest sender-க்கான மிக முக்கியமான கட்டுப்பாடு.

---

## Feed புத்தம்புதிய கட்டமைப்பு

```javascript
// நேரடியாக fetch செய்யுமா என்று முடிவெடுக்க முன் cache வயதை சோதி
const cacheAge = Date.now() - new Date(lastFetchTime).getTime();
const FOUR_HOURS = 4 * 60 * 60 * 1000;

if (cacheAge < FOUR_HOURS && cachedData) {
  return cachedData; // cache-லிருந்து serve செய்
}
// இல்லையெனில்: நேரடியாக fetch செய், cache-ஐ புதுப்பி, திருப்பு
```

**ஏன் 4 மணி நேரம்?**
Reddit, செய்திகள் மற்றும் Twitter/X feeds ~4 மணி நேர சுழற்சியில் அர்த்தமுள்ள வகையில் மாறுகின்றன. அடிக்கடி புதுப்பிப்பு rate limits-ஐ அடிக்கிறது; குறைவான புதுப்பிப்பு தளத்தை பழையதாக உணர வைக்கிறது.

---

## கண்காணிப்பு Pattern

`feed-status.js` lightweight health endpoint-ஆக செயல்படுகிறது:

```
Write a Netlify Function that reads Blobs keys:
- "last-fetch-time" (ISO timestamp)
- "last-fetch-log" (JSON: per-feed success/failure/count)
- "last-email-log" (JSON: digest send stats)

Return all three as JSON. This endpoint is called by the client on page
load to show "Data last updated: X".
```

இது automation-ஐ front end-லிருந்து கவனிக்கக்கூடியதாக ஆக்குகிறது — Netlify dashboard-ஐ அணுகாமல் தரவு புத்தம்புதிய நிலையை சோதிக்கலாம்.

---

## Cron நேர Pattern

அனைத்து scheduled functions-ம் UTC cron expressions-ஐ பயன்படுத்துகின்றன. IST offset எப்போதும் வெளிப்படையாக கணக்கிடப்படுகிறது:

```
IST = UTC + 5:30
8:00 AM IST = 2:30 AM UTC → cron: "30 2 * * *"
```

**Scheduled function-ஐ deploy செய்வதற்கு முன் UTC மாற்றங்களை சரிபார்க்க எப்போதும் நம்பகமான converter-ஐ பயன்படுத்தவும்.** DST குழப்பத்தால் ஒரு மணி நேர பிழைகள் (இந்தியா DST-ஐ பின்பற்றவில்லை என்றாலும்) digest emails-ஐ காலை 8-க்கு பதிலாக இரவு 9-க்கு வர வைத்துள்ளன.

---

## மற்ற திட்டங்களுக்கு மாற்றுதல்

cache-warmer + on-demand-server pattern இவற்றுக்கு மறுபயன்படுத்தக்கூடியது:
- Rate-limited அல்லது நம்பகமற்ற third-party APIs-லிருந்து தரவை காட்ட வேண்டிய திட்டங்கள்
- API கிடைக்குமா என்பதைப் பொருட்படுத்தாமல் வேகமான page loads எதிர்பார்க்கும் பயனர்கள்
- நிரந்தர database-ஐ வாங்க முடியாத திட்டங்கள் (Netlify Blobs serverless மற்றும் free-tier)

முக்கிய கட்டமைப்பு முடிவு: **fetch-ஐ serve-லிருந்து பிரிக்கவும்**. Scheduled function fetch செய்கிறது; on-demand function serve செய்கிறது. அவை Blobs cache மூலம் மட்டுமே தொடர்பு கொள்கின்றன.
