import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  routeRules: {
    "/**": {
      // 60-minute ISR - increase for mostly-static storefronts, decrease for frequently updated content
      isr: 60 * 60, // 3600s
    },
    "/**/*.svg": {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable", // 1 year
      },
    },
    "/checkout": {
      ssr: false,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    },
    "/checkout/**": { ssr: false },
    "/account": { ssr: false },
    "/account/**": { ssr: false },
    "/wishlist": { ssr: false },
  },
});
