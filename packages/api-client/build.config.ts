import { defineBuildConfig } from "unbuild";
export default defineBuildConfig({
  entries: ["src/index", { input: "src/helpers/index", name: "helpers" }],
  declaration: true,
  rollup: {
    cjsBridge: true,
    emitCJS: true,
  },
  externals: ["fflate"],
});
