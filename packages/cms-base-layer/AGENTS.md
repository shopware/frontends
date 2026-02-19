# AI Agent Guide for @shopware/cms-base-layer

This document provides guidance for AI assistants working with the `@shopware/cms-base-layer` package.

## TL;DR

**What**: Nuxt layer providing Vue components for Shopware 6 Shopping Experiences (CMS)
**Purpose**: Pre-built, customizable CMS components styled with UnoCSS/Tailwind
**Tech**: Vue 3, Nuxt 4, UnoCSS, @shopware/composables, @shopware/helpers

**Key Concepts**:
- CMS Page → Sections → Blocks → Elements (hierarchical structure)
- Components auto-registered globally via Nuxt layer
- Styling via UnoCSS utility classes
- Customizable via app.config.ts and component overriding

**Quick Start**:
```bash
pnpm run build  # Build the package
pnpm run dev    # Stub mode for development
pnpm run test   # Run tests
```

## Package Overview

The `@shopware/cms-base-layer` is a Nuxt layer that provides a complete implementation of Shopware's Shopping Experiences CMS system. It renders CMS pages created in Shopware Administration using Vue components styled with UnoCSS/Tailwind CSS.

## Architecture

### CMS Hierarchy

Shopware CMS follows a strict hierarchical structure:

```
CmsPage
├── CmsSection (layout container)
│   ├── CmsBlock (content grouping)
│   │   ├── CmsElement (actual content)
│   │   └── CmsElement
│   └── CmsBlock
└── CmsSection
```

### Component Naming Convention

Components follow a predictable naming pattern based on the CMS structure:

| Level | Pattern | Example |
|-------|---------|---------|
| Page | `CmsPage` | `CmsPage.vue` |
| Section | `CmsSection{Type}` | `CmsSectionDefault.vue`, `CmsSectionSidebar.vue` |
| Block | `CmsBlock{Type}` | `CmsBlockImage.vue`, `CmsBlockText.vue` |
| Element | `CmsElement{Type}` | `CmsElementImage.vue`, `CmsElementText.vue` |

## Directory Structure

```
cms-base-layer/
├── app/
│   ├── app.config.ts              # Default app configuration
│   ├── assets/                    # Static assets (icons, images)
│   ├── components/
│   │   ├── Sw*.vue               # Shared components (SwProductCard, etc.)
│   │   ├── listing-filters/      # Product listing filter components
│   │   ├── public/
│   │   │   └── cms/              # CMS components (auto-registered)
│   │   │       ├── CmsPage.vue
│   │   │       ├── CmsGenericBlock.vue
│   │   │       ├── CmsGenericElement.vue
│   │   │       ├── block/        # Block components
│   │   │       ├── element/      # Element components
│   │   │       ├── section/      # Section components
│   │   │       └── skeleton/     # Loading skeleton components
│   │   └── ui/                   # Base UI components (prefixed with Sw)
│   ├── composables/              # Layer-specific composables
│   ├── helpers/                  # Utility functions
│   ├── plugins/                  # Nuxt plugins
│   └── providers/                # Image providers (Shopware)
├── nuxt.config.ts                # Layer configuration
├── uno.config.ts                 # UnoCSS/Tailwind configuration
└── package.json
```

## Key Files

### Entry Points

- [nuxt.config.ts](nuxt.config.ts) - Layer configuration, component registration, image presets
- [uno.config.ts](uno.config.ts) - Default theme colors, fonts, CSS presets
- [app/app.config.ts](app/app.config.ts) - Runtime configuration defaults

### Core CMS Components

- [app/components/public/cms/CmsPage.vue](app/components/public/cms/CmsPage.vue) - Main entry point for rendering CMS pages
- [app/components/public/cms/CmsGenericBlock.vue](app/components/public/cms/CmsGenericBlock.vue) - Generic block renderer
- [app/components/public/cms/CmsGenericElement.vue](app/components/public/cms/CmsGenericElement.vue) - Generic element renderer

### Sections (Layout)

| Component | Purpose |
|-----------|---------|
| `CmsSectionDefault` | Full-width section |
| `CmsSectionSidebar` | Section with sidebar layout |

### Common Blocks

| Component | Purpose |
|-----------|---------|
| `CmsBlockImage` | Single image display |
| `CmsBlockText` | Text content |
| `CmsBlockImageText` | Image with text side-by-side |
| `CmsBlockProductListing` | Product grid/list |
| `CmsBlockProductSlider` | Product carousel |
| `CmsBlockImageSlider` | Image carousel |
| `CmsBlockImageGallery` | Image gallery grid |
| `CmsBlockForm` | Contact/newsletter forms |
| `CmsBlockCategoryNavigation` | Category tree navigation |

