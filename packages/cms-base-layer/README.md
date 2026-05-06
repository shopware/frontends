# shopware/frontends - cms-base

[![](https://img.shields.io/npm/v/@shopware/cms-base-layer?color=blue&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCA0ODggNTUzIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNNDM5LjA0MSAxMjkuNTkzTDI1OC43NjkgMzEuMzA3NkMyNDQuOTE1IDIzLjc1NDEgMjI4LjExNiAyNC4wMDkzIDIxNC40OTcgMzEuOTgwMkw0Ny4yNjkgMTI5Ljg1OEMzMy40NzYzIDEzNy45MzEgMjUgMTUyLjcxMyAyNSAxNjguNjk1VjM4OC40NjZDMjUgNDA0LjczMiAzMy43Nzg1IDQxOS43MzIgNDcuOTYwMiA0MjcuNjk5TDIxNS4xNzggNTIxLjYzNkMyMjguNDUxIDUyOS4wOTIgMjQ0LjU5MyA1MjkuMzMyIDI1OC4wODIgNTIyLjI3NEw0MzguMzY0IDQyNy45MzRDNDUzLjIwMSA0MjAuMTcgNDYyLjUgNDA0LjgwOSA0NjIuNSAzODguMDYzVjE2OS4xMDJDNDYyLjUgMTUyLjYzMiA0NTMuNTAyIDEzNy40NzcgNDM5LjA0MSAxMjkuNTkzWiIgc3Ryb2tlPSJ1cmwoI3BhaW50MF9saW5lYXJfMTUzXzY5MjY1KSIgc3Ryb2tlLXdpZHRoPSI1MCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzE1M182OTI2NSIgeDE9Ii0xNi4yOTg5IiB5MT0iMTY1LjM0OSIgeDI9IjI3Ni40MTIiIHkyPSItODkuMzIzNCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDA4NUZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0MwRTJGNSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPg==)](https://npmjs.com/package/@shopware/cms-base-layer)
[![](https://img.shields.io/github/package-json/v/shopware/frontends?color=blue&filename=packages%2Fcms-base-layer%2Fpackage.json&label=cms-base%40monorepo&logo=github)](https://github.com/shopware/frontends/tree/main/packages/cms-base-layer)
[![](https://img.shields.io/github/issues/shopware/frontends/cms-base?label=cms-base%20issues&logo=github)](https://github.com/shopware/frontends/issues?q=is%3Aopen+is%3Aissue+label%3Acms-base)
[![](https://img.shields.io/github/license/shopware/frontends?color=blue)](#)

Nuxt [layer](https://nuxt.com/docs/getting-started/layers) that provides an implementation of all CMS components in Shopware [based on utility-classes](https://frontends.shopware.com/framework/styling.html).

It is useful for projects that want to use the CMS components while keeping CMS functionality separate from the styling system and design tokens.

## Features

- Vue components for [Shopping Experiences](https://www.shopware.com/en/products/shopping-experiences/) CMS
- CMS sections, blocks and elements implemented with utility-class-based markup
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

If you also want the shared Shopware Frontends UnoCSS setup, install `@shopware/unocss-design-tokens-layer` in your app and extend it alongside `@shopware/cms-base-layer`.

Then, register the Nuxt layer in `nuxt.config.ts` file:

<!-- automd:file src="templates/vue-blank/nuxt.config.ts" code -->

```ts [nuxt.config.ts]
// https://v3.nuxtjs.org/api/configuration/nuxt.config
const isStackBlitz = process.env.SHOPWARE_STACKBLITZ === "true";

export default defineNuxtConfig({
  extends: ["@shopware/composables/nuxt-layer", "@shopware/cms-base-layer"],
  ...(isStackBlitz ? { devtools: { enabled: false } } : {}),
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

> `@shopware/cms-base-layer` no longer owns the default UnoCSS theme. If you want the shared Shopware Frontends design tokens and UnoCSS defaults, extend `@shopware/unocss-design-tokens-layer` as shown above.

See a [short guide](https://frontends.shopware.com/getting-started/cms/content-pages.html#use-the-cms-base-package) on how to use `cms-base-layer` in your Nuxt project.

## Styling and Design Tokens

The components use utility classes, but the shared UnoCSS configuration, design tokens, and runtime handling for dynamic CMS classes are now provided by `@shopware/unocss-design-tokens-layer`.

This means you have two options:

- extend `@shopware/unocss-design-tokens-layer` to use the shared Shopware Frontends token palette and UnoCSS defaults
- keep only `@shopware/cms-base-layer` and provide your own UnoCSS or Tailwind setup

When you use the design-tokens layer, you can customize the generated config in your project's `uno.config.ts`:

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
import { mergeConfigs } from '@unocss/core'
import baseConfig from './.nuxt/uno.config.mjs'

export default mergeConfigs([baseConfig, {
  theme: {
    colors: {
      'brand-primary': '#ff3e00',
      'brand-secondary': '#1c1c1c',
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

Images are optimized to prevent the browser from downloading images larger than their displayed dimensions — a common Lighthouse performance issue.

### Product Card Images (`SwProductCardImage`)

The `productCard` preset only defines URL modifiers (format/quality/fit). `width`/`height`/`densities`/`loading` stay on the component — NuxtImg presets don't propagate these reliably:

```ts
// nuxt.config.ts
productCard: {
  modifiers: { format: "webp", quality: 90, fit: "cover" },
}
```

```vue
<NuxtImg preset="productCard"
  :src="coverSrcPath"
  width="400" height="400"
  densities="1x"
  loading="lazy" />
```

- **Fixed `width`/`height`** (400px) — avoid hydration mismatches caused by dynamic DOM measurement
- **`densities="1x"`** — prevents duplicate retina requests
- **`loading="lazy"`** — defers off-viewport images

> **⚠️ Avoid** adding `decoding` or `sizes` props on the component — they trigger Vue hydration attribute mismatches with NuxtImg, which cause duplicate image requests.

### CMS Images (`CmsElementImage`)

CMS image elements use `useElementSize()` to measure the rendered container and pass the size to `<NuxtImg>` via `width`/`height` props:

- During SSR, no image is fetched (size is `undefined`)
- After hydration, the container is measured and a single correctly-sized image is requested
- The size is multiplied by 2 (for retina) and rounded up to the nearest 100px

### Slider Components

**Slider components** (`CmsElementProductSlider`, `CmsElementCrossSelling`) `inject` the slot count via `cms-block-slot-count` to scale their SSR breakpoints — ensuring media queries account for the container being a fraction of the viewport.

### LCP Image Preloading

**`useLcpImagePreload`** scans CMS sections for the first image and injects `<link rel="preload" as="image" fetchpriority="high">` during SSR.

## 🔄 UnoCSS Runtime

When you extend `@shopware/unocss-design-tokens-layer`, you also get a client-side [UnoCSS runtime](https://unocss.dev/integrations/runtime) plugin that resolves utility classes dynamically at runtime using a DOM MutationObserver. This is useful when CMS content from Shopware contains utility classes that aren't known at build time (for example inline utility classes configured in the admin panel).

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

### Latest changes: 3.0.0

### Major Changes

- [#2406](https://github.com/shopware/frontends/pull/2406) [`df93461`](https://github.com/shopware/frontends/commit/df93461434cb79ec9d722cdbd42a37a9af07fb03) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Remove bundled UnoCSS configuration and design tokens from the CMS layer. Consumers who relied on the previous default UnoCSS setup should extend `@shopware/unocss-design-tokens-layer` alongside this package. See the package README and framework docs for migration steps.

### Minor Changes

- [#2420](https://github.com/shopware/frontends/pull/2420) [`9e37ab6`](https://github.com/shopware/frontends/commit/9e37ab6897f501ed3d261fa619aee349e46342c2) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add FrontendAccountCustomerGroupRegistrationPage component for customer group view

### Patch Changes

- [#2389](https://github.com/shopware/frontends/pull/2389) [`05438c6`](https://github.com/shopware/frontends/commit/05438c636a6c99b48e87d8f2ff5b03bf313c4e67) Thanks [@mkucmus](https://github.com/mkucmus)! - Fix product card and CMS image sizing to prevent duplicate/oversized image requests. Move fixed dimensions and `densities="1x"` into the `productCard` preset, and use `useElementSize`-based `width`/`height` props for `CmsElementImage`.

- [#2378](https://github.com/shopware/frontends/pull/2378) [`c36bc1f`](https://github.com/shopware/frontends/commit/c36bc1ff17e8e34c52fa91e6388ce210fffb7e8e) Thanks [@patzick](https://github.com/patzick)! - Add UnoCSS directive transformation for CMS block styles so layered Nuxt apps do not emit CSS minification warnings from raw `@apply` directives during production builds.

- [#2369](https://github.com/shopware/frontends/pull/2369) [`3c16985`](https://github.com/shopware/frontends/commit/3c16985ddf3878bc207c514a5ab8e4a6409f809c) Thanks [@mkucmus](https://github.com/mkucmus)! - Fixed `xss` library loading issue in Vite dev server by adding it to `optimizeDeps.include`

- [#2371](https://github.com/shopware/frontends/pull/2371) [`33e0c69`](https://github.com/shopware/frontends/commit/33e0c69afc3de854733ab61f866ba65cce1489f6) Thanks [@patzick](https://github.com/patzick)! - Disable automatic CMS LCP image preload by default.

  The preload helper now only injects image preload tags when
  `appConfig.lcpImagePreload` is explicitly enabled, which avoids noisy preload
  warnings on storefront pages that do not immediately use the detected image.

- [#2326](https://github.com/shopware/frontends/pull/2326) [`e7efff8`](https://github.com/shopware/frontends/commit/e7efff8c615ae8d0858572933285216cc533dd0b) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Gate wishlist button behind login when useLoginModal is provided via provide/inject. For guests, show login modal on wishlist click and add product to wishlist after successful login.

- [#2346](https://github.com/shopware/frontends/pull/2346) [`a47143a`](https://github.com/shopware/frontends/commit/a47143a670f49deecc35dce4bb8b6bd12d9a3b47) Thanks [@joberthel](https://github.com/joberthel)! - Improve `SwMedia3D` model framing by fitting loaded 3D models into the viewport automatically. This fixes cases where very small 3D files appeared tiny and hard to inspect.

- Updated dependencies [[`22fc8a7`](https://github.com/shopware/frontends/commit/22fc8a7301f6a7d2612d907ab73555978b651c00), [`bea7f58`](https://github.com/shopware/frontends/commit/bea7f5882cb58c6d47c84a82db5c8ecaf9bcf8ef)]:
  - @shopware/helpers@1.7.1
  - @shopware/composables@1.11.1
