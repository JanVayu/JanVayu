# Backend Stack

JanVayu-র backend সম্পূর্ণ serverless — 13টি Netlify Functions ডেটা প্রক্সিং, ক্যাশিং, নির্ধারিত কাজ, ইমেল ডেলিভারি, এবং AI ফিচার পরিচালনা করে।

---

## Netlify Functions

**Runtime:** Node.js 18
**Module format:** AI ফিচারের জন্য ES Modules (`.mjs`), feed proxies-এর জন্য CommonJS (`.js`)
**অবস্থান:** `netlify/functions/`

### Function তালিকা

| Function | ধরন | উদ্দেশ্য |
|----------|------|---------|
| `scheduled-fetch.mjs` | Scheduled (cron, প্রতি 4 ঘণ্টা) | সমস্ত সোশ্যাল/সংবাদ ফিড প্রি-ফেচ |
| `daily-digest.mjs` | Scheduled (cron, সকাল 8 AM IST) | দৈনিক AQI ইমেল ডাইজেস্ট পাঠানো |
| `air-query.mjs` | On-demand (POST) | AI: প্রাকৃতিক ভাষায় AQI প্রশ্নোত্তর |
| `health-advisory.mjs` | On-demand (POST) | AI: ব্যক্তিগতকৃত স্বাস্থ্য পরামর্শ |
| `accountability-brief.mjs` | On-demand (POST) | AI: ওয়ার্ড-পর্যায়ের শাসন ব্রিফ |
| `anomaly-check.mjs` | On-demand (GET) | AI: PM2.5 spike শনাক্তকরণ |
| `reddit-feed.js` | On-demand (GET) | ক্যাশকৃত Reddit বায়ুমান পোস্ট |
| `twitter-feed.js` | On-demand (GET) | ক্যাশকৃত Twitter/X পোস্ট |
| `instagram-feed.js` | On-demand (GET) | ক্যাশকৃত Instagram পোস্ট |
| `news-proxy.js` | On-demand (GET) | ক্যাশকৃত সংবাদ নিবন্ধ |
| `subscribe.js` | On-demand (POST) | ইমেল সাবস্ক্রিপশন ব্যবস্থাপনা |
| `feed-status.js` | On-demand (GET) | ফিড ফ্রেশনেস হেলথ চেক |
| `blob-store.js` | Utility (shared) | Netlify Blobs store ইনিশিয়ালাইজেশন |

### সাধারণ প্যাটার্ন

প্রতিটি function একই টেমপ্লেট অনুসরণ করে:

```javascript
export default async (req, context) => {
  // 1. CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: corsHeaders });
  }

  try {
    // 2. মূল লজিক (ডেটা ফেচ, AI কল ইত্যাদি)
    const result = await doWork();

    // 3. JSON ফেরত দিন
    return Response.json(result, { headers: corsHeaders });
  } catch (error) {
    // 4. সুন্দরভাবে ফলব্যাক — কখনো বডি ছাড়া 500 নয়
    console.log('Error:', error.message);
    return Response.json({ error: 'Service unavailable', fallback: rawData }, {
      status: 200,
      headers: corsHeaders,
    });
  }
};
```

---

## Netlify Blobs (ক্যাশ স্তর)

**প্যাকেজ:** `@netlify/blobs` v8.1.0
**সামঞ্জস্যতা:** Strong (eventual নয়)
**Store নাম:** `feed-cache`

### ক্যাশিং কীভাবে কাজ করে

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────┐
│ scheduled-fetch  │────▶│  Netlify Blobs    │◀────│ On-demand    │
│ (every 4 hours)  │     │  (JSON cache)     │     │ functions    │
│                  │     │                   │     │ (instant)    │
│ Fetches Reddit,  │     │ reddit-posts      │     │ Serve from   │
│ Twitter, News,   │     │ twitter-posts     │     │ cache first  │
│ Instagram        │     │ news-articles     │     │              │
└──────────────────┘     │ instagram-posts   │     └──────────────┘
                         └──────────────────┘
```

**Cache-first কৌশল:**
1. On-demand function ক্যাশকৃত ডেটার জন্য Blobs পরীক্ষা করে
2. ক্যাশ হিট → তাৎক্ষণিকভাবে ফেরত (sub-50ms response)
3. ক্যাশ মিস → লাইভ ফেচ, Blobs-এ লিখুন, ফেরত দিন
4. লাইভ ফেচ ব্যর্থ → পুরানো ক্যাশ ফেরত দিন (কিছু না পাওয়ার চেয়ে ভালো)

এটি নিশ্চিত করে যে ফিড বিচ্যুতি (Reddit rate limits, Nitter downtime) সামান্য পুরানো তথ্যে পরিণত হয় — কখনো ভাঙা UI নয়।

---

## Resend (ইমেল ডেলিভারি)

**প্যাকেজ:** `resend` v6.9.3
**ব্যবহারকারী:** `daily-digest.mjs`
**From ঠিকানা:** `digest@janvayu.in`

### দৈনিক ডাইজেস্ট প্রবাহ

1. `daily-digest.mjs` সকাল 8:00 AM IST-এ ফায়ার করে (Netlify scheduled function)
2. সাবস্ক্রাইবারের শহরের জন্য WAQI থেকে সরাসরি AQI ফেচ করে
3. AQI ডেটা, ট্রেন্ড, ও স্বাস্থ্য নির্দেশনা সহ পরিষ্কার HTML ইমেল ফরম্যাট করে
4. Resend API-র মাধ্যমে পাঠায়

**কেন SendGrid/Mailgun-এর পরিবর্তে Resend:**
- পরিষ্কার API, ন্যূনতম কোড
- ফ্রি টায়ার JanVayu-র সাবস্ক্রাইবার ভলিউম কভার করে
- ভারতীয় ইমেল প্রদানকারীদের (Gmail India, Outlook India) কাছে ভালো deliverability
- বিল্ট-ইন bounce/complaint হ্যান্ডলিং

---

## WAQI API (ক্লায়েন্ট-সাইড)

World Air Quality Index API হল একমাত্র বাহ্যিক API যা সরাসরি ব্রাউজার থেকে কল করা হয়।

**Token:** ফ্রি-টায়ার পাবলিক কী (ক্লায়েন্ট JS-এ এম্বেড করা — এটি ডিজাইন অনুযায়ী, লিক নয়)
**রিফ্রেশ:** `setInterval` দিয়ে প্রতি 10 মিনিটে
**ব্যবহৃত Endpoints:**
- `api.waqi.info/feed/{city}/` — একক শহরের AQI
- `api.waqi.info/map/bounds/` — ভৌগোলিক সীমার মধ্যে স্টেশন

**কেন ক্লায়েন্ট-সাইড:**
- রিয়েল-টাইম ডেটা (কোনো ক্যাশিং বিলম্ব নেই)
- ফ্রি টায়ারে পাবলিক ব্যবহারে API key বিধিনিষেধ নেই
- Serverless function invocations কমায়
