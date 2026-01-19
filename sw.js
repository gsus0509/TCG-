const CACHE_NAME = "tcg-cards-maker-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./image.png",
  "./html-to-imagen.min.js", // Usamos tu archivo local
  // Si usas la fuente local, descomenta la siguiente línea:
  // "./matrixregularsmallcaps.ttf" 
];

// Instalación del Service Worker
self.addEventListener("install", (e) => {
  self.skipWaiting(); // Forza al SW a activarse de inmediato
  
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cacheando archivos...");
      return cache.addAll(ASSETS);
    })
  );
});

// Activación y limpieza de cachés viejos
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  return self.clients.claim(); // Toma control de la página inmediatamente
});

// Estrategia: Cache First (Responder desde caché, si no existe, ir a internet)
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      // Si está en caché, lo devuelve. Si no, lo pide a internet.
      return res || fetch(e.request);
    })
  );
});
