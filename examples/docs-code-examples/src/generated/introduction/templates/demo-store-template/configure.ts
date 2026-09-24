import { defineNuxtConfig } from "nuxt/config";

/* ... */
export default defineNuxtConfig({
  runtimeConfig: {
    // shopware: {
    /**
     * SSR Shopware Endpoint
     * More here: https://developer.shopware.com/frontends/introduction/templates/custom-vue-project.html#shopware-endpoint-on-the-ssr-mode
     */
    //   endpoint: ""
    // },
    public: {
      shopware: {
        endpoint: "https://your-business.shopware.store",
        accessToken: "access-token-from-settings",
      },
    },
  },
});
