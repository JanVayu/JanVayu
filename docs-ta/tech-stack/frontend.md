# Frontend Stack

## HTML/CSS/JavaScript (Vanilla)

முன்புறம் (frontend) என்பது எந்த build step-உம், bundler-உம் இல்லாமல் எழுதப்பட்ட vanilla HTML, CSS மற்றும் JavaScript ஆகும். இது **ஒரே ஒரு** ஃபைல் கிடையாது, மேலும் இது அப்படிப்பட்டது என்று இந்தப் பக்கம் நீண்ட காலமாகச் சொல்லி யாரையாவது தவறாக வழிநடத்தியது: `index.html` சுமார் 6,600 வரிகள், `styles.css` சுமார் 3,700, `app.js` சுமார் 10,000 வரிகள் உள்ளன, மேலும் `panels/` இல் 19 பேனல் துண்டுகள் (panel fragments) runtime-இல் பக்கத்தில் ஏற்றப்படுகின்றன.

### இதன் அமைப்பு

| ஃபைல் | அது என்ன |
|---|---|
| `index.html` | Single-page app: பட்டை (bar), பேனல் கண்டெய்னர், மற்றும் முதல் paint-க்காக `styles.css`-இன் inline **critical-CSS** பகுதி |
| `styles.css` | Design system. ஒவ்வொரு token, இரண்டு theme-கள், மற்றும் பகிரப்பட்ட components-கள் (`.bar`, `.ctl`, `.card`, `.container`) |
| `app.js` | பேனல் ரூட்டிங், டேட்டா எடுப்பது, சார்ட்டுகள், ரோல் மற்றும் மொழி அமைப்புகள் |
| `js/chrome.js` | Theme விருப்பம் மற்றும் SPA ஆக இல்லாத பக்கங்களுக்கான சிறிய பட்டை |
| `panels/*.html` | `index.html`-இல் சேர்க்கப்படும் துண்டுகள்; அவை அதன் ஸ்டைலிங்கை inherit செய்யும் |
| 18 தனித்தனி பக்கங்கள் | `/pm25/`, `/try.html`, `/docs/`, `/blog/`, `/ask/`, வாக்கித்ரூ (walkthrough), எம்பெட்கள் (embeds), மற்றும் பிற |

**அனைத்து 19 தனித்தனி டாக்குமெண்ட்களும் `styles.css`-ஐ லோட் செய்கின்றன.** 2026-09-22 வரை இது உண்மையாக இருக்கவில்லை: ஒவ்வொன்றிலும் ஒரே token பெயர்களை நிலையான light-theme மதிப்புகளுடன் மாற்றி வரையறுக்கும் ஒரு தனிப்பட்ட `<style>` பிளாக் இருந்தது, இதனால் ஒரு token மாற்றம் ஒரு பக்கத்திற்கு மட்டுமே சென்றது, மற்ற பக்கங்கள் theme கட்டுப்பாட்டைப் பின்பற்றவில்லை.
`scripts/check-design-system.py` மீண்டும் விடுபடும் ஒரு பக்கத்தை ஃபெயில் (fail) செய்யும்.

### ஏன் build step இல்லை

1. **Build step இல்லை** — ரெபாசிட்டரியே (repo) deploy artefact ஆகும்
2. **பங்களிப்பாளர்களுக்கு எளிதானது (Contributor-friendly)** — `python3 -m http.server` தான் முழு dev setup
3. **சோர்ஸ் (source) மற்றும் அவுட்புட் (output) இடையே பழையதாகிப்போக எதுவும் இல்லை**

