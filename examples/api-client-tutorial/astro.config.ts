import tutorialkit from "@tutorialkit/astro";
import { defineConfig, passthroughImageService } from "astro/config";

export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 600,
    },
  },
  integrations: [tutorialkit()],
  image: {
    service: passthroughImageService(),
  },
});
