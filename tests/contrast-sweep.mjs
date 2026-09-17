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

import { chromium } from '/opt/node22/lib/node_modules/playwright-core/index.mjs';
import { readFileSync, writeFileSync } from 'node:fs';

const PANELS = readFileSync(new URL('./contrast-sweep-panels.txt', import.meta.url), 'utf8').trim().split('\n');
const THEMES = ['light', 'dark'];

const SWEEP = `(() => {
  function lin(c){c/=255;return c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4}
  function rgb(s){const m=(s||'').match(/[\\d.]+/g);return m?m.slice(0,3).map(Number):null}
  function alpha(s){const m=(s||'').match(/[\\d.]+/g);return m&&m.length>3?Number(m[3]):1}
  function L(c){return 0.2126*lin(c[0])+0.7152*lin(c[1])+0.0722*lin(c[2])}
  function cr(a,b){const x=L(a),y=L(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05)}
  function over(fg,fa,bg){return fg.map((v,i)=>fa*v+(1-fa)*bg[i])}
  // Returns the effective background, or null when it cannot be known: a
  // gradient, an image or a backdrop-filter makes the colour behind the text
  // something getComputedStyle does not report, and guessing there produced
  // 'white on white' for every gradient button on the site.
  function bgOf(el){
    let e=el;
    while(e && e.nodeType===1){
      const cs=getComputedStyle(e);
      if(cs.backgroundImage && cs.backgroundImage!=='none') return null;
      const c=rgb(cs.backgroundColor), a=alpha(cs.backgroundColor);
      if(c && a>=1) return c;
      e=e.parentElement;
    }
    return [255,255,255];
  }
  const out=[];
  const seen=new Set();
  for(const el of document.querySelectorAll('body *')){
    const cs=getComputedStyle(el);
    if(cs.display==='none'||cs.visibility==='hidden'||cs.opacity==='0') continue;
    const r=el.getBoundingClientRect();
    if(r.width<2||r.height<2) continue;
    // Only elements with their own visible text.
    const own=[...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join(' ').trim();
    if(!own) continue;
    // SVG text paints with fill, not color. Reading cs.color here reported
    // the inherited theme ink for every label in the hand-drawn diagrams and
    // produced 1,900 phantom failures. The SVG pass below handles them.
    if(el.namespaceURI==='http://www.w3.org/2000/svg') continue;
    const fg=rgb(cs.color); if(!fg) continue;
    const fa=alpha(cs.color)*Number(cs.opacity||1);
    const bg=bgOf(el); if(!bg) continue;
    const eff=fa<1?over(fg,fa,bg):fg;
    const ratio=cr(eff,bg);
    const size=parseFloat(cs.fontSize);
    const weight=parseInt(cs.fontWeight)||400;
    const large=size>=24||(size>=18.66&&weight>=700);
    const need=large?3.0:4.5;
    if(ratio>=need) continue;
    const key=el.className+'|'+own.slice(0,40)+'|'+cs.color;
    if(seen.has(key)) continue; seen.add(key);
    out.push({ text: own.slice(0,60), cls: (typeof el.className==='string'&&el.className?el.className.slice(0,44):(el.getAttribute&&el.getAttribute('class'))||el.tagName),
               tag: el.tagName, color: cs.color, bg: 'rgb('+bg.map(Math.round).join(',')+')',
               ratio: +ratio.toFixed(2), size: +size.toFixed(1), weight, need, opacity: cs.opacity });
  }
  // SVG text uses fill, which the loop above misses when color is inherited.
  for(const t of document.querySelectorAll('svg text, svg tspan')){
    const cs=getComputedStyle(t);
    const fg=rgb(cs.fill)||rgb(cs.color); if(!fg) continue;
    const r=t.getBoundingClientRect(); if(r.width<2||r.height<2) continue;
    const bg=bgOf(t.closest('svg')?.parentElement||document.body); if(!bg) continue;
    const ratio=cr(fg,bg);
    const size=parseFloat(cs.fontSize)||12;
    const need=size>=24?3.0:4.5;
    if(ratio>=need) continue;
    const txt=(t.textContent||'').trim(); if(!txt) continue;
    const key='svg|'+txt.slice(0,40)+'|'+cs.fill;
    if(seen.has(key)) continue; seen.add(key);
    out.push({ text: txt.slice(0,60), cls:'SVG text', tag:'text', color: cs.fill,
               bg:'rgb('+bg.map(Math.round).join(',')+')', ratio:+ratio.toFixed(2),
               size:+size.toFixed(1), weight:400, need, opacity: cs.opacity });
  }
  return out;
})()`;

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
      const hits = await p.evaluate(SWEEP);
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
