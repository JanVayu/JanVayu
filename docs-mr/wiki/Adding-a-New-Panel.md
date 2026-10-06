# नवीन पॅनेल जोडणे

पॅनेलच्या कंटेंटसाठी JanVayu `<template>` HTML एलिमेंट्स वापरते. युजर जेव्हा त्या पॅनेलवर जातो, तेव्हाच ते लोड होते. नवीन पॅनेल्स `index.html` मध्ये अजिबात नसतात: त्यापैकी १९ पॅनेल्स `panels/*.html` मधील HTML फ्रॅगमेंट्स असतात, जे लेझीली फेच केले जातात आणि `app.js` मधील `LAZY_PANELS` मॅपमध्ये रजिस्टर केले जातात. मोठ्या पॅनेलसाठी तो मार्ग वापरा; खालील स्टेप्स `<template>` मार्गाचे वर्णन करतात.

---

## स्टेप-बाय-स्टेप

### १. टेम्पलेट तयार करा

`index.html` मध्ये एक नवीन `<template>` एलिमेंट जोडा:

```html
<template id="tmpl-your-panel">
    <div class="section-intro">
        <h2><span class="si si-your-icon"></span> पॅनेलचे शीर्षक</h2>
        <p data-simple="साध्या भाषेतील वर्णन.">
            या पॅनेलचे तांत्रिक वर्णन.
        </p>
    </div>
    <!-- तुमचा कंटेंट येथे -->
</template>
```

### २. नेव्हिगेशन लिंक जोडा

`<nav class="section-nav">` मध्ये, योग्य ड्रॉपडाउनखाली जोडा:

```html
<button class="nav-dropdown-link" data-panel="your-panel">तुमचे पॅनेल</button>
```

### ३. मोबाईल नेव्हिगेशन लिंक जोडा

```html
<button class="mobile-nav-item" data-panel="your-panel">तुमचे पॅनेल</button>
```

### ४. साध्या भाषेतील मजकूर जोडा

तांत्रिक कंटेंट असलेल्या सर्व `<p>` टॅग्समध्ये `data-simple="..."` जोडा.

### ५. रोल कॉन्फिग्समध्ये जोडा (पर्यायी)

```javascript
parent: {
    panels: [
        { panel: 'your-panel', title: 'पॅनेलचे शीर्षक', desc: 'छोटा वर्णन' },
    ]
}
```

---

## सामान्य पॅटर्न

### स्टॅट स्ट्रिप
```html
<div class="stat-strip">
    <div class="stat-strip-item">
        <div class="number-callout jv-t-red">169K</div>
        <div class="stat-label">वर्णन</div>
    </div>
</div>
```

### कार्ड
```html
<div class="card mb-2">
    <div class="card-header"><span class="card-title">शीर्षक</span></div>
    <div class="card-body">कंटेंट</div>
    <div class="card-footer">स्रोत: ...</div>
</div>
```

### इन्फो बॉक्स
```html
<div class="info-box" style="border-left: 3px solid var(--accent);">
    <h4>शीर्षक</h4>
    <p>कंटेंट</p>
</div>
```

---

## आयकॉन्स

JanVayu [Sargam Icons](https://sargamicons.com/) v1.6.7 वापरते. `<span class="si si-icon-name"></span>` वापरा.
