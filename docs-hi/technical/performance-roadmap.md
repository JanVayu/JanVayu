# परफॉरमेंस रोडमैप

यह पेज JanVayu के मोबाइल-परफॉरमेंस काम के लिए प्लान किए गए तरीके को डॉक्यूमेंट करता है — इसे v26.5.4 (Lighthouse CI + बजट कॉन्फ़िग) में तैयार किया गया है, और असली रिफैक्टरिंग के लिए एक अलग साइकिल का इंतज़ार है।

[issue #3](https://github.com/JanVayu/JanVayu/issues/3) में ट्रैक किया गया है।

---

## मौजूदा स्थिति (मई 2026)

- सिंगल `index.html`, ~990 KB मिनिफाइड।
- Chart.js 4.x (~70 KB गज़िप्ड) और Leaflet 1.9 + leaflet.heat (~50 KB गज़िप्ड) पेज के टॉप पर `defer` के साथ लोड होते हैं। ये पार्सिंग या फर्स्ट पेंट को ब्लॉक नहीं करते, लेकिन हर विज़िट पर ~120 KB बैंडविड्थ ज़रूर खर्च करते हैं, भले ही ज़्यादातर सेशंस कभी Trends या Live Map पैनल नहीं खोलते।
- CSS `mask-image` के ज़रिए Sargam Icons — कोई आइकन फ़ॉन्ट डाउनलोड नहीं।
- सर्विस वर्कर (`sw.js`) शेल + आखिरी-ज्ञात AQI को कैश करता है।
- Netlify डिफ़ॉल्ट के ज़रिए Brotli कंप्रेसन की उम्मीद है (अभी तक वेरिफाई नहीं हुआ है; नीचे curl टेस्ट देखें)।

> **अपडेट 2 अक्टूबर 2026:** ऊपर दिए गए बुलेट पॉइंट्स मई 2026 के रिकॉर्ड हैं और अब बदल चुके हैं। `index.html` अब लगभग 621 KB है, जिसमें `styles.css` और `app.js` अलग-अलग फ़ाइलों के रूप में हैं। Chart.js और Leaflet अब पेज के टॉप पर लोड नहीं होते: v26.5.6 में लेज़ी-लोडिंग शिप कर दी गई है (`app.js` में `ensureChartJs()` / `ensureLeaflet()`, लेज़ी-लोडेड स्क्रिप्ट्स पर SRI हैशेस के साथ), इसलिए नीचे सेक्शन 1 में प्लान किया गया रिफैक्टर हो चुका है। इनलाइन CSS अब एक क्रिटिकल-CSS सबसेट है, बाकी `/styles.css` में है (देखें [Frontend Stack](../tech-stack/frontend.md)), इसलिए सेक्शन 2 में बताया गया ~85 KB इनलाइन ब्लॉक अब मौजूद नहीं है।

## Lighthouse बजट (`.lighthouserc.json`)

| मेट्रिक | टारगेट | मौजूदा स्थिति |
|---|---|---|
| परफॉरमेंस स्कोर | ≥ 0.60 | अभी तक CI के तहत मापा नहीं गया |
| एक्सेसिबिलिटी स्कोर | ≥ 0.85 | देखें [issue #4](https://github.com/JanVayu/JanVayu/issues/4) |
| बेस्ट प्रैक्टिसेस स्कोर | ≥ 0.85 | अभी तक मापा नहीं गया |
| SEO स्कोर | ≥ 0.90 | शायद पास हो रहा है (प्रति-पॉल्यूटेन्ट पेजों में schema.org JSON-LD है) |
| फर्स्ट कंटेंटफुल पेंट | ≤ 3,000 ms | डेस्कटॉप पर शायद पास हो रहा है, 3G पर अनजान |
| लार्जेस्ट कंटेंटफुल पेंट | ≤ 4,500 ms | 3G पर शायद फेल हो रहा है |
| टोटल ब्लॉकिंग टाइम | ≤ 600 ms | 3G पर शायद फेल हो रहा है |
| क्यूमुलेटिव लेआउट शिफ्ट | ≤ 0.15 | शायद पास हो रहा है |

जब तक लगातार पूरा न हो जाए, असर्शन्स `warn` होते हैं; Lighthouse CI रन के तहत बजट पूरा होने पर `error` में बदल दिए जाते हैं।

## प्लान किया गया रिफैक्टर (सिंगल डेडिकेटेड साइकिल)

### 1. Chart.js और Leaflet को लेज़ी-लोड करें

ईगर `<script src="...chart.js" defer>` और `<script src="...leaflet.js" defer>` टैग्स को हटा दें। इनकी जगह एक छोटा लोडर पैटर्न इस्तेमाल करें:
```js
let _chartJsLoaded = null;
async function ensureChartJs() {
  if (window.Chart) return;
  if (_chartJsLoaded) return _chartJsLoaded;
  _chartJsLoaded = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js';
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return _chartJsLoaded;
}

let _leafletLoaded = null;
async function ensureLeaflet() {
  if (window.L?.heatLayer) return;
  if (_leafletLoaded) return _leafletLoaded;
  _leafletLoaded = (async () => {
    await loadCSS('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
    await loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
    await loadScript('https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js');
  })();
  return _leafletLoaded;
}
```

फिर हर उस पैनल में जो चार्ट या मैप का उपयोग करता है, init कॉल के आगे `await` लगाएँ:

```js
async function initTrendsCharts() {
  await ensureChartJs();
  // मौजूदा चार्ट-इनिट कोड बिना बदले
}

async function initMap() {
  await ensureLeaflet();
  // मौजूदा मैप-इनिट कोड बिना बदले
}
```

`initTrendsCharts` / `initMap` को कॉल करने वाले फ़ंक्शन्स में `await` (या `.then()`) का होना ज़रूरी है। सभी मौजूदा कॉल साइट्स `loadPanel(panelId)` के अंदर हैं, जो क्लिक करने पर रन होता है, इसलिए वहाँ `async` में अपग्रेड करना सुरक्षित है।

**अपेक्षित बचत:** उन सेशंस के लिए फर्स्ट पेंट पर ~120 KB जो Trends या Live Map नहीं खोलते (संभवतः 70%+ सेशंस)। 3G पर मोबाइल FCP में सुधार: ~600 ms।

### 2. नॉन-क्रिटिकल CSS को डेफ़र करें

वर्तमान इनलाइन CSS ब्लॉक ~85 KB का है। इसमें से ज़्यादातर पैनल-विशिष्ट स्टाइलिंग है जिसकी फर्स्ट पेंट के लिए ज़रूरत नहीं है। इसे इस तरह बाँटें:

- **क्रिटिकल** (~10 KB): हीरो, टॉप-नेव, डैशबोर्ड क्विक-लिंक ग्रिड। इनलाइन रखें।
- **नॉन-क्रिटिकल** (~75 KB): बाकी सब कुछ। इसे `assets/main.css` में ले जाएँ और `<link rel="preload" as="style" onload="this.rel='stylesheet'">` के साथ लोड करें।

**अपेक्षित बचत:** Brotli के बाद फर्स्ट पेंट पर ~20 KB; मोबाइल FCP में सुधार: ~200 ms।

### 3. Brotli वेरिफिकेशन

Netlify के डिफ़ॉल्ट हेडर के ज़रिए यह पहले से ही सक्रिय है, लेकिन इसे वेरिफाई करना ज़रूरी है:

```bash
curl -H "Accept-Encoding: br" -I https://www.janvayu.in/ | grep -i content-encoding
# अपेक्षित: content-encoding: br
```

अगर इसके बजाय `gzip` रिटर्न होता है, तो `netlify.toml` में स्पष्ट हेडर सेट करें।

### 4. इमेज / आइकन ऑप्टिमाइज़ेशन
- `og-image.png` यहाँ 39 KB के रूप में रिकॉर्ड किया गया था; 2 अक्टूबर 2026 को `ls -l` 133,256 बाइट्स (लगभग 130 KB) दिखाता है, जो ठीक है, लेकिन यह पक्का करें कि यह मौजूदा नंबर दिखाए (यह एक अलग मुद्दा है, [audit deferred items](../../docs/wiki/Roadmap.md) देखें)।
- `favicon.svg` 1.5 KB है — ठीक है।
- mask-image के ज़रिए Sargam Icons — पहले से ही सबसे बढ़िया स्थिति में है।

### 5. मोबाइल रिस्पॉन्सिवनेस ऑडिट

इसे [issue #33](https://github.com/JanVayu/JanVayu/issues/33) में अलग से ट्रैक किया गया है। यह Lighthouse accessibility + best-practices स्कोर में योगदान देता है, लेकिन यह एक अलग वर्कस्ट्रीम है।

---

## काम करने का क्रम

1. **बेसलाइन Lighthouse रन करें** — `gh workflow run lighthouse.yml` और नंबर कैप्चर करें।
2. **Chart.js + Leaflet को लेज़ी-लोड करें** — सबसे बड़ा सिंगल फायदा (अनुमानित ~600 ms FCP)।
3. **फिर से मापें** — आगे बढ़ने से पहले यह पक्का करें कि 600 ms का सुधार असली है।
4. **CSS स्प्लिट** — दूसरा सबसे बड़ा फायदा (~200 ms)।
5. **लगातार सुधार करें** — Lighthouse आगे जो भी फ्लैग करे: अनयूज्ड JS, लेआउट शिफ्ट, आदि।

जब तक बजट लगातार पूरा न हो जाए, `.lighthouserc.json` असर्शन्स को `warn` पर रखें। `main` पर लगातार तीन ग्रीन रन के बाद, perf-score और FCP असर्शन्स को `error` में बदल दें।
