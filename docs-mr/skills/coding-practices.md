# Skill: Coding पद्धती

AI सहाय्याने JanVayu codebase बनवताना वापरलेले prompt patterns.

---

## मूलभूत तत्त्व: मर्यादा-प्रथम prompting

> "Vanilla JavaScript only. No frameworks. No npm imports in the frontend. No build step."

ही मर्यादा नसती तर AI React components आणि Webpack configs देईल.

---

## Prompt Patterns

### 1. "नागरिक डेटा" pattern
```
एक [वैशिष्ट्य] लिहा. डेटा [स्रोत] कडून येतो.
Plain HTML/CSS/JS मध्ये, कोणतेही framework नाही.
प्रेक्षक 2G connection वर असू शकतात.
Load speed ला प्राधान्य द्या.
```

### 2. "Serverless function" pattern
```
Netlify Function (ES module, .mjs) लिहा:
- CORS preflight हाताळा
- JSON परत करा
- प्रत्येक बाह्य कॉल वर try/catch
- Secrets process.env मधून वाचा
- Graceful fallback समाविष्ट करा
```

### 3. "Debugging" pattern
```
हे function [त्रुटी] परत करत आहे.
Function पुन्हा लिहू नका.
समस्येची विशिष्ट ओळ ओळखा.
किमान बदल सुचवा.
```

---

## AI ला काय सांगू नये

| सांगू नका | का |
|-----------|-----|
| "TypeScript जोडा" | Build step आवश्यक |
| "Performance सुधारा" | जटिलता वाढवेल |
| "Modern बनवा" | Framework dependency |
