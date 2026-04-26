const CACHE = 'ofeiles-v4';
const FILES = [
  'ofeiles_updated_v12.html',
  'manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Never intercept auth handlers or non-GET requests
  if (
    url.includes('/__/auth/') ||
    url.includes('firebaseapp.com') ||
    url.includes('firebase.google.com') ||
    url.includes('googleapis.com') ||
    url.includes('accounts.google.com') ||
    url.includes('securetoken.google.com') ||
    url.includes('identitytoolkit') ||
    url.includes('chrome-extension') ||
    e.request.method !== 'GET'
  ) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached && !navigator.onLine) return cached;
      return fetch(e.request).then(res => {
        try {
          const clone = res.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        } catch(err) {}
        return res;
      }).catch(() => cached);
    })
  );
});
