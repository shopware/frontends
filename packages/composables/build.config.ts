import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["src/index"],
  declaration: true,
  externals: [
    "axios",
    "vue",
    "scule",
    "@shopware-pwa/api-client",
    "@shopware-pwa/helpers-next",
    "@shopware-pwa/types",
    "@vueuse/core",
  ],
  alias: {
    "#imports": "./src/index.ts",
  },
  failOnWarn: false,
});
