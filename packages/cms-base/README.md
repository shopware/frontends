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

### ⚠️ `<RouterLink/>` components used

Some components use `RouterLink` component internally, available in [Vue Router](https://github.com/vuejs/router).
In order to parse CMS components correctly and avoid missing component warning, it's **highly recommended** to have **Vue Router installed** or **Nuxt router enabled** in your application.

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

## TypeScript support

All components are fully typed with TypeScript.

No additional packages needed to be installed.

## Links

- [📘 Documentation](https://frontends.shopware.com)

- [👥 Community](https://shopwarecommunity.slack.com) (`#shopware-frontends` & `#shopware-pwa` channel)

<!-- AUTO GENERATED CHANGELOG -->

## Changelog

Full changelog for stable version is available [here](https://github.com/shopware/frontends/blob/main/packages/cms-base/CHANGELOG.md)

### Latest changes: 0.5.0

### Minor Changes

- [#124](https://github.com/shopware/frontends/pull/124) [`8e30002d`](https://github.com/shopware/frontends/commit/8e30002d0c93cce6485e7e476386d55f755fc44b) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add translations inject

- [#180](https://github.com/shopware/frontends/pull/180) [`f1bd80b4`](https://github.com/shopware/frontends/commit/f1bd80b4082e2a23e94cfe4485f14715f125441a) Thanks [@patzick](https://github.com/patzick)! - Images for CMS elements and Product cart are now optimised for displayed size. This is decreasing weight of the whole page. Also small thumbnail of the image is shown.

- [#180](https://github.com/shopware/frontends/pull/180) [`f1bd80b4`](https://github.com/shopware/frontends/commit/f1bd80b4082e2a23e94cfe4485f14715f125441a) Thanks [@patzick](https://github.com/patzick)! - Product Card design has changed.

### Patch Changes

- [#101](https://github.com/shopware/frontends/pull/101) [`58932a83`](https://github.com/shopware/frontends/commit/58932a83106f7c415e68c4c1555180ff844ec151) Thanks [@mkucmus](https://github.com/mkucmus)! - Show regulation price in product components

- [#177](https://github.com/shopware/frontends/pull/177) [`6320ca6f`](https://github.com/shopware/frontends/commit/6320ca6f00771b9f7d0a736c6438ca80ae60f33f) Thanks [@mkucmus](https://github.com/mkucmus)! - README enhancements

- Updated dependencies [[`0e85ad14`](https://github.com/shopware/frontends/commit/0e85ad14c7a115a9e4e79cb3d89e41129be30f03), [`3764736e`](https://github.com/shopware/frontends/commit/3764736e52fffb7f7abeb4c044dee2adc812cbb6), [`81f45335`](https://github.com/shopware/frontends/commit/81f4533513b2ee538111159f8e37cd7bd1db9f1e), [`7fe30878`](https://github.com/shopware/frontends/commit/7fe3087844007d12dc26d9c6817ecd12eb431b9b), [`e03c67a8`](https://github.com/shopware/frontends/commit/e03c67a8d553694be6e14e2c8d1a3f99b1b2ffbe), [`1fd1962f`](https://github.com/shopware/frontends/commit/1fd1962f7f4ee26461e8918e70e5f686fa431c6d), [`bb64070f`](https://github.com/shopware/frontends/commit/bb64070f69e47c14653c524d864f7a8ab8290724), [`693f9829`](https://github.com/shopware/frontends/commit/693f9829d5082307cb1f3b18d5b0217e42c6cf68), [`eddcfcca`](https://github.com/shopware/frontends/commit/eddcfcca8e00530147e77bd1122fc9e6828fbf57), [`8dc64e31`](https://github.com/shopware/frontends/commit/8dc64e31756e8509866efdc2b52915b8862598cb), [`eddcfcca`](https://github.com/shopware/frontends/commit/eddcfcca8e00530147e77bd1122fc9e6828fbf57), [`7fe30878`](https://github.com/shopware/frontends/commit/7fe3087844007d12dc26d9c6817ecd12eb431b9b), [`0188b36a`](https://github.com/shopware/frontends/commit/0188b36acdf43278163a2fee74ff5b1c1aba55d8)]:
  - @shopware-pwa/composables-next@0.8.0
  - @shopware-pwa/helpers-next@0.2.0
  - @shopware-pwa/api-client@0.4.0
