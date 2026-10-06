# सिम्पल लँग्वेज मोड

जानवायुमध्ये गुंतागुंतीचा तांत्रिक आशय (PM2.5 कॉन्सन्ट्रेशन्स, GEMM मॉर्टॅलिटी मॉडेल्स, पॉलिसी ॲक्रोनिम्स) आहे. सिम्पल लँग्वेज मोड हा आशय कोणालाही सहज समजेल अशा साध्या, तांत्रिक शब्दांशिवाय असलेल्या भाषेत पुन्हा लिहितो.

---

## हे कसं काम करतं

1. **टॉगल** — हेडरमधील डोळ्याच्या आयकॉनवर क्लिक करा, किंवा ग्लोसरी पॅनेलमध्ये टॉगल वापरा
2. **बदल** — `data-simple` ॲट्रिब्युट असलेल्या सर्व घटकांचा आशय साध्या भाषेतील आवृत्तीने बदलला जातो
3. **टिकवणे** — स्थिती `sessionStorage` मध्ये सेव्ह केली जाते, पेज रीलोड केल्यावर पूर्ववत होते
4. **दृश्य सूचक** — सोप्या केलेल्या मजकुराच्या शेजारी एक हिरवं "Simple language" बॅज दिसतं
5. **परत करण्यायोग्य** — तांत्रिक भाषा पूर्ववत करण्यासाठी पुन्हा क्लिक करा

---

## तांत्रिक अंमलबजावणी

### HTML ॲट्रिब्युट्स

कोणत्याही घटकाला `data-simple` ॲट्रिब्युट जोडून सिम्पल-मोड-अवेअर बनवता येतं:

```html
<p data-simple="Dirty air costs India a lot of money every year.">
    The monetised value of premature deaths from outdoor air pollution in India was $339.4 billion in 2022 (9.5% of GDP).
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

## कव्हरेज

- पॅनेलची प्रास्ताविक परिच्छेद
- 20 ग्लोसरी व्याख्या (तांत्रिक / साधी)
- मुख्य इनसाइट बॉक्सेस, अलर्ट बॉक्सेस, पुल-कोट्स
- बजेट, पॉलिसी, आरोग्य, मुले, इनडोअर, कायदेशीर, ॲक्शन पॅनेल्स

### साधा मजकूर जोडणे

1. `index.html` मधील घटक शोधा
2. `data-simple="तुमची साध्या भाषेतील आवृत्ती येथे"` जोडा
3. विशेष अक्षरांसाठी HTML एन्टिटीज वापरा: `&lt;strong&gt;`, `&amp;`
4. १२ वर्षांच्या मुलासाठी लिहा: लहान वाक्ये, कोणतेही ॲक्रोनिम्स नाहीत, ठोस उदाहरणे
5. तोच अर्थ ठेवा — भाषा सोपी करा, आशय नाही

### मार्गदर्शक तत्त्वे
| तांत्रिक | सोपे |
|-----------|--------|
| 60 ug/m3 PM2.5 concentration | 60 प्रदूषण पातळी (WHO ची वार्षिक मार्गदर्शक तत्त्वे 5 आहेत; भारताची वार्षिक मर्यादा 40 आहे) |
| GEMM mortality model | प्रदूषणामुळे किती लोकांचा मृत्यू होतो याचा अंदाज लावणारे एक सूत्र |
| source apportionment studies | प्रदूषणाचे कारण काय आहे यावरील संशोधन |
| cost-effectiveness analysis | पैसे योग्य ठिकाणी खर्च झाले आहेत की नाही हे तपासणे |
