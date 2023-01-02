module.exports = {
  root: true,
  extends: ["plugin:vue/vue3-recommended"],
  parser: "vue-eslint-parser",
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
