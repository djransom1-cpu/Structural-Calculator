const CACHE_NAME = 'structural-calc-v1';
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
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
