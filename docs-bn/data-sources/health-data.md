# স্বাস্থ্য ও মৃত্যুহার তথ্য

JanVayu বায়ু দূষণের স্বাস্থ্য প্রভাব পরিমাপ করতে একাধিক আন্তর্জাতিক উৎস ব্যবহার করে।

---

## প্রধান পরিসংখ্যান (মে ২০২৬)

| মেট্রিক | মান | উৎস |
|---------|-----|------|
| **বার্ষিক PM2.5 মৃত্যু (ভারত)** | **১৭.২ লক্ষ / বছর** | Lancet Countdown 2025 |
| বৈশ্বিক অংশ | বৈশ্বিক PM2.5 মৃত্যুর ~70% | Lancet Countdown 2025 |
| গড় ভারতীয় আয়ু-ক্ষতি | 3.5 বছর | AQLI 2025 |
| ইন্দো-গাঙ্গেয় সমভূমির বাসিন্দাদের ক্ষতি | 7-8 বছর | AQLI 2025 |
| WHO 2021 PM2.5 নির্দেশিকা | 5 µg/m³ (বার্ষিক) | WHO |
| ভারত NAAQS PM2.5 | 40 µg/m³ (বার্ষিক) | CPCB |
| Loni, India (পৃথিবীর সবচেয়ে দূষিত শহর) | 112.5 µg/m³ (বার্ষিক PM2.5) | IQAir 2025 |
| অর্থনৈতিক ব্যয় | $339.4 বিলিয়ন (~9.5% GDP) | Lancet Countdown 2025 |

---

## প্রধান উৎস

### Lancet Countdown 2025 — মূল মৃত্যু সংখ্যা

**উৎস:** *The Lancet Countdown on Health and Climate Change* (2025 রিপোর্ট, ভারত অধ্যায়)
**URL:** [thelancet.com/countdown-health-climate](https://www.thelancet.com/countdown-health-climate)

বার্ষিক *Lancet Countdown* সাম্প্রতিকতম exposure-response functions, জনতাত্ত্বিক ডেটা ও PM2.5 exposure surfaces একত্রিত করে একটি একক attributable-mortality অনুমানে রূপান্তরিত করে। 2025 রিপোর্ট ভারতে বার্ষিক ambient PM2.5 মৃত্যুকে **১৭.২ লক্ষ** হিসেবে চিহ্নিত করেছে — পূর্ববর্তী 15 লক্ষ থেকে বেশি। বৃদ্ধির কারণ গৃহস্থালী বায়োমাস মৃত্যুর পুনঃ-attribution ও PM2.5-এর উচ্চ সীমায় কঠোরতর exposure-response। বৈশ্বিক PM2.5 মৃত্যু ভারে ভারতের অংশ ~70% বহাল রয়েছে।

এটি **JanVayu-তে প্রামাণিক মূল সংখ্যা** — ড্যাশবোর্ডে, স্বাস্থ্য প্রভাব প্যানেলে এবং README-র *Key Statistics* টেবিলে।

### Lancet Planetary Health — Jaganathan et al. (2024) কারণ-বিশ্লেষণ অধ্যয়ন

[DOI: 10.1016/S2542-5196(24)00248-1](https://www.thelancet.com/journals/lanplh/article/PIIS2542-5196(24)00248-1/fulltext)

ভারতীয় cohort ডেটা থেকে প্রথম causal-inference অনুমান। সাতটি জেলা এক দশক ধরে অনুসরণ করে **প্রতি +10 µg/m³ দীর্ঘমেয়াদী PM2.5 বৃদ্ধির জন্য ~8.6% সর্ব-কারণ মৃত্যু বৃদ্ধি** চিহ্নিত করা হয়েছে। যখন এই coefficient ভারতের PM2.5 exposure surface-এ প্রয়োগ করা হয়, মডেল WHO-নির্দেশিকা শর্তের তুলনায় **প্রায় ১৫ লক্ষ** অতিরিক্ত বার্ষিক মৃত্যু attribute করে।

> **দুই সংখ্যার বিষয়ে নোট।** ১৫ লক্ষ (Jaganathan et al.) ও ১৭.২ লক্ষ (Lancet Countdown 2025) — **দুটোই বৈধ ও দুটোই JanVayu-তে cited**। তারা ভিন্ন method-এর ফল (nationwide difference-in-differences vs. annual synthesis)। ড্যাশবোর্ড hero ১৭.২ লক্ষ ব্যবহার করে, যা অধিক সাম্প্রতিক ও সাধারণভাবে উদ্ধৃত সংখ্যা।

### IHME Global Burden of Disease

- বায়ু দূষণজনিত মৃত্যুর অনুমান
- জীবন-বছর ক্ষতি (YLL) ডেটা
- দেশ ও রাজ্য-স্তরের বিশ্লেষণ

### AQLI 2025 — Air Quality Life Index (UChicago EPIC)

- **URL:** [aqli.epic.uchicago.edu](https://aqli.epic.uchicago.edu/)
- গড় ভারতীয় 3.5 বছর আয়ু হারায়
- ইন্দো-গাঙ্গেয় সমভূমিতে 7-8 বছর ক্ষতি — বিশ্বে সর্বোচ্চ

### IQAir World Air Quality Report 2025

- **URL:** [iqair.com/world-air-quality-report](https://www.iqair.com/world-air-quality-report)
- Loni #1 সবচেয়ে দূষিত শহর (112.5 µg/m³)
- নয়াদিল্লি টানা 8ম বছর সবচেয়ে দূষিত রাজধানী
- কেবল 14% বৈশ্বিক শহর WHO 5 µg/m³ নির্দেশিকা পূরণ করে
- ভারতের গড় PM2.5: 48.9 µg/m³ (~10× WHO সীমা)

### WHO নির্দেশিকা (2021)

- PM2.5 বার্ষিক: **5 µg/m³** (আগের 10 µg/m³ থেকে কঠোর)
- PM2.5 24-ঘণ্টা: 15 µg/m³
- ভারত NAAQS (40 µg/m³ বার্ষিক) WHO থেকে **8 গুণ বেশি শিথিল**

---

*শেষ আপডেট: মে 2026 — ইংরেজি সংস্করণের ([docs/data-sources/health-data.md](../../docs/data-sources/health-data.md)) সঙ্গে parity।*
