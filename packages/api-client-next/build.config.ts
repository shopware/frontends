import { defineBuildConfig } from "unbuild";
export default defineBuildConfig({
  entries: ["src/index"],
  declaration: true,
  rollup: {
    cjsBridge: true,
    emitCJS: true,
  },
  externals: [],
});
