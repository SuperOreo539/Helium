// Basic service worker
self.addEventListener("install", (_event) => {
  console.log("Service worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (e) => {
  // Basic service worker fetch handler
  if (
    e.request.url.includes("/heartbeat") ||
    e.request.url.includes("/get-broadcasts") ||
    e.request.url.includes("/get-message")
  ) {
    // Handle potential API failures gracefully
    e.respondWith(
      fetch(e.request).catch((_error) => {
        // Return an empty successful response instead of failing
        return new Response(JSON.stringify({}), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }),
    );
  }
  // Only intercept if it's not a system path
  else if (
    !e.request.url.includes("/class/") &&
    !e.request.url.includes("/api/") &&
    !e.request.url.includes("/acc/")
  ) {
    e.respondWith(
      fetch(e.request).catch((error) => {
        console.error("Fetch error in service worker:", error);
        return new Response("Network error occurred", {
          status: 503,
          headers: { "Content-Type": "text/plain" },
        });
      }),
    );
  }
});

// Error handling for service worker
self.addEventListener("error", (event) => {
  console.error("Service worker error:", event.message);
});

self.addEventListener("unhandledrejection", (event) => {
  console.error("Service worker unhandled rejection:", event.reason);
});
