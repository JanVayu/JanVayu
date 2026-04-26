# ডেভেলপমেন্ট টুলিং

JanVayu তৈরি ও রক্ষণাবেক্ষণের জন্য ব্যবহৃত সরঞ্জামসমূহ।

---

## Claude Code (Anthropic)

JanVayu-র উন্নয়ন **Claude Code**-এর উল্লেখযোগ্য সহায়তায় হয়েছে। Claude Code-এর ব্যবহার:
- সমস্ত 13টি Netlify Functions লেখায়
- সম্পূর্ণ frontend তৈরিতে
- Gemini প্রম্পট ইঞ্জিনিয়ারিংয়ে
- এই Docsify ডকুমেন্টেশন তৈরিতে
- Git ওয়ার্কফ্লো পরিচালনায়

বিস্তারিত: [Claude Code অনুচ্ছেদ](../claude-code/overview.md)

---

## Git ওয়ার্কফ্লো

### কমিট মেসেজ কনভেনশন
প্রতিটি কমিট এদের মধ্যে একটি উপসর্গ দিয়ে শুরু হতে হবে:
`Add`, `Fix`, `Update`, `Translate`, `Docs`, `Refactor`, `Test`, `CI`, `Chore`, `Merge`

### ব্রাঞ্চ কৌশল
- `main` — প্রোডাকশন (Netlify-তে অটো-ডিপ্লয়)
- `claude/*` — Claude Code ডেভেলপমেন্ট ব্রাঞ্চ
- ফিচার ব্রাঞ্চ PR-এর মাধ্যমে মার্জ

---

## লোকাল ডেভেলপমেন্ট

```bash
npm install
netlify dev
```

কোনো Docker নেই, কোনো ডেটাবেস নেই, কোনো বিল্ড স্টেপ নেই।
