# shopware/frontends - composables

[![](https://img.shields.io/npm/v/@shopware/composables?color=blue&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCA0ODggNTUzIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNNDM5LjA0MSAxMjkuNTkzTDI1OC43NjkgMzEuMzA3NkMyNDQuOTE1IDIzLjc1NDEgMjI4LjExNiAyNC4wMDkzIDIxNC40OTcgMzEuOTgwMkw0Ny4yNjkgMTI5Ljg1OEMzMy40NzYzIDEzNy45MzEgMjUgMTUyLjcxMyAyNSAxNjguNjk1VjM4OC40NjZDMjUgNDA0LjczMiAzMy43Nzg1IDQxOS43MzIgNDcuOTYwMiA0MjcuNjk5TDIxNS4xNzggNTIxLjYzNkMyMjguNDUxIDUyOS4wOTIgMjQ0LjU5MyA1MjkuMzMyIDI1OC4wODIgNTIyLjI3NEw0MzguMzY0IDQyNy45MzRDNDUzLjIwMSA0MjAuMTcgNDYyLjUgNDA0LjgwOSA0NjIuNSAzODguMDYzVjE2OS4xMDJDNDYyLjUgMTUyLjYzMiA0NTMuNTAyIDEzNy40NzcgNDM5LjA0MSAxMjkuNTkzWiIgc3Ryb2tlPSJ1cmwoI3BhaW50MF9saW5lYXJfMTUzXzY5MjY1KSIgc3Ryb2tlLXdpZHRoPSI1MCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzE1M182OTI2NSIgeDE9Ii0xNi4yOTg5IiB5MT0iMTY1LjM0OSIgeDI9IjI3Ni40MTIiIHkyPSItODkuMzIzNCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDA4NUZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0MwRTJGNSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPg==)](https://npmjs.com/package/@shopware/composables)
[![](https://img.shields.io/github/package-json/v/shopware/frontends?color=blue&filename=packages%2Fcomposables%2Fpackage.json&label=frontends/composables&logo=github)](https://github.com/shopware/frontends/tree/main/packages/composables)
[![](https://img.shields.io/github/issues/shopware/frontends/composables?label=package%20issues&logo=github)](https://github.com/shopware/frontends/issues?q=is%3Aopen+is%3Aissue+label%3Acomposables)
[![](https://img.shields.io/github/license/shopware/frontends?color=blue)](#)

Set of Vue.js composition functions that can be used in any Vue.js project. They provide state management, UI logic and data fetching and are the base for all guides in our [building section](https://frontends.shopware.com/getting-started/page-elements/navigation.html).

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
    refreshSessionContext();
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

- [📘 Documentation](https://frontends.shopware.com)

- [👥 Community Discord](https://discord.com/channels/1308047705309708348/1405501315160739951) (`#composable-frontend`)

<!-- AUTO GENERATED CHANGELOG -->

## Changelog

Full changelog for stable version is available [here](https://github.com/shopware/frontends/blob/main/packages/composables/CHANGELOG.md)

### Latest changes: 1.10.0

### Minor Changes

- [#2098](https://github.com/shopware/frontends/pull/2098) [`a44d871`](https://github.com/shopware/frontends/commit/a44d8712d9ae5ee196c03ac8b894f3d1392d0e68) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Enhanced the `useSyncWishlist` composable by exposing the `limit`, `products`, and `isLoading` properties, allowing better control and monitoring of the wishlist state. Similarly, updated `useWishlist` to also expose `limit`, `products`, and `isLoading` properties for both local and synced wishlists, providing a consistent API and improved state handling for wishlist management.

- [#1997](https://github.com/shopware/frontends/pull/1997) [`e43d9b7`](https://github.com/shopware/frontends/commit/e43d9b7f559af21be8b66f2021cea2d14940e4aa) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Added consts `SUBSRIBE_KEY` and `UNSUBSCRIBE_KEY` for newsletter status in useNewsletter composable

- [#1974](https://github.com/shopware/frontends/pull/1974) [`7fe2ef9`](https://github.com/shopware/frontends/commit/7fe2ef96a9d9d156683b85d31f0a660458c9fbfd) Thanks [@mkucmus](https://github.com/mkucmus)! - Use proper associations format within `useDefaultOrderAssociations` (no redundant nesting).

  Returned value is in type of `Schemas["Criteria"]['associations']` now:

  ```ts
  const { loadOrders } = useCustomerOrders();

  loadOrders({
    // ... other parameters
    associations: useDefaultOrderAssociations(),
  });
  ```

- [#2176](https://github.com/shopware/frontends/pull/2176) [`c647baf`](https://github.com/shopware/frontends/commit/c647baf93e7174b849f5961ee5803add99d78602) Thanks [@mkucmus](https://github.com/mkucmus)! - - Add `initialListing` parameter to `useListing` composable for SSR data hydration
  - Update `createCategoryListingContext` to accept initial listing data
  - Maintain backward compatibility with existing implementations

- [#1959](https://github.com/shopware/frontends/pull/1959) [`c77daa6`](https://github.com/shopware/frontends/commit/c77daa6a11e96c7f3688b16f7da010b54c7f5e8b) Thanks [@patzick](https://github.com/patzick)! - Updated default types to Shopware 6.7

### Patch Changes

- [`87771c3`](https://github.com/shopware/frontends/commit/87771c3b7a4521fcdba43cb4c967b61f5db01b3e) Thanks [@mkucmus](https://github.com/mkucmus)! - add nested media entity association explicitly

- [#1985](https://github.com/shopware/frontends/pull/1985) [`2cbda25`](https://github.com/shopware/frontends/commit/2cbda257a1056454e12f2fba9052f83eecb6d986) Thanks [@mkucmus](https://github.com/mkucmus)! - Change `isInWishlist` property type to `ComputedRef` within `useProductWishlist` composable.

- Updated dependencies [[`22ff62e`](https://github.com/shopware/frontends/commit/22ff62e354f024599d64ea8096af57695248851c), [`2cbda25`](https://github.com/shopware/frontends/commit/2cbda257a1056454e12f2fba9052f83eecb6d986), [`70dcf95`](https://github.com/shopware/frontends/commit/70dcf95d4370c63964d877a5cab113a53f93ca19), [`56cd178`](https://github.com/shopware/frontends/commit/56cd178e25fe2399b7170ccac3044e980621f041), [`e1fae3e`](https://github.com/shopware/frontends/commit/e1fae3eb6430e5c8e133456fbaf7f215f80c36f6), [`c647baf`](https://github.com/shopware/frontends/commit/c647baf93e7174b849f5961ee5803add99d78602), [`c77daa6`](https://github.com/shopware/frontends/commit/c77daa6a11e96c7f3688b16f7da010b54c7f5e8b)]:
  - @shopware/helpers@1.6.0
  - @shopware/api-client@1.4.0
