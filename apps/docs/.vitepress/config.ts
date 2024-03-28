import { defineConfigWithTheme } from "vitepress";
import type { Config as ThemeConfig } from "vitepress-shopware-docs";
import baseConfig from "vitepress-shopware-docs/config";
import { TsFunctionDescription, TsFunctionsList } from "@shopware-pwa/typer";
import nav from "./navigation";
import { resolve } from "node:path";
import { SearchPlugin } from "vitepress-plugin-search";

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
    link: "/framework/",
    items: [
      { text: "Requirements", link: "/framework/requirements" },
      { text: "Internal Structure", link: "/framework/internal-structure" },
      {
        text: "Composables",
        link: "/framework/composables",
        items: [
          {
            text: "Context Composables",
            link: "/framework/composables/context-composables",
          },
          {
            text: "Shared Composables",
            link: "/framework/composables/shared-composables",
          },
          {
            text: "Overwriting Composables",
            link: "/framework/composables/overwriting-composables",
          },
        ],
      },
      { text: "Shopping Experiences", link: "/framework/shopping-experiences" },
      { text: "Styling", link: "/framework/styling" },
    ],
  },
  {
    text: "BUILDING",
    link: "/getting-started/",
    items: [
      {
        text: "Setup Templates",
        link: "/getting-started/templates",
        items: [
          {
            text: "Demo Store",
            link: "/getting-started/templates/demo-store-template",
          },
          {
            text: "Blank Template",
            link: "/getting-started/templates/blank-template",
          },
          {
            text: "Custom Vue Project",
            link: "/getting-started/templates/custom-vue-project",
          },
          {
            text: "Custom React Project",
            link: "/getting-started/templates/custom-react-project",
          },
          {
            text: "Astro Template",
            link: "/getting-started/templates/astro-template",
          },
        ],
      },
      { text: "Routing", link: "/getting-started/routing" },
      { text: "Languages", link: "/getting-started/languages" },
      {
        text: "CMS",
        link: "/getting-started/cms/",
        items: [
          { text: "Content Pages", link: "/getting-started/cms/content-pages" },
          {
            text: "Customize Components",
            link: "/getting-started/cms/customize-components",
          },
          { text: "Create Blocks", link: "/getting-started/cms/create-blocks" },
          {
            text: "Create Elements",
            link: "/getting-started/cms/create-elements",
          },
          {
            text: "Overwriting CMS",
            link: "/getting-started/cms/overwriting-cms",
          },
          {
            text: "Multiple CMS",
            link: "/getting-started/cms/multiple-cms",
          },
        ],
      },
      {
        text: "E-Commerce",
        link: "/getting-started/e-commerce/",
        items: [
          {
            text: "Product Listing",
            link: "/getting-started/e-commerce/product-listing",
          },
          {
            text: "Product Detail Page",
            link: "/getting-started/e-commerce/product-detail-page",
          },
          { text: "Prices", link: "/getting-started/e-commerce/prices" },
          { text: "Cart", link: "/getting-started/e-commerce/cart" },
          { text: "Checkout", link: "/getting-started/e-commerce/checkout" },
          { text: "Payments", link: "/getting-started/e-commerce/payments" },
          { text: "JSON-LD", link: "/getting-started/e-commerce/json-ld" },
        ],
      },
      {
        text: "Features",
        link: "/getting-started/features/",
        items: [
          {
            text: "Sitemap",
            link: "/getting-started/features/sitemap",
          },
          {
            text: "Wishlist",
            link: "/getting-started/features/wishlist",
          },
          {
            text: "Custom Products extension",
            link: "/getting-started/features/custom-products",
          },
        ],
      },
      {
        text: "Page elements",
        link: "/getting-started/page-elements/",
        items: [
          {
            text: "Breadcrumbs",
            link: "/getting-started/page-elements/breadcrumbs",
          },
          { text: "Images", link: "/getting-started/page-elements/images" },
          {
            text: "Login Form",
            link: "/getting-started/page-elements/login-form",
          },
          {
            text: "Navigation",
            link: "/getting-started/page-elements/navigation",
          },
          {
            text: "Examples",
            link: "/getting-started/page-elements/examples/",
            items: [
              {
                text: "Cart",
                link: "/getting-started/page-elements/examples/cart/",
              },
              {
                text: "Product listing",
                link: "/getting-started/page-elements/examples/listing/",
              },
              {
                text: "Product Detail Page",
                link: "/getting-started/page-elements/examples/product-detail-page/",
              },
              {
                text: "Footer Navigation",
                link: "/getting-started/page-elements/examples/footer-navigation/",
              },
              {
                text: "Navigation",
                link: "/getting-started/page-elements/examples/navigation/",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    text: "BEST PRACTICES",
    link: "/best-practices/",
    items: [
      { text: "Deployment", link: "/best-practices/deployment" },
      {
        text: "Error Handling",
        link: "/best-practices/error-handling",
        items: [
          {
            text: "API Client Error Handling",
            link: "/best-practices/error-handling/api-client-error-handling",
          },
        ],
      },
      { text: "Images", link: "/best-practices/images" },
      { text: "Performance", link: "/best-practices/performance" },
      { text: "Testing", link: "/best-practices/testing" },
    ],
  },
  {
    text: "RESOURCES",
    link: "/resources/",
    items: [
      { text: "🚀 Links", link: "/resources/links" },
      { text: "🤗 Community Modules", link: "/resources/community-modules/" },
      { text: "😱 Troubleshooting", link: "/resources/troubleshooting" },
      {
        text: "Integrations",
        link: "/resources/integrations/",
        items: [
          {
            text: "CMS",
            link: "/resources/integrations/cms/",
            items: [
              {
                text: "Storyblok",
                link: "/resources/integrations/cms/storyblok",
              },
              {
                text: "Strapi",
                link: "/resources/integrations/cms/strapi",
              },
            ],
          },
          {
            text: "Commercial",
            link: "/resources/integrations/commercial/",
            items: [
              {
                text: "B2B Quick Order",
                link: "/resources/integrations/commercial/b2b-quick-order",
              },
              {
                text: "B2B Quote Management",
                link: "/resources/integrations/commercial/b2b-quote-management",
              },
              {
                text: "Custom Products",
                link: "/resources/integrations/commercial/custom-products",
              },
            ],
          },
          {
            text: "Payments",
            link: "/resources/integrations/payments/",
            items: [
              {
                text: "Adyen",
                link: "/resources/integrations/payments/adyen",
              },
              {
                text: "mollie",
                link: "/resources/integrations/payments/mollie",
              },
              {
                text: "Paypal Express",
                link: "/resources/integrations/payments/paypal-express",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    text: "PACKAGE REFERENCE",
    link: "/packages/",
    items: [
      { text: "Composables", link: "/packages/composables" },
      {
        text: "API Client",
        link: "/packages/api-client",
        items: [
          {
            text: "Associations",
            link: "/packages/api-client/docs/associations",
          },
          {
            text: "Storefront URL",
            link: "/packages/api-client/docs/storefront-url",
          },
        ],
      },
      { text: "Types", link: "/packages/types" },
      { text: "Helpers", link: "/packages/helpers" },
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
      SearchPlugin(),
      TsFunctionsList(),
      TsFunctionDescription({
        rootDir: resolve(__dirname, "../../../"),
        dirs: [
          {
            autogenExampleAlias: "api-client",
            functions: resolve(
              __dirname,
              "../../../packages/api-client/src/services",
            ),
            types: resolve(
              __dirname,
              "../../../packages/types/shopware-6-client/",
            ),
          },
          {
            functions: resolve(__dirname, "../../../packages/composables/src/"),
            types: resolve(
              __dirname,
              "../../../packages/types/shopware-6-client/",
            ),
          },
          {
            functions: resolve(__dirname, "../../../packages/helpers/src/"),
            types: resolve(
              __dirname,
              "../../../packages/types/shopware-6-client/",
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
