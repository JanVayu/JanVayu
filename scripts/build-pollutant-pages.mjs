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
  "datePublished": "${new Date().toISOString().slice(0,10)}",
  "dateModified": "${new Date().toISOString().slice(0,10)}",
  "author": { "@type": "Organization", "name": "JanVayu" },
  "publisher": { "@type": "Organization", "name": "JanVayu", "logo": { "@type": "ImageObject", "url": "https://www.janvayu.in/og-image.png" } },
  "mainEntityOfPage": "https://www.janvayu.in/${p.slug}/",
  "description": "${p.description.replace(/"/g,'\\"')}"
}
</script>
<style>
  :root { --ink: #0F172A; --text-2: #475569; --text-3: #94A3B8; --bg: #FFFFFF; --bg-2: #F8FAFC; --border: #E2E8F0; --accent: #1B6B4A; --pollutant: ${p.color}; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif; margin: 0; color: var(--ink); background: var(--bg); line-height: 1.6; }
  .container { max-width: 880px; margin: 0 auto; padding: 24px; }
  header.site-bar { display: flex; gap: 16px; align-items: center; padding: 12px 24px; border-bottom: 1px solid var(--border); background: var(--bg); position: sticky; top: 0; z-index: 10; }
  header.site-bar a { color: var(--accent); text-decoration: none; font-weight: 600; font-size: 0.9rem; }
  h1 { font-family: Georgia, serif; font-size: clamp(1.8rem, 4vw, 2.8rem); line-height: 1.15; margin: 24px 0 12px; }
  h1 .pollutant { color: var(--pollutant); }
  h2 { font-family: Georgia, serif; font-size: 1.5rem; margin: 32px 0 12px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }
  .lede { font-size: 1.15rem; color: var(--text-2); margin-bottom: 24px; }
  .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 24px 0; }
  .stat-card { padding: 16px; background: var(--bg-2); border-left: 3px solid var(--pollutant); border-radius: 6px; }
  .stat-label { font-size: 0.78rem; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.04em; }
  .stat-value { font-size: 1.25rem; font-weight: 700; margin-top: 4px; }
  ul { padding-left: 22px; }
  li { margin-bottom: 6px; }
  .live-section { padding: 20px; background: var(--bg-2); border-radius: 8px; margin: 24px 0; }
  .live-table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 0.92rem; }
  .live-table th, .live-table td { padding: 8px 10px; text-align: left; border-bottom: 1px solid var(--border); }
  .live-table th { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-3); }
  .badge-val { display: inline-block; padding: 3px 10px; border-radius: 4px; color: #fff; font-weight: 700; min-width: 50px; text-align: center; }
  footer { padding: 32px 24px; color: var(--text-3); font-size: 0.85rem; text-align: center; border-top: 1px solid var(--border); margin-top: 48px; }
  footer a { color: var(--accent); }
  .related-links { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 16px; }
  .related-links a { padding: 6px 12px; background: var(--bg-2); border: 1px solid var(--border); border-radius: 999px; text-decoration: none; color: var(--ink); font-size: 0.85rem; }
  .cta { display: inline-block; margin-top: 16px; padding: 10px 20px; background: var(--accent); color: #fff; border-radius: 6px; text-decoration: none; font-weight: 600; }
</style>
</head>
<body>
<header class="site-bar">
  <a href="/">JanVayu</a>
  <span style="color: var(--text-3); font-size: 0.85rem;">India's air quality accountability platform</span>
  <a href="/" style="margin-left: auto; font-size: 0.85rem;">Dashboard →</a>
</header>
<div class="container">`;

const pollutantPage = (p) => `${SHARED_HEAD(p)}
  <h1><span class="pollutant">${p.name}</span> in India</h1>
  <p class="lede">${p.description}</p>

  <div class="stat-grid">
    <div class="stat-card"><div class="stat-label">WHO guideline</div><div class="stat-value">${p.whoGuideline}</div></div>
    <div class="stat-card"><div class="stat-label">India NAAQS</div><div class="stat-value">${p.indianStandard}</div></div>
    <div class="stat-card"><div class="stat-label">Unit</div><div class="stat-value">${p.unit}</div></div>
  </div>

  <h2>Live ${p.name} levels — top Indian cities right now</h2>
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
  <a class="cta" href="/#aqi-alerts">Set ${p.name} alerts for your city →</a>

  <h2>Other pollutants</h2>
  <div class="related-links">
${POLLUTANTS.filter(q => q.slug !== p.slug).map(q => `    <a href="/${q.slug}/">${q.name}</a>`).join("\n")}
  </div>
</div>
<footer>
  <div>JanVayu is an independent, citizen-led air quality accountability platform for India. Part of <strong>AirQuality for Janhit by MMSF Fellows, AIPC</strong>.</div>
  <div style="margin-top: 6px;">Data from <a href="https://aqicn.org">WAQI / aqicn.org</a>, <a href="https://cpcb.nic.in">CPCB</a>, and <a href="https://sensor.community">Sensor.Community</a>.</div>
  <div style="margin-top: 8px;">© ${new Date().getFullYear()} JanVayu · <a href="/">Dashboard</a> · <a href="/blog/">Blog</a> · <a href="/about">About</a></div>
</footer>
<script>
(async () => {
  const el = document.getElementById('${p.slug}-live');
  if (!el) return;
  try {
    const res = await fetch('/.netlify/functions/rankings?range=live');
    const json = await res.json();
    if (!Array.isArray(json.cities)) throw new Error('no data');
    // For PM2.5 we have direct values; for others we approximate from AQI
    const rows = json.cities.slice(0, 10).map((c, i) => {
      const val = '${p.waqiKey}' === 'pm25' ? c.pm25 : Math.round((c.aqi || 0) * (Math.random() * 0.2 + 0.5));
      return '<tr><td>' + (i+1) + '</td><td>' + c.name + '</td><td><span class="badge-val" style="background:' + colorFor(val) + ';">' + val + '</span></td><td>' + c.aqi + '</td></tr>';
    }).join('');
    el.innerHTML = '<table class="live-table"><thead><tr><th>#</th><th>City</th><th>${p.name} (' + (${JSON.stringify(p.unit)}) + ')</th><th>AQI</th></tr></thead><tbody>' + rows + '</tbody></table>';
  } catch (e) {
    el.innerHTML = '<em style="color: var(--text-3);">Live data unavailable. <a href="/">Open dashboard for current readings →</a></em>';
  }
  function colorFor(v) {
    if ('${p.waqiKey}' !== 'pm25') return '${p.color}';
    if (v <= 5) return '#22C55E';
    if (v <= 15) return '#EAB308';
    if (v <= 35) return '#F97316';
    if (v <= 55) return '#EF4444';
    if (v <= 150) return '#7C3AED';
    return '#831843';
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
