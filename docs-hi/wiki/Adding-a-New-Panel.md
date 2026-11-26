# एक नया पैनल जोड़ना
JanVayu पैनल कंटेंट के लिए HTML `<template>` एलिमेंट्स का इस्तेमाल करता है। हर पैनल तभी लोड होता है जब यूज़र उस पर नेविगेट करता है। नए पैनल `index.html` में बिल्कुल नहीं होते: उनमें से 19 `panels/*.html` में HTML फ्रैगमेंट्स हैं, जिन्हें लेज़ी तरीके से फेच किया जाता है और `app.js` में `LAZY_PANELS` मैप में रजिस्टर किया जाता है। बड़े पैनल के लिए उस रूट का इस्तेमाल करें; नीचे दिए गए स्टेप्स `<template>` रूट के बारे में बताते हैं।
---
## स्टेप-बाय-स्टेप
### 1. टेम्पलेट बनाएं
`index.html` में एक नया `<template>` एलिमेंट जोड़ें:
```html
<template id="tmpl-your-panel">
    <div class="section-intro">
        <h2> <span class="si si-your-icon"> <\/span> पैनल टाइटल <\/h2>
        <p data-simple="सादी भाषा में विवरण।">
            इस पैनल का तकनीकी विवरण।
        </p>
    <\/div>
    <!-- आपका कंटेंट यहाँ -->
</template>
```
### 2. इसे इंडेक्स में जोड़ें
इंडेक्स वह तरीका है जिससे कोई विज़िटर पैनल ढूंढता है। बार में इंडेक्स कंट्रोल हर डेस्टिनेशन की लिस्ट को ग्रुप्स में खोलता है। `index.html` में `#siteIndexGrid` के अंदर सही ग्रुप हेडिंग के नीचे एक लिंक जोड़ें:
```html
<a href="#your-panel" data-panel="your-panel" onclick="showPanel('your-panel'); closeSiteIndex(); return false;">आपका पैनल <\/a>
```
पुराना ड्रॉपडाउन नेविगेशन (`.nav-dropdown-link` बटन्स के साथ `<nav class="section-nav">`) और अलग मोबाइल नेविगेशन (`.mobile-nav-item`) अब `index.html` के मार्कअप में नहीं हैं। उनका केवल कुछ CSS बचा है, इसलिए वहाँ जोड़ने के लिए कुछ नहीं है।
### 3. डेस्टिनेशन काउंट अपडेट करें
`scripts/check-nav-coverage.py` इंडेक्स में डेस्टिनेशन्स और ग्रुप्स की संख्या की तुलना `docs/user-guide/overview.md` और `docs/user-guide/role-selector.md` में दिए गए आंकड़ों से करता है, और अगर किसी डेस्टिनेशन का रूट गायब होता है तो फेल हो जाता है। जब आप इंडेक्स में कुछ जोड़ें तो दोनों पेजों को अपडेट करें, फिर चेक रन करें।
### 4. सादी भाषा का टेक्स्ट जोड़ें
तकनीकी कंटेंट वाले सभी `<p>` टैग्स में `data-simple="..."` जोड़ें।
### 5. रोल कॉन्फ़िग्स में जोड़ें (ऑप्शनल)
```javascript
parent: {
    panels: [
        { panel: 'your-panel', title: 'पैनल टाइटल', desc: 'छोटा विवरण' },
    ]
}
```
---
## कॉमन पैटर्न्स
### स्टैट स्ट्रिप
```html
<div class="stat-strip">
    <div class="stat-strip-item">
        <div class="number-callout jv-t-red">169K <\/div>
        <div class="stat-label">विवरण <\/div>
    <\/div>
<\/div>
```
### कार्ड
```html
<div class="card mb-2">
    <div class="card-header"><span class="card-title">टाइटल <\/span> <\/div>
    <div class="card-body">कंटेंट <\/div>
    <div class="card-footer">स्रोत: ... <\/div>
<\/div>
```
---
### इन्फो बॉक्स
```html
<div class="info-box" style="border-left: 3px solid var(--accent);">
    <h4>Heading< /h4>
    <p>Content</p>
< /div>
```
---
## आइकन
JanVayu [Sargam Icons](https://sargamicons.com/) v1.6.7 का उपयोग करता है। `<span class="si si-icon-name">< /span>` का उपयोग करें।
