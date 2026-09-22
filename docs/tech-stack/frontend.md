# Frontend Stack

## HTML/CSS/JavaScript (Vanilla)

The frontend is vanilla HTML, CSS and JavaScript with no build step and no
bundler. It is **not** a single file, and this page said it was for long
enough to mislead somebody: `index.html` is 6,644 lines, `styles.css` is
3,684, `app.js` is 9,935, and there are 19 panel fragments in `panels/`
loaded into the page at runtime.

### The shape of it

| File | What it is |
|---|---|
| `index.html` | The single-page app: the bar, the panel container, and an inline **critical-CSS** subset of `styles.css` for first paint |
| `styles.css` | The design system. Every token, both themes, and the shared components (`.bar`, `.ctl`, `.card`, `.container`) |
| `app.js` | Panel routing, data fetching, charts, the role and language machinery |
| `js/chrome.js` | The theme preference and a cut-down bar for the pages that are not the SPA |
| `panels/*.html` | Fragments injected into `index.html`; they inherit its styling |
| 18 standalone pages | `/pm25/`, `/try.html`, `/docs/`, `/blog/`, `/ask/`, the walkthrough, the embeds, and the rest |

**All 19 standalone documents load `styles.css`.** That was not true until
2026-09-22: each carried a private `<style>` block redefining the same token
names with fixed light-theme literals, so a token change reached one page and
none of the others followed the theme control.
`scripts/check-design-system.py` fails a page that drops out again.

### Why no build step

1. **No build step** — the repo is the deploy artefact
2. **Contributor-friendly** — `python3 -m http.server` is the entire dev setup
3. **Nothing to go stale between source and output**

The cost is that cache-busting is manual. `/styles.css` and `/app.js` are
requested with a `?v=<stamp>` query derived from the version in
`package.json`, because `sw.js` serves same-origin assets **cache-first with
no revalidation**. Two guards hold that together: `check-asset-stamps.py`
(every stamped URL carries the current stamp) and `check-asset-freshness.py`
(no stamped file changed while the version stood still). The second exists
because the first passed while `app.js` changed under an unchanged URL.

### CSS architecture

- **Three layers of custom properties.** A raw ramp (`--w-0`…`--w-900` warm
  neutrals for light, `--d-950`…`--d-50` for dark), a semantic layer that
  points at it, and components that only ever reference the semantic layer.
- **No preprocessor** (no Sass, Less, or PostCSS)
- **Mobile-first** responsive design with media queries
- **WCAG AA** contrast, gated in CI by a Playwright sweep over every panel
  and every page in both themes

The semantic layer, which is what you should be writing against:

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

Alongside these are the ink tokens — `--ink-red`, `--ink-blue`, `--ink-teal`
and the rest — which exist because a saturated hue that reads as text on
white does not read as text on `#0e0e0c`. A colour written as a literal in
JavaScript or a `style=` attribute cannot know which theme it landed in, so
it gets a token and CSS does the flipping.

### Theming

`data-theme="dark"` on `<html>`, set by `js/chrome.js` and stored under
`janvayu-theme`. Every page carries a small inline script in `<head>` that
applies the stored value before first paint, so a page never paints light
and then flips. Do not add a `prefers-color-scheme` block: four pages used
to have one, which meant they followed the operating system and ignored the
site's own control.

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
