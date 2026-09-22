#!/usr/bin/env bash
# Every gating command CI actually runs, extracted from the workflows rather
# than kept as a second list that can drift from them. Regenerate with
# scripts/list-ci-checks.py whenever a workflow changes.
set -u

# The contrast gate drives a browser against a local copy of the site. Start
# one if nothing is already listening, and take it down again on the way out.
__served=""
if ! curl -s -o /dev/null --max-time 2 http://127.0.0.1:8231/ 2>/dev/null; then
  python3 -m http.server 8231 >/dev/null 2>&1 &
  __served=$!
  sleep 2
fi
trap '[ -n "$__served" ] && kill "$__served" 2>/dev/null' EXIT
echo "--- [guard-site-figures] python3 scripts/check-site-figures.py"; python3 scripts/check-site-figures.py >/dev/null 2>&1 || { echo "   FAIL: python3 scripts/check-site-figures.py"; python3 scripts/check-site-figures.py 2>&1 | tail -6; }
echo "--- [guard-site-figures] python3 scripts/build-station-observed.py --check"; python3 scripts/build-station-observed.py --check >/dev/null 2>&1 || { echo "   FAIL: python3 scripts/build-station-observed.py --check"; python3 scripts/build-station-observed.py --check 2>&1 | tail -6; }
echo "--- [guard-site-figures] python3 scripts/build-deweathered-national.py --check"; python3 scripts/build-deweathered-national.py --check >/dev/null 2>&1 || { echo "   FAIL: python3 scripts/build-deweathered-national.py --check"; python3 scripts/build-deweathered-national.py --check 2>&1 | tail -6; }
echo "--- [guard-site-figures] python3 scripts/build-how-it-works.py --check"; python3 scripts/build-how-it-works.py --check >/dev/null 2>&1 || { echo "   FAIL: python3 scripts/build-how-it-works.py --check"; python3 scripts/build-how-it-works.py --check 2>&1 | tail -6; }
echo "--- [guard-site-figures] python3 scripts/check-asset-urls.py"; python3 scripts/check-asset-urls.py >/dev/null 2>&1 || { echo "   FAIL: python3 scripts/check-asset-urls.py"; python3 scripts/check-asset-urls.py 2>&1 | tail -6; }
echo "--- [guard-site-figures] python3 scripts/check-nav-coverage.py"; python3 scripts/check-nav-coverage.py >/dev/null 2>&1 || { echo "   FAIL: python3 scripts/check-nav-coverage.py"; python3 scripts/check-nav-coverage.py 2>&1 | tail -6; }
echo "--- [guard-site-figures] python3 scripts/check-critical-css.py"; python3 scripts/check-critical-css.py >/dev/null 2>&1 || { echo "   FAIL: python3 scripts/check-critical-css.py"; python3 scripts/check-critical-css.py 2>&1 | tail -6; }
echo "--- [guard-site-figures] python3 scripts/check-asset-stamps.py"; python3 scripts/check-asset-stamps.py >/dev/null 2>&1 || { echo "   FAIL: python3 scripts/check-asset-stamps.py"; python3 scripts/check-asset-stamps.py 2>&1 | tail -6; }
echo "--- [guard-site-figures] python3 scripts/check-theme-contrast.py"; python3 scripts/check-theme-contrast.py >/dev/null 2>&1 || { echo "   FAIL: python3 scripts/check-theme-contrast.py"; python3 scripts/check-theme-contrast.py 2>&1 | tail -6; }
echo "--- [guard-site-figures] python3 scripts/check-css-vars.py"; python3 scripts/check-css-vars.py >/dev/null 2>&1 || { echo "   FAIL: python3 scripts/check-css-vars.py"; python3 scripts/check-css-vars.py 2>&1 | tail -6; }
echo "--- [guard-site-figures] python3 scripts/check-uppercase-units.py"; python3 scripts/check-uppercase-units.py >/dev/null 2>&1 || { echo "   FAIL: python3 scripts/check-uppercase-units.py"; python3 scripts/check-uppercase-units.py 2>&1 | tail -6; }
echo "--- [guard-site-figures] python3 scripts/build-aqi-bulletins.py --check"; python3 scripts/build-aqi-bulletins.py --check >/dev/null 2>&1 || { echo "   FAIL: python3 scripts/build-aqi-bulletins.py --check"; python3 scripts/build-aqi-bulletins.py --check 2>&1 | tail -6; }
echo "--- [guard-site-figures] python3 scripts/check-bulletin-parser.py"; python3 scripts/check-bulletin-parser.py >/dev/null 2>&1 || { echo "   FAIL: python3 scripts/check-bulletin-parser.py"; python3 scripts/check-bulletin-parser.py 2>&1 | tail -6; }
echo "--- [guard-site-figures] python3 scripts/check-about-currency.py"; python3 scripts/check-about-currency.py >/dev/null 2>&1 || { echo "   FAIL: python3 scripts/check-about-currency.py"; python3 scripts/check-about-currency.py 2>&1 | tail -6; }
echo "--- [guard-site-figures] python3 scripts/check-workshop-decks.py"; python3 scripts/check-workshop-decks.py >/dev/null 2>&1 || { echo "   FAIL: python3 scripts/check-workshop-decks.py"; python3 scripts/check-workshop-decks.py 2>&1 | tail -6; }
echo "--- [guard-site-figures] python3 scripts/build-blog-index.py --check"; python3 scripts/build-blog-index.py --check >/dev/null 2>&1 || { echo "   FAIL: python3 scripts/build-blog-index.py --check"; python3 scripts/build-blog-index.py --check 2>&1 | tail -6; }
echo "--- [guard-site-figures] python3 scripts/build-gallery-manifest.py --check"; python3 scripts/build-gallery-manifest.py --check >/dev/null 2>&1 || { echo "   FAIL: python3 scripts/build-gallery-manifest.py --check"; python3 scripts/build-gallery-manifest.py --check 2>&1 | tail -6; }
echo "--- [guard-site-figures] python3 scripts/build-district-history.py --check"; python3 scripts/build-district-history.py --check >/dev/null 2>&1 || { echo "   FAIL: python3 scripts/build-district-history.py --check"; python3 scripts/build-district-history.py --check 2>&1 | tail -6; }
echo "--- [guard-site-figures] python3 scripts/build-reduction-data.py --check"; python3 scripts/build-reduction-data.py --check >/dev/null 2>&1 || { echo "   FAIL: python3 scripts/build-reduction-data.py --check"; python3 scripts/build-reduction-data.py --check 2>&1 | tail -6; }
echo "--- [guard-site-figures] python3 scripts/check-hero-currency.py"; python3 scripts/check-hero-currency.py >/dev/null 2>&1 || { echo "   FAIL: python3 scripts/check-hero-currency.py"; python3 scripts/check-hero-currency.py 2>&1 | tail -6; }
echo "--- [guard-site-figures] python3 scripts/check-retracted-claims.py"; python3 scripts/check-retracted-claims.py >/dev/null 2>&1 || { echo "   FAIL: python3 scripts/check-retracted-claims.py"; python3 scripts/check-retracted-claims.py 2>&1 | tail -6; }
echo "--- [guard-site-figures] python3 scripts/check-factcheck-freshness.py"; python3 scripts/check-factcheck-freshness.py >/dev/null 2>&1 || { echo "   FAIL: python3 scripts/check-factcheck-freshness.py"; python3 scripts/check-factcheck-freshness.py 2>&1 | tail -6; }
echo "--- [guard-site-figures] python3 scripts/build-deweathered.py --check"; python3 scripts/build-deweathered.py --check >/dev/null 2>&1 || { echo "   FAIL: python3 scripts/build-deweathered.py --check"; python3 scripts/build-deweathered.py --check 2>&1 | tail -6; }
echo "--- [contrast-gate] node tests/contrast-ci.mjs"; node tests/contrast-ci.mjs >/dev/null 2>&1 || { echo "   FAIL: node tests/contrast-ci.mjs"; node tests/contrast-ci.mjs 2>&1 | tail -6; }
echo "=== done ==="
