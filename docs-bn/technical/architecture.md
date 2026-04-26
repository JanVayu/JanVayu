# আর্কিটেকচার

JanVayu হল একটি **জিরো-ফ্রেমওয়ার্ক, সিঙ্গেল-পেজ অ্যাপ্লিকেশন** যা Netlify-তে ডিপ্লয় করা হয়েছে, সার্ভার-সাইড serverless functions সহ ডেটা প্রক্সিং, ক্যাশিং, এবং নির্ধারিত কাজের জন্য।

---

## সিস্টেম ডায়াগ্রাম

```
┌─────────────────────────────────────────────────────────┐
│                     Client (Browser)                    │
│  Single HTML file · Chart.js · Leaflet.js · WAQI API   │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTPS (Netlify CDN)
┌──────────────────────────▼──────────────────────────────┐
│                   Netlify Functions                      │
│                                                          │
│  Scheduled (cron)              On-demand (API)           │
│  ┌──────────────────┐   ┌───────────────────────────┐   │
│  │ scheduled-fetch   │   │ reddit-feed.js            │   │
│  │ (every 4 hours)   │   │ twitter-feed.js           │   │
│  │                   │   │ news-proxy.js             │   │
│  │ daily-digest      │   │ instagram-feed.js         │   │
│  │ (8 AM IST daily)  │   │ feed-status.js            │   │
│  └────────┬──────────┘   │ subscribe.js              │   │
│           │              │ air-query.mjs             │   │
│           │              │ health-advisory.mjs       │   │
│           │              │ accountability-brief.mjs  │   │
│           │              │ anomaly-check.mjs         │   │
│           ▼              └─────────────┬─────────────┘   │
│  ┌──────────────────────────────────────────────────┐    │
│  │           Netlify Blobs (Cache)                   │    │
│  │  Feeds cached as JSON · Strong consistency        │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │         Resend (Email Delivery)                   │    │
│  │  Daily AQI digest to subscribers                  │    │
│  └──────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
    WAQI API          Google Gemini    External Feeds
  (Real-time AQI)    (AI features)  (Reddit, News, X)
```

---

## মূল ডিজাইন সিদ্ধান্ত

### সিঙ্গেল HTML ফাইল
সম্পূর্ণ ফ্রন্ট-এন্ড `index.html`-এ থাকে — ইনলাইন CSS এবং JavaScript, কোনো বিল্ড স্টেপ নেই, কোনো বান্ডলার নেই, কোনো ফ্রেমওয়ার্ক নেই। এটি মৌলিক HTML/JS দক্ষতা সম্পন্ন কন্ট্রিবিউটরদের জন্য কোডবেস সুলভ করে এবং জিরো বিল্ড-টাইম জটিলতা নিশ্চিত করে।

### সার্ভার-সাইড প্রক্সিং
সোশ্যাল মিডিয়া ও সংবাদ API গুলো CORS সমস্যা এড়াতে এবং API key সুরক্ষিত রাখতে Netlify Functions এর মাধ্যমে ফেচ করা হয়। ক্লায়েন্ট কখনো এই API গুলো সরাসরি স্পর্শ করে না।

### Blob ক্যাশিং
`scheduled-fetch.mjs` function প্রতি 4 ঘণ্টায় চলে এবং সমস্ত ফিড ডেটা (Reddit, Twitter/X, সংবাদ, Instagram) Netlify Blobs-এ লেখে। ব্যবহারকারীরা ফিড অনুরোধ করলে, on-demand functions ক্যাশ থেকে তাৎক্ষণিকভাবে পরিবেশন করে — বিলম্ব এবং API rate limits দূর করে।

### ক্লায়েন্ট-সাইড AQI
WAQI API প্রতি 10 মিনিটে সরাসরি ব্রাউজার থেকে কল করা হয়। টোকেনটি একটি ফ্রি-টায়ার পাবলিক কী। এর মানে রিয়েল-টাইম AQI ডেটা কোনো সার্ভার-সাইড ইনফ্রাস্ট্রাকচার ছাড়াই কাজ করে।

### কোনো ফ্রেমওয়ার্ক নেই, কোনো বিল্ড স্টেপ নেই
কোনো `npm run build` নেই, কোনো Webpack নেই, কোনো React নেই। ডিপ্লয় আর্টিফ্যাক্ট হল রিপোজিটরি নিজেই। Netlify রুট থেকে `index.html` পরিবেশন করে।

---

## স্বয়ংক্রিয়-আপডেট সময়সূচি

| কাজ | ফ্রিকোয়েন্সি | Function |
|------|-----------|----------|
| সোশ্যাল/সংবাদ ফিড রিফ্রেশ | প্রতি 4 ঘণ্টা | `scheduled-fetch.mjs` |
| দৈনিক AQI ইমেল ডাইজেস্ট | প্রতিদিন সকাল 8:00 AM IST | `daily-digest.mjs` |
| লাইভ AQI ড্যাশবোর্ড | প্রতি 10 মিনিটে | ক্লায়েন্ট-সাইড JS (WAQI API) |
| Anomaly detection | On-demand | `anomaly-check.mjs` |

---

## ফাইল স্ট্রাকচার

```
JanVayu/
├── index.html                    # সম্পূর্ণ ফ্রন্ট-এন্ড (SPA)
├── favicon.svg
├── package.json                  # Node.js deps (Netlify Blobs, Resend, Gemini)
├── netlify.toml                  # Build ও deploy config
├── CNAME                         # Custom domain
├── docs/                         # এই ডকুমেন্টেশন (Docsify)
├── downloads/                    # ডাউনলোডযোগ্য রিপোর্ট (PDF, PPTX, DOCX)
└── netlify/
    └── functions/
        ├── scheduled-fetch.mjs   # Cron: সব ফিড, প্রতি 4 ঘণ্টা
        ├── daily-digest.mjs      # Cron: ইমেল ডাইজেস্ট, সকাল 8টা IST
        ├── reddit-feed.js        # API: ক্যাশকৃত Reddit পোস্ট
        ├── twitter-feed.js       # API: ক্যাশকৃত Twitter/X পোস্ট
        ├── news-proxy.js         # API: ক্যাশকৃত সংবাদ নিবন্ধ
        ├── instagram-feed.js     # API: ক্যাশকৃত Instagram পোস্ট
        ├── feed-status.js        # API: ফিড ফ্রেশনেস হেলথ চেক
        ├── subscribe.js          # API: ইমেল সাবস্ক্রিপশন ব্যবস্থাপনা
        ├── blob-store.js         # Shared: Blobs store helper
        ├── air-query.mjs         # AI: প্রাকৃতিক ভাষায় AQI প্রশ্ন
        ├── health-advisory.mjs   # AI: ব্যক্তিগতকৃত স্বাস্থ্য পরামর্শ
        ├── accountability-brief.mjs  # AI: ওয়ার্ড-পর্যায়ের জবাবদিহিতা ব্রিফ
        └── anomaly-check.mjs     # AI: PM2.5 spike শনাক্তকরণ
```
