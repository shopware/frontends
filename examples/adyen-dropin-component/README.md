# Vue component for Adyen drop-in checkout

- [📖 &nbsp;Documentation](https://frontends.shopware.com)

## Features

<!-- Highlight some of the features your module provide here -->

- ⛰ &nbsp;`AdyenCheckout.client` plugin to register a factory method to create an Adyen Checkout instance
- 🚠 &nbsp;`AdyenCreditCard.vue` component to use in a Vue project
- 🌲 &nbsp;`app.vue` containing an example of the logic that handles the interaction between a headless app and Shopware 6 instance

## Requirements

- Adyen plugin installed in your Shopware 6 instance. Follow the instructions from [official documentation](https://docs.adyen.com/plugins/shopware-6/headless-integration/).
- Adyen payment methods activated, at least _Cards_.

## Setup

### Backend

For demo purposes, it's better to set `Adyen Cards` as the **default payment method**, because the **example does not provide** a payment method switcher.

### Frontend: Nuxt 3 project

0. Install the dependencies

   run `pnpm i` command.

1. Register the module in your Nuxt 3 project

```js
  // ./playground/nuxt.config.ts
  modules: ["@shopware-pwa/nuxt3-module"],
  // see that "../src/module" points to this dir (from ./playground/nuxt.config.ts file)
```

2. Setup nuxt project

There are three sections within `runtimeConfig`:

- `public.loginData`: keeps customer login data - checkout requires to be logged-in (as guest or typical user)
- `public.shopware`: configures the `@shopware-pwa/nuxt3-module` by telling what is the API we want to connect
- `public.adyenCheckout`: settings for `Adyen.client.ts` plugin to create a valid Adyen Checkout instance used later on

```js
// ./nuxt.config.ts
...
runtimeConfig: {
    public: {
      loginData: {
        // for demo purposes, the customer is logged in automatically, so please adjust the loginData to some of yours customer account
        username: "somecustomer@email.com",
        password: "somepassword",
      },
      shopware: {
        // your Shopware 6 instance endpoint and access key
        shopwareEndpoint: "http://localhost:8000",
        shopwareAccessToken: "SWSCCMR1DEXDTK0XRJVSD3DHMW",
      },
      adyenCheckout: {
        environment: "test", // Change to 'live' for the live environment.
        clientKey: "test_FDAB...", // Public key used for client-side authentication: https://docs.adyen.com/development-resources/client-side-authentication
        analytics: {
          enabled: true, // Set to false to not send analytics data to Adyen.
        },
      },
    },
  },
  ...
```

## Use Credit Card components

[Open app.vue](./app.vue) file to see how it's working. 

## Development

Run a playground project with configured Mollie module from current dir.

```bash
# Run a playground (nuxt 3) project in dev mode
pnpm dev
```
