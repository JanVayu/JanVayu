# Netlify Functions

JanVayu সমস্ত সার্ভার-সাইড অপারেশনের জন্য [Netlify Functions](https://docs.netlify.com/functions/overview/) ব্যবহার করে। Functions `netlify/functions/`-এ থাকে এবং সাইটের সাথে স্বয়ংক্রিয়ভাবে ডিপ্লয় হয়।

---

## Function রেফারেন্স

### Scheduled Functions (Cron)

#### `scheduled-fetch.mjs`
**ট্রিগার:** প্রতি 4 ঘণ্টায়
**উদ্দেশ্য:** সমস্ত সোশ্যাল ও সংবাদ ফিড ফেচ করে JSON ক্যাশ হিসেবে Netlify Blobs-এ লেখে।

ফেচ করা ফিডসমূহ:
- r/india, r/delhi, r/indianews, r/environment, r/worldnews থেকে Reddit পোস্ট
- Nitter RSS instances-এর মাধ্যমে Twitter/X পোস্ট (হ্যাশট্যাগ: DelhiAirQuality, DelhiPollution, CleanAirIndia ইত্যাদি)
- বায়ুমান বিষয়ে Google News RSS
- RSS-Bridge-এর মাধ্যমে Instagram হ্যাশট্যাগ

এই function নিশ্চিত করে যে on-demand feed functions ক্যাশ থেকে তাৎক্ষণিকভাবে সাড়া দেয়, প্রতিটি ব্যবহারকারীর অনুরোধে লাইভ API কল করার পরিবর্তে।

---

#### `daily-digest.mjs`
**ট্রিগার:** প্রতিদিন সকাল 8:00 AM IST (2:30 AM UTC)
**উদ্দেশ্য:** Netlify Blobs থেকে সমস্ত সাবস্ক্রাইবার পড়ে, প্রতিটি সাবস্ক্রাইবারের শহরের জন্য বর্তমান AQI ফেচ করে, এবং Resend এর মাধ্যমে ব্যক্তিগতকৃত HTML ইমেল পাঠায়।

প্রতিটি ইমেলে থাকে:
- বর্তমান AQI রিডিং ও শ্রেণী
- দিনের জন্য স্বাস্থ্য পরামর্শ
- আগের দিনের রিডিংয়ের সাথে তুলনা

**ডিপেন্ডেন্সি:** `RESEND_API_KEY`, `RESEND_FROM`, `BLOB_TOKEN`, `NETLIFY_SITE_ID`

---

### On-Demand API Functions

#### `reddit-feed.js`
**Endpoint:** `GET /.netlify/functions/reddit-feed`
**উদ্দেশ্য:** Netlify Blobs থেকে ক্যাশকৃত বায়ুমান সম্পর্কিত Reddit পোস্ট ফেরত দেয়।
ক্যাশ খালি থাকলে লাইভ Reddit ফেচে ফলব্যাক হয়।

---

#### `twitter-feed.js`
**Endpoint:** `GET /.netlify/functions/twitter-feed`
**উদ্দেশ্য:** Netlify Blobs থেকে Nitter RSS এর মাধ্যমে ক্যাশকৃত Twitter/X পোস্ট ফেরত দেয়।

---

#### `news-proxy.js`
**Endpoint:** `GET /.netlify/functions/news-proxy`
**উদ্দেশ্য:** বায়ুমান বিষয়ক ক্যাশকৃত Google News RSS নিবন্ধ ফেরত দেয়।

---

#### `instagram-feed.js`
**Endpoint:** `GET /.netlify/functions/instagram-feed`
**উদ্দেশ্য:** RSS-Bridge instances-এর মাধ্যমে ক্যাশকৃত Instagram হ্যাশট্যাগ পোস্ট ফেরত দেয়।

---

#### `feed-status.js`
**Endpoint:** `GET /.netlify/functions/feed-status`
**উদ্দেশ্য:** ফিড ফ্রেশনেস ফেরত দেয় — প্রতিটি ফিড কখন শেষবার আপডেট হয়েছিল এবং সাম্প্রতিক ফেচ সফল হয়েছিল কিনা। ক্লায়েন্ট "Data last updated: X" সার্ভার-সাইড সত্যতা সহ দেখাতে ব্যবহার করে।

**রেসপন্স আকৃতি:**
```json
{
  "last_updated": "2026-03-23T12:00:00Z",
  "feeds": {
    "reddit": { "updated_at": "...", "status": "ok" },
    "twitter": { "updated_at": "...", "status": "ok" },
    "news": { "updated_at": "...", "status": "ok" }
  }
}
```

---

#### `subscribe.js`
**Endpoint:** `POST /.netlify/functions/subscribe`
**উদ্দেশ্য:** ইমেল সাবস্ক্রিপশন পরিচালনা করে। `subscribe` এবং `unsubscribe` অ্যাকশন গ্রহণ করে।

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
| `email` | হ্যাঁ | সাবস্ক্রাইবার ইমেল |
| `cities` | হ্যাঁ | শহরের কী-এর অ্যারে (`daily-digest.mjs`-এ শহরের তালিকা দেখুন) |
| `threshold` | না | AQI থ্রেশহোল্ড; সেট করা থাকলে, AQI এই মান ছাড়ালেই পাঠানো হবে |
| `action` | হ্যাঁ | `"subscribe"` বা `"unsubscribe"` |

---

### AI Functions (Gemini-চালিত)

সমস্ত AI functions `@google/generative-ai` এর মাধ্যমে Google Gemini ব্যবহার করে। এদের `GEMINI_API_KEY` প্রয়োজন।

#### `air-query.mjs`
**Endpoint:** `GET /.netlify/functions/air-query?city={cityKey}&question={question}`
**উদ্দেশ্য:** একটি শহরের বায়ুমান সম্পর্কে প্রাকৃতিক ভাষায় প্রশ্ন গ্রহণ করে, WAQI থেকে সরাসরি AQI ফেচ করে, এবং উভয়ই একটি তথ্যভিত্তিক উত্তরের জন্য Gemini-তে পাঠায়।

**উদাহরণ:** `?city=delhi&question=Is it safe to take my child to the park today?`

---

#### `health-advisory.mjs`
**Endpoint:** `POST /.netlify/functions/health-advisory`
**উদ্দেশ্য:** ব্যবহারকারীর প্রোফাইল (বয়স, স্বাস্থ্য অবস্থা) এবং তাদের শহরের বর্তমান AQI-এর উপর ভিত্তি করে ব্যক্তিগতকৃত স্বাস্থ্য পরামর্শ তৈরি করে।

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
**Endpoint:** `GET /.netlify/functions/accountability-brief?city={cityKey}`
**উদ্দেশ্য:** নির্দিষ্ট শহরের জন্য কাঠামোবদ্ধ জবাবদিহিতা ব্রিফ তৈরি করে — ওয়ার্ড কাউন্সিলর, সাংবাদিক, বা রেসিডেন্ট অ্যাসোসিয়েশনের জন্য উপযুক্ত। বর্তমান AQI, NCAP অগ্রগতি, এবং প্রস্তাবিত প্রশ্ন অন্তর্ভুক্ত।

---

#### `anomaly-check.mjs`
**Endpoint:** `GET /.netlify/functions/anomaly-check`
**উদ্দেশ্য:** প্রধান শহরগুলোর AQI ঋতুভিত্তিক বেসলাইনের বিপরীতে পরীক্ষা করে এবং উল্লেখযোগ্য spike চিহ্নিত করে। ঐচ্ছিকভাবে anomaly-র সম্ভাব্য কারণ ব্যাখ্যা করতে Gemini ব্যবহার করে।

---

### শেয়ার্ড ইউটিলিটি

#### `blob-store.js`
HTTP function নয় — অন্য functions দ্বারা ব্যবহৃত একটি শেয়ার্ড CommonJS মডিউল যা explicit credential fallback সহ Netlify Blobs store instance তৈরি করে।

```js
const { getBlobStore } = require('./blob-store');
const store = getBlobStore('janvayu-feeds');
```
