const nav = [
  {
    link: "https://developer.shopware.com/docs/guides/plugins/apps/",
    text: "Apps",
  },
  {
    link: "https://developer.shopware.com/docs/guides/plugins/themes/",
    text: "Themes",
  },
  {
    link: "https://frontends.shopware.com/",
    text: "Frontends",
    repo: "shopware/frontends",
  },
  {
    link: "https://developer.shopware.com/docs/guides/integrations-api",
    text: "Integrations",
  },
  {
    text: "Resources",
    activeMatch: "^/(api)",
    items: [
      {
        text: "HTTP APIs",
        items: [
          {
            text: "Store API",
            link: "https://shopware.stoplight.io/docs/store-api/",
            repo: "shopware/store-api-reference",
          },
          {
            text: "Admin API",
            link: "https://shopware.stoplight.io/docs/admin-api/",
            repo: "shopware/admin-api-reference",
          },
        ],
      },
      {
        text: "Administration",
        items: [
          {
            text: "Admin Extension SDK",
            link: "https://shopware.github.io/admin-extension-sdk/",
            repo: "shopware/admin-extension-sdk",
          },
          {
            text: "Meteor Icon Kit",
            link: "https://shopware.github.io/meteor-icon-kit/",
            repo: "shopware/meteor-icon-kit",
          },
          {
            text: "Component Library",
            link: "https://shopware.github.io/meteor-component-library/",
            repo: "shopware/meteor-component-library",
          },
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
