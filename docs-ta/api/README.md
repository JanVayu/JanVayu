# API Reference

ஜான்வாயு 12 பொது எண்ட்பாயிண்ட்களை வழங்குகிறது (11 நெட்லிஃபை செயல்பாடுகள் மற்றும் `/api` திறந்த-தரவு நுழைவுப் புள்ளி; அவற்றில் ஒன்று, `/twitter-feed`, நிறுத்தப்பட்டது). இவை அனைத்தும் பொதுவில் அணுகக்கூடியவை மற்றும் CORS-ஐ ஆதரிக்கின்றன. இவை JSON-ஐ திருப்பித் தருகின்றன, CSV ஏற்றுமதியைத் தவிர, இது `text/csv`-ஐ திருப்பித் தருகிறது. களஞ்சியத்தில் திறந்த தரவு API (தரவரிசைகள், குறிப்பு-தரவு, வரலாற்று-AQI, சமூக-சென்சார்கள், நிலை-வரலாறு) மற்றும் உள் செயல்பாடுகளுக்குப் பின்னால் மேலும் பல செயல்பாடுகளும் உள்ளன.

**அடிப்படை URL:** `https://www.janvayu.in/.netlify/functions`

---

## விரைவான குறிப்பு

### AI அம்சங்கள் (v25.1)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/air-query` | POST | இயற்கை மொழி AQI கேள்வி-பதில் |
| `/health-advisory` | POST | தனிப்பயனாக்கப்பட்ட சுகாதார ஆலோசனை |
| `/accountability-brief` | POST | வார்டு அளவிலான நிர்வாக சுருக்கங்கள் |
| `/anomaly-check` | GET | PM2.5 ஸ்பைக் கண்டறிதல் |

### சமூக ஃபீட்கள்

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/reddit-feed` | GET | தற்காலிகமாக சேமிக்கப்பட்ட Reddit பதிவுகள் |
| `/twitter-feed` | — | **நிறுத்தப்பட்டது.** பொது நிகழ்வுகள் இல்லாத Nitter-ஐப் படிக்கவும்; இந்த எண்ட்பாயிண்ட் இனி பதிலளிக்காது மற்றும் எதுவும் அதை அழைக்காது. |
| `/youtube-feed` | GET | YouTube சேனல் RSS-லிருந்து தற்காலிகமாக சேமிக்கப்பட்ட இந்திய காற்று தர வீடியோக்கள் |
| `/news-proxy` | GET | தற்காலிகமாக சேமிக்கப்பட்ட செய்தி கட்டுரைகள் |
| `/instagram-feed` | GET | தற்காலிகமாக சேமிக்கப்பட்ட Instagram பதிவுகள் |

### தளம்

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/subscribe` | POST | மின்னஞ்சல் சந்தா மேலாண்மை |
| `/feed-status` | GET | ஃபீட் ஆரோக்கிய கண்காணிப்பு |

