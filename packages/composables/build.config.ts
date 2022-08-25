import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["src/index"],
  declaration: true,
  externals: [
    "axios",
    "vue",
    "scule",
    "@shopware-pwa/shopware-6-client",
    "@shopware-pwa/helpers-next",
    "@shopware-pwa/types",
  ],
});
