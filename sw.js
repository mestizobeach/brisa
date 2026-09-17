self.addEventListener("install", (event) => event.waitUntil(caches.open("brisa-v5").then((cache) => cache.addAll(["./", "./index.html", "./styles.css", "./app.js", "./manifest.webmanifest"]))));
self.addEventListener("fetch", (event) => event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request))));
