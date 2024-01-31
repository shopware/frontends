import { defineConfig } from "vitest/config";
import codspeedPlugin from "@codspeed/vitest-plugin";

// config to run benchmarks globally
export default defineConfig({
  plugins: [codspeedPlugin()],
});
