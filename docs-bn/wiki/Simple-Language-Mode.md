# সহজ ভাষার মোড

JanVayu-তে জটিল প্রযুক্তিগত বিষয়বস্তু থাকে (PM2.5 ঘনত্ব, GEMM মৃত্যুহার মডেল, পলিসির সংক্ষিপ্ত রূপ)। সহজ ভাষার মোড এই বিষয়বস্তুগুলোকে এমন সহজ ও পরিভাষামুক্ত ভাষায় নতুন করে লেখে যা যে কেউ বুঝতে পারে।

---

## এটি কীভাবে কাজ করে

1. **টগল** — হেডার-এ থাকা চোখের আইকনে ক্লিক করুন, অথবা গ্লোসারি প্যানেলের টগলটি ব্যবহার করুন
2. **অদলবদল** — `data-simple` অ্যাট্রিবিউটযুক্ত সব উপাদানের বিষয়বস্তু সাধারণ ভাষার সংস্করণে বদলে যায়
3. **স্থায়ী রাখা** — স্টেট `sessionStorage`-এ সেভ করা হয়, পেজ রিলোড করলে আবার ফিরে আসে
4. **ভিজ্যুয়াল নির্দেশক** — সহজ করা টেক্সটের পাশে একটি সবুজ "Simple language" ব্যাজ দেখা যায়
5. **উল্টানো যায়** — প্রযুক্তিগত ভাষা ফিরিয়ে আনতে আবার ক্লিক করুন

---

## প্রযুক্তিগত প্রয়োগ

### HTML অ্যাট্রিবিউট

যেকোনো উপাদানে `data-simple` অ্যাট্রিবিউট যোগ করে সেটিকে সহজ-মোড-সচেতন করা যায়:

```html
<p data-simple="নোংরা বাতাসের কারণে প্রতি বছর ভারতের অনেক টাকা খরচ হয়।">
    ভারতে বাইরের বায়ুদূষণের কারণে অকাল মৃত্যুর আর্থিক মূল্য ২০২২ সালে ছিল $339.4 বিলিয়ন (জিডিপির ৯.৫%)।
</p>
```

### JavaScript

```javascript
let simpleMode = sessionStorage.getItem('janvayu-simple-mode') === 'true';

function toggleSimpleMode() {
    simpleMode = !simpleMode;
    sessionStorage.setItem('janvayu-simple-mode', simpleMode);
    applySimpleMode();
}

function applySimpleMode() {
    document.body.classList.toggle('simple-language', simpleMode);
    document.querySelectorAll('[data-simple]').forEach(el => {
        if (simpleMode) {
            if (!el.dataset.technical) el.dataset.technical = el.innerHTML;
            el.innerHTML = el.dataset.simple;
        } else {
            if (el.dataset.technical) el.innerHTML = el.dataset.technical;
        }
    });
}
```

---

## কভারেজ

- প্যানেলের পরিচিতিমূলক অনুচ্ছেদ
- ২০টি গ্লোসারি সংজ্ঞা (প্রযুক্তিগত / সহজ)
- মূল তথ্যের বক্স, অ্যালার্ট বক্স, পুল-কোয়েট
- বাজেট, পলিসি, স্বাস্থ্য, শিশু, ইনডোর, আইনি, অ্যাকশন প্যানেল

### সহজ টেক্সট যোগ করা

1. `index.html`-এ উপাদানটি খুঁজুন
2. `data-simple="আপনার সহজ ভাষার সংস্করণ এখানে"` যোগ করুন
3. বিশেষ অক্ষরের জন্য HTML এনটিটি ব্যবহার করুন: `&lt;strong&gt;`, `&amp;`
4. ১২ বছরের একটি শিশুর জন্য লিখুন: ছোট বাক্য, কোনো সংক্ষিপ্ত রূপ নয়, বাস্তব উদাহরণ
5. অর্থ একই রাখুন — ভাষা সহজ করুন, বিষয়বস্তু নয়

### নির্দেশিকা
| কারিগরি | সহজ |
|-----------|--------|
| PM2.5 concentration of 60 ug/m3 | দূষণের মাত্রা 60 (WHO-এর বার্ষিক নির্দেশিকা 5; ভারতের বার্ষিক সীমা 40) |
| GEMM mortality model | এমন একটি সূত্র যা অনুমান করে দূষণের কারণে কতজন মানুষের মৃত্যু হয় |
| source apportionment studies | দূষণের কারণ কী, তা নিয়ে গবেষণা |
| cost-effectiveness analysis | টাকাটা ঠিকঠাক খরচ হয়েছে কিনা তা যাচাই করা |
