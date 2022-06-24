import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["src/index"],
  rollup: {
    emitCJS: false,
    cjsBridge: true,
  },
  declaration: true,
  externals: ["vue", "@shopware-pwa/shopware-6-client", "@shopware-pwa/helpers", "@shopware-pwa/commons"],
});
