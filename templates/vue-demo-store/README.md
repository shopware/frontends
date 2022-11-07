# Demo template (Nuxt)

![Shopware Frontends](.assets/shopware-frontends-logo.png)

This repository shows an example of demo application built with Shopware Frontends Framework on Nuxt 3.

## What's inside

- Nuxt 3 application
- Required libraries installed (api-client, CMS components, composables, Nuxt 3 module)
- Demo Shopware 6 instnace configured as the API

## Requirements

Go to [Documentation > Requirements](https://shopware-frontends-docs.vercel.app/framework/requirements.html) to see the details.

## Set up your Shopware 6 instance

In order to have a different API connect to the app, **uncomment** and adjust the API credentials in the `nuxt.config.ts` file:

```ts
export default defineNuxtConfig({
  // shopware: {
  //   shopwareEndpoint: "https://you.endpoint.com",
  //   shopwareAccessToken: "your-access-token",
  // },
```

## Customize

Now, you can have a look on the pages and components and add your stuff there.

[TODO: explain cms overriding or link to the docs].

## Install & Run

1. `pnpm i` to install deps
2. `pnpm dev` to run the project in dev mode

## Try it online

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/shopware/frontends/tree/main/templates/vue-demo-store)
