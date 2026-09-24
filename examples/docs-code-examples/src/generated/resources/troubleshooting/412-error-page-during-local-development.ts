import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  shopware: {
    accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW", // access token for corresponding sales channel
    endpoint: "https://demo-frontends.shopware.store/store-api/", // endpoint where store-api is available
    devStorefrontUrl: "https://demo-frontends.shopware.store", // see section below
  },
});
