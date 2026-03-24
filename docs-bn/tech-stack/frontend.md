# Frontend Stack

## HTML/CSS/JavaScript (Vanilla)

সম্পূর্ণ frontend একটি একক `index.html` ফাইল — বর্তমানে ~11,300 লাইন — ইনলাইন `<style>` এবং `<script>` ব্লক সহ। কোনো পৃথক `.css` বা `.js` ফাইল নেই।

### কেন সবকিছু ইনলাইন?

1. **একটি HTTP request** — ব্রাউজার একটি ফাইল ফেচ করে এবং সবকিছু পায়
2. **কোনো বিল্ড স্টেপ নেই** — `index.html` হল deploy artefact
3. **Contributor-বান্ধব** — "আপনার ব্রাউজারে `index.html` খুলুন" হল সম্পূর্ণ dev setup
4. **নিশ্চিত ধারাবাহিকতা** — কোনো CSS/JS লোড অর্ডার সমস্যা নেই

### CSS আর্কিটেকচার

- থিমিংয়ের জন্য **CSS Custom Properties** (লাইট/ডার্ক মোড টগল)
- **কোনো preprocessor নেই** (Sass, Less, বা PostCSS নেই)
- মিডিয়া কোয়েরি সহ **Mobile-first** responsive design
- **WCAG AA** কালার কন্ট্রাস্ট সম্মতি

মূল variables:

```css
:root {
  --primary: #2563eb;
  --bg: #ffffff;
  --text: #1e293b;
  --card-bg: #f8fafc;
  --border: #e2e8f0;
}

[data-theme="dark"] {
  --bg: #0f172a;
  --text: #e2e8f0;
  --card-bg: #1e293b;
  --border: #334155;
}
```

### JavaScript প্যাটার্ন

- **ES2020** — ব্রাউজার সামঞ্জস্যতা বজায় রাখতে নতুন ফিচার নেই
- সমস্ত HTTP কলের জন্য **Fetch API** (axios নেই)
- `document.getElementById` / `querySelector` দিয়ে **DOM manipulation**
- **কোনো module bundler নেই** — সমস্ত JS `<script>` ট্যাগে
- সরাসরি AQI ডেটার জন্য **10-মিনিট স্বয়ংক্রিয়-রিফ্রেশ**

---

## Chart.js

**ভার্সন:** সর্বশেষ stable (CDN দিয়ে লোড)
**ব্যবহৃত হয়:**
- Metro বনাম Regional AQI তুলনা বার চার্ট
- PM2.5 ট্রেন্ড লাইন
- স্বাস্থ্য প্রভাব ডেটা ভিজুয়ালাইজেশন
- ঋতুভিত্তিক বেসলাইন তুলনা

**কেন Chart.js:**
- ছোট footprint (~60 KB gzipped)
- বিল্ড স্টেপ ছাড়া কাজ করে (CDN script tag)
- Canvas-ভিত্তিক rendering (মোবাইলে পারফরম্যান্ট)
- বিল্ট-ইন responsive/accessibility ফিচার

---

## Leaflet.js + OpenStreetMap

**ভার্সন:** সর্বশেষ stable (CDN দিয়ে লোড)
**ব্যবহৃত হয়:**
- AQI স্টেশন মার্কার সহ 40+ ভারতীয় শহরের ইন্টারেক্টিভ মানচিত্র
- AQI তীব্রতা অনুযায়ী রঙ-কোডযুক্ত মার্কার (সবুজ/হলুদ/কমলা/লাল/বেগুনি)
- ক্লিক করে স্টেশন বিবরণ দেখা

**কেন Leaflet + OSM:**
- বিনামূল্যে ও ওপেন সোর্স (Google Maps API key প্রয়োজন নেই)
- হালকা (~40 KB gzipped)
- OpenStreetMap টাইলস যেকোনো স্কেলে বিনামূল্যে
- ক্যাশকৃত টাইলস দিয়ে অফলাইনে কাজ করে

---

## বহুভাষিক সমর্থন

JanVayu ক্লায়েন্ট-সাইড ভাষা টগলের মাধ্যমে 5টি ভাষা সমর্থন করে:

| ভাষা | কোড |
|----------|------|
| English | `en` |
| Hindi | `hi` |
| Tamil | `ta` |
| Marathi | `mr` |
| Bengali | `bn` |

**বাস্তবায়ন:** ভাষা strings JS objects হিসেবে সংরক্ষিত এবং টগলে DOM elements-এ পরিবর্তিত হয়। কোনো i18n লাইব্রেরি নেই — শুধু একটি সাধারণ key-value lookup।

---

## অ্যাক্সেসিবিলিটি

- সমস্ত ইন্টারেক্টিভ এলিমেন্টের জন্য কীবোর্ড নেভিগেশন
- semantic HTML অপর্যাপ্ত যেখানে ARIA roles
- WCAG AA মেনে কালার কন্ট্রাস্ট (টেক্সটের জন্য 4.5:1)
- সমস্ত ছবিতে alt text
- সমস্ত ইনপুটে form labels
- ইন্টারেক্টিভ এলিমেন্টে focus indicators
