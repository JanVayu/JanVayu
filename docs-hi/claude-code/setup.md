# Claude Code Setup for JanVayu

यह पेज Claude Code के साथ JanVayu को डेवलप करने के लिए इस्तेमाल की गई सटीक कॉन्फ़िगरेशन को डॉक्यूमेंट करता है — जिसमें CLAUDE.md फ़ाइल, परमिशन सेटिंग्स और MCP इंटीग्रेशन्स शामिल हैं।

---

## CLAUDE.md — प्रोजेक्ट इंस्ट्रक्शन्स

JanVayu फिलहाल रिपॉजिटरी में `CLAUDE.md` फ़ाइल का इस्तेमाल नहीं करता है। इसके बजाय, प्रोजेक्ट की परंपराओं को इन तरीकों से लागू किया जाता है:

1. **Git hooks** (`.githooks/pre-commit` और `.githooks/commit-msg`) — कमिट मैसेज के फॉर्मेट को अपने आप लागू करते हैं और सेंसिटिव फ़ाइलों को ब्लॉक करते हैं
2. **`.editorconfig`** — इंडेंटेशन और एन्कोडिंग को स्टैंडर्डाइज़ करता है
3. **`.gitmessage`** — कमिट मैसेज टेम्पलेट
4. **इनलाइन डॉक्यूमेंटेशन** — README.md, CONTRIBUTING.md, और कोड कमेंट्स

### फोर्क्स के लिए अनुशंसित CLAUDE.md

अगर आप JanVayu को फोर्क करते हैं और Claude Code को प्रोजेक्ट-विशिष्ट इंस्ट्रक्शन्स देना चाहते हैं, तो रिपॉजिटरी रूट में एक `CLAUDE.md` फ़ाइल बनाएँ:

```markdown
# CLAUDE.md — JanVayu Project Instructions

## Architecture
- Three front-end files: index.html (markup), app.js (logic), styles.css (styling)
- No frameworks, no build step, no npm dependencies on the client
- Netlify Functions for server-side logic (ES modules, .mjs)
- Netlify Blobs for caching (strong consistency)

## Code Style
- Vanilla JavaScript only (ES2022, as set in eslint.config.mjs)
- CSS custom properties for theming
- 2-space indentation (HTML, CSS, JS, JSON)
- No TypeScript, no preprocessors

## Commit Messages
Must start with: Add, Fix, Update, Translate, Docs, Refactor, Test, CI, Chore, Merge

## Netlify Functions Pattern
- Handle CORS preflight (OPTIONS → 204)
- Return JSON with appropriate status codes
- try/catch on every external call
- Never hardcode secrets — use process.env
- Graceful fallback if external API fails

## AI Features
- Model: openai/gpt-oss-120b via Groq (default; override with the GROQ_MODEL env var)
- All AI calls server-side (Netlify Functions)
- Every AI feature has a non-AI fallback
- Output token ceilings: 512 to 1,024 per response (max_tokens)

## Do Not
- Add frameworks (React, Vue, Angular, Svelte)
- Add a build step (Webpack, Vite, Rollup)
- Add TypeScript
- Import npm packages on the client side
- Expose API keys in client code
```

---

## स्किल फ़ाइल्स

स्किल फ़ाइल्स स्ट्रक्चर्ड सिस्टम प्रॉम्प्ट्स होती हैं जो यह तय करती हैं कि AI मॉडल्स कैसे काम करेंगे। JanVayu इनका इस्तेमाल अपने Groq-होस्टेड AI फ़ीचर्स के लिए करता है, लेकिन यही कॉन्सेप्ट Claude Code वर्कफ़्लोज़ पर भी लागू होता है।
[Skills सेक्शन](../skills/README.md) में बताए गए स्किल फ़ाइल इस काम आते हैं:
1. **Groq system prompts** — Netlify Functions में एम्बेड किए गए ( `air-query.mjs` में Ask JanVayu प्रॉम्प्ट उस पेज से बहुत लंबा है जिसमें इसकी जानकारी दी गई है)
2. **Development reference** — AI फ़ीचर बदलते समय Claude Code को गाइड करने के लिए
3. **Reusable templates** — कोई भी जो JanVayu को दूसरे डोमेन के लिए फ़ोर्क कर रहा है, उसके लिए

### Skill File Structure

