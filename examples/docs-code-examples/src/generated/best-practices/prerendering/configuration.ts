import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  nitro: {
    prerender: {
      // This is the setting that matters. Raw Nitro defaults to one page at a
      // time, but Nuxt raises it to four times your CPU count, and each page
      // render fans out into several Store API calls of its own.
      concurrency: 2,
      // Spaces out each worker's next request. It is not a global rate limit:
      // up to `concurrency` requests can still land together. It is also the
      // only room a page gets. Nitro does not retry a failed page - the
      // prerenderer's local fetch ignores `retry` and `retryDelay` - so a
      // rate-limited render stays failed.
      interval: 200,
      // Leave Nuxt's `failOnError: true` alone for a build you deploy (raw
      // Nitro defaults to false). Set it to false only to collect diagnostics
      // or inspect partial output.
      // Own the route list once coverage matters, rather than relying on what
      // the rendered HTML happens to link to.
      // crawlLinks: false,
      // routes: ["/", "/some-category"],
    },
  },
  experimental: {
    // The starter ships `false`, which suits the server-rendered deployment it
    // targets. Nuxt flags that as suboptimal for a static build (NUXT_B7015).
    payloadExtraction: true,
  },
});
