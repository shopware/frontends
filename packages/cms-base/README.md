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

### Latest changes: 0.9.0

### Minor Changes

- [#445](https://github.com/shopware/frontends/pull/445) [`c264bf5d`](https://github.com/shopware/frontends/commit/c264bf5d41638c6013ebf14e7cd9615e5b5ef9bf) Thanks [@BrocksiNet](https://github.com/BrocksiNet)! - Adding the missing srcset attribute to the image tag in the CmsElementImage component. as well as adding support for HTML video elements as in Shopware management, it is possible for users to associate videos to any Cms image element.

- [#435](https://github.com/shopware/frontends/pull/435) [`a4483ed8`](https://github.com/shopware/frontends/commit/a4483ed8bf9370e87aedeb81846fe9d31880b3e0) Thanks [@patzick](https://github.com/patzick)! - Changed types imports to `import type {...} from "..."`

### Patch Changes

- [#454](https://github.com/shopware/frontends/pull/454) [`07ef770d`](https://github.com/shopware/frontends/commit/07ef770d31b9331536ab9c846f4a8ce46e49ed84) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@nuxt/kit_ from **^3.8.0** to **^3.8.1**

- [#402](https://github.com/shopware/frontends/pull/402) [`9a89f409`](https://github.com/shopware/frontends/commit/9a89f40915c08ded0aee6140b42a12a18e74627f) Thanks [@mkucmus](https://github.com/mkucmus)! - Alignment to a11y standards

- [#435](https://github.com/shopware/frontends/pull/435) [`a4483ed8`](https://github.com/shopware/frontends/commit/a4483ed8bf9370e87aedeb81846fe9d31880b3e0) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@nuxt/kit_ from **^3.7.4** to **^3.8.0**

- [#418](https://github.com/shopware/frontends/pull/418) [`67cf5650`](https://github.com/shopware/frontends/commit/67cf56506f58973bf3ab8bb8acef06758a6a6720) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@nuxt/kit_ from **^3.7.3** to **^3.7.4**

- [#413](https://github.com/shopware/frontends/pull/413) [`c6db572f`](https://github.com/shopware/frontends/commit/c6db572f0b041726d89c7e2e18eaed6864189f3a) Thanks [@mkucmus](https://github.com/mkucmus)! - Render <img> element in inner CMS content

- [#438](https://github.com/shopware/frontends/pull/438) [`f636e5a6`](https://github.com/shopware/frontends/commit/f636e5a648d2d13b83589b34e377f1d3fccc1cf7) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Fix url prefix builder

- [#420](https://github.com/shopware/frontends/pull/420) [`f3be470b`](https://github.com/shopware/frontends/commit/f3be470b42b536ba84a9ce968f440f9d6409bc19) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add category link resolver

- [#396](https://github.com/shopware/frontends/pull/396) [`dfc49b80`](https://github.com/shopware/frontends/commit/dfc49b80bcaa8e00b71e0dff6e35b413383274f5) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@nuxt/kit_ from **^3.7.1** to **^3.7.3**

- Updated dependencies [[`f5adaeba`](https://github.com/shopware/frontends/commit/f5adaeba6dec11422e0c02d92aba8caf56017af5), [`f5adaeba`](https://github.com/shopware/frontends/commit/f5adaeba6dec11422e0c02d92aba8caf56017af5), [`67cf5650`](https://github.com/shopware/frontends/commit/67cf56506f58973bf3ab8bb8acef06758a6a6720), [`c264bf5d`](https://github.com/shopware/frontends/commit/c264bf5d41638c6013ebf14e7cd9615e5b5ef9bf), [`85628cc6`](https://github.com/shopware/frontends/commit/85628cc65216417a887398f0838714fc03544303), [`87213fb0`](https://github.com/shopware/frontends/commit/87213fb02b292b11f45b7fb5956fb8bc1ae33800), [`a4483ed8`](https://github.com/shopware/frontends/commit/a4483ed8bf9370e87aedeb81846fe9d31880b3e0), [`12ed75ff`](https://github.com/shopware/frontends/commit/12ed75ffd3d98bf2623161e44f63c40dfc1ef0e3), [`43510a10`](https://github.com/shopware/frontends/commit/43510a108d351aca361e460844b2cddd29f889b5), [`29f849d2`](https://github.com/shopware/frontends/commit/29f849d28c0d0ff8fc34f0d5e921ac2828c93f2b), [`85628cc6`](https://github.com/shopware/frontends/commit/85628cc65216417a887398f0838714fc03544303)]:
  - @shopware-pwa/composables-next@0.14.0
  - @shopware-pwa/api-client@0.7.0
  - @shopware-pwa/helpers-next@0.5.0
