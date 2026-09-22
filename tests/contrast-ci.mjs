// contrast-ci.mjs — the contrast sweep, made deterministic enough to gate a PR.
//
// tests/contrast-sweep.mjs is the hand-run explorer: it opens the real page
// against the real APIs and reports what it finds. That is why it is not in CI.
// The page paints a band colour per live AQI reading, so the set of colours on
// screen changes with the air: one run reported 331 light failures and the next
// 499 with no code change in between, and a gate on a number that moves by
// itself is a gate somebody switches off.
//
// This file removes the two sources of movement.
//
//   1. Every third-party request is intercepted. The APIs that feed visible
//      numbers are answered from tests/fixtures/; everything else is aborted.
//      Aborting is the point: a CDN that loads in GitHub Actions and is blocked
//      in an agent sandbox would make the same commit pass in one place and
//      fail in the other. A font that arrives late changes text metrics, and
//      the AA threshold is 3:1 for large text against 4.5:1 for small, so a
//      borderline element can flip on nothing but network timing.
//   2. The fixture spans six AQI bands, so a band colour that is only wrong in
//      one band is still painted at least once.
//
// What this does NOT cover, stated plainly so nobody reads a green run as more
// than it is: anything drawn into a <canvas> (the sweep reads DOM and SVG text
// only), anything that needs a third-party script to render at all, and any
// panel absent from contrast-sweep-panels.txt. Run the hand sweep against the
// live site before a release; run this on every push.
//
// And one thing measured rather than assumed: A GREEN RUN IN THE AGENT SANDBOX
// IS WEAKER THAN A GREEN RUN ON CI. On 2026-09-22 this gate passed locally and
// failed on the runner, on a real defect: the hyperlocal panel's CPCB/WAQI
// badge, white on #3B82F6 at 3.68:1. The panel renders its station list on the
// runner and does not here. Probed directly, it issues no /map/bounds/ request
// in the sandbox at all and falls straight to "No stations found in this area",
// so there is nothing for the sweep to measure. That is upstream of this file
// and the stubs do not reach it. Adding networkidle, a bounded
// wait-for-stable-DOM and a stub for the same-origin Netlify functions each
// removed a real source of divergence and none of them closed this one.
//
// So: a local FAIL is authoritative, a local PASS is not. CI is the authority.
//
//   python3 -m http.server 8231 & node tests/contrast-ci.mjs
//
// playwright-core resolves from node_modules on a CI runner and from the
// global install in the agent sandbox, which has no local node_modules.
const { chromium } = await import('playwright-core')
  .catch(() => import('/opt/node22/lib/node_modules/playwright-core/index.mjs'));
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { sweepPage } from './contrast-probe.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ORIGIN = process.env.CONTRAST_ORIGIN || 'http://127.0.0.1:8231';
const PANELS = readFileSync(join(HERE, 'contrast-sweep-panels.txt'), 'utf8').trim().split('\n');
const THEMES = ['light', 'dark'];
// An explicit path in the sandbox; undefined on a runner, where Playwright
// resolves the browser it downloaded itself.
const CHROME = process.env.PLAYWRIGHT_CHROMIUM
  || ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
      '/opt/pw-browsers/chromium/chrome-linux/chrome'].find(p => existsSync(p))
  || undefined;

const fixture = n => readFileSync(join(HERE, 'fixtures', n), 'utf8');
// Longest-prefix wins, so /map/bounds/ is matched before the bare host.
const STUBS = [
  ['api.waqi.info/map/bounds', 'waqi-bounds.json'],
  ['api.waqi.info', 'waqi-feed.json'],
  ['air-quality-api.open-meteo.com', 'open-meteo.json'],
  ['www.reddit.com', 'reddit-search.json'],
];


const b = await chromium.launch({ executablePath: CHROME });
const results = {};
let stubbed = 0, aborted = 0;

