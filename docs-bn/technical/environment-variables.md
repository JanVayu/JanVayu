# এনভায়রনমেন্ট ভেরিয়েবলস
সব সিক্রেট এবং কনফিগারেশন এনভায়রনমেন্ট ভেরিয়েবলসের মাধ্যমে ম্যানেজ করা হয়। এগুলো **কখনোই রিপোজিটরিতে কমিট করা হয় না**।
- **লোকাল ডেভেলপমেন্টের** জন্য: প্রজেক্ট রুটে একটি `.env` ফাইল তৈরি করুন (এটি gitignored)
- **প্রোডাকশনের** জন্য: [Netlify ড্যাশবোর্ড](https://app.netlify.com)-এ Site Settings → Environment Variables-এর অধীনে এগুলো সেট করুন
---
## প্রয়োজনীয় ভেরিয়েবলস
### `RESEND_API_KEY`
**ব্যবহার করে:** `daily-digest.mjs`, `health-monitor.mjs`, `workshop-submit.mjs`, `terra-collab.mjs`
[Resend](https://resend.com) থেকে আপনার API key। সাবস্ক্রাইবারদের প্রতিদিনের ইমেইল ডাইজেস্ট পাঠানোর জন্য এটি প্রয়োজন।
**কীভাবে পাবেন:**
1. [resend.com](https://resend.com)-এ একটি অ্যাকাউন্ট তৈরি করুন
2. API Keys → Create API Key-তে যান
3. key-টি কপি করুন (এটি মাত্র একবারই দেখানো হয়)
---
### `RESEND_FROM`
**ব্যবহার করে:** `daily-digest.mjs`
ডাইজেস্ট ইমেইলগুলোর জন্য ভেরিফাইড সেন্ডার ইমেইল অ্যাড্রেস। এটি এমন একটি ডোমেইন হতে হবে যা আপনি Resend-এ ভেরিফাই করেছেন।
**উদাহরণ:** `digest@janvayu.in`
---
### `BLOB_TOKEN`
**ব্যবহার করে:** Netlify Blobs রিড/রাইট করে এমন সব ফাংশন
Blobs রিড/রাইট পারমিশনসহ একটি Netlify পার্সোনাল অ্যাক্সেস টোকেন।
**কীভাবে পাবেন:**
1. [Netlify User Settings → Personal Access Tokens](https://app.netlify.com/user/applications)-এ যান
2. একটি নতুন টোকেন জেনারেট করুন
3. এটি কপি করুন (মাত্র একবার দেখানো হয়)
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
AI-চালিত ফিচারগুলোর জন্য Groq API key (এটি `openai/gpt-oss-120b` ব্যবহার করে, যা একটি ওপেন-ওয়েট LLM; অপশনাল `GROQ_MODEL` ভেরিয়েবল দিয়ে মডেলটি ওভাররাইড করা যায়)।
**কীভাবে পাবেন:**
1. [console.groq.com](https://console.groq.com)-এ যান
2. সাইন আপ বা লগ ইন করুন
3. API Keys-এ গিয়ে একটি নতুন key তৈরি করুন
JanVayu-এর AI ফিচারগুলোর জন্য ফ্রি টিয়ারই যথেষ্ট।
---
## অপশনাল ভেরিয়েবলস
এই ভেরিয়েবলগুলো ছাড়া সাইটটি কাজ করে। এর প্রতিটি একটি নির্দিষ্ট ফিচার উন্নত করে এবং এগুলো না থাকলেও কোনো সমস্যা হয় না।
### ফাংশনগুলোর দ্বারা রিড করা অন্যান্য ভেরিয়েবলস
কোড এগুলোও রিড করে; এর প্রতিটিরই ব্যবহারকারী ফাংশনে একটি ডিফল্ট বা ফলব্যাক ভ্যালু থাকে।
| ভেরিয়েবল | রিড বাই | উদ্দেশ্য |
|----------|---------|---------|
| `GROQ_MODEL` | `air-query`, `health-advisory`, `accountability-brief`, `anomaly-check` | Groq মডেলের নাম; ডিফল্ট হলো `openai/gpt-oss-120b` |
| `WAQI_TOKEN` (বা `WAQI_API_TOKEN`) | `waqi-proxy` এবং যেসব ফাংশন সরাসরি WAQI রিড করে | WAQI টোকেন। এটি বাধ্যতামূলক। সোর্সে এর কোনো ফলব্যাক নেই |
| `OPENAQ_API_KEY` | `community-sensors` | OpenAQ API key |
| `FIRMS_MAP_KEY` | `fire-tracker` | NASA FIRMS ম্যাপ key |
| `WORKSHOP_INBOX_EMAIL` | `workshop-submit`, `terra-collab` | ওয়ার্কশপ সাবমিশনের প্রাপক; ডিফল্ট হলো `contribute@janvayu.in` |
| `ALERT_EMAIL` | `health-monitor` | আপটাইম অ্যালার্টের জন্য কমা দিয়ে আলাদা করা প্রাপকদের তালিকা |
| `TERRA_COLLAB_SECRET` | `terra-collab` | ওই ফাংশনের জন্য শেয়ার্ড সিক্রেট |

### `YOUTUBE_API_KEY`
**ব্যবহারকারী:** `youtube-feed.js`
এটি ছাড়া, ভিডিও ফিড আটটি ভারতীয় নিউজ এবং পরিবেশ চ্যানেলের পাবলিক RSS ফিড থেকে ভিডিও সংগ্রহ করে, যেগুলোর শিরোনামে বায়ু মানের কথা উল্লেখ থাকে। এর জন্য কোনো key বা কোটার প্রয়োজন হয় না, তবে এটি কেবল আমাদের তালিকাভুক্ত চ্যানেলগুলোর কভারেজই খুঁজে পেতে পারে। আর দূষণ মৌসুমের বাইরে ওই চ্যানেলগুলো কয়েক সপ্তাহ ধরে বায়ু নিয়ে কিছুই প্রকাশ করে না — তাই আগস্টের মতো মাসে ফিডটি সত্যিই ফাঁকা থাকতে পারে।
এটি থাকলে, ফাংশনটি **YouTube-এ সার্চও করে**, যার ফলে এমন চ্যানেলগুলো থেকেও কভারেজ পাওয়া যায় যেগুলো তালিকায় নেই।
**কীভাবে এটি পাবেন:**
1. [console.cloud.google.com](https://console.cloud.google.com)-এ যান এবং যেকোনো Google অ্যাকাউন্ট দিয়ে সাইন ইন করুন।
2. একটি প্রজেক্ট তৈরি করুন (ওপরের বার → **New Project**), অথবা আগে থেকে থাকা কোনো একটি বেছে নিন।
3. **APIs & Services → Library**-তে গিয়ে **YouTube Data API v3** খুঁজুন, এটি খুলুন এবং **Enable** চাপুন।
4. **APIs & Services → Credentials → Create Credentials → API key**। key-টি কপি করুন।
5. **Edit API key** চাপুন এবং **API restrictions**-এর নিচে **Restrict key** → *YouTube Data API v3* বেছে নিন। অ্যাপ্লিকেশন রেস্ট্রিকশন **None** হিসেবেই রাখুন: Netlify ফাংশনগুলোর অ্যালাউ-লিস্ট করার মতো কোনো নির্দিষ্ট IP নেই। এটিকে একটি API-তে সীমাবদ্ধ রাখার মানে হলো, কোনোভাবে key ফাঁস হলেও এটি কেবল পাবলিক YouTube ডেটা রিড করতে পারবে, অন্য কিছু নয়।
6. Netlify-তে: **Site configuration → Environment variables → Add a variable**, নাম দিন `YOUTUBE_API_KEY`, ভ্যালুটি পেস্ট করুন এবং তারপর রিডিপ্লয় করুন।
ফাংশনটি প্রতিবার ক্যাশে রিফিল করার সময় তিনটি সার্চ কোয়েরি রান করে, এবং ফলাফলটি ক্যাশে সেভ থাকে। তাই একটি ব্যস্ত দিনে সার্চ অ্যালাউন্সের খুব সামান্য অংশই ব্যবহৃত হয়।
---
> **আপডেট 2 Oct 2026:** গুগলের কোটা পেজ এখন `search.list`-এর জন্য প্রতিদিন 100 কলের নিজস্ব বাকেট দেয়, প্রতি কলে 1 ইউনিট; আলাদা 10,000 ইউনিট প্রতিদিন অন্যান্য এন্ডপয়েন্টে প্রযোজ্য ([quota cost reference](https://developers.google.com/youtube/v3/determine_quota_cost))। তাই রিফিল প্রতি তিনটি কোয়েরি 100 দৈনিক সার্চের মধ্যে 3টি ব্যবহার করে।
**এটি শুধুমাত্র সার্ভার-সাইডে পড়া হয়।** কী-টি Netlify ফাংশনে থাকে এবং ব্রাউজারে কখনোই পাঠানো হয় না। এটিকে `index.html`-এ রাখবেন না।
**এটি কাজ করছে কিনা নিশ্চিত করতে**, ফাংশনটি ফেচ করুন এবং `source` দেখুন:
```bash
curl -s https://www.janvayu.in/.netlify/functions/youtube-feed | head -c 200
```
`"source": "channel-rss"` মানে কোনো কী সেট করা নেই। `"source": "channel-rss + data-api"` মানে কী-টি ব্যবহারে আছে।
---
## WAQI Token (Server-Side)
### WAQI API Token
WAQI API টোকেন হলো একটি সার্ভার-সাইড সেটিংস। এটি Netlify সাইট সেটিংসের `WAQI_TOKEN` এনভায়রনমেন্ট ভেরিয়েবল, এবং এই রিপোজিটরির কোনো পেজ, স্ক্রিপ্ট বা ফাংশনে এটি থাকে না। ব্রাউজার শুধুমাত্র `/.netlify/functions/waqi-proxy`-এর মাধ্যমে WAQI-তে পৌঁছায়, যা সার্ভারে টোকেন যোগ করে, শুধুমাত্র সিটি স্লগ, কোঅর্ডিনেট এবং তিন ডিগ্রির চেয়ে চওড়া নয় এমন একটি বাউন্ডিং বক্স গ্রহণ করে, এবং পাঁচ মিনিটের জন্য উত্তরগুলো ক্যাশ করে। টোকেন কমিট করা হলে `scripts/check-no-waqi-token.py` বিল্ড ফেইল করে। 27 October 2026 পর্যন্ত টোকেনটি `app.js`, `js/try-home.js` এবং আটটি ফাংশনে লেখা হয়েছিল, তাই প্রতিটি ভিজিটরের কাছে এটি ছিল; গিট হিস্ট্রির কপিটি পড়ার যোগ্য রয়ে গেছে, তাই যে টোকেনটি কখনো কমিট করা হয়েছিল তাকে [aqicn.org/data-platform/token](https://aqicn.org/data-platform/token/) থেকে একটি নতুন টোকেন দিয়ে প্রতিস্থাপন করতে হবে, এবং Netlify-তে `WAQI_TOKEN` আপডেট করতে হবে (একটি নতুন ডিপ্লয় এটি গ্রহণ করে)।
একটি ফর্কের জন্য, [aqicn.org/data-platform/token](https://aqicn.org/data-platform/token/)-এ আপনার নিজস্ব টোকেন রেজিস্টার করুন এবং এটিকে `WAQI_TOKEN` হিসেবে সেট করুন।
---
## Local `.env` Example
```bash
# Email digest (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RESEND_FROM=digest@janvayu.in

# Netlify Blobs
BLOB_TOKEN=nfp_xxxxxxxxxxxxxxxxxxxx
NETLIFY_SITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# AI features (Groq, gpt-oss-120b)
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Live readings (WAQI), read by waqi-proxy and the functions
WAQI_TOKEN=your_waqi_token

# Optional: YouTube search for the video feed (free tier, no card)
YOUTUBE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
