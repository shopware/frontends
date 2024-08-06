import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["src/module", "src/runtime/plugin"],
  rollup: {
    emitCJS: false,
    cjsBridge: true,
    inlineDependencies: true,
  },
  declaration: true,
  externals: ["@nuxt/schema", "@nuxt/kit", "@nuxt/devtools-kit"],
});
