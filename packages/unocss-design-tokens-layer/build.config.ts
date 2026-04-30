import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["src/index"],
  declaration: true,
  rollup: {
    emitCJS: false,
    cjsBridge: true,
  },
  externals: ["@nuxt/schema", "nuxt/config"],
});
