import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["src/module"],
  rollup: {
    emitCJS: false,
    cjsBridge: true,
    inlineDependencies: true,
  },
  declaration: true,
  externals: ["@nuxt/schema", "@nuxt/kit", "@nuxt/devtools-kit"],
});
