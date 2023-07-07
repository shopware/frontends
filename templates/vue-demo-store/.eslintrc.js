module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier",
  ],
  parser: "vue-eslint-parser",
  ignorePatterns: ["dist/", "node_modules/"],
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "vue/multi-word-component-names": [
      "error",
      {
        ignores: ["checkout"],
      },
    ],
  },
};
