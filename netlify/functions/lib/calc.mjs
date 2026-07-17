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

// Jaganathan et al. 2024, Lancet Planetary Health — India-wide causal
// dose-response: every +10 µg/m³ PM2.5 → +8.6% all-cause mortality.
export function calcMortalityRisk(pm25) {
  if (!pm25 || pm25 <= 0) return null;
  const aboveWHO = Math.max(0, pm25 - 5);
  const excessPct = (aboveWHO / 10) * 8.6;
  return {
    excessMortalityPct: +excessPct.toFixed(1),
    aboveWHO: +aboveWHO.toFixed(1),
    source: "Jaganathan et al. 2024, Lancet Planetary Health (India causal dose-response)",
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
// Multipliers are modeling assumptions from peer-reviewed commute-exposure studies (e.g., Goel et al. 2015, Delhi), already in the prompt.
export const TRANSPORT_MULTIPLIERS = {
  walk: 1.0, walking: 1.0,
  cycle: 2.5, cycling: 2.5, bicycle: 2.5, bike: 2.5,
  auto: 1.5, "auto-rickshaw": 1.5, rickshaw: 1.5, tuktuk: 1.5,
  car: 0.4, taxi: 0.4, cab: 0.4, uber: 0.4, ola: 0.4,
  metro: 0.3, subway: 0.3, train: 0.5,
  bus: 0.9,
  motorcycle: 1.4, bike2: 1.4, scooter: 1.4, scooty: 1.4,
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
    source: "Peer-reviewed commute-exposure studies (e.g., Goel et al. 2015, Delhi transport microenvironments); cigarette equivalence per Berkeley Earth",
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
    source: "AHAM CADR formula (Association of Home Appliance Manufacturers); 5 ACH target for Indian winter PM2.5 typical",
  };
}

export function extractRoomSizeFromQuestion(question) {
  const m = question.match(/(\d{2,4})\s*(?:sq\s*ft|sqft|square ?feet|square ?foot)/i);
  return m ? parseInt(m[1], 10) : null;
}

// School closure risk — driven by CAQM GRAP thresholds.
export function calcSchoolClosureRisk(aqi, month) {
  if (!aqi) return null;
  let risk = "low";
  let trigger = "No GRAP school-closure trigger at this AQI";
  if (aqi >= 451) { risk = "imminent"; trigger = "GRAP Stage IV (AQI > 450): hybrid mode extended to Classes VI-IX & XI; only Classes X & XII remain in person"; }
  else if (aqi >= 401) { risk = "high"; trigger = "GRAP Stage III (AQI 401-450): hybrid classes mandated for primary students up to Class V in Delhi-NCR"; }
  else if (aqi >= 301) {
    if (month >= 10 || month <= 2) { risk = "moderate"; trigger = "GRAP Stage II + winter pollution season: schools alert to monitor next 72 hr forecast"; }
    else { risk = "moderate"; trigger = "GRAP Stage II: dust control + parking fee hikes; no school closure yet"; }
  }
  return {
    risk, trigger, aqi, month,
    source: "CAQM GRAP framework (revised 2024); Delhi-NCR mandate; other cities follow advisory pattern",
  };
}
