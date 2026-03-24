# Skill: குறியீடு நடைமுறைகள்

இவை JanVayu-ன் codebase-ஐ AI உதவியுடன் உருவாக்கும்போது பயன்படுத்தப்பட்ட prompting மற்றும் மேம்பாட்டு patterns. எந்த civic tech அல்லது தரவு அடிப்படையிலான web திட்டத்திற்கும் மறுபயன்படுத்தக்கூடியவை.

---

## முக்கிய கொள்கை: கட்டுப்பாடு-முதல் Prompting

JanVayu-க்கு code எழுத AI-யிடம் கேட்கும்போது, என்ன செய்ய **வேண்டாம்** என்பதை குறிப்பிடுவது மிகவும் முக்கியம் — என்ன செய்ய வேண்டும் என்பது அல்ல. LLMs-ன் default நடத்தை frameworks, dependencies மற்றும் சிக்கலை நோக்கி செல்வது. JanVayu வேண்டுமென்றே சூன்ய-framework. ஒவ்வொரு code prompt-ம் ஒரு கட்டுப்பாட்டுடன் தொடங்கியது:

> "Vanilla JavaScript மட்டுமே. Frameworks இல்லை. Frontend-ல் npm imports இல்லை. Build படி இல்லை."

இது இல்லாமல், React components, Webpack configs மற்றும் TypeScript interfaces கிடைக்கும் — இவை எதுவும் தேவையில்லாத திட்டத்திற்கு.

---

## பயன்படுத்தப்பட்ட Prompt Patterns

### 1. "Civic Data" Pattern

பொது நலன் தரவை காட்டும் எந்த அம்சத்திற்கும்:

```
Write a [feature] for a civic data platform. The data comes from [source].
Display it in plain HTML/CSS/JS with no framework. The audience includes
people who may be accessing this on a 2G connection or a low-end Android phone.
Prioritise load speed over visual complexity.
```

### 2. "Serverless Function" Pattern

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

### 3. "API Proxy" Pattern

வெளிப்புற feeds-ஐ proxy செய்யும் functions-க்கு:

```
Write a Netlify Function that:
1. First checks a Netlify Blobs cache for a fresh copy (< 4 hours old)
2. If cache is warm, return immediately from cache
3. If cache is stale or empty, fetch from [source], write to cache, then return
4. If the live fetch fails, return whatever is in the cache (even if stale)
5. Always return something — never a 500 with no body
```

### 4. "Accessibility Audit" Pattern

HTML section எழுதிய பிறகு:

```
Review this HTML for accessibility issues. Check:
- All interactive elements are keyboard-navigable
- All images have meaningful alt text
- Colour contrast meets WCAG AA (4.5:1 for text)
- Form inputs have associated labels
- ARIA roles are used only where semantic HTML is insufficient
List specific fixes, not generic advice.
```

### 5. "Refactor for Readability" Pattern

```
Refactor this JavaScript function for readability. Requirements:
- No change in behaviour
- Extract magic numbers into named constants with comments
- Replace comment blocks with self-documenting variable names
- Add a JSDoc comment explaining the function
- Do not introduce new dependencies or language features beyond ES2020
```

---

## AI-யிடம் கேட்காமல் இருக்க வேண்டியவை

| கேட்பது | ஏன் தவிர்க்க வேண்டும் |
|-----|-------------|
| "TypeScript சேர்க்கவும்" | Build படி தேவை; சூன்ய-framework கொள்கையை உடைக்கிறது |
| கட்டுப்பாடுகள் இல்லாமல் "செயல்திறனை மேம்படுத்தவும்" | Lazy loading, code splitting போன்ற சிக்கலான உத்திகளை விளைவிக்கும் |
| "இதை மேலும் நவீனமாக்கவும்" | Framework dependencies-ஐ அறிமுகப்படுத்தும் |
| Test framework குறிப்பிடாமல் "Tests சேர்க்கவும்" | Jest, Vitest போன்றவை சேர்க்கும் — npm மற்றும் build படி தேவை |

---

## Debugging Pattern

```
This Netlify Function is returning [error/wrong output].
Here is the function: [code]
Here is the request that causes the issue: [curl or fetch call]
Here is the actual response: [response]
Here is the expected response: [expected]

Do not rewrite the function. Identify the specific line causing the issue
and explain why. Then propose the minimum change to fix it.
```

"Function-ஐ மீண்டும் எழுதாதே" மற்றும் "குறைந்தபட்ச மாற்றம்" ஆகியவை முக்கிய கட்டுப்பாடுகள்.
