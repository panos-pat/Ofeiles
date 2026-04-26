// Service Worker disabled for v12 - Firebase handles everything
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
