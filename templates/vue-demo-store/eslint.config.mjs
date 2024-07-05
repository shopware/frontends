import parser from "vue-eslint-parser";
import pluginVue from "eslint-plugin-vue";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

console.warn("github env:", import.meta.env?.GITHUB_ENV);

// DO NOT USE PRETTIER IN GITHUB ACTIONS
const USE_PRETTIER =
  typeof import.meta.env?.GITHUB_ENV !== "string"
    ? [eslintPluginPrettierRecommended]
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
