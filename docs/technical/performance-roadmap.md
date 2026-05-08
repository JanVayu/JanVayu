# Performance Roadmap

This page documents the planned approach to JanVayu's mobile-performance work — scaffolded in v26.5.4 (Lighthouse CI + budget config), with the actual refactor pending its own dedicated cycle.

Tracked in [issue #3](https://github.com/JanVayu/JanVayu/issues/3).

---

## Current state (May 2026)

- Single `index.html`, ~990 KB minified.
- Chart.js 4.x (~70 KB gzipped) and Leaflet 1.9 + leaflet.heat (~50 KB gzipped) are loaded at the top of the page with `defer`. They block neither parsing nor first paint, but they DO consume ~120 KB of bandwidth on every visit even though most sessions never open the Trends or Live Map panels.
- Sargam Icons via CSS `mask-image` — no icon font download.
- Service worker (`sw.js`) caches the shell + last-known AQI.
- Brotli compression active via Netlify default.

## Lighthouse budget (`.lighthouserc.json`)

| Metric | Target | Current state |
|---|---|---|
| Performance score | ≥ 0.60 | not yet measured under CI |
| Accessibility score | ≥ 0.85 | see [issue #4](https://github.com/JanVayu/JanVayu/issues/4) |
| Best Practices score | ≥ 0.85 | not yet measured |
| SEO score | ≥ 0.90 | likely passing (per-pollutant pages have schema.org JSON-LD) |
| First Contentful Paint | ≤ 3,000 ms | likely passing on desktop, unknown on 3G |
| Largest Contentful Paint | ≤ 4,500 ms | likely failing on 3G |
| Total Blocking Time | ≤ 600 ms | likely failing on 3G |
| Cumulative Layout Shift | ≤ 0.15 | likely passing |

Assertions are `warn` until consistently met; flip to `error` once the budget is met under the Lighthouse CI run.

## Planned refactor (single dedicated cycle)

### 1. Lazy-load Chart.js and Leaflet

Remove the eager `<script src="...chart.js" defer>` and `<script src="...leaflet.js" defer>` tags. Replace with a small loader pattern:

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

Then in every panel that uses charts or the map, prefix the init call:

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

The functions that call `initTrendsCharts` / `initMap` need an `await` (or `.then()`). All current call sites are inside `loadPanel(panelId)` which runs on click, so an `async` upgrade there is safe.

**Expected savings:** ~120 KB on first paint for sessions that don't open Trends or Live Map (likely 70%+ of sessions). Mobile FCP improvement: ~600 ms on 3G.

### 2. Defer non-critical CSS

The current inline CSS block is ~85 KB. Most of it is panel-specific styling not needed for first paint. Split into:

- **Critical** (~10 KB): hero, top-nav, dashboard quick-link grid. Inline.
- **Non-critical** (~75 KB): everything else. Move to `assets/main.css` and load with `<link rel="preload" as="style" onload="this.rel='stylesheet'">`.

**Expected savings:** ~20 KB on first paint after Brotli; mobile FCP improvement: ~200 ms.

### 3. Brotli verification

Already active via Netlify default headers, but worth verifying:

```bash
curl -H "Accept-Encoding: br" -I https://www.janvayu.in/ | grep -i content-encoding
# Expected: content-encoding: br
```

If `gzip` is returned instead, set explicit headers in `netlify.toml`.

### 4. Image / icon optimisation

- `og-image.png` is 39 KB — fine, but verify it shows current numbers (separate issue, see [audit deferred items](../../docs/wiki/Roadmap.md)).
- `favicon.svg` is 1.5 KB — fine.
- Sargam Icons via mask-image — already optimal.

### 5. Mobile responsiveness audit

Tracked separately in [issue #33](https://github.com/JanVayu/JanVayu/issues/33). Contributes to Lighthouse accessibility + best-practices scores but is a different workstream.

---

## Order of attack

1. **Run baseline Lighthouse** — `gh workflow run lighthouse.yml` and capture numbers.
2. **Lazy-load Chart.js + Leaflet** — biggest single win (estimated ~600 ms FCP).
3. **Re-measure** — confirm the 600 ms improvement is real before moving on.
4. **CSS split** — second-biggest win (~200 ms).
5. **Iterate** on whatever Lighthouse flags next: unused JS, layout shift, etc.

Until the budget is consistently met, keep `.lighthouserc.json` assertions on `warn`. After three green runs in a row on `main`, flip the perf-score and FCP assertions to `error`.
