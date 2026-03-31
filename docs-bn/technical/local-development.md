# লোকাল ডেভেলপমেন্ট

## পূর্বশর্ত

- [Node.js](https://nodejs.org/) 18 বা উচ্চতর
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (`npm install -g netlify-cli`)
- একটি [Resend](https://resend.com) অ্যাকাউন্ট — শুধুমাত্র ইমেল ডাইজেস্ট ফিচারে কাজ করলে প্রয়োজন
- একটি [Google AI Studio](https://aistudio.google.com) অ্যাকাউন্ট — শুধুমাত্র AI ফিচারের জন্য প্রয়োজন

---

## সেটআপ

```bash
# 1. রিপোজিটরি ক্লোন করুন
git clone https://github.com/JanVayu/JanVayu.git
cd JanVayu

# 2. ডিপেন্ডেন্সি ইনস্টল করুন
npm install

# 3. Environment variables টেমপ্লেট কপি করুন
cp .env.example .env

# 4. আপনার environment variables পূরণ করুন (নিচে দেখুন)
# .env ফাইলটি আপনার মান দিয়ে সম্পাদনা করুন

# 5. লোকাল ডেভেলপমেন্ট সার্ভার শুরু করুন
netlify dev
```

সাইটটি `http://localhost:8888`-এ পাওয়া যাবে। Netlify Dev স্থানীয়ভাবে serverless functions অনুকরণ করে, scheduled functions এবং Blobs store সহ।

---

## Environment Variables

প্রকল্পের রুটে একটি `.env` ফাইল তৈরি করুন (এটি gitignore করা আছে এবং কখনো কমিট হবে না):

```bash
# ইমেল ডাইজেস্টের জন্য প্রয়োজনীয়
RESEND_API_KEY=your_resend_api_key
RESEND_FROM=digest@yourdomain.com

# Netlify Blobs (local dev) এর জন্য প্রয়োজনীয়
BLOB_TOKEN=your_netlify_personal_access_token
NETLIFY_SITE_ID=your_netlify_site_id

# AI ফিচারের জন্য প্রয়োজনীয়
GEMINI_API_KEY=your_google_gemini_api_key
```

প্রতিটি মান কীভাবে পেতে হবে তার সম্পূর্ণ বিবরণের জন্য [Environment Variables](environment-variables.md) দেখুন।

---

## Netlify Functions ছাড়া চালানো

আপনি যদি শুধুমাত্র ফ্রন্ট-এন্ডে (AQI ড্যাশবোর্ড, মানচিত্র, চার্ট) কাজ করতে চান, তাহলে কোনো environment variable বা Netlify সেটআপের প্রয়োজন নেই:

```bash
# HTML ফাইল সরাসরি সার্ভ করুন
npx serve .
# বা
python3 -m http.server 8000
```

AQI ড্যাশবোর্ড, মানচিত্র, এবং সমস্ত ক্লায়েন্ট-সাইড ফিচার কাজ করবে কারণ WAQI API সরাসরি ব্রাউজার থেকে কল করা হয়। সোশ্যাল ফিড এবং ইমেল ডাইজেস্ট functions ছাড়া কাজ করবে না।

---

## স্থানীয়ভাবে Netlify Functions পরীক্ষা করা

```bash
# একটি টেস্ট পেলোড দিয়ে একটি নির্দিষ্ট function চালু করুন
netlify functions:invoke air-query --payload '{"city":"delhi","question":"Is it safe to go for a run?"}'

# Anomaly check চালু করুন
netlify functions:invoke anomaly-check

# Feed status check চালু করুন
netlify functions:invoke feed-status
```

---

## Git Hooks

রিপোতে `.githooks/`-এ Git hooks রয়েছে:

- **pre-commit** — প্রতিটি কমিটের আগে মৌলিক lint পরীক্ষা চালায়
- **commit-msg** — conventional commit message ফরম্যাট প্রয়োগ করে

Hooks স্বয়ংক্রিয়ভাবে `npm run prepare` স্ক্রিপ্টের মাধ্যমে সক্রিয় হয় (যা `git config core.hooksPath .githooks` চালায়)।

### কমিট মেসেজ ফরম্যাট

```
type(scope): short description

উদাহরণ:
feat(dashboard): add PM10 toggle to city cards
fix(email): handle missing city in digest template
docs(readme): update setup instructions
```

---

## ব্রাঞ্চ কৌশল

| ব্রাঞ্চ | উদ্দেশ্য |
|--------|----------|
| `main` | প্রোডাকশন — [www.janvayu.in](https://www.janvayu.in)-এ স্বয়ংক্রিয়ভাবে ডিপ্লয় |
| `feature/*` | নতুন ফিচার বা বিষয়বস্তু সংযোজন |
| `fix/*` | বাগ ফিক্স |
| `docs/*` | ডকুমেন্টেশন পরিবর্তন |

সবসময় `main` থেকে ব্রাঞ্চ করুন এবং মার্জ করতে pull request খুলুন। `main`-এ সরাসরি পুশ করবেন না।
