import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  routeRules: {
    "/": {
      isr: 60 * 60 * 24, // 86400s = 24h
    },
    "/checkout": {
      ssr: false,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    },
    "/checkout/**": { ssr: false },
    "/login": { ssr: false },
    "/register": { ssr: false },
    "/reset-password": { ssr: false },
    "/wishlist": { ssr: false },
    "/account": { ssr: false },
    "/account/**": { ssr: false },
    "/search": { ssr: false },
    "/search/**": { ssr: false },
    "/**": {
      isr: 60 * 60 * 24, // catch-all 24h ISR
    },
  },
});
