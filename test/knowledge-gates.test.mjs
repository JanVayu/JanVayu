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
  assert.match(b, /42% is Chhattisgarh's annual ammonium sulphate share/);
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
