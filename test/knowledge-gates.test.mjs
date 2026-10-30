// The assistant's keyword-gated knowledge blocks (air-query.mjs, 26 Oct 2026).
//
// Nothing here calls a model. It pins the three things that go wrong quietly:
// a gate that fires on the wrong question (every false positive spends tokens
// on Groq's 8,000-a-minute plan), a gate that misses the question it exists
// for, and a block that drifts from what the site publishes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { __testing as t } from '../netlify/functions/air-query.mjs';

const seasonal = t.getSeasonalContext();
const prompt = (opts = {}) => t.buildSystemPrompt(seasonal, null, opts);
const tokens = (s) => Math.round(s.length / 4);

const FIRES = {
  isAboutQuery: [
    'Who is behind JanVayu?',
    'Is JanVayu affiliated with a political party?',
    'Is this platform non-partisan?',
    'What is AIPC and how is it connected to this site?',
    'Who funds this website?',
  ],
  isSecondaryQuery: [
    'Is it true that 42% of India\'s PM2.5 is secondary?',
    'How much of our PM2.5 comes from ammonia?',
    'What is ammonium sulphate and why does it matter?',
    'Does fertiliser use affect air pollution?',
  ],
  isWinterPeaksQuery: [
    'Does Delhi\'s air pollution peak twice each winter?',
    'When is Delhi\'s pollution at its worst in winter?',
    'When in the year is Delhi\'s PM2.5 usually at its worst, and why?',
    'Is biomass burning behind the second peak?',
  ],
  isEnsoQuery: [
    'Will El Nino make this winter worse?',
    'What does La Nina do to north Indian air?',
    'Does ENSO affect PM2.5?',
  ],
};

// Ordinary questions that must not pull a block in. "sensor" contains "enso",
// "party" and "funding" are common, and "winter" alone is not a winter-peaks
// question.
const QUIET = [
  'What is the AQI in Delhi right now?',
  'Should I go for a run in Lucknow today?',
  'How many CPCB stations are there in Pune?',
  'Which low-cost sensor should I buy?',
  'Which party is better for clean air, and who should I vote for?',
  'How much funding did NCAP get?',
  'What does PM2.5 do to my lungs in winter?',
  'Draft an RTI about my ward\'s monitors.',
  'Is the air in Patna getting better?',
];

for (const [fn, qs] of Object.entries(FIRES)) {
  test(`${fn} fires on the questions it exists for`, () => {
    for (const q of qs) assert.ok(t[fn](q), `${fn} missed: ${q}`);
  });
  test(`${fn} stays quiet on ordinary questions`, () => {
    for (const q of QUIET) assert.ok(!t[fn](q), `${fn} fired on: ${q}`);
  });
}

test('each block is injected only when its flag is set', () => {
  const base = prompt();
  for (const [flag, block] of [['aboutQ', t.ABOUT_REFERENCE], ['secondaryQ', t.SECONDARY_REFERENCE],
    ['winterQ', t.WINTER_PEAKS_REFERENCE], ['ensoQ', t.ENSO_REFERENCE]]) {
    assert.ok(!base.includes(block), `${flag} block is in the base prompt`);
    assert.ok(prompt({ [flag]: true }).includes(block), `${flag} block missing when flagged`);
  }
});

test('no block costs more than 800 tokens, and the base prompt is unchanged', () => {
  for (const b of [t.ABOUT_REFERENCE, t.SECONDARY_REFERENCE, t.WINTER_PEAKS_REFERENCE, t.ENSO_REFERENCE])
    assert.ok(tokens(b) <= 800, `block is ~${tokens(b)} tokens`);
  assert.ok(tokens(prompt()) < 6000, `base prompt grew to ~${tokens(prompt())} tokens`);
});

