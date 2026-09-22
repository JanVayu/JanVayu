#!/usr/bin/env node
// Build per-pollutant SEO pages (PM2.5, PM10, CO, NO2, SO2, O3) into /pm25/, /pm10/, etc.
// Each page is static, fetches live readings client-side from the rankings function,
// and is fully crawlable by search engines.
//
// Run: node scripts/build-pollutant-pages.mjs

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const POLLUTANTS = [
  {
    slug: "pm25",
    name: "PM2.5",
    fullName: "Fine Particulate Matter (PM2.5)",
    unit: "µg/m³",
    color: "#7C3AED",
    whoGuideline: "5 µg/m³ annual mean",
    indianStandard: "40 µg/m³ annual (NAAQS)",
    description: "Fine particulate matter smaller than 2.5 micrometres in diameter. Small enough to penetrate deep into the lungs and bloodstream — the most lethal of common air pollutants.",
    sources: ["Vehicle exhaust (especially diesel)", "Coal-fired power plants", "Brick kilns and industrial furnaces", "Stubble burning (Punjab/Haryana, Oct–Nov)", "Construction dust", "Household biomass cooking"],
    healthEffects: ["Premature death from heart and lung disease", "Stroke and heart attack", "Lung cancer", "Reduced lung development in children", "Pre-term birth and low birth weight", "Aggravated asthma and COPD"],
    waqiKey: "pm25",
  },
  {
    slug: "pm10",
    name: "PM10",
    fullName: "Coarse Particulate Matter (PM10)",
    unit: "µg/m³",
    color: "#F97316",
    whoGuideline: "15 µg/m³ annual mean",
    indianStandard: "60 µg/m³ annual (NAAQS)",
    description: "Particulate matter smaller than 10 micrometres — including dust, pollen, mould, and construction debris. Penetrates the upper respiratory tract.",
    sources: ["Road dust (a dominant contributor in Indian cities)", "Construction and demolition", "Open burning of waste", "Industrial process emissions", "Sandstorms and natural dust", "Tyre and brake wear"],
    healthEffects: ["Aggravated asthma and bronchitis", "Reduced lung function", "Eye, nose and throat irritation", "Increased respiratory infections in children", "Premature death in people with heart or lung disease"],
    waqiKey: "pm10",
  },
  {
    slug: "co",
    name: "CO",
    fullName: "Carbon Monoxide (CO)",
    unit: "mg/m³",
    color: "#EF4444",
    whoGuideline: "4 mg/m³ (24 hour mean)",
    indianStandard: "2 mg/m³ (8 hour mean)",
    description: "Colourless, odourless gas produced when fuels burn incompletely. Binds to haemoglobin and reduces the oxygen-carrying capacity of blood.",
    sources: ["Petrol and diesel vehicles (especially in traffic)", "Generators and diesel pumps", "Open biomass burning", "Industrial combustion", "Faulty domestic gas appliances"],
    healthEffects: ["Confusion, dizziness and impaired vision", "Reduced exercise tolerance", "Worsens cardiovascular disease", "Fatal at very high concentrations", "Pregnancy: reduced foetal oxygen supply"],
    waqiKey: "co",
  },
  {
    slug: "no2",
    name: "NO₂",
    fullName: "Nitrogen Dioxide (NO₂)",
    unit: "µg/m³",
    color: "#3B82F6",
    whoGuideline: "10 µg/m³ annual mean",
    indianStandard: "40 µg/m³ annual (NAAQS)",
    description: "Reddish-brown gas produced by high-temperature combustion. A key marker of vehicular pollution and a precursor to ozone and PM2.5.",
    sources: ["Diesel vehicles", "Coal and gas power plants", "Industrial boilers", "Gas stoves and kerosene heaters indoors"],
    healthEffects: ["Inflammation of airways", "Increased asthma attacks in children", "Reduced lung development", "Increased susceptibility to respiratory infections"],
    waqiKey: "no2",
  },
  {
    slug: "so2",
    name: "SO₂",
    fullName: "Sulphur Dioxide (SO₂)",
    unit: "µg/m³",
    color: "#EAB308",
    whoGuideline: "40 µg/m³ (24 hour mean)",
    indianStandard: "80 µg/m³ (24 hour mean)",
    description: "Sharp-smelling gas from burning sulphur-containing fuels — primarily coal. India is the world's largest emitter of SO₂.",
    sources: ["Coal-fired power plants (largest source)", "Oil refineries", "Metal smelters", "Diesel vehicles"],
    healthEffects: ["Constriction of airways and breathing difficulty", "Severe symptoms in asthmatics", "Eye, nose and throat irritation", "Contributes to PM2.5 formation downwind"],
    waqiKey: "so2",
  },
  {
    slug: "o3",
    name: "O₃",
    fullName: "Ground-level Ozone (O₃)",
    unit: "µg/m³",
    color: "#22C55E",
    whoGuideline: "60 µg/m³ peak season",
    indianStandard: "100 µg/m³ (8 hour mean)",
    description: "Not emitted directly — formed when NO₂ and volatile organic compounds react in sunlight. Worst in summer afternoons. Different from the protective ozone layer.",
    sources: ["Vehicle exhaust (NO₂ + VOCs)", "Industrial solvents and paints", "Petrol vapours from refuelling", "Strong sunlight + high temperatures (precursor reaction)"],
    healthEffects: ["Coughing and sore throat", "Reduced lung function during outdoor activity", "Aggravated asthma", "Damages lung tissue with long-term exposure"],
    waqiKey: "o3",
  },
];

