import { createResolver } from "@nuxt/kit";
import type { NuxtConfig } from "@nuxt/schema";
import { defineNuxtConfig } from "nuxt/config";

const { resolve: resolveLayer } = createResolver(import.meta.url);

export default defineNuxtConfig({
  // @tresjs/nuxt is not included here because SwMedia3D is excluded from auto-import
  // to prevent bundling heavy 3D libraries in the initial bundle.
  // If you need 3D support, add "@tresjs/nuxt" to your app's nuxt.config.ts modules array
  // and dynamically import SwMedia3D using defineAsyncComponent.
  modules: ["@unocss/nuxt", "@nuxt/image"],

  hooks: {
    "components:extend"(components) {
      // Exclude SwMedia3D from auto-import to prevent bundling heavy 3D libraries
      // It should be dynamically imported when needed using defineAsyncComponent.
      const index = components.findIndex(
        (c) =>
          c.pascalName === "SwMedia3D" ||
          c.kebabName === "sw-media3-d" ||
          c.filePath?.includes("SwMedia3D.vue"),
      );
      if (index > -1) {
        components.splice(index, 1);
      }
    },
  },

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