test('the about block states the AIPC origin the About panel states, and claims no neutrality', () => {
  const b = t.ABOUT_REFERENCE;
  assert.match(b, /All India Professionals' Congress \(AIPC\)/);
  assert.match(b, /describes itself as a political platform/);
  assert.match(b, /Dr\. Manmohan Singh Fellows Programme/);
  assert.match(b, /Do not say AIPC created, owns or runs/);
  // It may name the words only to forbid them.
  const positive = b.replace(/Never call JanVayu[^.]*\./, '');
  assert.doesNotMatch(positive, /non-?partisan|unaffiliated|independent of/i);
});

test('the secondary block keeps 42% where CREA put it, and 34% as the national figure', () => {
  const b = t.SECONDARY_REFERENCE;
  assert.match(b, /42% is Chhattisgarh's ANNUAL ammonium sulphate share/);
  assert.match(b, /NEVER say that 42% of India's PM2\.5 is secondary/);
  assert.match(b, /about 34% of India's PM2\.5 mass/);
  assert.match(b, /11% of annual mean PM2\.5 across South Asia/);
  assert.match(b, /no published source for them was found/);
});

test('the winter block matches data/delhi-weekly.json', async () => {
  const { readFileSync } = await import('node:fs');
  const d = JSON.parse(readFileSync(new URL('../data/delhi-weekly.json', import.meta.url), 'utf8'));
  const done = d.cycles.filter((c) => c.complete);
  const early = done.map((c) => c.peaks.early.mean);
  const late = done.map((c) => c.peaks.late.mean);
  const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  const b = t.WINTER_PEAKS_REFERENCE;
  assert.ok(b.includes(`${Math.round(Math.min(...early))} to ${Math.round(Math.max(...early))}`), 'early range');
  assert.ok(b.includes(`mean ${Math.round(mean(early))}`), 'early mean');
  assert.ok(b.includes(`${Math.round(Math.min(...late))} to ${Math.round(Math.max(...late))}`), 'late range');
  assert.ok(b.includes(`mean ${Math.round(mean(late))}`), 'late mean');
  const shuffle = Math.round(d.tests.shuffle.null_share_at_least_30pct * 100);
  assert.ok(b.includes(`${shuffle}% of draws`), 'shuffle share');
  const over120 = done.map((c) => c.weeks.filter((w) => w.mean > 120).length);
  assert.ok(b.includes(`${Math.min(...over120)} to ${Math.max(...over120)} weeks`), 'weeks above 120');
});

test('the secondary block keeps the South Asia ammonia figure from becoming an India figure, and drops the unverified numbers', () => {
  const b = t.SECONDARY_REFERENCE;
  assert.match(b, /Never restate it as India's share/);
  assert.match(b, /Do not repeat either number, even with a caveat/);
});

test('the second-round faults stay out: the 42% is explained, the winter causes are not asserted, El Nino stays correct', () => {
  assert.match(t.SECONDARY_REFERENCE, /Never call the 42% unsubstantiated or untraceable/);
  assert.match(t.SECONDARY_REFERENCE, /where it comes from \(Chhattisgarh/);
  const w = t.WINTER_PEAKS_REFERENCE;
  assert.match(w, /never say that meteorology or any single factor is the main driver/);
  assert.match(w, /Diwali fell between 24 October and 14 November/);
  assert.match(w, /Open with the timing itself/);
  assert.match(t.ENSO_REFERENCE, /never "El Nina"/);
  assert.match(t.ENSO_REFERENCE, /never say they often do/);
});

test('the winter block keeps Mangaraj and Nandi apart and calls Nandi one study', () => {
  const b = t.WINTER_PEAKS_REFERENCE;
  assert.match(b, /Never merge Mangaraj's 14% and Nandi's cuts/);
  assert.match(b, /say "one modelling study", not "studies"/);
  assert.match(b, /inside Delhi-NCR alone cut Delhi PM2\.5 by 2% to 3%/);
});

test('the El Nino block carries a date and tells the model not to forecast', () => {
  const b = t.ENSO_REFERENCE;
  assert.match(b, /8 October 2026/);
  assert.match(b, /next update is 12 November 2026/);
  assert.match(b, /Never forecast/);
  assert.match(b, /Do not open with "Yes" or "No"/);
  assert.match(b, /not a Delhi figure/, 'the 70% must not be attributed to Delhi');
});

test('retired claims are in no prompt the assistant can be sent', () => {
  const everything = prompt({ nationalQuery: true, multiSource: true, topical: true, methodologyNeeded: true,
    ward: true, stationCount: true, rti: true, stationRange: true, village: true, trend: true,
    aboutQ: true, secondaryQ: true, winterQ: true, ensoQ: true });
  for (const [re, why] of [
    [/42% of India's PM2\.5 (is|are) (secondary|formed)/i, 'the 42% misreading, stated as fact'],
    [/JanVayu is (a )?(strictly |fully |completely )?non-?partisan/i, 'a non-partisan claim'],
    [/independent of any (government|political)/i, 'an independence claim'],
    [/eighth straight year/i, 'the withdrawn IQAir run'],
    [/17% per 10/i, 'the dementia figure'],
  ]) assert.doesNotMatch(everything.replace(/NEVER say that 42%[^.]*\./, ''), re, why);
});

test('"El Nina" becomes El Nino, in either encoding of the n-tilde, and real text is untouched', () => {
  assert.equal(t.fixKnownSlips('between La Niña and El Niña winters'), 'between La Niña and El Niño winters');
  assert.equal(t.fixKnownSlips('El Nin\u0303a winter (2023-24)'), 'El Niño winter (2023-24)');
  assert.equal(t.fixKnownSlips('El Nina and La Nina'), 'El Nino and La Nina');
  assert.equal(t.fixKnownSlips('An El Niño advisory and a La Niña winter'), 'An El Niño advisory and a La Niña winter');
  assert.equal(t.fixKnownSlips('Very Poor (121-250 µg/m³) 【SCALE CHECK】। यह स्तर'), 'Very Poor (121-250 µg/m³)। यह स्तर');
});

test('the activity bands are labelled US-EPA and sit beside the CPCB bands', () => {
  const a = t.ACTIVITY_THRESHOLDS;
  assert.match(a, /labelled US-EPA/);
  for (const band of ['Good 0-30', 'Satisfactory 31-60', 'Moderate 61-90', 'Poor 91-120', 'Very Poor 121-250', 'Severe above 250'])
    assert.ok(a.includes(band), band);
});

test('the round-three fixes: annual not winter, Mangaraj is not a model', () => {
  assert.match(t.SECONDARY_REFERENCE, /never call it a winter figure/);
  assert.match(t.WINTER_PEAKS_REFERENCE, /not a model; only Nandi et al\. is a model/);
  assert.match(t.WINTER_PEAKS_REFERENCE, /never "a modelling study"/);
});

test('the scale note names the right band on both scales, from the question and the live reading', () => {
  const n = t.scaleNote('Delhi is at 32 micrograms of PM2.5 today. Which category does that fall in?', 96);
  assert.match(n, /figure of 32 µg\/m3: CPCB \(India\) says Satisfactory \(31-60\); the US-EPA scale says Moderate \(12-35\)/);
  assert.match(n, /live reading of 96 µg\/m3: CPCB \(India\) says Poor \(91-120\); the US-EPA scale says Unhealthy \(55-150\)/);
  assert.match(t.scaleNote('x', 30), /says Good \(0-30\)/);
  assert.match(t.scaleNote('x', 31), /says Satisfactory/);
  assert.match(t.scaleNote('x', 61), /says Moderate \(61-90\)/);
  assert.match(t.scaleNote('x', 300), /says Severe \(above 250\)/);
  assert.equal(t.scaleNote('What is PM2.5?', null), '');
});

test('the scale note reaches the prompt only when there is a number to name', () => {
  const s = t.getSeasonalContext();
  assert.ok(t.buildSystemPrompt(s, null, { scaleNote: t.scaleNote('', 96) }).includes('SCALE CHECK'));
  assert.ok(!t.buildSystemPrompt(s, null, {}).includes('SCALE CHECK'));
  assert.match(t.SECONDARY_REFERENCE, /annual ammonium sulphate share of PM2\.5 \(CREA, 24 December 2025\), not the national secondary share/);
});

test('a live reading alone must not tell the answer how to open', () => {
  const live = t.scaleNote('When in the year is Delhi worst?', 96);
  assert.match(live, /live reading of 96/);
  assert.doesNotMatch(live, /open with the category/);
  assert.match(live, /say nothing about how the answer should begin/);
  const asked = t.scaleNote('Delhi is at 32 micrograms today. Which category?', 96);
  assert.match(asked, /open with the category/);
});

test('a village named like a district is not answered with that district', () => {
  assert.equal(t.findDistrict('Air in Kheri Khurd village near Delhi'), null);
  const kheri = t.findDistrict('How is the air in Kheri district?');
  assert.equal(kheri.district.s, 'UTTAR PRADESH');
});

test('a district name shared by two states needs the state', () => {
  const bare = t.findDistrict('Air quality in Aurangabad district');
  assert.equal(bare.district, null);
  assert.deepEqual([...bare.ambiguous].sort(), ['BIHAR', 'MAHARASHTRA']);
  assert.equal(t.findDistrict('Aurangabad district in Maharashtra').district.s, 'MAHARASHTRA');
  assert.match(t.buildVillageContext('Air quality in Aurangabad district'), /more than one state/);
});

test('the NCAP block is sent for an NCAP question and not otherwise', () => {
  assert.ok(t.isNcapQuery('How much money was spent under NCAP?'));
  assert.ok(t.isNcapQuery('Did the National Clean Air Programme work?'));
  assert.ok(!t.isNcapQuery('Is it safe to run in Delhi today?'));
  const seasonal = t.getSeasonalContext ? t.getSeasonalContext() : null;
  assert.ok(t.buildSystemPrompt(seasonal, null, { ncapQ: true }).includes('NCAP AFTER SEVEN YEARS'));
  assert.ok(!t.buildSystemPrompt(seasonal, null, {}).includes('NCAP AFTER SEVEN YEARS'));
});

test('the NCAP block carries the figures from the October 2026 analysis', () => {
  for (const f of ['117 of 130', '125 in 2017-18', '112 in 2019-20', 'Rs 16,824 crore', 'Rs 12,087 crore', 'rose in 43', 'rose in 23']) {
    assert.ok(t.NCAP_REFERENCE.includes(f), f);
  }
});

test('the scale note puts CPCB first and never crowns one scale for health', () => {
  for (const note of [t.scaleNote('Is 32 micrograms safe?', null), t.scaleNote('', 57)]) {
    assert.match(note, /Give CPCB's category first/);
    assert.match(note, /Never say that either scale is the one that guides health decisions/);
    assert.match(note, /15 µg\/m³ over 24 hours/);
  }
  assert.match(t.ACTIVITY_THRESHOLDS, /CPCB publishes health effects, not instructions/);
});

test('the NCAP block keeps the two dates apart', () => {
  assert.match(t.NCAP_REFERENCE, /analysis of 25 October 2026/);
  assert.match(t.NCAP_REFERENCE, /reported it on 27 October/);
});

test("activity guidance forbids stricter or invented advice", () => {
  assert.match(t.ACTIVITY_THRESHOLDS, /never stricter/);
  assert.match(t.ACTIVITY_THRESHOLDS, /add no season, cause or reason/);
});

test("NCAP block forbids inventing causes for the mixed results", () => {
  assert.match(t.NCAP_REFERENCE, /never offer causes/);
});

test("health questions carry CPCB's own wording and label practical steps as US-EPA", () => {
  assert.match(t.ACTIVITY_THRESHOLDS, /Poor 91-120: May cause breathing discomfort to people on prolonged exposure/);
  assert.match(t.ACTIVITY_THRESHOLDS, /CPCB publishes health effects, not instructions/);
  assert.match(t.ACTIVITY_THRESHOLDS, /Never present a step as CPCB's/);
});

test('the code hands the model the one US-EPA row that matches the figure, never a stricter one', () => {
  // The live bug: 123 ug/m3 was given the 150-250 row ("avoid all outdoor physical activity").
  const n = t.scaleNote('', 123);
  assert.match(n, /US-EPA row 55-150/);
  assert.match(n, /Children should play indoors/);
  assert.doesNotMatch(n, /Avoid all outdoor physical activity/);
  assert.doesNotMatch(n, /Keep windows closed/);
  assert.match(n, /respiratory illness to the people on prolonged exposure/);
  const hi = t.scaleNote('', 200);
  assert.match(hi, /US-EPA row 150-250/);
  assert.match(hi, /Avoid all outdoor physical activity/);
  const mid = t.scaleNote('', 45);
  assert.match(mid, /CPCB \(India\) says Satisfactory/);
  assert.match(mid, /US-EPA row 35-55/);
  assert.match(mid, /minor breathing discomfort to sensitive people/);
  assert.doesNotMatch(mid, /play indoors/);
});

test('every EPA band has exactly one row of steps', () => {
  for (const v of [5, 20, 40, 100, 200, 300]) {
    const n = t.scaleNote('', v);
    assert.equal((n.match(/The ONLY practical steps/g) || []).length, 1, `figure ${v}`);
  }
});

test('the full EPA table is no longer in the base prompt, so the model cannot pick a row', () => {
  const base = t.buildSystemPrompt(t.getSeasonalContext(), null, {});
  assert.doesNotMatch(base, /Run an air purifier indoors if available/);
  assert.doesNotMatch(base, /Children should play indoors/);
});

const ASTHMA_ANSWER = [
  "Today's Delhi PM2.5 of 123 µg/m³ falls in the CPCB Very Poor category.",
  "",
  "For this band the practical steps are:",
  "- Everyone should reduce prolonged outdoor exertion.",
  "- No jogging or cycling.",
  "- Children should stay indoors.",
  "- Use an N95 mask if you must be outside.",
  "",
  "Because your child has asthma, they belong to the most vulnerable group (children, elderly, pregnant women, people with lung or heart disease). Limit their time outdoors, keep windows closed, and run an air purifier if possible. If symptoms worsen, seek medical advice promptly.",
].join("\n");

test('steps from a stricter row, and groups no row names, are removed from the answer', () => {
  const out = t.trimUnsourcedSteps(ASTHMA_ANSWER, [123]);
  assert.doesNotMatch(out, /air purifier/i);
  assert.doesNotMatch(out, /windows closed/i);
  assert.doesNotMatch(out, /pregnan/i);
  assert.doesNotMatch(out, /stay indoors/i);
  assert.match(out, /Children should play indoors/);        // the row's own wording
  assert.match(out, /Everyone should reduce prolonged outdoor exertion/);
  assert.match(out, /No jogging or cycling/);
  assert.match(out, /N95 mask/);
  assert.match(out, /If symptoms worsen, seek medical advice promptly/);
});

test('a phrase stays only when the figure is in a band whose row contains it', () => {
  const out = t.trimUnsourcedSteps(ASTHMA_ANSWER, [200]);
  assert.match(out, /air purifier/i);
  assert.match(out, /windows closed/i);
  assert.doesNotMatch(out, /stay indoors/i); // that wording belongs to the 250+ row only
  assert.doesNotMatch(out, /pregnan/i);    // no row names pregnant women, at any level
  // the reader asking about a higher figure than the live reading also opens the row
  assert.match(t.trimUnsourcedSteps("Keep windows closed.", [57, 200]), /windows closed/i);
});

test('with no figure in play the answer is left alone', () => {
  assert.equal(t.trimUnsourcedSteps(ASTHMA_ANSWER, []), ASTHMA_ANSWER);
  assert.equal(t.trimUnsourcedSteps(ASTHMA_ANSWER, [null, null]), ASTHMA_ANSWER);
});

test('an answer that would be emptied is returned whole, not blank', () => {
  const only = "Keep windows closed.";
  assert.equal(t.trimUnsourcedSteps(only, [57]), only);
});

test('the reader\'s figure is read from the question', () => {
  assert.equal(t.askedFigure('Is 32 micrograms safe?'), 32);
  assert.equal(t.askedFigure('Is it safe to run?'), null);
});

test('stay indoors and school closure survive at 250 and above, where that row says them', () => {
  const out = t.trimUnsourcedSteps('Stay indoors today. Schools should close. The air is Severe.', [300]);
  assert.match(out, /Stay indoors/);
  assert.match(out, /Schools should close/);
});

test('a sentence tying the live reading to a cause is dropped', () => {
  const ans = "The current PM2.5 concentration in Delhi is 53 µg/m³.\n- CPCB category: Satisfactory.\n\nThis reading reflects the stubble-burning season and the build-up of pollutants ahead of Diwali, which can raise concentrations further. For a live map see janvayu.in/#map.";
  const out = t.dropUnsourcedCause(ans);
  assert.doesNotMatch(out, /stubble/i);
  assert.doesNotMatch(out, /Diwali/);
  assert.match(out, /53 µg\/m³/);
  assert.match(out, /Satisfactory/);
  assert.match(out, /janvayu\.in\/#map/);
});

test('sentences about causes that are not about the live reading are left alone', () => {
  const s = "Crop-residue burning over Punjab was about 14% of Delhi-NCR PM2.5 in October-November 2022. Winter is the worst season in the Indo-Gangetic Plain.";
  assert.equal(t.dropUnsourcedCause(s), s);
});

test('an answer that would be emptied is returned whole', () => {
  const only = "This reading reflects the stubble-burning season.";
  assert.equal(t.dropUnsourcedCause(only), only);
});
