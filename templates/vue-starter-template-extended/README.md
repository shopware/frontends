# Lumora Demo Store - Extended Vue Starter Template

**Lumora – Modern Home Scents**

A Shopware Frontends template showcasing a modern e-commerce store for home fragrances (candles, reed diffusers, and room sprays). This template extends the `vue-starter-template` as a Nuxt layer.

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
})
```

### Benefits of Layer Approach
- Inherits all composables, pages, and features from vue-starter-template
- Minimal code duplication
- Easy to customize and override specific components
- Automatic updates when base template improves

### Component Inheritance

All components from vue-starter-template are automatically available in Lumora thanks to the layer's component registration using `createResolver`. This includes:

- Page components for CMS rendering (`FrontendNavigationPage`, `FrontendDetailPage`, `FrontendLandingPage`)
- All layout components (headers, footers, navigation)
- Form components (login, checkout, account)
- Shared components (modals, notifications, etc.)

The vue-starter-template exposes its components to child layers using absolute path resolution, ensuring they're available for both static imports and dynamic component resolution (used by Shopware CMS).

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

- `.lumora-category-tiles` - Styled category image tiles with hover effects
- `.lumora-featured-slider` - Product slider customization
- `.lumora-editorial` - Editorial content section spacing

These can be applied directly in the Shopware CMS admin panel.

## Customization

### Override Components

Create components in `./app/components/` to override base template components:

```
lumora-demo-store/
  app/
    components/
      YourCustomComponent.vue  # Overrides base component
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
- [Shopware Frontends Documentation](https://frontends.shopware.com)
- [UnoCSS Documentation](https://unocss.dev/)
