

<!-- API -->
# shopware/frontends - cms-base

[![](https://img.shields.io/npm/v/@shopware/cms-base-layer?color=blue&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCA0ODggNTUzIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNNDM5LjA0MSAxMjkuNTkzTDI1OC43NjkgMzEuMzA3NkMyNDQuOTE1IDIzLjc1NDEgMjI4LjExNiAyNC4wMDkzIDIxNC40OTcgMzEuOTgwMkw0Ny4yNjkgMTI5Ljg1OEMzMy40NzYzIDEzNy45MzEgMjUgMTUyLjcxMyAyNSAxNjguNjk1VjM4OC40NjZDMjUgNDA0LjczMiAzMy43Nzg1IDQxOS43MzIgNDcuOTYwMiA0MjcuNjk5TDIxNS4xNzggNTIxLjYzNkMyMjguNDUxIDUyOS4wOTIgMjQ0LjU5MyA1MjkuMzMyIDI1OC4wODIgNTIyLjI3NEw0MzguMzY0IDQyNy45MzRDNDUzLjIwMSA0MjAuMTcgNDYyLjUgNDA0LjgwOSA0NjIuNSAzODguMDYzVjE2OS4xMDJDNDYyLjUgMTUyLjYzMiA0NTMuNTAyIDEzNy40NzcgNDM5LjA0MSAxMjkuNTkzWiIgc3Ryb2tlPSJ1cmwoI3BhaW50MF9saW5lYXJfMTUzXzY5MjY1KSIgc3Ryb2tlLXdpZHRoPSI1MCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzE1M182OTI2NSIgeDE9Ii0xNi4yOTg5IiB5MT0iMTY1LjM0OSIgeDI9IjI3Ni40MTIiIHkyPSItODkuMzIzNCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDA4NUZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0MwRTJGNSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPg==)](https://npmjs.com/package/@shopware/cms-base-layer)
[![](https://img.shields.io/github/package-json/v/shopware/frontends?color=blue&filename=packages%2Fcms-base-layer%2Fpackage.json&label=cms-base%40monorepo&logo=github)](https://github.com/shopware/frontends/tree/main/packages/cms-base-layer)
[![](https://img.shields.io/github/issues/shopware/frontends/cms-base?label=cms-base%20issues&logo=github)](https://github.com/shopware/frontends/issues?q=is%3Aopen+is%3Aissue+label%3Acms-base)
[![](https://img.shields.io/github/license/shopware/frontends?color=blue)](#)

Nuxt [layer](https://nuxt.com/docs/getting-started/layers) that provides an implementation of all CMS components in Shopware [based on utility-classes](https://developer.shopware.com/frontends/concepts/styling.html).

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
pnpm add -D @shopware/cms-base-layer

# bun
bun install -D @shopware/cms-base-layer

# deno
deno install --dev npm:@shopware/cms-base-layer
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

See a [short guide](https://developer.shopware.com/frontends/frontends-recipes/cms/rendering.html) on how to use `cms-base-layer` in your Nuxt project.

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
});
```

```ts [uno.config.ts]
import { mergeConfigs } from "@unocss/core";
import baseConfig from "./.nuxt/uno.config.mjs";

export default mergeConfigs([
  baseConfig,
  {
    theme: {
      colors: {
        "brand-primary": "#ff3e00",
        "brand-secondary": "#1c1c1c",
      },
    },
  },
]);
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
  :alt="getTranslatedProperty(product.cover.media, 'alt')"
/>
```

The media `alt` text is a translatable field, so read it through `getTranslatedProperty` rather than
`media.alt` — the latter always holds the system language value, no matter which language the current
request asks for. The helper is not auto-imported, so add it to the component's script block:

```ts
import { getTranslatedProperty } from "@shopware/helpers";
```

### Supported Modifiers

Shopware supports the following URL parameters for image transformation:

| Modifier  | Description            | Example                      | Support                    |
| --------- | ---------------------- | ---------------------------- | -------------------------- |
| `width`   | Image width in pixels  | `400`                        | ✅ Always supported        |
| `height`  | Image height in pixels | `600`                        | ✅ Always supported        |
| `quality` | Image quality (0-100)  | `85`                         | ⚠️ Cloud/Plugin required\* |
| `format`  | Output format          | `webp`, `avif`, `jpg`, `png` | ⚠️ Cloud/Plugin required\* |
| `fit`     | Resize behavior        | `cover`, `contain`, `fill`   | ⚠️ Cloud/Plugin required\* |

\*Advanced transformations (quality, format, fit) are available in:

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
    formats: ["avif", "webp", "jpg"],

    // Override or add presets
    presets: {
      // Override existing preset
      productCard: {
        modifiers: {
          format: "avif",
          quality: 80,
          fit: "cover",
        },
      },
      // Add custom preset
      categoryBanner: {
        modifiers: {
          format: "webp",
          quality: 90,
          width: 1200,
          height: 400,
          fit: "cover",
        },
      },
    },
  },
});
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

This layer includes a `useLcpImagePreload` composable that preloads the first image found in CMS page content when enabled via `lcpImagePreload: true` in your `app.config.ts` (disabled by default). This targets the [Largest Contentful Paint (LCP)](https://web.dev/lcp/) element, which is often a hero background image or the first visible image element.

### How it works

The composable scans CMS sections in document order, checking:

1. Section background images (`section.backgroundMedia`)
2. Block background images (`block.backgroundMedia`)
3. Image element media (`slot.data.media`)

The first image found is injected as a `<link rel="preload" as="image" fetchpriority="high">` in the `<head>` during SSR. This allows the browser to start fetching the LCP image immediately, before parsing CSS or executing JavaScript. The `fetchpriority="high"` attribute ensures the preload is prioritized — this is especially useful for background images which don't natively support `fetchpriority`.

### Usage

The composable is already called in `CmsPage.vue`. If you override `CmsPage`, you can use it in your custom component. It is auto-imported once your app extends this layer, so it needs no import statement:

```vue
<script setup>
const props = defineProps<{ content: Schemas["CmsPage"] }>();

useLcpImagePreload(props.content?.sections || []);
</script>
```

The preload URL includes the optimized `format` and `quality` parameters from `app.config.ts` for both background images and element images.

## Responsive CMS Images

Images are optimized to prevent the browser from downloading images larger than their displayed dimensions — a common Lighthouse performance issue.

### Product Card Images (`SwProductCardImage`)

The `productCard` preset only defines URL modifiers (format/quality/fit). `width`/`height` and `loading` stay on the component: in `@nuxt/image` 2.1.0 a preset carries `width`/`height` only as `modifiers`, which shape the URL rather than the rendered attributes, and `loading` is not a preset field at all. `densities` is kept alongside them for consistency, though a preset would propagate it:

```ts
// nuxt.config.ts
productCard: {
  modifiers: { format: "webp", quality: 90, fit: "cover" },
}
```

```vue
<NuxtImg
  preset="productCard"
  :src="coverSrcPath"
  width="400"
  height="400"
  densities="1x"
  loading="lazy"
/>
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

The list of available blocks and elements is [here](https://developer.shopware.com/frontends/packages/cms-base-layer.html#available-components).

## 🔄 Overwriting components

The procedure is:

- find a component in component's [list](https://developer.shopware.com/frontends/packages/cms-base-layer.html#available-components), using a [Vue devtools](https://devtools.vuejs.org/) or browsing the github [repository](https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components)
- take its name
- create a file with the same name and place it under a `components` directory that your `nuxt.config.ts` registers with `global: true` — CMS components are looked up with `resolveComponent`, so an override outside a global path is never found and this layer's version keeps rendering with no error. In the starter template that directory is `app/components/cms/`; because it is registered with `pathPrefix: false`, the name comes from the filename alone and subdirectory depth under it does not matter.

✅ Thanks to this, nuxt will take the component registered in your app instead of the one registered by this nuxt layer.

### App blocks (`app-renderer`)

Every block an app registers through the Meteor Admin SDK (`cms.registerCmsBlock`) reaches the Store API with the type `app-renderer`, so they all render through `CmsBlockAppRenderer`. By default it places the block's slots in the CSS grid the app declared, like the Storefront's fallback, in the order the app declared them.

To give one app block its own markup, add a global component named after the block, `CmsBlockAppRenderer` followed by the PascalCase `appBlockName` — for a block registered as `swag-two-columns`, that is `CmsBlockAppRendererSwagTwoColumns.vue`. It receives the block as its `content` prop, and every other app block keeps the fallback:

```vue
<script setup lang="ts">
import type { CmsBlockAppRenderer } from "@shopware/composables";

const props = defineProps<{ content: CmsBlockAppRenderer }>();

const { getSlotContent } = useCmsBlock(() => props.content);

const text = computed(() => getSlotContent("text-0"));
const image = computed(() => getSlotContent("image-1"));
</script>

<template>
  <div class="grid gap-6 md:grid-cols-2">
    <CmsGenericElement :content="text" />
    <CmsGenericElement :content="image" />
  </div>
</template>
```

The slots are named `{element}-{index}` in the order the app declared them, so look them up by name rather than by position: the Store API sorts them by name, so `image-1` comes before `text-0` and `text-10` before `text-2`. The fallback restores the declared order from the index, as the Administration preview shows it. The Storefront's fallback keeps the Store API order, so a block that mixes element types can place its slots differently there.

The lookup of these components lives in `CmsBlockAppRenderer` itself. If you override `CmsBlockAppRenderer`, for example to change the fallback markup, your override replaces that lookup too, and your `CmsBlockAppRenderer{AppBlockName}` components are no longer used unless it renders them. A component whose name does not match the `appBlockName` renders the fallback without a warning, as a misnamed override of any other CMS component does.

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

- [📘 Documentation](https://developer.shopware.com/frontends)

- [👥 Community](https://discord.com/channels/1308047705309708348/1405501315160739951) (`#composable-frontend`)

<!-- AUTO GENERATED CHANGELOG -->

## Changelog

Full changelog for stable version is available [here](https://github.com/shopware/frontends/blob/main/packages/cms-base-layer/CHANGELOG.md)

### Latest changes: 4.1.0

### Minor Changes

- [#2785](https://github.com/shopware/frontends/pull/2785) [`74a477b`](https://github.com/shopware/frontends/commit/74a477bfa88e3c518d3a0336e4d301c823122ba8) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Render the CMS blocks and elements Shopware added since 6.6, which rendered nothing until now:

  - `category-heading` block and `category-name` element (6.7.12), used by the default listing layouts for the category headline.
  - `video` block and element (6.7.8) for media library videos, with every option of the Administration. New translation keys: `cms.video.playLabel`, `cms.video.pauseLabel`, `cms.video.loadError` and `cms.video.notSupported`.
  - `app-renderer` block (6.6.1) for blocks registered through the Meteor Admin SDK. A global `CmsBlockAppRenderer{AppBlockName}` component overrides a single app block, see "App blocks" in the README.

- [#2774](https://github.com/shopware/frontends/pull/2774) [`5961f55`](https://github.com/shopware/frontends/commit/5961f55b9f7cebad626cc073ae0bf857aa26f91b) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Render blocks reactively and survive a missing slot

  `CmsGenericElement` now takes `content` as an optional prop and renders nothing when it is missing, instead of handing `undefined` to `resolveCmsComponent` and throwing. A block does not have to carry every slot its layout allows, so that is no longer an error path.

  Every block component now passes its `content` to `useCmsBlock` as a getter and reads slot lookups through a `computed`, and `CmsSectionSidebar` does the same with `useCmsSection`. A block or section that receives new content re-resolves which slot goes where, instead of rendering the tree it was mounted with.

  That stops at the element boundary. Element components still call `useCmsElementConfig(props.content)` and `useCmsElementImage(props.content)`, which capture the slot object at setup, so an element reused for a different slot of the same type keeps its old config- and media-derived values — an image its old source, a text its old configured content. Only values read straight from the prop (`props.content.data`) follow. Making those composables accept a getter is a separate change.

  Both generic components also stop emitting an empty `<div>` where they used to render a placeholder: a missing slot and — in production — a block or element type with no component now render nothing. Dev mode is unchanged: it still warns and renders `CmsNoComponent`.

  `CmsGenericBlock` and `CmsGenericElement` dropped their `Problem resolving component: …` branch. It sat behind `if (resolvedComponent)` and tested `isResolved`, which was always `true` there, so it never rendered; an unresolved component still logs a dev warning and renders `CmsNoComponent`.

### Patch Changes

- [#2778](https://github.com/shopware/frontends/pull/2778) [`0d4151c`](https://github.com/shopware/frontends/commit/0d4151ce1fb231606c33e1fd88f525baff60416d) Thanks [@grenzenlos-digital](https://github.com/grenzenlos-digital)! - Use Three.js vectors for the 3D camera and light positions.

- [#2731](https://github.com/shopware/frontends/pull/2731) [`46d6daa`](https://github.com/shopware/frontends/commit/46d6daade81e3d9e443f3badfeba2ca0e2751477) Thanks [@patzick](https://github.com/patzick)! - Add an optional notification action (label + link) so add-to-cart toasts can offer a "View cart" shortcut, and keep those toasts visible a little longer.

- [#2813](https://github.com/shopware/frontends/pull/2813) [`c6abd30`](https://github.com/shopware/frontends/commit/c6abd3000a9c3ad8ec4512704aa99a66ab0e671c) Thanks [@patzick](https://github.com/patzick)! - Fix a 500 on every page with a listing filter (`Cannot read properties of undefined (reading 'query')`) in projects that install the layer outside this monorepo. `useSelectedListingFilters` imported `useRoute` straight from `vue-router`, which the layer does not depend on, so it could resolve to a different `vue-router` copy than the one Nuxt's router uses and get no route back. It now uses Nuxt's `useRoute`, and `SwCategoryNavigationLink` renders `NuxtLink` instead of importing `RouterLink` from `vue-router` for the same reason. The pure filter-state helpers moved from `app/utils/useSelectedListingFilters.ts` to `app/utils/listingFilterState.ts`; their auto-imported names are unchanged.

- [#2785](https://github.com/shopware/frontends/pull/2785) [`74a477b`](https://github.com/shopware/frontends/commit/74a477bfa88e3c518d3a0336e4d301c823122ba8) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Fix how `CmsElementText` renders CMS text. `CmsElementProductName` and `CmsElementCategoryName` render through it and get the same fixes.

  - It renders only the content the Store API resolved. When that content was empty, it fell back to the raw `config.content` value, which the backend sanitizer never saw. Static content that the sanitizer removed completely, such as a lone `<script>`, came back unsanitized, and a `{{ … }}` placeholder that resolved to nothing was shown as it was typed. Both now render nothing, as in the Storefront. An element built by hand without `data` still renders its static config.
  - It no longer shows a mapping path. The backend answers a mapping to a value that is not a string with the path itself, for example `category.customFields`. That is now treated as unresolved.
  - It follows a new `content`. It read its content and config once, when it was set up, so a component that received a new `content` kept the old text.
  - HTML attributes other than `class`, `style` and `align` now reach the page, for example `id`, `title` and `colspan`. They were passed in the Vue 2 shape, so server renders dropped them and client renders added `attrs="[object Object]"`. That also made the server and client markup differ on hydration.

- [#2677](https://github.com/shopware/frontends/pull/2677) [`62c8d4c`](https://github.com/shopware/frontends/commit/62c8d4c86130c076b8391271593372eac83380e3) Thanks [@mkucmus](https://github.com/mkucmus)! - Drive the product listing from the URL. Browser back and forward now update the products, and sorting no longer fires a duplicate request.

- [#2677](https://github.com/shopware/frontends/pull/2677) [`62c8d4c`](https://github.com/shopware/frontends/commit/62c8d4c86130c076b8391271593372eac83380e3) Thanks [@mkucmus](https://github.com/mkucmus)! - Write listing filters to the URL before fetching, so a slow or failed request no longer drops the selection. Expose the product id on the add-to-cart button.

- [#2812](https://github.com/shopware/frontends/pull/2812) [`09d8b0f`](https://github.com/shopware/frontends/commit/09d8b0fea5489e973ef4f1f49d09e72372ab9ecf) Thanks [@mkucmus](https://github.com/mkucmus)! - Show "Details" instead of "Add to cart" for variant parents, and show success only when the product is in the cart. A product with a single price tier now shows "Add to cart", like in the Twig storefront.

  New translation key: `product.notAddedToCart`. Variant parents now use `product.details`. Add both to your locale files.

- Updated dependencies [[`44ece9d`](https://github.com/shopware/frontends/commit/44ece9dac2e4d0248c2270f7eff496c258632f5b), [`46d6daa`](https://github.com/shopware/frontends/commit/46d6daade81e3d9e443f3badfeba2ca0e2751477), [`7dbca8b`](https://github.com/shopware/frontends/commit/7dbca8bf8bca1225b365bc03e4dbc07d3764c2e1), [`74a477b`](https://github.com/shopware/frontends/commit/74a477bfa88e3c518d3a0336e4d301c823122ba8), [`74a477b`](https://github.com/shopware/frontends/commit/74a477bfa88e3c518d3a0336e4d301c823122ba8), [`5961f55`](https://github.com/shopware/frontends/commit/5961f55b9f7cebad626cc073ae0bf857aa26f91b), [`c78188a`](https://github.com/shopware/frontends/commit/c78188ac6c95ae19b070f5ea3361a60f21dff281), [`0df4c17`](https://github.com/shopware/frontends/commit/0df4c17b18ec38fc4d0c33f1cb6396f8f532a65d), [`4b43e64`](https://github.com/shopware/frontends/commit/4b43e64a8d78be6eca1f8d9c24140e046193af41)]:
  - @shopware/api-client@1.7.0
  - @shopware/composables@1.14.0


<!--  -->


## Available components

### `CmsBlockSpatialViewer`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/CmsBlockSpatialViewer.vue#L1" target="_blank">source code</a>


---
### `CmsGenericBlock`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/CmsGenericBlock.vue#L1" target="_blank">source code</a>

Renders a Block type structure.

Resolves the correct CMS block component dynamically and applies layout configuration (CSS classes, background color, background image). When a block has a `backgroundMedia` set, the component automatically optimizes the background image URL using the `getBackgroundImageUrl` helper from `@shopware/helpers`, appending `format` and `quality` parameters from the `backgroundImage` app config.

### Background Image Optimization

Background image settings are read from `app.config.ts`:

```ts
export default defineAppConfig({
  backgroundImage: {
    format: "webp",
    quality: 85,
  },
});
```

### Example usage

```vue{14-19}
<script setup lang="ts">
import type { CmsSectionDefault } from "@shopware/composables";
import { getCmsLayoutConfiguration } from "@shopware/helpers";

const props = defineProps<{
  content: CmsSectionDefault;
}>();

const { cssClasses, layoutStyles } = getCmsLayoutConfiguration(props.content);
</script>

<template>
  <div class="cms-section-default" :class="cssClasses" :styles="layoutStyles">
    <CmsGenericBlock
      v-for="cmsBlock in content.blocks"
      class="overflow-auto"
      :key="cmsBlock.id"
      :content="cmsBlock"
    />
  </div>
</template>
```



---
### `CmsGenericElement`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/CmsGenericElement.vue#L1" target="_blank">source code</a>

Renders an Element type structure.

`content` is optional: `getSlotContent()` returns `undefined` for a slot the block
does not carry, and this component renders nothing in that case.

Example usage:

```vue{22,25}
<script setup lang="ts">
import type { CmsBlockGalleryBuybox } from "@shopware/composables";
import { computed } from "vue";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockGalleryBuybox;
}>();

// Pass a getter so the lookups follow a replaced block, and read them through
// computeds so each one re-runs when it does.
const { getSlotContent } = useCmsBlock(() => props.content);
const rightContent = computed(() => getSlotContent("right"));
const leftContent = computed(() => getSlotContent("left"));
</script>

<template>
  <div
    class="lg:container mx-auto flex flex-col lg:flex-row gap-10 justify-center"
  >
    <div class="overflow-hidden basis-4/6">
      <CmsGenericElement :content="leftContent" />
    </div>
    <div class="basis-2/6">
      <CmsGenericElement :content="rightContent" />
    </div>
  </div>
</template>
```



---
### `CmsNoComponent`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/CmsNoComponent.vue#L1" target="_blank">source code</a>


---
### `CmsPage`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/CmsPage.vue#L1" target="_blank">source code</a>

An entrypoint to render the whole CMS object.

Resolves all CMS sections dynamically and applies their layout configuration. When a section has a `backgroundMedia` set, the component automatically optimizes the background image URL using the `getBackgroundImageUrl` helper from `@shopware/helpers`, appending `format` and `quality` parameters from the `backgroundImage` app config.

### Background Image Optimization

Background image settings are read from `app.config.ts`:

```ts
export default defineAppConfig({
  backgroundImage: {
    format: "webp", // output format
    quality: 85, // image quality (0-100)
  },
});
```

See the [cms-base-layer README](https://github.com/shopware/frontends/tree/main/packages/cms-base-layer#%EF%B8%8F-background-image-optimization) for full details.

### Example usage

```vue{29}
<script setup lang="ts">
import { useLandingSearch } from "#imports";
import type { Schemas } from "#shopware";

const props = defineProps<{
  navigationId: string;
}>();

const { search } = useLandingSearch();

const { data: landingResponse } = await useAsyncData(
  "cmsLanding" + props.navigationId,
  async () => {
    const landingPage = await search(props.navigationId, {
      withCmsAssociations: true,
    });
    return landingPage;
  },
);

if (typeof landingResponse?.value !== null) {
  const landingPage = landingResponse as Ref<Schemas["LandingPage"]>;
  useCmsHead(landingPage, { mainShopTitle: "Shopware Frontends Demo Store" });
}
</script>

<template>
  <LayoutBreadcrumbs />
  <CmsPage v-if="landingResponse?.cmsPage" :content="landingResponse.cmsPage" />
</template>
```



---
### `FrontendAccountCustomerGroupRegistrationPage`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/FrontendAccountCustomerGroupRegistrationPage.vue#L1" target="_blank">source code</a>


---
### `CmsBlockAppRenderer`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockAppRenderer.vue#L1" target="_blank">source code</a>


---
### `CmsBlockCategoryHeading`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockCategoryHeading.vue#L1" target="_blank">source code</a>


---
### `CmsBlockCategoryNavigation`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockCategoryNavigation.vue#L1" target="_blank">source code</a>


---
### `CmsBlockCenterText`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockCenterText.vue#L1" target="_blank">source code</a>


---
### `CmsBlockCrossSelling`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockCrossSelling.vue#L1" target="_blank">source code</a>


---
### `CmsBlockCustomForm`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockCustomForm.vue#L1" target="_blank">source code</a>


---
### `CmsBlockDefault`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockDefault.vue#L1" target="_blank">source code</a>


---
### `CmsBlockForm`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockForm.vue#L1" target="_blank">source code</a>


---
### `CmsBlockGalleryBuybox`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockGalleryBuybox.vue#L1" target="_blank">source code</a>


---
### `CmsBlockHtml`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockHtml.vue#L1" target="_blank">source code</a>


---
### `CmsBlockImage`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockImage.vue#L1" target="_blank">source code</a>


---
### `CmsBlockImageBubbleRow`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockImageBubbleRow.vue#L1" target="_blank">source code</a>


---
### `CmsBlockImageCover`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockImageCover.vue#L1" target="_blank">source code</a>


---
### `CmsBlockImageFourColumn`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockImageFourColumn.vue#L1" target="_blank">source code</a>


---
### `CmsBlockImageGallery`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockImageGallery.vue#L1" target="_blank">source code</a>


---
### `CmsBlockImageGalleryBig`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockImageGalleryBig.vue#L1" target="_blank">source code</a>


---
### `CmsBlockImageHighlightRow`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockImageHighlightRow.vue#L1" target="_blank">source code</a>


---
### `CmsBlockImageSimpleGrid`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockImageSimpleGrid.vue#L1" target="_blank">source code</a>


---
### `CmsBlockImageSlider`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockImageSlider.vue#L1" target="_blank">source code</a>


---
### `CmsBlockImageText`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockImageText.vue#L1" target="_blank">source code</a>


---
### `CmsBlockImageTextBubble`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockImageTextBubble.vue#L1" target="_blank">source code</a>


---
### `CmsBlockImageTextCover`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockImageTextCover.vue#L1" target="_blank">source code</a>


---
### `CmsBlockImageTextGallery`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockImageTextGallery.vue#L1" target="_blank">source code</a>


---
### `CmsBlockImageTextRow`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockImageTextRow.vue#L1" target="_blank">source code</a>


---
### `CmsBlockImageThreeColumn`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockImageThreeColumn.vue#L1" target="_blank">source code</a>


---
### `CmsBlockImageThreeCover`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockImageThreeCover.vue#L1" target="_blank">source code</a>


---
### `CmsBlockImageTwoColumn`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockImageTwoColumn.vue#L1" target="_blank">source code</a>


---
### `CmsBlockProductDescriptionReviews`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockProductDescriptionReviews.vue#L1" target="_blank">source code</a>


---
### `CmsBlockProductHeading`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockProductHeading.vue#L1" target="_blank">source code</a>


---
### `CmsBlockProductListing`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockProductListing.vue#L1" target="_blank">source code</a>


---
### `CmsBlockProductSlider`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockProductSlider.vue#L1" target="_blank">source code</a>


---
### `CmsBlockProductThreeColumn`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockProductThreeColumn.vue#L1" target="_blank">source code</a>


---
### `CmsBlockSidebarFilter`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockSidebarFilter.vue#L1" target="_blank">source code</a>


---
### `CmsBlockText`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockText.vue#L1" target="_blank">source code</a>


---
### `CmsBlockTextHero`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockTextHero.vue#L1" target="_blank">source code</a>


---
### `CmsBlockTextOnImage`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockTextOnImage.vue#L1" target="_blank">source code</a>


---
### `CmsBlockTextTeaser`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockTextTeaser.vue#L1" target="_blank">source code</a>


---
### `CmsBlockTextTeaserSection`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockTextTeaserSection.vue#L1" target="_blank">source code</a>


---
### `CmsBlockTextThreeColumn`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockTextThreeColumn.vue#L1" target="_blank">source code</a>


---
### `CmsBlockTextTwoColumn`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockTextTwoColumn.vue#L1" target="_blank">source code</a>


---
### `CmsBlockVideo`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockVideo.vue#L1" target="_blank">source code</a>


---
### `CmsBlockVimeoVideo`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockVimeoVideo.vue#L1" target="_blank">source code</a>


---
### `CmsBlockYoutubeVideo`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/block/CmsBlockYoutubeVideo.vue#L1" target="_blank">source code</a>


---
### `CmsElementBuyBox`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/element/CmsElementBuyBox.vue#L1" target="_blank">source code</a>

Render a product including prices, basic information and add to cart button



---
### `CmsElementCategoryName`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/element/CmsElementCategoryName.vue#L1" target="_blank">source code</a>

Display the category name as the page headline, in the `category-heading` block. Since Shopware 6.7.12 the default listing layouts use it in place of a text element.

The element is a text element with its own type:

- **Mapped content** (by default `category.name`) is wrapped in `<h1 class="cms-element-category-name-headline">`, as in the Storefront. When the value does not resolve, for example on a page without a category, no empty headline is rendered.
- **Static content** is authored HTML and is rendered as it is.

Rendering goes through `CmsElementText`, so the vertical alignment, link handling and the [`cms-element-text` typography](#cmselementtext) apply. The root carries the `cms-element-category-name` class as well.



---
### `CmsElementCategoryNavigation`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/element/CmsElementCategoryNavigation.vue#L1" target="_blank">source code</a>

Load a navigation menu for current category



---
### `CmsElementCrossSelling`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/element/CmsElementCrossSelling.vue#L1" target="_blank">source code</a>

Render slider of the products from cross-selling setting of a product



---
### `CmsElementCustomForm`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/element/CmsElementCustomForm.vue#L1" target="_blank">source code</a>

Display a contact or newsletter sign up form



---
### `CmsElementForm`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/element/CmsElementForm.vue#L1" target="_blank">source code</a>

Display a contact or newsletter sign up form



---
### `CmsElementHtml`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/element/CmsElementHtml.vue#L1" target="_blank">source code</a>


---
### `CmsElementImage`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/element/CmsElementImage.vue#L1" target="_blank">source code</a>

Display an image for provided media content. Including extra attributes like `srcset` and `alt`



---
### `CmsElementImageGallery`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/element/CmsElementImageGallery.vue#L1" target="_blank">source code</a>

Display a gallery for provided media. Handles a plain image and the spatial (3d) images.



---
### `CmsElementImageGallery3dPlaceholder`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/element/CmsElementImageGallery3dPlaceholder.vue#L1" target="_blank">source code</a>


---
### `CmsElementImageSlider`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/element/CmsElementImageSlider.vue#L1" target="_blank">source code</a>

Display a slider of images



---
### `CmsElementManufacturerLogo`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/element/CmsElementManufacturerLogo.vue#L1" target="_blank">source code</a>

Display a logo of manufacturer of a product



---
### `CmsElementProductBox`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/element/CmsElementProductBox.vue#L1" target="_blank">source code</a>

Display a box for provided product



---
### `CmsElementProductDescriptionReviews`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/element/CmsElementProductDescriptionReviews.vue#L1" target="_blank">source code</a>

Display a description and reviews for provided product



---
### `CmsElementProductListing`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/element/CmsElementProductListing.vue#L1" target="_blank">source code</a>

Display the list of products for currently active listing page



---
### `CmsElementProductName`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/element/CmsElementProductName.vue#L1" target="_blank">source code</a>

Display a name for a product



---
### `CmsElementProductSlider`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/element/CmsElementProductSlider.vue#L1" target="_blank">source code</a>

Display a slider of provided products



---
### `CmsElementSidebarFilter`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/element/CmsElementSidebarFilter.vue#L1" target="_blank">source code</a>

Display a sidebar containing filters for an active product listing



---
### `CmsElementText`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/element/CmsElementText.vue#L1" target="_blank">source code</a>

Display a text. Html to Vue mechanism is used to render buttons, links, images accordingly as Vue elements

#### Styling CMS-authored HTML

The rendered container always carries the `cms-element-text` class. Because the
content comes from the Shopware admin editor, its tags (`h1`–`h6`, `ul`, `table`,
`img`, …) arrive without any classes, so they can only be reached with element
selectors — and those must never be declared globally, or they would also hit
product names, buttons and other markup you do control.

This layer ships that typography for you in
[`app/assets/css/rich-text.css`](../../../../assets/css/rich-text.css),
registered through `css: []` in the layer's `nuxt.config.ts`. It is plain CSS, so
it also works for apps that don't use UnoCSS. Nothing to wire up in your app.

##### Retheming

Every value reads from a `--rte-*` custom property with a built-in fallback, so
you only set the properties you want to change — no need to redeclare the rules:

```css
:root {
  --rte-h1-size: 3rem;
  --rte-h1-line: 3.25rem;
  --rte-border-color: var(--color-outline-variant);
}
```

| Property                          | Default                         |
| --------------------------------- | ------------------------------- |
| `--rte-h1-size` / `--rte-h1-line` | `2.25rem` / `2.5rem`            |
| `--rte-h2-size` / `--rte-h2-line` | `1.75rem` / `2rem`              |
| `--rte-h3-size` / `--rte-h3-line` | `1.25rem` / `1.5rem`            |
| `--rte-h4-size` / `--rte-h4-line` | `1.125rem` / `1.5rem` (h4–h6)   |
| `--rte-heading-weight`            | `600`                           |
| `--rte-heading-mb`                | `10px`                          |
| `--rte-flow`                      | `1rem` (spacing between blocks) |
| `--rte-list-indent`               | `40px`                          |
| `--rte-cell-padding`              | `0.5rem 0.75rem`                |
| `--rte-border-color`              | `#e5e7eb` (tables, `hr`)        |

Because the properties are inherited, you can also scope them contextually
instead of overriding selectors:

```css
.cms-block-image-text-cover .cms-element-text {
  --rte-h1-size: 3.5rem;
}
```

##### Scope

The class is set everywhere admin-authored HTML is injected, so one rule set
covers all of them:

| Component                                      | Classes                               |
| ---------------------------------------------- | ------------------------------------- |
| `CmsElementText`                               | `cms-element-text`                    |
| `CmsElementHtml`                               | `cms-element-html cms-element-text`   |
| `CmsElementProductDescriptionReviews`          | `cms-element-text` (description body) |
| `FrontendAccountCustomerGroupRegistrationPage` | `cms-element-text` (intro text)       |

Add `cms-element-text` to your own wrappers if you render admin HTML elsewhere,
for example custom fields using the HTML editor.

##### Notes

The stylesheet uses `:where()` throughout, which keeps the specificity at
`(0,1,0)`. Two consequences worth knowing:

- A utility class or an inline style set by the editor still wins, without
  `!important`.
- The rules beat a framework reset (`ul { list-style: none }`) no matter which
  stylesheet is injected first, so the CSS order does not matter.

A `<style scoped>` block inside this component would _not_ work: the markup is
created by a render function, and Vue only applies the scope id to the container
root, not to its descendants.



---
### `CmsElementVideo`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/element/CmsElementVideo.vue#L1" target="_blank">source code</a>

Play a video uploaded to the Shopware media library, in the `video` block. YouTube and Vimeo videos have their own elements.

Every option of the element in the Administration is supported:

| Option                       | Behaviour                                                                                                                                                                                          |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Video                        | Static or mapped media. Nothing is rendered when it does not resolve.                                                                                                                              |
| Display mode                 | `standard` keeps the video's size, `stretch` makes it full width, `cover` fills the element and crops the video.                                                                                   |
| Minimum height               | Applies to `cover` only.                                                                                                                                                                           |
| Vertical / horizontal align  | Positions a `standard` or `stretch` video. Ignored for `cover`.                                                                                                                                    |
| Play automatically           | Also mutes the video, because browsers only autoplay muted videos.                                                                                                                                 |
| Play muted, Play in a loop   | Set `muted` and `loop`.                                                                                                                                                                            |
| Play inline on iOS devices   | Sets `playsinline`.                                                                                                                                                                                |
| Show controls                | Shows the native controls. Without them the whole element is a play/pause button with a play icon, operable by keyboard too.                                                                       |
| Load only after confirmation | Shows the cover image set for the video in the media module and loads nothing until playback starts. Turns autoplay off. Without a cover image, a `stretch` video keeps a 16:9 box until it loads. |
| Screen reader title          | Names the video, falling back to the media alt text (and title for the tooltip).                                                                                                                   |

Without controls, the button's name always says what it does: play or pause. The video's name is announced as its description. A video that cannot be loaded, for example in a format the browser does not play or with a missing file, shows an error in place of the play icon and names the button after the error.

The texts can be translated through `cmsTranslations`:

| Key                      | Default                                              |
| ------------------------ | ---------------------------------------------------- |
| `cms.video.playLabel`    | `Play video`                                         |
| `cms.video.pauseLabel`   | `Pause video`                                        |
| `cms.video.loadError`    | `The video could not be loaded.`                     |
| `cms.video.notSupported` | `Your browser does not support the HTML5 video tag.` |



---
### `CmsElementVimeoVideo`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/element/CmsElementVimeoVideo.vue#L1" target="_blank">source code</a>

Display a player for Vimeo media



---
### `CmsElementYoutubeVideo`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/element/CmsElementYoutubeVideo.vue#L1" target="_blank">source code</a>

Display a player for YouTube video



---
### `SwProductListingPagination`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/element/SwProductListingPagination.vue#L1" target="_blank">source code</a>


---
### `CmsSectionDefault`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/section/CmsSectionDefault.vue#L1" target="_blank">source code</a>

**Renders a generic block type**

See the [`<CmsPage/>`](#cmspage) source code to see how it's used



---
### `CmsSectionSidebar`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/section/CmsSectionSidebar.vue#L1" target="_blank">source code</a>

**Renders a generic block type**

See the [`<CmsPage/>`](#cmspage) source code to see how it's used



---
### `ProductCardSkeleton`
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/cms-base-layer/app/components/public/cms/skeleton/ProductCardSkeleton.vue#L1" target="_blank">source code</a>


---



<div data-placeholder="dynamic-markdown"></div>
