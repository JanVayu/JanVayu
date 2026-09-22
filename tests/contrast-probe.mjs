// contrast-probe.mjs — the measurement itself, in one place.
//
// This function is handed to Playwright and runs inside the page. Both
// tests/contrast-sweep.mjs (the hand explorer) and tests/contrast-ci.mjs (the
// PR gate) import it, so the two cannot drift into disagreeing about what a
// failure is.
//
// It used to live as a template-literal STRING inside contrast-sweep.mjs, and
// the CI runner lifted that string out with a regex. That looked harmless and
// was not: inside a template literal `/[\\d.]+/` is written with the
// backslash doubled, so the raw file text carries `\\d` and the recovered
// regex matched "a backslash or a dot" rather than "a digit". Every colour
// then parsed as NaN, every background fell through to white, and the gate
// reported white-on-white failures that were not there. Passing the function
// itself removes the escaping layer entirely.
//
// Three traps worth knowing if you extend it, each of which produced hundreds
// of phantom failures before being fixed:
//   * SVG <text> paints with `fill`, not `color`. Reading cs.color there
//     reported the inherited theme ink for 1,900 diagram labels.
//   * A gradient or image background cannot be read from getComputedStyle, so
//     the background is unknowable and the element must be skipped, not
//     guessed at. Guessing produced "white on white" for every gradient button.
//   * `opacity` and alpha in the colour both have to be composited before
//     measuring, or a faded element reads as if it were fully opaque.

export function sweepPage() {
  function lin(c){c/=255;return c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4}
  function rgb(s){const m=(s||'').match(/[\d.]+/g);return m?m.slice(0,3).map(Number):null}
  function alpha(s){const m=(s||'').match(/[\d.]+/g);return m&&m.length>3?Number(m[3]):1}
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
}
