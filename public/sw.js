const CACHE_VERSION = "bugproof-__BUILD_TIME__";

// URLs that should NEVER be cached
const NO_CACHE_PATTERNS = [
  "/api/",
  "/callback",
  "/login",
  "/signup",
  "supabase.co",
  "googleapis.com",
  "accounts.google.com",
  "pagead2.googlesyndication.com",
  "adservice.google.com",
  "doubleclick.net",
  "stripe.com",
];

const MAX_CACHE_ITEMS = 200;

function shouldCache(url) {
  return !NO_CACHE_PATTERNS.some((pattern) => url.includes(pattern));
}

// Trim cache to prevent unbounded growth
async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    for (let i = 0; i < keys.length - maxItems; i++) {
      await cache.delete(keys[i]);
    }
  }
}

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // Skip non-GET and uncacheable requests
  if (event.request.method !== "GET" || !shouldCache(url)) {
    return;
  }

  // Static assets: Cache-First
  if (
    url.includes("/_next/static/") ||
    url.includes("/icons/") ||
    url.match(/\.(png|svg|jpg|jpeg|gif|ico|woff2?)$/)
  ) {
    event.respondWith(
      caches.match(event.request).then(
        (cached) =>
          cached ||
          fetch(event.request).then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, clone));
            }
            return response;
          })
      )
    );
    return;
  }

  // Pages & other requests: Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_VERSION).then((cache) => {
              cache.put(event.request, clone);
              trimCache(CACHE_VERSION, MAX_CACHE_ITEMS);
            });
          }
          return response;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
