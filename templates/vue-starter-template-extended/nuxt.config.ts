// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ["./base-template"],
  compatibilityDate: "2025-12-05",
  modules: ["@unocss/nuxt"],
  sourcemap: {
    client: false,
    server: false,
  },
  vite: {
    server: {
      fs: {
        allow: ["./base-template"],
      },
    },
    resolve: {
      alias: {
        "source-map-js/lib/source-map-generator.js": "source-map-js",
      },
    },
    optimizeDeps: {
      force: true,
      include: [
        "@unocss/transformer-attributify-jsx",
        "@babel/traverse",
        "source-map-js",
        "source-map",
      ],
    },
  },
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
});
