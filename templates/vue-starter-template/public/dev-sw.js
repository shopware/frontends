/*
 * Nuxt dev requests `/dev-sw.js` for its development tooling.
 * This template has a catch-all `[...all].vue` page, so without a real static
 * file that request gets handled like a Shopware storefront route and causes
 * noisy SSR/dev-overlay errors.
 *
 * Keep this file as a no-op placeholder so the request is served from `public/`
 * instead of reaching the storefront route resolver.
 */
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
