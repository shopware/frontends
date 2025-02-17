import { defineBuildConfig } from "unbuild";
export default defineBuildConfig({
  entries: ["src/cli", "src/index"],
  rollup: {
    inlineDependencies: true,
    cjsBridge: true,
  },
  declaration: true,
  externals: ["prettier"],
});
