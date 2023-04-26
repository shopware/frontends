# shopware/frontends - cms-base

[![](https://img.shields.io/npm/v/@shopware-pwa/cms-base?color=blue&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCA0ODggNTUzIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNNDM5LjA0MSAxMjkuNTkzTDI1OC43NjkgMzEuMzA3NkMyNDQuOTE1IDIzLjc1NDEgMjI4LjExNiAyNC4wMDkzIDIxNC40OTcgMzEuOTgwMkw0Ny4yNjkgMTI5Ljg1OEMzMy40NzYzIDEzNy45MzEgMjUgMTUyLjcxMyAyNSAxNjguNjk1VjM4OC40NjZDMjUgNDA0LjczMiAzMy43Nzg1IDQxOS43MzIgNDcuOTYwMiA0MjcuNjk5TDIxNS4xNzggNTIxLjYzNkMyMjguNDUxIDUyOS4wOTIgMjQ0LjU5MyA1MjkuMzMyIDI1OC4wODIgNTIyLjI3NEw0MzguMzY0IDQyNy45MzRDNDUzLjIwMSA0MjAuMTcgNDYyLjUgNDA0LjgwOSA0NjIuNSAzODguMDYzVjE2OS4xMDJDNDYyLjUgMTUyLjYzMiA0NTMuNTAyIDEzNy40NzcgNDM5LjA0MSAxMjkuNTkzWiIgc3Ryb2tlPSJ1cmwoI3BhaW50MF9saW5lYXJfMTUzXzY5MjY1KSIgc3Ryb2tlLXdpZHRoPSI1MCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzE1M182OTI2NSIgeDE9Ii0xNi4yOTg5IiB5MT0iMTY1LjM0OSIgeDI9IjI3Ni40MTIiIHkyPSItODkuMzIzNCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDA4NUZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0MwRTJGNSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPg==)](https://npmjs.com/package/@shopware-pwa/cms-base)
[![](https://img.shields.io/github/package-json/v/shopware/frontends?color=blue&filename=packages%2Fcms-base%2Fpackage.json&label=cms-base%40monorepo&logo=github)](https://github.com/shopware/frontends/tree/main/packages/cms-base)
![](https://img.shields.io/github/license/shopware/frontends?color=blue)
[![](https://img.shields.io/github/issues/shopware/frontends/cms-base?label=cms-base%20issues&logo=github)](https://github.com/shopware/frontends/issues?q=is%3Aopen+is%3Aissue+label%3Acms-base)


Nuxt [module](https://nuxt.com/docs/guide/going-further/modules) that provides an implementation of all CMS components in Shopware [based on utility-classes](https://frontends.shopware.com/framework/styling.html) using unocss/Tailwind.css syntax. 

It is useful for projects that want to use the CMS components but design their own layout.

## Features

- Vue components for [Shopping Experiences](https://www.shopware.com/en/products/shopping-experiences/) CMS
- CMS sections, blocks and elements styled using [Tailwind CSS](https://tailwindcss.com/) classes
- 🚀 Empowered by [@shopware-pwa/composables-next](https://www.npmjs.com/package/@shopware-pwa/composables-next)


## Setup

Install npm package:

```bash
# Using pnpm
pnpm add -D @shopware-pwa/cms-base

# Using yarn
yarn add --dev @shopware-pwa/cms-base

# Using npm
npm i @shopware-pwa/cms-base --save-dev
```

Then, register the module by editing `nuxt.config.js` or (`.ts`) file:

```js
/* nuxt.config.ts */

export default defineNuxtConfig({
  /* ... */
+ modules: [/* ... */, "@shopware-pwa/cms-base"],
});
```

## Basic usage

Since all CMS components are registered in your Nuxt application, you can now start using them in your template (no imports needed):

```js
/* Vue component */

// response object can be a Product|Category|Landing Page response from Shopware 6 store-api containing a layout (cmsPage object) built using  Shopping Experiences
<template>
    <CmsPage v-if="response.cmsPage" :content="response.cmsPage"/>
</template>
```

See a [short guide](https://frontends.shopware.com/getting-started/cms/content-pages.html#use-the-cms-base-package) how to use `cms-base` package in your project based on Nuxt v3.


## TypeScript support

All components are fully typed with TypeScript. 

No additional packages needed.


## Links

* [📘 Documentation](https://frontends.shopware.com)

* [👥 Community](https://shopwarecommunity.slack.com ()
) (`#shopware-frontends` & `#shopware-pwa` channel)

<!-- AUTO GENERATED CHANGELOG -->

## Changelog

Full changelog for stable version is available [here](https://github.com/shopware/frontends/blob/main/packages/cms-base/CHANGELOG.md)

### Latest changes: 0.4.1

### Patch Changes

- [`9c7a0f28`](https://github.com/shopware/frontends/commit/9c7a0f280c20ccbafca0e3063533820e21050bee) Thanks [@mkucmus](https://github.com/mkucmus)! - Adjust filter for manufacturer and properties in the listing

- [`7805daf4`](https://github.com/shopware/frontends/commit/7805daf4c0519e78bfa8cf1a9ae6011e75537244) Thanks [@mkucmus](https://github.com/mkucmus)! - Notification on failed action within wishlist

- [`e50702db`](https://github.com/shopware/frontends/commit/e50702db725086a97f182a7213eaf03c913cd870) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add flex to the CmsBlockTextTwoColumn

- [`da2f6897`](https://github.com/shopware/frontends/commit/da2f6897e6839fbeb3ba7eae1eac376f423f2f99) Thanks [@mkucmus](https://github.com/mkucmus)! - Prevent displaying not mapped texts & images elements with no URL

- [`e54e494a`](https://github.com/shopware/frontends/commit/e54e494aefa4d9418c0daf7e3b805b3b17d18c15) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Adjust product page styles

- Updated dependencies [[`e2718c7d`](https://github.com/shopware/frontends/commit/e2718c7d20fac95c57436166083d6e5f599937c2), [`50e74be5`](https://github.com/shopware/frontends/commit/50e74be52034d1947e273985f778e986f077db44), [`0eaf57e1`](https://github.com/shopware/frontends/commit/0eaf57e17a1d8ee454533c33f7528b72021aed4b), [`d358854c`](https://github.com/shopware/frontends/commit/d358854c632447228e719efdf639c428cf6ba804), [`dab0f839`](https://github.com/shopware/frontends/commit/dab0f839eeebe6bb9999cdd0ec11925d935b08b9), [`ec030631`](https://github.com/shopware/frontends/commit/ec0306312fa42451f5f4a98c3e8985b70496fd37), [`5008dcbf`](https://github.com/shopware/frontends/commit/5008dcbf065fc54a3f51517460e409556f370adf), [`da2f6897`](https://github.com/shopware/frontends/commit/da2f6897e6839fbeb3ba7eae1eac376f423f2f99), [`0eaf57e1`](https://github.com/shopware/frontends/commit/0eaf57e17a1d8ee454533c33f7528b72021aed4b), [`30493417`](https://github.com/shopware/frontends/commit/30493417ad5b97ee1f0553f68357a23446b85522), [`e13d3d9a`](https://github.com/shopware/frontends/commit/e13d3d9adde759e97ca7fa9b7a782b7991428679), [`909ffcde`](https://github.com/shopware/frontends/commit/909ffcde24d5ae873d814027be0920a9e5976c72), [`a15a3083`](https://github.com/shopware/frontends/commit/a15a308359497bb9d483bebe040d717114946ff0), [`e71cc788`](https://github.com/shopware/frontends/commit/e71cc788c375c19ec449b820c0813b83503ef067)]:
  - @shopware-pwa/helpers-next@0.1.25
  - @shopware-pwa/composables-next@0.7.0
  - @shopware-pwa/api-client@0.3.0
