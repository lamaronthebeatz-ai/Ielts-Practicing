// Service worker: precache the app shell for full offline use.
// Bump VERSION whenever any precached file changes.
const VERSION = 'v1.0.0';
const CACHE = `ielts-prep-${VERSION}`;

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/app.css',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './js/app.js',
  './js/store.js',
  './js/ui.js',
  './js/tts.js',
  './js/quiz.js',
  './js/charts.js',
  './js/scoring.js',
  './js/data/reading.js',
  './js/data/listening.js',
  './js/data/writing.js',
  './js/data/speaking.js',
  './js/data/descriptors.js',
  './js/data/format.js',
  './js/data/vocab.js',
  './js/views/home.js',
  './js/views/guide.js',
  './js/views/reading.js',
  './js/views/listening.js',
  './js/views/writing.js',
  './js/views/speaking.js',
  './js/views/vocab.js',
  './js/views/progress.js',
  './js/views/tools.js',
  './js/views/settings.js',
  './js/views/more.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('ielts-prep-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    // Network-first for the HTML shell so updates are picked up; fall back offline.
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html')),
    );
    return;
  }

  // Cache-first for static assets (versioned via CACHE name).
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(
      (hit) =>
        hit ||
        fetch(req).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        }),
    ),
  );
});
