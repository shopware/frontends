# @shopware/unocss-design-tokens-layer

Nuxt layer that provides the shared Shopware Frontends UnoCSS setup, design tokens, reset stylesheet, and runtime support for resolving dynamic utility classes.

It is intended to be composed with layers such as `@shopware/cms-base-layer`, while allowing projects to keep design tokens separate from CMS functionality.

## Usage

```ts
export default defineNuxtConfig({
  extends: [
    "@shopware/composables/nuxt-layer",
    "@shopware/cms-base-layer",
    "@shopware/unocss-design-tokens-layer",
  ],
  modules: ["@shopware/nuxt-module", "@unocss/nuxt"],
  css: ["@unocss/reset/tailwind-compat.css"],
  unocss: {
    nuxtLayers: true,
  },
});
```

## Customization

Extend the generated base Uno config in your project:

```ts
import { mergeConfigs } from "@unocss/core";
import baseConfig from "./.nuxt/uno.config.mjs";

export default mergeConfigs([
  baseConfig,
  {
    theme: {
      colors: {
        "brand-primary": "#123456",
      },
    },
  },
]);
```

<!-- AUTO GENERATED CHANGELOG -->

## Changelog

Full changelog for stable version is available [here](https://github.com/shopware/frontends/blob/main/packages/unocss-design-tokens-layer/CHANGELOG.md)

### Latest changes: 1.0.3

### Patch Changes

- [#2835](https://github.com/shopware/frontends/pull/2835) [`22c1b4f`](https://github.com/shopware/frontends/commit/22c1b4fb2a34e351ff4e84e7f198cfc306f9fb5f) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Support Nuxt 4.6. `@shopware/nuxt-module` and `@shopware/cms-base-layer` now depend on `@nuxt/kit` 4.6.1, and the Nuxt plugin types `ssrContext.event` from `NuxtSSRContext`, so it type-checks on both Nuxt 4.5 and 4.6. The Nuxt templates require Node `^22.22.3 || ^24.15.0 || >=26.0.0`, the range Nuxt 4.6 supports. `@shopware/unocss-design-tokens-layer` no longer re-exports its generated `.nuxt/imports` from `index.d.ts`, which pulled server routes into the shared type context of apps extending the layer.
