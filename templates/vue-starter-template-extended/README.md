# Lumora Demo Store - Extended Vue Starter Template

**Lumora – Modern Home Scents**

A Shopware Frontends template showcasing a modern e-commerce store for home fragrances (candles, reed diffusers, and room sprays). This template extends the `vue-starter-template` (bundled in `./base-template`) as a Nuxt layer.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/shopware/frontends/tree/feat/theming-stackblitz-example/templates/vue-starter-template-extended?file=README.md)

## When to Use This Template

**Use vue-starter-template-extended if:**
- You need examples of component customization and overrides
- You're building a similar e-commerce store and want a head start
- You need a reference for styling, CMS integration, and Nuxt layer usage

**Use [vue-starter-template](https://github.com/shopware/frontends/tree/main/templates/vue-starter-template) (base) if:**
- You're starting a project from scratch with your own design
- You want minimal boilerplate and maximum flexibility
- You prefer to build everything yourself without pre-built examples

## Setup

Install dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Preview production build:

```bash
pnpm preview
```

## Template Architecture

> **Note:** This StackBlitz demo bundles the base template in `./base-template/` for convenience. In production, `vue-starter-template` is an independent package — you install it as a regular dependency and can swap or update it independently of your project.

This template uses the **Nuxt Layer** pattern. The base `vue-starter-template` is included as a local dependency in `./base-template/`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ["./base-template"],
  // ... your customizations
})
```

```json
// package.json
{
  "dependencies": {
    "vue-starter-template": "file:./base-template"
  }
}
```

### How It Works
- `./base-template/` contains a copy of `vue-starter-template` — the full-featured Shopware storefront
- Your extended template inherits all pages, components, composables, and layouts from the base
- Override any component by creating a file with the same name in `./app/components/`
- Add new pages in `./app/pages/`
- Customize styling via `uno.config.ts`

### Benefits
- Inherits all composables, pages, and features from the base template
- Minimal code duplication — only override what you need
- Easy to customize and extend specific components
- Clear separation between base functionality and your customizations

## Customization

### Override Components

Create components in `./app/components/` to override base template components:

```
vue-starter-template-extended/
  app/
    components/
      YourCustomComponent.vue  # Overrides the base component with the same name
```

### Add New Pages

Create pages in `./app/pages/`:

```
vue-starter-template-extended/
  app/
    pages/
      about.vue  # New page, not in the base template
```

### Styling

Customize UnoCSS configuration in `uno.config.ts`. The base template's UnoCSS config is automatically merged thanks to `unocss: { nuxtLayers: true }` in `nuxt.config.ts`.

## Learn More

- [Nuxt Layers Documentation](https://nuxt.com/docs/getting-started/layers)
- [Shopware Frontends Documentation](https://frontends.shopware.com)
- [UnoCSS Documentation](https://unocss.dev/)
