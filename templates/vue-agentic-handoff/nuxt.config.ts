// Proxied to Shopware or carrying a session token (the continue route sets the
// buyer's session cookie on a GET), so no layer may cache them: "isr" opts out
// of the starter's "/**" ISR on Vercel, "cache" of Nitro's cache on any preset,
// and the headers of CDNs and browsers.
const uncached = {
  isr: false,
  cache: false as const,
  headers: {
    "Cache-Control": "no-store, private",
    "Surrogate-Control": "no-store",
  },
};

export default defineNuxtConfig({
  extends: ["../vue-starter-template"],
  compatibilityDate: "2025-12-05",
  runtimeConfig: {
    agenticHandoff: {
      // Origin of the Shopware instance running the agentic-commerce plugin.
      // Empty: derived from the Store API endpoint by dropping "/store-api".
      shopwareOrigin: "",
      // Hosts this storefront answers on, comma separated, with a port where
      // one is used ("shop.example.com,localhost:3000"). Empty trusts the
      // request, which preview deployments need and production should not.
      storefrontHosts: "",
    },
  },
  i18n: {
    langDir: "./locales/",
    locales: [
      { code: "en-GB", language: "en-GB", file: "en-GB.ts" },
      { code: "pl-PL", language: "pl-PL", file: "pl-PL.ts" },
      { code: "de-DE", language: "de-DE", file: "de-DE.ts" },
    ],
  },
  routeRules: {
    "/.well-known/ucp": uncached,
    "/.well-known/agent-card.json": uncached,
    "/ucp/**": uncached,
    "/checkout/continue/**": uncached,
  },
  unocss: {
    nuxtLayers: true,
  },
  telemetry: false,
  experimental: {
    payloadExtraction: false,
  },
});
