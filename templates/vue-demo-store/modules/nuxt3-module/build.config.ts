import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["src/index"],
  rollup: {
    emitCJS: false,
    cjsBridge: true,
  },
  declaration: true,
  externals: ["@nuxt/schema", "@nuxt/kit", "@nuxt/devtools-kit"],
});
