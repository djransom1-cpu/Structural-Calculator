const CACHE_NAME = 'structural-calc-v2';
const ASSETS = [
  './',
  './index.html',
  './index.css',
  './js/app.js',
  './js/aisc_database.js',
  './js/steel_engine.js',
  './js/concrete_engine.js',
  './js/retaining_engine.js',
  './js/timber_engine.js',
  './js/diagram_renderer.js',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((names) => Promise.all(
      names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
    )).then(() => self.clients.claim())
  );
});

// Network-first: always try to fetch the latest version, falling back to
// the cache only when offline. Also refreshes the cache with each fresh
// response so the app keeps working offline with up-to-date files.
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, copy));
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
