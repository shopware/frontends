import shopwareConfig from "eslint-config-shopware";
import pluginVue from "eslint-plugin-vue";
import parser from "vue-eslint-parser";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    name: "prettier:recommended",
    ...eslintConfigPrettier,
  },
  ...pluginVue.configs["flat/recommended"],
  ...shopwareConfig,
  {
    ignores: [
      "helpers/html-to-vue/", // TODO: https://github.com/shopware/frontends/issues/1088 Remove this ignore after refactoring html-to-vue
      "components/SwProductListingFilters.vue", // TODO: https://github.com/shopware/frontends/issues/841 Remove this ignore after refactoring useListing composable
      "components/SwProductListingFilter.vue", // TODO: https://github.com/shopware/frontends/issues/841 Remove this ignore after refactoring useListing composable
    ],
  },
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
