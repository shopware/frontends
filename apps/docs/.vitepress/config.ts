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
      { text: "Breadcrumbs", link: "/getting-started/breadcrumbs" },
      { text: "Routing", link: "/getting-started/routing" },
      { text: "Content Pages", link: "/getting-started/content-pages" },
      { text: "Cart", link: "/getting-started/cart" },
      { text: "Checkout ", link: "/getting-started/checkout" },
      { text: "Custom Payment", link: "/getting-started/custom-payment" },
      { text: "Login Form", link: "/getting-started/login-form" },
      { text: "Prices", link: "/getting-started/prices" },
      { text: "Product Listing", link: "/getting-started/product-listing" },
      { text: "Wishlist", link: "/getting-started/wishlist" },
      {
        text: "Overwriting and extending composables",
        link: "/getting-started/overwriting-composables",
      },
    ],
  },
  {
    text: "FRAMEWORK",
    items: [
      { text: "Requirements", link: "/framework/requirements" },
      { text: "Internal Structure", link: "/framework/internal-structure" },
      { text: "Shopping Experiences", link: "/framework/shopping-experiences" },
      { text: "Styling", link: "/framework/styling" },
      { text: "Context Composables", link: "/framework/context-composables" },
      { text: "Shared Composables", link: "/framework/shared-composables" },
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
      { text: "API Client", link: "/packages/api-client" },
      { text: "Types", link: "/packages/types" },
      { text: "Helpers", link: "/packages/helpers" },
    ],
  },
  {
    text: "RESOURCES",
    items: [
      { text: "Examples", link: "/resources/examples/" },
      { text: "Community Modules", link: "/resources/community-modules/" }
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
  }
});
