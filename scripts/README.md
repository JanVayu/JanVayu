# JanVayu scripts

Build, data, guard and translation scripts. Almost none are needed to deploy: Netlify's build command is `node scripts/bump-version.mjs`, which syncs the version stamp across every page and the service-worker cache key, and the site is served as committed. Everything else is run by hand, by a workflow, or by CI.

| Script | Runtime | Purpose | Wired in? |
|---|---|---|---|
| [`build-pollutant-pages.mjs`](build-pollutant-pages.mjs) | Node 20+ | Generates the six per-pollutant SEO pages (`/pm25/`, `/pm10/`, `/co/`, `/no2/`, `/so2/`, `/o3/`) from a single template. Embeds JSON-LD with current `dateModified`. | Manual: `node scripts/build-pollutant-pages.mjs` |
| [`translate-docs.py`](translate-docs.py) | Python 3.10+ | Translation helper for `docs/` → `docs-hi/`, `docs-bn/`, `docs-mr/`, `docs-ta/`. Used to keep multilingual docs in parity with the English source. | Run via `.github/workflows/translations.yml` |
| [`check-i18n-coverage.py`](check-i18n-coverage.py) | Python 3.10+ | Reports the percentage of visible English strings in `index.html` that carry a `data-i18n` attribute on their immediate parent. Advisory by default; pass `--min-coverage <pct>` to gate CI. | Run as a step in `.github/workflows/translations.yml`; output appears in the GitHub Step Summary. |
| [`build-og-image.py`](build-og-image.py) | Python 3.10+ (`cairosvg`) | Renders `og-image.png` from `og-image.svg` at 1200×630 px. Run after editing the SVG; commit both files together; bump the `?v=YYYYMMDD` query string on `og:image` and `twitter:image` meta tags in `index.html` to bust social-media caches. | Manual: `pip install cairosvg && python3 scripts/build-og-image.py` |

## CI guards

Each `check-*.py` exists because a specific defect shipped once. `python3 scripts/list-ci-checks.py` regenerates `run-ci-checks.sh` from the workflows, and `bash scripts/run-ci-checks.sh` runs exactly what CI will run before you push.

| Guard | What it refuses |
|---|---|
| [`check-about-currency.py`](check-about-currency.py) | The About panel's version history and roadmap must not fall far behind. |
| [`check-asset-freshness.py`](check-asset-freshness.py) | A stamped asset may not change without the version changing. |
| [`check-asset-stamps.py`](check-asset-stamps.py) | Every versioned asset URL must carry the CURRENT version stamp. |
| [`check-asset-urls.py`](check-asset-urls.py) | Every asset URL the CSS names must actually resolve to a file we ship. |
| [`check-bulletin-parser.py`](check-bulletin-parser.py) | Offline regression test for the CPCB bulletin row grammar. |
| [`check-critical-css.py`](check-critical-css.py) | index.html's inlined critical CSS must not disagree with styles.css. |
| [`check-css-vars.py`](check-css-vars.py) | Every var(--x) the site uses must be a variable the site defines. |
| [`check-design-system.py`](check-design-system.py) | Every standalone page loads styles.css, and none of them redefines its tokens. |
| [`check-factcheck-freshness.py`](check-factcheck-freshness.py) | Keep the fact-check promise and the fact-check practice in the same place. |
| [`check-hero-currency.py`](check-hero-currency.py) | Check that the homepage's dated bulletin is not from a month that has ended. |
| [`check-i18n-coverage.py`](check-i18n-coverage.py) | Check i18n coverage of index.html (and optionally other HTML files). |
| [`check-nav-coverage.py`](check-nav-coverage.py) | Every tool must stay reachable from the site's own chrome. |
| [`check-no-random-data.py`](check-no-random-data.py) | Refuse Math.random() anywhere a reader could mistake it for a measurement. |
| [`check-retracted-claims.py`](check-retracted-claims.py) | Fail the build if a claim JanVayu has publicly retracted comes back. |
| [`check-site-figures.py`](check-site-figures.py) | Check the numbers the site states against the numbers the site holds. |
| [`check-theme-contrast.py`](check-theme-contrast.py) | Stop the three ways a colour choice survives light mode and fails dark mode. |
| [`check-theme-surfaces.py`](check-theme-surfaces.py) | No ad-hoc colour tint as a background in markup. |
| [`check-uppercase-units.py`](check-uppercase-units.py) | Keep CSS uppercasing away from the micro sign. |
| [`check-workshop-decks.py`](check-workshop-decks.py) | Keep the workshop decks, the JSON that advertises them, and the README honest. |

The `build-*.py` scripts that take `--check` (`build-aqi-bulletins`, `build-station-observed`, `build-deweathered`, `build-deweathered-national`, `build-how-it-works`, `build-blog-index`, `build-gallery-manifest`, `build-district-history`, `build-reduction-data`) also run in CI as guards: they fail when the committed output no longer matches what the inputs produce.

## Other scripts

Data builders (`build-*`), importers (`import-*`, `fetch-*`, `merge-panel-wards.py`, `dedupe-ward-atlas.py`) and one-off analyses (`analyse-*`) each carry a docstring at the top that says what they read and what they write. Start there rather than here.

## Running locally

```bash
# Pollutant pages
node scripts/build-pollutant-pages.mjs

# Translation propagation
python scripts/translate-docs.py
```

## Deprecated / removed

- **`agent-reach-fetch.py`** and the `agent-reach-fetch.yml` workflow (X/Twitter cookie-scraper feeding the `feed-ingest` function) — removed July 2026. The social-media feed panel runs on curated content plus live Reddit; the cookie-based pipeline required manual secrets and was never activated.

---

*Last updated: October 2026.*
