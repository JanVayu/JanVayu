# परफॉर्मन्स रोडमॅप

हा पृष्ठ JanVayu च्या मोबाईल-परफॉर्मन्स कामासाठी नियोजित दृष्टिकोनाचे दस्तऐवजीकरण करतो — जो v26.5.4 (Lighthouse CI + बजेट कॉन्फिग) मध्ये तयार केला गेला आहे, आणि प्रत्यक्ष रिफॅक्टरिंग एका स्वतंत्र सायकलमध्ये प्रलंबित आहे.

[issue #3](https://github.com/JanVayu/JanVayu/issues/3) मध्ये ट्रॅक केले आहे.

---

## सद्यस्थिती (मे 2026)

- सिंगल `index.html`, ~990 KB मिनिफाईड.
- Chart.js 4.x (~70 KB gzipped) आणि Leaflet 1.9 + leaflet.heat (~50 KB gzipped) पृष्ठाच्या वरच्या बाजूला `defer` सह लोड केले जातात. ते पार्सिंग किंवा फर्स्ट पेंटला अडथळा आणत नाहीत, परंतु ते प्रत्येक भेटीत ~120 KB बँडविड्थ वापरतात, जरी बहुतांश सेशन्समध्ये Trends किंवा Live Map पॅनेल्स कधीही उघडले जात नाहीत.
- CSS `mask-image` द्वारे Sargam Icons — कोणतेही आयकॉन फॉन्ट डाउनलोड नाही.
- सर्व्हिस वर्कर (`sw.js`) शेल + शेवटचा ज्ञात AQI कॅशे करतो.
- Netlify डीफॉल्टद्वारे Brotli कॉम्प्रेशन अपेक्षित आहे (अद्याप पडताळणी झालेली नाही; खालील curl चाचणी पहा).

> **अपडेट 2 ऑक्टोबर 2026:** वरील मुद्दे मे 2026 च्या नोंदी आहेत आणि आता बदलले आहेत. `index.html` आता सुमारे 621 KB आहे, ज्यामध्ये `styles.css` आणि `app.js` स्वतंत्र फाइल्स म्हणून आहेत. Chart.js आणि Leaflet आता पृष्ठाच्या वरच्या बाजूला लोड केले जात नाहीत: v26.5.6 द्वारे लेझी-लोडिंग शिप केले गेले आहे (`app.js` मधील `ensureChartJs()` / `ensureLeaflet()`, लेझी-लोड केलेल्या स्क्रिप्ट्सवर SRI हॅशसह), त्यामुळे खालील विभाग 1 मधील नियोजित रिफॅक्टरिंग पूर्ण झाले आहे. इनलाइन CSS आता एक क्रिटिकल-CSS सबसेट आहे, बाकी `/styles.css` मध्ये आहे (पहा [Frontend Stack](../tech-stack/frontend.md)), त्यामुळे विभाग 2 मध्ये वर्णन केलेला ~85 KB इनलाइन ब्लॉक आता अस्तित्वात नाही.

## Lighthouse बजेट (`.lighthouserc.json`)

| मेट्रिक | लक्ष्य | सद्यस्थिती |
|---|---|---|
| परफॉर्मन्स स्कोअर | ≥ 0.60 | अद्याप CI अंतर्गत मोजले नाही |
| ॲक्सेसिबिलिटी स्कोअर | ≥ 0.85 | पहा [issue #4](https://github.com/JanVayu/JanVayu/issues/4) |
| बेस्ट प्रॅक्टिसेस स्कोअर | ≥ 0.85 | अद्याप मोजले नाही |
| SEO स्कोअर | ≥ 0.90 | बहुधा पास होत आहे (प्रति-प्रदूषक पृष्ठांवर schema.org JSON-LD आहे) |
| फर्स्ट कंटेंटफुल पेंट | ≤ 3,000 ms | डेस्कटॉपवर बहुधा पास होत आहे, 3G वर अज्ञात |
| लार्जेस्ट कंटेंटफुल पेंट | ≤ 4,500 ms | 3G वर बहुधा फेल होत आहे |
| टोटल ब्लॉकिंग टाइम | ≤ 600 ms | 3G वर बहुधा फेल होत आहे |
| क्युम्युलेटिव्ह लेआउट शिफ्ट | ≤ 0.15 | बहुधा पास होत आहे |

जोपर्यंत सातत्याने पूर्ण होत नाहीत तोपर्यंत असर्शन्स `warn` असतात; Lighthouse CI रन अंतर्गत बजेट पूर्ण झाल्यावर `error` मध्ये बदला.

## नियोजित रिफॅक्टरिंग (एक स्वतंत्र सायकल)

### 1. Chart.js आणि Leaflet लेझी-लोड करा

ईगर `<script src="...chart.js" defer>` आणि `<script src="...leaflet.js" defer>` टॅग्स काढून टाका. त्यांच्या जागी एक लहान लोडर पॅटर्न वापरा:
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

त्यानंतर चार्ट किंवा मॅप वापरणाऱ्या प्रत्येक पॅनेलमध्ये, init कॉलच्या आधी हे जोडा:

```js
async function initTrendsCharts() {
  await ensureChartJs();
  // existing chart-init code unchanged
}

async function initMap() {
  await ensureLeaflet();
  // existing map-init code unchanged
}
```

`initTrendsCharts` / `initMap` ला कॉल करणाऱ्या फंक्शन्सना `await` (किंवा `.then()`) ची आवश्यकता आहे. सध्याचे सर्व कॉल साइट्स `loadPanel(panelId)` च्या आत आहेत, जे क्लिक केल्यावर रन होते, त्यामुळे तिथे `async` अपग्रेड करणे सुरक्षित आहे.

**अपेक्षित बचत:** ट्रेंड्स किंवा लाईव्ह मॅप न उघडणाऱ्या सेशन्ससाठी (बहुधा ७०% पेक्षा जास्त सेशन्स) पहिल्या पेंटवर ~१२० KB. मोबाईल FCP सुधारणा: 3G वर ~६०० ms.

### २. नॉन-क्रिटिकल CSS ला defer करा

सध्याचा इनलाईन CSS ब्लॉक ~८५ KB आहे. त्यातील बहुतांश भाग पॅनेल-विशिष्ट स्टायलिंगचा आहे, जो पहिल्या पेंटसाठी आवश्यक नाही. याची खालीलप्रमाणे विभागणी करा:

- **क्रिटिकल** (~१० KB): हिरो, टॉप-नॅव्ह, डॅशबोर्ड क्विक-लिंक ग्रिड. इनलाईन.
- **नॉन-क्रिटिकल** (~७५ KB): बाकी सर्व काही. `assets/main.css` मध्ये हलवा आणि `<link rel="preload" as="style" onload="this.rel='stylesheet'">` द्वारे लोड करा.

**अपेक्षित बचत:** Brotli नंतर पहिल्या पेंटवर ~२० KB; मोबाईल FCP सुधारणा: ~२०० ms.

### ३. Brotli पडताळणी

हे Netlify च्या डिफॉल्ट हेडर्सद्वारे आधीच सक्रिय आहे, पण पडताळून पाहणे योग्य ठरेल:

```bash
curl -H "Accept-Encoding: br" -I https://www.janvayu.in/ | grep -i content-encoding
# Expected: content-encoding: br
```

जर त्याऐवजी `gzip` रिटर्न होत असेल, तर `netlify.toml` मध्ये स्पष्ट हेडर्स सेट करा.

### ४. इमेज / आयकॉन ऑप्टिमायझेशन
- `og-image.png` येथे 39 KB म्हणून रेकॉर्ड केले गेले होते; 2 ऑक्टोबर 2026 रोजी `ls -l` 133,256 बाइट्स (सुमारे 130 KB) दर्शवते, जे ठीक आहे, पण ते सध्याचे आकडे दर्शवते की नाही ते तपासा (ही वेगळी समस्या आहे, [audit deferred items](../../docs/wiki/Roadmap.md) पहा).
- `favicon.svg` 1.5 KB आहे — ठीक आहे.
- mask-image द्वारे Sargam Icons — आधीच उत्तम आहे.

### 5. मोबाईल रिस्पॉन्सिव्हनेस ऑडिट

[issue #33](https://github.com/JanVayu/JanVayu/issues/33) मध्ये स्वतंत्रपणे ट्रॅक केले आहे. हे Lighthouse ॲक्सेसिबिलिटी + बेस्ट-प्रॅक्टिसेस स्कोअरमध्ये योगदान देते, पण हे एक वेगळे काम आहे.

---

## कामाचा क्रम

1. **बेसलाइन Lighthouse रन करा** — `gh workflow run lighthouse.yml` आणि आकडे कॅप्चर करा.
2. **Chart.js + Leaflet लाझी-लोड करा** — सर्वात मोठा सिंगल फायदा (अंदाजे ~600 ms FCP).
3. **पुन्हा मोजमाप करा** — पुढे जाण्यापूर्वी 600 ms सुधारणा खरी आहे याची खात्री करा.
4. **CSS स्प्लिट** — दुसरा सर्वात मोठा फायदा (~200 ms).
5. Lighthouse पुढच्या वेळी जे काही फ्लॅग करेल त्यावर **पुनरावृत्ती करा**: न वापरलेले JS, लेआउट शिफ्ट, इत्यादी.

जोपर्यंत बजेट सातत्याने पूर्ण होत नाही, तोपर्यंत `.lighthouserc.json` ॲसर्शन `warn` वर ठेवा. `main` वर सलग तीन ग्रीन रन झाल्यानंतर, perf-score आणि FCP ॲसर्शन `error` वर स्विच करा.
