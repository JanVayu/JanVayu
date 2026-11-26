# API Reference
এই পৃষ্ঠায় ১২টি পাবলিক এন্ডপয়েন্ট তালিকাভুক্ত করা হয়েছে (১১টি Netlify Functions এবং `/api` ওপেন-ডেটা এন্ট্রি পয়েন্ট; এর মধ্যে একটি, `/twitter-feed`, এখন বাতিল)। সাইটের নিজস্ব পেজগুলো আরও যে দুটি এন্ডপয়েন্ট কল করে, `/waqi-proxy` এবং `/air-model`, সেগুলো [Netlify Functions](../technical/netlify-functions.md)-এ বর্ণনা করা হয়েছে। সবগুলোই সর্বজনীনভাবে অ্যাক্সেসযোগ্য এবং CORS সাপোর্ট করে। এগুলো JSON রিটার্ন করে, শুধু CSV এক্সপোর্ট ছাড়া, যা `text/csv` রিটার্ন করে। রিপোজিটরিতে Open Data API-এর অধীনে আরও কিছু ফাংশন (rankings, reference-data, historical-aqi, community-sensors, status-history) এবং কিছু অভ্যন্তরীণ ফাংশনও রয়েছে।
**বেস ইউআরএল (Base URL):** `https://www.janvayu.in/.netlify/functions`
---
## কুইক রেফারেন্স
### এআই ফিচার (প্রথমবার v25.1-এ রিলিজ হয়েছে)
| এন্ডপয়েন্ট | মেথড | বিবরণ |
|----------|--------|-------------|
| `/air-query` | POST | ন্যাচারাল ল্যাঙ্গুয়েজ AQI প্রশ্নোত্তর |
| `/health-advisory` | POST | ব্যক্তিগতকৃত স্বাস্থ্য পরামর্শ |
| `/accountability-brief` | POST | ওয়ার্ড-স্তরের গভর্ন্যান্স ব্রিফ |
| `/anomaly-check` | GET | PM2.5 স্পাইক শনাক্তকরণ |
### সোশ্যাল ফিডস
| এন্ডপয়েন্ট | মেথড | বিবরণ |
|----------|--------|-------------|
| `/reddit-feed` | GET | ক্যাশ করা Reddit পোস্ট |
| `/twitter-feed` | — | **বাতিল (Retired)।** Nitter রিড করুন, যার পাবলিক ইনস্ট্যান্সগুলো এখন আর নেই; এই এন্ডপয়েন্টটি আর রেসপন্স করে না এবং কেউ এটি কলও করে না। |
| `/youtube-feed` | GET | YouTube চ্যানেলের RSS থেকে ক্যাশ করা ভারতের বায়ু-মানের ভিডিও |
| `/news-proxy` | GET | ক্যাশ করা নিউজ আর্টিকেল |
| `/instagram-feed` | GET | ক্যাশ করা Instagram পোস্ট |
### প্ল্যাটফর্ম
| এন্ডপয়েন্ট | মেথড | বিবরণ |
|----------|--------|-------------|
| `/subscribe` | POST | ইমেইল সাবস্ক্রিপশন ম্যানেজমেন্ট |
| `/feed-status` | GET | ফিড হেলথ মনিটরিং |
### ওপেন ডেটা
| এন্ডপয়েন্ট | মেথড | বিবরণ |
|----------|--------|-------------|
| `/api` | GET | ভার্সনড ডেটা ম্যানিফেস্ট + CSV এক্সপোর্ট |
---
## ওপেন ডেটা API
JanVayu যেসব ডেটাসেট প্রকাশ করে, সেগুলোর জন্য একটি একক ও সহজে খুঁজে পাওয়া যায় এমন এন্ট্রি পয়েন্ট — যা সাংবাদিক, গবেষক এবং ফর্কগুলোর (forks) জন্য তৈরি করা হয়েছে। এটি রিড-অনলি, CORS-ওপেন এবং অ্যাট্রিবিউশনসহ ব্যবহার করা বিনামূল্যে।
**ম্যানিফেস্ট (প্রতিটি ডেটাসেট, এর প্যারামিটার, লাইসেন্স এবং সাইটেশন তালিকাভুক্ত করে):**
```bash
curl https://www.janvayu.in/api
```
**লাইভ সিটি র‍্যাঙ্কিংয়ের CSV এক্সপোর্ট:**
```bash
curl "https://www.janvayu.in/api?dataset=rankings&format=csv"          # live
curl "https://www.janvayu.in/api?dataset=rankings&format=csv&range=week" # 7-day average
curl "https://www.janvayu.in/api?dataset=rankings&format=csv&range=month" # 30-day average
```
`rankings` ফাংশনটি `range=live`, `range=week` এবং `range=month` বুঝতে পারে। অন্য যেকোনো মান, যার মধ্যে `7d` এবং `30d`-ও রয়েছে (যা ম্যানিফেস্টে তালিকাভুক্ত আছে), সেগুলোকে 30-দিনের রেঞ্জ হিসেবে ধরা হয়।
> **পরিচিত সমস্যা:** `/api` ম্যানিফেস্টে `range=7d` বিজ্ঞাপন দেওয়া থাকলেও র‍্যাঙ্কিং ফাংশন এটি চিনতে পারে না, তাই এটি 7-দিনের গড় না দিয়ে 30-দিনের গড় রিটার্ন করে। কোড ঠিক না হওয়া পর্যন্ত 7-দিনের গড়ের জন্য `range=week` ব্যবহার করুন।
ম্যানিফেস্টটি অন্তর্নিহিত JSON এন্ডপয়েন্টগুলোর দিকে নির্দেশ করে — `rankings`, `reference-data` (CPCB স্টেশন / NCAP শহর / IQAir বার্ষিক), `historical-aqi`, `community-sensors`, এবং `status-history` — যেগুলো আলাদাভাবে কল করা যায়।
**লাইসেন্স:** ডেটা কন্টেন্ট CC BY-NC-SA 4.0; কোড MIT। অনুগ্রহ করে ম্যানিফেস্টের `citation` ফিল্ডে দেখানো উপায়ে সাইট করুন।
---
## OpenAPI স্পেসিফিকেশন

