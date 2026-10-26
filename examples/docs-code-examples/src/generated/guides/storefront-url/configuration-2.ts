import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  // the key has to be present for the env override to apply
  shopware: {
    devStorefrontUrl: "",
  },
});
