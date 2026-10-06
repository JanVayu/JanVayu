# লোকাল ডেভেলপমেন্ট

## পূর্বশর্ত

- [Node.js](https://nodejs.org/) 22.12 বা এর চেয়ে উচ্চতর
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (`npm install -g netlify-cli`)
- একটি [Resend](https://resend.com) অ্যাকাউন্ট — শুধুমাত্র ইমেইল ডাইজেস্ট ফিচার নিয়ে কাজ করলে এটি লাগবে
- একটি [Groq Console](https://console.groq.com) অ্যাকাউন্ট — শুধুমাত্র এআই (AI) ফিচারের জন্য এটি লাগবে

---

## সেটআপ

```bash
# 1. রিপোজিটরি ক্লোন করুন
git clone https://github.com/JanVayu/JanVayu.git
cd JanVayu

# 2. ডিপেন্ডেন্সিগুলো ইনস্টল করুন
npm install

# 3. এনভায়রনমেন্ট ভেরিয়েবল টেমপ্লেট কপি করুন
cp .env.example .env

# 4. আপনার এনভায়রনমেন্ট ভেরিয়েবলগুলো পূরণ করুন (নিচে দেখুন)
# .env ফাইলটি আপনার ভ্যালু দিয়ে এডিট করুন

# 5. লোকাল ডেভেলপমেন্ট সার্ভার চালু করুন
netlify dev
```

সাইটটি `http://localhost:8888` ঠিকানায় পাওয়া যাবে। Netlify Dev লোকালি সার্ভারলেস ফাংশনগুলো সার্ভ করে।

---

## এনভায়রনমেন্ট ভেরিয়েবল

প্রজেক্টের রুটে একটি `.env` ফাইল তৈরি করুন (এটি gitignored, তাই কখনোই কমিট করা হবে না):

```bash
# ইমেইল ডাইজেস্টের জন্য প্রয়োজন
RESEND_API_KEY=your_resend_api_key
RESEND_FROM=digest@yourdomain.com

# Netlify Blobs (লোকাল ডেভ)-এর জন্য প্রয়োজন
BLOB_TOKEN=your_netlify_personal_access_token
NETLIFY_SITE_ID=your_netlify_site_id

# এআই (AI) ফিচারের জন্য প্রয়োজন
GROQ_API_KEY=your_groq_api_key
```

প্রতিটি ভ্যালু কীভাবে পাবেন, তার বিস্তারিত জানতে [Environment Variables](environment-variables.md) দেখুন।

---

## Netlify ফাংশন ছাড়া রান করা

আপনি যদি শুধুমাত্র ফ্রন্ট-এন্ড (AQI ড্যাশবোর্ড, ম্যাপ, চার্ট) নিয়ে কাজ করতে চান, তবে আপনার কোনো এনভায়রনমেন্ট ভেরিয়েবল বা Netlify সেটআপের প্রয়োজন নেই:

```bash
# সরাসরি HTML ফাইলটি সার্ভ করুন
npx serve .
# অথবা
python3 -m http.server 8000
```

AQI ড্যাশবোর্ড এবং ম্যাপ ব্রাউজারে সরাসরি WAQI API থেকে লাইভ AQI লোড করে, তাই ফাংশন ছাড়াই এগুলো কাজ করে। যে ফিচারগুলো কোনো ফাংশনের ওপর নির্ভরশীল (র‍্যাঙ্কিং, ফোরকাস্ট, ফায়ার ট্র্যাকার, সোশ্যাল ফিড, ইমেইল ডাইজেস্ট), সেগুলো ফাংশন ছাড়া কাজ করবে না।

---

## লোকালি Netlify ফাংশন টেস্টিং করা

```bash
# একটি টেস্ট পেলোড দিয়ে নির্দিষ্ট ফাংশনটি ইনভোক করুন
netlify functions:invoke air-query --payload '{"city":"delhi","question":"Is it safe to go for a run?"}'

# অ্যানোমালি চেক ইনভোক করুন
netlify functions:invoke anomaly-check

# ফিড স্ট্যাটাস চেক ইনভোক করুন
netlify functions:invoke feed-status
```

---

## গিট হুকস

রিপোটিতে `.githooks/` ফোল্ডারে গিট হুকস অন্তর্ভুক্ত রয়েছে:


---
- **pre-commit**: স্টেজ করা `.env` এবং ক্রেডেনশিয়াল ফাইলগুলোকে ব্লক করে, `console.log` স্টেটমেন্টের বিষয়ে সতর্ক করে, মার্জ কনফ্লিক্ট মার্কার শনাক্ত করে এবং ৫০০ কেবি-র চেয়ে বড় ফাইলের ক্ষেত্রে সতর্ক করে (এটি কোনো লিন্টার রান করে না)
- **commit-msg**: কমিট মেসেজের প্রিফিক্স নিয়ম মেনে চলে

`npm run prepare` স্ক্রিপ্টের মাধ্যমে হুকগুলো স্বয়ংক্রিয়ভাবে চালু হয়ে যায় (যা `git config core.hooksPath .githooks` রান করে)।

### কমিট মেসেজ ফরম্যাট

```
Prefix: short description

Allowed prefixes: Add, Fix, Update, Translate, Docs, Refactor, Test, CI, Chore

Examples:
Add: PM10 toggle to city cards
Fix: handle missing city in digest template
Docs: update setup instructions
```

`feat(dashboard): ...`-এর মতো কনভেনশনাল-কমিট স্টাইলের মেসেজগুলো হুক দ্বারা বাতিল করা হয়।

---

## ব্রাঞ্চ স্ট্র্যাটেজি

| Branch | Purpose |
|--------|--------|
| `main` | প্রোডাকশন — [www.janvayu.in](https://www.janvayu.in)-এ স্বয়ংক্রিয়ভাবে ডিপ্লয় হয় |
| `feature/*` | নতুন ফিচার বা কন্টেন্ট সংযোজন |
| `fix/*` | বাগ ফিক্স |
| `docs/*` | ডকুমেন্টেশন পরিবর্তন |

সবসময় `main` থেকে ব্রাঞ্চ তৈরি করুন এবং মার্জ করার জন্য একটি পুল রিকোয়েস্ট খুলুন। কখনোই সরাসরি `main`-এ পুশ করবেন না।
