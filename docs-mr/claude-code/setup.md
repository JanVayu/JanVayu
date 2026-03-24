# Claude Code सेटअप आणि कॉन्फिगरेशन

JanVayu च्या विकासासाठी वापरलेले Claude Code कॉन्फिगरेशन.

---

## CLAUDE.md — प्रकल्प निर्देश

JanVayu सध्या `CLAUDE.md` फाइल वापरत नाही. प्रकल्प conventions Git hooks, `.editorconfig`, आणि `.gitmessage` द्वारे लागू होतात.

### Fork साठी शिफारस केलेले CLAUDE.md

```markdown
# CLAUDE.md — JanVayu प्रकल्प निर्देश

## आर्किटेक्चर
- एकच HTML फाइल (index.html) — सर्व CSS आणि JS इनलाइन
- कोणतेही framework नाही, कोणतेही build step नाही

## कोड शैली
- Vanilla JavaScript (ES2020 कमाल)
- 2-space indentation

## Commit संदेश
Add, Fix, Update, Translate, Docs, Refactor, Test, CI, Chore, Merge ने सुरू करा

## हे करू नका
- Framework जोडा (React, Vue, Angular)
- Build step जोडा
- Client मध्ये API keys उघड करा
```

---

## Skill फाइल्स

Skill फाइल्स म्हणजे संरचित system prompts. JanVayu चारही Gemini वैशिष्ट्यांसाठी त्यांचा वापर करते.

तपशीलवार माहिती: [Skills विभाग](../skills/README.md)

---

## MCP Server एकत्रीकरण

विकासादरम्यान उपलब्ध MCP एकत्रीकरणे:
- **Notion** — प्रकल्प नियोजन
- **Gmail** — संवाद संदर्भ
- **Figma** — Design-to-code
- **Google Calendar** — वेळापत्रक
- **Excalidraw** — आर्किटेक्चर आकृत्या

---

## परवानग्या

शिफारस केलेल्या परवानगी सेटिंग्ज:
- ✅ Read, Write, Edit, Glob, Grep
- ✅ `npm install`, `netlify dev`, `git *`, `gh pr *`
- ❌ `rm -rf *`, `git push --force *`, `git reset --hard *`
