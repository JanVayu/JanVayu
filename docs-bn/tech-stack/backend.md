# ব্যাকএন্ড স্ট্যাক

JanVayu-এর ব্যাকএন্ড সম্পূর্ণভাবে সার্ভারলেস — ২৯টি Netlify Function ফাইল (এবং শেয়ার্ড `lib/`) ডেটা প্রক্সি, ক্যাশিং, শিডিউলড টাস্ক, ইমেইল ডেলিভারি এবং AI ফিচারগুলো পরিচালনা করে।

---

## Netlify Functions

**Runtime:** Node.js 22
**Module format:** AI ফিচারের জন্য ES Modules (`.mjs`), ফিড প্রক্সির জন্য CommonJS (`.js`)
**Location:** `netlify/functions/`

### ফাংশন ইনভেন্টরি

| ফাংশন | ধরন | উদ্দেশ্য |
|----------|------|---------|
| `scheduled-fetch.mjs` | শিডিউলড (cron, প্রতি ৪ ঘণ্টা) | সব সোশ্যাল/নিউজ ফিড আগে থেকে ফেচ করে |
| `daily-digest.mjs` | শিডিউলড (cron, সকাল ৮টা IST) | প্রতিদিনের AQI ইমেইল ডাইজেস্ট পাঠায় |
| `air-query.mjs` | অন-ডিমান্ড (POST) | AI: ন্যাচারাল ল্যাঙ্গুয়েজ বা স্বাভাবিক ভাষায় AQI প্রশ্নোত্তর |
| `health-advisory.mjs` | অন-ডিমান্ড (POST) | AI: ব্যক্তিগত স্বাস্থ্য পরামর্শ |
| `accountability-brief.mjs` | অন-ডিমান্ড (POST) | AI: ওয়ার্ড-লেভেলের গভর্ন্যান্স ব্রিফ |
| `anomaly-check.mjs` | অন-ডিমান্ড (GET) | AI: PM2.5 স্পাইক শনাক্তকরণ |
| `reddit-feed.js` | অন-ডিমান্ড (GET) | ক্যাশ করা Reddit এয়ার কোয়ালিটি পোস্ট |
| `twitter-feed.js` | — | **অবসরপ্রাপ্ত।** Nitter থেকে রিড করা হতো, যার পাবলিক ইনস্ট্যান্সগুলো এখন আর নেই; কোনো ফাংশন এটি কল করে না। |
| `youtube-feed.js` | অন-ডিমান্ড (GET) | YouTube চ্যানেলের RSS থেকে ক্যাশ করা ভারতের এয়ার-কোয়ালিটি ভিডিও |
| `instagram-feed.js` | অন-ডিমান্ড (GET) | ক্যাশ করা Instagram পোস্ট |
| `news-proxy.js` | অন-ডিমান্ড (GET) | ক্যাশ করা নিউজ আর্টিকেল |
| `subscribe.js` | অন-ডিমান্ড (POST) | ইমেইল সাবস্ক্রিপশন ম্যানেজমেন্ট |
| `feed-status.js` | অন-ডিমান্ড (GET) | ফিডের ফ্রেশনেস হেলথ চেক |
| `blob-store.js` | ইউটিলিটি (শেয়ার্ড) | Netlify Blobs স্টোর ইনিশিয়ালাইজেশন |

টেবিলে শুধুমাত্র কোর ফাংশনগুলো দেওয়া হয়েছে। `netlify/functions/` এর অন্যান্য ফাংশনগুলোর মধ্যে রয়েছে `waqi-proxy`, `rankings`, `historical-aqi`, `data-api`, `fire-tracker`, `community-sensors`, `push-subscribe`, `push-send`, `health-monitor`, `feed-health`, `status-history`, `terra-collab`, `workshop-submit`, `zotero-library` এবং `reference-data`।

### সাধারণ প্যাটার্ন

