module.exports = {
  ci: {
    collect: {
      numberOfRuns: 5,
      url: [
        "https://frontends-demo.vercel.app/",
        "https://frontends-demo.vercel.app/Products/",
        "https://frontends-demo.vercel.app/Summer-BBQ/",
      ],
      settings: {
        onlyCategories: [
          "performance",
          "accessibility",
          "best-practices",
          "seo",
        ],
        skipAudits: ["uses-http2"],
        chromeFlags: "--no-sandbox",
      },
    },
    assert: {
      assertions: {
        "categories:performance": [
          "warn",
          { minScore: 0.9, aggregationMethod: "median-run" },
          "error",
          { minScore: 0.8, aggregationMethod: "median-run" },
        ],
        "categories:accessibility": [
          "warn",
          { minScore: 0.9, aggregationMethod: "median-run" },
          "error",
          { minScore: 0.8, aggregationMethod: "median-run" },
        ],
        "categories:best-practices": [
          "warn",
          { minScore: 0.9, aggregationMethod: "median-run" },
          "error",
          { minScore: 0.8, aggregationMethod: "median-run" },
        ],
        "categories:seo": [
          "warn",
          { minScore: 0.9, aggregationMethod: "median-run" },
          "error",
          { minScore: 0.8, aggregationMethod: "median-run" },
        ],
      },
    },
  },
};
