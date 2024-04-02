import { defineBuildConfig } from "unbuild";
import { resolve } from "pathe";

export default defineBuildConfig({
  entries: ["src/index"],
  declaration: true,
  externals: [
    "axios",
    "vue",
    "scule",
    "@shopware/api-client",
    "@shopware-pwa/helpers-next",
    "@shopware-pwa/types",
    "@vueuse/core",
  ],
  alias: {
    "#imports": resolve("./src/index.ts"),
    "#shopware": resolve("./types/api-types.ts"),
  },
  failOnWarn: false,
});