// Every pollutant carries a token name rather than a hex. The old template set
// --pollutant to a raw literal from the POLLUTANTS table and painted headings
// and table badges with it, which is the mistake styles.css documents at
// length: a colour written as a literal cannot know which theme it landed in.
// #7C3AED on the light page is 5.5:1 and on the dark page 2.8:1.
const INK = {
  pm25: "var(--ink-violet)",
  pm10: "var(--ink-orange)",
  co:   "var(--ink-slate)",
  no2:  "var(--ink-blue)",
  so2:  "var(--ink-amber)",
  o3:   "var(--ink-teal)",
};

const SHARED_HEAD = (p) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${p.name} — sources, health effects, India levels | JanVayu</title>
<meta name="description" content="${p.fullName}: what it is, where it comes from, how it harms health, and which Indian cities have the worst ${p.name} levels right now. WHO guideline: ${p.whoGuideline}.">
<meta name="keywords" content="${p.name}, ${p.fullName}, air pollution India, ${p.name} levels, ${p.name} health effects, AQI India">
<link rel="canonical" href="https://www.janvayu.in/${p.slug}/">
<meta property="og:title" content="${p.name} in India — JanVayu">
<meta property="og:description" content="${p.description.slice(0,180)}">
<meta property="og:image" content="https://www.janvayu.in/og-image.png">
<meta property="og:url" content="https://www.janvayu.in/${p.slug}/">
<meta property="og:type" content="article">
<link rel="icon" href="/favicon.svg">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${p.fullName}: sources, health effects, and India levels",
  "datePublished": "2026-04-26",
  "dateModified": "${new Date().toISOString().slice(0,10)}",
  "author": { "@type": "Organization", "name": "JanVayu" },
  "publisher": { "@type": "Organization", "name": "JanVayu", "logo": { "@type": "ImageObject", "url": "https://www.janvayu.in/og-image.png" } },
  "mainEntityOfPage": "https://www.janvayu.in/${p.slug}/",
  "description": "${p.description.replace(/"/g,'\\"')}"
}
</script>
<link rel="stylesheet" href="/styles.css?v=202606231">
<script>try{if(localStorage.getItem('janvayu-theme')==='dark')document.documentElement.setAttribute('data-theme','dark');}catch(e){}</script>
<script src="/js/chrome.js?v=202606231" defer></script>
<style>
  /* Page-specific only. Everything structural -- tokens, type, .card, .bar,
     .ctl -- comes from styles.css, so a change there now reaches this page. */
  :root { --pollutant: ${INK[p.slug]}; }
  .pollutant-page { max-width: 880px; }
  .pollutant-page h1 { font-family: var(--serif); font-size: clamp(1.8rem, 4vw, 2.8rem); line-height: 1.15; margin: 24px 0 12px; }
  .pollutant-page h1 .pollutant { color: var(--pollutant); }
  .pollutant-page h2 { font-family: var(--serif); font-size: 1.5rem; margin: 32px 0 12px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }
  .pollutant-page .lede { font-size: 1.15rem; color: var(--text-2); margin-bottom: 24px; }
  .pollutant-page .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 24px 0; }
  .pollutant-page .stat-card { padding: 16px; background: var(--bg-section); border-left: 3px solid var(--pollutant); }
  .pollutant-page .stat-label { font-family: var(--mono); font-size: 0.72rem; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.08em; }
  .pollutant-page .stat-value { font-size: 1.25rem; font-weight: 700; margin-top: 4px; }
  .pollutant-page li { margin-bottom: 6px; }
  .pollutant-page .live-section { padding: 20px; background: var(--bg-section); border: 1px solid var(--border); margin: 24px 0; }
  .pollutant-page .live-table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 0.92rem; }
  .pollutant-page .live-table th, .pollutant-page .live-table td { padding: 8px 10px; text-align: left; border-bottom: 1px solid var(--border); }
  .pollutant-page .live-table th { font-family: var(--mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-3); }
  .pollutant-page .live-table td.num { font-family: var(--mono); text-align: right; }
  .pollutant-page .est { color: var(--text-3); font-style: normal; }
  .pollutant-page .related-links { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 16px; }
  .pollutant-page .related-links a { padding: 8px 14px; background: var(--bg-section); border: 1px solid var(--border); text-decoration: none; color: var(--text); font-size: 0.85rem; }
  .pollutant-page .related-links a:hover { border-color: var(--ink); }
  .pollutant-page .note { font-size: 0.85rem; color: var(--text-3); margin-top: 10px; }
  .pollutant-foot { padding: 32px 0; color: var(--text-3); font-size: 0.85rem; border-top: 1px solid var(--border); margin-top: 48px; }
  .pollutant-foot a { color: var(--accent); }