for (const theme of THEMES) {
  const p = await b.newPage({ viewport: { width: 1280, height: 1200 } });
  await p.route('**/*', route => {
    const url = route.request().url();
    // Same-origin Netlify functions do not exist under a static server, which
    // answers 404 and sends the panel down its empty path. Stub them, or the
    // DOM being measured depends on which dev server happens to be running.
    if (url.includes('/.netlify/functions/')) {
      stubbed++;
      return route.fulfill({ status: 200, contentType: 'application/json', body: fixture('netlify-functions.json') });
    }
    if (url.startsWith(ORIGIN) || url.startsWith('data:') || url.startsWith('blob:')) return route.continue();
    const hit = STUBS.find(([prefix]) => url.replace(/^https?:\/\//, '').startsWith(prefix));
    if (hit) { stubbed++; return route.fulfill({ status: 200, contentType: 'application/json', body: fixture(hit[1]) }); }
    aborted++;
    return route.abort();
  });
  await p.goto(ORIGIN + '/', { waitUntil: 'domcontentloaded' });
  await p.evaluate(t => { try { localStorage.setItem('theme', t); } catch (e) {}
    document.documentElement.setAttribute('data-theme', t); document.body.setAttribute('data-theme', t); }, theme);
  await p.waitForTimeout(2500);
  for (const panel of PANELS) {
    try {
      await p.evaluate(id => window.showPanel && window.showPanel(id), panel);
      // A fixed wait races the panel's own fetches. On 2026-09-22 that made the
      // gate pass locally and fail on the runner: the hyperlocal panel had not
      // painted its station list when the local sweep measured, so a badge at
      // 3.68:1 was invisible here and caught there. Wait for the network to go
      // quiet first, then settle, so the same panel is measured either way.
      try { await p.waitForLoadState('networkidle', { timeout: 8000 }); } catch (e) { /* a panel may poll forever */ }
      // Then wait for the panel's own markup to stop changing. Several panels
      // render in two or three stages off their own fetches, and networkidle
      // does not cover the render that follows the response. Without this the
      // gate measured the hyperlocal panel mid-chain locally and fully formed
      // on the runner, so a badge at 3.68:1 passed here and failed there.
      await p.waitForFunction(() => {
        const c = document.getElementById('panel-container');
        if (!c) return true;
        const n = c.innerHTML.length;
        const prev = window.__jvLastLen;
        window.__jvLastLen = n;
        return prev === n;
      // Bounded deliberately: several panels carry a live ticker or clock and
      // never stop changing, so an unbounded wait sits at the cap for each of
      // them and 116 panel-opens becomes a twenty-minute job nobody keeps.
      }, null, { timeout: 2500, polling: 300 }).catch(() => {});
      await p.waitForTimeout(250);
      await p.evaluate(t => { document.documentElement.setAttribute('data-theme', t); document.body.setAttribute('data-theme', t); }, theme);
      await p.waitForTimeout(150);
      const hits = await p.evaluate(sweepPage);
      if (hits.length) (results[theme] ||= {})[panel] = hits;
    } catch (e) { /* panel failed to open; not a contrast finding */ }
  }
  await p.close();
}
await b.close();

let total = 0;
for (const theme of THEMES) {
  const r = results[theme] || {};
  for (const [panel, hits] of Object.entries(r)) {
    for (const h of hits) {
      total++;
      console.log(`  ${theme.padEnd(5)} ${panel.padEnd(18)} ${String(h.ratio).padStart(5)}:1 `
        + `(needs ${h.need}:1)  ${h.color} on ${h.bg}  [${h.cls || h.tag}]  ${JSON.stringify(h.text).slice(0, 44)}`);
    }
  }
}
// The failure count is what this gate asserts. The request counts are
// diagnostics and move by one or two between runs, because a request already
// in flight when a page closes may or may not reach the route handler.
console.log(`\n${PANELS.length} panels x ${THEMES.length} themes; ~${stubbed} request(s) stubbed, ~${aborted} aborted.`);
if (total) {
  console.log(`\nFAIL - ${total} element(s) below their WCAG AA contrast threshold.`);
  console.log('Each line is the ink, the colour behind it, and the ratio. A colour');
  console.log('literal in JS cannot know which theme it landed in: use one of the');
  console.log('--ink-* / --aqi-* / --std-* tokens, or onSwatchInk() for text painted');
  console.log('directly onto a swatch. Reproduce with:');
  console.log('  python3 -m http.server 8231 & node tests/contrast-ci.mjs');
  process.exit(1);
}
console.log('PASS - no text fails AA in either theme.');
