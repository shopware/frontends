import { SearchPlugin } from "vitepress-plugin-search";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [SearchPlugin()],
  build: {
    manifest: true,
    rollupOptions: {
      external: ["README.md"],
    },
  },
});
