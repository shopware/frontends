import { resolve } from "pathe";
import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["src/index"],
  declaration: true,
  rollup: {
    inlineDependencies: true,
  },
  externals: [
    "axios",
    "vue",
    "scule",
    "@shopware/api-client",
    "@shopware/helpers",
    "@vueuse/core",
  ],
  alias: {
    "#imports": resolve("./src/index.ts"),
    "#shopware": resolve("./types/api-types.ts"),
  },
});
