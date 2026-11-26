# একটি নতুন প্যানেল যোগ করা
JanVayu প্যানেলের কন্টেন্টের জন্য HTML `<template>` এলিমেন্ট ব্যবহার করে। ব্যবহারকারী যখন কোনো প্যানেলে যান, তখনই সেটি লোড হয়। নতুন প্যানেলগুলো মোটেও `index.html`-এ থাকে না: এগুলোর মধ্যে 19টি হলো `panels/*.html`-এর HTML ফ্র্যাগমেন্ট, যেগুলো লেজিভাবে ফেচ করা হয় এবং `app.js`-এর `LAZY_PANELS` ম্যাপে রেজিস্টার করা হয়। বড় প্যানেলের জন্য ওই রুটটি ব্যবহার করুন; নিচের ধাপগুলোতে `<template>` রুটটি বর্ণনা করা হলো।
---
## ধাপে ধাপে
### 1. টেমপ্লেট তৈরি করুন
`index.html`-এ একটি নতুন `<template>` এলিমেন্ট যোগ করুন:
```html
<template id="tmpl-your-panel">
    <div class="section-intro">
        <h2> <span class="si si-your-icon"> <\/span> প্যানেলের শিরোনাম <\/h2>
        <p data-simple="সাধারণ ভাষার বর্ণনা।">
            এই প্যানেলের প্রযুক্তিগত বর্ণনা।
        </p>
    <\/div>
    <!-- আপনার কন্টেন্ট এখানে -->
</template>
```
### 2. ইনডেক্সে এটি যোগ করুন
ইনডেক্স হলো সেই জায়গা যেখানে একজন ভিজিটর প্যানেল খুঁজে পান। বারের ইনডেক্স কন্ট্রোল গ্রুপ অনুযায়ী প্রতিটি ডেস্টিনেশনের একটি তালিকা খোলে। `index.html`-এর `#siteIndexGrid`-এর ভেতরে সঠিক গ্রুপ হেডিংয়ের নিচে একটি লিংক যোগ করুন:
```html
<a href="#your-panel" data-panel="your-panel" onclick="showPanel('your-panel'); closeSiteIndex(); return false;">আপনার প্যানেল <\/a>
```
পুরোনো ড্রপডাউন নেভিগেশন (`.nav-dropdown-link` বাটনের সাথে `<nav class="section-nav">`) এবং আলাদা মোবাইল নেভিগেশন (`.mobile-nav-item`) এখন আর `index.html`-এর মার্কআপে নেই। এগুলোর কেবল কিছু CSS বাকি আছে, তাই সেখানে যোগ করার মতো কিছু নেই।
### 3. ডেস্টিনেশন কাউন্ট আপডেট করুন
`scripts/check-nav-coverage.py` ইনডেক্সের ডেস্টিনেশন ও গ্রুপের সংখ্যাকে `docs/user-guide/overview.md` এবং `docs/user-guide/role-selector.md`-এ দেওয়া পরিসংখ্যানের সাথে তুলনা করে, এবং কোনো ডেস্টিনেশনের রুট হারিয়ে গেলে ফেইল করে। ইনডেক্সে যোগ করার সময় উভয় পেজ আপডেট করুন, তারপর চেক রান করুন।
### 4. সহজ ভাষার টেক্সট যোগ করুন
প্রযুক্তিগত কন্টেন্ট থাকা সব `<p>` ট্যাগে `data-simple="..."` যোগ করুন।
### 5. রোল কনফিগে যোগ করুন (ঐচ্ছিক)
```javascript
parent: {
    panels: [
        { panel: 'your-panel', title: 'প্যানেলের শিরোনাম', desc: 'সংক্ষিপ্ত বর্ণনা' },
    ]
}
```
---
## সাধারণ প্যাটার্ন
### স্ট্যাট স্ট্রিপ
```html
<div class="stat-strip">
    <div class="stat-strip-item">
        <div class="number-callout jv-t-red">169K <\/div>
        <div class="stat-label">বর্ণনা <\/div>
    <\/div>
<\/div>
```
### কার্ড
```html
<div class="card mb-2">
    <div class="card-header"><span class="card-title">শিরোনাম <\/span> <\/div>
    <div class="card-body">কন্টেন্ট <\/div>
    <div class="card-footer">সূত্র: ... <\/div>
<\/div>
```
---
### তথ্য বাক্স
```html
<div class="info-box" style="border-left: 3px solid var(--accent);">
    <h4>শিরোনাম< /h4>
    <p>বিষয়বস্তু</p>
< /div>
```
---
## আইকনসমূহ
JanVayu [Sargam Icons](https://sargamicons.com/) v1.6.7 ব্যবহার করে। `<span class="si si-icon-name">< /span>` ব্যবহার করুন।
</antThinking>
