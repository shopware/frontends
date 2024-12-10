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

Internally, the module uses [API Client](https://npmjs.com/package/@shopware/api-client) and [Composables](https://npmjs.com/package/@shopware-pwa/composables-next) packages, configured together to make everything working well. If you need to check how it's working on a different version of one of them, install a package locally in your project (to be installed and available in project's `package.json` file), then the Nuxt module will use yours. Keep in mind that the different configuration may lead to unexpected behavior.

## API Default Headers

You can use Nuxt config to set the default API call headers.
More about Nuxt configuration can be found [HERE](https://nuxt.com/docs/getting-started/configuration).

> **_NOTE:_** By default, the values in `runtimeConfig` are only available on the server-side. However, keys within `runtimeConfig.public` are also accessible on the client-side. [MORE](https://nuxt.com/docs/getting-started/configuration#environment-variables-and-private-tokens)

```json
{
  "runtimeConfig": {
    "public": {
      "apiClientConfig": {
        "headers": {
          "global-heder-example": "global-header-example-value"
        }
      }
    },
    "apiClientConfig": {
      "headers": {
        "ssr-heder-example": "ssr-header-example-value"
      }
    }
  }
}
```

## Links

- [📘 Documentation](https://frontends.shopware.com)

- [👥 Community](https://shopwarecommunity.slack.com) (`#composable-frontends` & `#shopware-pwa` channel)
<!-- AUTO GENERATED CHANGELOG -->

## Changelog

Full changelog for stable version is available [here](https://github.com/shopware/frontends/blob/main/packages/nuxt3-module/CHANGELOG.md)

### Latest changes: 1.1.0

### Minor Changes

- [#1442](https://github.com/shopware/frontends/pull/1442) [`9669d1b`](https://github.com/shopware/frontends/commit/9669d1b39fca71461a3641840632db171f2968ed) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Added possibility to use Nuxt config file for setting the API requests headers. Headers are added to each request SSR and CSR.

### Patch Changes

- [#1514](https://github.com/shopware/frontends/pull/1514) [`05a4792`](https://github.com/shopware/frontends/commit/05a479240cac709e18f411a6276de359937341a6) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Replace `createError` with `showError` function in the `onResponseError` hook to redirect the user to the Nuxt error page.

- Updated dependencies [[`a87bbcf`](https://github.com/shopware/frontends/commit/a87bbcfa3f5aa440265b1e8f0fc72a204863befc), [`2c337b5`](https://github.com/shopware/frontends/commit/2c337b5555495e5cc75f17f1c7f50cc25dfe7c1e), [`13c83be`](https://github.com/shopware/frontends/commit/13c83bec53a6aaba49941b9bf869629eadeb4515), [`13c83be`](https://github.com/shopware/frontends/commit/13c83bec53a6aaba49941b9bf869629eadeb4515), [`8ba9702`](https://github.com/shopware/frontends/commit/8ba9702657d1dc31cc653728788830fa38bb4992), [`a03a492`](https://github.com/shopware/frontends/commit/a03a492f18ebff84606e47f5239330454c9f3039)]:
  - @shopware/api-client@1.2.0
  - @shopware-pwa/composables-next@1.5.0
  - @shopware-pwa/helpers-next@1.2.0
