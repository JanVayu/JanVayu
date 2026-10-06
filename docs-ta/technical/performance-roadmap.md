# செயல்திறன் வரைபடம்

இந்த பக்கம் JanVayu-வின் மொபைல்-செயல்திறன் பணிக்கான திட்டமிடப்பட்ட அணுகுமுறையை ஆவணப்படுத்துகிறது — இது v26.5.4-ல் (Lighthouse CI + budget config) உருவாக்கப்பட்டுள்ளது, உண்மையான மறுசீரமைப்பு அதற்கென தனி சுழற்சிக்காக காத்திருக்கிறது.

[issue #3](https://github.com/JanVayu/JanVayu/issues/3)-ல் கண்காணிக்கப்படுகிறது.

---

## தற்போதைய நிலை (மே 2026)

- ஒற்றை `index.html`, ~990 KB minified.
- Chart.js 4.x (~70 KB gzipped) மற்றும் Leaflet 1.9 + leaflet.heat (~50 KB gzipped) ஆகியவை பக்கத்தின் மேலேய `defer` உடன் ஏற்றப்படுகின்றன. அவை parsing அல்லது first paint-ஐ தடுக்கவில்லை, ஆனால் பெரும்பாலான செஷன்கள் Trends அல்லது Live Map பேனல்களை ஒருபோதும் திறக்கவில்லை என்றாலும், ஒவ்வொரு வருகையிலும் ~120 KB அலைவரிசையை (bandwidth) அவை பயன்படுத்துகின்றன.
- CSS `mask-image` மூலம் Sargam Icons — ஐகான் ஃபான்ட் பதிவிறக்கம் இல்லை.
- Service worker (`sw.js`) ஷெல் + கடைசியாக தெரிந்த AQI-ஐ கேச் (cache) செய்கிறது.
- Netlify இயல்புநிலை மூலம் Brotli கம்ப்ரெஷன் எதிர்பார்க்கப்படுகிறது (இன்னும் சரிபார்க்கப்படவில்லை; கீழே உள்ள curl சோதனையைப் பார்க்கவும்).

> **Update 2 Oct 2026:** மே 2026-ன் பதிவாக இருந்த மேலே உள்ள குறிப்புகள் மாறிவிட்டன. `index.html` இப்போது சுமார் 621 KB ஆக உள்ளது, `styles.css` மற்றும் `app.js` தனித்தனி கோப்புகளாக உள்ளன. Chart.js மற்றும் Leaflet இனி பக்கத்தின் மேலேய ஏற்றப்படுவதில்லை: v26.5.6 மூலம் லேஸி-லோடிங் (lazy-loading) அனுப்பப்பட்டுள்ளது (`app.js`-ல் `ensureChartJs()` / `ensureLeaflet()`, லேஸி-லோட் செய்யப்பட்ட ஸ்கிரிப்ட்களில் SRI ஹாஷ்கள் உள்ளன), எனவே கீழே உள்ள பிரிவு 1-ல் திட்டமிடப்பட்ட மறுசீரமைப்பு முடிந்துவிட்டது. இன்லைன் CSS இப்போது ஒரு critical-CSS துணைக்குழுவாக உள்ளது, மீதமுள்ளவை `/styles.css`-ல் உள்ளன ([Frontend Stack](../tech-stack/frontend.md) பார்க்கவும்), எனவே பிரிவு 2-ல் விவரிக்கப்பட்ட ~85 KB இன்லைன் பிளாக் இப்போது இல்லை.

## Lighthouse பட்ஜெட் (`.lighthouserc.json`)

| அளவீடு | இலக்கு | தற்போதைய நிலை |
|---|---|---|
| செயல்திறன் மதிப்பெண் | ≥ 0.60 | CI-ன் கீழ் இன்னும் அளவிடப்படவில்லை |
| அணுகல்தன்மை மதிப்பெண் | ≥ 0.85 | [issue #4](https://github.com/JanVayu/JanVayu/issues/4) பார்க்கவும் |
| சிறந்த நடைமுறைகள் மதிப்பெண் | ≥ 0.85 | இன்னும் அளவிடப்படவில்லை |
| SEO மதிப்பெண் | ≥ 0.90 | தேர்ச்சி பெற வாய்ப்புள்ளது (ஒரு-மாசுபொருள் பக்கங்களில் schema.org JSON-LD உள்ளது) |
| First Contentful Paint | ≤ 3,000 ms | டெஸ்க்டாப்பில் தேர்ச்சி பெற வாய்ப்புள்ளது, 3G-ல் தெரியவில்லை |
| Largest Contentful Paint | ≤ 4,500 ms | 3G-ல் தோல்வியடைய வாய்ப்புள்ளது |
| Total Blocking Time | ≤ 600 ms | 3G-ல் தோல்வியடைய வாய்ப்புள்ளது |
| Cumulative Layout Shift | ≤ 0.15 | தேர்ச்சி பெற வாய்ப்புள்ளது |

தொடர்ந்து இலக்கை எட்டும் வரை கூற்றுகள் `warn` ஆக இருக்கும்; Lighthouse CI ரன் கீழ் பட்ஜெட் எட்டப்பட்டவுடன் `error` ஆக மாற்றப்படும்.

## திட்டமிடப்பட்ட மறுசீரமைப்பு (ஒற்றை பிரத்யேக சுழற்சி)

### 1. Chart.js மற்றும் Leaflet-ஐ லேஸி-லோட் செய்தல்

ஆர்வமுள்ள `<script src="...chart.js" defer>` மற்றும் `<script src="...leaflet.js" defer>` குறிச்சொற்களை அகற்றவும். அதற்கு பதிலாக ஒரு சிறிய லோடர் பேட்டர்னைப் பயன்படுத்தவும்:
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

பிறகு வரைபடங்கள் அல்லது மேப்பை பயன்படுத்தும் ஒவ்வொரு பேனலிலும், init call-க்கு முன்னால் இதைச் சேர்க்கவும்:

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

`initTrendsCharts` / `initMap` ஆகியவற்றை call செய்யும் functions-க்கு `await` (அல்லது `.then()`) தேவைப்படும். தற்போதைய call sites அனைத்தும் click-ல் இயங்கும் `loadPanel(panelId)`-க்குள் உள்ளன, எனவே அங்கு `async` upgrade செய்வது பாதுகாப்பானது.

**எதிர்பார்க்கப்படும் சேமிப்பு:** Trends அல்லது Live Map-ஐ திறக்காத sessions-க்கு முதல் paint-ல் ~120 KB (பெரும்பாலும் 70%+ sessions). Mobile FCP முன்னேற்றம்: 3G-ல் ~600 ms.

### 2. Non-critical CSS-ஐ defer செய்தல்

தற்போதைய inline CSS block ~85 KB ஆக உள்ளது. இதில் பெரும்பாலானவை முதல் paint-க்குத் தேவையில்லாத panel-specific styling ஆகும். இதை இவ்வாறு பிரிக்கவும்:

- **Critical** (~10 KB): hero, top-nav, dashboard quick-link grid. Inline.
- **Non-critical** (~75 KB): மற்ற அனைத்தும். இதை `assets/main.css`-க்கு மாற்றி, `<link rel="preload" as="style" onload="this.rel='stylesheet'">` மூலம் load செய்யவும்.

**எதிர்பார்க்கப்படும் சேமிப்பு:** Brotli-க்குப் பிறகு முதல் paint-ல் ~20 KB; mobile FCP முன்னேற்றம்: ~200 ms.

### 3. Brotli சரிபார்த்தல்

Netlify default headers மூலம் ஏற்கனவே செயல்படுத்தப்பட்டுள்ளது, ஆனால் சரிபார்ப்பது நல்லது:

```bash
curl -H "Accept-Encoding: br" -I https://www.janvayu.in/ | grep -i content-encoding
# Expected: content-encoding: br
```

`gzip` என திரும்ப வந்தால், `netlify.toml`-ல் explicit headers-ஐ அமைக்கவும்.

### 4. Image / icon optimisation
- `og-image.png` இங்கே 39 KB எனப் பதிவு செய்யப்பட்டது; 2 Oct 2026 அன்று `ls -l` 133,256 bytes (சுமார் 130 KB) எனக் காட்டுகிறது, இது பரவாயில்லை, ஆனால் அது தற்போதைய எண்களைக் காட்டுகிறதா என்பதைச் சரிபார்க்கவும் (தனிப் பிரச்சினை, [audit deferred items](../../docs/wiki/Roadmap.md) பார்க்கவும்).
- `favicon.svg` 1.5 KB — பரவாயில்லை.
- mask-image மூலம் Sargam Icons — ஏற்கனவே சிறப்பாக உள்ளது.

### 5. மொபைல் ரெஸ்பான்சிவ்னஸ் தணிக்கை

[issue #33](https://github.com/JanVayu/JanVayu/issues/33)-இல் தனியாகக் கண்காணிக்கப்படுகிறது. இது Lighthouse அணுகல்தன்மை + சிறந்த-பயிற்சிகள் மதிப்பெண்களுக்குப் பங்களிக்கிறது, ஆனால் இது வேறுபட்ட பணிப்பாய்வாகும்.

---

## செயல்படும் வரிசை

1. **அடிப்படை Lighthouse-ஐ இயக்குதல்** — `gh workflow run lighthouse.yml` மற்றும் எண்களைப் பதிவு செய்யவும்.
2. **Chart.js + Leaflet-ஐ லேஸியாக லோட் செய்தல்** — மிகப்பெரிய ஒற்றை வெற்றி (மதிப்பிடப்பட்ட ~600 ms FCP).
3. **மீண்டும் அளவிடுதல்** — முன்னேறிச் செல்வதற்கு முன் 600 ms முன்னேற்றம் உண்மையானது என்பதை உறுதிப்படுத்தவும்.
4. **CSS பிரித்தல்** — இரண்டாவது மிகப்பெரிய வெற்றி (~200 ms).
5. **Lighthouse சுட்டிக்காட்டும் அடுத்த விஷயங்களில் மீண்டும் செய்தல்**: பயன்படுத்தப்படாத JS, லேஅவுட் ஷிஃப்ட் போன்றவை.

இலக்கு தொடர்ந்து எட்டப்படும் வரை, `.lighthouserc.json` கூற்றுகளை `warn` நிலையிலேயே வைக்கவும். `main` பிரிவில் தொடர்ந்து மூன்று முறை வெற்றிகரமாக இயங்கிய பிறகு, perf-score மற்றும் FCP கூற்றுகளை `error` நிலைக்கு மாற்றவும்.
