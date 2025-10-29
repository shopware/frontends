# Astro CMS Base Layer Example

This example demonstrates how to use `@shopware/cms-base-layer` Vue components in an Astro.js project.

## Overview

The `@shopware/cms-base-layer` package provides a comprehensive set of Vue components for rendering Shopware CMS content. While it's designed as a Nuxt layer, the underlying Vue components can be used in Astro with proper configuration.

## What's Included

### Working Components

- **CmsPage** - Full CMS page component with Shopware API integration
- **CmsElementText** - Rich text rendering with HTML support
- **CmsElementImage** - Image component with responsive loading
- **BaseButton** - Reusable button component
- Other simple UI components

### Components Requiring Full Shopware Integration

- **CMS Blocks** (CmsBlockImageText, CmsBlockProductSlider, etc.)
- **Product components** (require product data from Shopware API)
- **Commerce features** (cart, checkout, product listings)

## Key Configuration

### 1. Astro Config ([astro.config.mjs](./astro.config.mjs))

```js
import vue from '@astrojs/vue';
import UnoCSS from '@unocss/astro';

export default defineConfig({
  integrations: [
    vue({ appEntrypoint: '/src/pages/_app' }),
    UnoCSS({ injectReset: true })
  ],
  vite: {
    resolve: {
      alias: {
        '#imports': '@shopware/composables' // Map Nuxt imports
      }
    }
  }
});
```

### 2. Vue App Entrypoint ([src/pages/_app.ts](./src/pages/_app.ts))

Sets up Vue Router and registers CMS components globally:

```ts
import { createRouter, createMemoryHistory } from 'vue-router';
import { registerCmsComponents } from '../registerCmsComponents';

export default (app: App) => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [/* ... */]
  });
  app.use(router);

  // Register all CMS components globally for dynamic resolution
  registerCmsComponents(app);
};
```

**Why global registration?** CmsPage uses `resolveComponent()` to dynamically load section/block/element components based on CMS data. These components must be registered globally to be resolved at runtime.

### 3. UnoCSS Configuration ([uno.config.ts](./uno.config.ts))

Matches the cms-base-layer theme and provides icon support:

```ts
export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      collections: {
        carbon: () => import('@iconify-json/carbon/icons.json')
      }
    })
  ]
});
```

## Installation

From the monorepo root:

```bash
# Install dependencies
pnpm install

# Navigate to this example
cd examples/astro-cms-base

# Run development server
pnpm dev
```

## Project Structure

```
astro-cms-base/
├── src/
│   ├── components/
│   │   ├── SimpleDemo.vue      # Demo of CmsElement components
│   │   ├── UiDemo.vue          # Demo of UI components
│   │   └── CmsPageDemo.vue     # Demo of full CmsPage with API
│   ├── layouts/
│   │   └── Layout.astro        # Base layout
│   ├── pages/
│   │   ├── _app.ts             # Vue app entrypoint (Router setup)
│   │   ├── index.astro         # Home page
│   │   └── components/
│   │       ├── simple.astro    # Simple components demo
│   │       ├── ui.astro        # UI components demo
│   │       ├── cms-page.astro  # Full CmsPage demo
│   │       └── blocks.astro    # Block components info
│   └── shopware.ts              # Shopware API client config
├── astro.config.mjs            # Astro configuration
├── uno.config.ts               # UnoCSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json
```

## Key Learnings

### What Works Well

1. **Element-level components** (CmsElementText, CmsElementImage) work with minimal setup
2. **UI components** (BaseButton, IconButton) are framework-agnostic
3. **UnoCSS integration** provides consistent styling
4. **Async component loading** works smoothly with Suspense

### Challenges

1. **#imports alias** - Nuxt-specific, needs manual mapping
2. **Vue Router dependency** - Some components expect router to be available
3. **Shopware context** - Complex components need full Shopware API integration
4. **SSR considerations** - Some components use ClientOnly for hydration

### Best Practices

1. **Use `defineAsyncComponent`** for importing cms-base-layer components
2. **Wrap in `<Suspense>`** to handle loading states gracefully
   - Each Suspense default slot must have a single root element
3. **Mock data structures** should match Shopware's CMS API response format
4. **Client directives** - Use `client:only="vue"` for components with async imports to avoid hydration mismatches
   - `client:load` causes SSR which can lead to hydration issues with Suspense
   - `client:only="vue"` skips SSR and renders only on the client side
5. **Start simple** - Use element components before attempting complex blocks

## Integration with Real Shopware Instance

To connect to a real Shopware store:

1. **Install API client**:
   ```bash
   pnpm add @shopware/api-client
   ```

2. **Create API client**:
   ```ts
   import { createAPIClient } from '@shopware/api-client';

   const apiClient = createAPIClient({
     baseURL: 'https://your-store.com/store-api',  // Note: include /store-api
     accessToken: 'your-token'
   });
   ```

3. **Fetch CMS data**:
   ```ts
   const { cmsPage } = await apiClient.invoke(
     'readCms post /cms-page',
     { path: '/your-page' }
   );
   ```

4. **Render with CmsPage component**:
   ```vue
   <CmsPage :content="cmsPage" />
   ```

## Resources

- [Shopware Frontends Documentation](https://frontends.shopware.com)
- [CMS Base Layer Package](https://frontends.shopware.com/packages/cms-base-layer.html)
- [Astro Vue Integration](https://docs.astro.build/en/guides/integrations-guide/vue/)
- [UnoCSS Documentation](https://unocss.dev)

## Limitations

This is a demonstration example showing **how** to integrate cms-base-layer with Astro. For production use:

- Set up proper Shopware API authentication
- Implement state management for Shopware context
- Handle error states and loading states properly
- Configure proper routing integration
- Add proper TypeScript types for all components

## License

This example is part of the Shopware Frontends monorepo and follows the same license.
