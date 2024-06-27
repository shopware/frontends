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
// app variable in type of App

const shopwareContext = createShopwareContext(app, {
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

<!-- automd:file src="../../examples/b2b-quote-management/src/apiClient.ts" code -->

```ts [apiClient.ts]
import { createAPIClient } from "@shopware/api-client";
import type { operations } from "#shopware";
import Cookies from "js-cookie";

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

- [👥 Community Slack](https://shopwarecommunity.slack.com) (`#shopware-frontends` & `#shopware-pwa` channel)

<!-- AUTO GENERATED CHANGELOG -->

## Changelog

Full changelog for stable version is available [here](https://github.com/shopware/frontends/blob/main/packages/composables/CHANGELOG.md)

### Latest changes: 1.0.0

### Major Changes

- [#871](https://github.com/shopware/frontends/pull/871) [`1566f7a`](https://github.com/shopware/frontends/commit/1566f7a3962c511b5c72e12a4a5db40c4aa5d198) Thanks [@patzick](https://github.com/patzick)! - Read more about new major release: https://github.com/shopware/frontends/discussions/965

- [#1056](https://github.com/shopware/frontends/pull/1056) [`c729e70`](https://github.com/shopware/frontends/commit/c729e7014c70d7f71edf5297104065d18e482e04) Thanks [@patzick](https://github.com/patzick)! - Removed deprecations from the composables:

  - `createShopwareContext` is no longer accpting `apiInstance` option. Use `apiClient` instead.
  - `useCart` - `getProductItemsSeoUrlsData` is removed. Use product related methods to fetch an item's URL instead.
  - `useCartItem` - `getProductItemSeoUrlData` is removed
  - `apiInstance` is not exposing `apiInstance` anymore. Use `apiClient` instead.

- [#452](https://github.com/shopware/frontends/pull/452) [`e2c225f`](https://github.com/shopware/frontends/commit/e2c225f1d69a5d523f3c1e6c90449ee28f98b2f2) Thanks [@patzick](https://github.com/patzick)! - Created Nuxt layer for `composables` and `cms-base`. This way overriding any part of that is now possible.

- [#978](https://github.com/shopware/frontends/pull/978) [`479357c`](https://github.com/shopware/frontends/commit/479357c74d40c99218eb22ccd4089357ffab5872) Thanks [@patzick](https://github.com/patzick)! - `useCustomerPassword` and `loadCustomerAddresses` inside `useAddress` are now throwing api errors on invocation. The `errors` object has been removed from the composable to make consistent error handling across the composables. This change is breaking and requires you to update your implementation of the composables.

  Example of error handling for resseting password:

  ```typescript
  const {
    resetPassword,
    // errors --> removed from the API
  } = useCustomerPassword();

  const errors = ref([]);

  const invokeRecover = async (): Promise<void> => {
    try {
      errors.value = [];
      const emailSent = await resetPassword(formData.value);

      if (emailSent.success) {
        // here we know that email was sent
      }
    } catch (error) {
      console.error("[AccountRecoverPassword]", error);
      if (error instanceof ApiClientError) {
        errors.value = error.details?.errors || [];
      }
    }
  };
  ```

### Minor Changes

- [#991](https://github.com/shopware/frontends/pull/991) [`38a3853`](https://github.com/shopware/frontends/commit/38a385374a99d114c4ed3477f14c9e06dedb0dcd) Thanks [@patzick](https://github.com/patzick)! - Few changes in composables API to access data returned from the backend:

  - `useAddress` - `loadCustomerAddresses` returns addresses now
  - `useCart` - `removeItem` returns updated cart
  - `useCartItem` - `removeItem` returns updated cart, similar to `useCart`
  - `fetchCountries` - returns countries with the response
  - `useNewsletter` - `getNewsletterStatus` returns full response from the API
  - `useOrderDetails` - `loadOrderDetails` returns order details now, `cancel` returns order state, `changePaymentMethod` returns success response info
  - `changePaymentMethod` - `changePaymentMethod` returns success response info now
  - `useProductReviews` - `loadProductReviews` returns reviews response now
  - `useSalutations` - `fetchSalutations` returns salutations response now
  - `useUser` - `refreshUser` returns customer data. `logout`, `loadCountry` and `loadSalutation` returns data from the API

- [#840](https://github.com/shopware/frontends/pull/840) [`823aa9b`](https://github.com/shopware/frontends/commit/823aa9b4626c8931d2bea1399e825162c44fd45c) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Return `componentNameToResolve` in resolveCmsComponent function

- [#529](https://github.com/shopware/frontends/pull/529) [`4dce006`](https://github.com/shopware/frontends/commit/4dce006460611e59fed084511ca9ecb814f95cf1) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - **BREAKING**: Use product ID instead of whole product object in `useProductWishlist` composable

- [#535](https://github.com/shopware/frontends/pull/535) [`bebae42`](https://github.com/shopware/frontends/commit/bebae42e58e3dd47f13bf166b0fb0d8ac9a416e3) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Fix country ID in session context
  Add `salesChannelCountryId` that represent sales channel default city ID

- [#986](https://github.com/shopware/frontends/pull/986) [`013a1d6`](https://github.com/shopware/frontends/commit/013a1d6f88377686cfc1a85903a0c48d8fda67f5) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Added tests to achieve coverage > 80%

- [#933](https://github.com/shopware/frontends/pull/933) [`04ac2ad`](https://github.com/shopware/frontends/commit/04ac2ada522c881bb06565c332baf5f2cf08643d) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - - Added `checkPromotion` attribute to the `orderAssociations`

  - Added `statusTechnicalName` property to the `useOrderDetails` composable
  - Added `getPaymentMethods` method that allows change payment for existed order
  - Added `stateMachineState` association for loading orders

- [#1027](https://github.com/shopware/frontends/pull/1027) [`05ca5b6`](https://github.com/shopware/frontends/commit/05ca5b68f098bc8969c2c50e270b19b00938513c) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Added `useCategorySearch` and `useCmsElementProductBox` tests

- [#703](https://github.com/shopware/frontends/pull/703) [`7a3a92c`](https://github.com/shopware/frontends/commit/7a3a92c3ee1a337e752adbcfa5057d30064eed7c) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add B2b quote management composable

### Patch Changes

- [#569](https://github.com/shopware/frontends/pull/569) [`f1b2a30`](https://github.com/shopware/frontends/commit/f1b2a307de58e0f296edab3222b7cd5684104347) Thanks [@itscark](https://github.com/itscark)! - Fix only available shipping methods

- [#880](https://github.com/shopware/frontends/pull/880) [`2ade07a`](https://github.com/shopware/frontends/commit/2ade07ad51944eebb7d1962c36823875cd5e959e) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Adjust types in `useProductSearch` composable

- [#915](https://github.com/shopware/frontends/pull/915) [`fc262dd`](https://github.com/shopware/frontends/commit/fc262dd3a93338353394c03faf7fee36a0c36511) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Handle using categoryId as a alternative for category context

- [#1042](https://github.com/shopware/frontends/pull/1042) [`53e7177`](https://github.com/shopware/frontends/commit/53e71770ad741bb558f193a95cae6bcc025a047f) Thanks [@patzick](https://github.com/patzick)! - Completely removed dependency to the deprecated `@shopware-pwa/types` package

- [#873](https://github.com/shopware/frontends/pull/873) [`99ad5e9`](https://github.com/shopware/frontends/commit/99ad5e99652771ea7cd5e1395708a878cca980f5) Thanks [@mkucmus](https://github.com/mkucmus)! - Add isStackable and isDigital computed properties

- [#705](https://github.com/shopware/frontends/pull/705) [`8f0b468`](https://github.com/shopware/frontends/commit/8f0b46850a0b89667934c551431306f7d765f86b) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add missing addressId to the `updateCustomerAddress` method

- [#524](https://github.com/shopware/frontends/pull/524) [`6b54268`](https://github.com/shopware/frontends/commit/6b54268049ae9b1b3d311b9a122f43a752a2b715) Thanks [@BrocksiNet](https://github.com/BrocksiNet)! - Added new composables (previously internal helpers of the `cms-base` package): `useCmsTranslations`, `useUrlResolver`, `useUrlResolver`

- Updated dependencies [[`2343012`](https://github.com/shopware/frontends/commit/2343012ad552b06557e6715055b3abc534fa2fae), [`1566f7a`](https://github.com/shopware/frontends/commit/1566f7a3962c511b5c72e12a4a5db40c4aa5d198), [`782ef4d`](https://github.com/shopware/frontends/commit/782ef4d417dce6e6d60992bd54f876aa4bc5f45d), [`9643e56`](https://github.com/shopware/frontends/commit/9643e56dafba9282b75c12c96b2afb3a4738f86e), [`1583a7a`](https://github.com/shopware/frontends/commit/1583a7ae0d68b72fb362b625e1634e03bad68110), [`97d2859`](https://github.com/shopware/frontends/commit/97d2859e4dcbdc563200f2f64d1a20880b675d87), [`864616f`](https://github.com/shopware/frontends/commit/864616f0c9e1cbe11e434b9a04a35ff9520bcb3c), [`d60d062`](https://github.com/shopware/frontends/commit/d60d0620c7114a2f26bb2faf24241e2cbabc8798), [`a92941e`](https://github.com/shopware/frontends/commit/a92941ed59313fe85d5bbe204c2930d8a1a106b1), [`487d991`](https://github.com/shopware/frontends/commit/487d991f2cda0fbf637502597b20dd931498fe6a), [`c729e70`](https://github.com/shopware/frontends/commit/c729e7014c70d7f71edf5297104065d18e482e04), [`89a97a4`](https://github.com/shopware/frontends/commit/89a97a45ae4a58616e41f63e9884a2a67f0a6ce8), [`c729e70`](https://github.com/shopware/frontends/commit/c729e7014c70d7f71edf5297104065d18e482e04), [`864616f`](https://github.com/shopware/frontends/commit/864616f0c9e1cbe11e434b9a04a35ff9520bcb3c), [`97b5949`](https://github.com/shopware/frontends/commit/97b5949da2663700aa4047c4927b4a5f192cee74), [`6664aa2`](https://github.com/shopware/frontends/commit/6664aa2aa48ec63fc053ad024a03940113e17956), [`6b54268`](https://github.com/shopware/frontends/commit/6b54268049ae9b1b3d311b9a122f43a752a2b715)]:
  - @shopware/api-client@1.0.0
  - @shopware-pwa/helpers-next@1.0.0
