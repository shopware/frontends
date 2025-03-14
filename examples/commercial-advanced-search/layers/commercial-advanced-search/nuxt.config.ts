// https://nuxt.com/docs/api/configuration/nuxt-config

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  hooks: {
    "pages:extend"(pages) {
      for (const page of pages) {
        if (page.path.includes("/search")) {
          page.meta ||= {};
          page.meta.middleware = ["search"];
        }
      }
    },
  },
  components: {
    dirs: [
      {
        path: join(currentDir, "./components"),
        pathPrefix: false,
        priority: 10,
      },
    ],
  },
});
