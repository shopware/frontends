import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["src/index"],

  rollup: {
    emitCJS: false,
    cjsBridge: true,
  },
  declaration: true,
  externals: [
    "vue",
    "@nuxt/schema",
    "@nuxt/kit",
    "@shopware-pwa/composables-next",
  ],
});
