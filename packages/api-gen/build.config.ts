import { defineBuildConfig } from "unbuild";
export default defineBuildConfig({
  entries: [
    "src/cli",
    "src/commands/generate",
    "src/commands/loadSchema",
    "src/commands/validateJson",
  ],
  rollup: {
    inlineDependencies: true,
    cjsBridge: true,
  },
  declaration: true,
  externals: ["prettier"],
});
