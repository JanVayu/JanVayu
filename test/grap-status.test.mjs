// A GRAP status question is answered by code, not by the model. On 2 November
// 2026 the model said "Stage 2 is currently in force", invented the trigger and
// listed measures from a different stage. These pin what the answer may say.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { __testing as t } from '../netlify/functions/air-query.mjs';

test('status questions are caught, general questions are not', () => {
  for (const q of ['Is GRAP Stage 2 in force in Delhi right now?', 'Which GRAP stage is active today?',
                   'Has stage III been invoked?', 'what is the current GRAP status']) {
    assert.equal(t.isGrapStatusQuestion(q), true, q);
  }
  for (const q of ['What is GRAP?', 'What does Stage 2 of GRAP involve?', 'Will schools close under GRAP?',
                   'What is the PM2.5 in Delhi now?', 'Is it safe to run today?']) {
    assert.equal(t.isGrapStatusQuestion(q), false, q);
  }
});

test('the answer never states a stage as in force and carries no invented measures', () => {
  const r = t.buildGrapStatusReply({ city: 'Delhi', station: 'Mandir Marg', pm25: 227 });
  assert.match(r, /cannot tell you which GRAP stage is in force/);
  assert.match(r, /caqm\.nic\.in/);
  assert.match(r, /Very Poor band \(301 to 400\)/);
  assert.match(r, /have not read the CAQM order/);
  assert.doesNotMatch(r, /is currently in force|diesel generator|construction work|stubble|Diwali period/i);
  assert.doesNotMatch(r, /—/);
});

test('with no reading it still declines and points to CAQM', () => {
  const r = t.buildGrapStatusReply({ city: 'Delhi', pm25: null });
  assert.match(r, /caqm\.nic\.in/);
  assert.doesNotMatch(r, /live PM2\.5/);
});

test('"What is GRAP?" is a fixed, sourced definition and nothing broader is caught', () => {
  for (const q of ['What is GRAP?', 'what does GRAP stand for', 'Explain the Graded Response Action Plan']) {
    assert.equal(t.isGrapDefinitionQuestion(q), true, q);
  }
  for (const q of ['What does Stage 2 of GRAP involve?', 'What is the GRAP stage today?', 'Will GRAP close schools?',
                   'How does GRAP affect my commute']) {
    assert.equal(t.isGrapDefinitionQuestion(q), false, q);
  }
  const r = t.buildGrapDefinitionReply();
  assert.match(r, /CAQM/);
  assert.match(r, /201 to 300/);
  assert.match(r, /caqm\.nic\.in/);
  assert.doesNotMatch(r, /Delhi government|stubble|diesel generator|private vehicles|—/i);
});
