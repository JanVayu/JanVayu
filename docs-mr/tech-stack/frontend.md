# Frontend स्टॅक

## HTML/CSS/JavaScript (Vanilla)

संपूर्ण frontend एक `index.html` फाइल आहे — सध्या ~11,300 ओळी — इनलाइन `<style>` आणि `<script>` blocks सह. कोणतीही वेगळी `.css` किंवा `.js` फाइल नाही.

### सर्व काही इनलाइन का?

1. **एकच HTTP विनंती** — ब्राउझर एक फाइल आणतो आणि त्यात सर्व काही असते
2. **बिल्ड स्टेप नाही** — `index.html` हे deploy artefact आहे
3. **योगदानकर्ता-अनुकूल** — "ब्राउझरमध्ये `index.html` उघडा" हा संपूर्ण dev सेटअप आहे
4. **हमी सुसंगतता** — CSS/JS लोड ऑर्डर समस्या नाहीत

### CSS आर्किटेक्चर

- थीमिंगसाठी **CSS Custom Properties** (light/dark mode toggle)
- **कोणता preprocessor नाही** (Sass, Less, किंवा PostCSS नाही)
- media queries सह **Mobile-first** responsive design
- **WCAG AA** रंग कॉन्ट्रास्ट अनुपालन

प्रमुख variables:

```css
:root {
  --primary: #2563eb;
  --bg: #ffffff;
  --text: #1e293b;
  --card-bg: #f8fafc;
  --border: #e2e8f0;
}

[data-theme="dark"] {
  --bg: #0f172a;
  --text: #e2e8f0;
  --card-bg: #1e293b;
  --border: #334155;
}
```

### JavaScript पॅटर्न

- **ES2020** — ब्राउझर सुसंगतता राखण्यासाठी नवीन वैशिष्ट्ये नाहीत
- सर्व HTTP कॉलसाठी **Fetch API** (axios नाही)
- `document.getElementById` / `querySelector` द्वारे **DOM manipulation**
- **कोणता module bundler नाही** — सर्व JS `<script>` tags मध्ये आहे
- लाइव्ह AQI डेटासाठी **10-मिनिट ऑटो-रिफ्रेश**

---

## Chart.js

**आवृत्ती:** Latest stable (CDN द्वारे लोड)
**यासाठी वापरले:**
- Metro विरुद्ध Regional AQI तुलना बार चार्ट
- PM2.5 ट्रेंड लाइन्स
- आरोग्य प्रभाव डेटा व्हिज्युअलायझेशन
- हंगामी baseline तुलना

**Chart.js का:**
- लहान footprint (~60 KB gzipped)
- बिल्ड स्टेपशिवाय काम करते (CDN script tag)
- Canvas-based rendering (मोबाइलवर कार्यक्षम)
- अंगभूत responsive/accessibility वैशिष्ट्ये

---

## Leaflet.js + OpenStreetMap

**आवृत्ती:** Latest stable (CDN द्वारे लोड)
**यासाठी वापरले:**
- AQI स्टेशन मार्कर्ससह 40+ भारतीय शहरांचा इंटरॅक्टिव्ह नकाशा
- AQI तीव्रतेनुसार रंगकोडित मार्कर्स (हिरवा/पिवळा/नारंगी/लाल/जांभळा)
- क्लिक-टू-व्ह्यू स्टेशन तपशील

**Leaflet + OSM का:**
- मोफत आणि ओपन सोर्स (Google Maps API key आवश्यक नाही)
- हलके (~40 KB gzipped)
- OpenStreetMap टाइल्स कोणत्याही स्केलवर मोफत
- कॅश केलेल्या टाइल्ससह ऑफलाइन काम करते

---

## बहुभाषिक समर्थन

JanVayu क्लायंट-साइड भाषा toggle द्वारे 5 भाषांना समर्थन देतो:

| भाषा | कोड |
|----------|------|
| English | `en` |
| Hindi | `hi` |
| Tamil | `ta` |
| Marathi | `mr` |
| Bengali | `bn` |

**अंमलबजावणी:** भाषा strings JS objects म्हणून साठवले जातात आणि toggle वर DOM elements मध्ये swap केले जातात. कोणतीही i18n library नाही — फक्त साधी key-value lookup.

---

## सुलभता

- सर्व interactive elements साठी keyboard navigation
- जिथे semantic HTML अपुरा आहे तिथे ARIA roles
- WCAG AA पूर्ण करणारा रंग कॉन्ट्रास्ट (मजकुरासाठी 4.5:1)
- सर्व images वर alt text
- सर्व inputs वर form labels
- Interactive elements वर focus indicators
