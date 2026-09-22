// JanVayu service worker — offline shell + last-known AQI cache
//
// Strategy:
// - On install: precache the app shell (index.html, favicon, manifest).
// - On fetch: network-first for HTML/JSON (so users see live data when online),
//   cache-first for static assets (CSS/JS/images), with offline fallback to
//   the cached shell. WAQI / Netlify Function responses are also cached so
//   the user sees the last-known AQI when offline.

const CACHE_VERSION = 'janvayu-202606226';
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/styles.css?v=202606226',
  '/app.js?v=202606226',
  '/fonts/fraunces-400.woff2',
  '/fonts/fraunces-600.woff2',
  '/fonts/fraunces-700.woff2',
  '/fonts/kalam-400.woff2',
  '/fonts/kalam-700.woff2',
  '/manifest.json',
  '/favicon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => cache.addAll(SHELL_ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    // Was there a PREVIOUS version of this site's cache? If so this is an
    // update rather than a first install, and the page currently on screen was
    // built by the old release. Tell it to reload once.
    //
    // This exists because a visitor reported, correctly and repeatedly, that
    // they could not see a new design that production was definitely serving.
    // HTML is network-first here, so the markup was fresh; what was not was
    // everything `cacheFirst` had already stored under a URL that had stopped
    // changing (see v26.6.220). Rather than depend on every asset URL being
    // stamped correctly forever, the worker now says so when it supersedes an
    // older one, and the page acts on it.
    const superseded = keys.some(k => k !== CACHE_VERSION && k.startsWith('janvayu-'));
    await Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)));
    await self.clients.claim();
    if (superseded) {
      const windows = await self.clients.matchAll({ type: 'window' });
      for (const c of windows) c.postMessage({ type: 'janvayu-sw-updated', version: CACHE_VERSION });
    }
  })());
});

// ── Web Push (v26.6.49) ──────────────────────────────────────────────────
// Push payloads are sent by netlify/functions/push-send.mjs (threshold alerts)
// and push-subscribe.mjs (test). Show the notification even when the site is
// closed; focus/open JanVayu when it's clicked.
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { title: 'JanVayu', body: event.data ? event.data.text() : '' }; }
  const title = data.title || 'JanVayu air-quality alert';
  const options = {
    body: data.body || '',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: 'janvayu-aqi',
    renotify: true,
    data: { url: data.url || 'https://www.janvayu.in/#aqi-alerts' },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || 'https://www.janvayu.in/#aqi-alerts';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const c of clients) {
        if ('focus' in c) { c.navigate(target); return c.focus(); }
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    })
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Don't intercept cross-origin live API calls except WAQI / Netlify Functions
  // which we want to cache so the offline experience still shows the last-known
  // numbers.
  const isWaqi = url.hostname.endsWith('waqi.info');
  const isNetlifyFn = url.pathname.startsWith('/.netlify/functions/');
  const isShellNav = req.mode === 'navigate' || req.destination === 'document';
  const isMarkdown = url.pathname.endsWith('.md');

  if (isShellNav) {
    event.respondWith(networkFirst(req));
    return;
  }
  if (isWaqi || isNetlifyFn || isMarkdown) {
    event.respondWith(networkFirst(req));
    return;
  }
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(req));
    return;
  }
});

async function networkFirst(req) {
  const cache = await caches.open(CACHE_VERSION);
  try {
    const res = await fetch(req);
    if (res && res.status === 200) cache.put(req, res.clone()).catch(() => {});
    return res;
  } catch (e) {
    const cached = await cache.match(req);
    if (cached) return cached;
    if (req.mode === 'navigate' || req.destination === 'document') {
      return cache.match('/index.html') || cache.match('/');
    }
    throw e;
  }
}

async function cacheFirst(req) {
  const cache = await caches.open(CACHE_VERSION);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res && res.status === 200) cache.put(req, res.clone()).catch(() => {});
    return res;
  } catch {
    return cached || new Response('', { status: 504 });
  }
}
