---
type: lesson
title: Configuration
focus: /example.ts
previews: false
openInStackBlitz: false
autoReload: false
terminal: false

---

# Create an instance of _API Client_


Following the [docs](https://www.npmjs.com/package/@shopware/api-client), we need to utilize the `createAPIClient` method exported by `@shopware/api-client` package:


## Import a factory method:

```ts
import { createAPIClient } from "@shopware/api-client";

```

## Import the default types

Great, now we should point the types where endpoints and entities are defined for autocompletion/type hinting purposes during the work with _Client_:

```ts
import type { operations } from "@shopware/api-client/store-api-types";
```


## Define credentials

Let's repeat a theory mentioned in _About_ chapter: The minimum requirements to create a working _API Client_ are:

- `baseURL`
- `accessToken`

Having it all allows us to create a basic _API Client_ instance that will be using a default set of operations and entities.

Click the button placed in top right of the editor to see the solution: <div class="inline-block"><div class="panel-button px-2 py-0.5 -mr-1 -my-1"><div class="i-ph-lightbulb-duotone text-lg"></div>Solve</div></div>


## Get the Client instance

```ts
const apiClient = createAPIClient<operations>({
  baseURL: shopwareEndpoint,
  accessToken: accessToken,
});
```