প্রতিটি ফাংশন একই টেমপ্লেট অনুসরণ করে:
```javascript
export default async (req, context) => {
  // 1. CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: corsHeaders });
  }

  try {
    // 2. Core logic (fetch data, call AI, etc.)
    const result = await doWork();

    // 3. Return JSON
    return Response.json(result, { headers: corsHeaders });
  } catch (error) {
    // 4. Graceful fallback — never a 500 with no body
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
**স্টোরের নাম:** `janvayu-feeds` (কোডে `janvayu-subscribers`, `janvayu-rankings` এবং `janvayu-push-subs` ব্যবহার করা হয়)

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

`youtube` এবং `sensor-community` কি (keys) `scheduled-fetch` নয়, বরং `youtube-feed.js` এবং `community-sensors.mjs` লেখে।

**ক্যাশ-ফার্স্ট স্ট্র্যাটেজি:**
1. অন-ডিমান্ড ফাংশন ক্যাশ করা ডেটার জন্য Blobs চেক করে
2. ক্যাশ হিট হলে → সাথে সাথে রিটার্ন করে
3. ক্যাশ মিস হলে → লাইভ ফেচ করে, Blobs-এ লেখে, তারপর রিটার্ন করে
4. লাইভ ফেচ ফেইল করলে → পুরোনো ক্যাশ রিটার্ন করে (কিছু না থাকার চেয়ে ভালো)

এটি নিশ্চিত করে যে ফিড আউটেজ (যেমন Reddit রেট লিমিট, Nitter ডাউনটাইম) হলেও ডেটা সামান্য পুরোনো হলেও চলবে — UI কখনোই ভাঙবে না।

---

## Resend (ইমেইল ডেলিভারি)

**প্যাকেজ:** `resend` ^6.14.0
**ব্যবহার করে:** `daily-digest.mjs`
**From অ্যাড্রেস:** `digest@janvayu.in`

### ডেইলি ডাইজেস্ট ফ্লো

1. `daily-digest.mjs` সকাল ৮:০০ টায় IST-তে ফায়ার হয় (Netlify শিডিউলড ফাংশন)
2. WAQI থেকে সাবস্ক্রাইব করা শহরগুলোর জন্য লাইভ AQI ফেচ করে
3. AQI ডেটা এবং স্বাস্থ্য নির্দেশিকা দিয়ে একটি সুন্দর HTML ইমেইল ফরম্যাট করে
4. Resend API-এর মাধ্যমে পাঠায়
**SendGrid/Mailgun-এর বদলে Resend কেন:**
- পরিচ্ছন্ন API, কম কোড
- ফ্রি প্ল্যানে প্রতিদিন ১০০টি ইমেইলের লিমিট আছে ([resend.com/pricing](https://resend.com/pricing)); সাবস্ক্রাইবার সংখ্যার সাথে মিলিয়ে দেখুন
- ইন-বিল্ট বাউন্স/কমপ্লেন হ্যান্ডলিং

---

## WAQI API (Client-Side)

The World Air Quality Index API হলো ব্রাউজার থেকে কল করা প্রধান লাইভ-AQI সোর্স।

**টোকেন:** WAQI তাদের [terms of service](https://aqicn.org/data-platform/token/)-এর অধীনে নিবন্ধিতদের টোকেন ইস্যু করে; এটি ক্লায়েন্ট JS-এ যুক্ত থাকে, তাই যে কেউ এটি পড়তে পারে
**রিফ্রেশ:** `setInterval` ব্যবহার করে প্রতি ১০ মিনিটে
**ব্যবহারকৃত এন্ডপয়েন্টগুলো:**
- `api.waqi.info/feed/{city}/` — একটি শহরের AQI
- `api.waqi.info/map/bounds/` — ভৌগোলিক সীমানার মধ্যে থাকা স্টেশনগুলো

**কেন ক্লায়েন্ট-সাইড:**
- রিয়েল-টাইম ডেটা (ক্যাশিংয়ে কোনো দেরি নেই)
- সব API অ্যাক্সেসের জন্য WAQI-এর একটি বৈধ কি (key) প্রয়োজন
- সার্ভারলেস ফাংশন ইনভোকেশন কমায়
