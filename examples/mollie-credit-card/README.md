# Vue components for Mollie Payments (Nuxt module)

- [📖 &nbsp;Documentation](https://frontends.shopware.com)

## Features

<!-- Highlight some of the features your module provide here -->

- ⛰ &nbsp;`useMollie` & `useMollieCreditCard` composable function
- 🚠 &nbsp;`MollieCreditCardComponent.vue` component to use in a Vue project
- 🌲 &nbsp;`ShopwareFrontendsCreditCard.vue` component to use in a Nuxt Shopware Powered project

## Requirements

- Frontend side: any Nuxt 3 project, or a project with [Shopware Frontends](https://frontends.shopware.com/getting-started/templates.html) registered and running (you can use one of the Nuxt templates provided in [shopware/frontends](https://github.com/shopware/frontends/tree/main/templates) GitHub Project or see the [./playground](./playground/) app included to this module)
- Backend side: [Mollie Payments App for Shopware](https://store.shopware.com/en/molli23282346664f/mollie-payments-app-for-shopware.html) installed on your environment ([See how to setup it locally](https://boxblinkracer.com/blog/mollie-app-setup))

## Setup

### Backend: Shopware 6 admin panel

Install the Mollie Payments in your Shopware 6 instance and set it up

### Frontend: Nuxt 3 project

0. Install the dependencies

   run `pnpm i` command.

1. Register the module in your Nuxt 3 project

```js
  // ./playground/nuxt.config.ts
  modules: ["@vueuse/nuxt", "@shopware-pwa/nuxt3-module", "../src/module"],
  // see that "../src/module" points to this dir (from ./playground/nuxt.config.ts file)
```

2. Configure Mollie module

```js
// ./playground/nuxt.config.ts
mollie: {
    defaultLocale: "en_US", // fallback locale
    profileId: "pfl_E5EmGZ98YT", // from Mollie's dashboard
    testMode: true,
},
```

## Use Credit Card components

1. For Shopware Frontends aware projects (with `shopware-pwa/nuxt3-module` enabled)

```html
<script setup lang="ts">
  import { useCheckout } from "@shopware-pwa/composables-next/dist";
  const { selectedPaymentMethod } = useCheckout();
  // the name may vary, so first, please check what comes from API
  const showMollieCreditCardComponent = computed(
    () =>
      selectedPaymentMethod.value?.shortName ===
      "mollie_payments_app_mollie_creditcard",
  );
</script>
<template>
  <!-- show credit card component conditionally -->
  <ShopwareFrontendsCreditCard :v-if="showMollieCreditCardComponent" />
</template>
```

In this case, by clicking a submit / save button under the credit card form, there will be an additional request made to the mollie's endpoint in your Shopware 6 instance.

2. For plain Nuxt 3 project

```html
<MollieCreditCardComponent />
```

## Events and properties

Control credit card form and react on events using events and properties:

```ts
const props = defineProps<{
  locale?: MollieLocale;
  submitButtonLabel?: string;
  submitDisabled?: boolean;
}>();

const emits = defineEmits<{
  (e: "submit", token: string | undefined): void;
  (e: "error", error: string | undefined): void;
}>();
```

Example:

```html
<ShopwareFrontendsCreditCard
  submit-button-label="Save"
  locale="en_US"
  :submit-disabled="!!CreditCardToken"
  @submit="
      (token) => {
        CreditCardToken = `${token} ✔️`;
        CreditCardError = null;
      }
    "
  @error="
      (message) => {
        CreditCardError = `${message} ❌`;
      }
    "
/>
```

## Development

Run a playground project with configured Mollie module from current dir.

```bash
# Run a playground (nuxt 3) project in dev mode
pnpm dev
```
