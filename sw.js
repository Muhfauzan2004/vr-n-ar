// Service Worker: Caching Aset 3D & Audio agar WebAR Super Ringan & Bisa Offline
const CACHE_NAME = 'webar-racing-v6';

const PRECACHE_ASSETS = [
  './index.html',
  './sirkuit.html',
  './lembar_ar.html',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Cache First Strategy untuk GLB 3D & Audio
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Cache GLB 3D models and audio files dynamically as they are fetched
  if (url.includes('.glb') || url.includes('.wav') || url.includes('.m4a') || url.includes('.mp3') || url.includes('.png')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => cachedResponse);
      })
    );
    return;
  }

  // Network First fallback to Cache for HTML
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

