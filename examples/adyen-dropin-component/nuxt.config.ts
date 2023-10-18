export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      loginData: {
        username: "maciejkucmus@gmail.com",
        password: "test12345",
      },
      shopware: {
        shopwareEndpoint: "http://localhost:8000",
        shopwareAccessToken: "SWSCCMR1DEXDTK0XRJVSD3DHMW",
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
  modules: ["@shopware-pwa/nuxt3-module"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },
});
