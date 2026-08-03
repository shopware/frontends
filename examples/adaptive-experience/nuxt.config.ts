export default defineNuxtConfig({
  // Everything commerce-related - Shopware wiring, product cards, listing
  // filters, cart - comes from the starter template untouched. This layer adds
  // only the adaptive experience on top, so the diff is exactly what the
  // blueprint costs.
  extends: ["../../templates/vue-starter-template"],
  compatibilityDate: "2025-04-15",
  // The bold §7 "genz" skin. Scoped entirely under `[data-vibe="genz"]`, so it is
  // inert until a rule or the user toggle sets that attribute on the adaptive route.
  css: ["~/assets/css/genz.css"],
  runtimeConfig: {
    public: {
      // How long the client waits for a planner proposal. The default 2s suits
      // a hosted model; a local model on CPU needs more, so it is tunable via
      // EXPERIENCE_PLANNER_TIMEOUT_MS.
      plannerTimeoutMs:
        Number(process.env.EXPERIENCE_PLANNER_TIMEOUT_MS) || 2000,
    },
  },
  unocss: {
    nuxtLayers: true,
  },
  telemetry: false,
  experimental: {
    payloadExtraction: false,
  },
});
