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
  ...compat.extends("plugin:prettier/recommended", "prettier"),
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
