# shopware/frontends - nuxt3-module

[![](https://img.shields.io/npm/v/@shopware-pwa/nuxt3-module?color=blue&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCA0ODggNTUzIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNNDM5LjA0MSAxMjkuNTkzTDI1OC43NjkgMzEuMzA3NkMyNDQuOTE1IDIzLjc1NDEgMjI4LjExNiAyNC4wMDkzIDIxNC40OTcgMzEuOTgwMkw0Ny4yNjkgMTI5Ljg1OEMzMy40NzYzIDEzNy45MzEgMjUgMTUyLjcxMyAyNSAxNjguNjk1VjM4OC40NjZDMjUgNDA0LjczMiAzMy43Nzg1IDQxOS43MzIgNDcuOTYwMiA0MjcuNjk5TDIxNS4xNzggNTIxLjYzNkMyMjguNDUxIDUyOS4wOTIgMjQ0LjU5MyA1MjkuMzMyIDI1OC4wODIgNTIyLjI3NEw0MzguMzY0IDQyNy45MzRDNDUzLjIwMSA0MjAuMTcgNDYyLjUgNDA0LjgwOSA0NjIuNSAzODguMDYzVjE2OS4xMDJDNDYyLjUgMTUyLjYzMiA0NTMuNTAyIDEzNy40NzcgNDM5LjA0MSAxMjkuNTkzWiIgc3Ryb2tlPSJ1cmwoI3BhaW50MF9saW5lYXJfMTUzXzY5MjY1KSIgc3Ryb2tlLXdpZHRoPSI1MCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzE1M182OTI2NSIgeDE9Ii0xNi4yOTg5IiB5MT0iMTY1LjM0OSIgeDI9IjI3Ni40MTIiIHkyPSItODkuMzIzNCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDA4NUZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0MwRTJGNSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPg==)](https://npmjs.com/package/@shopware-pwa/nuxt3-module)
[![](https://img.shields.io/github/package-json/v/shopware/frontends?color=blue&filename=packages%2Fnuxt3-module%2Fpackage.json&label=nuxt3-module%40monorepo&logo=github)](https://github.com/shopware/frontends/tree/main/packages/nuxt3-module)
![](https://img.shields.io/github/license/shopware/frontends?color=blue)
[![](https://img.shields.io/github/issues/shopware/frontends/nuxt3-module?label=nuxt3-module%20issues&logo=github)](https://github.com/shopware/frontends/issues?q=is%3Aopen+is%3Aissue+label%3Anuxt3-module)

Nuxt [module](https://nuxt.com/docs/guide/going-further/modules) that allows you to set up a Nuxt 3 project with Shopware Frontends. It provides the composables and api-client packages.

If you want to use these packages with a different Vue.js framework, see [the guide](https://frontends.shopware.com/getting-started/templates/custom-project.html) for using Shopware Frontends in a custom project or use the [vue3-plugin](https://frontends.shopware.com/framework/internal-structure.html#vue3-plugin).

## Features

- Business logic covered by [Composables](https://npmjs.com/package/@shopware-pwa/composables-next) package. Registering all composable functions globally. [See the reference](https://frontends.shopware.com/packages/composables.html).
- Shopware context shared in Nuxt application.
- Configured [API Client](https://npmjs.com/package/@shopware-pwa/api-client) package.

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

  runtimeConfig: {
    public: {
      shopware: {
        // connect to your Shopware 6 API instance
        shopwareEndpoint: "https://demo-frontends.shopware.store",
        shopwareAccessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
      },
    },
  },
});
```

Set up your own API instance by adding public `runtimeConfiguration` in the same file. The nuxt module (and vue plugin) will use this values.

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
  const { apiInstance } = useShopwareContext();
  const rawApiResponse = await apiInstance.invokePost(/** params omitted */);
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

### Latest changes: 0.4.0

### Minor Changes

- [#309](https://github.com/shopware/frontends/pull/309) [`84a7fe6`](https://github.com/shopware/frontends/commit/84a7fe6468041a4b12841fdf4844f3b38dfa387d) Thanks [@patzick](https://github.com/patzick)! - Added new config `useUserContextInSSR` - set to true if you want for the server to use session from cookie and prepare view with it. Use carefully with edge caching to avoid sharing user data with edge cache. Default is false, so server will always use new context to prepare rendered view.

### Patch Changes

- [#303](https://github.com/shopware/frontends/pull/303) [`aeb639a`](https://github.com/shopware/frontends/commit/aeb639a3244f812c275145345618e5bc0045be0d) Thanks [@patzick](https://github.com/patzick)! - Improved linting in packages. Types should be more reliable

- [#313](https://github.com/shopware/frontends/pull/313) [`0e82ab3`](https://github.com/shopware/frontends/commit/0e82ab395cc88e992d2d64853d27603548c36bb9) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@nuxt/kit_ from **^3.6.1** to **^3.6.2**

- [#328](https://github.com/shopware/frontends/pull/328) [`a75617f`](https://github.com/shopware/frontends/commit/a75617f4104f7e66599aa5341e46759bb9d414c9) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@nuxt/kit_ from **^3.6.2** to **^3.6.3**

- Updated dependencies [[`aeb639a`](https://github.com/shopware/frontends/commit/aeb639a3244f812c275145345618e5bc0045be0d), [`8c6ff0a`](https://github.com/shopware/frontends/commit/8c6ff0ac87143a014f609aedd22aac99888da337), [`b9a2004`](https://github.com/shopware/frontends/commit/b9a20044d3df04370c62ab392b5144a62fbb57a9)]:
  - @shopware-pwa/composables-next@0.12.0
  - @shopware-pwa/api-client@0.5.2
