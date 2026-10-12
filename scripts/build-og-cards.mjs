#!/usr/bin/env node
// Draws the link-preview cards: og-image.png for the homepage (from
// og-image.svg) and og/<name>.jpg for every card in data/share-cards.json,
// which scripts/build-share.py writes.
//
// Rendering needs a browser, so this runs by hand rather than in CI:
//
//   PLAYWRIGHT_CORE=/path/to/node_modules/playwright-core \
//   CHROME=/opt/pw-browsers/chromium \
//     node scripts/build-og-cards.mjs
//
// CI runs the other half, which needs no browser:
//
//   node scripts/build-og-cards.mjs --check
//
// It fails when a card is missing, when a card's text has changed since its
// PNG was drawn, or when og-image.svg has changed since og-image.png was. That
// is the failure this exists for: the homepage card went on stating India's
// share of global PM2.5 deaths at more than double the real figure, on every
// WhatsApp share, for three months after the site's own fact-check removed the
// claim from every page, because the image was a separate file nothing
// compared with anything.
//
// A card carries no live figure, by design. Platforms cache a preview image
// for weeks, so a number drawn into one goes stale where nobody can fix it.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CARDS = join(ROOT, 'data', 'share-cards.json');
const RECORD = join(ROOT, 'og', 'cards.json');
const TEMPLATE_VERSION = 2;

const sha = (s) => createHash('sha256').update(s).digest('hex').slice(0, 16);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const cards = JSON.parse(readFileSync(CARDS, 'utf8')).cards;
const svg = readFileSync(join(ROOT, 'og-image.svg'), 'utf8');

function wanted() {
  const out = { 'og-image': sha(svg) };
  for (const c of cards) out[c.name] = sha(JSON.stringify([TEMPLATE_VERSION, c.kicker, c.title, c.sub]));
  return out;
}
const pngPath = (name) => (name === 'og-image' ? join(ROOT, 'og-image.png') : join(ROOT, 'og', `${name}.jpg`));

function check() {
  const want = wanted();
  const have = existsSync(RECORD) ? JSON.parse(readFileSync(RECORD, 'utf8')) : {};
  const bad = [];
  for (const [name, h] of Object.entries(want)) {
    if (!existsSync(pngPath(name))) bad.push(`${name}: no image`);
    else if (have[name] !== h) bad.push(`${name}: text changed since the image was drawn`);
  }
  for (const name of Object.keys(have)) if (!(name in want)) bad.push(`${name}: recorded but no longer wanted`);
  if (bad.length) {
    console.log('Preview cards out of date. Re-draw with scripts/build-og-cards.mjs (see its header):');
    for (const b of bad) console.log('  ' + b);
    process.exit(1);
  }
  console.log(`OK: ${Object.keys(want).length} preview cards match their text.`);
}

function cardHtml(c) {
  // Embedded, because a page loaded with setContent may not read file:// URLs.
  const font = (w) => 'data:font/woff2;base64,' + readFileSync(join(ROOT, 'fonts', `fraunces-${w}.woff2`)).toString('base64');
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Fraunces; font-weight: 600; src: url('${font(600)}'); }
@font-face { font-family: Fraunces; font-weight: 700; src: url('${font(700)}'); }
html, body { margin: 0; width: 1200px; height: 630px; }
body { background: linear-gradient(135deg, #0F172A 0%, #13302A 55%, #1B6B4A 100%); color: #F8FAFC;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; position: relative; overflow: hidden; }
.k { position: absolute; left: 80px; top: 72px; right: 80px; font: 600 22px/1.2 ui-monospace, 'DejaVu Sans Mono', monospace;
  letter-spacing: 0.08em; text-transform: uppercase; color: #FFD86B; }
.t { position: absolute; left: 80px; right: 80px; top: 130px; height: 300px; display: flex; align-items: center;
  font-family: Fraunces, Georgia, serif; font-weight: 700; line-height: 1.12; }
.s { position: absolute; left: 80px; right: 80px; top: 452px; font-size: 28px; line-height: 1.3; color: #CBD5E1; }
.f { position: absolute; left: 80px; right: 80px; bottom: 52px; display: flex; justify-content: space-between;
  align-items: baseline; border-top: 1px solid rgba(248,250,252,0.25); padding-top: 18px; }
.f b { font-family: Fraunces, Georgia, serif; font-size: 34px; font-weight: 700; }
.f span { font-size: 22px; color: #94A3B8; }
</style></head><body>
<div class="k">${esc(c.kicker)}</div>
<div class="t"><div id="t">${esc(c.title)}</div></div>
<div class="s">${esc(c.sub || '')}</div>
<div class="f"><b>JanVayu</b><span>www.janvayu.in</span></div>
<script>
  // Largest size at which the title fits its box, from 76px down. Wrapped,
  // because setContent reuses the window and a second top-level const throws.
  (function () {
    var el = document.getElementById('t'), box = el.parentElement;
    for (var s = 76; s >= 34; s -= 2) { el.style.fontSize = s + 'px'; if (el.scrollHeight <= box.clientHeight) break; }
  })();
</script></body></html>`;
}

async function render() {
  const pw = process.env.PLAYWRIGHT_CORE;
  if (!pw) {
    console.error('Set PLAYWRIGHT_CORE to a playwright-core directory (and CHROME to a Chromium binary).');
    process.exit(2);
  }
  const { chromium } = await import(pathToFileURL(join(pw, 'index.mjs')).href);
  const browser = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium' });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  const record = {};
  const want = wanted();

  await page.setContent(`<!DOCTYPE html><html><body style="margin:0">${svg}</body></html>`);
  await page.screenshot({ path: pngPath('og-image'), clip: { x: 0, y: 0, width: 1200, height: 630 } });
  record['og-image'] = want['og-image'];

  for (const c of cards) {
    const out = pngPath(c.name);
    mkdirSync(dirname(out), { recursive: true });
    await page.setContent(cardHtml(c), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    // Re-fit once the face has loaded: Fraunces is wider than the fallback.
    await page.evaluate(() => {
      const el = document.getElementById('t'), box = el.parentElement;
      for (let s = 76; s >= 34; s -= 2) { el.style.fontSize = s + 'px'; if (el.scrollHeight <= box.clientHeight) break; }
    });
    await page.screenshot({ path: out, type: 'jpeg', quality: 88 });
    record[c.name] = want[c.name];
  }
  await browser.close();
  writeFileSync(RECORD, JSON.stringify(record, null, 2) + '\n');
  console.log(`Drew ${Object.keys(record).length} cards.`);
}

if (process.argv.includes('--check')) check();
else await render();
