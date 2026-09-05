// Guards the cache-poisoning class of bug that has now hit this file twice:
// Instagram in v26.6.169 (error text served as citizen posts) and Reddit in
// v26.6.172 (all four subreddits returning HTTP 429, an empty result written
// over the cache every four hours, and the health log calling it ok:true).
//
// The distinction under test is the whole fix: zero items is a legitimate
// steady state for a links-out feed, but zero items ALONGSIDE errors is a
// failure, and a failure must not overwrite a good cache or report itself
// healthy.
//
// Run: npm test

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { storeFeed } from '../netlify/functions/scheduled-fetch.mjs';

function fakeStore(existing = null) {
  return {
    written: null,
    async get() { if (existing === null) throw new Error('no such blob'); return existing; },
    async setJSON(_key, value) { this.written = value; },
  };
}

test('a healthy fetch is stored and reported ok', async () => {
  const store = fakeStore();
  const r = await storeFeed(store, 'reddit', { posts: [{ title: 'AQI in Delhi' }], count: 1, errors: [] },
    { fetched_at: 'T', source: 'reddit-proxy' });
  assert.equal(r.ok, true);
  assert.equal(r.count, 1);
  assert.equal(store.written.count, 1);
  assert.equal(store.written.source, 'reddit-proxy');
});

test('zero items with NO errors is a legitimate steady state and is stored', async () => {
  // X and Instagram are links-out and report 0 by design. Treating that as a
  // failure would freeze a stale cache in place forever.
  const store = fakeStore({ posts: [{ title: 'old' }], count: 1 });
  const r = await storeFeed(store, 'instagram', { posts: [], count: 0, errors: [] },
    { fetched_at: 'T', source: 'rss-bridge' });
  assert.equal(r.ok, true);
  assert.equal(r.count, 0);
  assert.ok(store.written, 'an intentional empty result should still be written');
});

test('zero items WITH errors does not overwrite a good cache', async () => {
  const store = fakeStore({ posts: [{ title: 'Delhi AQI today' }], count: 12 });
  const r = await storeFeed(store, 'reddit',
    { posts: [], count: 0, errors: ['delhi: HTTP 429', 'indianews: HTTP 429'] },
    { fetched_at: 'T', source: 'reddit-proxy' });
  assert.equal(r.ok, false, 'a feed that failed must not report itself healthy');
  assert.equal(r.count, 0);
  assert.equal(r.kept_cache, 12, 'the previous cache must be reported as kept');
  assert.equal(store.written, null, 'nothing may be written over a good cache');
  assert.deepEqual(r.errors, ['delhi: HTTP 429', 'indianews: HTTP 429']);
});

test('zero items with errors and no previous cache reports the errors', async () => {
  const store = fakeStore(null);
  const r = await storeFeed(store, 'reddit', { posts: [], count: 0, errors: ['delhi: HTTP 429'] },
    { fetched_at: 'T', source: 'reddit-proxy' });
  assert.equal(r.ok, false);
  assert.equal(r.kept_cache, undefined);
  assert.deepEqual(r.errors, ['delhi: HTTP 429']);
  assert.equal(store.written, null);
});

test('a partial fetch is stored but still surfaces its errors', async () => {
  // Three subreddits succeeded and one 429'd: worth storing, worth reporting.
  const store = fakeStore();
  const r = await storeFeed(store, 'reddit', { posts: [{ title: 'smog' }], count: 1, errors: ['worldnews: HTTP 429'] },
    { fetched_at: 'T', source: 'reddit-proxy' });
  assert.equal(r.ok, true);
  assert.deepEqual(r.errors, ['worldnews: HTTP 429']);
  assert.equal(store.written.count, 1);
});
