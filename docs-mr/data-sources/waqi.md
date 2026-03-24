# रिअल-टाइम AQI (WAQI)

WAQI (World Air Quality Index) API हा JanVayu चा प्राथमिक रिअल-टाइम डेटा स्रोत आहे.

---

## WAQI म्हणजे काय?

WAQI प्रकल्प जगभरातील 12,000+ monitoring stations कडून रिअल-टाइम हवा गुणवत्ता डेटा गोळा करतो.

---

## JanVayu मध्ये वापर

- **500+ भारतीय stations** कव्हर
- **प्रत्येक 10 मिनिटांनी** auto-refresh
- **Client-side** कॉल (थेट browser मधून)
- **Free-tier** public token

## उपलब्ध डेटा
- AQI (Air Quality Index)
- PM2.5 (µg/m³)
- PM10, NO2, SO2, CO, O3
- तापमान, आर्द्रता, वाऱ्याची गती

## API Endpoints
- `api.waqi.info/feed/{city}/` — एकच शहर
- `api.waqi.info/map/bounds/` — भौगोलिक सीमेतील stations
