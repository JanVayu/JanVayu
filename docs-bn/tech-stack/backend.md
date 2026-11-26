# ব্যাকএন্ড স্ট্যাক
JanVayu-এর ব্যাকএন্ড সম্পূর্ণভাবে সার্ভারলেস — 29টি Netlify Function ফাইল (সাথে শেয়ার করা `lib/`) ডেটা প্রক্সিইং, ক্যাশিং, শিডিউলড টাস্ক, ইমেইল ডেলিভারি এবং এআই ফিচারগুলো পরিচালনা করে।
---
## Netlify Functions
**রানটাইম:** Node.js 24 (`netlify.toml`-এ `NODE_VERSION`; `package.json` 22.12 বা এর পরের ভার্সন চায়)
**মডিউল ফরম্যাট:** এআই ফিচারের জন্য ES Modules (`.mjs`), ফিড প্রক্সির জন্য CommonJS (`.js`)
**অবস্থান:** `netlify/functions/`
### ফাংশন ইনভেন্টরি
| ফাংশন | ধরন | উদ্দেশ্য |
|----------|------|---------|
| `scheduled-fetch.mjs` | শিডিউলড (ক্রন, প্রতি 4 ঘণ্টা পরপর) | সব সোশ্যাল/নিউজ ফিড আগে থেকে ফেচ করে |
| `daily-digest.mjs` | শিডিউলড (ক্রন, সকাল 8 টা IST) | প্রতিদিনের AQI ইমেইল ডাইজেস্ট পাঠায় |
| `air-query.mjs` | অন-ডিমান্ড (POST) | এআই: স্বাভাবিক ভাষায় AQI প্রশ্নোত্তর |
| `health-advisory.mjs` | অন-ডিমান্ড (POST) | এআই: ব্যক্তিগত স্বাস্থ্য পরামর্শ |
| `accountability-brief.mjs` | অন-ডিমান্ড (POST) | এআই: ওয়ার্ড-স্তরের গভর্ন্যান্স ব্রিফ |
| `anomaly-check.mjs` | অন-ডিমান্ড (GET) | এআই: PM2.5 স্পাইক শনাক্তকরণ |
| `reddit-feed.js` | অন-ডিমান্ড (GET) | ক্যাশ করা Reddit এয়ার কোয়ালিটি পোস্ট |
| `twitter-feed.js` | — | **অবসরপ্রাপ্ত।** Nitter থেকে রিড করে, যার পাবলিক ইনস্ট্যান্সগুলো বন্ধ হয়ে গেছে; কোনোটিই এটি কল করে না। |
| `youtube-feed.js` | অন-ডিমান্ড (GET) | YouTube চ্যানেল RSS থেকে ক্যাশ করা ভারত এয়ার-কোয়ালিটি ভিডিও |
| `instagram-feed.js` | অন-ডিমান্ড (GET) | ক্যাশ করা Instagram পোস্ট |
| `news-proxy.js` | অন-ডিমান্ড (GET) | ক্যাশ করা নিউজ আর্টিকেল |
| `subscribe.js` | অন-ডিমান্ড (POST) | ইমেইল সাবস্ক্রিপশন ম্যানেজমেন্ট |
| `feed-status.js` | অন-ডিমান্ড (GET) | ফিডের ফ্রেশনেস হেলথ চেক |
| `blob-store.js` | ইউটিলিটি (শেয়ার্ড) | Netlify Blobs স্টোর ইনিশিয়ালাইজেশন |
টেবিলে শুধুমাত্র কোর ফাংশনগুলো তালিকাভুক্ত করা হয়েছে। `netlify/functions/`-এ থাকা অন্যান্য ফাংশনগুলোর মধ্যে রয়েছে `waqi-proxy`, `air-model`, `rankings`, `historical-aqi`, `data-api`, `fire-tracker`, `community-sensors`, `push-subscribe`, `push-send`, `health-monitor`, `feed-health`, `status-history`, `terra-collab`, `workshop-submit` এবং `reference-data`।
### সাধারণ প্যাটার্ন
প্রতিটি ফাংশন একই টেমপ্লেট অনুসরণ করে:
```javascript
export default async (req, context) => {
  // 1. CORS প্রিফ্লাইট
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: corsHeaders });
  }
  try {
    // 2. মূল লজিক (ডেটা ফেচ করা, AI কল করা ইত্যাদি)
    const result = await doWork();
    // 3. JSON রিটার্ন করা
    return Response.json(result, { headers: corsHeaders });
  } catch (error) {
    // 4. গ্রেসফুল ফলব্যাক — বডি ছাড়া কখনোই 500 নয়
    console.log('Error:', error.message);
    return Response.json({ error: 'Service unavailable', fallback: rawData }, {
      status: 200,
      headers: corsHeaders,
    });
  }
};
```
---
## Netlify Blobs (ক্যাশ লেয়ার)
**প্যাকেজ:** `@netlify/blobs` ^11.0.2
**কনসিস্টেন্সি:** স্ট্রং (ইভেনচুয়াল নয়)
**স্টোরের নাম:** `janvayu-feeds` (কোডে `janvayu-subscribers`, `janvayu-rankings` এবং `janvayu-push-subs` ও ব্যবহার করা হয়)
### ক্যাশিং কীভাবে কাজ করে
```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────┐
│ scheduled-fetch  │────▶│  Netlify Blobs    │◀────│ On-demand    │
│ (every 4 hours)  │     │  (JSON cache)     │     │ functions    │
│                  │     │                   │     │ (instant)    │
│ Fetches Reddit,  │     │ reddit            │     │ Serve from   │
│ News, Instagram  │     │ news              │     │ cache first  │
└──────────────────┘     │ instagram         │     └──────────────┘
                         │ youtube           │
                         │ sensor-community  │
                         └──────────────────┘
```
`youtube` এবং `sensor-community` কি-গুলো `scheduled-fetch` দ্বারা নয়, বরং `youtube-feed.js` এবং `community-sensors.mjs` দ্বারা লেখা হয়।
**ক্যাশ-ফার্স্ট কৌশল:**
1. অন-ডিমান্ড ফাংশন ক্যাশ করা ডেটার জন্য Blobs চেক করে
2. ক্যাশ হিট হলে → সাথে সাথে রিটার্ন করে
3. ক্যাশ মিস হলে → লাইভ ফেচ করে, Blobs-এ লেখে, তারপর রিটার্ন করে
4. লাইভ ফেচ ব্যর্থ হলে → পুরোনো ক্যাশ রিটার্ন করে (কিছু না থাকার চেয়ে ভালো)
এটি নিশ্চিত করে যে ফিড আউটেজ (Reddit রেট লিমিট, Nitter ডাউনটাইম) হলে ডেটা কিছুটা পুরোনো হলেও UI কখনোই ভেঙে যায় না।
---
## Resend (ইমেইল ডেলিভারি)
**প্যাকেজ:** `resend` ^6.14.0
**ব্যবহারকারী:** `daily-digest.mjs`
**ফ্রম অ্যাড্রেস:** `digest@janvayu.in`
### ডেইলি ডাইজেস্ট ফ্লো
1. `daily-digest.mjs` সকাল 8:00 AM IST-তে ফায়ার হয় (Netlify শিডিউলড ফাংশন)
2. WAQI থেকে সাবস্ক্রাইবারদের শহরের লাইভ AQI ফেচ করে
3. AQI ডেটা এবং স্বাস্থ্য নির্দেশিকা সহ একটি পরিচ্ছন্ন HTML ইমেইল ফরম্যাট করে
4. Resend API-এর মাধ্যমে পাঠায়
**SendGrid/Mailgun-এর চেয়ে Resend কেন বেছে নেওয়া হলো:**
- পরিষ্কার API, ন্যূনতম কোড
- ফ্রি প্ল্যানে প্রতিদিন ১০০টি ইমেলের লিমিট রয়েছে ([resend.com/pricing](https://resend.com/pricing)); সাবস্ক্রাইবার সংখ্যার সাথে মিলিয়ে এটি যাচাই করুন
- বিল্ট-ইন বাউন্স/কমপ্লেন্ট হ্যান্ডলিং
---
## WAQI API (একটি প্রক্সির মাধ্যমে)
লাইভ স্টেশন রিডিংয়ের মূল উৎস হলো World Air Quality Index API। 27 October 2026 থেকে ব্রাউজার সরাসরি এতে কল করে না। প্রতিটি রিকোয়েস্ট `waqi-proxy` ফাংশনে যায়।
**টোকেন:** WAQI তাদের [terms of service](https://aqicn.org/data-platform/token/)-এর অধীনে একজন নিবন্ধকের কাছে এটি ইস্যু করে; এটি `WAQI_TOKEN` এনভায়রনমেন্ট ভেরিয়েবলে রাখা হয় এবং `netlify/functions/lib/waqi-token.mjs`-এর মাধ্যমে পড়া হয়। কোনো টোকেন কমিট করা হলে `scripts/check-no-waqi-token.py` বিল্ড ফেইল করায়।
**রিফ্রেশ:** ব্রাউজারে `setInterval`-এর মাধ্যমে প্রতি 10 মিনিটে
**প্রক্সি যে এন্ডপয়েন্টগুলোতে কল করে:**
- একটি শহরের AQI-এর জন্য `api.waqi.info/feed/{city}/`
- কোনো বিন্দুর নিকটতম স্টেশনের জন্য `api.waqi.info/feed/geo:{lat};{lon}/`
- ভৌগোলিক সীমানার মধ্যে থাকা স্টেশনগুলোর জন্য `api.waqi.info/map/bounds/`
**প্রক্সি যা নিয়ন্ত্রণ করে:**
- শুধুমাত্র সিটি স্লগ, ইন-রেঞ্জ কোঅর্ডিনেট এবং তিন ডিগ্রির বেশি চওড়া নয় এমন একটি বক্স
- কোঅর্ডিনেট দিয়ে খোঁজার ক্ষেত্রে, গত 6 ঘণ্টার মধ্যে রিপোর্ট করা 30 km-এর মধ্যে একটি স্টেশন (`lib/waqi-station.mjs`)
- কোনো ক্যাশ করা এরর নেই, এবং এররের মধ্যে আপস্ট্রিম URL (যেখানে টোকেন থাকে) নেই
যখন প্রক্সির কাছে দেওয়ার মতো কোনো স্টেশন থাকে না, তখন `js/air-sources.js` CPCB-এর দৈনিক বুলেটিনে এবং তারপর `air-model` ফাংশনে (Open-Meteo, CAMS) ফলব্যাক করে।
