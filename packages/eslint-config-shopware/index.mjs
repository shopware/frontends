import tsEslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    name: "ignore-build-outputs",
    ignores: [
      "**/dist/",
      "**/node_modules/",
      "**/.output/",
      "**/.turbo/",
      "**/.vercel/",
      "**/.nuxt/",
      "**/.next/",
      "**/coverage/",
      "**/temp/",
    ],
  },
  {
    name: "prettier:recommended",
    ...eslintConfigPrettier,
  },
  ...tsEslint.configs.strict,
];
