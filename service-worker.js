// service-worker.js
const CACHE_NAME = 'codigo-insulina-v2';
const ARCHIVOS = [
    '/',
    '/index.html',
    '/dashboard.html',
    '/tests.html',
    '/comidas.html',
    '/recetas.html',
    '/progreso.html',
    '/perfil.html',
    '/estilo.css',
    '/app.js',
    '/logo.png',
    '/manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ARCHIVOS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
            .catch(() => {
                return caches.match('/index.html');
            })
    );
});
