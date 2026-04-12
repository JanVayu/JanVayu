const CACHE_NAME = 'ask-janvayu-v1';
const STATIC_ASSETS = [
  '/ask/',
  '/ask/index.html',
  '/ask/manifest.json',
  '/favicon.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Network-first for API calls, cache-first for static assets
  if (url.pathname.includes('/.netlify/functions/')) {
    e.respondWith(
      fetch(e.request).catch(() =>
        new Response(JSON.stringify({ answer: 'You appear to be offline. Please check your connection and try again.' }), {
          headers: { 'Content-Type': 'application/json' }
        })
      )
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
  }
});