இதற்குச் செலவு என்னவென்றால், cache-busting மேனுவலாக செய்யப்படுகிறது. `/styles.css` மற்றும் `/app.js` ஆகியவை `package.json`-இல் உள்ள வெர்ஷனில் இருந்து பெறப்பட்ட `?v=<stamp>` query-உடன் கோரப்படுகின்றன, ஏனெனில் `sw.js` same-origin அசெட்களை **மறுசரிபார்ப்பு (revalidation) இல்லாமல் cache-first ஆக** வழங்குகிறது. இரண்டு பாதுகாப்புகள் இதை ஒன்றாக வைத்திருக்கின்றன: `check-asset-stamps.py` (ஒவ்வொரு stamp செய்யப்பட்ட URL-உம் தற்போதைய stamp-ஐக் கொண்டிருக்கும்) மற்றும் `check-asset-freshness.py` (வெர்ஷன் மாறாமல் இருக்கும்போது எந்த stamp செய்யப்பட்ட ஃபைலும் மாறவில்லை). இரண்டாவது இருப்பதற்குக் காரணம், `app.js` மாறாமல் URL மாறாமல் இருந்தபோதே முதல் பாதுகாப்பை அது பாஸ் செய்ததுதான்.

### CSS ஆர்கிடெக்சர்


---
- **Custom properties-இன் மூன்று அடுக்குகள்.** ஒரு raw ramp (`--w-0`…`--w-900` வெளிர் நிறங்களுக்காக, `--d-950`…`--d-50` இருண்ட நிறங்களுக்காக), அதைச் சுட்டிக்காட்டும் ஒரு semantic அடுக்கு, மற்றும் semantic அடுக்கை மட்டுமே பயன்படுத்தும் components.
- **Preprocessor கிடையாது** (Sass, Less, அல்லது PostCSS இல்லை)
- Media queries-உடன் கூடிய **Mobile-first** responsive design
- **WCAG AA** contrast, இரண்டு themes-லும் உள்ள ஒவ்வொரு panel மற்றும் ஒவ்வொரு page-லும் Playwright sweep மூலம் CI-ல் சரிபார்க்கப்படுகிறது

நீங்கள் பயன்படுத்த வேண்டிய semantic அடுக்கு:

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

இவற்றுடன் `--ink-red`, `--ink-blue`, `--ink-teal` மற்றும் பிற ink tokens-உம் உள்ளன. ஏனென்றால், வெள்ளையில் text ஆகத் தெரியும் ஒரு saturated நிறம் `#0e0e0c` மீது text ஆகத் தெரியாது. JavaScript-ல் literal ஆக எழுதப்படும் அல்லது `style=` attribute-ல் உள்ள ஒரு நிறத்தால், அது எந்த theme-ல் உள்ளது என்பதை அறிய முடியாது, எனவே அதற்கு ஒரு token வழங்கப்பட்டு CSS அதை மாற்றுகிறது.

### Theming

`<html>`-ல் உள்ள `data-theme="dark"`, இது `js/chrome.js` மூலம் அமைக்கப்பட்டு `janvayu-theme`-ன் கீழ் சேமிக்கப்படுகிறது. ஒவ்வொரு page-லும் `<head>`-ல் ஒரு சிறிய inline script உள்ளது, இது முதல் paint-க்கு முன்பே சேமிக்கப்பட்ட மதிப்பைச் செயல்படுத்துகிறது. இதனால் ஒரு page ஒருபோதும் light ஆக paint ஆகிவிட்டுத் திடீரென மாறுவதில்லை. `prefers-color-scheme` block-ஐச் சேர்க்க வேண்டாம்: முன்பு நான்கு pages-ல் இது இருந்தது, அதாவது அவை operating system-ஐப் பின்பற்றி site-இன் சொந்த கட்டுப்பாட்டைப் புறக்கணித்தன.

### JavaScript Patterns

- **ES2020** — browser compatibility-ஐப் பராமரிக்க புதிய features கிடையாது
- அனைத்து HTTP calls-க்கும் **Fetch API** (axios கிடையாது)
- `document.getElementById` / `querySelector` மூலம் **DOM manipulation**
- **Module bundler கிடையாது** — அனைத்து JS-உம் `<script>` tags-ல் உள்ளன
- Live AQI data-விற்கான **10-நிமிட auto-refresh**

