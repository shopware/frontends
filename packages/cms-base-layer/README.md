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
- `productCard` - Product listing images (WebP, quality 85, cover fit)
- `productDetail` - Product detail page images (WebP, quality 90, contain fit)
- `thumbnail` - Small thumbnails (150x150, WebP, quality 75)
- `hero` - Hero banners (WebP, quality 90, cover fit)

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

### Latest changes: 1.5.1

### Patch Changes

- [#1879](https://github.com/shopware/frontends/pull/1879) [`eaf170b`](https://github.com/shopware/frontends/commit/eaf170bd037a278b3d2e155c4d69de8e5fd9516d) Thanks [@acuriouspotion](https://github.com/acuriouspotion)! - Fix youtube player control display and usage of advanced privacy mode setting.

- [#1862](https://github.com/shopware/frontends/pull/1862) [`20fd2c6`](https://github.com/shopware/frontends/commit/20fd2c615738f93a3947c69f351fc5d37ea89ebf) Thanks [@aheartforspinach](https://github.com/aheartforspinach)! - Fix CmsSectionSidebar.vue when used on a landing page by removing useCategory and related code

- [#1884](https://github.com/shopware/frontends/pull/1884) [`3004b97`](https://github.com/shopware/frontends/commit/3004b973913b90cdf4b255ffb3f9cee265241666) Thanks [@MorennMcFly](https://github.com/MorennMcFly)! - Fix cms blocks TextTeaserSection and TextTwoColumn responsivity so the elements stack from md breakpoint and under.

- [#1863](https://github.com/shopware/frontends/pull/1863) [`f8c5cd5`](https://github.com/shopware/frontends/commit/f8c5cd5c9aa8b65d394c831e3ac548b4743c53a6) Thanks [@aheartforspinach](https://github.com/aheartforspinach)! - move `CmsBlockHtml.vue` to block folder (instead of element), remove `CmsBlockHtml.md`

- Updated dependencies [[`ab040bb`](https://github.com/shopware/frontends/commit/ab040bb6cc05541001a983c26d5cb6dbf3192394), [`c8fa438`](https://github.com/shopware/frontends/commit/c8fa438b38de6dbc43a2895f2d1906907447c384)]:
  - @shopware/composables@1.9.1
  - @shopware/helpers@1.5.0
