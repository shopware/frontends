---
head:
  - - meta
    - name: og:title
      content: Building the content pages
  - - meta
    - name: og:description
      content: "In this chapter you will learn how to create a content page and use CMS elements."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Building%20the%20**Content%20Pages**.png?fontSize=120px"
nav:
  position: 30
---

# Create content pages

In this chapter you will learn how to display content pages with data from Shopware's own CMS. It is based on the mechanism of routing and fetching page content described in the [previous chapter](./routing.md). The case of building fully custom components from scratch will be covered as well. Specifically, you will learn how to

- Render a content page using the cms-base package
- Render a content page using custom components

## Use the cms-base package

Using the cms-base package, you don't have to implement any CMS components by yourself. You can start with a working implementation but add and override single components as you need. It requires a couple dependencies for styling and validation purposes to work properly.

### Install the package

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

### Render the page

Now, you can import all components from the `@shopware-pwa/cms-base` package and use them in your templates. The most straightforward way to render a page is to use the `CmsPage` component. It takes a `content` prop and resolves all subordinate sections, blocks and elements automatically. Put the following code in your catch-all component that also handles the [routing logic](./routing.md#resolve-a-route-to-a-page).

```vue-html
<CmsPage v-if="data" :content="data.value.cmsPage"/>
```

:::warning This will only work
if you followed the previous chapter on [routing](./routing.md). The `data` value in this example is a reactive reference to either a product, a category or a landing page response. If you are not sure how to get the data otherwise, check that chapter and see how the data is fetched.
:::

### Customize components

The `cms-base` package has an opinionated style of components and is based on Tailwind.css. If you want to override components or add custom ones, you can build them right into your project or import them as a separate package.

<PageRef page="../framework/shopping-experiences" title="Shopping Experiences" sub="Customize CMS components" />

## Use custom components

If you use custom components and not the cms-base package, you have to ensure the correct rendering of the page. You also need to re-create all components that the Shopware CMS uses. For the creation of custom components - such as elements or blocks, you can follow the instructions given in [Shopping Experiences](./../framework/shopping-experiences.md) and benefit from typehinting and the `useCms*` composables.
