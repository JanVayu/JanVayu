// India's CPCB National Air Quality Index, applied to PM2.5 in ug/m3.
//
// Bands (24-hour PM2.5): Good 0-30, Satisfactory 31-60, Moderate 61-90, Poor 91-120,
// Very Poor 121-250, Severe above 250. Health wording is CPCB's, as published in the
// Press Information Bureau release "National Air Quality Index (AQI) launched by the
// Union Environment Minister" (pib.gov.in, relid=110654). CPCB publishes health effects
// per category, not instructions for what to do, so none are written here.
import { iaqiToPM25 } from "./iaqi.mjs";

export const CPCB_CATEGORIES = [
  { max: 30, label: "Good", color: "#16a34a", impact: "Minimal impact." },
  { max: 60, label: "Satisfactory", color: "#65a30d", impact: "May cause minor breathing discomfort to sensitive people." },
  { max: 90, label: "Moderate", color: "#ca8a04", impact: "May cause breathing discomfort to people with lung disease such as asthma, and discomfort to people with heart disease, children and older adults." },
  { max: 120, label: "Poor", color: "#ea580c", impact: "May cause breathing discomfort to people on prolonged exposure, and discomfort to people with heart disease." },
  { max: 250, label: "Very Poor", color: "#dc2626", impact: "May cause respiratory illness to the people on prolonged exposure. Effect may be more pronounced in people with lung and heart diseases." },
  { max: Infinity, label: "Severe", color: "#7f1d1d", impact: "May cause respiratory impact even on healthy people, and serious health impacts on people with lung/heart disease. The health impacts may be experienced even during light physical activity." },
];

// The CPCB category for a PM2.5 concentration, or null when there is no reading.
export function getCpcbPM25Category(pm25) {
  if (pm25 == null || Number.isNaN(Number(pm25))) return null;
  const v = Number(pm25);
  return CPCB_CATEGORIES.find((c) => v <= c.max);
}

// A subscriber's alert level in ug/m3 of PM2.5. New records carry pm25_threshold. Records
// made before 2026-10-29 carry only `threshold`, a US-EPA AQI, so it is converted with the
// same breakpoint table WAQI uses: the person keeps the air-quality level they chose.
export function thresholdPM25(rec) {
  const direct = Number(rec?.pm25_threshold);
  if (Number.isFinite(direct) && direct > 0) return direct;
  const legacy = Number(rec?.threshold);
  const converted = Number.isFinite(legacy) ? iaqiToPM25(legacy) : null;
  return converted != null && Number.isFinite(converted) ? converted : 150;
}
