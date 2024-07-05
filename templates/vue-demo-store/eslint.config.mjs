import parser from "vue-eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import pluginVue from "eslint-plugin-vue";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

console.warn("github env:", import.meta.env?.GITHUB_ENV);

// DO NOT USE PRETTIER IN GITHUB ACTIONS
const USE_PRETTIER =
  typeof import.meta.env?.GITHUB_ENV !== "string"
    ? compat.extends("plugin:prettier/recommended", "prettier")
    : [];

export default [
  ...pluginVue.configs["flat/recommended"],
  {
    ignores: [
      "**/dist/",
      "**/node_modules/",
      "**/storeApiSchema.d.ts",
      "**/.output/",
      "**/.nuxt/",
    ],
  },
  ...USE_PRETTIER,
  {
    languageOptions: {
      parser: parser,
      ecmaVersion: 5,
      sourceType: "module",

      parserOptions: {
        parser: "@typescript-eslint/parser",

        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
];
