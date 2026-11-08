#!/usr/bin/env node
// Does what the site calls "live" agree, roughly, with what CPCB says about the same city?
//
// On 8 November 2026 a Bengaluru reader was shown AQI 221 ("Very Unhealthy") from a station
// in Delhi, while CPCB's bulletin put Bengaluru at AQI 62, Satisfactory. Every check the site
// had passed, because each one looked at the site's own data. This compares two independent
// sources: the live reading the site serves for a tracked city, and CPCB's daily bulletin for
// the same city (data/cpcb-latest.json).
//
// They are not the same quantity: the live reading is an instant, the bulletin is a 24-hour
// figure on CPCB's scale, and a station is not a city. So the test is deliberately loose. The live
// PM2.5 is converted to CPCB's PM2.5 band and compared with the bulletin's category; a gap of two
// bands or more (for example live "Very Poor" against bulletin "Satisfactory") is a fault, a gap
// of one is weather. The Delhi-for-Bengaluru fault was a gap of three.
//
//   node scripts/audit-live-vs-cpcb.mjs                       # production
//   node scripts/audit-live-vs-cpcb.mjs https://example.org   # another base URL
//
// It needs the network, so it runs on a schedule (.github/workflows/live-audit.yml) and not on
// pull requests. Exit 1 on any fault; a city with no live reading is reported and is not a fault.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { iaqiToPM25 } from '../netlify/functions/lib/iaqi.mjs';

export const BANDS = ['Good', 'Satisfactory', 'Moderate', 'Poor', 'Very Poor', 'Severe'];

// CPCB's PM2.5 breakpoints for the 24-hour average, in µg/m³: the upper edge of each band.
const PM25_UPPER = [30, 60, 90, 120, 250, Infinity];

export function pm25Band(ugm3) {
  const i = PM25_UPPER.findIndex((u) => ugm3 <= u);
  return i < 0 ? BANDS.length - 1 : i;
}

export function bulletinBand(category) {
  const i = BANDS.findIndex((b) => b.toLowerCase() === String(category).toLowerCase());
  return i < 0 ? null : i;
}

// live: { pm25 (µg/m³) }, bulletin: { category }. Returns { liveBand, bulletinBand, gap, fault }.
export function compare(live, bulletin, maxGap = 2) {
  const lb = pm25Band(live.pm25);
  const bb = bulletinBand(bulletin.category);
  if (bb === null) return { liveBand: lb, bulletinBand: null, gap: null, fault: false };
  const gap = Math.abs(lb - bb);
  return { liveBand: lb, bulletinBand: bb, gap, fault: gap >= maxGap };
}

const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const ALIASES = { gurgaon: 'gurugram', aurangabad: 'aurangabadmaharashtra', mangaluru: 'mangalore', belagavi: 'belgaum', kalyandombivli: 'kalyan', nandedwaghala: 'nanded' };

export function trackedCities(appJs) {
  const re = /^\s{8}(\w+):\s*\{\s*name:\s*'([^']*)',\s*lat:\s*([-\d.]+),\s*lon:\s*([-\d.]+)(.*?)\}/gm;
  const out = [];
  for (let m; (m = re.exec(appJs));) out.push({ key: m[1], name: m[2], lat: +m[3], lon: +m[4], ext: /ext:\s*true/.test(m[5]) });
  // These become part of a request URL, so only well-formed values go on: a slug of letters,
  // digits and hyphens and a point inside the subcontinent. Anything else is dropped, not escaped.
  return out.filter((c) => /^[a-z0-9-]{1,60}$/i.test(c.key) && Number.isFinite(c.lat) && Number.isFinite(c.lon) &&
    c.lat >= 5 && c.lat <= 60 && c.lon >= -10 && c.lon <= 130);
}

async function main() {
  const base = (process.argv[2] || 'https://www.janvayu.in').replace(/\/$/, '');
  // The script sends requests to whatever base it is given, so it accepts only JanVayu's own
  // origins: production, a Netlify deploy preview of this site, or a local server.
  if (!/^(https:\/\/([a-z0-9-]+\.)?janvayu\.in|https:\/\/[a-z0-9-]+--janvayu\.netlify\.app|http:\/\/localhost:\d+)$/i.test(base)) {
    console.error(`Refusing to audit ${base}: not a JanVayu origin.`);
    process.exit(2);
  }
  const root = new URL('..', import.meta.url);
  const cities = trackedCities(readFileSync(new URL('app.js', root), 'utf8')).filter((c) => !c.ext && !/^(beijing|london|singapore)$/.test(c.key));
  const latest = JSON.parse(readFileSync(new URL('data/cpcb-latest.json', root), 'utf8'));
  const rows = [];
  for (const c of cities) {
    const url = `${base}/.netlify/functions/waqi-proxy?near=${c.lat.toFixed(4)},${c.lon.toFixed(4)}&slug=${encodeURIComponent(c.key)}`;
    let j = null;
    try { j = await (await fetch(url, { signal: AbortSignal.timeout(20000) })).json(); } catch { /* reported below */ }
    const entry = latest.cities[norm(c.name)] || latest.cities[ALIASES[norm(c.key)]] || latest.cities[ALIASES[norm(c.name)]];
    const day = entry && entry.days && entry.days[0];
    if (!j || j.status !== 'ok') { rows.push({ c, state: 'no live reading', day }); continue; }
    const pm = iaqiToPM25(j.data.iaqi && j.data.iaqi.pm25 && j.data.iaqi.pm25.v);
    const jv = j.jv || {};
    const problems = [];
    // The proxy already refuses these; seeing one here means the guard is broken.
    if (jv.distance_km == null || jv.distance_km > 30) problems.push(`station ${jv.distance_km} km away`);
    if (jv.age_hours == null || jv.age_hours > 6) problems.push(`reading ${jv.age_hours} h old`);
    if (pm == null) { rows.push({ c, state: 'live, no PM2.5', day, problems }); continue; }
    if (!day) { rows.push({ c, state: 'live, no bulletin to compare', pm, problems }); continue; }
    const r = compare({ pm25: pm }, day);
    if (r.fault) problems.push(`live PM2.5 ${Math.round(pm)} µg/m³ is ${BANDS[r.liveBand]}, CPCB's bulletin says ${day.category} (${r.gap} bands apart)`);
    rows.push({ c, state: 'live', pm, day, problems, station: j.data.city && j.data.city.name });
  }
  const faults = rows.filter((r) => r.problems && r.problems.length);
  const live = rows.filter((r) => r.state === 'live');
  console.log(`Checked ${rows.length} tracked cities against ${base}: ${live.length} with a live reading, ${rows.filter((r) => r.state === 'no live reading').length} with none.`);
  for (const r of rows) {
    const b = r.day ? `bulletin ${r.day.date} ${r.day.category} ${r.day.aqi}` : 'no bulletin';
    console.log(`${r.problems && r.problems.length ? 'FAULT' : '  ok '}  ${r.c.name.padEnd(20)} ${r.state.padEnd(30)} ${r.pm != null ? Math.round(r.pm) + ' µg/m³ ' : ''}${b}${r.problems && r.problems.length ? '  <- ' + r.problems.join('; ') : ''}`);
  }
  if (faults.length) { console.error(`\n${faults.length} city/cities where the live reading disagrees with CPCB or breaks the guard.`); process.exit(1); }
  if (!live.length) console.log('\nNote: no city has a live reading. That is not a fault of this check, but the site is showing fallbacks everywhere.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
