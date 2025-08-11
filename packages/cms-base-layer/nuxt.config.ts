import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { NuxtConfig } from "@nuxt/schema";
import { defineNuxtConfig } from "nuxt/config";

const layerDir = fileURLToPath(new URL("./", import.meta.url));

export default defineNuxtConfig({
  modules: ["@unocss/nuxt"],
  components: [
    {
      path: resolve(layerDir, "app/components/public"),
      pathPrefix: false,
    },
    {
      path: resolve(layerDir, "app/components"),
      pattern: "Sw*",
      extensions: [".vue"],
      global: false,
    },
  ],
  build: {
    transpile: ["@shopware/cms-base-layer"],
  },
  telemetry: {
    enabled: false,
  },
}) as NuxtConfig;
