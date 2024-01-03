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

```js
// src/entrypoints/_shopware.ts

export default (app: App) => {
   const apiInstance = createAPIClient<operations, operationPaths>({
    baseURL:
      import.meta.env.API_URL ||
      "https://demo-frontends.shopware.store/store-api", // CHANGE here or in .env.* file
    accessToken:
      import.meta.env.API_ACCESS_TOKEN || "SWSCBHFSNTVMAWNZDNFKSHLAYW", // CHANGE here or in .env.* file
    contextToken: Cookies.get("sw-context-token"),
    onContextChanged(newContextToken: string) {
      Cookies.set("sw-context-token", newContextToken, {
        expires: 365, // days
        path: "/",
        sameSite: "lax",
      });
    },
  });
};
```

## Customize

Now, you are free to use the `@shopware-pwa/composables-next` package in the application. You can start from [Session.vue](./src/components/Session.vue).

## Install & Run

1. `pnpm i` to install deps
2. `pnpm dev` to run the project in dev mode

## Try it online

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/shopware/frontends/tree/main/templates/astro)
