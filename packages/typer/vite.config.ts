import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "typer",
      formats: ["es", "cjs"],
    },
    emptyOutDir: true,
    minify: true,
    rollupOptions: {
      external: ["typescript", "path", "fs", "typedoc"],
    },
  },
  plugins: [dts()],
});