### Common Elements

| Component | Purpose |
|-----------|---------|
| `CmsElementImage` | Image with various display options |
| `CmsElementText` | Rich text content |
| `CmsElementProductListing` | Product listing with filters |
| `CmsElementProductSlider` | Product carousel |
| `CmsElementBuyBox` | Add to cart functionality |
| `CmsElementImageGallery` | Product image gallery |
| `CmsElementForm` | Form rendering |

### Shared Components (Sw* prefix)

These are reusable components used across CMS and templates:

| Component | Purpose |
|-----------|---------|
| `SwProductCard` | Product card for listings |
| `SwProductGallery` | Product image gallery |
| `SwProductAddToCart` | Add to cart button/quantity |
| `SwVariantConfigurator` | Product variant selection |
| `SwPagination` | Page navigation |
| `SwSlider` | Generic slider/carousel |
| `SwProductListingFilters` | Filter sidebar |
| `SwProductListingFiltersHorizontal` | Horizontal filter bar |

### UI Components (Sw prefix via ui/)

Base UI components for building interfaces:

- `SwBaseButton` - Button component
- `SwBaseIcon` - Icon wrapper
- `SwCheckbox` - Checkbox input
- `SwRadioButton` - Radio input
- `SwSwitchButton` - Toggle switch
- `SwIconButton` - Icon-only button

## Usage in Projects

### Basic Setup

Register the layer in your Nuxt config:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  extends: [
    "@shopware/composables/nuxt-layer",
    "@shopware/cms-base-layer"
  ],
});
```

### Rendering CMS Content

```vue
<template>
  <!-- Pass CMS page data from category, product, or landing page response -->
  <CmsPage v-if="cmsPage" :content="cmsPage" />
</template>
```

### Template Examples

> **Note**: These paths reference templates within the monorepo structure.

#### vue-starter-template

The [vue-starter-template](../../templates/vue-starter-template/) demonstrates full cms-base-layer integration:

```typescript
// templates/vue-starter-template/nuxt.config.ts
export default defineNuxtConfig({
  extends: ["@shopware/composables/nuxt-layer", "@shopware/cms-base-layer"],
  // ...configuration
});
```

Key features:
- Uses cms-base-layer for all CMS rendering
- Adds custom page components (checkout, account, etc.)
- Configures app.config.ts for brand customization
- Adds i18n support

#### vue-starter-template-extended

The [vue-starter-template-extended](../../templates/vue-starter-template-extended/) shows how to extend and customize:

```typescript
// templates/vue-starter-template-extended/nuxt.config.ts
export default defineNuxtConfig({
  extends: ["../vue-starter-template"],  // Inherits cms-base-layer
  // ...minimal customizations
});
```

Key features:
- Extends vue-starter-template (layer inheritance)
- Overrides `app.config.ts` for brand-specific settings
- Demonstrates component overriding pattern

## Customization

### App Configuration

Override defaults via `app.config.ts`:

```typescript
// your-project/app/app.config.ts
export default defineAppConfig({
  // Customize image placeholder color
  imagePlaceholder: {
    color: "#B38A65",  // Your brand color
  },
});
```

Available configuration:
- `imagePlaceholder.color` - SVG placeholder background color
- `unocssRuntime` - Enable/disable the client-side UnoCSS runtime plugin (default: `true`). Resolves dynamic CMS utility classes at runtime via MutationObserver. Disable if not needed or if it causes performance issues.

### Theme Customization

Override UnoCSS theme in your project:

```typescript
// your-project/uno.config.ts
import { defineConfig } from "unocss";

export default defineConfig({
  theme: {
    colors: {
      "brand-primary": "#YOUR_COLOR",
      "brand-primary-hover": "#YOUR_HOVER_COLOR",
      // ... other color overrides
    },
  },
});
```

Default theme colors (defined in [uno.config.ts](uno.config.ts)):
- `brand-primary` - Primary brand color (#543B95)
- `brand-secondary` - Secondary actions (#E1D5FF)
- `brand-tertiary` - Tertiary elements (#F1F1F1)
- `states-success`, `states-error`, `states-warning` - State colors
- `surface-*` - Surface and background colors
- `outline-*` - Border and outline colors

### Component Overriding

Override any CMS component by creating a component with the same name in your project:

```
your-project/
  app/
    components/
      cms/
        element/
          CmsElementImage.vue    # Overrides cms-base-layer's CmsElementImage
      SwProductCard.vue          # Overrides SwProductCard
