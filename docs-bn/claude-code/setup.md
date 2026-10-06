# JanVayu-এর জন্য Claude Code সেটআপ

এই পৃষ্ঠায় Claude Code ব্যবহার করে JanVayu ডেভেলপ করার জন্য ব্যবহৃত সঠিক কনফিগারেশনের বিবরণ দেওয়া হয়েছে — যার মধ্যে CLAUDE.md ফাইল, পারমিশন সেটিংস এবং MCP ইন্টিগ্রেশন অন্তর্ভুক্ত রয়েছে।

---

## CLAUDE.md — প্রজেক্ট নির্দেশিকা

JanVayu বর্তমানে রিপোজিটরিতে কোনো `CLAUDE.md` ফাইল ব্যবহার করে না। এর পরিবর্তে, প্রজেক্টের নিয়মকানুনগুলো নিচের উপায়ে প্রয়োগ করা হয়:

১. **Git hooks** (`.githooks/pre-commit` এবং `.githooks/commit-msg`) — স্বয়ংক্রিয়ভাবে কমিট মেসেজের ফরম্যাট প্রয়োগ করে এবং সংবেদনশীল ফাইলগুলো ব্লক করে
২. **`.editorconfig`** — ইনডেন্টেশন এবং এনকোডিং স্ট্যান্ডার্ডাইজ করে
৩. **`.gitmessage`** — কমিট মেসেজ টেমপ্লেট
৪. **ইনলাইন ডকুমেন্টেশন** — README.md, CONTRIBUTING.md, এবং কোড কমেন্ট

### ফর্কগুলোর জন্য প্রস্তাবিত CLAUDE.md

আপনি যদি JanVayu ফর্ক করেন এবং Claude Code-কে প্রজেক্ট-নির্দিষ্ট নির্দেশিকা দিতে চান, তবে রিপোজিটরির রুটে একটি `CLAUDE.md` তৈরি করুন:

```markdown
# CLAUDE.md — JanVayu প্রজেক্ট নির্দেশিকা

## আর্কিটেকচার
- তিনটি ফ্রন্ট-এন্ড ফাইল: index.html (মার্কআপ), app.js (লজিক), styles.css (স্টাইলিং)
- কোনো ফ্রেমওয়ার্ক নেই, কোনো বিল্ড স্টেপ নেই, ক্লায়েন্টে কোনো npm ডিপেন্ডেন্সি নেই
- সার্ভার-সাইড লজিকের জন্য Netlify Functions (ES মডিউল, .mjs)
- ক্যাশিংয়ের জন্য Netlify Blobs (স্ট্রং কনসিস্টেন্সি)

## কোড স্টাইল
- শুধুমাত্র ভ্যানিলা JavaScript (ES2022, eslint.config.mjs-এ সেট করা অনুযায়ী)
- থিমিংয়ের জন্য CSS কাস্টম প্রপার্টি
- ২-স্পেস ইনডেন্টেশন (HTML, CSS, JS, JSON)
- কোনো TypeScript নেই, কোনো প্রিপ্রসেসর নেই

## কমিট মেসেজ
নিচের যেকোনো একটি দিয়ে শুরু হতে হবে: Add, Fix, Update, Translate, Docs, Refactor, Test, CI, Chore, Merge

## Netlify Functions প্যাটার্ন
- CORS প্রিফ্লাইট হ্যান্ডেল করা (OPTIONS → 204)
- উপযুক্ত স্ট্যাটাস কোডসহ JSON রিটার্ন করা
- প্রতিটি এক্সটার্নাল কলে try/catch
- কখনোই সিক্রেট হার্ডকোড করবেন না — process.env ব্যবহার করুন
- এক্সটার্নাল API ফেইল করলে গ্রেসফুল ফলব্যাক

## এআই ফিচার
- মডেল: Groq-এর মাধ্যমে openai/gpt-oss-120b (ডিফল্ট; GROQ_MODEL env ভেরিয়েবল দিয়ে ওভাররাইড করুন)
- সমস্ত এআই কল সার্ভার-সাইডে (Netlify Functions)
- প্রতিটি এআই ফিচারের একটি নন-এআই ফলব্যাক আছে
- আউটপুট টোকেন লিমিট: প্রতি রেসপন্সে ৫১২ থেকে ১,০২৪ (max_tokens)

## যা করবেন না
- ফ্রেমওয়ার্ক যোগ করবেন না (React, Vue, Angular, Svelte)
- বিল্ড স্টেপ যোগ করবেন না (Webpack, Vite, Rollup)
- TypeScript যোগ করবেন না
- ক্লায়েন্ট সাইডে npm প্যাকেজ ইমপোর্ট করবেন না
- ক্লায়েন্ট কোডে API কি প্রকাশ করবেন না
```

---

## স্কিল ফাইল

