# shopware/frontends - composables

[![](https://img.shields.io/npm/v/@shopware/composables?color=blue&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCA0ODggNTUzIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNNDM5LjA0MSAxMjkuNTkzTDI1OC43NjkgMzEuMzA3NkMyNDQuOTE1IDIzLjc1NDEgMjI4LjExNiAyNC4wMDkzIDIxNC40OTcgMzEuOTgwMkw0Ny4yNjkgMTI5Ljg1OEMzMy40NzYzIDEzNy45MzEgMjUgMTUyLjcxMyAyNSAxNjguNjk1VjM4OC40NjZDMjUgNDA0LjczMiAzMy43Nzg1IDQxOS43MzIgNDcuOTYwMiA0MjcuNjk5TDIxNS4xNzggNTIxLjYzNkMyMjguNDUxIDUyOS4wOTIgMjQ0LjU5MyA1MjkuMzMyIDI1OC4wODIgNTIyLjI3NEw0MzguMzY0IDQyNy45MzRDNDUzLjIwMSA0MjAuMTcgNDYyLjUgNDA0LjgwOSA0NjIuNSAzODguMDYzVjE2OS4xMDJDNDYyLjUgMTUyLjYzMiA0NTMuNTAyIDEzNy40NzcgNDM5LjA0MSAxMjkuNTkzWiIgc3Ryb2tlPSJ1cmwoI3BhaW50MF9saW5lYXJfMTUzXzY5MjY1KSIgc3Ryb2tlLXdpZHRoPSI1MCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzE1M182OTI2NSIgeDE9Ii0xNi4yOTg5IiB5MT0iMTY1LjM0OSIgeDI9IjI3Ni40MTIiIHkyPSItODkuMzIzNCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDA4NUZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0MwRTJGNSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPg==)](https://npmjs.com/package/@shopware/composables)
[![](https://img.shields.io/github/package-json/v/shopware/frontends?color=blue&filename=packages%2Fcomposables%2Fpackage.json&label=frontends/composables&logo=github)](https://github.com/shopware/frontends/tree/main/packages/composables)
[![](https://img.shields.io/github/issues/shopware/frontends/composables?label=package%20issues&logo=github)](https://github.com/shopware/frontends/issues?q=is%3Aopen+is%3Aissue+label%3Acomposables)
[![](https://img.shields.io/github/license/shopware/frontends?color=blue)](#)

Set of Vue.js composition functions that can be used in any Vue.js project. They provide state management, UI logic and data fetching and are the base for all guides in our [building section](https://developer.shopware.com/frontends/frontends-recipes/context/navigation.html).

## Features

- `createShopwareContext` method to create a Vue 3 plugin to install
- State management
- Logic for UI
- Communication with Store-API via [api-client](https://www.npmjs.com/package/@shopware/api-client) package

## Setup

Install npm packages (composables & api-client):

```bash
# Using pnpm
pnpm add @shopware/composables @shopware/api-client @shopware/api-gen

# Using yarn
yarn add @shopware/composables @shopware/api-client @shopware/api-gen

# Using npm
npm i @shopware/composables @shopware/api-client @shopware/api-gen
```

Now generate your types ysing the [CLI](https://www.npmjs.com/package/@shopware/api-gen):

```bash
pnpm shopware-api-gen generate --apiType=store
```

Initialize the [api-client](https://www.npmjs.com/package/@shopware/api-client) instance:

```js
import { createAPIClient } from "@shopware/api-client";
import type { operations } from "#shopware";

export const apiClient = createAPIClient<operations>({
  baseURL: "https://your-api-instance.com",
  accessToken: "your-sales-channel-access-token",
});

// and then provide it in the Vue app
app.provide("apiClient", apiClient);
```

Now, we can create a Vue 3 plugin to install a Shopware context in an app:

```js
import { createShopwareContext } from "@shopware/composables";

// app variable in type of App
const shopwareContext = createShopwareContext(app, {
  devStorefrontUrl: "https://your-sales-channel-configured-domain.com",
});
// register a plugin in a Vue instance
app.use(shopwareContext);
```

Exclude `@shopware/composables` package from [pre-building](https://vite.dev/guide/dep-pre-bundling.html#customizing-the-behavior) process:

```ts
// vite.config.js or .ts
...
optimizeDeps: {
  exclude: ["@shopware/composables"],
},
...
```

---

> The example does not provide the session handling and that means you need to do few additional steps if you need to keep your session after the page reload (see the chapter below with 🍪)

## Basic usage

Now you can use any composable function in your setup function:

```html
<script setup>
    import { useUser, useSessionContext } from "@shopware/composables/dist";

    const { login } = useUser();
    const { refreshSessionContext, sessionContext } = useSessionContext();
    await refreshSessionContext();
</script>
<template>
    <pre>{{ sessionContext }}</pre>
    <button @click="login({
        username: "some-user",
        password: "secret-passwd"
    })">
        Try to login!
    </button>
</template>
```

## Session persistence with 🍪

By default, the API-Client is stateless, but accepts an optional context token as a parameter while initializing an instance. In order to keep a session, install some cookie parser to work with cookies easier:

```bash
# Using pnpm
pnpm add js-cookie

# Using yarn
yarn add js-cookie

# Using npm
npm i js-cookie
```

Let's get back to the step where the `api-client` was initialized:

<!-- automd:file src="examples/b2b-quote-management/src/apiClient.ts" code -->

```ts [apiClient.ts]
import { createAPIClient } from "@shopware/api-client";
import Cookies from "js-cookie";

import type { operations } from "#shopware";

const shopwareEndpoint = "https://demo-frontends.shopware.store/store-api";

export const apiClient = createAPIClient<operations>({
  baseURL: shopwareEndpoint,
  accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
  contextToken: Cookies.get("sw-context-token"),
});

apiClient.hook("onContextChanged", (newContextToken) => {
  Cookies.set("sw-context-token", newContextToken, {
    expires: 365, // days
    path: "/",
    sameSite: "lax",
    secure: shopwareEndpoint.startsWith("https://"),
  });
});
```

<!-- /automd -->

Thanks to this, the session will be kept to the corresponding `sw-context-token` saved in the cookie, so it can be reachable also in the SSR. Check the example to see it in action:

[![](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/shopware/frontends/tree/main/examples/blank-playground?file=src%2Fmain.ts)

## TypeScript support

All composable functions are fully typed with TypeScript and they are registed globally in Nuxt.js application, so the type hinting will help you to work with all of them.

## Links

- [📘 Documentation](https://developer.shopware.com/frontends)

- [👥 Community Discord](https://discord.com/channels/1308047705309708348/1405501315160739951) (`#composable-frontend`)

<!-- AUTO GENERATED CHANGELOG -->

## Changelog

Full changelog for stable version is available [here](https://github.com/shopware/frontends/blob/main/packages/composables/CHANGELOG.md)

### Latest changes: 1.15.0

### Minor Changes

- [#2850](https://github.com/shopware/frontends/pull/2850) [`5374dfd`](https://github.com/shopware/frontends/commit/5374dfd32614e264028b0a83d060919427307f3d) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Deprecate API that has no effect, to be removed in the next major release:

  - `createShopwareContext`: the `enableDevtools` option and the `state` property of the returned plugin
  - `useProductAssociations`: the `associationContext` option and the `method` and `searchParams` params of `loadAssociations`. Both `options` and the `loadAssociations` params are now optional, so call `loadAssociations()`
  - `useProductConfigurator().isLoadingOptions` and `useSyncWishlist().isLoading`, which are never updated
  - `getDefaultApiParams`, which already logged a deprecation error, now carries the `@deprecated` tag as well

  Also removes commented-out code and the unused, unexported `registerShopwareDevtools` and `useCmsElementProductBox`, which drops the undeclared `@vue/devtools-api` import. No runtime behaviour changes.

- [#2720](https://github.com/shopware/frontends/pull/2720) [`14fb094`](https://github.com/shopware/frontends/commit/14fb0946f8e7d12720b28cf9c6ccac05a4f72789) Thanks [@mkucmus](https://github.com/mkucmus)! - Added `useCacheableRead().invokeRead`. It uses the cacheable GET route only for a fresh default guest. That GET has no `sw-context-token`. Other sessions stay POST. Branching on `useShopwareContext().cacheableReads` is deprecated. Keep reads that `invokeRead` does not take on POST. New `createShopwareContext` option: `ssrWithoutUserContext`. A category read over GET now sends its listing params as plain query params, so `limit` is no longer dropped.

- [#2668](https://github.com/shopware/frontends/pull/2668) [`2202e1c`](https://github.com/shopware/frontends/commit/2202e1cec2b7d72260ed115940386c6793523676) Thanks [@mateuszfl](https://github.com/mateuszfl)! - Support SEO URLs of headless (API type) sales channels. Since shopware/shopware#17991 headless sales channels persist their SEO URLs against the `store-api.*` route family (`store-api.product.detail`, `store-api.category.detail`, `store-api.landing-page.detail`). `useNavigationSearch().resolvePath()` now maps those route names to their `frontend.*` equivalents, so page resolution works unchanged on a headless sales channel. The new `getFrontendRouteName` helper in `@shopware/helpers` exposes the same mapping for custom resolvers.

### Patch Changes

- [#2851](https://github.com/shopware/frontends/pull/2851) [`43a035f`](https://github.com/shopware/frontends/commit/43a035fa60a73f554ac4de9da7abd6fce9892288) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - `useListing().filtersToQuery`, `useCmsMeta` and the page counts of `useListing`, `useWishlist` and `useCustomerOrders` now use the new `getListingFiltersQuery`, `getCmsMeta` and `getTotalPages` helpers from `@shopware/helpers`. The only behaviour change: with a limit of `0` or less, the page count is now `0` instead of `Infinity` or `NaN`.

  Deprecated, to be removed in the next major release:

  - `useListing().filtersToQuery`: use `getListingFiltersQuery` from `@shopware/helpers`
  - `useCmsMeta`: use `getCmsMeta` from `@shopware/helpers`

- [#2791](https://github.com/shopware/frontends/pull/2791) [`4f0f33b`](https://github.com/shopware/frontends/commit/4f0f33b9fcb66c5a6bacf86400fa6d82f68e064f) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Point the README and JSDoc documentation links at the Frontends Recipes that replaced the redirected guides

- [#2843](https://github.com/shopware/frontends/pull/2843) [`eba2d99`](https://github.com/shopware/frontends/commit/eba2d996327d28c7f22025c848a3728d4d5fd3bf) Thanks [@grenzenlos-digital](https://github.com/grenzenlos-digital)! - Send `checkPromotion` as a query parameter when loading order details, so Shopware 6.7.7+ calculates `paymentChangeable`. When the order has no `paymentChangeable` entry, retry once with the flag in the request body, so Shopware 6.6 and 6.7.0-6.7.6 keep working.

- [#2849](https://github.com/shopware/frontends/pull/2849) [`037ffa9`](https://github.com/shopware/frontends/commit/037ffa97e3fdeec3a7dc896cb6a5b401e4b5f481) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - `useWishlist().mergeWishlistProducts()` now clears the local (localStorage) wishlist after merging it into the customer's wishlist. Before, it cleared the API wishlist instead: the local items stayed and were merged again on every login, and products the sync store still held from earlier in the session were removed from the customer's wishlist on the server.
- Updated dependencies [[`fa598c8`](https://github.com/shopware/frontends/commit/fa598c84e4d72ff4b7dc50547ea2412bc424b491), [`2202e1c`](https://github.com/shopware/frontends/commit/2202e1cec2b7d72260ed115940386c6793523676), [`43a035f`](https://github.com/shopware/frontends/commit/43a035fa60a73f554ac4de9da7abd6fce9892288), [`14fb094`](https://github.com/shopware/frontends/commit/14fb0946f8e7d12720b28cf9c6ccac05a4f72789)]:
  - @shopware/helpers@1.9.0
  - @shopware/api-client@1.8.0
