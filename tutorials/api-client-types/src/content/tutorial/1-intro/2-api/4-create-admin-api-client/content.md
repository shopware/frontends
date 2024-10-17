---
type: lesson
title: createAdminAPIClient
editor: false
terminal: false
previews: false
---

# `createAdminAPIClient`

This is how TypeScript signature of the method looks like:

```ts
export function createAdminAPIClient<
  OPERATIONS extends Record<string, any> = operations
>(params: {
  baseURL?: string;
  /**
   * If you pass `credentials` object, it will be used to authenticate the client whenever session expires.
   * You don't need to manually invoke `/token` endpoint first.
   */
  credentials?: OPERATIONS["token"]["body"];
  sessionData?: AdminSessionData;
  defaultHeaders?: ClientHeaders;
})
```

The method has its own generic type, named by `OPERATIONS` that extends `Record<string, any>` type.

## Few facts about `operations`

1. They come from OpenAPI Schema definition (will be a separate chapter to look into that process precisely).
2. The `operations` contain all **Schemas** (entities) and **Paths** (endpoints) that Shopware 6 Admin API (core+plugins+apps) exposes for the sake of headless approach.
3. Thanks to this, invoking a API request is always type-safe and has a type hinting enabled.
4. Can be generated **your** Shopware 6 instance using [@shopware/api-gen](https://www.npmjs.com/package/@shopware/api-gen) CLI tool.
5. By default `"@shopware/api-client"` package exports the default _operations_, so they can be imported like so:

  ```ts
  import type { operations } from "@shopware/api-client/admin-api-types";
  ```

## Parameters

The fields in the provided object as an argument can be described as:

| field      | description | example |
| ----------- | ----------- | --- |
| **baseURL**      | optional - Used to point an URL of `api` where the Shopware 6 instance is available over the network.       | `https://demo-frontends.shopware.store/api`  |
| **credentials**  |  optional - an object containing secrets enable to use a few options of authentication | `{ grant_type: "client_credentials", client_id: "someClientId", client_secret: "someVerySecretKey" } ` |
| **sessionData**  |    optional - handful in case of OAuth, when the authorization mechanism is taken care by some other tool | `{ accessToken: "some-token", refreshToken: "some-refresh-token", expirationTime: 1728412483 }`  |
| **defaultHeaders**   | optional - Standard dictionary object that keeps available HTTP Headers that will be used for further requests | `{"Content-Type":"application/json"}`  |


## Example of creating the Admin API _Client_ instance

```ts
import { createAdminAPIClient } from "@shopware/api-client";
import type { operations } from "@shopware/api-client/admin-api-types";

const client = createAdminAPIClient<operations>({
  baseURL: "https://demo-frontends.shopware.store/api",
  credentials: {
    grant_type: "client_credentials",
    client_id: useRuntimeConfig()?.api_client_id,
    client_secret: useRuntimeConfig()?.api_client_secret,
  },
});
```