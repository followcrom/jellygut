const CACHE_NAME = "jellygut-cache-v2";
const PRECACHE_ASSETS = ["/", "/css/styles.css", "/js/script.js"];

// Install event - Precaching
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
});

// Fetch event - Cache-first strategy
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        console.log("Found in cache:", event.request.url);
        return response;
      }
      return fetch(event.request);
    })
  );
});

// Activate event - Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log(`Deleting old cache: ${key}`);
            return caches
              .delete(key)
              .catch((err) =>
                console.error(`Error deleting cache: ${key}`, err)
              );
          }
        })
      );
    })
  );
  event.waitUntil(self.clients.claim());
});
