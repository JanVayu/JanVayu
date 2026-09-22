// WAQI's iaqi values are sub-indices, not concentrations.
//
// api.waqi.info returns, per station, an `iaqi` object whose members are that
// pollutant's own US-EPA AQI: unitless numbers on the 0-500 scale. They are
// not micrograms per cubic metre, and the two are not close -- a PM2.5
// sub-index of 160 is 73 ug/m3, and one of 200 is 150.
//
// app.js has known this since it was written and carries the breakpoint tables
// with a comment saying so. Six Netlify functions did not, and each passed
// `iaqi.pm25.v` straight through under the key `pm25`, which every consumer
// then treated as a concentration:
//
//   rankings.mjs           -> the city ranking sorts on it, embed/rankings
//                             colours it against the WHO thresholds
//                             5/15/35/55/150, and the pollutant pages print
//                             it in a column headed ug/m3
//   air-query.mjs          -> Ask JanVayu's fallback reply says, in words,
//                             "PM2.5 <n> ug/m3 (<n/5>x the WHO guideline)".
//                             At a sub-index of 160 that read 160 ug/m3 and
//                             32x the guideline; the true figures are 73 and
//                             about 15x. A health answer, wrong by a factor
//                             of two, in the direction of alarm.
//   health-advisory.mjs
//   daily-digest.mjs
//   accountability-brief.mjs
//   anomaly-check.mjs
//
// The tables are the EPA's, and are the same ones app.js uses. Conversion is
// linear interpolation within the bracket the sub-index falls into, which is
// the exact inverse of how the sub-index was derived.

const PM25_BREAKPOINTS = [
  [0, 12.0, 0, 50], [12.1, 35.4, 51, 100], [35.5, 55.4, 101, 150],
  [55.5, 150.4, 151, 200], [150.5, 250.4, 201, 300],
  [250.5, 350.4, 301, 400], [350.5, 500.4, 401, 500],
];

const PM10_BREAKPOINTS = [
  [0, 54, 0, 50], [55, 154, 51, 100], [155, 254, 101, 150],
  [255, 354, 151, 200], [355, 424, 201, 300],
  [425, 504, 301, 400], [505, 604, 401, 500],
];

function convert(iaqi, table) {
  if (iaqi == null || iaqi === "" || isNaN(iaqi)) return null;
  const v = Number(iaqi);
  for (const [bpLo, bpHi, iLo, iHi] of table) {
    if (v >= iLo && v <= iHi) {
      return Math.round(((v - iLo) / (iHi - iLo)) * (bpHi - bpLo) + bpLo);
    }
  }
  // Above 500 the EPA scale stops. Capping at the top breakpoint is what
  // app.js does; returning null would drop the station from a ranking.
  if (v > 500) return Math.round(table[table.length - 1][1]);
  return null;
}

export function iaqiToPM25(v) { return convert(v, PM25_BREAKPOINTS); }
export function iaqiToPM10(v) { return convert(v, PM10_BREAKPOINTS); }