স্কিল ফাইলগুলো হলো স্ট্রাকচার্ড সিস্টেম প্রম্পট, যা নির্ধারণ করে এআই মডেলগুলো কীভাবে কাজ করবে। JanVayu তাদের Groq-হোস্টেড এআই ফিচারের জন্য এগুলো ব্যবহার করে, তবে একই ধারণা Claude Code ওয়ার্কফ্লোতেও প্রযোজ্য।
[Skills সেকশনে](../skills/README.md) ডকুমেন্ট করা স্কিল ফাইলগুলো কাজ করে:
১. **Groq system prompts** — Netlify Functions-এ এম্বেড করা ( `air-query.mjs`-এর Ask JanVayu প্রম্পটটি এটি ডকুমেন্ট করা পেজের চেয়ে অনেক বড়)
২. **Development reference** — AI ফিচারগুলো মডিফাই করার সময় Claude Code-কে গাইড করা
৩. **Reusable templates** — অন্য ডোমেইনের জন্য JanVayu ফর্ক করা যে কারও জন্য

### Skill File Structure

প্রতিটি স্কিল ফাইল এই ফরম্যাট মেনে চলে:

```markdown
# Skill: [Name]

## Role
মডেলটির কী ভূমিকা পালন করা উচিত।

## Context
এটি কী ধরনের ডেটা পাবে।

## Output Format
রেসপন্সের সঠিক গঠন।

## Constraints
শব্দের সীমা, টোন, ভাষা, ফেইলিওর মোড।

## Examples
স্যাম্পল ইনপুট এবং প্রত্যাশিত আউটপুট।
```

---

## MCP Server Integrations

Claude Code এক্সটেন্ডেড টুল অ্যাক্সেসের জন্য Model Context Protocol (MCP) সার্ভার সাপোর্ট করে। JanVayu-এর মতো প্রজেক্টের সাথে নিচের MCP ইন্টিগ্রেশনগুলো ব্যবহার করা যেতে পারে (ডেভেলপমেন্টের সময় কোনগুলো ব্যবহার করা হয়েছিল, রিপোজিটরিতে তার কোনো রেকর্ড নেই):

### Notion MCP
- **Purpose:** প্রজেক্ট প্ল্যানিং, টাস্ক ট্র্যাকিং, মিটিং নোটস
- **Tools:** পেজ তৈরি করা, ডেটাবেস কোয়েরি করা, সার্চ করা, পেজ আপডেট করা
- **Use case:** ফিচার ডেভেলপমেন্ট ট্র্যাক করা, প্রজেক্ট রোডম্যাপ মেইনটেইন করা

### Gmail MCP
- **Purpose:** কমিউনিকেশন কনটেক্সট
- **Tools:** মেসেজ সার্চ করা, থ্রেড পড়া, ড্রাফট তৈরি করা
- **Use case:** ফিচার বা পার্টনারশিপ নিয়ে ইমেইল আলোচনা রেফারেন্স হিসেবে ব্যবহার করা

### Figma MCP
- **Purpose:** ডিজাইন-টু-কোড ওয়ার্কফ্লো
- **Tools:** ডিজাইন কনটেক্সট, স্ক্রিনশট, মেটাডেটা পাওয়া
- **Use case:** JanVayu UI সেকশনের জন্য ডিজাইন মকআপগুলোকে HTML/CSS-এ রূপান্তর করা

### Google Calendar MCP
- **Purpose:** শিডিউলিং কনটেক্সট
- **Tools:** ইভেন্ট লিস্ট করা, ইভেন্ট তৈরি করা, ফ্রি সময় খোঁজা
- **Use case:** ডেভেলপমেন্ট সেশন এবং রিলিজের তারিখ প্ল্যান করা

### Excalidraw MCP
- **Purpose:** আর্কিটেকচার ডায়াগ্রাম
- **Tools:** ভিউ তৈরি করা, চেকপয়েন্ট সেভ করা
- **Use case:** সিস্টেম আর্কিটেকচার এবং ডেটা ফ্লো ভিজ্যুয়ালাইজ করা

---

## Permission Configuration

Claude Code কনফিগারযোগ্য পারমিশন নিয়ে কাজ করে। JanVayu ডেভেলপমেন্টের জন্য:

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
- **Read/Write/Edit/Glob/Grep** — মূল ডেভেলপমেন্ট টুলস
- **npm install** — ডিপেন্ডেন্সি ইনস্টল করা
- **netlify dev** — লোকাল ডেভেলপমেন্ট সার্ভার রান করা
- **git** — ভার্সন কন্ট্রোল ওয়ার্কফ্লো
- **gh pr** — পুল রিকোয়েস্ট তৈরি ও ম্যানেজ করা
- **Deny destructive commands** — ভুলবশত ডেটা হারিয়ে যাওয়া থেকে রক্ষা করা

---

## ডেভেলপমেন্টের জন্য এনভায়রনমেন্ট

Claude Code শেল এনভায়রনমেন্ট গ্রহণ করে। JanVayu-এর জন্য:

```bash
# Required
export GROQ_API_KEY=your_key
export RESEND_API_KEY=your_key
export NETLIFY_SITE_ID=your_site_id

# Optional (for Netlify Blobs in local dev)
export BLOB_TOKEN=your_token
```

লোকাল ডেভেলপমেন্টের সময় `netlify dev` এগুলোকে `.env` থেকে রিড করে।
