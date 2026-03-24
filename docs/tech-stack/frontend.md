# Frontend Stack

## HTML/CSS/JavaScript (Vanilla)

The entire frontend is a single `index.html` file — currently ~11,300 lines — with inline `<style>` and `<script>` blocks. There is no separate `.css` or `.js` file.

### Why Inline Everything?

1. **Single HTTP request** — the browser fetches one file and has everything
2. **No build step** — `index.html` is the deploy artefact
3. **Contributor-friendly** — "open `index.html` in your browser" is the entire dev setup
4. **Guaranteed consistency** — no CSS/JS load order issues

### CSS Architecture

- **CSS Custom Properties** for theming (light/dark mode toggle)
- **No preprocessor** (no Sass, Less, or PostCSS)
- **Mobile-first** responsive design with media queries
- **WCAG AA** colour contrast compliance

Key variables:

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

### JavaScript Patterns

- **ES2020** — no newer features to maintain browser compatibility
- **Fetch API** for all HTTP calls (no axios)
- **DOM manipulation** via `document.getElementById` / `querySelector`
- **No module bundler** — all JS is in `<script>` tags
- **10-minute auto-refresh** for live AQI data

---

## Chart.js

**Version:** Latest stable (loaded via CDN)
**Used for:**
- Metro vs Regional AQI comparison bar charts
- PM2.5 trend lines
- Health impact data visualisations
- Seasonal baseline comparisons

**Why Chart.js:**
- Small footprint (~60 KB gzipped)
- Works without a build step (CDN script tag)
- Canvas-based rendering (performant on mobile)
- Built-in responsive/accessibility features

---

## Leaflet.js + OpenStreetMap

**Version:** Latest stable (loaded via CDN)
**Used for:**
- Interactive map of 40+ Indian cities with AQI station markers
- Colour-coded markers (green/yellow/orange/red/purple) by AQI severity
- Click-to-view station details

**Why Leaflet + OSM:**
- Free and open source (no Google Maps API key needed)
- Lightweight (~40 KB gzipped)
- OpenStreetMap tiles are free at any scale
- Works offline with cached tiles

---

## Multilingual Support

JanVayu supports 5 languages via a client-side language toggle:

| Language | Code |
|----------|------|
| English | `en` |
| Hindi | `hi` |
| Tamil | `ta` |
| Marathi | `mr` |
| Bengali | `bn` |

**Implementation:** Language strings are stored as JS objects and swapped into DOM elements on toggle. No i18n library — just a plain key-value lookup.

---

## Accessibility

- Keyboard navigation for all interactive elements
- ARIA roles where semantic HTML is insufficient
- Colour contrast meeting WCAG AA (4.5:1 for text)
- Alt text on all images
- Form labels on all inputs
- Focus indicators on interactive elements
