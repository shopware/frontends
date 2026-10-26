import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  nitro: {
    prerender: {
      // This is the setting that matters. Nitro defaults to one page at a
      // time, but Nuxt raises it to four times your CPU count, and each page
      // render fans out into several Store API calls of its own.
      concurrency: 2,
      interval: 200,
      // A retry that lands inside the same window just collects a second
      // rejection, so give it room.
      retryDelay: 2000,
      // Leave Nuxt's `failOnError: true` alone for a build you deploy. Set it
      // to false only to collect diagnostics or inspect partial output.
      // Own the route list once coverage matters, rather than relying on what
      // the rendered HTML happens to link to.
      // crawlLinks: false,
      // routes: ["/", "/some-category"],
    },
  },
  experimental: {
    // The starter ships `false`, which suits the server-rendered deployment it
    // targets but is the wrong default for a static build (warning NUXT_B7015).
    payloadExtraction: true,
  },
});
