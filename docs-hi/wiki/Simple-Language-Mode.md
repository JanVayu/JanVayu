# सिंपल लैंग्वेज मोड

JanVayu में जटिल तकनीकी सामग्री (PM2.5 सांद्रता, GEMM मृत्यु दर मॉडल, नीतिगत संक्षिप्त नाम) शामिल हैं। सिंपल लैंग्वेज मोड इस सामग्री को सरल, बिना किसी तकनीकी शब्द वाली भाषा में फिर से लिखता है जिसे कोई भी समझ सके।

---

## यह कैसे काम करता है

1. **Toggle** — हेडर में आंख वाले आइकन पर क्लिक करें, या शब्दावली पैनल में टॉगल का उपयोग करें
2. **Swap** — `data-simple` एट्रिब्यूट वाले सभी तत्वों की सामग्री को सरल भाषा वाले संस्करणों से बदल दिया जाता है
3. **Persist** — स्टेट `sessionStorage` में सेव हो जाता है, पेज रीलोड होने पर रिस्टोर हो जाता है
4. **Visual indicator** — सरल किए गए टेक्स्ट के बगल में एक हरा "Simple language" बैज दिखाई देता है
5. **Reversible** — तकनीकी भाषा को वापस लाने के लिए फिर से क्लिक करें

---

## तकनीकी कार्यान्वयन

### HTML एट्रिब्यूट्स

किसी भी तत्व में `data-simple` एट्रिब्यूट जोड़कर उसे सिंपल-मोड-अवेयर बनाया जा सकता है:

```html
<p data-simple="गंदी हवा की वजह से भारत को हर साल बहुत सारा पैसा खर्च करना पड़ता है।">
    भारत में बाहरी वायु प्रदूषण के कारण समय से पहले होने वाली मौतों का मौद्रिक मूल्य 2022 में $339.4 बिलियन था (जीडीपी का 9.5%)।
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

## कवरेज

- पैनल के परिचयात्मक पैराग्राफ
- 20 शब्दावली परिभाषाएँ (तकनीकी / सरल)
- मुख्य इनसाइट बॉक्स, अलर्ट बॉक्स, पुल-कोट्स
- बजट, नीति, स्वास्थ्य, बच्चों, इनडोर, कानूनी, एक्शन पैनल

### सरल टेक्स्ट जोड़ना

1. `index.html` में तत्व खोजें
2. `data-simple="यहाँ अपना सरल भाषा वाला संस्करण लिखें"` जोड़ें
3. विशेष वर्णों के लिए HTML एंटिटी का उपयोग करें: `&lt;strong&gt;`, `&amp;`
4. 12 साल के बच्चे के लिए लिखें: छोटे वाक्य, कोई संक्षिप्त नाम नहीं, ठोस उदाहरण
5. समान अर्थ बनाए रखें — भाषा को सरल करें, सामग्री को नहीं

### दिशानिर्देश
| तकनीकी | आसान भाषा |
|-----------|--------|
| PM2.5 concentration of 60 ug/m3 | 60 का प्रदूषण स्तर (WHO की सालाना गाइडलाइन 5 है; भारत की सालाना सीमा 40 है) |
| GEMM mortality model | एक फॉर्मूला जो बताता है कि प्रदूषण से कितने लोगों की जान जाती है |
| source apportionment studies | प्रदूषण किस वजह से होता है, इस पर रिसर्च |
| cost-effectiveness analysis | यह देखना कि पैसे सही जगह खर्च हुए या नहीं |
