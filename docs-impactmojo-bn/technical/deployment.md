# ডিপ্লয়মেন্ট গাইড

ImpactMojo Supabase-কে ব্যাকএন্ড হিসেবে ব্যবহার করে Netlify-তে একটি স্ট্যাটিক সাইট হিসেবে ডিপ্লয় হয়। কোনো বিল্ড স্টেপ প্রয়োজন নেই।

---

## প্রধান সাইট ডিপ্লয়মেন্ট

### স্বয়ংক্রিয় (Git-এর মাধ্যমে)

১. GitHub-এ `main` ব্রাঞ্চে পুশ করুন
২. Netlify পুশ শনাক্ত করে এবং স্বয়ংক্রিয়ভাবে ডিপ্লয় করে
৩. কোনো বিল্ড কমান্ডের প্রয়োজন নেই — সাইটটি স্ট্যাটিক HTML/CSS/JS
৪. ৩০-৯০ সেকেন্ডের মধ্যে সাইট [www.impactmojo.in](https://www.impactmojo.in)-এ লাইভ হয়

### ম্যানুয়াল

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy from project root
netlify deploy --prod
```

---

## ডোমেইন কনফিগারেশন

কাস্টম ডোমেইন `impactmojo.in` Netlify DNS-এ কনফিগার করা আছে।

| রেকর্ড | ধরন | মান |
|--------|------|-------|
| `@` | A | Netlify লোড ব্যালেন্সার |
| `www` | CNAME | Netlify সাইট URL |
| `docs` | CNAME | `hosting.gitbook.io` |

`netlify.toml`-এ রিডাইরেক্ট নিয়ম:
```toml
[[redirects]]
  from = "https://impactmojo.in/*"
  to = "https://www.impactmojo.in/:splat"
  status = 301
  force = true
```

---

## প্রিমিয়াম টুল সাইট

প্রতিটি প্রিমিয়াম টুল একটি পৃথক Netlify সাইট:

| টুল | Netlify সাইট | Auth Gate |
|------|-------------|-----------|
| RQ Builder Pro | পৃথক ডিপ্লয় | `auth-gate.ts` Edge Function |
| Qual Insights Lab | পৃথক ডিপ্লয় | `auth-gate.ts` Edge Function |
| Statistical Code Converter | পৃথক ডিপ্লয় | `auth-gate.ts` Edge Function |
| VaniScribe | পৃথক ডিপ্লয় | `auth-gate.ts` Edge Function |
| DevData Practice | পৃথক ডিপ্লয় | `auth-gate.ts` Edge Function |
| Viz Cookbook | পৃথক ডিপ্লয় | `auth-gate.ts` Edge Function |
| DevEcon Toolkit | পৃথক ডিপ্লয় | `auth-gate.ts` Edge Function |

প্রতিটি টুল সাইটে টোকেন যাচাইয়ের জন্য `JWT_SECRET` এনভায়রনমেন্ট ভেরিয়েবল প্রয়োজন।

---

## Supabase কনফিগারেশন

### প্রয়োজনীয় টেবিল

Supabase মাইগ্রেশনের মাধ্যমে সকল ২১+ টেবিল তৈরি নিশ্চিত করুন। প্রধান টেবিল:
- `profiles` — ব্যবহারকারী অ্যাকাউন্ট এবং সাবস্ক্রিপশন স্তর
- `organizations` — টিম অ্যাকাউন্ট
- `course_progress`, `bookmarks`, `certificates`, `payments`

### Row-Level Security

সকল টেবিলে RLS সক্ষম থাকতে হবে। ব্যবহারকারীরা কেবল তাদের নিজস্ব সারি পড়তে/লিখতে পারেন।

### Edge Functions

`mint-resource-token` ফাংশন Supabase-এ ডিপ্লয় করতে হবে:
```
supabase functions deploy mint-resource-token
```

---

## এনভায়রনমেন্ট ভেরিয়েবল

সম্পূর্ণ তালিকার জন্য [এনভায়রনমেন্ট ভেরিয়েবল](environment-variables.md) দেখুন।

---

## খরচের কাঠামো

| পরিষেবা | পরিকল্পনা | আনুমানিক খরচ |
|---------|------|---------------|
| Netlify (প্রধান সাইট) | বিনামূল্যে স্তর | $০/মাস |
| Netlify (প্রতিটি টুল সাইট) | বিনামূল্যে স্তর | $০/মাস |
| Supabase | বিনামূল্যে স্তর (৫০০MB পর্যন্ত, ৫০K MAU) | $০/মাস |
| ডোমেইন (impactmojo.in) | বার্ষিক পুনর্নবীকরণ | ~₹৮০০/বছর |
| Resend (ইমেইল বিজ্ঞপ্তি) | বিনামূল্যে স্তর (১০০ ইমেইল/দিন) | $০/মাস |

---

## ইন্টারেক্টিভ ডেমো

> **আসন্ন** — একটি ইন্টারেক্টিভ ডিপ্লয়মেন্ট ওয়াকথ্রু এখানে এম্বেড করা হবে, যা পুশ-টু-ডিপ্লয় প্রবাহ এবং এনভায়রনমেন্ট ভেরিয়েবল কনফিগারেশন দেখাবে।

<!-- Replace this section with an Arcade embed once recorded -->
