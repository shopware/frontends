import { defineConfigWithTheme } from "vitepress";
import type { Config as ThemeConfig } from "vitepress-shopware-docs";
import baseConfig from "vitepress-shopware-docs/config";
import { MarkdownTransform } from "./plugins/markdownTransform";

import nav from "./navigation";

export const sidebar = [
  {
    text: "SHOPWARE FRONTENDS",
    items: [
      { text: "Overview", link: "/" },
      { text: "Why Shopware Frontends", link: "/why-shopware-frontends" },
    ],
  },
  {
    text: "BUILDING",
    items: [
      { text: "Setup Templates", link: "/getting-started/templates" },
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
  {
    text: "EXAMPLES",
    items: [{ text: "Overview", link: "/examples/" }],
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
  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/logo-icon.svg",
      },
    ],
    [
      "link",
      {
        rel: "mask-icon",
        type: "image/svg+xml",
        href: "/logo-icon.svg",
      },
    ],
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "57x57",
        href: "/logo-icon-57x57.png",
      },
    ],
    [
      "link",
      {
        rel: "shortcut icon",
        href: "/favicon-16x16.ico",
      },
    ],
    ["meta", { name: "og:type", content: "website" }],
    [
      "meta",
      { name: "og:site_name", content: "Shopware Frontends - Documentation" },
    ],
    ["meta", { name: "og:title", content: "" }],
    [
      "meta",
      {
        name: "og:description",
        content:
          "Shopware Frontends is a framework for building custom, headless storefronts with Shopware 6.",
      },
    ],
    [
      "meta",
      { name: "og:site_name", content: "Shopware Frontends - Documentation" },
    ],
    [
      "meta",
      {
        name: "og:image",
        content:
          "https://user-images.githubusercontent.com/5596960/192812626-03033263-dc5d-42e3-bf5c-b5b738cc48bb.png",
      },
    ],
  ],

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
    plugins: [MarkdownTransform()],
  },

  vue: {
    reactivityTransform: true,
  },
});
