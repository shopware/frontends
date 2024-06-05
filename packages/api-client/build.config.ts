import { defineBuildConfig } from "unbuild";
export default defineBuildConfig({
  entries: ["src/index"],
  declaration: true,
  externals: [
    "axios",
    "@shopware-pwa/types",
    "query-string",
    "@shopware/api-client",
  ],
  rollup: {
    replace: {
      values: {
        "process.env.NODE_ENV": `"${process.env.NODE_ENV}"`,
      },
    },
  },
});
