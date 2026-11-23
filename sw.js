const CACHE_NAME = 'bhashabuddy-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/languageContext.js',
  '/js/levenshtein.js',
  '/js/speechService.js',
  '/js/api.js',
  '/js/components/navbar.js',
  '/js/components/dashboard.js',
  '/js/components/flashcard.js',
  '/js/components/pronunciationLab.js',
  '/js/components/vocabulary.js',
  '/js/components/quiz.js',
  '/js/components/visualDictionary.js',
  '/js/components/chatbot.js',
  '/js/app.js',
  '/api/vocabulary',
  '/api/vocabulary/daily'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.log('SW Cache partial notice:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, resClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
