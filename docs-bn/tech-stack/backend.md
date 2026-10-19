# ব্যাকএন্ড স্ট্যাক

JanVayu-এর ব্যাকএন্ড সম্পূর্ণভাবে সার্ভারলেস — 29টি Netlify Function ফাইল (পাশাপাশি শেয়ার্ড `lib/`) ডেটা প্রক্সিইং, ক্যাশিং, শিডিউলড টাস্ক, ইমেইল ডেলিভারি এবং এআই (AI) ফিচারগুলো পরিচালনা করে।

---

## Netlify Functions

**রানটাইম:** Node.js 22
**মডিউল ফরম্যাট:** এআই (AI) ফিচারের জন্য ES Modules (`.mjs`), ফিড প্রক্সির জন্য CommonJS (`.js`)
**অবস্থান:** `netlify/functions/`

### ফাংশন ইনভেন্টরি

| ফাংশন | ধরন | উদ্দেশ্য |
|----------|------|---------|
| `scheduled-fetch.mjs` | শিডিউলড (ক্রন, প্রতি 4 ঘণ্টায়) | সব সোশ্যাল/নিউজ ফিড আগে থেকেই ফেচ (Pre-fetch) করে |
| `daily-digest.mjs` | শিডিউলড (ক্রন, সকাল 8টা IST) | প্রতিদিনের AQI ইমেইল ডাইজেস্ট পাঠায় |
| `air-query.mjs` | অন-ডিমান্ড (POST) | এআই (AI): ন্যাচারাল ল্যাঙ্গুয়েজ বা স্বাভাবিক ভাষায় AQI সংক্রান্ত প্রশ্নোত্তর |
| `health-advisory.mjs` | অন-ডিমান্ড (POST) | এআই (AI): ব্যক্তিগত স্বাস্থ্য পরামর্শ |
| `accountability-brief.mjs` | অন-ডিমান্ড (POST) | এআই (AI): ওয়ার্ড-লেভেলের গভর্ন্যান্স ব্রিফ |
| `anomaly-check.mjs` | অন-ডিমান্ড (GET) | এআই (AI): PM2.5 স্পাইক শনাক্তকরণ |
| `reddit-feed.js` | অন-ডিমান্ড (GET) | ক্যাশ করা Reddit এয়ার কোয়ালিটি পোস্ট |
| `twitter-feed.js` | — | **অবসরপ্রাপ্ত।** Nitter রিড করা হতো, যার পাবলিক ইনস্ট্যান্সগুলো এখন আর নেই; এটি আর কেউ কল করে না। |
| `youtube-feed.js` | অন-ডিমান্ড (GET) | YouTube চ্যানেলের RSS থেকে ক্যাশ করা ভারতের এয়ার-কোয়ালিটি ভিডিও |
| `instagram-feed.js` | অন-ডিমান্ড (GET) | ক্যাশ করা Instagram পোস্ট |
| `news-proxy.js` | অন-ডিমান্ড (GET) | ক্যাশ করা নিউজ আর্টিকেল |
| `subscribe.js` | অন-ডিমান্ড (POST) | ইমেইল সাবস্ক্রিপশন ম্যানেজমেন্ট |
| `feed-status.js` | অন-ডিমান্ড (GET) | ফিডের ফ্রেশনেস বা সতেজতা যাচাই |
| `blob-store.js` | ইউটিলিটি (শেয়ার্ড) | Netlify Blobs স্টোর ইনিশিয়ালাইজেশন |

এই টেবিলে শুধুমাত্র কোর ফাংশনগুলোর তালিকা দেওয়া হয়েছে। `netlify/functions/`-এ থাকা অন্যান্য ফাংশনগুলোর মধ্যে রয়েছে `waqi-proxy`, `rankings`, `historical-aqi`, `data-api`, `fire-tracker`, `community-sensors`, `push-subscribe`, `push-send`, `health-monitor`, `feed-health`, `status-history`, `terra-collab`, `workshop-submit` এবং `reference-data`।

### সাধারণ প্যাটার্ন

