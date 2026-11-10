// The confirm page is client-rendered, so its first response gets its headers
// here, on the canonical path and under any locale prefix: no caching, a
// Referer without the token (strict-origin keeps the origin only, and keeps
// the Origin header on the form post), no indexing. Off, or on a host that
// is not the shop's, the page and the adopt route do not exist.
const CONTINUE_PATH = /^\/(?:[^/]+\/)?checkout\/continue\//;

export default defineEventHandler((event) => {
  if (!CONTINUE_PATH.test(event.path)) {
    return;
  }

  if (!isHandoffEnabled(event) || !isStorefrontHost(event)) {
    throw createError({ statusCode: 404, statusMessage: "Not Found" });
  }

  setResponseHeaders(event, {
    "Cache-Control": "no-store, private",
    "Referrer-Policy": "strict-origin",
    "X-Robots-Tag": "noindex, nofollow",
  });
});
