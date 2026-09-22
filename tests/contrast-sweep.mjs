// contrast-sweep.mjs — measure every text element on every panel, in both themes.
//
// Run by hand, not in CI. It opens all 56 panels twice, walks each one for
// elements with their own text, resolves the real background by climbing the
// tree, and reports anything under 4.5:1 (or 3:1 for large text).
//
//   cd /path/to/JanVayu && python3 -m http.server 8231 &
//   node tests/contrast-sweep.mjs
//
// **Why it is not a CI job.** The counts move between runs on their own,
// because the page shows live AQI and which colour band a city falls into
// changes with it. One sweep reported 331 light failures and the next 499 with
// no code change in between. A ratchet on a number that drifts by itself is a
// flaky check, and a flaky check gets switched off. The deterministic part of
// this — the three habits that produced almost all of the findings — is
// enforced by scripts/check-theme-contrast.py instead.
//
// Three traps worth knowing if you extend it, each of which produced hundreds
// of phantom failures before being fixed:
//   * SVG <text> paints with `fill`, not `color`. Reading cs.color there
//     reported the inherited theme ink for every diagram label: 1,900 of them.
//   * A gradient or image background cannot be read from getComputedStyle, so
//     the background is unknowable and the element must be skipped, not
//     guessed at. Guessing produced "white on white" for every gradient button.
//   * `opacity` and alpha in the colour both have to be composited before
//     measuring, or a faded element reads as if it were fully opaque.

// playwright-core resolves from node_modules on a CI runner and from the
// global install in the agent sandbox, which has no local node_modules.
const { chromium } = await import('playwright-core')
  .catch(() => import('/opt/node22/lib/node_modules/playwright-core/index.mjs'));
import { readFileSync, writeFileSync } from 'node:fs';
import { sweepPage } from './contrast-probe.mjs';

const PANELS = readFileSync(new URL('./contrast-sweep-panels.txt', import.meta.url), 'utf8').trim().split('\n');
const THEMES = ['light', 'dark'];


const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const results = {};
for (const theme of THEMES) {
  const p = await b.newPage({ viewport: { width: 1280, height: 1200 } });
  await p.goto('http://127.0.0.1:8231/', { waitUntil: 'domcontentloaded' });
  await p.evaluate(t => { try { localStorage.setItem('theme', t); } catch (e) {}
    document.documentElement.setAttribute('data-theme', t); document.body.setAttribute('data-theme', t); }, theme);
  await p.waitForTimeout(2500);
  for (const panel of PANELS) {
    try {
      await p.evaluate(id => window.showPanel && window.showPanel(id), panel);
      await p.waitForTimeout(700);
      await p.evaluate(t => { document.documentElement.setAttribute('data-theme', t); document.body.setAttribute('data-theme', t); }, theme);
      await p.waitForTimeout(150);
      const hits = await p.evaluate(sweepPage);
      if (hits.length) (results[theme] ||= {})[panel] = hits;
    } catch (e) { /* panel failed to open; not a contrast finding */ }
  }
  await p.close();
}
writeFileSync('contrast-sweep.json', JSON.stringify(results, null, 1));
for (const theme of THEMES) {
  const r = results[theme] || {};
  const total = Object.values(r).reduce((a, v) => a + v.length, 0);
  console.log(`${theme}: ${total} failing element(s) across ${Object.keys(r).length} panels`);
}
await b.close();
