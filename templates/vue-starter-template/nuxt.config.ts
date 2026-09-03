// https://nuxt.com/docs/api/configuration/nuxt-config
import { createResolver } from "@nuxt/kit";

const { resolve } = createResolver(import.meta.url);
const isStackBlitz = process.env.SHOPWARE_STACKBLITZ === "true";
const viteServerWebSocketWorkaround = {
  $server: {
    server: {
      // Work around Nuxt 4.4.x + Vite 8.1 duplicate websocket upgrade handling.
      // Remove once Nuxt ships https://github.com/nuxt/nuxt/pull/35458.
      ws: false,
    },
  },
} as Record<string, unknown>;

export default defineNuxtConfig({
  extends: [
    "@shopware/composables/nuxt-layer",
    "@shopware/cms-base-layer",
    "@shopware/unocss-design-tokens-layer",
  ],
  runtimeConfig: {
    shopware: {
      endpoint: "",
    },
    public: {
      apiClientConfig: {
        // A stalled call would otherwise hang the render indefinitely. Bounded,
        // it fails fast and GET requests get ofetch's built-in retry.
        timeout: 10000,
      },
      shopware: {
        endpoint: "https://demo-frontends.shopware.store/store-api/",
        accessToken: "SWSCNWDGMUWZM0TLVUU0YKLQVW",
        devStorefrontUrl: "https://frontends-demo.vercel.app",
        cacheableReads: true,
        // Uses the Shopware context cookie during SSR, so the first render matches
        // the user's currency. Disable shared HTML cache/ISR for these pages.
        // useUserContextInSSR: true,
      },
    },
  },
  compatibilityDate: "2025-04-15",
  devtools: { enabled: !isStackBlitz },
  modules: [
    "@vueuse/nuxt",
    "@unocss/nuxt",
    "@shopware/nuxt-module",
    "@nuxtjs/i18n",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/a11y",
  ],
  typescript: {
    strict: true,
  },
  features: {
    inlineStyles: true,
  },
  nitro: {
    externals: {
      inline: ["@iconify/utils"],
    },
  },
  vite: {
    ...viteServerWebSocketWorkaround,
    optimizeDeps: {
      include: [
        "@regle/core",
        "@regle/rules",
        "@unocss/runtime",
        "entities",
        "fflate",
        "html-to-ast",
        "js-cookie",
        "xss",
      ],
    },
  },
  css: ["@unocss/reset/tailwind-compat.css"],
  unocss: {
    nuxtLayers: true,
  },
  // resolveComponent targets must be global, and each global group needs its own
  // directory path — Nuxt skips later scans under an already-scanned path.
  // Avoid global:true on every component (INEFFECTIVE_DYNAMIC_IMPORT vs auto-imports).
  components: [
    {
      // SEO page resolver targets: FrontendDetailPage, FrontendLandingPage, ...
      path: resolve("./app/components/global"),
      pathPrefix: false,
      priority: 2,
      global: true,
      extensions: [".vue"],
    },
    {
      // Custom / override CMS blocks & elements (CmsBlock*, CmsElement*, ...).
      path: resolve("./app/components/cms"),
      pathPrefix: false,
      priority: 2,
      global: true,
      extensions: [".vue"],
    },
    {
      path: resolve("./app/components"),
      priority: 2,
      extensions: [".vue"],
    },
  ],
  i18n: {
    strategy: "prefix_except_default",
    defaultLocale: "en-GB",
    detectBrowserLanguage: false,
    langDir: "./src/langs/",
    vueI18n: "config.ts",
    locales: [
      {
        code: "en-GB",
        language: "en-GB",
        file: "en-GB.ts",
      },
      {
        code: "pl-PL",
        language: "pl-PL",
        file: "pl-PL.ts",
      },
      {
        code: "de-DE",
        file: "de-DE.ts",
        language: "de-DE",
      },
    ],
  },
  icon: {
    // Avoid bundling the full @iconify-json/carbon collection into Nitro (~1.1 MB).
    // Carbon icons in templates use UnoCSS (`i-carbon-*`); <Icon> uses shopware custom.
    serverBundle: {
      collections: [],
    },
    clientBundle: {
      includeCustomCollections: true,
      scan: true,
    },
    customCollections: [
      {
        prefix: "shopware",
        dir: resolve("./app/assets/icons"),
      },
    ],
  },
  routeRules: {
    "/**": {
      // 24-hour ISR — reduce for frequently updated catalogs or CMS-heavy storefronts.
      // If SSR uses the user's Shopware context for currency, disable this shared
      // HTML cache and use the no-store headers below to avoid currency flicker.
      isr: 60 * 60 * 24,
      headers: {
        // "Cache-Control": "private, no-store, max-age=0",
        // "Surrogate-Control": "no-store",
        "Surrogate-Control": "max-age=86400, stale-while-revalidate=86400",
      },
    },
    "/**/*.svg": {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
    "/checkout": {
      ssr: false,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Surrogate-Control": "no-store",
      },
    },
    "/checkout/**": {
      ssr: false,
      headers: {
        "Surrogate-Control": "no-store",
      },
    },
    "/account": {
      ssr: false,
      headers: {
        "Surrogate-Control": "no-store",
      },
    },
    "/account/**": {
      ssr: false,
      headers: {
        "Surrogate-Control": "no-store",
      },
    },
    "/wishlist": {
      ssr: false,
      headers: {
        "Surrogate-Control": "no-store",
      },
    },
  },
  imports: {
    dirs: [
      "utils",
      "utils/**",
      resolve("./i18n/utils"),
      resolve("./i18n/src/helpers"),
    ],
  },
  telemetry: false,
  experimental: {
    payloadExtraction: false,
  },
});
