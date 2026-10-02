// Unit tests for the deterministic calculators that back Ask JanVayu's
// "(computed)" answers. These numbers are surfaced to users as health guidance,
// so a regression here is a correctness bug, not a style nit.
//
// Run: npm test   (node --test)

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  calcCigarettes, calcMortalityRisk, calcLifeExpectancyLoss, calcMigrationBenefit,
  TRANSPORT_MULTIPLIERS, extractTransportFromQuestion, calcTransportExposure,
  calcPurifierCADR, extractRoomSizeFromQuestion, calcSchoolClosureRisk, pm25ToCpcbAqi,
} from '../netlify/functions/lib/calc.mjs';

test('calcCigarettes: 110 µg/m³ = 5/day, 35/week, 1825/year', () => {
  const r = calcCigarettes(110);
  assert.equal(r.perDay, 5);
  assert.equal(r.perWeek, 35);
  assert.equal(r.perYear, 1825);
  assert.match(r.source, /Berkeley Earth/);
});

test('calcCigarettes: guards non-positive input', () => {
  assert.equal(calcCigarettes(0), null);
  assert.equal(calcCigarettes(-5), null);
  assert.equal(calcCigarettes(undefined), null);
});

test('calcMortalityRisk: +8.6% per 10 µg/m³ above WHO 5', () => {
  assert.equal(calcMortalityRisk(105).excessMortalityPct, 86.0); // (100/10)*8.6
  assert.equal(calcMortalityRisk(15).excessMortalityPct, 8.6);   // (10/10)*8.6
  assert.equal(calcMortalityRisk(5).excessMortalityPct, 0);      // at WHO guideline
  assert.equal(calcMortalityRisk(0), null);
});

test('calcLifeExpectancyLoss: -0.98 yr per 10 µg/m³ above WHO 5', () => {
  assert.equal(calcLifeExpectancyLoss(105).yearsLost, 9.8); // (100/10)*0.98
  assert.equal(calcLifeExpectancyLoss(55).yearsLost, 4.9);  // (50/10)*0.98
});

test('calcMigrationBenefit: years gained + cigarettes saved', () => {
  const r = calcMigrationBenefit(105, 15);
  assert.equal(r.currentLossYears, 9.8);
  assert.equal(r.destLossYears, 1.0);   // 0.98 rounds to 1.0
  assert.equal(r.yearsGained, 8.8);
  assert.equal(r.cigsSavedPerYear, 1493); // round((90/22)*365)
  assert.equal(calcMigrationBenefit(100, 0), null);
});

test('calcTransportExposure: mode multiplier + dose', () => {
  const r = calcTransportExposure(100, 'car', 2);
  assert.equal(r.multiplier, 0.5);
  assert.equal(r.localPm25, 50.0);
  assert.equal(r.pctOfDailyDose, 4);       // round(0.5*(2/24)*100)
  assert.equal(r.equivCigsForCommute, 0.19); // (50*2)/(22*24)
  assert.equal(calcTransportExposure(100, 'nonsense-mode', 2).multiplier, 1.0); // default
  assert.equal(calcTransportExposure(0, 'car', 2), null);
});

test('TRANSPORT_MULTIPLIERS: Goel et al. 2015 on-road/ambient concentration ratios', () => {
  assert.equal(TRANSPORT_MULTIPLIERS.walk, 1.4);
  assert.equal(TRANSPORT_MULTIPLIERS.cycle, 1.1);
  assert.equal(TRANSPORT_MULTIPLIERS.auto, 1.3);
  assert.equal(TRANSPORT_MULTIPLIERS.bus, 1.2);
  assert.equal(TRANSPORT_MULTIPLIERS.car, 0.5);   // air-conditioned, windows up
  assert.equal(TRANSPORT_MULTIPLIERS.metro, 0.8); // carriage
  assert.ok(!('train' in TRANSPORT_MULTIPLIERS)); // no sourced ratio
});

test('pm25ToCpcbAqi: CPCB NAQI PM2.5 bands (not the US-EPA scale)', () => {
  assert.equal(pm25ToCpcbAqi(30), 50);
  assert.equal(pm25ToCpcbAqi(60), 100);
  assert.equal(pm25ToCpcbAqi(100), 232);
  assert.equal(pm25ToCpcbAqi(250), 400);
  assert.equal(pm25ToCpcbAqi(null), null);
});

test('extractTransportFromQuestion: pulls mode + hours', () => {
  assert.deepEqual(extractTransportFromQuestion('I ride the metro for 1 hour'), { mode: 'metro', hours: 1 });
  assert.deepEqual(extractTransportFromQuestion('by car for 2 hours'), { mode: 'car', hours: 2 });
  assert.equal(extractTransportFromQuestion('what is the AQI today'), null); // no mode/hours
});

test('calcPurifierCADR: AHAM formula for a 200 sqft room', () => {
  const r = calcPurifierCADR(200);
  assert.equal(r.cadrCfm, 150);  // (200*9*5)/60
  assert.equal(r.cadrM3h, 255);  // round(150*1.699)
  assert.equal(calcPurifierCADR(0), null);
});

test('extractRoomSizeFromQuestion: pulls square footage', () => {
  assert.equal(extractRoomSizeFromQuestion('my bedroom is 250 sqft'), 250);
  assert.equal(extractRoomSizeFromQuestion('a 400 square feet hall'), 400);
  assert.equal(extractRoomSizeFromQuestion('no size mentioned'), null);
});

test('calcSchoolClosureRisk: GRAP thresholds', () => {
  assert.equal(calcSchoolClosureRisk(460, 11).risk, 'imminent'); // Stage IV
  assert.equal(calcSchoolClosureRisk(420, 11).risk, 'high');     // Stage III
  assert.equal(calcSchoolClosureRisk(320, 11).risk, 'moderate'); // Stage II, winter
  assert.equal(calcSchoolClosureRisk(320, 6).risk, 'moderate');  // Stage II, non-winter
  assert.equal(calcSchoolClosureRisk(100, 11).risk, 'low');
  assert.equal(calcSchoolClosureRisk(0), null);
});

test('every calculator returns a source citation', () => {
  assert.ok(calcCigarettes(50).source);
  assert.ok(calcMortalityRisk(50).source);
  assert.ok(calcLifeExpectancyLoss(50).source);
  assert.ok(calcTransportExposure(50, 'bus', 1).source);
  assert.ok(calcPurifierCADR(150).source);
  assert.ok(calcSchoolClosureRisk(410, 11).source);
});
