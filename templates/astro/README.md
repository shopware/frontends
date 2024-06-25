# Astro blank template

![Shopware Frontends](./public/shopware-frontends-logo.png)

This repository shows an example of application built using Shopware Frontends Framework with [Astro](astro.build).

## What's inside

- Astro application [following official Guides > integrations > @astrojs/vue](https://docs.astro.build/en/guides/integrations-guide/vue/])
- Required libraries installed (api-client and composables)

## Requirements

Go to [Documentation > Requirements](https://frontends.shopware.com/framework/requirements.html) to see the details.

## Set up your Shopware 6 instance

In order to have a different API connected to the app, change two lines of code in [./src/entrypoints/\_shopware.ts](./src/entrypoints/_shopware.ts):

<!-- automd:file src="./src/entrypoints/_shopware.ts" code -->

```ts [_shopware.ts]
import type { App } from "vue";
import { createShopwareContext } from "@shopware-pwa/composables-next/dist";
import Cookies from "js-cookie";

import { createAPIClient } from "@shopware/api-client";
import type { operations } from "@shopware/api-client/store-api-types";

export default (app: App) => {
  const shopwareEndpoint =
    import.meta.env.API_URL ||
    "https://demo-frontends.shopware.store/store-api";

  const apiClient = createAPIClient<operations>({
    baseURL: shopwareEndpoint,
    accessToken:
      import.meta.env.API_ACCESS_TOKEN || "SWSCBHFSNTVMAWNZDNFKSHLAYW",
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

  // create a Shopware context plugin and inject it to the Vue app
  const shopwareContext = createShopwareContext(app, {
    devStorefrontUrl: null,
  });
  // register a plugin
  app.provide("apiClient", apiClient);
  app.use(shopwareContext);
};
```

<!-- /automd -->

## Customize

Now, you are free to use the `@shopware-pwa/composables-next` package in the application. You can start from [Session.vue](./src/components/Session.vue).

## Install & Run

1. `pnpm i` to install deps
2. `pnpm dev` to run the project in dev mode

## Try it online

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/shopware/frontends/tree/main/templates/astro)
