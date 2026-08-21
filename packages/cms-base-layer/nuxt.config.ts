import { createResolver } from "@nuxt/kit";
import type { NuxtConfig } from "@nuxt/schema";
import { defineNuxtConfig } from "nuxt/config";
import type { LoggingFunction, RollupLog } from "rollup";

import componentDirs from "./component-dirs.json";

const { resolve: resolveLayer } = createResolver(import.meta.url);

export default defineNuxtConfig({
  // @tresjs/nuxt is not included here because SwMedia3D is excluded from auto-import
  // to prevent bundling heavy 3D libraries in the initial bundle.
  // If you need 3D support, add "@tresjs/nuxt" to your app's nuxt.config.ts modules array
  // and dynamically import SwMedia3D using defineAsyncComponent.
  //
  // @unocss/nuxt is not included here either. This layer only ships CMS components,
  // the UnoCSS setup lives in @shopware/unocss-design-tokens-layer (or your own config),
  // so apps that don't use UnoCSS can still extend this layer.
  modules: ["@nuxt/image"],
  css: [resolveLayer("./app/assets/css/rich-text.css")],

  hooks: {
    "components:extend"(components) {
      // Exclude SwMedia3D from auto-import to prevent bundling heavy 3D libraries
      // It should be dynamically imported when needed using defineAsyncComponent.
      for (const name of componentDirs.excluded) {
        const index = components.findIndex((c) => c.pascalName === name);
        if (index > -1) components.splice(index, 1);
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

  components: componentDirs.dirs.map(({ path, ...dir }) => ({
    ...dir,
    path: resolveLayer(path),
    extensions: [".vue"],
  })),
  alias: {
    "@cms-assets": resolveLayer("./app/assets"),
  },
  build: {
    transpile: ["@shopware/cms-base-layer"],
  },
  vite: {
    optimizeDeps: {
      include: ["xss"],
    },
    build: {
      // Async SwMedia3D/three chunk is ~977 kB after minify; that split is intentional.
      chunkSizeWarningLimit: 1000,
    },
  },
  nitro: {
    rollupConfig: {
      // @vueuse/shared still embeds @__NO_SIDE_EFFECTS__ inside JSDoc (injectLocal).
      // Nitro/Rollup treats that as a misplaced annotation. Track upstream vueuse.
      onwarn(warning: RollupLog, warn: LoggingFunction) {
        if (
          warning.message?.includes("annotation that Rollup cannot interpret")
        ) {
          return;
        }
        warn(warning);
      },
    },
  },
  telemetry: {
    enabled: false,
  },
}) as NuxtConfig;
