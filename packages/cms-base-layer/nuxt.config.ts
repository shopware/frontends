import { createResolver } from "@nuxt/kit";
import type { NuxtConfig } from "@nuxt/schema";
import { defineNuxtConfig } from "nuxt/config";

const { resolve: resolveLayer } = createResolver(import.meta.url);

export default defineNuxtConfig({
  modules: ["@unocss/nuxt", "@nuxt/image"],

  // @ts-ignore - @nuxt/image config may not be typed in some layer contexts
  image: {
    quality: 90,
    format: ["webp", "avif", "jpg"],
    // Custom Shopware provider that maps Nuxt Image modifiers to Shopware query parameters
    provider: "shopware",
    providers: {
      shopware: {
        name: "shopware",
        provider: resolveLayer("./app/providers/shopware.ts"),
      },
    },

    // Responsive breakpoints matching UnoCSS
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },

    // Presets for common CMS use cases
    presets: {
      productCard: {
        modifiers: {
          format: "webp",
          quality: 90,
          fit: "cover",
        },
        loading: "lazy",
      },
      productDetail: {
        modifiers: {
          format: "webp",
          quality: 90,
          fit: "contain",
        },
      },
      thumbnail: {
        modifiers: {
          format: "webp",
          quality: 90,
          width: 150,
          height: 150,
          fit: "cover",
        },
      },
      hero: {
        modifiers: {
          format: "webp",
          quality: 95,
          fit: "cover",
        },
      },
    },
  },

  components: [
    {
      path: resolveLayer("./app/components"),
      pattern: "Sw*",
      extensions: [".vue"],
      global: true,
    },
    {
      path: resolveLayer("./app/components/ui"),
      extensions: [".vue"],
      prefix: "Sw",
      global: true,
    },
    {
      path: resolveLayer("./app/components/public"),
      pathPrefix: false,
      global: true,
      extensions: [".vue"],
    },
  ],
  alias: {
    "@cms-assets": resolveLayer("./app/assets"),
  },
  build: {
    transpile: ["@shopware/cms-base-layer"],
  },
  telemetry: {
    enabled: false,
  },
}) as NuxtConfig;
