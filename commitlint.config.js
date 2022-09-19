module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "references-empty-ntr": [2, "never"],
  },
  parserPreset: {
    parserOpts: {
      issuePrefixes: ["SWF-", "NTR"],
    },
  },
  plugins: [
    {
      rules: {
        "references-empty-ntr": (parsed) => {
          let notEmpty = parsed.references.length > 0;
          if (!notEmpty && parsed.subject.includes("(NTR)")) notEmpty = true;

          return [
            notEmpty,
            "issue references may not be empty. Use '(NTR)' if there is no issue for this MR",
          ];
        },
      },
    },
  ],
};
