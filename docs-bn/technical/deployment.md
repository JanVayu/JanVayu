# ডিপ্লয়মেন্ট

JanVayu **Netlify**-তে ডিপ্লয় করা আছে, GitHub-এ `main` ব্রাঞ্চে প্রতিটি পুশে স্বয়ংক্রিয়ভাবে ডিপ্লয় ট্রিগার হয়।

---

## ডিপ্লয়মেন্ট কীভাবে কাজ করে

1. GitHub-এ `main`-এ পুশ করুন
2. Netlify webhook-এর মাধ্যমে নতুন কমিট শনাক্ত করে
3. Netlify বিল্ড ও ডিপ্লয় করে (কোনো বিল্ড স্টেপ নেই — repo root হল publish directory)
4. 30-90 সেকেন্ডের মধ্যে সাইট [www.janvayu.in](https://www.janvayu.in)-এ লাইভ

README-তে Netlify build status badge বর্তমান deploy অবস্থা প্রতিফলিত করে।

---

## Netlify কনফিগারেশন (`netlify.toml`)

```toml
[build]
  publish = "."         # Repo root থেকে সার্ভ করুন
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"

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

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

মূল পয়েন্ট:
- SPA fallback (`/* → /index.html`) নিশ্চিত করে যে deep links সঠিকভাবে কাজ করে
- Non-www কে www-তে রিডিরেক্ট করা হয় (canonical domain)
- নিরাপত্তা headers সর্বব্যাপী প্রয়োগ করা হয়

---

## ডোমেইন ও DNS

কাস্টম ডোমেইন `janvayu.in` Netlify DNS-এ কনফিগার করা আছে। Repo root-এ `CNAME` ফাইলটি GitHub Pages কাস্টম ডোমেইন সেট করে (Netlify মাইগ্রেশনের আগে থেকে legacy)।

---

## Preview Deploys

Pull requests স্বয়ংক্রিয়ভাবে একটি preview URL তৈরি করে (যেমন, `https://deploy-preview-42--janvayu.netlify.app`)। এটি রিভিউয়ারদের `main`-এ মার্জ করার আগে পরিবর্তন পরীক্ষা করতে দেয়।

---

## প্রোডাকশনে Environment Variables

Netlify dashboard-এ সমস্ত প্রয়োজনীয় variables সেট করুন:

1. [app.netlify.com](https://app.netlify.com)-এ যান
2. JanVayu সাইট খুলুন
3. **Site Configuration → Environment Variables**-এ যান
4. প্রতিটি variable যোগ করুন ([Environment Variables](environment-variables.md) দেখুন)

প্রোডাকশন environment variables **কখনো** রিপোজিটরিতে সংরক্ষণ করা হয় না।

---

## রোলব্যাক

আগের deploy-এ ফিরে যেতে:

1. Netlify dashboard → Deploys-এ যান
2. সর্বশেষ জানা-ভালো deploy খুঁজুন
3. "Publish deploy" ক্লিক করুন

Netlify সম্পূর্ণ deploy ইতিহাস রাখে, তাই রোলব্যাক তাৎক্ষণিক।

---

## পর্যবেক্ষণ

- **Deploy স্থিতি:** Netlify dashboard → Deploys
- **Function logs:** Netlify dashboard → Functions → Logs
- **ফিড ফ্রেশনেস:** `GET /.netlify/functions/feed-status` — সমস্ত ফিডের শেষ আপডেট টাইমস্ট্যাম্প ফেরত দেয়
- **Scheduled function logs:** Netlify dashboard → Functions → Scheduled Functions
