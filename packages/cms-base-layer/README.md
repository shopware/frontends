# shopware/frontends - cms-base

[![](https://img.shields.io/npm/v/@shopware/cms-base-layer?color=blue&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCA0ODggNTUzIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNNDM5LjA0MSAxMjkuNTkzTDI1OC43NjkgMzEuMzA3NkMyNDQuOTE1IDIzLjc1NDEgMjI4LjExNiAyNC4wMDkzIDIxNC40OTcgMzEuOTgwMkw0Ny4yNjkgMTI5Ljg1OEMzMy40NzYzIDEzNy45MzEgMjUgMTUyLjcxMyAyNSAxNjguNjk1VjM4OC40NjZDMjUgNDA0LjczMiAzMy43Nzg1IDQxOS43MzIgNDcuOTYwMiA0MjcuNjk5TDIxNS4xNzggNTIxLjYzNkMyMjguNDUxIDUyOS4wOTIgMjQ0LjU5MyA1MjkuMzMyIDI1OC4wODIgNTIyLjI3NEw0MzguMzY0IDQyNy45MzRDNDUzLjIwMSA0MjAuMTcgNDYyLjUgNDA0LjgwOSA0NjIuNSAzODguMDYzVjE2OS4xMDJDNDYyLjUgMTUyLjYzMiA0NTMuNTAyIDEzNy40NzcgNDM5LjA0MSAxMjkuNTkzWiIgc3Ryb2tlPSJ1cmwoI3BhaW50MF9saW5lYXJfMTUzXzY5MjY1KSIgc3Ryb2tlLXdpZHRoPSI1MCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzE1M182OTI2NSIgeDE9Ii0xNi4yOTg5IiB5MT0iMTY1LjM0OSIgeDI9IjI3Ni40MTIiIHkyPSItODkuMzIzNCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDA4NUZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0MwRTJGNSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPg==)](https://npmjs.com/package/@shopware/cms-base-layer)
[![](https://img.shields.io/github/package-json/v/shopware/frontends?color=blue&filename=packages%2Fcms-base-layer%2Fpackage.json&label=cms-base%40monorepo&logo=github)](https://github.com/shopware/frontends/tree/main/packages/cms-base-layer)
[![](https://img.shields.io/github/issues/shopware/frontends/cms-base?label=cms-base%20issues&logo=github)](https://github.com/shopware/frontends/issues?q=is%3Aopen+is%3Aissue+label%3Acms-base)
[![](https://img.shields.io/github/license/shopware/frontends?color=blue)](#)

Nuxt [layer](https://nuxt.com/docs/getting-started/layers) that provides an implementation of all CMS components in Shopware [based on utility-classes](https://frontends.shopware.com/framework/styling.html) using atomic css syntax (UnoCss / Tailwind).

It is useful for projects that want to use the CMS components but design their own layout.

## Features

- Vue components for [Shopping Experiences](https://www.shopware.com/en/products/shopping-experiences/) CMS
- CMS sections, blocks and elements styled using [Tailwind CSS](https://tailwindcss.com/) classes
- 🚀 Empowered by [@shopware/composables](https://www.npmjs.com/package/@shopware/composables)

## Setup

Install npm package:

<!-- automd:pm-install name="@shopware/cms-base-layer" dev -->

```sh
# ✨ Auto-detect
npx nypm install -D @shopware/cms-base-layer

# npm
npm install -D @shopware/cms-base-layer

# yarn
yarn add -D @shopware/cms-base-layer

# pnpm
pnpm install -D @shopware/cms-base-layer

# bun
bun install -D @shopware/cms-base-layer

# deno
deno install --dev @shopware/cms-base-layer
```

<!-- /automd -->

Then, register the Nuxt layer in `nuxt.config.ts` file:

<!-- automd:file src="templates/vue-blank/nuxt.config.ts" code -->

```ts [nuxt.config.ts]
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  extends: ["@shopware/composables/nuxt-layer", "@shopware/cms-base-layer"],
  shopware: {
    endpoint: "https://demo-frontends.shopware.store/store-api/",
    accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
  },
  modules: ["@shopware/nuxt-module"],
  /**
   * Commented because of the StackBlitz error
   * Issue: https://github.com/shopware/frontends/issues/88
   */
  typescript: {
    // typeCheck: true,
    strict: true,
  },
  telemetry: false,
});
```

<!-- /automd -->

## Basic usage

Since all CMS components are registered in your Nuxt application, you can now start using them in your template (no imports needed):

```js
/* Vue component */

// response object can be a Product|Category|Landing Page response from Shopware 6 store-api containing a layout (cmsPage object) built using  Shopping Experiences
<template>
    <CmsPage v-if="response.cmsPage" :content="response.cmsPage"/>
</template>
```

> You can use default styling by installing/importing Tailwind CSS stylesheet in your project.

See a [short guide](https://frontends.shopware.com/getting-started/cms/content-pages.html#use-the-cms-base-package) how to use `cms-base` package in your project based on Nuxt v3.

## Default styling

The components are styled using [Tailwind CSS](https://tailwindcss.com/) utility classes, so you can use them in your project without any additional configuration if your project uses Tailwind CSS. 

This layer provides a default Tailwind CSS configuration (see [uno.config.ts](./uno.config.ts) for details), which is used to style the components. If you want to customize the styling, you can do so by creating your own Tailwind CSS configuration file and extending the default one:

```ts [nuxt.config.ts]
// nuxt.config.ts
export default defineNuxtConfig({
  // ...
  unocss: {
    nuxtLayers: true, // enable Nuxt layers for UnoCSS
  },
})
```

```ts [uno.config.ts]
// uno.config.ts
import config from './.nuxt/uno.config.mjs'

export default config
```

Thanks to this, you can **use the default configuration** provided by this layer, or **extend/overwrite** it with your own customizations in your end-project:

```ts [uno.config.ts]
// uno.config.ts
import { mergeConfigs } from '@unocss/core'
import config from './.nuxt/uno.config.mjs'

export default mergeConfigs([config, {
  theme: {
    colors: {
      primary: '#ff3e00',
      secondary: '#1c1c1c',
    },
  },
}])

```

See the [UnoCSS reference](https://unocss.dev/integrations/nuxt#configuration) for more information on how to configure UnoCSS in Nuxt when work with layers.

## 🖼️ Image Optimization

This layer includes [Nuxt Image](https://image.nuxt.com/) configuration optimized for Shopware 6 instances, with a custom provider that maps Nuxt Image modifiers to Shopware's query parameters (`width`, `height`, `quality`, `format`, `fit`).

> **Note for Cloud (SaaS) Users:** Image optimization and all modifiers used in the Nuxt Image module are handled automatically by Shopware Cloud infrastructure powered by [Fastly CDN](https://developer.shopware.com/docs/products/paas/shopware/cdn/). No additional configuration or plugins are required - simply use `<NuxtImg>` and all transformations (format conversion, quality adjustment, responsive sizing) work out of the box through Fastly's Image Optimizer.

### Features

- ✅ Automatic WebP/AVIF format conversion
- ✅ Responsive image sizing based on viewport
- ✅ Lazy loading support
- ✅ Quality optimization
- ✅ Multiple image presets for common use cases
- ✅ Works with Shopware Cloud (SaaS) and self-hosted instances

### Configuration

The layer comes pre-configured with optimized settings. No additional setup is required! The configuration includes:

**Available Presets:**
- `productCard` - Product listing images (WebP, quality 90, cover fit)
- `productDetail` - Product detail page images (WebP, quality 90, contain fit)
- `thumbnail` - Small thumbnails (150x150, WebP, quality 90)
- `hero` - Hero banners (WebP, quality 95, cover fit)

**Responsive Breakpoints:**
- `xs: 320px`, `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `xxl: 1536px`

### Usage in Components

Replace standard `<img>` tags with `<NuxtImg>` to enable automatic optimization:

```vue
<!-- Using presets -->
<NuxtImg
  src="https://cdn.shopware.store/media/path/to/image.jpg"
  preset="productCard"
  :width="400"
  alt="Product"
  loading="lazy"
/>

<!-- Custom modifiers -->
<NuxtImg
  src="https://cdn.shopware.store/media/path/to/image.jpg"
  :width="800"
  :height="600"
  format="webp"
  :quality="85"
  fit="cover"
  alt="Custom image"
/>

<!-- Using with dynamic Shopware media URLs -->
<NuxtImg
  :src="product.cover.media.url"
  preset="productDetail"
  :width="800"
  :alt="product.cover.media.alt"
/>
```

### Supported Modifiers

Shopware supports the following URL parameters for image transformation:

| Modifier | Description | Example | Support |
|----------|-------------|---------|---------|
| `width` | Image width in pixels | `400` | ✅ Always supported |
| `height` | Image height in pixels | `600` | ✅ Always supported |
| `quality` | Image quality (0-100) | `85` | ⚠️ Cloud/Plugin required* |
| `format` | Output format | `webp`, `avif`, `jpg`, `png` | ⚠️ Cloud/Plugin required* |
| `fit` | Resize behavior | `cover`, `contain`, `fill` | ⚠️ Cloud/Plugin required* |

*Advanced transformations (quality, format, fit) are available in:
- **Shopware Cloud (SaaS)**: Built-in support via managed infrastructure. For a complete list of supported image transformation parameters, see [Fastly Image Optimizer Query Parameters](https://www.fastly.com/documentation/reference/io/#query-parameters).
- **Self-hosted instances**: Require thumbnail processor plugins like [FroshPlatformThumbnailProcessor](https://github.com/FriendsOfShopware/FroshPlatformThumbnailProcessor) or third-party CDN integration

### How It Works

This layer includes a custom Shopware provider for Nuxt Image that maps modifiers to Shopware's query parameters:
- `width` modifier → `?width=400`
- `height` modifier → `?height=300`
- `quality` modifier → `?quality=85`
- `format` modifier → `?format=webp`
- `fit` modifier → `?fit=cover`

When you use `<NuxtImg>`, the custom provider automatically converts your component props into the correct URL format for Shopware. The images are then processed on-the-fly by Shopware Cloud (SaaS) infrastructure or your configured thumbnail processor.

#### 🔍 Understanding Image Processing in Shopware

**Built-in Thumbnail Generation:**
Shopware has native thumbnail generation (using GD2 or ImageMagick) that creates predefined sizes (400x400, 800x800, 1920x1920) during image upload. These thumbnails are generated once and stored on your server.

**Dynamic On-the-Fly Transformations:**
For dynamic image transformations via query parameters (like `?width=800&format=webp`), you need **remote thumbnail generation** configured:

- **Shopware Cloud (SaaS)**: ✅ Fully supported out-of-the-box via Fastly CDN - all query parameters work automatically
- **Self-hosted**: ⚠️ Requires additional setup:
  - Install a plugin like [FroshPlatformThumbnailProcessor](https://github.com/FriendsOfShopware/FroshPlatformThumbnailProcessor) for on-the-fly processing, OR
  - Configure external middleware (Thumbor, Sharp, imgproxy) via [remote thumbnail generation](https://developer.shopware.com/docs/guides/plugins/plugins/content/media/remote-thumbnail-generation.html)

**Without remote thumbnail generation configured**, query parameters will be ignored and only the predefined static thumbnails will be served.

> **💡 Recommendation**: If you're self-hosting Shopware and want to use dynamic image transformations with Nuxt Image modifiers, install the FroshPlatformThumbnailProcessor plugin first to enable on-the-fly processing.

### Customizing Configuration

You can extend or override the default settings in your project's `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: ["@shopware/cms-base-layer"],

  image: {
    // Change default quality
    quality: 85,

    // Add/change formats
    formats: ['avif', 'webp', 'jpg'],

    // Override or add presets
    presets: {
      // Override existing preset
      productCard: {
        modifiers: {
          format: 'avif',
          quality: 80,
          fit: 'cover',
        }
      },
      // Add custom preset
      categoryBanner: {
        modifiers: {
          format: 'webp',
          quality: 90,
          width: 1200,
          height: 400,
          fit: 'cover',
        }
      }
    }
  }
})
```

## 🖼️ Image Placeholder

This layer provides a `useImagePlaceholder` composable that generates an SVG placeholder for images during loading. The placeholder features a centered icon with a subtle background.

### Customizing Placeholder Color

You can customize the placeholder color globally in your project's `app.config.ts`:

```ts
export default defineAppConfig({
  imagePlaceholder: {
    color: "#your-color-here", // Default: #543B95
  },
});
```

Or use a custom color for specific instances:

```vue
<script setup>
const customPlaceholder = useImagePlaceholder("#FF0000");
</script>

<template>
  <NuxtImg :placeholder="customPlaceholder" src="..." />
</template>
```

## 🖼️ Background Image Optimization

CMS sections and blocks can have background images set via the Shopware admin. This layer automatically optimizes those background image URLs by appending `format` and `quality` query parameters — bringing the same optimization applied to `<NuxtImg>` components to CSS background images.

Both `CmsPage` (for section backgrounds) and `CmsGenericBlock` (for block backgrounds) read the configuration from `app.config.ts` and pass it to the `getBackgroundImageUrl` helper from `@shopware/helpers`.

### Configuration

Default values are set in `app.config.ts` and can be overridden in your project:

```ts
export default defineAppConfig({
  backgroundImage: {
    format: "webp", // Default: "webp" — output format ("webp" | "avif" | "jpg" | "png")
    quality: 90, // Default: 90 — image quality (0-100)
  },
});
```

Setting `format` or `quality` to `undefined` (or omitting the key) will skip that parameter in the generated URL.

### How It Works

When a CMS section or block has a `backgroundMedia` set, the components call `getBackgroundImageUrl()` which:

1. Extracts the raw image URL from the CSS `url()` value
2. Appends `width` or `height` based on the image's original dimensions (capped at 1920px)
3. Adds `fit=crop,smart` for intelligent cropping
4. Appends `format` and `quality` from `app.config.ts` if provided

**Example generated URL:**
```
url("https://cdn.shopware.store/.../image.jpg?width=1000&fit=crop,smart&format=webp&quality=85")
```

> **Note:** Like other dynamic image transformations, background image optimization requires remote thumbnail generation support. See the [Image Optimization](#%EF%B8%8F-image-optimization) section above for Shopware Cloud vs. self-hosted requirements.

## LCP Image Preload

This layer includes a `useLcpImagePreload` composable that automatically preloads the first image found in CMS page content. This targets the [Largest Contentful Paint (LCP)](https://web.dev/lcp/) element, which is often a hero background image or the first visible image element.

### How it works

The composable scans CMS sections in document order, checking:
1. Section background images (`section.backgroundMedia`)
2. Block background images (`block.backgroundMedia`)
3. Image element media (`slot.data.media`)

The first image found is injected as a `<link rel="preload" as="image" fetchpriority="high">` in the `<head>` during SSR. This allows the browser to start fetching the LCP image immediately, before parsing CSS or executing JavaScript. The `fetchpriority="high"` attribute ensures the preload is prioritized — this is especially useful for background images which don't natively support `fetchpriority`.

### Usage

The composable is already called in `CmsPage.vue`. If you override `CmsPage`, you can use it in your custom component:

```vue
<script setup>
import { useLcpImagePreload } from "@shopware/cms-base-layer/composables/useLcpImagePreload";

const props = defineProps<{ content: Schemas["CmsPage"] }>();

useLcpImagePreload(props.content?.sections || []);
</script>
```

The preload URL includes the optimized `format` and `quality` parameters from `app.config.ts` for both background images and element images.

## Responsive CMS Images

CMS image elements (`CmsElementImage`) automatically serve appropriately-sized images using responsive `srcset` and `sizes` attributes. This prevents the browser from downloading images larger than their displayed dimensions — a common Lighthouse performance issue.

### How it works

1. **`CmsGenericBlock`** counts the number of slots in each block, `provide`s a responsive `sizes` value (e.g., a 2-slot block means images are ~50% viewport width on desktop), and `provide`s the slot count via `cms-block-slot-count` for slider SSR breakpoint scaling.
2. **`CmsElementImage`** `inject`s the sizes hint and applies it to `<NuxtImg>`.
3. If the media has **pre-generated thumbnails** from Shopware, the existing `srcset` from thumbnails is used.
4. If **no thumbnails** exist, a synthetic `srcset` is generated using CDN width-based resizing (`?width=400`, `?width=800`, etc.) via the `generateCdnSrcSet` helper from `@shopware/helpers`.
5. **Slider components** (`CmsElementProductSlider`, `CmsElementCrossSelling`) `inject` the slot count to scale their SSR breakpoints — ensuring media queries account for the container being a fraction of the viewport (e.g., a 2-slot block doubles the breakpoint thresholds).

The browser combines `sizes` + `srcset` to download only the image size it actually needs — during HTML parsing, before any JavaScript runs.

### Configuration

Default slot-count-to-sizes mappings are set in `app.config.ts` and can be overridden:

```ts
export default defineAppConfig({
  imageSizes: {
    // slot count → sizes attribute value
    1: "(max-width: 768px) 100vw, 100vw",   // full-width blocks
    2: "(max-width: 768px) 100vw, 50vw",    // two-column blocks (e.g., image-text)
    3: "(max-width: 768px) 100vw, 33vw",    // three-column blocks
    default: "(max-width: 768px) 50vw, 25vw", // 4+ columns
  },
});
```

For example, to cap image sizes at a fixed pixel width for boxed layouts:

```ts
export default defineAppConfig({
  imageSizes: {
    1: "(max-width: 768px) 100vw, 1200px",
    2: "(max-width: 768px) 100vw, 600px",
    3: "(max-width: 768px) 100vw, 400px",
    default: "(max-width: 768px) 50vw, 300px",
  },
});
```

### Per-block override

Individual block components can override the sizes value by calling `provide("cms-image-sizes", "custom value")` — this takes precedence over the default from `CmsGenericBlock`.

### Synthetic srcset fallback

When Shopware media has no thumbnails (common in Cloud/SaaS setups using CDN-based resizing), the layer generates a synthetic `srcset` using CDN query parameters:

```html
<img srcset="
  ...image.jpg?width=400&fit=crop,smart&format=webp&quality=90 400w,
  ...image.jpg?width=800&fit=crop,smart&format=webp&quality=90 800w,
  ...image.jpg?width=1200&fit=crop,smart&format=webp&quality=90 1200w,
  ...image.jpg?width=1600&fit=crop,smart&format=webp&quality=90 1600w"
  sizes="(max-width: 768px) 100vw, 50vw"
>
```

The `format` and `quality` values are taken from the `backgroundImage` config in `app.config.ts`.

> **Note:** Synthetic srcset requires CDN-based image resizing support. See the [Image Optimization](#%EF%B8%8F-image-optimization) section for requirements.

## 🔄 UnoCSS Runtime

This layer includes a client-side [UnoCSS runtime](https://unocss.dev/integrations/runtime) plugin that resolves utility classes dynamically at runtime using a DOM MutationObserver. This is useful when CMS content from Shopware contains utility classes that aren't known at build time (e.g., inline styles or dynamic class bindings from the admin panel).

The runtime is **enabled by default**. To disable it, set `unocssRuntime` to `false` in your project's `app.config.ts`:

```ts
export default defineAppConfig({
  unocssRuntime: false,
});
```

> **When to disable**: If you don't use dynamic CMS utility classes, or if you experience performance issues caused by the MutationObserver in pages with frequent DOM mutations.

## 📘 Available components

The list of available blocks and elements is [here](https://frontends.shopware.com/packages/cms-base-layer.html#available-components).

## 🔄 Overwriting components

The procedure is:

- find a component in component's [list](https://frontends.shopware.com/packages/cms-base.html#available-components), using a [Vue devtools](https://devtools.vuejs.org/) or browsing the github [repository](https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components)
- take its name
- create a file with the same name and place it into `~/components` dir in your nuxt project (or wherever according your nuxt config)

✅ Thanks to this, nuxt will take the component registered in your app instead of the one registered by this nuxt layer.

### Internal components

❗**Internal components are not a part of public API. Once overwritten you need to track the changes on your own.**

There is also a possibility to override the internal components, shared between public blocks and elements, the ones starting with `Sw` prefix, like [SwSlider.vue](https://github.com/shopware/frontends/blob/main/packages/cms-base-layer/app/components/SwSlider.vue) or [SwProductCard.vue](https://github.com/shopware/frontends/blob/main/packages/cms-base-layer/app/components/SwProductCard.vue).

An example: some components use `SwSharedPrice.vue` to show prices with corresponding currency for products in many places like product card, product details page and so on. In order to change the way how the price is displayed consistently - create a one component with a name `SwSharedPrice.vue` and that's it. The new component will be used everywhere where is "imported" (autoimported actually).

### ⚠️ `<RouterLink/>` components used

Some components use `RouterLink` component internally, available in [Vue Router](https://github.com/vuejs/router).
In order to parse CMS components correctly and avoid missing component warning, it's **highly recommended** to have **Vue Router installed** or **Nuxt router enabled** in your application.

## TypeScript support

All components are fully typed with TypeScript.

No additional packages needed to be installed.

## Links

- [📘 Documentation](https://frontends.shopware.com)

- [👥 Community](https://discord.com/channels/1308047705309708348/1405501315160739951) (`#composable-frontend`)

<!-- AUTO GENERATED CHANGELOG -->

## Changelog

Full changelog for stable version is available [here](https://github.com/shopware/frontends/blob/main/packages/cms-base-layer/CHANGELOG.md)

### Latest changes: 2.0.0

### Major Changes

- [#1944](https://github.com/shopware/frontends/pull/1944) [`c41a839`](https://github.com/shopware/frontends/commit/c41a8397538e5b18475134635cc44295c34dde2d) Thanks [@mkucmus](https://github.com/mkucmus)! - Updates the `@shopware/cms-base-layer` package with the following changes:
  - Adds support for the new `SwQuantitySelect` component
  - Updates the `SwProductAddToCart` component to use the new `SwQuantitySelect` component
  - Fixes the `Status` component to use the new state classes
  - Updates the `uno.config.ts` file to include default styling that can be used and extended in the end-project:

  ## Nuxt UnoCSS Configuration Example

  ```ts
  // nuxt.config.ts in your end-project
  {
    unocss: {
      nuxtLayers: true; // enable Nuxt layers support in order to merge UnoCSS configurations
    }
  }
  ```

  ## UnoCSS Configuration Example

  ```ts
  // uno.config.ts in your end-project
  import { mergeConfigs } from "@unocss/core";
  import baseConfig from "./.nuxt/uno.config.mjs";

  export default mergeConfigs(baseConfig, {
    // will be merged with the base config - all optional
    theme: {
      colors: {
        "brand-primary": "#ff3e00",
        "brand-secondary": "#ff6a00",
      },
    },
    safelist: ["states-success"],
    preflights: [
      {
        getCSS: () => `
          body {
              font-family: 'Inter', sans-serif;
              -moz-osx-font-smoothing: grayscale;
              -webkit-font-smoothing: antialiased;
          }
          `,
      },
    ],
  });
  ```

### Minor Changes

- [#2030](https://github.com/shopware/frontends/pull/2030) [`22ff62e`](https://github.com/shopware/frontends/commit/22ff62e354f024599d64ea8096af57695248851c) Thanks [@mkucmus](https://github.com/mkucmus)! - Introduce new UI components, refine listing filters (structure and UX), add global collapse animations, and improve type safety.

  ### Features
  - New UI components:
    - SwFilterChips – shows active filters as removable chips
    - SwSortDropdown – sorting dropdown
    - SwProductListingPagination – listing pagination
    - Checkbox – reusable checkbox
    - ChevronIcon – configurable chevron (up/down/left/right)
    - RadioButton – reusable radio button
    - SwitchButton – toggle switch

  ### Refactors
  - SwFilterProperties:
    - Replace computed factory with `isChecked()` and `selectValue()` helpers for better performance and readability.
  - Filter collapse animation:
    - Unified expand/collapse animations for SwFilterProperties, SwFilterRating, SwFilterShippingFree, and SwFilterPrice using UnoCSS preflights.

  ### TypeScript fixes
  - SwProductListingFilters:
    - Provide fallbacks (`?? []`, `?? ''`) when passing `getSortingOrders` and `getCurrentSortingOrder`.
  - SwFilterChips:
    - Relax prop types to accept union types compatible with both full Shopware schemas and simplified helper types.

  ### Code quality improvements
  - SwFilterPrice:
    - Remove unnecessary optional chaining on `props.selectedFilters` to prevent masking undefined errors
  - Checkbox component:
    - Replace `outline-blue-500` with `outline-brand-primary` for brand consistency
    - Make `label` prop optional to support checkbox-only pattern
  - SwFilterShippingFree:
    - Add i18n support using `useCmsTranslations` instead of hardcoded "free delivery" text
  - SwFilterProperties:
    - Remove unnecessary empty label prop from Checkbox usage

  **Note:** Transition classes are globally available via UnoCSS preflights.

- [#2139](https://github.com/shopware/frontends/pull/2139) [`20d1066`](https://github.com/shopware/frontends/commit/20d106638958170dd191ac3d95e3e536f3fcc787) Thanks [@mkucmus](https://github.com/mkucmus)! - Added a new `SwProductReviewsForm` component that allows logged-in customers to submit product reviews.

- [#1959](https://github.com/shopware/frontends/pull/1959) [`c77daa6`](https://github.com/shopware/frontends/commit/c77daa6a11e96c7f3688b16f7da010b54c7f5e8b) Thanks [@patzick](https://github.com/patzick)! - Updated default types to Shopware 6.7

- [#2176](https://github.com/shopware/frontends/pull/2176) [`c647baf`](https://github.com/shopware/frontends/commit/c647baf93e7174b849f5961ee5803add99d78602) Thanks [@mkucmus](https://github.com/mkucmus)! - - Extract product listing data early from CMS page responses to enable SSR rendering
  - Remove ClientOnly wrappers from `SwProductListingFilters` and `SwFilterChips` components
  - Resolve hydration mismatches on category pages with filters

### Patch Changes

- [#2174](https://github.com/shopware/frontends/pull/2174) [`e9f3d97`](https://github.com/shopware/frontends/commit/e9f3d972d7a126ec72f405a3595e53a61f6180f9) Thanks [@mkucmus](https://github.com/mkucmus)! - Added a new image placeholder.

- [#2162](https://github.com/shopware/frontends/pull/2162) [`e1fae3e`](https://github.com/shopware/frontends/commit/e1fae3eb6430e5c8e133456fbaf7f215f80c36f6) Thanks [@mkucmus](https://github.com/mkucmus)! - Replace hardcoded colors with theme tokens, add image placeholder composable, improve URL encoding for special characters in image paths, enhance CMS block layouts, and use useTemplateRef for better type safety

- [#2128](https://github.com/shopware/frontends/pull/2128) [`efe125e`](https://github.com/shopware/frontends/commit/efe125e7bea273bb904356114cf93adf68a416fb) Thanks [@mkucmus](https://github.com/mkucmus)! - Enhanced SwProductReviews component with reviewer names, shop feedback, and star ratings using direct SVG imports.

- [#2008](https://github.com/shopware/frontends/pull/2008) [`3a1bca9`](https://github.com/shopware/frontends/commit/3a1bca983c4fc866c67b90897bd86d7488f8cac8) Thanks [@mkucmus](https://github.com/mkucmus)! - Added missing labels for `SwQuantitySelect` component.

- [#1951](https://github.com/shopware/frontends/pull/1951) [`3f2379b`](https://github.com/shopware/frontends/commit/3f2379bdc428b481943cbcf3711a37cb91e2d298) Thanks [@mkucmus](https://github.com/mkucmus)! - Use proper paths for components configuration

- [#2154](https://github.com/shopware/frontends/pull/2154) [`168989e`](https://github.com/shopware/frontends/commit/168989e51e5c81c4cbb746c132d6561c019e046a) Thanks [@mkucmus](https://github.com/mkucmus)! - Implicitly set public components as global to expose them for templates that extend from the base one.

- Updated dependencies [[`87771c3`](https://github.com/shopware/frontends/commit/87771c3b7a4521fcdba43cb4c967b61f5db01b3e), [`22ff62e`](https://github.com/shopware/frontends/commit/22ff62e354f024599d64ea8096af57695248851c), [`a44d871`](https://github.com/shopware/frontends/commit/a44d8712d9ae5ee196c03ac8b894f3d1392d0e68), [`e43d9b7`](https://github.com/shopware/frontends/commit/e43d9b7f559af21be8b66f2021cea2d14940e4aa), [`2cbda25`](https://github.com/shopware/frontends/commit/2cbda257a1056454e12f2fba9052f83eecb6d986), [`2cbda25`](https://github.com/shopware/frontends/commit/2cbda257a1056454e12f2fba9052f83eecb6d986), [`7fe2ef9`](https://github.com/shopware/frontends/commit/7fe2ef96a9d9d156683b85d31f0a660458c9fbfd), [`70dcf95`](https://github.com/shopware/frontends/commit/70dcf95d4370c63964d877a5cab113a53f93ca19), [`56cd178`](https://github.com/shopware/frontends/commit/56cd178e25fe2399b7170ccac3044e980621f041), [`c647baf`](https://github.com/shopware/frontends/commit/c647baf93e7174b849f5961ee5803add99d78602), [`e1fae3e`](https://github.com/shopware/frontends/commit/e1fae3eb6430e5c8e133456fbaf7f215f80c36f6), [`c647baf`](https://github.com/shopware/frontends/commit/c647baf93e7174b849f5961ee5803add99d78602), [`c77daa6`](https://github.com/shopware/frontends/commit/c77daa6a11e96c7f3688b16f7da010b54c7f5e8b)]:
  - @shopware/composables@1.10.0
  - @shopware/helpers@1.6.0
  - @shopware/api-client@1.4.0
