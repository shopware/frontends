# shopware/frontends - composables-next

[![](https://img.shields.io/npm/v/@shopware-pwa/composables-next?color=blue&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCA0ODggNTUzIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNNDM5LjA0MSAxMjkuNTkzTDI1OC43NjkgMzEuMzA3NkMyNDQuOTE1IDIzLjc1NDEgMjI4LjExNiAyNC4wMDkzIDIxNC40OTcgMzEuOTgwMkw0Ny4yNjkgMTI5Ljg1OEMzMy40NzYzIDEzNy45MzEgMjUgMTUyLjcxMyAyNSAxNjguNjk1VjM4OC40NjZDMjUgNDA0LjczMiAzMy43Nzg1IDQxOS43MzIgNDcuOTYwMiA0MjcuNjk5TDIxNS4xNzggNTIxLjYzNkMyMjguNDUxIDUyOS4wOTIgMjQ0LjU5MyA1MjkuMzMyIDI1OC4wODIgNTIyLjI3NEw0MzguMzY0IDQyNy45MzRDNDUzLjIwMSA0MjAuMTcgNDYyLjUgNDA0LjgwOSA0NjIuNSAzODguMDYzVjE2OS4xMDJDNDYyLjUgMTUyLjYzMiA0NTMuNTAyIDEzNy40NzcgNDM5LjA0MSAxMjkuNTkzWiIgc3Ryb2tlPSJ1cmwoI3BhaW50MF9saW5lYXJfMTUzXzY5MjY1KSIgc3Ryb2tlLXdpZHRoPSI1MCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzE1M182OTI2NSIgeDE9Ii0xNi4yOTg5IiB5MT0iMTY1LjM0OSIgeDI9IjI3Ni40MTIiIHkyPSItODkuMzIzNCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDA4NUZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0MwRTJGNSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPg==)](https://npmjs.com/package/@shopware-pwa/composables-next)
[![](https://img.shields.io/github/package-json/v/shopware/frontends?color=blue&filename=packages%2Fcomposables%2Fpackage.json&label=composables-next%40monorepo&logo=github)](https://github.com/shopware/frontends/tree/main/packages/composables)
![](https://img.shields.io/github/license/shopware/frontends?color=blue)
[![](https://img.shields.io/github/issues/shopware/frontends/composables-next?label=composables-next%20issues&logo=github)](https://github.com/shopware/frontends/issues?q=is%3Aopen+is%3Aissue+label%3Acomposables-next)

Set of Vue.js composition functions that can be used in any Vue.js project. They provide state management, UI logic and data fetching and are the base for all guides in our [building section](https://frontends.shopware.com/getting-started/page-elements/navigation.html).

[👉 Composables Reference](https://frontends.shopware.com/packages/composables.html)

## Features

- `createShopwareContext` method to create a Vue 3 plugin to install
- State management
- Logic for UI
- Communication with Store-API via [api-client](https://www.npmjs.com/package/@shopware-pwa/api-client) package

## Setup

Install npm packages (composables & api-client):

```bash
# Using pnpm
pnpm add @shopware-pwa/composables-next @shopware-pwa/api-client

# Using yarn
yarn add @shopware-pwa/composables-next @shopware-pwa/api-client

# Using npm
npm i @shopware-pwa/composables-next @shopware-pwa/api-client
```

Initialize the [api-client](https://www.npmjs.com/package/@shopware-pwa/api-client) instance:

```js
import { createInstance } from "@shopware-pwa/api-client";
const apiInstance = createInstance({
  endpoint: "https://your-api-instance.com",
  accessToken: "your-sales-channel-access-token",
});
```

Now, we can create a Vue 3 plugin to install a Shopware context in an app:

```js
// app variable in type of App

const shopwareContext = createShopwareContext(app, {
  apiInstance, // apiInstance from previous step
  devStorefrontUrl: "https://your-sales-channel-configured-domain.com",
});
// register a plugin in a Vue instance
app.use(shopwareContext);
```

> The example does not provide the session handling and that means you need to do few additional steps if you need to keep your session after the page reload (see the chapter below with 🍪)

## Basic usage

Now you can use any composable function in your setup function:

```html
<script setup>
    import { useUser, useSessionContext } from "@shopware-pwa/composables-next";

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

```js
import { createInstance } from "@shopware-pwa/api-client";
import Cookies from "js-cookie";

const apiInstance = createInstance({
  endpoint: "https://your-api-instance.com",
  accessToken: "your-sales-channel-access-token",
  contextToken: Cookies.get("sw-context-token"), // get the context token if exists in the cookies
});

// callback to detect a `sw-context-token` in the response
apiInstance.onConfigChange(({ config }) => {
  // set the context-token in the cookie
  Cookies.set("sw-context-token", config.contextToken || "", {
    expires: 365, // days
    path: "/",
    sameSite: "lax",
  });
});
```

Thanks to this, the session will be kept to the corresponding `sw-context-token` saved in the cookie, so it can be reachable also in the SSR. Check the example to see it in action:

[![](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/shopware/frontends/tree/main/examples/blank-playground?file=src%2Fmain.ts)

## TypeScript support

All composable functions are fully typed with TypeScript and they are registed globally in Nuxt.js application, so the type hinting will help you to work with all of them.

## Links

- [📘 Documentation](https://frontends.shopware.com)

- [👥 Community](https://shopwarecommunity.slack.com) (`#shopware-frontends` & `#shopware-pwa` channel)

<!-- AUTO GENERATED CHANGELOG -->

## Changelog

Full changelog for stable version is available [here](https://github.com/shopware/frontends/blob/main/packages/composables/CHANGELOG.md)

### Latest changes: 0.9.0

### Minor Changes

- [#212](https://github.com/shopware/frontends/pull/212) [`e359aa2`](https://github.com/shopware/frontends/commit/e359aa28c9c9c7fb2521be3ebd5b847c855e4d24) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Sort shipping methods on the getShippingMethods function

- [#280](https://github.com/shopware/frontends/pull/280) [`55db3a6`](https://github.com/shopware/frontends/commit/55db3a695ee6638f33f836890dad65742ddccf94) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add errorMessageBuilder to the useAddress composable

- [#230](https://github.com/shopware/frontends/pull/230) [`d1e07d6`](https://github.com/shopware/frontends/commit/d1e07d6f73135cb742807aba78f1271943d47beb) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - useInternationalization add methods related to the language switcher

### Patch Changes

- [#271](https://github.com/shopware/frontends/pull/271) [`b9881b8`](https://github.com/shopware/frontends/commit/b9881b89da2605a5ccd78617d3f8ae8e05e8c43a) Thanks [@mkucmus](https://github.com/mkucmus)! - Clear addresses out of the store on failed address fetch

- [#252](https://github.com/shopware/frontends/pull/252) [`3ffd000`](https://github.com/shopware/frontends/commit/3ffd000195be60da9fbb3b41cd39fb9f4ab6167e) Thanks [@mkucmus](https://github.com/mkucmus)! - Correct function signature

- [#235](https://github.com/shopware/frontends/pull/235) [`b294182`](https://github.com/shopware/frontends/commit/b294182dbc9cda82a6d2b3c13663799a9f874c66) Thanks [@mkucmus](https://github.com/mkucmus)! - Readme enhancements

- [#255](https://github.com/shopware/frontends/pull/255) [`8a561b9`](https://github.com/shopware/frontends/commit/8a561b9aa12b50a816203c387417c2108761dcf9) Thanks [@mkucmus](https://github.com/mkucmus)! - Remove redundant api call for listing search

- [#243](https://github.com/shopware/frontends/pull/243) [`d5f0bcc`](https://github.com/shopware/frontends/commit/d5f0bcc18cb581a48185cb8622d0e0d9b7fea23f) Thanks [@patzick](https://github.com/patzick)! - bump dependencies

- Updated dependencies [[`d1e07d6`](https://github.com/shopware/frontends/commit/d1e07d6f73135cb742807aba78f1271943d47beb), [`d1e07d6`](https://github.com/shopware/frontends/commit/d1e07d6f73135cb742807aba78f1271943d47beb), [`d5f0bcc`](https://github.com/shopware/frontends/commit/d5f0bcc18cb581a48185cb8622d0e0d9b7fea23f)]:
  - @shopware-pwa/api-client@0.5.0
  - @shopware-pwa/helpers-next@0.3.0
