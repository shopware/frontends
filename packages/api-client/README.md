# shopware/frontends - api-client

[![](https://img.shields.io/npm/v/@shopware/api-client?color=blue&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCA0ODggNTUzIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNNDM5LjA0MSAxMjkuNTkzTDI1OC43NjkgMzEuMzA3NkMyNDQuOTE1IDIzLjc1NDEgMjI4LjExNiAyNC4wMDkzIDIxNC40OTcgMzEuOTgwMkw0Ny4yNjkgMTI5Ljg1OEMzMy40NzYzIDEzNy45MzEgMjUgMTUyLjcxMyAyNSAxNjguNjk1VjM4OC40NjZDMjUgNDA0LjczMiAzMy43Nzg1IDQxOS43MzIgNDcuOTYwMiA0MjcuNjk5TDIxNS4xNzggNTIxLjYzNkMyMjguNDUxIDUyOS4wOTIgMjQ0LjU5MyA1MjkuMzMyIDI1OC4wODIgNTIyLjI3NEw0MzguMzY0IDQyNy45MzRDNDUzLjIwMSA0MjAuMTcgNDYyLjUgNDA0LjgwOSA0NjIuNSAzODguMDYzVjE2OS4xMDJDNDYyLjUgMTUyLjYzMiA0NTMuNTAyIDEzNy40NzcgNDM5LjA0MSAxMjkuNTkzWiIgc3Ryb2tlPSJ1cmwoI3BhaW50MF9saW5lYXJfMTUzXzY5MjY1KSIgc3Ryb2tlLXdpZHRoPSI1MCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzE1M182OTI2NSIgeDE9Ii0xNi4yOTg5IiB5MT0iMTY1LjM0OSIgeDI9IjI3Ni40MTIiIHkyPSItODkuMzIzNCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDA4NUZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0MwRTJGNSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPg==)](https://npmjs.com/package/@shopware/api-client)
[![](https://img.shields.io/github/package-json/v/shopware/frontends?color=blue&filename=packages%2Fapi-client%2Fpackage.json&label=frontends/api-client&logo=github)](https://github.com/shopware/frontends/tree/main/packages/api-client)
[![](https://img.shields.io/github/issues/shopware/frontends/api-client?label=package%20issues&logo=github)](https://github.com/shopware/frontends/issues?q=is%3Aopen+is%3Aissue+label%3Aapi-client)
[![](https://img.shields.io/github/license/shopware/frontends?color=blue)](#)

Dynamic and fully typed API Client for Shopware 6. Usable in any JavaScript and TypeScript project.
You can use types generated from your custom API instance to have autocompletion and type safety.

To generate your own types use [@shopware/api-gen](https://www.npmjs.com/package/@shopware/api-gen) CLI.

To take a deep dive into the topic visit the [🧑‍🎓 API Client Tutorial](https://api-client-tutorial-composable-frontends.pages.dev) first.

## Setup

Install npm package:

<!-- automd:pm-install name="@shopware/api-client" -->

```sh
# ✨ Auto-detect
npx nypm install @shopware/api-client

# npm
npm install @shopware/api-client

# yarn
yarn add @shopware/api-client

# pnpm
pnpm install @shopware/api-client

# bun
bun install @shopware/api-client

# deno
deno install @shopware/api-client
```

<!-- /automd -->

## Store API client setup

Recommended practice is to create a separate module file. For example `src/apiClient.ts`, and import it whenever you need to use API Client.

```typescript
import { createAPIClient } from "@shopware/api-client";

// You can pick types of your current API version, the default one:
import type { operations } from "@shopware/api-client/store-api-types";
// or - RECOMMENDED - your types generated by [@shopware/api-gen](https://www.npmjs.com/package/@shopware/api-gen) CLI:
import type { operations } from "./api-types/storeApiTypes";

// you can pick cookies library of your choice
import Cookies from "js-cookie";

export const apiClient = createAPIClient<operations>({
  baseURL: "https://demo-frontends.shopware.store/store-api",
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

## Admin API client setup

```typescript
import { createAdminAPIClient } from "@shopware/api-client";
```

The setup works the same way as `creteAPIClient` function, with few differences

### credentials (optional) - Quick scripting or token-based authentication

We provide optional `credentials` parameter to `createAdminAPIClient`. Which allows you to use authentication type of your choice whenever you wish to create connection to any endpoint.

Example:

```typescript
import type {
  operations,
} from "@shopware/api-client/admin-api-types"; // we take default admin api types from different directory than store-api - use your own types by generating schema with @shopware/api-gen CLI
import type { operations } from "./api-types/adminApiTypes"; // or use your own types generated by @shopware/api-gen CLI

const adminApiClient = createAdminAPIClient<operations>({
  baseURL: `${process.env.SHOP_URL}/api`,
  credentials: {
    grant_type: "password",
    client_id: "administration",
    scopes: "write",
    username: process.env.SHOP_ADMIN_USERNAME,
    password: process.env.SHOP_ADMIN_PASSWORD,
  },
  // credentials: { // or token-based example
  //   grant_type: "client_credentials",
  //   client_id: "administration",
  //   client_secret: process.env.SHOP_ADMIN_TOKEN,
  // },
});

await adminApiClient.invoke(...); // invoke defined endpoint
```

### sessionData (optional) - Persistent authentication

This parameter is used to store session data in cookies (or other place you want to store it), so you can keep your session persistent.

You can combine this option with `credentials` property.

```typescript
// example adminApiClient.ts file
import { createAdminAPIClient } from "@shopware/api-client"; // we use different function to create admin api client

import { createAdminAPIClient } from "@shopware/api-client";
import type { operations, Schemas } from "@shopware/api-client/admin-api-types"; // we take default admin api types from different directory than store-api
import Cookies from "js-cookie";

export const adminApiClient = createAdminAPIClient<operations>({
  baseURL: "https://demo-frontends.shopware.store/api",
  sessionData: JSON.parse(Cookies.get("sw-admin-session-data") || "{}"),
});

adminApiClient.hooks("onAuthChange", (sessionData) => {
  Cookies.set("sw-admin-session-data", JSON.stringify(sessionData), {
    expires: 1, // days
    path: "/",
    sameSite: "lax",
    secure: shopwareEndpoint.startsWith("https://"),
  });
});
```

the rest works the same as store-api client.

## Basic usage

Take a look at [example project using API Client](https://stackblitz.com/github/shopware/frontends/tree/main/examples/new-api-client).

### Simple invocation

```typescript
import { apiClient, RequestReturnType } from "./apiClient";

// could be reactive value, you can use ApiReturnType to type it properly
let productsResponse: RequestReturnType<"readProduct">;

async function loadProducts() {
  productsResponse = await apiClient.invoke("readProduct post /product", {
    limit: 2,
  });
}
```

### Fetch features

The new API client is leveraging [ofetch](https://github.com/unjs/ofetch) library, which has built in support for AbortController, timeout and other features.

Example usage of AbortController to cancell your request:

```typescript
const controller = new AbortController();

const request = client.invoke("readContext get /context", {
  fetchOptions: {
    signal: controller.signal,
  },
});

controller.abort(); // At this point client will throw an error with the information, that the request has been cancelled
```

Other example of using `fetchOptions` for setting the timeout:

```typescript
const request = client.invoke("readContext get /context", {
  fetchOptions: {
    timeout: 5000, // 5 seconds
  },
});
```

All exposed options available under `fetchOptions` are:

- `cache`
- `duplex`
- `keepalive`
- `priority`
- `redirect`
- `retry`
- `retryDelay`
- `retryStatusCodes`
- `signal`
- `timeout`

### Predefining methods

If you prefer to add another layer of abstraction you can use created previously types to define your own concept of methods.

```typescript
// add for example into apiClient.ts file
const readNavigation = ({
  depth,
  type,
}: {
  depth: number;
  type: "main-navigation";
}) =>
  apiClient.invoke("readNavigation post /navigation/{activeId}/{rootId}", {
    headers: {
      "sw-include-seo-urls": true,
    },
    pathParams: {
      activeId: type,
      rootId: type,
    },
    body: {
      depth,
    },
  });

// in another file you can use it, and depth property will be set to 2 by default
import { readNavigation } from "./apiClient";

async function loadMainNavigation() {
  const navigation = await readNavigation({
    body: { activeId: "main-navigation", rootId: "main-navigation" },
  });
}
```

### Error handling

Client is throwing `ApiClientError` with detailed information returned from the API. It will display clear message in the console or you can access `details` property to get raw information from the response.

```typescript
import { ApiClientError } from "@shopware/api-client";

try {
  // ... your request
} catch (error) {
  if (error instanceof ApiClientError) {
    console.error(error); // This prints message summary
    console.error("Details:", error.details); // Raw response from API
  } else {
    console.error("==>", error); // Another type of error, not recognized by API client
  }
}
```

### Hooks

Api client provides hooks to listen to events like context change, authentication change or default headers change. Example:

```typescript
apiClient.hook("onDefaultHeaderChanged", (key, value) => {
  // here we can detect that the default header has changed, either by the user or by the headers incoming from the API
});
```

Available hooks:

- `onContextChanged`: Triggered when context token changes
- `onResponseError`: Triggered when API returns an error
- `onSuccessResponse`: Triggered when API request succeeds
- `onDefaultHeaderChanged`: Triggered when default headers are modified
- `onRequest`: Triggered before each request is made, allowing for request inspection and modification

calling `apiClient.hook` will autocomplete the list of available hooks.

### Base Configuration Management

The API client provides methods to manage its base configuration:

```typescript
// Get current configuration
const config = apiClient.getBaseConfig();
console.log(config.baseURL); // "https://demo-frontends.shopware.store/store-api"
console.log(config.accessToken); // "SWSCBHFSNTVMAWNZDNFKSHLAYW"

// Update configuration
apiClient.updateBaseConfig({
  baseURL: "https://new-url.com/store-api",
  accessToken: "NEW_TOKEN",
});
```

This allows you to dynamically change the API endpoint or access token during runtime, for example when switching between different environments or when the access token needs to be updated.

## Links

- [🧑‍🎓 Tutorial](https://api-client-tutorial-composable-frontends.pages.dev)

- [📘 Documentation](https://frontends.shopware.com)

- [👥 Community Slack](https://shopwarecommunity.slack.com) (`#composable-frontends` channel)

<!-- AUTO GENERATED CHANGELOG -->

## Changelog

Full changelog for stable version is available [here](https://github.com/shopware/frontends/blob/main/packages/api-client/CHANGELOG.md)

### Latest changes: 1.3.0

### Minor Changes

- [#1865](https://github.com/shopware/frontends/pull/1865) [`d016d6b`](https://github.com/shopware/frontends/commit/d016d6b845bff9a148405a74dae88d7fc81ec99c) Thanks [@patzick](https://github.com/patzick)! - Added new methods to manage API client base configuration:

  - `updateBaseConfig`: Allows updating baseURL and accessToken in a single call
  - `getBaseConfig`: Returns current baseURL and accessToken values

  This change replaces the previous `updateBaseUrl` method with a more flexible configuration management system that can be extended in the future.

### Patch Changes

- [#1801](https://github.com/shopware/frontends/pull/1801) [`a7ff606`](https://github.com/shopware/frontends/commit/a7ff60681d1a164d5c9f2020c506262e96fad5dc) Thanks [@joostaasman](https://github.com/joostaasman)! - fix: Undefined mergedHeaders["content-type"] when content-type is multipart/form-data

- [#1865](https://github.com/shopware/frontends/pull/1865) [`d016d6b`](https://github.com/shopware/frontends/commit/d016d6b845bff9a148405a74dae88d7fc81ec99c) Thanks [@patzick](https://github.com/patzick)! - Added `onRequest` hook to the API client that is triggered before each request is made. This hook provides access to the request context, allowing for request inspection and modification before it's sent.
