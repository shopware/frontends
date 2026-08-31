# shopware/frontends - composables

[![](https://img.shields.io/npm/v/@shopware/composables?color=blue&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCA0ODggNTUzIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNNDM5LjA0MSAxMjkuNTkzTDI1OC43NjkgMzEuMzA3NkMyNDQuOTE1IDIzLjc1NDEgMjI4LjExNiAyNC4wMDkzIDIxNC40OTcgMzEuOTgwMkw0Ny4yNjkgMTI5Ljg1OEMzMy40NzYzIDEzNy45MzEgMjUgMTUyLjcxMyAyNSAxNjguNjk1VjM4OC40NjZDMjUgNDA0LjczMiAzMy43Nzg1IDQxOS43MzIgNDcuOTYwMiA0MjcuNjk5TDIxNS4xNzggNTIxLjYzNkMyMjguNDUxIDUyOS4wOTIgMjQ0LjU5MyA1MjkuMzMyIDI1OC4wODIgNTIyLjI3NEw0MzguMzY0IDQyNy45MzRDNDUzLjIwMSA0MjAuMTcgNDYyLjUgNDA0LjgwOSA0NjIuNSAzODguMDYzVjE2OS4xMDJDNDYyLjUgMTUyLjYzMiA0NTMuNTAyIDEzNy40NzcgNDM5LjA0MSAxMjkuNTkzWiIgc3Ryb2tlPSJ1cmwoI3BhaW50MF9saW5lYXJfMTUzXzY5MjY1KSIgc3Ryb2tlLXdpZHRoPSI1MCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzE1M182OTI2NSIgeDE9Ii0xNi4yOTg5IiB5MT0iMTY1LjM0OSIgeDI9IjI3Ni40MTIiIHkyPSItODkuMzIzNCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDA4NUZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0MwRTJGNSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPg==)](https://npmjs.com/package/@shopware/composables)
[![](https://img.shields.io/github/package-json/v/shopware/frontends?color=blue&filename=packages%2Fcomposables%2Fpackage.json&label=frontends/composables&logo=github)](https://github.com/shopware/frontends/tree/main/packages/composables)
[![](https://img.shields.io/github/issues/shopware/frontends/composables?label=package%20issues&logo=github)](https://github.com/shopware/frontends/issues?q=is%3Aopen+is%3Aissue+label%3Acomposables)
[![](https://img.shields.io/github/license/shopware/frontends?color=blue)](#)

Set of Vue.js composition functions that can be used in any Vue.js project. They provide state management, UI logic and data fetching and are the base for all guides in our [building section](https://developer.shopware.com/frontends/guides/page-elements/navigation.html).

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

### Latest changes: 1.13.0

### Minor Changes

- [#2663](https://github.com/shopware/frontends/pull/2663) [`7020545`](https://github.com/shopware/frontends/commit/70205458cb9357a068029d0aaef41898ab94b354) Thanks [@mkucmus](https://github.com/mkucmus)! - `useCmsElementImage` now honours the `ariaLabel` and `isDecorative` fields of a CMS image element, which were ignored before, and returns both. `imageAttrs.alt` is empty for a decorative image. `ariaLabel` names the link the image sits in, as it does in the Storefront, so it is not copied into `alt`.

  Both fields are optional on the image element config, because a Shopware instance that has never had them set does not return them. `useCmsElementConfig` accepts optional config members now, so `getConfigValue` keeps the declared value type for them instead of widening to `{}`.

  `SliderElementConfig` gained the `"none"` value for `navigationDots` and `navigationArrows`. The Administration offers it, the type did not list it.

- [#2642](https://github.com/shopware/frontends/pull/2642) [`183c183`](https://github.com/shopware/frontends/commit/183c183f905486c27fa770fd0f4cd9993e86c20e) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add `createDraftQuoteVersion` and `deleteDraftQuoteVersion` to `useB2bQuoteManagement`.

  Quote write operations such as `declineQuoteWithComment` expect the identifier of a temporary storefront draft version, not the `versionId` property of the quote entity. `createDraftQuoteVersion` wraps `POST /quote/{id}/draft-version` and returns that identifier, throwing when the API responds without one; `deleteDraftQuoteVersion` discards the draft again.

  ```ts
  const { createDraftQuoteVersion, declineQuoteWithComment } =
    useB2bQuoteManagement();

  const versionId = await createDraftQuoteVersion(quoteId);

  await declineQuoteWithComment(quoteId, {
    comment: "Too expensive",
    lineItemId,
    versionId,
  });
  ```

- [#2642](https://github.com/shopware/frontends/pull/2642) [`183c183`](https://github.com/shopware/frontends/commit/183c183f905486c27fa770fd0f4cd9993e86c20e) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add `declineQuoteWithComment` to `useB2bQuoteManagement`, following the Store API `POST /quote/{id}/decline` schema, which as of `6.7.12` also carries `lineItemId` and `versionId` next to `comment`.

  `declineQuote` keeps its `(quoteId, comment)` signature and is deprecated. It will be removed in the next major.

  ```ts
  const { declineQuoteWithComment, createDraftQuoteVersion } =
    useB2bQuoteManagement();

  const versionId = await createDraftQuoteVersion(quoteId);

  await declineQuoteWithComment(quoteId, {
    comment: "Too expensive",
    lineItemId,
    versionId,
  });
  ```

### Patch Changes

- [#2676](https://github.com/shopware/frontends/pull/2676) [`458494e`](https://github.com/shopware/frontends/commit/458494e8bd2be88d4fbf161636a109c8f4efc443) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Realign the composables with the `6.7.13.0` Store API schema:

  - `useB2bQuoteManagement`: `getQuote()` now invokes `readQuote post /quote/{id}` (was `readQuote post /quote/detail/{id}`) and `createOrderFromQuote()` now invokes `createOrderFromQuote post /quote/{id}/order` (was `createOrderFromQuote post /quote/order/{id}`), matching the renamed endpoints.
  - `useListing`: `getSortingOrders` is typed as `Schemas["ProductListingResult"]["availableSortings"]` instead of the removed `Schemas["ProductSorting"][]`.
  - `useProductSearch`: the `associations` option is typed as `Partial<Schemas["Associations"]>` instead of the removed `Schemas["Association"]`.

- [#2660](https://github.com/shopware/frontends/pull/2660) [`8913956`](https://github.com/shopware/frontends/commit/89139563924163e57cafdd9770fe603f2dbd8cba) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - `useCmsElementImage` now returns the translated media `alt` in `imageAttrs`. It read `element.data.media.alt` from the entity root, which the Store API fills with the system language value, so the `alt` attribute ignored the language of the current request. The value is now resolved with `getTranslatedProperty()` and falls back to the root property when `translated` is missing.

- Updated dependencies [[`2ddf156`](https://github.com/shopware/frontends/commit/2ddf156805b2941fe2069e78453fb3c4eb6d44ac), [`204c8f4`](https://github.com/shopware/frontends/commit/204c8f45f737e724db6d00b80c5faef8ddb77cb4), [`183c183`](https://github.com/shopware/frontends/commit/183c183f905486c27fa770fd0f4cd9993e86c20e), [`458494e`](https://github.com/shopware/frontends/commit/458494e8bd2be88d4fbf161636a109c8f4efc443)]:
  - @shopware/helpers@1.8.0
  - @shopware/api-client@1.6.0
