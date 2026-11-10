// The confirm page is client-rendered, so its first response gets its headers
// here, for the canonical path and the localized aliases alike: no caching, no
// Referer carrying the token, no indexing. Off, or on a host that is not the
// shop's, the page and the adopt route do not exist.
const CONTINUE_PATH = /^\/(?:[a-z]{2}-[A-Z]{2}\/)?checkout\/continue\//;

export default defineEventHandler((event) => {
  if (!CONTINUE_PATH.test(event.path)) {
    return;
  }

  if (!isHandoffEnabled(event) || !isStorefrontHost(event)) {
    throw createError({ statusCode: 404, statusMessage: "Not Found" });
  }

  setResponseHeaders(event, {
    "Cache-Control": "no-store, private",
    "Referrer-Policy": "no-referrer",
    "X-Robots-Tag": "noindex, nofollow",
  });
});
