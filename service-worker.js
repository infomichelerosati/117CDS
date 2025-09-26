// Definisce il nome e la versione della cache
const CACHE_NAME = 'neopatentati-checker-v2';
// Lista dei file essenziali da memorizzare nella cache per il funzionamento offline
const urlsToCache = [
  '/',
  'index.html'
];

// Evento 'install': si verifica quando il service worker viene installato per la prima volta.
// Qui apriamo la nostra cache e aggiungiamo i file principali.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aperta');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'fetch': si verifica ogni volta che l'app richiede una risorsa (es. pagina, script, immagine).
// Il service worker intercetta la richiesta e risponde con la versione in cache se disponibile,
// altrimenti la recupera dalla rete.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se la risorsa è in cache, la restituisce
        if (response) {
          return response;
        }
        // Altrimenti, la richiede alla rete
        return fetch(event.request);
      }
    )
  );
});

// Evento 'activate': si verifica quando il service worker viene attivato.
// Utile per pulire vecchie cache non più necessarie.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

