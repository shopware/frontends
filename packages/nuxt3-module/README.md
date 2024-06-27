# shopware/frontends - nuxt3-module

[![](https://img.shields.io/npm/v/@shopware-pwa/nuxt3-module?color=blue&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCA0ODggNTUzIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNNDM5LjA0MSAxMjkuNTkzTDI1OC43NjkgMzEuMzA3NkMyNDQuOTE1IDIzLjc1NDEgMjI4LjExNiAyNC4wMDkzIDIxNC40OTcgMzEuOTgwMkw0Ny4yNjkgMTI5Ljg1OEMzMy40NzYzIDEzNy45MzEgMjUgMTUyLjcxMyAyNSAxNjguNjk1VjM4OC40NjZDMjUgNDA0LjczMiAzMy43Nzg1IDQxOS43MzIgNDcuOTYwMiA0MjcuNjk5TDIxNS4xNzggNTIxLjYzNkMyMjguNDUxIDUyOS4wOTIgMjQ0LjU5MyA1MjkuMzMyIDI1OC4wODIgNTIyLjI3NEw0MzguMzY0IDQyNy45MzRDNDUzLjIwMSA0MjAuMTcgNDYyLjUgNDA0LjgwOSA0NjIuNSAzODguMDYzVjE2OS4xMDJDNDYyLjUgMTUyLjYzMiA0NTMuNTAyIDEzNy40NzcgNDM5LjA0MSAxMjkuNTkzWiIgc3Ryb2tlPSJ1cmwoI3BhaW50MF9saW5lYXJfMTUzXzY5MjY1KSIgc3Ryb2tlLXdpZHRoPSI1MCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzE1M182OTI2NSIgeDE9Ii0xNi4yOTg5IiB5MT0iMTY1LjM0OSIgeDI9IjI3Ni40MTIiIHkyPSItODkuMzIzNCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDA4NUZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0MwRTJGNSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPg==)](https://npmjs.com/package/@shopware-pwa/nuxt3-module)
[![](https://img.shields.io/github/package-json/v/shopware/frontends?color=blue&filename=packages%2Fnuxt3-module%2Fpackage.json&label=nuxt3-module%40monorepo&logo=github)](https://github.com/shopware/frontends/tree/main/packages/nuxt3-module)
[![](https://img.shields.io/github/issues/shopware/frontends/nuxt3-module?label=nuxt3-module%20issues&logo=github)](https://github.com/shopware/frontends/issues?q=is%3Aopen+is%3Aissue+label%3Anuxt3-module)
[![](https://img.shields.io/github/license/shopware/frontends?color=blue)](#)

Nuxt [module](https://nuxt.com/docs/guide/going-further/modules) that allows you to set up a Nuxt 3 project with Shopware Frontends. It provides the composables and api-client packages.

If you want to use these packages with a different Vue.js framework, see [the guide](https://frontends.shopware.com/getting-started/templates/custom-vue-project.html) for using Shopware Frontends in a custom project.

## Features

- Business logic covered by [Composables](https://npmjs.com/package/@shopware-pwa/composables-next) package. Registering all composable functions globally. [See the reference](https://frontends.shopware.com/packages/composables.html).
- Shopware context shared in Nuxt application.
- Configured [API Client](https://npmjs.com/package/@shopware/api-client) package.

## Setup

Install npm package:

```bash
# Using pnpm
pnpm add -D @shopware-pwa/nuxt3-module

# Using yarn
yarn add --dev @shopware-pwa/nuxt3-module

# Using npm
npm i @shopware-pwa/nuxt3-module --save-dev
```

Then, register the module by editing `nuxt.config.js` or (`.ts`) file (by extending `modules` array):

```js
/* nuxt.config.ts */

export default defineNuxtConfig({
  /* ... */
  modules: [, /* ... */ "@shopware-pwa/nuxt3-module"],
  // set the module config
  shopware: {
    // connect to your Shopware 6 API instance
    endpoint: "https://demo-frontends.shopware.store",
    accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
  },
  // or directly in the runtime config
  // this config will override the base one
  runtimeConfig: {
    public: {
      shopware: {
        endpoint: "https://demo-frontends.shopware.store",
        accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
      },
    },
  },
});
```

Set up your own API instance under `shopware` key or by extending public `runtimeConfiguration` in the same file. The nuxt module (and vue plugin) will use those values (runtimeConfig will always override the base ones).

## Basic usage

Now you can use any composable function you need without extra import:

```html
<script setup>
  const { login } = useUser();
  const { refreshSessionContext } = useSessionContext();
  refreshSessionContext();
</script>
```

The information about the session is kept in a cookie (`sw-context-token`) and used in every request made by any composable or directly, invoked by `api instance`:

```html
<script>
  const { apiClient } = useShopwareContext();
  const apiResponse = await apiClient.invoke(/** params omitted */);
</script>
```

## TypeScript support

All composable functions are fully typed with TypeScript and they are registed globally in Nuxt.js application, so the type hinting will help you to work with all of them.

## 📦 Advanced packaging

Internally, the module uses [API Client](https://npmjs.com/package/@shopware-pwa/api-client) and [Composables](https://npmjs.com/package/@shopware-pwa/composables-next) packages, configured together to make everything working well. If you need to check how it's working on a different version of one of them, install a package locally in your project (to be installed and available in project's `package.json` file), then the Nuxt module will use yours. Keep in mind that the different configuration may lead to unexpected behavior.

## Links

- [📘 Documentation](https://frontends.shopware.com)

- [👥 Community](https://shopwarecommunity.slack.com) (`#shopware-frontends` & `#shopware-pwa` channel)
<!-- AUTO GENERATED CHANGELOG -->

## Changelog

Full changelog for stable version is available [here](https://github.com/shopware/frontends/blob/main/packages/nuxt3-module/CHANGELOG.md)

### Latest changes: 1.0.0

### Major Changes

- [#871](https://github.com/shopware/frontends/pull/871) [`1566f7a`](https://github.com/shopware/frontends/commit/1566f7a3962c511b5c72e12a4a5db40c4aa5d198) Thanks [@patzick](https://github.com/patzick)! - Read more about new major release: https://github.com/shopware/frontends/discussions/965

- [#452](https://github.com/shopware/frontends/pull/452) [`e2c225f`](https://github.com/shopware/frontends/commit/e2c225f1d69a5d523f3c1e6c90449ee28f98b2f2) Thanks [@patzick](https://github.com/patzick)! - Created Nuxt layer for `composables` and `cms-base`. This way overriding any part of that is now possible.

### Patch Changes

- [#478](https://github.com/shopware/frontends/pull/478) [`df96fd0`](https://github.com/shopware/frontends/commit/df96fd09b9bef27d058e3f7ee9b4f18f7035d622) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@nuxt/kit_ from **^3.8.1** to **^3.8.2**

- [#742](https://github.com/shopware/frontends/pull/742) [`aa97efe`](https://github.com/shopware/frontends/commit/aa97efe0131024fb3d61cf0d8df6c44eccc62e70) Thanks [@mkucmus](https://github.com/mkucmus)! - Use new format of module config & deprecation warning for old config format

- [#664](https://github.com/shopware/frontends/pull/664) [`af2bc19`](https://github.com/shopware/frontends/commit/af2bc19063d967bd1d13b388ddf430d97ae8445a) Thanks [@rebewp](https://github.com/rebewp)! - Changed usage of env variables to be able to adjust their naming to only include shopware once.
  After merging, ENV Variables with names including _*SHOPWARE_SHOPWARE*_ still work.
- Updated dependencies [[`38a3853`](https://github.com/shopware/frontends/commit/38a385374a99d114c4ed3477f14c9e06dedb0dcd), [`2343012`](https://github.com/shopware/frontends/commit/2343012ad552b06557e6715055b3abc534fa2fae), [`f1b2a30`](https://github.com/shopware/frontends/commit/f1b2a307de58e0f296edab3222b7cd5684104347), [`2ade07a`](https://github.com/shopware/frontends/commit/2ade07ad51944eebb7d1962c36823875cd5e959e), [`fc262dd`](https://github.com/shopware/frontends/commit/fc262dd3a93338353394c03faf7fee36a0c36511), [`1566f7a`](https://github.com/shopware/frontends/commit/1566f7a3962c511b5c72e12a4a5db40c4aa5d198), [`823aa9b`](https://github.com/shopware/frontends/commit/823aa9b4626c8931d2bea1399e825162c44fd45c), [`4dce006`](https://github.com/shopware/frontends/commit/4dce006460611e59fed084511ca9ecb814f95cf1), [`c729e70`](https://github.com/shopware/frontends/commit/c729e7014c70d7f71edf5297104065d18e482e04), [`bebae42`](https://github.com/shopware/frontends/commit/bebae42e58e3dd47f13bf166b0fb0d8ac9a416e3), [`782ef4d`](https://github.com/shopware/frontends/commit/782ef4d417dce6e6d60992bd54f876aa4bc5f45d), [`9643e56`](https://github.com/shopware/frontends/commit/9643e56dafba9282b75c12c96b2afb3a4738f86e), [`1583a7a`](https://github.com/shopware/frontends/commit/1583a7ae0d68b72fb362b625e1634e03bad68110), [`97d2859`](https://github.com/shopware/frontends/commit/97d2859e4dcbdc563200f2f64d1a20880b675d87), [`864616f`](https://github.com/shopware/frontends/commit/864616f0c9e1cbe11e434b9a04a35ff9520bcb3c), [`d60d062`](https://github.com/shopware/frontends/commit/d60d0620c7114a2f26bb2faf24241e2cbabc8798), [`a92941e`](https://github.com/shopware/frontends/commit/a92941ed59313fe85d5bbe204c2930d8a1a106b1), [`487d991`](https://github.com/shopware/frontends/commit/487d991f2cda0fbf637502597b20dd931498fe6a), [`013a1d6`](https://github.com/shopware/frontends/commit/013a1d6f88377686cfc1a85903a0c48d8fda67f5), [`53e7177`](https://github.com/shopware/frontends/commit/53e71770ad741bb558f193a95cae6bcc025a047f), [`99ad5e9`](https://github.com/shopware/frontends/commit/99ad5e99652771ea7cd5e1395708a878cca980f5), [`c729e70`](https://github.com/shopware/frontends/commit/c729e7014c70d7f71edf5297104065d18e482e04), [`04ac2ad`](https://github.com/shopware/frontends/commit/04ac2ada522c881bb06565c332baf5f2cf08643d), [`e2c225f`](https://github.com/shopware/frontends/commit/e2c225f1d69a5d523f3c1e6c90449ee28f98b2f2), [`89a97a4`](https://github.com/shopware/frontends/commit/89a97a45ae4a58616e41f63e9884a2a67f0a6ce8), [`c729e70`](https://github.com/shopware/frontends/commit/c729e7014c70d7f71edf5297104065d18e482e04), [`864616f`](https://github.com/shopware/frontends/commit/864616f0c9e1cbe11e434b9a04a35ff9520bcb3c), [`8f0b468`](https://github.com/shopware/frontends/commit/8f0b46850a0b89667934c551431306f7d765f86b), [`97b5949`](https://github.com/shopware/frontends/commit/97b5949da2663700aa4047c4927b4a5f192cee74), [`05ca5b6`](https://github.com/shopware/frontends/commit/05ca5b68f098bc8969c2c50e270b19b00938513c), [`7a3a92c`](https://github.com/shopware/frontends/commit/7a3a92c3ee1a337e752adbcfa5057d30064eed7c), [`6664aa2`](https://github.com/shopware/frontends/commit/6664aa2aa48ec63fc053ad024a03940113e17956), [`479357c`](https://github.com/shopware/frontends/commit/479357c74d40c99218eb22ccd4089357ffab5872), [`6b54268`](https://github.com/shopware/frontends/commit/6b54268049ae9b1b3d311b9a122f43a752a2b715), [`6b54268`](https://github.com/shopware/frontends/commit/6b54268049ae9b1b3d311b9a122f43a752a2b715)]:
  - @shopware-pwa/composables-next@1.0.0
  - @shopware/api-client@1.0.0
  - @shopware-pwa/helpers-next@1.0.0
