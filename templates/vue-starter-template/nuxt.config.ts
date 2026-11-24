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

const defaultLocale = "en-GB";
const locales = [
  { code: "en-GB", language: "en-GB", file: "en-GB.ts" },
  { code: "pl-PL", language: "pl-PL", file: "pl-PL.ts" },
  { code: "de-DE", language: "de-DE", file: "de-DE.ts" },
];

// Personalized pages are rendered in the browser and never cached. "ssr: false"
// alone is not enough: under the "/**" ISR rule the empty app shell would still
// be stored.
const personalizedRule = {
  ssr: false,
  isr: false,
  headers: {
    "Cache-Control": "private, no-store",
    "Surrogate-Control": "no-store",
  },
};
const personalizedPaths = [
  "/checkout",
  "/checkout/**",
  "/account",
  "/account/**",
  "/wishlist",
];

// Route rules match raw paths and know nothing about i18n, so each path is
// repeated under every locale prefix. The default locale has none.
const personalizedRules = Object.fromEntries(
  locales
    .map((locale) => (locale.code === defaultLocale ? "" : `/${locale.code}`))
    .flatMap((prefix) =>
      personalizedPaths.map(
        (path) => [`${prefix}${path}`, personalizedRule] as const,
      ),
    ),
);

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
      // Public URL of the storefront. /sitemap.xml builds its links from it.
      siteUrl: "",
      // WebMCP agent tools, off by default: NUXT_PUBLIC_WEBMCP_ENABLED=true.
      webmcpEnabled: false,
      // Chrome origin trial token for WebMCP: NUXT_PUBLIC_WEBMCP_ORIGIN_TRIAL.
      webmcpOriginTrial: "",
      shopware: {
        endpoint: "https://demo-frontends.shopware.store/store-api/",
        accessToken: "SWSCNWDGMUWZM0TLVUU0YKLQVW",
        devStorefrontUrl: "https://demo-frontends.shopware.store/figma",
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
    defaultLocale,
    detectBrowserLanguage: false,
    langDir: "./src/langs/",
    vueI18n: "config.ts",
    locales,
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
    // The index lists URLs on the request host, but ISR caches one copy per
    // path for every domain of a deployment.
    "/sitemap.xml": {
      isr: false,
    },
    ...personalizedRules,
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
    // Deliberate for this ISR deployment. `nuxt generate` warns (NUXT_B7015)
    // because a static build wants it on. See https://developer.shopware.com/frontends/best-practices/prerendering.html
    payloadExtraction: false,
  },
});
