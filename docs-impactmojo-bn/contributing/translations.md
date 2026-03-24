# অনুবাদ

ImpactMojo দক্ষিণ এশীয় ভাষায় উন্নয়ন শিক্ষা সহজলভ্য করতে প্রতিশ্রুতিবদ্ধ। এই গাইড অনুবাদ অবদান করার পদ্ধতি কভার করে।

---

## বর্তমান ভাষা সমর্থন

| ভাষা | প্ল্যাটফর্ম | ডকুমেন্টেশন | ডিরেক্টরি |
|----------|----------|------|-----------|
| English | সম্পূর্ণ | সম্পূর্ণ | `docs-impactmojo/` |
| हिन्दी (হিন্দি) | সম্পূর্ণ | সম্পূর্ণ | `docs-impactmojo-hi/` |
| বাংলা (বাংলা) | সম্পূর্ণ | সম্পূর্ণ | `docs-impactmojo-bn/` |
| मराठी (মারাঠি) | সম্পূর্ণ | সম্পূর্ণ | `docs-impactmojo-mr/` |
| தமிழ் (তামিল) | সম্পূর্ণ | সম্পূর্ণ | `docs-impactmojo-ta/` |
| తెలుగు (তেলুগু) | শুধু প্ল্যাটফর্ম | পরিকল্পিত | — |

---

## GitBook স্পেস

প্রতিটি ভাষার একটি সিঙ্ক করা GitBook স্পেস আছে:

| ভাষা | লিংক | সোর্স ডিরেক্টরি |
|----------|------|-----------------|
| English | [impactmojo.gitbook.io/impactmojo](https://impactmojo.gitbook.io/impactmojo/) | `docs-impactmojo/` |
| হিন্দি | [impactmojo.gitbook.io/impactmojo/hi](https://impactmojo.gitbook.io/impactmojo/hi/) | `docs-impactmojo-hi/` |
| বাংলা | [impactmojo.gitbook.io/impactmojo/bn](https://impactmojo.gitbook.io/impactmojo/bn/) | `docs-impactmojo-bn/` |
| মারাঠি | [impactmojo.gitbook.io/impactmojo/mr](https://impactmojo.gitbook.io/impactmojo/mr/) | `docs-impactmojo-mr/` |
| তামিল | [impactmojo.gitbook.io/impactmojo/ta](https://impactmojo.gitbook.io/impactmojo/ta/) | `docs-impactmojo-ta/` |

---

## অনুবাদ নীতি

১. **আক্ষরিকতার চেয়ে নির্ভুলতা** — শব্দে শব্দে অনুবাদ নয়, অর্থ প্রকাশ করুন
২. **প্রযুক্তিগত শব্দ সংরক্ষণ করুন** — MEL, ToC, RCT, DHS, NFHS-এর মতো শব্দ ইংরেজিতে রাখুন, প্রয়োজনে বন্ধনীতে প্রতিলিপি দিন
৩. **সহজ ভাষা ব্যবহার করুন** — ইংরেজি মূলের সমান পাঠ্য স্তর লক্ষ্য করুন
৪. **সামঞ্জস্যতা** — সমস্ত নথিতে একটি শব্দের জন্য একই অনুবাদ ব্যবহার করুন
৫. **নিরপেক্ষ স্বর** — শিক্ষামূলক, অ-পক্ষপাতমূলক স্বর বজায় রাখুন

---

## সংবেদনশীল পরিভাষা

কিছু শব্দ ইংরেজিতে রাখা বা সতর্কভাবে পরিচালনা করা উচিত:

| ইংরেজি শব্দ | নির্দেশনা |
|-------------|----------|
| MEL (Monitoring, Evaluation, Learning) | সংক্ষিপ্ত রূপ ইংরেজিতে রাখুন; প্রথম ব্যবহারে স্থানীয় ভাষায় পূর্ণ রূপ দিন |
| Theory of Change | ইংরেজিতে রাখুন; প্রতিলিপি যোগ করুন |
| Randomised Controlled Trial (RCT) | সংক্ষিপ্ত রূপ রাখুন; পূর্ণ রূপ অনুবাদ করুন |
| Logframe | ইংরেজিতে রাখুন |
| Progressive Web App (PWA) | ইংরেজিতে রাখুন |
| Row-Level Security (RLS) | ইংরেজিতে রাখুন |
| Supabase, Netlify, GitBook | ইংরেজিতে রাখুন (পণ্যের নাম) |

---

## কীভাবে অনুবাদ অবদান করবেন

### নতুন ভাষা

১. ইংরেজি ডিরেক্টরি কপি করুন: `cp -r docs-impactmojo/ docs-impactmojo-{lang}/`
২. ডিরেক্টরি কাঠামো সংরক্ষণ করে প্রতিটি `.md` ফাইল অনুবাদ করুন
৩. অনুবাদিত বিভাগ শিরোনাম দিয়ে `SUMMARY.md` আপডেট করুন
৪. একটি পুল রিকোয়েস্ট জমা দিন

### বিদ্যমান অনুবাদ উন্নত করুন

১. সংশ্লিষ্ট `docs-impactmojo-{lang}/` ডিরেক্টরিতে ফাইলটিতে নেভিগেট করুন
২. অনুবাদ সম্পাদনা করুন
৩. `Translate` কমিট উপসর্গ সহ একটি পুল রিকোয়েস্ট জমা দিন

---

## ডিরেক্টরি কাঠামো

প্রতিটি ভাষার ডিরেক্টরি ইংরেজি কাঠামোর হুবহু প্রতিরূপ:

```
docs-impactmojo-{lang}/
├── README.md
├── SUMMARY.md
├── for-educators/
│   ├── platform-overview.md
│   ├── getting-started.md
│   ├── workshops-and-facilitation.md
│   ├── handouts-guide.md
│   ├── dataverse-guide.md
│   └── faq.md
├── api/
│   └── README.md
├── technical/
│   ├── architecture.md
│   ├── deployment.md
│   └── environment-variables.md
├── contributing/
│   ├── how-to-contribute.md
│   └── translations.md
├── reference/
│   ├── roadmap.md
│   ├── changelog.md
│   └── glossary.md
└── about/
    ├── background.md
    ├── license.md
    └── contact.md
```

---

## CI ওয়ার্কফ্লো

একটি GitHub Actions ওয়ার্কফ্লো `main`-এ প্রতিটি পুশে চেক করে:
- **ফাইল কভারেজ** — প্রতিটি অনুবাদ ডিরেক্টরিতে কি সমস্ত ইংরেজি ফাইল আছে?
- **SUMMARY.md সমতা** — সমস্ত অনুবাদে কি মিলতে যাওয়া সূচিপত্র কাঠামো আছে?
- **পুরনো শনাক্তকরণ** — ইংরেজি সোর্স পরিবর্তনের ৩০+ দিন পরে আপডেট না হওয়া অনুবাদ চিহ্নিত করে

---

## যোগাযোগ

অনুবাদ অবদানের জন্য, বিষয়বস্তু "Translation Contribution: [Language]" লিখে [hello@impactmojo.in](mailto:hello@impactmojo.in)-এ ইমেইল করুন।
