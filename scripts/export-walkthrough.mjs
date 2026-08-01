#!/usr/bin/env node
/**
 * export-walkthrough.mjs — regenerate the downloadable PDF/PPTX exports of the
 * walkthrough decks from the live HTML (walkthrough/deck.html + full.html), so
 * the downloads can never drift from what the site shows.
 *
 * Usage:
 *   1. Serve the repo root:  python3 -m http.server 8123
 *   2. node scripts/export-walkthrough.mjs [--base http://localhost:8123]
 *
 * Requires: playwright-core (npm i -g playwright-core, or NODE_PATH to a copy)
 * with a Chromium binary (CHROME_PATH env var, or the Playwright default), and
 * Python 3 with img2pdf + python-pptx for the assembly step.
 *
 * Writes per deck: a JPEG per slide (temp), then
 *   walkthrough/JanVayu_Walkthrough.pdf / .pptx        (short deck, one slide per page,
 *   walkthrough/JanVayu_Full_Walkthrough.pdf / .pptx    speaker notes included in the PPTX)
 *
 * The two JanVayu_MMSF_* files are NOT touched: they are a separate,
 * fellowship-specific Google Slides deck whose source is not in this repo.
 */

import { mkdirSync, writeFileSync, rmSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const BASE = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'http://localhost:8123';
const CHROME = process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

// playwright-core need not be installed next to this repo — point
// PLAYWRIGHT_CORE_PATH at any copy (its package dir or entry file).
const pwPath = process.env.PLAYWRIGHT_CORE_PATH;
const pwEntry = pwPath
    ? (await import('node:url')).pathToFileURL(
        statSync(pwPath).isDirectory() ? join(pwPath, 'index.js') : pwPath).href
    : 'playwright-core';
// playwright-core's entry is CommonJS, so a by-path import exposes it as
// `default` rather than as named exports — accept either shape.
const pw = await import(pwEntry);
const chromium = pw.chromium ?? pw.default?.chromium;
if (!chromium) throw new Error(`Could not load playwright-core from ${pwEntry}`);

const DECKS = [
    { page: 'deck.html', out: 'JanVayu_Walkthrough', title: 'JanVayu — Walkthrough (short deck)' },
    { page: 'full.html', out: 'JanVayu_Full_Walkthrough', title: 'JanVayu — The Complete Tour' },
];

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1.5 });

// In sandboxed environments Chromium may not reach external hosts directly;
// tunnel non-local requests through Node's fetch (honours HTTPS_PROXY with
// NODE_USE_ENV_PROXY=1). Decks are self-hosted, so this is belt-and-braces.
await page.route(u => !/^(localhost|127\.)/.test(new URL(u).hostname), async (route) => {
    try {
        const req = route.request();
        const resp = await fetch(req.url(), { method: req.method(), headers: req.headers() });
        const headers = Object.fromEntries([...resp.headers].filter(([k]) =>
            !['content-encoding', 'content-length', 'transfer-encoding'].includes(k.toLowerCase())));
        await route.fulfill({ status: resp.status, headers, body: Buffer.from(await resp.arrayBuffer()) });
    } catch { await route.abort('failed'); }
});

for (const deck of DECKS) {
    const shotDir = join(tmpdir(), `janvayu-deck-${deck.out}`);
    rmSync(shotDir, { recursive: true, force: true });
    mkdirSync(shotDir, { recursive: true });

    await page.goto(`${BASE}/walkthrough/${deck.page}#/1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    // Hide the on-screen presentation chrome (keyboard hints, pager HUD) —
    // it belongs to the interactive deck, not to a printed slide.
    await page.addStyleTag({ content: '.hint, .hud { display: none !important; }' });
    const count = await page.evaluate(() => document.querySelectorAll('section.slide').length);
    console.log(`${deck.page}: ${count} slides`);

    // Speaker notes are read from the rendered notes pane per slide (both decks
    // write the current slide's note into #noteBody on every render) — the raw
    // arrays (NOTES / FULL_SLIDES) are closure-scoped in deck.html, so the DOM
    // is the only reliable place to read them from.
    const notes = [];
    for (let i = 1; i <= count; i++) {
        await page.evaluate((n) => { location.hash = '#/' + n; }, i);
        await page.waitForTimeout(i === 1 ? 800 : 350);
        notes.push(await page.evaluate(() =>
            (document.getElementById('noteBody')?.textContent ||
             document.querySelector('.notes .note-body, .note-body')?.textContent || '').trim()));
        await page.screenshot({ path: join(shotDir, `slide-${String(i).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 88 });
    }
    if (notes.every(n => !n)) console.warn(`  WARNING: no speaker notes found for ${deck.page}`);

    // Assemble PDF + PPTX in one Python pass (img2pdf keeps JPEGs lossless-wrapped).
    const py = `
import glob, img2pdf, json, sys
from pptx import Presentation
from pptx.util import Emu

shots = sorted(glob.glob(${JSON.stringify(shotDir)} + '/slide-*.jpg'))
notes = json.loads(sys.argv[1])
with open(${JSON.stringify(join(ROOT, 'walkthrough', deck.out + '.pdf'))}, 'wb') as f:
    f.write(img2pdf.convert(shots))
prs = Presentation()
prs.slide_width, prs.slide_height = Emu(12192000), Emu(6858000)  # 16:9
blank = prs.slide_layouts[6]
for i, shot in enumerate(shots):
    slide = prs.slides.add_slide(blank)
    slide.shapes.add_picture(shot, 0, 0, width=prs.slide_width, height=prs.slide_height)
    if i < len(notes) and notes[i]:
        slide.notes_slide.notes_text_frame.text = notes[i]
prs.save(${JSON.stringify(join(ROOT, 'walkthrough', deck.out + '.pptx'))})
print('assembled', len(shots), 'slides')
`;
    writeFileSync(join(shotDir, 'assemble.py'), py);
    execFileSync('python3', [join(shotDir, 'assemble.py'), JSON.stringify(notes)], { stdio: 'inherit' });
    rmSync(shotDir, { recursive: true, force: true });
}

await browser.close();
console.log('Done — walkthrough exports refreshed.');
