// Evento de instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('my-cache').then((cache) => {
      return cache.addAll([
        '/',                 // Página inicial
        '/HomeDesign.html',        // Página home
        '/icons/Target-.jpg',
        '/offline.html',
      ]);
    })
  );
});

// Evento de interceptação de requisições
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Se encontrado no cache, responde com a versão em cache
      if (cachedResponse) {
        return cachedResponse;
      }
      // Caso não esteja no cache, realiza o fetch normalmente
      return fetch(event.request).catch(() => {
        // Caso não tenha conexão com a internet, retorna uma página de fallback (opcional)
        return caches.match('/offline.html');
      });
    })
  );
});

// Evento de ativação do Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = ['my-cache'];  // Lista de caches permitidos
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            // Deleta caches antigos que não estão na whitelist
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
