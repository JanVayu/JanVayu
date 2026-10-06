# পারফরম্যান্স রোডম্যাপ

এই পৃষ্ঠায় JanVayu-এর মোবাইল-পারফরম্যান্স কাজের পরিকল্পিত পদ্ধতিটি তুলে ধরা হয়েছে — যা v26.5.4 (Lighthouse CI + বাজেট কনফিগ)-এ স্ক্যাফোল্ড করা হয়েছে, আর আসল রিফ্যাক্টরিংয়ের জন্য একটি আলাদা সাইকেলের অপেক্ষা করা হচ্ছে।

[issue #3](https://github.com/JanVayu/JanVayu/issues/3)-এ ট্র্যাক করা হয়েছে।

---

## বর্তমান অবস্থা (মে ২০২৬)

- একটিমাত্র `index.html`, ~990 KB মিনিফাইড।
- Chart.js 4.x (~70 KB গজিপড) এবং Leaflet 1.9 + leaflet.heat (~50 KB গজিপড) পেজের ওপরের দিকে `defer` দিয়ে লোড করা হয়। এগুলো পার্সিং বা ফার্স্ট পেইন্ট ব্লক করে না, কিন্তু প্রতিটি ভিজিটে ~120 KB ব্যান্ডউইথ খরচ করে, যদিও বেশিরভাগ সেশন কখনোই Trends বা Live Map প্যানেল খোলে না।
- CSS `mask-image`-এর মাধ্যমে Sargam Icons — কোনো আইকন ফন্ট ডাউনলোড হয় না।
- সার্ভিস ওয়ার্কার (`sw.js`) শেল + শেষ জানা AQI ক্যাশ করে রাখে।
- Netlify-এর ডিফল্ট অপশনের মাধ্যমে Brotli কম্প্রেশন আশা করা হচ্ছে (এখনো যাচাই করা হয়নি; নিচের curl টেস্টটি দেখুন)।

> **আপডেট ২ অক্টোবর ২০২৬:** ওপরের বুলেটগুলো মে ২০২৬-এর রেকর্ড এবং এখন পরিস্থিতি বদলেছে। `index.html` এখন প্রায় 621 KB, যেখানে `styles.css` এবং `app.js` আলাদা ফাইল হিসেবে আছে। Chart.js এবং Leaflet আর পেজের ওপরের দিকে লোড হয় না: v26.5.6-এ লেজি-লোডিং চালু করা হয়েছে (`app.js`-এ `ensureChartJs()` / `ensureLeaflet()`, লেজি-লোডেড স্ক্রিপ্টগুলোতে SRI হ্যাশ সহ), তাই নিচে সেকশন ১-এ যে রিফ্যাক্টরিংয়ের পরিকল্পনা করা হয়েছিল তা সম্পন্ন হয়েছে। ইনলাইন CSS এখন একটি ক্রিটিক্যাল-CSS সাবসেট, বাকিটা `/styles.css`-এ আছে ([Frontend Stack](../tech-stack/frontend.md) দেখুন), তাই সেকশন ২-এ বর্ণিত ~85 KB ইনলাইন ব্লক আর নেই।

## Lighthouse বাজেট (`.lighthouserc.json`)

| মেট্রিক | লক্ষ্য | বর্তমান অবস্থা |
|---|---|---|
| পারফরম্যান্স স্কোর | ≥ 0.60 | CI-এর অধীনে এখনো মাপা হয়নি |
| অ্যাক্সেসিবিলিটি স্কোর | ≥ 0.85 | [issue #4](https://github.com/JanVayu/JanVayu/issues/4) দেখুন |
| বেস্ট প্র্যাকটিসেস স্কোর | ≥ 0.85 | এখনো মাপা হয়নি |
| SEO স্কোর | ≥ 0.90 | সম্ভবত পাস করছে (প্রতি-পলিউ্যান্ট পেজগুলোতে schema.org JSON-LD আছে) |
| ফার্স্ট কনটেন্টফুল পেইন্ট | ≤ 3,000 ms | ডেস্কটপে সম্ভবত পাস করছে, 3G-তে অজানা |
| লার্জেস্ট কনটেন্টফুল পেইন্ট | ≤ 4,500 ms | 3G-তে সম্ভবত ফেইল করছে |
| টোটাল ব্লকিং টাইম | ≤ 600 ms | 3G-তে সম্ভবত ফেইল করছে |
| কিউমুলেটিভ লেআউট শিফট | ≤ 0.15 | সম্ভবত পাস করছে |

লক্ষ্যগুলো ধারাবাহিকভাবে পূরণ না হওয়া পর্যন্ত অ্যাসারশনগুলো `warn` হিসেবে থাকে; Lighthouse CI রান-এ বাজেট পূরণ হয়ে গেলে সেগুলোকে `error`-এ পরিবর্তন করা হবে।

## পরিকল্পিত রিফ্যাক্টরিং (একটি নির্দিষ্ট সাইকেল)

### ১. Chart.js এবং Leaflet-এর লেজি-লোডিং

ইগার `<script src="...chart.js" defer>` এবং `<script src="...leaflet.js" defer>` ট্যাগগুলো সরিয়ে ফেলুন। এর বদলে একটি ছোট লোডার প্যাটার্ন ব্যবহার করুন:


</section>
```js
let _chartJsLoaded = null;
async function ensureChartJs() {
  if (window.Chart) return;
  if (_chartJsLoaded) return _chartJsLoaded;
  _chartJsLoaded = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js';
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return _chartJsLoaded;
}

let _leafletLoaded = null;
async function ensureLeaflet() {
  if (window.L?.heatLayer) return;
  if (_leafletLoaded) return _leafletLoaded;
  _leafletLoaded = (async () => {
    await loadCSS('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
    await loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
    await loadScript('https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js');
  })();
  return _leafletLoaded;
}
```

তারপর চার্ট বা ম্যাপ ব্যবহার করা প্রতিটি প্যানেলে, init কল-এর আগে এই কোডটি যোগ করুন:

```js
async function initTrendsCharts() {
  await ensureChartJs();
  // বিদ্যমান চার্ট-ইনিট কোড অপরিবর্তিত থাকবে
}

async function initMap() {
  await ensureLeaflet();
  // বিদ্যমান ম্যাপ-ইনিট কোড অপরিবর্তিত থাকবে
}
```

যে ফাংশনগুলো `initTrendsCharts` / `initMap` কল করে, সেগুলোতে একটি `await` (বা `.then()`) প্রয়োজন। বর্তমান সব কল সাইট `loadPanel(panelId)`-এর ভেতরে রয়েছে যা ক্লিক করলে রান করে, তাই সেখানে একটি `async` আপগ্রেড দেওয়া নিরাপদ।

**প্রত্যাশিত সাশ্রয়:** Trends বা Live Map না খোলা সেশনগুলোর ক্ষেত্রে ফার্স্ট পেইন্টে ~120 KB (সম্ভবত 70%-এর বেশি সেশনের ক্ষেত্রে)। মোবাইল FCP উন্নতি: 3G-তে ~600 ms।

### 2. নন-ক্রিটিক্যাল CSS ডেফার করা

বর্তমান ইনলাইন CSS ব্লকের আকার ~85 KB। এর বেশিরভাগই প্যানেল-নির্দিষ্ট স্টাইলিং যা ফার্স্ট পেইন্টের জন্য প্রয়োজন নেই। একে ভাগ করুন:

- **ক্রিটিক্যাল** (~10 KB): হিরো, টপ-ন্যাভ, ড্যাশবোর্ড কুইক-লিঙ্ক গ্রিড। ইনলাইন রাখতে হবে।
- **নন-ক্রিটিক্যাল** (~75 KB): বাকি সবকিছু। `assets/main.css`-এ সরিয়ে নিন এবং `<link rel="preload" as="style" onload="this.rel='stylesheet'">` দিয়ে লোড করুন।

**প্রত্যাশিত সাশ্রয়:** Brotli-এর পর ফার্স্ট পেইন্টে ~20 KB; মোবাইল FCP উন্নতি: ~200 ms।

### 3. Brotli ভেরিফিকেশন

এটি Netlify-এর ডিফল্ট হেডার-এর মাধ্যমে আগে থেকেই অ্যাক্টিভ আছে, তবে যাচাই করে নেওয়া ভালো:

```bash
curl -H "Accept-Encoding: br" -I https://www.janvayu.in/ | grep -i content-encoding
# প্রত্যাশিত: content-encoding: br
```

যদি এর বদলে `gzip` রিটার্ন হয়, তবে `netlify.toml`-এ স্পষ্টভাবে হেডার সেট করুন।

### 4. ইমেজ / আইকন অপ্টিমাইজেশন
- `og-image.png` এখানে 39 KB হিসেবে রেকর্ড করা হয়েছিল; 2 Oct 2026-এ `ls -l` দেখাচ্ছে 133,256 বাইট (প্রায় 130 KB), ঠিক আছে, তবে এটি বর্তমান সংখ্যা দেখাচ্ছে কিনা তা যাচাই করুন (আলাদা সমস্যা, [audit deferred items](../../docs/wiki/Roadmap.md) দেখুন)।
- `favicon.svg` হলো 1.5 KB — ঠিক আছে।
- `mask-image` এর মাধ্যমে Sargam Icons — আগে থেকেই অপ্টিমাল।

### 5. Mobile responsiveness audit

[issue #33](https://github.com/JanVayu/JanVayu/issues/33)-এ আলাদাভাবে ট্র্যাক করা হচ্ছে। এটি Lighthouse accessibility + best-practices স্কোরে অবদান রাখে, তবে এটি একটি ভিন্ন কাজের ধারা।

---

## Order of attack

1. **Run baseline Lighthouse** — `gh workflow run lighthouse.yml` রান করুন এবং সংখ্যাগুলো ক্যাপচার করুন।
2. **Lazy-load Chart.js + Leaflet** — সবচেয়ে বড় একক সুবিধা (আনুমানিক ~600 ms FCP)।
3. **Re-measure** — এগিয়ে যাওয়ার আগে নিশ্চিত করুন যে 600 ms উন্নতিটি বাস্তব।
4. **CSS split** — দ্বিতীয়-সবচেয়ে বড় সুবিধা (~200 ms)।
5. Lighthouse এরপর যা ফ্ল্যাগ করবে তার ওপর **Iterate** করুন: unused JS, layout shift ইত্যাদি।

যতক্ষণ না বাজেট ধারাবাহিকভাবে পূরণ হচ্ছে, `.lighthouserc.json` অ্যাসারশনগুলোকে `warn`-এ রাখুন। `main`-এ পরপর তিনবার গ্রিন রান হওয়ার পর, perf-score এবং FCP অ্যাসারশনগুলোকে `error`-এ পরিবর্তন করুন।
