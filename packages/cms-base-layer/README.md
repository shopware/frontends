# shopware/frontends - cms-base

[![](https://img.shields.io/npm/v/@shopware/cms-base-layer?color=blue&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCA0ODggNTUzIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNNDM5LjA0MSAxMjkuNTkzTDI1OC43NjkgMzEuMzA3NkMyNDQuOTE1IDIzLjc1NDEgMjI4LjExNiAyNC4wMDkzIDIxNC40OTcgMzEuOTgwMkw0Ny4yNjkgMTI5Ljg1OEMzMy40NzYzIDEzNy45MzEgMjUgMTUyLjcxMyAyNSAxNjguNjk1VjM4OC40NjZDMjUgNDA0LjczMiAzMy43Nzg1IDQxOS43MzIgNDcuOTYwMiA0MjcuNjk5TDIxNS4xNzggNTIxLjYzNkMyMjguNDUxIDUyOS4wOTIgMjQ0LjU5MyA1MjkuMzMyIDI1OC4wODIgNTIyLjI3NEw0MzguMzY0IDQyNy45MzRDNDUzLjIwMSA0MjAuMTcgNDYyLjUgNDA0LjgwOSA0NjIuNSAzODguMDYzVjE2OS4xMDJDNDYyLjUgMTUyLjYzMiA0NTMuNTAyIDEzNy40NzcgNDM5LjA0MSAxMjkuNTkzWiIgc3Ryb2tlPSJ1cmwoI3BhaW50MF9saW5lYXJfMTUzXzY5MjY1KSIgc3Ryb2tlLXdpZHRoPSI1MCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzE1M182OTI2NSIgeDE9Ii0xNi4yOTg5IiB5MT0iMTY1LjM0OSIgeDI9IjI3Ni40MTIiIHkyPSItODkuMzIzNCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDA4NUZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0MwRTJGNSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPg==)](https://npmjs.com/package/@shopware/cms-base-layer)
[![](https://img.shields.io/github/package-json/v/shopware/frontends?color=blue&filename=packages%2Fcms-base-layer%2Fpackage.json&label=cms-base%40monorepo&logo=github)](https://github.com/shopware/frontends/tree/main/packages/cms-base-layer)
[![](https://img.shields.io/github/issues/shopware/frontends/cms-base?label=cms-base%20issues&logo=github)](https://github.com/shopware/frontends/issues?q=is%3Aopen+is%3Aissue+label%3Acms-base)
[![](https://img.shields.io/github/license/shopware/frontends?color=blue)](#)

Nuxt [layer](https://nuxt.com/docs/getting-started/layers) that provides an implementation of all CMS components in Shopware [based on utility-classes](https://frontends.shopware.com/framework/styling.html) using atomic css syntax (UnoCss / Tailwind).

It is useful for projects that want to use the CMS components but design their own layout.

## Features

- Vue components for [Shopping Experiences](https://www.shopware.com/en/products/shopping-experiences/) CMS
- CMS sections, blocks and elements styled using [Tailwind CSS](https://tailwindcss.com/) classes
- 🚀 Empowered by [@shopware/composables](https://www.npmjs.com/package/@shopware/composables)

## Setup

Install npm package:

<!-- automd:pm-install name="@shopware/cms-base-layer" dev -->

```sh
# ✨ Auto-detect
npx nypm install -D @shopware/cms-base-layer

# npm
npm install -D @shopware/cms-base-layer

# yarn
yarn add -D @shopware/cms-base-layer

# pnpm
pnpm install -D @shopware/cms-base-layer

# bun
bun install -D @shopware/cms-base-layer

# deno
deno install --dev @shopware/cms-base-layer
```

<!-- /automd -->

Then, register the Nuxt layer in `nuxt.config.ts` file:

<!-- automd:file src="templates/vue-blank/nuxt.config.ts" code -->

```ts [nuxt.config.ts]
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  extends: ["@shopware/composables/nuxt-layer", "@shopware/cms-base-layer"],
  shopware: {
    endpoint: "https://demo-frontends.shopware.store/store-api/",
    accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
  },
  modules: ["@shopware/nuxt-module"],
  /**
   * Commented because of the StackBlitz error
   * Issue: https://github.com/shopware/frontends/issues/88
   */
  typescript: {
    // typeCheck: true,
    strict: true,
  },
  telemetry: false,
});
```

<!-- /automd -->

## Basic usage

Since all CMS components are registered in your Nuxt application, you can now start using them in your template (no imports needed):

```js
/* Vue component */

// response object can be a Product|Category|Landing Page response from Shopware 6 store-api containing a layout (cmsPage object) built using  Shopping Experiences
<template>
    <CmsPage v-if="response.cmsPage" :content="response.cmsPage"/>
</template>
```

> You can use default styling by installing/importing Tailwind CSS stylesheet in your project.

See a [short guide](https://frontends.shopware.com/getting-started/cms/content-pages.html#use-the-cms-base-package) how to use `cms-base` package in your project based on Nuxt v3.

## Default styling

The components are styled using [Tailwind CSS](https://tailwindcss.com/) utility classes, so you can use them in your project without any additional configuration if your project uses Tailwind CSS. 

This layer provides a default Tailwind CSS configuration (see [uno.config.ts](./uno.config.ts) for details), which is used to style the components. If you want to customize the styling, you can do so by creating your own Tailwind CSS configuration file and extending the default one:

```ts [nuxt.config.ts]
// nuxt.config.ts
export default defineNuxtConfig({
  // ...
  unocss: {
    nuxtLayers: true, // enable Nuxt layers for UnoCSS
  },
})
```

```ts [uno.config.ts]
// uno.config.ts
import config from './.nuxt/uno.config.mjs'

export default config
```

Thanks to this, you can **use the default configuration** provided by this layer, or **extend/overwrite** it with your own customizations in your end-project:

```ts [uno.config.ts]
// uno.config.ts
import { mergeConfigs } from '@unocss/core'
import config from './.nuxt/uno.config.mjs'

export default mergeConfigs([config, {
  theme: {
    colors: {
      primary: '#ff3e00',
      secondary: '#1c1c1c',
    },
  },
}])

```

See the [UnoCSS reference](https://unocss.dev/integrations/nuxt#configuration) for more information on how to configure UnoCSS in Nuxt when work with layers.

## 📘 Available components

The list of available blocks and elements is [here](https://frontends.shopware.com/packages/cms-base-layer.html#available-components).

## 🔄 Overwriting components

The procedure is:

- find a component in component's [list](https://frontends.shopware.com/packages/cms-base.html#available-components), using a [Vue devtools](https://devtools.vuejs.org/) or browsing the github [repository](https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/components)
- take its name
- create a file with the same name and place it into `~/components` dir in your nuxt project (or wherever according your nuxt config)

✅ Thanks to this, nuxt will take the component registered in your app instead of the one registered by this nuxt layer.

### Internal components

❗**Internal components are not a part of public API. Once overwritten you need to track the changes on your own.**

There is also a possibility to override the internal components, shared between public blocks and elements, the ones starting with `Sw` prefix, like [SwSlider.vue](https://github.com/shopware/frontends/blob/main/packages/cms-base-layer/components/SwSlider.vue) or [SwProductCard.vue](https://github.com/shopware/frontends/blob/main/packages/cms-base-layer/components/SwProductCard.vue).

An example: some components use `SwSharedPrice.vue` to show prices with corresponding currency for products in many places like product card, product details page and so on. In order to change the way how the price is displayed consistently - create a one component with a name `SwSharedPrice.vue` and that's it. The new component will be used everywhere where is "imported" (autoimported actually).

### ⚠️ `<RouterLink/>` components used

Some components use `RouterLink` component internally, available in [Vue Router](https://github.com/vuejs/router).
In order to parse CMS components correctly and avoid missing component warning, it's **highly recommended** to have **Vue Router installed** or **Nuxt router enabled** in your application.

## TypeScript support

All components are fully typed with TypeScript.

No additional packages needed to be installed.

## Links

- [📘 Documentation](https://frontends.shopware.com)

- [👥 Community](https://shopwarecommunity.slack.com) (`#composable-frontends`)

<!-- AUTO GENERATED CHANGELOG -->

## Changelog

Full changelog for stable version is available [here](https://github.com/shopware/frontends/blob/main/packages/cms-base-layer/CHANGELOG.md)

### Latest changes: 1.5.0

### Minor Changes

- [#1727](https://github.com/shopware/frontends/pull/1727) [`94872b7`](https://github.com/shopware/frontends/commit/94872b7c6f6337ff8ce0bcfd9320e4178a4927f0) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Added CmsBlockHtml to render html blocks.
  Added CmsElementHtml to render html element.

### Patch Changes

- [#1843](https://github.com/shopware/frontends/pull/1843) [`1859893`](https://github.com/shopware/frontends/commit/1859893ec3fe1cdead4b1c39e34943d9a70deaa4) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Enhance form error handling and fix TS errors

- [#1812](https://github.com/shopware/frontends/pull/1812) [`c28810d`](https://github.com/shopware/frontends/commit/c28810d0ca503b97c232438e200bbf5ba5dab403) Thanks [@patzick](https://github.com/patzick)! - Fix date formatting based on locale, previously always returned en-US format

- [#1857](https://github.com/shopware/frontends/pull/1857) [`e78d51e`](https://github.com/shopware/frontends/commit/e78d51e6af0726b12620d9f7e8f2c3150aa80cfa) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Fix wrong `SharedPrice` component in `SwListingProductPrice.vue` file

- Updated dependencies [[`d016d6b`](https://github.com/shopware/frontends/commit/d016d6b845bff9a148405a74dae88d7fc81ec99c), [`c28810d`](https://github.com/shopware/frontends/commit/c28810d0ca503b97c232438e200bbf5ba5dab403), [`a7ff606`](https://github.com/shopware/frontends/commit/a7ff60681d1a164d5c9f2020c506262e96fad5dc), [`d016d6b`](https://github.com/shopware/frontends/commit/d016d6b845bff9a148405a74dae88d7fc81ec99c), [`bd70905`](https://github.com/shopware/frontends/commit/bd70905b8443fd57d8d8cb3cfc6501a9117dea49)]:
  - @shopware/api-client@1.3.0
  - @shopware/composables@1.9.0
