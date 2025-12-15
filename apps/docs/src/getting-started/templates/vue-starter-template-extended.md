<script setup>
import stackblitzIcon from '../../.assets/framework-icons/stackblitz.png';
</script>

# Vue Starter Template Extended

The Vue Starter Template Extended (Lumora Demo Store) is an example implementation that demonstrates how to extend the Vue Starter Template using [Nuxt layers](https://nuxt.com/docs/getting-started/layers). This approach allows you to inherit all features from a base template while maintaining only your customizations.

:::tip Learn by Example
This template showcases the **Nuxt layer pattern** - a powerful way to create brand-specific storefronts without code duplication.
:::

## Setup & run

Set up the vue-starter-template-extended manually by running the following commands in a new directory:

```bash
npx tiged shopware/frontends/templates/vue-starter-template-extended lumora-store && cd lumora-store
npm i && npm run dev
```

## What is Lumora?

Lumora is a fictional brand selling modern home scents (candles, reed diffusers, and room sprays). The template demonstrates how to:

- Extend an existing template using Nuxt layers
- Customize the theme with brand colors
- Override specific configurations
- Maintain a minimal, focused codebase

## How It Works: Nuxt Layers

### Layer Architecture

This template extends the Vue Starter Template using Nuxt's layer system:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ["../vue-starter-template"],  // Extend base template
  // ... Lumora-specific configuration
})
```

### What You Inherit

By extending the base template, you automatically get:

- ✅ All page components (navigation, product, checkout, etc.)
- ✅ All layout components (headers, footers, forms)
- ✅ All composables and business logic
- ✅ CMS integration
- ✅ i18n support
- ✅ Type generation setup

### What You Customize

The extended template contains only:

```
lumora-store/
├─ app/
│  └─ app.config.ts        # Brand customizations (colors, settings)
├─ public/                  # Brand-specific assets (logo, favicon)
├─ nuxt.config.ts          # Layer configuration
├─ uno.config.ts           # Custom theme styles
└─ package.json            # Dependencies
```

## Customization Example

### Brand Color Configuration

The template demonstrates how to customize the image placeholder color using `app.config.ts`:

```ts
// app/app.config.ts
export default defineAppConfig({
  imagePlaceholder: {
    color: "#B38A65",  // Lumora brand-primary color
  },
});
```

This setting is used by the `useImagePlaceholder` composable from `@shopware/cms-base-layer`.

### Theme Customization

Custom UnoCSS configuration in `uno.config.ts` adds Lumora-specific styles:

```ts
// uno.config.ts
export default mergeConfigs([config, {
  theme: {
    colors: {
      'brand-primary': '#B38A65',
      'brand-secondary': '#2C2C2C',
    },
  },
}])
```

## Overriding Components

To override a component from the base template, create a file with the same name in your `app/components/` directory:

```
lumora-store/
  app/
    components/
      SwProductCard.vue  # Overrides base SwProductCard
      layout/
        LayoutHeader.vue # Overrides base header
```

Nuxt automatically prioritizes your local components over the base template components.

## Benefits of the Layer Approach

### 1. Minimal Code Duplication

Only maintain code that differs from the base template. In this example, the entire Lumora store is customized with just a few files.

### 2. Automatic Updates

When the base template improves (bug fixes, new features), you can update it without touching your customizations:

```bash
# Update base template dependency
npm update vue-starter-template
```

### 3. Multiple Brands

Create multiple brand variants from a single base:

```
my-monorepo/
├─ vue-starter-template/      # Base template
├─ lumora-store/              # Brand A (extends base)
├─ another-brand/             # Brand B (extends base)
└─ premium-brand/             # Brand C (extends base)
```

### 4. Clean Separation

Your brand-specific code stays separate from the framework code, making it easier to:

- Understand what's custom vs. standard
- Update dependencies safely
- Test customizations in isolation

## Using Layers in Your Project

### Extend from npm Package

Instead of a local path, you can extend from an npm package:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ["@your-company/store-base"],
  // ... your customizations
})
```

### Extend Multiple Layers

You can extend multiple layers:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: [
    "@your-company/store-base",
    "@your-company/payment-layer",
  ],
})
```


## Production Deployment

The extended template can be deployed like any Nuxt application:

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

<PageRef page="https://nuxt.com/docs/getting-started/deployment" target="blank" title="Nuxt Deployment Guide" sub="Learn how to deploy your Nuxt application to various platforms" />

## Learn More

<PageRef page="./vue-starter-template.html" title="Vue Starter Template" sub="Learn about the base template that this extends" />

<PageRef page="https://nuxt.com/docs/getting-started/layers" target="blank" title="Nuxt Layers Documentation" sub="Deep dive into Nuxt's layer system" />

<PageRef page="../../packages/cms-base-layer.html#overwriting-components" title="Override CMS Components" sub="Customize CMS components from the base layer" />
