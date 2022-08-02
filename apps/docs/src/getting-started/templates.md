---
---

# Templates

Shopware Frontends offers two shortcuts to getting started with your custom frontend. These so-called templates offer different levels of "completeness" of a project.

## Demo Store Template

<img src="../.assets/demo-store-template.jpg" alt="Demo Store Template Screenshot" class="border-1px border-#eeeeee rounded-md shadow-md my-8 hover:shadow-2xl hover:scale-105 transition duration-200" />

:::info
The **Demo Store Template** is not a fully-functional online store. It is only a reference implementation that contains most of the features which you can use as a starting point. It is not possible to update it automatically or install Shopware extensions on it.
:::

The demo store template is a reference implementation of an online store UI. It comes with all default features implemented as boilerplate code - such as

- Navigation & Header
- Cart
- Checkout
- CMS Pages

It is based on Nuxt3 and Tailwind.css.

[TODO: Add command or instructions to set up demo store template]

<PageRef page="https://gitlab.shopware.com/product/engineering/platform-group/pwa/frontends/-/tree/main/apps/nuxt3-app" title="Get started with the Demo Store Template" sub="A reference implementation of a store based on Vue.js" />

## Blank Template

<img src="../.assets/blank-template.jpg" alt="Demo Store Template Screenshot" class="border-1px border-#eeeeee rounded-md shadow-md my-8 hover:shadow-2xl hover:scale-105 transition duration-200" />

If you like to start from scratch, you can use the blank template. It can be handy if you want to use a different CSS framework or create a completely new frontend, but leverage the built-in functionality of all Shopware Frontends packages.

The blank template has all "non-UI" packages pre-installed, but you have to bring your own styles and components.

[TODO: Add command or instructions to set up blank template]

<PageRef page="https://gitlab.shopware.com/product/engineering/platform-group/pwa/frontends/-/tree/main/apps/blank" title="Get started with the Blank Template" sub="A blank Nuxt.js project pre-installed with all packages" />
