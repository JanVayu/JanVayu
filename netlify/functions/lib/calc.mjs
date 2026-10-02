// JanVayu deterministic calculators — the single source of truth.
//
// These pure functions back the Ask JanVayu chatbot's "(computed)" answers and
// are unit-tested in test/calc.test.mjs. Each returns its result plus a
// primary-source citation string; the LLM is instructed to use the numbers
// verbatim. Keep every formula here so behaviour can't drift between callers.

// Berkeley Earth: 22 µg/m³·day of PM2.5 ≈ 1 cigarette.
export function calcCigarettes(pm25) {
  if (!pm25 || pm25 <= 0) return null;
  const perDay = pm25 / 22;
  return {
    perDay: +perDay.toFixed(1),
    perWeek: +(perDay * 7).toFixed(0),
    perYear: +(perDay * 365).toFixed(0),
    source: "Berkeley Earth (22 µg/m³·day ≈ 1 cigarette)",
  };
}

// Jaganathan et al. 2024, Lancet Planetary Health — a district-level
// difference-in-differences estimate: +10 µg/m³ annual PM2.5 → +8.6% all-cause
// mortality (95% CI 6.4-10.8), fitted over observed exposures of about
// 20-72 µg/m³. Applying it linearly above the WHO guideline, as here, goes
// beyond that range at the top end; treat the output as indicative.
export function calcMortalityRisk(pm25) {
  if (!pm25 || pm25 <= 0) return null;
  const aboveWHO = Math.max(0, pm25 - 5);
  const excessPct = (aboveWHO / 10) * 8.6;
  return {
    excessMortalityPct: +excessPct.toFixed(1),
    aboveWHO: +aboveWHO.toFixed(1),
    source: "Jaganathan et al. 2024, Lancet Planetary Health (district-level difference-in-differences estimate, +8.6% per 10 µg/m³; applied linearly, so indicative above about 70 µg/m³)",
  };
}

// AQLI 2025 — each +10 µg/m³ above WHO 5 µg/m³ ≈ -0.98 years life expectancy.
export function calcLifeExpectancyLoss(pm25) {
  if (!pm25 || pm25 <= 0) return null;
  const aboveWHO = Math.max(0, pm25 - 5);
  const yearsLost = (aboveWHO / 10) * 0.98;
  return {
    yearsLost: +yearsLost.toFixed(1),
    aboveWHO: +aboveWHO.toFixed(1),
    source: "AQLI 2025 (UChicago EPIC — 10 µg/m³ above WHO = -0.98 years)",
  };
}

// Migration: compare current city's live PM2.5 vs destination city's live PM2.5.
export function calcMigrationBenefit(currentPm25, destPm25) {
  if (!currentPm25 || !destPm25 || currentPm25 <= 0 || destPm25 <= 0) return null;
  const curLE = calcLifeExpectancyLoss(currentPm25);
  const destLE = calcLifeExpectancyLoss(destPm25);
  const yearsGained = +(curLE.yearsLost - destLE.yearsLost).toFixed(1);
  const cigsSavedPerYear = Math.round(((currentPm25 - destPm25) / 22) * 365);
  return { yearsGained, cigsSavedPerYear, currentLossYears: curLE.yearsLost, destLossYears: destLE.yearsLost };
}

// Transport exposure — multiply ambient PM2.5 by mode/duration.
// Ratios of on-road to ambient PM2.5 concentration from Goel et al. 2015,
// Atmospheric Environment 123 (Delhi, one 8.3 km arterial route, morning rush
// hour, Jan-May 2014): "on-road PM2.5 concentrations exceeded the ambient
// measurements by an average of 40% for walking, 10% for cycle, 30% for
// motorised two wheeler, 30% for open-windowed car, 30% for auto rickshaw, 20%
// for air-conditioned as well as open-windowed bus ... lower by 50% inside
// air-conditioned car and 20% inside the metro rail carriage."
// They are CONCENTRATION ratios, not inhaled-dose ratios (cycling breathes
// harder, which this does not model), and the study's exceedance shrinks as
// ambient rises, so treat the output as indicative. "car" is the air-conditioned,
// windows-up case; there is no sourced ratio for "train", so it is not listed.
export const TRANSPORT_MULTIPLIERS = {
  walk: 1.4, walking: 1.4,
  cycle: 1.1, cycling: 1.1, bicycle: 1.1, bike: 1.1,
  auto: 1.3, "auto-rickshaw": 1.3, rickshaw: 1.3, tuktuk: 1.3,
  car: 0.5, taxi: 0.5, cab: 0.5, uber: 0.5, ola: 0.5,
  metro: 0.8, subway: 0.8,
  bus: 1.2,
  motorcycle: 1.3, bike2: 1.3, scooter: 1.3, scooty: 1.3,
};

export function extractTransportFromQuestion(question) {
  // e.g. "I commute 2 hours by auto-rickshaw" → { mode: 'auto-rickshaw', hours: 2 }
  const q = question.toLowerCase();
  const hoursMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h\b)/);
  const hours = hoursMatch ? parseFloat(hoursMatch[1]) : null;
  let mode = null;
  for (const m of Object.keys(TRANSPORT_MULTIPLIERS)) {
    if (new RegExp(`\\b${m.replace(/[-]/g, "[- ]")}\\b`).test(q)) { mode = m; break; }
  }
  return mode && hours ? { mode, hours } : null;
}

