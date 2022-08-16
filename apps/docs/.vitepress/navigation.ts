import type { DefaultTheme } from "vitepress/types/default-theme";

const nav: DefaultTheme.NavItem[] = [
  {
    activeMatch: "^/apps/",
    text: "Apps",
    link: "https://developer.shopware.com/docs/guides/plugins/overview",
  },
  {
    text: "Themes",
    link: "https://developer.shopware.com/docs/guides/plugins/themes/theme-base-guide",
  },
  {
    text: "Frontends",
    link: "/",
  },
  {
    text: "Integrations",
    link: "https://developer.shopware.com/docs/guides/integrations-api",
  },
  {
    text: "Resources",
    activeMatch: `^/(api)`,
    items: [
      {
        text: "HTTP APIs",
        items: [
          {
            text: "Store API",
            link: "https://shopware.stoplight.io/docs/store-api",
          },
          {
            text: "Admin API",
            link: "https://shopware.stoplight.io/docs/admin-api",
          },
        ],
      },
      {
        text: "Administration",
        items: [
          {
            text: "Admin Extension API",
            link: "https://shopware.github.io/admin-extension-sdk/",
          },
          // {
          //     text: "Meteor Icon Kit",
          //     link: "/resources/meteor-icon-kit",
          // },
          // {
          //     text: "Component Library",
          //     link: "/resources/meteor-icon-kit",
          // }
        ],
      },
      {
        text: "Learning",
        items: [
          {
            text: "Academy",
            link: "https://academy.shopware.com/",
          },
          {
            text: "YouTube",
            link: "https://www.youtube.com/user/shopwareAG",
          },
        ],
      },
    ],
  },
];

export default nav;
