module.exports = {
  ci: {
    collect: {
      numberOfRuns: 5,
      // vue-starter-template is the supported template. vue-demo-store is
      // deprecated and gets deleted by 2026-12-31, so its deployment is not
      // worth measuring any more.
      //
      // The old paths /Products/ and /Summer-BBQ/ are not a rename away: the
      // starter runs a different sales channel with a different catalogue, and
      // both paths return 404 on it. These three are the closest equivalents,
      // one home page and two category listings, and all return 200 today.
      url: [
        "https://frontends-starter-template.vercel.app/",
        "https://frontends-starter-template.vercel.app/Furniture/",
        "https://frontends-starter-template.vercel.app/Sale/",
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
