import tutorialkit from "@tutorialkit/astro";
import { defineConfig, passthroughImageService } from "astro/config";

export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  integrations: [tutorialkit()],
  image: {
    service: passthroughImageService(),
  },
});
