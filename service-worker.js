/**
 * SERVICE WORKER - Progressive Web App Support
 * Enables offline functionality and advanced caching strategies
 * =================================================================
 */

const CACHE_NAME = "portfolio-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/manifest.json",
  "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
];

// Installation
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching static assets");
      return cache.addAll(STATIC_ASSETS).catch((error) => {
        console.log("Error caching assets:", error);
        // Continue even if some assets fail to cache
      });
    })
  );

  self.skipWaiting();
});

// Activation
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// Fetch Event - Network First Strategy for dynamic content
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Network first strategy for HTML
  if (request.destination === "document") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached version on network failure
          return caches.match(request).then((cached) => {
            if (cached) {
              return cached;
            }
            // Return offline page if available
            return caches.match("/index.html");
          });
        })
    );
  }
  // Cache first strategy for static assets
  else if (
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "font"
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          return cached;
        }

        return fetch(request)
          .then((response) => {
            if (response.ok) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return response;
          })
          .catch(() => {
            // Fallback for missing static assets
            return new Response("Asset not available offline", {
              status: 503,
              statusText: "Service Unavailable",
            });
          });
      })
    );
  }
  // Network first for images
  else if (request.destination === "image") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            if (cached) {
              return cached;
            }
            // Return placeholder image
            return new Response(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="#e0e0e0" width="400" height="300"/><text x="200" y="150" text-anchor="middle" dominant-baseline="middle" fill="#999" font-size="20">Image unavailable</text></svg>`,
              {
                headers: { "Content-Type": "image/svg+xml" },
              }
            );
          });
        })
    );
  }
});

// Background Sync
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-messages") {
    event.waitUntil(syncMessages());
  }
});

async function syncMessages() {
  try {
    // Sync any pending messages with the server
    console.log("Syncing messages...");
  } catch (error) {
    console.error("Sync failed:", error);
    throw error;
  }
}

// Push Notifications
self.addEventListener("push", (event) => {
  let notificationData = {
    title: "Portfolio Update",
    body: "New project added!",
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'><rect fill='%23007bff' width='192' height='192' rx='45'/><text x='50%' y='50%' font-size='120' font-weight='bold' fill='white' text-anchor='middle' dominant-baseline='middle'>P</text></svg>",
  };

  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.icon,
      tag: "portfolio-notification",
      requireInteraction: false,
    })
  );
});

// Notification Click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // Check if there's already a window/tab open
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === "/" && "focus" in client) {
          return client.focus();
        }
      }
      // If not, open a new window/tab
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});

// Message Event for client communication
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "GET_VERSION") {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

console.log("Service Worker loaded");
