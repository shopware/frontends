/**
 * Sidebar configuration is exported so DevHub can import it and prefix links with /frontends/.
 */

import data from "../src/.data/composables.data";

const composables = await data.load(null);

export const sidebar = [
  {
    text: "SHOPWARE FRONTENDS",
    link: "/",
    items: [{ text: "Overview", link: "/", chevron: false }],
  },
  {
    text: "INTRODUCTION",
    link: "/introduction/",
    items: [
      {
        text: "Why Shopware Frontends",
        link: "/introduction/why-shopware-frontends.html",
      },
      { text: "Requirements", link: "/introduction/requirements.html" },
      { text: "Quick Start", link: "/introduction/quick-start.html" },
      { text: "Try it out", link: "/introduction/try-it-out.html" },
      {
        text: "Setup Templates",
        link: "/introduction/templates.html",
        collapsed: true,
        items: [
          {
            text: "Vue Starter Template",
            link: "/introduction/templates/vue-starter-template.html",
          },
          {
            text: "Vue Starter Template Extended",
            link: "/introduction/templates/vue-starter-template-extended.html",
          },
          {
            text: "Blank Template",
            link: "/introduction/templates/blank-template.html",
          },
          {
            text: "Demo Store",
            link: "/introduction/templates/demo-store-template.html",
          },
          {
            text: "Custom Vue Project",
            link: "/introduction/templates/custom-vue-project.html",
          },
          {
            text: "Custom React Project",
            link: "/introduction/templates/custom-react-project.html",
          },
          {
            text: "Astro Template",
            link: "/introduction/templates/astro-template.html",
          },
        ],
      },
    ],
  },
  {
    text: "CONCEPTS",
    link: "/concepts/",
    items: [
      {
        text: "Internal Structure",
        link: "/concepts/internal-structure.html",
      },
      {
        text: "Composables",
        link: "/concepts/composables.html",
        collapsed: true,
        items: [
          {
            text: "Context Composables",
            link: "/concepts/composables/context-composables.html",
          },
          {
            text: "Shared Composables",
            link: "/concepts/composables/shared-composables.html",
          },
          {
            text: "Overwriting Composables",
            link: "/concepts/composables/overwriting-composables.html",
          },
        ],
      },
      {
        text: "Shopping Experiences",
        link: "/concepts/shopping-experiences.html",
      },
      { text: "Styling", link: "/concepts/styling.html" },
      { text: "Design Tokens", link: "/concepts/design-tokens.html" },
    ],
  },
  {
    text: "GUIDES",
    link: "/guides/",
    items: [
      { text: "Routing", link: "/guides/routing.html" },
      { text: "Languages", link: "/guides/languages.html" },
      {
        text: "CMS",
        link: "/guides/cms/",
        collapsed: true,
        items: [
          {
            text: "Custom Elements",
            link: "/guides/cms/custom-elements.html",
          },
          {
            text: "Content Pages",
            link: "/guides/cms/content-pages.html",
          },
          {
            text: "Customize Components",
            link: "/guides/cms/customize-components.html",
          },
          {
            text: "Implement Missing Component",
            link: "/guides/cms/missing-component.html",
          },
          {
            text: "Create Blocks",
            link: "/guides/cms/create-blocks.html",
          },
          {
            text: "Create Elements",
            link: "/guides/cms/create-elements.html",
          },
          {
            text: "Overwriting CMS",
            link: "/guides/cms/overwriting-cms.html",
          },
          {
            text: "Multiple CMS",
            link: "/guides/cms/multiple-cms.html",
          },
        ],
      },
      {
        text: "E-Commerce",
        link: "/guides/e-commerce/",
        collapsed: true,
        items: [
          {
            text: "Product Listing",
            link: "/guides/e-commerce/product-listing.html",
          },
          {
            text: "Product Detail Page",
            link: "/guides/e-commerce/product-detail-page.html",
          },
          { text: "Prices", link: "/guides/e-commerce/prices.html" },
          { text: "Cart", link: "/guides/e-commerce/cart.html" },
          {
            text: "Checkout",
            link: "/guides/e-commerce/checkout.html",
          },
          {
            text: "Payments",
            link: "/guides/e-commerce/payments.html",
          },
          {
            text: "JSON-LD",
            link: "/guides/e-commerce/json-ld.html",
          },
        ],
      },
      {
        text: "B2B",
        link: "/guides/b2b/",
        collapsed: true,
        items: [
          {
            text: "Quote Management",
            link: "/guides/b2b/quote-management.html",
          },
        ],
      },
      {
        text: "Features",
        link: "/guides/features/",
        collapsed: true,
        items: [
          {
            text: "Sitemap",
            link: "/guides/features/sitemap.html",
          },
          {
            text: "Wishlist",
            link: "/guides/features/wishlist.html",
          },
          {
            text: "Custom Products extension",
            link: "/guides/features/custom-products.html",
          },
          {
            text: "Broadcasting",
            link: "/guides/features/broadcasting.html",
          },
          {
            text: "Maintenance mode",
            link: "/guides/features/maintenance-mode.html",
          },
        ],
      },
      {
        text: "Page elements",
        link: "/guides/page-elements/",
        collapsed: true,
        items: [
          {
            text: "Breadcrumbs",
            link: "/guides/page-elements/breadcrumbs.html",
          },
          {
            text: "Images",
            link: "/guides/page-elements/images.html",
          },
          {
            text: "Login Form",
            link: "/guides/page-elements/login-form.html",
          },
          {
            text: "Navigation",
            link: "/guides/page-elements/navigation.html",
          },
          {
            text: "Footer Navigation",
            link: "/guides/page-elements/footer-navigation.html",
          },
        ],
      },
    ],
  },
  {
    text: "FRONTENDS RECIPES",
    link: "/frontends-recipes/",
    items: [
      {
        text: "Account",
        link: "/frontends-recipes/account/",
        collapsed: true,
        items: [
          {
            text: "Login",
            link: "/frontends-recipes/account/login.html",
          },
        ],
      },
    ],
  },
  {
    text: "BEST PRACTICES",
    link: "/best-practices/",
    items: [
      { text: "Caching", link: "/best-practices/caching.html" },
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
          {
            text: "Accessibility Testing",
            link: "/best-practices/testing/accessibility-testing.html",
          },
        ],
      },
    ],
  },
  {
    text: "INTEGRATIONS",
    link: "/integrations/",
    items: [
      {
        text: "CMS",
        link: "/integrations/cms/",
        collapsed: true,
        items: [
          {
            text: "Storyblok",
            link: "/integrations/cms/storyblok.html",
          },
          {
            text: "Strapi",
            link: "/integrations/cms/strapi.html",
          },
          {
            text: "Sanity",
            link: "/integrations/cms/sanity.html",
          },
        ],
      },
      {
        text: "Payments",
        link: "/integrations/payments/",
        collapsed: true,
        items: [
          {
            text: "Amazon Pay",
            link: "/integrations/payments/amazon-pay.html",
          },
          {
            text: "Adyen",
            link: "/integrations/payments/adyen.html",
          },
          {
            text: "Braintree",
            link: "/integrations/payments/braintree.html",
          },
          {
            text: "mollie",
            link: "https://github.com/mollie/Shopware6Composables",
          },
          {
            text: "Paypal",
            link: "/integrations/payments/paypal.html",
          },
        ],
      },
      {
        text: "Commercial",
        link: "/integrations/commercial/",
        collapsed: true,
        items: [
          {
            text: "B2B Quick Order",
            link: "/integrations/commercial/b2b-quick-order.html",
          },
          {
            text: "B2B Quote Management",
            link: "/integrations/commercial/b2b-quote-management.html",
          },
          {
            text: "Custom Products",
            link: "/integrations/commercial/custom-products.html",
          },
          {
            text: "Digital Sales Rooms",
            link: "/integrations/commercial/digital-sales-rooms.html",
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
      { text: "🤖 AI Assistant", link: "/ai/search.html" },
    ],
  },
  {
    text: "PACKAGE REFERENCE",
    link: "/packages/",
    items: [
      {
        text: "Distribution Channels",
        link: "/packages/distribution-channels.html",
      },
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
