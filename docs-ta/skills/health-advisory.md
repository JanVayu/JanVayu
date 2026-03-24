# Skill: பொது சுகாதார ஆலோசகர்

**பயன்படுத்தப்படுவது:** `netlify/functions/health-advisory.mjs`
**Model:** Gemini 2.5 Flash
**தூண்டுதல்:** பயனர் சுயவிவரம் (வயது, சுகாதார நிலைமைகள், வெளிப்புற மணி நேரங்கள்) + நகரத்தை சமர்ப்பிக்கிறார்

---

## இந்த Skill என்ன செய்கிறது

தனிநபரின் பாதிப்பு சுயவிவரம் மற்றும் நகரத்தின் தற்போதைய PM2.5 அளவீட்டின் அடிப்படையில் தனிப்பயனாக்கப்பட்ட, செயல்படக்கூடிய சுகாதார ஆலோசனையை உருவாக்குகிறது. முக்கியமாக: இது தயங்காது. உறுதியான பரிந்துரையை கொடுக்கிறது — "வெளிப்புற வெளிப்பாட்டைக் கட்டுப்படுத்துவதை பரிசீலியுங்கள்" என்பதற்கு பதிலாக "மதியம் 2 மணி வரை வீட்டிற்குள் இருங்கள்".

---

## System Prompt (துல்லியம்)

```
You are a public health advisor specialising in air pollution exposure in India.
Given a person's profile and current air quality data, generate a specific,
actionable advisory. Be concrete: say 'stay indoors until 2pm' not 'limit
outdoor exposure'. Reference the actual PM2.5 value. If the person has a health
condition, address it directly. Do not hedge — give a clear recommendation.
3-4 sentences maximum. Respond in English.
```

---

## AI-க்கு முன் ஆபத்து கணக்கீடு

Gemini அழைப்புக்கு முன், function plain JavaScript-ல் `riskLevel`-ஐ கணக்கிடுகிறது — AI ஆலோசனைக்கு காத்திருக்காமல் UI நிறக்குறியீடு செய்ய இது எப்போதும் AI ஆலோசனையுடன் திருப்பப்படுகிறது:

```javascript
function getRiskLevel(pm25, conditions) {
  const hasSensitive = conditions && conditions.some(c => c !== "none");
  if (pm25 <= 12) return "low";
  if (pm25 <= 35) return hasSensitive ? "moderate" : "low";
  if (pm25 <= 55) return hasSensitive ? "high" : "moderate";
  if (pm25 <= 150) return hasSensitive ? "severe" : "high";
  return "severe";
}
```

---

## முக்கிய வடிவமைப்பு முடிவுகள்

**ஏன் "தயங்காதே"?**
சுகாதார தொடர்பு ஆராய்ச்சி நிலையாகக் காட்டுகிறது, தயங்கிய ஆலோசனை நேரடி ஆலோசனையை விட குறைவாக செயல்படுத்தப்படுகிறது. ஆஸ்துமா அல்லது இருதய நோய் கொண்ட மக்களுக்கு சேவை செய்யும் பொது சுகாதார கருவிக்கு, தயங்குவது நடுநிலையானது அல்ல — இது பாதுகாப்பு நடத்தையை குறைக்கிறது.

**ஏன் 3-4 வாக்கியங்கள் அதிகபட்சம்?**
அதிக மாசுபாட்டு அவசரநிலையின் போது படிக்க முயற்சி தேவைப்படும் சுகாதார ஆலோசனை படிக்கப்படாது. 10 விநாடிகளுக்குள் scan செய்யக்கூடியதாக இருக்க வேண்டும்.

**ஏன் `riskLevel`-ஐ model-ஐ நம்பாமல் JavaScript-ல் கணக்கிடுகிறோம்?**
நம்பகத்தன்மை. ஆபத்து அளவு UI நிறக்குறியீடு மற்றும் fallback messaging-ஐ இயக்குகிறது. LLM-க்கு அனுப்பினால் non-determinism அறிமுகப்படுத்தும். விதி-அடிப்படையிலான function AI கிடைக்கிறதா இல்லையா என்பதைப் பொருட்படுத்தாமல் நிலையான முடிவை உருவாக்குகிறது.

---

## Fallback நடத்தை

```
AI analysis unavailable. Raw data: {pm25} µg/m³ PM2.5 (AQI {aqi}).
```

`riskLevel` JavaScript function-லிருந்து கணக்கிடப்பட்டு திருப்பப்படுகிறது, எனவே AI உரை இல்லாமலும் UI நிறக்குறியீடு செய்யப்படும்.
