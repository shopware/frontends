<script setup>
import stackblitzIcon from '../../.assets/framework-icons/stackblitz.png';
</script>

# Vue Starter Template

The Vue Starter Template is a production-ready Nuxt application with all Shopware Frontends core packages pre-configured. It provides a clean foundation for building your custom storefront without the demo content or boilerplate UI found in the Demo Store Template.

:::tip Production Ready
Unlike the Demo Store Template, the **Vue Starter Template** is designed for production use and can be used as a foundation for your custom storefront.
:::

## Setup & run

<PageRef target="blank" title="Run on Stackblitz" page="https://stackblitz.com/github/shopware/frontends/tree/main/templates/vue-starter-template" sub="Open the Vue Starter Template with our browser IDE in a new window" :icon="stackblitzIcon" />

Alternatively, set up the vue-starter-template manually by running the following commands in a new directory:

```bash
npx tiged shopware/frontends/templates/vue-starter-template my-store && cd my-store
npm i && npm run dev
```

The vue-starter-template is connected to a Shopware Cloud instance by default. However, you can change the [configuration](#configure) to use your own instance.

## What's Included

The template comes with:

- **Nuxt 4.x** - Latest Nuxt framework with full SSR support
- **All core packages** - Pre-installed and configured:
  - `@shopware/api-client` - HTTP client for Shopware API
  - `@shopware/composables` - Vue composables for business logic
  - `@shopware/helpers` - Utility functions
  - `@shopware/cms-base-layer` - CMS component integration
  - `@shopware/nuxt-module` - Nuxt module for Shopware
- **UnoCSS** - Utility-first CSS framework (Tailwind-compatible)
- **i18n support** - Internationalization ready
- **TypeScript** - Full type safety with generated Shopware types
- **Type generation** - Script to generate types from your Shopware instance

## Directory Structure

The directory structure follows [Nuxt conventions](https://nuxt.com/docs/guide/directory-structure):

```
vue-starter-template/
├─ app/
│  ├─ components/      /* Your custom components */
│  ├─ pages/           /* Page components */
│  ├─ layouts/         /* Layout components */
│  └─ ...
├─ public/             /* Static assets */
├─ nuxt.config.ts      /* Nuxt configuration */
├─ uno.config.ts       /* UnoCSS configuration */
├─ package.json
├─ tsconfig.json
```

## Configure

### Shopware Connection

To connect to your own Shopware instance, edit the `nuxt.config.ts` file:

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      shopware: {
        endpoint: "https://your-shop.shopware.store/store-api",
        accessToken: "your-access-token",
        // Optional: Required for local development when using customer registration
        // devStorefrontUrl: "https://your-shop.shopware.store",
      },
    },
  },
});
```

You can also use a `.env` file to override configuration:

```bash
NUXT_PUBLIC_SHOPWARE_ENDPOINT=https://your-shop.shopware.store/store-api
NUXT_PUBLIC_SHOPWARE_ACCESS_TOKEN=your-access-token
# Optional: Required for local development when using customer registration
# NUXT_PUBLIC_SHOPWARE_DEV_STOREFRONT_URL=https://your-shop.shopware.store
```

:::info devStorefrontUrl
The `devStorefrontUrl` option is needed when customer registration fails during local development. It tells Shopware which sales channel domain to use when your browser's origin (e.g., `localhost:3000`) doesn't match any configured domain. Set it to a domain from your Sales Channel settings. See the [troubleshooting guide](../../resources/troubleshooting.html#what-is-devstorefronturl-and-when-to-use-it) for more details.
:::

### Generate Types

After connecting to your Shopware instance, generate TypeScript types:

```bash
npm run generate-types
```

This command uses `@shopware/api-gen` to create type definitions based on your Shopware configuration.

## Customizing

### Adding Components

Create components in the `app/components/` directory. They will be auto-imported:

```vue
<!-- app/components/MyCustomButton.vue -->
<template>
  <button class="px-4 py-2 bg-brand-primary text-brand-on-primary rounded">
    <slot />
  </button>
</template>
```

### Override CMS Components

The template uses `@shopware/cms-base-layer` for CMS integration. You can override any CMS component by creating a file with the same name in your `app/components/` directory.

For example, to override the product card:

```vue
<!-- app/components/SwProductCard.vue -->
<template>
  <!-- Your custom product card implementation -->
</template>
```

<PageRef page="../../packages/cms-base-layer.html#overwriting-components" title="Override CMS Components" sub="Learn how to customize CMS components from the base layer" />

### Styling with UnoCSS

The template uses UnoCSS (Tailwind-compatible). Customize your theme in `uno.config.ts`:

```ts
import { mergeConfigs } from '@unocss/core'
import config from './.nuxt/uno.config.mjs'

export default mergeConfigs([config, {
  theme: {
    colors: {
      primary: '#your-brand-color',
      secondary: '#your-secondary-color',
    },
  },
}])
```

## Extending with Layers

The Vue Starter Template can be extended using [Nuxt layers](https://nuxt.com/docs/getting-started/layers), allowing you to:

- Inherit all features from the base template
- Override only specific components
- Maintain multiple brand variants from a single base
- Keep your customizations separate and maintainable

<PageRef page="./vue-starter-template-extended.html" title="Vue Starter Template Extended" sub="See an example of extending this template using Nuxt layers" />

## What's Next?

<PageRef page="../page-elements/navigation.html" title="Build your navigation" sub="Learn how to implement the main navigation for your store" />

<PageRef page="../cms/content-pages.html" title="Work with CMS" sub="Integrate Shopware Shopping Experiences into your frontend" />
