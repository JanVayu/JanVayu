# আর্কিটেকচার

JanVayu হলো একটি **জিরো-ফ্রেমওয়ার্ক, সিঙ্গেল-পেজ অ্যাপ্লিকেশন** যা Netlify-তে ডিপ্লয় করা হয়েছে। ডেটা প্রক্সি, ক্যাশিং এবং শিডিউলড টাস্কের জন্য এতে সার্ভার-সাইড সার্ভারলেস ফাংশন ব্যবহার করা হয়েছে।

---

## সিস্টেম ডায়াগ্রাম

```
┌─────────────────────────────────────────────────────────┐
│                     Client (Browser)                    │
│  HTML + CSS + JS · Chart.js · Leaflet.js · WAQI API    │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTPS (Netlify CDN)
┌──────────────────────────▼──────────────────────────────┐
│                   Netlify Functions                      │
│                                                          │
│  Scheduled (cron)              On-demand (API)           │
│  ┌──────────────────┐   ┌───────────────────────────┐   │
│  │ scheduled-fetch   │   │ reddit-feed.js            │   │
│  │ (every 4 hours)   │   │ youtube-feed.js           │   │
│  │                   │   │ news-proxy.js             │   │
│  │ daily-digest      │   │ instagram-feed.js         │   │
│  │ (8 AM IST daily)  │   │ feed-status.js            │   │
│  │                   │   │ subscribe.js              │   │
│  │ health-monitor    │   │ air-query.mjs             │   │
│  │ (every 15 min)    │   │ health-advisory.mjs       │   │
│  │ push-send (3 h)   │   │ accountability-brief.mjs  │   │
│  │ feed-health       │   │ anomaly-check.mjs         │   │
│  │ (daily)           │   │ ...and others (see below) │   │
│  └────────┬──────────┘   └─────────────┬─────────────┘   │
│           ▼                                              │
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
    WAQI API           Groq API       External Feeds
  (Real-time AQI)    (AI features)  (Reddit, News)
```

---

## মূল ডিজাইন সিদ্ধান্ত
### স্ট্যাটিক ফ্রন্ট-এন্ড, কোনো বান্ডলার নেই
ফ্রন্ট-এন্ডটি হলো `index.html` এবং এর সাথে `styles.css`, `app.js`, `games.js` এবং `panels/`-এ থাকা ১৯টি লেজি-লোডেড প্যানেল ফ্র্যাগমেন্ট, যেখানে কোনো বান্ডলার বা ফ্রেমওয়ার্ক ব্যবহার করা হয়নি ([Frontend Stack](../tech-stack/frontend.md) দেখুন)। এর ফলে বেসিক HTML/JS জানা কন্ট্রিবিউটররাও কোডবেসটি সহজে ব্যবহার করতে পারেন এবং বিল্ড-টাইমের জটিলতা প্রায় শূন্যের কোঠায় থাকে।

### সার্ভার-সাইড প্রক্সি
CORS সমস্যা এড়াতে এবং API কি সুরক্ষিত রাখতে সোশ্যাল মিডিয়া ও নিউজ API-গুলো Netlify Functions-এর মাধ্যমে ফেচ করা হয়। ক্লায়েন্ট কখনোই সরাসরি এই API-গুলোর সাথে যোগাযোগ করে না।

### ব্লব ক্যাশিং
`scheduled-fetch.mjs` ফাংশনটি প্রতি ৪ ঘণ্টা পরপর রান করে এবং ফিড ডেটা (Reddit, নিউজ; Instagram-এ চেষ্টা করা হয় কিন্তু সাধারণত কিছুই পাওয়া যায় না) Netlify Blobs-এ লিখে রাখে। ব্যবহারকারীরা যখন ফিড রিকোয়েস্ট করেন, তখন অন-ডিমান্ড ফাংশনগুলো ক্যাশ থেকে সাথে সাথে সার্ভ করে — যার ফলে ল্যাটেন্সি এবং API রেট লিমিটের সমস্যা দূর হয়।

### ক্লায়েন্ট-সাইড AQI
ব্রাউজার থেকে প্রতি ১০ মিনিট পরপর সরাসরি WAQI API কল করা হয়। টোকেনটি WAQI তাদের টার্মস অফ সার্ভিস অনুযায়ী ইস্যু করে এবং এটি ক্লায়েন্ট কোডেই দেখা যায়। এর মানে হলো, কোনো সার্ভার-সাইড ইনফ্রাস্ট্রাকচার ছাড়াই রিয়েল-টাইম AQI ডেটা কাজ করে।

