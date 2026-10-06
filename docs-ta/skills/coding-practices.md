# திறன்: கோடிங் நடைமுறைகள்

AI உதவியுடன் JanVayu-வின் கோட் பேஸை (codebase) உருவாக்கும்போது பயன்படுத்தப்படும் ப்ராம்ப்டிங் (prompting) மற்றும் டெவலப்மென்ட் முறைகள் இவை. எந்தவொரு சிவிிக் டெக் (civic tech) அல்லது டேட்டா-டிரிவன் (data-driven) வெப் ப்ராஜெக்ட்டுக்கும் இவற்றை மீண்டும் பயன்படுத்தலாம்.

---

## முக்கிய கொள்கை: கட்டுப்பாடுகளுக்கு முன்னுரிமை அளிக்கும் ப்ராம்ப்டிங்

JanVayu-க்காக AI-யிடம் கோட் எழுதச் சொல்லும்போது, என்ன செய்ய வேண்டும் என்பதை விட **என்ன செய்யக் கூடாது** என்பதைத் தெளிவாகக் குறிப்பிடுவதுதான் மிக முக்கியம். LLM-களின் இயல்பான தன்மை என்னவென்றால், அவை ஃபிரேம்வொர்க்குகள் (frameworks), டிபென்டன்ஸிகள் (dependencies) மற்றும் சிக்கலான விஷயங்களை நோக்கிச் செல்லும். JanVayu வேண்டுமென்றே எந்த ஃபிரேம்வொர்க்கும் இல்லாமல் (zero-framework) உருவாக்கப்பட்டுள்ளது. கோட் ப்ராம்ப்ட்கள் பொதுவாக இப்படிப்பட்ட ஒரு கட்டுப்பாட்டுடன் தொடங்கும்:

> "Vanilla JavaScript மட்டும். எந்த ஃபிரேம்வொர்க்குகளும் வேண்டாம். ஃபிரண்ட்எண்டில் (frontend) npm இம்போர்ட்ஸ் (imports) வேண்டாம். பில்ட் ஸ்டெப் (build step) வேண்டாம்."

இதைச் செய்யாவிட்டால், எந்த ஃபிரேம்வொர்க்கும் தேவையில்லாத ஒரு ப்ராஜெக்ட்டுக்கு React காம்போனென்ட்கள், Webpack கான்ஃபிக்ஸ் மற்றும் TypeScript இன்டர்ஃபேஸ்கள் என எல்லாமே உங்களுக்குக் கிடைக்கும்.

---

## பயன்படுத்தப்படும் ப்ராம்ப்ட் முறைகள்

### 1. "Civic Data" முறை

பொதுமக்களின் நலன் சார்ந்த டேட்டாவைக் காட்டும் எந்தவொரு அம்சத்திற்கும்:

```
Write a [feature] for a civic data platform. The data comes from [source].
Display it in plain HTML/CSS/JS with no framework. The audience includes 
people who may be accessing this on a 2G connection or a low-end Android phone.
Prioritise load speed over visual complexity.
```

AQI டேஷ்போர்டு மற்றும் நகர ஒப்பீட்டு அட்டவணை போன்ற டேஷ்போர்டு பாணிப் பிரிவுகளுக்கு இந்த முறை பயன்படுத்தப்பட்டது.

**இது ஏன் வேலை செய்கிறது:** பார்வையாளர்களைக் (குறைந்த திறன் கொண்ட சாதனம், மெதுவான இன்டர்நெட்) குறிப்பிடுவது, AI-ஐ சரியான சமரசங்களைச் செய்யத் தூண்டுகிறது — லேஸி-லோடட் (lazy-loaded) படங்கள் வேண்டாம், எளிமையான டேட்டாவுக்குக் கனமான சார்ட் லைப்ரரிகள் வேண்டாம், ப்ரோக்ரஸிவ் என்ஹான்ஸ்மென்ட் (progressive enhancement) வேண்டும்.

---

### 2. "Serverless Function" முறை

