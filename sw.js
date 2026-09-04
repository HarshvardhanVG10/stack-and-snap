// Stack & Snap service worker — offline play + fast loads.
// HTML is network-first (so updates always arrive); assets are cache-first.
const VERSION = 'v2.6';
const CACHE = 'snap-' + VERSION;
const ASSETS = [
  './',
  'index.html',
  'play.html',
  'firebase-config.js',
  'manifest.webmanifest',
  'img/bg.png',
  'img/kid_calm.png',
  'img/kid_worried.png',
  'img/kid_panic.png',
  'img/mom.png',
  'img/icon-192.png',
  'img/icon-512.png',
  'img/icon-maskable-512.png',
  'https://cdn.jsdelivr.net/npm/matter-js@0.19.0/build/matter.min.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  const sameOrigin = url.origin === self.location.origin;
  const cachedCdn = url.hostname === 'cdn.jsdelivr.net' ||
                    url.hostname === 'fonts.googleapis.com' ||
                    url.hostname === 'fonts.gstatic.com';
  // never intercept Firebase auth/firestore traffic
  if (!sameOrigin && !cachedCdn) return;

  if (req.mode === 'navigate' || req.destination === 'document') {
    // network-first for pages: updates arrive immediately, offline falls back to cache
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((m) => m || caches.match('index.html')))
    );
    return;
  }

  // cache-first for assets
  e.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      });
    })
  );
});
