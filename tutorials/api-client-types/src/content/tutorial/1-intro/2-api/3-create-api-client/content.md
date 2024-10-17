---
type: lesson
title: createAPIClient
editor: false
terminal: false
previews: false
---

# `createAPIClient`

This is how TypeScript signature of the method looks like:

```ts
export function createAPIClient<
  OPERATIONS extends Record<string, any> = operations
>(params: {
  baseURL?: string;
  accessToken?: string;
  contextToken?: string;
  defaultHeaders?: ClientHeaders;
})
```

The method has its own generic type, named by `OPERATIONS` that extends `Record<string, any>` type.

## Few facts about `operations`

1. They come from OpenAPI Schema definition (will be a separate chapter to look into that process precisely).
2. The `operations` contain all **Schemas** (entities) and **Paths** (endpoints) that Shopware 6 Store API (core+plugins+apps) exposes for the sake of headless approach.
3. Thanks to this, invoking a API request is always type-safe and has a type hinting enabled.
4. Can be generated for **your** Shopware 6 instance using [@shopware/api-gen](https://www.npmjs.com/package/@shopware/api-gen) CLI tool.
5. By default `"@shopware/api-client"` package exports the default _operations_, so they can be imported like so:

  ```ts
  import type { operations } from "@shopware/api-client/store-api-types";
  ```

## Parameters

The fields in the provided object as an argument can be described as:

| field      | description | example |
| ----------- | ----------- | --- |
| **baseURL**      | optional - Used to point an URL of `store-api` where the Shopware 6 instance is available over the network.       | `https://demo-frontends.shopware.store/store-api`  |
| **accessToken**  |  optional - The unique key ID that refers to the specific sales channel (for more info visit a [Store API docs](https://shopware.stoplight.io/docs/store-api/)) | `SWSCBHFSNTVMAWNZDNFKSHLAYW`  |
| **contextToken**  |    optional - The unique key in UUID format that points the corresponding session in the backend |   |
| **defaultHeaders**   | optional - Standard dictionary object that keeps possible HTTP Headers that will be used for further requests | `{"Content-Type":"application/json"}`  |


## Example of creating the API _Client_ instance

```ts
import { createAPIClient } from "@shopware/api-client";
import type { operations } from "@shopware/api-client/store-api-types";
import Cookies from "js-cookie";

export const apiClient = createAPIClient<operations>({
  baseURL: "https://demo-frontends.shopware.store/store-api",
  accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
  contextToken: Cookies.get("sw-context-token"),
});
```