ஒவ்வொரு Netlify Function-க்கும்:

```
Write a Netlify Function (ES module, .mjs) that does [task].
Requirements:
- Handle CORS preflight (OPTIONS)
- Return JSON with appropriate HTTP status codes
- Use try/catch on every external call
- Never hardcode secrets — use process.env
- Include a graceful fallback if the external API fails
- Log errors with console.log, not throw
```

`netlify/functions/`-ல் உள்ள ஃபங்ஷன்களுக்குப் பின்னால் உள்ள டெம்ப்ளேட் இதுதான். இதில் "graceful fallback" (அழகான மாற்று வழி) தேவை என்பது மிகவும் முக்கியமானது — மூன்றாம் தரப்பு API (Reddit, Nitter, WAQI) வேலை செய்யாதபோது, முழு UI அம்சமும் உடைந்து போவதைத் தடுக்கிறது.

---

### 3. "API Proxy" முறை

வெளிப்புற ஃபீட்களை (Reddit, செய்திகள்) ப்ராக்ஸி (proxy) செய்யும் ஃபங்ஷன்களுக்கு:
```
ஒரு Netlify Function-ஐ எழுதுங்கள், அது:
1. முதலில் Netlify Blobs cache-ல் ஒரு புதிய காப்பியை (4 மணி நேரத்திற்கும் குறைவானது) சரிபார்க்க வேண்டும்
2. Cache-ல் டேட்டா இருந்தால், cache-லிருந்து உடனடியாக return செய்ய வேண்டும்
3. Cache பழையதாகவோ அல்லது காலியாகவோ இருந்தால், [source]-லிருந்து fetch செய்து, cache-ல் எழுதி, பிறகு return செய்ய வேண்டும்
4. Live fetch தோல்வியடைந்தால், cache-ல் உள்ளதை return செய்ய வேண்டும் (பழசானதாக இருந்தாலும்)
5. எப்போதும் ஏதேனும் ஒன்றை return செய்ய வேண்டும் — body இல்லாமல் 500 error-ஐ ஒருபோதும் தரக்கூடாது
```

இந்த cache-first pattern, feed outages (Nitter instances down ஆவது, Reddit rate limits) ஏற்படும்போது UI உடைவதற்குப் பதிலாக, சற்று பழைய டேட்டா கிடைப்பதை உறுதி செய்கிறது.

---

### 4. "Accessibility Audit" Pattern

எந்தவொரு HTML section-ஐ எழுதிய பிறகும்:

```
Accessibility பிரச்சனைகளுக்காக இந்த HTML-ஐ review செய்யவும். இவற்றைச் சரிபார்க்கவும்:
- அனைத்து interactive elements-ம் keyboard-navigable ஆக இருக்க வேண்டும்
- அனைத்து images-க்கும் அர்த்தமுள்ள alt text இருக்க வேண்டும் ("image" அல்லது filename ஆக இருக்கக்கூடாது)
- Colour contrast WCAG AA-ஐ பூர்த்தி செய்ய வேண்டும் (text-க்கு 4.5:1)
- Form inputs-க்கு தொடர்புடைய labels இருக்க வேண்டும்
- Semantic HTML போதுமானதாக இல்லாத இடங்களில் மட்டுமே ARIA roles பயன்படுத்தப்பட வேண்டும்
பொதுவான ஆலோசனைகளை அல்லாமல், குறிப்பிட்ட fixes-ஐ list செய்யவும்.
```

"பொதுவான ஆலோசனைகளை அல்லாமல், குறிப்பிட்ட fixes-ஐ list செய்யவும்" என்பதுதான் முக்கிய constraint — இது இல்லையென்றால், செயல்படக்கூடிய line-specific பிரச்சனைகளுக்குப் பதிலாக WCAG guidelines-ன் checklist-ஐப் பெறுவீர்கள்.

---

### 5. "Refactor for Readability" Pattern

`index.html`-ன் ஒரு section சிக்கலானதாக மாறும்போது:

