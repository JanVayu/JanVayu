# ডিপ্লয়মেন্ট
JanVayu **Netlify**-এ ডিপ্লয় করা হয়েছে, যা GitHub-এর `main` ব্রাঞ্চে প্রতিটি পুশ করলে বিল্ড করে।
---
## ডিপ্লয়মেন্ট কীভাবে কাজ করে
1. GitHub-এ `main`-এ পুশ করুন
2. Netlify ওয়েবহুকের মাধ্যমে নতুন কমিট শনাক্ত করে
3. Netlify বিল্ড কমান্ড রান করে (`node scripts/bump-version.mjs`, একটি ভার্সন-স্ট্যাম্প স্ক্রিপ্ট; এখানে কোনো বান্ডলার নেই) এবং রেপো রুটকে পাবলিশ ডিরেক্টরি হিসেবে ধরে ডিপ্লয় করে
4. সাইটটি [www.janvayu.in](https://www.janvayu.in)-এ লাইভ হয়
ধাপ 4 একটি Netlify সেটিংসের ওপর নির্ভরশীল যা এই রিপোজিটরিতে নেই। `CLAUDE.md` সাইটটিকে পাবলিশ-লকড হিসেবে বর্ণনা করে, যার মানে হলো একটি পুশ একটি ডিপ্লয় তৈরি করে এবং ডিপ্লয়টি পরবর্তী পাবলিশ উইন্ডোতে লাইভ হয়। মার্জ করা কোনো পরিবর্তন লাইভ হয়েছে বলে কাউকে জানানোর আগে বর্তমান সেটিংসের জন্য Netlify ড্যাশবোর্ড চেক করুন।
README-এ থাকা Netlify বিল্ড স্ট্যাটাস ব্যাজটি বর্তমান ডিপ্লয় অবস্থা প্রতিফলিত করে।
---
## Netlify কনফিগারেশন (`netlify.toml`)
```toml
# সংক্ষিপ্ত রূপ: আসল netlify.toml-এ আরও অনেক হেডার এবং রিডাইরেক্ট রুল রয়েছে
[build]
  command = "node scripts/bump-version.mjs"
  publish = "."         # রেপো রুট থেকে সার্ভ করুন
  functions = "netlify/functions"
[build.environment]
  NODE_VERSION = "24"
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
- নন-www-কে www (ক্যানোনিকাল ডোমেইন)-এ রিডাইরেক্ট করা হয়
- সিকিউরিটি হেডারগুলো বিশ্বব্যাপী প্রয়োগ করা হয়
---
## ডোমেইন ও DNS
কাস্টম ডোমেইন `janvayu.in` Netlify DNS-এ কনফিগার করা আছে। রেপো রুটে থাকা `CNAME` ফাইলে `www.janvayu.in` রয়েছে; Netlify-এ এর কোনো প্রভাব নেই, এবং এটি আগের কোনো GitHub Pages সেটআপের অংশ ছিল কি না, তা রিপোজিটরিতে রেকর্ড করা নেই।
---
## প্রিভিউ ডিপ্লয়
পুল রিকোয়েস্টগুলো স্বয়ংক্রিয়ভাবে একটি প্রিভিউ URL তৈরি করে (যেমন, `https://deploy-preview-42--janvayu.netlify.app`)। এটি রিভিউয়ারদের `main`-এ মার্জ করার আগে পরিবর্তনগুলো পরীক্ষা করার সুযোগ দেয়।
---
## প্রোডাকশনে এনভায়রনমেন্ট ভেরিয়েবল
Netlify ড্যাশবোর্ডে প্রয়োজনীয় সব ভেরিয়েবল সেট করুন:
1. [app.netlify.com](https://app.netlify.com)-এ যান
2. JanVayu সাইট খুলুন
3. **Site Configuration → Environment Variables**-এ যান
4. প্রতিটি ভেরিয়েবল যোগ করুন (দেখুন [Environment Variables](environment-variables.md))
প্রোডাকশন এনভায়রনমেন্ট ভেরিয়েবলগুলো **কখনোই** রিপোজিটরিতে সেভ করা হয় না।
---
## রোলব্যাক
আগের ডিপ্লয়ে ফিরে যেতে:
1. Netlify ড্যাশবোর্ড → Deploys-এ যান
2. শেষ পরিচিত ভালো ডিপ্লয়টি খুঁজুন
3. "Publish deploy"-এ ক্লিক করুন
Netlify সম্পূর্ণ ডিপ্লয় হিস্ট্রি সংরক্ষণ করে, তাই রোলব্যাক তাৎক্ষণিকভাবে করা যায়।
---
## মনিটরিং
- **ডিপ্লয় স্ট্যাটাস:** Netlify ড্যাশবোর্ড → Deploys
- **ফাংশন লগ:** Netlify ড্যাশবোর্ড → Functions → Logs
- **ফিড ফ্রেশনেস:** `GET /.netlify/functions/feed-status` — সব ফিডের শেষ আপডেট টাইমস্ট্যাম্প রিটার্ন করে
- **আপটাইম:** [/status/](https://www.janvayu.in/status/)-এ থাকা পাবলিক স্ট্যাটাস পেজটি প্রতি 15 মিনিটে `health-monitor.mjs` দ্বারা রেকর্ড করা হিস্ট্রি রিড করে। `.github/workflows/function-health.yml` একই বিরতিতে সাইট এবং এর ফাংশনগুলো প্রোব করে এবং কোনোটি ডাউন থাকলে একটি "status: outage" ইস্যু ওপেন রাখে
- **লাইভ রিডিং:** `.github/workflows/live-audit.yml` দিনে একবার সাইট থেকে আসা লাইভ রিডিংকে CPCB-এর দৈনিক বুলেটিনের সাথে তুলনা করে; একটি লাল শিডিউলড রান হলো অ্যালার্ট
- **শিডিউলড ফাংশন লগ:** Netlify ড্যাশবোর্ড → Functions → Scheduled Functions
