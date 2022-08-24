import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["src/index"],
  declaration: true,
  externals: ["axios", "@shopware-pwa/types"],
});
