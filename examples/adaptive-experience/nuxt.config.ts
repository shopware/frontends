export default defineNuxtConfig({
  // Everything commerce-related - Shopware wiring, product cards, listing
  // filters, cart - comes from the starter template untouched. This layer adds
  // only the adaptive experience on top, so the diff is exactly what the
  // blueprint costs.
  extends: ["../../templates/vue-starter-template"],
  compatibilityDate: "2025-04-15",
  unocss: {
    nuxtLayers: true,
  },
  telemetry: false,
  experimental: {
    payloadExtraction: false,
  },
});
