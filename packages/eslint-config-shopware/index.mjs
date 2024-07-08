import tsEslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  {
    ignores: ["**/dist/", "**/node_modules/"],
  },
  eslintPluginPrettierRecommended,
  ...tsEslint.configs.recommended,
  {
    languageOptions: {
      globals: {},
      ecmaVersion: "latest",
      sourceType: "module",
    },

    settings: {
      next: {
        rootDir: ["apps/*/", "packages/*/"],
      },
    },

    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "react/jsx-key": "off",
    },
  },
  {
    files: ["**/*.spec.ts", "**/*.test.ts"],

    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
