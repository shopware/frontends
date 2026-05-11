// https://nuxt.com/docs/api/configuration/nuxt-config
const isStackBlitz = process.env.SHOPWARE_STACKBLITZ === "true";

export default defineNuxtConfig({
  extends: ["../vue-starter-template"],
  compatibilityDate: "2025-12-05",
  ...(isStackBlitz ? { devtools: { enabled: false } } : {}),
  modules: ["@unocss/nuxt"],
  runtimeConfig: {
    public: {
      shopware: {
        endpoint: "https://demo-frontends.shopware.store/store-api/",
        accessToken: "SWSCT0RWATU1RG9RT200M29XNA",
        devStorefrontUrl: "https://frontends-demo.vercel.app",
      },
    },
  },
  unocss: {
    nuxtLayers: true,
  },
  app: {
    head: {
      link: [
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/favicon.svg",
        },
      ],
    },
  },
  telemetry: false,
});
