import { dirname, join } from "node:path";
// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from "node:url";
const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  extends: ["@shopware/composables/nuxt-layer"],
  devtools: { enabled: true },
  imports: { autoImport: true },
});
