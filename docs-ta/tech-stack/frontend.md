# Frontend அடுக்கு

## HTML/CSS/JavaScript (Vanilla)

முழு frontend ஒரு ஒற்றை `index.html` கோப்பு — தற்போது ~11,300 வரிகள் — inline `<style>` மற்றும் `<script>` blocks-உடன். தனி `.css` அல்லது `.js` கோப்பு இல்லை.

### ஏன் எல்லாவற்றையும் Inline செய்கிறோம்?

1. **ஒற்றை HTTP கோரிக்கை** — உலாவி ஒரு கோப்பை பெற்று எல்லாமே கிடைக்கிறது
2. **Build படி இல்லை** — `index.html`-யே deploy artefact
3. **பங்களிப்பாளர்-நட்பு** — "உலாவியில் `index.html`-ஐ திறக்கவும்" என்பதே முழு dev setup
4. **உத்தரவாதப்படுத்தப்பட்ட நிலைத்தன்மை** — CSS/JS ஏற்றும் வரிசை சிக்கல்கள் இல்லை

### CSS கட்டமைப்பு

- தீம் அமைப்புக்கு (ஒளி/இருள் mode toggle) **CSS Custom Properties**
- **Preprocessor இல்லை** (Sass, Less அல்லது PostCSS இல்லை)
- Media queries-உடன் **Mobile-first** responsive design
- **WCAG AA** வண்ண contrast இணக்கம்

முக்கிய மாறிகள்:

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

### JavaScript வடிவங்கள்

- **ES2020** — உலாவி இணக்கத்தை பராமரிக்க புதிய அம்சங்கள் இல்லை
- அனைத்து HTTP அழைப்புகளுக்கும் **Fetch API** (axios இல்லை)
- `document.getElementById` / `querySelector` வழியாக **DOM manipulation**
- **Module bundler இல்லை** — அனைத்து JS `<script>` tags-ல்
- நேரடி AQI தரவுக்கான **10 நிமிட தானியங்கி-புதுப்பிப்பு**

---

## Chart.js

**பதிப்பு:** சமீபத்திய stable (CDN வழியாக ஏற்றப்படுகிறது)
**பயன்படுத்தப்படுவது:**
- Metro vs Regional AQI ஒப்பீடு bar charts
- PM2.5 போக்கு கோடுகள்
- சுகாதார தாக்க தரவு காட்சிப்படுத்தல்கள்
- பருவகால அடிப்படை ஒப்பீடுகள்

**ஏன் Chart.js:**
- சிறிய footprint (~60 KB gzipped)
- Build படி இல்லாமல் வேலை செய்கிறது (CDN script tag)
- Canvas-அடிப்படையிலான rendering (mobile-ல் செயல்திறன்)
- Built-in responsive/accessibility அம்சங்கள்

---

## Leaflet.js + OpenStreetMap

**பதிப்பு:** சமீபத்திய stable (CDN வழியாக ஏற்றப்படுகிறது)
**பயன்படுத்தப்படுவது:**
- AQI நிலைய குறிப்பான்களுடன் 40+ இந்திய நகரங்களின் ஊடாடும் வரைபடம்
- AQI தீவிரத்தின் படி நிறக்குறியீடு செய்யப்பட்ட குறிப்பான்கள் (பச்சை/மஞ்சள்/ஆரஞ்சு/சிவப்பு/ஊதா)
- நிலைய விவரங்களைப் பார்க்க கிளிக் செய்யும் அம்சம்

**ஏன் Leaflet + OSM:**
- இலவச மற்றும் திறந்த மூலம் (Google Maps API key தேவையில்லை)
- Lightweight (~40 KB gzipped)
- OpenStreetMap tiles எந்த அளவிலும் இலவசம்
- Cache செய்யப்பட்ட tiles-உடன் offline வேலை செய்கிறது

---

## பன்மொழி ஆதரவு

JanVayu கிளையண்ட்-பக்க மொழி toggle வழியாக 5 மொழிகளை ஆதரிக்கிறது:

| மொழி | குறியீடு |
|----------|------|
| English | `en` |
| Hindi | `hi` |
| Tamil | `ta` |
| Marathi | `mr` |
| Bengali | `bn` |

**செயல்படுத்தல்:** மொழி சரங்கள் JS objects-ஆக சேமிக்கப்பட்டு toggle-ல் DOM elements-க்கு மாற்றப்படுகின்றன. i18n library இல்லை — வெறும் key-value lookup.

---

## அணுகல்தன்மை

- அனைத்து ஊடாடும் elements-க்கும் Keyboard navigation
- Semantic HTML போதுமானதாக இல்லாத இடங்களில் ARIA roles
- WCAG AA-ஐ சந்திக்கும் வண்ண contrast (உரைக்கு 4.5:1)
- அனைத்து images-க்கும் Alt text
- அனைத்து inputs-க்கும் Form labels
- ஊடாடும் elements-ல் Focus indicators
