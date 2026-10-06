# এনভায়রনমেন্ট ভেরিয়েবলস

সব সিক্রেট এবং কনফিগারেশন এনভায়রনমেন্ট ভেরিয়েবলের মাধ্যমে ম্যানেজ করা হয়। এগুলো **কখনোই রিপোজিটরিতে কমিট করা হয় না**।

- **লোকাল ডেভেলপমেন্টের** জন্য: প্রজেক্ট রুটে একটি `.env` ফাইল তৈরি করুন (এটি gitignored)
- **প্রোডাকশনের** জন্য: [Netlify ড্যাশবোর্ড](https://app.netlify.com)-এ Site Settings → Environment Variables-এর অধীনে এগুলো সেট করুন

---

## প্রয়োজনীয় ভেরিয়েবল

### `RESEND_API_KEY`
**ব্যবহার করে:** `daily-digest.mjs`

[Resend](https://resend.com) থেকে আপনার API key। সাবস্ক্রাইবারদের প্রতিদিনের ইমেইল ডাইজেস্ট পাঠানোর জন্য এটি প্রয়োজন।

**কীভাবে পাবেন:**
1. [resend.com](https://resend.com)-এ একটি অ্যাকাউন্ট তৈরি করুন
2. API Keys → Create API Key-তে যান
3. key-টি কপি করুন (এটি কেবল একবারই দেখানো হয়)

---

### `RESEND_FROM`
**ব্যবহার করে:** `daily-digest.mjs`

ডাইজেস্ট ইমেইলগুলোর জন্য ভেরিফাইড সেন্ডার ইমেইল অ্যাড্রেস। এটি এমন একটি ডোমেইন হতে হবে যা আপনি Resend-এ ভেরিফাই করেছেন।

**উদাহরণ:** `digest@janvayu.in`

---

### `BLOB_TOKEN`
**ব্যবহার করে:** Netlify Blobs রিড/রাইট করে এমন সব ফাংশন

Netlify পার্সোনাল অ্যাক্সেস টোকেন, যার Blobs রিড/রাইট পারমিশন আছে।

**কীভাবে পাবেন:**
1. [Netlify User Settings → Personal Access Tokens](https://app.netlify.com/user/applications)-এ যান
2. একটি নতুন টোকেন জেনারেট করুন
3. এটি কপি করুন (কেবল একবারই দেখানো হয়)

---

### `NETLIFY_SITE_ID`
**ব্যবহার করে:** Netlify Blobs রিড/রাইট করে এমন সব ফাংশন

আপনার Netlify সাইটের ইউনিক আইডি।

**কীভাবে পাবেন:**
1. [app.netlify.com](https://app.netlify.com)-এ যান
2. JanVayu সাইটটি খুলুন
3. Site Settings → General → Site ID-তে যান
4. UUID-টি কপি করুন (ফরম্যাট: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

---

### `GROQ_API_KEY`
**ব্যবহার করে:** `air-query.mjs`, `health-advisory.mjs`, `accountability-brief.mjs`, `anomaly-check.mjs`

AI-চালিত ফিচারগুলোর জন্য Groq API key (এটি `openai/gpt-oss-120b` ব্যবহার করে, যা একটি ওপেন-ওয়েট LLM; চাইলে অপশনাল `GROQ_MODEL` ভেরিয়েবল দিয়ে মডেলটি পরিবর্তন করা যায়)।

**কীভাবে পাবেন:**
1. [console.groq.com](https://console.groq.com)-এ যান
2. সাইন আপ করুন বা লগ ইন করুন
3. API Keys-এ গিয়ে একটি নতুন key তৈরি করুন

JanVayu-এর AI ফিচারগুলোর জন্য ফ্রি টিয়ারই যথেষ্ট।

---

## অপশনাল ভেরিয়েবল

এগুলো ছাড়া সাইটটি ঠিকঠাক কাজ করে। এর প্রতিটি একটি নির্দিষ্ট ফিচার উন্নত করে, আর এগুলো না থাকলেও কোনো সমস্যা হয় না।

### ফাংশনগুলোর দ্বারা রিড করা অন্যান্য ভেরিয়েবল

কোড এগুলোও রিড করে; যার প্রতিটিরই ব্যবহারকারী ফাংশনে একটি ডিফল্ট বা ফলব্যাক ভ্যালু থাকে।
| ভেরিয়েবল | যে এটি ব্যবহার করে | উদ্দেশ্য |
|----------|---------|---------|
| `GROQ_MODEL` | `air-query`, `health-advisory`, `accountability-brief`, `anomaly-check` | Groq মডেলের নাম; ডিফল্ট হলো `openai/gpt-oss-120b` |
| `WAQI_TOKEN`, `WAQI_API_TOKEN` | `rankings`, `push-send`, `waqi-proxy` | WAQI টোকেন ওভাররাইড; ফাংশনগুলো সোর্সে থাকা টোকেন ব্যবহার করবে যদি এটি না থাকে |
| `OPENAQ_API_KEY` | `community-sensors` | OpenAQ API key |
| `FIRMS_MAP_KEY` | `fire-tracker` | NASA FIRMS ম্যাপ key |
| `WORKSHOP_INBOX_EMAIL` | `workshop-submit`, `terra-collab` | ওয়ার্কশপ সাবমিশনের রিসিভার; ডিফল্ট হলো `contribute@janvayu.in` |
| `ALERT_EMAIL` | `health-monitor` | আপটাইম অ্যালার্টের জন্য কমা দিয়ে আলাদা করা রিসিভারদের তালিকা |
| `TERRA_COLLAB_SECRET` | `terra-collab` | ওই ফাংশনের জন্য শেয়ার করা সিক্রেট |

### `YOUTUBE_API_KEY`
**ব্যবহার করে:** `youtube-feed.js`

এটি ছাড়া, ভিডিও ফিডটি আটটি ভারতীয় নিউজ এবং পরিবেশ চ্যানেলের পাবলিক RSS ফিড পড়ে এবং শুধুমাত্র সেই ভিডিওগুলো রাখে যেগুলোর শিরোনামে বায়ুদূষণের কথা উল্লেখ থাকে। এর জন্য কোনো key বা কোটার দরকার হয় না, কিন্তু এটি শুধুমাত্র আমাদের তালিকাভুক্ত চ্যানেলগুলোর কভারেজ খুঁজে পেতে পারে। আর দূষণের মৌসুমের বাইরে ওই চ্যানেলগুলো কয়েক সপ্তাহ ধরে বায়ু নিয়ে কোনো খবর প্রকাশ করে না — তাই ধরুন, আগস্ট মাসে ফিডটি সত্যিই ফাঁকা থাকে।

এটি থাকলে, ফাংশনটি YouTube-এ **সার্চ**ও করে, যা এমন সব চ্যানেলে পৌঁছায় যেগুলো আমাদের তালিকায় নেই।

**কীভাবে এটি পাবেন:**
১. [console.cloud.google.com](https://console.cloud.google.com)-এ যান এবং যেকোনো Google অ্যাকাউন্ট দিয়ে সাইন ইন করুন।
২. একটি প্রজেক্ট তৈরি করুন (ওপরের বার → **New Project**), অথবা আগে থেকে থাকা কোনো প্রজেক্ট বেছে নিন।
৩. **APIs & Services → Library**-তে গিয়ে **YouTube Data API v3** খুঁজুন, এটি খুলুন এবং **Enable**-এ চাপ দিন।
৪. **APIs & Services → Credentials → Create Credentials → API key**। key-টি কপি করুন।
৫. **Edit API key**-তে চাপ দিন এবং **API restrictions**-এর নিচে **Restrict key** → *YouTube Data API v3* বেছে নিন। অ্যাপ্লিকেশন রেস্ট্রিকশন **None** হিসেবেই রাখুন: Netlify ফাংশনগুলোর কোনো নির্দিষ্ট IP নেই যা allow-list করা যায়। এটিকে একটি API-তে সীমাবদ্ধ রাখার মানে হলো, যদি key লিকও হয়ে যায়, তবে এটি শুধু পাবলিক YouTube ডেটা পড়তে পারবে, অন্য কিছু করতে পারবে না।
৬. Netlify-তে: **Site configuration → Environment variables → Add a variable**, নাম দিন `YOUTUBE_API_KEY`, ভ্যালুটি পেস্ট করুন এবং তারপর রিডিপ্লয় করুন।

ফাংশনটি প্রতি ক্যাশ রিফিলে (cache refill) তিনটি সার্চ কোয়েরি চালায়, এবং ফলাফলটি ক্যাশ করা থাকে, তাই একটি ব্যস্ত দিনে সার্চ অ্যালাউন্সের খুব সামান্য অংশই খরচ হয়।
---
> **আপডেট ২ অক্টোবর ২০২৬:** গুগলের কোটা পেজে এখন `search.list`-এর জন্য প্রতিদিন ১০০টি কলের নিজস্ব বাকেট দেওয়া হয়েছে, যেখানে প্রতি কলে ১ ইউনিট করে লাগে; আলাদাভাবে প্রতিদিনের ১০,০০০ ইউনিট অন্যান্য এন্ডপয়েন্টের জন্য প্রযোজ্য ([কোটা খরচের রেফারেন্স](https://developers.google.com/youtube/v3/determine_quota_cost))। তাই রিফিল হওয়ার পর তিনটি কোয়েরি ১০০টি দৈনিক সার্চের মধ্যে ৩টি ব্যবহার করে।

**এটি শুধুমাত্র সার্ভার-সাইডে পড়া যায়।** কি-টি Netlify ফাংশনে থাকে এবং কখনোই ব্রাউজারে পাঠানো হয় না, তাই WAQI টোকেনের মতো এটিকে পাবলিক করার প্রয়োজন নেই। এটিকে `index.html`-এ রাখবেন না।

**এটি কাজ করছে কি না নিশ্চিত করতে**, ফাংশনটি ফেচ করুন এবং `source` দেখুন:

```bash
curl -s https://www.janvayu.in/.netlify/functions/youtube-feed | head -c 200
```

`"source": "channel-rss"` মানে কোনো কি সেট করা নেই। `"source": "channel-rss + data-api"` মানে কি-টি ব্যবহার করা হচ্ছে।

---

## ক্লায়েন্ট-সাইড টোকেন (গোপনীয় কিছু নয়)

### WAQI API টোকেন
WAQI API টোকেন (`1f64cc8563a165dc5a6ce48f7eeb9ba0221b63f3`) `app.js`, `js/try-home.js` এবং বেশ কয়েকটি Netlify ফাংশনে যুক্ত করা আছে, তাই যে কেউ এটি পড়তে পারে এবং এটিকে গোপন রাখা সম্ভব নয়। WAQI তাদের [terms of service](https://aqicn.org/data-platform/token/)-এর অধীনে প্রতিটি রেজিস্ট্র্যান্টকে টোকেন ইস্যু করে এবং সমস্ত API অ্যাক্সেসের জন্য একটি বৈধ কি প্রয়োজন হয়; ডিফল্ট কোটা হলো প্রতি কি-এর জন্য প্রতি সেকেন্ডে ১,০০০ রিকোয়েস্ট।

আপনি যদি নিজের WAQI টোকেন ব্যবহার করতে চান (উচ্চতর রেট লিমিটের জন্য), তবে [aqicn.org/data-platform/token](https://aqicn.org/data-platform/token/)-এ রেজিস্টার করুন এবং `index.html`-এ টোকেনটি পরিবর্তন করে দিন।

---

## লোকাল `.env` উদাহরণ

```bash
# ইমেইল ডাইজেস্ট (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RESEND_FROM=digest@janvayu.in

# Netlify Blobs
BLOB_TOKEN=nfp_xxxxxxxxxxxxxxxxxxxx
NETLIFY_SITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# এআই ফিচার (Groq, gpt-oss-120b)
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ঐচ্ছিক: ভিডিও ফিডের জন্য ইউটিউব সার্চ (ফ্রি টিয়ার, কোনো কার্ড নেই)
YOUTUBE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
