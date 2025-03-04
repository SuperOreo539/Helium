// Import the required scripts
try {
  importScripts("/staff/uv.bundle.js");
  importScripts("/staff/uv.config.js");
  importScripts("/staff/uv.sw.js");

  // Initialize the UV service worker
  const uv = new UVServiceWorker();

  self.addEventListener("fetch", (event) => {
    event.respondWith(
      (async function () {
        try {
          return await uv.fetch(event);
        } catch (err) {
          console.error("SW fetch error:", err);
          return fetch(event.request);
        }
      })(),
    );
  });

  // Basic lifecycle events
  self.addEventListener("install", (_event) => {
    console.log("Service worker installed");
    self.skipWaiting();
  });

  self.addEventListener("activate", (event) => {
    console.log("Service worker activated");
    event.waitUntil(clients.claim());
  });
} catch (err) {
  console.error("Service worker initialization error:", err);
}

// Add error handling
self.addEventListener("error", (event) => {
  console.error("Service worker error:", event.message);
});