### কোনো ফ্রেমওয়ার্ক নেই, কোনো বিল্ড স্টেপ নেই
এখানে কোনো `npm run build`, Webpack বা React নেই। একমাত্র বিল্ড কমান্ড হলো `node scripts/bump-version.mjs`, যা ভার্সনটি আপডেট করে, আর ডিপ্লয় করার জন্য মূলত রিপোজিটরিটিকেই ব্যবহার করা হয়। Netlify রুট থেকে `index.html` সার্ভ করে।

---

## অটো-আপডেট শিডিউল

| কাজ | ফ্রিকোয়েন্সি | ফাংশন |
|------|-----------|----------|
| সোশ্যাল/নিউজ ফিড রিফ্রেশ | প্রতি ৪ ঘণ্টা পরপর | `scheduled-fetch.mjs` |
| দৈনিক AQI ইমেইল ডাইজেস্ট | প্রতিদিন সকাল ৮:০০ টা IST | `daily-digest.mjs` |
| লাইভ AQI ড্যাশবোর্ড | প্রতি ১০ মিনিট পরপর | ক্লায়েন্ট-সাইড JS (WAQI API) |
| অ্যানোমালি ডিটেকশন | অন-ডিমান্ড | `anomaly-check.mjs` |
| আপটাইম এবং ফাংশন হেলথ চেক | প্রতি ১৫ মিনিট পরপর | `health-monitor.mjs` |
| ওয়েব পুশ নোটিফিকেশন | প্রতি ৩ ঘণ্টা পরপর | `push-send.mjs` |
| ফিড হেলথ চেক | প্রতিদিন | `feed-health.mjs` |

---

## ফাইল স্ট্রাকচার


---
```
JanVayu/
├── index.html                    # SPA শেল (এবং styles.css, app.js, games.js, panels/)
├── favicon.svg
├── package.json                  # Node.js নির্ভরতা (Netlify Blobs, Resend, web-push)
├── netlify.toml                  # বিল্ড এবং ডিপ্লয় কনফিগারেশন
├── CNAME                         # কাস্টম ডোমেইন
├── docs/                         # এই ডকুমেন্টেশন (Docsify)
├── downloads/                    # ডাউনলোডেবল রিপোর্ট (PDF, PPTX, DOCX)
└── netlify/
    └── functions/
        ├── scheduled-fetch.mjs   # ক্রন: সব ফিড, প্রতি ৪ ঘণ্টা অন্তর
        ├── daily-digest.mjs      # ক্রন: ইমেইল ডাইজেস্ট, সকাল ৮টা IST
        ├── reddit-feed.js        # API: ক্যাশ করা Reddit পোস্ট
        ├── twitter-feed.js       # API: বাতিল — Nitter পড়ুন, যার পাবলিক ইনস্ট্যান্সগুলো এখন আর নেই
        ├── news-proxy.js         # API: ক্যাশ করা নিউজ আর্টিকেল
        ├── instagram-feed.js     # API: ক্যাশ করা Instagram পোস্ট
        ├── feed-status.js        # API: ফিডের ফ্রেশনেস হেলথ চেক
        ├── subscribe.js          # API: ইমেইল সাবস্ক্রিপশন ম্যানেজমেন্ট
        ├── blob-store.js         # শেয়ার্ড: Blobs স্টোর হেল্পার
        ├── air-query.mjs         # AI: ন্যাচারাল ল্যাঙ্গুয়েজ AQI কোয়েরি
        ├── health-advisory.mjs   # AI: ব্যক্তিগতকৃত স্বাস্থ্য পরামর্শ
        ├── accountability-brief.mjs  # AI: ওয়ার্ড-লেভেল অ্যাকাউন্টেবিলিটি ব্রিফ
        └── anomaly-check.mjs     # AI: PM2.5 স্পাইক ডিটেকশন
```

এই তালিকাটি সম্পূর্ণ নয়: `netlify/functions/`-এ ২৯টি ফাংশন ফাইল এবং শেয়ার্ড `lib/` রয়েছে (উদাহরণস্বরূপ `waqi-proxy`, `rankings`, `data-api`, `push-send`, `fire-tracker`, `terra-collab` এবং `zotero-library`)।
