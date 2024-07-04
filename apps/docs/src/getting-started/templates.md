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
Integrate Shopware Frontends as an **npm package** into your existing [custom Vue project](./templates/custom-vue-project).
:::

## Demo Store Template

<a href="./templates/demo-store-template.html"><img src="../.assets/demo-store-template.jpg" alt="Demo Store Template Screenshot" class="border-1px border-#eeeeee rounded-md shadow-md my-8 hover:shadow-2xl hover:scale-105 transition duration-200" /></a>

:::info
The **Demo Store Template** is not production-ready. It is only a **reference implementation** that contains most of the features which you can use as a starting point. It is not possible to update it automatically or install Shopware extensions on it.
:::

The demo store template is a **reference implementation** of an online store UI. It comes with all default features implemented as boilerplate code - such as

- Navigation & Header
- Cart
- Checkout
- CMS Pages

It is based on Nuxt3 and Tailwind.css.

<PageRef page="./templates/demo-store-template.html" title="Get started with the Demo Store Template" sub="A reference implementation of a store based on Vue.js" />

## Blank Template

<a href="./templates/blank-template.html"><img src="../.assets/blank-template.jpg" alt="Blank Template Screenshot" class="border-1px border-#eeeeee rounded-md shadow-md my-8 hover:shadow-2xl hover:scale-105 transition duration-200" /></a>

If you like to start from scratch, you can use the blank template. It can be handy if you want to use a different CSS framework or create a completely new frontend, but leverage the built-in functionality of all Shopware Frontends packages.

The blank template has all "non-UI" packages pre-installed, but you have to bring your own styles and components.

<PageRef page="./templates/blank-template.html" title="Get started with the Blank Template" sub="A blank Nuxt.js project pre-installed with all packages" />

## Custom projects

It is possible to integrate Shopware Frontends into an existing project. This can be applicable if you have an existing frontend application and you want to build eCommerce functionality into it.

As of now, **Vue.js** and **React** projects are supported.

<PageRef page="./templates/custom-vue-project.html" title="Custom Vue project" sub="Integrate Shopware Frontends into an existing Vue.js project" />
<PageRef page="./templates/custom-react-project.html" title="Custom React project" sub="Look at the Vercel Commerce Template to learn how to setup a React project" />

## Framework supporting Vue

In theory, every place where the Vue instance is available, is supported by Shopware Frontends too.

The only requirement is to have a possibility to register a Vue 3 plugin, and that's what can be done in [Astro.js](https://astro.build/) as well.

<PageRef page="./templates/astro-template.html" title="Astro.js project" sub="Integrate Shopware Frontends into an SSR oriented project supporting Vue.js" />
