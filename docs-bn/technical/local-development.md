# লোকাল ডেভেলপমেন্ট
## পূর্বশর্ত
- [Node.js](https://nodejs.org/) 22.12 বা এর চেয়ে উচ্চতর সংস্করণ
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (`npm install -g netlify-cli`)
- একটি [Resend](https://resend.com) অ্যাকাউন্ট — শুধুমাত্র ইমেইল ডাইজেস্ট ফিচার নিয়ে কাজ করলে প্রয়োজন হবে
- একটি [Groq Console](https://console.groq.com) অ্যাকাউন্ট — শুধুমাত্র এআই ফিচারগুলোর জন্য প্রয়োজন
---
## সেটআপ
```bash
# 1. রিপোজিটরি ক্লোন করুন
git clone https://github.com/JanVayu/JanVayu.git
cd JanVayu
# 2. ডিপেন্ডেন্সি ইনস্টল করুন
npm ci
# 3. এনভায়রনমেন্ট ভেরিয়েবল টেমপ্লেট কপি করুন
cp .env.example .env
# 4. আপনার এনভায়রনমেন্ট ভেরিয়েবলগুলো পূরণ করুন (নিচে দেখুন)
# আপনার মানগুলো দিয়ে .env এডিট করুন
# 5. লোকাল ডেভেলপমেন্ট সার্ভার চালু করুন
netlify dev
```
সাইটটি `http://localhost:8888` ঠিকানায় পাওয়া যাবে। Netlify Dev লোকালি সার্ভারলেস ফাংশনগুলো সার্ভ করে।
---
## এনভায়রনমেন্ট ভেরিয়েবল
প্রজেক্টের রুটে একটি `.env` ফাইল তৈরি করুন (এটি gitignored এবং কখনোই কমিট করা হবে না):
```bash
# ইমেইল ডাইজেস্টের জন্য প্রয়োজনীয়
RESEND_API_KEY=your_resend_api_key
RESEND_FROM=digest@yourdomain.com
# Netlify Blobs-এর জন্য প্রয়োজনীয় (লোকাল ডেভেলপমেন্ট)
BLOB_TOKEN=your_netlify_personal_access_token
NETLIFY_SITE_ID=your_netlify_site_id
# এআই ফিচারগুলোর জন্য প্রয়োজনীয়
GROQ_API_KEY=your_groq_api_key
# লাইভ রিডিংয়ের জন্য প্রয়োজনীয় (aqicn.org/data-platform/token-এ বিনামূল্যে পাওয়া যায়)
WAQI_TOKEN=your_waqi_token
```
`.env.example`-এ এখনও `WAQI_TOKEN` তালিকাভুক্ত করা নেই, তাই আপনাকে নিজেই লাইনটি যোগ করতে হবে।
প্রতিটি মান কীভাবে পাবেন তার বিস্তারিত জানতে [Environment Variables](environment-variables.md) দেখুন।
---
## Netlify ফাংশন ছাড়া রান করা
আপনি যদি শুধুমাত্র লেআউট, প্যানেল বা স্ট্যাটিক পেজ নিয়ে কাজ করতে চান, তবে আপনার কোনো এনভায়রনমেন্ট ভেরিয়েবল বা Netlify সেটআপের প্রয়োজন নেই:
```bash
# সরাসরি HTML ফাইল সার্ভ করুন
npx serve .
# অথবা
python3 -m http.server 8000
```
এইভাবে লাইভ রিডিং লোড হয় না। 27 October 2026 থেকে পেজগুলো `waqi-proxy` ফাংশনের মাধ্যমে WAQI-তে পৌঁছায়, তাই একটি সাধারণ স্ট্যাটিক সার্ভারে কোনো লাইভ AQI থাকে না। হোম পেজটি CPCB-এর দৈনিক বুলেটিনে ফিরে যায়, যা একটি স্ট্যাটিক ফাইল (`data/cpcb-latest.json`)। ফাংশনের ওপর নির্ভরশীল অন্য যেকোনো কিছু (র‍্যাঙ্কিং, মডেল করা অনুমান, ফায়ার ট্র্যাকার, সোশ্যাল ফিড, ইমেইল ডাইজেস্ট, Ask JanVayu) `netlify dev` ছাড়া কাজ করবে না।
---
## লোকালি Netlify ফাংশন টেস্ট করা
###
```bash
# একটি টেস্ট পেলোড দিয়ে নির্দিষ্ট ফাংশনটি ইনভোক করুন
netlify functions:invoke air-query --payload '{"city":"delhi","question":"Is it safe to go for a run?"}'
# অ্যানোমালি চেক ইনভোক করুন
netlify functions:invoke anomaly-check
# ফিড স্ট্যাটাস চেক ইনভোক করুন
netlify functions:invoke feed-status
```
---
## টেস্ট এবং চেক
```bash
npm test                         # test/ এর ইউনিট টেস্ট (node --test)
bash scripts/run-ci-checks.sh    # CI রান করে এমন প্রতিটি গেটিং চেক
```
`scripts/run-ci-checks.sh` স্ক্রিপ্টটি `scripts/list-ci-checks.py` দিয়ে ওয়ার্কফ্লো থেকে জেনারেট করা হয়েছে। এর বেশিরভাগ কাজ কয়েক সেকেন্ডেই শেষ হয়ে যায়। শেষের কনট্রাস্ট গেট একটি ব্রাউজার চালায় এবং এতে প্রায় দুই মিনিট সময় লাগে।
---
## Git Hooks
রিপোতে `.githooks/` ডিরেক্টরিতে Git hooks অন্তর্ভুক্ত রয়েছে:
- **pre-commit**: স্টেজ করা `.env` এবং ক্রেডেনশিয়াল ফাইলগুলোকে ব্লক করে, `console.log` স্টেটমেন্ট সম্পর্কে সতর্ক করে, মার্জ কনফ্লিক্ট মার্কার শনাক্ত করে এবং 500 KB-এর চেয়ে বড় ফাইলের ক্ষেত্রে সতর্ক করে (এটি লিন্টার রান করে না)
- **commit-msg**: কমিট মেসেজের প্রিফিক্স নিয়মটি প্রয়োগ করে
`npm run prepare` স্ক্রিপ্টের মাধ্যমে হুকগুলো স্বয়ংক্রিয়ভাবে এনাবল করা হয় (যা `git config core.hooksPath .githooks` রান করে)।
### কমিট মেসেজ ফরম্যাট
```
Prefix: short description
Allowed prefixes: Add, Fix, Update, Translate, Docs, Refactor, Test, CI, Chore, Merge
Examples:
Add: PM10 toggle to city cards
Fix: handle missing city in digest template
Docs: update setup instructions
```
কনভেনশনাল-কমিট স্টাইলের মেসেজ যেমন `feat(dashboard): ...` হুক দ্বারা বাতিল করা হয়।
---
## ব্রাঞ্চ স্ট্র্যাটেজি
| Branch | Purpose |
|--------|--------|
| `main` | প্রোডাকশন — [www.janvayu.in](https://www.janvayu.in)-এ স্বয়ংক্রিয়ভাবে ডিপ্লয় হয় |
| `feature/*` | নতুন ফিচার বা কনটেন্ট সংযোজন |
| `fix/*` | বাগ ফিক্স |
| `docs/*` | ডকুমেন্টেশন পরিবর্তন |
সবসময় `main` থেকে ব্রাঞ্চ তৈরি করবেন এবং মার্জ করার জন্য একটি পুল রিকোয়েস্ট ওপেন করবেন। কখনোই সরাসরি `main`-এ পুশ করবেন না।
---
