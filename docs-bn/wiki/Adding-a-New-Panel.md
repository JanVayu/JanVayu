# একটি নতুন প্যানেল যোগ করা

প্যানেলের কন্টেন্টের জন্য JanVayu HTML `<template>` এলিমেন্ট ব্যবহার করে। ব্যবহারকারী যখন কোনো প্যানেলে যান, তখন সেটি অন-ডিমান্ড লোড হয়। নতুন প্যানেলগুলো `index.html`-এ থাকে না: এর মধ্যে ১৯টি হলো `panels/*.html`-এ থাকা HTML ফ্র্যাগমেন্ট, যেগুলো লেজিভাবে ফেচ করা হয় এবং `app.js`-এর `LAZY_PANELS` ম্যাপে রেজিস্টার করা হয়। বড় প্যানেলের জন্য ওই রুটটি ব্যবহার করুন; নিচের ধাপগুলোতে `<template>` রুট সম্পর্কে বলা হয়েছে।

---

## ধাপে ধাপে

### ১. টেমপ্লেট তৈরি করুন

`index.html`-এ একটি নতুন `<template>` এলিমেন্ট যোগ করুন:

```html
<template id="tmpl-your-panel">
    <div class="section-intro">
        <h2><span class="si si-your-icon"></span> প্যানেলের শিরোনাম</h2>
        <p data-simple="সাধারণ ভাষায় বর্ণনা।">
            এই প্যানেলের কারিগরি বর্ণনা।
        </p>
    </div>
    <!-- আপনার কন্টেন্ট এখানে -->
</template>
```

### ২. নেভিগেশন লিংক যোগ করুন

`<nav class="section-nav">`-এর ভেতরে, উপযুক্ত ড্রপডাউনের নিচে যোগ করুন:

```html
<button class="nav-dropdown-link" data-panel="your-panel">আপনার প্যানেল</button>
```

### ৩. মোবাইল নেভিগেশন লিংক যোগ করুন

```html
<button class="mobile-nav-item" data-panel="your-panel">আপনার প্যানেল</button>
```

### ৪. সাধারণ ভাষার টেক্সট যোগ করুন

কারিগরি কন্টেন্ট আছে এমন সব `<p>` ট্যাগে `data-simple="..."` যোগ করুন।

### ৫. রোল কনফিগে যোগ করুন (ঐচ্ছিক)

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
        <div class="number-callout jv-t-red">169K</div>
        <div class="stat-label">বর্ণনা</div>
    </div>
</div>
```

### কার্ড
```html
<div class="card mb-2">
    <div class="card-header"><span class="card-title">শিরোনাম</span></div>
    <div class="card-body">কন্টেন্ট</div>
    <div class="card-footer">উৎস: ...</div>
</div>
```

### ইনফো বক্স
```html
<div class="info-box" style="border-left: 3px solid var(--accent);">
    <h4>শিরোনাম</h4>
    <p>কন্টেন্ট</p>
</div>
```

---

## আইকন

JanVayu [Sargam Icons](https://sargamicons.com/) v1.6.7 ব্যবহার করে। `<span class="si si-icon-name"></span>` ব্যবহার করুন।
