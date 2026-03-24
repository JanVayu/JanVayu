# Skills आणि AI Prompts

हा विभाग AI skill फाइल्स — system prompts, निर्देश patterns, आणि prompt engineering निर्णयांचे दस्तऐवजीकरण करतो.

---

## Skill फाइल म्हणजे काय?

एक संरचित system prompt जो AI model ला सांगतो की विशिष्ट संदर्भात कसे वागायचे:
- Model ची **भूमिका आणि व्यक्तिमत्व**
- मिळणारा **डेटा**
- **Output स्वरूप**
- **स्वर, लांबी, आणि दाव्यांवर मर्यादा**
- टाळायचे **अपयश modes**

---

## Skills

| Skill | Function |
|-------|----------|
| [हवा गुणवत्ता सहाय्यक](air-quality-assistant.md) | `air-query.mjs` |
| [आरोग्य सल्लागार](health-advisory.md) | `health-advisory.mjs` |
| [उत्तरदायित्व Brief लेखक](accountability-brief.md) | `accountability-brief.mjs` |
| [विसंगती स्पष्टीकरणकार](anomaly-explainer.md) | `anomaly-check.mjs` |
| [Coding पद्धती](coding-practices.md) | विकास कार्यप्रवाह |
| [Visual Design](visual-design.md) | UI/UX निर्णय |
| [स्वयंचलन](automation.md) | नियोजित कार्ये |

---

## सामान्य prompting तत्त्वे

1. **वास्तविक डेटावर आधारित** — model कधीही स्मृतीतून उत्तर देत नाही
2. **अचूक output स्वरूप** — विशेषतः उत्तरदायित्व brief साठी
3. **लांबी मर्यादित** — प्रत्येक prompt मध्ये स्पष्ट शब्द/token मर्यादा
4. **अपयश modes नामांकित** — "सामान्य सल्ला देऊ नका"
5. **बहुभाषिक** — "प्रश्नाच्या भाषेत उत्तर द्या"
6. **Graceful fallback** — प्रत्येक function मध्ये non-AI पर्याय
