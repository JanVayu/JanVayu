# शेअरिंग आणि प्रतिकृती

JanVayu चा Claude Code कार्यप्रवाह कसा शेअर करायचा किंवा तुमच्या प्रकल्पासाठी कसा दोहरायचा.

---

## टीमसाठी

### नवीन योगदानकर्त्याला सामील करा
1. Repo clone करा
2. हे GitBook दस्तऐवज वाचा
3. Claude Code install करा: `npm install -g @anthropic-ai/claude-code`
4. Session सुरू करा: `cd JanVayu && claude`

---

## तुमच्या प्रकल्पासाठी

### पायरी 1: मर्यादा-प्रथम दृष्टिकोन अवलंबा
- प्रकल्प काय *वापरणार नाही* ते परिभाषित करा
- `CLAUDE.md` फाइल मध्ये लिहा

### पायरी 2: Skill फाइल्स तयार करा
AI वैशिष्ट्यांसाठी संरचित system prompts दस्तऐवजीकरण करा.

### पायरी 3: Git Hooks सेटअप करा
JanVayu चे `.githooks/` कॉपी करा.

---

## JanVayu दुसऱ्या शहरासाठी Fork करणे

JanVayu MIT-लायसन्स आहे:
1. GitHub वर Fork करा
2. `index.html` मध्ये शहर यादी अपडेट करा
3. `anomaly-check.mjs` मध्ये seasonal baselines बदला
4. WAQI station IDs अपडेट करा
5. स्थानिक भाषांमध्ये अनुवाद करा
6. तुमची Netlify साइट सेटअप करा

Claude Code या सर्व पायऱ्यांमध्ये मदत करू शकतो.
