# नवीन पॅनेल जोडणे
JanVayu पॅनेलच्या कंटेंटसाठी HTML `<template>` एलिमेंट्स वापरते. युजर जेव्हा त्या पॅनेलवर जातो, तेव्हाच ते लोड केले जाते. नवीन पॅनेल्स `index.html` मध्ये अजिबात नसतात: त्यापैकी 19 हे `panels/*.html` मधील HTML फ्रॅगमेंट्स असतात, जे लेझीली फेच केले जातात आणि `app.js` मधील `LAZY_PANELS` मॅपमध्ये रजिस्टर केले जातात. मोठ्या पॅनेलसाठी तो मार्ग वापरा; खालील पायऱ्या `<template>` मार्गाचे वर्णन करतात.
---
## टप्प्याटप्प्याने
### 1. टेम्पलेट तयार करा
`index.html` मध्ये एक नवीन `<template>` एलिमेंट जोडा:
```html
<template id="tmpl-your-panel">
    <div class="section-intro">
        <h2> <span class="si si-your-icon"> <\/span> Panel Title <\/h2>
        <p data-simple="साध्या भाषेतील वर्णन.">
            या पॅनेलचे तांत्रिक वर्णन.
        </p>
    <\/div>
    <!-- तुमचा कंटेंट येथे -->
</template>
```
### 2. इंडेक्समध्ये जोडा
इंडेक्सद्वारेच अभ्यागत पॅनेल शोधू शकतो. बारमधील इंडेक्स कंट्रोल प्रत्येक डेस्टिनेशनची गटानुसार यादी उघडतो. `index.html` मधील `#siteIndexGrid` च्या आत योग्य ग्रुप हेडिंगखाली एक लिंक जोडा:
```html
<a href="#your-panel" data-panel="your-panel" onclick="showPanel('your-panel'); closeSiteIndex(); return false;">Your Panel <\/a>
```
जुने ड्रॉपडाउन नॅव्ह (`.nav-dropdown-link` बटणांसह `<nav class="section-nav">`) आणि स्वतंत्र मोबाईल नॅव्ह (`.mobile-nav-item`) आता `index.html` च्या मार्कअपमध्ये नाहीत. त्यांचा फक्त काही CSS शिल्लक आहे, त्यामुळे तिथे काहीही जोडण्याची गरज नाही.
### 3. डेस्टिनेशन काउंट अपडेट करा
`scripts/check-nav-coverage.py` इंडेक्समधील डेस्टिनेशन्स आणि ग्रुप्सच्या संख्येची तुलना `docs/user-guide/overview.md` आणि `docs/user-guide/role-selector.md` मध्ये दिलेल्या आकड्यांशी करते, आणि जर एखाद्या डेस्टिनेशनचा मार्ग हरवला तर ते फेल होते. जेव्हा तुम्ही इंडेक्समध्ये काही जोडता, तेव्हा दोन्ही पेजेस अपडेट करा, आणि नंतर चेक रन करा.
### 4. साध्या भाषेतील मजकूर जोडा
तांत्रिक कंटेंट असलेल्या सर्व `<p>` टॅग्समध्ये `data-simple="..."` जोडा.
### 5. रोल कॉन्फिग्समध्ये जोडा (ऐच्छिक)
```javascript
parent: {
    panels: [
        { panel: 'your-panel', title: 'Panel Title', desc: 'Short description' },
    ]
}
```
---
## सामान्य पॅटर्न्स
### स्टॅट स्ट्रिप
```html
<div class="stat-strip">
    <div class="stat-strip-item">
        <div class="number-callout jv-t-red">169K <\/div>
        <div class="stat-label">वर्णन <\/div>
    <\/div>
<\/div>
```
### कार्ड
```html
<div class="card mb-2">
    <div class="card-header"><span class="card-title">Title <\/span> <\/div>
    <div class="card-body">कंटेंट <\/div>
    <div class="card-footer">स्रोत: ... <\/div>
<\/div>
```
---
### माहिती पेटी
```html
<div class="info-box" style="border-left: 3px solid var(--accent);">
   <h4>शीर्षक< /h4>
    <p>आशय</p>
< /div>
```
---
## चिन्हे
JanVayu [Sargam Icons](https://sargamicons.com/) v1.6.7 वापरते. `<span class="si si-icon-name">< /span>` वापरा.
</antThinking>
