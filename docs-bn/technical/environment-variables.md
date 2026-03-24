# Environment Variables

সমস্ত গোপনীয় তথ্য ও কনফিগারেশন environment variables এর মাধ্যমে পরিচালিত হয়। এগুলো **কখনো রিপোজিটরিতে কমিট করা হয় না**।

- **লোকাল ডেভেলপমেন্টের** জন্য: প্রকল্পের রুটে একটি `.env` ফাইল তৈরি করুন (এটি gitignore করা আছে)
- **প্রোডাকশনের** জন্য: [Netlify dashboard](https://app.netlify.com)-এ Site Settings → Environment Variables-এ সেট করুন

---

## প্রয়োজনীয় Variables

### `RESEND_API_KEY`
**ব্যবহারকারী:** `daily-digest.mjs`

সাবস্ক্রাইবারদের কাছে দৈনিক ইমেল ডাইজেস্ট পাঠানোর জন্য [Resend](https://resend.com) থেকে আপনার API key।

**কীভাবে পাবেন:**
1. [resend.com](https://resend.com)-এ একটি অ্যাকাউন্ট তৈরি করুন
2. API Keys → Create API Key-তে যান
3. কী কপি করুন (এটি শুধু একবার দেখানো হয়)

---

### `RESEND_FROM`
**ব্যবহারকারী:** `daily-digest.mjs`

ডাইজেস্ট ইমেলের জন্য যাচাইকৃত প্রেরক ইমেল ঠিকানা। Resend-এ আপনি যে ডোমেইন যাচাই করেছেন তা থেকে হতে হবে।

**উদাহরণ:** `digest@janvayu.in`

---

### `BLOB_TOKEN`
**ব্যবহারকারী:** Netlify Blobs পড়া/লেখার সমস্ত functions

Blobs পড়া/লেখার অনুমতি সহ একটি Netlify personal access token।

**কীভাবে পাবেন:**
1. [Netlify User Settings → Personal Access Tokens](https://app.netlify.com/user/applications)-এ যান
2. একটি নতুন token তৈরি করুন
3. এটি কপি করুন (শুধু একবার দেখানো হয়)

---

### `NETLIFY_SITE_ID`
**ব্যবহারকারী:** Netlify Blobs পড়া/লেখার সমস্ত functions

আপনার Netlify সাইটের অনন্য ID।

**কীভাবে পাবেন:**
1. [app.netlify.com](https://app.netlify.com)-এ যান
2. JanVayu সাইট খুলুন
3. Site Settings → General → Site ID-তে যান
4. UUID কপি করুন (ফরম্যাট: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

---

### `GEMINI_API_KEY`
**ব্যবহারকারী:** `air-query.mjs`, `health-advisory.mjs`, `accountability-brief.mjs`, `anomaly-check.mjs`

AI-চালিত ফিচারের জন্য Google Gemini API key।

**কীভাবে পাবেন:**
1. [aistudio.google.com](https://aistudio.google.com)-এ যান
2. "Get API Key" ক্লিক করুন
3. একটি নতুন বা বিদ্যমান প্রকল্পে একটি কী তৈরি করুন

ফ্রি টায়ার JanVayu-র AI ফিচারের জন্য যথেষ্ট।

---

## পাবলিক কী (গোপনীয় নয়)

### WAQI API Token
WAQI API token (`1f64cc8563a165dc5a6ce48f7eeb9ba0221b63f3`) হল একটি **ফ্রি-টায়ার পাবলিক কী** যা সরাসরি `index.html`-এ এম্বেড করা। এটি কোনো গোপনীয় তথ্য নয় — WAQI এই টোকেনগুলো সর্বজনীনভাবে প্রদান করে। এটি WAQI দ্বারা IP পর্যায়ে rate-limited।

আপনি যদি নিজের WAQI token ব্যবহার করতে চান (উচ্চতর rate limits-এর জন্য), [aqicn.org/data-platform/token](https://aqicn.org/data-platform/token/)-এ রেজিস্টার করুন এবং `index.html`-এ token প্রতিস্থাপন করুন।

---

## লোকাল `.env` উদাহরণ

```bash
# Email digest (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RESEND_FROM=digest@janvayu.in

# Netlify Blobs
BLOB_TOKEN=nfp_xxxxxxxxxxxxxxxxxxxx
NETLIFY_SITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# AI features (Google Gemini)
GEMINI_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
