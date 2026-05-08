# Quality You Can Measure: Lighthouse, axe, Lazy-Loading, and a Mobile Pass

**Published:** 8 May 2026 | **Author:** Team JanVayu | **Reading time:** 5 min

---

The same day we shipped six Learning Games and refreshed the May 2026 data, we did a quieter but arguably more important thing: **we made the platform's quality measurable on every PR**. This post is for technically-minded readers who want to know what's now under the hood — and for citizen-developers who might fork JanVayu and need the same scaffolding.

If you don't care about the engineering, the user-visible improvements still matter:

- The site now downloads **~120 KB less** on first paint for visitors who don't open the Trends or Live Map panels.
- Every chart on the platform is now described to screen readers.
- Every button is at least 44 px tall on small screens — tap-friendly.
- Long URLs and acronym chains stop forcing horizontal scroll on mobile.

Read on for what shipped, why, and what we're still chasing.

## The trade-off behind lazy-loading Chart.js and Leaflet

Until this week, Chart.js (~70 KB gzipped) and Leaflet + leaflet.heat (~50 KB gzipped) loaded on every page-view, even though most visitors never open the Trends panel and even fewer open the Live Map. Combined: about 120 KB of bandwidth that most sessions never used.

We replaced the eager `<script defer>` tags with two small loaders, `window.ensureChartJs()` and `window.ensureLeaflet()`, that fetch on demand. Each is memoised — concurrent callers share one fetch. The seven chart-rendering functions and the map init were converted to `async` and `await` their respective loader before touching the global `Chart` / `L` objects.

There's a subtlety. The dashboard does have small mini-charts (the metro-vs-region bar pair), and we don't want them to lag behind first paint. So we **pre-warm** `ensureChartJs()` inside `requestIdleCallback` — the browser's "I have a free moment" hook. The script downloads after first paint without blocking it. Safari, which has been late to `requestIdleCallback`, falls back to a 1.5-second `setTimeout`.

Sub-resource integrity (SRI) hashes are pinned for all three CDN scripts. If `cdn.jsdelivr.net` or `unpkg.com` ever served different content under the same URL — through compromise or maintenance error — the browser would reject the script rather than execute it.

Expected first-paint saving on 3G mobile: ~600 ms. The Lighthouse CI we wired up the same day will measure it once it runs.

## Quality CI: five new pipelines, all advisory

The point of advisory CI is to make problems **visible** without blocking PRs. You can't fix what you don't see, and you can't fix everything in one cycle. So:

- **Lighthouse CI** — runs against `/`, `/ask/`, `/blog/`, `/pm25/`. Budgets in `.lighthouserc.json` are warn-only: Performance ≥ 0.60 mobile, FCP ≤ 3 s, LCP ≤ 4.5 s, TBT ≤ 600 ms, CLS ≤ 0.15. Once we hit the budget three times in a row on `main`, we'll flip key assertions from `warn` to `error`.
- **axe-core** — surfaces WCAG 2 AA violations per page in the PR step summary, with the top three rule IDs and a count. Full JSON reports as 30-day artifacts.
- **html-validate@9** — across the main app, blog, ask PWA, embed widgets, downloads index, and all six pollutant pages. Pragmatic rule mix; `no-dup-id` and `no-unknown-elements` stay as errors.
- **ESLint v9** — Netlify Functions, scripts, the Ask PWA, root service worker. Standard JS hygiene rules.
- **Strict weekly lychee link audit** — opens an issue on failure. The PR-time lychee remains advisory because legacy dead links would otherwise block every PR until cleanup.

Plus, importantly, an i18n-coverage script. We measured the actual percentage of visible English strings on the dashboard whose immediate parent has a `data-i18n` attribute. The number is **0.7%** — uncomfortable, but now measurable. Each PR that adds `data-i18n` attributes will see the percentage tick up. We'll set a `--min-coverage` floor when we have a baseline.

