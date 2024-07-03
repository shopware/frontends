---
head:
  - - meta
    - name: og:title
      content: Shopping Experiences
  - - meta
    - name: og:description
      content: "This guide will discuss how to use and customize Shopping Experiences in your Shopware Frontends project."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Shopping%20Experiences?fontSize=150px"
nav:
  position: 20
---

# Shopping Experiences

This guide will discuss how to use and customize [Shopping Experiences](https://docs.shopware.com/en/shopware-6-en/content/ShoppingExperiences) in your Shopware Frontends project.

## How it works

Shopping Experiences are implemented as a dedicated package that you can install in your project.

If your project is based on the [Demo Store Template](../getting-started/templates/demo-store-template.md), that package is already installed. If you are using a custom template, follow the instructions in [Install the package](#install-the-package) first.

## Install the package

The `@shopware-pwa/cms-base` package provides an implementation of all default CMS components in Shopware's Shopping Experiences. It uses Tailwind.css syntax for styling. You will now use it to render a content page.

First of all, add the package to your project:

```bash
npm install -D @shopware-pwa/cms-base
```

Next, you need to register all components in its `components/public` directory globally. How to do it, depends on your environment. However, the package also comes with a nuxt module which does that for you. So in any Nuxt application, you can just add if to the `modules` section of your Nuxt config file:

```diff
/* nuxt.config.ts */

export default defineNuxtConfig({
  /* ... */
- modules: [/* ... */, "@shopware-pwa/nuxt3-module"],
+ modules: [/* ... */, "@shopware-pwa/cms-base"],
});
```

## How to build Pages, Elements and Blocks?

<PageRef page="../getting-started/cms/" title="BUILDGING > CMS" sub="See the buliding chapter about CMS." />
