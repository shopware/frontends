import { defineConfigWithTheme } from "vitepress";
import type { Config as ThemeConfig } from "vitepress-shopware-docs";
import baseConfig from "vitepress-shopware-docs/config";
import nav from "./navigation";
import { SearchPlugin } from "vitepress-plugin-search";
import { CmsBaseReference } from "./theme/typer/cms-base-plugin";
import { ReadmeBasedReference } from "./theme/typer/plugin";

export const sidebar = [
  {
    text: "SHOPWARE FRONTENDS",
    link: "/",
    items: [
      { text: "Overview", link: "/", chevron: false },
      { text: "Why Shopware Frontends", link: "/why-shopware-frontends.html" },
    ],
  },
  {
    text: "FRAMEWORK",
    link: "/framework/",
    items: [
      { text: "Requirements", link: "/framework/requirements.html" },
      {
        text: "Internal Structure",
        link: "/framework/internal-structure.html",
      },
      {
        text: "Composables",
        link: "/framework/composables.html",
        items: [
          {
            text: "Context Composables",
            link: "/framework/composables/context-composables.html",
          },
          {
            text: "Shared Composables",
            link: "/framework/composables/shared-composables.html",
          },
          {
            text: "Overwriting Composables",
            link: "/framework/composables/overwriting-composables.html",
          },
        ],
      },
      {
        text: "Shopping Experiences",
        link: "/framework/shopping-experiences.html",
      },
      { text: "Styling", link: "/framework/styling.html" },
    ],
  },
  {
    text: "BUILDING",
    link: "/getting-started/",
    items: [
      {
        text: "Setup Templates",
        link: "/getting-started/templates.html",
        items: [
          {
            text: "Demo Store",
            link: "/getting-started/templates/demo-store-template.html",
          },
          {
            text: "Blank Template",
            link: "/getting-started/templates/blank-template.html",
          },
          {
            text: "Custom Vue Project",
            link: "/getting-started/templates/custom-vue-project.html",
          },
          {
            text: "Custom React Project",
            link: "/getting-started/templates/custom-react-project.html",
          },
          {
            text: "Astro Template",
            link: "/getting-started/templates/astro-template.html",
          },
        ],
      },
      { text: "Routing", link: "/getting-started/routing.html" },
      { text: "Languages", link: "/getting-started/languages.html" },
      {
        text: "CMS",
        link: "/getting-started/cms/",
        items: [
          {
            text: "Custom Elements",
            link: "/getting-started/cms/custom-elements.html",
          },
          {
            text: "Content Pages",
            link: "/getting-started/cms/content-pages.html",
          },
          {
            text: "Customize Components",
            link: "/getting-started/cms/customize-components.html",
          },
          {
            text: "Create Blocks",
            link: "/getting-started/cms/create-blocks.html",
          },
          {
            text: "Create Elements",
            link: "/getting-started/cms/create-elements.html",
          },
          {
            text: "Overwriting CMS",
            link: "/getting-started/cms/overwriting-cms.html",
          },
        ],
      },
      {
        text: "E-Commerce",
        link: "/getting-started/e-commerce/",
        items: [
          {
            text: "Product listing",
            link: "/getting-started/e-commerce/product-listing.html",
          },
          {
            text: "Product detail page",
            link: "/getting-started/e-commerce/product-detail-page.html",
          },
          { text: "Prices", link: "/getting-started/e-commerce/prices.html" },
          { text: "Cart", link: "/getting-started/e-commerce/cart.html" },
          {
            text: "Checkout",
            link: "/getting-started/e-commerce/checkout.html",
          },
          {
            text: "Payments",
            link: "/getting-started/e-commerce/payments.html",
          },
          {
            text: "Custome Payment",
            link: "/getting-started/e-commerce/custom-payment.html",
          },
          {
            text: "JSON-LD",
            link: "/getting-started/e-commerce/json-ld.html",
          },
        ],
      },
      {
        text: "Features",
        link: "/getting-started/features/",
        items: [
          {
            text: "Sitemap",
            link: "/getting-started/features/sitemap.html",
          },
          {
            text: "Wishlist",
            link: "/getting-started/features/wishlist.html",
          },
          {
            text: "Custom Products extension",
            link: "/getting-started/features/custom-products.html",
          },
          {
            text: "Broadcasting",
            link: "/getting-started/features/broadcasting.html",
          },
          {
            text: "Maintenance mode",
            link: "/getting-started/features/maintenance-mode.html",
          },
        ],
      },
      {
        text: "Page elements",
        link: "/getting-started/page-elements/",
        items: [
          {
            text: "Breadcrumbs",
            link: "/getting-started/page-elements/breadcrumbs.html",
          },
          {
            text: "Images",
            link: "/getting-started/page-elements/images.html",
          },
          {
            text: "Login Form",
            link: "/getting-started/page-elements/login-form.html",
          },
          {
            text: "Navigation",
            link: "/getting-started/page-elements/navigation.html",
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
      {
        text: "B2B",
        link: "/getting-started/b2b/",
        items: [
          {
            text: "Quote Management",
            link: "/getting-started/b2b/quote-management.html",
          },
        ],
      },
    ],
  },
  {
    text: "BEST PRACTICES",
    link: "/best-practices/",
    items: [
      { text: "Deployment", link: "/best-practices/deployment.html" },
      {
        text: "Error Handling",
        link: "/packages/api-client.html#error-handling",
        // TODO: remove this subpages after 2024-08
        items: [
          {
            text: "API Client Error Handling",
            link: "/best-practices/error-handling/api-client-error-handling.html",
          },
        ],
      },
      { text: "Images", link: "/best-practices/images.html" },
      { text: "Performance", link: "/best-practices/performance.html" },
      { text: "Testing", link: "/best-practices/testing.html" },
    ],
  },
  {
    text: "RESOURCES",
    link: "/resources/",
    items: [
      { text: "🚀 Links", link: "/resources/links.html" },
      { text: "🤗 Community Modules", link: "/resources/community-modules/" },
      { text: "😱 Troubleshooting", link: "/resources/troubleshooting.html" },
      {
        text: "Integrations",
        link: "/resources/integrations/",
        items: [
          {
            text: "Multi CMS instance",
            link: "/resources/integrations/multi-cms.html",
          },
          { text: "Strapi", link: "/resources/integrations/strapi/" },
        ],
      },
    ],
  },
  {
    text: "PACKAGE REFERENCE",
    collapsed: true,
    link: "/packages/",
    items: [
      {
        text: "API Client",
        link: "/packages/api-client.html",
      },
      { text: "Composables", link: "/packages/composables.html" },
      { text: "CMS Base", link: "/packages/cms-base.html" },
      { text: "Nuxt3 Module", link: "/packages/nuxt3-module.html" },
      { text: "Helpers", link: "/packages/helpers.html" },
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
  rewrites: {
    "installation.md": "getting-started/templates/demo-store-template",
    "installation.html": "getting-started/templates/demo-store-template",
  },
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
    sidebar: sidebar,
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
      host: false,

      fs: {
        // for when developing with locally linked theme
        allow: ["../.."],
      },
    },
    build: {
      minify: "terser",
      chunkSizeWarningLimit: Infinity,
      ssr: false,
    },
    json: {
      stringify: true,
    },
    plugins: [SearchPlugin(), ReadmeBasedReference(), CmsBaseReference()],
  },
  vue: {
    reactivityTransform: true,
  },
});
