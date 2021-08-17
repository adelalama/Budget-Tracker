const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/index.js',
    '/db.js',
    '/manifest.json',
];

const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(PRECACHE)
          .then(function(cache) {
            return cache.addAll(FILES_TO_CACHE)
          })
          .then(self.skipWaiting())
      )
})
  
self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request)
          .catch(() => {
            return caches.open(PRECACHE)
              .then((cache) => {
                return cache.match(event.request)
              })
          })
    )
})
  
self.addEventListener('activate', function(event) {
    console.log('service-worker active');
    event.waitUntil(
        caches.keys()
          .then((keyList) => {
            return Promise.all(keyList.map((key) => {
              if (key !== PRECACHE) {
                console.log('[ServiceWorker] Removing old cache', key)
                return caches.delete(key)
              }
            }))
          })
          .then(() => self.clients.claim())
    )
})