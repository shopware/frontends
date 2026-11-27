import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  runtimeConfig: {
    // Private: available only on the server, never sent to the browser.
    // Leave the values empty and set them at runtime through
    // NUXT_ADMIN_API_ENDPOINT, NUXT_ADMIN_API_CLIENT_ID and
    // NUXT_ADMIN_API_CLIENT_SECRET.
    adminApiEndpoint: "",
    adminApiClientId: "",
    adminApiClientSecret: "",
    public: {
      // Public: serialized into every page. Nothing secret goes here.
    },
  },
  shopware: {
    endpoint: "https://demo-frontends.shopware.store/store-api/",
    // The sales channel access key is public by design.
    accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
  },
});
