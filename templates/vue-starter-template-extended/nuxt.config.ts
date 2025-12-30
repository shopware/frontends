// https://nuxt.com/docs/api/configuration/nuxt-config
import { createResolver } from "@nuxt/kit";

const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
  extends: ["../vue-starter-template"],
  compatibilityDate: "2025-12-05",
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
  components: [
    {
      // Infrastructure components: ContentElement, ContentPage, ContentHydrator
      path: resolve("./app/components/public/content"),
      pathPrefix: false,
      global: true,
      extensions: [".vue"],
    },
    {
      // Content element components: ContentText, ContentImage, etc.
      path: resolve("./app/components/content"),
      pathPrefix: false,
      global: true,
      extensions: [".vue"],
    },
  ],
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
});
