# Lumora Demo Store - Extended Vue Starter Template

**Lumora – Modern Home Scents**

A Shopware Frontends template showcasing a modern e-commerce store for home fragrances (candles, reed diffusers, and room sprays). This template extends the `vue-starter-template` as a Nuxt layer.

**[Live Demo →](https://frontends-extended-starter-template.vercel.app/)**

## When to Use This Template

**Use vue-starter-template-extended if:**

- You need examples of component customization and overrides
- You're building a similar e-commerce store and want a head start
- You need a reference for styling, CMS integration, and Nuxt layer usage

**Use [vue-starter-template](../vue-starter-template) (base) if:**

- You're starting a project from scratch with your own design
- You want minimal boilerplate and maximum flexibility
- You prefer to build everything yourself without pre-built examples
- Your store requires a completely custom structure

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

This template uses the **Nuxt Layer** pattern by extending `vue-starter-template`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ["../vue-starter-template"],
  // ... Lumora-specific configuration
});
```

### Benefits of Layer Approach

- Inherits all composables, pages, and features from vue-starter-template
- Minimal code duplication
- Easy to customize and override specific components
- Automatic updates when base template improves

### Component Inheritance

All components from vue-starter-template are automatically available in Lumora thanks to the layer's component registration using `createResolver`. This includes:

- SEO page resolvers in `app/components/global/` (`FrontendNavigationPage`, `FrontendDetailPage`, `FrontendLandingPage`) — Nuxt global for `resolveComponent`
- Custom/override CMS blocks & elements in `app/components/cms/` — also global for CMS `resolveComponent`
- Layout, form, and shared components under `app/components/` — normal auto-import

When overriding base components, put files in the same subdirectory so names and dynamic resolution keep working (e.g. override `FrontendDetailPage` under `components/global/`, not the components root).

## CMS Integration

The Shopware CMS backend includes:

### Homepage Structure

1. **Hero Section** - Full-width banner with lifestyle imagery
2. **USP Section** - Three-column feature highlights
3. **Category Highlights** - Three tiles for product categories
4. **Featured Products Slider** - Curated product showcase
5. **Editorial Block** - "Why Lumora?" brand story

### Custom CSS Classes

The template includes pre-configured styles for CMS blocks:

- `.lumora-separator` - horizontal divider for CMS sections (defined as an UnoCSS shortcut in `uno.config.ts`)

These can be applied directly in the Shopware CMS admin panel.

## Customization

### Override Components

Create components in `./app/components/` to override base template components (match `global/` / `cms/` when overriding resolveComponent targets):

```
lumora-demo-store/
  app/
    components/
      global/
        FrontendDetailPage.vue  # Overrides SEO PDP resolver
      YourCustomComponent.vue   # Overrides base auto-imported component
```

### Add Lumora-Specific Pages

Create pages in `./app/pages/`:

```
lumora-demo-store/
  app/
    pages/
      about.vue  # Custom about page
```

### Styling

Customize UnoCSS configuration in `uno.config.ts` to add Lumora-specific styles.

## Next Steps

Optional enhancements:

- Build custom "About Lumora" page
- Create custom CMS layouts for PDP and category pages
- Add Nuxt components for CMS block overrides
- Integrate product reviews
- Add gift wrapping options

## Learn More

- [Nuxt Documentation](https://nuxt.com/docs)
- [Shopware Frontends Documentation](https://developer.shopware.com/frontends)
- [UnoCSS Documentation](https://unocss.dev/)