### திறந்த தரவு

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api` | GET | பதிப்பு தரவு வெளிப்பாடு + CSV ஏற்றுமதி |

---

## திறந்த தரவு API

ஜான்வாயு வெளியிடும் தரவுத்தொகுப்புகளுக்கான ஒற்றை, கண்டறியக்கூடிய நுழைவுப் புள்ளி — பத்திரிகையாளர்கள், ஆராய்ச்சியாளர்கள் மற்றும் ஃபோர்க்குகளுக்காக உருவாக்கப்பட்டது. படிக்க மட்டும், CORS-திறந்த, பண்புக்கூறுடன் பயன்படுத்த இலவசம்.

**வெளிப்பாடு (ஒவ்வொரு தரவுத்தொகுப்பு, அதன் அளவுருக்கள், உரிமம் மற்றும் மேற்கோளைப் பட்டியலிடுகிறது):**

```bash
curl https://www.janvayu.in/api
```

**நேரடி நகர தரவரிசைகளின் CSV ஏற்றுமதி:**

```bash
curl "https://www.janvayu.in/api?dataset=rankings&format=csv"          # live
curl "https://www.janvayu.in/api?dataset=rankings&format=csv&range=week" # 7-day average
curl "https://www.janvayu.in/api?dataset=rankings&format=csv&range=month" # 30-day average
```

`rankings` செயல்பாடு `range=live`, `range=week` மற்றும் `range=month` ஆகியவற்றை புரிந்துகொள்கிறது. வெளிப்பாட்டில் பட்டியலிடப்பட்டுள்ள `7d` மற்றும் `30d` உட்பட வேறு எந்த மதிப்பும் 30-நாள் வரம்பாகக் கருதப்படுகிறது.
> **தெரிந்த சிக்கல்:** `/api` மேனிஃபெஸ்டில் `range=7d` என்று குறிப்பிடப்பட்டுள்ளது, ஆனால் ரேங்கிங்ஸ் ஃபங்ஷனால் இது அடையாளம் காணப்படுவதில்லை. எனவே இது 7-நாள் சராசரியை அல்லாமல் 30-நாள் சராசரியையே வழங்குகிறது. கோட் சரிசெய்யப்படும் வரை 7-நாள் சராசரியைப் பெற `range=week` என்பதைப் பயன்படுத்தவும்.

மேனிஃபெஸ்ட் அடிப்படை JSON எண்ட்பாயிண்ட்களான — `rankings`, `reference-data` (CPCB ஸ்டேஷன்கள் / NCAP நகரங்கள் / IQAir ஆண்டுதோறும்), `historical-aqi`, `community-sensors`, மற்றும் `status-history` — ஆகியவற்றைக் குறிக்கிறது. இவை தனித்தனியாகவும் அழைக்கப்படலாம்.

**உரிமம்:** தரவு உள்ளடக்கம் CC BY-NC-SA 4.0; கோட் MIT. மேனிஃபெஸ்டின் `citation` ஃபீல்டில் காட்டப்பட்டுள்ளபடி மேற்கோள் காட்டவும்.

---

## OpenAPI Specification

முழுமையான OpenAPI 3.1 ஸ்பெக் [`openapi.yaml`](openapi.yaml) இல் கிடைக்கிறது. இதை Swagger UI, Postman, Insomnia அல்லது OpenAPI-க்கு இணக்கமான எந்தவொரு டூலிலும் இம்போர்ட் செய்து பயன்படுத்தலாம்.

---

## Authentication

ஆதென்டிகேஷன் தேவையில்லை. அனைத்து எண்ட்பாயிண்ட்களும் பொதுவானவை.

- **AI எண்ட்பாயிண்ட்கள்** Groq-இன் ரேட் லிமிட்களைச் சார்ந்துள்ளன
- **Feed எண்ட்பாயிண்ட்கள்** கேஷிலிருந்து (cache) வழங்கப்படுகின்றன (ஒவ்வொரு 4 மணி நேரத்திற்கும் முன்கூட்டியே பெறப்படும்)
- **CORS:** அனைத்து ரெஸ்பான்ஸ்களிலும் `Access-Control-Allow-Origin: *`

---

## Common Response Patterns

### Success
அப்ஸ்ட்ரீம் அல்லது AI தோல்விகளுக்கு எண்ட்பாயிண்ட்கள் HTTP 200-ஐத் தருகின்றன (ஃபால்பேக் பாடியுடன்). ஆனால் தவறான இன்புட்டிற்கு 400, தவறான மெத்தடிற்கு 405, மற்றும் உள் அல்லது அப்ஸ்ட்ரீம் பிழைகளில் 500 அல்லது 502-ஐத் தரும் (உதாரணமாக ரேங்கிங்ஸ் CSV-ஐ உருவாக்க முடியாதபோது `/api` 502-ஐத் தரும்). ஸ்டேட்டஸ் கோட் மற்றும் ரெஸ்பான்ஸ் பாடியைச் சரிபார்க்கவும்.

### Fallback
Groq-இல் ரேட் லிமிட் இருந்தால் AI எண்ட்பாயிண்ட்கள் மூல தரவை (AI பகுப்பாய்வு இல்லாமல்) வழங்கும். லைவ் ஃபெட்ச்கள் தோல்வியடைந்தால் Feed எண்ட்பாயிண்ட்கள் பழைய கேஷை வழங்கும்.

### CORS Preflight
அனைத்து POST எண்ட்பாயிண்ட்களும் 204 No Content உடன் OPTIONS கோரிக்கைகளைக் கையாளுகின்றன.

---

## Example Requests

### காற்றுத் தரம் பற்றி கேட்க

```bash
curl -X POST https://www.janvayu.in/.netlify/functions/air-query \
  -H "Content-Type: application/json" \
  -d '{"city": "delhi", "question": "Is it safe to go for a run today?"}'
```

### சுகாதார ஆலோசனையைப் பெற

```bash
curl -X POST https://www.janvayu.in/.netlify/functions/health-advisory \
  -H "Content-Type: application/json" \
  -d '{"city": "mumbai", "age": 35, "conditions": ["asthma"], "hoursOutdoor": 3}'
```

### முரண்பாடுகளைச் சரிபார்க்க

```bash
curl https://www.janvayu.in/.netlify/functions/anomaly-check
```

### Reddit ஃபீடைப் பெற

```bash
curl https://www.janvayu.in/.netlify/functions/reddit-feed?filter=delhi
```

### டைஜஸ்ட்டிற்கு சந்தா செலுத்த

```bash
curl -X POST https://www.janvayu.in/.netlify/functions/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "cities": ["delhi", "mumbai"]}'
```
