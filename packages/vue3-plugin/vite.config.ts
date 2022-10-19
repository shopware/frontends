import { defineConfig } from "vite";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "vue3-plugin",
      formats: ["es"],
      fileName: (format: string) => `vue3-plugin.${format}.js`,
    },
    rollupOptions: {
      external: ["vue"],
    },
    emptyOutDir: false,
  },
});