সম্পূর্ণ OpenAPI 3.1 স্পেক [`openapi.yaml`](https://www.janvayu.in/docs/api/openapi.yaml)-এ পাওয়া যাবে। এটি Swagger UI, Postman, Insomnia, বা যেকোনো OpenAPI-সামঞ্জস্যপূর্ণ টুলে ইমপোর্ট করুন।
---
## প্রমাণীকরণ

কোনো প্রমাণীকরণের প্রয়োজন নেই। সমস্ত এন্ডপয়েন্ট পাবলিক।
- **AI এন্ডপয়েন্টগুলো** Groq-এর রেট লিমিটের ওপর নির্ভর করে
- **Feed এন্ডপয়েন্টগুলো** ক্যাশ থেকে সার্ভ করে (প্রতি 4 ঘণ্টা পরপর প্রি-ফেচ করা হয়)
- **CORS:** সমস্ত রেসপন্সে `Access-Control-Allow-Origin: *`
---
## সাধারণ রেসপন্স প্যাটার্ন
### সাফল্য
আপস্ট্রিম বা AI ফেইলিউরের ক্ষেত্রে এন্ডপয়েন্টগুলো HTTP 200 রিটার্ন করে (একটি ফলব্যাক বডি সহ), কিন্তু অবৈধ ইনপুটের জন্য 400, ভুল মেথডের জন্য 405, এবং অভ্যন্তরীণ বা আপস্ট্রিম এররের জন্য 500 বা 502 রিটার্ন করে (উদাহরণস্বরূপ, র‍্যাঙ্কিং CSV তৈরি করা না গেলে `/api` 502 রিটার্ন করে)। স্ট্যাটাস কোড এবং রেসপন্স বডি চেক করুন।
### ফলব্যাক
Groq রেট-লিমিটেড হলে AI এন্ডপয়েন্টগুলো র ডেটা (AI বিশ্লেষণ ছাড়া) রিটার্ন করে। লাইভ ফেচ ফেইল করলে Feed এন্ডপয়েন্টগুলো স্টেল ক্যাশ রিটার্ন করে।
### CORS প্রিফ্লাইট
সমস্ত POST এন্ডপয়েন্ট 204 No Content দিয়ে OPTIONS রিকোয়েস্ট হ্যান্ডেল করে।
---
## উদাহরণ রিকোয়েস্ট
### বায়ুর মান সম্পর্কে জিজ্ঞাসা করুন
```bash
curl -X POST https://www.janvayu.in/.netlify/functions/air-query \
  -H "Content-Type: application/json" \
  -d '{"city": "delhi", "question": "Is it safe to go for a run today?"}'
```
### স্বাস্থ্য বিষয়ক পরামর্শ পান
```bash
curl -X POST https://www.janvayu.in/.netlify/functions/health-advisory \
  -H "Content-Type: application/json" \
  -d '{"city": "mumbai", "age": 35, "conditions": ["asthma"], "hoursOutdoor": 3}'
```
### অস্বাভাবিকতা চেক করুন
```bash
curl https://www.janvayu.in/.netlify/functions/anomaly-check
```
### Reddit ফিড পান
```bash
curl https://www.janvayu.in/.netlify/functions/reddit-feed?filter=delhi
```
### ডাইজেস্ট সাবস্ক্রাইব করুন
```bash
curl -X POST https://www.janvayu.in/.netlify/functions/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "cities": ["delhi", "mumbai"], "pm25_threshold": 90}'
```
