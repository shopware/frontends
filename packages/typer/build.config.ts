import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["src/index"],
  declaration: true,
  rollup: {
    emitCJS: true,
    cjsBridge: true,
  },
  externals: ["typedoc", "fs-extra", "find-in-files", "ts-dox", "vite"],
});
