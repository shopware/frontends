/**
 * Sidebar configuration is exported so DevHub can import it and prefix links with /frontends/.
 */

import data from "./data/composables.data";

const composables = await data.load(null);

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
        collapsed: true,
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
        collapsed: true,
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
        collapsed: true,
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
          {
            text: "Multiple CMS",
            link: "/getting-started/cms/multiple-cms.html",
          },
        ],
      },
      {
        text: "E-Commerce",
        link: "/getting-started/e-commerce/",
        collapsed: true,
        items: [
          {
            text: "Product Listing",
            link: "/getting-started/e-commerce/product-listing.html",
          },
          {
            text: "Product Detail Page",
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
            text: "JSON-LD",
            link: "/getting-started/e-commerce/json-ld.html",
          },
        ],
      },
      {
        text: "Features",
        link: "/getting-started/features/",
        collapsed: true,
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
        collapsed: true,
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
            collapsed: true,
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
      { text: "Deployment", link: "/best-practices/deployment.html" },
      {
        text: "Error Handling",
        link: "/packages/api-client.html#error-handling",
      },
      { text: "Images", link: "/best-practices/images.html" },
      { text: "Performance", link: "/best-practices/performance.html" },
      {
        text: "Testing",
        link: "/best-practices/testing.html",
        collapsed: true,
        items: [
          {
            text: "E2E Testing",
            link: "/best-practices/testing/e2e-testing.html",
          },
          {
            text: "A/B Testing",
            link: "/best-practices/testing/ab-testing.html",
          },
        ],
      },
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
        text: "🛠️ Integrations",
        link: "/resources/integrations/",
        collapsed: true,
        items: [
          {
            text: "CMS",
            link: "/resources/integrations/cms/",
            collapsed: true,
            items: [
              {
                text: "Storyblok",
                link: "/resources/integrations/cms/storyblok.html",
              },
              {
                text: "Strapi",
                link: "/resources/integrations/cms/strapi.html",
              },
            ],
          },
          {
            text: "Commercial",
            link: "/resources/integrations/commercial/",
            collapsed: true,
            items: [
              {
                text: "B2B Quick Order",
                link: "/resources/integrations/commercial/b2b-quick-order.html",
              },
              {
                text: "B2B Quote Management",
                link: "/resources/integrations/commercial/b2b-quote-management.html",
              },
              {
                text: "Custom Products",
                link: "/resources/integrations/commercial/custom-products.html",
              },
            ],
          },
          {
            text: "Payments",
            link: "/resources/integrations/payments/",
            collapsed: true,
            items: [
              {
                text: "Amazon Pay",
                link: "/resources/integrations/payments/amazon-pay.html",
              },
              {
                text: "Adyen",
                link: "/resources/integrations/payments/adyen.html",
              },
              {
                text: "mollie",
                link: "/resources/integrations/payments/mollie.html",
              },
              {
                text: "Paypal Express",
                link: "/resources/integrations/payments/paypal-express.html",
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
      {
        text: "API Client",
        link: "/packages/api-client.html",
      },
      {
        text: "Composables",
        link: "/packages/composables/",
        collapsed: true,
        items: composables?.composablesList ?? [],
      },
      { text: "CMS Base", link: "/packages/cms-base-layer.html" },
      { text: "Nuxt3 Module", link: "/packages/nuxt-module.html" },
      { text: "Helpers", link: "/packages/helpers.html" },
    ],
  },
];
