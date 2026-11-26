# জ্যানভায়ুর জন্য ক্লড কোড সেটআপ
এই পৃষ্ঠায় ক্লড কোড ব্যবহার করে জ্যানভায়ু ডেভেলপ করার জন্য ব্যবহৃত সঠিক কনফিগারেশন নথিভুক্ত করা হয়েছে — যার মধ্যে রয়েছে CLAUDE.md ফাইল, পারমিশন সেটিংস এবং MCP ইন্টিগ্রেশন।
---
## CLAUDE.md — প্রজেক্ট নির্দেশিকা
রেপোজিটরি রুটে জ্যানভায়ুর একটি ছোট `CLAUDE.md` ফাইল রয়েছে। এটি এই পৃষ্ঠাগুলোর দিকে নির্দেশ করে, যেমন `CONTRIBUTING.md` এবং `FORKING.md`, এবং `.claude/engineering-standards.md`-এ একটি শেয়ার্ড ইঞ্জিনিয়ারিং স্ট্যান্ডার্ড। এটি `scripts/`-এর CI চেকগুলোর নাম উল্লেখ করে এবং কমিট পুশ করে এমন শিডিউলড ওয়ার্কফ্লো সম্পর্কে সতর্ক করে। এটি কনভেনশনগুলোর পুনরাবৃত্তি করে না, যেগুলো নিচের উপায়ে প্রয়োগ করা হয়:
1. **Git hooks** (`.githooks/pre-commit` এবং `.githooks/commit-msg`) — স্বয়ংক্রিয়ভাবে কমিট মেসেজের ফরম্যাট প্রয়োগ করে এবং সংবেদনশীল ফাইলগুলোকে ব্লক করে
2. **`.editorconfig`** — ইনডেন্টেশন এবং এনকোডিং স্ট্যান্ডার্ডাইজ করে
3. **`.gitmessage`** — কমিট মেসেজ টেমপ্লেট
4. **ইনলাইন ডকুমেন্টেশন** — README.md, CONTRIBUTING.md, এবং কোড কমেন্ট
### ফর্কের জন্য প্রস্তাবিত CLAUDE.md
আপনি যদি জ্যানভায়ু ফর্ক করেন এবং ক্লড কোডকে প্রজেক্ট-নির্দিষ্ট নির্দেশিকা দিতে চান, তবে রেপো রুটের `CLAUDE.md`-এর জায়গায় আপনার নিজেরটি বসিয়ে দিন। এই রেপোজিটরিটির চেয়ে একটি পূর্ণাঙ্গ শুরুর পয়েন্ট:
```markdown
# CLAUDE.md — JanVayu Project Instructions
## Architecture
- Front end: index.html (markup), app.js (logic), styles.css (styling), games.js, js/ and panels/
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
---
## স্কিল ফাইলসমূহ
স্কিল ফাইলগুলো হলো সুগঠিত সিস্টেম প্রম্পট, যা নির্ধারণ করে এআই মডেলগুলো কীভাবে আচরণ করবে। JanVayu এর Groq-হোস্টেড এআই ফিচারগুলোর জন্য এগুলো ব্যবহার করে, তবে একই ধারণা Claude Code ওয়ার্কফ্লোর ক্ষেত্রেও প্রযোজ্য।
[Skills section](../skills/README.md) এ নথিভুক্ত স্কিল ফাইলগুলো নিচের বিষয়গুলোতে ব্যবহৃত হয়:
1. **Groq সিস্টেম প্রম্পট** — Netlify Functions-এ এম্বেড করা থাকে (`air-query.mjs`-এ থাকা Ask JanVayu প্রম্পটটি এটি নথিভুক্ত করা পৃষ্ঠার চেয়ে অনেক বড়)
2. **ডেভেলপমেন্ট রেফারেন্স** — এআই ফিচারগুলো পরিবর্তন করার সময় Claude Code-কে গাইড করে
3. **পুনরায় ব্যবহারযোগ্য টেমপ্লেট** — অন্য ডোমেইনের জন্য JanVayu ফর্ক করা যে কারও জন্য
### স্কিল ফাইলের গঠন
প্রতিটি স্কিল ফাইল এই ফরম্যাট অনুসরণ করে:
```markdown
# Skill: [Name]
## Role
মডেলটির কী ভূমিকা পালন করা উচিত।
## Context
এটি কী ধরনের ডেটা গ্রহণ করবে।
## Output Format
উত্তরের হুবহু গঠন।
## Constraints
শব্দের সীমা, টোন, ভাষা, ব্যর্থতার ধরন।
## Examples
নমুনা ইনপুট এবং প্রত্যাশিত আউটপুট।
```
---
## MCP Server ইন্টিগ্রেশনসমূহ
Claude Code বর্ধিত টুল অ্যাক্সেসের জন্য Model Context Protocol (MCP) সার্ভার সমর্থন করে। JanVayu-এর মতো কোনো প্রজেক্টের সাথে নিচের MCP ইন্টিগ্রেশনগুলো ব্যবহার করা যেতে পারে (ডেভেলপমেন্টের সময় কোনটি ব্যবহার করা হয়েছিল, রিপোজিটরিতে তার কোনো রেকর্ড নেই):
### Notion MCP
- **উদ্দেশ্য:** প্রজেক্ট প্ল্যানিং, টাস্ক ট্র্যাকিং, মিটিং নোটস
- **টুলস:** পেজ তৈরি করা, ডেটাবেস কোয়েরি করা, সার্চ করা, পেজ আপডেট করা
- **ইউজ কেস:** ফিচার ডেভেলপমেন্ট ট্র্যাক করা, প্রজেক্ট রোডম্যাপ বজায় রাখা
### Gmail MCP
- **উদ্দেশ্য:** যোগাযোগের প্রেক্ষাপট
- **টুলস:** মেসেজ সার্চ করা, থ্রেড পড়া, ড্রাফট তৈরি করা
- **ইউজ কেস:** ফিচার বা পার্টনারশিপ নিয়ে ইমেইল আলোচনা রেফারেন্স হিসেবে ব্যবহার করা
### Figma MCP
- **উদ্দেশ্য:** ডিজাইন-টু-কোড ওয়ার্কফ্লো
- **টুলস:** ডিজাইনের প্রেক্ষাপট পাওয়া, স্ক্রিনশট, মেটাডেটা
- **ইউজ কেস:** JanVayu UI সেকশনগুলোর জন্য ডিজাইন মকআপগুলোকে HTML/CSS-এ রূপান্তর করা
### Google Calendar MCP
- **উদ্দেশ্য:** শিডিউলিংয়ের প্রেক্ষাপট
- **টুলস:** ইভেন্ট তালিকাভুক্ত করা, ইভেন্ট তৈরি করা, ফ্রি সময় খোঁজা
- **ইউজ কেস:** ডেভেলপমেন্ট সেশন এবং রিলিজের তারিখ প্ল্যান করা
### Excalidraw MCP
- **উদ্দেশ্য:** আর্কিটেকচার ডায়াগ্রাম
- **টুলস:** ভিউ তৈরি করা, চেকপয়েন্ট সেভ করা
- **ইউজ কেস:** সিস্টেম আর্কিটেকচার এবং ডেটা ফ্লো ভিজ্যুয়ালাইজ করা
---
## পারমিশন কনফিগারেশন
Claude Code কনফিগারযোগ্য পারমিশন নিয়ে কাজ করে। JanVayu ডেভেলপমেন্টের জন্য:
### প্রস্তাবিত পারমিশনসমূহ
অতিরিক্ত কোনো বিষয় নেই।
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
### কেন এই পারমিশনগুলো?
- **Read/Write/Edit/Glob/Grep** — মূল ডেভেলপমেন্ট টুলস
- **npm install** — ডিপেন্ডেন্সি ইনস্টল করা
- **netlify dev** — লোকাল ডেভেলপমেন্ট সার্ভার রান করা
- **git** — ভার্সন কন্ট্রোল ওয়ার্কফ্লো
- **gh pr** — পুল রিকোয়েস্ট তৈরি ও ম্যানেজ করা
- **ডিনাই ডেস্ট্রাকটিভ কমান্ডস** — ভুলবশত ডেটা মুছে যাওয়া থেকে সুরক্ষা দেওয়া
---
## ডেভেলপমেন্টের জন্য এনভায়রনমেন্ট
Claude Code শেল এনভায়রনমেন্ট ইনহেরিট করে। JanVayu-এর জন্য:
```bash
# প্রয়োজনীয়
export GROQ_API_KEY=your_key
export WAQI_TOKEN=your_token
export RESEND_API_KEY=your_key
export NETLIFY_SITE_ID=your_site_id
# ঐচ্ছিক (লোকাল ডেভে Netlify Blobs-এর জন্য)
export BLOB_TOKEN=your_token
```
লোকাল ডেভেলপমেন্টের সময় `netlify dev` এই ভ্যালুগুলো `.env` থেকে রিড করে।
