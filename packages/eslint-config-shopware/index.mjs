import typescriptEslint from "@typescript-eslint/eslint-plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
  {
    ignores: ["**/dist/", "**/node_modules/"],
  },
  ...compat.extends("plugin:@typescript-eslint/recommended", "prettier"),
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },

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