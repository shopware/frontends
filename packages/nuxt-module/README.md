# shopware/frontends - nuxt-module

[![](https://img.shields.io/npm/v/@shopware/nuxt-module?color=blue&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCA0ODggNTUzIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNNDM5LjA0MSAxMjkuNTkzTDI1OC43NjkgMzEuMzA3NkMyNDQuOTE1IDIzLjc1NDEgMjI4LjExNiAyNC4wMDkzIDIxNC40OTcgMzEuOTgwMkw0Ny4yNjkgMTI5Ljg1OEMzMy40NzYzIDEzNy45MzEgMjUgMTUyLjcxMyAyNSAxNjguNjk1VjM4OC40NjZDMjUgNDA0LjczMiAzMy43Nzg1IDQxOS43MzIgNDcuOTYwMiA0MjcuNjk5TDIxNS4xNzggNTIxLjYzNkMyMjguNDUxIDUyOS4wOTIgMjQ0LjU5MyA1MjkuMzMyIDI1OC4wODIgNTIyLjI3NEw0MzguMzY0IDQyNy45MzRDNDUzLjIwMSA0MjAuMTcgNDYyLjUgNDA0LjgwOSA0NjIuNSAzODguMDYzVjE2OS4xMDJDNDYyLjUgMTUyLjYzMiA0NTMuNTAyIDEzNy40NzcgNDM5LjA0MSAxMjkuNTkzWiIgc3Ryb2tlPSJ1cmwoI3BhaW50MF9saW5lYXJfMTUzXzY5MjY1KSIgc3Ryb2tlLXdpZHRoPSI1MCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzE1M182OTI2NSIgeDE9Ii0xNi4yOTg5IiB5MT0iMTY1LjM0OSIgeDI9IjI3Ni40MTIiIHkyPSItODkuMzIzNCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDA4NUZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0MwRTJGNSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPg==)](https://npmjs.com/package/@shopware/nuxt-module)
[![](https://img.shields.io/github/package-json/v/shopware/frontends?color=blue&filename=packages%2Fnuxt-module%2Fpackage.json&label=nuxt-module%40monorepo&logo=github)](https://github.com/shopware/frontends/tree/main/packages/nuxt-module)
[![](https://img.shields.io/github/issues/shopware/frontends/nuxt-module?label=nuxt-module%20issues&logo=github)](https://github.com/shopware/frontends/issues?q=is%3Aopen+is%3Aissue+label%3Anuxt-module)
[![](https://img.shields.io/github/license/shopware/frontends?color=blue)](#)

Nuxt [module](https://nuxt.com/docs/guide/going-further/modules) that allows you to set up a Nuxt 3 project with Shopware Frontends. It provides the composables and api-client packages.

If you want to use these packages with a different Vue.js framework, see [the guide](https://frontends.shopware.com/getting-started/templates/custom-vue-project.html) for using Shopware Frontends in a custom project.

## Features

- Business logic covered by [Composables](https://npmjs.com/package/@shopware/composables) package. Registering all composable functions globally. [See the reference](https://frontends.shopware.com/packages/composables.html).
- Shopware context shared in Nuxt application.
- Configured [API Client](https://npmjs.com/package/@shopware/api-client) package.

## Setup

Install npm package:

```bash
# Using pnpm
pnpm add -D @shopware/nuxt-module

# Using yarn
yarn add --dev @shopware/nuxt-module

# Using npm
npm i @shopware/nuxt-module --save-dev
```

Then, register the module by editing `nuxt.config.js` or (`.ts`) file (by extending `modules` array):

```js
/* nuxt.config.ts */

export default defineNuxtConfig({
  /* ... */
  modules: [, /* ... */ "@shopware/nuxt-module"],
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
<script setup>
  const { apiClient } = useShopwareContext();
  const apiResponse = await apiClient.invoke(/** params omitted */);
</script>
```

## TypeScript support

All composable functions are fully typed with TypeScript and they are registed globally in Nuxt.js application, so the type hinting will help you to work with all of them.

## 📦 Advanced packaging

Internally, the module uses [API Client](https://npmjs.com/package/@shopware/api-client) and [Composables](https://npmjs.com/package/@shopware/composables) packages, configured together to make everything working well. If you need to check how it's working on a different version of one of them, install a package locally in your project (to be installed and available in project's `package.json` file), then the Nuxt module will use yours. Keep in mind that the different configuration may lead to unexpected behavior.

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

## Register custom API types (tailored for your Shopware instance)

To use custom API types generated by the `api-gen` package, create a `shopware.d.ts` file in your project and register the types for the `#shopware` module. This enables type-safe usage of your custom API types throughout your Nuxt application.

**Example of using a local type definitions:**

```ts
// shopware.d.ts
declare module "#shopware" {
  import type { createAPIClient } from "@shopware/api-client";

  // Use default Shopware types:
  // export type operations =
  //  import("@shopware/api-client/store-api-types").operations;
  // export type Schemas =
  // import("@shopware/api-client/store-api-types").components["schemas"];

  // Or use your locally generated types (placed in ./api-types folder):
  export type operations = import("./api-types/storeApiTypes").operations;
  export type Schemas =
    import("./api-types/storeApiTypes").components["schemas"];

  // Export your own Api Client definition:
  export type ApiClient = ReturnType<typeof createAPIClient<operations>>;
}
```

Import your custom types from local files and export them as shown above. This approach keeps your types local, allows merging or overriding defaults, and ensures full type safety for API operations and schemas.

### Apply custom types for `@shopware/api-client`

The API Client instance is aware of your custom API types thanks to declaring `#shopware` module from the step above. So now, whenever `apiClient` instance is used, the proper types are registered.

## Links

- [📘 Documentation](https://frontends.shopware.com)

- [📦 API Gen - Types Generator for Shopware 6 OpenAPI Schema](https://npmjs.com/@shopware/api-gen)

- [📦 API Client - REST API Client for Shopware 6](https://npmjs.com/@shopware/api-client)

- [👥 Community](https://discord.com/channels/1308047705309708348/1405501315160739951) (`#composable-frontend`)
<!-- AUTO GENERATED CHANGELOG -->

## Changelog

Full changelog for stable version is available [here](https://github.com/shopware/frontends/blob/main/packages/nuxt-module/CHANGELOG.md)

### Latest changes: 1.5.0

### Minor Changes

- [#2473](https://github.com/shopware/frontends/pull/2473) [`22611e5`](https://github.com/shopware/frontends/commit/22611e542b8f42a4f34dce5186f628f9a17f457b) Thanks [@mkucmus](https://github.com/mkucmus)! - Add an opt-in `cacheableReads` flag that routes anonymous Store API reads through their cacheable GET variants instead of POST. Criteria is compressed into the `_criteria` query param via `encodeForQuery` from `@shopware/api-client/helpers`, which lets CDNs / reverse proxies / the browser cache the responses.

  Disabled by default — fully backwards compatible. Enable it in `nuxt.config` (`shopware: { cacheableReads: true }`) or via `createShopwareContext(app, { cacheableReads: true })` for non-Nuxt setups. It is surfaced on the Shopware context and read by the affected composables; public composable signatures are unchanged.

  Affected composables: `useNavigation`, `useNavigationSearch`, `useCountries`, `useUser` (country + salutation lookups), `useSalutations`, `useInternationalization`, `useProductConfigurator`, `useProductSearch`, and `useCategorySearch.advancedSearch`.

  `useListing` (product-listing), single-category `useCategorySearch.search`, and `useLandingSearch` remain POST for now: the generated Store API schema does not type `_criteria` on those GET routes (a Shopware OpenAPI gap). The backend does honor `_criteria` on product-listing GET at runtime, so that one can be migrated later once the types are augmented.

### Patch Changes

- [#2488](https://github.com/shopware/frontends/pull/2488) [`c56b89e`](https://github.com/shopware/frontends/commit/c56b89e16a9fbd9283e40a4e2c0f7cc6034226a1) Thanks [@mkucmus](https://github.com/mkucmus)! - Register the `#shopware` types in every TypeScript context (app, server/nitro, node, shared) instead of only the app one. This fixes `Cannot find module '#shopware'` in server-side code (e.g. `server/` routes and API builders) when a project uses the Nuxt 4 project-references `tsconfig.json` layout. Projects that ship their own `shopware.d.ts` are referenced in place so their relative imports keep resolving.

- Updated dependencies [[`8be060d`](https://github.com/shopware/frontends/commit/8be060de825ca799f98a8f045a5e7fea61f5d1a2), [`5678fb0`](https://github.com/shopware/frontends/commit/5678fb008cbd86eaddd061e004de89e6f45bb7ec), [`22611e5`](https://github.com/shopware/frontends/commit/22611e542b8f42a4f34dce5186f628f9a17f457b)]:
  - @shopware/composables@1.12.0
