# Netlify Functions

JanVayu সমস্ত সার্ভার-সাইড কাজের জন্য [Netlify Functions](https://docs.netlify.com/functions/overview/) ব্যবহার করে। ফাংশনগুলো `netlify/functions/` ফোল্ডারে থাকে এবং সাইটের সাথে স্বয়ংক্রিয়ভাবে ডিপ্লয় হয়।

---

## ফাংশন রেফারেন্স

### শিডিউলড ফাংশন (Cron)

#### `scheduled-fetch.mjs`
**ট্রিগার:** প্রতি ৪ ঘণ্টা পর পর  
**উদ্দেশ্য:** সমস্ত সোশ্যাল এবং নিউজ ফিড ফেচ করে এবং সেগুলোকে Netlify Blobs-এ JSON ক্যাশ হিসেবে সেভ করে।

ফেচ করা ফিডসমূহ:
- r/india, r/delhi, r/indianews, r/environment, r/worldnews থেকে Reddit পোস্ট
- ~~Nitter RSS ইনস্ট্যান্সের মাধ্যমে Twitter/X পোস্ট~~ — **অবসরপ্রাপ্ত (retired)।** Nitter-এর পাবলিক ইনস্ট্যান্সগুলো বন্ধ হয়ে গেছে এবং এর এন্ডপয়েন্ট এখন আর কোনো রেসপন্স দেয় না। X এখন লিংক করা থাকে, ফেচ করা হয় না: লাইভ সার্চ এবং নির্দিষ্ট অ্যাকাউন্টগুলো X-এর পাবলিক এমবেড এন্ডপয়েন্টের বিপরীতে `scripts/verify-x-links.py` দিয়ে যাচাই করা হয়।
- বাতাসের মান সম্পর্কিত বিষয়ের জন্য Google News RSS
- RSS-Bridge-এর মাধ্যমে Instagram হ্যাশট্যাগ

এই ফাংশনটি নিশ্চিত করে যে অন-ডিমান্ড ফিড ফাংশনগুলো প্রতিটি ইউজারের রিকোয়েস্টে লাইভ API কল করার বদলে ক্যাশ থেকে তাৎক্ষণিকভাবে রেসপন্স দেয়।

---

#### `daily-digest.mjs`
**ট্রিগার:** প্রতিদিন সকাল 8:00 AM IST (2:30 AM UTC)  
**উদ্দেশ্য:** Netlify Blobs থেকে সমস্ত সাবস্ক্রাইবারদের তালিকা পড়ে, প্রতিটি সাবস্ক্রাইবারের শহরের বর্তমান AQI ফেচ করে এবং Resend-এর মাধ্যমে একটি পার্সোনালাইজড HTML ইমেইল পাঠায়।

প্রতিটি ইমেইলে যা যা থাকে:
- বর্তমান AQI রিডিং এবং ক্যাটাগরি
- দিনের জন্য স্বাস্থ্য পরামর্শ

**নির্ভরশীলতা (Dependencies):** `RESEND_API_KEY`, `RESEND_FROM`, `BLOB_TOKEN`, `NETLIFY_SITE_ID`

---

### অন-ডিমান্ড API ফাংশন

#### `reddit-feed.js`
**এন্ডপয়েন্ট:** `GET /.netlify/functions/reddit-feed`  
**উদ্দেশ্য:** Netlify Blobs থেকে বাতাসের মান সম্পর্কিত ক্যাশ করা Reddit পোস্টগুলো রিটার্ন করে।  
ক্যাশ ফাঁকা থাকলে লাইভ Reddit ফেচে ফিরে যায়।

---

#### `twitter-feed.js`
**এন্ডপয়েন্ট:** `GET /.netlify/functions/twitter-feed`  
**উদ্দেশ্য:** *অবসরপ্রাপ্ত (Retired)।* এটি Nitter থেকে ডেটা পড়ত, যার পাবলিক ইনস্ট্যান্সগুলো এখন আর নেই; প্রোডাকশনের সাথে তুলনা করলে এটি একেবারেই কোনো রেসপন্স দেয় না। কেউ এটি কল করে না — ফ্রন্ট এন্ড এর বদলে সরাসরি X-এর সাথে লিংক করে।

---

#### `news-proxy.js`
**এন্ডপয়েন্ট:** `GET /.netlify/functions/news-proxy`  
**উদ্দেশ্য:** বাতাসের মান সম্পর্কিত বিষয়ের ওপর ক্যাশ করা Google News RSS আর্টিকেলগুলো রিটার্ন করে।

---

#### `instagram-feed.js`
**এন্ডপয়েন্ট:** `GET /.netlify/functions/instagram-feed`  
**উদ্দেশ্য:** RSS-Bridge ইনস্ট্যান্সের মাধ্যমে ক্যাশ করা Instagram হ্যাশট্যাগ পোস্টগুলো রিটার্ন করে।

---
#### `feed-status.js`
**এন্ডপয়েন্ট:** `GET /.netlify/functions/feed-status`  
**উদ্দেশ্য:** ফিডের ফ্রেশনেস রিটার্ন করে — প্রতিটি ফিড শেষ কবে আপডেট করা হয়েছিল এবং সাম্প্রতিক ফেচগুলো সফল হয়েছিল কি না। সার্ভার-সাইডের সঠিক তথ্য দিয়ে "Data last updated: X" দেখানোর জন্য ক্লায়েন্ট এটি ব্যবহার করে।

**রেসপন্স শেপ:**
```json
{
  "last_updated": "2026-03-23T12:00:00Z",
  "schedule": "Netlify feeds every 4 hours, email digest daily at 8 AM IST",
  "log": { },
  "email_log": { },
  "server_time": "2026-03-23T12:05:00Z"
}
```

---

#### `subscribe.js`
**এন্ডপয়েন্ট:** `POST /.netlify/functions/subscribe`  
**উদ্দেশ্য:** ইমেইল সাবস্ক্রিপশন ম্যানেজ করে। `subscribe` এবং `unsubscribe` অ্যাকশন অ্যাক্সেপ্ট করে।

**রিকোয়েস্ট বডি:**
```json
{
  "email": "user@example.com",
  "cities": ["delhi", "mumbai"],
  "threshold": 150,
  "action": "subscribe"
}
```

| ফিল্ড | প্রয়োজনীয় | বিবরণ |
|-------|----------|-------------|
| `email` | হ্যাঁ | সাবস্ক্রাইবার ইমেইল |
| `cities` | হ্যাঁ | সিটি কি-এর অ্যারে (`daily-digest.mjs`-এ সিটি লিস্ট দেখুন) |
| `threshold` | না | AQI থ্রেশহোল্ড; বাদ দিলে ডিফল্ট 200 হয়। এটি ডাইজেস্ট বন্ধ করে না: `daily-digest.mjs` প্রতিদিন প্রতিটি সাবস্ক্রাইবারকে ইমেইল পাঠায়, আর থ্রেশহোল্ড শুধু অ্যালার্টের ভাষা পরিবর্তন করে |
| `action` | হ্যাঁ | `"subscribe"` বা `"unsubscribe"` |

---

### এআই ফাংশন (Groq-Powered)

সব এআই ফাংশন Groq REST API (OpenAI-কম্প্যাটিবল)-এর মাধ্যমে OpenAI gpt-oss-120b (একটি ওপেন-ওয়েট LLM; ডিফল্ট `openai/gpt-oss-120b`, `GROQ_MODEL` দিয়ে ওভাররাইড করা যায়) ব্যবহার করে। এগুলোর জন্য `GROQ_API_KEY` প্রয়োজন।

#### `air-query.mjs`
**এন্ডপয়েন্ট:** `POST /.netlify/functions/air-query` (অন্যান্য মেথড রিজেক্ট করা হয়)  
**উদ্দেশ্য:** একটি শহরের বায়ুমান নিয়ে ন্যাচারাল ল্যাঙ্গুয়েজ প্রশ্ন অ্যাক্সেপ্ট করে, WAQI থেকে লাইভ AQI ফেচ করে, এবং একটি তথ্যভিত্তিক রেসপন্সের জন্য Groq-এর মাধ্যমে gpt-oss-120b-তে উভয়টি পাঠায়।

**রিকোয়েস্ট বডি:**
```json
{
  "city": "delhi",
  "question": "Is it safe to take my child to the park today?"
}
```

একটি অপশনাল `lang` ফিল্ড রেসপন্সের ভাষা রিকোয়েস্ট করতে পারে।

---

#### `health-advisory.mjs`
**এন্ডপয়েন্ট:** `POST /.netlify/functions/health-advisory`  
**উদ্দেশ্য:** ব্যবহারকারীর প্রোফাইল (বয়স, স্বাস্থ্যগত অবস্থা) এবং তাদের শহরের বর্তমান AQI-এর ওপর ভিত্তি করে একটি পার্সোনালাইজড হেলথ অ্যাডভাইজরি তৈরি করে।

**রিকোয়েস্ট বডি:**
```json
{
  "city": "delhi",
  "age": 45,
  "conditions": ["asthma", "heart disease"]
}
```

---
#### `accountability-brief.mjs`
**এন্ডপয়েন্ট:** `POST /.netlify/functions/accountability-brief` যেখানে একটি JSON বডি থাকবে যেমন `{"city": "delhi", "area": "..."}` (`city` এবং `area` বাধ্যতামূলক; `period` ঐচ্ছিক)  
**উদ্দেশ্য:** নির্দিষ্ট শহরের জন্য একটি সাজানো জবাবদিহিমূলক ব্রিফ তৈরি করে — যা ওয়ার্ড কাউন্সিলর, সাংবাদিক বা আবাসিক সমিতিগুলোর জন্য উপযুক্ত। এতে বর্তমান AQI, NCAP-এর অগ্রগতি এবং কিছু প্রস্তাবিত প্রশ্ন থাকে।

---

#### `anomaly-check.mjs`
**এন্ডপয়েন্ট:** `GET /.netlify/functions/anomaly-check`  
**উদ্দেশ্য:** প্রধান শহরগুলোর AQI মৌসুমী বেসলাইনের সাথে মিলিয়ে দেখে এবং অস্বাভাবিক বৃদ্ধি থাকলে তা চিহ্নিত করে। প্রয়োজনে Groq-এর মাধ্যমে gpt-oss-120b ব্যবহার করে এই অস্বাভাবিকতার সম্ভাব্য কারণ ব্যাখ্যা করে।

---

### অন্যান্য ফাংশন

`netlify/functions/`-এ মোট ২৮টি ফাংশন ফাইল রয়েছে। ওপরে যেগুলোর বর্ণনা দেওয়া হয়নি তার মধ্যে রয়েছে `waqi-proxy`, `rankings`, `historical-aqi`, `data-api`, `fire-tracker`, `community-sensors`, `push-subscribe`, `push-send`, `health-monitor`, `feed-health`, `status-history`, `terra-collab`, `workshop-submit` এবং `reference-data`। এগুলোর রেফারেন্স এন্ট্রি এখনও লেখা হয়নি।

---

### শেয়ার্ড ইউটিলিটি

#### `blob-store.js`
এটি কোনো HTTP ফাংশন নয় — এটি একটি শেয়ার্ড CommonJS মডিউল, যা অন্য ফাংশনগুলো ব্যবহার করে এক্সপ্লিসিট ক্রেডেনশিয়াল ফলব্যাকসহ একটি Netlify Blobs স্টোর ইনস্ট্যান্স তৈরি করতে।

```js
const { getBlobStore } = require('./blob-store');
const store = getBlobStore('janvayu-feeds');
```
