# API Reference

JanVayu ১২টি পাবলিক এন্ডপয়েন্ট প্রদান করে (১১টি Netlify Functions এবং `/api` ওপেন-ডেটা এন্ট্রি পয়েন্ট; এর মধ্যে একটি, `/twitter-feed`, এখন বাতিল করা হয়েছে)। সবগুলোই পাবলিকলি অ্যাক্সেসযোগ্য এবং CORS সাপোর্ট করে। এগুলো JSON রিটার্ন করে, শুধুমাত্র CSV এক্সপোর্ট ছাড়া, যা `text/csv` রিটার্ন করে। রিপোজিটরিটিতে Open Data API-এর অধীনে আরও কিছু ফাংশন (rankings, reference-data, historical-aqi, community-sensors, status-history) এবং কিছু ইন্টারনাল ফাংশন রয়েছে।

**Base URL:** `https://www.janvayu.in/.netlify/functions`

---

## কুইক রেফারেন্স

### AI Features (v25.1)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/air-query` | POST | ন্যাচারাল ল্যাঙ্গুয়েজ AQI প্রশ্নোত্তর |
| `/health-advisory` | POST | ব্যক্তিগত স্বাস্থ্য পরামর্শ |
| `/accountability-brief` | POST | ওয়ার্ড-স্তরের গভর্ন্যান্স ব্রিফ |
| `/anomaly-check` | GET | PM2.5 স্পাইক শনাক্তকরণ |

### সোশ্যাল ফিডস

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/reddit-feed` | GET | ক্যাশ করা Reddit পোস্ট |
| `/twitter-feed` | — | **বাতিল (Retired)।** Nitter পড়ুন, যার পাবলিক ইনস্ট্যান্সগুলো এখন আর নেই; এন্ডপয়েন্টটি আর রেসপন্স করে না এবং কোনো কিছুই এটি কল করে না। |
| `/youtube-feed` | GET | YouTube চ্যানেলের RSS থেকে ক্যাশ করা ভারতের বায়ু-মানের ভিডিও |
| `/news-proxy` | GET | ক্যাশ করা নিউজ আর্টিকেল |
| `/instagram-feed` | GET | ক্যাশ করা Instagram পোস্ট |

### প্ল্যাটফর্ম

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/subscribe` | POST | ইমেইল সাবস্ক্রিপশন ম্যানেজমেন্ট |
| `/feed-status` | GET | ফিড হেলথ মনিটরিং |

