# Multi sales channel support Nuxt plugin

Drop-in replacement for [@shopware-pwa/nuxt3-module](https://www.npmjs.com/package/@shopware-pwa/nuxt3-module)
to use with the [vue-demo-store](https://github.com/shopware/frontends/tree/main/templates/vue-demo-store) template.

## Features

- ✨ &nbsp;Adds support for multiple sales channels
- 🌏 &nbsp;Usable with multiple different languages on each sales channel
- ⚙️ &nbsp;Can be used with existing projects built on the vue-demo-store

## Requirements

- [@shopware/api-client](https://www.npmjs.com/package/@shopware/api-client)
- [@nuxtjs/i18n](https://www.npmjs.com/package/@nuxtjs/i18n)

## Setup

### Backend: Shopware 6 admin panel

Set up your shopware instance with multiple sales channels.

### Frontend: Nuxt 3 project

1. Install the dependencies

   run `pnpm i` command.

2. Drop the multi-sales-channel shopware plugin (`./plugins/shopware.ts`)
   into your nuxt project's `plugins` folder.

3. Configure the shopware plugin in the `runtimeConfig > public` section of your `nuxt.config.ts`:

   ```js
   // ./nuxt.config.ts
   shopware: {
      useUserContextInSSR: false,
      devStorefrontUrl: "",

      // Configure the sales channel credentials and locales
      salesChannels: {
         international: {
            endpoint: "https://demo-frontends.shopware.store/store-api/",
            accessToken: "ACCESS_KEY_SALES_CHANNEL_INTERNATIONAL",
            // Each sales channel can have multiple locales, e.g. [ "de-DE", "en-DE", ... ]
            locales: [ "en-GB" ],
         },
         germany: {
            endpoint: "https://demo-frontends.shopware.store/store-api/",
            accessToken: "ACCESS_KEY_SALES_CHANNEL_GERMANY",
            locales: [ "de-DE" ],
         },
         poland: {
            endpoint: "https://demo-frontends.shopware.store/store-api/",
            accessToken: "ACCESS_KEY_SALES_CHANNEL_POLAND",
            locales: [ "pl-PL" ],
         },
         ...
      },
   },
   ```

4. Configure the nuxt i18n plugin

   ```js
   i18n: {
    strategy: "prefix",
    defaultLocale: "en-GB",
    // Locales from the i18n plugin should match the locales from the sales channel configuration
    locales: [
      {
        code: "en-GB",
        iso: "en-GB",
      },
      {
        code: "de-DE",
        iso: "de-DE",
      },
      {
        code: "pl-PL",
        iso: "pl-PL",
      },
    ],
   },
   ```

You should now be able to switch between different sales channels!
Just change your app's locale to one of the configured locales in the `salesChannels`
section of your `nuxt.config.ts` and the api client will automatically communicate with
the corresponding sales channel.

## Development

Run a playground project with configured multi-sales-channel plugin from current dir.

```bash
# Run a playground (nuxt 3) project in dev mode
pnpm dev
```
