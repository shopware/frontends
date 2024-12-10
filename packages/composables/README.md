# shopware/frontends - composables-next

[![](https://img.shields.io/npm/v/@shopware-pwa/composables-next?color=blue&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCA0ODggNTUzIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNNDM5LjA0MSAxMjkuNTkzTDI1OC43NjkgMzEuMzA3NkMyNDQuOTE1IDIzLjc1NDEgMjI4LjExNiAyNC4wMDkzIDIxNC40OTcgMzEuOTgwMkw0Ny4yNjkgMTI5Ljg1OEMzMy40NzYzIDEzNy45MzEgMjUgMTUyLjcxMyAyNSAxNjguNjk1VjM4OC40NjZDMjUgNDA0LjczMiAzMy43Nzg1IDQxOS43MzIgNDcuOTYwMiA0MjcuNjk5TDIxNS4xNzggNTIxLjYzNkMyMjguNDUxIDUyOS4wOTIgMjQ0LjU5MyA1MjkuMzMyIDI1OC4wODIgNTIyLjI3NEw0MzguMzY0IDQyNy45MzRDNDUzLjIwMSA0MjAuMTcgNDYyLjUgNDA0LjgwOSA0NjIuNSAzODguMDYzVjE2OS4xMDJDNDYyLjUgMTUyLjYzMiA0NTMuNTAyIDEzNy40NzcgNDM5LjA0MSAxMjkuNTkzWiIgc3Ryb2tlPSJ1cmwoI3BhaW50MF9saW5lYXJfMTUzXzY5MjY1KSIgc3Ryb2tlLXdpZHRoPSI1MCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzE1M182OTI2NSIgeDE9Ii0xNi4yOTg5IiB5MT0iMTY1LjM0OSIgeDI9IjI3Ni40MTIiIHkyPSItODkuMzIzNCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDA4NUZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0MwRTJGNSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPg==)](https://npmjs.com/package/@shopware-pwa/composables-next)
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
pnpm add @shopware-pwa/composables-next @shopware/api-client @shopware/api-gen

# Using yarn
yarn add @shopware-pwa/composables-next @shopware/api-client @shopware/api-gen

# Using npm
npm i @shopware-pwa/composables-next @shopware/api-client @shopware/api-gen
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
import { createShopwareContext } from "@shopware-pwa/composables-next";

// app variable in type of App
const shopwareContext = createShopwareContext(app, {
  devStorefrontUrl: "https://your-sales-channel-configured-domain.com",
});
// register a plugin in a Vue instance
app.use(shopwareContext);
```

Exclude `@shopware-pwa/composables-next` package from [pre-building](https://vite.dev/guide/dep-pre-bundling.html#customizing-the-behavior) process:

```ts
// vite.config.js or .ts
...
optimizeDeps: {
  exclude: ["@shopware-pwa/composables-next"],
},
...
```

---

> The example does not provide the session handling and that means you need to do few additional steps if you need to keep your session after the page reload (see the chapter below with 🍪)

## Basic usage

Now you can use any composable function in your setup function:

```html
<script setup>
    import { useUser, useSessionContext } from "@shopware-pwa/composables-next/dist";

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

- [👥 Community Slack](https://shopwarecommunity.slack.com) (`#composable-frontends` & `#shopware-pwa` channel)

<!-- AUTO GENERATED CHANGELOG -->

## Changelog

Full changelog for stable version is available [here](https://github.com/shopware/frontends/blob/main/packages/composables/CHANGELOG.md)

### Latest changes: 1.5.0

### Minor Changes

- [#1489](https://github.com/shopware/frontends/pull/1489) [`2c337b5`](https://github.com/shopware/frontends/commit/2c337b5555495e5cc75f17f1c7f50cc25dfe7c1e) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Changed `registration` method in the `useUser` composable. Because of changes in the double opt-in on registration flow in the Shopware backend we are adjusting this method on our side. In new approach we are checking `active` and `doubleOptInRegistration` properties that represents current status of the user.

- [#1369](https://github.com/shopware/frontends/pull/1369) [`13c83be`](https://github.com/shopware/frontends/commit/13c83bec53a6aaba49941b9bf869629eadeb4515) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Added `buildDynamicBreadcrumbs` method for building breadcrumbs structure
  Added `pushBreadcrumb` method to push single breadcrumb at the top of the breadcrumbs list
  Added `associations` option to the `search` method in `useProductSearch` composable

### Patch Changes

- [#1449](https://github.com/shopware/frontends/pull/1449) [`8ba9702`](https://github.com/shopware/frontends/commit/8ba9702657d1dc31cc653728788830fa38bb4992) Thanks [@mkucmus](https://github.com/mkucmus)! - Add configuration step to README.md

- [#1492](https://github.com/shopware/frontends/pull/1492) [`a03a492`](https://github.com/shopware/frontends/commit/a03a492f18ebff84606e47f5239330454c9f3039) Thanks [@mkucmus](https://github.com/mkucmus)! - `useCustomerOrders` - added checkPromotions flag for loading orders

- Updated dependencies [[`a87bbcf`](https://github.com/shopware/frontends/commit/a87bbcfa3f5aa440265b1e8f0fc72a204863befc), [`13c83be`](https://github.com/shopware/frontends/commit/13c83bec53a6aaba49941b9bf869629eadeb4515)]:
  - @shopware/api-client@1.2.0
  - @shopware-pwa/helpers-next@1.2.0
