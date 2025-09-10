// Development Service Worker - Minimal functionality
console.log('Service Worker loaded in development mode');

// Skip all fetch events in development
self.addEventListener('fetch', (event) => {
  // Do nothing - let all requests pass through
  return;
});

// Minimal install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installed in development mode');
  self.skipWaiting();
});

// Minimal activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated in development mode');
  event.waitUntil(self.clients.claim());
});