```
படிக்க எளிதாக இருக்கும்படி இந்த JavaScript function-ஐ refactor செய்யவும். தேவைகள்:
- செயல்பாட்டில் எந்த மாற்றமும் இருக்கக்கூடாது
- Magic numbers-ஐ அவற்றின் மூலத்தை விளக்கும் comments-உடன் named constants-ஆக பிரிக்கவும்
- முடிந்தவரை comment blocks-க்கு பதிலாக self-documenting variable names-ஐப் பயன்படுத்தவும்
- Function என்ன செய்கிறது, அதன் inputs, மற்றும் அதன் return value ஆகியவற்றை விளக்கும் JSDoc comment-ஐச் சேர்க்கவும்
- ES2020-க்கு அப்பால் புதிய dependencies அல்லது language features-ஐ அறிமுகப்படுத்த வேண்டாம்
```

"செயல்பாட்டில் எந்த மாற்றமும் இருக்கக்கூடாது" என்ற constraint, AI logic-ஐ மாற்றி rewrite செய்வதன் மூலம் "மேம்படுத்துவதை" தடுக்கிறது; இது bugs-ஐ உருவாக்கும்.

---

## ஒரு AI-யிடம் எதைக் கேட்பதைத் தவிர்க்க வேண்டும்

| கேட்க வேண்டியது | தவிர்க்க வேண்டியதற்கான காரணம் |
|-----|-------------|
| "TypeScript-ஐச் சேர்க்கவும்" | ஒரு build step தேவை; zero-framework principle-ஐ உடைக்கிறது |
| கட்டுப்பாடுகள் இல்லாமல் "performance-ஐ மேம்படுத்தவும்" | பெரும்பாலும் lazy loading, code splitting, அல்லது caching strategies-ஐ உருவாக்கும்; இது சிக்கலைச் சேர்க்கும் |
| "இதை இன்னும் modern ஆக மாற்றுங்கள்" | Framework dependencies-ஐ உருவாக்கும் |
| Test framework-ஐக் குறிப்பிடாமல் "tests-ஐச் சேர்க்கவும்" | Jest, Vitest, அல்லது அது போன்றவற்றைச் சேர்க்கும் — இவை அனைத்தும் npm மற்றும் ஒரு build step-ஐக் கோரும் |
| "CSS-ஐ optimize செய்யவும்" | பெரும்பாலும் நோக்கத்திற்காக உருவாக்கப்பட்ட CSS variables-ஐ நீக்கும் அல்லது theming-ஐ உடைக்கும் வகையில் styles-ஐ ஒருங்கிணைக்கும் |

---

## Debugging Pattern

ஒரு Netlify Function சரியாக வேலை செய்யாதபோது:
```
இந்த Netlify Function [பிழை/தவறான வெளியீட்டை] திருப்பித் தருகிறது. 
இதோ அந்த function: [code]
இந்த சிக்கலை ஏற்படுத்தும் request இதோ: [curl அல்லது fetch call]
இதோ உண்மையான response: [response]
இதோ எதிர்பார்க்கப்படும் response: [expected]

function-ஐ மீண்டும் எழுத வேண்டாம். சிக்கலை ஏற்படுத்தும் குறிப்பிட்ட வரியைக் கண்டறிந்து 
அது ஏன் நடக்கிறது என்பதை விளக்குங்கள். பின்னர் அதைச் சரிசெய்ய குறைந்தபட்ச மாற்றத்தை முன்மொழியுங்கள்.
```

"function-ஐ மீண்டும் எழுத வேண்டாம்" மற்றும் "குறைந்தபட்ச மாற்றம்" ஆகியவை முக்கியமான கட்டுப்பாடுகள். 
இவை இல்லாமல், AI முழு function-ஐயும் மாற்றி எழுதும் — இதனால் புதிய பிழைகள் உருவாகி, diff-ஐப் புரிந்துகொள்வது கடினமாகிவிடும்.
