import { defineConfigWithTheme } from "vitepress";
import type { Config as ThemeConfig } from "vitepress-shopware-docs";
import baseConfig from "vitepress-shopware-docs/config";
import { TsFunctionDescription, TsFunctionsList } from "@shopware-pwa/typer";
import nav from "./navigation";
import { resolve } from "node:path";

export const sidebar = [
  {
    text: "SHOPWARE FRONTENDS",
    items: [
      { text: "Overview", link: "/" },
      { text: "Why Shopware Frontends", link: "/why-shopware-frontends" },
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
      { text: "Images", link: "/framework/images" },
      { text: "Associations", link: "/framework/associations" },
    ],
  },
  {
    text: "BUILDING",
    items: [
      { text: "Setup Templates", link: "/getting-started/templates" },
      { text: "Routing", link: "/getting-started/routing" },
      { text: "CMS", link: "/getting-started/cms/index" },
      { text: "E-Commerce", link: "/getting-started/e-commerce/index" },
      { text: "Page elements", link: "/getting-started/page-elements/index" },
      {
        text: "Overwriting and extending composables",
        link: "/getting-started/overwriting-composables",
      },
      {
        text: "Sitemap",
        link: "/getting-started/sitemap",
      },
      { text: "Wishlist", link: "/getting-started/wishlist" },
    ],
  },
  {
    text: "BEST PRACTICES",
    items: [
      { text: "Deployment", link: "/best-practices/deployment" },
      { text: "Error Handling", link: "/best-practices/error-handling" },
      { text: "Images", link: "/best-practices/images" },
      { text: "Performance", link: "/best-practices/performance" },
      { text: "Testing", link: "/best-practices/testing" },
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
      { text: "Community Modules", link: "/resources/community-modules/" },
    ],
  },
];

interface ThemeConfigExtended extends ThemeConfig {
  ai: {
    endpoint: string;
  };
}

export default defineConfigWithTheme<ThemeConfigExtended>({
  extends: baseConfig,
  lang: "en-US",
  title: "Shopware Frontends",
  description: "Documentation for Shopware developers",
  srcDir: "src",
  // srcExclude: ["tutorial/**/description.md"], In case we need something to be excluded
  scrollOffset: "header",
  ignoreDeadLinks: true, // remove once MR #294 is merged

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
    ai: {
      endpoint: "",
    },
    // TODO: temporarily disabled; change to actual repository pattern once vitepress is upgraded to have editLink.pattern: https://vitepress.dev/reference/default-theme-edit-link#site-level-config
    editLink: false as any,
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
    plugins: [
      TsFunctionsList(),
      TsFunctionDescription({
        rootDir: resolve(__dirname, "../../../"),
        dirs: [
          {
            autogenExampleAlias: "api-client",
            functions: resolve(
              __dirname,
              "../../../packages/api-client/src/services"
            ),
            types: resolve(
              __dirname,
              "../../../packages/types/shopware-6-client/"
            ),
          },
          {
            functions: resolve(__dirname, "../../../packages/composables/src/"),
            types: resolve(
              __dirname,
              "../../../packages/types/shopware-6-client/"
            ),
          },
          {
            functions: resolve(__dirname, "../../../packages/helpers/src/"),
            types: resolve(
              __dirname,
              "../../../packages/types/shopware-6-client/"
            ),
          },
        ],
      }),
    ],
  },
  vue: {
    reactivityTransform: true,
  },
});
