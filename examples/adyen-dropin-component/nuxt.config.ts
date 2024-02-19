export default defineNuxtConfig({
  extends: [
    "@shopware-pwa/composables-next/nuxt-layer",
    "@shopware-pwa/cms-base",
  ],
  runtimeConfig: {
    public: {
      loginData: {
        // for demo purposes, the customer is logged in automatically, so please adjust the loginData to some of yours customer account
        username: "someemail@demo.com",
        password: "changeme",
      },
      shopware: {
        // your Shopware 6 instance endpoint and access key
        shopwareEndpoint: "https://demo-frontends.shopware.store",
        shopwareAccessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
      },
      adyenCheckout: {
        environment: "test", // Change to 'live' for the live environment.
        clientKey: "test_FDABHCVU2VFJ7MS36FXHHNJHOQ6FJXY5", // Public key used for client-side authentication: https://docs.adyen.com/development-resources/client-side-authentication
        analytics: {
          enabled: true, // Set to false to not send analytics data to Adyen.
        },
      },
    },
  },
  css: [
    "@unocss/reset/tailwind-compat.css", // needed to reset styles see https://unocss.dev/guide/style-reset (@unocss/reset)
  ],
  modules: ["@unocss/nuxt", "@shopware-pwa/nuxt3-module"],
  devtools: { enabled: true },
  telemetry: false,
});