## What chart accessibility actually looks like

Until this week, every `<canvas>` on the site was a black box to screen readers — the chart would render visually but a non-sighted user heard "graphic" with no description.

Now every canvas has `role="img"` and a meaningful `aria-label`. Examples:

- The metro-comparison bar chart: *"Bar chart comparing live AQI across the six largest Indian metros (Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad)."*
- The year-over-year compare chart: *"Line chart comparing month-by-month PM2.5 averages for a chosen Indian city across 2024, 2025, and 2026."*
- The Delhi history chart: *"Multi-year line chart of Delhi annual average PM2.5 from 2015 to 2025, with the WHO 5 µg/m³ guideline overlay."*

It's not a substitute for actual chart-data accessibility (a sonification or a tabular fallback would be next), but it's the floor: the chart is now nameable and described.

## Mobile tap targets and long-token wrapping

WCAG 2.5.5 ("Target Size — Enhanced") wants interactive elements to be at least 44×44 CSS pixels. iOS HIG and Android Material both make the same recommendation. Our `.icon-btn` was already there; `.btn` and `.btn-sm` were not on small screens. They are now:

```css
@media (max-width: 480px) {
  .btn { min-height: 44px; padding-block: 10px; }
  .btn-sm { min-height: 40px; padding-block: 8px; }
  .quick-link { min-height: 64px; }
}
```

Separately, long URLs and acronym chains (CAAQMS-IDs, station codes, NCAP fund identifiers) were forcing horizontal scroll on narrow viewports. `overflow-wrap: anywhere` on body text and code elements lets them break:

```css
@media (max-width: 480px) {
  p, li, dd, .voice-body, .resource-desc { overflow-wrap: anywhere; }
}
.code-box, code { overflow-wrap: anywhere; }
```

The Air Tambola ticket — the new 3×9 housie game — needed special treatment. With nine columns, even at `1fr` each, cells got too narrow to render two-line terms ("Lancet 1.72M") on a 360 px Galaxy. We wrapped the ticket in a horizontal-scroll container with `min-width: 540px`, so it scrolls cleanly rather than squishing.

## What's still on the list

The Q3 2026 priorities, in order of expected impact (full list in [`docs/wiki/Roadmap.md`](https://github.com/JanVayu/JanVayu/blob/main/docs/wiki/Roadmap.md)):

1. **CSS split** — extract panel-specific styles to a deferred external file. Estimated +200 ms FCP.
2. **axe → zero violations** — fix as flagged. Then expand the audited URL set to `/#health`, `/#policy`, `/#workshops`, `/#games`.
3. **Per-panel mobile sweep** across iPhone SE / 14, Galaxy, iPad Mini.
4. **i18n coverage** — push from 0.7% to a measurable target (60% by end of Q3?), enforce via `--min-coverage`.
5. **City coverage** — replace the static 16-city array with a build-time CPCB station fetch and a searchable combobox.
6. **Agent-Reach secrets activation** — or migrate to Twitter API v2 Basic tier.

## A note on order

The order of these v26.5.x ships matters. We *first* shipped the user-visible value — the games, the data refresh, the voices and research updates. Only *then* did we install the measurement scaffolding and the operational hardening. That order is deliberate: a citizen-led platform's job is to be useful first and well-instrumented second. Quality CI on a half-built site is busywork; quality CI on a working site is a conscience.

If you're forking JanVayu, our recommendation is the same. Make it useful. Then measure it.

---

**Repository:** [github.com/JanVayu/JanVayu](https://github.com/JanVayu/JanVayu)
**Performance roadmap:** [docs/technical/performance-roadmap.md](https://github.com/JanVayu/JanVayu/blob/main/docs/technical/performance-roadmap.md)
**Q3 priorities:** [docs/wiki/Roadmap.md — Phase 6](https://github.com/JanVayu/JanVayu/blob/main/docs/wiki/Roadmap.md)
