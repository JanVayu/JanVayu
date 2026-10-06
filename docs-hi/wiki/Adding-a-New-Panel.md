# नया पैनल जोड़ना

JanVayu पैनल कंटेंट के लिए HTML `<template>` एलिमेंट्स का उपयोग करता है। जब यूज़र किसी पैनल पर जाता है, तो वह ऑन डिमांड लोड होता है। नए पैनल `index.html` में बिल्कुल नहीं होते: उनमें से 19 `panels/*.html` में HTML फ्रैगमेंट्स हैं, जिन्हें लेज़ीली फेच किया जाता है और `app.js` में `LAZY_PANELS` मैप में रजिस्टर किया जाता है। बड़े पैनल के लिए उस रूट का उपयोग करें; नीचे दिए गए स्टेप्स `<template>` रूट के बारे में बताते हैं।

---

## स्टेप-बाय-स्टेप

### 1. टेम्पलेट बनाएँ

`index.html` में एक नया `<template>` एलिमेंट जोड़ें:

```html
<template id="tmpl-your-panel">
    <div class="section-intro">
        <h2><span class="si si-your-icon"></span> पैनल का शीर्षक</h2>
        <p data-simple="साधारण भाषा में विवरण।">
            इस पैनल का तकनीकी विवरण।
        </p>
    </div>
    <!-- यहाँ आपका कंटेंट -->
</template>
```

### 2. नेविगेशन लिंक जोड़ें

`<nav class="section-nav">` में, सही ड्रॉपडाउन के नीचे जोड़ें:

```html
<button class="nav-dropdown-link" data-panel="your-panel">आपका पैनल</button>
```

### 3. मोबाइल नेविगेशन लिंक जोड़ें

```html
<button class="mobile-nav-item" data-panel="your-panel">आपका पैनल</button>
```

### 4. साधारण भाषा का टेक्स्ट जोड़ें

तकनीकी कंटेंट वाले सभी `<p>` टैग्स में `data-simple="..."` जोड़ें।

### 5. रोल कॉन्फ़िग्स में जोड़ें (ऑप्शनल)

```javascript
parent: {
    panels: [
        { panel: 'your-panel', title: 'पैनल का शीर्षक', desc: 'छोटा विवरण' },
    ]
}
```

---

## सामान्य पैटर्न्स

### स्टैट स्ट्रिप
```html
<div class="stat-strip">
    <div class="stat-strip-item">
        <div class="number-callout jv-t-red">169K</div>
        <div class="stat-label">विवरण</div>
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
    <h4>हेडिंग</h4>
    <p>कंटेंट</p>
</div>
```

---

## आइकन्स

JanVayu [Sargam Icons](https://sargamicons.com/) v1.6.7 का उपयोग करता है। `<span class="si si-icon-name"></span>` का उपयोग करें।