প্রতিটি ফাংশন একই টেমপ্লেট অনুসরণ করে:
```javascript
export default async (req, context) => {
  // 1. CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: corsHeaders });
  }

  try {
    // 2. মূল লজিক (ডেটা ফেচ করা, AI কল করা ইত্যাদি)
    const result = await doWork();

    // 3. JSON রিটার্ন করা
    return Response.json(result, { headers: corsHeaders });
  } catch (error) {
    // 4. সুন্দর ফলব্যাক — বডি ছাড়া কখনোই 500 নয়
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
**কনসিস্টেন্সি:** স্ট্রং (ইভেনচুয়াল নয়)
**স্টোর নাম:** `janvayu-feeds` (কোডে `janvayu-subscribers`, `janvayu-rankings` এবং `janvayu-push-subs`-ও ব্যবহার করা হয়)

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

`youtube` এবং `sensor-community` কি-গুলো `scheduled-fetch` দ্বারা নয়, বরং `youtube-feed.js` এবং `community-sensors.mjs` দ্বারা লেখা হয়।

**ক্যাশ-ফার্স্ট স্ট্র্যাটেজি:**
1. অন-ডিমান্ড ফাংশন ক্যাশ করা ডেটার জন্য Blobs চেক করে
2. যদি ক্যাশে হিট হয় → সাথে সাথে রিটার্ন করে
3. যদি ক্যাশে মিস হয় → লাইভ ফেচ করে, Blobs-এ লেখে, রিটার্ন করে
4. যদি লাইভ ফেচ ফেইল করে → পুরোনো ক্যাশ রিটার্ন করে (কিছু না পাওয়ার চেয়ে ভালো)

এটি নিশ্চিত করে যে ফিড আউটেজ (Reddit রেট লিমিট, Nitter ডাউনটাইম) এর ফলে ডেটা কিছুটা পুরোনো হতে পারে — কিন্তু UI কখনোই ভাঙবে না।

---

## Resend (ইমেইল ডেলিভারি)

**প্যাকেজ:** `resend` ^6.14.0
**ব্যবহারকারী:** `daily-digest.mjs`
**ফ্রম অ্যাড্রেস:** `digest@janvayu.in`

### ডেইলি ডাইজেস্ট ফ্লো

1. `daily-digest.mjs` সকাল 8:00 AM IST-এ ফায়ার হয় (Netlify শিডিউলড ফাংশন)
2. WAQI থেকে সাবস্ক্রাইবারের শহরগুলোর লাইভ AQI ফেচ করে
3. AQI ডেটা এবং স্বাস্থ্য নির্দেশিকা দিয়ে একটি পরিচ্ছন্ন HTML ইমেইল ফরম্যাট করে
4. Resend API-এর মাধ্যমে পাঠায়
**SendGrid/Mailgun-এর চেয়ে Resend কেন:**
- পরিচ্ছন্ন API, খুব কম কোড লাগে
- ফ্রি প্ল্যানে প্রতিদিন 100 ইমেইল পাঠানোর লিমিট আছে ([resend.com/pricing](https://resend.com/pricing)); সাবস্ক্রাইবারের সংখ্যার সাথে মিলিয়ে দেখুন
- বিল্ট-ইন বাউন্স/কমপ্লেন্ট হ্যান্ডলিং

---

## WAQI API (Client-Side)

World Air Quality Index API হলো ব্রাউজার থেকে কল করা প্রধান লাইভ-AQI সোর্স।

**টোকেন:** WAQI তাদের [terms of service](https://aqicn.org/data-platform/token/)-এর অধীনে রেজিস্ট্র্যান্টকে এটি ইস্যু করে; এটি ক্লায়েন্ট JS-এ এমবেড করা থাকে, তাই যে কেউই এটি পড়তে পারে
**রিফ্রেশ:** `setInterval` ব্যবহার করে প্রতি 10 মিনিটে
**ব্যবহার করা এন্ডপয়েন্টগুলো:**
- `api.waqi.info/feed/{city}/` — একটি শহরের AQI
- `api.waqi.info/map/bounds/` — ভৌগোলিক সীমানার মধ্যে থাকা স্টেশনগুলো

**ক্লায়েন্ট-সাইড কেন:**
- রিয়েল-টাইম ডেটা (ক্যাশিংয়ের কোনো দেরি নেই)
- সব ধরনের API অ্যাক্সেসের জন্য WAQI-এর একটি ভ্যালিড কি (key) প্রয়োজন
- সার্ভারলেস ফাংশন ইনভোকেশন কমায়
