# Claude Code সেটআপ ও কনফিগারেশন

JanVayu-র উন্নয়নের জন্য ব্যবহৃত Claude Code কনফিগারেশন।

---

## CLAUDE.md — প্রজেক্ট নির্দেশনা

JanVayu বর্তমানে `CLAUDE.md` ফাইল ব্যবহার করে না। প্রজেক্ট কনভেনশন Git hooks, `.editorconfig`, এবং `.gitmessage` দ্বারা প্রয়োগ করা হয়।

### ফোর্কের জন্য প্রস্তাবিত CLAUDE.md

```markdown
# CLAUDE.md — JanVayu প্রজেক্ট নির্দেশনা

## আর্কিটেকচার
- একক HTML ফাইল (index.html) — সমস্ত CSS ও JS ইনলাইন
- কোনো ফ্রেমওয়ার্ক নেই, কোনো বিল্ড স্টেপ নেই

## কোড শৈলী
- Vanilla JavaScript (ES2020 সর্বোচ্চ)
- 2-স্পেস ইনডেন্টেশন

## কমিট মেসেজ
Add, Fix, Update, Translate, Docs, Refactor, Test, CI, Chore, Merge দিয়ে শুরু

## যা করবেন না
- ফ্রেমওয়ার্ক যোগ করবেন না (React, Vue, Angular)
- বিল্ড স্টেপ যোগ করবেন না
- ক্লায়েন্টে API key প্রকাশ করবেন না
```

---

## স্কিল ফাইলসমূহ

স্কিল ফাইলগুলো হল কাঠামোবদ্ধ সিস্টেম প্রম্পট। JanVayu চারটি Gemini সুবিধার জন্য এগুলো ব্যবহার করে।

বিস্তারিত: [স্কিলস অনুচ্ছেদ](../skills/README.md)

---

## MCP সার্ভার ইন্টিগ্রেশন

উন্নয়নের সময় উপলব্ধ MCP ইন্টিগ্রেশন:
- **Notion** — প্রজেক্ট প্ল্যানিং
- **Gmail** — যোগাযোগ প্রসঙ্গ
- **Figma** — ডিজাইন-টু-কোড
- **Google Calendar** — শিডিউলিং
- **Excalidraw** — আর্কিটেকচার ডায়াগ্রাম

---

## অনুমতিসমূহ

প্রস্তাবিত অনুমতি সেটিংস:
- ✅ Read, Write, Edit, Glob, Grep
- ✅ `npm install`, `netlify dev`, `git *`, `gh pr *`
- ❌ `rm -rf *`, `git push --force *`, `git reset --hard *`
