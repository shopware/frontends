# shopware/frontends - cms-base

[![](https://img.shields.io/npm/v/@shopware-pwa/cms-base?color=blue&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCA0ODggNTUzIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNNDM5LjA0MSAxMjkuNTkzTDI1OC43NjkgMzEuMzA3NkMyNDQuOTE1IDIzLjc1NDEgMjI4LjExNiAyNC4wMDkzIDIxNC40OTcgMzEuOTgwMkw0Ny4yNjkgMTI5Ljg1OEMzMy40NzYzIDEzNy45MzEgMjUgMTUyLjcxMyAyNSAxNjguNjk1VjM4OC40NjZDMjUgNDA0LjczMiAzMy43Nzg1IDQxOS43MzIgNDcuOTYwMiA0MjcuNjk5TDIxNS4xNzggNTIxLjYzNkMyMjguNDUxIDUyOS4wOTIgMjQ0LjU5MyA1MjkuMzMyIDI1OC4wODIgNTIyLjI3NEw0MzguMzY0IDQyNy45MzRDNDUzLjIwMSA0MjAuMTcgNDYyLjUgNDA0LjgwOSA0NjIuNSAzODguMDYzVjE2OS4xMDJDNDYyLjUgMTUyLjYzMiA0NTMuNTAyIDEzNy40NzcgNDM5LjA0MSAxMjkuNTkzWiIgc3Ryb2tlPSJ1cmwoI3BhaW50MF9saW5lYXJfMTUzXzY5MjY1KSIgc3Ryb2tlLXdpZHRoPSI1MCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzE1M182OTI2NSIgeDE9Ii0xNi4yOTg5IiB5MT0iMTY1LjM0OSIgeDI9IjI3Ni40MTIiIHkyPSItODkuMzIzNCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDA4NUZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0MwRTJGNSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPg==)](https://npmjs.com/package/@shopware-pwa/cms-base)
[![](https://img.shields.io/github/package-json/v/shopware/frontends?color=blue&filename=packages%2Fcms-base%2Fpackage.json&label=cms-base%40monorepo&logo=github)](https://github.com/shopware/frontends/tree/main/packages/cms-base)
[![](https://img.shields.io/github/issues/shopware/frontends/cms-base?label=cms-base%20issues&logo=github)](https://github.com/shopware/frontends/issues?q=is%3Aopen+is%3Aissue+label%3Acms-base)
[![](https://img.shields.io/github/license/shopware/frontends?color=blue)](#)

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

### Latest changes: 1.0.3

### Patch Changes

- [#1089](https://github.com/shopware/frontends/pull/1089) [`db7c93f`](https://github.com/shopware/frontends/commit/db7c93ff8cbb581221c11a492e77068af8faa8d6) Thanks [@mkucmus](https://github.com/mkucmus)! - Upgrade eslint config to flat format + lint

- [#1148](https://github.com/shopware/frontends/pull/1148) [`7c38102`](https://github.com/shopware/frontends/commit/7c38102be299756ac1c2dd690d9ace6044f35206) Thanks [@mkucmus](https://github.com/mkucmus)! - - Change resizing mode of Shopware CDN from `crop` to `cover` mode for image of product within `SwProductCart` component

  - Make translation for tier pricing table consistent

- [#1074](https://github.com/shopware/frontends/pull/1074) [`b688163`](https://github.com/shopware/frontends/commit/b68816391ee8ed1ac94a6462a2a016d708f259b4) Thanks [@mkucmus](https://github.com/mkucmus)! - Removed optional chaining for translated properties

- Updated dependencies [[`b688163`](https://github.com/shopware/frontends/commit/b68816391ee8ed1ac94a6462a2a016d708f259b4), [`b688163`](https://github.com/shopware/frontends/commit/b68816391ee8ed1ac94a6462a2a016d708f259b4), [`db7c93f`](https://github.com/shopware/frontends/commit/db7c93ff8cbb581221c11a492e77068af8faa8d6), [`b688163`](https://github.com/shopware/frontends/commit/b68816391ee8ed1ac94a6462a2a016d708f259b4), [`3bde5fe`](https://github.com/shopware/frontends/commit/3bde5fe6d4a9c31d380defc05a7903cf99cb8136)]:
  - @shopware-pwa/helpers-next@1.0.1
  - @shopware-pwa/composables-next@1.1.1
  - @shopware/api-client@1.0.2
