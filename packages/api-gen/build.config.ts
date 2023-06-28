import { defineBuildConfig } from "unbuild";
export default defineBuildConfig({
  entries: ["src/cli"],
  rollup: {
    inlineDependencies: true,
  },
  declaration: true,
  externals: ["prettier"],
});