हर स्किल फ़ाइल इस फ़ॉर्मेट में होती है:

```markdown
# Skill: [Name]

## Role
मॉडल को कैसा व्यवहार करना चाहिए।

## Context
इसे कौन सा डेटा मिलेगा।

## Output Format
रिस्पॉन्स का सटीक स्ट्रक्चर।

## Constraints
शब्दों की लिमिट, टोन, भाषा, फ़ेल होने के तरीके।

## Examples
सैंपल इनपुट और अपेक्षित आउटपुट।
```

---

## MCP Server Integrations

Claude Code ज़्यादा टूल एक्सेस के लिए Model Context Protocol (MCP) सर्वर को सपोर्ट करता है। नीचे दिए गए MCP इंटीग्रेशन का इस्तेमाल JanVayu जैसे प्रोजेक्ट के साथ किया जा सकता है (रिपॉजिटरी में यह रिकॉर्ड नहीं है कि डेवलपमेंट के दौरान किनका इस्तेमाल हुआ था):

### Notion MCP
- **Purpose:** प्रोजेक्ट प्लानिंग, टास्क ट्रैकिंग, मीटिंग नोट्स
- **Tools:** पेज बनाना, डेटाबेस क्वेरी करना, सर्च करना, पेज अपडेट करना
- **Use case:** फ़ीचर डेवलपमेंट को ट्रैक करना, प्रोजेक्ट रोडमैप मेंटेन करना

### Gmail MCP
- **Purpose:** कम्युनिकेशन कॉन्टेक्स्ट
- **Tools:** मैसेज सर्च करना, थ्रेड पढ़ना, ड्राफ़्ट बनाना
- **Use case:** फ़ीचर या पार्टनरशिप के बारे में ईमेल चर्चाओं को रेफ़र करना

### Figma MCP
- **Purpose:** डिज़ाइन-टू-कोड वर्कफ़्लो
- **Tools:** डिज़ाइन कॉन्टेक्स्ट, स्क्रीनशॉट, मेटाडेटा लेना
- **Use case:** JanVayu UI सेक्शन के लिए डिज़ाइन मॉकअप को HTML/CSS में बदलना

### Google Calendar MCP
- **Purpose:** शेड्यूलिंग कॉन्टेक्स्ट
- **Tools:** इवेंट्स की लिस्ट देखना, इवेंट बनाना, खाली समय खोजना
- **Use case:** डेवलपमेंट सेशन और रिलीज़ डेट की प्लानिंग करना

### Excalidraw MCP
- **Purpose:** आर्किटेक्चर डायग्राम
- **Tools:** व्यू बनाना, चेकपॉइंट सेव करना
- **Use case:** सिस्टम आर्किटेक्चर और डेटा फ़्लो को विज़ुअलाइज़ करना

---

## Permission Configuration

Claude Code कॉन्फ़िगरेबल परमिशन के साथ काम करता है। JanVayu डेवलपमेंट के लिए:

### Recommended Permissions

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "Write",
      "Edit",
      "Bash(npm install)",
      "Bash(netlify dev)",
      "Bash(git *)",
      "Bash(gh pr *)",
      "Bash(ls *)",
      "Bash(mkdir *)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force *)",
      "Bash(git reset --hard *)"
    ]
  }
}
```

### Why These Permissions?
- **Read/Write/Edit/Glob/Grep** — मुख्य डेवलपमेंट टूल्स
- **npm install** — डिपेंडेंसीज़ इंस्टॉल करें
- **netlify dev** — लोकल डेवलपमेंट सर्वर चलाएं
- **git** — वर्ज़न कंट्रोल वर्कफ़्लो
- **gh pr** — पुल रिक्वेस्ट बनाएं और मैनेज करें
- **Deny destructive commands** — गलती से डेटा खोने से बचाएं

---

## डेवलपमेंट के लिए एनवायरनमेंट

Claude Code को शेल एनवायरनमेंट इनहेरिट हो जाता है। JanVayu के लिए:

```bash
# Required
export GROQ_API_KEY=your_key
export RESEND_API_KEY=your_key
export NETLIFY_SITE_ID=your_site_id

# Optional (for Netlify Blobs in local dev)
export BLOB_TOKEN=your_token
```

लोकल डेवलपमेंट के दौरान `netlify dev` द्वारा इन्हें `.env` से रीड किया जाता है।
