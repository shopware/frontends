import parser from "vue-eslint-parser";
import pluginVue from "eslint-plugin-vue";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  ...pluginVue.configs["flat/recommended"],
  {
    name: "nuxt:ignore-generated-files",
    ignores: [
      "**/dist/",
      "**/node_modules/",
      "**/storeApiSchema.d.ts",
      "**/.output/",
      "**/.nuxt/",
      "**/.vercel/",
      "**/.turbo/",
    ],
  },
  {
    name: "prettier:recommended",
    ...eslintConfigPrettier,
  },
  {
    name: "vue:typescript-eslint",
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
  {
    name: "turn-off-deprected-rules",
    rules: {
      "vue/component-tags-order": "off",
    },
  },
];