</style>
</head>
<body data-jv-chrome>
<main class="container pollutant-page" id="main-content">`;

// The live table, and why it prints a sub-index rather than a concentration.
//
// Until 2026-09-22 this template computed, for every pollutant except PM2.5:
//
//     Math.round((c.aqi || 0) * (Math.random() * 0.2 + 0.5))
//
// A random number between half and seven-tenths of the city's overall AQI,
// redrawn on every page load, printed in a column headed with a real unit
// (ug/m3, mg/m3) under the heading "Live <pollutant> levels". Five of the six
// published pages carried fabricated concentrations and nothing on the page
// said so; two loads of the same page disagreed with each other.
//
// It could not be fixed by reading the right field, because there is no right
// field: the rankings feed returns aqi and pm25 and nothing else per city.
// rankings.mjs now also returns `sub`, the per-pollutant US-EPA sub-index
// exactly as WAQI reports it, and converts PM2.5 and PM10 to ug/m3 with the
// EPA breakpoint tables. NO2, SO2, O3 and CO are not converted: EPA's
// breakpoints for those are in ppb and ppm over differing averaging windows,
// and reaching the ug/m3 that India's NAAQS is written in needs an assumed
// temperature and pressure. So the page shows the sub-index, says it is a
// scale rather than a concentration, and lists only cities whose stations
// actually report the pollutant.

const pollutantPage = (p) => `${SHARED_HEAD(p)}
  <h1><span class="pollutant">${p.name}</span> in India</h1>
  <p class="lede">${p.description}</p>

  <div class="stat-grid">
    <div class="stat-card"><div class="stat-label">WHO guideline</div><div class="stat-value">${p.whoGuideline}</div></div>
    <div class="stat-card"><div class="stat-label">India NAAQS</div><div class="stat-value">${p.indianStandard}</div></div>
    <div class="stat-card"><div class="stat-label">Unit</div><div class="stat-value">${p.unit}</div></div>
  </div>

  <h2>Live ${p.name} levels — Indian cities right now</h2>
  <div class="live-section">
    <div id="${p.slug}-live"><em style="color: var(--text-3);">Loading live data…</em></div>
  </div>

  <h2>Where ${p.name} comes from</h2>
  <ul>
${p.sources.map(s => `    <li>${s}</li>`).join("\n")}
  </ul>

  <h2>How ${p.name} harms human health</h2>
  <ul>
${p.healthEffects.map(s => `    <li>${s}</li>`).join("\n")}
  </ul>

  <h2>What you can do</h2>
  <p>Reduce personal exposure with N95 masks during peak hours, run a HEPA purifier indoors, and switch to clean transport where possible. Push for systemic change: file an RTI, attend NCAP city consultations, demand transparent station data from your municipality.</p>
  <a class="btn btn-primary" href="/#aqi-alerts">Set ${p.name} alerts for your city</a>

  <h2>Other pollutants</h2>
  <div class="related-links">
