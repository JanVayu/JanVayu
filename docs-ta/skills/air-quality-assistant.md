# Skill: காற்று தர உதவியாளர்

**பயன்படுத்தப்படுவது:** `netlify/functions/air-query.mjs`
**Model:** Gemini 2.5 Flash
**தூண்டுதல்:** பயனர் சாதாரண மொழி கேள்வி + நகரப் பெயரை சமர்ப்பிக்கிறார்

---

## இந்த Skill என்ன செய்கிறது

ஒரு நகரத்தின் தற்போதைய காற்று தரம் பற்றிய இயற்கை மொழி கேள்வியை ஏற்றுக்கொள்கிறது, WAQI-லிருந்து நேரடி AQI மற்றும் PM2.5-ஐ பெற்று, தரவு அடிப்படையிலான, குறிப்பிட்ட பதிலை திருப்புகிறது. பொதுவான ஆலோசனை கொடுப்பதிலிருந்து model வெளிப்படையாக தடுக்கப்படுகிறது — கொடுக்கப்பட்ட உண்மையான எண்களை மேற்கோள் காட்ட வேண்டும்.

---

## System Prompt (துல்லியம்)

```
You are JanVayu's air quality assistant for India. Answer questions in plain,
direct language. Use the actual numbers provided — do not give generic advice.
If the question is about health, be honest about risk without causing panic.
Always cite the data you are using. Respond in the same language the question
is asked in — if Hindi, respond in Hindi using Devanagari script. Keep
responses under 150 words.
```

---

## Model-க்கு அனுப்பப்படும் தரவு சூழல்

```
City: {city}, AQI: {aqi}, PM2.5: {pm25} µg/m³, PM10: {pm10} µg/m³,
Station: {station}, Updated: {time}, WHO PM2.5 guideline: 5 µg/m³.

Question: {user_question}
```

Model மடங்கை கணக்கிட்டு கூறும் வகையில் WHO வழிகாட்டுதல் வெளிப்படையாக சேர்க்கப்படுகிறது (எ.கா., "டெல்லியின் PM2.5 தற்போது WHO பாதுகாப்பு வரம்பை விட 18 மடங்கு").

---

## முக்கிய வடிவமைப்பு முடிவுகள்

**ஏன் "பொதுவான ஆலோசனை கொடுக்காதே"?**
இந்தக் கட்டுப்பாடு இல்லாமல், LLMs உண்மையான அளவீட்டைப் பொருட்படுத்தாமல் "AQI அதிகமாக இருக்கும்போது வெளிப்புற செயல்பாட்டைக் கட்டுப்படுத்துங்கள்" போன்ற மாதிரிப்படி பதில்களை கொடுக்கும். Prompt model-ஐ கொடுக்கப்பட்ட குறிப்பிட்ட மதிப்பில் நிலைநிறுத்த கட்டாயப்படுத்துகிறது.

**ஏன் பன்மொழி?**
JanVayu-ன் பயனர்கள் ஹிந்தி, தமிழ், பெங்காலி மற்றும் பிற மொழிகளை பயன்படுத்துகின்றனர். ஹிந்தியில் கேட்கப்பட்ட கேள்வி ஹிந்தியில் பதிலை தகுதிப்படுத்துகிறது.

**ஏன் 150 சொற்கள்?**
பதில் தள UI-ல் inline-ஆக தோன்றுகிறது. நீண்ட பதில்கள் layout-ஐ உடைக்கும், வாசகர்களை இழக்கும். சுருக்கம் குறிப்பிட்டத்தன்மையையும் கட்டாயப்படுத்துகிறது.

**ஏன் WHO வழிகாட்டுதலை தரவு சூழலில் சேர்க்கிறோம்?**
87 µg/m³-ஐ விளக்குவது கடினம்; "WHO வழிகாட்டுதலை விட 17 மடங்கு" என்பது எளிதாக புரியும்.

---

## Fallback நடத்தை

Gemini API அழைப்பு தோல்வியடைந்தால் (rate limit, network error), function திருப்புகிறது:

```
AI analysis unavailable right now (rate limit). Raw PM2.5: {pm25} µg/m³.
```

AI கிடைக்கிறதா இல்லையா என்பதைப் பொருட்படுத்தாமல் raw data எப்போதும் திருப்பப்படுகிறது.
