---
head:
  - - meta
    - name: og:title
      content: Setup templates
  - - meta
    - name: og:description
      content: "Shopware Frontends offers two shortcuts to getting started with your custom frontend. These so-called templates offer different levels of 'completeness' of a project."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Setup%20**Templates**.png?fontSize=150px"
nav:
  position: 10
  title: Setup templates
---

# Setup Templates

Shopware Frontends offers shortcuts to getting started with your custom frontend. These so-called templates offer different levels of "completeness" of a project.

:::tip HINT 💡
You can also integrate Shopware Frontends as an **npm package** into your existing [custom Javascript project](./templates/custom-project).
:::

## Demo Store Template

<a href="https://frontends-demo.vercel.app/" target="_blank"><img src="../.assets/demo-store-template.jpg" alt="Demo Store Template Screenshot" class="border-1px border-#eeeeee rounded-md shadow-md my-8 hover:shadow-2xl hover:scale-105 transition duration-200" /></a>

:::info
The **Demo Store Template** is not production-ready. It is only a reference implementation that contains most of the features which you can use as a starting point. It is not possible to update it automatically or install Shopware extensions on it.
:::

The demo store template is a reference implementation of an online store UI. It comes with all default features implemented as boilerplate code - such as

- Navigation & Header
- Cart
- Checkout
- CMS Pages

It is based on Nuxt3 and Tailwind.css.

<PageRef page="./templates/demo-store-template" title="Get started with the Demo Store Template" sub="A reference implementation of a store based on Vue.js" />

## Blank Template

<img src="../.assets/blank-template.jpg" alt="Demo Store Template Screenshot" class="border-1px border-#eeeeee rounded-md shadow-md my-8 hover:shadow-2xl hover:scale-105 transition duration-200" />

If you like to start from scratch, you can use the blank template. It can be handy if you want to use a different CSS framework or create a completely new frontend, but leverage the built-in functionality of all Shopware Frontends packages.

The blank template has all "non-UI" packages pre-installed, but you have to bring your own styles and components.

<PageRef page="./templates/blank-template" title="Get started with the Blank Template" sub="A blank Nuxt.js project pre-installed with all packages" />

## Custom project

It is possible to integrate Shopware Frontends into an existing project. As of now, only Vue.js projects are supported.

This can be applicable if you have an existing frontend application and you want to build eCommerce functionality into it.

<PageRef page="./templates/custom-project" title="Custom Project" sub="Integrate Shopware Frontends into an existing Vue.js project" />

## Framework supporting Vue

In theory, every place where the Vue instance is available, is supported by Shopware Frontends too.

The only requirement is to have a possibility to register a Vue 3 plugin, and that's what can be done in [Astro.js](https://astro.build/) as well.

<PageRef page="./templates/astro-template" title="Astro.js project" sub="Integrate Shopware Frontends into an SSR oriented project supporting Vue.js" />
