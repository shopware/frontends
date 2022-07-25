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

export const sidebar = [
  {
    text: "SHOPWARE FRONTENDS",
    items: [{ text: "Overview", link: "/" }],
  },
  {
    text: "GETTING STARTED",
    items: [
      { text: "Templates", link: "/getting-started/templates" },
      { text: "Navigation", link: "/getting-started/navigation" },
      { text: "Content Pages", link: "/getting-started/content-pages" },
      { text: "Cart", link: "/getting-started/cart" },
      { text: "Checkout ", link: "/getting-started/checkout" },
    ],
  },
  {
    text: "FRAMEWORK",
    items: [
      { text: "Configuration", link: "/framework/configuration" },
      { text: "Shopping Experiences", link: "/framework/shopping-experiences" },
      { text: "Styling", link: "/framework/styling" },
      {
        text: "Asynchronous Components",
        link: "/framework/asynchronous-components",
      },
      { text: "API Defaults", link: "/framework/api-defaults" },
      { text: "Error Handling", link: "/framework/error-handling" },
    ],
  },
  {
    text: "BEST PRACTICES",
    items: [
      { text: "Testing", link: "/best-practices/testing" },
      { text: "Performance", link: "/best-practices/performance" },
      { text: "Deployment", link: "/best-practices/deployment" },
    ],
  },
  {
    text: "PACKAGE REFERENCE",
    items: [
      { text: "Composables", link: "/packages/composables" },
      { text: "Types", link: "/packages/types" },
      { text: "CMS Base", link: "/packages/cms-base" },
      { text: "Helpers", link: "/packages/helpers" },
    ],
  },
];

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
