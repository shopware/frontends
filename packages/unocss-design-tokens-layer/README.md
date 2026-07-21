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

### Latest changes: 1.0.1

### Patch Changes

- [#2543](https://github.com/shopware/frontends/pull/2543) [`7cdb81f`](https://github.com/shopware/frontends/commit/7cdb81f40dc5194432560752718048c730857ddf) Thanks [@patzick](https://github.com/patzick)! - Export the shared UnoCSS config and lazy-load the optional runtime so layered templates can merge the package config directly while keeping runtime generation disabled unless requested.