${POLLUTANTS.filter(q => q.slug !== p.slug).map(q => `    <a href="/${q.slug}/">${q.name}</a>`).join("\n")}
  </div>

<footer class="pollutant-foot">
  <div>JanVayu is an independent, citizen-led air quality accountability platform for India. Part of <strong>AirQuality for Janhit by MMSF Fellows, AIPC</strong>.</div>
  <div style="margin-top: 6px;">Data from <a href="https://aqicn.org">WAQI / aqicn.org</a>, <a href="https://cpcb.nic.in">CPCB</a>, and <a href="https://sensor.community">Sensor.Community</a>.</div>
  <div style="margin-top: 8px;">© ${new Date().getFullYear()} JanVayu · <a href="/">Dashboard</a> · <a href="/blog/">Blog</a> · <a href="/about">About</a></div>
</footer>
</main>
<script>
(async () => {
  const el = document.getElementById('${p.slug}-live');
  if (!el) return;
  const SLUG = ${JSON.stringify(p.slug)};
  const NAME = ${JSON.stringify(p.name)};
  const UNIT = ${JSON.stringify(p.unit)};

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  try {
    const res = await fetch('/.netlify/functions/rankings?range=live');
    const json = await res.json();
    if (!Array.isArray(json.cities)) throw new Error('no data');

    // Shows what the feed actually carries: each pollutant's own sub-index.
    // PM2.5 and PM10 also get a concentration. See build-pollutant-pages.mjs.
    const hasConc = SLUG === 'pm25' || SLUG === 'pm10';
    const rows = json.cities
      .map(c => ({ c, sub: c.sub ? c.sub[SLUG] : null }))
      .filter(r => r.sub != null)
      .sort((a, b) => b.sub - a.sub)
      .slice(0, 10);

    if (rows.length === 0) {
      el.innerHTML = '<em style="color: var(--text-3);">No city in the live feed is reporting ' + esc(NAME) +
        ' right now. Not every monitoring station measures every pollutant. ' +
        '<a href="/">Open the dashboard for current readings</a></em>';
      return;
    }

    const body = rows.map((r, i) => {
      const conc = hasConc ? (SLUG === 'pm25' ? r.c.pm25 : r.c.pm10) : null;
      const est = hasConc && SLUG === 'pm25' && r.c.estimated;
      return '<tr><td class="num">' + (i + 1) + '</td><td>' + esc(r.c.name) + '</td>' +
        '<td class="num">' + r.sub + '</td>' +
        (hasConc ? '<td class="num">' + (conc == null ? '<span class="est">not reported</span>'
          : conc + (est ? ' <span class="est">(est.)</span>' : '')) + '</td>' : '') +
        '<td class="num">' + esc(r.c.aqi) + '</td></tr>';
    }).join('');

    el.innerHTML = '<table class="live-table"><thead><tr>' +
      '<th>#</th><th>City</th><th>' + esc(NAME) + ' sub-index</th>' +
      (hasConc ? '<th>' + esc(NAME) + ' (' + esc(UNIT) + ')</th>' : '') +
      '<th>Overall AQI</th></tr></thead><tbody>' + body + '</tbody></table>' +
      '<p class="note">The sub-index is this pollutant\\'s own US-EPA AQI, which is what the ' +
      'monitoring feed reports; it is a scale, not a concentration. ' +
      (hasConc ? 'The ' + esc(UNIT) + ' column is converted from it with the EPA breakpoint table. '
               : 'Converting it to ' + esc(UNIT) + ' would need an assumed temperature and pressure, so it is not shown. ') +
      'Only cities whose stations report ' + esc(NAME) + ' appear here.</p>';
  } catch (e) {
    el.innerHTML = '<em style="color: var(--text-3);">Live data unavailable. <a href="/">Open dashboard for current readings</a></em>';
  }
})();
</script>
</body>
</html>
`;

for (const p of POLLUTANTS) {
  const dir = join(ROOT, p.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), pollutantPage(p));
  console.log("Built /" + p.slug + "/index.html");
}
console.log("Done. Built", POLLUTANTS.length, "pollutant pages.");
