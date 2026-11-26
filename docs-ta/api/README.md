# API குறிப்பு
இந்த பக்கம் 12 பொது endpoints-களை பட்டியலிடுகிறது (11 Netlify Functions மற்றும் `/api` open-data entry point; அவற்றில் ஒன்று, `/twitter-feed`, தற்போது பயன்பாட்டில் இல்லை). தளத்தின் சொந்த பக்கங்கள் அழைக்கும் மேலும் இரண்டு, `/waqi-proxy` மற்றும் `/air-model`, ஆகியவை [Netlify Functions](../technical/netlify-functions.md) இல் விவரிக்கப்பட்டுள்ளன. இவை அனைத்தும் பொதுவில் அணுகக்கூடியவை மற்றும் CORS-ஐ ஆதரிக்கின்றன. இவை JSON-ஐ திருப்பித் தருகின்றன, CSV export-ஐ தவிர, இது `text/csv`-ஐ திருப்பித் தருகிறது. இந்த repository-யில் Open Data API-க்கு பின்னால் உள்ள மேலும் சில functions (rankings, reference-data, historical-aqi, community-sensors, status-history) மற்றும் internal functions-களும் உள்ளன.
**Base URL:** `https://www.janvayu.in/.netlify/functions`
---
## விரைவான குறிப்பு
### AI அம்சங்கள் (முதலில் v25.1 இல் வெளியிடப்பட்டது)
| Endpoint | Method | விளக்கம் |
|----------|--------|-------------|
| `/air-query` | POST | இயல் மொழி AQI கேள்வி-பதில் |
| `/health-advisory` | POST | தனிப்பயனாக்கப்பட்ட சுகாதார ஆலோசனை |
| `/accountability-brief` | POST | வார்டு அளவிலான நிர்வாக சுருக்கங்கள் |
| `/anomaly-check` | GET | PM2.5 அதிகரிப்பு கண்டறிதல் |
### சமூக ஊடக ஃபீட்கள்
| Endpoint | Method | விளக்கம் |
|----------|--------|-------------|
| `/reddit-feed` | GET | சேமிக்கப்பட்ட Reddit பதிவுகள் |
| `/twitter-feed` | — | **பயன்பாட்டில் இல்லை.** பொது நிகழ்வுகள் இல்லாத Nitter-ஐ படிக்கவும்; இந்த endpoint இனி பதிலளிக்காது மற்றும் யாரும் இதைப் பயன்படுத்துவதில்லை. |
| `/youtube-feed` | GET | YouTube சேனல் RSS-லிருந்து சேமிக்கப்பட்ட இந்திய காற்று தர வீடியோக்கள் |
| `/news-proxy` | GET | சேமிக்கப்பட்ட செய்தி கட்டுரைகள் |
| `/instagram-feed` | GET | சேமிக்கப்பட்ட Instagram பதிவுகள் |
### தளம்
| Endpoint | Method | விளக்கம் |
|----------|--------|-------------|
| `/subscribe` | POST | மின்னஞ்சல் சந்தா மேலாண்மை |
| `/feed-status` | GET | ஃபீட் சுகாதார கண்காணிப்பு |
### திறந்த தரவு
| Endpoint | Method | விளக்கம் |
|----------|--------|-------------|
| `/api` | GET | பதிப்பு தரவு manifest + CSV export |
---
## Open Data API
JanVayu வெளியிடும் தரவுத்தொகுப்புகளுக்கான ஒரே, எளிதில் கண்டறியக்கூடிய entry point — பத்திரிகையாளர்கள், ஆராய்ச்சியாளர்கள் மற்றும் forks-க்காக உருவாக்கப்பட்டது. Read-only, CORS-open, மேற்கோள் காட்டினால் இலவசமாகப் பயன்படுத்தலாம்.
**Manifest (ஒவ்வொரு தரவுத்தொகுப்பு, அதன் அளவுருக்கள், உரிமம் மற்றும் மேற்கோளை பட்டியலிடுகிறது):**
```bash
curl https://www.janvayu.in/api
```
**தற்போதைய நகர தரவரிசைகளின் CSV export:**
```bash
curl "https://www.janvayu.in/api?dataset=rankings&format=csv"          # தற்போதைய நிலை
curl "https://www.janvayu.in/api?dataset=rankings&format=csv&range=week" # 7-நாள் சராசரி
curl "https://www.janvayu.in/api?dataset=rankings&format=csv&range=month" # 30-நாள் சராசரி
```
`rankings` function `range=live`, `range=week` மற்றும் `range=month` ஆகியவற்றை புரிந்துகொள்கிறது. manifest-இல் பட்டியலிடப்பட்டுள்ள `7d` மற்றும் `30d` உட்பட வேறு எந்த மதிப்பும் 30-நாள் வரம்பாகக் கருதப்படும்.
> **Known issue:** `/api` manifest-இல் `range=7d` விளம்பரப்படுத்தப்பட்டுள்ளது, ஆனால் rankings function-ஆல் இது அங்கீகரிக்கப்படவில்லை, எனவே இது 7-நாள் சராசரியை அல்லாமல் 30-நாள் சராசரியை வழங்குகிறது. code சரிசெய்யப்படும் வரை 7-நாள் சராசரிக்கு `range=week` என்பதைப் பயன்படுத்தவும்.
manifest அடிப்படை JSON endpoints-ஐ சுட்டிக்காட்டுகிறது — `rankings`, `reference-data` (CPCB stations / NCAP cities / IQAir annual), `historical-aqi`, `community-sensors`, மற்றும் `status-history` — இவை தனித்தனியாக அழைக்கப்படக்கூடியவை.
**Licence:** தரவு உள்ளடக்கம் CC BY-NC-SA 4.0; code MIT. manifest-இன் `citation` புலத்தில் காட்டப்பட்டுள்ளபடி மேற்கோள் காட்டவும்.
---
## OpenAPI Specification
முழுமையான OpenAPI 3.1 spec [`openapi.yaml`](https://www.janvayu.in/docs/api/openapi.yaml) இல் கிடைக்கிறது. இதை Swagger UI, Postman, Insomnia அல்லது OpenAPI-க்கு இணக்கமான எந்தவொரு கருவியிலும் import செய்யவும்.
---
## Authentication
Authentication தேவையில்லை. அனைத்து endpoints-உம் பொதுவானவை.
- **AI endpoints** Groq-இன் rate limits-ஐ சார்ந்துள்ளன
- **Feed endpoints** cache-இலிருந்து சேவை செய்கின்றன (ஒவ்வொரு 4 மணி நேரத்திற்கும் முன்பே fetch செய்யப்படுகிறது)
- **CORS:** அனைத்து பதில்களிலும் `Access-Control-Allow-Origin: *`
---
## Common Response Patterns
### Success
upstream அல்லது AI தோல்விகளுக்கு endpoints HTTP 200-ஐ வழங்குகின்றன (ஒரு fallback body உடன்), ஆனால் தவறான உள்ளீட்டிற்கு 400, தவறான method-க்கு 405, மற்றும் internal அல்லது upstream பிழைகளில் 500 அல்லது 502-ஐ வழங்குகின்றன (உதாரணமாக rankings CSV-ஐ உருவாக்க முடியாதபோது `/api` 502-ஐ வழங்குகிறது). status code மற்றும் response body-ஐ சரிபார்க்கவும்.
### Fallback
Groq rate-limited ஆக இருந்தால் AI endpoints மூலத் தரவை (AI பகுப்பாய்வு இல்லாமல்) வழங்குகின்றன. live fetches தோல்வியுற்றால் Feed endpoints பழைய cache-ஐ வழங்குகின்றன.
### CORS Preflight
அனைத்து POST endpoints-உம் 204 No Content உடன் OPTIONS கோரிக்கைகளைக் கையாளுகின்றன.
---
## Example Requests
### Ask about air quality
```bash
curl -X POST https://www.janvayu.in/.netlify/functions/air-query \
  -H "Content-Type: application/json" \
  -d '{"city": "delhi", "question": "Is it safe to go for a run today?"}'
```
### Get health advisory
```bash
curl -X POST https://www.janvayu.in/.netlify/functions/health-advisory \
  -H "Content-Type: application/json" \
  -d '{"city": "mumbai", "age": 35, "conditions": ["asthma"], "hoursOutdoor": 3}'
```
### Check anomalies
```bash
curl https://www.janvayu.in/.netlify/functions/anomaly-check
```
### Get Reddit feed
```bash
curl https://www.janvayu.in/.netlify/functions/reddit-feed?filter=delhi
```
>
### சுருக்கத்திற்கு சந்தா செலுத்துங்கள்
```bash
curl -X POST https://www.janvayu.in/.netlify/functions/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "cities": ["delhi", "mumbai"], "pm25_threshold": 90}'
```