export function calcTransportExposure(pm25, mode, hours) {
  if (!pm25 || !mode || !hours) return null;
  const mult = TRANSPORT_MULTIPLIERS[mode] || 1.0;
  const localPm25 = pm25 * mult;
  const fractionOfDay = hours / 24;
  // Inhaled dose (relative): mult × hours, vs a sealed indoor reference of 1.0×24
  const equivCigs = (localPm25 * hours) / (22 * 24);
  return {
    mode,
    hours,
    multiplier: mult,
    localPm25: +localPm25.toFixed(1),
    pctOfDailyDose: +(mult * fractionOfDay * 100).toFixed(0),
    equivCigsForCommute: +equivCigs.toFixed(2),
    source: "On-road to ambient PM2.5 concentration ratios from Goel et al. 2015, Atmospheric Environment 123 (Delhi, one arterial route, 2014); concentration not inhaled dose. Cigarette equivalence per Berkeley Earth, a rule of thumb from average chronic mortality rather than an acute-dose equivalence",
  };
}

// Purifier CADR — for a given room size + target air changes per hour.
// CADR (m³/hr) = volume × ACH. Rule of thumb for polluted areas: ACH 5.
export function calcPurifierCADR(roomSqft, ceilingFt = 9, targetACH = 5) {
  if (!roomSqft || roomSqft <= 0) return null;
  const volumeCft = roomSqft * ceilingFt;
  const cadrCfm = (volumeCft * targetACH) / 60;
  const cadrM3h = Math.round(cadrCfm * 1.699);
  return {
    roomSqft,
    targetACH,
    cadrCfm: Math.round(cadrCfm),
    cadrM3h,
    source: "CADR sizing via volume × ACH — JanVayu estimate using a conservative 5 ACH and 9 ft ceiling for Indian winter PM2.5; note AHAM's own Verifide room-size guidance (the 2/3 rule) assumes ~4.8 ACH at an 8 ft ceiling and defines CADR as a measured chamber-test rating",
  };
}

export function extractRoomSizeFromQuestion(question) {
  const m = question.match(/(\d{2,4})\s*(?:sq\s*ft|sqft|square ?feet|square ?foot)/i);
  return m ? parseInt(m[1], 10) : null;
}

// CPCB National AQI sub-index for PM2.5 (24-hour), from the CPCB NAQI bands:
// 0-30 Good (0-50), 31-60 Satisfactory (51-100), 61-90 Moderate (101-200),
// 91-120 Poor (201-300), 121-250 Very Poor (301-400), 250+ Severe (401-500).
// The CPCB AQI of a station is the worst of its pollutants' sub-indices, so a
// PM2.5-only figure is a lower bound. GRAP is written on this scale, not on the
// US-EPA scale WAQI reports (US 401 is about 350 ug/m3; CPCB 401 is about 250).
const CPCB_PM25_BANDS = [
  [0, 30, 0, 50], [31, 60, 51, 100], [61, 90, 101, 200],
  [91, 120, 201, 300], [121, 250, 301, 400],
];
export function pm25ToCpcbAqi(pm25) {
  if (pm25 == null || isNaN(pm25) || pm25 < 0) return null;
  for (const [cLo, cHi, iLo, iHi] of CPCB_PM25_BANDS) {
    if (pm25 <= cHi) return Math.round(Math.max(iLo, iLo + ((pm25 - cLo) / (cHi - cLo)) * (iHi - iLo)));
  }
  return Math.min(500, Math.round(401 + ((pm25 - 250) / 130) * 99));
}

// School closure risk — driven by CAQM GRAP thresholds (CPCB-scale AQI).
export function calcSchoolClosureRisk(aqi, month) {
  if (!aqi) return null;
  let risk = "low";
  let trigger = "No GRAP school-closure trigger at this AQI";
  if (aqi >= 451) { risk = "imminent"; trigger = "GRAP Stage IV (AQI > 450): hybrid mode extended to Classes VI-IX & XI; only Classes X & XII remain in person"; }
  else if (aqi >= 401) { risk = "high"; trigger = "GRAP Stage III (AQI 401-450): hybrid classes mandated for primary students up to Class V in Delhi-NCR"; }
  else if (aqi >= 301) {
    if (month >= 10 || month <= 2) { risk = "moderate"; trigger = "GRAP Stage II + winter pollution season: check the current CAQM GRAP order for any school directions"; }
    else { risk = "moderate"; trigger = "GRAP Stage II: dust control + parking fee hikes; no school closure yet"; }
  }
  return {
    risk, trigger, aqi, month,
    source: "CAQM GRAP schedule (school clauses as in the Nov-Dec 2025 Directorate of Education circulars; check the current CAQM GRAP order, revised 29 Sep 2026, before relying on them); Delhi-NCR mandate; other cities follow advisory pattern. Indicative only: GRAP is invoked by CAQM on Delhi's average CPCB-scale AQI and forecast, not on one station's reading",
  };
}
