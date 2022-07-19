import { defineConfigWithTheme } from "vitepress";
import type { Config as ThemeConfig } from "vitepress-shopware-docs";
import baseConfig from "vitepress-shopware-docs/config";

console.error("BASE CONF", baseConfig);

const nav = [
  // {
  //   text: "Guide",
  //   activeMatch: `^/(guide|cookbook|examples)/`,
  //   items: [
  //     { text: "Guide", link: "/guide/introduction" },
  //     { text: "Examples", link: "/examples/" },
  //   ],
  // },
  // {
  //   text: "API",
  //   activeMatch: `^/api/`,
  //   link: "/api/",
  // },
];

export const sidebar = {
  // "/guide/": [
  //   {
  //     text: "Getting Started",
  //     items: [
  //       { text: "Introduction", link: "/guide/introduction" },
  //       {
  //         text: "Quick Start",
  //         link: "/guide/quick-start",
  //       },
  //     ],
  //   },
  // ],
  // "/api/": [
  //   {
  //     text: "Global API",
  //     items: [
  //       { text: "Application", link: "/api/application" },
  //       {
  //         text: "General",
  //         link: "/api/general",
  //       },
  //     ],
  //   },
  // ],
};

export default defineConfigWithTheme<ThemeConfig>({
  extends: baseConfig,

  lang: "en-US",
  title: "Shopware Frontends",
  description: "Documentation for Shopware developers",
  srcDir: "src",
  // srcExclude: ["tutorial/**/description.md"], In case we need something to be excluded
  scrollOffset: "header",

  head: [],

  themeConfig: {
    nav,
    sidebar,

    algolia: {
      indexName: "",
      appId: "",
      apiKey: "",
      // searchParameters: {
      //   facetFilters: ["version:v1"],
      // },
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/shopware/" },
      { icon: "twitter", link: "https://twitter.com/ShopwareDevs" },
      { icon: "slack", link: "https://slack.shopware.com" },
    ],
  },

  vite: {
    define: {
      __VUE_OPTIONS_API__: false,
    },
    server: {
      host: true,
      fs: {
        // for when developing with locally linked theme
        allow: ["../.."],
      },
    },
    build: {
      minify: "terser",
      chunkSizeWarningLimit: Infinity,
    },
    json: {
      stringify: true,
    },
  },

  vue: {
    reactivityTransform: true,
  },
});
