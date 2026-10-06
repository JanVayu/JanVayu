# Netlify Functions

JanVayu সমস্ত সার্ভার-সাইড অপারেশনের জন্য [Netlify Functions](https://docs.netlify.com/functions/overview/) ব্যবহার করে। ফাংশনগুলো `netlify/functions/` ফোল্ডারে থাকে এবং সাইটের সাথেই স্বয়ংক্রিয়ভাবে ডিপ্লয় হয়ে যায়।

---

## ফাংশন রেফারেন্স

### শিডিউলড ফাংশন (Cron)

#### `scheduled-fetch.mjs`
**ট্রিগার:** প্রতি ৪ ঘণ্টা অন্তর  
**উদ্দেশ্য:** সমস্ত সোশ্যাল এবং নিউজ ফিড ফেচ করে Netlify Blobs-এ JSON ক্যাশ হিসেবে সেভ করে।

ফেচ করা ফিড:
- r/india, r/delhi, r/indianews, r/environment, r/worldnews থেকে Reddit পোস্ট
- ~~Nitter RSS ইনস্ট্যান্সের মাধ্যমে Twitter/X পোস্ট~~ — **অবসরপ্রাপ্ত।** Nitter-এর পাবলিক ইনস্ট্যান্সগুলো বন্ধ হয়ে গেছে এবং এর এন্ডপয়েন্ট এখন আর একেবারেই রেসপন্স করে না। X এখন লিংক করা থাকে, ফেচ করা হয় না: লাইভ সার্চ এবং নির্দিষ্ট অ্যাকাউন্টগুলো এখন X-এর পাবলিক এমবেড এন্ডপয়েন্টের বিপরীতে `scripts/verify-x-links.py` দিয়ে ভেরিফাই করা হয়।
- বাতাসের মান সংক্রান্ত বিষয়ের জন্য Google News RSS
- RSS-Bridge-এর মাধ্যমে Instagram হ্যাশট্যাগ

এই ফাংশনটি নিশ্চিত করে যে, অন-ডিমান্ড ফিড ফাংশনগুলো প্রতিটি ইউজারের রিকোয়েস্টে লাইভ API কল করার বদলে ক্যাশ থেকে তাৎক্ষণিকভাবে রেসপন্স করবে।

---

#### `daily-digest.mjs`
**ট্রিগার:** প্রতিদিন সকাল ৮:০০ টা IST (ভোর ২:৩০ টা UTC)  
**উদ্দেশ্য:** Netlify Blobs থেকে সমস্ত সাবস্ক্রাইবারদের তথ্য পড়ে, প্রত্যেক সাবস্ক্রাইবারের শহরের বর্তমান AQI ফেচ করে এবং Resend-এর মাধ্যমে একটি পার্সোনালাইজড HTML ইমেইল পাঠায়।

প্রতিটি ইমেইলে যা যা থাকে:
- বর্তমান AQI রিডিং এবং ক্যাটাগরি
- দিনের জন্য স্বাস্থ্য বিষয়ক পরামর্শ

**নির্ভরশীলতা (Dependencies):** `RESEND_API_KEY`, `RESEND_FROM`, `BLOB_TOKEN`, `NETLIFY_SITE_ID`

---

### অন-ডিমান্ড API ফাংশন

#### `reddit-feed.js`
**এন্ডপয়েন্ট:** `GET /.netlify/functions/reddit-feed`  
**উদ্দেশ্য:** Netlify Blobs থেকে বাতাসের মান সংক্রান্ত ক্যাশ করা Reddit পোস্ট রিটার্ন করে।  
ক্যাশ ফাঁকা থাকলে লাইভ Reddit ফেচ থেকে ডেটা নেয়।

---

#### `twitter-feed.js`
**এন্ডপয়েন্ট:** `GET /.netlify/functions/twitter-feed`  
**উদ্দেশ্য:** *অবসরপ্রাপ্ত।* এটি Nitter থেকে ডেটা নিত, যার পাবলিক ইনস্ট্যান্সগুলো এখন বন্ধ; প্রোডাকশনের সাথে তুলনা করলে এটি একেবারেই রেসপন্স করে না। এটি এখন আর কেউ কল করে না — ফ্রন্ট এন্ড ফেচ করার বদলে সরাসরি X-এ লিংক করে।

---

#### `news-proxy.js`
**এন্ডপয়েন্ট:** `GET /.netlify/functions/news-proxy`  
**উদ্দেশ্য:** বাতাসের মান সংক্রান্ত বিষয়গুলোর ওপর ক্যাশ করা Google News RSS আর্টিকেল রিটার্ন করে।

---

#### `instagram-feed.js`
**এন্ডপয়েন্ট:** `GET /.netlify/functions/instagram-feed`  
**উদ্দেশ্য:** RSS-Bridge ইনস্ট্যান্সের মাধ্যমে ক্যাশ করা Instagram হ্যাশট্যাগ পোস্ট রিটার্ন করে।

---
#### `feed-status.js`
**এন্ডপয়েন্ট:** `GET /.netlify/functions/feed-status`  
**উদ্দেশ্য:** ফিডের সতেজতা (freshness) রিটার্ন করে — প্রতিটি ফিড শেষবার কবে আপডেট করা হয়েছিল এবং সাম্প্রতিক ফেচগুলো সফল হয়েছে কি না। সার্ভার-সাইড সত্যতার সাথে "Data last updated: X" দেখানোর জন্য ক্লায়েন্ট এটি ব্যবহার করে।

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
**উদ্দেশ্য:** ইমেইল সাবস্ক্রিপশন পরিচালনা করে। `subscribe` এবং `unsubscribe` অ্যাকশন গ্রহণ করে।

**রিকোয়েস্ট বডি:**
```json
{
  "email": "user@example.com",
  "cities": ["delhi", "mumbai"],
  "threshold": 150,
  "action": "subscribe"
}
```

| ফিল্ড | আবশ্যক | বিবরণ |
|-------|----------|-------------|
| `email` | হ্যাঁ | সাবস্ক্রাইবার ইমেইল |
| `cities` | হ্যাঁ | সিটি কি-এর অ্যারে (`daily-digest.mjs`-এ সিটি তালিকা দেখুন) |
| `threshold` | না | AQI থ্রেশহোল্ড; বাদ দিলে ডিফল্ট 200 হয়। এটি ডাইজেস্ট থামায় না: `daily-digest.mjs` প্রতিদিন প্রত্যেক সাবস্ক্রাইবারকে ইমেইল পাঠায়, এবং থ্রেশহোল্ড শুধুমাত্র অ্যালার্টের শব্দ পরিবর্তন করে |
| `action` | হ্যাঁ | `"subscribe"` বা `"unsubscribe"` |

---

### এআই ফাংশন (Groq-চালিত)

সব এআই ফাংশন Groq REST API (OpenAI-কম্প্যাটিবল)-এর মাধ্যমে OpenAI gpt-oss-120b (একটি ওপেন-ওয়েট LLM; ডিফল্টভাবে `openai/gpt-oss-120b`, যা `GROQ_MODEL` দিয়ে পরিবর্তন করা যায়) ব্যবহার করে। এগুলোর জন্য `GROQ_API_KEY` প্রয়োজন।

#### `air-query.mjs`
**এন্ডপয়েন্ট:** `POST /.netlify/functions/air-query` (অন্যান্য মেথড বাতিল করা হয়)  
**উদ্দেশ্য:** শহরের বায়ুদূষণ সম্পর্কে একটি স্বাভাবিক ভাষার প্রশ্ন গ্রহণ করে, WAQI থেকে লাইভ AQI নিয়ে আসে এবং একটি তথ্যভিত্তিক উত্তরের জন্য Groq-এর মাধ্যমে gpt-oss-120b-তে পাঠায়।

**রিকোয়েস্ট বডি:**
```json
{
  "city": "delhi",
  "question": "Is it safe to take my child to the park today?"
}
```

একটি ঐচ্ছিক `lang` ফিল্ড উত্তরের ভাষা অনুরোধ করে।

---

#### `health-advisory.mjs`
**এন্ডপয়েন্ট:** `POST /.netlify/functions/health-advisory`  
**উদ্দেশ্য:** ব্যবহারকারীর প্রোফাইল (বয়স, স্বাস্থ্যগত অবস্থা) এবং তাদের শহরের বর্তমান AQI-এর ওপর ভিত্তি করে একটি ব্যক্তিগতকৃত স্বাস্থ্য পরামর্শ তৈরি করে।

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
**এন্ডপয়েন্ট:** `{"city": "delhi", "area": "..."}` এর মতো একটি JSON বডি সহ `POST /.netlify/functions/accountability-brief` (`city` এবং `area` বাধ্যতামূলক; `period` ঐচ্ছিক)  
**উদ্দেশ্য:** নির্দিষ্ট শহরের জন্য একটি কাঠামোগত জবাবদিহিতা ব্রিফ তৈরি করে — যা ওয়ার্ড কাউন্সিলর, সাংবাদিক বা আবাসিক সমিতিগুলোর জন্য উপযুক্ত। এতে বর্তমান AQI, NCAP-এর অগ্রগতি এবং প্রস্তাবিত প্রশ্নাবলী অন্তর্ভুক্ত থাকে।

---

#### `anomaly-check.mjs`
**এন্ডপয়েন্ট:** `GET /.netlify/functions/anomaly-check`  
**উদ্দেশ্য:** প্রধান শহরগুলোর AQI মৌসুমী বেসলাইনের সাথে যাচাই করে এবং উল্লেখযোগ্য বৃদ্ধি থাকলে তা চিহ্নিত করে। অ্যানোমালি বা অস্বাভাবিকতার সম্ভাব্য কারণ ব্যাখ্যা করতে এটি ঐচ্ছিকভাবে Groq-এর মাধ্যমে gpt-oss-120b ব্যবহার করে।

---

### অন্যান্য ফাংশন

`netlify/functions/`-এ মোট ২৯টি ফাংশন ফাইল রয়েছে। ওপরে বর্ণিত নয় এমন ফাংশনগুলোর মধ্যে রয়েছে `waqi-proxy`, `rankings`, `historical-aqi`, `data-api`, `fire-tracker`, `community-sensors`, `push-subscribe`, `push-send`, `health-monitor`, `feed-health`, `status-history`, `terra-collab`, `workshop-submit`, `zotero-library` এবং `reference-data`। এগুলোর রেফারেন্স এন্ট্রি এখনও লেখা হয়নি।

---

### শেয়ার্ড ইউটিলিটিজ

#### `blob-store.js`
এটি কোনো HTTP ফাংশন নয় — এটি একটি শেয়ার্ড CommonJS মডিউল যা অন্যান্য ফাংশনগুলো ব্যবহার করে। এর মাধ্যমে এক্সপ্লিসিট ক্রেডেনশিয়াল ফলব্যাকসহ একটি Netlify Blobs স্টোর ইনস্ট্যান্স তৈরি করা যায়।

```js
const { getBlobStore } = require('./blob-store');
const store = getBlobStore('janvayu-feeds');
```
