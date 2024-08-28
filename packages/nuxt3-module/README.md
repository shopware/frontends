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

### Latest changes: 1.0.4

### Patch Changes

- Updated dependencies [[`2e4c887`](https://github.com/shopware/frontends/commit/2e4c8872060fb2ebabe5b89d92761994a2ed8128), [`aa8f5a4`](https://github.com/shopware/frontends/commit/aa8f5a4d2eabce1d6119e31af8c7479911d7b07b)]:
  - @shopware-pwa/helpers-next@1.0.2
  - @shopware-pwa/composables-next@1.2.0
