/* Jaylah's Academy service worker — bump CACHE_VERSION on every update. */
const CACHE_VERSION = 'jaylah-academy-v6';
const CORE = ['./', './index.html', './manifest.json', './icon-180.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE_VERSION).then((c) => c.addAll(CORE))); self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k)=>k!==CACHE_VERSION).map((k)=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then((res) => {
      if (res && res.status === 200 && res.type === 'basic') { const copy = res.clone(); caches.open(CACHE_VERSION).then((c)=>c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request))
  );
});