```

Nuxt's component priority system ensures your components take precedence.

### Adding Custom CMS Blocks

For custom Shopware CMS blocks, create matching components:

```vue
<!-- app/components/cms/block/CmsBlockMyCustomBlock.vue -->
<script setup lang="ts">
import type { CmsBlock } from "@shopware/composables";

defineProps<{
  content: CmsBlock;
}>();
</script>

<template>
  <div class="my-custom-block">
    <CmsGenericElement
      v-for="slot in ['left', 'right']"
      :key="slot"
      :content="content.slots?.find(s => s.slot === slot)"
    />
  </div>
</template>
```

## Development

### Building

```bash
# From package directory
pnpm run build

# Stub mode for development (hot reload)
pnpm run dev
```

### Testing

```bash
pnpm run test        # Run tests
pnpm run test:watch  # Watch mode
```

### Type Checking

```bash
pnpm run typecheck
```

### Linting

```bash
pnpm run lint        # Check
pnpm run lint:fix    # Fix
```

## Image Handling

The layer includes a custom Shopware image provider for `@nuxt/image`:

```vue
<NuxtImg
  provider="shopware"
  :src="product.cover?.media?.url"
  preset="productCard"
/>
```

Available presets (defined in [nuxt.config.ts](nuxt.config.ts)):
- `productCard` - Optimized for product cards
- `productDetail` - High quality for detail pages
- `thumbnail` - Small thumbnails (150x150)
- `hero` - Hero/banner images

## Common Patterns

### Accessing CMS Data in Elements

```vue
<script setup lang="ts">
import type { CmsElementImage } from "@shopware/composables";

const props = defineProps<{
  content: CmsElementImage;
}>();

// Access element configuration
const config = computed(() => props.content.config);
const media = computed(() => props.content.data?.media);
</script>
```

### Using Composables

```vue
<script setup lang="ts">
import { useCmsElementConfig } from "@shopware/composables";

const props = defineProps<{ content: CmsElement }>();

// Get typed configuration
const { getConfigValue } = useCmsElementConfig(props.content);
const displayMode = getConfigValue("displayMode");
</script>
```

### Product Listing Context

The `CmsPage` component automatically creates listing context for category pages:

```vue
<script setup lang="ts">
// In any child component of CmsPage
const { getCurrentListing } = useCategoryListing();
const { elements, total } = getCurrentListing();
</script>
```

## Troubleshooting

### Components Not Rendering

1. Ensure layer is properly registered in `nuxt.config.ts`
2. Check component naming matches Shopware CMS type
3. Verify `@shopware/composables/nuxt-layer` is also extended

### Styling Issues

1. Ensure UnoCSS is configured with `nuxtLayers: true`
2. Check for CSS class conflicts
3. Verify color tokens are defined in theme

### UnoCSS Runtime Crashes

If the browser tab crashes or you see `clearDeps` errors from `@vueuse/core`, the UnoCSS runtime MutationObserver may be conflicting with reactive DOM changes. Disable it via `app.config.ts`:
```ts
export default defineAppConfig({ unocssRuntime: false });
```

### Type Errors

```bash
# Regenerate types
pnpm nuxt prepare
pnpm run typecheck
```

## File Patterns

- `Cms*.vue` - CMS-specific components (sections, blocks, elements)
- `Sw*.vue` - Shared/reusable components
- `*.md` - Component documentation (in same directory)
- `*.test.ts` - Component tests

## Best Practices

1. **Use semantic component names** - Follow `CmsBlock{Type}`, `CmsElement{Type}` pattern
2. **Leverage composables** - Use `@shopware/composables` for business logic
3. **Style with utility classes** - Use UnoCSS/Tailwind for styling
4. **Override, don't modify** - Create overriding components instead of editing source
5. **Test CMS rendering** - Verify with actual Shopware CMS content
6. **Document custom blocks** - Add `.md` files for custom components

## References

- [Shopware Frontends Documentation](https://frontends.shopware.com/)
- [Shopping Experiences Guide](https://frontends.shopware.com/framework/shopping-experiences.html)
- [Nuxt Layers](https://nuxt.com/docs/getting-started/layers)
- [UnoCSS Documentation](https://unocss.dev/)

---

**Last Updated**: 2026-01-14
**Package Version**: 2.0.0