### ওপেন ডেটা

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api` | GET | ভার্সন করা ডেটা ম্যানিফেস্ট + CSV এক্সপোর্ট |

---

## Open Data API

JanVayu-এর প্রকাশিত ডেটাসেটগুলোর জন্য একটি একক, সহজে খুঁজে পাওয়া যায় এমন এন্ট্রি পয়েন্ট — যা সাংবাদিক, গবেষক এবং ফর্কের (forks) জন্য তৈরি। এটি রিড-অনলি, CORS-ওপেন এবং অ্যাট্রিবিউশন সহ বিনামূল্যে ব্যবহারযোগ্য।

**ম্যানিফেস্ট (প্রতিটি ডেটাসেট, এর প্যারামিটার, লাইসেন্স এবং সাইটেশন তালিকাভুক্ত করে):**

```bash
curl https://www.janvayu.in/api
```

**লাইভ সিটি র‍্যাঙ্কিংয়ের CSV এক্সপোর্ট:**

```bash
curl "https://www.janvayu.in/api?dataset=rankings&format=csv"          # live
curl "https://www.janvayu.in/api?dataset=rankings&format=csv&range=week" # 7-day average
curl "https://www.janvayu.in/api?dataset=rankings&format=csv&range=month" # 30-day average
```

`rankings` ফাংশনটি `range=live`, `range=week` এবং `range=month` বুঝতে পারে। অন্য যেকোনো ভ্যালু, যার মধ্যে `7d` এবং `30d` (যা ম্যানিফেস্টে তালিকাভুক্ত আছে) অন্তর্ভুক্ত, সেগুলোকে 30-দিনের রেঞ্জ হিসেবে ধরা হয়।
> **পরিচিত সমস্যা:** `/api` ম্যানিফেস্টে `range=7d` দেওয়া থাকলেও র‍্যাঙ্কিং ফাংশন তা বুঝতে পারে না। তাই এটি ৭-দিনের গড়ের বদলে ৩০-দিনের গড় রিটার্ন করে। কোড ঠিক না হওয়া পর্যন্ত ৭-দিনের গড় পেতে `range=week` ব্যবহার করুন।

ম্যানিফেস্টটি ভেতরের JSON এন্ডপয়েন্টগুলোকে নির্দেশ করে — `rankings`, `reference-data` (CPCB স্টেশন / NCAP শহর / IQAir বার্ষিক), `historical-aqi`, `community-sensors`, এবং `status-history` — যেগুলো আলাদাভাবে কল করা যায়।

**লাইসেন্স:** ডেটা কন্টেন্ট CC BY-NC-SA 4.0; কোডটি MIT। অনুগ্রহ করে ম্যানিফেস্টের `citation` ফিল্ডে দেখানো অনুযায়ী সাইট (cite) করুন।

---

## OpenAPI স্পেসিফিকেশন

সম্পূর্ণ OpenAPI 3.1 স্পেক [`openapi.yaml`](openapi.yaml) এ পাওয়া যাবে। এটি Swagger UI, Postman, Insomnia, বা যেকোনো OpenAPI-কম্প্যাটিবল টুলে ইমপোর্ট করুন।

---

## অথেনটিকেশন

কোনো অথেনটিকেশনের প্রয়োজন নেই। সব এন্ডপয়েন্ট পাবলিক।

- **AI এন্ডপয়েন্টগুলো** Groq-এর রেট লিমিটের ওপর নির্ভর করে
- **Feed এন্ডপয়েন্টগুলো** ক্যাশ (প্রতি ৪ ঘণ্টা পরপর প্রি-ফেচ করা হয়) থেকে সার্ভ করে
- **CORS:** সব রেসপন্সে `Access-Control-Allow-Origin: *`

---

## সাধারণ রেসপন্স প্যাটার্ন

### সাকসেস
আপস্ট্রিম বা AI ফেইলিউরের ক্ষেত্রে এন্ডপয়েন্টগুলো HTTP 200 রিটার্ন করে (একটি ফলব্যাক বডি সহ)। তবে ইনভ্যালিড ইনপুটের জন্য 400, ভুল মেথডের জন্য 405, এবং ইন্টারনাল বা আপস্ট্রিম এররের জন্য 500 বা 502 রিটার্ন করে (উদাহরণস্বরূপ, র‍্যাঙ্কিং CSV তৈরি করা না গেলে `/api` 502 রিটার্ন করে)। স্ট্যাটাস কোড এবং রেসপন্স বডি চেক করুন।

### ফলব্যাক
Groq রেট-লিমিটেড হলে AI এন্ডপয়েন্টগুলো র (raw) ডেটা (AI অ্যানালাইসিস ছাড়া) রিটার্ন করে। লাইভ ফেচ ফেইল করলে Feed এন্ডপয়েন্টগুলো পুরোনো ক্যাশ রিটার্ন করে।

### CORS প্রিফ্লাইট
সব POST এন্ডপয়েন্ট OPTIONS রিকোয়েস্টগুলো 204 No Content দিয়ে হ্যান্ডেল করে।

---

## উদাহরণ রিকোয়েস্ট

### বায়ুমান (air quality) সম্পর্কে জিজ্ঞাসা করুন

```bash
curl -X POST https://www.janvayu.in/.netlify/functions/air-query \
  -H "Content-Type: application/json" \
  -d '{"city": "delhi", "question": "Is it safe to go for a run today?"}'
```

### হেলথ অ্যাডভাইজরি (স্বাস্থ্য পরামর্শ) নিন

```bash
curl -X POST https://www.janvayu.in/.netlify/functions/health-advisory \
  -H "Content-Type: application/json" \
  -d '{"city": "mumbai", "age": 35, "conditions": ["asthma"], "hoursOutdoor": 3}'
```

### অ্যানোমালি (অস্বাভাবিকতা) চেক করুন

```bash
curl https://www.janvayu.in/.netlify/functions/anomaly-check
```

### Reddit ফিড নিন

```bash
curl https://www.janvayu.in/.netlify/functions/reddit-feed?filter=delhi
```

### ডাইজেস্ট সাবস্ক্রাইব করুন

```bash
curl -X POST https://www.janvayu.in/.netlify/functions/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "cities": ["delhi", "mumbai"]}'
```
