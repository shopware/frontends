import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import shopwareConfig from "eslint-config-shopware";
import pluginVue from "eslint-plugin-vue";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...shopwareConfig,
  ...pluginVue.configs["flat/strongly-recommended"],
  ...compat.extends("plugin:prettier/recommended", "prettier"),
  {
    files: ["*.vue", "**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
    },
  },
  {
    ignores: [
      "helpers/html-to-vue/", // TODO: https://github.com/shopware/frontends/issues/1088 Remove this ignore after refactoring html-to-vue
      "components/SwProductListingFilters.vue", // TODO: https://github.com/shopware/frontends/issues/841 Remove this ignore after refactoring useListing composable
      "components/SwProductListingFilter.vue", // TODO: https://github.com/shopware/frontends/issues/841 Remove this ignore after refactoring useListing composable
    ],
  },
];
