// vite.config.ts
import { defineConfig } from "file:///home/maciek/projects/frontends/node_modules/.pnpm/vite@4.1.4/node_modules/vite/dist/node/index.js";
import { resolve } from "path";
import dts from "file:///home/maciek/projects/frontends/node_modules/.pnpm/vite-plugin-dts@2.0.2/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "/home/maciek/projects/frontends/packages/typer";
var vite_config_default = defineConfig({
  build: {
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/main.ts"),
      name: "typer",
      formats: ["es", "cjs"]
    },
    emptyOutDir: true,
    minify: true,
    rollupOptions: {
      external: ["typescript", "path", "fs", "typedoc"]
    }
  },
  plugins: [dts()]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9tYWNpZWsvcHJvamVjdHMvZnJvbnRlbmRzL3BhY2thZ2VzL3R5cGVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9tYWNpZWsvcHJvamVjdHMvZnJvbnRlbmRzL3BhY2thZ2VzL3R5cGVyL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL21hY2llay9wcm9qZWN0cy9mcm9udGVuZHMvcGFja2FnZXMvdHlwZXIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgZHRzIGZyb20gXCJ2aXRlLXBsdWdpbi1kdHNcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGJ1aWxkOiB7XG4gICAgbGliOiB7XG4gICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL21haW4udHNcIiksXG4gICAgICBuYW1lOiBcInR5cGVyXCIsXG4gICAgICBmb3JtYXRzOiBbXCJlc1wiLCBcImNqc1wiXSxcbiAgICB9LFxuICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuICAgIG1pbmlmeTogdHJ1ZSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBleHRlcm5hbDogW1widHlwZXNjcmlwdFwiLCBcInBhdGhcIiwgXCJmc1wiLCBcInR5cGVkb2NcIl0sXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW2R0cygpXSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE0VCxTQUFTLG9CQUFvQjtBQUN6VixTQUFTLGVBQWU7QUFDeEIsT0FBTyxTQUFTO0FBRmhCLElBQU0sbUNBQW1DO0FBS3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE9BQU87QUFBQSxJQUNMLEtBQUs7QUFBQSxNQUNILE9BQU8sUUFBUSxrQ0FBVyxhQUFhO0FBQUEsTUFDdkMsTUFBTTtBQUFBLE1BQ04sU0FBUyxDQUFDLE1BQU0sS0FBSztBQUFBLElBQ3ZCO0FBQUEsSUFDQSxhQUFhO0FBQUEsSUFDYixRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsTUFDYixVQUFVLENBQUMsY0FBYyxRQUFRLE1BQU0sU0FBUztBQUFBLElBQ2xEO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUyxDQUFDLElBQUksQ0FBQztBQUNqQixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