---

## Chart.js

**Version:** Pinned 4.x (4.4.7), SRI-உடன் jsDelivr-ல் இருந்து load செய்யப்படுகிறது மற்றும் lazy-loaded
**Used for:**
- Metro vs Regional AQI ஒப்பீட்டு bar charts
- PM2.5 trend lines
- Health impact data visualisations
- Seasonal baseline ஒப்பீடுகள்

**Why Chart.js:**
- சிறிய அளவு (~70 KB gzipped, ~60 KB Brotli)
- build step இல்லாமல் வேலை செய்யும் (CDN script tag)
- Canvas-based rendering (mobile-ல் சிறப்பாகச் செயல்படும்)
- Built-in responsive/accessibility features

---
## Leaflet.js + OpenStreetMap

**பதிப்பு:** 1.9.4, SRI உடன் unpkg-லிருந்து ஏற்றப்பட்டது
**இதற்குப் பயன்படுத்தப்படுகிறது:**
- AQI நிலையக் குறிகளுடன் 160 நகரங்களின் (157 இந்திய நகரங்கள், அத்துடன் பெய்ஜிங், லண்டன் மற்றும் சிங்கப்பூர்) ஊடாடும் வரைபடம்
- AQI தீவிரத்தின் அடிப்படையில் வண்ணக் குறியிடப்பட்ட குறிகாட்டிகள் (பச்சை/மஞ்சள்/ஆரஞ்சு/சிவப்பு/ஊதா)
- நிலைய விவரங்களைக் காண கிளிக் செய்யவும்

**Leaflet + OSM ஏன்:**
- இலவசம் மற்றும் திறந்த மூலமாகும் (Google Maps API key தேவையில்லை)
- எடை குறைவானது (~40 KB gzipped)
- OpenStreetMap தரவு இலவசமானது, ஆனால் அதன் tile சர்வர்கள் சிறந்த முயற்சிகளை அடிப்படையாகக் கொண்டவை மற்றும் கொள்கை வரம்புகளுக்கு உட்பட்டவை ([பயன்பாட்டுக் கொள்கை](https://operations.osmfoundation.org/policies/tiles/)); அதிக பயன்பாட்டிற்கு வணிக அல்லது சுய-ஹோஸ்ட் செய்யப்பட்ட tile ஆதாரம் தேவை. இந்த தளம் Carto basemap tiles-ஐயும் பயன்படுத்துகிறது

---

## பன்மொழி ஆதரவு

வாடிக்கையாளர் பக்க மொழி மாற்றி மூலம் JanVayu 5 மொழிகளை ஆதரிக்கிறது:

| மொழி | குறியீடு |
|----------|------|
| ஆங்கிலம் | `en` |
| இந்தி | `hi` |
| தமிழ் | `ta` |
| மராத்தி | `mr` |
| பெங்காலி | `bn` |

**செயலாக்கம்:** மொழி சரங்கள் JS ஆப்ஜெக்ட்களாக சேமிக்கப்பட்டு, மாற்றிப் பயன்படுத்தப்படும் போது DOM உறுப்புகளில் மாற்றப்படுகின்றன. i18n லைப்ரரி இல்லை — வெறும் எளிய key-value தேடல் மட்டுமே.

---

## அணுகல்தன்மை

- அனைத்து ஊடாடும் கூறுகளுக்கும் விசைப்பலகை வழிசெலுத்தல்
- சொற்பொருள் HTML போதாத இடங்களில் ARIA பாத்திரங்கள்
- WCAG AA-ஐ பூர்த்தி செய்யும் வண்ண வேறுபாடு (உரைக்கு 4.5:1)
- CI-ல் (`accessibility.yml`) axe-core ஸ்கேன்கள் இயங்குகின்றன
- ஊடாடும் கூறுகளில் குவியக் குறிகாட்டிகள்
