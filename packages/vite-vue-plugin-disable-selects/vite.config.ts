import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src", "plugin.ts"),
      name: "vite-vue-plugin-disable-selects",
      formats: ["es"],
      fileName: (format: string) => `index.${format}.js`,
    },
    emptyOutDir: false,
  },
});
