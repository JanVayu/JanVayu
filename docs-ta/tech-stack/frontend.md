# Frontend Stack
## HTML/CSS/JavaScript (Vanilla)
முன்புறம் (frontend) எந்த build step மற்றும் bundler-உம் இல்லாமல் vanilla HTML, CSS மற்றும் JavaScript ஆக உள்ளது. இது **ஒற்றை கோப்பு அல்ல**, மேலும் நீண்ட காலமாக இது ஒற்றை கோப்பு என்று இந்தப் பக்கம் கூறியதால் யாரையாவது தவறாக வழிநடத்த வாய்ப்புள்ளது: `index.html` சுமார் 6,500 வரிகள், `styles.css` சுமார் 3,800 வரிகள், `app.js` சுமார் 10,200 வரிகள் உள்ளன, மேலும் `panels/` இல் 19 panel fragments உள்ளன, அவை runtime-இல் பக்கத்தில் ஏற்றப்படுகின்றன.
### இதன் அமைப்பு
| File | அது என்ன |
|---|---|
| `index.html` | Single-page app: bar, panel container, மற்றும் முதல் paint-க்காக `styles.css`-இன் inline **critical-CSS** துணைக்குழு |
| `styles.css` | Design system. ஒவ்வொரு token, இரண்டு themes, மற்றும் பகிரப்பட்ட components (`.bar`, `.ctl`, `.card`, `.container`) |
| `app.js` | Panel routing, தரவு பெறுதல் (data fetching), charts, role மற்றும் language machinery |
| `js/chrome.js` | Theme preference மற்றும் SPA அல்லாத பக்கங்களுக்கான சுருக்கப்பட்ட bar |
| `js/air-sources.js` | ஒரு இடத்தில் உள்ள காற்றின் நிலையைப் பற்றி என்ன சொல்வது என்பதை முடிவு செய்யும் ஒரே இடம்: ஒரு live WAQI station, பின்னர் CPCB-இன் தினசரி bulletin, பின்னர் ஒரு model estimate, ஒவ்வொன்றும் label செய்யப்பட்டுள்ளது |
| `panels/*.html` | `index.html`-இல் செலுத்தப்படும் fragments; அவை அதன் styling-ஐ inherit செய்கின்றன |
| Standalone pages | `/pm25/`, `/try.html`, `/docs/`, `/blog/`, `/ask/`, `/bulletins/`, `/delhi/`, walkthrough, embeds, உருவாக்கப்பட்ட blog post பக்கங்கள் மற்றும் பிற |
**ஒவ்வொரு standalone பக்கமும் `styles.css`-ஐ ஏற்றுகிறது.** `scripts/check-design-system.py` 21 November 2026 அன்று அவற்றில் 78-ஐக் கணக்கிட்டது (விதி அறிமுகப்படுத்தப்பட்டபோது 19 ஆக இருந்தது). 2026-09-22 வரை அது உண்மையாக இருக்கவில்லை: ஒவ்வொன்றும் நிலையான light-theme literals-உடன் அதே token பெயர்களை மறுவரையறை செய்யும் தனிப்பட்ட `<style>` block-ஐக் கொண்டிருந்தது, எனவே ஒரு token மாற்றம் ஒரு பக்கத்தை அடைந்தது, மற்ற எந்தப் பக்கங்களும் theme control-ஐப் பின்பற்றவில்லை.
மீண்டும் விடுபடும் ஒரு பக்கத்தில் `scripts/check-design-system.py` தோல்வியடைகிறது.
### ஏன் build step இல்லை
1. **Build step இல்லை** — repo-வே deploy artefact
2. **Contributor-friendly** — `python3 -m http.server` என்பதே முழு dev setup
3. **Source மற்றும் output-க்கு இடையே காலாவதியாக எதுவும் இல்லை**
இதற்கான செலவு என்னவென்றால், cache-busting கைமுறையாக செய்யப்பட வேண்டும். `/styles.css` மற்றும் `/app.js` ஆகியவை `package.json`-ல் உள்ள பதிப்பிலிருந்து பெறப்பட்ட `?v=<stamp>` query உடன் கோரப்படுகின்றன, ஏனெனில் `sw.js` அதே-origin assets-ஐ **மறுசரிபார்ப்பு இல்லாமல் cache-first** முறையில் வழங்குகிறது. இரண்டு பாதுகாப்புகள் இதை ஒன்றாகப் பிடித்துக் கொள்கின்றன: `check-asset-stamps.py` (ஒவ்வொரு முத்திரையிடப்பட்ட URL-ம் தற்போதைய முத்திரையைக் கொண்டிருக்கும்) மற்றும் `check-asset-freshness.py` (பதிப்பு மாறாமல் இருக்கும்போது முத்திரையிடப்பட்ட எந்த கோப்பும் மாறவில்லை). முதல் பாதுகாப்பானது தேர்ச்சி பெற்றபோதும், மாறாத URL-ன் கீழ் `app.js` மாறியிருந்ததால் இரண்டாவது பாதுகாப்பானது உள்ளது.
### CSS கட்டமைப்பு
- **தனிப்பயன் பண்புகளின் மூன்று அடுக்குகள்.** ஒரு raw ramp (`--w-0`…`--w-900` வெளிச்ச neutral-களுக்கு, `--d-950`…`--d-50` இருட்டிற்கு), அதைச் சுட்டிக்காட்டும் ஒரு semantic அடுக்கு, மற்றும் semantic அடுக்கை மட்டுமே எப்போதும் குறிப்பிடும் components.
- **Preprocessor இல்லை** (Sass, Less, அல்லது PostCSS இல்லை)
- media queries உடன் **Mobile-first** responsive design
- **WCAG AA** contrast, இரண்டு theme-களிலும் ஒவ்வொரு panel மற்றும் ஒவ்வொரு பக்கத்திலும் Playwright sweep மூலம் CI-ல் கட்டுப்படுத்தப்படுகிறது
நீங்கள் எழுத வேண்டிய semantic அடுக்கு இதுதான்:
```css
:root {
  --bg: var(--paper);          /* the page */
  --bg-section: var(--warm-white);
  --bg-card: var(--w-0);
  --text: var(--ink);
  --text-2: var(--ink-secondary);
  --text-3: var(--ink-tertiary);
  --accent: var(--green-700);
  --border: var(--w-300);
}
[data-theme="dark"] {
  --bg: var(--d-950);
  --bg-section: var(--d-900);
  --bg-card: var(--d-850);
  --text: var(--d-50);
  --accent: #4ADE80;
  --border: var(--d-700);
}
```
இவற்றுடன் இணைந்து ink tokens — `--ink-red`, `--ink-blue`, `--ink-teal` மற்றும் பிற — உள்ளன, ஏனெனில் வெள்ளை நிறத்தில் text ஆகத் தெரியும் ஒரு saturated hue, `#0e0e0c`-ல் text ஆகத் தெரியாது. JavaScript-ல் ஒரு literal ஆகவோ அல்லது `style=` attribute-ஆகவோ எழுதப்பட்ட ஒரு நிறம் அது எந்த theme-ல் வந்துள்ளது என்பதை அறிய முடியாது, எனவே அதற்கு ஒரு token வழங்கப்பட்டு CSS அதை மாற்றுகிறது.
### Theming
`js/chrome.js` மூலம் அமைக்கப்பட்டு `janvayu-theme`-ன் கீழ் சேமிக்கப்படும் `<html>`-ல் உள்ள `data-theme="dark"`. ஒவ்வொரு பக்கமும் முதல் paint-க்கு முன் சேமிக்கப்பட்ட மதிப்பைச் செயல்படுத்த `<head>`-ல் ஒரு சிறிய inline script-ஐக் கொண்டுள்ளது, எனவே ஒரு பக்கம் ஒருபோதும் வெளிச்சமாகப் பதிந்து பின்னர் மாறாது. `prefers-color-scheme` block-ஐ சேர்க்க வேண்டாம்: முன்பு நான்கு பக்கங்களில் இது இருந்தது, அதாவது அவை operating system-ஐப் பின்பற்றி தளத்தின் சொந்த கட்டுப்பாட்டைப் புறக்கணித்தன.
### JavaScript Patterns
- **அதிகபட்சம் ES2022**: `eslint.config.mjs`-இல் அமைக்கப்பட்டுள்ள `ecmaVersion`
- அனைத்து HTTP அழைப்புகளுக்கும் **Fetch API** (axios இல்லை)
- `document.getElementById` / `querySelector` மூலம் **DOM கையாளுதல்**
- **Module bundler இல்லை** — அனைத்து JS-உம் `<script>` குறிச்சொற்களில் உள்ளன
- `waqi-proxy` function மூலம் பெறப்படும் நேரடி AQI தரவுகளுக்கு **10-நிமிட தானியங்கி புதுப்பிப்பு**
---
## Chart.js
**பதிப்பு:** 4.x-இல் நிலையானது (4.5.1), SRI உடன் jsDelivr-இல் இருந்து ஏற்றப்பட்டு, தேவைப்படும்போது lazy-load செய்யப்படுகிறது
**இதற்காகப் பயன்படுத்தப்படுகிறது:**
- மெட்ரோ மற்றும் பிராந்திய AQI ஒப்பீட்டு பட்டை விளக்கப்படங்கள்
- PM2.5 போக்குக் கோடுகள்
- சுகாதார பாதிப்பு தரவு காட்சிப்படுத்தல்கள்
- பருவகால அடிப்படை ஒப்பீடுகள்
**Chart.js ஏன்:**
- சிறிய அளவு (~70 KB gzipped, ~60 KB Brotli)
- build step இல்லாமல் வேலை செய்யும் (CDN script tag)
- Canvas அடிப்படையிலான ரெண்டரிங் (மொபைலில் சிறப்பாகச் செயல்படும்)
- உள்ளமைக்கப்பட்ட responsive/accessibility அம்சங்கள்
---
## Leaflet.js + OpenStreetMap
**பதிப்பு:** 1.9.4, SRI உடன் unpkg-இல் இருந்து ஏற்றப்படுகிறது
**இதற்காகப் பயன்படுத்தப்படுகிறது:**
- AQI நிலையக் குறிப்பான்களுடன் 160 நகரங்களின் ஊடாடும் வரைபடம் (157 இந்திய நகரங்கள், அத்துடன் பெய்ஜிங், லண்டன் மற்றும் சிங்கப்பூர்)
- AQI தீவிரத்தின் அடிப்படையில் வண்ணக் குறியிடப்பட்ட குறிப்பான்கள் (பச்சை/மஞ்சள்/ஆரஞ்சு/சிவப்பு/ஊதா)
- நிலைய விவரங்களைக் காண கிளிக் செய்தல்
**Leaflet + OSM ஏன்:**
- இலவசம் மற்றும் திறந்த மூலமானது (Google Maps API key தேவையில்லை)
- எடை குறைவானது (~40 KB gzipped)
- OpenStreetMap தரவு இலவசமானது, ஆனால் அதன் tile servers சிறந்த முயற்சியில் இயங்குபவை மற்றும் கொள்கை வரம்புகளுக்கு உட்பட்டவை ([பயன்பாட்டுக் கொள்கை](https://operations.osmfoundation.org/policies/tiles/)); அதிக பயன்பாட்டிற்கு வணிக அல்லது சுய-வழங்கும் tile source தேவை. இந்த தளம் Carto basemap tiles-ஐயும் பயன்படுத்துகிறது
---
## பன்மொழி ஆதரவு
வாடிக்கையாளர் பக்க மொழி மாற்றுவதன் மூலம் JanVayu 5 மொழிகளை ஆதரிக்கிறது:
| மொழி | குறியீடு |
|----------|------|
| ஆங்கிலம் | `en` |
| இந்தி | `hi` |
| தமிழ் | `ta` |
| மராத்தி | `mr` |
| பெங்காலி | `bn` |
**செயலாக்கம்:** மொழி சரங்கள் JS objects ஆக சேமிக்கப்பட்டு, மாற்றுவதன் போது DOM கூறுகளில் மாற்றப்படுகின்றன. i18n library இல்லை — வெறும் எளிய key-value தேடல் மட்டுமே.
---
## அணுகல்தன்மை
- அனைத்து ஊடாடும் கூறுகளுக்கும் விசைப்பலகை வழிசெலுத்தல்
- semantic HTML போதுமானதாக இல்லாத இடங்களில் ARIA roles
- WCAG AA-ஐப் பூர்த்தி செய்யும் வண்ண வேறுபாடு (உரைக்கு 4.5:1)
- CI-இல் (`accessibility.yml`) axe-core sweeps இயங்குதல்
- ஊடாடும் கூறுகளில் Focus குறிகாட்டிகள்
