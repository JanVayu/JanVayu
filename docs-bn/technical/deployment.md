# ডিপ্লয়মেন্ট

JanVayu **Netlify**-এ ডিপ্লয় করা হয়েছে, যেখানে GitHub-এর `main` ব্রাঞ্চে প্রতিবার পুশ করার সাথে সাথে স্বয়ংক্রিয়ভাবে ডিপ্লয়মেন্ট ট্রিগার হয়।

---

## ডিপ্লয়মেন্ট কীভাবে কাজ করে

১. GitHub-এ `main`-এ পুশ করা
২. ওয়েবহুকের মাধ্যমে Netlify নতুন কমিট শনাক্ত করে
৩. Netlify বিল্ড কমান্ড (`node scripts/bump-version.mjs`, একটি ভার্সন-স্ট্যাম্প স্ক্রিপ্ট; এখানে কোনো বান্ডলার নেই) রান করে এবং রেপো রুটকে পাবলিশ ডিরেক্টরি হিসেবে ধরে ডিপ্লয় করে
৪. সাইটটি [www.janvayu.in](https://www.janvayu.in)-এ লাইভ হয়

README-এ থাকা Netlify বিল্ড স্ট্যাটাস ব্যাজটি বর্তমান ডিপ্লয় স্টেট তুলে ধরে।

---

## Netlify কনফিগারেশন (`netlify.toml`)

```toml
# সংক্ষেপে দেওয়া হয়েছে: আসল netlify.toml-এ আরও অনেক হেডার এবং রিডাইরেক্ট রুল রয়েছে
[build]
  command = "node scripts/bump-version.mjs"
  publish = "."         # রেপো রুট থেকে সার্ভ করা
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "22"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[redirects]]
  from = "https://janvayu.in/*"
  to = "https://www.janvayu.in/:splat"
  status = 301
  force = true

# .../docs, /blog, /embed, /api, /ask, /status ইত্যাদির জন্য নির্দিষ্ট রুলগুলো ফলব্যাকের আগে আসে
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

মূল বিষয়গুলো:
- SPA ফলব্যাক (`/* → /index.html`) নিশ্চিত করে যে ডিপ লিঙ্কগুলো সঠিকভাবে কাজ করে
- নন-www থেকে www-তে (ক্যানোনিকাল ডোমেইন) রিডাইরেক্ট করা হয়
- সিকিউরিটি হেডারগুলো বিশ্বব্যাপী প্রয়োগ করা হয়

---

## ডোমেইন ও DNS

কাস্টম ডোমেইন `janvayu.in` Netlify DNS-এ কনফিগার করা আছে। রেপো রুটে থাকা `CNAME` ফাইলে `www.janvayu.in` রয়েছে; Netlify-এ এর কোনো প্রভাব নেই, এবং এটি আগের কোনো GitHub Pages সেটআপের কিনা তা রেপোজিটোরিতে রেকর্ড করা নেই।

---

## প্রিভিউ ডিপ্লয়

পুল রিকোয়েস্টগুলো স্বয়ংক্রিয়ভাবে একটি প্রিভিউ URL তৈরি করে (যেমন, `https://deploy-preview-42--janvayu.netlify.app`)। এর মাধ্যমে রিভিউয়াররা `main`-এ মার্জ করার আগে পরিবর্তনগুলো পরীক্ষা করে দেখতে পারেন।

---

## প্রোডাকশনে এনভায়রনমেন্ট ভেরিয়েবল

Netlify ড্যাশবোর্ডে প্রয়োজনীয় সব ভেরিয়েবল সেট করুন:

১. [app.netlify.com](https://app.netlify.com)-এ যান
২. JanVayu সাইটটি খুলুন
৩. **Site Configuration → Environment Variables**-এ যান
৪. প্রতিটি ভেরিয়েবল যোগ করুন ([Environment Variables](environment-variables.md) দেখুন)

প্রোডাকশন এনভায়রনমেন্ট ভেরিয়েবলগুলো **কখনোই** রেপোজিটোরিতে স্টোর করা হয় না।

---

## রোলব্যাক

আগের কোনো ডিপ্লয়মেন্টে রোলব্যাক করতে:

১. Netlify ড্যাশবোর্ডে যান → Deploys
২. শেষ পরিচিত ভালো ডিপ্লয়টি খুঁজুন
৩. "Publish deploy"-এ ক্লিক করুন
নেটলিফাই সম্পূর্ণ ডিপ্লয় হিস্ট্রি সংরক্ষণ করে, তাই রোলব্যাক তাৎক্ষণিক হয়।

## মনিটরিং

- **ডিপ্লয় স্ট্যাটাস:** নেটলিফাই ড্যাশবোর্ড → ডিপ্লয়স
- **ফাংশন লগস:** নেটলিফাই ড্যাশবোর্ড → ফাংশনস → লগস
- **ফিড ফ্রেশনেস:** `GET /.netlify/functions/feed-status` — সমস্ত ফিডের সর্বশেষ আপডেটের টাইমস্ট্যাম্প প্রদান করে
- **শিডিউলড ফাংশন লগস:** নেটলিফাই ড্যাশবোর্ড → ফাংশনস → শিডিউলড ফাংশনস
